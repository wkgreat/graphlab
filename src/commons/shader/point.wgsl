#include ./scene.wgsl

struct VSInput {
    @location(0) vexposition: vec3f,    // vertex
    @location(1) vexnormal: vec3f,      // vertex
    @location(2) vextexcoord: vec2f,    // vertex
    @location(3) vexcolor: vec4f,       // vertex
    @location(4) insposition: vec3f,    // instance
    @location(5) inscolor: vec4f,       // instance
    @location(6) pixelsize: f32,      // instance

}

struct AABB {
    low: vec3f,
    high: vec3f
}

struct PointUniform {
    aabb: AABB,
    modelmtx: mat4x4f
}

@group(1) @binding(0) var<uniform> pointUniform: PointUniform;

//@group(1) @binding(1) var meshTexture: texture_2d<f32>;
//@group(1) @binding(2) var meshSampler: sampler;

struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
}

fn aabbCorners(aabb: AABB) -> array<vec3f,8u> {
    var arr: array<vec3f,8>;
    arr[0] = vec3f(aabb.low[0],aabb.low[1],aabb.low[2]);
    arr[1] = vec3f(aabb.low[0],aabb.low[1],aabb.high[2]);
    arr[2] = vec3f(aabb.low[0],aabb.high[1],aabb.low[2]);
    arr[3] = vec3f(aabb.low[0],aabb.high[1],aabb.high[2]);
    arr[4] = vec3f(aabb.high[0],aabb.low[1],aabb.low[2]);
    arr[5] = vec3f(aabb.high[0],aabb.low[1],aabb.high[2]);
    arr[6] = vec3f(aabb.high[0],aabb.high[1],aabb.low[2]);
    arr[7] = vec3f(aabb.high[0],aabb.high[1],aabb.high[2]);
    return arr;
}

@vertex fn vs(input:VSInput) -> VSOutput {
    let modelpos = pointUniform.modelmtx * vec4f(input.vexposition, 1.0f);
    var worldpos = scene.worldmtx * modelpos;
    let pointpos = scene.worldmtx * vec4f(input.insposition,1.0);

    let world_aabb_low = scene.worldmtx * pointUniform.modelmtx * vec4f(pointUniform.aabb.low,1.0);
    let world_aabb_high = scene.worldmtx* pointUniform.modelmtx * vec4f(pointUniform.aabb.high,1.0);
    let world_aabb_center = (world_aabb_high + world_aabb_low)/2.0f;
    let offset = pointpos - world_aabb_center;

    var worldAABB = AABB(world_aabb_low.xyz,world_aabb_high.xyz);

    let corners = aabbCorners(worldAABB);
    var smin = vec2f(f32(1E10));
    var smax = vec2f(f32(-1E10));
    for(var i=0u; i<8u; i+=1) {
        let c = spv(vec4f(corners[i]+offset.xyz,1.0f));
        smin = min(c.xy, smin);
        smax = max(c.xy, smax);
    }
    var pixlen = distance(smin, smax);
    let scale = pixlen / input.pixelsize;

    worldpos = ((worldpos - world_aabb_center) * (1.0/scale)) + world_aabb_center;
    worldpos = worldpos + offset;
    worldpos.w = 1.0;
    let ndcpos = pv(worldpos);

    var output: VSOutput;
    output.position = ndcpos;
    output.color = input.inscolor;
    
    return output;
}

struct FSOutput {
    @location(0) color: vec4f
}

@fragment fn fs(input: VSOutput) -> FSOutput {
    var output: FSOutput;
    output.color = input.color;
    return output;
}

