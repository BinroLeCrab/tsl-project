import { color } from "three/tsl";
import * as THREE from "three/webgpu";

class GroundMaterial extends THREE.MeshStandardNodeMaterial {
	constructor(parameters) {
		super(parameters);

		this.colorNode = color("#2d3441");
		this.metalness = 0.7;
		this.roughness = 0.25;
	}
}

const groundMaterial = new GroundMaterial();

export default groundMaterial;