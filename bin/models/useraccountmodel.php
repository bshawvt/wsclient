<?PHP 

	class UserAccountModel {

		
		public $user_id = NULL;
		public $username = NULL;
		public $combinedHash = NULL;
		public $salt = NULL;
		public $email = NULL;
		public $permission = NULL;
		public $locked = NULL;
		public $dateOfCreation = NULL;
		public $lastLoginDate = NULL;
		public $sessionIp = NULL;
		public $sessionExpirationDate = NULL;
		public $sessionToken = NULL;
		
		function __construct($resultSet) {
			if (is_array($resultSet)) {
				if (array_key_exists("user_id", $resultSet)) {
					$this->user_id = $resultSet["user_id"];
				};
				if (array_key_exists("username", $resultSet)) {
					$this->username = $resultSet["username"];
				};
				if (array_key_exists("combinedHash", $resultSet)) {
					$this->combinedHash = $resultSet["combinedHash"];
				};
				if (array_key_exists("salt", $resultSet)) {
					$this->salt = $resultSet["salt"];
				};
				if (array_key_exists("email", $resultSet)) {
					$this->email = $resultSet["email"];
				};
				if (array_key_exists("permission", $resultSet)) {
					$this->permission = $resultSet["permission"];
				};
				if (array_key_exists("locked", $resultSet)) {
					$this->locked = $resultSet["locked"];
				};
				if (array_key_exists("dateOfCreation", $resultSet)) {
					$this->dateOfCreation = $resultSet["dateOfCreation"];
				};
				if (array_key_exists("lastLoginDate", $resultSet)) {
					$this->lastLoginDate = $resultSet["lastLoginDate"];
				};
				if (array_key_exists("sessionIp", $resultSet)) {
					$this->sessionIp = $resultSet["sessionIp"];
				};
				if (array_key_exists("sessionExpirationDate", $resultSet)) {
					$this->sessionExpirationDate = $resultSet["sessionExpirationDate"];
				};
				if (array_key_exists("sessionToken", $resultSet)) {
					$this->sessionToken = $resultSet["sessionToken"];
				};
			}
		}
	}

?>