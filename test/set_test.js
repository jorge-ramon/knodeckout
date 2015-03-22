var Knodeckout = require("../index");

var server = new Knodeckout();

server.set("model", __dirname + "/models");

server.done();