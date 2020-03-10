<?PHP 
	
	require ("models/useraccountmodel.php");

	require ("dtos/useraccountdto.php");
	require ("dtos/createdto.php");
	require ("dtos/recoverdto.php");
	require ("dtos/errordto.php");

	require ("services/emailservice.php");
	require ("services/captchaservice.php");

	class UserController {
		private $dbContext = NULL;
		private $route = NULL;
		private $view = NULL;
		private $viewModel = NULL;

		function __construct($route) {

			$this->dbContext = (new DBContext())->getContext();

			$username = "";
			if (isset($_POST["username"])) {
				$username = $_POST["username"];
			}

			$hashword1 = "";
			if (isset($_POST["hashword1"])) {
				$hashword1 = $_POST["hashword1"];
			}

			$hashword2 = "";
			if (isset($_POST["hashword2"])) {
				$hashword2 = $_POST["hashword2"];
			}

			$ip = "";
			if (isset($_POST["ip"])) {
				$ip = $_POST["ip"];
			}
			
			$secret = "";
			if (isset($_POST["secret"])) {
				$secret = $_POST["secret"];
			}

			$email = "";
			if (isset($_POST["email"])) {
				$email = $_POST["email"];
			}
			
			$recovery_token = "";
			if (isset($_POST["recovery_token"])) {
				$recovery_token = $_POST["recovery_token"];
			}

			$captcha = "";
			if (isset($_POST["captcha"])) {
				$captcha = $_POST["captcha"];
			}
			
			// todo : this should be moved to routing
			$this->route = $route;
			switch($route->getAction()) {
				case "play": {

					$this->view = $this->play($username, $hashword1, $ip, $captcha);
					break;
				}
				case "create": {
					$this->view = $this->create($username, $hashword1, $hashword2, $email, $secret, $captcha);
					break;
				}
				case "recover": {
					$this->view = $this->recover($email, $captcha);
					break;
				}
				case "reset": {

					$this->view = $this->reset($_GET["recovery_email"], $_GET["token"]);
					break;
				}
				case "change": {
					$this->view = $this->change($recovery_token, $email, $hashword1, $hashword2);
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
		public function play($username, $hashword, $ip, $captcha) {

			$ip = $_SERVER['REMOTE_ADDR'];
			$ps = $this->dbContext->prepare('CALL WSProc_GenerateSessionToken(?, ?, ?)');

			/*$catchaCmp = ""
			if(isset($_SESSION["generated_captcha"]) {
				$catchaCmp = $_SESSION["generated_captcha"]
			}
			$captchaCmp = explode("|", $captchaCmp);
			$captchaCmp = implode("", $captchaCmp);
			(new Captcha())->consume();*/
			if ((new Captcha())->consume($captcha) == 0) {
				$ps->bindParam(1, $username);
				$ps->bindParam(2, $hashword);
				$ps->bindParam(3, $ip);
				$ps->execute();

				$resultSet = $ps->fetch();
				if ($ps->rowCount() > 0) {
					$this->viewModel = new UserAccountDto($resultSet);
					if ($this->viewModel->useraccount->sessionToken !== NULL) {
						// redirect away from play.php when the client authenticates
						#setcookie("session", $this->viewModel->useraccount->sessionToken, time()+10, "client/index.html");
						//setcookie("session", $this->viewModel->useraccount->sessionToken, time()+10, "client/index.html");
						//header("Location: client/index.html");
						setcookie("session", $this->viewModel->useraccount->sessionToken, time()+10, Config::$gameClientUrl);
						header("Location: " . Config::$gameClientUrl);
					}
				}
				else {
					$this->viewModel = new ErrorDto();
					$this->viewModel->setError("You failed to authenticate");
				}
			}
			else {
				$this->viewModel = new ErrorDto();
				$this->viewModel->setError("Captcha was incorrect");
			}

			return "views/play.php"; // fallback if authentication fails
		}
		public function create($username, $hashword1, $hashword2, $email, $secret, $captcha) {
			$MAGIC_KEY = "thing"; // make sure a user reads things before signing up

			$this->viewModel = new CreateDto();
			if (preg_match('/^[a-zA-Z0-9_]+$/', $username) == 1) {
				if (strlen($username) > 4) {
					if (strcmp($secret, $MAGIC_KEY) == 0) {
						if ((new Captcha())->consume($captcha) == 0) {
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
							$this->viewModel->setError("Captcha was incorrect");
						}
					}
					else {
						$this->viewModel->setError("Answer was incorrect");
					}
				}
				else {
					$this->viewModel->setError("Your username should be between 4 and 18 characters long");
				}
			}
			else {
				$this->viewModel->setError("Invalid username. Your username may only contain alphanumericals and underscores");
			}
			return "views/create.php";
		}

		public function recover($email, $captcha) {
			// generate and insert new useraccountrecovery token

			$this->viewModel = new RecoverDto();
			if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
				$this->viewModel->setError("Invalid email address");
			}
			else if ((new Captcha())->consume($captcha) != 0) {
				$this->viewModel->setError("Captcha was incorrect");
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