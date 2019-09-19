<?PHP 
	$model = $this->getViewModel();
	if($model != NULL) 
	{

?>

Please create a new password for this account
<form method="POST" action="?controller=user&action=change">
	<input type="hiddenx" readonly name="recovery_token" value=<?PHP echo $model->getToken(); ?> />
	<input type="hiddenx" readonly name="email" value=<?PHP echo $model->getEmail(); ?> />
	<input name="hashword1" placeholder="Password"/>
	<input name="hashword2" placeholder="Confirm password"/>
	<button type="submit">Change Password</button>
</form>

<?PHP 

	}
	else 
	{

?>

	<p>Something went terribly wrong</p>

<?PHP 

	} 

?>