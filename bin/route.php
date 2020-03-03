<?PHP 

	require ("config.php");
	require ("dbcontext.php");

	require ("controllers/controller.php");
	require ("controllers/usercontroller.php");

	class Route {
		/* todo: 
		instead of query strings https://anotherprophecy.com/?controller=mycontroller&action=myaction&randomarg1=more&randomarg2=things
		routing needs to become https://anotherprophecy.com/mycontroller/myaction/more/things

		so relying on this hardcoded method is probably a big no no
		*/
		/*private $action = NULL;
		private $controller = NULL;

		public $clientIP = NULL;
		public $username = NULL;*/


		function __construct() {

			if (session_status() !== PHP_SESSION_ACTIVE ) {
				session_start();
			}
			
			/*$uri = preg_split("/[?#&\/]/", $_SERVER['REQUEST_URI']);

			$uri_tokens = array();
			$uri_length = count($uri);

			if ($uri_length >= 3) {
				$uri_tokens = [	"controller" => $uri[1], 
								"action" => $uri[2]];
			}
			else {
				$uri_tokens["controller"] = "default";
				$uri_tokens["action"] = "none";
			}

			for($i1 = 3; $i1 < $uri_length; $i1++) {
				$uri_tokens["query".($i1-2)] = $uri[$i1];
			}
			$this->tokens = $uri_tokens;*/
			//print_r($_POST);

			$this->tokens["controller"] = "default";
			$this->tokens["action"] = "index";

			if (isset($_GET['controller'])) {
				$this->tokens["controller"] = strtolower($_GET['controller']);
			}

			if (isset($_GET['action'])) {
				$this->tokens["action"] = strtolower($_GET['action']);
			}

			//print_r($uri);
		}
		function __destruct() {
			//$this->dbContext = NULL;
		}
		public function getAction() {
			return $this->tokens["action"];
		}
		public function getController() {
			switch ($this->tokens["controller"]) {
				case "user": {
					return new UserController($this);
				}
				default: {
					return new Controller($this);
				}
			}
		}

	}


	/*
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
	*/
?>