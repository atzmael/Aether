// Ground elements import
import Normal from '../Anger/template/Normal';
import River from '../Anger/template/River';

class Ground {
	constructor(size = chunkSize, segments = 1, amp = 0.5) {
		this.size = size;
		this.segments = segments;
		this.amp = amp;
		this.mapNumber = 9;

		this.pieces = {
			size: this.size,
			piece: []
		};

		this.uniforms = {
			time: {
				value: 0
			},
			mouse: {
				value: {
					x: 0,
					y: 0,
					z: 0
				}
			},
			size: {
				value: 300
			}
		};
	}

	init() {
		return new Promise(async resolve => {
			await this.createGround();
			resolve();
		})
	}

	/**
	 *
	 * @param color
	 * @returns {THREE.Mesh}
	 */
	createPiece(color = '#b32b00') {

		let uniforms = this.uniforms;
		
		let geom = new THREE.PlaneBufferGeometry(this.size, this.size, this.segments, this.segments);
		let mat = new THREE.ShaderMaterial({
			uniforms,
			vertexShader: `
                    varying vec3 vPos;
                    uniform float time;
                    uniform vec3 mouse;
                    uniform float size;

                    //  https://github.com/BrianSharpe/Wombat/blob/master/  SimplexPerlin2D.glsl
                    float SimplexPerlin2D( vec2 P ) {
                        const float SKEWFACTOR = 0.36602540378443864676372317075294;
                        const float UNSKEWFACTOR = 0.21132486540518711774542560974902;
                        const float SIMPLEX_TRI_HEIGHT = 0.70710678118654752440084436210485;
                        const vec3 SIMPLEX_POINTS = vec3( 1.0-UNSKEWFACTOR, -UNSKEWFACTOR, 1.0-2.0*UNSKEWFACTOR );
                        P *= SIMPLEX_TRI_HEIGHT;
                        vec2 Pi = floor( P + dot( P, vec2( SKEWFACTOR ) ) );
                        vec4 Pt = vec4( Pi.xy, Pi.xy + 1.0 );
                        Pt = Pt - floor(Pt * ( 1.0 / 71.0 )) * 71.0;
                        Pt += vec2( 26.0, 161.0 ).xyxy;
                        Pt *= Pt;
                        Pt = Pt.xzxz * Pt.yyww;
                        vec4 hash_x = fract( Pt * ( 1.0 / 951.135664 ) );
                        vec4 hash_y = fract( Pt * ( 1.0 / 642.949883 ) );
                        vec2 v0 = Pi - dot( Pi, vec2( UNSKEWFACTOR ) ) - P;
                        vec4 v1pos_v1hash = (v0.x < v0.y) ? vec4(SIMPLEX_POINTS.xy, hash_x.y, hash_y.y) : vec4(SIMPLEX_POINTS.yx, hash_x.z, hash_y.z);
                        vec4 v12 = vec4( v1pos_v1hash.xy, SIMPLEX_POINTS.zz ) + v0.xyxy;
                        vec3 grad_x = vec3( hash_x.x, v1pos_v1hash.z, hash_x.w ) - 0.49999;
                        vec3 grad_y = vec3( hash_y.x, v1pos_v1hash.w, hash_y.w ) - 0.49999;
                        vec3 grad_results = inversesqrt( grad_x * grad_x + grad_y * grad_y ) * ( grad_x * vec3( v0.x, v12.xz ) + grad_y * vec3( v0.y, v12.yw ) );
                        const float FINAL_NORMALIZATION = 99.204334582718712976990005025589;
                        vec3 m = vec3( v0.x, v12.xz ) * vec3( v0.x, v12.xz ) + vec3( v0.y, v12.yw ) * vec3( v0.y, v12.yw );
                        m = max(0.5 - m, 0.0);
                        m = m*m;
                        return dot(m*m, grad_results) * FINAL_NORMALIZATION;
                    }

                    float map_range(float value, float low1, float high1, float low2, float high2) {
                        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
                    }

                    void main() {
                        vPos = position;
                        float distToMouse = length(position - mouse);
                        float maxoffs = map_range(SimplexPerlin2D(uv * 2.5 + time * 0.6), -1.0, 1.0, 0.0, 15.);
                        // float maxoffs = 15.;
                        vPos.z += min(maxoffs * map_range(distToMouse, -20., 20., 0., 1.), maxoffs);
                        float smoothEdge = .00001;
                        float edges = (
                              smoothstep(0.0, smoothEdge, uv.x)
                              * smoothstep(0.0, smoothEdge, uv.y)
                              * smoothstep(1.0, 1.0 - smoothEdge, uv.x)
                              * smoothstep(1.0, 1.0 - smoothEdge, uv.y)
                        );
                        vPos.z *= edges;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos, 1.0);
                    }
                `,
			fragmentShader: `
                    varying vec3 vPos;

                    float when_gt(float x, float y) {
                      return max(sign(x - y), 0.0);
                    }

                    float when_le(float x, float y) {
                      return 1.0 - when_gt(x, y);
                    }

                    float grid(vec3 pos, vec3 axis, float size) {
                        float width = 1.0;

                        // Grid size
                        vec3 tile = pos / size;

                        // Grid centered gradient
                        vec3 level = abs(fract(tile) - 0.5);

                        // Derivative (crisp line)
                        vec3 deri = fwidth(tile);

                        vec3 grid3D = clamp(vPos, 0.0, 1.0);
                        return grid3D.z;
                    }

                    void main() {
                        float l = grid(vPos, vec3(1.0, 1.0, 1.0), 5.0);
                        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                        if (vPos.z < 0.0) discard;
                    }
                `,
			extensions: {
				derivatives: true
			}
		})

		mat = new THREE.MeshBasicMaterial({color: color});
		let ground = new THREE.Mesh(geom, mat);

		ground.name = "chunk";

		// Utility, debug purpose only
		let edges = new THREE.EdgesGeometry(geom);
		let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 'red'}));
		//ground.add(line);
		// Utilities

		ground.rotation.x = Math.PI / 180 * -90;
		ground.position.y = 0;

		return ground;
	}

	/**
	 *
	 */
	createGround() {
		return new Promise(async resolve => {
			let piece, template, templateID, templateName, posChunkX, posChunkZ;
			let piecesNumber = 0;
			let row = Math.sqrt(this.mapNumber);
			for (let x = 0; x < row; x++) {
				for (let y = 0; y < row; y++) {
					posChunkX = x * this.size - ((this.size * 3) / 2) + (this.size / 2);
					posChunkZ = y * this.size - ((this.size * 3) / 2) + (this.size / 2);

					window.grounds.push(
						{
							id: piecesNumber,
							elmt: undefined,
							posX: posChunkX,
							posZ: posChunkZ,
							objects: [],
						}
					);

					if (!this.checkChunkTemplate(posChunkX)) {
						await this.loadNormalTemplate(piecesNumber, posChunkX, posChunkZ);
						piece = this.createPiece();
					} else {
						await this.loadRiverTemplate(piecesNumber, posChunkX, posChunkZ);
						piece = this.createPiece(COLORS.blue);
					}

					piece.position.x = posChunkX;
					piece.position.z = posChunkZ;
					piece.position.y = -1;

					window.grounds[piecesNumber].elmt = piece;

					piecesNumber++;
				}
			}
			resolve();
		});
	}

	checkChunkTemplate(coord) {
		return (coord < -chunkSize / 2 && coord > -chunkSize * 1.5)
	}

	loadNormalTemplate(piecesNumber, posChunkX, posChunkZ) {
		return new Promise(async resolve => {
			await Normal.wait(piecesNumber, {x: posChunkX, y: posChunkZ});
			resolve();
		})
	}

	loadRiverTemplate(piecesNumber, posChunkX, posChunkZ) {
		return new Promise(async resolve => {
			await River.wait(piecesNumber, {x: posChunkX, y: posChunkZ});
			resolve();
		})
	}
}


const ground = {
	wait() {
		return new Promise(async resolve => {
			const newGround = new Ground();
			await newGround.init();
			resolve();
		});
	}
};

export default ground;