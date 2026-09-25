import {
	color,
	mix,
	normalView,
	sin,
	texture,
	time,
	uniform,
	uv,
	vec3,
} from "three/tsl";
import * as THREE from "three/webgpu";
import { fresnel } from "../shaders/fragmentShaders";
import { wave } from "../shaders/vertexShaders";
import settingsPane from "../tools/Pane";

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

		this.waveParameters = {
			amplitude: 6,
			frequency: 5,
			speed: 8,
		};
	}

	setOriginalMaterial(material) {
		if (material.map) {
			this.colorNode = texture(material.map, uv());
			this.metalnessNode = mix(0.0, 1.0, texture(material.map, uv()));
			this.roughnessNode = mix(0.8, 0.2, texture(material.map, uv()));
		}
	}

	setWave(waveDuration = uniform(1)) {
		this.waveFrequency = uniform(this.waveParameters.frequency);
		this.waveSpeed = uniform(this.waveParameters.speed);
		this.waveAmplitude = uniform(this.waveParameters.amplitude);

		this.positionNode = wave({
			axis: "y",
			axis2: "z",
			frequency: this.waveFrequency,
			speed: this.waveSpeed,
			amplitude: this.waveAmplitude,
			duration: waveDuration,
		});

		const swordMaterialFolder = settingsPane.addFolder({
			title: "Sword Material",
		});

		swordMaterialFolder
			.addBinding(this.waveParameters, "frequency", {
				min: 0,
				max: 10,
				step: 0.1,
				label: "Wave frequency",
			})
			.on("change", (event) => {
				this.waveFrequency.value = event.value;
			});

		swordMaterialFolder
			.addBinding(this.waveParameters, "speed", {
				min: 0,
				max: 10,
				step: 0.1,
				label: "Wave speed",
			})
			.on("change", (event) => {
				this.waveSpeed.value = event.value;
			});

		swordMaterialFolder
			.addBinding(this.waveParameters, "amplitude", {
				min: 0,
				max: 10,
				step: 0.1,
				label: "Wave amplitude",
			})
			.on("change", (event) => {
				this.waveAmplitude.value = event.value;
			});
	}
}

const swordMaterial = new SwordMaterial();

export default swordMaterial;
