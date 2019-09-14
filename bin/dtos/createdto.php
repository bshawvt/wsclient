<?PHP 
	class CreateDto {
		public $error = NULL;
		private $errorList = NULL;
		function __construct() {
			$this->useraccount = NULL;
			$this->errorList = array();
			$this->error = FALSE;
		}
		public function setUserAccount($model) {
			$this->useraccount = $model;
		}
		public function getUserAccount() {
			return $this->useraccount;
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