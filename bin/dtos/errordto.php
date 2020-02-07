<?PHP 
	class ErrorDto {
		public $error = NULL;
		private $errorList = NULL;
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
	}
?>