import {
	color,
	cos,
	mix,
	normalView,
	positionGeometry,
	sin,
	step,
	time,
	uniform,
	uv,
	vec3,
} from "three/tsl";
import * as THREE from "three/webgpu";
import { fresnel } from "../shaders/fragmentShaders";
import settingsPane from "../tools/Pane";

class MagicSwordMaterial extends THREE.MeshStandardNodeMaterial {
	constructor(parameters) {
		super(parameters);

		this.settings = {
			fresnelPower: 2.0,
		};

		//tourne les positionGeometry de 45deg
		const rotatedPosition = vec3(
			positionGeometry.x.mul(0.7071).sub(positionGeometry.y.mul(0.7071)),
			positionGeometry.x.mul(0.7071).add(positionGeometry.y.mul(0.7071)),
			positionGeometry.z
		);

		const animatedPosition = rotatedPosition.y.add(
			sin(time).mul(0.2).mul(2.0)
		);

		const band = animatedPosition.mul(2).fract().step(0.5);

		const animatedBand = band.mul(time.sin());

		const baseColor = color("#98aef7").mul(0.8).add(mix(color("#98aef7"), color("#1e3a8a"), band));

		const firstedge = step(0.4, positionGeometry.x);
		const secondedge = step(0.6, positionGeometry.x);

		const widthMask = mix(mix(color("#98aef7"), color("#1e3a8a"), firstedge), color("#98aef7"), secondedge);

		this.fresnelPower = uniform(this.settings.fresnelPower);

		this.colorNode = fresnel(baseColor, normalView, this.fresnelPower);
		// this.colorNode = ;
		this.emissiveNode = this.colorNode;
		this.transparent = true;
		this.opacityNode = mix(
			color("#000000"),
			this.colorNode,
			positionGeometry.y.add(0.5)
		);
		this.side = THREE.DoubleSide;

		this.paneFolder = settingsPane.addFolder({
			title: "Magic sword material",
		});

		this.paneFolder.addBinding(this.settings, "fresnelPower", {
			min: 0.1,
			max: 10,
			step: 0.1,
			label: "Fresnel power",
			onChange: (event) => {
				this.fresnelPower.value = event.value;
			},
		});
	}
}

const magicSwordMaterial = new MagicSwordMaterial();

export default magicSwordMaterial;
