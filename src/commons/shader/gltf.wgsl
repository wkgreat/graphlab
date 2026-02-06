#include ./scene.wgsl
#include ./material.wgsl

struct VSInput {
    @location(0) position: vec3f,
    @location(1) normal: vec3f,
    @location(2) tangent: vec3f,
    @location(3) texcoord0: vec2f,
    @location(4) texcoord1: vec2f,
    @location(5) texcoord2: vec2f,
    @location(6) texcoord3: vec2f,
    @location(7) texcoord4: vec2f
};

struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) worldpos: vec3f,
    @location(1) normal: vec3f,
    @location(2) tangent: vec3f,
    @location(3) baseColorTexcoord: vec2f,
    @location(4) metallicRoughnessTexcoord: vec2f,
    @location(5) normalTexcoord: vec2f,
    @location(6) emmissiveTexcoord: vec2f,
    @location(7) occlusionTexcoord: vec2f,
};

struct TexCoordOrder {
    baseColor: u32,
    metallicRoughness: u32,
    normal: u32,
    emmissive: u32,
    occlusion: u32,
};

struct ModelUniform {
    modelmtx: mat4x4f,
    normalmtx: mat3x3f,
    tangentmtx: mat3x3f,
    texcoordOrder: TexCoordOrder
};

@group(2) @binding(0) var<uniform> model: ModelUniform;

fn getTexcoord(input:VSInput, idx: u32) -> vec2f {
    switch(idx) {
        case 0: {
            return input.texcoord0;
        }
        case 1: {
            return input.texcoord1;
        }
        case 2: {
            return input.texcoord2;
        }
        case 3: {
            return input.texcoord3;
        } 
        case 4: {
            return input.texcoord4;
        }
        default: {
            return input.texcoord0;
        }
    }
}

@vertex fn vs(input: VSInput) -> VSOutput {
    let worldpos = model.modelmtx * vec4f(input.position, 1.0);
    let ndcpos = scene.projection.projmtx * scene.camera.viewmtx * worldpos;
    var output: VSOutput;
    output.position = ndcpos;
    output.worldpos = worldpos.xyz;
    output.normal = model.normalmtx * input.normal;
    output.tangent = model.tangentmtx * input.tangent;
    output.baseColorTexcoord = getTexcoord(input, model.texcoordOrder.baseColor);
    output.metallicRoughnessTexcoord = getTexcoord(input, model.texcoordOrder.metallicRoughness);
    output.normalTexcoord = getTexcoord(input, model.texcoordOrder.normal);
    output.emmissiveTexcoord = getTexcoord(input, model.texcoordOrder.emmissive);
    output.occlusionTexcoord = getTexcoord(input, model.texcoordOrder.occlusion);
    return output;
}

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {

    let n = normalize(input.normal);

    let color = getPbrMaterialColor(
        input.baseColorTexcoord,
        input.metallicRoughnessTexcoord,
        input.normalTexcoord,
        input.emmissiveTexcoord,
        input.occlusionTexcoord,
        input.worldpos,
        scene.camera.eye,
        input.normal,
        scene.numLights,
        scene.lights
    );

    return color;

}
