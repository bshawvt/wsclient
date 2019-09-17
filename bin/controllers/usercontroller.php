<?PHP 
	

	class UserController {
		private $dbContext = NULL;
		private $route = NULL;
		private $view = NULL;
		private $viewModel = NULL;

		function __construct($route) {
			$this->dbContext = (new DBContext())->getContext();
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
					$this->view = $this->recover($this->route->email, $this->route->token);
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
						if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
							$this->viewModel->setError("Invalid email address");
						}
						else {
							$ps = $this->dbContext->prepare('CALL WSProc_InsertUserAccount(?, ?, ?);');
							$ps->bindParam(1, $username);
							$ps->bindParam(2, $hashword1);
							$ps->bindParam(3, $email);
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

		public function recover($email, $token) {
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
					$this->viewModel->setRecoveryToken($resultSet["recoveryToken"]);

					$to = $email;
					$subject = "Test";

					$token = $this->viewModel->getRecoveryToken();
					$url = "https://anotherprophecy.com/bin/index.php?controller=user&action=reset&email=$email&token=$token";

					$msg = array();
					$msg[] = "<h2>A password reset has been requested.</h2>";
					$msg[] = "To continue, <a>click here</a>(<a>$url</a>). <br/>";
					$msg[] = "If you did not request this email please ignore it. This password reset will become invalid after 2 hours.";

					$headers = array();
					$headers[] = "From: no-reply@anotherprophecy.com\r\n";
					$headers[] = "Reply-To: no-reply@anotherprophecy.com\r\n";
					$headers[] = "MIME-Version: 1.0\r\n";
					$headers[] = "Content-Type: text/html; charset=UTF-8\r\n";

					/*if (mail($to, $subject, $message) == FALSE) {
						$this->viewModel->setError("Email could not be sent");
					}*/
					// fake mail function because i dont have a relay server on my computer
					$this->viewModel->setTempData(implode("", $msg));
				}
				else {
					$this->viewModel->setError("This email does not exist");
				}
			}
			return "views/recover.php";
			/*if (strlen($username) > 4) {
				if (strcmp($secret, "thing") == 0) {
					if (strcmp($hashword1, $hashword2) == 0) {
						if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
							$this->viewModel->setError("bad email address<br/>");
						}
						else {
							$ps = $this->dbContext->prepare('CALL WSProc_InsertUserAccount(?, ?, ?);');
							$ps->bindParam(1, $username);
							$ps->bindParam(2, $hashword1);
							$ps->bindParam(3, $email);
							if ($ps->execute()) {
								$this->viewModel->setUserAccount(new UserAccountModel(NULL));
								$this->viewModel->useraccount->username = $username;
								$this->viewModel->useraccount->email = $email;
							}
							else {
								//print_r($ps->errorInfo());
								$this->viewModel->setError("That username or email address is already in use<br/>");
							}
						}
					}
					else {
						$this->viewModel->setError("passwords do not match<br/>");
					}
				}
				else {
					$this->viewModel->setError("secret is incorrect<br/>");
				}
			}
			else {
				$this->viewModel->setError("username is not long enough<br/>");
			}
			return "views/create.php";*/
		}

		public function changePassword($userId, $hashword) {

		}
	}
?>