struct PointLight {
    position: vec3f,
    color: vec4f
};

struct BlinnPhong {
    ka: f32,
    kd: f32,
    ks: f32,
    phong: f32,
    ambient: vec4f,
    diffuse: vec4f,
    specular: vec4f
}

struct Camera {
    eye: vec3f,
    center: vec3f,
    up: vec3f,
    viewmtx: mat4x4f,
    viewmtxInv: mat4x4f
}

struct Projection {
    near: f32,
    far: f32,
    fovy: f32,
    aspect: f32,
    projmtx: mat4x4f,
    projmtxInv: mat4x4f
}

struct Viewport {
    width: f32,
    height: f32,
    viewportmtx: mat4x4f,
    viewportmtxInv: mat4x4f
}

struct SceneUniform {
    camera: Camera,
    projection: Projection,
    viewport: Viewport,
    numLights: u32,
    lights: array<PointLight, 1u>,
};

@group(0) @binding(0) var<uniform> scene : SceneUniform;