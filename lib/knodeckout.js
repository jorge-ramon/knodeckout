var express = require("express");

var Knodeckout = function(options) {
	this.app = express();
	this.options = options || {};
	this.use = this.app.use;
	this.app.use(function(err, request, response, next) {
		if(err) {
			response.json({ error: true });
		} else {
			next();
		}
	});
}

Knodeckout.prototype.set = function(key, value) {
	if(typeof key === "object")
		for(var k in key)
			this.options[k] = key[k];
	else
		this.options[key] = value;
}

Knodeckout.prototype.get = function(key) {
	return this.options[key];
}

Knodeckout.prototype.createRouter = function(){
	return express.Router();
}

Knodeckout.prototype.done = function(port, callback){
	if(typeof port === "number") {
		this.options.port = port;
	} else {
		this.options.port = this.options.port || 3000;
	}

	if(typeof port === "function") {
		callback = port;
		port = this.options.port || 3000;
	} else if(typeof port === "undefined") {
		this.options.port = this.options.port || 3000;
		var _this = this;
		callback = function(){ console.log("Running server on port " + _this.options.port); };
	}

	var route = (typeof this.options.model === "object" && this.options.model.path  === "string") ? "/" + this.options.model.path : "/model";
	var path = (typeof this.options.model === "object" && this.options.model.dir  === "string") ? this.options.model.dir : (this.options.model || "models");
	
	if(path[path.length - 1] !== "/")
		path += "/";
	
	this.app.get(route + "/:ref", function(request, response) {
		try {
			var model = require(path + request.params.ref);
			response.json(model);
		} catch(e) {
			response.json({});
		}
	});

	this.app.listen(this.options.port, callback);
}

module.exports = Knodeckout;