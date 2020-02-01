function ChatBlob() {
	this.type = 1;
	this.message = "";
	this.channelId = 0;
}

function AuthBlob() {
	this.type = 2;
	this.ready = false;
}

function StateBlob() {
	this.type = 3;
	this.message = "Hello world";
	this.channelId = 0;
}