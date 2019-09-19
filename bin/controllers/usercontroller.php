<?PHP 
	
	require ("models/useraccountmodel.php");

	require ("dtos/useraccountdto.php");
	require ("dtos/createdto.php");
	require ("dtos/recoverdto.php");

	require ("services/emailservice.php");

	class UserController {
		private $dbContext = NULL;
		private $route = NULL;
		private $view = NULL;
		private $viewModel = NULL;

		function __construct($route) {

			$this->dbContext = (new DBContext())->getContext();
			
			// todo : this should be moved to routing
			$this->route = $route;
			switch($this->route->getAction()) {
				case "play": {
					$this->view = $this->play($this->route->username, $this->route->hashword1, $this->route->clientIP);
					break;
				}
				case "create": {
					$this->view = $this->create($this->route->username, $this->route->hashword1, $this->route->hashword2, $this->route->email, $this->route->secret);
					break;
				}
				case "recover": {
					$this->view = $this->recover($this->route->email);
					break;
				}
				case "reset": {
					$this->view = $this->reset($this->route->recovery_email, $this->route->token);
					break;
				}
				case "change": {
					$this->view = $this->change($this->route->recovery_token, $this->route->email, $this->route->hashword1, $this->route->hashword2);
					break;
				}
				default: {
					$this->view = $this->index();
					break;
				}
			}

		}
		function __destruct() {
			$this->dbContext = NULL;
		}
		public function getViewModel() {
			return $this->viewModel;
		}
		public function getView() {
			return include ($this->view);
		}
		public function index() {
			return "views/creation.html";
		}
		public function play($username, $hashword, $ip) {

			$ip = $_SERVER['REMOTE_ADDR'];
			$ps = $this->dbContext->prepare('CALL WSProc_GenerateTokenOnAuth(?, ?, ?)');

			$ps->bindParam(1, $username);
			$ps->bindParam(2, $hashword);
			$ps->bindParam(3, $ip);
			$ps->execute();

			$resultSet = $ps->fetch();
			if ($ps->rowCount() > 0) {
				$this->viewModel = new UserAccountDto($resultSet);
				if ($this->viewModel->useraccount->sessionToken !== NULL) {
					// redirect away from play.php when the client authenticates
					setcookie("session", $this->viewModel->useraccount->sessionToken, time()+10, "client/index.html");
					header("Location: client/index.html");
				}
			}
			return "views/play.php"; // fallback if authentication fails
		}
		public function create($username, $hashword1, $hashword2, $email, $secret) {
			$MAGIC_KEY = "thing"; // make sure a user reads things before signing up

			$this->viewModel = new CreateDto();
			if (strlen($username) > 4) {
				if (strcmp($secret, $MAGIC_KEY) == 0) {
					if (strcmp($hashword1, $hashword2) == 0) {
						if ($email!=NULL && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
							$this->viewModel->setError("Invalid email address");
						}
						else {
							$query = 'CALL WSProc_InsertUserAccount(?, ?, ?);';
							if ($email == NULL) {
								$query = 'CALL WSProc_InsertUserAccount(?, ?, NULL);';
							}
							$ps = $this->dbContext->prepare($query);
							$ps->bindParam(1, $username);
							$ps->bindParam(2, $hashword1);

							if ($email != NULL) {
								$ps->bindParam(3, $email);
							}

							if ($ps->execute()) {
								$this->viewModel->setUserAccount(new UserAccountModel(NULL));
								$this->viewModel->useraccount->username = $username;
								$this->viewModel->useraccount->email = $email;
							}
							else {
								//print_r($ps->errorInfo());
								$this->viewModel->setError("That username or email address is already in use");
							}
						}
					}
					else {
						$this->viewModel->setError("Password and confirmed password do not match");
					}
				}
				else {
					$this->viewModel->setError("Answer was inccorect");
				}
			}
			else {
				$this->viewModel->setError("Your username should be between 4 and 18 characters long");
			}
			return "views/create.php";
		}

		public function recover($email) {
			// generate and insert new useraccountrecovery token

			$this->viewModel = new RecoverDto();
			if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
				$this->viewModel->setError("Invalid email address");
			}
			else {
				$ps = $this->dbContext->prepare("CALL WSProc_GenerateRecoveryToken(?);");
				$ps->bindParam(1, $email);

				if ($ps->execute()){
					$resultSet = $ps->fetch();
					$this->viewModel->setEmail($email);
					$token = $resultSet["recoveryToken"];

					$service = new EmailService($email);
					$service->sendRecoveryEmail($token);
	
				}
				else {
					$this->viewModel->setError("This email does not exist");
				}
			}
			return "views/recover.php";
		}



		public function reset($email, $token) {
			echo "$email <br/> $token <br/>";
			if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $token==NULL) {
				// todo: 
			} 
			else {

				$this->viewModel = new RecoverDto();
				$this->viewModel->setEmail($email);
				$this->viewModel->setToken($token);

			}

			return "views/reset.php";
		}
		public function change($token, $email, $hashword1, $hashword2) {
			
			$this->viewModel = new RecoverDto();
			if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strcmp($hashword1, $hashword2) != 0) {
				// todo: 
				$this->viewModel->setError("Your email is invalid or your passwords did not match");
			}
			else {
				//$this->viewModel = new 
				//$this->viewModel->setError("$token <br/> $email <br/> $hashword1 <br/> $hashword2 <br/>");
				//(IN mytoken BLOB, IN myemail VARCHAR(128), IN myhash BLOB)
				$query = "CALL WSProc_ConsumeRecoveryToken(?, ?, ?);";
				$ps = $this->dbContext->prepare($query);
				$ps->bindParam(1, $token);
				$ps->bindParam(2, $email);
				$ps->bindParam(3, $hashword1);


				if ($ps->execute()){
					$resultSet = $ps->fetch();	
				}
			}
			return "views/change.php";
		}
	}
?>