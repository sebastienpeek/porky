/**
 * Need Packet
 * Authors:
 * Piotr Rochala: @rochal / http://github.com/rochal
 * Sebastien Peek: @sebastienpeek / http://github.com/the0rkus
 */

module.exports = function () {
	
	var NEED = "car_rental_offer";
	var solutions = [];

	var message = {
		"json_class" : "NeedPacket",
		"need": NEED,
		"solutions": solutions
	};

	this.toJSON = function () {
		return JSON.stringify (message);
	};
	
	this.proposeSolution = function (solution) {
		solutions.push(solution);
	};
};