module.exports = function (msg) {

	var NEED = "car_rental_offer";

	var uuid = require('uuid').v4();

	var message = msg || {
		"json_class" : "RentalOfferNeedPacket",
		"need": NEED,
		"solutions": [],
		"_id" : uuid
	};

	this.stringify = function () {
		return JSON.stringify(message);
	};

	this.getMessage = function(){
		return message;
	};

	this.proposeSolution = function (solution) {
		message.solutions.push(solution);
	};

	return this;
};