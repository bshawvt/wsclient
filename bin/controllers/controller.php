<?PHP 


	class Controller {
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
?>