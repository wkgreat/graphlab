import{t as d,f as m,u as k,e as p,c as S,v as U,s as y,g,k as _,i as V,n as A,j as P,w as q,m as X,d as B,b as T}from"./camera-DTaZgdG7.js";import{C as N,a as M,b as R}from"./color-DsrcJaFb.js";import{a as I,h as Y,n as W,i as K}from"./scene-DI6VORWH.js";import{T as F,f as J}from"./webgpuUtils-BvVMHRh1.js";const E={WORLD:0};class Q{label;webgpu={};renderOptions={};constructor(e={}){this.label=e.label??"RenderObject",this.webgpu.buffers={},this.webgpu.uniforms={},this.refreshRenderOptions(e.render)}refreshRenderOptions(e){this.renderOptions=this.renderOptions??{},this.renderOptions.depth=this.renderOptions.depth??{},e&&(e.depth?(this.renderOptions.depth.depthBias=e.depth.depthBias??0,this.renderOptions.depth.depthBiasSlopeScale=e.depth.depthBiasSlopeScale??0):(this.renderOptions.depth.depthBias=0,this.renderOptions.depth.depthBiasSlopeScale=0),this.renderOptions.frontFace=e.frontFace??"ccw",this.renderOptions.space=e.space??E.WORLD)}initWebGPU(e,s,r){this.webgpu.context=e,this.webgpu.scene=s,r&&this.refreshRenderOptions(r),this.refreshVertexBuffers(!0),this.refreshUniforms(!0),this.createPipeline(!0)}}class Z{#e;#t;#s;#r;#i;#n;#o;#a=[];constructor(e){this.#e=e.ka,this.#t=e.ambient,this.#s=e.kd,this.#r=e.diffuse,this.#i=e.ks,this.#n=e.specular,this.#o=e.phong}addCallback(e){this.#a.push(e)}invokeChange(){for(const e of this.#a)e(this)}set ka(e){this.#e=e,this.invokeChange()}set ambient(e){this.#t=e,this.invokeChange()}set kd(e){this.#s=e,this.invokeChange()}set diffuse(e){this.#r=e,this.invokeChange()}set ks(e){this.#i=e,this.invokeChange()}set specular(e){this.#n=e,this.invokeChange()}set phong(e){this.#o=e,this.invokeChange()}get ka(){return this.#e}get ambient(){return this.#t}get kd(){return this.#s}get diffuse(){return this.#r}get ks(){return this.#i}get specular(){return this.#n}get phong(){return this.#o}}var D=`override MAX_LIGHTS: u32 = 10u;

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
}`;class ee{mesh;vertexList=[];faceList=[];halfedgeMap=new Map;selectedVertexMeshes=[];selectedFaceMeshes=[];faceSelectCallbacks=[];vertexSelectCallbacks=[];constructor(e){this.mesh=e,this.build()}build(){const e=this.mesh.positions.length/3;for(let s=0;s<e;++s)this.vertexList.push({ref:s,position:s*3});for(let s=0;s<this.mesh.vertexIndices.length/3;++s){const r=this.mesh.vertexIndices[s*3],t=this.mesh.vertexIndices[s*3+1],n=this.mesh.vertexIndices[s*3+2],o=this.faceList.length,a=`${r}-${t}`,c=`${t}-${n}`,h=`${n}-${r}`,l=`${t}-${r}`,u=`${n}-${t}`,f=`${r}-${n}`;(this.halfedgeMap.has(a)||this.halfedgeMap.has(c)||this.halfedgeMap.has(h))&&console.warn("HalfEdge 边有重叠"),this.vertexList[r].halfedge=a,this.vertexList[t].halfedge=c,this.vertexList[n].halfedge=h,this.halfedgeMap.set(a,{vertexFrom:r,vertexTo:t,face:o,next:c,prev:h,opposite:l}),this.halfedgeMap.set(c,{vertexFrom:t,vertexTo:n,face:o,next:h,prev:a,opposite:u}),this.halfedgeMap.set(h,{vertexFrom:n,vertexTo:r,face:o,next:a,prev:c,opposite:f});const x={ref:o,vertices:[r,t,n],halfedge:a};this.faceList.push(x)}}clearSelectedMeshes(){this.selectedFaceMeshes.length>0&&(this.selectedFaceMeshes.forEach(e=>e.destroy()),this.selectedFaceMeshes=[]),this.selectedVertexMeshes.length>0&&(this.selectedVertexMeshes.forEach(e=>e.destroy()),this.selectedVertexMeshes=[])}addFaceSelectCallback(e){this.faceSelectCallbacks.push(e)}addVertexSelectCallback(e){this.vertexSelectCallbacks.push(e)}selectByRay(e){switch(this.mesh.selectMode){case L.NONE:break;case L.VERTEX:this.getVerticesByRay(e);break;case L.FACE:this.getFracesByRay(e);break}}getFracesByRay(e){let s=this.faceList.map((r,t)=>{const n=r.vertices.map(o=>{const a=this.vertexList[o].position,c=this.mesh.positions.slice(a,a+3),h=d(k(),m(c[0],c[1],c[2],1),this.mesh.modelmtx);return p(h[0],h[1],h[2])});return{ref:t,face:r,triangle:new F(n[0],n[1],n[2])}}).map(r=>({faceinfo:r,crossinfo:e.crossTriangle(r.triangle)})).filter(r=>r.crossinfo.cross);if(this.clearSelectedMeshes(),s.length>0){let r=1/0,t=null;for(const i of s){const o=i.crossinfo.distance;o<r&&(r=o,t=i)}s=[t];const n=this.#e(s.map(i=>i.faceinfo.triangle));this.selectedFaceMeshes.push(n)}for(const r of this.faceSelectCallbacks)r(s.map(t=>t.faceinfo))}#e(e){const s=[],r=[];for(let n=0;n<e.length;++n)s.push(...e[n].p0),s.push(...e[n].p1),s.push(...e[n].p2),r.push(n*3,n*3+1,n*3+2);const t=new $({render:{depth:{depthBias:-1,depthBiasSlopeScale:-1},space:E.WORLD}});return t.positions=new Float32Array(s),t.vertexIndices=new Uint32Array(r),t.setColor([0,0,1,.5]),t.setWireframeColor([1,0,0,.5]),t.setModelMatrix(S()),t.wireframe=!1,t.initWebGPU(this.mesh.webgpu.context,this.mesh.scene),t}#t(e){const s=this.vertexPosition(e,!0),r=J(.2,10,10,[s[0],s[1],s[2]]),t=new $({label:"sphere",render:{depth:{depthBias:-1,depthBiasSlopeScale:-1},space:E.WORLD}});return t.positions=r.vertices,t.normals=r.normals,t.texcoords=r.texcoords,t.setColor([255/255,215/255,0,1]),t.setModelMatrix(S()),this.selectedVertexMeshes.push(t),t.initWebGPU(this.mesh.webgpu.context,this.mesh.scene),t}getVerticesByRay(e){let s=this.vertexList.map((r,t)=>{const n=r.position,i=this.mesh.positions.slice(n,n+3),o=d(k(),m(i[0],i[1],i[2],1),this.mesh.modelmtx);return{ref:t,vertex:r,point:p(o[0],o[1],o[2])}}).filter(r=>e.dwithinPoint(r.point,1));if(this.clearSelectedMeshes(),s.length>0){let r=1/0,t=0,n=null;for(let a=0;a<s.length;++a){const c=U(y(g(),s[a].point,e.origin));c<r&&(r=c,t=s[a].ref,n=s[a])}s=[n];const i=this.vertexList[t],o=this.#t(i);if(o.setColor(N.red),this.selectedVertexMeshes.push(o),this.mesh.selectVertexNRing!==0)if(this.mesh.selectVertexNRing===1){const c=this.getVertexOneRingFaces(this.vertexList[t]).faces.map(u=>{const f=u.vertices.map(x=>{const C=this.vertexList[x].position,v=this.mesh.positions.slice(C,C+3),b=d(k(),m(v[0],v[1],v[2],1),this.mesh.modelmtx);return p(b[0],b[1],b[2])});return new F(f[0],f[1],f[2])}),h=this.#e(c);this.selectedFaceMeshes.push(h);const l=this.getVertexOneRingVertices(this.vertexList[t]);for(const u of l){const f=this.#t(u);this.selectedVertexMeshes.push(f)}}else console.warn("其他NRing暂时没实现");for(const a of this.vertexSelectCallbacks)a(s)}}getVertexOneRingFaces(e){const s=[],r=e.halfedge;let t=this.halfedgeMap.get(r);const n=r;let i=!1;for(;t;){if(t.face&&s.push(this.faceList[t.face]),!t.opposite){i=!0;break}const o=this.halfedgeMap.get(t.opposite);if(!o){i=!0;break}const a=o.next;if(t=this.halfedgeMap.get(a),a===n){i=!1;break}}return{boundary:i,faces:s}}getVertexOneRingVertices(e){const s=[],r=e.halfedge;let t=this.halfedgeMap.get(e.halfedge);for(;t;){s.push(this.vertexList[t.vertexTo]);const n=this.halfedgeMap.get(t.opposite);if(!n)break;const i=n.next,o=this.halfedgeMap.get(i);if(!o||r===i)break;t=o}return s}vertexPosition(e,s=!1){const r=this.mesh.positions.slice(e.position,e.position+3);if(s){const t=m(r[0],r[1],r[2],1);return d(t,t,this.mesh.modelmtx),I(t)}else return p(r[0],r[1],r[2])}faceVertexIdx(e,s){return s.vertices[0]==e.ref?0:s.vertices.findIndex(r=>r===e.ref)}faceVertexIdxOppsiteEdge(e,s){const r=s.vertexFrom,t=s.vertexTo;return e.vertices.includes(r)&&e.vertices.includes(t)?e.vertices.findIndex(n=>n!==r&&n!==t):(console.warn("faceVertexIdxOppsiteEdge edge not belong to the face!"),-1)}faceToTriangle(e){const s=this.vertexList[e.vertices[0]],r=this.vertexList[e.vertices[1]],t=this.vertexList[e.vertices[2]],n=this.mesh.positions.slice(s.position,s.position+3),i=this.mesh.positions.slice(r.position,r.position+3),o=this.mesh.positions.slice(t.position,t.position+3),a=p(n[0],n[1],n[2]),c=p(i[0],i[1],i[2]),h=p(o[0],o[1],o[2]);return new F(a,c,h)}computeFaceNormal(e){const s=this.vertexList[e.vertices[0]],r=this.vertexList[e.vertices[1]],t=this.vertexList[e.vertices[2]],n=this.mesh.positions.slice(s.position,s.position+3),i=this.mesh.positions.slice(r.position,r.position+3),o=this.mesh.positions.slice(t.position,t.position+3),a=m(n[0],n[1],n[2],1),c=m(i[0],i[1],i[2],1),h=m(o[0],o[1],o[2],1);d(a,a,this.mesh.modelmtx),d(c,c,this.mesh.modelmtx),d(h,h,this.mesh.modelmtx);const l=y(g(),c,a),u=y(g(),h,a),f=_(g(),I(l),I(u));return V(f,f,-1),A(f,f),f}computeNormals(){const e=new Float32Array(this.mesh.vertexCount*3);for(const s of this.vertexList){const r=this.getVertexOneRingFaces(s),t=[];for(const i of r.faces)t.push(this.computeFaceNormal(i));const n=p(0,0,0);for(const i of t)P(n,n,i);A(n,n),this.mesh.frontFace==="cw"&&q(n,n),e[s.ref*3]=n[0],e[s.ref*3+1]=n[1],e[s.ref*3+2]=n[2]}this.mesh.normals=e,this.mesh.refreshVertexBuffers(!0)}computeAveragingRegionArea(e){const s=this.getVertexOneRingFaces(e);let r=0;for(const t of s.faces){const n=this.faceToTriangle(t),i=this.faceVertexIdx(e,t);i!==-1&&(r+=n.computeBarycentricCellArea(i))}return r}computeContagentLaplace(e){const s=this.computeAveragingRegionArea(e),r=this.getVertexOneRingVertices(e),t=p(0,0,0);for(const i of r){const o=`${e.ref}-${i.ref}`,a=this.halfedgeMap.get(o),c=this.halfedgeMap.get(a.opposite);if(!c)continue;const h=this.faceList[a.face],l=this.faceList[c.face],u=this.faceVertexIdxOppsiteEdge(h,a),f=this.faceVertexIdxOppsiteEdge(l,c),x=this.faceToTriangle(h),C=this.faceToTriangle(l),v=Math.tan(x.computeRadians(u)),b=Math.tan(C.computeRadians(f)),G=1/v,j=1/b,z=this.vertexPosition(e),H=this.vertexPosition(i),O=y(g(),H,z);V(O,O,G+j),P(t,t,O)}const n=s*2;return V(t,t,1/n),t}computeMeanCurvature(e){const s=this.computeContagentLaplace(e),r=U(s);return r===0||isNaN(r)?0:.5*r}renderAveraginRegionArea(){const e=this.vertexList.map(i=>this.computeAveragingRegionArea(i)),s=e.reduce((i,o)=>i<o?i:o),r=e.reduce((i,o)=>i>o?i:o),n=e.map(i=>(i-s)/(r-s)).map(i=>M.interpolate(R.COOLWARN,i).toArray());this.mesh.setColors(n)}renderMeanCurvature(){const e=this.vertexList.map(i=>this.computeMeanCurvature(i)),s=e.reduce((i,o)=>i<o?i:o),r=e.reduce((i,o)=>i>o?i:o);let t=e.map(i=>(i-s)/(r-s));t=t.map(i=>Math.pow(i,.3));const n=t.map(i=>M.interpolate(R.COOLWARN,i).toArray());this.mesh.setColors(n)}computeGaussianCurvature(e){const s=this.computeAveragingRegionArea(e),r=this.getVertexOneRingFaces(e);let t=0;if(r.boundary)return NaN;for(const n of r.faces){const i=this.faceVertexIdx(e,n),o=this.faceToTriangle(n);t+=o.computeRadians(i)}return s===0?NaN:(Math.PI*2-t)/s}renderGaussianCurvature(){const e=this.vertexList.map(i=>this.computeGaussianCurvature(i)).map(i=>isNaN(i)?0:Y(i,-1e5,1e5)),s=e.filter(i=>!isNaN(i)).reduce((i,o)=>i<o?i:o),r=e.filter(i=>!isNaN(i)).reduce((i,o)=>i>o?i:o);let t=e.map(i=>isNaN(i)?0:(i-s)/(r-s));t=t.map(i=>Math.pow(i,2));const n=t.map(i=>M.interpolate(R.COOLWARN,i).toArray());this.mesh.setColors(n)}computePrincipalCurvatures(e){const s=this.computeMeanCurvature(e),r=this.computeGaussianCurvature(e),t=s-Math.sqrt(Math.pow(s,2)-r),n=s+Math.sqrt(Math.pow(s,2)-r);return[t,n]}renderPrincipalCurvature(e){const s=this.vertexList.map(o=>this.computePrincipalCurvatures(o)[e]),r=s.filter(o=>!isNaN(o)).reduce((o,a)=>o<a?o:a),t=s.filter(o=>!isNaN(o)).reduce((o,a)=>o>a?o:a),i=s.map(o=>isNaN(o)?0:(o-r)/(t-r)).map(o=>M.interpolate(R.COOLWARN,o).toArray());this.mesh.setColors(i)}}class te{low;high;constructor(e=[0,0,0],s=[0,0,0]){this.low=e,this.high=s}addPoint(e){e[0]<this.low[0]&&(this.low[0]=e[0]),e[0]>this.high[0]&&(this.high[0]=e[0]),e[1]<this.low[1]&&(this.low[1]=e[1]),e[1]>this.high[1]&&(this.high[1]=e[1]),e[2]<this.low[2]&&(this.low[2]=e[2]),e[2]>this.high[2]&&(this.high[2]=e[2])}get xmin(){return this.low[0]}get xmax(){return this.high[0]}get ymin(){return this.low[1]}get ymax(){return this.high[1]}get zmin(){return this.low[2]}get zmax(){return this.high[2]}}const L={NONE:0,VERTEX:1,FACE:2};class $ extends Q{scene;positions;normals;texcoords;vertexIndices;wireframeVertexIndices;textureIndices;textures;colors;colorMode;wireframeColors;#e;#t=!0;modelmtx=S();halfedge;#s=!1;selectMode=L.NONE;selectVertexNRing=0;aabb;constructor(e={}){e.label=e.label??"Mesh",super(e),this.webgpu.uniforms={},this.webgpu.pipelines={},this.webgpu.buffers={},this.webgpu.textures={},this.webgpu.samplers={},this.modelmtx=S(),this.#e=new Z({ka:.1,ambient:[1,1,1,1],kd:1,diffuse:[.1,.1,.1,0],ks:.1,specular:[1,1,1,1],phong:1.5})}set wireframe(e){this.#s=e,this.refreshVertexBuffers()}set lighting(e){this.#t=e}get lighting(){return this.#t}get vertexCount(){return this.positions.length/3}getAABB(){if(this.aabb==null){const e=new te([1/0,1/0,1/0],[-1/0,-1/0,-1/0]);for(let s=0;s<this.vertexCount;++s)e.addPoint(this.positions.slice(s*3,s*3+3));this.aabb=e}return this.aabb}transform(e){const s=this.positions.length/3;for(let r=0;r<s;++r){const t=this.positions.subarray(r*3,r*3+3),n=m(t[0],t[1],t[2],1);d(n,n,e),t[0]=n[0],t[1]=n[1],t[2]=n[2]}if(this.normals)for(let r=0;r<s;++r){const t=W(e),n=this.normals.subarray(r*3,r*3+3),i=m(n[0],n[1],n[2],1);d(i,i,t),n[0]=i[0],n[1]=i[1],n[2]=i[2]}this.refreshVertexBuffers(!0)}createDefaultColors(){const e=this.positions.length/3,s=[0,1,0,1];this.colors=new Float32Array(Array(e).fill(s).flat())}setColor(e){const s=this.positions.length/3;Math.max(...e)>1&&(e=e.map(r=>r/255)),this.colors=new Float32Array(Array(s).fill(e).flat()),this.refreshDefaultVertexBuffer(!0)}setColors(e){const s=this.positions.length/3,r=e.length,t=new Float32Array(s*4);for(let n=0;n<s;++n){const i=e[n%r];t[n*4]=i[0],t[n*4+1]=i[1],t[n*4+2]=i[2],t[n*4+3]=i[3]}this.colors=t,this.refreshDefaultVertexBuffer(!0)}createDefaultWireframeColors(){const e=this.positions.length/3,s=[0,0,0,.1];this.wireframeColors=new Float32Array(Array(e).fill(s).flat())}setWireframeColor(e){const s=this.positions.length/3;Math.max(...e)>1&&(e=e.map(r=>r/255)),this.wireframeColors=new Float32Array(Array(s).fill(e).flat()),this.refreshWireframeVertexBuffer(!0)}get wireframe(){return this.#s}get frontFace(){return this.renderOptions.frontFace}createHalfEdge(){this.halfedge=new ee(this)}initWebGPU(e,s,r){this.webgpu.context=e,this.scene=s,this.webgpu.definition=X(D),this.refreshRenderOptions(r),this.refreshVertexBuffers(),this.refreshUniforms(),this.createPipeline()}createWireFrameVertexIndices(){if(this.vertexIndices&&!this.wireframeVertexIndices){const e=this.vertexIndices.length;this.wireframeVertexIndices=new Uint32Array(e/3*5);for(let s=0;s<this.vertexIndices.length/3;++s)this.wireframeVertexIndices[s*5]=this.vertexIndices[s*3],this.wireframeVertexIndices[s*5+1]=this.vertexIndices[s*3+1],this.wireframeVertexIndices[s*5+2]=this.vertexIndices[s*3+2],this.wireframeVertexIndices[s*5+3]=this.vertexIndices[s*3],this.wireframeVertexIndices[s*5+4]=4294967295}}setModelMatrix(e){this.modelmtx=e}refreshDefaultVertexBuffer(e=!1){if(!this.webgpu.context)return;const s=this.webgpu.context.device;if(e||!("default"in this.webgpu.buffers)){this.colors||this.createDefaultColors();const r=this.webgpu.buffers.default;if(this.vertexIndices){const t=B(s,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4},indices:this.vertexIndices});this.webgpu.buffers.default=t}else{const t=B(s,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.colors,numComponents:4}});this.webgpu.buffers.default=t}r&&(r.buffers.forEach(t=>t.destroy()),r.indexBuffer&&r.indexBuffer.destroy())}}refreshWireframeVertexBuffer(e=!1){if(!this.webgpu.context)return;const s=this.webgpu.context.device;if(e||!("wireframe"in this.webgpu.buffers)){this.createWireFrameVertexIndices(),this.wireframeColors||this.createDefaultWireframeColors();const r=this.webgpu.buffers.wireframe;if(this.vertexIndices){const t=B(s,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4},indices:this.wireframeVertexIndices});this.webgpu.buffers.wireframe=t}else{const t=B(s,{position:{data:this.positions,numComponents:3},normal:{data:this.normals,numComponents:3},texcoord:{data:this.texcoords,numComponents:2},colors:{data:this.wireframeColors,numComponents:4}});this.webgpu.buffers.wireframe=t}r&&(r.buffers.forEach(t=>t.destroy()),r.indexBuffer&&r.indexBuffer.destroy())}}refreshVertexBuffers(e=!1){this.refreshDefaultVertexBuffer(e),this.refreshWireframeVertexBuffer(e)}refreshUniforms(){const e=this.webgpu.context.device;this.scene.refreshUniform();const s=T(this.webgpu.definition.uniforms.material);"material"in this.webgpu.uniforms||(this.webgpu.uniforms.material=e.createBuffer({label:`${this.label} material uniform`,size:s.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),s.set({blinnPhong:{ka:this.#e.ka,kd:this.#e.kd,ks:this.#e.ks,phong:this.#e.phong,ambient:this.#e.ambient,diffuse:this.#e.diffuse,specular:this.#e.specular}}),e.queue.writeBuffer(this.webgpu.uniforms.material,0,s.arrayBuffer);const r=T(this.webgpu.definition.uniforms.model);"model"in this.webgpu.uniforms||(this.webgpu.uniforms.model=e.createBuffer({label:`${this.label} model uniform`,size:r.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),r.set({hasnormal:this.normals?1:0,hastexcoord:this.texcoords?1:0,lighting:this.#t?1:0,space:this.renderOptions.space,modelmtx:this.modelmtx,normalmtx:W(this.modelmtx)}),e.queue.writeBuffer(this.webgpu.uniforms.model,0,r.arrayBuffer)}createPipeline(){const e=this.webgpu.context.device;this.webgpu.module=e.createShaderModule({label:this.label,code:D});const s=e.createBindGroupLayout({label:this.label,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=e.createPipelineLayout({bindGroupLayouts:[this.scene.bindGroupLayout,s]}),t={label:this.label,layout:r,vertex:{module:this.webgpu.module,buffers:this.webgpu.buffers.default.bufferLayouts},fragment:{module:this.webgpu.module,targets:[{format:this.webgpu.context.canvas.context.getConfiguration().format,blend:{color:{operation:"add",srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{operation:"add",srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]},primitive:{topology:"triangle-list",cullMode:"none",frontFace:this.renderOptions.frontFace},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};t.depthStencil.depthBias=this.renderOptions.depth.depthBias,t.depthStencil.depthBiasSlopeScale=this.renderOptions.depth.depthBiasSlopeScale,this.webgpu.pipelines.default=e.createRenderPipeline(t),t.vertex.buffers=this.webgpu.buffers.wireframe.bufferLayouts,t.primitive.topology="line-strip",t.primitive.stripIndexFormat="uint32",t.depthStencil.depthBias=0,t.depthStencil.depthBiasSlopeScale=0,this.webgpu.pipelines.wireframe=e.createRenderPipeline(t)}draw(e){const s=this.webgpu.context.device;this.refreshUniforms();const r=s.createBindGroup({layout:this.webgpu.pipelines.default.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:this.webgpu.uniforms.material}},{binding:1,resource:{buffer:this.webgpu.uniforms.model}}]});if(this.wireframe){const t=this.webgpu.buffers.wireframe;e.setPipeline(this.webgpu.pipelines.wireframe),e.setBindGroup(0,this.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,t.buffers[0]),this.vertexIndices?(e.setIndexBuffer(t.indexBuffer,t.indexFormat),e.drawIndexed(t.numElements)):e.draw(this.vertexCount)}else{const t=this.webgpu.buffers.default;e.setPipeline(this.webgpu.pipelines.default),e.setBindGroup(0,this.scene.bindGroup),e.setBindGroup(1,r),e.setVertexBuffer(0,t.buffers[0]),this.vertexIndices?(e.setIndexBuffer(t.indexBuffer,t.indexFormat),e.drawIndexed(t.numElements)):e.draw(this.vertexCount)}}destroy(){Object.values(this.webgpu.buffers).forEach(e=>{e.buffers.forEach(s=>s.destroy()),e.indexBuffer&&e.indexBuffer.destroy()}),Object.values(this.webgpu.uniforms).forEach(e=>{e.destroy()}),Object.values(this.webgpu.textures).forEach(e=>{e.destroy()})}createNormalLine(e=1){if(this.normals){const s=this.vertexCount,r=new Float32Array(s*2*3),t=new Float32Array(s*2*4);for(let i=0;i<s;++i){const o=this.positions.subarray(i*3,i*3+3),a=this.normals.subarray(i*3,i*3+3),c=m(o[0],o[1],o[2],1);d(c,c,this.modelmtx);const h=I(c),l=p(a[0],a[1],a[2]);A(l,l),V(l,l,e);const u=P(g(),h,l);r.subarray(i*6,i*6+6).set([...h,...u]),t.subarray(i*8,i*8+8).set([...N.green,...N.red])}return new K({topology:"line-list",positions:r,colors:t,indices:null})}else return null}}export{$ as M,E as R,L as a};
