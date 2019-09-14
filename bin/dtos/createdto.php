<?PHP 
	class CreateDto {
		public $useraccount = NULL;
		public $error = NULL;
		private $errorList = NULL;
		function __construct() {
			$this->useraccount = NULL;
			$this->errorList = array();
			$this->error = FALSE;
		}
		public function setUserAccount($resultSet) {
			$this->useraccount = new UserAccountModel($resultSet);
		}
		public function setError($msg) {
			$this->errorList[] = $msg;
			$this->error = TRUE;
		}
		public function getError() {
			return implode("", $this->errorList);
		}
	}
?>