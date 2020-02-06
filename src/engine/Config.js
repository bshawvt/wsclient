var Config = {
	loaderRequestType: "GET",
	orientation: "landscape",
	//orientation: "portrait",

	version: {
		major: 0,
		minor: 0,
		build: 1302020
	},
	servers: {
		game: {
			address: "wss://192.168.1.100",
			port: 29980
		}
	},

	defaults: {
		log: console.log,
		int2rgb: "rgb(255, 255, 255);",
		touchSettings: {
			sensX: 1.0,
			sensY: 1.0,
			feedback: { start: 25, move: 25, enabled: true },
			positions: []
		}
	}

}