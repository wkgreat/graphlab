import{A as gr,f as wt,g as ar,e as ir,h as Ft,k as mr,x as Ct,n as Pr,y as Bt,E as Lt,d as Kr,c as qe,z as fr,B as Dt,j as Ot,i as Ut,s as Tt,o as Pt,b as Nr,m as jr,D as yt,F as Nt,G as jt,H as zt,t as Wr,u as $r}from"./camera-DTaZgdG7.js";import{g as Ze,R as Gt}from"./webgpuUtils-BvVMHRh1.js";function Vt(){var w=new gr(9);return gr!=Float32Array&&(w[1]=0,w[2]=0,w[3]=0,w[5]=0,w[6]=0,w[7]=0),w[0]=1,w[4]=1,w[8]=1,w}function Jr(){var w=new gr(4);return gr!=Float32Array&&(w[0]=0,w[1]=0,w[2]=0),w[3]=1,w}function Zt(w,r,f){f=f*.5;var i=Math.sin(f);return w[0]=i*r[0],w[1]=i*r[1],w[2]=i*r[2],w[3]=Math.cos(f),w}function _r(w,r,f,i){var E=r[0],t=r[1],n=r[2],h=r[3],s=f[0],m=f[1],x=f[2],u=f[3],v,b,c,L,B;return b=E*s+t*m+n*x+h*u,b<0&&(b=-b,s=-s,m=-m,x=-x,u=-u),1-b>Lt?(v=Math.acos(b),c=Math.sin(v),L=Math.sin((1-i)*v)/c,B=Math.sin(i*v)/c):(L=1-i,B=i),w[0]=L*E+B*s,w[1]=L*t+B*m,w[2]=L*n+B*x,w[3]=L*h+B*u,w}function Ht(w,r){var f=r[0]+r[4]+r[8],i;if(f>0)i=Math.sqrt(f+1),w[3]=.5*i,i=.5/i,w[0]=(r[5]-r[7])*i,w[1]=(r[6]-r[2])*i,w[2]=(r[1]-r[3])*i;else{var E=0;r[4]>r[0]&&(E=1),r[8]>r[E*3+E]&&(E=2);var t=(E+1)%3,n=(E+2)%3;i=Math.sqrt(r[E*3+E]-r[t*3+t]-r[n*3+n]+1),w[E]=.5*i,i=.5/i,w[3]=(r[t*3+n]-r[n*3+t])*i,w[t]=(r[t*3+E]+r[E*3+t])*i,w[n]=(r[n*3+E]+r[E*3+n])*i}return w}var Yt=wt,Et=Bt;(function(){var w=ar(),r=ir(1,0,0),f=ir(0,1,0);return function(i,E,t){var n=Ft(E,t);return n<-.999999?(mr(w,r,E),Ct(w)<1e-6&&mr(w,f,E),Pr(w,w),Zt(i,w,Math.PI),i):n>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(mr(w,E,t),i[0]=w[0],i[1]=w[1],i[2]=w[2],i[3]=1+n,Et(i,i))}})();(function(){var w=Jr(),r=Jr();return function(f,i,E,t,n,h){return _r(w,i,n,h),_r(r,E,t,h),_r(f,w,r,2*h*(1-h)),f}})();(function(){var w=Vt();return function(r,f,i,E){return w[0]=i[0],w[3]=i[1],w[6]=i[2],w[1]=E[0],w[4]=E[1],w[7]=E[2],w[2]=-f[0],w[5]=-f[1],w[8]=-f[2],Et(r,Ht(r,w))}})();var qt=`override MAX_LIGHTS: u32 = 10u;

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

struct VSInput {\r
    @location(0) position: vec3f,\r
    @location(1) color: vec4f\r
}

struct VSOutput {\r
    @builtin(position) position: vec4f,\r
    @location(0) color: vec4f\r
}

@vertex fn vs(input: VSInput) -> VSOutput {\r
    let ndcpos = scene.projection.projmtx * scene.camera.viewmtx * scene.worldmtx * vec4f(input.position, 1.0);\r
    var output: VSOutput;\r
    output.position = ndcpos;\r
    output.color = input.color;\r
    return output;\r
}

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {\r
    return input.color;\r
}`;class Xt{#t;#n;#e;#a;#i;#r={};constructor(r){this.#t=r.label??"SimpleLine",this.#n=r.topology,this.#e=r.positions,this.#a=r.colors,this.#i=r.indices}get topology(){return this.#n}get positions(){return this.positions}get colors(){return this.#a}initWebGPU(r,f){this.#r.context=r,this.#r.scene=f,this.refreshUniforms(),this.refreshVertexBuffers(),this.createPileline()}createDefaultColors(){const r=this.positions.length/3,f=[0,1,0,1];this.#a=new Float32Array(Array(r).fill(f).flat())}refreshVertexBuffers(r=!1){if(!this.#r.context)return;const f=this.#r.context.device;if(r||!this.#r.buffer){this.colors||this.createDefaultColors();const i=this.#r.buffer;if(this.#i){const E=Kr(f,{position:{data:this.#e,numComponents:3},colors:{data:this.#a,numComponents:4},indices:this.#i});this.#r.buffer=E}else{const E=Kr(f,{position:{data:this.#e,numComponents:3},colors:{data:this.#a,numComponents:4}});this.#r.buffer=E}i&&(i.buffers.forEach(E=>E.destroy()),i.indexBuffer&&i.indexBuffer.destroy())}}refreshUniforms(){this.#r.scene.refreshUniform()}createPileline(){const r=this.#r.context.device;this.#r.module=r.createShaderModule({label:this.#t,code:qt});const f=r.createPipelineLayout({bindGroupLayouts:[this.#r.scene.bindGroupLayout]}),i={label:this.#t,layout:f,vertex:{module:this.#r.module,buffers:this.#r.buffer.bufferLayouts},fragment:{module:this.#r.module,targets:[{format:this.#r.context.canvas.context.getConfiguration().format}]},primitive:{topology:this.#n},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};this.#r.pipeline=r.createRenderPipeline(i)}draw(r){this.refreshUniforms(),this.refreshVertexBuffers();const f=this.#r.scene,i=this.#r.buffer;r.setPipeline(this.#r.pipeline),r.setBindGroup(0,f.bindGroup),r.setVertexBuffer(0,i.buffers[0]),this.#i?(r.setIndexBuffer(i.indexBuffer,i.indexFormat),r.drawIndexed(i.numElements)):r.draw(this.#e.length/3)}destroy(){for(const r of this.#r.buffer.buffers)r.destroy()}}class Bn{#t;#n;#e;#a;#i;#r;#s;constructor(r){this.#t=r.xlim??[0,1],this.#n=r.ylim??[0,1],this.#e=r.zlim??[0,1],this.#a=r.xcolor??[1,0,0,1],this.#i=r.ycolor??[0,1,0,1],this.#r=r.zcolor??[0,0,1,1],this.#s=new Xt({topology:"line-list",positions:new Float32Array([this.#t[0],0,0,this.#t[1],0,0,0,this.#n[0],0,0,this.#n[1],0,0,0,this.#e[0],0,0,this.#e[1]]),colors:new Float32Array([...this.#a,...this.#a,...this.#i,...this.#i,...this.#r,...this.#r]),indices:null})}initWebGPU(r,f){this.#s.initWebGPU(r,f)}draw(r){this.#s.draw(r)}destroy(){this.#s.destroy()}}var pr={exports:{}},Qr;function Kt(){return Qr||(Qr=1,(function(w){function r(i){var E=Math.floor,t=new Array(64),n=new Array(64),h=new Array(64),s=new Array(64),m,x,u,v,b=new Array(65535),c=new Array(65535),L=new Array(64),B=new Array(64),d=[],g=0,A=7,j=new Array(64),U=new Array(64),S=new Array(64),y=new Array(256),T=new Array(2048),G,z=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],V=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],N=[0,1,2,3,4,5,6,7,8,9,10,11],O=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],D=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],J=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],W=[0,1,2,3,4,5,6,7,8,9,10,11],K=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],Z=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];function te(M){for(var _e=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],ve=0;ve<64;ve++){var be=E((_e[ve]*M+50)/100);be<1?be=1:be>255&&(be=255),t[z[ve]]=be}for(var ke=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],Me=0;Me<64;Me++){var Ie=E((ke[Me]*M+50)/100);Ie<1?Ie=1:Ie>255&&(Ie=255),n[z[Me]]=Ie}for(var le=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],ce=0,he=0;he<8;he++)for(var ae=0;ae<8;ae++)h[ce]=1/(t[z[ce]]*le[he]*le[ae]*8),s[ce]=1/(n[z[ce]]*le[he]*le[ae]*8),ce++}function de(M,_e){for(var ve=0,be=0,ke=new Array,Me=1;Me<=16;Me++){for(var Ie=1;Ie<=M[Me];Ie++)ke[_e[be]]=[],ke[_e[be]][0]=ve,ke[_e[be]][1]=Me,be++,ve++;ve*=2}return ke}function Ee(){m=de(V,N),x=de(J,W),u=de(O,D),v=de(K,Z)}function pe(){for(var M=1,_e=2,ve=1;ve<=15;ve++){for(var be=M;be<_e;be++)c[32767+be]=ve,b[32767+be]=[],b[32767+be][1]=ve,b[32767+be][0]=be;for(var ke=-(_e-1);ke<=-M;ke++)c[32767+ke]=ve,b[32767+ke]=[],b[32767+ke][1]=ve,b[32767+ke][0]=_e-1+ke;M<<=1,_e<<=1}}function ge(){for(var M=0;M<256;M++)T[M]=19595*M,T[M+256>>0]=38470*M,T[M+512>>0]=7471*M+32768,T[M+768>>0]=-11059*M,T[M+1024>>0]=-21709*M,T[M+1280>>0]=32768*M+8421375,T[M+1536>>0]=-27439*M,T[M+1792>>0]=-5329*M}function re(M){for(var _e=M[0],ve=M[1]-1;ve>=0;)_e&1<<ve&&(g|=1<<A),ve--,A--,A<0&&(g==255?(X(255),X(0)):X(g),A=7,g=0)}function X(M){d.push(M)}function Q(M){X(M>>8&255),X(M&255)}function me(M,_e){var ve,be,ke,Me,Ie,le,ce,he,ae=0,Ae,l=8,I=64;for(Ae=0;Ae<l;++Ae){ve=M[ae],be=M[ae+1],ke=M[ae+2],Me=M[ae+3],Ie=M[ae+4],le=M[ae+5],ce=M[ae+6],he=M[ae+7];var P=ve+he,Y=ve-he,p=be+ce,F=be-ce,a=ke+le,H=ke-le,Te=Me+Ie,e=Me-Ie,R=P+Te,C=P-Te,o=p+a,_=p-a;M[ae]=R+o,M[ae+4]=R-o;var k=(_+C)*.707106781;M[ae+2]=C+k,M[ae+6]=C-k,R=e+H,o=H+F,_=F+Y;var xe=(R-_)*.382683433,ne=.5411961*R+xe,ue=1.306562965*_+xe,Fe=o*.707106781,He=Y+Fe,Be=Y-Fe;M[ae+5]=Be+ne,M[ae+3]=Be-ne,M[ae+1]=He+ue,M[ae+7]=He-ue,ae+=8}for(ae=0,Ae=0;Ae<l;++Ae){ve=M[ae],be=M[ae+8],ke=M[ae+16],Me=M[ae+24],Ie=M[ae+32],le=M[ae+40],ce=M[ae+48],he=M[ae+56];var Ce=ve+he,Le=ve-he,Ne=be+ce,je=be-ce,Je=ke+le,Qe=ke-le,De=Me+Ie,Ge=Me-Ie,Oe=Ce+De,Ve=Ce-De,ze=Ne+Je,er=Ne-Je;M[ae]=Oe+ze,M[ae+32]=Oe-ze;var Gr=(er+Ve)*.707106781;M[ae+16]=Ve+Gr,M[ae+48]=Ve-Gr,Oe=Ge+Qe,ze=Qe+je,er=je+Le;var Vr=(Oe-er)*.382683433,Zr=.5411961*Oe+Vr,Hr=1.306562965*er+Vr,Yr=ze*.707106781,qr=Le+Yr,Xr=Le-Yr;M[ae+40]=Xr+Zr,M[ae+24]=Xr-Zr,M[ae+8]=qr+Hr,M[ae+56]=qr-Hr,ae++}var hr;for(Ae=0;Ae<I;++Ae)hr=M[Ae]*_e[Ae],L[Ae]=hr>0?hr+.5|0:hr-.5|0;return L}function ie(){Q(65504),Q(16),X(74),X(70),X(73),X(70),X(0),X(1),X(1),X(0),Q(1),Q(1),X(0),X(0)}function $(M){if(M){Q(65505),M[0]===69&&M[1]===120&&M[2]===105&&M[3]===102?Q(M.length+2):(Q(M.length+5+2),X(69),X(120),X(105),X(102),X(0));for(var _e=0;_e<M.length;_e++)X(M[_e])}}function Re(M,_e){Q(65472),Q(17),X(8),Q(_e),Q(M),X(3),X(1),X(17),X(0),X(2),X(17),X(1),X(3),X(17),X(1)}function Se(){Q(65499),Q(132),X(0);for(var M=0;M<64;M++)X(t[M]);X(1);for(var _e=0;_e<64;_e++)X(n[_e])}function se(){Q(65476),Q(418),X(0);for(var M=0;M<16;M++)X(V[M+1]);for(var _e=0;_e<=11;_e++)X(N[_e]);X(16);for(var ve=0;ve<16;ve++)X(O[ve+1]);for(var be=0;be<=161;be++)X(D[be]);X(1);for(var ke=0;ke<16;ke++)X(J[ke+1]);for(var Me=0;Me<=11;Me++)X(W[Me]);X(17);for(var Ie=0;Ie<16;Ie++)X(K[Ie+1]);for(var le=0;le<=161;le++)X(Z[le])}function we(M){typeof M>"u"||M.constructor!==Array||M.forEach(_e=>{if(typeof _e=="string"){Q(65534);var ve=_e.length;Q(ve+2);var be;for(be=0;be<ve;be++)X(_e.charCodeAt(be))}})}function oe(){Q(65498),Q(12),X(3),X(1),X(0),X(2),X(17),X(3),X(17),X(0),X(63),X(0)}function q(M,_e,ve,be,ke){for(var Me=ke[0],Ie=ke[240],le,ce=16,he=63,ae=64,Ae=me(M,_e),l=0;l<ae;++l)B[z[l]]=Ae[l];var I=B[0]-ve;ve=B[0],I==0?re(be[0]):(le=32767+I,re(be[c[le]]),re(b[le]));for(var P=63;P>0&&B[P]==0;P--);if(P==0)return re(Me),ve;for(var Y=1,p;Y<=P;){for(var F=Y;B[Y]==0&&Y<=P;++Y);var a=Y-F;if(a>=ce){p=a>>4;for(var H=1;H<=p;++H)re(Ie);a=a&15}le=32767+B[Y],re(ke[(a<<4)+c[le]]),re(b[le]),Y++}return P!=he&&re(Me),ve}function ye(){for(var M=String.fromCharCode,_e=0;_e<256;_e++)y[_e]=M(_e)}this.encode=function(M,_e){new Date().getTime(),_e&&fe(_e),d=new Array,g=0,A=7,Q(65496),ie(),we(M.comments),$(M.exifBuffer),Se(),Re(M.width,M.height),se(),oe();var ve=0,be=0,ke=0;g=0,A=7,this.encode.displayName="_encode_";for(var Me=M.data,Ie=M.width,le=M.height,ce=Ie*4,he,ae=0,Ae,l,I,P,Y,p,F,a;ae<le;){for(he=0;he<ce;){for(P=ce*ae+he,Y=P,p=-1,F=0,a=0;a<64;a++)F=a>>3,p=(a&7)*4,Y=P+F*ce+p,ae+F>=le&&(Y-=ce*(ae+1+F-le)),he+p>=ce&&(Y-=he+p-ce+4),Ae=Me[Y++],l=Me[Y++],I=Me[Y++],j[a]=(T[Ae]+T[l+256>>0]+T[I+512>>0]>>16)-128,U[a]=(T[Ae+768>>0]+T[l+1024>>0]+T[I+1280>>0]>>16)-128,S[a]=(T[Ae+1280>>0]+T[l+1536>>0]+T[I+1792>>0]>>16)-128;ve=q(j,h,ve,m,u),be=q(U,s,be,x,v),ke=q(S,s,ke,x,v),he+=32}ae+=8}if(A>=0){var H=[];H[1]=A+1,H[0]=(1<<A+1)-1,re(H)}return Q(65497),Buffer.from(d)};function fe(M){if(M<=0&&(M=1),M>100&&(M=100),G!=M){var _e=0;M<50?_e=Math.floor(5e3/M):_e=Math.floor(200-M*2),te(_e),G=M}}function ee(){var M=new Date().getTime();i||(i=50),ye(),Ee(),pe(),ge(),fe(i),new Date().getTime()-M}ee()}w.exports=f;function f(i,E){typeof E>"u"&&(E=50);var t=new r(E),n=t.encode(i,E);return{data:n,width:i.width,height:i.height}}})(pr)),pr.exports}var br={exports:{}},et;function Wt(){return et||(et=1,(function(w){var r=(function(){var E=new Int32Array([0,1,8,16,9,2,3,10,17,24,32,25,18,11,4,5,12,19,26,33,40,48,41,34,27,20,13,6,7,14,21,28,35,42,49,56,57,50,43,36,29,22,15,23,30,37,44,51,58,59,52,45,38,31,39,46,53,60,61,54,47,55,62,63]),t=4017,n=799,h=3406,s=2276,m=1567,x=3784,u=5793,v=2896;function b(){}function c(U,S){for(var y=0,T=[],G,z,V=16;V>0&&!U[V-1];)V--;T.push({children:[],index:0});var N=T[0],O;for(G=0;G<V;G++){for(z=0;z<U[G];z++){for(N=T.pop(),N.children[N.index]=S[y];N.index>0;){if(T.length===0)throw new Error("Could not recreate Huffman Table");N=T.pop()}for(N.index++,T.push(N);T.length<=G;)T.push(O={children:[],index:0}),N.children[N.index]=O.children,N=O;y++}G+1<V&&(T.push(O={children:[],index:0}),N.children[N.index]=O.children,N=O)}return T[0].children}function L(U,S,y,T,G,z,V,N,O,D){y.precision,y.samplesPerLine,y.scanLines;var J=y.mcusPerLine,W=y.progressive;y.maxH,y.maxV;var K=S,Z=0,te=0;function de(){if(te>0)return te--,Z>>te&1;if(Z=U[S++],Z==255){var le=U[S++];if(le)throw new Error("unexpected marker: "+(Z<<8|le).toString(16))}return te=7,Z>>>7}function Ee(le){for(var ce=le,he;(he=de())!==null;){if(ce=ce[he],typeof ce=="number")return ce;if(typeof ce!="object")throw new Error("invalid huffman sequence")}return null}function pe(le){for(var ce=0;le>0;){var he=de();if(he===null)return;ce=ce<<1|he,le--}return ce}function ge(le){var ce=pe(le);return ce>=1<<le-1?ce:ce+(-1<<le)+1}function re(le,ce){var he=Ee(le.huffmanTableDC),ae=he===0?0:ge(he);ce[0]=le.pred+=ae;for(var Ae=1;Ae<64;){var l=Ee(le.huffmanTableAC),I=l&15,P=l>>4;if(I===0){if(P<15)break;Ae+=16;continue}Ae+=P;var Y=E[Ae];ce[Y]=ge(I),Ae++}}function X(le,ce){var he=Ee(le.huffmanTableDC),ae=he===0?0:ge(he)<<O;ce[0]=le.pred+=ae}function Q(le,ce){ce[0]|=de()<<O}var me=0;function ie(le,ce){if(me>0){me--;return}for(var he=z,ae=V;he<=ae;){var Ae=Ee(le.huffmanTableAC),l=Ae&15,I=Ae>>4;if(l===0){if(I<15){me=pe(I)+(1<<I)-1;break}he+=16;continue}he+=I;var P=E[he];ce[P]=ge(l)*(1<<O),he++}}var $=0,Re;function Se(le,ce){for(var he=z,ae=V,Ae=0;he<=ae;){var l=E[he],I=ce[l]<0?-1:1;switch($){case 0:var P=Ee(le.huffmanTableAC),Y=P&15,Ae=P>>4;if(Y===0)Ae<15?(me=pe(Ae)+(1<<Ae),$=4):(Ae=16,$=1);else{if(Y!==1)throw new Error("invalid ACn encoding");Re=ge(Y),$=Ae?2:3}continue;case 1:case 2:ce[l]?ce[l]+=(de()<<O)*I:(Ae--,Ae===0&&($=$==2?3:0));break;case 3:ce[l]?ce[l]+=(de()<<O)*I:(ce[l]=Re<<O,$=0);break;case 4:ce[l]&&(ce[l]+=(de()<<O)*I);break}he++}$===4&&(me--,me===0&&($=0))}function se(le,ce,he,ae,Ae){var l=he/J|0,I=he%J,P=l*le.v+ae,Y=I*le.h+Ae;le.blocks[P]===void 0&&D.tolerantDecoding||ce(le,le.blocks[P][Y])}function we(le,ce,he){var ae=he/le.blocksPerLine|0,Ae=he%le.blocksPerLine;le.blocks[ae]===void 0&&D.tolerantDecoding||ce(le,le.blocks[ae][Ae])}var oe=T.length,q,ye,fe,ee,M,_e;W?z===0?_e=N===0?X:Q:_e=N===0?ie:Se:_e=re;var ve=0,be,ke;oe==1?ke=T[0].blocksPerLine*T[0].blocksPerColumn:ke=J*y.mcusPerColumn,G||(G=ke);for(var Me,Ie;ve<ke;){for(ye=0;ye<oe;ye++)T[ye].pred=0;if(me=0,oe==1)for(q=T[0],M=0;M<G;M++)we(q,_e,ve),ve++;else for(M=0;M<G;M++){for(ye=0;ye<oe;ye++)for(q=T[ye],Me=q.h,Ie=q.v,fe=0;fe<Ie;fe++)for(ee=0;ee<Me;ee++)se(q,_e,ve,fe,ee);if(ve++,ve===ke)break}if(ve===ke)do{if(U[S]===255&&U[S+1]!==0)break;S+=1}while(S<U.length-2);if(te=0,be=U[S]<<8|U[S+1],be<65280)throw new Error("marker was not found");if(be>=65488&&be<=65495)S+=2;else break}return S-K}function B(U,S){var y=[],T=S.blocksPerLine,G=S.blocksPerColumn,z=T<<3,V=new Int32Array(64),N=new Uint8Array(64);function O(pe,ge,re){var X=S.quantizationTable,Q,me,ie,$,Re,Se,se,we,oe,q=re,ye;for(ye=0;ye<64;ye++)q[ye]=pe[ye]*X[ye];for(ye=0;ye<8;++ye){var fe=8*ye;if(q[1+fe]==0&&q[2+fe]==0&&q[3+fe]==0&&q[4+fe]==0&&q[5+fe]==0&&q[6+fe]==0&&q[7+fe]==0){oe=u*q[0+fe]+512>>10,q[0+fe]=oe,q[1+fe]=oe,q[2+fe]=oe,q[3+fe]=oe,q[4+fe]=oe,q[5+fe]=oe,q[6+fe]=oe,q[7+fe]=oe;continue}Q=u*q[0+fe]+128>>8,me=u*q[4+fe]+128>>8,ie=q[2+fe],$=q[6+fe],Re=v*(q[1+fe]-q[7+fe])+128>>8,we=v*(q[1+fe]+q[7+fe])+128>>8,Se=q[3+fe]<<4,se=q[5+fe]<<4,oe=Q-me+1>>1,Q=Q+me+1>>1,me=oe,oe=ie*x+$*m+128>>8,ie=ie*m-$*x+128>>8,$=oe,oe=Re-se+1>>1,Re=Re+se+1>>1,se=oe,oe=we+Se+1>>1,Se=we-Se+1>>1,we=oe,oe=Q-$+1>>1,Q=Q+$+1>>1,$=oe,oe=me-ie+1>>1,me=me+ie+1>>1,ie=oe,oe=Re*s+we*h+2048>>12,Re=Re*h-we*s+2048>>12,we=oe,oe=Se*n+se*t+2048>>12,Se=Se*t-se*n+2048>>12,se=oe,q[0+fe]=Q+we,q[7+fe]=Q-we,q[1+fe]=me+se,q[6+fe]=me-se,q[2+fe]=ie+Se,q[5+fe]=ie-Se,q[3+fe]=$+Re,q[4+fe]=$-Re}for(ye=0;ye<8;++ye){var ee=ye;if(q[8+ee]==0&&q[16+ee]==0&&q[24+ee]==0&&q[32+ee]==0&&q[40+ee]==0&&q[48+ee]==0&&q[56+ee]==0){oe=u*re[ye+0]+8192>>14,q[0+ee]=oe,q[8+ee]=oe,q[16+ee]=oe,q[24+ee]=oe,q[32+ee]=oe,q[40+ee]=oe,q[48+ee]=oe,q[56+ee]=oe;continue}Q=u*q[0+ee]+2048>>12,me=u*q[32+ee]+2048>>12,ie=q[16+ee],$=q[48+ee],Re=v*(q[8+ee]-q[56+ee])+2048>>12,we=v*(q[8+ee]+q[56+ee])+2048>>12,Se=q[24+ee],se=q[40+ee],oe=Q-me+1>>1,Q=Q+me+1>>1,me=oe,oe=ie*x+$*m+2048>>12,ie=ie*m-$*x+2048>>12,$=oe,oe=Re-se+1>>1,Re=Re+se+1>>1,se=oe,oe=we+Se+1>>1,Se=we-Se+1>>1,we=oe,oe=Q-$+1>>1,Q=Q+$+1>>1,$=oe,oe=me-ie+1>>1,me=me+ie+1>>1,ie=oe,oe=Re*s+we*h+2048>>12,Re=Re*h-we*s+2048>>12,we=oe,oe=Se*n+se*t+2048>>12,Se=Se*t-se*n+2048>>12,se=oe,q[0+ee]=Q+we,q[56+ee]=Q-we,q[8+ee]=me+se,q[48+ee]=me-se,q[16+ee]=ie+Se,q[40+ee]=ie-Se,q[24+ee]=$+Re,q[32+ee]=$-Re}for(ye=0;ye<64;++ye){var M=128+(q[ye]+8>>4);ge[ye]=M<0?0:M>255?255:M}}j(z*G*8);for(var D,J,W=0;W<G;W++){var K=W<<3;for(D=0;D<8;D++)y.push(new Uint8Array(z));for(var Z=0;Z<T;Z++){O(S.blocks[W][Z],N,V);var te=0,de=Z<<3;for(J=0;J<8;J++){var Ee=y[K+J];for(D=0;D<8;D++)Ee[de+D]=N[te++]}}}return y}function d(U){return U<0?0:U>255?255:U}b.prototype={load:function(S){var y=new XMLHttpRequest;y.open("GET",S,!0),y.responseType="arraybuffer",y.onload=(function(){var T=new Uint8Array(y.response||y.mozResponseArrayBuffer);this.parse(T),this.onload&&this.onload()}).bind(this),y.send(null)},parse:function(S){var y=this.opts.maxResolutionInMP*1e3*1e3,T=0;S.length;function G(){var I=S[T]<<8|S[T+1];return T+=2,I}function z(){var I=G(),P=S.subarray(T,T+I-2);return T+=P.length,P}function V(I){var P=1,Y=1,p,F;for(F in I.components)I.components.hasOwnProperty(F)&&(p=I.components[F],P<p.h&&(P=p.h),Y<p.v&&(Y=p.v));var a=Math.ceil(I.samplesPerLine/8/P),H=Math.ceil(I.scanLines/8/Y);for(F in I.components)if(I.components.hasOwnProperty(F)){p=I.components[F];var Te=Math.ceil(Math.ceil(I.samplesPerLine/8)*p.h/P),e=Math.ceil(Math.ceil(I.scanLines/8)*p.v/Y),R=a*p.h,C=H*p.v,o=C*R,_=[];j(o*256);for(var k=0;k<C;k++){for(var xe=[],ne=0;ne<R;ne++)xe.push(new Int32Array(64));_.push(xe)}p.blocksPerLine=Te,p.blocksPerColumn=e,p.blocks=_}I.maxH=P,I.maxV=Y,I.mcusPerLine=a,I.mcusPerColumn=H}var N=null,O=null,D,J,W=[],K=[],Z=[],te=[],de=G(),Ee=-1;if(this.comments=[],de!=65496)throw new Error("SOI not found");for(de=G();de!=65497;){var pe,ge;switch(de){case 65280:break;case 65504:case 65505:case 65506:case 65507:case 65508:case 65509:case 65510:case 65511:case 65512:case 65513:case 65514:case 65515:case 65516:case 65517:case 65518:case 65519:case 65534:var re=z();if(de===65534){var X=String.fromCharCode.apply(null,re);this.comments.push(X)}de===65504&&re[0]===74&&re[1]===70&&re[2]===73&&re[3]===70&&re[4]===0&&(N={version:{major:re[5],minor:re[6]},densityUnits:re[7],xDensity:re[8]<<8|re[9],yDensity:re[10]<<8|re[11],thumbWidth:re[12],thumbHeight:re[13],thumbData:re.subarray(14,14+3*re[12]*re[13])}),de===65505&&re[0]===69&&re[1]===120&&re[2]===105&&re[3]===102&&re[4]===0&&(this.exifBuffer=re.subarray(5,re.length)),de===65518&&re[0]===65&&re[1]===100&&re[2]===111&&re[3]===98&&re[4]===101&&re[5]===0&&(O={version:re[6],flags0:re[7]<<8|re[8],flags1:re[9]<<8|re[10],transformCode:re[11]});break;case 65499:for(var Q=G(),me=Q+T-2;T<me;){var ie=S[T++];j(256);var $=new Int32Array(64);if(ie>>4===0)for(ge=0;ge<64;ge++){var Re=E[ge];$[Re]=S[T++]}else if(ie>>4===1)for(ge=0;ge<64;ge++){var Re=E[ge];$[Re]=G()}else throw new Error("DQT: invalid table spec");W[ie&15]=$}break;case 65472:case 65473:case 65474:G(),D={},D.extended=de===65473,D.progressive=de===65474,D.precision=S[T++],D.scanLines=G(),D.samplesPerLine=G(),D.components={},D.componentsOrder=[];var Se=D.scanLines*D.samplesPerLine;if(Se>y){var se=Math.ceil((Se-y)/1e6);throw new Error(`maxResolutionInMP limit exceeded by ${se}MP`)}var we=S[T++],oe;for(pe=0;pe<we;pe++){oe=S[T];var q=S[T+1]>>4,ye=S[T+1]&15,fe=S[T+2];if(q<=0||ye<=0)throw new Error("Invalid sampling factor, expected values above 0");D.componentsOrder.push(oe),D.components[oe]={h:q,v:ye,quantizationIdx:fe},T+=3}V(D),K.push(D);break;case 65476:var ee=G();for(pe=2;pe<ee;){var M=S[T++],_e=new Uint8Array(16),ve=0;for(ge=0;ge<16;ge++,T++)ve+=_e[ge]=S[T];j(16+ve);var be=new Uint8Array(ve);for(ge=0;ge<ve;ge++,T++)be[ge]=S[T];pe+=17+ve,(M>>4===0?te:Z)[M&15]=c(_e,be)}break;case 65501:G(),J=G();break;case 65500:G(),G();break;case 65498:G();var ke=S[T++],Me=[],Ie;for(pe=0;pe<ke;pe++){Ie=D.components[S[T++]];var le=S[T++];Ie.huffmanTableDC=te[le>>4],Ie.huffmanTableAC=Z[le&15],Me.push(Ie)}var ce=S[T++],he=S[T++],ae=S[T++],Ae=L(S,T,D,Me,J,ce,he,ae>>4,ae&15,this.opts);T+=Ae;break;case 65535:S[T]!==255&&T--;break;default:if(S[T-3]==255&&S[T-2]>=192&&S[T-2]<=254){T-=3;break}else if(de===224||de==225){if(Ee!==-1)throw new Error(`first unknown JPEG marker at offset ${Ee.toString(16)}, second unknown JPEG marker ${de.toString(16)} at offset ${(T-1).toString(16)}`);Ee=T-1;const I=G();if(S[T+I-2]===255){T+=I-2;break}}throw new Error("unknown JPEG marker "+de.toString(16))}de=G()}if(K.length!=1)throw new Error("only single frame JPEGs supported");for(var pe=0;pe<K.length;pe++){var l=K[pe].components;for(var ge in l)l[ge].quantizationTable=W[l[ge].quantizationIdx],delete l[ge].quantizationIdx}this.width=D.samplesPerLine,this.height=D.scanLines,this.jfif=N,this.adobe=O,this.components=[];for(var pe=0;pe<D.componentsOrder.length;pe++){var Ie=D.components[D.componentsOrder[pe]];this.components.push({lines:B(D,Ie),scaleX:Ie.h/D.maxH,scaleY:Ie.v/D.maxV})}},getData:function(S,y){var T=this.width/S,G=this.height/y,z,V,N,O,D,J,W,K,Z,te,de=0,Ee,pe,ge,re,X,Q,me,ie,$,Re,Se,se=S*y*this.components.length;j(se);var we=new Uint8Array(se);switch(this.components.length){case 1:for(z=this.components[0],te=0;te<y;te++)for(D=z.lines[0|te*z.scaleY*G],Z=0;Z<S;Z++)Ee=D[0|Z*z.scaleX*T],we[de++]=Ee;break;case 2:for(z=this.components[0],V=this.components[1],te=0;te<y;te++)for(D=z.lines[0|te*z.scaleY*G],J=V.lines[0|te*V.scaleY*G],Z=0;Z<S;Z++)Ee=D[0|Z*z.scaleX*T],we[de++]=Ee,Ee=J[0|Z*V.scaleX*T],we[de++]=Ee;break;case 3:for(Se=!0,this.adobe&&this.adobe.transformCode?Se=!0:typeof this.opts.colorTransform<"u"&&(Se=!!this.opts.colorTransform),z=this.components[0],V=this.components[1],N=this.components[2],te=0;te<y;te++)for(D=z.lines[0|te*z.scaleY*G],J=V.lines[0|te*V.scaleY*G],W=N.lines[0|te*N.scaleY*G],Z=0;Z<S;Z++)Se?(Ee=D[0|Z*z.scaleX*T],pe=J[0|Z*V.scaleX*T],ge=W[0|Z*N.scaleX*T],ie=d(Ee+1.402*(ge-128)),$=d(Ee-.3441363*(pe-128)-.71413636*(ge-128)),Re=d(Ee+1.772*(pe-128))):(ie=D[0|Z*z.scaleX*T],$=J[0|Z*V.scaleX*T],Re=W[0|Z*N.scaleX*T]),we[de++]=ie,we[de++]=$,we[de++]=Re;break;case 4:if(!this.adobe)throw new Error("Unsupported color mode (4 components)");for(Se=!1,this.adobe&&this.adobe.transformCode?Se=!0:typeof this.opts.colorTransform<"u"&&(Se=!!this.opts.colorTransform),z=this.components[0],V=this.components[1],N=this.components[2],O=this.components[3],te=0;te<y;te++)for(D=z.lines[0|te*z.scaleY*G],J=V.lines[0|te*V.scaleY*G],W=N.lines[0|te*N.scaleY*G],K=O.lines[0|te*O.scaleY*G],Z=0;Z<S;Z++)Se?(Ee=D[0|Z*z.scaleX*T],pe=J[0|Z*V.scaleX*T],ge=W[0|Z*N.scaleX*T],re=K[0|Z*O.scaleX*T],X=255-d(Ee+1.402*(ge-128)),Q=255-d(Ee-.3441363*(pe-128)-.71413636*(ge-128)),me=255-d(Ee+1.772*(pe-128))):(X=D[0|Z*z.scaleX*T],Q=J[0|Z*V.scaleX*T],me=W[0|Z*N.scaleX*T],re=K[0|Z*O.scaleX*T]),we[de++]=255-X,we[de++]=255-Q,we[de++]=255-me,we[de++]=255-re;break;default:throw new Error("Unsupported color mode")}return we},copyToImageData:function(S,y){var T=S.width,G=S.height,z=S.data,V=this.getData(T,G),N=0,O=0,D,J,W,K,Z,te,de,Ee,pe;switch(this.components.length){case 1:for(J=0;J<G;J++)for(D=0;D<T;D++)W=V[N++],z[O++]=W,z[O++]=W,z[O++]=W,y&&(z[O++]=255);break;case 3:for(J=0;J<G;J++)for(D=0;D<T;D++)de=V[N++],Ee=V[N++],pe=V[N++],z[O++]=de,z[O++]=Ee,z[O++]=pe,y&&(z[O++]=255);break;case 4:for(J=0;J<G;J++)for(D=0;D<T;D++)Z=V[N++],te=V[N++],W=V[N++],K=V[N++],de=255-d(Z*(1-K/255)+K),Ee=255-d(te*(1-K/255)+K),pe=255-d(W*(1-K/255)+K),z[O++]=de,z[O++]=Ee,z[O++]=pe,y&&(z[O++]=255);break;default:throw new Error("Unsupported color mode")}}};var g=0,A=0;function j(U=0){var S=g+U;if(S>A){var y=Math.ceil((S-A)/1024/1024);throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${y}MB`)}g=S}return b.resetMaxMemoryUsage=function(U){g=0,A=U},b.getBytesAllocated=function(){return g},b.requestMemoryAllocation=j,b})();w.exports=f;function f(i,E={}){var t={colorTransform:void 0,useTArray:!1,formatAsRGBA:!0,tolerantDecoding:!0,maxResolutionInMP:100,maxMemoryUsageInMB:512},n={...t,...E},h=new Uint8Array(i),s=new r;s.opts=n,r.resetMaxMemoryUsage(n.maxMemoryUsageInMB*1024*1024),s.parse(h);var m=n.formatAsRGBA?4:3,x=s.width*s.height*m;try{r.requestMemoryAllocation(x);var u={width:s.width,height:s.height,exifBuffer:s.exifBuffer,data:n.useTArray?new Uint8Array(x):Buffer.alloc(x)};s.comments.length>0&&(u.comments=s.comments)}catch(v){throw v instanceof RangeError?new Error("Could not allocate enough memory for the image. Required: "+x):v instanceof ReferenceError&&v.message==="Buffer is not defined"?new Error("Buffer is not globally defined in this environment. Consider setting useTArray to true"):v}return s.copyToImageData(u,n.formatAsRGBA),u}})(br)),br.exports}var wr,rt;function $t(){if(rt)return wr;rt=1;var w=Kt(),r=Wt();return wr={encode:w,decode:r},wr}$t();function Jt(w){throw new Error('Could not dynamically require "'+w+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Tr={exports:{}},yr={},tt;function $e(){return tt||(tt=1,(function(w){var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";function f(t,n){return Object.prototype.hasOwnProperty.call(t,n)}w.assign=function(t){for(var n=Array.prototype.slice.call(arguments,1);n.length;){var h=n.shift();if(h){if(typeof h!="object")throw new TypeError(h+"must be non-object");for(var s in h)f(h,s)&&(t[s]=h[s])}}return t},w.shrinkBuf=function(t,n){return t.length===n?t:t.subarray?t.subarray(0,n):(t.length=n,t)};var i={arraySet:function(t,n,h,s,m){if(n.subarray&&t.subarray){t.set(n.subarray(h,h+s),m);return}for(var x=0;x<s;x++)t[m+x]=n[h+x]},flattenChunks:function(t){var n,h,s,m,x,u;for(s=0,n=0,h=t.length;n<h;n++)s+=t[n].length;for(u=new Uint8Array(s),m=0,n=0,h=t.length;n<h;n++)x=t[n],u.set(x,m),m+=x.length;return u}},E={arraySet:function(t,n,h,s,m){for(var x=0;x<s;x++)t[m+x]=n[h+x]},flattenChunks:function(t){return[].concat.apply([],t)}};w.setTyped=function(t){t?(w.Buf8=Uint8Array,w.Buf16=Uint16Array,w.Buf32=Int32Array,w.assign(w,i)):(w.Buf8=Array,w.Buf16=Array,w.Buf32=Array,w.assign(w,E))},w.setTyped(r)})(yr)),yr}var sr={},Xe={},rr={},nt;function Qt(){if(nt)return rr;nt=1;var w=$e(),r=4,f=0,i=1,E=2;function t(l){for(var I=l.length;--I>=0;)l[I]=0}var n=0,h=1,s=2,m=3,x=258,u=29,v=256,b=v+1+u,c=30,L=19,B=2*b+1,d=15,g=16,A=7,j=256,U=16,S=17,y=18,T=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],G=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],z=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],V=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],N=512,O=new Array((b+2)*2);t(O);var D=new Array(c*2);t(D);var J=new Array(N);t(J);var W=new Array(x-m+1);t(W);var K=new Array(u);t(K);var Z=new Array(c);t(Z);function te(l,I,P,Y,p){this.static_tree=l,this.extra_bits=I,this.extra_base=P,this.elems=Y,this.max_length=p,this.has_stree=l&&l.length}var de,Ee,pe;function ge(l,I){this.dyn_tree=l,this.max_code=0,this.stat_desc=I}function re(l){return l<256?J[l]:J[256+(l>>>7)]}function X(l,I){l.pending_buf[l.pending++]=I&255,l.pending_buf[l.pending++]=I>>>8&255}function Q(l,I,P){l.bi_valid>g-P?(l.bi_buf|=I<<l.bi_valid&65535,X(l,l.bi_buf),l.bi_buf=I>>g-l.bi_valid,l.bi_valid+=P-g):(l.bi_buf|=I<<l.bi_valid&65535,l.bi_valid+=P)}function me(l,I,P){Q(l,P[I*2],P[I*2+1])}function ie(l,I){var P=0;do P|=l&1,l>>>=1,P<<=1;while(--I>0);return P>>>1}function $(l){l.bi_valid===16?(X(l,l.bi_buf),l.bi_buf=0,l.bi_valid=0):l.bi_valid>=8&&(l.pending_buf[l.pending++]=l.bi_buf&255,l.bi_buf>>=8,l.bi_valid-=8)}function Re(l,I){var P=I.dyn_tree,Y=I.max_code,p=I.stat_desc.static_tree,F=I.stat_desc.has_stree,a=I.stat_desc.extra_bits,H=I.stat_desc.extra_base,Te=I.stat_desc.max_length,e,R,C,o,_,k,xe=0;for(o=0;o<=d;o++)l.bl_count[o]=0;for(P[l.heap[l.heap_max]*2+1]=0,e=l.heap_max+1;e<B;e++)R=l.heap[e],o=P[P[R*2+1]*2+1]+1,o>Te&&(o=Te,xe++),P[R*2+1]=o,!(R>Y)&&(l.bl_count[o]++,_=0,R>=H&&(_=a[R-H]),k=P[R*2],l.opt_len+=k*(o+_),F&&(l.static_len+=k*(p[R*2+1]+_)));if(xe!==0){do{for(o=Te-1;l.bl_count[o]===0;)o--;l.bl_count[o]--,l.bl_count[o+1]+=2,l.bl_count[Te]--,xe-=2}while(xe>0);for(o=Te;o!==0;o--)for(R=l.bl_count[o];R!==0;)C=l.heap[--e],!(C>Y)&&(P[C*2+1]!==o&&(l.opt_len+=(o-P[C*2+1])*P[C*2],P[C*2+1]=o),R--)}}function Se(l,I,P){var Y=new Array(d+1),p=0,F,a;for(F=1;F<=d;F++)Y[F]=p=p+P[F-1]<<1;for(a=0;a<=I;a++){var H=l[a*2+1];H!==0&&(l[a*2]=ie(Y[H]++,H))}}function se(){var l,I,P,Y,p,F=new Array(d+1);for(P=0,Y=0;Y<u-1;Y++)for(K[Y]=P,l=0;l<1<<T[Y];l++)W[P++]=Y;for(W[P-1]=Y,p=0,Y=0;Y<16;Y++)for(Z[Y]=p,l=0;l<1<<G[Y];l++)J[p++]=Y;for(p>>=7;Y<c;Y++)for(Z[Y]=p<<7,l=0;l<1<<G[Y]-7;l++)J[256+p++]=Y;for(I=0;I<=d;I++)F[I]=0;for(l=0;l<=143;)O[l*2+1]=8,l++,F[8]++;for(;l<=255;)O[l*2+1]=9,l++,F[9]++;for(;l<=279;)O[l*2+1]=7,l++,F[7]++;for(;l<=287;)O[l*2+1]=8,l++,F[8]++;for(Se(O,b+1,F),l=0;l<c;l++)D[l*2+1]=5,D[l*2]=ie(l,5);de=new te(O,T,v+1,b,d),Ee=new te(D,G,0,c,d),pe=new te(new Array(0),z,0,L,A)}function we(l){var I;for(I=0;I<b;I++)l.dyn_ltree[I*2]=0;for(I=0;I<c;I++)l.dyn_dtree[I*2]=0;for(I=0;I<L;I++)l.bl_tree[I*2]=0;l.dyn_ltree[j*2]=1,l.opt_len=l.static_len=0,l.last_lit=l.matches=0}function oe(l){l.bi_valid>8?X(l,l.bi_buf):l.bi_valid>0&&(l.pending_buf[l.pending++]=l.bi_buf),l.bi_buf=0,l.bi_valid=0}function q(l,I,P,Y){oe(l),X(l,P),X(l,~P),w.arraySet(l.pending_buf,l.window,I,P,l.pending),l.pending+=P}function ye(l,I,P,Y){var p=I*2,F=P*2;return l[p]<l[F]||l[p]===l[F]&&Y[I]<=Y[P]}function fe(l,I,P){for(var Y=l.heap[P],p=P<<1;p<=l.heap_len&&(p<l.heap_len&&ye(I,l.heap[p+1],l.heap[p],l.depth)&&p++,!ye(I,Y,l.heap[p],l.depth));)l.heap[P]=l.heap[p],P=p,p<<=1;l.heap[P]=Y}function ee(l,I,P){var Y,p,F=0,a,H;if(l.last_lit!==0)do Y=l.pending_buf[l.d_buf+F*2]<<8|l.pending_buf[l.d_buf+F*2+1],p=l.pending_buf[l.l_buf+F],F++,Y===0?me(l,p,I):(a=W[p],me(l,a+v+1,I),H=T[a],H!==0&&(p-=K[a],Q(l,p,H)),Y--,a=re(Y),me(l,a,P),H=G[a],H!==0&&(Y-=Z[a],Q(l,Y,H)));while(F<l.last_lit);me(l,j,I)}function M(l,I){var P=I.dyn_tree,Y=I.stat_desc.static_tree,p=I.stat_desc.has_stree,F=I.stat_desc.elems,a,H,Te=-1,e;for(l.heap_len=0,l.heap_max=B,a=0;a<F;a++)P[a*2]!==0?(l.heap[++l.heap_len]=Te=a,l.depth[a]=0):P[a*2+1]=0;for(;l.heap_len<2;)e=l.heap[++l.heap_len]=Te<2?++Te:0,P[e*2]=1,l.depth[e]=0,l.opt_len--,p&&(l.static_len-=Y[e*2+1]);for(I.max_code=Te,a=l.heap_len>>1;a>=1;a--)fe(l,P,a);e=F;do a=l.heap[1],l.heap[1]=l.heap[l.heap_len--],fe(l,P,1),H=l.heap[1],l.heap[--l.heap_max]=a,l.heap[--l.heap_max]=H,P[e*2]=P[a*2]+P[H*2],l.depth[e]=(l.depth[a]>=l.depth[H]?l.depth[a]:l.depth[H])+1,P[a*2+1]=P[H*2+1]=e,l.heap[1]=e++,fe(l,P,1);while(l.heap_len>=2);l.heap[--l.heap_max]=l.heap[1],Re(l,I),Se(P,Te,l.bl_count)}function _e(l,I,P){var Y,p=-1,F,a=I[1],H=0,Te=7,e=4;for(a===0&&(Te=138,e=3),I[(P+1)*2+1]=65535,Y=0;Y<=P;Y++)F=a,a=I[(Y+1)*2+1],!(++H<Te&&F===a)&&(H<e?l.bl_tree[F*2]+=H:F!==0?(F!==p&&l.bl_tree[F*2]++,l.bl_tree[U*2]++):H<=10?l.bl_tree[S*2]++:l.bl_tree[y*2]++,H=0,p=F,a===0?(Te=138,e=3):F===a?(Te=6,e=3):(Te=7,e=4))}function ve(l,I,P){var Y,p=-1,F,a=I[1],H=0,Te=7,e=4;for(a===0&&(Te=138,e=3),Y=0;Y<=P;Y++)if(F=a,a=I[(Y+1)*2+1],!(++H<Te&&F===a)){if(H<e)do me(l,F,l.bl_tree);while(--H!==0);else F!==0?(F!==p&&(me(l,F,l.bl_tree),H--),me(l,U,l.bl_tree),Q(l,H-3,2)):H<=10?(me(l,S,l.bl_tree),Q(l,H-3,3)):(me(l,y,l.bl_tree),Q(l,H-11,7));H=0,p=F,a===0?(Te=138,e=3):F===a?(Te=6,e=3):(Te=7,e=4)}}function be(l){var I;for(_e(l,l.dyn_ltree,l.l_desc.max_code),_e(l,l.dyn_dtree,l.d_desc.max_code),M(l,l.bl_desc),I=L-1;I>=3&&l.bl_tree[V[I]*2+1]===0;I--);return l.opt_len+=3*(I+1)+5+5+4,I}function ke(l,I,P,Y){var p;for(Q(l,I-257,5),Q(l,P-1,5),Q(l,Y-4,4),p=0;p<Y;p++)Q(l,l.bl_tree[V[p]*2+1],3);ve(l,l.dyn_ltree,I-1),ve(l,l.dyn_dtree,P-1)}function Me(l){var I=4093624447,P;for(P=0;P<=31;P++,I>>>=1)if(I&1&&l.dyn_ltree[P*2]!==0)return f;if(l.dyn_ltree[18]!==0||l.dyn_ltree[20]!==0||l.dyn_ltree[26]!==0)return i;for(P=32;P<v;P++)if(l.dyn_ltree[P*2]!==0)return i;return f}var Ie=!1;function le(l){Ie||(se(),Ie=!0),l.l_desc=new ge(l.dyn_ltree,de),l.d_desc=new ge(l.dyn_dtree,Ee),l.bl_desc=new ge(l.bl_tree,pe),l.bi_buf=0,l.bi_valid=0,we(l)}function ce(l,I,P,Y){Q(l,(n<<1)+(Y?1:0),3),q(l,I,P)}function he(l){Q(l,h<<1,3),me(l,j,O),$(l)}function ae(l,I,P,Y){var p,F,a=0;l.level>0?(l.strm.data_type===E&&(l.strm.data_type=Me(l)),M(l,l.l_desc),M(l,l.d_desc),a=be(l),p=l.opt_len+3+7>>>3,F=l.static_len+3+7>>>3,F<=p&&(p=F)):p=F=P+5,P+4<=p&&I!==-1?ce(l,I,P,Y):l.strategy===r||F===p?(Q(l,(h<<1)+(Y?1:0),3),ee(l,O,D)):(Q(l,(s<<1)+(Y?1:0),3),ke(l,l.l_desc.max_code+1,l.d_desc.max_code+1,a+1),ee(l,l.dyn_ltree,l.dyn_dtree)),we(l),Y&&oe(l)}function Ae(l,I,P){return l.pending_buf[l.d_buf+l.last_lit*2]=I>>>8&255,l.pending_buf[l.d_buf+l.last_lit*2+1]=I&255,l.pending_buf[l.l_buf+l.last_lit]=P&255,l.last_lit++,I===0?l.dyn_ltree[P*2]++:(l.matches++,I--,l.dyn_ltree[(W[P]+v+1)*2]++,l.dyn_dtree[re(I)*2]++),l.last_lit===l.lit_bufsize-1}return rr._tr_init=le,rr._tr_stored_block=ce,rr._tr_flush_block=ae,rr._tr_tally=Ae,rr._tr_align=he,rr}var Er,at;function St(){if(at)return Er;at=1;function w(r,f,i,E){for(var t=r&65535|0,n=r>>>16&65535|0,h=0;i!==0;){h=i>2e3?2e3:i,i-=h;do t=t+f[E++]|0,n=n+t|0;while(--h);t%=65521,n%=65521}return t|n<<16|0}return Er=w,Er}var Sr,it;function At(){if(it)return Sr;it=1;function w(){for(var i,E=[],t=0;t<256;t++){i=t;for(var n=0;n<8;n++)i=i&1?3988292384^i>>>1:i>>>1;E[t]=i}return E}var r=w();function f(i,E,t,n){var h=r,s=n+t;i^=-1;for(var m=n;m<s;m++)i=i>>>8^h[(i^E[m])&255];return i^-1}return Sr=f,Sr}var Ar,st;function zr(){return st||(st=1,Ar={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}),Ar}var ot;function en(){if(ot)return Xe;ot=1;var w=$e(),r=Qt(),f=St(),i=At(),E=zr(),t=0,n=1,h=3,s=4,m=5,x=0,u=1,v=-2,b=-3,c=-5,L=-1,B=1,d=2,g=3,A=4,j=0,U=2,S=8,y=9,T=15,G=8,z=29,V=256,N=V+1+z,O=30,D=19,J=2*N+1,W=15,K=3,Z=258,te=Z+K+1,de=32,Ee=42,pe=69,ge=73,re=91,X=103,Q=113,me=666,ie=1,$=2,Re=3,Se=4,se=3;function we(e,R){return e.msg=E[R],R}function oe(e){return(e<<1)-(e>4?9:0)}function q(e){for(var R=e.length;--R>=0;)e[R]=0}function ye(e){var R=e.state,C=R.pending;C>e.avail_out&&(C=e.avail_out),C!==0&&(w.arraySet(e.output,R.pending_buf,R.pending_out,C,e.next_out),e.next_out+=C,R.pending_out+=C,e.total_out+=C,e.avail_out-=C,R.pending-=C,R.pending===0&&(R.pending_out=0))}function fe(e,R){r._tr_flush_block(e,e.block_start>=0?e.block_start:-1,e.strstart-e.block_start,R),e.block_start=e.strstart,ye(e.strm)}function ee(e,R){e.pending_buf[e.pending++]=R}function M(e,R){e.pending_buf[e.pending++]=R>>>8&255,e.pending_buf[e.pending++]=R&255}function _e(e,R,C,o){var _=e.avail_in;return _>o&&(_=o),_===0?0:(e.avail_in-=_,w.arraySet(R,e.input,e.next_in,_,C),e.state.wrap===1?e.adler=f(e.adler,R,_,C):e.state.wrap===2&&(e.adler=i(e.adler,R,_,C)),e.next_in+=_,e.total_in+=_,_)}function ve(e,R){var C=e.max_chain_length,o=e.strstart,_,k,xe=e.prev_length,ne=e.nice_match,ue=e.strstart>e.w_size-te?e.strstart-(e.w_size-te):0,Fe=e.window,He=e.w_mask,Be=e.prev,Ce=e.strstart+Z,Le=Fe[o+xe-1],Ne=Fe[o+xe];e.prev_length>=e.good_match&&(C>>=2),ne>e.lookahead&&(ne=e.lookahead);do if(_=R,!(Fe[_+xe]!==Ne||Fe[_+xe-1]!==Le||Fe[_]!==Fe[o]||Fe[++_]!==Fe[o+1])){o+=2,_++;do;while(Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&o<Ce);if(k=Z-(Ce-o),o=Ce-Z,k>xe){if(e.match_start=R,xe=k,k>=ne)break;Le=Fe[o+xe-1],Ne=Fe[o+xe]}}while((R=Be[R&He])>ue&&--C!==0);return xe<=e.lookahead?xe:e.lookahead}function be(e){var R=e.w_size,C,o,_,k,xe;do{if(k=e.window_size-e.lookahead-e.strstart,e.strstart>=R+(R-te)){w.arraySet(e.window,e.window,R,R,0),e.match_start-=R,e.strstart-=R,e.block_start-=R,o=e.hash_size,C=o;do _=e.head[--C],e.head[C]=_>=R?_-R:0;while(--o);o=R,C=o;do _=e.prev[--C],e.prev[C]=_>=R?_-R:0;while(--o);k+=R}if(e.strm.avail_in===0)break;if(o=_e(e.strm,e.window,e.strstart+e.lookahead,k),e.lookahead+=o,e.lookahead+e.insert>=K)for(xe=e.strstart-e.insert,e.ins_h=e.window[xe],e.ins_h=(e.ins_h<<e.hash_shift^e.window[xe+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[xe+K-1])&e.hash_mask,e.prev[xe&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=xe,xe++,e.insert--,!(e.lookahead+e.insert<K)););}while(e.lookahead<te&&e.strm.avail_in!==0)}function ke(e,R){var C=65535;for(C>e.pending_buf_size-5&&(C=e.pending_buf_size-5);;){if(e.lookahead<=1){if(be(e),e.lookahead===0&&R===t)return ie;if(e.lookahead===0)break}e.strstart+=e.lookahead,e.lookahead=0;var o=e.block_start+C;if((e.strstart===0||e.strstart>=o)&&(e.lookahead=e.strstart-o,e.strstart=o,fe(e,!1),e.strm.avail_out===0)||e.strstart-e.block_start>=e.w_size-te&&(fe(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,R===s?(fe(e,!0),e.strm.avail_out===0?Re:Se):(e.strstart>e.block_start&&(fe(e,!1),e.strm.avail_out===0),ie)}function Me(e,R){for(var C,o;;){if(e.lookahead<te){if(be(e),e.lookahead<te&&R===t)return ie;if(e.lookahead===0)break}if(C=0,e.lookahead>=K&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,C=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),C!==0&&e.strstart-C<=e.w_size-te&&(e.match_length=ve(e,C)),e.match_length>=K)if(o=r._tr_tally(e,e.strstart-e.match_start,e.match_length-K),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=K){e.match_length--;do e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,C=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart;while(--e.match_length!==0);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else o=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(o&&(fe(e,!1),e.strm.avail_out===0))return ie}return e.insert=e.strstart<K-1?e.strstart:K-1,R===s?(fe(e,!0),e.strm.avail_out===0?Re:Se):e.last_lit&&(fe(e,!1),e.strm.avail_out===0)?ie:$}function Ie(e,R){for(var C,o,_;;){if(e.lookahead<te){if(be(e),e.lookahead<te&&R===t)return ie;if(e.lookahead===0)break}if(C=0,e.lookahead>=K&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,C=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=K-1,C!==0&&e.prev_length<e.max_lazy_match&&e.strstart-C<=e.w_size-te&&(e.match_length=ve(e,C),e.match_length<=5&&(e.strategy===B||e.match_length===K&&e.strstart-e.match_start>4096)&&(e.match_length=K-1)),e.prev_length>=K&&e.match_length<=e.prev_length){_=e.strstart+e.lookahead-K,o=r._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-K),e.lookahead-=e.prev_length-1,e.prev_length-=2;do++e.strstart<=_&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,C=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart);while(--e.prev_length!==0);if(e.match_available=0,e.match_length=K-1,e.strstart++,o&&(fe(e,!1),e.strm.avail_out===0))return ie}else if(e.match_available){if(o=r._tr_tally(e,0,e.window[e.strstart-1]),o&&fe(e,!1),e.strstart++,e.lookahead--,e.strm.avail_out===0)return ie}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(o=r._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<K-1?e.strstart:K-1,R===s?(fe(e,!0),e.strm.avail_out===0?Re:Se):e.last_lit&&(fe(e,!1),e.strm.avail_out===0)?ie:$}function le(e,R){for(var C,o,_,k,xe=e.window;;){if(e.lookahead<=Z){if(be(e),e.lookahead<=Z&&R===t)return ie;if(e.lookahead===0)break}if(e.match_length=0,e.lookahead>=K&&e.strstart>0&&(_=e.strstart-1,o=xe[_],o===xe[++_]&&o===xe[++_]&&o===xe[++_])){k=e.strstart+Z;do;while(o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&_<k);e.match_length=Z-(k-_),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=K?(C=r._tr_tally(e,1,e.match_length-K),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(C=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),C&&(fe(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,R===s?(fe(e,!0),e.strm.avail_out===0?Re:Se):e.last_lit&&(fe(e,!1),e.strm.avail_out===0)?ie:$}function ce(e,R){for(var C;;){if(e.lookahead===0&&(be(e),e.lookahead===0)){if(R===t)return ie;break}if(e.match_length=0,C=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,C&&(fe(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,R===s?(fe(e,!0),e.strm.avail_out===0?Re:Se):e.last_lit&&(fe(e,!1),e.strm.avail_out===0)?ie:$}function he(e,R,C,o,_){this.good_length=e,this.max_lazy=R,this.nice_length=C,this.max_chain=o,this.func=_}var ae;ae=[new he(0,0,0,0,ke),new he(4,4,8,4,Me),new he(4,5,16,8,Me),new he(4,6,32,32,Me),new he(4,4,16,16,Ie),new he(8,16,32,32,Ie),new he(8,16,128,128,Ie),new he(8,32,128,256,Ie),new he(32,128,258,1024,Ie),new he(32,258,258,4096,Ie)];function Ae(e){e.window_size=2*e.w_size,q(e.head),e.max_lazy_match=ae[e.level].max_lazy,e.good_match=ae[e.level].good_length,e.nice_match=ae[e.level].nice_length,e.max_chain_length=ae[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=K-1,e.match_available=0,e.ins_h=0}function l(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=S,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new w.Buf16(J*2),this.dyn_dtree=new w.Buf16((2*O+1)*2),this.bl_tree=new w.Buf16((2*D+1)*2),q(this.dyn_ltree),q(this.dyn_dtree),q(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new w.Buf16(W+1),this.heap=new w.Buf16(2*N+1),q(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new w.Buf16(2*N+1),q(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function I(e){var R;return!e||!e.state?we(e,v):(e.total_in=e.total_out=0,e.data_type=U,R=e.state,R.pending=0,R.pending_out=0,R.wrap<0&&(R.wrap=-R.wrap),R.status=R.wrap?Ee:Q,e.adler=R.wrap===2?0:1,R.last_flush=t,r._tr_init(R),x)}function P(e){var R=I(e);return R===x&&Ae(e.state),R}function Y(e,R){return!e||!e.state||e.state.wrap!==2?v:(e.state.gzhead=R,x)}function p(e,R,C,o,_,k){if(!e)return v;var xe=1;if(R===L&&(R=6),o<0?(xe=0,o=-o):o>15&&(xe=2,o-=16),_<1||_>y||C!==S||o<8||o>15||R<0||R>9||k<0||k>A)return we(e,v);o===8&&(o=9);var ne=new l;return e.state=ne,ne.strm=e,ne.wrap=xe,ne.gzhead=null,ne.w_bits=o,ne.w_size=1<<ne.w_bits,ne.w_mask=ne.w_size-1,ne.hash_bits=_+7,ne.hash_size=1<<ne.hash_bits,ne.hash_mask=ne.hash_size-1,ne.hash_shift=~~((ne.hash_bits+K-1)/K),ne.window=new w.Buf8(ne.w_size*2),ne.head=new w.Buf16(ne.hash_size),ne.prev=new w.Buf16(ne.w_size),ne.lit_bufsize=1<<_+6,ne.pending_buf_size=ne.lit_bufsize*4,ne.pending_buf=new w.Buf8(ne.pending_buf_size),ne.d_buf=1*ne.lit_bufsize,ne.l_buf=3*ne.lit_bufsize,ne.level=R,ne.strategy=k,ne.method=C,P(e)}function F(e,R){return p(e,R,S,T,G,j)}function a(e,R){var C,o,_,k;if(!e||!e.state||R>m||R<0)return e?we(e,v):v;if(o=e.state,!e.output||!e.input&&e.avail_in!==0||o.status===me&&R!==s)return we(e,e.avail_out===0?c:v);if(o.strm=e,C=o.last_flush,o.last_flush=R,o.status===Ee)if(o.wrap===2)e.adler=0,ee(o,31),ee(o,139),ee(o,8),o.gzhead?(ee(o,(o.gzhead.text?1:0)+(o.gzhead.hcrc?2:0)+(o.gzhead.extra?4:0)+(o.gzhead.name?8:0)+(o.gzhead.comment?16:0)),ee(o,o.gzhead.time&255),ee(o,o.gzhead.time>>8&255),ee(o,o.gzhead.time>>16&255),ee(o,o.gzhead.time>>24&255),ee(o,o.level===9?2:o.strategy>=d||o.level<2?4:0),ee(o,o.gzhead.os&255),o.gzhead.extra&&o.gzhead.extra.length&&(ee(o,o.gzhead.extra.length&255),ee(o,o.gzhead.extra.length>>8&255)),o.gzhead.hcrc&&(e.adler=i(e.adler,o.pending_buf,o.pending,0)),o.gzindex=0,o.status=pe):(ee(o,0),ee(o,0),ee(o,0),ee(o,0),ee(o,0),ee(o,o.level===9?2:o.strategy>=d||o.level<2?4:0),ee(o,se),o.status=Q);else{var xe=S+(o.w_bits-8<<4)<<8,ne=-1;o.strategy>=d||o.level<2?ne=0:o.level<6?ne=1:o.level===6?ne=2:ne=3,xe|=ne<<6,o.strstart!==0&&(xe|=de),xe+=31-xe%31,o.status=Q,M(o,xe),o.strstart!==0&&(M(o,e.adler>>>16),M(o,e.adler&65535)),e.adler=1}if(o.status===pe)if(o.gzhead.extra){for(_=o.pending;o.gzindex<(o.gzhead.extra.length&65535)&&!(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>_&&(e.adler=i(e.adler,o.pending_buf,o.pending-_,_)),ye(e),_=o.pending,o.pending===o.pending_buf_size));)ee(o,o.gzhead.extra[o.gzindex]&255),o.gzindex++;o.gzhead.hcrc&&o.pending>_&&(e.adler=i(e.adler,o.pending_buf,o.pending-_,_)),o.gzindex===o.gzhead.extra.length&&(o.gzindex=0,o.status=ge)}else o.status=ge;if(o.status===ge)if(o.gzhead.name){_=o.pending;do{if(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>_&&(e.adler=i(e.adler,o.pending_buf,o.pending-_,_)),ye(e),_=o.pending,o.pending===o.pending_buf_size)){k=1;break}o.gzindex<o.gzhead.name.length?k=o.gzhead.name.charCodeAt(o.gzindex++)&255:k=0,ee(o,k)}while(k!==0);o.gzhead.hcrc&&o.pending>_&&(e.adler=i(e.adler,o.pending_buf,o.pending-_,_)),k===0&&(o.gzindex=0,o.status=re)}else o.status=re;if(o.status===re)if(o.gzhead.comment){_=o.pending;do{if(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>_&&(e.adler=i(e.adler,o.pending_buf,o.pending-_,_)),ye(e),_=o.pending,o.pending===o.pending_buf_size)){k=1;break}o.gzindex<o.gzhead.comment.length?k=o.gzhead.comment.charCodeAt(o.gzindex++)&255:k=0,ee(o,k)}while(k!==0);o.gzhead.hcrc&&o.pending>_&&(e.adler=i(e.adler,o.pending_buf,o.pending-_,_)),k===0&&(o.status=X)}else o.status=X;if(o.status===X&&(o.gzhead.hcrc?(o.pending+2>o.pending_buf_size&&ye(e),o.pending+2<=o.pending_buf_size&&(ee(o,e.adler&255),ee(o,e.adler>>8&255),e.adler=0,o.status=Q)):o.status=Q),o.pending!==0){if(ye(e),e.avail_out===0)return o.last_flush=-1,x}else if(e.avail_in===0&&oe(R)<=oe(C)&&R!==s)return we(e,c);if(o.status===me&&e.avail_in!==0)return we(e,c);if(e.avail_in!==0||o.lookahead!==0||R!==t&&o.status!==me){var ue=o.strategy===d?ce(o,R):o.strategy===g?le(o,R):ae[o.level].func(o,R);if((ue===Re||ue===Se)&&(o.status=me),ue===ie||ue===Re)return e.avail_out===0&&(o.last_flush=-1),x;if(ue===$&&(R===n?r._tr_align(o):R!==m&&(r._tr_stored_block(o,0,0,!1),R===h&&(q(o.head),o.lookahead===0&&(o.strstart=0,o.block_start=0,o.insert=0))),ye(e),e.avail_out===0))return o.last_flush=-1,x}return R!==s?x:o.wrap<=0?u:(o.wrap===2?(ee(o,e.adler&255),ee(o,e.adler>>8&255),ee(o,e.adler>>16&255),ee(o,e.adler>>24&255),ee(o,e.total_in&255),ee(o,e.total_in>>8&255),ee(o,e.total_in>>16&255),ee(o,e.total_in>>24&255)):(M(o,e.adler>>>16),M(o,e.adler&65535)),ye(e),o.wrap>0&&(o.wrap=-o.wrap),o.pending!==0?x:u)}function H(e){var R;return!e||!e.state?v:(R=e.state.status,R!==Ee&&R!==pe&&R!==ge&&R!==re&&R!==X&&R!==Q&&R!==me?we(e,v):(e.state=null,R===Q?we(e,b):x))}function Te(e,R){var C=R.length,o,_,k,xe,ne,ue,Fe,He;if(!e||!e.state||(o=e.state,xe=o.wrap,xe===2||xe===1&&o.status!==Ee||o.lookahead))return v;for(xe===1&&(e.adler=f(e.adler,R,C,0)),o.wrap=0,C>=o.w_size&&(xe===0&&(q(o.head),o.strstart=0,o.block_start=0,o.insert=0),He=new w.Buf8(o.w_size),w.arraySet(He,R,C-o.w_size,o.w_size,0),R=He,C=o.w_size),ne=e.avail_in,ue=e.next_in,Fe=e.input,e.avail_in=C,e.next_in=0,e.input=R,be(o);o.lookahead>=K;){_=o.strstart,k=o.lookahead-(K-1);do o.ins_h=(o.ins_h<<o.hash_shift^o.window[_+K-1])&o.hash_mask,o.prev[_&o.w_mask]=o.head[o.ins_h],o.head[o.ins_h]=_,_++;while(--k);o.strstart=_,o.lookahead=K-1,be(o)}return o.strstart+=o.lookahead,o.block_start=o.strstart,o.insert=o.lookahead,o.lookahead=0,o.match_length=o.prev_length=K-1,o.match_available=0,e.next_in=ue,e.input=Fe,e.avail_in=ne,o.wrap=xe,x}return Xe.deflateInit=F,Xe.deflateInit2=p,Xe.deflateReset=P,Xe.deflateResetKeep=I,Xe.deflateSetHeader=Y,Xe.deflate=a,Xe.deflateEnd=H,Xe.deflateSetDictionary=Te,Xe.deflateInfo="pako deflate (from Nodeca project)",Xe}var tr={},ft;function kt(){if(ft)return tr;ft=1;var w=$e(),r=!0,f=!0;try{String.fromCharCode.apply(null,[0])}catch{r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{f=!1}for(var i=new w.Buf8(256),E=0;E<256;E++)i[E]=E>=252?6:E>=248?5:E>=240?4:E>=224?3:E>=192?2:1;i[254]=i[254]=1,tr.string2buf=function(n){var h,s,m,x,u,v=n.length,b=0;for(x=0;x<v;x++)s=n.charCodeAt(x),(s&64512)===55296&&x+1<v&&(m=n.charCodeAt(x+1),(m&64512)===56320&&(s=65536+(s-55296<<10)+(m-56320),x++)),b+=s<128?1:s<2048?2:s<65536?3:4;for(h=new w.Buf8(b),u=0,x=0;u<b;x++)s=n.charCodeAt(x),(s&64512)===55296&&x+1<v&&(m=n.charCodeAt(x+1),(m&64512)===56320&&(s=65536+(s-55296<<10)+(m-56320),x++)),s<128?h[u++]=s:s<2048?(h[u++]=192|s>>>6,h[u++]=128|s&63):s<65536?(h[u++]=224|s>>>12,h[u++]=128|s>>>6&63,h[u++]=128|s&63):(h[u++]=240|s>>>18,h[u++]=128|s>>>12&63,h[u++]=128|s>>>6&63,h[u++]=128|s&63);return h};function t(n,h){if(h<65534&&(n.subarray&&f||!n.subarray&&r))return String.fromCharCode.apply(null,w.shrinkBuf(n,h));for(var s="",m=0;m<h;m++)s+=String.fromCharCode(n[m]);return s}return tr.buf2binstring=function(n){return t(n,n.length)},tr.binstring2buf=function(n){for(var h=new w.Buf8(n.length),s=0,m=h.length;s<m;s++)h[s]=n.charCodeAt(s);return h},tr.buf2string=function(n,h){var s,m,x,u,v=h||n.length,b=new Array(v*2);for(m=0,s=0;s<v;){if(x=n[s++],x<128){b[m++]=x;continue}if(u=i[x],u>4){b[m++]=65533,s+=u-1;continue}for(x&=u===2?31:u===3?15:7;u>1&&s<v;)x=x<<6|n[s++]&63,u--;if(u>1){b[m++]=65533;continue}x<65536?b[m++]=x:(x-=65536,b[m++]=55296|x>>10&1023,b[m++]=56320|x&1023)}return t(b,m)},tr.utf8border=function(n,h){var s;for(h=h||n.length,h>n.length&&(h=n.length),s=h-1;s>=0&&(n[s]&192)===128;)s--;return s<0||s===0?h:s+i[n[s]]>h?s:h},tr}var kr,lt;function Rt(){if(lt)return kr;lt=1;function w(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}return kr=w,kr}var ut;function rn(){if(ut)return sr;ut=1;var w=en(),r=$e(),f=kt(),i=zr(),E=Rt(),t=Object.prototype.toString,n=0,h=4,s=0,m=1,x=2,u=-1,v=0,b=8;function c(g){if(!(this instanceof c))return new c(g);this.options=r.assign({level:u,method:b,chunkSize:16384,windowBits:15,memLevel:8,strategy:v,to:""},g||{});var A=this.options;A.raw&&A.windowBits>0?A.windowBits=-A.windowBits:A.gzip&&A.windowBits>0&&A.windowBits<16&&(A.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new E,this.strm.avail_out=0;var j=w.deflateInit2(this.strm,A.level,A.method,A.windowBits,A.memLevel,A.strategy);if(j!==s)throw new Error(i[j]);if(A.header&&w.deflateSetHeader(this.strm,A.header),A.dictionary){var U;if(typeof A.dictionary=="string"?U=f.string2buf(A.dictionary):t.call(A.dictionary)==="[object ArrayBuffer]"?U=new Uint8Array(A.dictionary):U=A.dictionary,j=w.deflateSetDictionary(this.strm,U),j!==s)throw new Error(i[j]);this._dict_set=!0}}c.prototype.push=function(g,A){var j=this.strm,U=this.options.chunkSize,S,y;if(this.ended)return!1;y=A===~~A?A:A===!0?h:n,typeof g=="string"?j.input=f.string2buf(g):t.call(g)==="[object ArrayBuffer]"?j.input=new Uint8Array(g):j.input=g,j.next_in=0,j.avail_in=j.input.length;do{if(j.avail_out===0&&(j.output=new r.Buf8(U),j.next_out=0,j.avail_out=U),S=w.deflate(j,y),S!==m&&S!==s)return this.onEnd(S),this.ended=!0,!1;(j.avail_out===0||j.avail_in===0&&(y===h||y===x))&&(this.options.to==="string"?this.onData(f.buf2binstring(r.shrinkBuf(j.output,j.next_out))):this.onData(r.shrinkBuf(j.output,j.next_out)))}while((j.avail_in>0||j.avail_out===0)&&S!==m);return y===h?(S=w.deflateEnd(this.strm),this.onEnd(S),this.ended=!0,S===s):(y===x&&(this.onEnd(s),j.avail_out=0),!0)},c.prototype.onData=function(g){this.chunks.push(g)},c.prototype.onEnd=function(g){g===s&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=g,this.msg=this.strm.msg};function L(g,A){var j=new c(A);if(j.push(g,!0),j.err)throw j.msg||i[j.err];return j.result}function B(g,A){return A=A||{},A.raw=!0,L(g,A)}function d(g,A){return A=A||{},A.gzip=!0,L(g,A)}return sr.Deflate=c,sr.deflate=L,sr.deflateRaw=B,sr.gzip=d,sr}var or={},Ye={},Rr,ct;function tn(){if(ct)return Rr;ct=1;var w=30,r=12;return Rr=function(i,E){var t,n,h,s,m,x,u,v,b,c,L,B,d,g,A,j,U,S,y,T,G,z,V,N,O;t=i.state,n=i.next_in,N=i.input,h=n+(i.avail_in-5),s=i.next_out,O=i.output,m=s-(E-i.avail_out),x=s+(i.avail_out-257),u=t.dmax,v=t.wsize,b=t.whave,c=t.wnext,L=t.window,B=t.hold,d=t.bits,g=t.lencode,A=t.distcode,j=(1<<t.lenbits)-1,U=(1<<t.distbits)-1;e:do{d<15&&(B+=N[n++]<<d,d+=8,B+=N[n++]<<d,d+=8),S=g[B&j];r:for(;;){if(y=S>>>24,B>>>=y,d-=y,y=S>>>16&255,y===0)O[s++]=S&65535;else if(y&16){T=S&65535,y&=15,y&&(d<y&&(B+=N[n++]<<d,d+=8),T+=B&(1<<y)-1,B>>>=y,d-=y),d<15&&(B+=N[n++]<<d,d+=8,B+=N[n++]<<d,d+=8),S=A[B&U];t:for(;;){if(y=S>>>24,B>>>=y,d-=y,y=S>>>16&255,y&16){if(G=S&65535,y&=15,d<y&&(B+=N[n++]<<d,d+=8,d<y&&(B+=N[n++]<<d,d+=8)),G+=B&(1<<y)-1,G>u){i.msg="invalid distance too far back",t.mode=w;break e}if(B>>>=y,d-=y,y=s-m,G>y){if(y=G-y,y>b&&t.sane){i.msg="invalid distance too far back",t.mode=w;break e}if(z=0,V=L,c===0){if(z+=v-y,y<T){T-=y;do O[s++]=L[z++];while(--y);z=s-G,V=O}}else if(c<y){if(z+=v+c-y,y-=c,y<T){T-=y;do O[s++]=L[z++];while(--y);if(z=0,c<T){y=c,T-=y;do O[s++]=L[z++];while(--y);z=s-G,V=O}}}else if(z+=c-y,y<T){T-=y;do O[s++]=L[z++];while(--y);z=s-G,V=O}for(;T>2;)O[s++]=V[z++],O[s++]=V[z++],O[s++]=V[z++],T-=3;T&&(O[s++]=V[z++],T>1&&(O[s++]=V[z++]))}else{z=s-G;do O[s++]=O[z++],O[s++]=O[z++],O[s++]=O[z++],T-=3;while(T>2);T&&(O[s++]=O[z++],T>1&&(O[s++]=O[z++]))}}else if((y&64)===0){S=A[(S&65535)+(B&(1<<y)-1)];continue t}else{i.msg="invalid distance code",t.mode=w;break e}break}}else if((y&64)===0){S=g[(S&65535)+(B&(1<<y)-1)];continue r}else if(y&32){t.mode=r;break e}else{i.msg="invalid literal/length code",t.mode=w;break e}break}}while(n<h&&s<x);T=d>>3,n-=T,d-=T<<3,B&=(1<<d)-1,i.next_in=n,i.next_out=s,i.avail_in=n<h?5+(h-n):5-(n-h),i.avail_out=s<x?257+(x-s):257-(s-x),t.hold=B,t.bits=d},Rr}var Ir,ht;function nn(){if(ht)return Ir;ht=1;var w=$e(),r=15,f=852,i=592,E=0,t=1,n=2,h=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],s=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],m=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],x=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];return Ir=function(v,b,c,L,B,d,g,A){var j=A.bits,U=0,S=0,y=0,T=0,G=0,z=0,V=0,N=0,O=0,D=0,J,W,K,Z,te,de=null,Ee=0,pe,ge=new w.Buf16(r+1),re=new w.Buf16(r+1),X=null,Q=0,me,ie,$;for(U=0;U<=r;U++)ge[U]=0;for(S=0;S<L;S++)ge[b[c+S]]++;for(G=j,T=r;T>=1&&ge[T]===0;T--);if(G>T&&(G=T),T===0)return B[d++]=1<<24|64<<16|0,B[d++]=1<<24|64<<16|0,A.bits=1,0;for(y=1;y<T&&ge[y]===0;y++);for(G<y&&(G=y),N=1,U=1;U<=r;U++)if(N<<=1,N-=ge[U],N<0)return-1;if(N>0&&(v===E||T!==1))return-1;for(re[1]=0,U=1;U<r;U++)re[U+1]=re[U]+ge[U];for(S=0;S<L;S++)b[c+S]!==0&&(g[re[b[c+S]]++]=S);if(v===E?(de=X=g,pe=19):v===t?(de=h,Ee-=257,X=s,Q-=257,pe=256):(de=m,X=x,pe=-1),D=0,S=0,U=y,te=d,z=G,V=0,K=-1,O=1<<G,Z=O-1,v===t&&O>f||v===n&&O>i)return 1;for(;;){me=U-V,g[S]<pe?(ie=0,$=g[S]):g[S]>pe?(ie=X[Q+g[S]],$=de[Ee+g[S]]):(ie=96,$=0),J=1<<U-V,W=1<<z,y=W;do W-=J,B[te+(D>>V)+W]=me<<24|ie<<16|$|0;while(W!==0);for(J=1<<U-1;D&J;)J>>=1;if(J!==0?(D&=J-1,D+=J):D=0,S++,--ge[U]===0){if(U===T)break;U=b[c+g[S]]}if(U>G&&(D&Z)!==K){for(V===0&&(V=G),te+=y,z=U-V,N=1<<z;z+V<T&&(N-=ge[z+V],!(N<=0));)z++,N<<=1;if(O+=1<<z,v===t&&O>f||v===n&&O>i)return 1;K=D&Z,B[K]=G<<24|z<<16|te-d|0}}return D!==0&&(B[te+D]=U-V<<24|64<<16|0),A.bits=G,0},Ir}var dt;function an(){if(dt)return Ye;dt=1;var w=$e(),r=St(),f=At(),i=tn(),E=nn(),t=0,n=1,h=2,s=4,m=5,x=6,u=0,v=1,b=2,c=-2,L=-3,B=-4,d=-5,g=8,A=1,j=2,U=3,S=4,y=5,T=6,G=7,z=8,V=9,N=10,O=11,D=12,J=13,W=14,K=15,Z=16,te=17,de=18,Ee=19,pe=20,ge=21,re=22,X=23,Q=24,me=25,ie=26,$=27,Re=28,Se=29,se=30,we=31,oe=32,q=852,ye=592,fe=15,ee=fe;function M(p){return(p>>>24&255)+(p>>>8&65280)+((p&65280)<<8)+((p&255)<<24)}function _e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new w.Buf16(320),this.work=new w.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function ve(p){var F;return!p||!p.state?c:(F=p.state,p.total_in=p.total_out=F.total=0,p.msg="",F.wrap&&(p.adler=F.wrap&1),F.mode=A,F.last=0,F.havedict=0,F.dmax=32768,F.head=null,F.hold=0,F.bits=0,F.lencode=F.lendyn=new w.Buf32(q),F.distcode=F.distdyn=new w.Buf32(ye),F.sane=1,F.back=-1,u)}function be(p){var F;return!p||!p.state?c:(F=p.state,F.wsize=0,F.whave=0,F.wnext=0,ve(p))}function ke(p,F){var a,H;return!p||!p.state||(H=p.state,F<0?(a=0,F=-F):(a=(F>>4)+1,F<48&&(F&=15)),F&&(F<8||F>15))?c:(H.window!==null&&H.wbits!==F&&(H.window=null),H.wrap=a,H.wbits=F,be(p))}function Me(p,F){var a,H;return p?(H=new _e,p.state=H,H.window=null,a=ke(p,F),a!==u&&(p.state=null),a):c}function Ie(p){return Me(p,ee)}var le=!0,ce,he;function ae(p){if(le){var F;for(ce=new w.Buf32(512),he=new w.Buf32(32),F=0;F<144;)p.lens[F++]=8;for(;F<256;)p.lens[F++]=9;for(;F<280;)p.lens[F++]=7;for(;F<288;)p.lens[F++]=8;for(E(n,p.lens,0,288,ce,0,p.work,{bits:9}),F=0;F<32;)p.lens[F++]=5;E(h,p.lens,0,32,he,0,p.work,{bits:5}),le=!1}p.lencode=ce,p.lenbits=9,p.distcode=he,p.distbits=5}function Ae(p,F,a,H){var Te,e=p.state;return e.window===null&&(e.wsize=1<<e.wbits,e.wnext=0,e.whave=0,e.window=new w.Buf8(e.wsize)),H>=e.wsize?(w.arraySet(e.window,F,a-e.wsize,e.wsize,0),e.wnext=0,e.whave=e.wsize):(Te=e.wsize-e.wnext,Te>H&&(Te=H),w.arraySet(e.window,F,a-H,Te,e.wnext),H-=Te,H?(w.arraySet(e.window,F,a-H,H,0),e.wnext=H,e.whave=e.wsize):(e.wnext+=Te,e.wnext===e.wsize&&(e.wnext=0),e.whave<e.wsize&&(e.whave+=Te))),0}function l(p,F){var a,H,Te,e,R,C,o,_,k,xe,ne,ue,Fe,He,Be=0,Ce,Le,Ne,je,Je,Qe,De,Ge,Oe=new w.Buf8(4),Ve,ze,er=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!p||!p.state||!p.output||!p.input&&p.avail_in!==0)return c;a=p.state,a.mode===D&&(a.mode=J),R=p.next_out,Te=p.output,o=p.avail_out,e=p.next_in,H=p.input,C=p.avail_in,_=a.hold,k=a.bits,xe=C,ne=o,Ge=u;e:for(;;)switch(a.mode){case A:if(a.wrap===0){a.mode=J;break}for(;k<16;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if(a.wrap&2&&_===35615){a.check=0,Oe[0]=_&255,Oe[1]=_>>>8&255,a.check=f(a.check,Oe,2,0),_=0,k=0,a.mode=j;break}if(a.flags=0,a.head&&(a.head.done=!1),!(a.wrap&1)||(((_&255)<<8)+(_>>8))%31){p.msg="incorrect header check",a.mode=se;break}if((_&15)!==g){p.msg="unknown compression method",a.mode=se;break}if(_>>>=4,k-=4,De=(_&15)+8,a.wbits===0)a.wbits=De;else if(De>a.wbits){p.msg="invalid window size",a.mode=se;break}a.dmax=1<<De,p.adler=a.check=1,a.mode=_&512?N:D,_=0,k=0;break;case j:for(;k<16;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if(a.flags=_,(a.flags&255)!==g){p.msg="unknown compression method",a.mode=se;break}if(a.flags&57344){p.msg="unknown header flags set",a.mode=se;break}a.head&&(a.head.text=_>>8&1),a.flags&512&&(Oe[0]=_&255,Oe[1]=_>>>8&255,a.check=f(a.check,Oe,2,0)),_=0,k=0,a.mode=U;case U:for(;k<32;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}a.head&&(a.head.time=_),a.flags&512&&(Oe[0]=_&255,Oe[1]=_>>>8&255,Oe[2]=_>>>16&255,Oe[3]=_>>>24&255,a.check=f(a.check,Oe,4,0)),_=0,k=0,a.mode=S;case S:for(;k<16;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}a.head&&(a.head.xflags=_&255,a.head.os=_>>8),a.flags&512&&(Oe[0]=_&255,Oe[1]=_>>>8&255,a.check=f(a.check,Oe,2,0)),_=0,k=0,a.mode=y;case y:if(a.flags&1024){for(;k<16;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}a.length=_,a.head&&(a.head.extra_len=_),a.flags&512&&(Oe[0]=_&255,Oe[1]=_>>>8&255,a.check=f(a.check,Oe,2,0)),_=0,k=0}else a.head&&(a.head.extra=null);a.mode=T;case T:if(a.flags&1024&&(ue=a.length,ue>C&&(ue=C),ue&&(a.head&&(De=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),w.arraySet(a.head.extra,H,e,ue,De)),a.flags&512&&(a.check=f(a.check,H,ue,e)),C-=ue,e+=ue,a.length-=ue),a.length))break e;a.length=0,a.mode=G;case G:if(a.flags&2048){if(C===0)break e;ue=0;do De=H[e+ue++],a.head&&De&&a.length<65536&&(a.head.name+=String.fromCharCode(De));while(De&&ue<C);if(a.flags&512&&(a.check=f(a.check,H,ue,e)),C-=ue,e+=ue,De)break e}else a.head&&(a.head.name=null);a.length=0,a.mode=z;case z:if(a.flags&4096){if(C===0)break e;ue=0;do De=H[e+ue++],a.head&&De&&a.length<65536&&(a.head.comment+=String.fromCharCode(De));while(De&&ue<C);if(a.flags&512&&(a.check=f(a.check,H,ue,e)),C-=ue,e+=ue,De)break e}else a.head&&(a.head.comment=null);a.mode=V;case V:if(a.flags&512){for(;k<16;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if(_!==(a.check&65535)){p.msg="header crc mismatch",a.mode=se;break}_=0,k=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),p.adler=a.check=0,a.mode=D;break;case N:for(;k<32;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}p.adler=a.check=M(_),_=0,k=0,a.mode=O;case O:if(a.havedict===0)return p.next_out=R,p.avail_out=o,p.next_in=e,p.avail_in=C,a.hold=_,a.bits=k,b;p.adler=a.check=1,a.mode=D;case D:if(F===m||F===x)break e;case J:if(a.last){_>>>=k&7,k-=k&7,a.mode=$;break}for(;k<3;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}switch(a.last=_&1,_>>>=1,k-=1,_&3){case 0:a.mode=W;break;case 1:if(ae(a),a.mode=pe,F===x){_>>>=2,k-=2;break e}break;case 2:a.mode=te;break;case 3:p.msg="invalid block type",a.mode=se}_>>>=2,k-=2;break;case W:for(_>>>=k&7,k-=k&7;k<32;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if((_&65535)!==(_>>>16^65535)){p.msg="invalid stored block lengths",a.mode=se;break}if(a.length=_&65535,_=0,k=0,a.mode=K,F===x)break e;case K:a.mode=Z;case Z:if(ue=a.length,ue){if(ue>C&&(ue=C),ue>o&&(ue=o),ue===0)break e;w.arraySet(Te,H,e,ue,R),C-=ue,e+=ue,o-=ue,R+=ue,a.length-=ue;break}a.mode=D;break;case te:for(;k<14;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if(a.nlen=(_&31)+257,_>>>=5,k-=5,a.ndist=(_&31)+1,_>>>=5,k-=5,a.ncode=(_&15)+4,_>>>=4,k-=4,a.nlen>286||a.ndist>30){p.msg="too many length or distance symbols",a.mode=se;break}a.have=0,a.mode=de;case de:for(;a.have<a.ncode;){for(;k<3;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}a.lens[er[a.have++]]=_&7,_>>>=3,k-=3}for(;a.have<19;)a.lens[er[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,Ve={bits:a.lenbits},Ge=E(t,a.lens,0,19,a.lencode,0,a.work,Ve),a.lenbits=Ve.bits,Ge){p.msg="invalid code lengths set",a.mode=se;break}a.have=0,a.mode=Ee;case Ee:for(;a.have<a.nlen+a.ndist;){for(;Be=a.lencode[_&(1<<a.lenbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(Ce<=k);){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if(Ne<16)_>>>=Ce,k-=Ce,a.lens[a.have++]=Ne;else{if(Ne===16){for(ze=Ce+2;k<ze;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if(_>>>=Ce,k-=Ce,a.have===0){p.msg="invalid bit length repeat",a.mode=se;break}De=a.lens[a.have-1],ue=3+(_&3),_>>>=2,k-=2}else if(Ne===17){for(ze=Ce+3;k<ze;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}_>>>=Ce,k-=Ce,De=0,ue=3+(_&7),_>>>=3,k-=3}else{for(ze=Ce+7;k<ze;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}_>>>=Ce,k-=Ce,De=0,ue=11+(_&127),_>>>=7,k-=7}if(a.have+ue>a.nlen+a.ndist){p.msg="invalid bit length repeat",a.mode=se;break}for(;ue--;)a.lens[a.have++]=De}}if(a.mode===se)break;if(a.lens[256]===0){p.msg="invalid code -- missing end-of-block",a.mode=se;break}if(a.lenbits=9,Ve={bits:a.lenbits},Ge=E(n,a.lens,0,a.nlen,a.lencode,0,a.work,Ve),a.lenbits=Ve.bits,Ge){p.msg="invalid literal/lengths set",a.mode=se;break}if(a.distbits=6,a.distcode=a.distdyn,Ve={bits:a.distbits},Ge=E(h,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,Ve),a.distbits=Ve.bits,Ge){p.msg="invalid distances set",a.mode=se;break}if(a.mode=pe,F===x)break e;case pe:a.mode=ge;case ge:if(C>=6&&o>=258){p.next_out=R,p.avail_out=o,p.next_in=e,p.avail_in=C,a.hold=_,a.bits=k,i(p,ne),R=p.next_out,Te=p.output,o=p.avail_out,e=p.next_in,H=p.input,C=p.avail_in,_=a.hold,k=a.bits,a.mode===D&&(a.back=-1);break}for(a.back=0;Be=a.lencode[_&(1<<a.lenbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(Ce<=k);){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if(Le&&(Le&240)===0){for(je=Ce,Je=Le,Qe=Ne;Be=a.lencode[Qe+((_&(1<<je+Je)-1)>>je)],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(je+Ce<=k);){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}_>>>=je,k-=je,a.back+=je}if(_>>>=Ce,k-=Ce,a.back+=Ce,a.length=Ne,Le===0){a.mode=ie;break}if(Le&32){a.back=-1,a.mode=D;break}if(Le&64){p.msg="invalid literal/length code",a.mode=se;break}a.extra=Le&15,a.mode=re;case re:if(a.extra){for(ze=a.extra;k<ze;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}a.length+=_&(1<<a.extra)-1,_>>>=a.extra,k-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=X;case X:for(;Be=a.distcode[_&(1<<a.distbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(Ce<=k);){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if((Le&240)===0){for(je=Ce,Je=Le,Qe=Ne;Be=a.distcode[Qe+((_&(1<<je+Je)-1)>>je)],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(je+Ce<=k);){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}_>>>=je,k-=je,a.back+=je}if(_>>>=Ce,k-=Ce,a.back+=Ce,Le&64){p.msg="invalid distance code",a.mode=se;break}a.offset=Ne,a.extra=Le&15,a.mode=Q;case Q:if(a.extra){for(ze=a.extra;k<ze;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}a.offset+=_&(1<<a.extra)-1,_>>>=a.extra,k-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){p.msg="invalid distance too far back",a.mode=se;break}a.mode=me;case me:if(o===0)break e;if(ue=ne-o,a.offset>ue){if(ue=a.offset-ue,ue>a.whave&&a.sane){p.msg="invalid distance too far back",a.mode=se;break}ue>a.wnext?(ue-=a.wnext,Fe=a.wsize-ue):Fe=a.wnext-ue,ue>a.length&&(ue=a.length),He=a.window}else He=Te,Fe=R-a.offset,ue=a.length;ue>o&&(ue=o),o-=ue,a.length-=ue;do Te[R++]=He[Fe++];while(--ue);a.length===0&&(a.mode=ge);break;case ie:if(o===0)break e;Te[R++]=a.length,o--,a.mode=ge;break;case $:if(a.wrap){for(;k<32;){if(C===0)break e;C--,_|=H[e++]<<k,k+=8}if(ne-=o,p.total_out+=ne,a.total+=ne,ne&&(p.adler=a.check=a.flags?f(a.check,Te,ne,R-ne):r(a.check,Te,ne,R-ne)),ne=o,(a.flags?_:M(_))!==a.check){p.msg="incorrect data check",a.mode=se;break}_=0,k=0}a.mode=Re;case Re:if(a.wrap&&a.flags){for(;k<32;){if(C===0)break e;C--,_+=H[e++]<<k,k+=8}if(_!==(a.total&4294967295)){p.msg="incorrect length check",a.mode=se;break}_=0,k=0}a.mode=Se;case Se:Ge=v;break e;case se:Ge=L;break e;case we:return B;case oe:default:return c}return p.next_out=R,p.avail_out=o,p.next_in=e,p.avail_in=C,a.hold=_,a.bits=k,(a.wsize||ne!==p.avail_out&&a.mode<se&&(a.mode<$||F!==s))&&Ae(p,p.output,p.next_out,ne-p.avail_out),xe-=p.avail_in,ne-=p.avail_out,p.total_in+=xe,p.total_out+=ne,a.total+=ne,a.wrap&&ne&&(p.adler=a.check=a.flags?f(a.check,Te,ne,p.next_out-ne):r(a.check,Te,ne,p.next_out-ne)),p.data_type=a.bits+(a.last?64:0)+(a.mode===D?128:0)+(a.mode===pe||a.mode===K?256:0),(xe===0&&ne===0||F===s)&&Ge===u&&(Ge=d),Ge}function I(p){if(!p||!p.state)return c;var F=p.state;return F.window&&(F.window=null),p.state=null,u}function P(p,F){var a;return!p||!p.state||(a=p.state,(a.wrap&2)===0)?c:(a.head=F,F.done=!1,u)}function Y(p,F){var a=F.length,H,Te,e;return!p||!p.state||(H=p.state,H.wrap!==0&&H.mode!==O)?c:H.mode===O&&(Te=1,Te=r(Te,F,a,0),Te!==H.check)?L:(e=Ae(p,F,a,a),e?(H.mode=we,B):(H.havedict=1,u))}return Ye.inflateReset=be,Ye.inflateReset2=ke,Ye.inflateResetKeep=ve,Ye.inflateInit=Ie,Ye.inflateInit2=Me,Ye.inflate=l,Ye.inflateEnd=I,Ye.inflateGetHeader=P,Ye.inflateSetDictionary=Y,Ye.inflateInfo="pako inflate (from Nodeca project)",Ye}var Mr,vt;function It(){return vt||(vt=1,Mr={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}),Mr}var Fr,xt;function sn(){if(xt)return Fr;xt=1;function w(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}return Fr=w,Fr}var gt;function on(){if(gt)return or;gt=1;var w=an(),r=$e(),f=kt(),i=It(),E=zr(),t=Rt(),n=sn(),h=Object.prototype.toString;function s(u){if(!(this instanceof s))return new s(u);this.options=r.assign({chunkSize:16384,windowBits:0,to:""},u||{});var v=this.options;v.raw&&v.windowBits>=0&&v.windowBits<16&&(v.windowBits=-v.windowBits,v.windowBits===0&&(v.windowBits=-15)),v.windowBits>=0&&v.windowBits<16&&!(u&&u.windowBits)&&(v.windowBits+=32),v.windowBits>15&&v.windowBits<48&&(v.windowBits&15)===0&&(v.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new t,this.strm.avail_out=0;var b=w.inflateInit2(this.strm,v.windowBits);if(b!==i.Z_OK)throw new Error(E[b]);if(this.header=new n,w.inflateGetHeader(this.strm,this.header),v.dictionary&&(typeof v.dictionary=="string"?v.dictionary=f.string2buf(v.dictionary):h.call(v.dictionary)==="[object ArrayBuffer]"&&(v.dictionary=new Uint8Array(v.dictionary)),v.raw&&(b=w.inflateSetDictionary(this.strm,v.dictionary),b!==i.Z_OK)))throw new Error(E[b])}s.prototype.push=function(u,v){var b=this.strm,c=this.options.chunkSize,L=this.options.dictionary,B,d,g,A,j,U=!1;if(this.ended)return!1;d=v===~~v?v:v===!0?i.Z_FINISH:i.Z_NO_FLUSH,typeof u=="string"?b.input=f.binstring2buf(u):h.call(u)==="[object ArrayBuffer]"?b.input=new Uint8Array(u):b.input=u,b.next_in=0,b.avail_in=b.input.length;do{if(b.avail_out===0&&(b.output=new r.Buf8(c),b.next_out=0,b.avail_out=c),B=w.inflate(b,i.Z_NO_FLUSH),B===i.Z_NEED_DICT&&L&&(B=w.inflateSetDictionary(this.strm,L)),B===i.Z_BUF_ERROR&&U===!0&&(B=i.Z_OK,U=!1),B!==i.Z_STREAM_END&&B!==i.Z_OK)return this.onEnd(B),this.ended=!0,!1;b.next_out&&(b.avail_out===0||B===i.Z_STREAM_END||b.avail_in===0&&(d===i.Z_FINISH||d===i.Z_SYNC_FLUSH))&&(this.options.to==="string"?(g=f.utf8border(b.output,b.next_out),A=b.next_out-g,j=f.buf2string(b.output,g),b.next_out=A,b.avail_out=c-A,A&&r.arraySet(b.output,b.output,g,A,0),this.onData(j)):this.onData(r.shrinkBuf(b.output,b.next_out))),b.avail_in===0&&b.avail_out===0&&(U=!0)}while((b.avail_in>0||b.avail_out===0)&&B!==i.Z_STREAM_END);return B===i.Z_STREAM_END&&(d=i.Z_FINISH),d===i.Z_FINISH?(B=w.inflateEnd(this.strm),this.onEnd(B),this.ended=!0,B===i.Z_OK):(d===i.Z_SYNC_FLUSH&&(this.onEnd(i.Z_OK),b.avail_out=0),!0)},s.prototype.onData=function(u){this.chunks.push(u)},s.prototype.onEnd=function(u){u===i.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=u,this.msg=this.strm.msg};function m(u,v){var b=new s(v);if(b.push(u,!0),b.err)throw b.msg||E[b.err];return b.result}function x(u,v){return v=v||{},v.raw=!0,m(u,v)}return or.Inflate=s,or.inflate=m,or.inflateRaw=x,or.ungzip=m,or}var Cr,mt;function fn(){if(mt)return Cr;mt=1;var w=$e().assign,r=rn(),f=on(),i=It(),E={};return w(E,r,f,i),Cr=E,Cr}var _t;function ln(){return _t||(_t=1,(function(w){(function(){var r={},f;w.exports=r,typeof Jt=="function"?f=fn():f=window.pako,(function(i,E){i.toRGBA8=function(t){var n=t.width,h=t.height;if(t.tabs.acTL==null)return[i.toRGBA8.decodeImage(t.data,n,h,t).buffer];var s=[];t.frames[0].data==null&&(t.frames[0].data=t.data);for(var m,x=new Uint8Array(n*h*4),u=0;u<t.frames.length;u++){var v=t.frames[u],b=v.rect.x,c=v.rect.y,L=v.rect.width,B=v.rect.height,d=i.toRGBA8.decodeImage(v.data,L,B,t);if(u==0?m=d:v.blend==0?i._copyTile(d,L,B,m,n,h,b,c,0):v.blend==1&&i._copyTile(d,L,B,m,n,h,b,c,1),s.push(m.buffer),m=m.slice(0),v.dispose!=0){if(v.dispose==1)i._copyTile(x,L,B,m,n,h,b,c,0);else if(v.dispose==2){for(var g=u-1;t.frames[g].dispose==2;)g--;m=new Uint8Array(s[g]).slice(0)}}}return s},i.toRGBA8.decodeImage=function(t,n,h,s){var m=n*h,x=i.decode._getBPP(s),u=Math.ceil(n*x/8),v=new Uint8Array(m*4),b=new Uint32Array(v.buffer),c=s.ctype,L=s.depth,B=i._bin.readUshort;if(c==6){var d=m<<2;if(L==8)for(var g=0;g<d;g++)v[g]=t[g];if(L==16)for(var g=0;g<d;g++)v[g]=t[g<<1]}else if(c==2){var A=s.tabs.tRNS,j=-1,U=-1,S=-1;if(A&&(j=A[0],U=A[1],S=A[2]),L==8)for(var g=0;g<m;g++){var y=g<<2,T=g*3;v[y]=t[T],v[y+1]=t[T+1],v[y+2]=t[T+2],v[y+3]=255,j!=-1&&t[T]==j&&t[T+1]==U&&t[T+2]==S&&(v[y+3]=0)}if(L==16)for(var g=0;g<m;g++){var y=g<<2,T=g*6;v[y]=t[T],v[y+1]=t[T+2],v[y+2]=t[T+4],v[y+3]=255,j!=-1&&B(t,T)==j&&B(t,T+2)==U&&B(t,T+4)==S&&(v[y+3]=0)}}else if(c==3){var G=s.tabs.PLTE,z=s.tabs.tRNS,V=z?z.length:0;if(L==1)for(var N=0;N<h;N++)for(var O=N*u,D=N*n,g=0;g<n;g++){var y=D+g<<2,J=t[O+(g>>3)]>>7-((g&7)<<0)&1,W=3*J;v[y]=G[W],v[y+1]=G[W+1],v[y+2]=G[W+2],v[y+3]=J<V?z[J]:255}if(L==2)for(var N=0;N<h;N++)for(var O=N*u,D=N*n,g=0;g<n;g++){var y=D+g<<2,J=t[O+(g>>2)]>>6-((g&3)<<1)&3,W=3*J;v[y]=G[W],v[y+1]=G[W+1],v[y+2]=G[W+2],v[y+3]=J<V?z[J]:255}if(L==4)for(var N=0;N<h;N++)for(var O=N*u,D=N*n,g=0;g<n;g++){var y=D+g<<2,J=t[O+(g>>1)]>>4-((g&1)<<2)&15,W=3*J;v[y]=G[W],v[y+1]=G[W+1],v[y+2]=G[W+2],v[y+3]=J<V?z[J]:255}if(L==8)for(var g=0;g<m;g++){var y=g<<2,J=t[g],W=3*J;v[y]=G[W],v[y+1]=G[W+1],v[y+2]=G[W+2],v[y+3]=J<V?z[J]:255}}else if(c==4){if(L==8)for(var g=0;g<m;g++){var y=g<<2,K=g<<1,Z=t[K];v[y]=Z,v[y+1]=Z,v[y+2]=Z,v[y+3]=t[K+1]}if(L==16)for(var g=0;g<m;g++){var y=g<<2,K=g<<2,Z=t[K];v[y]=Z,v[y+1]=Z,v[y+2]=Z,v[y+3]=t[K+2]}}else if(c==0){var j=s.tabs.tRNS?s.tabs.tRNS:-1;if(L==1)for(var g=0;g<m;g++){var Z=255*(t[g>>3]>>7-(g&7)&1),te=Z==j*255?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}if(L==2)for(var g=0;g<m;g++){var Z=85*(t[g>>2]>>6-((g&3)<<1)&3),te=Z==j*85?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}if(L==4)for(var g=0;g<m;g++){var Z=17*(t[g>>1]>>4-((g&1)<<2)&15),te=Z==j*17?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}if(L==8)for(var g=0;g<m;g++){var Z=t[g],te=Z==j?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}if(L==16)for(var g=0;g<m;g++){var Z=t[g<<1],te=B(t,g<<1)==j?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}}return v},i.decode=function(t){for(var n=new Uint8Array(t),h=8,s=i._bin,m=s.readUshort,x=s.readUint,u={tabs:{},frames:[]},v=new Uint8Array(n.length),b=0,c,L=0,B=[137,80,78,71,13,10,26,10],d=0;d<8;d++)if(n[d]!=B[d])throw"The input is not a PNG file!";for(;h<n.length;){var g=s.readUint(n,h);h+=4;var A=s.readASCII(n,h,4);if(h+=4,A=="IHDR")i.decode._IHDR(n,h,u);else if(A=="IDAT"){for(var d=0;d<g;d++)v[b+d]=n[h+d];b+=g}else if(A=="acTL")u.tabs[A]={num_frames:x(n,h),num_plays:x(n,h+4)},c=new Uint8Array(n.length);else if(A=="fcTL"){if(L!=0){var j=u.frames[u.frames.length-1];j.data=i.decode._decompress(u,c.slice(0,L),j.rect.width,j.rect.height),L=0}var U={x:x(n,h+12),y:x(n,h+16),width:x(n,h+4),height:x(n,h+8)},S=m(n,h+22);S=m(n,h+20)/(S==0?100:S);var y={rect:U,delay:Math.round(S*1e3),dispose:n[h+24],blend:n[h+25]};u.frames.push(y)}else if(A=="fdAT"){for(var d=0;d<g-4;d++)c[L+d]=n[h+d+4];L+=g-4}else if(A=="pHYs")u.tabs[A]=[s.readUint(n,h),s.readUint(n,h+4),n[h+8]];else if(A=="cHRM"){u.tabs[A]=[];for(var d=0;d<8;d++)u.tabs[A].push(s.readUint(n,h+d*4))}else if(A=="tEXt"){u.tabs[A]==null&&(u.tabs[A]={});var T=s.nextZero(n,h),G=s.readASCII(n,h,T-h),z=s.readASCII(n,T+1,h+g-T-1);u.tabs[A][G]=z}else if(A=="iTXt"){u.tabs[A]==null&&(u.tabs[A]={});var T=0,V=h;T=s.nextZero(n,V);var G=s.readASCII(n,V,T-V);V=T+1,n[V],n[V+1],V+=2,T=s.nextZero(n,V),s.readASCII(n,V,T-V),V=T+1,T=s.nextZero(n,V),s.readUTF8(n,V,T-V),V=T+1;var z=s.readUTF8(n,V,g-(V-h));u.tabs[A][G]=z}else if(A=="PLTE")u.tabs[A]=s.readBytes(n,h,g);else if(A=="hIST"){var N=u.tabs.PLTE.length/3;u.tabs[A]=[];for(var d=0;d<N;d++)u.tabs[A].push(m(n,h+d*2))}else if(A=="tRNS")u.ctype==3?u.tabs[A]=s.readBytes(n,h,g):u.ctype==0?u.tabs[A]=m(n,h):u.ctype==2&&(u.tabs[A]=[m(n,h),m(n,h+2),m(n,h+4)]);else if(A=="gAMA")u.tabs[A]=s.readUint(n,h)/1e5;else if(A=="sRGB")u.tabs[A]=n[h];else if(A=="bKGD")u.ctype==0||u.ctype==4?u.tabs[A]=[m(n,h)]:u.ctype==2||u.ctype==6?u.tabs[A]=[m(n,h),m(n,h+2),m(n,h+4)]:u.ctype==3&&(u.tabs[A]=n[h]);else if(A=="IEND"){if(L!=0){var j=u.frames[u.frames.length-1];j.data=i.decode._decompress(u,c.slice(0,L),j.rect.width,j.rect.height),L=0}u.data=i.decode._decompress(u,v,u.width,u.height);break}h+=g,s.readUint(n,h),h+=4}return delete u.compress,delete u.interlace,delete u.filter,u},i.decode._decompress=function(t,n,h,s){return t.compress==0&&(n=i.decode._inflate(n)),t.interlace==0?n=i.decode._filterZero(n,t,0,h,s):t.interlace==1&&(n=i.decode._readInterlace(n,t)),n},i.decode._inflate=function(t){return E.inflate(t)},i.decode._readInterlace=function(t,n){for(var h=n.width,s=n.height,m=i.decode._getBPP(n),x=m>>3,u=Math.ceil(h*m/8),v=new Uint8Array(s*u),b=0,c=[0,0,4,0,2,0,1],L=[0,4,0,2,0,1,0],B=[8,8,8,4,4,2,2],d=[8,8,4,4,2,2,1],g=0;g<7;){for(var A=B[g],j=d[g],U=0,S=0,y=c[g];y<s;)y+=A,S++;for(var T=L[g];T<h;)T+=j,U++;var G=Math.ceil(U*m/8);i.decode._filterZero(t,n,b,U,S);for(var z=0,V=c[g];V<s;){for(var N=L[g],O=b+z*G<<3;N<h;){if(m==1){var D=t[O>>3];D=D>>7-(O&7)&1,v[V*u+(N>>3)]|=D<<7-((N&3)<<0)}if(m==2){var D=t[O>>3];D=D>>6-(O&7)&3,v[V*u+(N>>2)]|=D<<6-((N&3)<<1)}if(m==4){var D=t[O>>3];D=D>>4-(O&7)&15,v[V*u+(N>>1)]|=D<<4-((N&1)<<2)}if(m>=8)for(var J=V*u+N*x,W=0;W<x;W++)v[J+W]=t[(O>>3)+W];O+=m,N+=j}z++,V+=A}U*S!=0&&(b+=S*(1+G)),g=g+1}return v},i.decode._getBPP=function(t){var n=[1,null,3,1,2,null,4][t.ctype];return n*t.depth},i.decode._filterZero=function(t,n,h,s,m){var x=i.decode._getBPP(n),u=Math.ceil(s*x/8),v=i.decode._paeth;x=Math.ceil(x/8);for(var b=0;b<m;b++){var c=h+b*u,L=c+b+1,B=t[L-1];if(B==0)for(var d=0;d<u;d++)t[c+d]=t[L+d];else if(B==1){for(var d=0;d<x;d++)t[c+d]=t[L+d];for(var d=x;d<u;d++)t[c+d]=t[L+d]+t[c+d-x]&255}else if(b==0){for(var d=0;d<x;d++)t[c+d]=t[L+d];if(B==2)for(var d=x;d<u;d++)t[c+d]=t[L+d]&255;if(B==3)for(var d=x;d<u;d++)t[c+d]=t[L+d]+(t[c+d-x]>>1)&255;if(B==4)for(var d=x;d<u;d++)t[c+d]=t[L+d]+v(t[c+d-x],0,0)&255}else{if(B==2)for(var d=0;d<u;d++)t[c+d]=t[L+d]+t[c+d-u]&255;if(B==3){for(var d=0;d<x;d++)t[c+d]=t[L+d]+(t[c+d-u]>>1)&255;for(var d=x;d<u;d++)t[c+d]=t[L+d]+(t[c+d-u]+t[c+d-x]>>1)&255}if(B==4){for(var d=0;d<x;d++)t[c+d]=t[L+d]+v(0,t[c+d-u],0)&255;for(var d=x;d<u;d++)t[c+d]=t[L+d]+v(t[c+d-x],t[c+d-u],t[c+d-x-u])&255}}}return t},i.decode._paeth=function(t,n,h){var s=t+n-h,m=Math.abs(s-t),x=Math.abs(s-n),u=Math.abs(s-h);return m<=x&&m<=u?t:x<=u?n:h},i.decode._IHDR=function(t,n,h){var s=i._bin;h.width=s.readUint(t,n),n+=4,h.height=s.readUint(t,n),n+=4,h.depth=t[n],n++,h.ctype=t[n],n++,h.compress=t[n],n++,h.filter=t[n],n++,h.interlace=t[n],n++},i._bin={nextZero:function(t,n){for(;t[n]!=0;)n++;return n},readUshort:function(t,n){return t[n]<<8|t[n+1]},writeUshort:function(t,n,h){t[n]=h>>8&255,t[n+1]=h&255},readUint:function(t,n){return t[n]*(256*256*256)+(t[n+1]<<16|t[n+2]<<8|t[n+3])},writeUint:function(t,n,h){t[n]=h>>24&255,t[n+1]=h>>16&255,t[n+2]=h>>8&255,t[n+3]=h&255},readASCII:function(t,n,h){for(var s="",m=0;m<h;m++)s+=String.fromCharCode(t[n+m]);return s},writeASCII:function(t,n,h){for(var s=0;s<h.length;s++)t[n+s]=h.charCodeAt(s)},readBytes:function(t,n,h){for(var s=[],m=0;m<h;m++)s.push(t[n+m]);return s},pad:function(t){return t.length<2?"0"+t:t},readUTF8:function(t,n,h){for(var s="",m,x=0;x<h;x++)s+="%"+i._bin.pad(t[n+x].toString(16));try{m=decodeURIComponent(s)}catch{return i._bin.readASCII(t,n,h)}return m}},i._copyTile=function(t,n,h,s,m,x,u,v,b){for(var c=Math.min(n,m),L=Math.min(h,x),B=0,d=0,g=0;g<L;g++)for(var A=0;A<c;A++)if(u>=0&&v>=0?(B=g*n+A<<2,d=(v+g)*m+u+A<<2):(B=(-v+g)*n-u+A<<2,d=g*m+A<<2),b==0)s[d]=t[B],s[d+1]=t[B+1],s[d+2]=t[B+2],s[d+3]=t[B+3];else if(b==1){var j=t[B+3]*.00392156862745098,U=t[B]*j,S=t[B+1]*j,y=t[B+2]*j,T=s[d+3]*(1/255),G=s[d]*T,z=s[d+1]*T,V=s[d+2]*T,N=1-j,O=j+T*N,D=O==0?0:1/O;s[d+3]=255*O,s[d+0]=(U+G*N)*D,s[d+1]=(S+z*N)*D,s[d+2]=(y+V*N)*D}else if(b==2){var j=t[B+3],U=t[B],S=t[B+1],y=t[B+2],T=s[d+3],G=s[d],z=s[d+1],V=s[d+2];j==T&&U==G&&S==z&&y==V?(s[d]=0,s[d+1]=0,s[d+2]=0,s[d+3]=0):(s[d]=U,s[d+1]=S,s[d+2]=y,s[d+3]=j)}else if(b==3){var j=t[B+3],U=t[B],S=t[B+1],y=t[B+2],T=s[d+3],G=s[d],z=s[d+1],V=s[d+2];if(j==T&&U==G&&S==z&&y==V)continue;if(j<220&&T>20)return!1}return!0},i.encode=function(t,n,h,s,m,x){s==null&&(s=0),x==null&&(x=!1);for(var u=new Uint8Array(t[0].byteLength*t.length+100),v=[137,80,78,71,13,10,26,10],b=0;b<8;b++)u[b]=v[b];var c=8,L=i._bin,B=i.crc.crc,d=L.writeUint,g=L.writeUshort,A=L.writeASCII,j=i.encode.compressPNG(t,n,h,s,x);d(u,c,13),c+=4,A(u,c,"IHDR"),c+=4,d(u,c,n),c+=4,d(u,c,h),c+=4,u[c]=j.depth,c++,u[c]=j.ctype,c++,u[c]=0,c++,u[c]=0,c++,u[c]=0,c++,d(u,c,B(u,c-17,17)),c+=4,d(u,c,1),c+=4,A(u,c,"sRGB"),c+=4,u[c]=1,c++,d(u,c,B(u,c-5,5)),c+=4;var U=t.length>1;if(U&&(d(u,c,8),c+=4,A(u,c,"acTL"),c+=4,d(u,c,t.length),c+=4,d(u,c,0),c+=4,d(u,c,B(u,c-12,12)),c+=4),j.ctype==3){var S=j.plte.length;d(u,c,S*3),c+=4,A(u,c,"PLTE"),c+=4;for(var b=0;b<S;b++){var y=b*3,T=j.plte[b],G=T&255,z=T>>8&255,V=T>>16&255;u[c+y+0]=G,u[c+y+1]=z,u[c+y+2]=V}if(c+=S*3,d(u,c,B(u,c-S*3-4,S*3+4)),c+=4,j.gotAlpha){d(u,c,S),c+=4,A(u,c,"tRNS"),c+=4;for(var b=0;b<S;b++)u[c+b]=j.plte[b]>>24&255;c+=S,d(u,c,B(u,c-S-4,S+4)),c+=4}}for(var N=0,O=0;O<j.frames.length;O++){var D=j.frames[O];U&&(d(u,c,26),c+=4,A(u,c,"fcTL"),c+=4,d(u,c,N++),c+=4,d(u,c,D.rect.width),c+=4,d(u,c,D.rect.height),c+=4,d(u,c,D.rect.x),c+=4,d(u,c,D.rect.y),c+=4,g(u,c,m[O]),c+=2,g(u,c,1e3),c+=2,u[c]=D.dispose,c++,u[c]=D.blend,c++,d(u,c,B(u,c-30,30)),c+=4);var J=D.cimg,S=J.length;d(u,c,S+(O==0?0:4)),c+=4;var W=c;A(u,c,O==0?"IDAT":"fdAT"),c+=4,O!=0&&(d(u,c,N++),c+=4);for(var b=0;b<S;b++)u[c+b]=J[b];c+=S,d(u,c,B(u,W,c-W)),c+=4}return d(u,c,0),c+=4,A(u,c,"IEND"),c+=4,d(u,c,B(u,c-4,4)),c+=4,u.buffer.slice(0,c)},i.encode.compressPNG=function(t,n,h,s,m){for(var x=i.encode.compress(t,n,h,s,!1,m),u=0;u<t.length;u++){var v=x.frames[u];v.rect.width;var b=v.rect.height,c=v.bpl,L=v.bpp,B=new Uint8Array(b*c+b);v.cimg=i.encode._filterZero(v.img,b,L,c,B)}return x},i.encode.compress=function(t,n,h,s,m,x){x==null&&(x=!1);for(var u=6,v=8,b=4,c=255,L=0;L<t.length;L++)for(var B=new Uint8Array(t[L]),d=B.length,g=0;g<d;g+=4)c&=B[g+3];var A=c!=255,j={},U=[];if(t.length!=0&&(j[0]=0,U.push(0),s!=0&&s--),s!=0){var S=i.quantize(t,s,m);t=S.bufs;for(var g=0;g<S.plte.length;g++){var y=S.plte[g].est.rgba;j[y]==null&&(j[y]=U.length,U.push(y))}}else for(var L=0;L<t.length;L++)for(var T=new Uint32Array(t[L]),d=T.length,g=0;g<d;g++){var y=T[g];if((g<n||y!=T[g-1]&&y!=T[g-n])&&j[y]==null&&(j[y]=U.length,U.push(y),U.length>=300))break}var G=A?m:!1,z=U.length;z<=256&&x==!1&&(z<=2?v=1:z<=4?v=2:z<=16?v=4:v=8,m&&(v=8),A=!0);for(var V=[],L=0;L<t.length;L++){var N=new Uint8Array(t[L]),O=new Uint32Array(N.buffer),D=0,J=0,W=n,K=h,Z=0;if(L!=0&&!G){for(var te=m||L==1||V[V.length-2].dispose==2?1:2,de=0,Ee=1e9,pe=0;pe<te;pe++){for(var Se=new Uint8Array(t[L-1-pe]),ge=new Uint32Array(t[L-1-pe]),re=n,X=h,Q=-1,me=-1,ie=0;ie<h;ie++)for(var $=0;$<n;$++){var g=ie*n+$;O[g]!=ge[g]&&($<re&&(re=$),$>Q&&(Q=$),ie<X&&(X=ie),ie>me&&(me=ie))}var Re=Q==-1?1:(Q-re+1)*(me-X+1);Re<Ee&&(Ee=Re,de=pe,Q==-1?(D=J=0,W=K=1):(D=re,J=X,W=Q-re+1,K=me-X+1))}var Se=new Uint8Array(t[L-1-de]);de==1&&(V[V.length-1].dispose=2);var se=new Uint8Array(W*K*4);new Uint32Array(se.buffer),i._copyTile(Se,n,h,se,W,K,-D,-J,0),i._copyTile(N,n,h,se,W,K,-D,-J,3)?(i._copyTile(N,n,h,se,W,K,-D,-J,2),Z=1):(i._copyTile(N,n,h,se,W,K,-D,-J,0),Z=0),N=se,O=new Uint32Array(N.buffer)}var we=4*W;if(z<=256&&x==!1){we=Math.ceil(v*W/8);for(var se=new Uint8Array(we*K),ie=0;ie<K;ie++){var g=ie*we,oe=ie*W;if(v==8)for(var $=0;$<W;$++)se[g+$]=j[O[oe+$]];else if(v==4)for(var $=0;$<W;$++)se[g+($>>1)]|=j[O[oe+$]]<<4-($&1)*4;else if(v==2)for(var $=0;$<W;$++)se[g+($>>2)]|=j[O[oe+$]]<<6-($&3)*2;else if(v==1)for(var $=0;$<W;$++)se[g+($>>3)]|=j[O[oe+$]]<<7-($&7)*1}N=se,u=3,b=1}else if(A==!1&&t.length==1){for(var se=new Uint8Array(W*K*3),q=W*K,g=0;g<q;g++){var ye=g*3,fe=g*4;se[ye]=N[fe],se[ye+1]=N[fe+1],se[ye+2]=N[fe+2]}N=se,u=2,b=3,we=3*W}V.push({rect:{x:D,y:J,width:W,height:K},img:N,bpl:we,bpp:b,blend:Z,dispose:G?1:0})}return{ctype:u,depth:v,plte:U,gotAlpha:A,frames:V}},i.encode._filterZero=function(t,n,h,s,m){for(var x=[],u=0;u<5;u++)if(!(n*s>5e5&&(u==2||u==3||u==4))){for(var v=0;v<n;v++)i.encode._filterLine(m,t,v,s,h,u);if(x.push(E.deflate(m)),h==1)break}for(var b,c=1e9,L=0;L<x.length;L++)x[L].length<c&&(b=L,c=x[L].length);return x[b]},i.encode._filterLine=function(t,n,h,s,m,x){var u=h*s,v=u+h,b=i.decode._paeth;if(t[v]=x,v++,x==0)for(var c=0;c<s;c++)t[v+c]=n[u+c];else if(x==1){for(var c=0;c<m;c++)t[v+c]=n[u+c];for(var c=m;c<s;c++)t[v+c]=n[u+c]-n[u+c-m]+256&255}else if(h==0){for(var c=0;c<m;c++)t[v+c]=n[u+c];if(x==2)for(var c=m;c<s;c++)t[v+c]=n[u+c];if(x==3)for(var c=m;c<s;c++)t[v+c]=n[u+c]-(n[u+c-m]>>1)+256&255;if(x==4)for(var c=m;c<s;c++)t[v+c]=n[u+c]-b(n[u+c-m],0,0)+256&255}else{if(x==2)for(var c=0;c<s;c++)t[v+c]=n[u+c]+256-n[u+c-s]&255;if(x==3){for(var c=0;c<m;c++)t[v+c]=n[u+c]+256-(n[u+c-s]>>1)&255;for(var c=m;c<s;c++)t[v+c]=n[u+c]+256-(n[u+c-s]+n[u+c-m]>>1)&255}if(x==4){for(var c=0;c<m;c++)t[v+c]=n[u+c]+256-b(0,n[u+c-s],0)&255;for(var c=m;c<s;c++)t[v+c]=n[u+c]+256-b(n[u+c-m],n[u+c-s],n[u+c-m-s])&255}}},i.crc={table:(function(){for(var t=new Uint32Array(256),n=0;n<256;n++){for(var h=n,s=0;s<8;s++)h&1?h=3988292384^h>>>1:h=h>>>1;t[n]=h}return t})(),update:function(t,n,h,s){for(var m=0;m<s;m++)t=i.crc.table[(t^n[h+m])&255]^t>>>8;return t},crc:function(t,n,h){return i.crc.update(4294967295,t,n,h)^4294967295}},i.quantize=function(t,n,h){for(var s=[],m=0,x=0;x<t.length;x++)s.push(i.encode.alphaMul(new Uint8Array(t[x]),h)),m+=t[x].byteLength;for(var u=new Uint8Array(m),v=new Uint32Array(u.buffer),b=0,x=0;x<s.length;x++){for(var c=s[x],L=c.length,B=0;B<L;B++)u[b+B]=c[B];b+=L}var d={i0:0,i1:u.length,bst:null,est:null,tdst:0,left:null,right:null};d.bst=i.quantize.stats(u,d.i0,d.i1),d.est=i.quantize.estats(d.bst);for(var g=[d];g.length<n;){for(var A=0,j=0,x=0;x<g.length;x++)g[x].est.L>A&&(A=g[x].est.L,j=x);if(A<.001)break;var U=g[j],S=i.quantize.splitPixels(u,v,U.i0,U.i1,U.est.e,U.est.eMq255),y={i0:U.i0,i1:S,bst:null,est:null,tdst:0,left:null,right:null};y.bst=i.quantize.stats(u,y.i0,y.i1),y.est=i.quantize.estats(y.bst);var T={i0:S,i1:U.i1,bst:null,est:null,tdst:0,left:null,right:null};T.bst={R:[],m:[],N:U.bst.N-y.bst.N};for(var x=0;x<16;x++)T.bst.R[x]=U.bst.R[x]-y.bst.R[x];for(var x=0;x<4;x++)T.bst.m[x]=U.bst.m[x]-y.bst.m[x];T.est=i.quantize.estats(T.bst),U.left=y,U.right=T,g[j]=y,g.push(T)}g.sort(function(te,de){return de.bst.N-te.bst.N});for(var G=0;G<s.length;G++){for(var z=i.quantize.planeDst,V=new Uint8Array(s[G].buffer),N=new Uint32Array(s[G].buffer),O=V.length,x=0;x<O;x+=4){for(var D=V[x]*.00392156862745098,J=V[x+1]*(1/255),W=V[x+2]*(1/255),K=V[x+3]*(1/255),Z=d;Z.left;)Z=z(Z.est,D,J,W,K)<=0?Z.left:Z.right;N[x>>2]=Z.est.rgba}s[G]=N.buffer}return{bufs:s,plte:g}},i.quantize.getNearest=function(t,n,h,s,m){if(t.left==null)return t.tdst=i.quantize.dist(t.est.q,n,h,s,m),t;var x=i.quantize.planeDst(t.est,n,h,s,m),u=t.left,v=t.right;x>0&&(u=t.right,v=t.left);var b=i.quantize.getNearest(u,n,h,s,m);if(b.tdst<=x*x)return b;var c=i.quantize.getNearest(v,n,h,s,m);return c.tdst<b.tdst?c:b},i.quantize.planeDst=function(t,n,h,s,m){var x=t.e;return x[0]*n+x[1]*h+x[2]*s+x[3]*m-t.eMq},i.quantize.dist=function(t,n,h,s,m){var x=n-t[0],u=h-t[1],v=s-t[2],b=m-t[3];return x*x+u*u+v*v+b*b},i.quantize.splitPixels=function(t,n,h,s,m,x){var u=i.quantize.vecDot;for(s-=4;h<s;){for(;u(t,h,m)<=x;)h+=4;for(;u(t,s,m)>x;)s-=4;if(h>=s)break;var v=n[h>>2];n[h>>2]=n[s>>2],n[s>>2]=v,h+=4,s-=4}for(;u(t,h,m)>x;)h-=4;return h+4},i.quantize.vecDot=function(t,n,h){return t[n]*h[0]+t[n+1]*h[1]+t[n+2]*h[2]+t[n+3]*h[3]},i.quantize.stats=function(t,n,h){for(var s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],m=[0,0,0,0],x=h-n>>2,u=n;u<h;u+=4){var v=t[u]*.00392156862745098,b=t[u+1]*(1/255),c=t[u+2]*(1/255),L=t[u+3]*(1/255);m[0]+=v,m[1]+=b,m[2]+=c,m[3]+=L,s[0]+=v*v,s[1]+=v*b,s[2]+=v*c,s[3]+=v*L,s[5]+=b*b,s[6]+=b*c,s[7]+=b*L,s[10]+=c*c,s[11]+=c*L,s[15]+=L*L}return s[4]=s[1],s[8]=s[2],s[12]=s[3],s[9]=s[6],s[13]=s[7],s[14]=s[11],{R:s,m,N:x}},i.quantize.estats=function(t){var n=t.R,h=t.m,s=t.N,m=h[0],x=h[1],u=h[2],v=h[3],b=s==0?0:1/s,c=[n[0]-m*m*b,n[1]-m*x*b,n[2]-m*u*b,n[3]-m*v*b,n[4]-x*m*b,n[5]-x*x*b,n[6]-x*u*b,n[7]-x*v*b,n[8]-u*m*b,n[9]-u*x*b,n[10]-u*u*b,n[11]-u*v*b,n[12]-v*m*b,n[13]-v*x*b,n[14]-v*u*b,n[15]-v*v*b],L=c,B=i.M4,d=[.5,.5,.5,.5],g=0,A=0;if(s!=0)for(var j=0;j<10&&(d=B.multVec(L,d),A=Math.sqrt(B.dot(d,d)),d=B.sml(1/A,d),!(Math.abs(A-g)<1e-9));j++)g=A;var U=[m*b,x*b,u*b,v*b],S=B.dot(B.sml(255,U),d),y=U[3]<.001?0:1/U[3];return{Cov:c,q:U,e:d,L:g,eMq255:S,eMq:B.dot(d,U),rgba:(Math.round(255*U[3])<<24|Math.round(255*U[2]*y)<<16|Math.round(255*U[1]*y)<<8|Math.round(255*U[0]*y)<<0)>>>0}},i.M4={multVec:function(t,n){return[t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3],t[4]*n[0]+t[5]*n[1]+t[6]*n[2]+t[7]*n[3],t[8]*n[0]+t[9]*n[1]+t[10]*n[2]+t[11]*n[3],t[12]*n[0]+t[13]*n[1]+t[14]*n[2]+t[15]*n[3]]},dot:function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]},sml:function(t,n){return[t*n[0],t*n[1],t*n[2],t*n[3]]}},i.encode.alphaMul=function(t,n){for(var h=new Uint8Array(t.length),s=t.length>>2,m=0;m<s;m++){var x=m<<2,u=t[x+3];n&&(u=u<128?0:255);var v=u*(1/255);h[x+0]=t[x+0]*v,h[x+1]=t[x+1]*v,h[x+2]=t[x+2]*v,h[x+3]=u}return h}})(r,f)})()})(Tr)),Tr.exports}ln();async function un(w,r){const f=new Blob([w],{type:r});return await createImageBitmap(f,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}const Or={KHR_texture_transform:"KHR_texture_transform",KHR_materials_transmission:"KHR_materials_transmission"};class vr{offset;rotation;scale;texcoord;constructor(r){this.offset=r.offset??[0,0],this.rotation=r.rotation??0,this.scale=r.scale??[1,1],this.texcoord=r.texCoord}get data(){return{offset:this.offset,rotation:this.rotation,scale:this.scale}}static getDefaultData(){return{offset:[0,0],rotation:0,scale:[1,1]}}}class cn{factor;texture;constructor(r){this.factor=r.transmissionFactor,r.transmissionTexture!=null&&(this.texture=new Mt(r.transmissionTexture))}}function Br(w){return ir(w[0],w[1],w[2])}function pt(w){const r=qe();return fr(r,w),Dt(r,r),r}function Ln(w,r){return Ut(ar(),w,r)}function Dn(w,r){return Ot(ar(),w,r)}function On(w,r){return Tt(ar(),w,r)}function Un(w){return Pr(ar(),w)}var Ur=`override MAX_LIGHTS: u32 = 10u;

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
}\r
const PI: f32 = 3.14159265359;

