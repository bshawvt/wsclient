<?PHP 
	class Controller { // todo: this is a terrible template 
		private $dbContext = NULL;
		private $viewModel = NULL;
		function __construct() {
			$this->dbContext = (new DBContext())->getContext();
		}
		function __destruct() {
			$this->dbContext = NULL;
		}
		public function getViewModel() {
			return $this->viewModel;
		}
		public function getView() {
			return $this->index();
		}
		public function index() {
			return include ("views/index.php");
		}
	}

/* better template
<?PHP 
	class Controller {
		private $dbContext = NULL;
		private $viewModel = NULL;
		function __construct($route) {
			$this->dbContext = (new DBContext())->getContext();

			switch($route->getAction()) {
				case "test": {
					$this->view = $this->test();
					break;
				}
				default: {
					$this->view = $this->index();
					break;
				}
			}
		}
		function __destruct() {
			$this->dbContext = NULL;
		}
		public function getViewModel() {
			return $this->viewModel;
		}
		public function getView() {
			return include ($this->view);
		}
		public function index() {
			return "views/index.php";
		}
		public function test() {
			return "views/test.php";
		}
	}
?>*/

?>

