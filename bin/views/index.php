<?PHP 
	
	/* persistent variabel test
	//session_start();
	$test1 = 0;
	$test2 = 0;

	if (!isset($_SESSION["test"])) {
		echo "starting session stuff yay<br/>";
		$_SESSION["test"] = array();//$_GET["t"];
	}

	if (isset($_GET["id"])) {
		$_SESSION["test"][($_GET["id"]+0)] = $_GET["msg"];
	}


	$test1 = $_SESSION["test"][0];
	//session_id("cachetest2");
	$test2 = $_SESSION["test"][0];

	echo "session var: " . $test1 . "<br/>";
	echo "session var: " . $test2 . "<br/>";


	unset($_SESSION["test"]);*/

?>


<p>
	<h3>Running on Localhost</h3>
	todo: recovery does not send email and instead dumps email contents because localhost has not setup a mailing server
</p>
<!-- old site <p>
	Please be gentle with my software! This is a pet project and very much in development.
</p>
<p>
	The servers are not always online, you can yell at me through twitter <a href="https://twitter.com/dying2death">@dying2death</a> if it's not.
</p>-->