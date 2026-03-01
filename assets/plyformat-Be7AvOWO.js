import{d as R,o as j,p as Y,l as d}from"./axis-CFbiPSBX.js";import{m as J,c as M,a as $}from"./webgpu-utils.module--9rjYVl9.js";import{C as S,a as E,b as L}from"./color-DsrcJaFb.js";import{T as P,b as Q}from"./objects-BlX18zms.js";import{c as Z,o as H}from"./utils-DruZQoW3.js";import{t as g,f as x,a as F,d as m,c as N,o as _,s as V,e as w,j as ee,h as O,n as D,i as U,q as te}from"./camera-DSiRDkIj.js";const W={WORLD:0};class se{label;webgpu={};renderOptions={};constructor(e={}){this.label=e.label??"RenderObject",this.webgpu.buffers={},this.webgpu.uniforms={},this.refreshRenderOptions(e.render)}refreshRenderOptions(e){this.renderOptions=this.renderOptions??{},this.renderOptions.depth=this.renderOptions.depth??{},e&&(e.depth?(this.renderOptions.depth.depthBias=e.depth.depthBias??0,this.renderOptions.depth.depthBiasSlopeScale=e.depth.depthBiasSlopeScale??0):(this.renderOptions.depth.depthBias=0,this.renderOptions.depth.depthBiasSlopeScale=0),this.renderOptions.frontFace=e.frontFace??"ccw",this.renderOptions.space=e.space??W.WORLD)}initWebGPU(e,t,r){this.webgpu.context=e,this.webgpu.scene=t,r&&this.refreshRenderOptions(r),this.refreshVertexBuffers(!0),this.refreshUniforms(!0),this.createPipeline(!0)}}class re{#e;#t;#s;#r;#n;#i;#o;#a=[];constructor(e){this.#e=e.ka,this.#t=e.ambient,this.#s=e.kd,this.#r=e.diffuse,this.#n=e.ks,this.#i=e.specular,this.#o=e.phong}addCallback(e){this.#a.push(e)}invokeChange(){for(const e of this.#a)e(this)}set ka(e){this.#e=e,this.invokeChange()}set ambient(e){this.#t=e,this.invokeChange()}set kd(e){this.#s=e,this.invokeChange()}set diffuse(e){this.#r=e,this.invokeChange()}set ks(e){this.#n=e,this.invokeChange()}set specular(e){this.#i=e,this.invokeChange()}set phong(e){this.#o=e,this.invokeChange()}get ka(){return this.#e}get ambient(){return this.#t}get kd(){return this.#s}get diffuse(){return this.#r}get ks(){return this.#n}get specular(){return this.#i}get phong(){return this.#o}}var z=`override MAX_LIGHTS: u32 = 10u;

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
};

struct Camera {\r
    eye: vec3f,\r
    center: vec3f,\r
    up: vec3f,\r
    viewmtx: mat4x4f,\r
    viewmtxInv: mat4x4f\r
};

struct Projection {\r
    near: f32,\r
    far: f32,\r
    fovy: f32,\r
    aspect: f32,\r
    projmtx: mat4x4f,\r
    projmtxInv: mat4x4f\r
};

struct Viewport {\r
    width: f32,\r
    height: f32,\r
    viewportmtx: mat4x4f,\r
    viewportmtxInv: mat4x4f\r
};

struct IBLUniform {\r
    canIBL: u32,\r
    prefilterLevels: u32,\r
    prescaled: u32,\r
    sh: array<vec3f, 9u>\r
};

struct SceneUniform {\r
    worldmtx: mat4x4f,\r
    camera: Camera,\r
    projection: Projection,\r
    viewport: Viewport,\r
    ibl: IBLUniform,\r
    numLights: u32,\r
    lights: array<PointLight, 32u>\r
};

@group(0) @binding(0) var<uniform> scene : SceneUniform;\r
@group(0) @binding(1) var prefilterTexture: texture_cube<f32>;\r
@group(0) @binding(2) var prefilterSampler: sampler;\r
@group(0) @binding(3) var lutTexture: texture_2d<f32>;\r
@group(0) @binding(4) var lutSampler: sampler;

fn pv(p: vec4f) -> vec4f {\r
    var v = scene.projection.projmtx * scene.camera.viewmtx * p;\r
    v = v / v.w;\r
    return v;\r
}

fn spv(p: vec4f) -> vec4f {\r
    var v = scene.viewport.viewportmtx * scene.projection.projmtx * scene.camera.viewmtx * p;\r
    v = v / v.w;\r
    return v;\r
}

override ENABLE_LIGHT: bool = true;

struct MaterialUniform {\r
    blinnPhong: BlinnPhong\r
}

const MeshRenderSpace_WORLD: u32 = 0;\r
const MeshRenderSpace_NDC: u32 = 1;

