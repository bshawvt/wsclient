<p>
	<?PHP 
		$model = $this->getViewModel();
		$html = array();

		if ($model->error) {
			$html[] = "<p><h3>Your submission was invalid:</h3><span class='italic'>";
			$html[] = $model->getError();
			$html[] = "</span></p>";
		}
		else {
			$html[] = "<p><h3>An email has been sent</h3>";
			$html[] = "An email has been sent to <span class='italic'>";
			$html[] = $model->getEmail();
			$html[] = "</span><br/>Please check your inbox and follow the directions to proceed.</p>";
		}
		echo implode("", $html);
	?>
</p>