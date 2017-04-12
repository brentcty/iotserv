function Service(appClient) {
  this.appClient = appClient;
}

Service.prototype.connect = function() {
	this.appClient.connect();

  this.appClient.on('connect', function() {
       this.appClient.subscribeToDeviceEvents();
  }.bind(this));

  this.appClient.on('deviceEvent', function (deviceType, deviceId, eventType, format, payload) {
        global.responseString = "Device event at " + new Date().toString() + " from " + deviceType + ":" + deviceId + "; event = "+ eventType +", payload = " + payload;
	strPayload = ""+payload;
	jsonPayload = JSON.parse(strPayload);
	this.handleTempEvent(jsonPayload.d.temperature);

  }.bind(this));
};

Service.prototype.handleTempEvent = function(temp) {
  // TODO handle temperature changes here and call this.warningOn/this.warningOff accordingly.
	var cmdLevel = 34;
	var isUndefined = typeof global.raspberryTemp === 'undefined';
	var hotThresh = global.raspberryTemp <= cmdLevel;
	var coldThresh = global.raspberryTemp > cmdLevel;

console.log("temperature: " + temp);

	if(temp > cmdLevel)  {
		if(isUndefined || hotThresh) {
			this.warningOn();
		}
	}
	else if(temp <= cmdLevel) {
		if(isUndefined || coldThresh) {
			this.warningOff();
		}
	}
	global.raspberryTemp = temp;
};

Service.prototype.warningOn = function() {
  // TODO send a device commmand here
  // warningOn should only be called when the warning isn't already on
	console.log("screen on");
	var myData={"screen" : "on"};
        myData = JSON.stringify(myData);
        this.appClient.publishDeviceCommand("SenseHAT","senb827eb7ddd6d", "display", "json", myData);
};

Service.prototype.warningOff = function() {
  // TODO send a device commmand here
  // warningOff should only be called when the warning isn't already off
	console.log("screen off");
	var myData={"screen" : "off"};
        myData = JSON.stringify(myData);
        this.appClient.publishDeviceCommand("SenseHAT","senb827eb7ddd6d", "display", "json", myData);
};

module.exports = Service;
