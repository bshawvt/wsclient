<p>
	<?PHP 
		$model = $this->getViewModel();
		$html = array();
		//$html = array();
		if ($model->error) {
			$html[] = $model->getError();
		}
		else {
			$html[] = "Successfully registered ";
			$html[] = $model->useraccount->username;
			$html[] = "! Your recovery email is ";
			$html[] = $model->useraccount->email;
		}
		echo implode("", $html);
	?>
</p>