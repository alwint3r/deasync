/*!
 * deasync
 * https://github.com/abbr/deasync
 *
 * Copyright 2014-2015 Abbr
 * Released under the MIT license
 */

(function () {
	function deasync(fn) {
		return function() {
			var done = false;
			var args = Array.prototype.slice.apply(arguments).concat(cb);
			var err;
			var res;

			fn.apply(this, args);
			module.exports.loopWhile(function(){ return !done;});
			if (err)
				throw err;

			function cb(e, r) {
				err = e;
				res = r;
				done = true;
			}

			return res;
		}
	}

	var binding = require('bindings')('deasync');

	module.exports = deasync;

	module.exports.sleep = deasync(function(timeout, done) {
		setTimeout(done, timeout);
	});

	module.exports.runLoopOnce = function(){
		process._tickDomainCallback();
		binding.run();
	};

	module.exports.loopWhile = function(pred){
	  while(pred()){
		process._tickDomainCallback();
		if(pred()) binding.run();
	  }
	};

}());
