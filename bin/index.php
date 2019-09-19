<?PHP
	require ("route.php");

	$route = new Route();
	$controller = $route->getController();
	$view = $controller; // todo: 
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, minimal-ui">
		<link rel="stylesheet" type="text/css" href="desktop.css">
		<script type="text/javascript" src="sjcl.js"></script>
		

		<script type="application/javascript">
			function isMobile() {
				// massive regex from https://stackoverflow.com/a/11381730
				var agent = (navigator.userAgent||navigator.vendor||window.opera);
				if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0,4))) {
					return true;
				}
				else {
					return false;
				}
			}

			function toggleDetailsClosed() {
				var cells = document.getElementsByClassName("user-form-cell");
				for(var i = 0; i < cells.length; i++) {
					var item = cells[i].children[0];
					if (item.hasAttribute("open")) {
						item.removeAttribute("open");
					}
				}
			}

			window.onload = () => {
				var cells = document.getElementsByClassName("user-form-cell");
				for (var i = 0; i < cells.length; i++) {
					var item = cells[i].children[0];

					item.onclick = function(a) {
						for(var x = 0; x < cells.length; x++) {
							var _item = cells[x].children[0];
							if (isMobile() == true || (screen.width <= 800) || (window.innerWidth <= 800)) {
								if (_item.hasAttribute("open")) {
									if (_item !== this) {
										_item.removeAttribute("open");
									}
								}
							}
						}
					}


					if (!isMobile() || (window.innerWidth > 800)) {
						item.setAttribute("open", "");
					}

				}
			}

			function load(page, elementId) {
				var element = document.getElementById(elementId);
				var req = new XMLHttpRequest();
				req.open('GET', page);
				req.onreadystatechange = function(r) {
					if (req.readyState === 4 && req.status === 200) {
						// todo
						if (isMobile() == true || (screen.width <= 800) || (window.innerWidth <= 800))
							toggleDetailsClosed();
						element.innerHTML = req.responseText;

					}
				}
				req.send();
			}

			function getFormPasswordElement(form) { 
				var result = {hashword1: undefined, hashword2: undefined};
				var inputs = form.getElementsByTagName("input");
				for(var i = 0; i < inputs.length; i++) {
					var name = inputs[i].getAttribute("name");
					// each form should have one or the other whenever this function is called so set both here
					if (name === "hashword1") {
						result.hashword1 = inputs[i];
					}
					else if (name === "hashword2") {
						result.hashword2 = inputs[i];
					}
				}
				return result;
			}

			function onsubmit_login(e, event) {
				event.preventDefault();

				/*var hashwords = getFormPasswordElement(e);
				var crypt = new sjcl.hash.sha256();
				
				crypt.update(hashwords.hashword1.value);
				var hash = sjcl.codec.base64.fromBits(crypt.finalize());
				
				hashwords.hashword1.value = hash;
				console.log(hash);*/
				e.submit();
			}

			function onsubmit_create(e, event) {
				event.preventDefault();

				/*var hashwords = getFormPasswordElement(e);
				var crypt = new sjcl.hash.sha256();
				
				crypt.update(hashwords.hashword1.value);
				var hash1 = sjcl.codec.base64.fromBits(crypt.finalize());

				crypt.update(hashwords.hashword2.value);
				var hash2 = sjcl.codec.base64.fromBits(crypt.finalize());

				hashwords.hashword1.value = hash1;
				hashwords.hashword2.value = hash2;*/
				e.submit();
			}
			</script>
	</head>

	<body>
		<div class="wrapper">
			<div class="portal-body">
				<div class="header warn">
					<span class=""></span>
				</div>
				<div class="user-form-container">
					<div class="user-form-cell">
						<details>
							<summary>Create</summary>
							<div class="user-form">
								<label>Create your account</label>
								<span class="clear-fix"></span>

								<form method="POST" action="?controller=user&action=create" onsubmit="onsubmit_create(this, event)">
									<input name="username" placeholder="Username"/>
									<input name="hashword1" value="" placeholder="Password" type="Password"/>
									<input name="hashword2" value="" placeholder="Confirm password" type="Password"/>
									<label>Optional</label>
									<input name="email" placeholder="Your@email.com"/>
									<label>What is the answer from read more? <a href="javascript:void(0);" onclick='load("views/creation.html", "content")'>Read more...</a></label>
									<input name="secret" placeholder="Answer">
									<button type="submit" >Submit</button>
								</form>
							</div>
						</details>
					</div>
					<div class="user-form-cell">
						<details>
							<summary>Play</summary>
							<div class="user-form">
								<label>Login and join the game</label>
								<form method="POST" action="?controller=user&action=play" onsubmit="onsubmit_login(this, event)">
									<input name="username" placeholder="Username"/>
									<input name="hashword1" value="" placeholder="Password" type="Password"/>
									<button type="submit">Login</button>
								</form>
							</div>
						</details>
					</div>
					<div class="user-form-cell">
						<details>
							<summary>Recover</summary>
							<div class="user-form">
								<label>Change password / recover your account</label>
								<form method="POST" action="?controller=user&action=recover">
									<input name="email" placeholder="Your recovery@email.com"/>
									<button type="submit">Send Email</button>
								</form>
							</div>
						</details>
					</div>
				</div>
			
				
				<div class="portal-content" id="content">
					<?PHP 
						$view->getView(); 
					?>
				</div>
				<span class="clear-fix"></span>
			</div>
		</div>
	</body>
</html>