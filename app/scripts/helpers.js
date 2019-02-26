// Convert degrees into radians
const degToRadian = (degrees) => {
	return degrees * Math.PI  / 180;
};

// Convert radians into degrees
const radToDeg = (radians) => {
	// deg * Math.PI / 180 = radians
	return radians * (180 / Math.PI);
}

let radians = degToRadian(90);
let degrees = radToDeg(radians);

console.log(radians, degrees);

// Calcul distance between 2 points in 2D environment
const distance2D = (x1, y1, x2, y2) => {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

// Calcul distance between 2 points in 3D environment
const distance3D = (x1,x2,y1,y2,z1,z2) => {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2) + Math.pow((z2 - z1), 2))
}

//
const map = (value, start1, stop1, start2, stop2) => {
	return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
};

// Normalize a vector
const normalizeVector = (x, y, z) => {
	// Magnitude of a vector
	let m = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2), Math.pow(z, 2));
	return { x: x / m, y: y / m, z: z / m };
}

console.log(normalizeVector(1,2,3));

//