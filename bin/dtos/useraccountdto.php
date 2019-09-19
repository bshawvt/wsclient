<?PHP 
	
	class UserAccountDto {
		public $useraccount = NULL;
		function __construct($resultSet) {
			$this->useraccount = new UserAccountModel($resultSet);
		}
		public function getUserAccount() {
			return $this->useraccount;
		}
	}

?>