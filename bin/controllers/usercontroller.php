<?PHP 
	

	class UserController {
		private $dbContext = NULL;
		private $route = NULL;
		private $view = NULL;
		private $viewModel = NULL;

		function __construct($route) {
			$this->dbContext = (new DBContext())->getContext();
			$this->route = $route;
			setcookie('value', $this->route->getAction());
			switch($this->route->getAction()) {
				case "login": {
					$this->view = $this->play($this->route->username, $this->route->hashword1, $this->route->clientIP);
					break;
				}
				case "create": {
					$this->view = $this->create($this->route->username, $this->route->hashword1, $this->route->hashword2, $this->route->email, $this->route->secret);
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
			return "views/index.php";
		}
		public function play($username, $hashword, $ip) {
			echo "username: " . $username . "<br/>";
			echo "hashword: " . $hashword . "<br/>";
			echo "ip: " . $ip . "<br/>";

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
					setcookie("session", $this->viewModel->useraccount->sessionToken, time()+10, "client/index.html");
					header("Location: client/index.html");
				}
			}
			return "views/play.php"; // fallback
		}
		public function create($username, $hashword1, $hashword2, $email, $secret) {

			$this->viewModel = new CreateDto();
			if (strlen($username) > 4) {
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
			return "views/create.php";
		}
	}
?>