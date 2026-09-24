import * as THREE from "three/webgpu";
import baseNodeMaterial from "../material/BaseNodeMaterial";

export default class BaseObject extends THREE.Mesh {
	constructor(size = 2) {
		// const geometry = new THREE.BoxGeometry(size, size, size);
		const geometry = new THREE.SphereGeometry(size, 64, 64);
		const material = baseNodeMaterial;

		super(geometry, material);
	}
}
