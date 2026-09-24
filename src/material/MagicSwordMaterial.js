import { color, cos, mix, normalView, positionGeometry, sin, step, time, uniform, uv, vec3 } from "three/tsl";
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

		const animatedPosition = rotatedPosition.y.add(sin(time).mul(0.2).mul(2.0));

		const band = animatedPosition.mul(2).fract().step(0.5);

		const animatedBand = band.mul(time.sin())

		const baseColor = mix(
			color("#98aef7"),
			color("#1e3a8a"),
			band
		);


		this.fresnelPower = uniform(this.settings.fresnelPower);

		this.colorNode = fresnel(baseColor, normalView, this.fresnelPower);
        this.emissiveNode = this.colorNode;
		this.transparent = true;
		this.opacityNode = mix(color("#000000"), this.colorNode, positionGeometry.y.add(0.5));
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