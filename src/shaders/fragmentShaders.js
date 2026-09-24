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

export const fresnel = Fn(({baseColor, secondaryColor = color("#ffffff"), power = 2.0}) => {
	// const coords = uv();

	const fresnelFactor = normalView.z.oneMinus().pow(power);
	

	const color = mix(baseColor, secondaryColor, fresnelFactor);

	return color;
});