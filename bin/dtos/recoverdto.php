<?PHP 
	class RecoverDto {
		public $error = NULL;
		private $errorList = NULL;

		private $email = NULL;
		private $token = NULL;
		function __construct() {
			$this->errorList = array();
			$this->error = FALSE;

		}
		public function setError($msg) {
			$this->errorList[] = $msg;
			$this->error = TRUE;
		}
		public function getError() {
			return implode("<br/>", $this->errorList);
		}

		public function setEmail($email) {
			$this->email = $email;
		}
		public function getEmail() {
			return $this->email;
		}

		public function setToken($token) {
			$this->token = $token;
		}
		public function getToken() {
			return $this->token;
		}
	}
?>