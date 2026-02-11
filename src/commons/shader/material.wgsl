#include ./math.wgsl

struct TextureTransform {
    offset: vec2f,
    rotation: f32,
    scale: vec2f
}

struct TextureInfo {
    hasTexture: u32,
    hasTextureTransform: u32,
    textureTransform: TextureTransform
}

struct PbrMaterialUniform {
    baseColorFactor: vec4f,
    baseColorTexture: TextureInfo,
    metallicFactor: f32,
    roughnessFactor: f32,
    metallicRoughnessTexture: TextureInfo,
    normalScale: f32,
    normalTexture: TextureInfo,
    emmissiveFactor: vec3f,
    emmissiveTexture: TextureInfo,
    occlusionStrength: f32,
    occlusionTexture: TextureInfo,
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
    const g3 = vec3f(g);
    return vec4f(pow(c.xyz, g3), c.a);
}

fn rgamma(c:vec4f) -> vec4f {
    const g = 1.0/2.2;
    const g3 = vec3f(g);
    return vec4f(pow(c.xyz, g3), c.a);
}

fn textureTransform(texcoord: vec2f, transform: TextureTransform)-> vec2f {
    let R = transform.rotation;
    let translation = mat3x3f(1,0,0, 0,1,0, transform.offset.x, transform.offset.y, 1);
    let rotation = mat3x3f(
        cos(R), sin(R), 0,
       -sin(R), cos(R), 0,
        0,             0, 1
    );
    let scale = mat3x3f(transform.scale.x,0,0, 0, transform.scale.y,0, 0,0,1);
    let matrix = translation * rotation * scale;
    let uvTransformed = ( matrix * vec3f(texcoord.xy, 1) ).xy;
    return uvTransformed;
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
    hasTangent: bool,
    tangent: vec4f,
    nlights: u32,
    lights: array<PointLight,32u>
) -> vec4f {

    var cbase: vec4f = pbrMaterial.baseColorFactor;
    if(u32bool(pbrMaterial.baseColorTexture.hasTexture)) {
        cbase = gamma(textureSample(
                baseColorTexture, 
                baseColorSampler, 
                baseColorTexcoord));
    }

    var metallic: f32 = pbrMaterial.metallicFactor;
    var roughness: f32 = pbrMaterial.roughnessFactor;
    if(u32bool(pbrMaterial.metallicRoughnessTexture.hasTexture)) {
        let metallicRoughness = textureSample(
        metallicRoughnessTexture, 
        metallicRoughnessSampler, 
        metallicRoughnessTexcoord);
        metallic = metallicRoughness.b;
        roughness = metallicRoughness.g;
    }

    var newNormal: vec3f = normal;
    if(u32bool(pbrMaterial.normalTexture.hasTexture)) {
        let N = normalize(normal);
        let P = surfpos;
        let C = normalTexcoord;
        var T: vec3f;
        var B: vec3f;
        var tbn: mat3x3f;
        if(hasTangent) {
            T = normalize(tangent.xyz);
            B = cross(N,T) * tangent.w;
            tbn = mat3x3f(T,B,N);
        } else {
            // 1. 计算位置 P 和 UV 的偏导数
            // dpdx, dpdy 得到的是模型表面沿屏幕轴的切向量
            let dp1 = dpdx(P);
            let dp2 = dpdy(P);
            let duv1 = dpdx(C);
            let duv2 = dpdy(C);

            // 2. 构建 T 和 B (切线和副切线)
            // 解线性方程组：dP = T*du + B*dv
            let dp2perp = cross(dp2, N);
            let dp1perp = cross(N, dp1);

            // 计算原始切线 T 和副切线 B
            let T = dp2perp * duv1.x + dp1perp * duv2.x;
            let B = dp2perp * duv1.y + dp1perp * duv2.y;

            // 3. 计算缩放因子，确保 TBN 矩阵的比例正确
            let invmax = inverseSqrt(max(dot(T, T), dot(B, B)));

            // 构造 TBN 矩阵并进行变换
            // 注意：WGSL mat3x3f 构造函数是按列填充的
            tbn = mat3x3f(
                T * invmax, 
                B * invmax, 
                N
            );
        }
        var mapN = textureSample(
            normalTexture, 
            normalSampler, 
            normalTexcoord).xyz * 2.0 - 1.0;
        mapN = vec3f(mapN.xy * pbrMaterial.normalScale, mapN.z);
        mapN = tbn * mapN;
        newNormal = normalize(mapN);
    }

    var emmissive:vec4f = vec4f(pbrMaterial.emmissiveFactor,1.0);
    if(u32bool(pbrMaterial.emmissiveTexture.hasTexture)) {
        emmissive = gamma(textureSample(
            emmissiveTexture, 
            emmissiveSampler, 
            emmissiveTexcoord));
        emmissive = emmissive * vec4f(pbrMaterial.emmissiveFactor,1.0);
    }

    var occlusion:vec4f = vec4f(1,1,1,1);
    if(u32bool(pbrMaterial.occlusionTexture.hasTexture)) {
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

    //TODO occlusion 只针对环境光间接光源

    var finalColor = emmissive + pbrcolor;

    finalColor = rgamma(finalColor);

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

    let n_dot_v = max(dot(n, v), 0.0); // 防止分母为 0
    let n_dot_l = max(dot(n, l), 0.0);
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