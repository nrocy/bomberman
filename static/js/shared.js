
(function(exports) {

	exports.update_world = function(world, dt) {
		var i;
		for( i = 0; i < world.length; i++ ) {
			world[i].x += world[i].dx * dt;
			world[i].y += world[i].dy * dt;
		}
	};

})(typeof exports === "undefined" ? this.shared = {} : exports);

