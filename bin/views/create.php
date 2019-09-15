<p>
	<?PHP 
		$model = $this->getViewModel();
		$html = array();

		if ($model->error) {
			$html[] = $model->getError();
		}
		else {
			$html[] = "Your account has been created! Please remember your email!<br/>";
		}
		echo implode("", $html);
	?>
</p>