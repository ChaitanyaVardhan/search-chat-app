var uu = require('underscore');

var indexfn = function(request, response) {
	response.send("<h1>Hello world</h1>");
};

var define_routes = function(dict) {
	var toroute = function(item) {
		return uu.object(uu.zip(['path', 'fn'], [item[0], item[1]]));
	};
	return uu.map(uu.pairs(dict), toroute);
}

var ROUTES = define_routes({
	'/': indexfn,
});

module.exports = ROUTES;