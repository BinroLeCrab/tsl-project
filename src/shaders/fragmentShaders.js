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

export const fresnel = Fn(({baseColor, secondaryColor = color("#ffffff")}) => {
	// const coords = uv();

	const fresnelFactor = normalView.z.oneMinus().pow(2);
	

	const color = mix(baseColor, secondaryColor, fresnelFactor);

	return color;
});