import * as THREE from "three/webgpu";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import swordMaterial from "../material/SwordMaterial";
import baseNodeMaterial from "../material/BaseNodeMaterial";
import settingsPane from "../tools/Pane";
import magicSwordMaterial from "../material/MagicSwordMaterial";
import { uniform } from "three/tsl";

const loader = new GLTFLoader();

export default class Sword extends THREE.Group {
	constructor(size = 1) {
		super();

        this.isHovered = false
        this.WaveTimeLife = uniform(0);

		this.scale.set(size, size, size);

        this.swordGroup = new THREE.Group();
        this.add(this.swordGroup);

        this.baseSword = new THREE.Group();

		loader.load("/sword.glb", (gltf) => {
			this.baseSword = gltf.scene;

			this.baseSword.traverse((child) => {
				if (!child.isMesh) return;

				swordMaterial.setOriginalMaterial(child.material);
                swordMaterial.setWave(this.WaveTimeLife);

				child.material = swordMaterial;
				child.castShadow = true;
				child.receiveShadow = true;
			});

			this.swordGroup.add(this.baseSword);

            this.addOuterSword();
		});

		this.position.set(0, 2, 0);
        this.rotateZ(Math.PI * 0.67);
        this.rotateX(Math.PI * 0.05);

        this.initialPosition = this.position.clone();
        this.animation = {
            speed: 1,
            amplitude: 0.1,
        }

        this.swordFolder = settingsPane.addFolder({
            title: "Sword",
        });

	}

    addOuterSword() {
        this.outerSword = this.baseSword.clone();
        this.outerSword.traverse((child) => {
            if (!child.isMesh) return;

            magicSwordMaterial.setWave(this.WaveTimeLife);
            child.material = magicSwordMaterial;
        });

        this.outerSword.scale.set(1.5, 1, 1.65);
        this.swordGroup.add(this.outerSword);

        this.outerSwordFolder = this.swordFolder.addFolder({
            title: "outerSword",
            expanded: false,
        });

        this.outerSwordFolder.addBinding(this.outerSword.scale, "x", {
            min: 1,
            max: 2,
            step: 0.01,
            label: "Scale X",
        });

        this.outerSwordFolder.addBinding(this.outerSword.scale, "y", {
            min: 1,
            max: 2,
            step: 0.01,
            label: "Scale Y",
        });

        this.outerSwordFolder.addBinding(this.outerSword.scale, "z", {
            min: 1,
            max: 2,
            step: 0.01,
            label: "Scale Z",
        });
    }

    isHover(isHovered, event) {
        if (this.isHovered === isHovered) return

        this.isHovered = isHovered

        if (isHovered) {
            console.log("La souris est au-dessus de l'épée")

            // Exemple :
            // this.outerSword.scale.setScalar(1.1)
        } else {
            console.log("La souris quitte l'épée")

            // Exemple :
            // this.outerSword.scale.setScalar(1)
        }
    }

    isClicked() {
        console.log("L'épée est cliquée")

        this.WaveTimeLife.value = 1;

        // Exemple :
        // this.rotation.y += Math.PI
    }

	tick = (timer) => {

        const delta = timer.getDelta();

		this.swordGroup.position.y = Math.sin(timer.getElapsed() * this.animation.speed) * this.animation.amplitude;
        this.swordGroup.rotation.y += this.animation.speed * 0.01;

        if (this.WaveTimeLife.value > 0) {
            this.WaveTimeLife.value -= delta * 0.5; 
        }
	};
}
