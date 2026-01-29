#include ./scene.wgsl

struct VSInput {
    @location(0) position: vec3f,
    @location(1) color: vec4f
}

struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
}

@vertex fn vs(input: VSInput) -> VSOutput {
    let ndcpos = scene.projection.projmtx * scene.camera.viewmtx * vec4f(input.position, 1.0);
    var output: VSOutput;
    output.position = ndcpos;
    output.color = input.color;
    return output;
}

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
    return input.color;
}