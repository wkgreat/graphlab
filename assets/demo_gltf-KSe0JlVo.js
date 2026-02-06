import"./modulepreload-polyfill-B5Qt9EMX.js";import{A as N,f as Z,e as ee,d as C,k as te,g as D,m as re,n as se,o as ne,E as oe,c as O,q as ie,r as ae,t as le,u as ue,v as ce,w as fe,C as he,a as me}from"./camera-qzceTesf.js";import{R as de,P as J,a as R,S as ge,b as pe,A as be}from"./utils-B6FuSxdM.js";import{b as xe,a as Te,m as ve}from"./webgpu-utils.module--9rjYVl9.js";import{b as we,d as Ee,P as Ie,G as Me,c as Pe,a as ye}from"./webgpuUtils-CQCoK8IE.js";function $(){var n=new N(9);return N!=Float32Array&&(n[1]=0,n[2]=0,n[3]=0,n[5]=0,n[6]=0,n[7]=0),n[0]=1,n[4]=1,n[8]=1,n}function H(n,e){var r=e[0],t=e[1],s=e[2],o=e[3],i=e[4],a=e[5],l=e[6],f=e[7],u=e[8],c=e[9],m=e[10],d=e[11],x=e[12],b=e[13],h=e[14],p=e[15],j=r*a-t*i,W=r*l-s*i,F=r*f-o*i,Y=t*l-s*a,G=t*f-o*a,L=s*f-o*l,B=u*b-c*x,_=u*h-m*x,I=u*p-d*x,U=c*h-m*b,M=c*p-d*b,P=m*p-d*h,T=j*P-W*M+F*U+Y*I-G*_+L*B;return T?(T=1/T,n[0]=(a*P-l*M+f*U)*T,n[1]=(l*I-i*P-f*_)*T,n[2]=(i*M-a*I+f*B)*T,n[3]=(s*M-t*P-o*U)*T,n[4]=(r*P-s*I+o*_)*T,n[5]=(t*I-r*M-o*B)*T,n[6]=(b*L-h*G+p*Y)*T,n[7]=(h*F-x*L-p*W)*T,n[8]=(x*G-b*F+p*j)*T,n):null}function X(){var n=new N(4);return N!=Float32Array&&(n[0]=0,n[1]=0,n[2]=0),n[3]=1,n}function Se(n,e,r){r=r*.5;var t=Math.sin(r);return n[0]=t*e[0],n[1]=t*e[1],n[2]=t*e[2],n[3]=Math.cos(r),n}function V(n,e,r,t){var s=e[0],o=e[1],i=e[2],a=e[3],l=r[0],f=r[1],u=r[2],c=r[3],m,d,x,b,h;return d=s*l+o*f+i*u+a*c,d<0&&(d=-d,l=-l,f=-f,u=-u,c=-c),1-d>oe?(m=Math.acos(d),x=Math.sin(m),b=Math.sin((1-t)*m)/x,h=Math.sin(t*m)/x):(b=1-t,h=t),n[0]=b*s+h*l,n[1]=b*o+h*f,n[2]=b*i+h*u,n[3]=b*a+h*c,n}function Ae(n,e){var r=e[0]+e[4]+e[8],t;if(r>0)t=Math.sqrt(r+1),n[3]=.5*t,t=.5/t,n[0]=(e[5]-e[7])*t,n[1]=(e[6]-e[2])*t,n[2]=(e[1]-e[3])*t;else{var s=0;e[4]>e[0]&&(s=1),e[8]>e[s*3+s]&&(s=2);var o=(s+1)%3,i=(s+2)%3;t=Math.sqrt(e[s*3+s]-e[o*3+o]-e[i*3+i]+1),n[s]=.5*t,t=.5/t,n[3]=(e[o*3+i]-e[i*3+o])*t,n[o]=(e[o*3+s]+e[s*3+o])*t,n[i]=(e[i*3+s]+e[s*3+i])*t}return n}var Oe=Z,Q=ne;(function(){var n=ee(),e=C(1,0,0),r=C(0,1,0);return function(t,s,o){var i=te(s,o);return i<-.999999?(D(n,e,s),re(n)<1e-6&&D(n,r,s),se(n,n),Se(t,n,Math.PI),t):i>.999999?(t[0]=0,t[1]=0,t[2]=0,t[3]=1,t):(D(n,s,o),t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=1+i,Q(t,t))}})();(function(){var n=X(),e=X();return function(r,t,s,o,i,a){return V(n,t,i,a),V(e,s,o,a),V(r,n,e,2*a*(1-a)),r}})();(function(){var n=$();return function(e,r,t,s){return n[0]=t[0],n[3]=t[1],n[6]=t[2],n[1]=s[0],n[4]=s[1],n[7]=s[2],n[2]=-r[0],n[5]=-r[1],n[8]=-r[2],Q(e,Ae(e,n))}})();class je{ref;gltf;json;nodes;constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t,this.nodes=t.nodes}}class Re{gltf;ref;json;matrix=O();children;camera;skin;mesh;constructor(e,r,t){if(this.gltf=e,this.ref=r,this.json=t,this.json.children&&(this.children=t.children),this.json.matrix)this.matrix=ie(...this.json.matrix);else if(this.json.translation){const s=this.json.translation??[0,0,0],o=this.json.rotation??[0,0,0,1],i=this.json.scale??[1,1,1];this.matrix=ae(O(),Oe(o[0],o[1],o[2],o[3]),C(s[0],s[1],s[2]),C(i[0],i[1],i[2]))}this.camera=this.json.camera,this.mesh=this.json.mesh,this.skin=this.json.skin}}class Ne{gltf;ref;json;primitives;constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t,this.primitives=this.json.primitives.map((s,o)=>new Ce(e,this,o))}}const g={POSITION:"POSITION",NORMAL:"NORMAL",TANGENT:"TANGENT",TEXCOORD:"TEXCOORD",JOINTS:"JOINTS",WEIGHTS:"WEIGHTS"};class Ce{gltf;ref;mesh;json;mode;indices;webgpu={};constructor(e,r,t){this.gltf=e,this.ref=t,this.mesh=r,this.json=r.json.primitives[t],this.mode=this.json.mode,this.indices=this.json.indices}getVertexCount(){return this.getAssessor(g.POSITION).count}getMode(){return this.mode}getMeterial(){return this.gltf.getMaterial(this.json.material)}hasIndicies(){return!!this.indices}hasPosition(){return g.POSITION in this.json.attributes}hasNormal(){return g.NORMAL in this.json.attributes}hasTangent(){return g.TANGENT in this.json.attributes}hasTexcoord(e=0){return`${g.TEXCOORD}_${e}`in this.json.attributes}numTexcoord(){return Object.keys(this.json.attributes).filter(e=>e.startsWith(g.TEXCOORD)).length}hasJoints(e=0){return`${g.JOINTS}_${e}`in this.json.attributes}numJoints(){return Object.keys(this.json.attributes).filter(e=>e.startsWith(g.JOINTS)).length}hasWeights(e=0){return`${g.WEIGHTS}_${e}`in this.json.attributes}numWeights(){return Object.keys(this.json.attributes).filter(e=>e.startsWith(g.WEIGHTS)).length}hasMorph(){return!!this.json.targets}getAssessor(e,r){const t=r?`${e}_${r}`:e,s=this.json.attributes[t];return s==null?null:this.gltf.assessors[s]}getBufferView(e,r){const t=this.getAssessor(e,r);return t==null?null:this.gltf.bufferViews[t.json.bufferView]??null}getOrderedTexcoordAttrName(){return Object.keys(this.json.attributes).filter(e=>e.startsWith(g.TEXCOORD)).sort((e,r)=>{const t=parseInt(e.split("_")[1]),s=parseInt(r.split("_")[1]);return t-s})}getGPUMaterialTexCoordMap(){const e=this.gltf.materials[this.json.material];if(e){const r=this.getTexCoordOrderMap(),t=e.getTexcoordIndexMap(),s=Object.entries(t).map(([o,i])=>{const a=r[i];return[o,a]});return Object.fromEntries(s)}return{}}getTexCoordOrderMap(){const e=Object.keys(this.json.attributes).filter(r=>r.startsWith(g.TEXCOORD)).map(r=>{parseInt(r.split("_")[1])}).sort().map((r,t)=>[r,t]);return Object.fromEntries(e)}getDefaultVec3FloatGPUBuffer(e){if(this.webgpu.defaultVec3FloatBuffer!=null)return this.webgpu.defaultVec3FloatBuffer;const t=12*this.getVertexCount(),s=new ArrayBuffer(t),o=e.createBuffer({label:"primitive default vec3f buffer",size:t,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(o,0,s),this.webgpu.defaultVec3FloatBuffer=o,o}getDefaultVec2FloatGPUBuffer(e){if(this.webgpu.defaultVec2FloatBuffer!=null)return this.webgpu.defaultVec2FloatBuffer;const t=8*this.getVertexCount(),s=new ArrayBuffer(t),o=e.createBuffer({label:"primitive default vec2f buffer",size:t,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return e.queue.writeBuffer(o,0,s),this.webgpu.defaultVec2FloatBuffer=o,o}}const v={NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987},z={NEAREST:9728,LINEAR:9729},w={REPEAT:10497,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648},Fe={label:"gltf default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"};class Ge{gltf;ref;json;webgpu={};getImage(){return this.gltf.images[this.json.source]??null}constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t}getGPUTexture(e){if(this.webgpu.texture!=null)return this.webgpu.texture;const r=this.gltf.images[this.json.source];if(r==null)return null;if(r.loadImage(),r.status===E.READY){const t=r.image,s=xe(e,t,{mips:this.needMipmap()});this.webgpu.texture=s}else return null}needMipmap(){const e=this.gltf.samplers[this.json.sampler];return e==null?!1:e.needMipmap()}getGPUSampler(e){if(this.webgpu.sampler!=null)return this.webgpu.sampler;{const r=this.gltf.samplers[this.json.sampler];r==null?this.webgpu.sampler=e.createSampler(Fe):this.webgpu.sampler=r.getGPUSampler(e)}}}class Le{gltf;ref;json;minFilter;magFilter;wrapS;wrapT;webgpu={};constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t,this.minFilter=this.json.minFilter??v.LINEAR,this.magFilter=this.json.magFilter??z.LINEAR,this.wrapS=this.json.wrapS??w.REPEAT,this.wrapT=this.json.wrapT??w.REPEAT}needMipmap(){return this.minFilter===v.NEAREST_MIPMAP_NEAREST||this.minFilter===v.LINEAR_MIPMAP_NEAREST||this.minFilter===v.NEAREST_MIPMAP_LINEAR||this.minFilter===v.LINEAR_MIPMAP_LINEAR}getGPUSamplerDescriptor(){const e={label:"gltf sampler"};switch(this.minFilter){case v.NEAREST:e.minFilter="nearest";break;case v.LINEAR:e.minFilter="linear";break;case v.NEAREST_MIPMAP_NEAREST:e.minFilter="nearest",e.mipmapFilter="nearest";break;case v.LINEAR_MIPMAP_NEAREST:e.minFilter="linear",e.mipmapFilter="nearest";break;case v.NEAREST_MIPMAP_LINEAR:e.minFilter="nearest",e.mipmapFilter="linear";break;case v.LINEAR_MIPMAP_LINEAR:e.minFilter="linear",e.mipmapFilter="linear";break}switch(this.magFilter){case z.NEAREST:e.magFilter="nearest";break;case z.LINEAR:e.magFilter="linear";break}switch(this.wrapS){case w.REPEAT:e.addressModeU="repeat";break;case w.CLAMP_TO_EDGE:e.addressModeU="clamp-to-edge";break;case w.MIRRORED_REPEAT:e.addressModeU="mirror-repeat"}switch(this.wrapT){case w.REPEAT:e.addressModeV="repeat";break;case w.CLAMP_TO_EDGE:e.addressModeV="clamp-to-edge";break;case w.MIRRORED_REPEAT:e.addressModeV="mirror-repeat"}return e}getGPUSampler(e){return this.webgpu.sampler==null&&(this.webgpu.sampler=e.createSampler(this.getGPUSamplerDescriptor())),this.webgpu.sampler}}class q{#r;#a;#e;#t={baseColorFactor:[1,1,1,1],metallicFactor:1,roughnessFactor:1};#i=1;#s;#n=[0,0,0];#o;#h=1;#l;#u="OPAQUE";#c=.5;#f=!1;webgpu={};constructor(e,r,t){if(this.#r=e,this.#a=r,this.#e=t,this.#e){const s=this.#e.pbrMetallicRoughness;s&&(this.#t.baseColorTexture=s.baseColorTexture,this.#t.metallicRoughnessTexture=s.metallicRoughnessTexture),this.#s=this.#e.normalTexture,this.#o=this.#e.emissiveTexture,this.#l=this.#e.occlusionTexture,this.#e.normalTexture.scale!=null&&(this.#i=this.#e.normalTexture.scale),this.#e.occlusionTexture.strength!=null&&(this.#h=this.#e.occlusionTexture.strength),this.#e.emissiveFactor!=null&&(this.#n=this.#e.emissiveFactor),this.#u=this.#e.alphaMode,this.#c=this.#e.alphaCutoff,this.#f=this.#e.doubleSided}}getAlphaMode(){return this.#u}getAlphaCutoff(){return this.#c}getDoubleSided(){return this.#f}hasBaseColorTexture(){return!!this.#t.baseColorTexture}hasMetallicRoughnessTexture(){return!!this.#t.metallicRoughnessTexture}hasNormalTexture(){return!!this.#s}hasEmissiveTexture(){return!!this.#o}hasOcclusionTexture(){return!!this.#l}getTexcoordIndexMap(){return{baseColor:this.#t.baseColorTexture.texCoord,metallicRoughness:this.#t.metallicRoughnessTexture.texCoord,normal:this.#s.texCoord,emmissive:this.#o.texCoord,occlusion:this.#l.texCoord}}getGPUMaterial(e){if(this.webgpu.material==null){let r=!0;const t={externalTexture:!0,baseColorFactor:this.#t.baseColorFactor,metallicFactor:this.#t.metallicFactor,roughnessFactor:this.#t.roughnessFactor,normalScale:this.#i,emmissiveFactor:this.#n,occlusionStrength:this.#h,alphaMode:this.#u,alphaCutoff:this.#c,doubleSided:this.#f};if(this.hasBaseColorTexture()){const o=this.#t.baseColorTexture,i=this.#r.textures[o.index],a=i.getGPUTexture(e);t.baseColorTexCoord=o.texCoord??0,a==null?r=!1:(t.baseColorTexture=a,t.baseColorSampler=i.getGPUSampler(e))}if(this.hasMetallicRoughnessTexture()){const o=this.#t.metallicRoughnessTexture,i=this.#r.textures[o.index],a=i.getGPUTexture(e);t.metallicRoughnessTexCoord=o.texCoord??0,a==null?r=!1:(t.metallicRoughnessTexture=a,t.metallicRoughnessSampler=i.getGPUSampler(e))}if(this.hasNormalTexture()){const o=this.#s,i=this.#r.textures[o.index],a=i.getGPUTexture(e);t.normalTexCoord=o.texCoord??0,a==null?r=!1:(t.normalTexture=a,t.normalSampler=i.getGPUSampler(e))}if(this.hasEmissiveTexture()){const o=this.#o,i=this.#r.textures[o.index],a=i.getGPUTexture(e);t.emmissiveTexCoord=o.texCoord??0,a==null?r=!1:(t.emmissiveTexture=a,t.emmissiveSampler=i.getGPUSampler(e))}if(this.hasOcclusionTexture()){const o=this.#l,i=this.#r.textures[o.index],a=i.getGPUTexture(e);t.occlusionTexCoord=o.texCoord??0,a==null?r=!1:(t.occlusionTexture=a,t.occlusionSampler=i.getGPUSampler(e))}const s=new J(t);return r&&(this.webgpu.material=s),s}return this.webgpu.material}}const E={NONE:0,LOADING:1,READY:2,FAILED:3};class Be{gltf;ref;json;image=null;status=E.NONE;constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t}loadImage(){if(this.status===E.NONE)return this.status=E.LOADING,(async()=>{if(this.json.uri){let r="";this.json.uri.startsWith("data:")?r=this.json.uri:r=`${this.gltf.url}/${this.json.uri}`,fetch(r).then(t=>{t.blob().then(s=>{createImageBitmap(s).then(o=>(this.image=o,this.status=E.READY,this.image))})})}else if(this.json.bufferView){const r=this.gltf.bufferViews[this.json.bufferView];if(!r)throw this.status=E.FAILED,new Error("GLTFImage loadImage get bufferView Failed");const t=r.byteOffset,s=r.byteLength;r.loadData().then(o=>{const i=this.json.mimeType,a=new ArrayBuffer(s);return new Uint8Array(a).set(o.slice(t,t+s)),Xe(a,i),this.image=null,this.status=E.READY,this.image})}})()}}class _e{gltf;ref;json;constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t}}class Ue{gltf;ref;json;constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t}}class De{gltf;ref;json;constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t}}const Ve={SCALA:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},S={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,UNSIGNED_INT:5125,FLOAT:5126},ze=Object.fromEntries(Object.entries(S).map(([n,e])=>[e,n])),ke={BYTE:1,UNSIGNED_BYTE:1,SHORT:2,UNSIGNED_SHORT:2,UNSIGNED_INT:4,FLOAT:4};class $e{gltf;ref;json;count;byteOffset;constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t,this.byteOffset=this.json.byteOffset??0,this.count=this.json.count??0}async loadData(){return this.gltf.bufferViews[this.json.bufferView].loadData()}getElementBytes(){const e=this.json.type,r=this.json.componentType,t=Ve[e],s=ke[ze[r]];return t*s}}class We{gltf;ref;json;byteLength;byteOffset;byteStride;constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t,this.byteLength=this.json.byteLength,this.byteOffset=this.json.byteOffset??0,this.byteStride=this.json.byteStride}async loadData(){return this.gltf.buffers[this.json.buffer].loadData()}}const y={NONE:0,LOADING:1,READY:2};class Ye{gltf;ref;json;byteLength;uri;data=null;status=y.NONE;webgpu={buffers:{}};constructor(e,r,t){this.gltf=e,this.ref=r,this.json=t,this.byteLength=this.json.byteLength,this.uri=this.json.uri}loadData(){return this.status=y.LOADING,(async()=>{let e=null;if(this.uri){let r=this.json.uri;this.uri.startsWith("data:")||(r=`${this.gltf.url}/${this.uri}`);const t=await fetch(r);if(!t.ok)throw new Error(`Failed to load buffer data: ${t.status}`);e=await t.arrayBuffer()}return this.data=new Uint8Array(e),this.status=y.READY,this.data})()}getGPUBuffer(e,r){if(this.status===y.NONE)return this.loadData(),null;if(this.status===y.LOADING)return null;if(this.webgpu.buffers[r]!=null)return this.webgpu.buffers[r];{const t=e.createBuffer({label:this.json.name??"gltf buffer",size:this.json.byteLength,usage:r});e.queue.writeBuffer(t,0,this.data.buffer,0,this.byteLength),this.webgpu.buffers[r]=t}}}class He extends de{#r;#a;#e;#t;#i=!1;#s=[];scenes;nodes;meshes;camera;textures;samplers;materials;images;skins;animations;assessors;bufferViews;buffers;#n;constructor(e){super(e),this.#r=e.uri,this.#a=this.#r.replace(/\/[^\/]*$/,"/"),this.#o(this.#r).then(r=>{this.#e=r;const s=r.asset.version;if(this.#t=s,s!=="2.0")throw Error("only supports glTF 2.0 currently.");this.build(),this.#i=!0;for(const o of this.#s)o(this)})}get ready(){return this.#i}get uri(){return this.#r}get url(){return this.#a}get json(){return this.#e}get version(){return this.#t}get defaultMaterial(){return this.#n||(this.#n=new q(this)),this.#n}getMaterial(e){return e==null?this.defaultMaterial:this.materials[e]}onReady(e){this.ready?e(this):this.#s.push(e)}async#o(e){const r=await fetch(e);if(!r.ok)throw new Error(r.statusText);const t=await r.json();return this.#e=t,this.#e}build(){this.scenes=this.json.scenes?.map((e,r)=>new je(this,r,e)),this.nodes=this.json.nodes?.map((e,r)=>new Re(this,r,e)),this.meshes=this.json.meshes?.map((e,r)=>new Ne(this,r,e)),this.camera=this.json.cameras?.map((e,r)=>new _e(this,r,e)),this.textures=this.json.textures?.map((e,r)=>new Ge(this,r,e)),this.samplers=this.json.samplers?.map((e,r)=>new Le(this,r,e)),this.materials=this.json.materials?.map((e,r)=>new q(this,r,e)),this.images=this.json.images?.map((e,r)=>new Be(this,r,e)),this.skins=this.json.skins?.map((e,r)=>new Ue(this,r,e)),this.animations=this.json.animations?.map((e,r)=>new De(this,r,e)),this.assessors=this.json.accessors?.map((e,r)=>new $e(this,r,e)),this.bufferViews=this.json.bufferViews?.map((e,r)=>new We(this,r,e)),this.buffers=this.json.buffers?.map((e,r)=>new Ye(this,r,e))}initWebGPU(e,r,t){this.webgpu.gpuinfo=e,this.webgpu.canvasinfo=r,this.webgpu.scene=t}refreshVertexBuffers(e){throw new Error("Method not implemented.")}refreshUniforms(e){throw new Error("Method not implemented.")}createPipeline(e){throw new Error("Method not implemented.")}draw(e){throw new Error("Method not implemented.")}destroy(){throw new Error("Method not implemented.")}}async function Xe(n,e){const r=new Blob([n],{type:e});return await createImageBitmap(r,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}var K=`override MAX_LIGHTS: u32 = 10u;

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
    const g3 = vec3f(g,g,g);\r
    return vec4f(pow(c.xyz, g3), c.a);\r
}

fn rgamma(c:vec4f) -> vec4f {\r
    const g = 1.0/2.2;\r
    const g3 = vec3f(g,g,g);\r
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
        newNormal = normal;\r
        
    }

    var emmissive:vec4f = vec4f(pbrMaterial.emmissiveFactor,1.0);\r
    if(u32bool(pbrMaterial.hasEmmissiveTexture)) {\r
        emmissive = textureSample(\r
        emmissiveTexture, \r
        emmissiveSampler, \r
        emmissiveTexcoord);\r
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

    var finalColor = occlusion * (emmissive + pbrcolor);\r
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

    let n_dot_v = max(dot(n, v), 1e-7); 
    let n_dot_l = max(dot(n, l), 1e-7);\r
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
    @location(2) tangent: vec3f,\r
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
    @location(2) tangent: vec3f,\r
    @location(3) baseColorTexcoord: vec2f,\r
    @location(4) metallicRoughnessTexcoord: vec2f,\r
    @location(5) normalTexcoord: vec2f,\r
    @location(6) emmissiveTexcoord: vec2f,\r
    @location(7) occlusionTexcoord: vec2f,\r
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
    normalmtx: mat3x3f,\r
    tangentmtx: mat3x3f,\r
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
    output.normal = model.normalmtx * input.normal;\r
    output.tangent = model.tangentmtx * input.tangent;\r
    output.baseColorTexcoord = getTexcoord(input, model.texcoordOrder.baseColor);\r
    output.metallicRoughnessTexcoord = getTexcoord(input, model.texcoordOrder.metallicRoughness);\r
    output.normalTexcoord = getTexcoord(input, model.texcoordOrder.normal);\r
    output.emmissiveTexcoord = getTexcoord(input, model.texcoordOrder.emmissive);\r
    output.occlusionTexcoord = getTexcoord(input, model.texcoordOrder.occlusion);\r
    return output;\r
}

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {

    let n = normalize(input.normal);

    let color = getPbrMaterialColor(\r
        input.baseColorTexcoord,\r
        input.metallicRoughnessTexcoord,\r
        input.normalTexcoord,\r
        input.emmissiveTexcoord,\r
        input.occlusionTexcoord,\r
        input.worldpos,\r
        scene.camera.eye,\r
        input.normal,\r
        scene.numLights,\r
        scene.lights\r
    );

    return color;

}`;class k{options;gpuinfo;canvasinfo;scene;definition;pipeline;constructor(e){this.options=e}static getAttributeOptions(e,r,t){const s=t in r.json.attributes;let o=0,i=0;if(s){const a=r.getAssessor(t);i=r.getBufferView(t).byteStride??a.getElementBytes(),o=0}else i=0,o=0;return{exists:s,stride:i,offset:o}}static getMultiAttributeOptions(e,r,t){return Object.keys(r.json.attributes).filter(s=>s.startsWith(t)).map(s=>{const o=r.json.attributes[s],i=e.assessors[o];return{exists:!0,stride:e.bufferViews[i.json.bufferView].byteStride??i.getElementBytes(),offset:0}})}static attributeKey(e,r){return r.exists?`${e}:T:${r.stride}:${r.offset}`:`${e}:F`}static multiAttributeKey(e,r){return r.map(t=>this.attributeKey(e,t)).join(",")}static getPipelineOptionsOfPrimitive(e,r){const t=r.getMeterial();return{mode:r.getMode(),indices:r.hasIndicies(),position:this.getAttributeOptions(e,r,g.POSITION),normal:this.getAttributeOptions(e,r,g.NORMAL),tangent:this.getAttributeOptions(e,r,g.TANGENT),texoord:this.getMultiAttributeOptions(e,r,g.TEXCOORD),joints:this.getMultiAttributeOptions(e,r,g.JOINTS),weights:this.getMultiAttributeOptions(e,r,g.WEIGHTS),morph:r.hasMorph(),colorTexutre:t.hasBaseColorTexture(),metalTexture:t.hasMetallicRoughnessTexture(),normalTexture:t.hasNormalTexture(),emmissiveTexture:t.hasEmissiveTexture(),occlusionTexture:t.hasOcclusionTexture(),alphaMode:t.getAlphaMode(),doubleSided:t.getDoubleSided()}}static getPipelineKeyOfOptions(e){function r(o,i){return i?`${o}:T`:`${o}:F`}return[e.mode,this.attributeKey("pos",e.position),this.attributeKey("nor",e.normal),this.attributeKey("tan",e.tangent),this.multiAttributeKey("tex",e.texoord),this.multiAttributeKey("jot",e.joints),this.multiAttributeKey("wgt",e.weights),r("mor",e.morph),e.alphaMode,r("dbs",e.doubleSided)].join("|")}getBlend(){if(this.options.alphaMode==="BLEND")return{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}getCullMode(){return this.options.doubleSided?"front":"none"}getDepthWriteEnabled(){return this.options.alphaMode!=="BLEND"}createPipeline(e,r,t){this.gpuinfo=e,this.canvasinfo=r,this.scene=t;const s="gltf",o=e.device;this.definition=ve(K);const i=o.createShaderModule({label:s,code:K}),a=o.createBindGroupLayout({label:s,entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),l=o.createPipelineLayout({label:s,bindGroupLayouts:[this.scene.bindGroupLayout,J.getBindGroupLayout(o),a]});let f=0;const u=[];u.push({arrayStride:this.options.position.stride,attributes:[{shaderLocation:f++,offset:0,format:"float32x3"}]}),u.push({arrayStride:this.options.normal.stride,attributes:[{shaderLocation:f++,offset:0,format:"float32x3"}]}),u.push({arrayStride:this.options.tangent.stride,attributes:[{shaderLocation:f++,offset:0,format:"float32x3"}]});for(let m=0;m<5;++m){const d=this.options.texoord[m];u.push({arrayStride:d?.stride??8,attributes:[{shaderLocation:f++,offset:0,format:"float32x2"}]})}const c=o.createRenderPipeline({label:s,layout:l,vertex:{module:i,buffers:u},fragment:{module:i,targets:[{format:r.context.getConfiguration().format,blend:this.getBlend()}]},primitive:{topology:"triangle-list",cullMode:this.getCullMode(),frontFace:"ccw"},depthStencil:{depthWriteEnabled:this.getDepthWriteEnabled(),format:"depth32float",depthCompare:"less-equal"}});this.pipeline=c}}class A{static pipelines={};webgpu;constructor(e,r,t){this.webgpu={gpuinfo:e,canvasinfo:r,scene:t}}render(e){const r=e.sceneRef??e.gltf.json.scene,t=e.gltf.scenes[r];this.renderScene(t,e)}renderScene(e,r){for(const t of e.nodes){const s=r.gltf.nodes[t];this.renderNode(s,r.matrix??O(),r)}}renderNode(e,r,t){const s=le(O(),r,e.matrix);if(e.children!=null)for(const o of e.children){const i=t.gltf.nodes[o];this.renderNode(i,s,t)}if(e.camera!=null,e.skin!=null,e.mesh!=null){const o=t.gltf.meshes[e.mesh];this.renderMesh(o,s,t)}}renderMesh(e,r,t){for(const s of e.primitives)this.renderPrimitive(e,r,s,t)}renderPrimitive(e,r,t,s){const o=k.getPipelineOptionsOfPrimitive(s.gltf,t),i=k.getPipelineKeyOfOptions(o);let a;i in A.pipelines?(a=A.pipelines[i],a.pipeline==null&&a.createPipeline(this.webgpu.gpuinfo,this.webgpu.canvasinfo,this.webgpu.scene)):(a=new k(o),a.createPipeline(this.webgpu.gpuinfo,this.webgpu.canvasinfo,this.webgpu.scene),A.pipelines[i]=a);const l=this.webgpu.gpuinfo.device;if(t.webgpu.uniform==null){const h=Te(a.definition.uniforms.model),p=t.getGPUMaterialTexCoordMap();t.webgpu.uniform=this.createModelUniform(l,h),h.set({modelmtx:r,normalmtx:H($(),r),tangentmtx:H($(),r),texcoordOrder:{baseColor:p.baseColor??0,metallicRoughness:p.metallicRoughness??0,normal:p.normal??0,emmissive:p.emmissive??0,occlusion:p.occlusion??0}}),l.queue.writeBuffer(t.webgpu.uniform,0,h.arrayBuffer)}const f=l.createBindGroup({label:"primitive",layout:a.pipeline.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:t.webgpu.uniform}}]});let u=null;if(t.hasIndicies()&&(u=this.getPrimitiveIndexBuffer(l,t),u==null))return;let c=null;if(t.hasPosition()&&(c=this.getPrimitiveAttributeBuffer(l,t,g.POSITION),c==null))return;let m=null;t.hasNormal()&&(m=this.getPrimitiveAttributeBuffer(l,t,g.NORMAL));let d=null;t.hasTangent()&&(d=this.getPrimitiveAttributeBuffer(l,t,g.TANGENT));const x=t.getOrderedTexcoordAttrName(),b=[];for(let h=0;h<5;++h){const p=x[h];if(p!=null){const j=parseInt(p.split("_")[1]);b.push(this.getPrimitiveAttributeBuffer(l,t,g.TEXCOORD,j))}else b.push(null)}s.pass.setPipeline(a.pipeline),s.pass.setVertexBuffer(0,c.buffer,c.offset,c.size),m!=null?s.pass.setVertexBuffer(1,m.buffer,m.offset,m.size):s.pass.setVertexBuffer(1,t.getDefaultVec3FloatGPUBuffer(l)),d!=null?s.pass.setVertexBuffer(2,d.buffer,d.offset,d.size):s.pass.setVertexBuffer(2,t.getDefaultVec3FloatGPUBuffer(l));for(let h=0;h<5;++h){const p=b[h];p!=null?s.pass.setVertexBuffer(3+h,p.buffer,p.offset,p.size):s.pass.setVertexBuffer(3+h,t.getDefaultVec2FloatGPUBuffer(l))}s.pass.setBindGroup(0,this.webgpu.scene.bindGroup),s.pass.setBindGroup(1,t.getMeterial().getGPUMaterial(l).getBindGroup(l)),s.pass.setBindGroup(2,f),t.hasIndicies()?(s.pass.setIndexBuffer(u.buffer,u.format,u.offset,u.size),s.pass.drawIndexed(u.count)):s.pass.draw(c.count)}getGPUIndexFormat(e){switch(e.json.componentType){case S.UNSIGNED_BYTE:return"uint16";case S.UNSIGNED_SHORT:return"uint16";case S.UNSIGNED_INT:return"uint32"}}getPrimitiveIndexBuffer(e,r){const t=r.gltf.assessors[r.json.indices],s=r.gltf.bufferViews[t.json.bufferView],o=r.gltf.buffers[s.json.buffer],i=t.json.componentType,a=this.getGPUIndexFormat(t);if(i!==S.UNSIGNED_BYTE){const l=t.json.byteOffset??0,f=s.json.byteOffset??0,u=s.byteLength,c=l+f,m=u-l,d=t.json.count,x=o.getGPUBuffer(e,GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST);return x==null?null:{buffer:x,format:a,offset:c,size:m,count:d}}else throw Error("Index Format 当前不支持uint8")}getPrimitiveAttributeBuffer(e,r,t,s){let o;s!=null?o=`${t}_${s}`:o=t;const i=r.json.attributes[o];R(i);const a=r.gltf.assessors[i];R(a);const l=r.gltf.bufferViews[a.json.bufferView];R(l);const f=r.gltf.buffers[l.json.buffer];R(f);const u=a.json.byteOffset??0,c=l.json.byteOffset??0,m=l.byteLength,d=u+c,x=m-u,b=a.json.count,h=f.getGPUBuffer(e,GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST);return h==null?null:{buffer:h,offset:d,size:x,count:b}}createModelUniform(e,r){return e.createBuffer({label:"model uniform",size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}}const qe=""+new URL("../data/mesh/gltf/DamagedHelmet/DamagedHelmet.gltf",import.meta.url).href;class Ke{gpuInfo=null;canvasInfo=null;colorTexture=null;depthFormat="depth32float";depthTexture=null;camera=null;projection=null;scene=null;cameraMouseCtrl=null;firstpass=!0;ready=!1;resizeObserver=null;ground=null;axis=null;gltfs=[];gltfRender;readyCallbacks=[];constructor(){we().then(e=>{if(e===null){console.error("GPU INFO is NULL");return}this.gpuInfo=e;const t=Ee({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(t===null){console.error("canvasInfo is NULL");return}this.canvasInfo=t;const s=this.canvasInfo.canvas.width,o=this.canvasInfo.canvas.height;this.canvasInfo=t,this.refreshDepthTexture();const i=[2,2,4,1],a=[0,0,0,1],l=[0,0,1,0];this.camera=new he(i,a,l),this.projection=new Ie(Math.PI/2,s/o,.1,1e3),this.scene=new ge(this.camera,this.projection);for(let f=0;f<10;++f){const u=[Math.random(),Math.random(),Math.random()].map(c=>c*2-1).map(c=>c*10);this.scene.addLight(new pe(u,[1,1,1,1]))}this.scene.initWebGPU(this.gpuInfo,this.canvasInfo),this.scene.refreshViewport(this.canvasInfo.canvas.width,this.canvasInfo.canvas.height),this.cameraMouseCtrl=new me(this.camera,this.canvasInfo.canvas),this.cameraMouseCtrl.enable(),this.gltfRender=new A(this.gpuInfo,this.canvasInfo,this.scene),this.ground=new Me({xsize:100,ysize:100,density:2}),this.ground.initWebGPU(this.gpuInfo,this.canvasInfo),this.axis=new be({xlim:[0,50],ylim:[0,50],zlim:[0,50]}),this.axis.initWebGPU(this.gpuInfo,this.canvasInfo,this.scene),this.resizeObserver=new ResizeObserver(f=>{for(const u of f){const c=u.target,m=u.contentBoxSize[0].inlineSize,d=u.contentBoxSize[0].blockSize;c.width=Math.max(1,Math.min(m,this.gpuInfo.device.limits.maxTextureDimension2D)),c.height=Math.max(1,Math.min(d,this.gpuInfo.device.limits.maxTextureDimension2D)),this.projection.aspect=c.width/c.height,this.scene.refreshViewport(c.width,c.height),this.refreshDepthTexture()}}),this.resizeObserver.observe(t.canvas),this.ready=!0,this.readyCallbacks.forEach(f=>f(this))}).catch(e=>{this.ready=!1,console.error(e)})}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}refreshDepthTexture(){const e=Pe(this.gpuInfo,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height,this.depthFormat);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=ye({label:"demo",first:this.firstpass,colorTexture:this.canvasInfo.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}addGLTF(e){this.gltfs.push(e)}render(){if(this.ready){const e=this.gpuInfo.device.createCommandEncoder();this.firstpass=!0;const r=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.ground&&this.ground.draw(this.gpuInfo,this.camera,this.projection,r),this.axis&&this.axis.draw(r);for(const s of this.gltfs)this.gltfRender.render({pass:r,gltf:s.gltf,sceneRef:s.scene,matrix:s.matrix});r.end();const t=e.finish();this.gpuInfo.device.queue.submit([t])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}}function Je(){const n=new Ke;n.onReady(()=>{n.draw();const e=qe,r=new He({uri:e}),t=O();ue(t,t,[0,0,2]),ce(t,t,Math.PI/2),fe(t,t,Math.PI),r.onReady(()=>{n.addGLTF({gltf:r,scene:0,matrix:t})})})}Je();