struct ModelUniform {\r
    hasnormal: u32,\r
    hastexcoord: u32,\r
    lighting: u32,\r
    space: u32,\r
    modelmtx: mat4x4f,\r
    normalmtx: mat4x4f\r
};

@group(1) @binding(0) var<uniform> material : MaterialUniform;\r
@group(1) @binding(1) var<uniform> model : ModelUniform;

struct VSInput {\r
    @location(0) position: vec3f,\r
    @location(1) normal: vec3f,\r
    @location(2) texcoord: vec2f,\r
    @location(3) color: vec4f\r
}

struct VSOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) worldpos: vec3f,\r
    @location(1) worldnormal: vec3f,\r
    @location(2) color: vec4f\r
}

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
}

fn premultiplied(color:vec4f) -> vec4f {\r
    return vec4f(color.rgb * color.a, color.a);\r
}

fn blinnPhong(bp: BlinnPhong, color:vec4f, pos:vec3f, eye: vec3f, normal:vec3f) -> vec4f {

    let e = normalize(eye-pos);\r
    let n = normalize(normal);\r
    let nlights = min(16u, scene.numLights);

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
    return rescolor;

}

@fragment\r
fn fs(input: VSOutput) -> @location(0) vec4f {\r
    if(ENABLE_LIGHT && model.lighting>0u && model.hasnormal>0u && scene.numLights > 0) {\r
        var color = blinnPhong(material.blinnPhong, input.color, input.worldpos, scene.camera.eye, input.worldnormal);\r
        return color;\r
    } else {\r
        return input.color;\r
    }\r
}`;class ne{mesh;vertexList=[];faceList=[];halfedgeMap=new Map;selectedVertexMeshes=[];selectedFaceMeshes=[];faceSelectCallbacks=[];vertexSelectCallbacks=[];constructor(e){this.mesh=e,this.build()}build(){const e=this.mesh.positions.length/3;for(let t=0;t<e;++t)this.vertexList.push({ref:t,position:t*3});for(let t=0;t<this.mesh.vertexIndices.length/3;++t){const r=this.mesh.vertexIndices[t*3],s=this.mesh.vertexIndices[t*3+1],n=this.mesh.vertexIndices[t*3+2],o=this.faceList.length,a=`${r}-${s}`,c=`${s}-${n}`,l=`${n}-${r}`,f=`${s}-${r}`,u=`${n}-${s}`,p=`${r}-${n}`;(this.halfedgeMap.has(a)||this.halfedgeMap.has(c)||this.halfedgeMap.has(l))&&console.warn("HalfEdge 边有重叠"),this.vertexList[r].halfedge=a,this.vertexList[s].halfedge=c,this.vertexList[n].halfedge=l,this.halfedgeMap.set(a,{vertexFrom:r,vertexTo:s,face:o,next:c,prev:l,opposite:f}),this.halfedgeMap.set(c,{vertexFrom:s,vertexTo:n,face:o,next:l,prev:a,opposite:u}),this.halfedgeMap.set(l,{vertexFrom:n,vertexTo:r,face:o,next:a,prev:c,opposite:p});const v={ref:o,vertices:[r,s,n],halfedge:a};this.faceList.push(v)}}clearSelectedMeshes(){this.selectedFaceMeshes.length>0&&(this.selectedFaceMeshes.forEach(e=>e.destroy()),this.selectedFaceMeshes=[]),this.selectedVertexMeshes.length>0&&(this.selectedVertexMeshes.forEach(e=>e.destroy()),this.selectedVertexMeshes=[])}addFaceSelectCallback(e){this.faceSelectCallbacks.push(e)}addVertexSelectCallback(e){this.vertexSelectCallbacks.push(e)}selectByRay(e){switch(this.mesh.selectMode){case k.NONE:break;case k.VERTEX:this.getVerticesByRay(e);break;case k.FACE:this.getFracesByRay(e);break}}getFracesByRay(e){let t=this.faceList.map((r,s)=>{const n=r.vertices.map(o=>{const a=this.vertexList[o].position,c=this.mesh.positions.slice(a,a+3),l=g(F(),x(c[0],c[1],c[2],1),this.mesh.modelmtx);return m(l[0],l[1],l[2])});return{ref:s,face:r,triangle:new P(n[0],n[1],n[2])}}).map(r=>({faceinfo:r,crossinfo:e.crossTriangle(r.triangle)})).filter(r=>r.crossinfo.cross);if(this.clearSelectedMeshes(),t.length>0){let r=1/0,s=null;for(const i of t){const o=i.crossinfo.distance;o<r&&(r=o,s=i)}t=[s];const n=this.#e(t.map(i=>i.faceinfo.triangle));this.selectedFaceMeshes.push(n)}for(const r of this.faceSelectCallbacks)r(t.map(s=>s.faceinfo))}#e(e){const t=[],r=[];for(let n=0;n<e.length;++n)t.push(...e[n].p0),t.push(...e[n].p1),t.push(...e[n].p2),r.push(n*3,n*3+1,n*3+2);const s=new G({render:{depth:{depthBias:-1,depthBiasSlopeScale:-1},space:W.WORLD}});return s.positions=new Float32Array(t),s.vertexIndices=new Uint32Array(r),s.setColor([0,0,1,.5]),s.setWireframeColor([1,0,0,.5]),s.setModelMatrix(N()),s.wireframe=!1,s.initWebGPU(this.mesh.webgpu.context,this.mesh.scene),s}#t(e){const t=this.vertexPosition(e,!0),r=Q(.2,10,10,[t[0],t[1],t[2]]),s=new G({label:"sphere",render:{depth:{depthBias:-1,depthBiasSlopeScale:-1},space:W.WORLD}});return s.positions=r.vertices,s.normals=r.normals,s.texcoords=r.texcoords,s.setColor([255/255,215/255,0,1]),s.setModelMatrix(N()),this.selectedVertexMeshes.push(s),s.initWebGPU(this.mesh.webgpu.context,this.mesh.scene),s}getVerticesByRay(e){let t=this.vertexList.map((r,s)=>{const n=r.position,i=this.mesh.positions.slice(n,n+3),o=g(F(),x(i[0],i[1],i[2],1),this.mesh.modelmtx);return{ref:s,vertex:r,point:m(o[0],o[1],o[2])}}).filter(r=>e.dwithinPoint(r.point,1));if(this.clearSelectedMeshes(),t.length>0){let r=1/0,s=0,n=null;for(let a=0;a<t.length;++a){const c=_(V(w(),t[a].point,e.origin));c<r&&(r=c,s=t[a].ref,n=t[a])}t=[n];const i=this.vertexList[s],o=this.#t(i);if(o.setColor(S.red),this.selectedVertexMeshes.push(o),this.mesh.selectVertexNRing!==0)if(this.mesh.selectVertexNRing===1){const c=this.getVertexOneRingFaces(this.vertexList[s]).faces.map(u=>{const p=u.vertices.map(v=>{const I=this.vertexList[v].position,y=this.mesh.positions.slice(I,I+3),B=g(F(),x(y[0],y[1],y[2],1),this.mesh.modelmtx);return m(B[0],B[1],B[2])});return new P(p[0],p[1],p[2])}),l=this.#e(c);this.selectedFaceMeshes.push(l);const f=this.getVertexOneRingVertices(this.vertexList[s]);for(const u of f){const p=this.#t(u);this.selectedVertexMeshes.push(p)}}else console.warn("其他NRing暂时没实现");for(const a of this.vertexSelectCallbacks)a(t)}}getVertexOneRingFaces(e){const t=[],r=e.halfedge;let s=this.halfedgeMap.get(r);const n=r;let i=!1;for(;s;){if(s.face&&t.push(this.faceList[s.face]),!s.opposite){i=!0;break}const o=this.halfedgeMap.get(s.opposite);if(!o){i=!0;break}const a=o.next;if(s=this.halfedgeMap.get(a),a===n){i=!1;break}}return{boundary:i,faces:t}}getVertexOneRingVertices(e){const t=[],r=e.halfedge;let s=this.halfedgeMap.get(e.halfedge);for(;s;){t.push(this.vertexList[s.vertexTo]);const n=this.halfedgeMap.get(s.opposite);if(!n)break;const i=n.next,o=this.halfedgeMap.get(i);if(!o||r===i)break;s=o}return t}vertexPosition(e,t=!1){const r=this.mesh.positions.slice(e.position,e.position+3);if(t){const s=x(r[0],r[1],r[2],1);return g(s,s,this.mesh.modelmtx),R(s)}else return m(r[0],r[1],r[2])}faceVertexIdx(e,t){return t.vertices[0]==e.ref?0:t.vertices.findIndex(r=>r===e.ref)}faceVertexIdxOppsiteEdge(e,t){const r=t.vertexFrom,s=t.vertexTo;return e.vertices.includes(r)&&e.vertices.includes(s)?e.vertices.findIndex(n=>n!==r&&n!==s):(console.warn("faceVertexIdxOppsiteEdge edge not belong to the face!"),-1)}faceToTriangle(e){const t=this.vertexList[e.vertices[0]],r=this.vertexList[e.vertices[1]],s=this.vertexList[e.vertices[2]],n=this.mesh.positions.slice(t.position,t.position+3),i=this.mesh.positions.slice(r.position,r.position+3),o=this.mesh.positions.slice(s.position,s.position+3),a=m(n[0],n[1],n[2]),c=m(i[0],i[1],i[2]),l=m(o[0],o[1],o[2]);return new P(a,c,l)}computeFaceNormal(e){const t=this.vertexList[e.vertices[0]],r=this.vertexList[e.vertices[1]],s=this.vertexList[e.vertices[2]],n=this.mesh.positions.slice(t.position,t.position+3),i=this.mesh.positions.slice(r.position,r.position+3),o=this.mesh.positions.slice(s.position,s.position+3),a=x(n[0],n[1],n[2],1),c=x(i[0],i[1],i[2],1),l=x(o[0],o[1],o[2],1);g(a,a,this.mesh.modelmtx),g(c,c,this.mesh.modelmtx),g(l,l,this.mesh.modelmtx);const f=V(w(),c,a),u=V(w(),l,a),p=ee(w(),R(f),R(u));return O(p,p,-1),D(p,p),p}computeNormals(){const e=new Float32Array(this.mesh.vertexCount*3);for(const t of this.vertexList){const r=this.getVertexOneRingFaces(t),s=[];for(const i of r.faces)s.push(this.computeFaceNormal(i));const n=m(0,0,0);for(const i of s)U(n,n,i);D(n,n),this.mesh.frontFace==="cw"&&te(n,n),e[t.ref*3]=n[0],e[t.ref*3+1]=n[1],e[t.ref*3+2]=n[2]}this.mesh.normals=e,this.mesh.refreshVertexBuffers(!0)}computeAveragingRegionArea(e){const t=this.getVertexOneRingFaces(e);let r=0;for(const s of t.faces){const n=this.faceToTriangle(s),i=this.faceVertexIdx(e,s);i!==-1&&(r+=n.computeBarycentricCellArea(i))}return r}computeContagentLaplace(e){const t=this.computeAveragingRegionArea(e),r=this.getVertexOneRingVertices(e),s=m(0,0,0);for(const i of r){const o=`${e.ref}-${i.ref}`,a=this.halfedgeMap.get(o),c=this.halfedgeMap.get(a.opposite);if(!c)continue;const l=this.faceList[a.face],f=this.faceList[c.face],u=this.faceVertexIdxOppsiteEdge(l,a),p=this.faceVertexIdxOppsiteEdge(f,c),v=this.faceToTriangle(l),I=this.faceToTriangle(f),y=Math.tan(v.computeRadians(u)),B=Math.tan(I.computeRadians(p)),T=1/y,q=1/B,X=this.vertexPosition(e),K=this.vertexPosition(i),A=V(w(),K,X);O(A,A,T+q),U(s,s,A)}const n=t*2;return O(s,s,1/n),s}computeMeanCurvature(e){const t=this.computeContagentLaplace(e),r=_(t);return r===0||isNaN(r)?0:.5*r}renderAveraginRegionArea(){const e=this.vertexList.map(i=>this.computeAveragingRegionArea(i)),t=e.reduce((i,o)=>i<o?i:o),r=e.reduce((i,o)=>i>o?i:o),n=e.map(i=>(i-t)/(r-t)).map(i=>E.interpolate(L.COOLWARN,i).toArray());this.mesh.setColors(n)}renderMeanCurvature(){const e=this.vertexList.map(i=>this.computeMeanCurvature(i)),t=e.reduce((i,o)=>i<o?i:o),r=e.reduce((i,o)=>i>o?i:o);let s=e.map(i=>(i-t)/(r-t));s=s.map(i=>Math.pow(i,.3));const n=s.map(i=>E.interpolate(L.COOLWARN,i).toArray());this.mesh.setColors(n)}computeGaussianCurvature(e){const t=this.computeAveragingRegionArea(e),r=this.getVertexOneRingFaces(e);let s=0;if(r.boundary)return NaN;for(const n of r.faces){const i=this.faceVertexIdx(e,n),o=this.faceToTriangle(n);s+=o.computeRadians(i)}return t===0?NaN:(Math.PI*2-s)/t}renderGaussianCurvature(){const e=this.vertexList.map(i=>this.computeGaussianCurvature(i)).map(i=>isNaN(i)?0:Z(i,-1e5,1e5)),t=e.filter(i=>!isNaN(i)).reduce((i,o)=>i<o?i:o),r=e.filter(i=>!isNaN(i)).reduce((i,o)=>i>o?i:o);let s=e.map(i=>isNaN(i)?0:(i-t)/(r-t));s=s.map(i=>Math.pow(i,2));const n=s.map(i=>E.interpolate(L.COOLWARN,i).toArray());this.mesh.setColors(n)}computePrincipalCurvatures(e){const t=this.computeMeanCurvature(e),r=this.computeGaussianCurvature(e),s=t-Math.sqrt(Math.pow(t,2)-r),n=t+Math.sqrt(Math.pow(t,2)-r);return[s,n]}renderPrincipalCurvature(e){const t=this.vertexList.map(o=>this.computePrincipalCurvatures(o)[e]),r=t.filter(o=>!isNaN(o)).reduce((o,a)=>o<a?o:a),s=t.filter(o=>!isNaN(o)).reduce((o,a)=>o>a?o:a),i=t.map(o=>isNaN(o)?0:(o-r)/(s-r)).map(o=>E.interpolate(L.COOLWARN,o).toArray());this.mesh.setColors(i)}}class ie{low;high;constructor(e=[0,0,0],t=[0,0,0]){this.low=e,this.high=t}addPoint(e){e[0]<this.low[0]&&(this.low[0]=e[0]),e[0]>this.high[0]&&(this.high[0]=e[0]),e[1]<this.low[1]&&(this.low[1]=e[1]),e[1]>this.high[1]&&(this.high[1]=e[1]),e[2]<this.low[2]&&(this.low[2]=e[2]),e[2]>this.high[2]&&(this.high[2]=e[2])}get xmin(){return this.low[0]}get xmax(){return this.high[0]}get ymin(){return this.low[1]}get ymax(){return this.high[1]}get zmin(){return this.low[2]}get zmax(){return this.high[2]}}const k={NONE:0,VERTEX:1,FACE:2};class G extends se{scene;positions;normals;texcoords;vertexIndices;wireframeVertexIndices;textureIndices;textures;colors;colorMode;wireframeColors;#e;#t=!0;modelmtx=N();halfedge;#s=!1;selectMode=k.NONE;selectVertexNRing=0;aabb;constructor(e={}){e.label=e.label??"Mesh",super(e),this.webgpu.uniforms={},this.webgpu.pipelines={},this.webgpu.buffers={},this.webgpu.textures={},this.webgpu.samplers={},this.modelmtx=N(),this.#e=new re({ka:.1,ambient:[1,1,1,1],kd:1,diffuse:[.1,.1,.1,0],ks:.1,specular:[1,1,1,1],phong:1.5})}set wireframe(e){this.#s=e,this.refreshVertexBuffers()}set lighting(e){this.#t=e}get lighting(){return this.#t}get vertexCount(){return this.positions.length/3}getAABB(){if(this.aabb==null){const e=new ie([1/0,1/0,1/0],[-1/0,-1/0,-1/0]);for(let t=0;t<this.vertexCount;++t)e.addPoint(this.positions.slice(t*3,t*3+3));this.aabb=e}return this.aabb}transform(e){const t=this.positions.length/3;for(let r=0;r<t;++r){const s=this.positions.subarray(r*3,r*3+3),n=x(s[0],s[1],s[2],1);g(n,n,e),s[0]=n[0],s[1]=n[1],s[2]=n[2]}if(this.normals)for(let r=0;r<t;++r){const s=j(e),n=this.normals.subarray(r*3,r*3+3),i=x(n[0],n[1],n[2],1);g(i,i,s),n[0]=i[0],n[1]=i[1],n[2]=i[2]}this.refreshVertexBuffers(!0)}createDefaultColors(){const e=this.positions.length/3,t=[0,1,0,1];this.colors=new Float32Array(Array(e).fill(t).flat())}setColor(e){const t=this.positions.length/3;Math.max(...e)>1&&(e=e.map(r=>r/255)),this.colors=new Float32Array(Array(t).fill(e).flat()),this.refreshDefaultVertexBuffer(!0)}setColors(e){const t=this.positions.length/3,r=e.length,s=new Float32Array(t*4);for(let n=0;n<t;++n){const i=e[n%r];s[n*4]=i[0],s[n*4+1]=i[1],s[n*4+2]=i[2],s[n*4+3]=i[3]}this.colors=s,this.refreshDefaultVertexBuffer(!0)}createDefaultWireframeColors(){const e=this.positions.length/3,t=[0,0,0,.1];this.wireframeColors=new Float32Array(Array(e).fill(t).flat())}setWireframeColor(e){const t=this.positions.length/3;Math.max(...e)>1&&(e=e.map(r=>r/255)),this.wireframeColors=new Float32Array(Array(t).fill(e).flat()),this.refreshWireframeVertexBuffer(!0)}get wireframe(){return this.#s}get frontFace(){return this.renderOptions.frontFace}createHalfEdge(){this.halfedge=new ne(this)}initWebGPU(e,t,r){this.webgpu.context=e,this.scene=t,this.webgpu.definition=J(z),this.refreshRenderOptions(r),this.refreshVertexBuffers(),this.refreshUniforms(),this.createPipeline()}createWireFrameVertexIndices(){if(this.vertexIndices&&!this.wireframeVertexIndices){const e=this.vertexIndices.length;this.wireframeVertexIndices=new Uint32Array(e/3*5);for(let t=0;t<this.vertexIndices.length/3;++t)this.wireframeVertexIndices[t*5]=this.vertexIndices[t*3],this.wireframeVertexIndices[t*5+1]=this.vertexIndices[t*3+1],this.wireframeVertexIndices[t*5+2]=this.vertexIndices[t*3+2],this.wireframeVertexIndices[t*5+3]=this.vertexIndices[t*3],this.wireframeVertexIndices[t*5+4]=4294967295}}setModelMatrix(e){this.modelmtx=e}refreshDefaultVertexBuffer(e=!1){if(!this.webgpu.context)return;const t=this.webgpu.context.device;if(e||!("default"in this.webgpu.buffers)){this.colors||this.createDefaultColors();const r=this.webgpu.buffers.default;if(this.vertexIndices){const s=M(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4},indices:this.vertexIndices});this.webgpu.buffers.default=s}else{const s=M(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4}});this.webgpu.buffers.default=s}r&&(r.buffers.forEach(s=>s.destroy()),r.indexBuffer&&r.indexBuffer.destroy())}}refreshWireframeVertexBuffer(e=!1){if(!this.webgpu.context)return;const t=this.webgpu.context.device;if(e||!("wireframe"in this.webgpu.buffers)){this.createWireFrameVertexIndices(),this.wireframeColors||this.createDefaultWireframeColors();const r=this.webgpu.buffers.wireframe;if(this.vertexIndices){const s=M(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4},indices:this.wireframeVertexIndices});this.webgpu.buffers.wireframe=s}else{const s=M(t,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4}});this.webgpu.buffers.wireframe=s}r&&(r.buffers.forEach(s=>s.destroy()),r.indexBuffer&&r.indexBuffer.destroy())}}refreshVertexBuffers(e=!1){this.refreshDefaultVertexBuffer(e),this.refreshWireframeVertexBuffer(e)}refreshUniforms(){const e=this.webgpu.context.device;this.scene.refreshUniform();const t=$(this.webgpu.definition.uniforms.material);"material"in this.webgpu.uniforms||(this.webgpu.uniforms.material=e.createBuffer({label:`${this.label} material uniform`,size:t.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),t.set({blinnPhong:{ka:this.#e.ka,kd:this.#e.kd,ks:this.#e.ks,phong:this.#e.phong,ambient:this.#e.ambient,diffuse:this.#e.diffuse,specular:this.#e.specular}}),e.queue.writeBuffer(this.webgpu.uniforms.material,0,t.arrayBuffer);const r=$(this.webgpu.definition.uniforms.model);"model"in this.webgpu.uniforms||(this.webgpu.uniforms.model=e.createBuffer({label:`${this.label} model uniform`,size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),r.set({hasnormal:this.normals?1:0,hastexcoord:this.texcoords?1:0,lighting:this.#t?1:0,space:this.renderOptions.space,modelmtx:this.modelmtx,normalmtx:j(this.modelmtx)}),e.queue.writeBuffer(this.webgpu.uniforms.model,0,r.arrayBuffer)}createPipeline(){const e=this.webgpu.context.device;this.webgpu.module=e.createShaderModule({label:this.label,code:z});const t=e.createBindGroupLayout({label:this.label,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=e.createPipelineLayout({bindGroupLayouts:[this.scene.bindGroupLayout,t]}),s={label:this.label,layout:r,vertex:{module:this.webgpu.module,buffers:this.webgpu.buffers.default.bufferLayouts},fragment:{module:this.webgpu.module,targets:[{format:this.webgpu.context.canvas.context.getConfiguration().format,blend:{color:{operation:"add",srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:this.renderOptions.frontFace},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};s.depthStencil.depthBias=this.renderOptions.depth.depthBias,s.depthStencil.depthBiasSlopeScale=this.renderOptions.depth.depthBiasSlopeScale,this.webgpu.pipelines.default=e.createRenderPipeline(s),s.vertex.buffers=this.webgpu.buffers.wireframe.bufferLayouts,s.primitive.topology="line-strip",s.primitive.stripIndexFormat="uint32",s.depthStencil.depthBias=0,s.depthStencil.depthBiasSlopeScale=0,this.webgpu.pipelines.wireframe=e.createRenderPipeline(s)}draw(e){const t=this.webgpu.context.device;this.refreshUniforms();const r=t.createBindGroup({layout:this.webgpu.pipelines.default.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.webgpu.uniforms.material}},{binding:1,resource:{buffer:this.webgpu.uniforms.model}}]});if(this.wireframe){const s=this.webgpu.buffers.wireframe;e.setPipeline(this.webgpu.pipelines.wireframe),e.setBindGroup(0,this.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,s.buffers[0]),this.vertexIndices?(e.setIndexBuffer(s.indexBuffer,s.indexFormat),e.drawIndexed(s.numElements)):e.draw(this.vertexCount)}else{const s=this.webgpu.buffers.default;e.setPipeline(this.webgpu.pipelines.default),e.setBindGroup(0,this.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,s.buffers[0]),this.vertexIndices?(e.setIndexBuffer(s.indexBuffer,s.indexFormat),e.drawIndexed(s.numElements)):e.draw(this.vertexCount)}}destroy(){Object.values(this.webgpu.buffers).forEach(e=>{e.buffers.forEach(t=>t.destroy()),e.indexBuffer&&e.indexBuffer.destroy()}),Object.values(this.webgpu.uniforms).forEach(e=>{e.destroy()}),Object.values(this.webgpu.textures).forEach(e=>{e.destroy()})}createNormalLine(e=1){if(this.normals){const t=this.vertexCount,r=new Float32Array(t*2*3),s=new Float32Array(t*2*4);for(let i=0;i<t;++i){const o=this.positions.subarray(i*3,i*3+3),a=this.normals.subarray(i*3,i*3+3),c=x(o[0],o[1],o[2],1);g(c,c,this.modelmtx);const l=R(c),f=m(a[0],a[1],a[2]);D(f,f),O(f,f,e);const u=U(w(),l,f);r.subarray(i*6,i*6+6).set([...l,...u]),s.subarray(i*8,i*8+8).set([...S.green,...S.red])}return new Y({topology:"line-list",positions:r,colors:s,indices:null})}else return null}}function oe(h){return new Worker(""+new URL("plyworker-CiiM8jGp.js",import.meta.url).href,{name:h?.name})}const b={char:{ctor:Int8Array,elemBytes:1,read:h=>h.data.getInt8(h.cursor)},uchar:{ctor:Uint8Array,elemBytes:1,read:h=>h.data.getUint8(h.cursor)},short:{ctor:Int16Array,elemBytes:2,read:h=>h.data.getInt16(h.cursor,h.littleEndian)},ushort:{ctor:Uint16Array,elemBytes:2,read:h=>h.data.getUint16(h.cursor,h.littleEndian)},int:{ctor:Int32Array,elemBytes:4,read:h=>h.data.getInt32(h.cursor,h.littleEndian)},uint:{ctor:Uint32Array,elemBytes:4,read:h=>h.data.getUint32(h.cursor,h.littleEndian)},float:{ctor:Float32Array,elemBytes:4,read:h=>h.data.getFloat32(h.cursor,h.littleEndian)},double:{ctor:Float32Array,elemBytes:8,read:h=>h.data.getFloat64(h.cursor,h.littleEndian)}};class ae{formatName;formatVersion;elements={};elemindex={};getElementByIndex(e){return this.elements[this.elemindex[e]]}getElementByName(e){return this.elements[e]}getPropertyByIndex(e,t){const r=this.getElementByIndex(e);return r.properties[r.propindex[t]]}getPropertyByName(e,t){return this.getElementByName(e).properties[t]}constructor(){}toMesh(){const e=new G,t=this.elements.vertex,r=t.properties.x.data,s=t.properties.y.data,n=t.properties.z.data;e.positions=new Float32Array(t.count*3);for(let a=0;a<t.count;a++)e.positions[a*3]=r[a],e.positions[a*3+1]=s[a],e.positions[a*3+2]=n[a];if(!("face"in this.elements))return console.warn("this is point cloud data"),null;const o=this.elements.face.properties.vertex_indices.data;return e.vertexIndices=o,e}}class C{static parseHeader(e,t){const r=t.split(`
`),s={curElement:"",curElementIdx:-1,curCount:0,curNumProperties:0};for(const n of r)n.trim().length!==0&&C.parseHeaderLine(e,s,n)}static parseHeaderLine(e,t,r){if(!r.startsWith("ply")){if(r.startsWith("format")){const s=r.split(" ");e.formatName=s[1],e.formatVersion=s[2];return}if(!r.startsWith("comment")){if(r.startsWith("element")){const s=r.split(" "),n=s[1],i=parseFloat(s[2]),o=Object.keys(e.elements).length;e.elements[n]={index:o,name:n,count:i,properties:{},propindex:{}},e.elemindex[o]=n,t.curElement=n;return}if(r.startsWith("property")){const s=r.split(" ");if(r.startsWith("property list")){const n=s[2],i=s[3],o=s[4],a=Object.keys(e.elements[t.curElement].properties).length;e.elements[t.curElement].properties[o]={index:a,name:o,list:!0,lentype:n,elmtype:i,listidx:0},e.elements[t.curElement].propindex[a]=o}else{const n=s[1],i=s[2],o=Object.keys(e.elements[t.curElement].properties).length;e.elements[t.curElement].properties[i]={index:o,name:i,list:!1,elmtype:n,listidx:0},e.elements[t.curElement].propindex[o]=i}return}if(r.startsWith("end_header")){t.curElement="";return}}}}static initPropertyData(e){const t=Object.keys(e.elements).length;for(let r=0;r<t;++r){const s=e.getElementByIndex(r),n=Object.keys(s.properties);for(const i of n){const o=s.properties[i];if(o.list)o.listLenData=new b[o.lentype].ctor(s.count),o.offsetData=new Int32Array(s.count);else{const a=new b[o.elmtype].ctor(s.count);o.data=a}}}}static initListPropertyData(e){const t=Object.keys(e.elements).length;for(let r=0;r<t;++r){const s=e.getElementByIndex(r),n=Object.keys(s.properties);for(const i of n){const o=s.properties[i];if(o.list){let a=0;for(let l=0;l<s.count;++l)a+=o.listLenData[l];const c=new b[o.elmtype].ctor(a);o.data=c}}}}static parseAsciiBody(e,t){d.info("start ply parseAsciiBody"),this.initPropertyData(e);const r=t.split(`
`);let s={curElement:"",curElementIdx:-1,curCount:0,curNumProperties:0};for(const n of r)n.trim().length!==0&&this.parseAsciiBodyLine(e,s,n,!1);this.initListPropertyData(e),s={curElement:"",curElementIdx:-1,curCount:0,curNumProperties:0};for(const n of r)n.trim().length!==0&&this.parseAsciiBodyLine(e,s,n,!0)}static parseAsciiBodyLine(e,t,r,s){t.curElement===""&&(t.curElementIdx=0,t.curElement=Object.entries(e.elements).filter(o=>o[1].index===0)[0][0],t.curCount=0,t.curNumProperties=H(e.elements[t.curElement].properties));const n=e.elements[t.curElement].count;t.curCount>=n&&(t.curElementIdx++,t.curElement=Object.entries(e.elements).filter(o=>o[1].index===t.curElementIdx)[0][0],t.curCount=0,t.curNumProperties=H(e.elements[t.curElement].properties));const i=r.split(" ");for(let o=0,a=0;o<t.curNumProperties;++o){const l=Object.entries(e.elements[t.curElement].properties).filter(u=>u[1].index===o)[0][0],f=e.elements[t.curElement].properties[l];if(s){if(f.list){const u=f.listLenData[t.curCount],p=f.offsetData[t.curCount];for(let v=0;v<u;++v)f.data[f.listidx++]=parseFloat(i[p+1+v])}}else if(f.list){const u=parseInt(i[a]);f.listLenData[t.curCount]=u,f.offsetData[t.curCount]=a,a+=u+1}else f.data[t.curCount]=parseFloat(i[a]),a+=1}t.curCount++}static readNumber(e,t,r=!0){const s=b[t].read(e);return r&&(e.cursor+=b[t].elemBytes),s}static readProperty(e,t,r,s){if(s.list){s.offsetData[t]=e.cursor;const n=this.readNumber(e,s.lentype);s.listLenData[t]=n;const i=n*b[s.elmtype].elemBytes;e.cursor+=i}else s.data[t]=this.readNumber(e,s.elmtype)}static readListProperty(e,t,r){e.cursor=r.offsetData[t];const s=this.readNumber(e,r.lentype);r.listLenData[t]=s;for(let n=0;n<s;++n)r.data[r.listidx++]=this.readNumber(e,r.elmtype)}static parseBinBody(e,t){d.info("ply parseBinBody start");const r=Object.keys(e.elements).length;this.initPropertyData(e);for(let s=0;s<r;++s){const n=e.getElementByIndex(s),i=Object.keys(n.properties),a=n.count/10;d.info("read single property buffer");for(let c=0;c<n.count;++c){if(c%a===0){const l=c/a*10;d.info(`Element: ${n.name}, Progress: ${l}%`)}for(let l=0;l<i.length;++l){const f=e.getPropertyByIndex(s,l);this.readProperty(t,c,n,f)}}this.initListPropertyData(e),d.info("read list property buffer");for(let c=0;c<n.count;++c){if(c%a===0){const l=c/a*10;d.info(`Element: ${n.name}, Progress: ${l}%`)}for(let l=0;l<i.length;++l){const f=e.getPropertyByIndex(s,l);f.list&&(d.info("read list property buffer"),this.readListProperty(t,c,f))}}}d.info("ply parseBinBody finish")}static async load(e){d.info(`ply load start ${e}`);const r=await(await fetch(e)).arrayBuffer(),s=new ae,n=new TextDecoder().decode(r),i=n.indexOf(`end_header
`)+11,o=n.slice(0,i);if(C.parseHeader(s,o),s.formatName==="ascii"){const a=n.slice(i);C.parseAsciiBody(s,a)}else{let a=!1;if(s.formatName==="binary_little_endian")a=!0;else if(s.formatName==="binary_big_endian")a=!1;else throw Error("invalid ply format");const l={data:new DataView(r,i),cursor:0,littleEndian:a};C.parseBinBody(s,l)}return d.info("ply load finish"),s}static loadByWorker(e,t){d.info("start ply loadByWorker");const r=new oe;r.onmessage=n=>{t(n.data.ply)};const s=crypto.randomUUID();return r.postMessage({taskId:s,uri:e}),s}}export{G as M,C as P,W as R,k as a};
