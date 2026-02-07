import{m as y,a as w,c as v}from"./webgpu-utils.module--9rjYVl9.js";import{R as M}from"./webgpuUtils-fdULFPEN.js";import{d,c as a,i as c,F as _,q as P,G as L,f as U,x,y as b,n as O,s as R,e as T}from"./camera-C8r9yGx_.js";var G=`const PI: f32 = 3.14159265359;

fn u32bool(u:u32) -> bool {\r
    return u != 0u;\r
}

struct PbrMaterialUniform {\r
    baseColorFactor: vec4f,\r
    hasBaseColorTexture: u32,\r
    baseColorTexcoordIndex: u32,\r
    metallicFactor: f32,\r
    roughnessFactor: f32,\r
    hasMetallicRoughnessTexture: u32,\r
    metallicRoughnessTexcoordIndex: u32,\r
    normalScale: f32,\r
    hasNormalTexture: u32,\r
    normalTextureTexcoordIndex: u32,\r
    emmissiveFactor: vec3f,\r
    hasEmmissiveTexture: u32,\r
    emmissiveTexcoordIndex: u32,\r
    occlusionStrength: f32,\r
    hasOcclusionTexture: u32,\r
    occlusionTexcoordIndex: u32,\r
    alphaMode: u32,\r
    alphaCutoff: f32\r
}

const ALPHAMODE_OPAQUE: u32 = 0;\r
const ALPHAMODE_MASK: u32 = 1;\r
const ALPHAMODE_BLEND: u32 = 2;

@group(1) @binding(0) var<uniform> pbrMaterial: PbrMaterialUniform;\r
@group(1) @binding(1) var baseColorTexture: texture_2d<f32>;\r
@group(1) @binding(2) var baseColorSampler: sampler;\r
@group(1) @binding(3) var metallicRoughnessTexture: texture_2d<f32>;\r
@group(1) @binding(4) var metallicRoughnessSampler: sampler;\r
@group(1) @binding(5) var normalTexture: texture_2d<f32>;\r
@group(1) @binding(6) var normalSampler: sampler;\r
@group(1) @binding(7) var emmissiveTexture: texture_2d<f32>;\r
@group(1) @binding(8) var emmissiveSampler: sampler;\r
@group(1) @binding(9) var occlusionTexture: texture_2d<f32>;\r
@group(1) @binding(10) var occlusionSampler: sampler;

fn gamma(c:vec4f) -> vec4f {\r
    const g = 2.2;\r
    const g3 = vec3f(g);\r
    return vec4f(pow(c.xyz, g3), c.a);\r
}

fn rgamma(c:vec4f) -> vec4f {\r
    const g = 1.0/2.2;\r
    const g3 = vec3f(g);\r
    return vec4f(pow(c.xyz, g3), c.a);\r
}

fn getPbrMaterialColor(\r
    baseColorTexcoord: vec2f,\r
    metallicRoughnessTexcoord: vec2f,\r
    normalTexcoord: vec2f,\r
    emmissiveTexcoord: vec2f,\r
    occlusionTexcoord: vec2f,\r
    surfpos: vec3f,\r
    eyepos: vec3f,\r
    normal: vec3f,\r
    hasTangent: bool,\r
    tangent: vec4f,\r
    nlights: u32,\r
    lights: array<PointLight,32u>\r
) -> vec4f {

    var cbase: vec4f = pbrMaterial.baseColorFactor;\r
    if(u32bool(pbrMaterial.hasBaseColorTexture)) {\r
        cbase = gamma(textureSample(\r
                baseColorTexture, \r
                baseColorSampler, \r
                baseColorTexcoord));\r
    }

    var metallic: f32 = pbrMaterial.metallicFactor;\r
    var roughness: f32 = pbrMaterial.roughnessFactor;\r
    if(u32bool(pbrMaterial.hasMetallicRoughnessTexture)) {\r
        let metallicRoughness = textureSample(\r
        metallicRoughnessTexture, \r
        metallicRoughnessSampler, \r
        metallicRoughnessTexcoord);\r
        metallic = metallicRoughness.b;\r
        roughness = metallicRoughness.g;\r
    }

    var newNormal: vec3f = normal;\r
    if(u32bool(pbrMaterial.hasNormalTexture)) {\r
        let N = normalize(normal);\r
        let P = surfpos;\r
        let C = normalTexcoord;\r
        var T: vec3f;\r
        var B: vec3f;\r
        var tbn: mat3x3f;\r
        if(hasTangent) {\r
            T = normalize(tangent.xyz);\r
            B = cross(N,T) * tangent.w;\r
            tbn = mat3x3f(T,B,N);\r
        } else {\r
            
            
            let dp1 = dpdx(P);\r
            let dp2 = dpdy(P);\r
            let duv1 = dpdx(C);\r
            let duv2 = dpdy(C);

            
            
            let dp2perp = cross(dp2, N);\r
            let dp1perp = cross(N, dp1);

            
            let T = dp2perp * duv1.x + dp1perp * duv2.x;\r
            let B = dp2perp * duv1.y + dp1perp * duv2.y;

            
            let invmax = inverseSqrt(max(dot(T, T), dot(B, B)));

            
            
            tbn = mat3x3f(\r
                T * invmax, \r
                B * invmax, \r
                N\r
            );\r
        }\r
        var mapN = textureSample(\r
            normalTexture, \r
            normalSampler, \r
            normalTexcoord).xyz * 2.0 - 1.0;\r
        mapN = vec3f(mapN.xy * pbrMaterial.normalScale, mapN.z);\r
        mapN = tbn * mapN;\r
        newNormal = normalize(mapN);\r
    }

    var emmissive:vec4f = vec4f(pbrMaterial.emmissiveFactor,1.0);\r
    if(u32bool(pbrMaterial.hasEmmissiveTexture)) {\r
        emmissive = gamma(textureSample(\r
            emmissiveTexture, \r
            emmissiveSampler, \r
            emmissiveTexcoord));\r
        emmissive = emmissive * vec4f(pbrMaterial.emmissiveFactor,1.0);\r
    }

    var occlusion:vec4f = vec4f(1,1,1,1);\r
    if(u32bool(pbrMaterial.hasOcclusionTexture)) {\r
        occlusion = textureSample(\r
        occlusionTexture, \r
        occlusionSampler, \r
        occlusionTexcoord) * pbrMaterial.occlusionStrength;\r
    }

    let pbrcolor = getPbrColor(\r
        cbase,\r
        metallic,\r
        roughness,\r
        surfpos,\r
        eyepos,\r
        newNormal,\r
        nlights,\r
        lights\r
    );

    

    var finalColor = emmissive + pbrcolor;

    finalColor = rgamma(finalColor);

    finalColor.a = cbase.a;

    return finalColor;

}

fn getPbrColor(\r
    cbase: vec4f,\r
    metallic: f32,\r
    roughness: f32,\r
    surfpos: vec3f,\r
    eyepos: vec3f,\r
    normal: vec3f,\r
    nlights: u32,\r
    lights: array<PointLight,32u>\r
) -> vec4f {

    let vnormal = normalize(normal);\r
    let veye = normalize(eyepos - surfpos);

    var scolor = vec4f(0,0,0,0);

    for(var i=0u; i<nlights; i=i+1u) {\r
        let plight = lights[i].position;\r
        let clight = lights[i].color;\r
        let vlight = normalize(plight - surfpos);\r
        let vhalf = normalize(vlight + veye);\r
        scolor += computePbrColorOneLight(cbase, clight, metallic, roughness, vnormal, veye, vlight, vhalf);\r
    }

    return scolor;

}

fn computePbrColorOneLight(\r
    cbase: vec4f,\r
    clight: vec4f,\r
    metallic: f32,\r
    roughness: f32,\r
    vnormal: vec3f,\r
    veye: vec3f,\r
    vlight: vec3f,\r
    vhalf: vec3f\r
) -> vec4f {\r
    let n = normalize(vnormal);\r
    let v = normalize(veye);\r
    let l = normalize(vlight);\r
    let h = normalize(vhalf);

    let n_dot_v = max(dot(n, v), 0.0); 
    let n_dot_l = max(dot(n, l), 0.0);\r
    let n_dot_h = max(dot(n, h), 0.0);\r
    let v_dot_h = max(dot(v, h), 0.0);

    let a = roughness * roughness;\r
    let a2 = a * a;

    
    let f0 = mix(vec4f(0.04, 0.04, 0.04, 1.0), cbase, metallic);\r
    let cdiff = mix(cbase, vec4f(0.0), metallic);\r
    let fdiff = cdiff / PI;

    
    let D = ndf(a2, n_dot_h);\r
    let F = fresnel(f0, v_dot_h);\r
    \r
    
    let lg = n_dot_l * sqrt(n_dot_v * n_dot_v * (1.0 - a2) + a2);\r
    let vg = n_dot_v * sqrt(n_dot_l * n_dot_l * (1.0 - a2) + a2);\r
    let V = 0.5 / (lg + vg + 1e-7); 

    let fspec = D * F * V;

    
    
    let color = (fdiff + fspec) * clight * n_dot_l;

    return vec4f(color.rgb, cbase.a); 
}

fn ndf(alpha2: f32, n_dot_h: f32) -> f32 {\r
    let denom = (n_dot_h * n_dot_h * (alpha2 - 1.0) + 1.0);\r
    return alpha2 / (PI * denom * denom + 1e-7); 
}

fn fresnel(f0: vec4f, v_dot_h: f32) -> vec4f {\r
    return f0 + (vec4f(1.0) - f0) * pow(clamp(1.0 - v_dot_h, 0.0, 1.0), 5.0);\r
}`;class H{#r;#n;#e;#i;#o;#t;#s;#a=[];constructor(e){this.#r=e.ka,this.#n=e.ambient,this.#e=e.kd,this.#i=e.diffuse,this.#o=e.ks,this.#t=e.specular,this.#s=e.phong}addCallback(e){this.#a.push(e)}invokeChange(){for(const e of this.#a)e(this)}set ka(e){this.#r=e,this.invokeChange()}set ambient(e){this.#n=e,this.invokeChange()}set kd(e){this.#e=e,this.invokeChange()}set diffuse(e){this.#i=e,this.invokeChange()}set ks(e){this.#o=e,this.invokeChange()}set specular(e){this.#t=e,this.invokeChange()}set phong(e){this.#s=e,this.invokeChange()}get ka(){return this.#r}get ambient(){return this.#n}get kd(){return this.#e}get diffuse(){return this.#i}get ks(){return this.#o}get specular(){return this.#t}get phong(){return this.#s}}const D={OPAQUE:0,MASK:1,BLEND:2};class s{options;static bindgroupLayout;bindgroup;uniform;static defaultTexture;static defaultSampler;constructor(e){this.options=e}static getBindGroupLayout(e){if(!s.bindgroupLayout){const t=GPUShaderStage.FRAGMENT,r={sampleType:"float",viewDimension:"2d",multisampled:!1},n={type:"filtering"},o=e.createBindGroupLayout({label:"PbrMaterial",entries:[{binding:0,visibility:t,buffer:{type:"uniform"}},{binding:1,visibility:t,texture:r},{binding:2,visibility:t,sampler:n},{binding:3,visibility:t,texture:r},{binding:4,visibility:t,sampler:n},{binding:5,visibility:t,texture:r},{binding:6,visibility:t,sampler:n},{binding:7,visibility:t,texture:r},{binding:8,visibility:t,sampler:n},{binding:9,visibility:t,texture:r},{binding:10,visibility:t,sampler:n}]});s.bindgroupLayout=o}return s.bindgroupLayout}getDefaultTexture(e){if(s.defaultTexture==null){const t=e.createTexture({label:"pbrMaterial default texture",size:[1,1,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});e.queue.writeTexture({texture:t},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),s.defaultTexture=t}return s.defaultTexture}getDefaultSampler(e){if(s.defaultSampler==null){const t=e.createSampler({label:"pbrMaterial default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});s.defaultSampler=t}return s.defaultSampler}getBindGroup(e){if(!this.bindgroup){const t=e.createBindGroup({label:"pbrMaterial",layout:s.getBindGroupLayout(e),entries:[{binding:0,resource:{buffer:this.getUniform(e)}},{binding:1,resource:this.options.baseColorTexture??this.getDefaultTexture(e)},{binding:2,resource:this.options.baseColorSampler??this.getDefaultSampler(e)},{binding:3,resource:this.options.metallicRoughnessTexture??this.getDefaultTexture(e)},{binding:4,resource:this.options.metallicRoughnessSampler??this.getDefaultSampler(e)},{binding:5,resource:this.options.normalTexture??this.getDefaultTexture(e)},{binding:6,resource:this.options.normalSampler??this.getDefaultSampler(e)},{binding:7,resource:this.options.emmissiveTexture??this.getDefaultTexture(e)},{binding:8,resource:this.options.emmissiveSampler??this.getDefaultSampler(e)},{binding:9,resource:this.options.occlusionTexture??this.getDefaultTexture(e)},{binding:10,resource:this.options.occlusionSampler??this.getDefaultSampler(e)}]});this.bindgroup=t}return this.bindgroup}getUniform(e){if(!this.uniform){const t=y(G),r=w(t.uniforms.pbrMaterial),n=e.createBuffer({label:"pbrMaterial",size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),o={baseColorFactor:this.options.baseColorFactor,hasBaseColorTexture:this.options.baseColorTexture==null?0:1,metallicFactor:this.options.metallicFactor,roughnessFactor:this.options.roughnessFactor,hasMetallicRoughnessTexture:this.options.metallicRoughnessTexture==null?0:1,normalScale:this.options.normalScale,hasNormalTexture:this.options.normalTexture==null?0:1,emmissiveFactor:this.options.emmissiveFactor,hasEmmissiveTexture:this.options.emmissiveTexture==null?0:1,occlusionStrength:this.options.occlusionStrength,hasOcclusionTexture:this.options.occlusionTexture==null?0:1,alphaMode:D[this.options.alphaMode],alphaCutoff:this.options.alphaCutoff};r.set(o),e.queue.writeBuffer(n,0,r.arrayBuffer),this.uniform=n}return this.uniform}destroy(){this.options.externalTexture||(this.options.baseColorTexture!=null&&(this.options.baseColorTexture.destroy(),this.options.baseColorTexture=null),this.options.metallicRoughnessTexture!=null&&(this.options.metallicRoughnessTexture.destroy(),this.options.metallicRoughnessTexture=null),this.options.normalTexture!=null&&(this.options.normalTexture.destroy(),this.options.normalTexture=null),this.options.emmissiveTexture!=null&&(this.options.emmissiveTexture.destroy(),this.options.emmissiveTexture=null),this.options.occlusionTexture!=null&&(this.options.occlusionTexture.destroy(),this.options.occlusionTexture=null))}}const F={WORLD:0};class q{label;webgpu={};renderOptions={};constructor(e={}){this.label=e.label??"RenderObject",this.webgpu.buffers={},this.webgpu.uniforms={},this.refreshRenderOptions(e.render)}refreshRenderOptions(e){this.renderOptions=this.renderOptions??{},this.renderOptions.depth=this.renderOptions.depth??{},e&&(e.depth?(this.renderOptions.depth.depthBias=e.depth.depthBias??0,this.renderOptions.depth.depthBiasSlopeScale=e.depth.depthBiasSlopeScale??0):(this.renderOptions.depth.depthBias=0,this.renderOptions.depth.depthBiasSlopeScale=0),this.renderOptions.frontFace=e.frontFace??"ccw",this.renderOptions.space=e.space??F.WORLD)}initWebGPU(e,t,r,n){this.webgpu.gpuinfo=e,this.webgpu.canvasinfo=t,this.webgpu.scene=r,n&&this.refreshRenderOptions(n),this.refreshVertexBuffers(!0),this.refreshUniforms(!0),this.createPipeline(!0)}}class W{#r;#n;#e=null;constructor(e,t){this.#r=e,this.#n=t}set position(e){this.#r=e}set color(e){this.#n=e}get position(){return this.#r}get color(){return this.#n}set x(e){this.#r[0]=e}set y(e){this.#r[1]=e}set z(e){this.#r[2]=e}addHelper(e,t){this.#e||(this.#e=new j(e,this,t))}}class j{params={position:{x:0,y:0,z:0},color:{r:255,g:255,b:255,a:1}};pane;folder=null;light;bindx;bindy;bindz;bindcolor;constructor(e,t,r){this.pane=e,this.light=t,this.params={position:{x:this.light.position[0],y:this.light.position[1],z:this.light.position[2]},color:{r:this.light.color[0]*255,g:this.light.color[1]*255,b:this.light.color[2]*255,a:this.light.color[3]*255}};let n=this.pane;r&&r.create&&(this.folder=e.addFolder({title:r.title,expanded:r.expanded}),n=this.folder),this.bindx=n.addBinding(this.params.position,"x",{label:"position x",min:-500,max:500,step:1}).on("change",o=>{this.light.x=o.value}),this.bindy=n.addBinding(this.params.position,"y",{label:"position y",min:-500,max:500,step:1}).on("change",o=>{this.light.y=o.value}),this.bindz=n.addBinding(this.params.position,"z",{label:"position z",min:-500,max:500,step:1}).on("change",o=>{this.light.z=o.value}),this.bindcolor=n.addBinding(this.params,"color",{label:"color"}).on("change",o=>{const l=[o.value.r/255,o.value.g/255,o.value.b/255,o.value.a];this.light.color=l})}}var z=`override MAX_LIGHTS: u32 = 10u;

struct PointLight {\r
    position: vec3f,\r
    color: vec4f\r
};

struct BlinnPhong {\r
    ka: f32,\r
    kd: f32,\r
    ks: f32,\r
    phong: f32,\r
    ambient: vec4f,\r
    diffuse: vec4f,\r
    specular: vec4f\r
}

struct Camera {\r
    eye: vec3f,\r
    center: vec3f,\r
    up: vec3f,\r
    viewmtx: mat4x4f,\r
    viewmtxInv: mat4x4f\r
}

struct Projection {\r
    near: f32,\r
    far: f32,\r
    fovy: f32,\r
    aspect: f32,\r
    projmtx: mat4x4f,\r
    projmtxInv: mat4x4f\r
}

struct Viewport {\r
    width: f32,\r
    height: f32,\r
    viewportmtx: mat4x4f,\r
    viewportmtxInv: mat4x4f\r
}

struct SceneUniform {\r
    camera: Camera,\r
    projection: Projection,\r
    viewport: Viewport,\r
    numLights: u32,\r
    lights: array<PointLight, 32u>,\r
};

@group(0) @binding(0) var<uniform> scene : SceneUniform;

struct VSInput {\r
    @location(0) position: vec3f,\r
    @location(1) color: vec4f\r
}

struct VSOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) color: vec4f\r
}

