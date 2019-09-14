<?PHP 

	class DBContext {

		public static $port = 3306;
		public static $address = "localhost";
		public static $schema = "wss_debug";
		public static $username = "wss_website";
		public static $password = "A password.";

		private $dbContext = NULL;

		function __construct() {
			try {

				$this->dbContext = new PDO("mysql:host=".DBContext::$address.";port=".DBContext::$port.";dbname=".DBContext::$schema, DBContext::$username, DBContext::$password);
			}
			catch (PDOException $err) {
				//echo "PDOError" . $err;
			}
		}

		function __destruct() {
			$this->dbContext = NULL;
		}

		public function getContext() {
			return $this->dbContext;
		}

	}
?>