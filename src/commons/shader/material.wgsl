#include ./math.wgsl

struct PbrMaterialUniform {
    baseColorFactor: vec4f,
    hasBaseColorTexture: u32,
    baseColorTexcoordIndex: u32,
    metallicFactor: f32,
    roughnessFactor: f32,
    hasMetallicRoughnessTexture: u32,
    metallicRoughnessTexcoordIndex: u32,
    normalScale: f32,
    hasNormalTexture: u32,
    normalTextureTexcoordIndex: u32,
    emmissiveFactor: vec3f,
    hasEmmissiveTexture: u32,
    emmissiveTexcoordIndex: u32,
    occlusionStrength: f32,
    hasOcclusionTexture: u32,
    occlusionTexcoordIndex: u32,
    alphaMode: u32,
    alphaCutoff: f32
}

const ALPHAMODE_OPAQUE: u32 = 0;
const ALPHAMODE_MASK: u32 = 1;
const ALPHAMODE_BLEND: u32 = 2;

@group(1) @binding(0) var<uniform> pbrMaterial: PbrMaterialUniform;
@group(1) @binding(1) var baseColorTexture: texture_2d<f32>;
@group(1) @binding(2) var baseColorSampler: sampler;
@group(1) @binding(3) var metallicRoughnessTexture: texture_2d<f32>;
@group(1) @binding(4) var metallicRoughnessSampler: sampler;
@group(1) @binding(5) var normalTexture: texture_2d<f32>;
@group(1) @binding(6) var normalSampler: sampler;
@group(1) @binding(7) var emmissiveTexture: texture_2d<f32>;
@group(1) @binding(8) var emmissiveSampler: sampler;
@group(1) @binding(9) var occlusionTexture: texture_2d<f32>;
@group(1) @binding(10) var occlusionSampler: sampler;

fn gamma(c:vec4f) -> vec4f {
    const g = 2.2;
    const g3 = vec3f(g,g,g);
    return vec4f(pow(c.xyz, g3), c.a);
}

fn rgamma(c:vec4f) -> vec4f {
    const g = 1.0/2.2;
    const g3 = vec3f(g,g,g);
    return vec4f(pow(c.xyz, g3), c.a);
}

fn getPbrMaterialColor(
    baseColorTexcoord: vec2f,
    metallicRoughnessTexcoord: vec2f,
    normalTexcoord: vec2f,
    emmissiveTexcoord: vec2f,
    occlusionTexcoord: vec2f,
    surfpos: vec3f,
    eyepos: vec3f,
    normal: vec3f,
    nlights: u32,
    lights: array<PointLight,32u>
) -> vec4f {

    var cbase: vec4f = pbrMaterial.baseColorFactor;
    if(u32bool(pbrMaterial.hasBaseColorTexture)) {
        cbase = gamma(textureSample(
                baseColorTexture, 
                baseColorSampler, 
                baseColorTexcoord));
    }

    var metallic: f32 = pbrMaterial.metallicFactor;
    var roughness: f32 = pbrMaterial.roughnessFactor;
    if(u32bool(pbrMaterial.hasMetallicRoughnessTexture)) {
        let metallicRoughness = textureSample(
        metallicRoughnessTexture, 
        metallicRoughnessSampler, 
        metallicRoughnessTexcoord);
        metallic = metallicRoughness.b;
        roughness = metallicRoughness.g;
    }

    var newNormal: vec3f = normal;
    if(u32bool(pbrMaterial.hasNormalTexture)) {
        newNormal = normal;
        //TODO 计算向量
    }

    var emmissive:vec4f = vec4f(pbrMaterial.emmissiveFactor,1.0);
    if(u32bool(pbrMaterial.hasEmmissiveTexture)) {
        emmissive = textureSample(
        emmissiveTexture, 
        emmissiveSampler, 
        emmissiveTexcoord);
        emmissive = emmissive * vec4f(pbrMaterial.emmissiveFactor,1.0);
    }

    var occlusion:vec4f = vec4f(1,1,1,1);
    if(u32bool(pbrMaterial.hasOcclusionTexture)) {
        occlusion = textureSample(
        occlusionTexture, 
        occlusionSampler, 
        occlusionTexcoord) * pbrMaterial.occlusionStrength;
    }

    let pbrcolor = getPbrColor(
        cbase,
        metallic,
        roughness,
        surfpos,
        eyepos,
        newNormal,
        nlights,
        lights
    );

    var finalColor = occlusion * (emmissive + pbrcolor);
    finalColor.a = cbase.a;

    return finalColor;

}

