<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	<?PHP 
		session_start(); 
		if (isset($_SESSION['generated_captcha'])) {
			echo "previous captcha: " . $_SESSION['generated_captcha'];
		}
	?>
	<img src="/test.php"/>
</body>
</html>