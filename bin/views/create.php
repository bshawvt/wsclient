<p>
	<?PHP 
		$model = $this->getViewModel();
		$html = array();

		if ($model->error) {
			$html[] = "<p><h3>Your submission was invalid:</h3><span class='italic'>";
			$html[] = $model->getError();
			$html[] = "</span></p>For more information please read ";
			$html[] = "<a href='?controller=user&action=index'>here</a>.";
		}
		else {
			$html[] = "<p><h3>Your account has been created</h3>";
			$html[] = "Please remember the email address you used to create your account so you may recover your it or change your password later on!</p>";
		}
		echo implode("", $html);
	?>
</p>