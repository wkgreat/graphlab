#include ./hdr.wgsl

struct VSInput {
    @location(0) position: vec4f, // clip space
    @location(1) direction: vec3f // world space
}

struct VSOutput {
    @builtin(position) position : vec4f,
    @location(0) direction : vec3f
}

@vertex fn vs(input: VSInput) -> VSOutput {
    var output: VSOutput;
    output.position = input.position;
    output.direction = input.direction;
    return output;
}

@group(0) @binding(0) var skybox: texture_cube<f32>;
@group(0) @binding(1) var theSampler: sampler;

fn gamma(c:vec4f) -> vec4f {
    let g = 2.2;
    let g3 = vec3f(g);
    return vec4f(pow(c.xyz, g3), c.a);
}

fn rgamma(c:vec4f) -> vec4f {
    const g = 1.0/2.2;
    const g3 = vec3f(g);
    return vec4f(pow(c.xyz, g3), c.a);
}

struct FSOutput {
    @location(0) color : vec4<f32>,
    @builtin(frag_depth) depth : f32
};

@fragment fn fs(input: VSOutput) -> FSOutput {

    var output: FSOutput;

    var color = textureSample(skybox, theSampler, input.direction).rgb;
    color = tonemapACES(color);
    output.color = rgamma(vec4f(color,1.0));
    output.depth = 1.0;

    return output;
}