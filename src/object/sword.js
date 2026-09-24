import * as THREE from "three/webgpu";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import swordMaterial from "../material/SwordMaterial";

const loader = new GLTFLoader();

export default class Sword extends THREE.Group {
	constructor(size = 1) {
		super();

		this.scale.set(size, size, size);

		loader.load("/sword.glb", (gltf) => {
			const object = gltf.scene;

			object.traverse((child) => {
				if (!child.isMesh) return;

				swordMaterial.setOriginalMaterial(child.material);

				child.material = swordMaterial;
				child.castShadow = true;
				child.receiveShadow = true;
			});

			this.add(object);
		});

		this.position.set(0, 2, 0);
        this.rotateZ(Math.PI * 0.67);
        this.rotateX(Math.PI * 0.05);

        this.initialPosition = this.position.clone();
        this.animation = {
            speed: 1,
            amplitude: 0.1,
        }
	}

	tick = (timer) => {
		this.position.y = Math.sin(timer.getElapsed() * this.animation.speed) * this.animation.amplitude + this.initialPosition.y;
	};
}
