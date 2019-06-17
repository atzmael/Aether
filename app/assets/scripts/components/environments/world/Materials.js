export default class Materials {
    constructor(parameterMaterial) {
        this.state = parameterMaterial.state - 1;
        this.material = parameterMaterial.texture;
        //
        this.shape = null;
        //
        this.uniforms = {
            uTime: { type: "f", value: 0.0 },
            uResolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        };
        //
        this.mouseClicked = false;
        //
        this.initialize();
    }
    // --- --- --- --- --- --- --- --- ---
    initialize() {
        this.get_material(this.material);
        // this.add_events();
        // this.add_shape();
    }
    update(time) {
        const currentTime = time / 1000;
        if (this.material.uniforms) {
            this.material.uniforms.uTime.value = currentTime;
        }
    }
    // --- --- --- --- --- --- --- --- ---
    add_shape() {
        // const geometry = new THREE.PlaneBufferGeometry(1.5, 1.5, 128, 128);
        const geometry = new THREE.IcosahedronBufferGeometry(1.5, 5);
        // const geometry = new THREE.BoxBufferGeometry(1.5, 1.5, 1.5, 32, 32, 32);
        const material = this.material;
        this.shape = new THREE.Mesh(geometry, material);
        this.scene.add(this.shape);
    }
    // ---
    add_events() {
        window.addEventListener('mousedown', this.set_mouse_clicked.bind(this))
        window.addEventListener('mouseup', this.set_mouse_clicked.bind(this))
        window.addEventListener('mousemove', this.get_mouse_position.bind(this))
    }
    // --- --- --- --- --- --- --- --- ---
    get_material(parameterMaterial) {
        let colorsState;
        let color;
        switch (parameterMaterial) {
            case 'sand':
                colorsState = [0xffa385, 0x701b1b, 0x330e0e];
                color = colorsState[this.state];
                this.get_material_noise(color);
                break;
            case 'bush':
                colorsState = [0x9e3a31, 0x8c342b, null];
                color = colorsState[this.state];
                this.get_material_noise(color);
                break;
            case 'tree':
                colorsState = [0xcc7494, 0x590859, null];
                color = colorsState[this.state];
                this.get_material_noise(color);
                break;
            case 'stone':
                colorsState = [0x660a16, 0x5c1427, 0x520828];
                color = colorsState[this.state];
                this.get_material_noise(color);
                break;
            case 'montain':
                colorsState = [null, 0x210321, 0x210321];
                color = colorsState[this.state];
                this.get_material_noise(color);
                break;
            case 'stalagmite':
                colorsState = [null, 0x913d26, 0x913d26];
                color = colorsState[this.state];
                this.get_material_noise(color);
                break;
            case 'bubble':
                colorsState = [0x9e3a31, null, null];
                color = colorsState[this.state];
                this.get_material_opacity(color);
                break;
            case 'lava':
                this.get_material_lava();
                break;
            default:
                this.get_material_default();
                break;
        }
    } // ---
    get_material_lava() {
        let vertexShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;
            varying float vNoise;

            float SimplexPerlin3D(vec3 P) {
                const float SKEWFACTOR = 1.0 / 3.0;
                const float UNSKEWFACTOR = 1.0 / 6.0;
                const float SIMPLEX_CORNER_POS = 0.5;
                const float SIMPLEX_TETRAHADRON_HEIGHT = 0.70710678118654752440084436210485;
                P *= SIMPLEX_TETRAHADRON_HEIGHT;
                vec3 Pi = floor(P + dot(P, vec3(SKEWFACTOR)));
                vec3 x0 = P - Pi + dot(Pi, vec3(UNSKEWFACTOR));
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 Pi_1 = min(g.xyz, l.zxy);
                vec3 Pi_2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - Pi_1 + UNSKEWFACTOR;
                vec3 x2 = x0 - Pi_2 + SKEWFACTOR;
                vec3 x3 = x0 - SIMPLEX_CORNER_POS;
                vec4 v1234_x = vec4(x0.x, x1.x, x2.x, x3.x);
                vec4 v1234_y = vec4(x0.y, x1.y, x2.y, x3.y);
                vec4 v1234_z = vec4(x0.z, x1.z, x2.z, x3.z);
                Pi.xyz = Pi.xyz - floor(Pi.xyz * (1.0 / 69.0)) * 69.0;
                vec3 Pi_inc1 = step(Pi, vec3(69.0 - 1.5)) * (Pi + 1.0);
                vec4 Pt = vec4(Pi.xy, Pi_inc1.xy) + vec2(50.0, 161.0).xyxy;
                Pt *= Pt;
                vec4 V1xy_V2xy = mix(Pt.xyxy, Pt.zwzw, vec4(Pi_1.xy, Pi_2.xy));
                Pt = vec4(Pt.x, V1xy_V2xy.xz, Pt.z) * vec4(Pt.y, V1xy_V2xy.yw, Pt.w);
                const vec3 SOMELARGEFLOATS = vec3(635.298681, 682.357502, 668.926525);
                const vec3 ZINC = vec3(48.500388, 65.294118, 63.934599);
                vec3 lowz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi.zzz * ZINC.xyz));
                vec3 highz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi_inc1.zzz * ZINC.xyz));
                Pi_1 = (Pi_1.z < 0.5) ? lowz_mods : highz_mods;
                Pi_2 = (Pi_2.z < 0.5) ? lowz_mods : highz_mods;
                vec4 hash_0 = fract(Pt * vec4(lowz_mods.x, Pi_1.x, Pi_2.x, highz_mods.x)) - 0.49999;
                vec4 hash_1 = fract(Pt * vec4(lowz_mods.y, Pi_1.y, Pi_2.y, highz_mods.y)) - 0.49999;
                vec4 hash_2 = fract(Pt * vec4(lowz_mods.z, Pi_1.z, Pi_2.z, highz_mods.z)) - 0.49999;
                vec4 grad_results = inversesqrt(hash_0 * hash_0 + hash_1 * hash_1 + hash_2 * hash_2) * (hash_0 * v1234_x + hash_1 * v1234_y + hash_2 * v1234_z);
                const float FINAL_NORMALIZATION = 37.837227241611314102871574478976;
                vec4 kernel_weights = v1234_x * v1234_x + v1234_y * v1234_y + v1234_z * v1234_z;
                kernel_weights = max(0.5 - kernel_weights, 0.0);
                kernel_weights = kernel_weights * kernel_weights * kernel_weights;
                return dot(kernel_weights, grad_results) * FINAL_NORMALIZATION;
            }

            float SimplexPerlin2D(vec2 P) {
                const float SKEWFACTOR = 0.36602540378443864676372317075294;
                const float UNSKEWFACTOR = 0.21132486540518711774542560974902;
                const float SIMPLEX_TRI_HEIGHT = 0.70710678118654752440084436210485;
                const vec3 SIMPLEX_POINTS = vec3(1.0 - UNSKEWFACTOR, -UNSKEWFACTOR, 1.0 - 2.0 * UNSKEWFACTOR);
                P *= SIMPLEX_TRI_HEIGHT;
                vec2 Pi = floor(P + dot(P, vec2(SKEWFACTOR)));
                vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
                Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
                Pt += vec2(26.0, 161.0).xyxy;
                Pt *= Pt;
                Pt = Pt.xzxz * Pt.yyww;
                vec4 hash_x = fract(Pt * (1.0 / 951.135664));
                vec4 hash_y = fract(Pt * (1.0 / 642.949883));
                vec2 v0 = Pi - dot(Pi, vec2(UNSKEWFACTOR)) - P;
                vec4 v1pos_v1hash = (v0.x < v0.y) ? vec4(SIMPLEX_POINTS.xy, hash_x.y, hash_y.y) : vec4(SIMPLEX_POINTS.yx, hash_x.z, hash_y.z);
                vec4 v12 = vec4(v1pos_v1hash.xy, SIMPLEX_POINTS.zz) + v0.xyxy;
                vec3 grad_x = vec3(hash_x.x, v1pos_v1hash.z, hash_x.w) - 0.49999;
                vec3 grad_y = vec3(hash_y.x, v1pos_v1hash.w, hash_y.w) - 0.49999;
                vec3 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y) * (grad_x * vec3(v0.x, v12.xz) + grad_y * vec3(v0.y, v12.yw));
                const float FINAL_NORMALIZATION = 99.204334582718712976990005025589;
                vec3 m = vec3(v0.x, v12.xz) * vec3(v0.x, v12.xz) + vec3(v0.y, v12.yw) * vec3(v0.y, v12.yw);
                m = max(0.5 - m, 0.0);
                m = m * m;
                return dot(m * m, grad_results) * FINAL_NORMALIZATION;
            }

            void main(void) {
                vec3 pos = position;
                float noise = SimplexPerlin3D(pos * 0.5 + uTime * 0.75);
                vNoise = noise;
                pos.x += cos(vNoise) * 1.25;
                pos.y += cos(vNoise) * 0.25;
                pos.z += cos(vNoise) * 90.25;
                pos.z += 32.0 * SimplexPerlin2D(uv * 4.0 + uTime * 0.6);
                pos.z += 32.0 * sin(18.0 * length(uv) + uTime * 2.0);
                float smoothEdge = 0.1;
                float edges = (
                    smoothstep(0.0, smoothEdge, uv.x) *
                    smoothstep(0.0, smoothEdge, uv.y) *
                    smoothstep(1.0, 1.0 - smoothEdge, uv.x) *
                    smoothstep(1.0, 1.0 - smoothEdge, uv.y)
                );
                pos.z *= edges;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;
        let fragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying float vNoise;

            vec3 hue_to_rgb(float hue) {
                float R = abs(hue * 6.0 - 3.0) - 1.0;
                float G = 2.0 - abs(hue * 6.0 - 2.0);
                float B = 2.0 - abs(hue * 6.0 - 4.0);
                return saturate(vec3(R, G, B));
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
                float vNoiseBis = smoothstep(vNoise, 0.1, 0.8);
                float vNoiseTer = smoothstep(vNoise, 0.8, 0.5);
                float noise = mix(vNoiseTer, vNoise, 0.15);
                
                float hue = map(noise, 0.0, 1.0, 0.0, 0.15);
                float lightness = map(noise, 0.0, 1.0, 0.4, 0.65);
                vec3 rgb = hsl_to_rgb(vec3(hue, 0.75, lightness));
                gl_FragColor = vec4(rgb, 1.0);
            }
        `;
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
    }
    // ---
    get_material_test_03() {
        let vertexShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;

            float SimplexPerlin3D(vec3 P) {
                const float SKEWFACTOR = 1.0 / 3.0;
                const float UNSKEWFACTOR = 1.0 / 6.0;
                const float SIMPLEX_CORNER_POS = 0.5;
                const float SIMPLEX_TETRAHADRON_HEIGHT = 0.70710678118654752440084436210485;
                P *= SIMPLEX_TETRAHADRON_HEIGHT;
                vec3 Pi = floor(P + dot(P, vec3(SKEWFACTOR)));
                vec3 x0 = P - Pi + dot(Pi, vec3(UNSKEWFACTOR));
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 Pi_1 = min(g.xyz, l.zxy);
                vec3 Pi_2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - Pi_1 + UNSKEWFACTOR;
                vec3 x2 = x0 - Pi_2 + SKEWFACTOR;
                vec3 x3 = x0 - SIMPLEX_CORNER_POS;
                vec4 v1234_x = vec4(x0.x, x1.x, x2.x, x3.x);
                vec4 v1234_y = vec4(x0.y, x1.y, x2.y, x3.y);
                vec4 v1234_z = vec4(x0.z, x1.z, x2.z, x3.z);
                Pi.xyz = Pi.xyz - floor(Pi.xyz * (1.0 / 69.0)) * 69.0;
                vec3 Pi_inc1 = step(Pi, vec3(69.0 - 1.5)) * (Pi + 1.0);
                vec4 Pt = vec4(Pi.xy, Pi_inc1.xy) + vec2(50.0, 161.0).xyxy;
                Pt *= Pt;
                vec4 V1xy_V2xy = mix(Pt.xyxy, Pt.zwzw, vec4(Pi_1.xy, Pi_2.xy));
                Pt = vec4(Pt.x, V1xy_V2xy.xz, Pt.z) * vec4(Pt.y, V1xy_V2xy.yw, Pt.w);
                const vec3 SOMELARGEFLOATS = vec3(635.298681, 682.357502, 668.926525);
                const vec3 ZINC = vec3(48.500388, 65.294118, 63.934599);
                vec3 lowz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi.zzz * ZINC.xyz));
                vec3 highz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi_inc1.zzz * ZINC.xyz));
                Pi_1 = (Pi_1.z < 0.5) ? lowz_mods : highz_mods;
                Pi_2 = (Pi_2.z < 0.5) ? lowz_mods : highz_mods;
                vec4 hash_0 = fract(Pt * vec4(lowz_mods.x, Pi_1.x, Pi_2.x, highz_mods.x)) - 0.49999;
                vec4 hash_1 = fract(Pt * vec4(lowz_mods.y, Pi_1.y, Pi_2.y, highz_mods.y)) - 0.49999;
                vec4 hash_2 = fract(Pt * vec4(lowz_mods.z, Pi_1.z, Pi_2.z, highz_mods.z)) - 0.49999;
                vec4 grad_results = inversesqrt(hash_0 * hash_0 + hash_1 * hash_1 + hash_2 * hash_2) * (hash_0 * v1234_x + hash_1 * v1234_y + hash_2 * v1234_z);
                const float FINAL_NORMALIZATION = 37.837227241611314102871574478976;
                vec4 kernel_weights = v1234_x * v1234_x + v1234_y * v1234_y + v1234_z * v1234_z;
                kernel_weights = max(0.5 - kernel_weights, 0.0);
                kernel_weights = kernel_weights * kernel_weights * kernel_weights;
                return dot(kernel_weights, grad_results) * FINAL_NORMALIZATION;
            }

            void main(void) {
                vColor = position;
                vec3 pos = position;
                float noise = SimplexPerlin3D(vColor * 0.5 + uTime);
                pos.x *= cos(noise);
                pos.y *= cos(noise);
                pos.z *= cos(noise);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `;
        let fragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;

            void main(void) {
                vec3 rgb = vColor;
                rgb = abs(rgb);
                gl_FragColor = vec4(rgb, 1.0);
            }
        `;
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
    }
    // ---
    get_material_test_02() {
        let vertexShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;

            void main(void) {
                vColor = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        let fragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;

            float SimplexPerlin3D(vec3 P) {
                const float SKEWFACTOR = 1.0 / 3.0;
                const float UNSKEWFACTOR = 1.0 / 6.0;
                const float SIMPLEX_CORNER_POS = 0.5;
                const float SIMPLEX_TETRAHADRON_HEIGHT = 0.70710678118654752440084436210485;
                P *= SIMPLEX_TETRAHADRON_HEIGHT;
                vec3 Pi = floor(P + dot(P, vec3(SKEWFACTOR)));
                vec3 x0 = P - Pi + dot(Pi, vec3(UNSKEWFACTOR));
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 Pi_1 = min(g.xyz, l.zxy);
                vec3 Pi_2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - Pi_1 + UNSKEWFACTOR;
                vec3 x2 = x0 - Pi_2 + SKEWFACTOR;
                vec3 x3 = x0 - SIMPLEX_CORNER_POS;
                vec4 v1234_x = vec4(x0.x, x1.x, x2.x, x3.x);
                vec4 v1234_y = vec4(x0.y, x1.y, x2.y, x3.y);
                vec4 v1234_z = vec4(x0.z, x1.z, x2.z, x3.z);
                Pi.xyz = Pi.xyz - floor(Pi.xyz * (1.0 / 69.0)) * 69.0;
                vec3 Pi_inc1 = step(Pi, vec3(69.0 - 1.5)) * (Pi + 1.0);
                vec4 Pt = vec4(Pi.xy, Pi_inc1.xy) + vec2(50.0, 161.0).xyxy;
                Pt *= Pt;
                vec4 V1xy_V2xy = mix(Pt.xyxy, Pt.zwzw, vec4(Pi_1.xy, Pi_2.xy));
                Pt = vec4(Pt.x, V1xy_V2xy.xz, Pt.z) * vec4(Pt.y, V1xy_V2xy.yw, Pt.w);
                const vec3 SOMELARGEFLOATS = vec3(635.298681, 682.357502, 668.926525);
                const vec3 ZINC = vec3(48.500388, 65.294118, 63.934599);
                vec3 lowz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi.zzz * ZINC.xyz));
                vec3 highz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi_inc1.zzz * ZINC.xyz));
                Pi_1 = (Pi_1.z < 0.5) ? lowz_mods : highz_mods;
                Pi_2 = (Pi_2.z < 0.5) ? lowz_mods : highz_mods;
                vec4 hash_0 = fract(Pt * vec4(lowz_mods.x, Pi_1.x, Pi_2.x, highz_mods.x)) - 0.49999;
                vec4 hash_1 = fract(Pt * vec4(lowz_mods.y, Pi_1.y, Pi_2.y, highz_mods.y)) - 0.49999;
                vec4 hash_2 = fract(Pt * vec4(lowz_mods.z, Pi_1.z, Pi_2.z, highz_mods.z)) - 0.49999;
                vec4 grad_results = inversesqrt(hash_0 * hash_0 + hash_1 * hash_1 + hash_2 * hash_2) * (hash_0 * v1234_x + hash_1 * v1234_y + hash_2 * v1234_z);
                const float FINAL_NORMALIZATION = 37.837227241611314102871574478976;
                vec4 kernel_weights = v1234_x * v1234_x + v1234_y * v1234_y + v1234_z * v1234_z;
                kernel_weights = max(0.5 - kernel_weights, 0.0);
                kernel_weights = kernel_weights * kernel_weights * kernel_weights;
                return dot(kernel_weights, grad_results) * FINAL_NORMALIZATION;
            }

            void main(void) {
                vec3 rgb = vColor;
                float noise = SimplexPerlin3D(rgb * 0.5 + uTime);
                gl_FragColor = vec4(noise, noise / 2.1, noise * 2.1, 1.0);
            }
        `;
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
    }
    // ---
    get_material_test_01() {
        let vertexShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;

            void main(void) {
                vColor = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        let fragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;

            float SimplexPerlin3D(vec3 P) {
                const float SKEWFACTOR = 1.0 / 3.0;
                const float UNSKEWFACTOR = 1.0 / 6.0;
                const float SIMPLEX_CORNER_POS = 0.5;
                const float SIMPLEX_TETRAHADRON_HEIGHT = 0.70710678118654752440084436210485;
                P *= SIMPLEX_TETRAHADRON_HEIGHT;
                vec3 Pi = floor(P + dot(P, vec3(SKEWFACTOR)));
                vec3 x0 = P - Pi + dot(Pi, vec3(UNSKEWFACTOR));
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 Pi_1 = min(g.xyz, l.zxy);
                vec3 Pi_2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - Pi_1 + UNSKEWFACTOR;
                vec3 x2 = x0 - Pi_2 + SKEWFACTOR;
                vec3 x3 = x0 - SIMPLEX_CORNER_POS;
                vec4 v1234_x = vec4(x0.x, x1.x, x2.x, x3.x);
                vec4 v1234_y = vec4(x0.y, x1.y, x2.y, x3.y);
                vec4 v1234_z = vec4(x0.z, x1.z, x2.z, x3.z);
                Pi.xyz = Pi.xyz - floor(Pi.xyz * (1.0 / 69.0)) * 69.0;
                vec3 Pi_inc1 = step(Pi, vec3(69.0 - 1.5)) * (Pi + 1.0);
                vec4 Pt = vec4(Pi.xy, Pi_inc1.xy) + vec2(50.0, 161.0).xyxy;
                Pt *= Pt;
                vec4 V1xy_V2xy = mix(Pt.xyxy, Pt.zwzw, vec4(Pi_1.xy, Pi_2.xy));
                Pt = vec4(Pt.x, V1xy_V2xy.xz, Pt.z) * vec4(Pt.y, V1xy_V2xy.yw, Pt.w);
                const vec3 SOMELARGEFLOATS = vec3(635.298681, 682.357502, 668.926525);
                const vec3 ZINC = vec3(48.500388, 65.294118, 63.934599);
                vec3 lowz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi.zzz * ZINC.xyz));
                vec3 highz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi_inc1.zzz * ZINC.xyz));
                Pi_1 = (Pi_1.z < 0.5) ? lowz_mods : highz_mods;
                Pi_2 = (Pi_2.z < 0.5) ? lowz_mods : highz_mods;
                vec4 hash_0 = fract(Pt * vec4(lowz_mods.x, Pi_1.x, Pi_2.x, highz_mods.x)) - 0.49999;
                vec4 hash_1 = fract(Pt * vec4(lowz_mods.y, Pi_1.y, Pi_2.y, highz_mods.y)) - 0.49999;
                vec4 hash_2 = fract(Pt * vec4(lowz_mods.z, Pi_1.z, Pi_2.z, highz_mods.z)) - 0.49999;
                vec4 grad_results = inversesqrt(hash_0 * hash_0 + hash_1 * hash_1 + hash_2 * hash_2) * (hash_0 * v1234_x + hash_1 * v1234_y + hash_2 * v1234_z);
                const float FINAL_NORMALIZATION = 37.837227241611314102871574478976;
                vec4 kernel_weights = v1234_x * v1234_x + v1234_y * v1234_y + v1234_z * v1234_z;
                kernel_weights = max(0.5 - kernel_weights, 0.0);
                kernel_weights = kernel_weights * kernel_weights * kernel_weights;
                return dot(kernel_weights, grad_results) * FINAL_NORMALIZATION;
            }

            void main(void) {
                vec3 rgb = vColor;
                float noise = SimplexPerlin3D(rgb * 0.5 + uTime);
                rgb.r *= sin(noise);
                rgb.r += noise;
                rgb.g *= sin(noise);
                rgb.g += noise;
                rgb.b *= sin(noise);
                rgb.b += noise;
                gl_FragColor = vec4(rgb, 1.0);
            }
        `;
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
    }
    // ---
    get_material_noise(parameterColor) {
        this.material = new THREE.MeshLambertMaterial({
            color: parameterColor
        });
        this.material.onBeforeCompile = shader => {
            const tokenFragment = '#include <envmap_fragment>';
            const renderFragment = `
                float noise = SimplexPerlin3D(outgoingLight * 100000000.0);
                noise = mix(0.75, 1.0, noise) * 1.5;
                outgoingLight.x /= noise;
                outgoingLight.y /= noise;
                outgoingLight.z /= noise;
            `;
            shader.fragmentShader = `
                float SimplexPerlin3D(vec3 P) {
                const float SKEWFACTOR = 1.0 / 3.0;
                const float UNSKEWFACTOR = 1.0 / 6.0;
                const float SIMPLEX_CORNER_POS = 0.5;
                const float SIMPLEX_TETRAHADRON_HEIGHT = 0.70710678118654752440084436210485;
                P *= SIMPLEX_TETRAHADRON_HEIGHT;
                vec3 Pi = floor(P + dot(P, vec3(SKEWFACTOR)));
                //  Find the vectors to the corners of our simplex tetrahedron
                vec3 x0 = P - Pi + dot(Pi, vec3(UNSKEWFACTOR));
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 Pi_1 = min(g.xyz, l.zxy);
                vec3 Pi_2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - Pi_1 + UNSKEWFACTOR;
                vec3 x2 = x0 - Pi_2 + SKEWFACTOR;
                vec3 x3 = x0 - SIMPLEX_CORNER_POS;
                vec4 v1234_x = vec4(x0.x, x1.x, x2.x, x3.x);
                vec4 v1234_y = vec4(x0.y, x1.y, x2.y, x3.y);
                vec4 v1234_z = vec4(x0.z, x1.z, x2.z, x3.z);
                Pi.xyz = Pi.xyz - floor(Pi.xyz * (1.0 / 69.0)) * 69.0;
                vec3 Pi_inc1 = step(Pi, vec3(69.0 - 1.5)) * (Pi + 1.0);
                vec4 Pt = vec4(Pi.xy, Pi_inc1.xy) + vec2(50.0, 161.0).xyxy;
                Pt *= Pt;
                vec4 V1xy_V2xy = mix(Pt.xyxy, Pt.zwzw, vec4(Pi_1.xy, Pi_2.xy));
                Pt = vec4(Pt.x, V1xy_V2xy.xz, Pt.z) * vec4(Pt.y, V1xy_V2xy.yw, Pt.w);
                const vec3 SOMELARGEFLOATS = vec3(635.298681, 682.357502, 668.926525);
                const vec3 ZINC = vec3(48.500388, 65.294118, 63.934599);
                vec3 lowz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi.zzz * ZINC.xyz));
                vec3 highz_mods = vec3(1.0 / (SOMELARGEFLOATS.xyz + Pi_inc1.zzz * ZINC.xyz));
                Pi_1 = (Pi_1.z < 0.5) ? lowz_mods : highz_mods;
                Pi_2 = (Pi_2.z < 0.5) ? lowz_mods : highz_mods;
                vec4 hash_0 = fract(Pt * vec4(lowz_mods.x, Pi_1.x, Pi_2.x, highz_mods.x)) - 0.49999;
                vec4 hash_1 = fract(Pt * vec4(lowz_mods.y, Pi_1.y, Pi_2.y, highz_mods.y)) - 0.49999;
                vec4 hash_2 = fract(Pt * vec4(lowz_mods.z, Pi_1.z, Pi_2.z, highz_mods.z)) - 0.49999;
                vec4 grad_results = inversesqrt(hash_0 * hash_0 + hash_1 * hash_1 + hash_2 * hash_2) * (hash_0 * v1234_x + hash_1 * v1234_y + hash_2 * v1234_z);
                const float FINAL_NORMALIZATION = 37.837227241611314102871574478976;
                vec4 kernel_weights = v1234_x * v1234_x + v1234_y * v1234_y + v1234_z * v1234_z;
                kernel_weights = max(0.5 - kernel_weights, 0.0);
                kernel_weights = kernel_weights * kernel_weights * kernel_weights;
                return dot(kernel_weights, grad_results) * FINAL_NORMALIZATION;
            }
            ${shader.fragmentShader.replace(tokenFragment, renderFragment)}
        `;
        }
    }
    // ---
    get_material_opacity(parameterColor) {
        this.material = new THREE.MeshLambertMaterial({
            color: parameterColor,
            transparent: true,
            opacity: 0.5
        });
    }
    // ---
    get_material_default() {
        let vertexShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;

            void main(void) {
                vColor = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        let fragmentShader = `
            uniform float uTime;
            uniform vec2 uResolution;
            varying vec3 vColor;

            void main(void) {
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
    }
    // ---
    get_mouse_position(e) {
        if (this.mouseClicked) {
            this.uniforms.uMouse = { type: "v2", value: new THREE.Vector2(e.clientX, e.clientY) };
        }
    }
    // --- --- --- --- --- --- --- --- ---
    set_mouse_clicked() {
        this.mouseClicked = !this.mouseClicked;
    }
}