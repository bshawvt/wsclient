<?PHP 

	class EmailService {
		private $email = NULL;
		function __construct($to) {
			$this->email = $to;
		}

		public function sendRecoveryEmail($token) { 
			$addr = Config::$address;
			$port = Config::$port;
			$url = "https://$addr:$port/bin/index.php?controller=user&action=reset&recovery_email=$this->email&token=$token";

			$subject = "Your requested account recovery";

			// email body html
			$msg = array();
			$msg[] = "<h2>A password reset has been requested</h2>";
			$msg[] = "To continue <a href='$url'>click here</a> or <a href='$url'>$url</a>). <br/>";
			$msg[] = "If you did not request this email please ignore it. This password reset will become invalid after 2 hours.";

			$headers = array();
			$headers[] = "From: no-reply@anotherprophecy.com\r\n";
			$headers[] = "Reply-To: no-reply@anotherprophecy.com\r\n";
			$headers[] = "MIME-Version: 1.0\r\n";
			$headers[] = "Content-Type: text/html; charset=UTF-8\r\n";

			mail($to, $subject, implode("", $msg), $headers);
			echo implode("", $msg);

		}
	}

?>