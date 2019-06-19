export default class Bubble {
	constructor(scene) {
		this.scene = scene;
		this.emotions = ['neutral', 'anger', 'sadness', 'joy', 'fear'];
		this.groupBlob = new THREE.Object3D();
		this.blob = null;
		this.bubbles = [];
		this.initialize();
	}
	initialize() {
		this.add_bubble();
		this.scene.add(this.groupBlob);
	}
	update(time) {
		let currentTime = time / 1000;
		if (this.groupBlob) {
			// this.groupBlob.rotation.x += 0.01;
			this.groupBlob.rotation.y += 0.01;
			// this.groupBlob.rotation.z += 0.01;
		}
		if (this.blob) {
			this.blob.material.uniforms.uTime.value = currentTime;
		}
	}
	// ---
	add_bubble() {
        let color = {
            hue: {
                min: 0.0,
                max: 0.0
            },
            saturation: {
                min: 0.5,
                max: 0.5
            },
            lightness: 0.5
        }

        color.hue.min = this.map_range(0.0, 0.0, 360.0, 0.0, 1.0);
        color.hue.max = this.map_range(20.0, 0.0, 360.0, 0.0, 1.0);
        color.lightness = 0.6;

		let geometry = new THREE.IcosahedronBufferGeometry(2.5, 5);
		let material = new THREE.ShaderMaterial({
		    transparent: true,
		    uniforms: {
		        uTime: {
		            type: "f",
		            value: 0.0
		        },
		        uResolution: {
		            type: "v2",
		            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
		        },
		        uHueMin: {
		            type: "f",
		            value: color.hue.min
		        },
		        uHueMax: {
		            type: "f",
		            value: color.hue.max
		        },
		        uSaturationMin: {
		            type: "f",
		            value: color.saturation.min
		        },
		        uSaturationMax: {
		            type: "f",
		            value: color.saturation.max
		        },
		        uLightness: {
		            type: "f",
		            value: color.lightness
		        },
		        uRandom: {
		            type: "f",
		            value: this.get_random_interval(-1.0, 1.0)
		        }
		    },
		    vertexShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                uniform float uRandom;
                varying vec3 vPosition;

                float SimplexPerlin3D( vec3 P ) {
                    const float SKEWFACTOR = 1.0/3.0;
                    const float UNSKEWFACTOR = 1.0/6.0;
                    const float SIMPLEX_CORNER_POS = 0.5;
                    const float SIMPLEX_TETRAHADRON_HEIGHT = 0.70710678118654752440084436210485;
                    P *= SIMPLEX_TETRAHADRON_HEIGHT;
                    vec3 Pi = floor( P + dot( P, vec3( SKEWFACTOR) ) );
                    //  Find the vectors to the corners of our simplex tetrahedron
                    vec3 x0 = P - Pi + dot(Pi, vec3( UNSKEWFACTOR ) );
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 Pi_1 = min( g.xyz, l.zxy );
                    vec3 Pi_2 = max( g.xyz, l.zxy );
                    vec3 x1 = x0 - Pi_1 + UNSKEWFACTOR;
                    vec3 x2 = x0 - Pi_2 + SKEWFACTOR;
                    vec3 x3 = x0 - SIMPLEX_CORNER_POS;
                    vec4 v1234_x = vec4( x0.x, x1.x, x2.x, x3.x );
                    vec4 v1234_y = vec4( x0.y, x1.y, x2.y, x3.y );
                    vec4 v1234_z = vec4( x0.z, x1.z, x2.z, x3.z );
                    Pi.xyz = Pi.xyz - floor(Pi.xyz * ( 1.0 / 69.0 )) * 69.0;
                    vec3 Pi_inc1 = step( Pi, vec3( 69.0 - 1.5 ) ) * ( Pi + 1.0 );
                    vec4 Pt = vec4( Pi.xy, Pi_inc1.xy ) + vec2( 50.0, 161.0 ).xyxy;
                    Pt *= Pt;
                    vec4 V1xy_V2xy = mix( Pt.xyxy, Pt.zwzw, vec4( Pi_1.xy, Pi_2.xy ) );
                    Pt = vec4( Pt.x, V1xy_V2xy.xz, Pt.z ) * vec4( Pt.y, V1xy_V2xy.yw, Pt.w );
                    const vec3 SOMELARGEFLOATS = vec3( 635.298681, 682.357502, 668.926525 );
                    const vec3 ZINC = vec3( 48.500388, 65.294118, 63.934599 );
                    vec3 lowz_mods = vec3( 1.0 / ( SOMELARGEFLOATS.xyz + Pi.zzz * ZINC.xyz ) );
                    vec3 highz_mods = vec3( 1.0 / ( SOMELARGEFLOATS.xyz + Pi_inc1.zzz * ZINC.xyz ) );
                    Pi_1 = ( Pi_1.z < 0.5 ) ? lowz_mods : highz_mods;
                    Pi_2 = ( Pi_2.z < 0.5 ) ? lowz_mods : highz_mods;
                    vec4 hash_0 = fract( Pt * vec4( lowz_mods.x, Pi_1.x, Pi_2.x, highz_mods.x ) ) - 0.49999;
                    vec4 hash_1 = fract( Pt * vec4( lowz_mods.y, Pi_1.y, Pi_2.y, highz_mods.y ) ) - 0.49999;
                    vec4 hash_2 = fract( Pt * vec4( lowz_mods.z, Pi_1.z, Pi_2.z, highz_mods.z ) ) - 0.49999;
                    vec4 grad_results = inversesqrt( hash_0 * hash_0 + hash_1 * hash_1 + hash_2 * hash_2 ) * ( hash_0 * v1234_x + hash_1 * v1234_y + hash_2 * v1234_z );
                    const float FINAL_NORMALIZATION = 37.837227241611314102871574478976;
                    vec4 kernel_weights = v1234_x * v1234_x + v1234_y * v1234_y + v1234_z * v1234_z;
                    kernel_weights = max(0.5 - kernel_weights, 0.0);
                    kernel_weights = kernel_weights*kernel_weights*kernel_weights;
                    return dot( kernel_weights, grad_results ) * FINAL_NORMALIZATION;
                }

                float map(float value, float inMin, float inMax, float outMin, float outMax) {
                    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
                }

                void main(void) {
                    // vUv = uv;
                    vPosition = position;

                    float noise = SimplexPerlin3D(vPosition.xyz * 0.75 + uTime * 0.25 + uRandom);

                    vec3 pos = vec3(vPosition);
                    pos.x += sin(noise * 0.25) * 0.25;
                    pos.y += sin(noise * 0.25) * 0.25;
                    pos.z += sin(noise * 0.25) * 0.25;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
		    fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                uniform float uHueMin;
                uniform float uHueMax;
                uniform float uSaturationMin;
                uniform float uSaturationMax;
                uniform float uLightness;
                uniform float uRandom;
                // varying vec2 vUv;
                varying vec3 vPosition;

                float SimplexPerlin3D( vec3 P ) {
                    const float SKEWFACTOR = 1.0/3.0;
                    const float UNSKEWFACTOR = 1.0/6.0;
                    const float SIMPLEX_CORNER_POS = 0.5;
                    const float SIMPLEX_TETRAHADRON_HEIGHT = 0.70710678118654752440084436210485;
                    P *= SIMPLEX_TETRAHADRON_HEIGHT;
                    vec3 Pi = floor( P + dot( P, vec3( SKEWFACTOR) ) );
                    //  Find the vectors to the corners of our simplex tetrahedron
                    vec3 x0 = P - Pi + dot(Pi, vec3( UNSKEWFACTOR ) );
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 Pi_1 = min( g.xyz, l.zxy );
                    vec3 Pi_2 = max( g.xyz, l.zxy );
                    vec3 x1 = x0 - Pi_1 + UNSKEWFACTOR;
                    vec3 x2 = x0 - Pi_2 + SKEWFACTOR;
                    vec3 x3 = x0 - SIMPLEX_CORNER_POS;
                    vec4 v1234_x = vec4( x0.x, x1.x, x2.x, x3.x );
                    vec4 v1234_y = vec4( x0.y, x1.y, x2.y, x3.y );
                    vec4 v1234_z = vec4( x0.z, x1.z, x2.z, x3.z );
                    Pi.xyz = Pi.xyz - floor(Pi.xyz * ( 1.0 / 69.0 )) * 69.0;
                    vec3 Pi_inc1 = step( Pi, vec3( 69.0 - 1.5 ) ) * ( Pi + 1.0 );
                    vec4 Pt = vec4( Pi.xy, Pi_inc1.xy ) + vec2( 50.0, 161.0 ).xyxy;
                    Pt *= Pt;
                    vec4 V1xy_V2xy = mix( Pt.xyxy, Pt.zwzw, vec4( Pi_1.xy, Pi_2.xy ) );
                    Pt = vec4( Pt.x, V1xy_V2xy.xz, Pt.z ) * vec4( Pt.y, V1xy_V2xy.yw, Pt.w );
                    const vec3 SOMELARGEFLOATS = vec3( 635.298681, 682.357502, 668.926525 );
                    const vec3 ZINC = vec3( 48.500388, 65.294118, 63.934599 );
                    vec3 lowz_mods = vec3( 1.0 / ( SOMELARGEFLOATS.xyz + Pi.zzz * ZINC.xyz ) );
                    vec3 highz_mods = vec3( 1.0 / ( SOMELARGEFLOATS.xyz + Pi_inc1.zzz * ZINC.xyz ) );
                    Pi_1 = ( Pi_1.z < 0.5 ) ? lowz_mods : highz_mods;
                    Pi_2 = ( Pi_2.z < 0.5 ) ? lowz_mods : highz_mods;
                    vec4 hash_0 = fract( Pt * vec4( lowz_mods.x, Pi_1.x, Pi_2.x, highz_mods.x ) ) - 0.49999;
                    vec4 hash_1 = fract( Pt * vec4( lowz_mods.y, Pi_1.y, Pi_2.y, highz_mods.y ) ) - 0.49999;
                    vec4 hash_2 = fract( Pt * vec4( lowz_mods.z, Pi_1.z, Pi_2.z, highz_mods.z ) ) - 0.49999;
                    vec4 grad_results = inversesqrt( hash_0 * hash_0 + hash_1 * hash_1 + hash_2 * hash_2 ) * ( hash_0 * v1234_x + hash_1 * v1234_y + hash_2 * v1234_z );
                    const float FINAL_NORMALIZATION = 37.837227241611314102871574478976;
                    vec4 kernel_weights = v1234_x * v1234_x + v1234_y * v1234_y + v1234_z * v1234_z;
                    kernel_weights = max(0.5 - kernel_weights, 0.0);
                    kernel_weights = kernel_weights*kernel_weights*kernel_weights;
                    return dot( kernel_weights, grad_results ) * FINAL_NORMALIZATION;
                }

                vec3 hue_to_rgb(float hue) {
                    float R = abs(hue * 6.0 - 3.0) - 1.0;
                    float G = 2.0 - abs(hue * 6.0 - 2.0);
                    float B = 2.0 - abs(hue * 6.0 - 4.0);
                    return saturate(vec3(R,G,B));
                    
                }

                vec3 hsl_to_rgb(vec3 hsl) {
                    vec3 rgb = hue_to_rgb(hsl.x);
                    float C = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
                    return (rgb - 0.5) * C + hsl.z;
                }

                float map(float value, float inMin, float inMax, float outMin, float outMax) {
                    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
                }

                void main(void) {
                    float noise = SimplexPerlin3D(vPosition.xyz * 0.75 + uTime * 0.25 + uRandom); 

                    float hue = map(noise, 0.0, 1.0, uHueMin, uHueMax);
                    // hue = floor(hue * 50.0) / 50.0;
                    // float hue = uHueMin;

                    // float saturation = map(noise, 0.0, 1.0, uSaturationMin, uSaturationMax);
                    // saturation = floor(saturation * 50.0) / 50.0;
                    float saturation = uSaturationMin;

                    // float lightness = map(noise, 0.0, 1.0, 0.25, 0.75);
                    // lightness = floor(lightness * 50.0) / 50.0;
                    float lightness = uLightness;

                    vec3 rgb = hsl_to_rgb(vec3(hue, saturation, lightness));
                    gl_FragColor = vec4(rgb, 0.95);
                }
            `
		});
		let shape = new THREE.Mesh(geometry, material);

		shape.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

		this.scene.add(shape);
		this.groupBlob.add(shape);
		this.blob = shape;
    }
    map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }
	// ---
	get_random_interval(min, max) {
		return Math.random() * (max - min) + min;
	}
}