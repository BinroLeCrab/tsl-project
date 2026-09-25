import * as THREE from "three/webgpu";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import swordMaterial from "../material/SwordMaterial";
import baseNodeMaterial from "../material/BaseNodeMaterial";
import settingsPane from "../tools/Pane";
import magicSwordMaterial from "../material/MagicSwordMaterial";
import { uniform } from "three/tsl";
import backgroundMusic from "../tools/BackgroundMusic";
import sunMaterial from "../material/SunMaterial";
import { damp } from "three/src/math/MathUtils.js";

const loader = new GLTFLoader();

export default class Sword extends THREE.Group {
	constructor(size = 1) {
		super();

        // this.swordFolder = settingsPane.addFolder({
        //     title: "Sword",
        // });

        this.isHovered = false
        this.WaveTimeLife = uniform(0);
        this.SunOpacityTarget = 0;
        this.SunOpacityCurrent = uniform(0);

		this.scale.set(size, size, size);

        this.setupSwordGroup();
        this.setupSun();

		this.position.set(0, 2, 0);

        this.initialPosition = this.position.clone();
        this.animation = {
            speed: 1,
            amplitude: 0.1,
        }

        

	}

    setupSun() {
        const geometry = new THREE.PlaneGeometry(1, 1);

        sunMaterial.setOpacity(this.SunOpacityCurrent);
        this.sun = new THREE.Mesh(geometry, sunMaterial);
        this.sun.position.set(0,0.25, -1);
        this.sun.rotation.x = 0.26;
        this.add(this.sun);

        // this.sunFolder = this.swordFolder.addFolder({
        //     title: "Sun",
        //     expanded: false,
        // });

        // this.sunFolder.addBinding(this.sun.position, "x", {
        //     min: -5,
        //     max: 5,
        //     step: 0.01,
        //     label: "Position X",
        // });

        // this.sunFolder.addBinding(this.sun.position, "y", {
        //     min: -5,
        //     max: 5,
        //     step: 0.01,
        //     label: "Position Y",
        // });
        
        // this.sunFolder.addBinding(this.sun.position, "z", {
        //     min: -5,
        //     max: 5,
        //     step: 0.01,
        //     label: "Position Z",
        // });

        // this.sunFolder.addBinding(this.sun.rotation, "x", {
        //     min: 0,
        //     max: Math.PI * 2,
        //     step: 0.01,
        //     label: "Rotation X",
        // });

        // this.sunFolder.addBinding(this.sun.rotation, "y", {
        //     min: 0,
        //     max: Math.PI * 2,
        //     step: 0.01,
        //     label: "Rotation Y",
        // });

        // this.sunFolder.addBinding(this.sun.rotation, "z", {
        //     min: 0,
        //     max: Math.PI * 2,
        //     step: 0.01,
        //     label: "Rotation Z",
        // });
    }

    setupSwordGroup() {
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

        this.swordGroup.rotateZ(Math.PI * 0.67);
        this.swordGroup.rotateX(Math.PI * 0.05);

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

        // this.outerSwordFolder = this.swordFolder.addFolder({
        //     title: "outerSword",
        //     expanded: false,
        // });

        // this.outerSwordFolder.addBinding(this.outerSword.scale, "x", {
        //     min: 1,
        //     max: 2,
        //     step: 0.01,
        //     label: "Scale X",
        // });

        // this.outerSwordFolder.addBinding(this.outerSword.scale, "y", {
        //     min: 1,
        //     max: 2,
        //     step: 0.01,
        //     label: "Scale Y",
        // });

        // this.outerSwordFolder.addBinding(this.outerSword.scale, "z", {
        //     min: 1,
        //     max: 2,
        //     step: 0.01,
        //     label: "Scale Z",
        // });
    }

    isHover(isHovered, event) {
        if (this.isHovered === isHovered) return

        this.isHovered = isHovered

        if (isHovered) {
            // console.log("La souris est au-dessus de l'épée")

            this.SunOpacityTarget = 1;

            backgroundMusic.normalFilter();
            backgroundMusic.setVolume(0.5);
        } else {
            // console.log("La souris quitte l'épée")

            this.SunOpacityTarget = 0;

            backgroundMusic.lowPassFilter();
            backgroundMusic.setVolume(0.4);
        }
    }

    isClicked() {
        // console.log("L'épée est cliquée")

        this.WaveTimeLife.value = 1;
    }

	tick = (timer) => {

        const delta = timer.getDelta();

		this.swordGroup.position.y = Math.sin(timer.getElapsed() * this.animation.speed) * this.animation.amplitude;

        if (this.baseSword && this.outerSword) {
            this.baseSword.rotation.y += this.animation.speed * 0.01;
            this.outerSword.rotation.y += this.animation.speed * 0.01;
        }

        if (this.WaveTimeLife.value > 0) {
            this.WaveTimeLife.value -= delta * 0.5; 
        }

        this.SunOpacityCurrent.value = damp(this.SunOpacityCurrent.value, this.SunOpacityTarget, 5, delta);

	};
}
