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
			$html[] = "You may login now!<br/><br/>";
			if ($model->getUseraccount()->email == NULL) {
				$html[] = "WARNING! You did not provide an email address while creating your account. If you lose access to your account it cannot be recovered! You can set your email address in game.";
			}
			else {
				$html[] = "No confirmation email will be sent so please remember the email address you used to create your account so that you may recover it or change your password later on!</p>";
			}
		}
		echo implode("", $html);
	?>
</p>