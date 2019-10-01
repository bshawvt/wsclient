<?PHP 
	
	require ("config.php");
	require ("dbcontext.php");

	require ("controllers/controller.php");
	require ("controllers/usercontroller.php");

	class Route {

		private $action = NULL;
		private $controller = NULL;

		public $username = NULL;
		public $hashword1 = NULL;
		public $hashword2 = NULL;
		public $email = NULL;
		public $secret = NULL;
		public $clientIP = NULL;
		public $token = NULL;
		public $recovery_email = NULL;
		public $recovery_token = NULL;


		function __construct() {
			// get
			if (isset($_GET['action'])) {
				$this->action = strtolower($_GET['action']);
			}
			if (isset($_GET['controller'])) {
				$this->controller = strtolower($_GET['controller']);
			}
			if (isset($_GET['token'])) {
				$this->token = strtolower($_GET['token']);
			}
			if (isset($_GET['recovery_email'])) {
				$this->recovery_email = strtolower($_GET['recovery_email']);
			}

			// post
			if (isset($_POST['username'])) {
				$this->username = strtolower($_POST['username']);
			}
			if (isset($_POST['hashword1'])) {
				$this->hashword1 = $_POST['hashword1'];
			}
			if (isset($_POST['hashword2'])) {
				$this->hashword2 = $_POST['hashword2'];
			}
			if (isset($_POST['email'])) {
				$this->email = $_POST['email'];
			}
			if (isset($_POST['recovery_token'])) {
				$this->recovery_token = $_POST['recovery_token'];
			}
			if (isset($_POST['secret'])) {
				$this->secret = strtolower($_POST['secret']);
			}
			if (isset($_SERVER['REMOTE_ADDR'])) {
				$this->clientIP = $_SERVER['REMOTE_ADDR'];
			}
		}
		function __destruct() {
			//$this->dbContext = NULL;
		}
		public function getAction() {
			return $this->action;
		}
		public function getController() {
			switch ($this->controller) {
				case "user": {
					return new UserController($this);
				}
				default: {
					return new Controller();
				}
			}
		}

	}
?>