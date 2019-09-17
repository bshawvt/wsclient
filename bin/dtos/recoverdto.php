<?PHP 
	class RecoverDto {
		public $error = NULL;
		private $errorList = NULL;
		private $tmpData = NULL;
		private $recoveryToken = NULL;

		private $email = NULL;
		function __construct() {
			$this->errorList = array();
			$this->error = FALSE;

		}
		public function setRecoveryToken($token) {
			$this->recoveryToken = $token;
		}
		public function getRecoveryToken() {
			return $this->recoveryToken;
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
		public function setTempData($data) {
			$this->tmpData = $data;
		}
		public function getTempData() {
			return $this->tmpData;
		}
	}
?>