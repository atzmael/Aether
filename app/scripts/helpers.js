export default class Helpers {
	// Convert degrees into radians
	static degToRadian(degrees) {
		return degrees * Math.PI / 180;
	};

	// Convert radians into degrees
	static radToDeg(radians) {
		// deg * Math.PI / 180 = radians
		return radians * (180 / Math.PI);
	};

	// Calcul distance between 2 points in 2D environment
	static distance2D(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
	};


	// Calcul distance between 2 points in 3D environment
	static distance3D(x1, x2, y1, y2, z1, z2) {
		return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2) + Math.pow((z2 - z1), 2))
	};

	//
	static map(value, start1, stop1, start2, stop2) {
		return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	};

	// Normalize a vector
	static normalizeVector(x, y, z) {
		// Magnitude of a vector
		let m = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2), Math.pow(z, 2));
		return {x: x / m, y: y / m, z: z / m};
	}

	//Normalize values
	// Values min / max (default -1 : 1
	// Target values min / value
	static normalize(v, vmin = -1, vmax = 1, tmin, tmax) {

		let nv = Math.max(Math.min(v, vmax), vmin);
		let dv = vmax - vmin;
		let pc = (nv - vmin) / dv;
		let dt = tmax - tmin;
		let tv = tmin + (pc * dt);
		return tv;
	};

	static mapBetween(v, vmin, vmax, tmin, tmax) {

		let x = (v * 100) / vmax;
		let normtmax = tmax;

		if (tmin != 0) {
			normtmax *= 2;
		}

		let y = (normtmax * x) / 100;
		if (tmin != 0) y -= tmax;

		return y;
	}
}