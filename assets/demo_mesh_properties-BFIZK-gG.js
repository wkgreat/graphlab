import"./modulepreload-polyfill-B5Qt9EMX.js";import{g,c as x,t as Z,i as S,o as b,f as M,q as B,r as j,s as L,h as I,j as K,k as O,n as T,m as A,u as J,v as Q,w as N,b as ee,d as te,C as se,a as re,P as ie,x as ne,y as oe}from"./camera-DXA52umf.js";import{T as U,b as ae,C as ce,d as W,e as z,R as he,G as le,P as fe,c as pe,a as de}from"./color-Bd6XzoaT.js";import{m as H,c as P,a as D}from"./webgpu-utils.module-DPkR54bZ.js";const X=""+new URL("../data/mesh/bun_zipper.ply",import.meta.url).href,ue=""+new URL("../data/mesh/bun_zipper_res2.ply",import.meta.url).href,me=""+new URL("../data/mesh/bun_zipper_res3.ply",import.meta.url).href,ge=""+new URL("../data/mesh/bun_zipper_res4.ply",import.meta.url).href;class xe{#s;#r;#i;#t;#e;#n;#o;#a=[];constructor(e){this.#s=e.ka,this.#r=e.ambient,this.#i=e.kd,this.#t=e.diffuse,this.#e=e.ks,this.#n=e.specular,this.#o=e.phong}addCallback(e){this.#a.push(e)}invokeChange(){for(const e of this.#a)e(this)}set ka(e){this.#s=e,this.invokeChange()}set ambient(e){this.#r=e,this.invokeChange()}set kd(e){this.#i=e,this.invokeChange()}set diffuse(e){this.#t=e,this.invokeChange()}set ks(e){this.#e=e,this.invokeChange()}set specular(e){this.#n=e,this.invokeChange()}set phong(e){this.#o=e,this.invokeChange()}get ka(){return this.#s}get ambient(){return this.#r}get kd(){return this.#i}get diffuse(){return this.#t}get ks(){return this.#e}get specular(){return this.#n}get phong(){return this.#o}}function R(u){return g(u[0],u[1],u[2])}const $=`override ENABLE_LIGHT: bool = true;\r
\r
struct PointLight {\r
    position: vec3f,\r
    color: vec4f\r
};\r
\r
struct BlinnPhong {\r
    ka: f32,\r
    kd: f32,\r
    ks: f32,\r
    phong: f32,\r
    ambient: vec4f,\r
    diffuse: vec4f,\r
    specular: vec4f\r
}\r
\r
struct Camera {\r
    eye: vec3f,\r
    center: vec3f,\r
    up: vec3f,\r
    viewmtx: mat4x4f,\r
    viewmtxInv: mat4x4f\r
}\r
\r
struct Projection {\r
    near: f32,\r
    far: f32,\r
    fovy: f32,\r
    aspect: f32,\r
    projmtx: mat4x4f,\r
    projmtxInv: mat4x4f\r
}\r
\r
struct Viewport {\r
    width: f32,\r
    height: f32,\r
    viewportmtx: mat4x4f,\r
    viewportmtxInv: mat4x4f\r
}\r
\r
struct SceneUniform {\r
    camera: Camera,\r
    projection: Projection,\r
    viewport: Viewport,\r
    numLights: u32,\r
    lights: array<PointLight, 16u>,\r
};\r
\r
struct MaterialUniform {\r
    blinnPhong: BlinnPhong\r
}\r
\r
const MeshRenderSpace_WORLD: u32 = 0;\r
const MeshRenderSpace_NDC: u32 = 1;\r
\r
struct ModelUniform {\r
    hasnormal: u32,\r
    hastexcoord: u32,\r
    lighting: u32,\r
    space: u32,\r
    modelmtx: mat4x4f,\r
    normalmtx: mat4x4f\r
};\r
\r
@group(0) @binding(0) var<uniform> scene : SceneUniform;\r
@group(1) @binding(0) var<uniform> material : MaterialUniform;\r
@group(1) @binding(1) var<uniform> model : ModelUniform;\r
\r
struct VSInput {\r
    @location(0) position: vec3f,\r
    @location(1) normal: vec3f,\r
    @location(2) texcoord: vec2f,\r
    @location(3) color: vec4f\r
}\r
\r
struct VSOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) worldpos: vec3f,\r
    @location(1) worldnormal: vec3f,\r
    @location(2) color: vec4f\r
}\r
\r
@vertex\r
fn vs(input: VSInput) -> VSOutput {\r
    let worldpos = model.modelmtx * vec4f(input.position, 1);\r
    let worldnormal = model.normalmtx * vec4f(input.normal, 0);\r
    var ndcpos: vec4f;\r
    if(model.space==MeshRenderSpace_WORLD) {\r
        ndcpos = scene.projection.projmtx * scene.camera.viewmtx * worldpos;\r
    } else {\r
        ndcpos = worldpos;\r
    }\r
    var output: VSOutput;\r
    output.position = ndcpos;\r
    output.worldpos = worldpos.xyz;\r
    output.worldnormal = worldnormal.xyz;\r
    output.color = input.color;\r
    return output;\r
}\r
\r
fn premultiplied(color:vec4f) -> vec4f {\r
    return vec4f(color.rgb * color.a, color.a);\r
}\r
\r
fn blinnPhong(bp: BlinnPhong, color:vec4f, pos:vec3f, eye: vec3f, normal:vec3f) -> vec4f {\r
\r
    let e = normalize(eye-pos);\r
    let n = normalize(normal);\r
    let nlights = min(16u, scene.numLights);\r
\r
    var rescolor = vec4f(0,0,0,0);\r
    for(var i=0u; i<nlights; i=i+1u) {\r
        let l = normalize(scene.lights[i].position - pos);\r
        let dc = premultiplied(color) + premultiplied(bp.diffuse) + premultiplied(scene.lights[i].color);\r
        let cd = bp.kd * dc * max(0, dot(n,l));\r
        let h = normalize(l+e);\r
        let cs = bp.ks * bp.specular * pow(max(0, dot(n,h)), bp.phong);\r
        rescolor = rescolor + cd + cs;\r
    }\r
    rescolor = rescolor + bp.ka * bp.ambient;\r
    rescolor.a = 1;\r
    return rescolor;\r
\r
}\r
\r
@fragment\r
fn fs(input: VSOutput) -> @location(0) vec4f {\r
    if(ENABLE_LIGHT && model.lighting>0u && model.hasnormal>0u && scene.numLights > 0) {\r
        var color = blinnPhong(material.blinnPhong, input.color, input.worldpos, scene.camera.eye, input.worldnormal);\r
        return color;\r
    } else {\r
        return input.color;\r
    }\r
}`,V={WORLD:0},w={NONE:0,VERTEX:1,FACE:2};class G{render=null;positions;normals;texcoords;vertexCount=0;vertexIndices;wireframeVertexIndices;textureIndices;textures;colors;colorMode;wireframeColors;#s;#r=!0;#i=V.WORLD;label="Mesh";modelmtx=x();halfedge;#t=!1;#e={};selectMode=w.NONE;selectVertexNRing=0;constructor(e){this.label=e??"Mesh",this.#e.uniforms={},this.#e.pipelines={},this.#e.buffers={},this.#e.textures={},this.#e.samplers={},this.modelmtx=x(),this.#s=new xe({ka:.1,ambient:[1,1,1,1],kd:1,diffuse:[.1,.1,.1,0],ks:.1,specular:[1,1,1,1],phong:1.5})}set wireframe(e){this.#t=e,this.refreshVertexBuffers()}set lighting(e){this.#r=e}get lighting(){return this.#r}createDefaultColors(){const e=this.positions.length/3,s=[0,1,0,1];this.colors=new Float32Array(Array(e).fill(s).flat())}setColor(e){const s=this.positions.length/3;Math.max(...e)>1&&(e=e.map(t=>t/255)),this.colors=new Float32Array(Array(s).fill(e).flat()),this.refreshDefaultVertexBuffer(!0)}setColors(e){const s=this.positions.length/3,t=e.length,r=new Float32Array(s*4);for(let i=0;i<s;++i){const n=e[i%t];r[i*4]=n[0],r[i*4+1]=n[1],r[i*4+2]=n[2],r[i*4+3]=n[3]}this.colors=r,this.refreshDefaultVertexBuffer(!0)}createDefaultWireframeColors(){const e=this.positions.length/3,s=[0,0,0,.1];this.wireframeColors=new Float32Array(Array(e).fill(s).flat())}setWireframeColor(e){const s=this.positions.length/3;Math.max(...e)>1&&(e=e.map(t=>t/255)),this.wireframeColors=new Float32Array(Array(s).fill(e).flat()),this.refreshWireframeVertexBuffer(!0)}get wireframe(){return this.#t}createHalfEdge(){this.halfedge=new ve(this)}initWebGPU(e,s,t,r={depth:{depthBias:0,depthBiasSlopeScale:0},space:V.WORLD}){this.#e.gpuinfo=e,this.#e.canvasinfo=s,this.#e.definition=H($),this.#i=r.space,this.render=new be(e,s,t),this.vertexCount=this.positions.length/3,this.refreshVertexBuffers(),this.refreshUniforms(t.camera,t.projection),this.createPipelines(r)}createWireFrameVertexIndices(){if(this.vertexIndices&&!this.wireframeVertexIndices){const e=this.vertexIndices.length;this.wireframeVertexIndices=new Uint32Array(e/3*5);for(let s=0;s<this.vertexIndices.length/3;++s)this.wireframeVertexIndices[s*5]=this.vertexIndices[s*3],this.wireframeVertexIndices[s*5+1]=this.vertexIndices[s*3+1],this.wireframeVertexIndices[s*5+2]=this.vertexIndices[s*3+2],this.wireframeVertexIndices[s*5+3]=this.vertexIndices[s*3],this.wireframeVertexIndices[s*5+4]=4294967295}}setModelMatrix(e){this.modelmtx=e}refreshDefaultVertexBuffer(e=!1){if(!this.#e.gpuinfo)return;const s=this.#e.gpuinfo.device;if(e||!("default"in this.#e.buffers)){this.colors||this.createDefaultColors();const t=this.#e.buffers.default;if(this.vertexIndices){const r=P(s,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4},indices:this.vertexIndices});this.#e.buffers.default=r}else{const r=P(s,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4}});this.#e.buffers.default=r}t&&(t.buffers.forEach(r=>r.destroy()),t.indexBuffer&&t.indexBuffer.destroy())}}refreshWireframeVertexBuffer(e=!1){if(!this.#e.gpuinfo)return;const s=this.#e.gpuinfo.device;if(e||!("wireframe"in this.#e.buffers)){this.createWireFrameVertexIndices(),this.wireframeColors||this.createDefaultWireframeColors();const t=this.#e.buffers.wireframe;if(this.vertexIndices){const r=P(s,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4},indices:this.wireframeVertexIndices});this.#e.buffers.wireframe=r}else{const r=P(s,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4}});this.#e.buffers.wireframe=r}t&&(t.buffers.forEach(r=>r.destroy()),t.indexBuffer&&t.indexBuffer.destroy())}}refreshVertexBuffers(e=!1){this.refreshDefaultVertexBuffer(e),this.refreshWireframeVertexBuffer(e)}refreshUniforms(e,s){const t=this.#e.gpuinfo.device;this.render.scene.refreshUniform();const r=D(this.#e.definition.uniforms.material);"material"in this.#e.uniforms||(this.#e.uniforms.material=t.createBuffer({label:`${this.label} material uniform`,size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),r.set({blinnPhong:{ka:this.#s.ka,kd:this.#s.kd,ks:this.#s.ks,phong:this.#s.phong,ambient:this.#s.ambient,diffuse:this.#s.diffuse,specular:this.#s.specular}}),t.queue.writeBuffer(this.#e.uniforms.material,0,r.arrayBuffer);const i=D(this.#e.definition.uniforms.model);"model"in this.#e.uniforms||(this.#e.uniforms.model=t.createBuffer({label:`${this.label} model uniform`,size:i.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),i.set({hasnormal:this.normals?1:0,hastexcoord:this.texcoords?1:0,lighting:this.#r?1:0,space:this.#i,modelmtx:this.modelmtx,normalmtx:Z(x(),S(x(),this.modelmtx))}),t.queue.writeBuffer(this.#e.uniforms.model,0,i.arrayBuffer)}createPipelines(e){const s=this.#e.gpuinfo.device;this.#e.module=s.createShaderModule({label:this.label,code:$});const t=s.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=s.createPipelineLayout({bindGroupLayouts:[this.render.scene.bindGroupLayout,t]}),i={label:this.label,layout:r,vertex:{module:this.#e.module,buffers:this.#e.buffers.default.bufferLayouts},fragment:{module:this.#e.module,targets:[{format:this.#e.canvasinfo.context.getConfiguration().format,blend:{color:{operation:"add",srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:"ccw"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};i.depthStencil.depthBias=e.depth.depthBias,i.depthStencil.depthBiasSlopeScale=e.depth.depthBiasSlopeScale,this.#e.pipelines.default=s.createRenderPipeline(i),i.vertex.buffers=this.#e.buffers.wireframe.bufferLayouts,i.primitive.topology="line-strip",i.primitive.stripIndexFormat="uint32",i.depthStencil.depthBias=0,i.depthStencil.depthBiasSlopeScale=0,this.#e.pipelines.wireframe=s.createRenderPipeline(i)}draw(e){const s=this.render.gpuinfo.device,t=this.render.scene;this.refreshUniforms(t.camera,t.projection);const r=s.createBindGroup({layout:this.#e.pipelines.default.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.#e.uniforms.material}},{binding:1,resource:{buffer:this.#e.uniforms.model}}]});if(this.wireframe){const i=this.#e.buffers.wireframe;e.setPipeline(this.#e.pipelines.wireframe),e.setBindGroup(0,this.render.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,i.buffers[0]),this.vertexIndices?(e.setIndexBuffer(i.indexBuffer,i.indexFormat),e.drawIndexed(i.numElements)):e.draw(this.vertexCount)}else{const i=this.#e.buffers.default;e.setPipeline(this.#e.pipelines.default),e.setBindGroup(0,this.render.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,i.buffers[0]),this.vertexIndices?(e.setIndexBuffer(i.indexBuffer,i.indexFormat),e.drawIndexed(i.numElements)):e.draw(this.vertexCount)}}destroy(){Object.values(this.#e.buffers).forEach(e=>{e.buffers.forEach(s=>s.destroy()),e.indexBuffer&&e.indexBuffer.destroy()}),Object.values(this.#e.uniforms).forEach(e=>{e.destroy()}),Object.values(this.#e.textures).forEach(e=>{e.destroy()})}}class ve{mesh;vertexList=[];faceList=[];halfedgeMap=new Map;selectedVertexMeshes=[];selectedFaceMeshes=[];faceSelectCallbacks=[];vertexSelectCallbacks=[];constructor(e){this.mesh=e,this.build()}build(){const e=this.mesh.positions.length/3;for(let s=0;s<e;++s)this.vertexList.push({ref:s,position:s*3});for(let s=0;s<this.mesh.vertexIndices.length/3;++s){const t=this.mesh.vertexIndices[s*3],r=this.mesh.vertexIndices[s*3+1],i=this.mesh.vertexIndices[s*3+2],o=this.faceList.length,c=`${t}-${r}`,a=`${r}-${i}`,l=`${i}-${t}`,h=`${r}-${t}`,p=`${i}-${r}`,f=`${t}-${i}`;(this.halfedgeMap.has(c)||this.halfedgeMap.has(a)||this.halfedgeMap.has(l))&&console.warn("HalfEdge 边有重叠"),this.vertexList[t].halfedge=c,this.vertexList[r].halfedge=a,this.vertexList[i].halfedge=l,this.halfedgeMap.set(c,{vertexFrom:t,vertexTo:r,face:o,next:a,prev:l,opposite:h}),this.halfedgeMap.set(a,{vertexFrom:r,vertexTo:i,face:o,next:l,prev:c,opposite:p}),this.halfedgeMap.set(l,{vertexFrom:i,vertexTo:t,face:o,next:c,prev:a,opposite:f});const d={ref:o,vertices:[t,r,i],halfedge:c};this.faceList.push(d)}}clearSelectedMeshes(){this.selectedFaceMeshes.length>0&&(this.selectedFaceMeshes.forEach(e=>e.destroy()),this.selectedFaceMeshes=[]),this.selectedVertexMeshes.length>0&&(this.selectedVertexMeshes.forEach(e=>e.destroy()),this.selectedVertexMeshes=[])}addFaceSelectCallback(e){this.faceSelectCallbacks.push(e)}addVertexSelectCallback(e){this.vertexSelectCallbacks.push(e)}selectByRay(e){switch(this.mesh.selectMode){case w.NONE:break;case w.VERTEX:this.getVerticesByRay(e);break;case w.FACE:this.getFracesByRay(e);break}}getFracesByRay(e){let s=this.faceList.map((t,r)=>{const i=t.vertices.map(o=>{const c=this.vertexList[o].position,a=this.mesh.positions.slice(c,c+3),l=b(B(),M(a[0],a[1],a[2],1),this.mesh.modelmtx);return g(l[0],l[1],l[2])});return{ref:r,face:t,triangle:new U(i[0],i[1],i[2])}}).map(t=>({faceinfo:t,crossinfo:e.crossTriangle(t.triangle)})).filter(t=>t.crossinfo.cross);if(this.clearSelectedMeshes(),s.length>0){let t=1/0,r=null;for(const n of s){const o=n.crossinfo.distance;o<t&&(t=o,r=n)}s=[r];const i=this.#s(s.map(n=>n.faceinfo.triangle));this.selectedFaceMeshes.push(i)}for(const t of this.faceSelectCallbacks)t(s.map(r=>r.faceinfo))}#s(e){const s=[],t=[];for(let i=0;i<e.length;++i)s.push(...e[i].p0),s.push(...e[i].p1),s.push(...e[i].p2),t.push(i*3,i*3+1,i*3+2);const r=new G;return r.positions=new Float32Array(s),r.vertexIndices=new Uint32Array(t),r.setColor([0,0,1,.5]),r.setWireframeColor([1,0,0,.5]),r.setModelMatrix(x()),r.wireframe=!1,r.initWebGPU(this.mesh.render.gpuinfo,this.mesh.render.canvasInfo,this.mesh.render.scene,{depth:{depthBias:-1,depthBiasSlopeScale:-1},space:V.WORLD}),r}#r(e){const s=this.vertexPosition(e,!0),t=ae(.2,10,10,[s[0],s[1],s[2]]),r=new G("sphere");return r.positions=t.vertices,r.normals=t.normals,r.texcoords=t.texcoords,r.setColor([255/255,215/255,0,1]),r.setModelMatrix(x()),this.selectedVertexMeshes.push(r),r.initWebGPU(this.mesh.render.gpuinfo,this.mesh.render.canvasInfo,this.mesh.render.scene,{depth:{depthBias:-1,depthBiasSlopeScale:-1},space:V.WORLD}),r}getVerticesByRay(e){let s=this.vertexList.map((t,r)=>{const i=t.position,n=this.mesh.positions.slice(i,i+3),o=b(B(),M(n[0],n[1],n[2],1),this.mesh.modelmtx);return{ref:r,vertex:t,point:g(o[0],o[1],o[2])}}).filter(t=>e.dwithinPoint(t.point,1));if(this.clearSelectedMeshes(),s.length>0){let t=1/0,r=0,i=null;for(let c=0;c<s.length;++c){const a=j(L(I(),s[c].point,e.origin));a<t&&(t=a,r=s[c].ref,i=s[c])}s=[i];const n=this.vertexList[r],o=this.#r(n);if(o.setColor(ce.red),this.selectedVertexMeshes.push(o),this.mesh.selectVertexNRing!==0)if(this.mesh.selectVertexNRing===1){const a=this.getVertexOneRingFaces(this.vertexList[r]).map(p=>{const f=p.vertices.map(d=>{const m=this.vertexList[d].position,v=this.mesh.positions.slice(m,m+3),y=b(B(),M(v[0],v[1],v[2],1),this.mesh.modelmtx);return g(y[0],y[1],y[2])});return new U(f[0],f[1],f[2])}),l=this.#s(a);this.selectedFaceMeshes.push(l);const h=this.getVertexOneRingVertices(this.vertexList[r]);for(const p of h){const f=this.#r(p);this.selectedVertexMeshes.push(f)}}else console.warn("其他NRing暂时没实现");for(const c of this.vertexSelectCallbacks)c(s)}}getVertexOneRingFaces(e){const s=[],t=e.halfedge;let r=this.halfedgeMap.get(t);const i=t;for(;r;){if(r.face&&s.push(this.faceList[r.face]),!r.opposite){console.log("HE: opposite is null");break}const n=this.halfedgeMap.get(r.opposite);if(!n){console.log("getVertexOneRing, opp is null!");break}const o=n.next;if(r=this.halfedgeMap.get(o),o===i)break}return s}getVertexOneRingVertices(e){const s=[],t=e.halfedge;let r=this.halfedgeMap.get(e.halfedge);for(;r;){s.push(this.vertexList[r.vertexTo]);const i=this.halfedgeMap.get(r.opposite);if(!i)break;const n=i.next,o=this.halfedgeMap.get(n);if(!o||t===n)break;r=o}return s}vertexPosition(e,s=!1){const t=this.mesh.positions.slice(e.position,e.position+3);if(s){const r=M(t[0],t[1],t[2],1);return b(r,r,this.mesh.modelmtx),R(r)}else return g(t[0],t[1],t[2])}faceVertexIdx(e,s){return s.vertices[0]==e.ref?0:s.vertices.findIndex(t=>t===e.ref)}faceVertexIdxOppsiteEdge(e,s){const t=s.vertexFrom,r=s.vertexTo;return e.vertices.includes(t)&&e.vertices.includes(r)?e.vertices.findIndex(i=>i!==t&&i!==r):(console.warn("faceVertexIdxOppsiteEdge edge not belong to the face!"),-1)}faceToTriangle(e){const s=this.vertexList[e.vertices[0]],t=this.vertexList[e.vertices[1]],r=this.vertexList[e.vertices[2]],i=this.mesh.positions.slice(s.position,s.position+3),n=this.mesh.positions.slice(t.position,t.position+3),o=this.mesh.positions.slice(r.position,r.position+3),c=g(i[0],i[1],i[2]),a=g(n[0],n[1],n[2]),l=g(o[0],o[1],o[2]);return new U(c,a,l)}computeFaceNormal(e){const s=this.vertexList[e.vertices[0]],t=this.vertexList[e.vertices[1]],r=this.vertexList[e.vertices[2]],i=this.mesh.positions.slice(s.position,s.position+3),n=this.mesh.positions.slice(t.position,t.position+3),o=this.mesh.positions.slice(r.position,r.position+3),c=M(i[0],i[1],i[2],1),a=M(n[0],n[1],n[2],1),l=M(o[0],o[1],o[2],1);b(c,c,this.mesh.modelmtx),b(a,a,this.mesh.modelmtx),b(l,l,this.mesh.modelmtx);const h=L(I(),a,c),p=L(I(),l,c),f=K(I(),R(h),R(p));return O(f,f,-1),T(f,f),f}computeNormals(){const e=new Float32Array(this.mesh.vertexCount*3);for(const s of this.vertexList){const t=this.getVertexOneRingFaces(s),r=[];for(const n of t)r.push(this.computeFaceNormal(n));const i=g(0,0,0);for(const n of r)A(i,i,n);T(i,i),e[s.ref*3]=i[0],e[s.ref*3+1]=i[1],e[s.ref*3+2]=i[2]}this.mesh.normals=e,this.mesh.refreshVertexBuffers(!0)}computeAveragingRegionArea(e){const s=this.getVertexOneRingFaces(e);let t=0;for(const r of s){const i=this.faceToTriangle(r),n=this.faceVertexIdx(e,r);if(n===-1){console.log("faceVertexIdx is -1");continue}t+=i.computeBarycentricCellArea(n)}return t}computeContagentLaplace(e){const s=this.computeAveragingRegionArea(e),t=this.getVertexOneRingVertices(e),r=g(0,0,0);for(const n of t){const o=`${e.ref}-${n.ref}`,c=this.halfedgeMap.get(o),a=this.halfedgeMap.get(c.opposite);if(!a){console.log("computeContagentLaplace vert opp is null!");continue}const l=this.faceList[c.face],h=this.faceList[a.face],p=this.faceVertexIdxOppsiteEdge(l,c),f=this.faceVertexIdxOppsiteEdge(h,a),d=this.faceToTriangle(l),m=this.faceToTriangle(h),v=Math.tan(d.computeRadians(p)),y=Math.tan(m.computeRadians(f)),C=1/v,F=1/y,q=this.vertexPosition(e),Y=this.vertexPosition(n),E=L(I(),Y,q);O(E,E,C+F),A(r,r,E)}const i=s*2;return O(r,r,1/i),r}computeMeanCurvature(e){const s=this.computeContagentLaplace(e),t=j(s);return t===0?0:isNaN(t)?(console.warn("laplace mag is NaN"),0):.5*t}renderAveraginRegionArea(){const e=this.vertexList.map(n=>this.computeAveragingRegionArea(n)),s=e.reduce((n,o)=>n<o?n:o),t=e.reduce((n,o)=>n>o?n:o),i=e.map(n=>(n-s)/(t-s)).map(n=>W.interpolate(z.COOLWARN,n).toArray());this.mesh.setColors(i)}renderMeanCurvature(){const e=this.vertexList.map(n=>this.computeMeanCurvature(n)),s=e.reduce((n,o)=>n<o?n:o),t=e.reduce((n,o)=>n>o?n:o);let r=e.map(n=>(n-s)/(t-s));r=r.map(n=>Math.pow(n,.3));const i=r.map(n=>W.interpolate(z.COOLWARN,n).toArray());this.mesh.setColors(i)}computeGaussianCurvature(){}computePrincipalCuvature(){}}class be{gpuinfo;canvasInfo;scene;constructor(e,s,t){this.gpuinfo=e,this.canvasInfo=s,this.scene=t}}function _(u){return Object.keys(u).length}class k{formatName;formatVersion;elements={};constructor(){}toMesh(){console.log(this.elements);const e=new G,s=this.elements.vertex,t=s.properties.x.data,r=s.properties.y.data,i=s.properties.z.data;e.positions=new Float32Array(s.count*3);for(let a=0;a<s.count;a++)e.positions[a*3]=t[a],e.positions[a*3+1]=r[a],e.positions[a*3+2]=i[a];if(!("face"in this.elements))return console.warn("this is point cloud data"),null;const n=this.elements.face,c=n.properties.vertex_indices.data.filter(a=>a.length===3);return c.length<n.count&&console.warn("face 存在不为三角形的情况"),e.vertexIndices=new Uint32Array(c.flat()),console.log(e),e}static loadFromString(e){let s=!0,t="",r=-1,i=0,n=0;const o=new k,c=e.split(`
`);function a(h){if(!h.startsWith("ply")){if(h.startsWith("format")){const p=h.split(" ");o.formatName=p[1],o.formatVersion=p[2],o.formatName!=="ascii"&&console.error("ply当前只支持ascii格式数据解析");return}if(!h.startsWith("comment")){if(h.startsWith("element")){const p=h.split(" "),f=p[1],d=parseFloat(p[2]),m=Object.keys(o.elements).length;o.elements[f]={index:m,count:d,properties:{}},t=f;return}if(h.startsWith("property")){const p=h.split(" ");if(h.startsWith("property list")){const f=p[2],d=p[3],m=p[4],v=Object.keys(o.elements[t].properties).length;o.elements[t].properties[m]={index:v,list:!0,lentype:f,elmtype:d,data:[]}}else{const f=p[1],d=p[2],m=Object.keys(o.elements[t].properties).length;o.elements[t].properties[d]={index:m,list:!1,elmtype:f,data:[]}}return}if(h.startsWith("end_header")){s=!1,t="";return}}}}function l(h){t===""&&(r=0,t=Object.entries(o.elements).filter(d=>d[1].index===0)[0][0],i=0,n=_(o.elements[t].properties));const p=o.elements[t].count;i>=p&&(r++,t=Object.entries(o.elements).filter(d=>d[1].index===r)[0][0],i=0,n=_(o.elements[t].properties));const f=h.split(" ");for(let d=0,m=0;d<n;++d){const v=Object.entries(o.elements[t].properties).filter(C=>C[1].index===d)[0],y=v[0];if(v[1].list){const C=parseFloat(f[m]);o.elements[t].properties[y].data.push(f.slice(m+1,m+C+1).map(F=>parseFloat(F))),m+=C+1}else o.elements[t].properties[y].data.push(parseFloat(f[m])),m+=1}i++}for(const h of c)h.trim().length!==0&&(s?a(h):l(h));return o}static async loadFromURL(e){const s=await fetch(e);if(!s.ok)throw new Error(s.statusText);const t=await s.text();return k.loadFromString(t)}}const we=`//begin scene.wgsl\r
struct PointLight {\r
    position: vec3f,\r
    color: vec4f\r
};\r
\r
struct BlinnPhong {\r
    ka: f32,\r
    kd: f32,\r
    ks: f32,\r
    phong: f32,\r
    ambient: vec4f,\r
    diffuse: vec4f,\r
    specular: vec4f\r
}\r
\r
struct Camera {\r
    eye: vec3f,\r
    center: vec3f,\r
    up: vec3f,\r
    viewmtx: mat4x4f,\r
    viewmtxInv: mat4x4f\r
}\r
\r
struct Projection {\r
    near: f32,\r
    far: f32,\r
    fovy: f32,\r
    aspect: f32,\r
    projmtx: mat4x4f,\r
    projmtxInv: mat4x4f\r
}\r
\r
struct Viewport {\r
    width: f32,\r
    height: f32,\r
    viewportmtx: mat4x4f,\r
    viewportmtxInv: mat4x4f\r
}\r
\r
struct SceneUniform {\r
    camera: Camera,\r
    projection: Projection,\r
    viewport: Viewport,\r
    numLights: u32,\r
    lights: array<PointLight, 16u>,\r
};\r
\r
@group(0) @binding(0) var<uniform> scene : SceneUniform;\r
\r
//end scene.wgsl`;class ye{camera;projection;#s=0;#r=0;lights=[];#i=16;#t={};constructor(e,s){this.camera=e,this.projection=s}addLight(e){this.lights.push(e)}refreshViewport(e,s){this.#s=e,this.#r=s}get viewportMatrix(){const t=this.#s/2,r=this.#r/2;return J(t,0,0,0,0,r,0,0,0,0,1,0,0+t,0+r,0,1)}get viewportMatrixInv(){return S(x(),this.viewportMatrix)}getRayOfPixel(e,s){s=this.#r-s;const t=this.viewportMatrix,r=this.projection.perspectiveMatrixZO,i=this.camera.viewMtx,n=Q(x(),r,i),o=S(x(),n),c=S(x(),t),a=M(e,s,0,1),l=b(B(),a,c),h=b(B(),l,o),p=g(h[0],h[1],h[2]),f=g(this.camera.from[0],this.camera.from[1],this.camera.from[2]),d=T(I(),L(I(),p,f));return new he(f,d)}initWebGPU(e,s){this.#t.gpuinfo=e,this.#t.canvasinfo=s}refreshUniform(){if(this.#t.gpuinfo){const e=this.#t.gpuinfo.device;this.#t.definition||(this.#t.definition=H(we));const s=D(this.#t.definition.uniforms.scene);this.#t.uniform||(this.#t.uniform=e.createBuffer({label:"scene",size:s.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));const t={eye:R(this.camera.from),center:R(this.camera.to),up:R(this.camera.up),viewmtx:this.camera.viewMtx,viewmtxInv:N(B(),this.camera.viewMtx)},r={near:this.projection.near,far:this.projection.far,fovy:this.projection.fovy,aspect:this.projection.aspect,projmtx:this.projection.perspectiveMatrixZO,projmtxInv:N(B(),this.projection.perspectiveMatrixZO)},i={width:this.#s,height:this.#r,viewportmtx:this.viewportMatrix,viewportmtxInv:this.viewportMatrixInv},n=Math.min(this.#i,this.lights.length),o=[];for(let c=0;c<n;++c)o.push({position:this.lights[c].position,color:this.lights[c].color});s.set({camera:t,projection:r,viewport:i,numLights:n,lights:o}),e.queue.writeBuffer(this.#t.uniform,0,s.arrayBuffer)}}get bindGroupLayout(){if(this.#t.gpuinfo){const e=this.#t.gpuinfo.device;return this.#t.layout||(this.#t.layout=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]})),this.#t.layout}return null}get bindGroup(){if(this.#t.gpuinfo){if(!this.#t.bindgroup){const e=this.#t.gpuinfo.device;this.#t.bindgroup=e.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.#t.uniform}}]})}return this.#t.bindgroup}return null}get uniform(){return this.#t.uniform}}class Me{#s;#r;#i=null;constructor(e,s){this.#s=e,this.#r=s}set position(e){this.#s=e}set color(e){this.#r=e}get position(){return this.#s}get color(){return this.#r}set x(e){this.#s[0]=e}set y(e){this.#s[1]=e}set z(e){this.#s[2]=e}addHelper(e,s){this.#i||(this.#i=new Ce(e,this,s))}}class Ce{params={position:{x:0,y:0,z:0},color:{r:255,g:255,b:255,a:1}};pane;folder=null;light;bindx;bindy;bindz;bindcolor;constructor(e,s,t){this.pane=e,this.light=s,this.params={position:{x:this.light.position[0],y:this.light.position[1],z:this.light.position[2]},color:{r:this.light.color[0]*255,g:this.light.color[1]*255,b:this.light.color[2]*255,a:this.light.color[3]*255}};let r=this.pane;t&&t.create&&(this.folder=e.addFolder({title:t.title,expanded:t.expanded}),r=this.folder),this.bindx=r.addBinding(this.params.position,"x",{label:"position x",min:-500,max:500,step:1}).on("change",i=>{this.light.x=i.value}),this.bindy=r.addBinding(this.params.position,"y",{label:"position y",min:-500,max:500,step:1}).on("change",i=>{this.light.y=i.value}),this.bindz=r.addBinding(this.params.position,"z",{label:"position z",min:-500,max:500,step:1}).on("change",i=>{this.light.z=i.value}),this.bindcolor=r.addBinding(this.params,"color",{label:"color"}).on("change",i=>{const n=[i.value.r/255,i.value.g/255,i.value.b/255,i.value.a];this.light.color=n})}}class Ie{gpuInfo=null;canvasInfo=null;colorTexture=null;depthFormat="depth32float";depthTexture=null;camera=null;projection=null;scene=null;cameraMouseCtrl=null;firstpass=!0;ready=!1;resizeObserver=null;ground=new le(1e3,1e3);meshes=[];pane;readyCallbacks=[];paneParams={wireframe:{enable:!0,color:{r:0,g:0,b:0,a:.1}},lighting:!1,meshurl:X,selectMode:w.VERTEX,nring:1};constructor(){ee().then(e=>{if(e===null){console.error("GPU INFO is NULL");return}this.gpuInfo=e;const t=te({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(t===null){console.error("canvasInfo is NULL");return}this.canvasInfo=t;const r=this.canvasInfo.canvas.width,i=this.canvasInfo.canvas.height;this.canvasInfo=t,this.refreshDepthTexture();const n=[-15.161893,-102.341178,161.866607,1],o=[-38.193603,44.828018,76.714302,1],c=[0,0,1,0];this.camera=new se(n,o,c),this.projection=new fe(Math.PI/2,r/i,1,1e4),this.scene=new ye(this.camera,this.projection),this.scene.addLight(new Me([500,-500,500],[1,1,1,.5])),this.scene.initWebGPU(this.gpuInfo,this.canvasInfo),this.cameraMouseCtrl=new re(this.camera,this.canvasInfo.canvas),this.cameraMouseCtrl.enable(),this.ground.initWebGPU(this.gpuInfo,this.canvasInfo),this.resizeObserver=new ResizeObserver(a=>{for(const l of a){const h=l.target,p=l.contentBoxSize[0].inlineSize,f=l.contentBoxSize[0].blockSize;h.width=Math.max(1,Math.min(p,this.gpuInfo.device.limits.maxTextureDimension2D)),h.height=Math.max(1,Math.min(f,this.gpuInfo.device.limits.maxTextureDimension2D)),this.projection.aspect=h.width/h.height,this.scene.refreshViewport(h.width,h.height),this.refreshDepthTexture()}}),this.resizeObserver.observe(t.canvas),this.canvasInfo.canvas.addEventListener("click",a=>{const l=this.getPixelOfMouse(a),h=this.scene.getRayOfPixel(l[0],l[1]);for(const p of this.meshes)p.halfedge?.selectByRay(h)}),this.pane=new ie({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0,this.readyCallbacks.forEach(a=>a(this))}).catch(e=>{this.ready=!1,console.error(e)})}getPixelOfMouse(e){const s=this.canvasInfo.canvas,t=s.getBoundingClientRect(),r=s.width/t.width,i=s.height/t.height,n=(e.clientX-t.left)*r,o=(e.clientY-t.top)*i;return[n,o]}loadMesh(e){this.ready&&k.loadFromURL(e).then(s=>{const t=s.toMesh();t.createHalfEdge(),t.halfedge.addFaceSelectCallback(n=>{const o=document.getElementById("content-div");if(n.length===0)o.innerText="";else{const c=n[0],a=c.face.vertices,l=`
                            当前选中的Face: 
                            Face编号: ${c.ref}
                            Vertiecs: ${a[0]},${a[1]},${a[2]}
                        `;o.innerText=l}}),t.halfedge.addVertexSelectCallback(n=>{const o=document.getElementById("content-div");if(n.length===0)o.innerText="";else{const c=n[0],a=`
                            当前选中的Vertex: 
                            Vertex编号: ${c.ref}
                            关联HalfEdge编号: ${c.vertex.halfedge}
                        `;o.innerText=a}});const r=x();ne(r,r,Math.PI/2),oe(r,r,g(1e3,1e3,1e3)),t.setModelMatrix(r),t.lighting=this.paneParams.lighting,t.wireframe=this.paneParams.wireframe.enable;const i=this.paneParams.wireframe.color;t.setWireframeColor([i.r/255,i.g/255,i.b/255,i.a]),t.selectMode=w.VERTEX,t.selectVertexNRing=this.paneParams.nring,t.initWebGPU(this.gpuInfo,this.canvasInfo,this.scene,{depth:{depthBias:1,depthBiasSlopeScale:1},space:V.WORLD}),this.meshes.push(t)})}addMesh(e){e.initWebGPU(this.gpuInfo,this.canvasInfo,this.scene,{depth:{depthBias:0,depthBiasSlopeScale:0},space:V.WORLD}),this.meshes.push(e)}refreshDepthTexture(){const e=pe(this.gpuInfo,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height,this.depthFormat);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=de({label:"demo",first:this.firstpass,colorTexture:this.canvasInfo.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.gpuInfo.device.createCommandEncoder();this.firstpass=!0;const s=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.ground.draw(this.gpuInfo,this.camera,this.projection,s);for(const r of this.meshes)r.wireframe=!1,r.draw(s),this.paneParams.wireframe.enable&&(r.wireframe=!0,r.draw(s)),r.halfedge&&r.halfedge.selectedVertexMeshes.forEach(i=>i.draw(s)),r.halfedge&&r.halfedge.selectedFaceMeshes.forEach(i=>{i.wireframe=!1,i.draw(s),this.paneParams.wireframe&&(i.wireframe=!0,i.draw(s))});s.end();const t=e.finish();this.gpuInfo.device.queue.submit([t])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){const e=this.pane.addFolder({title:"Lighting",expanded:!1});e.addBinding(this.paneParams,"lighting",{label:"lighting"}).on("change",t=>{for(const r of this.meshes)r.lighting=t.value});for(let t=0;t<this.scene.lights.length;++t)this.scene.lights[t].addHelper(e,{create:!0,title:`PointLight ${t}`,expanded:!1});const s=this.pane.addFolder({title:"Mesh",expanded:!0});s.addBinding(this.paneParams.wireframe,"enable",{label:"wireframe"}).on("change",t=>{for(const r of this.meshes)r.wireframe=t.value}),s.addBinding(this.paneParams.wireframe,"color",{label:"wireframe color"}).on("change",t=>{for(const r of this.meshes){const i=t.value;r.setWireframeColor([i.r/255,i.g/255,i.b/255,i.a])}}),s.addBinding(this.paneParams,"meshurl",{label:"Mesh",options:{...Be}}).on("change",t=>{for(;this.meshes.length>0;)this.meshes.pop().destroy();this.loadMesh(t.value)}),s.addBinding(this.paneParams,"selectMode",{label:"Select Mode",options:{none:w.NONE,vertex:w.VERTEX,face:w.FACE}}).on("change",t=>{for(const r of this.meshes)r.selectMode=t.value}),s.addBinding(this.paneParams,"nring",{label:"vertex ring",options:{0:0,1:1}}).on("change",t=>{for(const r of this.meshes)r.selectVertexNRing=t.value}),s.addButton({title:"生成法向量"}).on("click",()=>{for(const t of this.meshes)t.halfedge&&t.halfedge.computeNormals()}),s.addButton({title:"计算平均域面积"}).on("click",()=>{for(const t of this.meshes)t.halfedge&&t.halfedge.renderAveraginRegionArea()}),s.addButton({title:"计算平均曲率"}).on("click",()=>{for(const t of this.meshes)t.halfedge&&t.halfedge.renderMeanCurvature()})}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}}const Be={bunny:X,bunny_res2:ue,bunny_res3:me,bunny_res4:ge};function Re(){const u=new Ie;u.onReady(()=>{u.loadMesh(u.paneParams.meshurl),u.draw()})}Re();
