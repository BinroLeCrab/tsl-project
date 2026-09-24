import { color, mix, normalView, sin, texture, time, uv, vec3 } from "three/tsl";
import * as THREE from "three/webgpu";
import { fresnel } from "../shaders/fragmentShaders";

const loader = new THREE.TextureLoader();

function load(file, colorSpace) {
	const map = loader.load(`/texture/${file}`);

	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.anisotropy = 8;
	if (colorSpace) map.colorSpace = colorSpace;

	return map;
}

class SwordMaterial extends THREE.MeshStandardNodeMaterial {
	constructor(parameters) {
		super(parameters);
	}

	setOriginalMaterial(material) {
		if (material.map){
			this.colorNode = texture(material.map, uv());
			this.metalnessNode = mix(0.0, 1.0, texture(material.map, uv()));
			this.roughnessNode = mix(0.8, 0.2, texture(material.map, uv()))
		}
	}
}

const swordMaterial = new SwordMaterial();

export default swordMaterial;
