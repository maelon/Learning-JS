(function(lib) {

    var p;

    (lib.BezierSegment = function(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }).prototype = p = {};

	p.getSingleValue = function (t) {
        var a = arguments[1] ? arguments [1] : 0;
        var b = arguments[2] ? arguments [2] : 0;
        var c = arguments[3] ? arguments [3] : 0;
        var d = arguments[4] ? arguments [4] : 0;
		return (t*t*(d-a) + 3*(1-t)*(t*(c-a) + (1-t)*(b-a)))*t + a;
	}	

    p.getYForX = function(x) {
		// Clamp to range between end points.
		// The padding with the small decimal value is necessary to avoid bugs
		// that result from reaching the limits of decimal precision in calculations.
		// We have tests that demonstrate this.

        var coefficients = arguments[1] ? arguments[1] : null;

		if (this.a.x < this.d.x) { 
	 		if (x <= this.a.x+0.0000000000000001) return this.a.y;
	 		if (x >= this.d.x-0.0000000000000001) return this.d.y;
	 	} else {
	 		if (x >= this.a.x+0.0000000000000001) return this.a.y;
	 		if (x <= this.d.x-0.0000000000000001) return this.d.y;
	 	}

		if (!coefficients) {
			coefficients = this.getCubicCoefficients(this.a.x, this.b.x, this.c.x, this.d.x);
		}
   		
   		// x(t) = a*t^3 + b*t^2 + c*t + d
 		var roots = this.getCubicRoots(coefficients[0], coefficients[1], coefficients[2], coefficients[3]-x); 
 		var time= NaN;
  		if (roots.length == 0)
 			time = 0;
 		else if (roots.length == 1)
 			time = roots[0];
  		else {
   			for (var i in roots) {
   				if (0 <= roots[i] && roots[i] <= 1) {
   					time = roots[i];
   					break;
   				}
   			}
   		}
   		
		if (isNaN(time))
			return NaN;
		
   		var y = this.getSingleValue(time, this.a.y, this.b.y, this.c.y, this.d.y);
   		return y;
    };

	p.getCubicCoefficients = function(a, b, c, d) {
		return [-a + 3*b - 3*c + d,
				3*a - 6*b + 3*c, 
				-3*a + 3*b, 
				a];
	}	

	p.getCubicRoots = function() {
        var a = arguments[0] ? arguments[0] : 0;
        var b = arguments[1] ? arguments[1] : 0;
        var c = arguments[2] ? arguments[2] : 0;
        var d = arguments[3] ? arguments[3] : 0;

		// make sure we really have a cubic
		if (!a) return this.getQuadraticRoots(b, c, d);
		
		// normalize the coefficients so the cubed term is 1 and we can ignore it hereafter
		if (a != 1) {
			b/=a;
			c/=a;
			d/=a;
		}

		var q= (b*b - 3*c)/9;               // won't change over course of curve
		var qCubed= q*q*q;                  // won't change over course of curve
		var r= (2*b*b*b - 9*b*c + 27*d)/54; // will change because d changes
													// but parts with b and c won't change
		// determine if there are 1 or 3 real roots using r and q
		var diff = qCubed - r*r;           // will change
		if (diff >= 0) {
			// avoid division by zero
			if (!q) return [0];
			// three real roots
			var theta = Math.acos(r/Math.sqrt(qCubed)); // will change because r changes
			var qSqrt = Math.sqrt(q); // won't change

			var root1 = -2*qSqrt * Math.cos(theta/3) - b/3;
			var root2 = -2*qSqrt * Math.cos((theta + 2*Math.PI)/3) - b/3;
			var root3 = -2*qSqrt * Math.cos((theta + 4*Math.PI)/3) - b/3;
			
			return [root1, root2, root3];
		} else {
			// one real root
			var tmp = Math.pow( Math.sqrt(-diff) + Math.abs(r), 1/3);
			var rSign = (r > 0) ?  1 : r < 0  ? -1 : 0;
			var root = -rSign * (tmp + q/tmp) - b/3;
			return [root];
		}
		return [];
	}

	p.getQuadraticRoots = function(a, b, c)
	{
		var roots = [];
		// make sure we have a quadratic
		if (!a) {
			if (!b) return [];
			roots[0] = -c/b;
			return roots;
		}

		var q = b*b - 4*a*c;
		var signQ = (q > 0) ? 1 : q < 0 ? -1 : 0;
		
		if (signQ < 0) {
			return [];
		} else if (!signQ) {
			roots[0] = -b/(2*a);
		} else {
			roots[0] = roots[1] = -b/(2*a);
			var tmp = Math.sqrt(q)/(2*a);
			roots[0] -= tmp;
			roots[1] += tmp;
		}
		
		return roots;
	}
})(lib = lib||{}, createjs = createjs||{});
var lib,createjs;