@vertex fn vs(input: VSInput) -> VSOutput {\r
    let ndcpos = scene.projection.projmtx * scene.camera.viewmtx * vec4f(input.position, 1.0);\r
    var output: VSOutput;\r
    output.position = ndcpos;\r
    output.color = input.color;\r
    return output;\r
}

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {\r
    return input.color;\r
}`;class I{#r;#n;#e;#i;#o;#t={};constructor(e){this.#r=e.label??"SimpleLine",this.#n=e.topology,this.#e=e.positions,this.#i=e.colors,this.#o=e.indices}get topology(){return this.#n}get positions(){return this.positions}get colors(){return this.#i}initWebGPU(e,t,r){this.#t.gpuinfo=e,this.#t.canvasinfo=t,this.#t.scene=r,this.refreshUniforms(),this.refreshVertexBuffers(),this.createPileline()}createDefaultColors(){const e=this.positions.length/3,t=[0,1,0,1];this.#i=new Float32Array(Array(e).fill(t).flat())}refreshVertexBuffers(e=!1){if(!this.#t.gpuinfo)return;const t=this.#t.gpuinfo.device;if(e||!this.#t.buffer){this.colors||this.createDefaultColors();const r=this.#t.buffer;if(this.#o){const n=v(t,{position:{data:this.#e,numComponents:3},colors:{data:this.#i,numComponents:4},indices:this.#o});this.#t.buffer=n}else{const n=v(t,{position:{data:this.#e,numComponents:3},colors:{data:this.#i,numComponents:4}});this.#t.buffer=n}r&&(r.buffers.forEach(n=>n.destroy()),r.indexBuffer&&r.indexBuffer.destroy())}}refreshUniforms(){this.#t.scene.refreshUniform()}createPileline(){const e=this.#t.gpuinfo.device;this.#t.module=e.createShaderModule({label:this.#r,code:z});const t=e.createPipelineLayout({bindGroupLayouts:[this.#t.scene.bindGroupLayout]}),r={label:this.#r,layout:t,vertex:{module:this.#t.module,buffers:this.#t.buffer.bufferLayouts},fragment:{module:this.#t.module,targets:[{format:this.#t.canvasinfo.context.getConfiguration().format}]},primitive:{topology:this.#n},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};this.#t.pipeline=e.createRenderPipeline(r)}draw(e){this.refreshUniforms(),this.refreshVertexBuffers();const t=this.#t.scene,r=this.#t.buffer;e.setPipeline(this.#t.pipeline),e.setBindGroup(0,t.bindGroup),e.setVertexBuffer(0,r.buffers[0]),this.#o?(e.setIndexBuffer(r.indexBuffer,r.indexFormat),e.drawIndexed(r.numElements)):e.draw(this.#e.length/3)}destroy(){for(const e of this.#t.buffer.buffers)e.destroy()}}class X{#r;#n;#e;#i;#o;#t;#s;constructor(e){this.#r=e.xlim??[0,1],this.#n=e.ylim??[0,1],this.#e=e.zlim??[0,1],this.#i=e.xcolor??[1,0,0,1],this.#o=e.ycolor??[0,1,0,1],this.#t=e.zcolor??[0,0,1,1],this.#s=new I({topology:"line-list",positions:new Float32Array([this.#r[0],0,0,this.#r[1],0,0,0,this.#n[0],0,0,this.#n[1],0,0,0,this.#e[0],0,0,this.#e[1]]),colors:new Float32Array([...this.#i,...this.#i,...this.#o,...this.#o,...this.#t,...this.#t]),indices:null})}initWebGPU(e,t,r){this.#s.initWebGPU(e,t,r)}draw(e){this.#s.draw(e)}}var N=`override MAX_LIGHTS: u32 = 10u;

