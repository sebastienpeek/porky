module.exports = function (msg) {

	var NEED = "car_rental_offer";

	var uuid = require('uuid').v4();

	var message = msg || {
		"json_class" : "RentalOfferNeedPacket",
		"need": NEED,
		"solutions": [],
		"user_id": Math.floor(Math.random() * 5) + 1,
		"id" : uuid
	};

	this.id = message.id;

	this.stringify = function () {
		return JSON.stringify(message);
	};

	this.getMessage = function(){
		return message;
	};

	this.proposeSolution = function (solution) {
		message.solutions.push(solution);
	};

	this.hasSolutions = function() {
		return message.solutions.length > 0;
	};

	return this;
};