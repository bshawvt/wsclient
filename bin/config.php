<?PHP

	class Config {
		
		public static $address = "localhost";//"govehill.dynu.net";
		public static $port = "4443";
		public static $gameClientUrl = "client/index.html";

		public static $gameClientUrl2 = "http://localhost:8080/bin/client/index.html";

		function __construct() {
			$this->address = "localhost";
		}
		function __destruct() {
			
		}

	}

?>