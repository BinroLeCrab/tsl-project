import { color } from "three/tsl";
import * as THREE from "three/webgpu";

class GroundMaterial extends THREE.MeshBasicNodeMaterial {
	constructor(parameters) {
		super(parameters);

		this.colorNode = color("#2d3441");
	}
}

const groundMaterial = new GroundMaterial();

export default groundMaterial;