import"./modulepreload-polyfill-B5Qt9EMX.js";import{A as N,f as q,e as K,d as C,k as J,g as F,m as Q,n as Z,o as ee,E as te,c as b,q as re,r as se,t as W,u as O,v as j,P as ne,C as oe,a as ie,w as G}from"./camera-C8r9yGx_.js";import{b as ae,a as le,m as ue}from"./webgpu-utils.module--9rjYVl9.js";import{R as ce,P as H,n as V,a as S,S as fe,b as he,A as me,r as B,c as L}from"./utils-DaO285Jd.js";import{b as de,d as pe,P as ge,c as be,a as xe}from"./webgpuUtils-fdULFPEN.js";function Te(){var n=new N(9);return N!=Float32Array&&(n[1]=0,n[2]=0,n[3]=0,n[5]=0,n[6]=0,n[7]=0),n[0]=1,n[4]=1,n[8]=1,n}function z(){var n=new N(4);return N!=Float32Array&&(n[0]=0,n[1]=0,n[2]=0),n[3]=1,n}function ve(n,e,t){t=t*.5;var r=Math.sin(t);return n[0]=r*e[0],n[1]=r*e[1],n[2]=r*e[2],n[3]=Math.cos(t),n}function U(n,e,t,r){var s=e[0],o=e[1],i=e[2],a=e[3],l=t[0],c=t[1],u=t[2],d=t[3],f,m,p,g,x;return m=s*l+o*c+i*u+a*d,m<0&&(m=-m,l=-l,c=-c,u=-u,d=-d),1-m>te?(f=Math.acos(m),p=Math.sin(f),g=Math.sin((1-r)*f)/p,x=Math.sin(r*f)/p):(g=1-r,x=r),n[0]=g*s+x*l,n[1]=g*o+x*c,n[2]=g*i+x*u,n[3]=g*a+x*d,n}function we(n,e){var t=e[0]+e[4]+e[8],r;if(t>0)r=Math.sqrt(t+1),n[3]=.5*r,r=.5/r,n[0]=(e[5]-e[7])*r,n[1]=(e[6]-e[2])*r,n[2]=(e[1]-e[3])*r;else{var s=0;e[4]>e[0]&&(s=1),e[8]>e[s*3+s]&&(s=2);var o=(s+1)%3,i=(s+2)%3;r=Math.sqrt(e[s*3+s]-e[o*3+o]-e[i*3+i]+1),n[s]=.5*r,r=.5/r,n[3]=(e[o*3+i]-e[i*3+o])*r,n[o]=(e[o*3+s]+e[s*3+o])*r,n[i]=(e[i*3+s]+e[s*3+i])*r}return n}var Pe=q,Y=ee;(function(){var n=K(),e=C(1,0,0),t=C(0,1,0);return function(r,s,o){var i=J(s,o);return i<-.999999?(F(n,e,s),Q(n)<1e-6&&F(n,t,s),Z(n,n),ve(r,n,Math.PI),r):i>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(F(n,s,o),r[0]=n[0],r[1]=n[1],r[2]=n[2],r[3]=1+i,Y(r,r))}})();(function(){var n=z(),e=z();return function(t,r,s,o,i,a){return U(n,r,i,a),U(e,s,o,a),U(t,n,e,2*a*(1-a)),t}})();(function(){var n=Te();return function(e,t,r,s){return n[0]=r[0],n[3]=r[1],n[6]=r[2],n[1]=s[0],n[4]=s[1],n[7]=s[2],n[2]=-t[0],n[5]=-t[1],n[8]=-t[2],Y(e,we(e,n))}})();class Ie{ref;gltf;json;nodes;constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r,this.nodes=r.nodes}}class Ee{gltf;ref;json;matrix=b();children;camera;skin;mesh;constructor(e,t,r){if(this.gltf=e,this.ref=t,this.json=r,this.json.children&&(this.children=r.children),this.json.matrix)this.matrix=re(...this.json.matrix);else if(this.json.translation){const s=this.json.translation??[0,0,0],o=this.json.rotation??[0,0,0,1],i=this.json.scale??[1,1,1];this.matrix=se(b(),Pe(o[0],o[1],o[2],o[3]),C(s[0],s[1],s[2]),C(i[0],i[1],i[2]))}this.camera=this.json.camera,this.mesh=this.json.mesh,this.skin=this.json.skin}}class Me{gltf;ref;json;primitives;constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r,this.primitives=this.json.primitives.map((s,o)=>new ye(e,this,o))}}const h={POSITION:"POSITION",NORMAL:"NORMAL",TANGENT:"TANGENT",TEXCOORD:"TEXCOORD",JOINTS:"JOINTS",WEIGHTS:"WEIGHTS"};class ye{gltf;ref;mesh;json;mode;indices;webgpu={};constructor(e,t,r){this.gltf=e,this.ref=r,this.mesh=t,this.json=t.json.primitives[r],this.mode=this.json.mode,this.indices=this.json.indices}getVertexCount(){return this.getAssessor(h.POSITION).count}getMode(){return this.mode}getMeterial(){return this.gltf.getMaterial(this.json.material)}hasIndicies(){return!!this.indices}hasPosition(){return h.POSITION in this.json.attributes}hasNormal(){return h.NORMAL in this.json.attributes}hasTangent(){return h.TANGENT in this.json.attributes}hasTexcoord(e=0){return`${h.TEXCOORD}_${e}`in this.json.attributes}numTexcoord(){return Object.keys(this.json.attributes).filter(e=>e.startsWith(h.TEXCOORD)).length}hasJoints(e=0){return`${h.JOINTS}_${e}`in this.json.attributes}numJoints(){return Object.keys(this.json.attributes).filter(e=>e.startsWith(h.JOINTS)).length}hasWeights(e=0){return`${h.WEIGHTS}_${e}`in this.json.attributes}numWeights(){return Object.keys(this.json.attributes).filter(e=>e.startsWith(h.WEIGHTS)).length}hasMorph(){return!!this.json.targets}getAssessor(e,t){const r=t?`${e}_${t}`:e,s=this.json.attributes[r];return s==null?null:this.gltf.assessors[s]}getBufferView(e,t){const r=this.getAssessor(e,t);return r==null?null:this.gltf.bufferViews[r.json.bufferView]??null}getOrderedTexcoordAttrName(){return Object.keys(this.json.attributes).filter(e=>e.startsWith(h.TEXCOORD)).sort((e,t)=>{const r=parseInt(e.split("_")[1]),s=parseInt(t.split("_")[1]);return r-s})}getGPUMaterialTexCoordMap(){const e=this.gltf.materials[this.json.material];if(e){const t=this.getTexCoordOrderMap(),r=e.getTexcoordIndexMap(),s=Object.entries(r).map(([o,i])=>{const a=t[i];return[o,a]});return Object.fromEntries(s)}return{}}getTexCoordOrderMap(){const e=Object.keys(this.json.attributes).filter(t=>t.startsWith(h.TEXCOORD)).map(t=>{parseInt(t.split("_")[1])}).sort().map((t,r)=>[t,r]);return Object.fromEntries(e)}getDefaultVec4FloatGPUBuffer(e){if(this.webgpu.defaultVec4FloatBuffer!=null)return this.webgpu.defaultVec4FloatBuffer;const r=16*this.getVertexCount(),s=new ArrayBuffer(r),o=e.createBuffer({label:"primitive default vec4f buffer",size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(o,0,s),this.webgpu.defaultVec4FloatBuffer=o,o}getDefaultVec3FloatGPUBuffer(e){if(this.webgpu.defaultVec3FloatBuffer!=null)return this.webgpu.defaultVec3FloatBuffer;const r=12*this.getVertexCount(),s=new ArrayBuffer(r),o=e.createBuffer({label:"primitive default vec3f buffer",size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(o,0,s),this.webgpu.defaultVec3FloatBuffer=o,o}getDefaultVec2FloatGPUBuffer(e){if(this.webgpu.defaultVec2FloatBuffer!=null)return this.webgpu.defaultVec2FloatBuffer;const r=8*this.getVertexCount(),s=new ArrayBuffer(r),o=e.createBuffer({label:"primitive default vec2f buffer",size:r,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(o,0,s),this.webgpu.defaultVec2FloatBuffer=o,o}}const T={NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987},_={NEAREST:9728,LINEAR:9729},w={REPEAT:10497,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648},Se={label:"gltf default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"};class Ae{gltf;ref;json;webgpu={};getImage(){return this.gltf.images[this.json.source]??null}constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r}getGPUTexture(e){if(this.webgpu.texture!=null)return this.webgpu.texture;const t=this.gltf.images[this.json.source];if(t==null)return null;if(t.loadImage(),t.status===I.READY){const r=t.image,s=ae(e,r,{mips:this.needMipmap(),format:"rgba8unorm",size:[r.width,r.height,1]});this.webgpu.texture=s}else return null}needMipmap(){const e=this.gltf.samplers[this.json.sampler];return e==null?!1:e.needMipmap()}getGPUSampler(e){if(this.webgpu.sampler!=null)return this.webgpu.sampler;{const t=this.gltf.samplers[this.json.sampler];return t==null?this.webgpu.sampler=e.createSampler(Se):this.webgpu.sampler=t.getGPUSampler(e),this.webgpu.sampler}}}class Oe{gltf;ref;json;minFilter;magFilter;wrapS;wrapT;webgpu={};constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r,this.minFilter=this.json.minFilter??T.LINEAR,this.magFilter=this.json.magFilter??_.LINEAR,this.wrapS=this.json.wrapS??w.REPEAT,this.wrapT=this.json.wrapT??w.REPEAT}needMipmap(){return this.minFilter===T.NEAREST_MIPMAP_NEAREST||this.minFilter===T.LINEAR_MIPMAP_NEAREST||this.minFilter===T.NEAREST_MIPMAP_LINEAR||this.minFilter===T.LINEAR_MIPMAP_LINEAR}getGPUSamplerDescriptor(){const e={label:"gltf sampler"};switch(this.minFilter){case T.NEAREST:e.minFilter="nearest";break;case T.LINEAR:e.minFilter="linear";break;case T.NEAREST_MIPMAP_NEAREST:e.minFilter="nearest",e.mipmapFilter="nearest";break;case T.LINEAR_MIPMAP_NEAREST:e.minFilter="linear",e.mipmapFilter="nearest";break;case T.NEAREST_MIPMAP_LINEAR:e.minFilter="nearest",e.mipmapFilter="linear";break;case T.LINEAR_MIPMAP_LINEAR:e.minFilter="linear",e.mipmapFilter="linear";break}switch(this.magFilter){case _.NEAREST:e.magFilter="nearest";break;case _.LINEAR:e.magFilter="linear";break}switch(this.wrapS){case w.REPEAT:e.addressModeU="repeat";break;case w.CLAMP_TO_EDGE:e.addressModeU="clamp-to-edge";break;case w.MIRRORED_REPEAT:e.addressModeU="mirror-repeat"}switch(this.wrapT){case w.REPEAT:e.addressModeV="repeat";break;case w.CLAMP_TO_EDGE:e.addressModeV="clamp-to-edge";break;case w.MIRRORED_REPEAT:e.addressModeV="mirror-repeat"}return e}getGPUSampler(e){if(this.webgpu.sampler==null){const t=this.getGPUSamplerDescriptor();this.webgpu.sampler=e.createSampler(t)}return this.webgpu.sampler}}class k{#r;#a;#e;#t={baseColorFactor:[1,1,1,1],metallicFactor:1,roughnessFactor:1};#i=1;#s;#n=[0,0,0];#o;#h=1;#l;#u="OPAQUE";#c=.5;#f=!1;webgpu={};constructor(e,t,r){if(this.#r=e,this.#a=t,this.#e=r,this.#e){const s=this.#e.pbrMetallicRoughness;s&&(this.#t.baseColorTexture=s.baseColorTexture,this.#t.metallicRoughnessTexture=s.metallicRoughnessTexture,this.#t.baseColorFactor=s.baseColorFactor,this.#t.metallicFactor=s.metallicFactor,this.#t.roughnessFactor=s.roughnessFactor),this.#s=this.#e.normalTexture,this.#o=this.#e.emissiveTexture,this.#l=this.#e.occlusionTexture,this.#e.normalTexture?.scale!=null&&(this.#i=this.#e.normalTexture.scale),this.#e.occlusionTexture?.strength!=null&&(this.#h=this.#e.occlusionTexture.strength),this.#e.emissiveFactor!=null&&(this.#n=this.#e.emissiveFactor),this.#u=this.#e.alphaMode,this.#c=this.#e.alphaCutoff,this.#f=this.#e.doubleSided}}getAlphaMode(){return this.#u}getAlphaCutoff(){return this.#c}getDoubleSided(){return this.#f}hasBaseColorTexture(){return!!this.#t.baseColorTexture}hasMetallicRoughnessTexture(){return!!this.#t.metallicRoughnessTexture}hasNormalTexture(){return!!this.#s}hasEmissiveTexture(){return!!this.#o}hasOcclusionTexture(){return!!this.#l}getTexcoordIndexMap(){return{baseColor:this.#t.baseColorTexture?.texCoord,metallicRoughness:this.#t.metallicRoughnessTexture?.texCoord,normal:this.#s?.texCoord,emmissive:this.#o?.texCoord,occlusion:this.#l?.texCoord}}getGPUMaterial(e){if(this.webgpu.material==null){let t=!0;const r={externalTexture:!0,baseColorFactor:this.#t.baseColorFactor,metallicFactor:this.#t.metallicFactor,roughnessFactor:this.#t.roughnessFactor,normalScale:this.#i,emmissiveFactor:this.#n,occlusionStrength:this.#h,alphaMode:this.#u,alphaCutoff:this.#c,doubleSided:this.#f};if(this.hasBaseColorTexture()){const o=this.#t.baseColorTexture,i=this.#r.textures[o.index],a=i.getGPUTexture(e);r.baseColorTexCoord=o.texCoord??0,a==null?t=!1:(r.baseColorTexture=a,r.baseColorSampler=i.getGPUSampler(e))}if(this.hasMetallicRoughnessTexture()){const o=this.#t.metallicRoughnessTexture,i=this.#r.textures[o.index],a=i.getGPUTexture(e);r.metallicRoughnessTexCoord=o.texCoord??0,a==null?t=!1:(r.metallicRoughnessTexture=a,r.metallicRoughnessSampler=i.getGPUSampler(e))}if(this.hasNormalTexture()){const o=this.#s,i=this.#r.textures[o.index],a=i.getGPUTexture(e);r.normalTexCoord=o.texCoord??0,a==null?t=!1:(r.normalTexture=a,r.normalSampler=i.getGPUSampler(e))}if(this.hasEmissiveTexture()){const o=this.#o,i=this.#r.textures[o.index],a=i.getGPUTexture(e);r.emmissiveTexCoord=o.texCoord??0,a==null?t=!1:(r.emmissiveTexture=a,r.emmissiveSampler=i.getGPUSampler(e))}if(this.hasOcclusionTexture()){const o=this.#l,i=this.#r.textures[o.index],a=i.getGPUTexture(e);r.occlusionTexCoord=o.texCoord??0,a==null?t=!1:(r.occlusionTexture=a,r.occlusionSampler=i.getGPUSampler(e))}const s=new H(r);return t&&(this.webgpu.material=s),s}return this.webgpu.material}}const I={NONE:0,LOADING:1,READY:2,FAILED:3};class je{gltf;ref;json;image=null;status=I.NONE;constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r}async loadImage(){if(this.status!==I.NONE)return;this.status=I.LOADING;let e=null;if(this.json.uri){let t="";this.json.uri.startsWith("data:")?t=this.json.uri:t=`${this.gltf.url}/${this.json.uri}`;const s=await(await fetch(t)).blob();e=await createImageBitmap(s,{colorSpaceConversion:"none",imageOrientation:"from-image",premultiplyAlpha:"none"})}else if(this.json.bufferView){const t=this.gltf.bufferViews[this.json.bufferView];if(!t)throw this.status=I.FAILED,new Error("GLTFImage loadImage get bufferView Failed");const r=t.byteOffset,s=t.byteLength,o=await t.loadData(),i=this.json.mimeType,a=new ArrayBuffer(s);new Uint8Array(a).set(o.slice(r,r+s)),e=await De(a,i)}return this.image=e,this.status=I.READY,this.image}}class Ne{gltf;ref;json;constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r}}class Ce{gltf;ref;json;constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r}}class Re{gltf;ref;json;constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r}}const Fe={SCALA:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},M={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,UNSIGNED_INT:5125,FLOAT:5126},Ge=Object.fromEntries(Object.entries(M).map(([n,e])=>[e,n])),Be={BYTE:1,UNSIGNED_BYTE:1,SHORT:2,UNSIGNED_SHORT:2,UNSIGNED_INT:4,FLOAT:4};class Le{gltf;ref;json;count;byteOffset;constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r,this.byteOffset=this.json.byteOffset??0,this.count=this.json.count??0}async loadData(){return this.gltf.bufferViews[this.json.bufferView].loadData()}getElementBytes(){const e=this.json.type,t=this.json.componentType,r=Fe[e],s=Be[Ge[t]];return r*s}}class Ue{gltf;ref;json;byteLength;byteOffset;byteStride;constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r,this.byteLength=this.json.byteLength,this.byteOffset=this.json.byteOffset??0,this.byteStride=this.json.byteStride}async loadData(){return this.gltf.buffers[this.json.buffer].loadData()}}const E={NONE:0,LOADING:1,READY:2};class _e{gltf;ref;json;byteLength;uri;data=null;status=E.NONE;webgpu={buffers:{}};constructor(e,t,r){this.gltf=e,this.ref=t,this.json=r,this.byteLength=this.json.byteLength,this.uri=this.json.uri}loadData(){return this.status=E.LOADING,(async()=>{let e=null;if(this.uri){let t=this.json.uri;this.uri.startsWith("data:")||(t=`${this.gltf.url}/${this.uri}`);const r=await fetch(t);if(!r.ok)throw new Error(`Failed to load buffer data: ${r.status}`);e=await r.arrayBuffer()}return this.data=new Uint8Array(e),this.status=E.READY,this.data})()}getGPUBuffer(e,t){if(this.status===E.NONE)return this.loadData(),null;if(this.status===E.LOADING)return null;if(this.webgpu.buffers[t]!=null)return this.webgpu.buffers[t];{const r=e.createBuffer({label:this.json.name??"gltf buffer",size:this.json.byteLength,usage:t});e.queue.writeBuffer(r,0,this.data.buffer,0,this.byteLength),this.webgpu.buffers[t]=r}}}class A extends ce{#r;#a;#e;#t;#i=!1;#s=[];scenes;nodes;meshes;camera;textures;samplers;materials;images;skins;animations;assessors;bufferViews;buffers;#n;constructor(e){super(e),this.#r=e.uri,this.#a=this.#r.replace(/\/[^\/]*$/,"/"),this.#o(this.#r).then(t=>{this.#e=t;const s=t.asset.version;if(this.#t=s,s!=="2.0")throw Error("only supports glTF 2.0 currently.");this.build(),this.#i=!0;for(const o of this.#s)o(this)})}get ready(){return this.#i}get uri(){return this.#r}get url(){return this.#a}get json(){return this.#e}get version(){return this.#t}get defaultMaterial(){return this.#n||(this.#n=new k(this)),this.#n}getMaterial(e){return e==null?this.defaultMaterial:this.materials[e]}onReady(e){this.ready?e(this):this.#s.push(e)}async#o(e){const t=await fetch(e);if(!t.ok)throw new Error(t.statusText);const r=await t.json();return this.#e=r,this.#e}build(){this.scenes=this.json.scenes?.map((e,t)=>new Ie(this,t,e)),this.nodes=this.json.nodes?.map((e,t)=>new Ee(this,t,e)),this.meshes=this.json.meshes?.map((e,t)=>new Me(this,t,e)),this.camera=this.json.cameras?.map((e,t)=>new Ne(this,t,e)),this.textures=this.json.textures?.map((e,t)=>new Ae(this,t,e)),this.samplers=this.json.samplers?.map((e,t)=>new Oe(this,t,e)),this.materials=this.json.materials?.map((e,t)=>new k(this,t,e)),this.images=this.json.images?.map((e,t)=>new je(this,t,e)),this.skins=this.json.skins?.map((e,t)=>new Ce(this,t,e)),this.animations=this.json.animations?.map((e,t)=>new Re(this,t,e)),this.assessors=this.json.accessors?.map((e,t)=>new Le(this,t,e)),this.bufferViews=this.json.bufferViews?.map((e,t)=>new Ue(this,t,e)),this.buffers=this.json.buffers?.map((e,t)=>new _e(this,t,e))}initWebGPU(e,t,r){this.webgpu.gpuinfo=e,this.webgpu.canvasinfo=t,this.webgpu.scene=r}refreshVertexBuffers(e){throw new Error("Method not implemented.")}refreshUniforms(e){throw new Error("Method not implemented.")}createPipeline(e){throw new Error("Method not implemented.")}draw(e){throw new Error("Method not implemented.")}destroy(){throw new Error("Method not implemented.")}}async function De(n,e){const t=new Blob([n],{type:e});return await createImageBitmap(t,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}var $=`override MAX_LIGHTS: u32 = 10u;

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

@group(0) @binding(0) var<uniform> scene : SceneUniform;\r
const PI: f32 = 3.14159265359;

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
}

struct VSInput {\r
    @location(0) position: vec3f,\r
    @location(1) normal: vec3f,\r
    @location(2) tangent: vec4f,\r
    @location(3) texcoord0: vec2f,\r
    @location(4) texcoord1: vec2f,\r
    @location(5) texcoord2: vec2f,\r
    @location(6) texcoord3: vec2f,\r
    @location(7) texcoord4: vec2f\r
};

struct VSOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) worldpos: vec3f,\r
    @location(1) normal: vec3f,\r
    @location(2) tangent: vec4f,\r
    @location(3) baseColorTexcoord: vec2f,\r
    @location(4) metallicRoughnessTexcoord: vec2f,\r
    @location(5) normalTexcoord: vec2f,\r
    @location(6) emmissiveTexcoord: vec2f,\r
    @location(7) occlusionTexcoord: vec2f\r
};

struct TexCoordOrder {\r
    baseColor: u32,\r
    metallicRoughness: u32,\r
    normal: u32,\r
    emmissive: u32,\r
    occlusion: u32,\r
};

struct ModelUniform {\r
    modelmtx: mat4x4f,\r
    normalmtx: mat4x4f,\r
    tangentmtx: mat4x4f,\r
    hasTangent: u32,\r
    texcoordOrder: TexCoordOrder\r
};

@group(2) @binding(0) var<uniform> model: ModelUniform;

fn getTexcoord(input:VSInput, idx: u32) -> vec2f {\r
    switch(idx) {\r
        case 0: {\r
            return input.texcoord0;\r
        }\r
        case 1: {\r
            return input.texcoord1;\r
        }\r
        case 2: {\r
            return input.texcoord2;\r
        }\r
        case 3: {\r
            return input.texcoord3;\r
        } \r
        case 4: {\r
            return input.texcoord4;\r
        }\r
        default: {\r
            return input.texcoord0;\r
        }\r
    }\r
}

@vertex fn vs(input: VSInput) -> VSOutput {\r
    let worldpos = model.modelmtx * vec4f(input.position, 1.0);\r
    let ndcpos = scene.projection.projmtx * scene.camera.viewmtx * worldpos;\r
    var output: VSOutput;\r
    output.position = ndcpos;\r
    output.worldpos = worldpos.xyz;\r
    output.normal = (model.normalmtx * vec4f(input.normal,0.0)).xyz;\r
    var tangent4 = vec4f(input.tangent.xyz,0.0);\r
    tangent4 = model.normalmtx * tangent4;\r
    tangent4.w = input.tangent.w;\r
    output.tangent = tangent4;\r
    output.baseColorTexcoord = getTexcoord(input, model.texcoordOrder.baseColor);\r
    output.metallicRoughnessTexcoord = getTexcoord(input, model.texcoordOrder.metallicRoughness);\r
    output.normalTexcoord = getTexcoord(input, model.texcoordOrder.normal);\r
    output.emmissiveTexcoord = getTexcoord(input, model.texcoordOrder.emmissive);\r
    output.occlusionTexcoord = getTexcoord(input, model.texcoordOrder.occlusion);\r
    return output;\r
}

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {

    
    
    
    
    
    \r
    
    
    
    
    
    
    \r
    

    
    
    
    

    
    

    let color = getPbrMaterialColor(\r
        input.baseColorTexcoord,\r
        input.metallicRoughnessTexcoord,\r
        input.normalTexcoord,\r
        input.emmissiveTexcoord,\r
        input.occlusionTexcoord,\r
        input.worldpos,\r
        scene.camera.eye,\r
        input.normal,\r
        u32bool(model.hasTangent),\r
        input.tangent,\r
        scene.numLights,\r
        scene.lights\r
    );

    return color;

}`;class D{options;gpuinfo;canvasinfo;scene;definition;pipeline;constructor(e){this.options=e}static getAttributeOptions(e,t,r){const s=r in t.json.attributes;let o=0,i=0;if(s){const a=t.getAssessor(r);i=t.getBufferView(r).byteStride??a.getElementBytes(),o=0}else i=0,o=0;return{exists:s,stride:i,offset:o}}static getMultiAttributeOptions(e,t,r){return Object.keys(t.json.attributes).filter(s=>s.startsWith(r)).map(s=>{const o=t.json.attributes[s],i=e.assessors[o];return{exists:!0,stride:e.bufferViews[i.json.bufferView].byteStride??i.getElementBytes(),offset:0}})}static attributeKey(e,t){return t.exists?`${e}:T:${t.stride}:${t.offset}`:`${e}:F`}static multiAttributeKey(e,t){return t.map(r=>this.attributeKey(e,r)).join(",")}static getPipelineOptionsOfPrimitive(e,t){const r=t.getMeterial();return{mode:t.getMode(),indices:t.hasIndicies(),position:this.getAttributeOptions(e,t,h.POSITION),normal:this.getAttributeOptions(e,t,h.NORMAL),tangent:this.getAttributeOptions(e,t,h.TANGENT),texoord:this.getMultiAttributeOptions(e,t,h.TEXCOORD),joints:this.getMultiAttributeOptions(e,t,h.JOINTS),weights:this.getMultiAttributeOptions(e,t,h.WEIGHTS),morph:t.hasMorph(),colorTexutre:r.hasBaseColorTexture(),metalTexture:r.hasMetallicRoughnessTexture(),normalTexture:r.hasNormalTexture(),emmissiveTexture:r.hasEmissiveTexture(),occlusionTexture:r.hasOcclusionTexture(),alphaMode:r.getAlphaMode(),doubleSided:r.getDoubleSided()}}static getPipelineKeyOfOptions(e){function t(o,i){return i?`${o}:T`:`${o}:F`}return[e.mode,this.attributeKey("pos",e.position),this.attributeKey("nor",e.normal),this.attributeKey("tan",e.tangent),this.multiAttributeKey("tex",e.texoord),this.multiAttributeKey("jot",e.joints),this.multiAttributeKey("wgt",e.weights),t("mor",e.morph),e.alphaMode,t("dbs",e.doubleSided)].join("|")}getBlend(){if(this.options.alphaMode==="BLEND")return{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}getCullMode(){return this.options.doubleSided?"none":"front"}getDepthWriteEnabled(){return this.options.alphaMode!=="BLEND"}createPipeline(e,t,r){this.gpuinfo=e,this.canvasinfo=t,this.scene=r;const s="gltf",o=e.device;this.definition=ue($);const i=o.createShaderModule({label:s,code:$}),a=o.createBindGroupLayout({label:s,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),l=o.createPipelineLayout({label:s,bindGroupLayouts:[this.scene.bindGroupLayout,H.getBindGroupLayout(o),a]});let c=0;const u=[];u.push({arrayStride:this.options.position.stride,attributes:[{shaderLocation:c++,offset:0,format:"float32x3"}]}),u.push({arrayStride:this.options.normal.stride,attributes:[{shaderLocation:c++,offset:0,format:"float32x3"}]}),u.push({arrayStride:this.options.tangent.stride,attributes:[{shaderLocation:c++,offset:0,format:"float32x3"}]});for(let f=0;f<5;++f){const m=this.options.texoord[f];u.push({arrayStride:m?.stride??8,attributes:[{shaderLocation:c++,offset:0,format:"float32x2"}]})}const d=o.createRenderPipeline({label:s,layout:l,vertex:{module:i,buffers:u},fragment:{module:i,targets:[{format:t.context.getConfiguration().format,blend:this.getBlend()}]},primitive:{topology:"triangle-list",cullMode:this.getCullMode(),frontFace:"cw"},depthStencil:{depthWriteEnabled:this.getDepthWriteEnabled(),format:"depth32float",depthCompare:"less-equal"}});this.pipeline=d}}class y{static pipelines={};webgpu;constructor(e,t,r){this.webgpu={gpuinfo:e,canvasinfo:t,scene:r}}render(e){const t=e.sceneRef??e.gltf.json.scene,r=e.gltf.scenes[t];this.renderScene(r,e)}renderScene(e,t){for(const r of e.nodes){const s=t.gltf.nodes[r];this.renderNode(s,t.matrix??b(),t)}}renderNode(e,t,r){const s=W(b(),t,e.matrix);if(e.children!=null)for(const o of e.children){const i=r.gltf.nodes[o];this.renderNode(i,s,r)}if(e.camera!=null,e.skin!=null,e.mesh!=null){const o=r.gltf.meshes[e.mesh];this.renderMesh(o,s,r)}}renderMesh(e,t,r){for(const s of e.primitives)this.renderPrimitive(e,t,s,r)}renderPrimitive(e,t,r,s){const o=D.getPipelineOptionsOfPrimitive(s.gltf,r),i=D.getPipelineKeyOfOptions(o);let a;i in y.pipelines?(a=y.pipelines[i],a.pipeline==null&&a.createPipeline(this.webgpu.gpuinfo,this.webgpu.canvasinfo,this.webgpu.scene)):(console.log(i),console.log(o),a=new D(o),a.createPipeline(this.webgpu.gpuinfo,this.webgpu.canvasinfo,this.webgpu.scene),y.pipelines[i]=a);const l=this.webgpu.gpuinfo.device,c=le(a.definition.uniforms.model),u=r.getGPUMaterialTexCoordMap();r.webgpu.uniform==null&&(r.webgpu.uniform=this.createModelUniform(l,c)),c.set({modelmtx:t,normalmtx:V(t),tangentmtx:V(t),hasTangent:r.hasTangent()?1:0,texcoordOrder:{baseColor:u.baseColor??0,metallicRoughness:u.metallicRoughness??0,normal:u.normal??0,emmissive:u.emmissive??0,occlusion:u.occlusion??0}}),l.queue.writeBuffer(r.webgpu.uniform,0,c.arrayBuffer);const d=l.createBindGroup({label:"primitive",layout:a.pipeline.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:r.webgpu.uniform}}]});let f=null;if(r.hasIndicies()&&(f=this.getPrimitiveIndexBuffer(l,r),f==null))return;let m=null;if(r.hasPosition()&&(m=this.getPrimitiveAttributeBuffer(l,r,h.POSITION),m==null))return;let p=null;r.hasNormal()&&(p=this.getPrimitiveAttributeBuffer(l,r,h.NORMAL));let g=null;r.hasTangent()&&(g=this.getPrimitiveAttributeBuffer(l,r,h.TANGENT));const x=r.getOrderedTexcoordAttrName(),R=[];for(let v=0;v<5;++v){const P=x[v];if(P!=null){const X=parseInt(P.split("_")[1]);R.push(this.getPrimitiveAttributeBuffer(l,r,h.TEXCOORD,X))}else R.push(null)}s.pass.setPipeline(a.pipeline),s.pass.setVertexBuffer(0,m.buffer,m.offset,m.size),p!=null?s.pass.setVertexBuffer(1,p.buffer,p.offset,p.size):s.pass.setVertexBuffer(1,r.getDefaultVec3FloatGPUBuffer(l)),g!=null?s.pass.setVertexBuffer(2,g.buffer,g.offset,g.size):s.pass.setVertexBuffer(2,r.getDefaultVec4FloatGPUBuffer(l));for(let v=0;v<5;++v){const P=R[v];P!=null?s.pass.setVertexBuffer(3+v,P.buffer,P.offset,P.size):s.pass.setVertexBuffer(3+v,r.getDefaultVec2FloatGPUBuffer(l))}s.pass.setBindGroup(0,this.webgpu.scene.bindGroup),s.pass.setBindGroup(1,r.getMeterial().getGPUMaterial(l).getBindGroup(l)),s.pass.setBindGroup(2,d),r.hasIndicies()?(s.pass.setIndexBuffer(f.buffer,f.format,f.offset,f.size),s.pass.drawIndexed(f.count)):s.pass.draw(m.count)}getGPUIndexFormat(e){switch(e.json.componentType){case M.UNSIGNED_BYTE:return"uint16";case M.UNSIGNED_SHORT:return"uint16";case M.UNSIGNED_INT:return"uint32"}}getPrimitiveIndexBuffer(e,t){const r=t.gltf.assessors[t.json.indices],s=t.gltf.bufferViews[r.json.bufferView],o=t.gltf.buffers[s.json.buffer],i=r.json.componentType,a=this.getGPUIndexFormat(r);if(i!==M.UNSIGNED_BYTE){const l=r.json.byteOffset??0,c=s.json.byteOffset??0,u=s.byteLength,d=l+c,f=u-l,m=r.json.count,p=o.getGPUBuffer(e,GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST);return p==null?null:{buffer:p,format:a,offset:d,size:f,count:m}}else throw Error("Index Format 当前不支持uint8")}getPrimitiveAttributeBuffer(e,t,r,s){let o;s!=null?o=`${r}_${s}`:o=r;const i=t.json.attributes[o];S(i);const a=t.gltf.assessors[i];S(a);const l=t.gltf.bufferViews[a.json.bufferView];S(l);const c=t.gltf.buffers[l.json.buffer];S(c);const u=a.json.byteOffset??0,d=l.json.byteOffset??0,f=l.byteLength,m=u+d,p=f-u,g=a.json.count,x=c.getGPUBuffer(e,GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST);return x==null?null:{buffer:x,offset:m,size:p,count:g}}createModelUniform(e,t){return e.createBuffer({label:"model uniform",size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}}const Ve=""+new URL("../data/mesh/gltf/DamagedHelmet/DamagedHelmet.gltf",import.meta.url).href,ze=""+new URL("../data/mesh/gltf/ChronographWatch/ChronographWatch.gltf",import.meta.url).href,ke=""+new URL("../data/mesh/gltf/CarConcept/CarConcept.gltf",import.meta.url).href,$e=""+new URL("../data/mesh/gltf/DiffuseTransmissionTeacup/DiffuseTransmissionTeacup.gltf",import.meta.url).href;class We{gpuInfo=null;canvasInfo=null;colorTexture=null;depthFormat="depth32float";depthTexture=null;camera=null;projection=null;scene=null;cameraMouseCtrl=null;firstpass=!0;ready=!1;resizeObserver=null;ground=null;axis=null;gltfs=[];gltfRender;readyCallbacks=[];pane=new ne({title:"参数控制"});paneParams={rotate:{x:0,y:0,z:0}};matrix=b();constructor(){de().then(e=>{if(e===null){console.error("GPU INFO is NULL");return}this.gpuInfo=e;const r=pe({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(r===null){console.error("canvasInfo is NULL");return}this.canvasInfo=r;const s=this.canvasInfo.canvas.width,o=this.canvasInfo.canvas.height;this.canvasInfo=r,this.refreshDepthTexture();const i=[2,2,4,1],a=[0,0,0,1],l=[0,0,1,0];this.camera=new oe(i,a,l),this.projection=new ge(Math.PI/2,s/o,.1,1e3),this.scene=new fe(this.camera,this.projection);for(let c=0;c<10;++c){const u=[B(100,200)*L(),B(100,200)*L(),B(100,200)*L()];this.scene.addLight(new he(u,[1,1,1,1]))}this.scene.initWebGPU(this.gpuInfo,this.canvasInfo),this.scene.refreshViewport(this.canvasInfo.canvas.width,this.canvasInfo.canvas.height),this.cameraMouseCtrl=new ie(this.camera,this.canvasInfo.canvas),this.cameraMouseCtrl.enable(),this.gltfRender=new y(this.gpuInfo,this.canvasInfo,this.scene),this.axis=new me({xlim:[0,50],ylim:[0,50],zlim:[0,50]}),this.axis.initWebGPU(this.gpuInfo,this.canvasInfo,this.scene),this.resizeObserver=new ResizeObserver(c=>{for(const u of c){const d=u.target,f=u.contentBoxSize[0].inlineSize,m=u.contentBoxSize[0].blockSize;d.width=Math.max(1,Math.min(f,this.gpuInfo.device.limits.maxTextureDimension2D)),d.height=Math.max(1,Math.min(m,this.gpuInfo.device.limits.maxTextureDimension2D)),this.projection.aspect=d.width/d.height,this.scene.refreshViewport(d.width,d.height),this.refreshDepthTexture()}}),this.resizeObserver.observe(r.canvas),this.setPane(),this.ready=!0,this.readyCallbacks.forEach(c=>c(this))}).catch(e=>{this.ready=!1,console.error(e)})}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}refreshDepthTexture(){const e=be(this.gpuInfo,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height,this.depthFormat);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=xe({label:"demo",first:this.firstpass,colorTexture:this.canvasInfo.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}addGLTF(e){this.gltfs.push(e)}render(){if(this.ready){const e=this.gpuInfo.device.createCommandEncoder();this.firstpass=!0;const t=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.ground&&this.ground.draw(this.gpuInfo,this.camera,this.projection,t),this.axis&&this.axis.draw(t);for(const s of this.gltfs){const o=W(b(),this.matrix,s.matrix);this.gltfRender.render({pass:t,gltf:s.gltf,sceneRef:s.scene,matrix:o})}t.end();const r=e.finish();this.gpuInfo.device.queue.submit([r])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){this.pane.addBinding(this.paneParams.rotate,"x",{min:0,max:360,step:1}).on("change",e=>{const t=b();O(t,t,e.value*Math.PI/180),j(t,t,this.paneParams.rotate.y*Math.PI/180),G(t,t,this.paneParams.rotate.z*Math.PI/180),this.matrix=t}),this.pane.addBinding(this.paneParams.rotate,"y",{min:0,max:360,step:1}).on("change",e=>{const t=b();O(t,t,this.paneParams.rotate.x*Math.PI/180),j(t,t,e.value*Math.PI/180),G(t,t,this.paneParams.rotate.z*Math.PI/180),this.matrix=t}),this.pane.addBinding(this.paneParams.rotate,"z",{min:0,max:360,step:1}).on("change",e=>{const t=b();O(t,t,this.paneParams.rotate.x*Math.PI/180),j(t,t,this.paneParams.rotate.y*Math.PI/180),G(t,t,e.value*Math.PI/180),this.matrix=t})}}const He={DamagedHelmet:{name:"DamagedHelmet",gltf:new A({uri:Ve}),scene:0,matrix:(()=>{const n=b();return O(n,n,Math.PI/2),j(n,n,Math.PI),n})()},ChronographWatch:{gltf:new A({uri:ze}),matrix:b()},CarConcept:{gltf:new A({uri:ke}),matrix:b()},DiffuseTransmissionTeacup:{gltf:new A({uri:$e}),matrix:b()}};function Ye(){const n=new We;n.onReady(()=>{n.draw();const e=He.DamagedHelmet;e.gltf.onReady(()=>{n.addGLTF(e)})})}Ye();
