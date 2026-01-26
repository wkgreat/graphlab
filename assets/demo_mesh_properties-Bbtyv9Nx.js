import"./modulepreload-polyfill-B5Qt9EMX.js";import{c as g,t as N,i as B,o as y,f as C,q as w,g as b,r as A,s as j,h as S,u as W,v as z,n as $,w as L,b as _,d as H,C as X,a as q,P as Y,x as Z,y as K}from"./camera-DXA52umf.js";import{T as U,b as J,R as Q,G as ee,P as te,c as se,a as re}from"./webgpuUtils-0ZPxhwwT.js";import{m as T,c as I,a as k}from"./webgpu-utils.module-DPkR54bZ.js";const ne=""+new URL("../data/mesh/bun_zipper.ply",import.meta.url).href,ie=""+new URL("../data/mesh/bun_zipper_res2.ply",import.meta.url).href,oe=""+new URL("../data/mesh/bun_zipper_res3.ply",import.meta.url).href,D=""+new URL("../data/mesh/bun_zipper_res4.ply",import.meta.url).href,E=`override ENABLE_LIGHT: bool = true;\r
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
struct ModelUniform {\r
    hasnormal: u32,\r
    hastexcoord: u32,\r
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
    let worldnormal = model.normalmtx * vec4f(input.normal, 0); \r
    let ndcpos = scene.projection.projmtx * scene.camera.viewmtx * worldpos;\r
    var output: VSOutput;\r
    output.position = ndcpos;\r
    output.worldpos = worldpos.xyz;\r
    output.worldnormal = worldnormal.xyz;\r
    output.color = input.color;\r
    return output;\r
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
        let cd = bp.kd * color * bp.diffuse * scene.lights[i].color * max(0, dot(n,l));\r
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
    if(ENABLE_LIGHT && model.hasnormal>0u && scene.numLights > 0) {\r
        var color = blinnPhong(material.blinnPhong, input.color, input.worldpos, scene.camera.eye, input.worldnormal);\r
        return color;\r
    } else {\r
        return input.color;\r
    }\r
}`;class ae{#s;#r;#e;#t;#n;#i;#o;#a=[];constructor(e){this.#s=e.ka,this.#r=e.ambient,this.#e=e.kd,this.#t=e.diffuse,this.#n=e.ks,this.#i=e.specular,this.#o=e.phong}addCallback(e){this.#a.push(e)}invokeChange(){for(const e of this.#a)e(this)}set ka(e){this.#s=e,this.invokeChange()}set ambient(e){this.#r=e,this.invokeChange()}set kd(e){this.#e=e,this.invokeChange()}set diffuse(e){this.#t=e,this.invokeChange()}set ks(e){this.#n=e,this.invokeChange()}set specular(e){this.#i=e,this.invokeChange()}set phong(e){this.#o=e,this.invokeChange()}get ka(){return this.#s}get ambient(){return this.#r}get kd(){return this.#e}get diffuse(){return this.#t}get ks(){return this.#n}get specular(){return this.#i}get phong(){return this.#o}}const x={NONE:0,VERTEX:1,FACE:2};class R{render=null;positions;normals;texcoords;vertexCount=0;vertexIndices;wireframeVertexIndices;textureIndices;textures;colors;colorMode;wireframeColors;#s;label="Mesh";modelmtx=g();halfedge;#r=!1;#e={};selectMode=x.NONE;selectVertexNRing=0;constructor(e){this.label=e??"Mesh",this.#e.uniforms={},this.#e.pipelines={},this.#e.buffers={},this.#e.textures={},this.#e.samplers={},this.modelmtx=g(),this.#s=new ae({ka:.1,ambient:[1,1,1,1],kd:.8,diffuse:[1,1,1,1],ks:.1,specular:[1,1,1,1],phong:2})}set wireframe(e){this.#r=e,this.refreshVertexBuffers()}createDefaultColors(){const e=this.positions.length/3,t=[0,1,0,1];this.colors=new Float32Array(Array(e).fill(t).flat())}setColor(e){const t=this.positions.length/3;Math.max(...e)>1&&(e=e.map(s=>s/255)),this.colors=new Float32Array(Array(t).fill(e).flat()),this.refreshDefaultVertexBuffer()}createDefaultWireframeColors(){const e=this.positions.length/3,t=[1,0,0,1];this.wireframeColors=new Float32Array(Array(e).fill(t).flat())}setWireframeColor(e){const t=this.positions.length/3;Math.max(...e)>1&&(e=e.map(s=>s/255)),this.wireframeColors=new Float32Array(Array(t).fill(e).flat()),this.refreshWireframeVertexBuffer()}get wireframe(){return this.#r}createHalfEdge(){this.halfedge=new ce(this)}initWebGPU(e,t,s,r={depth:{depthBias:0,depthBiasSlopeScale:0}}){this.#e.gpuinfo=e,this.#e.canvasinfo=t,this.#e.definition=T(E),this.render=new he(e,t,s),this.vertexCount=this.positions.length/3,this.refreshVertexBuffers(),this.refreshUniforms(s.camera,s.projection),this.createPipelines(r)}createWireFrameVertexIndices(){if(this.vertexIndices&&!this.wireframeVertexIndices){const e=this.vertexIndices.length;this.wireframeVertexIndices=new Uint32Array(e/3*5);for(let t=0;t<this.vertexIndices.length/3;++t)this.wireframeVertexIndices[t*5]=this.vertexIndices[t*3],this.wireframeVertexIndices[t*5+1]=this.vertexIndices[t*3+1],this.wireframeVertexIndices[t*5+2]=this.vertexIndices[t*3+2],this.wireframeVertexIndices[t*5+3]=this.vertexIndices[t*3],this.wireframeVertexIndices[t*5+4]=4294967295}}setModelMatrix(e){this.modelmtx=e}refreshDefaultVertexBuffer(e=!1){if(!this.#e.gpuinfo)return;const t=this.#e.gpuinfo.device;if(e||!("default"in this.#e.buffers)){this.colors||this.createDefaultColors();const s=this.#e.buffers.default;if(this.vertexIndices){const r=I(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4},indices:this.vertexIndices});this.#e.buffers.default=r}else{const r=I(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4}});this.#e.buffers.default=r}s&&(s.buffers.forEach(r=>r.destroy()),s.indexBuffer&&s.indexBuffer.destroy())}}refreshWireframeVertexBuffer(e=!1){if(!this.#e.gpuinfo)return;const t=this.#e.gpuinfo.device;if(e||!("wireframe"in this.#e.buffers)){this.createWireFrameVertexIndices(),this.wireframeColors||this.createDefaultWireframeColors();const s=this.#e.buffers.wireframe;if(this.vertexIndices){const r=I(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4},indices:this.wireframeVertexIndices});this.#e.buffers.wireframe=r}else{const r=I(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4}});this.#e.buffers.wireframe=r}s&&(s.buffers.forEach(r=>r.destroy()),s.indexBuffer&&s.indexBuffer.destroy())}}refreshVertexBuffers(){this.refreshDefaultVertexBuffer(),this.refreshWireframeVertexBuffer()}refreshUniforms(e,t){const s=this.#e.gpuinfo.device;this.render.scene.refreshUniform();const r=k(this.#e.definition.uniforms.material);"material"in this.#e.uniforms||(this.#e.uniforms.material=s.createBuffer({label:`${this.label} material uniform`,size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),r.set({blinnPhong:{ka:this.#s.ka,kd:this.#s.kd,ks:this.#s.ks,phong:this.#s.phong,ambient:this.#s.ambient,diffuse:this.#s.diffuse,specular:this.#s.specular}}),s.queue.writeBuffer(this.#e.uniforms.material,0,r.arrayBuffer);const n=k(this.#e.definition.uniforms.model);"model"in this.#e.uniforms||(this.#e.uniforms.model=s.createBuffer({label:`${this.label} model uniform`,size:n.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),n.set({hasnormal:this.normals?1:0,hastexcoord:this.texcoords?1:0,modelmtx:this.modelmtx,normalmtx:N(g(),B(g(),this.modelmtx))}),s.queue.writeBuffer(this.#e.uniforms.model,0,n.arrayBuffer)}createPipelines(e){const t=this.#e.gpuinfo.device;this.#e.module=t.createShaderModule({label:this.label,code:E});const s=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=t.createPipelineLayout({bindGroupLayouts:[this.render.scene.bindGroupLayout,s]}),n={label:this.label,layout:r,vertex:{module:this.#e.module,buffers:this.#e.buffers.default.bufferLayouts},fragment:{module:this.#e.module,targets:[{format:this.#e.canvasinfo.context.getConfiguration().format,blend:{color:{operation:"add",srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:"ccw"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};n.depthStencil.depthBias=e.depth.depthBias,n.depthStencil.depthBiasSlopeScale=e.depth.depthBiasSlopeScale,this.#e.pipelines.default=t.createRenderPipeline(n),n.vertex.buffers=this.#e.buffers.wireframe.bufferLayouts,n.primitive.topology="line-strip",n.primitive.stripIndexFormat="uint32",n.depthStencil.depthBias=0,n.depthStencil.depthBiasSlopeScale=0,this.#e.pipelines.wireframe=t.createRenderPipeline(n)}draw(e){const t=this.render.gpuinfo.device,s=this.render.scene;this.refreshUniforms(s.camera,s.projection);const r=t.createBindGroup({layout:this.#e.pipelines.default.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.#e.uniforms.material}},{binding:1,resource:{buffer:this.#e.uniforms.model}}]});if(this.wireframe){const n=this.#e.buffers.wireframe;e.setPipeline(this.#e.pipelines.wireframe),e.setBindGroup(0,this.render.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,n.buffers[0]),this.vertexIndices?(e.setIndexBuffer(n.indexBuffer,n.indexFormat),e.drawIndexed(n.numElements)):e.draw(this.vertexCount)}else{const n=this.#e.buffers.default;e.setPipeline(this.#e.pipelines.default),e.setBindGroup(0,this.render.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,n.buffers[0]),this.vertexIndices?(e.setIndexBuffer(n.indexBuffer,n.indexFormat),e.drawIndexed(n.numElements)):e.draw(this.vertexCount)}}destroy(){Object.values(this.#e.buffers).forEach(e=>{e.buffers.forEach(t=>t.destroy()),e.indexBuffer&&e.indexBuffer.destroy()}),Object.values(this.#e.uniforms).forEach(e=>{e.destroy()}),Object.values(this.#e.textures).forEach(e=>{e.destroy()})}}class ce{mesh;vertexList=[];faceList=[];halfedgeMap=new Map;selectedVertexMesh=null;selectedFaceMesh=null;faceSelectCallbacks=[];vertexSelectCallbacks=[];constructor(e){this.mesh=e,this.build()}build(){const e=this.mesh.positions.length/3;for(let t=0;t<e;++t)this.vertexList.push({ref:t,position:t*3});for(let t=0;t<this.mesh.vertexIndices.length/3;++t){const s=this.mesh.vertexIndices[t*3],r=this.mesh.vertexIndices[t*3+1],n=this.mesh.vertexIndices[t*3+2],i=this.faceList.length,c=`${s}-${r}`,o=`${r}-${n}`,f=`${n}-${s}`,h=`${r}-${s}`,l=`${n}-${r}`,u=`${s}-${n}`;(this.halfedgeMap.has(c)||this.halfedgeMap.has(o)||this.halfedgeMap.has(f))&&console.warn("HalfEdge 边有重叠"),this.vertexList[s].halfedge=c,this.vertexList[r].halfedge=o,this.vertexList[n].halfedge=f,this.halfedgeMap.set(c,{vertexFrom:s,vertexTo:r,face:i,next:o,prev:f,opposite:h}),this.halfedgeMap.set(o,{vertexFrom:r,vertexTo:n,face:i,next:f,prev:c,opposite:l}),this.halfedgeMap.set(f,{vertexFrom:n,vertexTo:s,face:i,next:c,prev:o,opposite:u});const d={ref:i,vertices:[s,r,n],halfedge:c};this.faceList.push(d)}}addFaceSelectCallback(e){this.faceSelectCallbacks.push(e)}addVertexSelectCallback(e){this.vertexSelectCallbacks.push(e)}selectByRay(e){switch(this.mesh.selectMode){case x.NONE:break;case x.VERTEX:this.getVerticesByRay(e);break;case x.FACE:this.getFracesByRay(e);break}}getFracesByRay(e){let t=this.faceList.map((s,r)=>{const n=s.vertices.map(i=>{const c=this.vertexList[i].position,o=this.mesh.positions.slice(c,c+3),f=y(w(),C(o[0],o[1],o[2],1),this.mesh.modelmtx);return b(f[0],f[1],f[2])});return{ref:r,face:s,triangle:new U(n[0],n[1],n[2])}}).map(s=>({faceinfo:s,crossinfo:e.crossTriangle(s.triangle)})).filter(s=>s.crossinfo.cross);if(this.selectedFaceMesh&&(this.selectedFaceMesh.destroy(),this.selectedFaceMesh=null),this.selectedVertexMesh&&(this.selectedVertexMesh.destroy(),this.selectedVertexMesh=null),t.length>0){let s=1/0,r=null;for(const n of t){const a=n.crossinfo.distance;a<s&&(s=a,r=n)}t=[r],this.#s(t.map(n=>n.faceinfo.triangle))}for(const s of this.faceSelectCallbacks)s(t.map(r=>r.faceinfo))}#s(e){const t=[],s=[];for(let r=0;r<e.length;++r)t.push(...e[r].p0),t.push(...e[r].p1),t.push(...e[r].p2),s.push(r*3,r*3+1,r*3+2);this.selectedFaceMesh=new R,this.selectedFaceMesh.positions=new Float32Array(t),this.selectedFaceMesh.vertexIndices=new Uint32Array(s),this.selectedFaceMesh.setColor([0,0,1,.5]),this.selectedFaceMesh.setWireframeColor([1,0,0,.5]),this.selectedFaceMesh.setModelMatrix(g()),this.selectedFaceMesh.wireframe=!1,this.selectedFaceMesh.initWebGPU(this.mesh.render.gpuinfo,this.mesh.render.canvasInfo,this.mesh.render.scene,{depth:{depthBias:-1,depthBiasSlopeScale:-1}})}getVerticesByRay(e){let t=this.vertexList.map((s,r)=>{const n=s.position,a=this.mesh.positions.slice(n,n+3),i=y(w(),C(a[0],a[1],a[2],1),this.mesh.modelmtx);return{ref:r,vertex:s,point:b(i[0],i[1],i[2])}}).filter(s=>e.dwithinPoint(s.point,1));if(this.selectedFaceMesh&&(this.selectedFaceMesh.destroy(),this.selectedFaceMesh=null),this.selectedVertexMesh&&(this.selectedVertexMesh.destroy(),this.selectedVertexMesh=null),t.length>0){let s=1/0,r=0,n=null;for(let o=0;o<t.length;++o){const f=A(j(S(),t[o].point,e.origin));f<s&&(s=f,r=t[o].ref,n=t[o])}t=[n];const a=t[0].point,i=J(1,10,10,[a[0],a[1],a[2]]),c=new R("sphere");if(c.positions=i.vertices,c.normals=i.normals,c.texcoords=i.texcoords,c.setColor([255/255,215/255,0,1]),c.setModelMatrix(g()),this.selectedVertexMesh=c,this.selectedVertexMesh.initWebGPU(this.mesh.render.gpuinfo,this.mesh.render.canvasInfo,this.mesh.render.scene,{depth:{depthBias:-1,depthBiasSlopeScale:-1}}),this.mesh.selectVertexNRing!==0)if(this.mesh.selectVertexNRing===1){const f=this.getVertexOneRing(this.vertexList[r]).map(h=>{const l=h.vertices.map(u=>{const d=this.vertexList[u].position,m=this.mesh.positions.slice(d,d+3),v=y(w(),C(m[0],m[1],m[2],1),this.mesh.modelmtx);return b(v[0],v[1],v[2])});return new U(l[0],l[1],l[2])});this.#s(f)}else console.warn("其他NRing暂时没实现");for(const o of this.vertexSelectCallbacks)o(t)}}getVertexOneRing(e){const t=[],s=e.halfedge;let r=this.halfedgeMap.get(s);const n=s;for(;r;){if(r.face&&t.push(this.faceList[r.face]),!r.opposite){console.log("HE: opposite is null");break}const a=this.halfedgeMap.get(r.opposite).next;if(r=this.halfedgeMap.get(a),a===n)break}return t}}class he{gpuinfo;canvasInfo;scene;constructor(e,t,s){this.gpuinfo=e,this.canvasInfo=t,this.scene=s}}function G(p){return Object.keys(p).length}class P{formatName;formatVersion;elements={};constructor(){}toMesh(){console.log(this.elements);const e=new R,t=this.elements.vertex,s=t.properties.x.data,r=t.properties.y.data,n=t.properties.z.data;e.positions=new Float32Array(t.count*3);for(let o=0;o<t.count;o++)e.positions[o*3]=s[o],e.positions[o*3+1]=r[o],e.positions[o*3+2]=n[o];if(!("face"in this.elements))return console.warn("this is point cloud data"),null;const a=this.elements.face,c=a.properties.vertex_indices.data.filter(o=>o.length===3);return c.length<a.count&&console.warn("face 存在不为三角形的情况"),e.vertexIndices=new Uint32Array(c.flat()),console.log(e),e}static loadFromString(e){let t=!0,s="",r=-1,n=0,a=0;const i=new P,c=e.split(`
`);function o(h){if(!h.startsWith("ply")){if(h.startsWith("format")){const l=h.split(" ");i.formatName=l[1],i.formatVersion=l[2],i.formatName!=="ascii"&&console.error("ply当前只支持ascii格式数据解析");return}if(!h.startsWith("comment")){if(h.startsWith("element")){const l=h.split(" "),u=l[1],d=parseFloat(l[2]),m=Object.keys(i.elements).length;i.elements[u]={index:m,count:d,properties:{}},s=u;return}if(h.startsWith("property")){const l=h.split(" ");if(h.startsWith("property list")){const u=l[2],d=l[3],m=l[4],v=Object.keys(i.elements[s].properties).length;i.elements[s].properties[m]={index:v,list:!0,lentype:u,elmtype:d,data:[]}}else{const u=l[1],d=l[2],m=Object.keys(i.elements[s].properties).length;i.elements[s].properties[d]={index:m,list:!1,elmtype:u,data:[]}}return}if(h.startsWith("end_header")){t=!1,s="";return}}}}function f(h){s===""&&(r=0,s=Object.entries(i.elements).filter(d=>d[1].index===0)[0][0],n=0,a=G(i.elements[s].properties));const l=i.elements[s].count;n>=l&&(r++,s=Object.entries(i.elements).filter(d=>d[1].index===r)[0][0],n=0,a=G(i.elements[s].properties));const u=h.split(" ");for(let d=0,m=0;d<a;++d){const v=Object.entries(i.elements[s].properties).filter(M=>M[1].index===d)[0],V=v[0];if(v[1].list){const M=parseFloat(u[m]);i.elements[s].properties[V].data.push(u.slice(m+1,m+M+1).map(O=>parseFloat(O))),m+=M+1}else i.elements[s].properties[V].data.push(parseFloat(u[m])),m+=1}n++}for(const h of c)h.trim().length!==0&&(t?o(h):f(h));return i}static async loadFromURL(e){const t=await fetch(e);if(!t.ok)throw new Error(t.statusText);const s=await t.text();return P.loadFromString(s)}}const fe=`//begin scene.wgsl\r
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
//end scene.wgsl`;function F(p){return b(p[0],p[1],p[2])}class le{camera;projection;#s=0;#r=0;lights=[];#e=16;#t={};constructor(e,t){this.camera=e,this.projection=t}addLight(e){this.lights.push(e)}refreshViewport(e,t){this.#s=e,this.#r=t}get viewportMatrix(){const s=this.#s/2,r=this.#r/2;return W(s,0,0,0,0,r,0,0,0,0,1,0,0+s,0+r,0,1)}get viewportMatrixInv(){return B(g(),this.viewportMatrix)}getRayOfPixel(e,t){t=this.#r-t;const s=this.viewportMatrix,r=this.projection.perspectiveMatrixZO,n=this.camera.viewMtx,a=z(g(),r,n),i=B(g(),a),c=B(g(),s),o=C(e,t,0,1),f=y(w(),o,c),h=y(w(),f,i),l=b(h[0],h[1],h[2]),u=b(this.camera.from[0],this.camera.from[1],this.camera.from[2]),d=$(S(),j(S(),l,u));return new Q(u,d)}initWebGPU(e,t){this.#t.gpuinfo=e,this.#t.canvasinfo=t}refreshUniform(){if(this.#t.gpuinfo){const e=this.#t.gpuinfo.device;this.#t.definition||(this.#t.definition=T(fe));const t=k(this.#t.definition.uniforms.scene);this.#t.uniform||(this.#t.uniform=e.createBuffer({label:"scene",size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));const s={eye:F(this.camera.from),center:F(this.camera.to),up:F(this.camera.up),viewmtx:this.camera.viewMtx,viewmtxInv:L(w(),this.camera.viewMtx)},r={near:this.projection.near,far:this.projection.far,fovy:this.projection.fovy,aspect:this.projection.aspect,projmtx:this.projection.perspectiveMatrixZO,projmtxInv:L(w(),this.projection.perspectiveMatrixZO)},n={width:this.#s,height:this.#r,viewportmtx:this.viewportMatrix,viewportmtxInv:this.viewportMatrixInv},a=Math.min(this.#e,this.lights.length),i=[];for(let c=0;c<a;++c)i.push({position:this.lights[c].position,color:this.lights[c].color});t.set({camera:s,projection:r,viewport:n,numLights:a,lights:i}),e.queue.writeBuffer(this.#t.uniform,0,t.arrayBuffer)}}get bindGroupLayout(){if(this.#t.gpuinfo){const e=this.#t.gpuinfo.device;return this.#t.layout||(this.#t.layout=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]})),this.#t.layout}return null}get bindGroup(){if(this.#t.gpuinfo){if(!this.#t.bindgroup){const e=this.#t.gpuinfo.device;this.#t.bindgroup=e.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.#t.uniform}}]})}return this.#t.bindgroup}return null}get uniform(){return this.#t.uniform}}class de{#s;#r;constructor(e,t){this.#s=e,this.#r=t}set position(e){this.#s=e}set color(e){this.#r=e}get position(){return this.#s}get color(){return this.#r}}class ue{gpuInfo=null;canvasInfo=null;colorTexture=null;depthFormat="depth32float";depthTexture=null;camera=null;projection=null;scene=null;cameraMouseCtrl=null;firstpass=!0;ready=!1;resizeObserver=null;ground=new ee(1e3,1e3);meshes=[];pane;readyCallbacks=[];paneParams={wireframe:!0,meshurl:D,selectMode:x.VERTEX,nring:1};constructor(){_().then(e=>{if(e===null){console.error("GPU INFO is NULL");return}this.gpuInfo=e;const s=H({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(s===null){console.error("canvasInfo is NULL");return}this.canvasInfo=s;const r=this.canvasInfo.canvas.width,n=this.canvasInfo.canvas.height;this.canvasInfo=s,this.refreshDepthTexture();const a=[-15.161893,-102.341178,161.866607,1],i=[-38.193603,44.828018,76.714302,1],c=[0,0,1,0];this.camera=new X(a,i,c),this.projection=new te(Math.PI/2,r/n,1,1e4),this.scene=new le(this.camera,this.projection),this.scene.addLight(new de([100,-100,100],[1,1,1,1])),this.scene.initWebGPU(this.gpuInfo,this.canvasInfo),this.cameraMouseCtrl=new q(this.camera,this.canvasInfo.canvas),this.cameraMouseCtrl.enable(),this.ground.initWebGPU(this.gpuInfo,this.canvasInfo),this.resizeObserver=new ResizeObserver(o=>{for(const f of o){const h=f.target,l=f.contentBoxSize[0].inlineSize,u=f.contentBoxSize[0].blockSize;h.width=Math.max(1,Math.min(l,this.gpuInfo.device.limits.maxTextureDimension2D)),h.height=Math.max(1,Math.min(u,this.gpuInfo.device.limits.maxTextureDimension2D)),this.projection.aspect=h.width/h.height,this.scene.refreshViewport(h.width,h.height),this.refreshDepthTexture()}}),this.resizeObserver.observe(s.canvas),this.canvasInfo.canvas.addEventListener("click",o=>{const f=this.getPixelOfMouse(o),h=this.scene.getRayOfPixel(f[0],f[1]);for(const l of this.meshes)l.halfedge?.selectByRay(h)}),this.pane=new Y({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0,this.readyCallbacks.forEach(o=>o(this))}).catch(e=>{this.ready=!1,console.error(e)})}getPixelOfMouse(e){const t=this.canvasInfo.canvas,s=t.getBoundingClientRect(),r=t.width/s.width,n=t.height/s.height,a=(e.clientX-s.left)*r,i=(e.clientY-s.top)*n;return[a,i]}loadMesh(e){this.ready&&P.loadFromURL(e).then(t=>{const s=t.toMesh();s.createHalfEdge(),s.halfedge.addFaceSelectCallback(n=>{const a=document.getElementById("content-div");if(n.length===0)a.innerText="";else{const i=n[0],c=i.face.vertices,o=`
                            当前选中的Face: 
                            Face编号: ${i.ref}
                            Vertiecs: ${c[0]},${c[1]},${c[2]}
                        `;a.innerText=o}}),s.halfedge.addVertexSelectCallback(n=>{const a=document.getElementById("content-div");if(n.length===0)a.innerText="";else{const i=n[0],c=`
                            当前选中的Vertex: 
                            Vertex编号: ${i.ref}
                            关联HalfEdge编号: ${i.vertex.halfedge}
                        `;a.innerText=c}});const r=g();Z(r,r,Math.PI/2),K(r,r,b(1e3,1e3,1e3)),s.setModelMatrix(r),s.wireframe=this.paneParams.wireframe,s.selectMode=x.VERTEX,s.selectVertexNRing=this.paneParams.nring,s.initWebGPU(this.gpuInfo,this.canvasInfo,this.scene,{depth:{depthBias:1,depthBiasSlopeScale:1}}),this.meshes.push(s)})}addMesh(e){e.initWebGPU(this.gpuInfo,this.canvasInfo,this.scene,{depth:{depthBias:0,depthBiasSlopeScale:0}}),this.meshes.push(e)}refreshDepthTexture(){const e=se(this.gpuInfo,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height,this.depthFormat);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=re({label:"demo",first:this.firstpass,colorTexture:this.canvasInfo.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.gpuInfo.device.createCommandEncoder();this.firstpass=!0;const t=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.ground.draw(this.gpuInfo,this.camera,this.projection,t);for(const r of this.meshes)r.wireframe=!1,r.draw(t),this.paneParams.wireframe&&(r.wireframe=!0,r.draw(t)),r.halfedge&&r.halfedge.selectedVertexMesh&&r.halfedge.selectedVertexMesh.draw(t),r.halfedge&&r.halfedge.selectedFaceMesh&&(r.halfedge.selectedFaceMesh.wireframe=!1,r.halfedge.selectedFaceMesh.draw(t),this.paneParams.wireframe&&(r.halfedge.selectedFaceMesh.wireframe=!0,r.halfedge.selectedFaceMesh.draw(t)));t.end();const s=e.finish();this.gpuInfo.device.queue.submit([s])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){this.pane.addBinding(this.paneParams,"wireframe",{label:"wireframe"}).on("change",e=>{for(const t of this.meshes)t.wireframe=e.value}),this.pane.addBinding(this.paneParams,"meshurl",{label:"Mesh",options:{...pe}}).on("change",e=>{for(;this.meshes.length>0;)this.meshes.pop().destroy();this.loadMesh(e.value)}),this.pane.addBinding(this.paneParams,"selectMode",{label:"选择模式",options:{none:x.NONE,vertex:x.VERTEX,face:x.FACE}}).on("change",e=>{for(const t of this.meshes)t.selectMode=e.value}),this.pane.addBinding(this.paneParams,"nring",{label:"vertex ring",options:{0:0,1:1}}).on("change",e=>{for(const t of this.meshes)t.selectVertexNRing=e.value})}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}}const pe={bunny:ne,bunny_res2:ie,bunny_res3:oe,bunny_res4:D};function me(){const p=new ue;p.onReady(()=>{p.loadMesh(p.paneParams.meshurl),p.draw()})}me();
