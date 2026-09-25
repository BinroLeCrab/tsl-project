import {
	cameraPosition,
	color,
	cos,
	dot,
	Fn,
	length,
	max,
	mix,
	normalLocal,
	normalView,
	normalWorld,
	positionGeometry,
	positionLocal,
	positionViewDirection,
	positionWorld,
	time,
	uniform,
	uv,
	vec3,
} from "three/tsl";

export const fresnel = Fn(
	({
		baseColor = color("#000000"),
		secondaryColor = color("#ffffff"),
		power = 2.0,
	}) => {
		// const coords = uv();

		const fresnelFactor = normalView.z.oneMinus().pow(power);

		const color = mix(baseColor, secondaryColor, fresnelFactor);

		return color;
	}
);

export const smoothCircle = Fn(
	({
		foreground = color("#000000"),
		background = color("#ffffff"),
		radius = 0.3,
		smoothness = 0.01,
	}) => {
		const coords = uv().sub(0.5);
		const distance = length(coords);

		const mask = distance.smoothstep(radius.sub(smoothness), radius.add(smoothness));

		return mix(foreground, background, mask);
	}
);