fn getPbrColor(
    cbase: vec4f,
    metallic: f32,
    roughness: f32,
    surfpos: vec3f,
    eyepos: vec3f,
    normal: vec3f,
    nlights: u32,
    lights: array<PointLight,32u>
) -> vec4f {

    let vnormal = normalize(normal);
    let veye = normalize(eyepos - surfpos);

    var scolor = vec4f(0,0,0,0);

    for(var i=0u; i<nlights; i=i+1u) {
        let plight = lights[i].position;
        let clight = lights[i].color;
        let vlight = normalize(plight - surfpos);
        let vhalf = normalize(vlight + veye);
        scolor += computePbrColorOneLight(cbase, clight, metallic, roughness, vnormal, veye, vlight, vhalf);
    }

    return scolor;

}

fn computePbrColorOneLight(
    cbase: vec4f,
    clight: vec4f,
    metallic: f32,
    roughness: f32,
    vnormal: vec3f,
    veye: vec3f,
    vlight: vec3f,
    vhalf: vec3f
) -> vec4f {
    let n = normalize(vnormal);
    let v = normalize(veye);
    let l = normalize(vlight);
    let h = normalize(vhalf);

    let n_dot_v = max(dot(n, v), 1e-7); // 防止分母为 0
    let n_dot_l = max(dot(n, l), 1e-7);
    let n_dot_h = max(dot(n, h), 0.0);
    let v_dot_h = max(dot(v, h), 0.0);

    let a = roughness * roughness;
    let a2 = a * a;

    // Diffuse
    let f0 = mix(vec4f(0.04, 0.04, 0.04, 1.0), cbase, metallic);
    let cdiff = mix(cbase, vec4f(0.0), metallic);
    let fdiff = cdiff / PI;

    // Specular (Using Heitz Smith Geometry Shadowing Masking)
    let D = ndf(a2, n_dot_h);
    let F = fresnel(f0, v_dot_h);
    
    // lg 和 vg 计算的是 Smith 几何项的近似分支
    let lg = n_dot_l * sqrt(n_dot_v * n_dot_v * (1.0 - a2) + a2);
    let vg = n_dot_v * sqrt(n_dot_l * n_dot_l * (1.0 - a2) + a2);
    let V = 0.5 / (lg + vg + 1e-7); 

    let fspec = D * F * V;

    // 最终颜色计算
    // 注意：clight 通常包含强度，n_dot_l 是 Lambertian 项
    let color = (fdiff + fspec) * clight * n_dot_l;

    return vec4f(color.rgb, cbase.a); // 保持原始 Alpha
}

// 法线分布函数 (Trowbridge-Reitz GGX)
fn ndf(alpha2: f32, n_dot_h: f32) -> f32 {
    let denom = (n_dot_h * n_dot_h * (alpha2 - 1.0) + 1.0);
    return alpha2 / (PI * denom * denom + 1e-7); // 加上 epsilon 防止除以 0
}

// 菲涅尔方程 (Schlick's approximation)
fn fresnel(f0: vec4f, v_dot_h: f32) -> vec4f {
    return f0 + (vec4f(1.0) - f0) * pow(clamp(1.0 - v_dot_h, 0.0, 1.0), 5.0);
}