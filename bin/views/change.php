<?PHP 
	$viewModel = $this->getViewModel();
	if ($viewModel == NULL || $viewModel->error) {

?>
	<p>
		<h3>Your submission was invalid:</h3>
		<span class='italic'>
			<?PHP echo $viewModel->getError(); ?>
		</span>
	</p>

<?PHP 

	}

	else 

	{

?>
	
	<p>
		<h3>Your account password has changed</h3>
		You may now login
	</p>

<?PHP


	}
?>