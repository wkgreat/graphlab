fn tonemapACES(color: vec3<f32>) -> vec3<f32> {
    // ACES Filmic tone mapping approximation
    let a: f32 = 2.51;
    let b: f32 = 0.03;
    let c: f32 = 2.43;
    let d: f32 = 0.59;
    let e: f32 = 0.14;

    return clamp(
        (color * (a * color + vec3<f32>(b))) /
        (color * (c * color + vec3<f32>(d)) + vec3<f32>(e)),
        vec3<f32>(0.0),
        vec3<f32>(1.0)
    );
}