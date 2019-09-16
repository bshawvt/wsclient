<p>
	<?PHP 
		//$model = $this->getViewModel();
		//$html = array();

		if ($model->error) {
			//$html[] = $model->getError();
		}
		else {
			//$html[] = "Create";
		}
		echo implode("", $html);
	?>
</p>