module.exports = function (msg) {

	var NEED = "car_rental_offer";
	var solutions = [];

	var message = msg || {
		"json_class" : "NeedPacket",
		"need": NEED,
		"solutions": solutions
	};

	this.stringify = function () {
		return JSON.stringify(message);
	};

	this.getMessage = function(){
		return message;
	};

	this.proposeSolution = function (solution) {
		solutions.push(solution);
	};

	return this;
};