struct PointLight {\r
    position: vec3f,\r
    color: vec4f\r
};

struct BlinnPhong {\r
    ka: f32,\r
    kd: f32,\r
    ks: f32,\r
    phong: f32,\r
    ambient: vec4f,\r
    diffuse: vec4f,\r
    specular: vec4f\r
}

struct Camera {\r
    eye: vec3f,\r
    center: vec3f,\r
    up: vec3f,\r
    viewmtx: mat4x4f,\r
    viewmtxInv: mat4x4f\r
}

struct Projection {\r
    near: f32,\r
    far: f32,\r
    fovy: f32,\r
    aspect: f32,\r
    projmtx: mat4x4f,\r
    projmtxInv: mat4x4f\r
}

struct Viewport {\r
    width: f32,\r
    height: f32,\r
    viewportmtx: mat4x4f,\r
    viewportmtxInv: mat4x4f\r
}

struct SceneUniform {\r
    camera: Camera,\r
    projection: Projection,\r
    viewport: Viewport,\r
    numLights: u32,\r
    lights: array<PointLight, 32u>,\r
};

@group(0) @binding(0) var<uniform> scene : SceneUniform;`;function m(i){return d(i[0],i[1],i[2])}function $(i){const e=a();return c(e,i),_(e,e),e}class K{camera;projection;#r=0;#n=0;lights=[];MAX_NUM_LIGHTS=16;#e={};constructor(e,t){this.camera=e,this.projection=t}addLight(e){this.lights.push(e)}refreshViewport(e,t){this.#r=e,this.#n=t}get viewportMatrix(){const r=this.#r/2,n=this.#n/2;return P(r,0,0,0,0,n,0,0,0,0,1,0,0+r,0+n,0,1)}get viewportMatrixInv(){return c(a(),this.viewportMatrix)}getRayOfPixel(e,t){t=this.#n-t;const r=this.viewportMatrix,n=this.projection.perspectiveMatrixZO,o=this.camera.viewMtx,l=L(a(),n,o),h=c(a(),l),f=c(a(),r),u=U(e,t,0,1),S=x(b(),u,f),p=x(b(),S,h),C=d(p[0],p[1],p[2]),g=d(this.camera.from[0],this.camera.from[1],this.camera.from[2]),B=O(T(),R(T(),C,g));return new M(g,B)}initWebGPU(e,t){this.#e.gpuinfo=e,this.#e.canvasinfo=t}refreshUniform(){if(this.#e.gpuinfo){const e=this.#e.gpuinfo.device;this.#e.definition||(this.#e.definition=y(N));const t=w(this.#e.definition.uniforms.scene);this.#e.uniform||(this.#e.uniform=e.createBuffer({label:"scene",size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));const r={eye:m(this.camera.from),center:m(this.camera.to),up:m(this.camera.up),viewmtx:this.camera.viewMtx,viewmtxInv:c(a(),this.camera.viewMtx)},n={near:this.projection.near,far:this.projection.far,fovy:this.projection.fovy,aspect:this.projection.aspect,projmtx:this.projection.perspectiveMatrixZO,projmtxInv:c(a(),this.projection.perspectiveMatrixZO)},o={width:this.#r,height:this.#n,viewportmtx:this.viewportMatrix,viewportmtxInv:this.viewportMatrixInv},l=Math.min(this.MAX_NUM_LIGHTS,this.lights.length),h=[];for(let u=0;u<l;++u)h.push({position:this.lights[u].position,color:this.lights[u].color});const f={camera:r,projection:n,viewport:o,numLights:l,lights:h};t.set(f),e.queue.writeBuffer(this.#e.uniform,0,t.arrayBuffer)}}get bindGroupLayout(){if(this.#e.gpuinfo){const e=this.#e.gpuinfo.device;return this.#e.layout||(this.#e.layout=e.createBindGroupLayout({label:"scene",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]})),this.#e.layout}return null}get bindGroup(){if(this.#e.gpuinfo){if(!this.#e.bindgroup){const e=this.#e.gpuinfo.device;this.#e.bindgroup=e.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.#e.uniform}}]})}return this.#e.bindgroup}return null}get uniform(){return this.#e.uniform}}function Y(i){return Object.keys(i).length}function Z(i,e,t){return Math.min(Math.max(i,e),t)}function Q(i,e="Value must not be null or undefined"){if(i==null)throw new Error(e)}function J(i,e){return Math.random()*(e-i)+i}function ee(){return Math.sign(Math.random()-.5)}export{X as A,H as B,s as P,q as R,K as S,Q as a,W as b,ee as c,F as d,Z as e,I as f,$ as n,Y as o,J as r,m as v};
