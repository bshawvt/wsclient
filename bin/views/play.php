<p>
	<?PHP 
		$model = $this->getViewModel();
		$html = array();
		if ($model !== NULL) {
			$html[] = "<p><h3>Your submission was invalid:</h3>";
			$html[] = "<span class='italic'>";
			$html[] =  $model->getError();
			$html[] = "</span></p>";
		}
		echo implode("", $html);
	?>
</p>