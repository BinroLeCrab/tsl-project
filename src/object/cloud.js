import * as THREE from "three/webgpu";
import baseNodeMaterial from "../material/BaseNodeMaterial";
import cloudMaterial from "../material/CloudMaterial";

export default class Cloud extends THREE.Mesh {
	constructor(size = 2) {
		// const geometry = new THREE.BoxGeometry(size, size, size);
		const geometry = new THREE.SphereGeometry(size, 64, 64);
		const material = cloudMaterial;

		super(geometry, material);

		this.material.side = THREE.DoubleSide;
	}
}
