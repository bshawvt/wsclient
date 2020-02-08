<?PHP

	class Captcha {

		function __construct() {
			
		}

		function __destruct() {

		}

		public function consume($captcha) {
			if (session_status() !== PHP_SESSION_ACTIVE ) {
				session_start();
			}

			$captchaCmp = "";
			if(isset($_SESSION["generated_captcha"])) {
				$captchaCmp = $_SESSION["generated_captcha"];
				unset($_SESSION['generated_captcha']);
			}
			else {
				return -1;
			}
			$captchaCmp = explode("|", $captchaCmp);
			$captchaCmp = implode("", $captchaCmp);

			return strcmp($captcha, $captchaCmp);
		}

		public function generate() {
			$width = 200; 
			$height = 110;
			$image = imagecreatetruecolor($width, $height) or die("php cancer");
			$transparent = imagecolorallocatealpha($image, 0, 0, 0, 0 );
			
			$color = array();
			$numDigits = 4;

			for($i = 0; $i < $numDigits; $i++) {
				$set = array(rand(0, 255), rand(0, 255), rand(0, 255));
				$color[] = [ "fg" => imagecolorallocatealpha($image, 255 - $set[0], 255 - $set[1], 255 - $set[2], 30), 
							 "bg" => imagecolorallocatealpha($image, $set[0], $set[1], $set[2], 80 ) ];
			}
			$colors = count($color) - 1;

			$word = [rand(0, 9), rand(0, 9), rand(0, 9)];
			$randomDigits = implode("|", $word);
			for($x = 0; $x < count($word); $x++) {
				
				$offsetX = rand(0, 15);
				$offsetY = rand(-10, 15);
				$rngfont = rand(0, 5);
				switch ($rngfont) {
					case 1: {
						$fontfile = 'C:\\Windows\\Fonts\\times.ttf';
					}
					case 2: {
						$fontfile = 'C:\\Windows\\Fonts\\Gabriola.ttf';
					}
					case 3: {
						$fontfile = 'C:\\Windows\\Fonts\\lucon.ttf';
					}
					default : {
						$fontfile = 'C:\\Windows\\Fonts\\arial.ttf';
						break;
					}
				}
				imagefttext($image, rand(50, 75), 0, 30 + $x * 35 + $offsetX, 80 + $offsetY, $color[$x]["fg"], $fontfile, $word[$x]);
			}
			
			for($ix = 0; $ix < $width; $ix++) {
				for($iy = 0; $iy < $height; $iy++) {
					if (rand(0, 1) == 1) {
						imagesetpixel($image, $ix, $iy, $color[rand(0, $colors)]["bg"]);
					}
					else {
						imagesetpixel($image, $ix, $iy, $transparent);
						
					}
				}
			}

			// save the generated digits to session to check later
			if (session_status() !== PHP_SESSION_ACTIVE ) {
				session_start();
			}
			$_SESSION['generated_captcha'] = $randomDigits;

			header("Content-Type: image/png");
			imagepng($image);
			imagedestroy($image);
		}

	}

/*

<?PHP

	
	$width = 200; 
	$height = 110;
	$image = imagecreatetruecolor($width, $height) or die("php cancer");
	

	$transparent = imagecolorallocatealpha($image, 255, 255, 255, 127 );
	$colortest = imagecolorallocatealpha($image, 255, 255, 0, 0 );
	//$transparent = imagecolorallocatealpha($image, 255, 255, 255, 127 );
	//$transparent2 = imagecolorallocate($image, 255, 255, 255);
	imagecolortransparent($image, $transparent);
	imagefill($image, 0, 0, $transparent);
	

	$color = array();
	$numDigits = 4;

	for($i = 0; $i < $numDigits; $i++) {
		$set = array(rand(0, 255), rand(0, 255), rand(0, 255));
		$color[] = [ "fg" => imagecolorallocatealpha($image, 255 - $set[0], 255 - $set[1], 255 - $set[2], 40), 
					 "bg" => imagecolorallocatealpha($image, $set[0], $set[1], $set[2], 80 ) ];
	}
	$colors = count($color) - 1;

	$t = "1|2|3";
	$word = explode('|', $t);
	
	for($x = 0; $x < count($word); $x++) {
		
		$offsetX = rand(-10, 10);
		$offsetY = rand(-10, 10);

		switch (rand(0, 5)) {
			case 1: {
				$fontfile = 'C:\\Windows\\Fonts\\times.ttf';
			}
			case 2: {
				$fontfile = 'C:\\Windows\\Fonts\\Gabriola.ttf';
			}
			case 3: {
				$fontfile = 'C:\\Windows\\Fonts\\lucon.ttf';
			}
			default : {
				$fontfile = 'C:\\Windows\\Fonts\\arial.ttf';
				break;
			}
		}
		imagefttext($image, rand(50, 75), 0, 30 + $x * 50 + $offsetX, 80 + $offsetY, $color[$x]["fg"], $fontfile, $word[$x]);
	}

	for($ix = 0; $ix < $width; $ix++) {
		for($iy = 0; $iy < $height; $iy++) {
			//if (rand(0, 1) == 1) {
				//image
			//	imagesetpixel($image, $ix, $iy, $transparent);
			//}
			//else {
				$rgb = imagecolorat($image, $ix, $iy);
				//imagesetpixel($image, $ix, $iy, $colortest);
				// if color is black then don't blot?
				if ((rand(0, 1) == 1) && ((($rgb >> 16) & 0xff) == 255) &&
					((($rgb >> 8) & 0xff) == 255) &&
					(($rgb & 0xff) == 255)) {
					//imagesetpixel($image, $ix, $iy, $color[rand(0, $colors)]["bg"]);
					imagesetpixel($image, $ix, $iy, $transparent);
				}
				else {
					imagesetpixel($image, $ix, $iy, $color[rand(0, $colors)]["bg"]);
					//imagesetpixel($image, $ix, $iy, $transparent);
				}
				//imagesetpixel($image, $ix, $iy, $transparent);
			//}
		}
	}

	

	//imagecopy($image, $image, 0, 0, 0, 0, $width, $height);
	


	imagesavealpha($image, true);
	header("Content-Type: image/png");
	imagepng($image);
	imagedestroy($image);

?>

*/

?>