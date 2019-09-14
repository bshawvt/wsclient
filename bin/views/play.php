<p>
	<?PHP 
		$model = $this->getViewModel();
		$html = array();
		if ($model === NULL) {
			$html[] = "<span>Failed to authenticate! Please try again</span>";
		}
		else {
			$html[] = "<span>Redirecting to client...</span>";
		}
		echo implode("", $html);		
	?>
</p>