module.exports = function (msg) {

	var NEED = "car_rental_offer";

	var uuid = require('uuid').v4();

	var message = msg || {
		"json_class" : "RentalOfferNeedPacket",
		"need": NEED,
		"solutions": [],
		"user_id": Math.floor(Math.random() * 5) + 1,
		"id" : uuid,
		"ultimate_solution": false,
		"hop_count": 0,
		"touched_by": []
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
		if (message.solutions) {
			return message.solutions.length > 0;
		} else {
			return false;
		}
	};

	this.tickHop = function() {
		message.hop_count++;
	};

	this.touch = function(name) {
		if (!message.touched_by) {
			message.touched_by = [];
		}
		message.touched_by.push(name);
	};

	return this;
};