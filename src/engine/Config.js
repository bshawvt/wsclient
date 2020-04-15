var Config = {
	loaderRequestType: "GET",
	// default mobile orientation
	orientation: "landscape",
	//orientation: "portrait",

	// versions should match Config.java
	version: {
		major: 0,
		minor: 0,
		build: 1302020
	},

	servers: {
		game: {
			//address: "wss://localhost",
			address: "wss://govehill.dynu.net",
			port: 29980
		}
	},

	defaults: {
		log: console.log,
		int2rgb: "rgb(255, 255, 255);",
		// mobile touch controller default/saved settings
		touchSettings: {
			// sensitivity for mouse touch controller
			sensX: 1.0,
			sensY: 1.0,
			// feedback is like, vibrations, man
			feedback: { start: 25, move: 25, enabled: true },
			// default/saved button and controller screen location
			positions: []
		}
	},

	input: {
		sensX: 1.0,
		sensY: 1.0
	}

}