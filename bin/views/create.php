<p>
	<?PHP 
		$model = $this->getViewModel();
		$html = array();
		//$html = array();
		if ($model->error) {
			$html[] = $model->getError();
		}
		echo implode("", $html);
	?>
</p>