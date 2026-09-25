import { color, mix, normalView, sin, time, uniform, vec3 } from "three/tsl";
import * as THREE from "three/webgpu";
import { fresnel, smoothCircle } from "../shaders/fragmentShaders";

class SunMaterial extends THREE.MeshStandardNodeMaterial {
	constructor(parameters) {
		super(parameters);

		const baseColor = mix(
			color("#d0daf6"),
			color("#f5e696"),
			sin(time).mul(0.5).add(0.5)
		);

		this.radius = uniform(0.5).mul(sin(time).add(1).mul(0.5).mul(0.1).add(0.8));

		this.colorNode = smoothCircle({
			foreground: baseColor,
			background: vec3(0.0),
			radius: this.radius,
			smoothness: 0.1,
		});
        this.emissiveNode = this.colorNode;
		this.depthWrite = false;

		this.transparent = true;
	}

	setOpacity(opacity = uniform(0)) {
		this.opacityNode = this.colorNode.mul(0.8).mul(opacity);
	}
}

const sunMaterial = new SunMaterial();

export default sunMaterial;