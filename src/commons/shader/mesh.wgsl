override ENABLE_LIGHT: bool = true;

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
    lights: array<PointLight, 16u>,
};

struct MaterialUniform {
    blinnPhong: BlinnPhong
}

const MeshRenderSpace_WORLD: u32 = 0;
const MeshRenderSpace_NDC: u32 = 1;

struct ModelUniform {
    hasnormal: u32,
    hastexcoord: u32,
    lighting: u32,
    space: u32,
    modelmtx: mat4x4f,
    normalmtx: mat4x4f
};

@group(0) @binding(0) var<uniform> scene : SceneUniform;
@group(1) @binding(0) var<uniform> material : MaterialUniform;
@group(1) @binding(1) var<uniform> model : ModelUniform;

struct VSInput {
    @location(0) position: vec3f,
    @location(1) normal: vec3f,
    @location(2) texcoord: vec2f,
    @location(3) color: vec4f
}

struct VSOutput {
    @builtin(position) position: vec4f,
    @location(0) worldpos: vec3f,
    @location(1) worldnormal: vec3f,
    @location(2) color: vec4f
}

@vertex
fn vs(input: VSInput) -> VSOutput {
    let worldpos = model.modelmtx * vec4f(input.position, 1);
    let worldnormal = model.normalmtx * vec4f(input.normal, 0);
    var ndcpos: vec4f;
    if(model.space==MeshRenderSpace_WORLD) {
        ndcpos = scene.projection.projmtx * scene.camera.viewmtx * worldpos;
    } else {
        ndcpos = worldpos;
    }
    var output: VSOutput;
    output.position = ndcpos;
    output.worldpos = worldpos.xyz;
    output.worldnormal = worldnormal.xyz;
    output.color = input.color;
    return output;
}

fn premultiplied(color:vec4f) -> vec4f {
    return vec4f(color.rgb * color.a, color.a);
}

fn blinnPhong(bp: BlinnPhong, color:vec4f, pos:vec3f, eye: vec3f, normal:vec3f) -> vec4f {

    let e = normalize(eye-pos);
    let n = normalize(normal);
    let nlights = min(16u, scene.numLights);

    var rescolor = vec4f(0,0,0,0);
    for(var i=0u; i<nlights; i=i+1u) {
        let l = normalize(scene.lights[i].position - pos);
        let dc = premultiplied(color) + premultiplied(bp.diffuse) + premultiplied(scene.lights[i].color);
        let cd = bp.kd * dc * max(0, dot(n,l));
        let h = normalize(l+e);
        let cs = bp.ks * bp.specular * pow(max(0, dot(n,h)), bp.phong);
        rescolor = rescolor + cd + cs;
    }
    rescolor = rescolor + bp.ka * bp.ambient;
    rescolor.a = 1;
    return rescolor;

}

@fragment
fn fs(input: VSOutput) -> @location(0) vec4f {
    if(ENABLE_LIGHT && model.lighting>0u && model.hasnormal>0u && scene.numLights > 0) {
        var color = blinnPhong(material.blinnPhong, input.color, input.worldpos, scene.camera.eye, input.worldnormal);
        return color;
    } else {
        return input.color;
    }
}