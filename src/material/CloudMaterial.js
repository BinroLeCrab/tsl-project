import { color, mix, normalView, positionGeometry, positionLocal, sin, time, uv, vec3 } from "three/tsl";
import * as THREE from "three/webgpu";
import { fresnel, noiseUnifiedFractal2D } from "../shaders/fragmentShaders";
import { smoothstep } from "three/src/math/MathUtils.js";

class CloudMaterial extends THREE.MeshBasicNodeMaterial {
	constructor(parameters) {
		super(parameters);

		const baseColor = mix(
			color("#1e3a8a"),
			color("#f472b6"),
			sin(time).mul(0.5).add(0.5)
		);

		this.colorNode = mix(0.0, 1.0, noiseUnifiedFractal2D());
		// this.colorNode = vec3(uv().y);
		// this.opacityNode = mix(0.0, smoothstep(0.65, 0.7,this.colorNode), uv().x);
		this.opacityNode = 0.1;
		this.side = THREE.DoubleSide;
		this.transparent = true;
		this.depthWrite = false;
	}
}

const cloudMaterial = new CloudMaterial();

export default cloudMaterial;