fn u32bool(u:u32) -> bool {\r
    return u != 0u;\r
}\r
fn tonemapACES(color: vec3<f32>) -> vec3<f32> {\r
    
    let a: f32 = 2.51;\r
    let b: f32 = 0.03;\r
    let c: f32 = 2.43;\r
    let d: f32 = 0.59;\r
    let e: f32 = 0.14;

    return clamp(\r
        (color * (a * color + vec3<f32>(b))) /\r
        (color * (c * color + vec3<f32>(d)) + vec3<f32>(e)),\r
        vec3<f32>(0.0),\r
        vec3<f32>(1.0)\r
    );\r
}

struct TextureTransform {\r
    offset: vec2f,\r
    rotation: f32,\r
    scale: vec2f\r
};

struct TextureInfo {\r
    hasTexture: u32,\r
    hasTextureTransform: u32,\r
    textureTransform: TextureTransform\r
};

struct PbrMaterialUniform {\r
    baseColorFactor: vec4f,\r
    baseColorTexture: TextureInfo,\r
    metallicFactor: f32,\r
    roughnessFactor: f32,\r
    metallicRoughnessTexture: TextureInfo,\r
    normalScale: f32,\r
    normalTexture: TextureInfo,\r
    emmissiveFactor: vec3f,\r
    emmissiveTexture: TextureInfo,\r
    occlusionStrength: f32,\r
    occlusionTexture: TextureInfo,\r
    alphaMode: u32,\r
    alphaCutoff: f32,

