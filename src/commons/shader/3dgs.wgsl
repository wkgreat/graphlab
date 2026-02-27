#include ./scene.wgsl

struct VSInput {
    @builtin(vertex_index) vertidx: u32,
    @builtin(instance_index) instidx: u32
}

struct VSOutput {
    @builtin(position) position : vec4f,
    @location(0) ndspos: vec4f,
    @location(1) centerndspos: vec4f,
    @location(2) m2dr0: vec2f,
    @location(3) m2dr1: vec2f,
    @location(4) color: vec4f
}

struct FSOutput {
    @location(0) color: vec4f
};

struct SplatData {
    @align(16) ndspos: vec4f,
    @align(16) sigma2d: mat2x2f,
    @align(16) color: vec4f,
    @align(16) vertndspos: array<vec4f, 6>,
    @align(16) vertndcpos: array<vec4f, 6>
}

struct SplatUniform {
    modelmtx: mat4x4f
}

@group(1) @binding(0) var<storage, read> splatData: array<SplatData>;
@group(1) @binding(1) var<storage, read> splatIndex: array<u32>;
@group(1) @binding(2) var<uniform> splatUniform: SplatUniform;

@vertex fn vs(input: VSInput) -> VSOutput {

    let index = splatIndex[input.instidx];
    let splat = splatData[index];
    let splatndspos = splat.ndspos;
    let sigma2d = splat.sigma2d;
    let cornernds = splat.vertndspos[input.vertidx];
    let cornerndc = splat.vertndcpos[input.vertidx];
    let color = splat.color;

    var output: VSOutput;
    output.position = cornerndc;
    output.ndspos = cornernds;
    output.centerndspos = splatndspos;
    output.m2dr0 = sigma2d[0];
    output.m2dr1 = sigma2d[1];
    output.color = color;

    return output;
}

fn computeWeight(d: vec2f, m2d: mat2x2f) -> f32 {
    let a = m2d[0][0];
    let b = m2d[1][0];
    let c = m2d[1][1];
    let denom = max(a*c - b*b, 1e-6);
    let r2 = (c*d.x*d.x - 2.0*b*d.x*d.y + a*d.y*d.y) / denom;
    let weight = exp(-0.5 * r2);
    return weight;
}

@fragment fn fs(input: VSOutput) -> FSOutput {  

    let p = input.ndspos.xy;
    let u = input.centerndspos.xy;
    let m2d = mat2x2f(input.m2dr0, input.m2dr1);
    let d = p - u;
    let w = computeWeight(d, m2d);
    if(w <0.001f) {
        discard;
    }
    var color = input.color;
    color.a = color.a * w;
    color.r = color.r * color.a;
    color.g = color.g * color.a;
    color.b = color.b * color.a;
    
    var output: FSOutput;
    output.color = color;
    return output;
}