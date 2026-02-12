#include ./light.wgsl

struct BlinnPhong {
    ka: f32,
    kd: f32,
    ks: f32,
    phong: f32,
    ambient: vec4f,
    diffuse: vec4f,
    specular: vec4f
};

struct Camera {
    eye: vec3f,
    center: vec3f,
    up: vec3f,
    viewmtx: mat4x4f,
    viewmtxInv: mat4x4f
};

struct Projection {
    near: f32,
    far: f32,
    fovy: f32,
    aspect: f32,
    projmtx: mat4x4f,
    projmtxInv: mat4x4f
};

struct Viewport {
    width: f32,
    height: f32,
    viewportmtx: mat4x4f,
    viewportmtxInv: mat4x4f
};

struct IBLUniform {
    canIBL: u32,
    prefilterLevels: u32,
    prescaled: u32,
    sh: array<vec3f, 9u>
};

struct SceneUniform {
    worldmtx: mat4x4f,
    camera: Camera,
    projection: Projection,
    viewport: Viewport,
    ibl: IBLUniform,
    numLights: u32,
    lights: array<PointLight, 32u>
};

@group(0) @binding(0) var<uniform> scene : SceneUniform;
@group(0) @binding(1) var prefilterTexture: texture_cube<f32>;
@group(0) @binding(2) var prefilterSampler: sampler;
@group(0) @binding(3) var lutTexture: texture_2d<f32>;
@group(0) @binding(4) var lutSampler: sampler;