    hasTransmission: u32,\r
    transmissionFactor: f32\r
    
};

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

fn textureTransform(texcoord: vec2f, transform: TextureTransform)-> vec2f {\r
    let R = transform.rotation;\r
    let translation = mat3x3f(1,0,0, 0,1,0, transform.offset.x, transform.offset.y, 1);\r
    let rotation = mat3x3f(\r
        cos(R), sin(R), 0,\r
       -sin(R), cos(R), 0,\r
        0,             0, 1\r
    );\r
    let scale = mat3x3f(transform.scale.x,0,0, 0, transform.scale.y,0, 0,0,1);\r
    let matrix = translation * rotation * scale;\r
    let uvTransformed = ( matrix * vec3f(texcoord.xy, 1) ).xy;\r
    return uvTransformed;\r
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
    if(u32bool(pbrMaterial.baseColorTexture.hasTexture)) {\r
        cbase = gamma(textureSample(\r
                baseColorTexture, \r
                baseColorSampler, \r
                baseColorTexcoord));\r
    }

    var metallic: f32 = pbrMaterial.metallicFactor;\r
    var roughness: f32 = pbrMaterial.roughnessFactor;\r
    if(u32bool(pbrMaterial.metallicRoughnessTexture.hasTexture)) {\r
        let metallicRoughness = textureSample(\r
        metallicRoughnessTexture, \r
        metallicRoughnessSampler, \r
        metallicRoughnessTexcoord);\r
        metallic = metallicRoughness.b;\r
        roughness = metallicRoughness.g;\r
    }

    var newNormal: vec3f = normal;\r
    if(u32bool(pbrMaterial.normalTexture.hasTexture)) {\r
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
    if(u32bool(pbrMaterial.emmissiveTexture.hasTexture)) {\r
        emmissive = gamma(textureSample(\r
            emmissiveTexture, \r
            emmissiveSampler, \r
            emmissiveTexcoord));\r
        emmissive = emmissive * vec4f(pbrMaterial.emmissiveFactor,1.0);\r
    }

    var occlusion:f32 = 1.0;\r
    if(u32bool(pbrMaterial.occlusionTexture.hasTexture)) {\r
        let aosample = textureSample(\r
            occlusionTexture, \r
            occlusionSampler, \r
            occlusionTexcoord).r;\r
        occlusion = mix(1.0, aosample, pbrMaterial.occlusionStrength);;\r
    }

    let pbrcolor = getPbrColor(\r
        cbase,\r
        occlusion,\r
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

    if(u32bool(pbrMaterial.hasTransmission)) {\r
        finalColor.a = (1.0 - pbrMaterial.transmissionFactor) * cbase.a;\r
    } else {\r
        finalColor.a = cbase.a;\r
    }

    return finalColor;

}

fn getPbrColor(\r
    cbase: vec4f,\r
    occlusion: f32,\r
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

    var indirectColor = vec4f(0,0,0,0);

    if(u32bool(scene.ibl.canIBL)) {\r
        let iblcolor = computeIBLColor(cbase.rgb, vnormal, veye, metallic, roughness);\r
        indirectColor += vec4f(iblcolor, 1.0);\r
    }\r
    indirectColor = indirectColor * occlusion;

    var directColor = vec4f(0,0,0,0);

    for(var i=0u; i<nlights; i=i+1u) {\r
        let plight = lights[i].position;\r
        let clight = lights[i].color;\r
        let vlight = normalize(plight - surfpos);\r
        let vhalf = normalize(vlight + veye);\r
        directColor += computePbrColorOneLight(cbase, clight, metallic, roughness, vnormal, veye, vlight, vhalf);\r
    }

    return indirectColor + directColor;

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

    
    let f0 = computeF0(cbase.rgb, metallic);\r
    let cdiff = mix(cbase.rgb, vec3f(0.0), metallic);\r
    let fdiff = cdiff / PI;

    
    let D = ndf(a2, n_dot_h);\r
    let F = fresnel(f0, v_dot_h);\r
    \r
    
    let lg = n_dot_l * sqrt(n_dot_v * n_dot_v * (1.0 - a2) + a2);\r
    let vg = n_dot_v * sqrt(n_dot_l * n_dot_l * (1.0 - a2) + a2);\r
    let V = 0.5 / (lg + vg + 1e-7); 

    let fspec = D * F * V;

    
    
    let color = (fdiff + fspec) * clight.rgb * n_dot_l;

    return vec4f(color.rgb, cbase.a); 
}

fn computeF0(cbase: vec3f, metallic: f32) -> vec3f {\r
    return mix(vec3f(0.04, 0.04, 0.04), cbase, metallic);\r
}

fn ndf(alpha2: f32, n_dot_h: f32) -> f32 {\r
    let denom = (n_dot_h * n_dot_h * (alpha2 - 1.0) + 1.0);\r
    return alpha2 / (PI * denom * denom + 1e-7); 
}

fn fresnel(f0: vec3f, v_dot_h: f32) -> vec3f {\r
    return f0 + (vec3f(1.0) - f0) * pow(clamp(1.0 - v_dot_h, 0.0, 1.0), 5.0);\r
}

fn computeIBLColor(c:vec3f, n: vec3f, v:vec3f, m: f32, r:f32) -> vec3f {\r
    let diffuse = iblDiffuse(n,c,m);\r
    let f0 = computeF0(c, m);\r
    let specular = iblSpecular(f0,n,v,r);\r
    var color = diffuse + specular;\r
    color = tonemapACES(color);\r
    return color;\r
}

fn iblDiffuse(n: vec3f, c: vec3f, m: f32) -> vec3f {\r
    let irradiance = shIrradiance(n);\r
    let diffuse = irradiance * c * (1.0 - m);\r
    return diffuse;\r
}

fn shIrradiance(n: vec3<f32>) -> vec3<f32> {

    let sh = scene.ibl.sh;

    
    let x = n.x;\r
    let y = n.y;\r
    let z = n.z;

    
    
    
    \r
    var irradiance = vec3<f32>(0.0);

    
    irradiance += sh[0].rgb;

    
    irradiance += sh[1].rgb * y;\r
    irradiance += sh[2].rgb * z;\r
    irradiance += sh[3].rgb * x;

    
    irradiance += sh[4].rgb * (x * y);\r
    irradiance += sh[5].rgb * (y * z);\r
    irradiance += sh[6].rgb * (3.0 * z * z - 1.0);\r
    irradiance += sh[7].rgb * (x * z);\r
    irradiance += sh[8].rgb * (x * x - y * y);

    
    
    
    return max(irradiance, vec3<f32>(0.0));\r
}

fn iblSpecular(f0: vec3f, n: vec3f, v:vec3f, r: f32) -> vec3f {

    let maxLod = f32(textureNumLevels(prefilterTexture) - 1u);\r
    let lod = r * maxLod;\r
    let R = reflect(-v, n);

    
    let ld = textureSampleLevel(\r
        prefilterTexture, \r
        prefilterSampler, \r
        R, \r
        lod\r
    ).rgb;\r
    let lut = iblLUT(n,v,r);\r
    let scale = lut.r;\r
    let bias = lut.g;\r
    let brdf = (f0 * scale + bias);\r
    let specular = ld * brdf;

    return specular;\r
}

fn iblLUT(n: vec3f, v:vec3f, r: f32) -> vec2f {\r
    let tx = saturate(dot(n,v));\r
    let ty = 1.0 - r;\r
    let uv = vec2f(tx, ty);\r
    let lut = textureSample(\r
        lutTexture,\r
        lutSampler,\r
        uv\r
    );\r
    return lut.rg;\r
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
    let worldpos = scene.worldmtx * model.modelmtx * vec4f(input.position, 1.0);\r
    let ndcpos = scene.projection.projmtx * scene.camera.viewmtx * worldpos;\r
    var output: VSOutput;\r
    output.position = ndcpos;\r
    output.worldpos = worldpos.xyz;\r
    output.normal = (scene.worldmtx *model.normalmtx * vec4f(input.normal,0.0)).xyz;\r
    var tangent4 = vec4f(input.tangent.xyz,0.0);\r
    tangent4 = scene.worldmtx * model.normalmtx * tangent4;\r
    tangent4.w = input.tangent.w;\r
    output.tangent = tangent4;\r
    output.baseColorTexcoord = getTexcoord(input, model.texcoordOrder.baseColor);\r
    output.metallicRoughnessTexcoord = getTexcoord(input, model.texcoordOrder.metallicRoughness);\r
    output.normalTexcoord = getTexcoord(input, model.texcoordOrder.normal);\r
    output.emmissiveTexcoord = getTexcoord(input, model.texcoordOrder.emmissive);\r
    output.occlusionTexcoord = getTexcoord(input, model.texcoordOrder.occlusion);

    if(u32bool(pbrMaterial.baseColorTexture.hasTextureTransform)) {\r
        output.baseColorTexcoord = textureTransform(\r
            output.normalTexcoord,\r
            pbrMaterial.baseColorTexture.textureTransform);\r
    }\r
    if(u32bool(pbrMaterial.metallicRoughnessTexture.hasTextureTransform)) {\r
        output.metallicRoughnessTexcoord = textureTransform(\r
            output.metallicRoughnessTexcoord,\r
            pbrMaterial.metallicRoughnessTexture.textureTransform);\r
    }\r
    if(u32bool(pbrMaterial.normalTexture.hasTextureTransform)) {\r
        output.normalTexcoord = textureTransform(\r
            output.normalTexcoord,\r
            pbrMaterial.normalTexture.textureTransform);\r
    }\r
    if(u32bool(pbrMaterial.emmissiveTexture.hasTextureTransform)) {\r
        output.emmissiveTexcoord = textureTransform(\r
            output.emmissiveTexcoord,\r
            pbrMaterial.emmissiveTexture.textureTransform);\r
    }\r
    if(u32bool(pbrMaterial.occlusionTexture.hasTextureTransform)) {\r
        output.occlusionTexcoord = textureTransform(\r
            output.occlusionTexcoord,\r
            pbrMaterial.occlusionTexture.textureTransform);\r
    }\r
    return output;\r
}

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {

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

}`;function Pn(w){return Object.keys(w).length}function Nn(w,r,f){return Math.min(Math.max(w,r),f)}function dr(w,r="Value must not be null or undefined"){if(w==null)throw new Error(r)}function jn(w,r){return Math.random()*(r-w)+w}class Lr{options;context;scene;definition;pipeline;constructor(r){this.options=r}static getAttributeOptions(r,f,i){const E=i in f.json.attributes;let t=0,n=0;if(E){const h=f.getAssessor(i);n=f.getBufferView(i).byteStride??h.getElementBytes(),t=0}else n=0,t=0;return{exists:E,stride:n,offset:t}}static getMultiAttributeOptions(r,f,i){return Object.keys(f.json.attributes).filter(E=>E.startsWith(i)).map(E=>{const t=f.json.attributes[E],n=r.assessors[t];return{exists:!0,stride:r.bufferViews[n.json.bufferView].byteStride??n.getElementBytes(),offset:0}})}static attributeKey(r,f){return f.exists?`${r}:T:${f.stride}:${f.offset}`:`${r}:F`}static multiAttributeKey(r,f){return f.map(i=>this.attributeKey(r,i)).join(",")}static getPipelineOptionsOfPrimitive(r,f){const i=f.getMeterial();return{mode:f.getMode(),indices:f.hasIndicies(),position:this.getAttributeOptions(r,f,Ue.POSITION),normal:this.getAttributeOptions(r,f,Ue.NORMAL),tangent:this.getAttributeOptions(r,f,Ue.TANGENT),texoord:this.getMultiAttributeOptions(r,f,Ue.TEXCOORD),joints:this.getMultiAttributeOptions(r,f,Ue.JOINTS),weights:this.getMultiAttributeOptions(r,f,Ue.WEIGHTS),morph:f.hasMorph(),colorTexutre:i.hasTexture(Pe.BaseColor),metalTexture:i.hasTexture(Pe.MetallicRoughness),normalTexture:i.hasTexture(Pe.Normal),emmissiveTexture:i.hasTexture(Pe.Emmissive),occlusionTexture:i.hasTexture(Pe.Occlusion),alphaMode:i.getAlphaMode(),doubleSided:i.getDoubleSided(),transmission:i.transmission!=null}}static getPipelineKeyOfOptions(r){function f(t,n){return n?`${t}:T`:`${t}:F`}return[r.mode,this.attributeKey("pos",r.position),this.attributeKey("nor",r.normal),this.attributeKey("tan",r.tangent),this.multiAttributeKey("tex",r.texoord),this.multiAttributeKey("jot",r.joints),this.multiAttributeKey("wgt",r.weights),f("mor",r.morph),r.alphaMode,f("dbs",r.doubleSided)].join("|")}getBlend(){if(this.options.alphaMode==="BLEND"||this.options.transmission)return{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}getCullMode(){return this.options.doubleSided?"none":"back"}getDepthWriteEnabled(){return this.options.alphaMode!=="BLEND"}createPipeline(r,f){this.context=r,this.scene=f;const i="gltf",E=this.context.device;this.definition=jr(Ur);const t=E.createShaderModule({label:i,code:Ur}),n=E.createBindGroupLayout({label:i,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=E.createPipelineLayout({label:i,bindGroupLayouts:[this.scene.bindGroupLayout,nr.getBindGroupLayout(E),n]});let s=0;const m=[];m.push({arrayStride:this.options.position.stride,attributes:[{shaderLocation:s++,offset:0,format:"float32x3"}]}),m.push({arrayStride:this.options.normal.stride,attributes:[{shaderLocation:s++,offset:0,format:"float32x3"}]}),m.push({arrayStride:this.options.tangent.stride,attributes:[{shaderLocation:s++,offset:0,format:"float32x3"}]});for(let u=0;u<5;++u){const v=this.options.texoord[u];m.push({arrayStride:v?.stride??8,attributes:[{shaderLocation:s++,offset:0,format:"float32x2"}]})}const x=E.createRenderPipeline({label:i,layout:h,vertex:{module:t,buffers:m},fragment:{module:t,targets:[{format:this.context.canvas.context.getConfiguration().format,blend:this.getBlend()}]},primitive:{topology:"triangle-list",cullMode:this.getCullMode(),frontFace:"ccw"},depthStencil:{depthWriteEnabled:this.getDepthWriteEnabled(),format:"depth32float",depthCompare:"less-equal"}});this.pipeline=x}}class xr{static pipelines={};webgpu;constructor(r,f){this.webgpu={context:r,scene:f}}render(r){const f=r.sceneRef??r.gltf.json.scene,i=r.gltf.scenes[f],E=[];this.preRenderScene(i,r,E);const t=[],n=[];for(const h of E)h.primitive.getMeterial().getAlphaMode()==="BLEND"?t.push(h):n.push(h);n.forEach(h=>{this.renderPrimitive(h.matrix,h.primitive,r)}),t.forEach(h=>{this.renderPrimitive(h.matrix,h.primitive,r)})}preRenderScene(r,f,i){for(const E of r.nodes){const t=f.gltf.nodes[E];this.preRenderNode(t,f.matrix??qe(),f,i)}}preRenderNode(r,f,i,E){if(!r.enabled)return;const t=Pt(qe(),f,r.matrix);if(r.children!=null)for(const n of r.children){const h=i.gltf.nodes[n];this.preRenderNode(h,t,i,E)}if(r.camera!=null,r.skin!=null,r.mesh!=null){const n=i.gltf.meshes[r.mesh];this.preRenderMesh(n,t,i,E)}}preRenderMesh(r,f,i,E){if(r.enabled)for(const t of r.primitives)E.push({primitive:t,matrix:f})}renderPrimitive(r,f,i){const E=Lr.getPipelineOptionsOfPrimitive(i.gltf,f),t=Lr.getPipelineKeyOfOptions(E);let n;t in xr.pipelines?(n=xr.pipelines[t],n.pipeline==null&&n.createPipeline(this.webgpu.context,this.webgpu.scene)):(n=new Lr(E),n.createPipeline(this.webgpu.context,this.webgpu.scene),xr.pipelines[t]=n);const h=this.webgpu.context.device,s=Nr(n.definition.uniforms.model),m=f.getGPUMaterialTexCoordMap();f.webgpu.uniform==null&&(f.webgpu.uniform=this.createModelUniform(h,s));const x={modelmtx:r,normalmtx:pt(r),tangentmtx:pt(r),hasTangent:f.hasTangent()?1:0,texcoordOrder:{baseColor:m.baseColor??0,metallicRoughness:m.metallicRoughness??0,normal:m.normal??0,emmissive:m.emmissive??0,occlusion:m.occlusion??0}};s.set(x),h.queue.writeBuffer(f.webgpu.uniform,0,s.arrayBuffer);const u=h.createBindGroup({label:"primitive",layout:n.pipeline.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:f.webgpu.uniform}}]});let v=null;if(f.hasIndicies()&&(v=this.getPrimitiveIndexBuffer(h,f),v==null))return;let b=null;if(f.hasPosition()&&(b=this.getPrimitiveAttributeBuffer(h,f,Ue.POSITION),b==null))return;let c=null;f.hasNormal()&&(c=this.getPrimitiveAttributeBuffer(h,f,Ue.NORMAL));let L=null;f.hasTangent()&&(L=this.getPrimitiveAttributeBuffer(h,f,Ue.TANGENT));const B=f.getOrderedTexcoordAttrName(),d=[];for(let g=0;g<5;++g){const A=B[g];if(A!=null){const j=parseInt(A.split("_")[1]);d.push(this.getPrimitiveAttributeBuffer(h,f,Ue.TEXCOORD,j))}else d.push(null)}i.pass.setPipeline(n.pipeline),i.pass.setVertexBuffer(0,b.buffer,b.offset,b.size),c!=null?i.pass.setVertexBuffer(1,c.buffer,c.offset,c.size):i.pass.setVertexBuffer(1,f.getDefaultVec3FloatGPUBuffer(h)),L!=null?i.pass.setVertexBuffer(2,L.buffer,L.offset,L.size):i.pass.setVertexBuffer(2,f.getDefaultVec4FloatGPUBuffer(h));for(let g=0;g<5;++g){const A=d[g];A!=null?i.pass.setVertexBuffer(3+g,A.buffer,A.offset,A.size):i.pass.setVertexBuffer(3+g,f.getDefaultVec2FloatGPUBuffer(h))}i.pass.setBindGroup(0,this.webgpu.scene.bindGroup),i.pass.setBindGroup(1,f.getMeterial().getGPUMaterial(h).getBindGroup(h)),i.pass.setBindGroup(2,u),f.hasIndicies()?(i.pass.setIndexBuffer(v.buffer,v.format,v.offset,v.size),i.pass.drawIndexed(v.count)):i.pass.draw(b.count)}getGPUIndexFormat(r){switch(r.json.componentType){case cr.UNSIGNED_BYTE:return"uint16";case cr.UNSIGNED_SHORT:return"uint16";case cr.UNSIGNED_INT:return"uint32"}}getPrimitiveIndexBuffer(r,f){const i=f.gltf.assessors[f.json.indices],E=f.gltf.bufferViews[i.json.bufferView],t=f.gltf.buffers[E.json.buffer],n=i.json.componentType,h=this.getGPUIndexFormat(i);if(n!==cr.UNSIGNED_BYTE){const s=i.json.byteOffset??0,m=E.json.byteOffset??0,x=E.byteLength,u=s+m,v=x-s,b=i.json.count,c=t.getGPUBuffer(r,GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST);return c==null?null:{buffer:c,format:h,offset:u,size:v,count:b}}else throw Error("Index Format 当前不支持uint8")}getPrimitiveAttributeBuffer(r,f,i,E){let t;E!=null?t=`${i}_${E}`:t=i;const n=f.json.attributes[t];dr(n);const h=f.gltf.assessors[n];dr(h);const s=f.gltf.bufferViews[h.json.bufferView];dr(s);const m=f.gltf.buffers[s.json.buffer];dr(m);const x=h.json.byteOffset??0,u=s.json.byteOffset??0,v=s.byteLength,b=x+u,c=v-x,L=h.json.count,B=m.getGPUBuffer(r,GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST);return B==null?null:{buffer:B,offset:b,size:c,count:L}}createModelUniform(r,f){return r.createBuffer({label:"model uniform",size:f.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}}const hn={OPAQUE:0,MASK:1,BLEND:2};class nr{material;static bindgroupLayout;bindgroup;webgpu={};static defaultTexture;static defaultSampler;constructor(r){this.material=r}static getBindGroupLayout(r){if(!nr.bindgroupLayout){const f=GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,i={sampleType:"float",viewDimension:"2d",multisampled:!1},E={type:"filtering"},t=r.createBindGroupLayout({label:"GLTFGPUMaterial",entries:[{binding:0,visibility:f,buffer:{type:"uniform"}},{binding:1,visibility:f,texture:i},{binding:2,visibility:f,sampler:E},{binding:3,visibility:f,texture:i},{binding:4,visibility:f,sampler:E},{binding:5,visibility:f,texture:i},{binding:6,visibility:f,sampler:E},{binding:7,visibility:f,texture:i},{binding:8,visibility:f,sampler:E},{binding:9,visibility:f,texture:i},{binding:10,visibility:f,sampler:E}]});nr.bindgroupLayout=t}return nr.bindgroupLayout}getBindGroup(r){if(!this.bindgroup||!this.material.isTextureReady()){const f=r.createBindGroup({label:"GLTFGPUMaterial",layout:nr.getBindGroupLayout(r),entries:[{binding:0,resource:{buffer:this.getUniform(r)}},{binding:1,resource:this.material.getGPUTexture(r,this.material.baseColor.texture)},{binding:2,resource:this.material.getGPUSampler(r,this.material.baseColor.texture)},{binding:3,resource:this.material.getGPUTexture(r,this.material.pbr.texture)},{binding:4,resource:this.material.getGPUSampler(r,this.material.pbr.texture)},{binding:5,resource:this.material.getGPUTexture(r,this.material.normal.texture)},{binding:6,resource:this.material.getGPUSampler(r,this.material.normal.texture)},{binding:7,resource:this.material.getGPUTexture(r,this.material.emmissive.texture)},{binding:8,resource:this.material.getGPUSampler(r,this.material.emmissive.texture)},{binding:9,resource:this.material.getGPUTexture(r,this.material.occlusion.texture)},{binding:10,resource:this.material.getGPUSampler(r,this.material.occlusion.texture)}]});this.bindgroup=f}return this.bindgroup}getUniform(r){if(!this.webgpu.uniform){const f=jr(Ur),i=Nr(f.uniforms.pbrMaterial),E=r.createBuffer({label:"pbrMaterial",size:i.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),t={baseColorFactor:this.material.baseColor.factor,baseColorTexture:{hasTexture:Ze(this.material.hasTexture(Pe.BaseColor)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.BaseColor)),textureTransform:this.material.getTextureTransformData(Pe.BaseColor)},metallicFactor:this.material.pbr.metallic,roughnessFactor:this.material.pbr.roughness,metallicRoughnessTexture:{hasTexture:Ze(this.material.hasTexture(Pe.MetallicRoughness)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.MetallicRoughness)),textureTransform:this.material.getTextureTransformData(Pe.MetallicRoughness)},normalScale:this.material.normal.scale,normalTexture:{hasTexture:Ze(this.material.hasTexture(Pe.Normal)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.Normal)),textureTransform:this.material.getTextureTransformData(Pe.Normal)},emmissiveFactor:this.material.emmissive.factor,emmissiveTexture:{hasTexture:Ze(this.material.hasTexture(Pe.Emmissive)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.Emmissive)),textureTransform:this.material.getTextureTransformData(Pe.Emmissive)},occlusionStrength:this.material.occlusion.strength,occlusionTexture:{hasTexture:Ze(this.material.hasTexture(Pe.Occlusion)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.Occlusion)),textureTransform:this.material.getTextureTransformData(Pe.Occlusion)},alphaMode:hn[this.material.getAlphaMode()],alphaCutoff:this.material.getAlphaCutoff(),hasTransmission:Ze(this.material.transmission!=null),transmissionFactor:this.material.transmission!=null?this.material.transmission.factor:0};i.set(t),r.queue.writeBuffer(E,0,i.arrayBuffer),this.webgpu.uniform=E}return this.webgpu.uniform}destroy(){this.webgpu.uniform?.destroy(),this.webgpu.uniform=null}}class dn{ref;gltf;json;nodes;constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i,this.nodes=i.nodes}}class vn{gltf;ref;json;matrix=qe();children;camera;skin;mesh;#t=!0;constructor(r,f,i){if(this.gltf=r,this.ref=f,this.json=i,this.json.children&&(this.children=i.children),this.json.matrix)this.matrix=yt(...this.json.matrix);else if(this.json.translation){const E=this.json.translation??[0,0,0],t=this.json.rotation??[0,0,0,1],n=this.json.scale??[1,1,1];this.matrix=Nt(qe(),Yt(t[0],t[1],t[2],t[3]),ir(E[0],E[1],E[2]),ir(n[0],n[1],n[2]))}this.camera=this.json.camera,this.mesh=this.json.mesh,this.skin=this.json.skin}get enabled(){return this.#t}enable(){this.#t=!0}disable(){this.#t=!1}switch(){this.#t=!this.#t}}class xn{gltf;ref;json;primitives;#t=!0;disable(){this.#t=!1}enable(){this.#t=!0}get enabled(){return this.#t}constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i,this.primitives=this.json.primitives.map((E,t)=>new gn(r,this,t))}}const Ue={POSITION:"POSITION",NORMAL:"NORMAL",TANGENT:"TANGENT",TEXCOORD:"TEXCOORD",JOINTS:"JOINTS",WEIGHTS:"WEIGHTS"};class gn{gltf;ref;mesh;json;mode;indices;webgpu={};constructor(r,f,i){this.gltf=r,this.ref=i,this.mesh=f,this.json=f.json.primitives[i],this.mode=this.json.mode,this.indices=this.json.indices}getVertexCount(){return this.getAssessor(Ue.POSITION).count}getMode(){return this.mode}getMeterial(){return this.gltf.getMaterial(this.json.material)}hasIndicies(){return!!this.indices}hasPosition(){return Ue.POSITION in this.json.attributes}hasNormal(){return Ue.NORMAL in this.json.attributes}hasTangent(){return Ue.TANGENT in this.json.attributes}hasTexcoord(r=0){return`${Ue.TEXCOORD}_${r}`in this.json.attributes}numTexcoord(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.TEXCOORD)).length}hasJoints(r=0){return`${Ue.JOINTS}_${r}`in this.json.attributes}numJoints(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.JOINTS)).length}hasWeights(r=0){return`${Ue.WEIGHTS}_${r}`in this.json.attributes}numWeights(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.WEIGHTS)).length}hasMorph(){return!!this.json.targets}getAssessor(r,f){const i=f?`${r}_${f}`:r,E=this.json.attributes[i];return E==null?null:this.gltf.assessors[E]}getBufferView(r,f){const i=this.getAssessor(r,f);return i==null?null:this.gltf.bufferViews[i.json.bufferView]??null}getOrderedTexcoordAttrName(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.TEXCOORD)).sort((r,f)=>{const i=parseInt(r.split("_")[1]),E=parseInt(f.split("_")[1]);return i-E})}getGPUMaterialTexCoordMap(){const r=this.gltf.materials[this.json.material];if(r){const f=this.getTexCoordOrderMap(),i=r.getTexcoordIndexMap(),E=Object.entries(i).map(([t,n])=>{const h=f[n];return[t,h]});return Object.fromEntries(E)}return{}}getTexCoordOrderMap(){const r=Object.keys(this.json.attributes).filter(f=>f.startsWith(Ue.TEXCOORD)).map(f=>parseInt(f.split("_")[1])).sort().map((f,i)=>[f,i]);return Object.fromEntries(r)}getDefaultVec4FloatGPUBuffer(r){if(this.webgpu.defaultVec4FloatBuffer!=null)return this.webgpu.defaultVec4FloatBuffer;const i=16*this.getVertexCount(),E=new ArrayBuffer(i),t=r.createBuffer({label:"primitive default vec4f buffer",size:i,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,E),this.webgpu.defaultVec4FloatBuffer=t,t}getDefaultVec3FloatGPUBuffer(r){if(this.webgpu.defaultVec3FloatBuffer!=null)return this.webgpu.defaultVec3FloatBuffer;const i=12*this.getVertexCount(),E=new ArrayBuffer(i),t=r.createBuffer({label:"primitive default vec3f buffer",size:i,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,E),this.webgpu.defaultVec3FloatBuffer=t,t}getDefaultVec2FloatGPUBuffer(r){if(this.webgpu.defaultVec2FloatBuffer!=null)return this.webgpu.defaultVec2FloatBuffer;const i=8*this.getVertexCount(),E=new ArrayBuffer(i),t=r.createBuffer({label:"primitive default vec2f buffer",size:i,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,E),this.webgpu.defaultVec2FloatBuffer=t,t}}const Ke={NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987},Dr={NEAREST:9728,LINEAR:9729},We={REPEAT:10497,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648},mn={label:"gltf default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"};class _n{gltf;ref;json;webgpu={};getImage(){return this.gltf.images[this.json.source]??null}constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i}getGPUTexture(r){if(this.webgpu.texture!=null)return this.webgpu.texture;const f=this.gltf.images[this.json.source];if(f==null)return null;if(f.loadImage(),f.status===lr.READY){const i=f.image,E=jt(r,i,{mips:this.needMipmap(),format:"rgba8unorm",size:[i.width,i.height,1]});this.webgpu.texture=E}else return null}needMipmap(){const r=this.gltf.samplers[this.json.sampler];return r==null?!1:r.needMipmap()}getGPUSampler(r){if(this.webgpu.sampler!=null)return this.webgpu.sampler;{const f=this.gltf.samplers[this.json.sampler];return f==null?this.webgpu.sampler=r.createSampler(mn):this.webgpu.sampler=f.getGPUSampler(r),this.webgpu.sampler}}destroy(){this.webgpu.texture?.destroy(),this.webgpu.texture=null}}class pn{gltf;ref;json;minFilter;magFilter;wrapS;wrapT;webgpu={};constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i,this.minFilter=this.json.minFilter??Ke.LINEAR,this.magFilter=this.json.magFilter??Dr.LINEAR,this.wrapS=this.json.wrapS??We.REPEAT,this.wrapT=this.json.wrapT??We.REPEAT}needMipmap(){return this.minFilter===Ke.NEAREST_MIPMAP_NEAREST||this.minFilter===Ke.LINEAR_MIPMAP_NEAREST||this.minFilter===Ke.NEAREST_MIPMAP_LINEAR||this.minFilter===Ke.LINEAR_MIPMAP_LINEAR}getGPUSamplerDescriptor(){const r={label:"gltf sampler"};switch(this.minFilter){case Ke.NEAREST:r.minFilter="nearest";break;case Ke.LINEAR:r.minFilter="linear";break;case Ke.NEAREST_MIPMAP_NEAREST:r.minFilter="nearest",r.mipmapFilter="nearest";break;case Ke.LINEAR_MIPMAP_NEAREST:r.minFilter="linear",r.mipmapFilter="nearest";break;case Ke.NEAREST_MIPMAP_LINEAR:r.minFilter="nearest",r.mipmapFilter="linear";break;case Ke.LINEAR_MIPMAP_LINEAR:r.minFilter="linear",r.mipmapFilter="linear";break}switch(this.magFilter){case Dr.NEAREST:r.magFilter="nearest";break;case Dr.LINEAR:r.magFilter="linear";break}switch(this.wrapS){case We.REPEAT:r.addressModeU="repeat";break;case We.CLAMP_TO_EDGE:r.addressModeU="clamp-to-edge";break;case We.MIRRORED_REPEAT:r.addressModeU="mirror-repeat"}switch(this.wrapT){case We.REPEAT:r.addressModeV="repeat";break;case We.CLAMP_TO_EDGE:r.addressModeV="clamp-to-edge";break;case We.MIRRORED_REPEAT:r.addressModeV="mirror-repeat"}return r}getGPUSampler(r){if(this.webgpu.sampler==null){const f=this.getGPUSamplerDescriptor();this.webgpu.sampler=r.createSampler(f)}return this.webgpu.sampler}}class Mt{textureRef=0;texcoordRef;textureTransform;ready=!1;constructor(r){r!=null&&(this.textureRef=r.index,this.texcoordRef=r.texCoord??0,r.extensions!=null&&Or.KHR_texture_transform in r.extensions&&(this.textureTransform=new vr(r.extensions.KHR_texture_transform),this.textureTransform.texcoord!=null&&(this.texcoordRef=this.textureTransform.texcoord)))}}const Pe={BaseColor:"BaseColor",MetallicRoughness:"MetallicRoughness",Normal:"Normal",Emmissive:"Emmissive",Occlusion:"Occlusion"};class bt{gltf;ref;json;alphaMode="OPAQUE";alphaCutoff=.5;doubleSided=!1;baseColor={factor:[1,1,1,1]};pbr={metallic:1,roughness:1};normal={scale:1};emmissive={factor:[0,0,0]};occlusion={strength:1};webgpu={};transmission;constructor(r,f,i){if(this.gltf=r,this.ref=f,this.json=i,this.json){const E=this.json.pbrMetallicRoughness;E&&(this.baseColor.factor=E.baseColorFactor??[1,1,1,1],this.baseColor.texture=this.getTextureInfo(E.baseColorTexture),this.pbr.metallic=E.metallicFactor??1,this.pbr.roughness=E.roughnessFactor??1,this.pbr.texture=this.getTextureInfo(E.metallicRoughnessTexture)),this.normal.scale=this.json.normalTexture?.scale??1,this.normal.texture=this.getTextureInfo(this.json.normalTexture),this.emmissive.factor=this.json.emissiveFactor??[0,0,0],this.emmissive.texture=this.getTextureInfo(this.json.emissiveTexture),this.occlusion.strength=this.json.occlusionTexture?.strength??1,this.occlusion.texture=this.getTextureInfo(this.json.occlusionTexture),this.alphaMode=this.json.alphaMode??"OPAQUE",this.alphaCutoff=this.json.alphaCutoff??.5,this.doubleSided=this.json.doubleSided??!1,this.json.extensions!=null&&Or.KHR_materials_transmission in this.json.extensions&&(this.transmission=new cn(i.extensions[Or.KHR_materials_transmission]),this.alphaMode="BLEND")}}getTextureInfo(r){return r==null?null:new Mt(r)}getAlphaMode(){return this.alphaMode}getAlphaCutoff(){return this.alphaCutoff}getDoubleSided(){return this.doubleSided}hasTexture(r){switch(r){case"BaseColor":return this.baseColor.texture!=null;case"MetallicRoughness":return this.pbr.texture!=null;case"Normal":return this.normal.texture!=null;case"Emmissive":return this.emmissive.texture!=null;case"Occlusion":return this.occlusion.texture!=null;default:return!1}}hasTextureTransform(r){if(!this.hasTexture(r))return!1;switch(r){case"BaseColor":return this.baseColor.texture.textureTransform!=null;case"MetallicRoughness":return this.pbr.texture.textureTransform!=null;case"Normal":return this.normal.texture.textureTransform!=null;case"Emmissive":return this.emmissive.texture.textureTransform!=null;case"Occlusion":return this.occlusion.texture.textureTransform!=null;default:return!1}}getTextureTransformData(r){if(!this.hasTexture(r)||!this.hasTextureTransform(r))return vr.getDefaultData();switch(r){case"BaseColor":return this.baseColor.texture.textureTransform.data;case"MetallicRoughness":return this.pbr.texture.textureTransform.data;case"Normal":return this.normal.texture.textureTransform.data;case"Emmissive":return this.emmissive.texture.textureTransform.data;case"Occlusion":return this.occlusion.texture.textureTransform.data;default:return vr.getDefaultData()}}getTexcoordIndexMap(){return{baseColor:this.baseColor.texture?.texcoordRef,metallicRoughness:this.pbr.texture?.texcoordRef,normal:this.normal.texture?.texcoordRef,emmissive:this.emmissive.texture?.texcoordRef,occlusion:this.occlusion.texture?.texcoordRef}}isTextureReady(){const r=this.baseColor.texture==null||this.baseColor.texture.ready,f=this.pbr.texture==null||this.pbr.texture.ready,i=this.normal.texture==null||this.normal.texture.ready,E=this.emmissive.texture==null||this.emmissive.texture.ready,t=this.occlusion.texture==null||this.occlusion.texture.ready;return r&&f&&i&&E&&t}getGPUTexture(r,f){if(f==null)return this.gltf.getDefaultTexture(r);const E=this.gltf.textures[f.textureRef].getGPUTexture(r);return E==null?this.gltf.getDefaultTexture(r):(f.ready=!0,E)}getGPUSampler(r,f){if(f==null)return this.gltf.getDefaultSampler(r);const E=this.gltf.textures[f.textureRef].getGPUSampler(r);return E??this.gltf.getDefaultSampler(r)}getGPUMaterial(r){if(this.webgpu.material==null){const f=new nr(this);this.webgpu.material=f}return this.webgpu.material}destroy(){this.webgpu.material?.destroy(),this.webgpu.material=null}}const lr={NONE:0,LOADING:1,READY:2,FAILED:3};class bn{gltf;ref;json;image=null;status=lr.NONE;constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i}async loadImage(){if(this.status!==lr.NONE)return;this.status=lr.LOADING;let r=null;if(this.json.uri){let f="";this.json.uri.startsWith("data:")?f=this.json.uri:f=`${this.gltf.url}/${this.json.uri}`;const E=await(await fetch(f)).blob();r=await createImageBitmap(E,{colorSpaceConversion:"none",imageOrientation:"from-image",premultiplyAlpha:"none"})}else if(this.json.bufferView){const f=this.gltf.bufferViews[this.json.bufferView];if(!f)throw this.status=lr.FAILED,new Error("GLTFImage loadImage get bufferView Failed");const i=f.byteOffset,E=f.byteLength,t=await f.loadData(),n=this.json.mimeType,h=new ArrayBuffer(E);new Uint8Array(h).set(t.slice(i,i+E)),r=await un(h,n)}return this.image=r,this.status=lr.READY,this.image}destroy(){}}class wn{gltf;ref;json;constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i}}class Tn{gltf;ref;json;constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i}}class yn{gltf;ref;json;constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i}}const En={SCALA:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},cr={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,UNSIGNED_INT:5125,FLOAT:5126},Sn=Object.fromEntries(Object.entries(cr).map(([w,r])=>[r,w])),An={BYTE:1,UNSIGNED_BYTE:1,SHORT:2,UNSIGNED_SHORT:2,UNSIGNED_INT:4,FLOAT:4};class kn{gltf;ref;json;count;byteOffset;constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i,this.byteOffset=this.json.byteOffset??0,this.count=this.json.count??0}async loadData(){return this.gltf.bufferViews[this.json.bufferView].loadData()}getElementBytes(){const r=this.json.type,f=this.json.componentType,i=En[r],E=An[Sn[f]];return i*E}}class Rn{gltf;ref;json;byteLength;byteOffset;byteStride;constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i,this.byteLength=this.json.byteLength,this.byteOffset=this.json.byteOffset??0,this.byteStride=this.json.byteStride}async loadData(){return this.gltf.buffers[this.json.buffer].loadData()}}const ur={NONE:0,LOADING:1,READY:2};class In{gltf;ref;json;byteLength;uri;data=null;status=ur.NONE;webgpu={buffers:{}};constructor(r,f,i){this.gltf=r,this.ref=f,this.json=i,this.byteLength=this.json.byteLength,this.uri=this.json.uri}loadData(){return this.status=ur.LOADING,(async()=>{let r=null;if(this.uri){let f=this.json.uri;this.uri.startsWith("data:")||(f=`${this.gltf.url}/${this.uri}`);const i=await fetch(f);if(!i.ok)throw new Error(`Failed to load buffer data: ${i.status}`);r=await i.arrayBuffer()}return this.data=new Uint8Array(r),this.status=ur.READY,this.data})()}getGPUBuffer(r,f){if(this.status===ur.NONE)return this.loadData(),null;if(this.status===ur.LOADING)return null;if(this.webgpu.buffers[f]!=null)return this.webgpu.buffers[f];{const i=r.createBuffer({label:this.json.name??"gltf buffer",size:this.json.byteLength,usage:f});r.queue.writeBuffer(i,0,this.data.buffer,0,this.byteLength),this.webgpu.buffers[f]=i}}destroy(){for(const r of Object.values(this.webgpu.buffers))r.destroy();this.webgpu.buffers={}}}class zn{name="glTF";#t;#n;#e;#a;#i=!1;#r=[];scenes;nodes;meshes;camera;textures;samplers;materials;images;skins;animations;assessors;bufferViews;buffers;#s;webgpu={};constructor(r){this.#t=r.uri,this.#n=this.#t.replace(/\/[^\/]*$/,"/"),this.name=r.name??"gltf",this.#o(this.#t).then(f=>{this.#e=f;const E=f.asset.version;if(this.#a=E,E!=="2.0")throw Error("only supports glTF 2.0 currently.");this.build(),this.#i=!0;for(const t of this.#r)t(this)})}get ready(){return this.#i}get uri(){return this.#t}get url(){return this.#n}get json(){return this.#e}get version(){return this.#a}get defaultMaterial(){return this.#s||(this.#s=new bt(this)),this.#s}getMaterial(r){return r==null?this.defaultMaterial:this.materials[r]}onReady(r){this.ready?r(this):this.#r.push(r)}async#o(r){const f=await fetch(r);if(!f.ok)throw new Error(f.statusText);const i=await f.json();return this.#e=i,this.#e}build(){this.scenes=this.json.scenes?.map((r,f)=>new dn(this,f,r)),this.nodes=this.json.nodes?.map((r,f)=>new vn(this,f,r)),this.meshes=this.json.meshes?.map((r,f)=>new xn(this,f,r)),this.camera=this.json.cameras?.map((r,f)=>new wn(this,f,r)),this.textures=this.json.textures?.map((r,f)=>new _n(this,f,r)),this.samplers=this.json.samplers?.map((r,f)=>new pn(this,f,r)),this.materials=this.json.materials?.map((r,f)=>new bt(this,f,r)),this.images=this.json.images?.map((r,f)=>new bn(this,f,r)),this.skins=this.json.skins?.map((r,f)=>new Tn(this,f,r)),this.animations=this.json.animations?.map((r,f)=>new yn(this,f,r)),this.assessors=this.json.accessors?.map((r,f)=>new kn(this,f,r)),this.bufferViews=this.json.bufferViews?.map((r,f)=>new Rn(this,f,r)),this.buffers=this.json.buffers?.map((r,f)=>new In(this,f,r))}getDefaultTexture(r){if(this.webgpu.defaultTexture==null){const f=r.createTexture({label:"pbrMaterial default texture",size:[1,1,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:f},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.webgpu.defaultTexture=f}return this.webgpu.defaultTexture}getDefaultSampler(r){if(this.webgpu.defaultSampler==null){const f=r.createSampler({label:"pbrMaterial default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.webgpu.defaultSampler=f}return this.webgpu.defaultSampler}destroy(){for(const r of this.buffers)r.destroy();for(const r of this.images)r.destroy();for(const r of this.textures)r.destroy();for(const r of this.materials)r.destroy();this.webgpu.defaultTexture!=null&&(this.webgpu.defaultTexture.destroy(),this.webgpu.defaultTexture=null)}}var Mn=`override MAX_LIGHTS: u32 = 10u;

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
}`;class Gn{camera;projection;worldmtx=qe();#t=0;#n=0;lights=[];MAX_NUM_LIGHTS=16;ibl;#e={};constructor(r,f){this.camera=r,this.projection=f}setWorldMatrix(r){this.worldmtx=r}addLight(r){this.lights.push(r)}setIBL(r){this.ibl=r,this.#e.context!=null&&r.webgpu.context==null&&r.initWebGPU(this.#e.context,this)}canEnv(){return this.ibl!=null&&this.ibl.canEnv()}canIBL(){return this.ibl!=null&&this.ibl.canIBL()}getEnv(){return this.canEnv()?this.ibl.environment:null}refreshViewport(r,f){this.#t=r,this.#n=f}get viewportMatrix(){const i=this.#t/2,E=this.#n/2;return yt(i,0,0,0,0,E,0,0,0,0,1,0,0+i,0+E,0,1)}get viewportMatrixInv(){return fr(qe(),this.viewportMatrix)}getRayOfPixel(r,f){f=this.#n-f;const i=this.viewportMatrix,E=this.projection.perspectiveMatrixZO,t=this.camera.viewMtx,n=zt(qe(),E,t),h=fr(qe(),n),s=fr(qe(),i),m=wt(r,f,0,1),x=Wr($r(),m,s),u=Wr($r(),x,h),v=ir(u[0],u[1],u[2]),b=ir(this.camera.from[0],this.camera.from[1],this.camera.from[2]),c=Pr(ar(),Tt(ar(),v,b));return new Gt(b,c)}initWebGPU(r){this.#e.context=r}refreshUniform(){if(this.#e.context){const r=this.#e.context.device;this.#e.definition||(this.#e.definition=jr(Mn));const f=Nr(this.#e.definition.uniforms.scene);this.#e.uniform||(this.#e.uniform=r.createBuffer({label:"scene",size:f.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));const i={eye:Br(this.camera.from),center:Br(this.camera.to),up:Br(this.camera.up),viewmtx:this.camera.viewMtx,viewmtxInv:fr(qe(),this.camera.viewMtx)},E={near:this.projection.near,far:this.projection.far,fovy:this.projection.fovy,aspect:this.projection.aspect,projmtx:this.projection.perspectiveMatrixZO,projmtxInv:fr(qe(),this.projection.perspectiveMatrixZO)},t={width:this.#t,height:this.#n,viewportmtx:this.viewportMatrix,viewportmtxInv:this.viewportMatrixInv},n=this.getIBLsh(),h={canIBL:Ze(this.canIBL()),prescaled:Ze(this.canIBL()&&this.ibl.sh.prescale),sh:n},s=Math.min(this.MAX_NUM_LIGHTS,this.lights.length),m=[];for(let u=0;u<s;++u)m.push({position:this.lights[u].position,color:this.lights[u].color});const x={worldmtx:this.worldmtx,camera:i,projection:E,viewport:t,ibl:h,numLights:s,lights:m};f.set(x),r.queue.writeBuffer(this.#e.uniform,0,f.arrayBuffer)}}get bindGroupLayout(){if(this.#e.context){const r=this.#e.context.device;return this.#e.layout||(this.#e.layout=r.createBindGroupLayout({label:"scene",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube",sampleType:"float",multisampled:!1}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"2d",sampleType:"float",multisampled:!1}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]})),this.#e.layout}return null}getPrefilterTexture(){let r;if(this.canIBL()&&(r=this.ibl.getPrefilterTexture()),r==null){const f=this.#e.context?.device;r=this.getDefaultCubeTexture(f)}return r}getPrefilterSampler(){let r;if(this.canIBL()&&(r=this.ibl.getPerfilterSampler()),r==null){const f=this.#e.context?.device;r=this.getDefaultCubeSampler(f)}return r}getLUTTexture(){let r;if(this.canIBL()&&(r=this.ibl.getLUTTexture()),r==null){const f=this.#e.context?.device;r=this.getDefault2DTexture(f)}return r}getLUTSampler(){let r;if(this.canIBL()&&(r=this.ibl.getLUTSampler()),r==null){const f=this.#e.context?.device;r=this.getDefault2DSampler(f)}return r}getIBLsh(){return this.canIBL()?this.ibl.sh.parameters:Array(9).fill([1,1,1])}get bindGroup(){if(this.#e.context){const r=this.#e.context.device,f=this.getPrefilterTexture(),i=this.getPrefilterSampler(),E=this.getLUTTexture(),t=this.getLUTSampler();return this.#e.bindgroup=r.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.#e.uniform}},{binding:1,resource:f.createView({dimension:"cube"})},{binding:2,resource:i},{binding:3,resource:E.createView({dimension:"2d"})},{binding:4,resource:t}]}),this.#e.bindgroup}return null}get uniform(){return this.#e.uniform}getDefaultCubeTexture(r){if(this.#e.defaultCubeTexture==null){const f=r.createTexture({label:"default texture",size:[1,1,6],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:f},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.#e.defaultCubeTexture=f}return this.#e.defaultCubeTexture}getDefaultCubeSampler(r){if(this.#e.defaultCubeSampler==null){const f=r.createSampler({label:"default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.#e.defaultCubeSampler=f}return this.#e.defaultCubeSampler}getDefault2DTexture(r){if(this.#e.default2DTexture==null){const f=r.createTexture({label:"default texture",size:[1,1,1],format:"rgba8unorm",dimension:"2d",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:f},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.#e.default2DTexture=f}return this.#e.default2DTexture}getDefault2DSampler(r){if(this.#e.default2DSampler==null){const f=r.createSampler({label:"default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.#e.default2DSampler=f}return this.#e.default2DSampler}destroy(){this.#e.uniform&&this.#e.uniform.destroy(),this.#e.defaultCubeTexture&&this.#e.defaultCubeTexture.destroy(),this.#e.default2DTexture&&this.#e.default2DTexture.destroy()}}export{Bn as A,xr as G,Gn as S,Br as a,Dn as b,Ln as c,On as d,vn as e,xn as f,zn as g,Nn as h,Xt as i,pt as n,Pn as o,jn as r,Un as v};
