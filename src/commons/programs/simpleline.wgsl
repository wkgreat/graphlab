
struct SceneUniform {
    viewmtx: mat4x4f,
    projmtx: mat4x4f
}

@group(0) @binding(0) var<uniform> scene: SceneUniform;

struct VSInput {
    @location(0) position: vec3f,
    @location(1) color: vec4f
} 

struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
}

@vertex
fn vs(input: VSInput) -> VSOutput {
    var output: VSOutput;
    let worldpos = vec4f(input.position, 1.0);
    let ndcpos = scene.projmtx * scene.viewmtx * worldpos;
    output.position = ndcpos;
    output.color = input.color;
    return output;
}

@fragment
fn fs(input: VSOutput) -> @location(0) vec4f {
    return input.color;
}