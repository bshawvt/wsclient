<p>
	<?PHP 
		$model = $this->getViewModel();
		$html = array();
		if ($model === NULL) {
			$html[] = "<p><h3>Your submission was invalid:</h3>";
			$html[] = "<span class='italic'>";
			$html[] = "You failed to authenticate";
			$html[] = "</span></p>";
		}
		else {
			$html[] = "<span>Congratulations, something broke!</span>";
		}
		echo implode("", $html);		
	?>
</p>