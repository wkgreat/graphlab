import"./modulepreload-polyfill-B5Qt9EMX.js";import{g as b,c as g,t as A,i as P,o as w,f as y,q as M,r as W,s as F,h as I,j as $,k as z,n as R,m as _,u as H,v as X,w as E,b as q,d as Y,C as Z,a as K,P as J,x as Q,y as ee}from"./camera-DXA52umf.js";import{T as j,b as te,R as se,G as re,P as ie,c as ne,a as oe}from"./webgpuUtils-0ZPxhwwT.js";import{m as D,c as V,a as L}from"./webgpu-utils.module-DPkR54bZ.js";const O=""+new URL("../data/mesh/bun_zipper.ply",import.meta.url).href,ae=""+new URL("../data/mesh/bun_zipper_res2.ply",import.meta.url).href,ce=""+new URL("../data/mesh/bun_zipper_res3.ply",import.meta.url).href,he=""+new URL("../data/mesh/bun_zipper_res4.ply",import.meta.url).href,G=`override ENABLE_LIGHT: bool = true;\r
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
}`;class le{#s;#r;#e;#t;#i;#n;#o;#a=[];constructor(e){this.#s=e.ka,this.#r=e.ambient,this.#e=e.kd,this.#t=e.diffuse,this.#i=e.ks,this.#n=e.specular,this.#o=e.phong}addCallback(e){this.#a.push(e)}invokeChange(){for(const e of this.#a)e(this)}set ka(e){this.#s=e,this.invokeChange()}set ambient(e){this.#r=e,this.invokeChange()}set kd(e){this.#e=e,this.invokeChange()}set diffuse(e){this.#t=e,this.invokeChange()}set ks(e){this.#i=e,this.invokeChange()}set specular(e){this.#n=e,this.invokeChange()}set phong(e){this.#o=e,this.invokeChange()}get ka(){return this.#s}get ambient(){return this.#r}get kd(){return this.#e}get diffuse(){return this.#t}get ks(){return this.#i}get specular(){return this.#n}get phong(){return this.#o}}function B(m){return b(m[0],m[1],m[2])}const x={NONE:0,VERTEX:1,FACE:2};class U{render=null;positions;normals;texcoords;vertexCount=0;vertexIndices;wireframeVertexIndices;textureIndices;textures;colors;colorMode;wireframeColors;#s;label="Mesh";modelmtx=g();halfedge;#r=!1;#e={};selectMode=x.NONE;selectVertexNRing=0;constructor(e){this.label=e??"Mesh",this.#e.uniforms={},this.#e.pipelines={},this.#e.buffers={},this.#e.textures={},this.#e.samplers={},this.modelmtx=g(),this.#s=new le({ka:.2,ambient:[1,1,1,1],kd:.4,diffuse:[1,1,1,1],ks:.2,specular:[1,1,1,1],phong:1.5})}set wireframe(e){this.#r=e,this.refreshVertexBuffers()}createDefaultColors(){const e=this.positions.length/3,t=[0,1,0,1];this.colors=new Float32Array(Array(e).fill(t).flat())}setColor(e){const t=this.positions.length/3;Math.max(...e)>1&&(e=e.map(s=>s/255)),this.colors=new Float32Array(Array(t).fill(e).flat()),this.refreshDefaultVertexBuffer()}createDefaultWireframeColors(){const e=this.positions.length/3,t=[0,0,0,.1];this.wireframeColors=new Float32Array(Array(e).fill(t).flat())}setWireframeColor(e){const t=this.positions.length/3;Math.max(...e)>1&&(e=e.map(s=>s/255)),this.wireframeColors=new Float32Array(Array(t).fill(e).flat()),this.refreshWireframeVertexBuffer()}get wireframe(){return this.#r}createHalfEdge(){this.halfedge=new fe(this)}initWebGPU(e,t,s,r={depth:{depthBias:0,depthBiasSlopeScale:0}}){this.#e.gpuinfo=e,this.#e.canvasinfo=t,this.#e.definition=D(G),this.render=new de(e,t,s),this.vertexCount=this.positions.length/3,this.refreshVertexBuffers(),this.refreshUniforms(s.camera,s.projection),this.createPipelines(r)}createWireFrameVertexIndices(){if(this.vertexIndices&&!this.wireframeVertexIndices){const e=this.vertexIndices.length;this.wireframeVertexIndices=new Uint32Array(e/3*5);for(let t=0;t<this.vertexIndices.length/3;++t)this.wireframeVertexIndices[t*5]=this.vertexIndices[t*3],this.wireframeVertexIndices[t*5+1]=this.vertexIndices[t*3+1],this.wireframeVertexIndices[t*5+2]=this.vertexIndices[t*3+2],this.wireframeVertexIndices[t*5+3]=this.vertexIndices[t*3],this.wireframeVertexIndices[t*5+4]=4294967295}}setModelMatrix(e){this.modelmtx=e}refreshDefaultVertexBuffer(e=!1){if(!this.#e.gpuinfo)return;const t=this.#e.gpuinfo.device;if(e||!("default"in this.#e.buffers)){this.colors||this.createDefaultColors();const s=this.#e.buffers.default;if(this.vertexIndices){const r=V(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4},indices:this.vertexIndices});this.#e.buffers.default=r}else{const r=V(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4}});this.#e.buffers.default=r}s&&(s.buffers.forEach(r=>r.destroy()),s.indexBuffer&&s.indexBuffer.destroy())}}refreshWireframeVertexBuffer(e=!1){if(!this.#e.gpuinfo)return;const t=this.#e.gpuinfo.device;if(e||!("wireframe"in this.#e.buffers)){this.createWireFrameVertexIndices(),this.wireframeColors||this.createDefaultWireframeColors();const s=this.#e.buffers.wireframe;if(this.vertexIndices){const r=V(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4},indices:this.wireframeVertexIndices});this.#e.buffers.wireframe=r}else{const r=V(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4}});this.#e.buffers.wireframe=r}s&&(s.buffers.forEach(r=>r.destroy()),s.indexBuffer&&s.indexBuffer.destroy())}}refreshVertexBuffers(e=!1){this.refreshDefaultVertexBuffer(e),this.refreshWireframeVertexBuffer(e)}refreshUniforms(e,t){const s=this.#e.gpuinfo.device;this.render.scene.refreshUniform();const r=L(this.#e.definition.uniforms.material);"material"in this.#e.uniforms||(this.#e.uniforms.material=s.createBuffer({label:`${this.label} material uniform`,size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),r.set({blinnPhong:{ka:this.#s.ka,kd:this.#s.kd,ks:this.#s.ks,phong:this.#s.phong,ambient:this.#s.ambient,diffuse:this.#s.diffuse,specular:this.#s.specular}}),s.queue.writeBuffer(this.#e.uniforms.material,0,r.arrayBuffer);const i=L(this.#e.definition.uniforms.model);"model"in this.#e.uniforms||(this.#e.uniforms.model=s.createBuffer({label:`${this.label} model uniform`,size:i.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),i.set({hasnormal:this.normals?1:0,hastexcoord:this.texcoords?1:0,modelmtx:this.modelmtx,normalmtx:A(g(),P(g(),this.modelmtx))}),s.queue.writeBuffer(this.#e.uniforms.model,0,i.arrayBuffer)}createPipelines(e){const t=this.#e.gpuinfo.device;this.#e.module=t.createShaderModule({label:this.label,code:G});const s=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=t.createPipelineLayout({bindGroupLayouts:[this.render.scene.bindGroupLayout,s]}),i={label:this.label,layout:r,vertex:{module:this.#e.module,buffers:this.#e.buffers.default.bufferLayouts},fragment:{module:this.#e.module,targets:[{format:this.#e.canvasinfo.context.getConfiguration().format,blend:{color:{operation:"add",srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:"ccw"},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};i.depthStencil.depthBias=e.depth.depthBias,i.depthStencil.depthBiasSlopeScale=e.depth.depthBiasSlopeScale,this.#e.pipelines.default=t.createRenderPipeline(i),i.vertex.buffers=this.#e.buffers.wireframe.bufferLayouts,i.primitive.topology="line-strip",i.primitive.stripIndexFormat="uint32",i.depthStencil.depthBias=0,i.depthStencil.depthBiasSlopeScale=0,this.#e.pipelines.wireframe=t.createRenderPipeline(i)}draw(e){const t=this.render.gpuinfo.device,s=this.render.scene;this.refreshUniforms(s.camera,s.projection);const r=t.createBindGroup({layout:this.#e.pipelines.default.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.#e.uniforms.material}},{binding:1,resource:{buffer:this.#e.uniforms.model}}]});if(this.wireframe){const i=this.#e.buffers.wireframe;e.setPipeline(this.#e.pipelines.wireframe),e.setBindGroup(0,this.render.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,i.buffers[0]),this.vertexIndices?(e.setIndexBuffer(i.indexBuffer,i.indexFormat),e.drawIndexed(i.numElements)):e.draw(this.vertexCount)}else{const i=this.#e.buffers.default;e.setPipeline(this.#e.pipelines.default),e.setBindGroup(0,this.render.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,i.buffers[0]),this.vertexIndices?(e.setIndexBuffer(i.indexBuffer,i.indexFormat),e.drawIndexed(i.numElements)):e.draw(this.vertexCount)}}destroy(){Object.values(this.#e.buffers).forEach(e=>{e.buffers.forEach(t=>t.destroy()),e.indexBuffer&&e.indexBuffer.destroy()}),Object.values(this.#e.uniforms).forEach(e=>{e.destroy()}),Object.values(this.#e.textures).forEach(e=>{e.destroy()})}}class fe{mesh;vertexList=[];faceList=[];halfedgeMap=new Map;selectedVertexMesh=null;selectedFaceMesh=null;faceSelectCallbacks=[];vertexSelectCallbacks=[];constructor(e){this.mesh=e,this.build()}build(){const e=this.mesh.positions.length/3;for(let t=0;t<e;++t)this.vertexList.push({ref:t,position:t*3});for(let t=0;t<this.mesh.vertexIndices.length/3;++t){const s=this.mesh.vertexIndices[t*3],r=this.mesh.vertexIndices[t*3+1],i=this.mesh.vertexIndices[t*3+2],n=this.faceList.length,c=`${s}-${r}`,a=`${r}-${i}`,l=`${i}-${s}`,h=`${r}-${s}`,f=`${i}-${r}`,d=`${s}-${i}`;(this.halfedgeMap.has(c)||this.halfedgeMap.has(a)||this.halfedgeMap.has(l))&&console.warn("HalfEdge 边有重叠"),this.vertexList[s].halfedge=c,this.vertexList[r].halfedge=a,this.vertexList[i].halfedge=l,this.halfedgeMap.set(c,{vertexFrom:s,vertexTo:r,face:n,next:a,prev:l,opposite:h}),this.halfedgeMap.set(a,{vertexFrom:r,vertexTo:i,face:n,next:l,prev:c,opposite:f}),this.halfedgeMap.set(l,{vertexFrom:i,vertexTo:s,face:n,next:c,prev:a,opposite:d});const u={ref:n,vertices:[s,r,i],halfedge:c};this.faceList.push(u)}}addFaceSelectCallback(e){this.faceSelectCallbacks.push(e)}addVertexSelectCallback(e){this.vertexSelectCallbacks.push(e)}selectByRay(e){switch(this.mesh.selectMode){case x.NONE:break;case x.VERTEX:this.getVerticesByRay(e);break;case x.FACE:this.getFracesByRay(e);break}}getFracesByRay(e){let t=this.faceList.map((s,r)=>{const i=s.vertices.map(n=>{const c=this.vertexList[n].position,a=this.mesh.positions.slice(c,c+3),l=w(M(),y(a[0],a[1],a[2],1),this.mesh.modelmtx);return b(l[0],l[1],l[2])});return{ref:r,face:s,triangle:new j(i[0],i[1],i[2])}}).map(s=>({faceinfo:s,crossinfo:e.crossTriangle(s.triangle)})).filter(s=>s.crossinfo.cross);if(this.selectedFaceMesh&&(this.selectedFaceMesh.destroy(),this.selectedFaceMesh=null),this.selectedVertexMesh&&(this.selectedVertexMesh.destroy(),this.selectedVertexMesh=null),t.length>0){let s=1/0,r=null;for(const i of t){const o=i.crossinfo.distance;o<s&&(s=o,r=i)}t=[r],this.#s(t.map(i=>i.faceinfo.triangle))}for(const s of this.faceSelectCallbacks)s(t.map(r=>r.faceinfo))}#s(e){const t=[],s=[];for(let r=0;r<e.length;++r)t.push(...e[r].p0),t.push(...e[r].p1),t.push(...e[r].p2),s.push(r*3,r*3+1,r*3+2);this.selectedFaceMesh=new U,this.selectedFaceMesh.positions=new Float32Array(t),this.selectedFaceMesh.vertexIndices=new Uint32Array(s),this.selectedFaceMesh.setColor([0,0,1,.5]),this.selectedFaceMesh.setWireframeColor([1,0,0,.5]),this.selectedFaceMesh.setModelMatrix(g()),this.selectedFaceMesh.wireframe=!1,this.selectedFaceMesh.initWebGPU(this.mesh.render.gpuinfo,this.mesh.render.canvasInfo,this.mesh.render.scene,{depth:{depthBias:-1,depthBiasSlopeScale:-1}})}getVerticesByRay(e){let t=this.vertexList.map((s,r)=>{const i=s.position,o=this.mesh.positions.slice(i,i+3),n=w(M(),y(o[0],o[1],o[2],1),this.mesh.modelmtx);return{ref:r,vertex:s,point:b(n[0],n[1],n[2])}}).filter(s=>e.dwithinPoint(s.point,1));if(this.selectedFaceMesh&&(this.selectedFaceMesh.destroy(),this.selectedFaceMesh=null),this.selectedVertexMesh&&(this.selectedVertexMesh.destroy(),this.selectedVertexMesh=null),t.length>0){let s=1/0,r=0,i=null;for(let a=0;a<t.length;++a){const l=W(F(I(),t[a].point,e.origin));l<s&&(s=l,r=t[a].ref,i=t[a])}t=[i];const o=t[0].point,n=te(1,10,10,[o[0],o[1],o[2]]),c=new U("sphere");if(c.positions=n.vertices,c.normals=n.normals,c.texcoords=n.texcoords,c.setColor([255/255,215/255,0,1]),c.setModelMatrix(g()),this.selectedVertexMesh=c,this.selectedVertexMesh.initWebGPU(this.mesh.render.gpuinfo,this.mesh.render.canvasInfo,this.mesh.render.scene,{depth:{depthBias:-1,depthBiasSlopeScale:-1}}),this.mesh.selectVertexNRing!==0)if(this.mesh.selectVertexNRing===1){const l=this.getVertexOneRing(this.vertexList[r]).map(h=>{const f=h.vertices.map(d=>{const u=this.vertexList[d].position,p=this.mesh.positions.slice(u,u+3),v=w(M(),y(p[0],p[1],p[2],1),this.mesh.modelmtx);return b(v[0],v[1],v[2])});return new j(f[0],f[1],f[2])});this.#s(l)}else console.warn("其他NRing暂时没实现");for(const a of this.vertexSelectCallbacks)a(t)}}getVertexOneRing(e){const t=[],s=e.halfedge;let r=this.halfedgeMap.get(s);const i=s;for(;r;){if(r.face&&t.push(this.faceList[r.face]),!r.opposite){console.log("HE: opposite is null");break}const o=this.halfedgeMap.get(r.opposite);if(!o){console.log("getVertexOneRing, opp is null!");break}const n=o.next;if(r=this.halfedgeMap.get(n),n===i)break}return t}computeFaceNormal(e){const t=this.vertexList[e.vertices[0]],s=this.vertexList[e.vertices[1]],r=this.vertexList[e.vertices[2]],i=this.mesh.positions.slice(t.position,t.position+3),o=this.mesh.positions.slice(s.position,s.position+3),n=this.mesh.positions.slice(r.position,r.position+3),c=y(i[0],i[1],i[2],1),a=y(o[0],o[1],o[2],1),l=y(n[0],n[1],n[2],1);w(c,c,this.mesh.modelmtx),w(a,a,this.mesh.modelmtx),w(l,l,this.mesh.modelmtx);const h=F(I(),a,c),f=F(I(),l,c),d=$(I(),B(h),B(f));return z(d,d,-1),R(d,d),d}computeNormals(){const e=new Float32Array(this.mesh.vertexCount*3);for(const t of this.vertexList){const s=this.getVertexOneRing(t),r=[];for(const o of s)r.push(this.computeFaceNormal(o));const i=b(0,0,0);for(const o of r)_(i,i,o);R(i,i),e[t.ref*3]=i[0],e[t.ref*3+1]=i[1],e[t.ref*3+2]=i[2]}this.mesh.normals=e,this.mesh.refreshVertexBuffers(!0),console.log(e)}}class de{gpuinfo;canvasInfo;scene;constructor(e,t,s){this.gpuinfo=e,this.canvasInfo=t,this.scene=s}}function T(m){return Object.keys(m).length}class k{formatName;formatVersion;elements={};constructor(){}toMesh(){console.log(this.elements);const e=new U,t=this.elements.vertex,s=t.properties.x.data,r=t.properties.y.data,i=t.properties.z.data;e.positions=new Float32Array(t.count*3);for(let a=0;a<t.count;a++)e.positions[a*3]=s[a],e.positions[a*3+1]=r[a],e.positions[a*3+2]=i[a];if(!("face"in this.elements))return console.warn("this is point cloud data"),null;const o=this.elements.face,c=o.properties.vertex_indices.data.filter(a=>a.length===3);return c.length<o.count&&console.warn("face 存在不为三角形的情况"),e.vertexIndices=new Uint32Array(c.flat()),console.log(e),e}static loadFromString(e){let t=!0,s="",r=-1,i=0,o=0;const n=new k,c=e.split(`
`);function a(h){if(!h.startsWith("ply")){if(h.startsWith("format")){const f=h.split(" ");n.formatName=f[1],n.formatVersion=f[2],n.formatName!=="ascii"&&console.error("ply当前只支持ascii格式数据解析");return}if(!h.startsWith("comment")){if(h.startsWith("element")){const f=h.split(" "),d=f[1],u=parseFloat(f[2]),p=Object.keys(n.elements).length;n.elements[d]={index:p,count:u,properties:{}},s=d;return}if(h.startsWith("property")){const f=h.split(" ");if(h.startsWith("property list")){const d=f[2],u=f[3],p=f[4],v=Object.keys(n.elements[s].properties).length;n.elements[s].properties[p]={index:v,list:!0,lentype:d,elmtype:u,data:[]}}else{const d=f[1],u=f[2],p=Object.keys(n.elements[s].properties).length;n.elements[s].properties[u]={index:p,list:!1,elmtype:d,data:[]}}return}if(h.startsWith("end_header")){t=!1,s="";return}}}}function l(h){s===""&&(r=0,s=Object.entries(n.elements).filter(u=>u[1].index===0)[0][0],i=0,o=T(n.elements[s].properties));const f=n.elements[s].count;i>=f&&(r++,s=Object.entries(n.elements).filter(u=>u[1].index===r)[0][0],i=0,o=T(n.elements[s].properties));const d=h.split(" ");for(let u=0,p=0;u<o;++u){const v=Object.entries(n.elements[s].properties).filter(C=>C[1].index===u)[0],S=v[0];if(v[1].list){const C=parseFloat(d[p]);n.elements[s].properties[S].data.push(d.slice(p+1,p+C+1).map(N=>parseFloat(N))),p+=C+1}else n.elements[s].properties[S].data.push(parseFloat(d[p])),p+=1}i++}for(const h of c)h.trim().length!==0&&(t?a(h):l(h));return n}static async loadFromURL(e){const t=await fetch(e);if(!t.ok)throw new Error(t.statusText);const s=await t.text();return k.loadFromString(s)}}const ue=`//begin scene.wgsl\r
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
//end scene.wgsl`;class me{camera;projection;#s=0;#r=0;lights=[];#e=16;#t={};constructor(e,t){this.camera=e,this.projection=t}addLight(e){this.lights.push(e)}refreshViewport(e,t){this.#s=e,this.#r=t}get viewportMatrix(){const s=this.#s/2,r=this.#r/2;return H(s,0,0,0,0,r,0,0,0,0,1,0,0+s,0+r,0,1)}get viewportMatrixInv(){return P(g(),this.viewportMatrix)}getRayOfPixel(e,t){t=this.#r-t;const s=this.viewportMatrix,r=this.projection.perspectiveMatrixZO,i=this.camera.viewMtx,o=X(g(),r,i),n=P(g(),o),c=P(g(),s),a=y(e,t,0,1),l=w(M(),a,c),h=w(M(),l,n),f=b(h[0],h[1],h[2]),d=b(this.camera.from[0],this.camera.from[1],this.camera.from[2]),u=R(I(),F(I(),f,d));return new se(d,u)}initWebGPU(e,t){this.#t.gpuinfo=e,this.#t.canvasinfo=t}refreshUniform(){if(this.#t.gpuinfo){const e=this.#t.gpuinfo.device;this.#t.definition||(this.#t.definition=D(ue));const t=L(this.#t.definition.uniforms.scene);this.#t.uniform||(this.#t.uniform=e.createBuffer({label:"scene",size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));const s={eye:B(this.camera.from),center:B(this.camera.to),up:B(this.camera.up),viewmtx:this.camera.viewMtx,viewmtxInv:E(M(),this.camera.viewMtx)},r={near:this.projection.near,far:this.projection.far,fovy:this.projection.fovy,aspect:this.projection.aspect,projmtx:this.projection.perspectiveMatrixZO,projmtxInv:E(M(),this.projection.perspectiveMatrixZO)},i={width:this.#s,height:this.#r,viewportmtx:this.viewportMatrix,viewportmtxInv:this.viewportMatrixInv},o=Math.min(this.#e,this.lights.length),n=[];for(let c=0;c<o;++c)n.push({position:this.lights[c].position,color:this.lights[c].color});t.set({camera:s,projection:r,viewport:i,numLights:o,lights:n}),e.queue.writeBuffer(this.#t.uniform,0,t.arrayBuffer)}}get bindGroupLayout(){if(this.#t.gpuinfo){const e=this.#t.gpuinfo.device;return this.#t.layout||(this.#t.layout=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]})),this.#t.layout}return null}get bindGroup(){if(this.#t.gpuinfo){if(!this.#t.bindgroup){const e=this.#t.gpuinfo.device;this.#t.bindgroup=e.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.#t.uniform}}]})}return this.#t.bindgroup}return null}get uniform(){return this.#t.uniform}}class pe{#s;#r;constructor(e,t){this.#s=e,this.#r=t}set position(e){this.#s=e}set color(e){this.#r=e}get position(){return this.#s}get color(){return this.#r}}class ge{gpuInfo=null;canvasInfo=null;colorTexture=null;depthFormat="depth32float";depthTexture=null;camera=null;projection=null;scene=null;cameraMouseCtrl=null;firstpass=!0;ready=!1;resizeObserver=null;ground=new re(1e3,1e3);meshes=[];pane;readyCallbacks=[];paneParams={wireframe:!0,meshurl:O,selectMode:x.VERTEX,nring:1};constructor(){q().then(e=>{if(e===null){console.error("GPU INFO is NULL");return}this.gpuInfo=e;const s=Y({canvasId:"webgpu-canvas",config:{device:e.device,format:e.gpu.getPreferredCanvasFormat()}});if(s===null){console.error("canvasInfo is NULL");return}this.canvasInfo=s;const r=this.canvasInfo.canvas.width,i=this.canvasInfo.canvas.height;this.canvasInfo=s,this.refreshDepthTexture();const o=[-15.161893,-102.341178,161.866607,1],n=[-38.193603,44.828018,76.714302,1],c=[0,0,1,0];this.camera=new Z(o,n,c),this.projection=new ie(Math.PI/2,r/i,1,1e4),this.scene=new me(this.camera,this.projection),this.scene.addLight(new pe([100,-100,100],[1,1,1,1])),this.scene.initWebGPU(this.gpuInfo,this.canvasInfo),this.cameraMouseCtrl=new K(this.camera,this.canvasInfo.canvas),this.cameraMouseCtrl.enable(),this.ground.initWebGPU(this.gpuInfo,this.canvasInfo),this.resizeObserver=new ResizeObserver(a=>{for(const l of a){const h=l.target,f=l.contentBoxSize[0].inlineSize,d=l.contentBoxSize[0].blockSize;h.width=Math.max(1,Math.min(f,this.gpuInfo.device.limits.maxTextureDimension2D)),h.height=Math.max(1,Math.min(d,this.gpuInfo.device.limits.maxTextureDimension2D)),this.projection.aspect=h.width/h.height,this.scene.refreshViewport(h.width,h.height),this.refreshDepthTexture()}}),this.resizeObserver.observe(s.canvas),this.canvasInfo.canvas.addEventListener("click",a=>{const l=this.getPixelOfMouse(a),h=this.scene.getRayOfPixel(l[0],l[1]);for(const f of this.meshes)f.halfedge?.selectByRay(h)}),this.pane=new J({title:"参数控制",expanded:!0}),this.setPane(),this.ready=!0,this.readyCallbacks.forEach(a=>a(this))}).catch(e=>{this.ready=!1,console.error(e)})}getPixelOfMouse(e){const t=this.canvasInfo.canvas,s=t.getBoundingClientRect(),r=t.width/s.width,i=t.height/s.height,o=(e.clientX-s.left)*r,n=(e.clientY-s.top)*i;return[o,n]}loadMesh(e){this.ready&&k.loadFromURL(e).then(t=>{const s=t.toMesh();s.createHalfEdge(),s.halfedge.addFaceSelectCallback(i=>{const o=document.getElementById("content-div");if(i.length===0)o.innerText="";else{const n=i[0],c=n.face.vertices,a=`
                            当前选中的Face: 
                            Face编号: ${n.ref}
                            Vertiecs: ${c[0]},${c[1]},${c[2]}
                        `;o.innerText=a}}),s.halfedge.addVertexSelectCallback(i=>{const o=document.getElementById("content-div");if(i.length===0)o.innerText="";else{const n=i[0],c=`
                            当前选中的Vertex: 
                            Vertex编号: ${n.ref}
                            关联HalfEdge编号: ${n.vertex.halfedge}
                        `;o.innerText=c}});const r=g();Q(r,r,Math.PI/2),ee(r,r,b(1e3,1e3,1e3)),s.setModelMatrix(r),s.wireframe=this.paneParams.wireframe,s.selectMode=x.VERTEX,s.selectVertexNRing=this.paneParams.nring,s.initWebGPU(this.gpuInfo,this.canvasInfo,this.scene,{depth:{depthBias:1,depthBiasSlopeScale:1}}),this.meshes.push(s)})}addMesh(e){e.initWebGPU(this.gpuInfo,this.canvasInfo,this.scene,{depth:{depthBias:0,depthBiasSlopeScale:0}}),this.meshes.push(e)}refreshDepthTexture(){const e=ne(this.gpuInfo,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height,this.depthFormat);return this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=e,this.depthTexture}getRenderPassDescriptor(){let e=null;if(this.ready){if(!this.depthTexture)return null;e=oe({label:"demo",first:this.firstpass,colorTexture:this.canvasInfo.context.getCurrentTexture().createView(),depthTexture:this.depthTexture,clearColor:[0,0,0,1],clearDepth:1})}return e}render(){if(this.ready){const e=this.gpuInfo.device.createCommandEncoder();this.firstpass=!0;const t=e.beginRenderPass(this.getRenderPassDescriptor());this.firstpass=!1,this.ground.draw(this.gpuInfo,this.camera,this.projection,t);for(const r of this.meshes)r.wireframe=!1,r.draw(t),this.paneParams.wireframe&&(r.wireframe=!0,r.draw(t)),r.halfedge&&r.halfedge.selectedVertexMesh&&r.halfedge.selectedVertexMesh.draw(t),r.halfedge&&r.halfedge.selectedFaceMesh&&(r.halfedge.selectedFaceMesh.wireframe=!1,r.halfedge.selectedFaceMesh.draw(t),this.paneParams.wireframe&&(r.halfedge.selectedFaceMesh.wireframe=!0,r.halfedge.selectedFaceMesh.draw(t)));t.end();const s=e.finish();this.gpuInfo.device.queue.submit([s])}requestAnimationFrame(this.render.bind(this))}draw(){requestAnimationFrame(this.render.bind(this))}setPane(){this.pane.addBinding(this.paneParams,"wireframe",{label:"wireframe"}).on("change",e=>{for(const t of this.meshes)t.wireframe=e.value}),this.pane.addBinding(this.paneParams,"meshurl",{label:"Mesh",options:{...xe}}).on("change",e=>{for(;this.meshes.length>0;)this.meshes.pop().destroy();this.loadMesh(e.value)}),this.pane.addBinding(this.paneParams,"selectMode",{label:"选择模式",options:{none:x.NONE,vertex:x.VERTEX,face:x.FACE}}).on("change",e=>{for(const t of this.meshes)t.selectMode=e.value}),this.pane.addBinding(this.paneParams,"nring",{label:"vertex ring",options:{0:0,1:1}}).on("change",e=>{for(const t of this.meshes)t.selectVertexNRing=e.value}),this.pane.addButton({title:"生成法向量"}).on("click",()=>{for(const e of this.meshes)e.halfedge&&e.halfedge.computeNormals()})}onReady(e){this.ready?e(this):this.readyCallbacks.push(e)}}const xe={bunny:O,bunny_res2:ae,bunny_res3:ce,bunny_res4:he};function ve(){const m=new ge;m.onReady(()=>{m.loadMesh(m.paneParams.meshurl),m.draw()})}ve();
