// this object contains user and engine preferences
// todo: key binds should be here so this file can be saved and reloaded per user
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
	},

	touchSettings: {
		diagonalOffset: 0,
		virtualMouseDeadzone: 0.5, // todo: add ui option
		dpadDeadzone: 0.5,  // todo: add ui option
		feedback: { start: 25, move: 25, enabled: false },
		positions: [] // todo: touch element locations, InputController doesn't support this yet
	},

	input: {
		sensX: 0.5,
		sensY: 0.5
	}

}