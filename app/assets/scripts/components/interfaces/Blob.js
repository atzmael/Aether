import { Material } from "cannon";
import Shader from "three-shaders";

export default class Blob {
    constructor(scene) {
        this.scene = scene;
        this.emotions = ['neutral', 'anger', 'sadness', 'joy', 'fear'];
        this.groupBlob = new THREE.Object3D();
        this.blob = null;
        this.bubbles = [];
        this.initialize();
    }
    initialize() {
        this.add_blob();
        for (let i = 0; i < this.emotions.length; i++) {
            const emotion = this.emotions[i];
            this.add_bubble(emotion);
        }
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
        for (const bubble of this.bubbles) {
            if (bubble) {
                bubble.material.uniforms.uTime.value = currentTime;
                bubble.position.x = Math.sin(currentTime * bubble.velocity.x + bubble.position._x);
                bubble.position.y = Math.sin(currentTime * bubble.velocity.y + bubble.position._y);
                bubble.position.z = Math.sin(currentTime * bubble.velocity.z + bubble.position._z);
            }
        }
    }
    // ---
    add_blob() {
        let geometry = new THREE.IcosahedronBufferGeometry(2.5, 4);
        let material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uTime: {
                    type: "f",
                    value: 0.0
                },
                resolution: {
                    type: "v2",
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                }
            },
            vertexShader: `
                uniform float uTime;
                uniform vec2 uResolution;
                varying vec3 vPosition;

                void main(void) {
                    // vUv = uv;
                    vPosition = position;
                    gl_PointSize = 1.5;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uResolution;
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
                    float noise = SimplexPerlin3D(vPosition * 0.75 + uTime * 0.75);
                    noise = map(noise, 0.0, 1.0, 0.0, 0.1);

                    float hue = map(noise, 0.0, 1.0, 0.6, 0.75);
                    hue = 0.0;

                    float saturation = map(noise, 0.0, 1.0, 0.5, 1.0);
                    saturation = 0.50;

                    float lightness = map(noise, 0.0, 1.0, 0.25, 0.75);
                    lightness = 1.0;

                    vec3 rgb = hsl_to_rgb(vec3(hue, saturation, lightness));
                    gl_FragColor = vec4(rgb, noise);
                }
            `
        });
        let shape = new THREE.Points(geometry, material);
        shape.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
        shape.position.set(0, 0, 0);
        this.scene.add(shape);
        this.groupBlob.add(shape);
        this.blob = shape;
    }
    add_bubble(parameterColor) {
        let color = {
            hue: {
                min: 0.0,
                max: 0.0
            },
            saturation: 0.5,
            lightness: 0.5
        }
        switch (parameterColor) {
            case 'neutral':
                color.lightness = 1.0;
                break;
            case 'sadness':
                color.hue.min = 0.6;
                color.hue.max = 0.65;
                break;
            case 'anger':
                color.hue.min = 0.05;
                color.hue.max = 0.1;
                break;
            case 'joy':
                color.hue.min = 0.15;
                color.hue.max = 0.2;
                break;
            case 'fear':
                color.hue.min = 0.3;
                color.hue.max = 0.35;
                break;
        }

        let geometry = new THREE.IcosahedronBufferGeometry(0.75, 3);
        let material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uTime: { type: "f", value: 0.0 },
                uResolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uHueMin: { type: "f", value: color.hue.min },
                uHueMax: { type: "f", value: color.hue.max },
                uSaturation: { type: "f", value: color.saturation },
                uLightness: { type: "f", value: color.lightness },
                uRandom: { type: "f", value: this.get_random_interval(-1.0, 1.0) }
            },
            vertexShader: `
                uniform float uTime;
                uniform vec2 uResolution;
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
                uniform float uSaturation;
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
                    hue = floor(hue * 50.0) / 50.0;
                    // hue = 0.0;

                    // float saturation = map(noise, 0.0, 1.0, 0.5, 1.0);
                    // saturation = floor(saturation * 50.0) / 50.0;
                    float saturation = uSaturation;

                    // float lightness = map(noise, 0.0, 1.0, 0.25, 0.75);
                    // lightness = floor(lightness * 50.0) / 50.0;
                    float lightness = uLightness;

                    vec3 rgb = hsl_to_rgb(vec3(hue, saturation, lightness));
                    gl_FragColor = vec4(rgb, 0.95);
                }
            `
        });
        let shape = new THREE.Mesh(geometry, material);

        let randomX = this.get_random_interval(-1.5, 1.5) * (Math.random() < 0.5 ? -1 : 1);
        let randomY = this.get_random_interval(-1.5, 1.5) * (Math.random() < 0.5 ? -1 : 1);
        let randomZ = this.get_random_interval(-1.5, 1.5) * (Math.random() < 0.5 ? -1 : 1);

        shape.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);

        shape.velocity= {};

        shape.position.x = randomX;
        shape.position._x = randomX;
        shape.velocity.x = randomX;

        shape.position.y = randomY;
        shape.position._y = randomY;
        shape.velocity.y = randomY;

        shape.position.z = randomZ;
        shape.position._z = randomZ;
        shape.velocity.z = randomZ;

        this.scene.add(shape);
        this.groupBlob.add(shape);
        this.bubbles.push(shape);
    }
    // --- 
    get_random_interval(min, max) {
        return Math.random() * (max - min) + min;
    }
}

    // update (time) {
    //     // if (this.blob) {
    //     //     this.blob.material.uniforms.time.value = time / 1000;
    //     // }
    //     // for (const bubble of this.bubbles) {
    //     //     if (bubble) {
    //     //         let currentTime = time / 1000;
    //     //         bubble.material.uniforms.time.value = currentTime;
    //     //         bubble.position.x = (bubble.direction) ?
    //     //             Math.sin(currentTime * bubble.velocity.x + bubble.position._x):
    //     //             Math.cos(currentTime * bubble.velocity.x + bubble.position._x);
    //     //         bubble.position.y = (bubble.direction) ?
    //     //             Math.sin(currentTime * bubble.velocity.y + bubble.position._y) :
    //     //             Math.cos(currentTime * bubble.velocity.y + bubble.position._y);
    //     //         bubble.position.z = (bubble.direction) ?
    //     //             Math.sin(currentTime * bubble.velocity.z + bubble.position._z) :
    //     //             Math.cos(currentTime * bubble.velocity.z + bubble.position._z);
    //     //     }
    //     // }
    //     if (this.test_blob) {
    //         this.test_blob.material.uniforms.uTime.value = time / 1000;
    //     }
    //     for (const bubble of this.test_bubble) {
    //         if (bubble) {
    //             bubble.material.uniforms.uTime.value = time / 1000;
    //         }
    //     }
    // }
    // // ---
    // add_blob () {
    //     this.geometry = new THREE.SphereBufferGeometry(1, 288, 288);
    //     this.material = new THREE.ShaderMaterial({
    //         uniforms: {
    //             time: { type: "f", value: 0.0 },
    //             resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    //         },
    //         vertexShader: `
    //             uniform float time;
    //             varying vec3 vNormal;
    //             varying vec2 vUv;

    //             float SimplexPerlin2D(vec2 P) {
    //                 const float SKEWFACTOR = 0.36602540378443864676372317075294;
    //                 const float UNSKEWFACTOR = 0.21132486540518711774542560974902;
    //                 const float SIMPLEX_TRI_HEIGHT = 0.70710678118654752440084436210485;
    //                 const vec3 SIMPLEX_POINTS = vec3(1.0 - UNSKEWFACTOR, -UNSKEWFACTOR, 1.0 - 2.0 * UNSKEWFACTOR);
    //                 P *= SIMPLEX_TRI_HEIGHT;
    //                 vec2 Pi = floor(P + dot(P, vec2(SKEWFACTOR)));
    //                 vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    //                 Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    //                 Pt += vec2(26.0, 161.0).xyxy;
    //                 Pt *= Pt;
    //                 Pt = Pt.xzxz * Pt.yyww;
    //                 vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    //                 vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    //                 vec2 v0 = Pi - dot(Pi, vec2(UNSKEWFACTOR)) - P;
    //                 vec4 v1pos_v1hash = (v0.x < v0.y) ? vec4(SIMPLEX_POINTS.xy, hash_x.y, hash_y.y) : vec4(SIMPLEX_POINTS.yx, hash_x.z, hash_y.z);
    //                 vec4 v12 = vec4(v1pos_v1hash.xy, SIMPLEX_POINTS.zz) + v0.xyxy;
    //                 vec3 grad_x = vec3(hash_x.x, v1pos_v1hash.z, hash_x.w) - 0.49999;
    //                 vec3 grad_y = vec3(hash_y.x, v1pos_v1hash.w, hash_y.w) - 0.49999;
    //                 vec3 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y) * (grad_x * vec3(v0.x, v12.xz) + grad_y * vec3(v0.y, v12.yw));
    //                 const float FINAL_NORMALIZATION = 99.204334582718712976990005025589;
    //                 vec3 m = vec3(v0.x, v12.xz) * vec3(v0.x, v12.xz) + vec3(v0.y, v12.yw) * vec3(v0.y, v12.yw);
    //                 m = max(0.5 - m, 0.0);
    //                 m = m * m;
    //                 return dot(m * m, grad_results) * FINAL_NORMALIZATION;
    //             }

    //             void main() {
    //                 vec3 newPos = vec3(position);
    //                 float freq = 10.0;
    //                 float amp = 0.015;

    //                 float ang = SimplexPerlin2D(uv * 4.0 + time * 0.1) * freq;

    //                 newPos.x += sin(ang) * amp;
    //                 newPos.y += sin(ang) * amp;
    //                 newPos.z += sin(ang) * amp;

    //                 newPos = newPos * 2.0;

    //                 vNormal = normal;

    //                 vUv = uv;

    //                 gl_PointSize = .750; 
    //                 gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    //             }



    //             // vec4 mod289 (vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    //             // vec4 permute (vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    //             // vec4 taylorInvSqrt (vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    //             // vec2 fade (vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

    //             // // Classic 2D Perlin noise
    //             // float cnoise (vec2 P) {
    //             //     vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    //             //     vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    //             //     Pi = mod289(Pi); // To avoid truncation effects in permutation
    //             //     vec4 ix = Pi.xzxz;
    //             //     vec4 iy = Pi.yyww;
    //             //     vec4 fx = Pf.xzxz;
    //             //     vec4 fy = Pf.yyww;
                    
    //             //     vec4 i = permute(permute(ix) + iy);
                    
    //             //     vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
    //             //     vec4 gy = abs(gx) - 0.5 ;
    //             //     vec4 tx = floor(gx + 0.5);
    //             //     gx = gx - tx;
                    
    //             //     vec2 g00 = vec2(gx.x,gy.x);
    //             //     vec2 g10 = vec2(gx.y,gy.y);
    //             //     vec2 g01 = vec2(gx.z,gy.z);
    //             //     vec2 g11 = vec2(gx.w,gy.w);
                    
    //             //     vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    //             //     g00 *= norm.x;  
    //             //     g01 *= norm.y;  
    //             //     g10 *= norm.z;  
    //             //     g11 *= norm.w;  
                    
    //             //     float n00 = dot(g00, vec2(fx.x, fy.x));
    //             //     float n10 = dot(g10, vec2(fx.y, fy.y));
    //             //     float n01 = dot(g01, vec2(fx.z, fy.z));
    //             //     float n11 = dot(g11, vec2(fx.w, fy.w));
                    
    //             //     vec2 fade_xy = fade(Pf.xy);
    //             //     vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    //             //     float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    //             //     return 2.3 * n_xy;
    //             // }


    //             // float noise(vec2 p){         
    //             //     return  0.4 * cnoise(p);    
    //             // }

    //             // float pattern(vec2 uv, float time){   
                    
    //             //     //instead of just getting a noise field value on uv position and time,
    //             //     //we first warp the uv space by noise a couple of times
    //             //     //this gives more intersting 'curly' looking noise
    //             //     //this is known as domain warping: http://www.iquilezles.org/www/articles/warp/warp.htm
                    
    //             //     //get a noise value q
    //             //     vec2 q = vec2(9.0, 0.);
    //             //     q.y = noise(uv + vec2(5.2*time,1.3*time)) ;
                    
    //             //     //now warp uv space by q and get noise on that
    //             //     vec2 r = vec2(0.);
    //             //     r.x = noise(uv + 5.0 * q);
                    
    //             //     //now warp uv space by r and get noise on that
    //             //     return noise(uv + 6.0*r);

    //             // }

    //             // const float SCALE = 7.5;
    //             // const float BRIGHTNESS = 6.5;
    //             // const float SPEED = 0.25;

    //             // uniform float time;
    //             // varying vec3 vNormal;
    //             // varying vec2 vUv;
    //             // varying vec3 pos;

    //             // void main() {
    //             //     vec2 test = vec2(uv);
    //             //     test *= SCALE;
    //             //     float time = time*SPEED;
    //             //     vec3 color = vec3(pattern(test,time)*BRIGHTNESS);
    //             //     vec3 newPos = vec3(position);
    //             //     newPos.x += sin(color.x) * 0.025;
    //             //     newPos.y += sin(color.y) * 0.025;
    //             //     newPos.z += sin(color.z) * 0.025;
    //             //     vNormal = vec3(normal);
    //             //     vUv = vec2(uv);
    //             //     pos = vec3(newPos);
    //             //     gl_PointSize = 1.0; 
    //             //     gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    //             // }
    //         `,
    //         fragmentShader: `
    //             uniform float time;
    //             varying vec3 vNormal;

    //             void main() {
    //                 vec3 light = vec3(1.0, 0.0, 1.0);

    //                 light = normalize(light);
    //                 float dProd = max(0.1, dot(vNormal, light));

    //                 gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    //             }

    //             // uniform float time;
    //             // varying vec3 vNormal;
    //             // varying vec2 vUv;

    //             // float SimplexPerlin2D(vec2 P) {
    //             //     const float SKEWFACTOR = 0.36602540378443864676372317075294;
    //             //     const float UNSKEWFACTOR = 0.21132486540518711774542560974902;
    //             //     const float SIMPLEX_TRI_HEIGHT = 0.70710678118654752440084436210485;
    //             //     const vec3 SIMPLEX_POINTS = vec3(1.0 - UNSKEWFACTOR, -UNSKEWFACTOR, 1.0 - 2.0 * UNSKEWFACTOR);
    //             //     P *= SIMPLEX_TRI_HEIGHT;
    //             //     vec2 Pi = floor(P + dot(P, vec2(SKEWFACTOR)));
    //             //     vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    //             //     Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    //             //     Pt += vec2(26.0, 161.0).xyxy;
    //             //     Pt *= Pt;
    //             //     Pt = Pt.xzxz * Pt.yyww;
    //             //     vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    //             //     vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    //             //     vec2 v0 = Pi - dot(Pi, vec2(UNSKEWFACTOR)) - P;
    //             //     vec4 v1pos_v1hash = (v0.x < v0.y) ? vec4(SIMPLEX_POINTS.xy, hash_x.y, hash_y.y) : vec4(SIMPLEX_POINTS.yx, hash_x.z, hash_y.z);
    //             //     vec4 v12 = vec4(v1pos_v1hash.xy, SIMPLEX_POINTS.zz) + v0.xyxy;
    //             //     vec3 grad_x = vec3(hash_x.x, v1pos_v1hash.z, hash_x.w) - 0.49999;
    //             //     vec3 grad_y = vec3(hash_y.x, v1pos_v1hash.w, hash_y.w) - 0.49999;
    //             //     vec3 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y) * (grad_x * vec3(v0.x, v12.xz) + grad_y * vec3(v0.y, v12.yw));
    //             //     const float FINAL_NORMALIZATION = 99.204334582718712976990005025589;
    //             //     vec3 m = vec3(v0.x, v12.xz) * vec3(v0.x, v12.xz) + vec3(v0.y, v12.yw) * vec3(v0.y, v12.yw);
    //             //     m = max(0.5 - m, 0.0);
    //             //     m = m * m;
    //             //     return dot(m * m, grad_results) * FINAL_NORMALIZATION;
    //             // }

    //             // void main() {
    //             //     vec3 color = vec3(0.0);
    //             //     float freq = 20.0;

    //             //     float ang = SimplexPerlin2D(vUv * 4.0 + time * 0.5) * freq;

    //             //     color.x = abs(sin(ang));
    //             //     color.y = abs(sin(ang));
    //             //     color.z = abs(sin(ang));

    //             //     gl_FragColor = vec4(color, 1.0);
    //             // }





    //             // vec4 mod289 (vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    //             // vec4 permute (vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    //             // vec4 taylorInvSqrt (vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    //             // vec2 fade (vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

    //             // // Classic 2D Perlin noise
    //             // float cnoise (vec2 P) {
    //             //     vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    //             //     vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    //             //     Pi = mod289(Pi); // To avoid truncation effects in permutation
    //             //     vec4 ix = Pi.xzxz;
    //             //     vec4 iy = Pi.yyww;
    //             //     vec4 fx = Pf.xzxz;
    //             //     vec4 fy = Pf.yyww;
                    
    //             //     vec4 i = permute(permute(ix) + iy);
                    
    //             //     vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
    //             //     vec4 gy = abs(gx) - 0.5 ;
    //             //     vec4 tx = floor(gx + 0.5);
    //             //     gx = gx - tx;
                    
    //             //     vec2 g00 = vec2(gx.x,gy.x);
    //             //     vec2 g10 = vec2(gx.y,gy.y);
    //             //     vec2 g01 = vec2(gx.z,gy.z);
    //             //     vec2 g11 = vec2(gx.w,gy.w);
                    
    //             //     vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    //             //     g00 *= norm.x;  
    //             //     g01 *= norm.y;  
    //             //     g10 *= norm.z;  
    //             //     g11 *= norm.w;  
                    
    //             //     float n00 = dot(g00, vec2(fx.x, fy.x));
    //             //     float n10 = dot(g10, vec2(fx.y, fy.y));
    //             //     float n01 = dot(g01, vec2(fx.z, fy.z));
    //             //     float n11 = dot(g11, vec2(fx.w, fy.w));
                    
    //             //     vec2 fade_xy = fade(Pf.xy);
    //             //     vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    //             //     float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    //             //     return 2.3 * n_xy;
    //             // }


    //             // float noise(vec2 p){         
    //             //     return  0.4 * cnoise(p);    
    //             // }

    //             // float pattern(vec2 uv, float time){   
                    
    //             //     //instead of just getting a noise field value on uv position and time,
    //             //     //we first warp the uv space by noise a couple of times
    //             //     //this gives more intersting 'curly' looking noise
    //             //     //this is known as domain warping: http://www.iquilezles.org/www/articles/warp/warp.htm
                    
    //             //     //get a noise value q
    //             //     vec2 q = vec2(9.0, 0.);
    //             //     q.y = noise(uv + vec2(5.2*time,1.3*time)) ;
                    
    //             //     //now warp uv space by q and get noise on that
    //             //     vec2 r = vec2(0.);
    //             //     r.x = noise(uv + 5.0 * q);
                    
    //             //     //now warp uv space by r and get noise on that
    //             //     return noise(uv + 6.0*r);

    //             // }

    //             // const float SCALE = 1.5;
    //             // const float BRIGHTNESS = 10.0;
    //             // const float SPEED = 0.025;

    //             // uniform float time;
    //             // varying vec2 vUv;
    //             // varying vec3 pos;

    //             // void main() {
    //             //     vec2 test = vec2(vUv);
    //             //     // test *= SCALE;
    //             //     float time = time*SPEED;
    //             //     vec3 color = vec3(pattern(test, time) * BRIGHTNESS - 1.0, 1.0, 1.0);
    //             //     gl_FragColor = vec4(color.x, color.y, color.z, 1.0);
    //             // }

    //             // uniform float time;
    //             // uniform vec2 resolution;
    //             // varying vec3 vNormal;
    //             // varying vec2 vUv;

    //             // void main(void) {
    //             //     vec2 p = 2.8 * (2.0 * gl_FragCoord.xy - resolution) /
    //             //         max(resolution.x, resolution.y);

    //             //     for (int i = 1; i < 19; i++) {
    //             //         vec2 newp = p;
    //             //         float speed = 123.0; // speed control
    //             //         newp.x += 0.4 / float(i) * sin(float(i) * p.y + time / (100.0 / speed) + 0.3 * float(i)) + 1.0;
    //             //         newp.y += 0.6 / float(i) * sin(float(i) * p.x + time / (100.0 / speed) + 0.3 * float(i + 10)) - 1.4;
    //             //         p = newp;
    //             //     }
    //             //     float col = 0.5 + (sin(p.x) + cos(p.y)) / 5.;
    //             //     // gl_FragColor = vec4(col * 2., col * 2., col * 2., 1.0);
    //             //     // gl_FragColor = vec4(col / 5., col * 1., col / 2., 0.1);
    //             //     // gl_FragColor = vec4(col / 5., col * 1., col * 2., 1.0);
    //             //     // gl_FragColor = vec4(col * 5.5, col * 5.5, col / .75, 1.0);
    //             //     // gl_FragColor = vec4(col * 5.5, col / 1.25, col / 2.5, 1.0);
    //             // }
    //         `
    //     });

    //     this.blob = new THREE.Points(this.geometry, this.material);
    //     this.blob.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/2);
    //     this.scene.add(new THREE.Object3D().add(this.blob));
    // }
    // // ---
   