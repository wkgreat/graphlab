import{A as dr,f as Tt,x as Bt,h as ir,g as sr,i as Lt,l as _r,y as Dt,n as Pr,E as Ot,c as Xe,z as fr,B as Ut,k as Nt,j as Pt,s as yt,q as zt,b as zr,m as jr,D as Et,F as jt,G as Gt,a as $r,H as Vt,t as Wr,d as Jr}from"./webgpu-utils.module-Cj-QWmJB.js";import{g as He,R as Zt}from"./objects-BMBEF8J0.js";function Ht(){var g=new dr(9);return dr!=Float32Array&&(g[1]=0,g[2]=0,g[3]=0,g[5]=0,g[6]=0,g[7]=0),g[0]=1,g[4]=1,g[8]=1,g}function Un(g,r,o,a,T,t,n,h,s){var m=new dr(9);return m[0]=g,m[1]=r,m[2]=o,m[3]=a,m[4]=T,m[5]=t,m[6]=n,m[7]=h,m[8]=s,m}function Nn(g,r){if(g===r){var o=r[1],a=r[2],T=r[5];g[1]=r[3],g[2]=r[6],g[3]=o,g[5]=r[7],g[6]=a,g[7]=T}else g[0]=r[0],g[1]=r[3],g[2]=r[6],g[3]=r[1],g[4]=r[4],g[5]=r[7],g[6]=r[2],g[7]=r[5],g[8]=r[8];return g}function Yt(g,r,o){var a=r[0],T=r[1],t=r[2],n=r[3],h=r[4],s=r[5],m=r[6],x=r[7],f=r[8],v=o[0],p=o[1],c=o[2],C=o[3],I=o[4],d=o[5],_=o[6],A=o[7],O=o[8];return g[0]=v*a+p*n+c*m,g[1]=v*T+p*h+c*x,g[2]=v*t+p*s+c*f,g[3]=C*a+I*n+d*m,g[4]=C*T+I*h+d*x,g[5]=C*t+I*s+d*f,g[6]=_*a+A*n+O*m,g[7]=_*T+A*h+O*x,g[8]=_*t+A*s+O*f,g}function Pn(g,r){var o=r[0],a=r[1],T=r[2],t=r[3],n=o+o,h=a+a,s=T+T,m=o*n,x=a*n,f=a*h,v=T*n,p=T*h,c=T*s,C=t*n,I=t*h,d=t*s;return g[0]=1-f-c,g[3]=x-d,g[6]=v+I,g[1]=x+d,g[4]=1-m-c,g[7]=p-C,g[2]=v-I,g[5]=p+C,g[8]=1-m-f,g}var zn=Yt;function Qr(){var g=new dr(4);return dr!=Float32Array&&(g[0]=0,g[1]=0,g[2]=0),g[3]=1,g}function qt(g,r,o){o=o*.5;var a=Math.sin(o);return g[0]=a*r[0],g[1]=a*r[1],g[2]=a*r[2],g[3]=Math.cos(o),g}function pr(g,r,o,a){var T=r[0],t=r[1],n=r[2],h=r[3],s=o[0],m=o[1],x=o[2],f=o[3],v,p,c,C,I;return p=T*s+t*m+n*x+h*f,p<0&&(p=-p,s=-s,m=-m,x=-x,f=-f),1-p>Ot?(v=Math.acos(p),c=Math.sin(v),C=Math.sin((1-a)*v)/c,I=Math.sin(a*v)/c):(C=1-a,I=a),g[0]=C*T+I*s,g[1]=C*t+I*m,g[2]=C*n+I*x,g[3]=C*h+I*f,g}function Xt(g,r){var o=r[0]+r[4]+r[8],a;if(o>0)a=Math.sqrt(o+1),g[3]=.5*a,a=.5/a,g[0]=(r[5]-r[7])*a,g[1]=(r[6]-r[2])*a,g[2]=(r[1]-r[3])*a;else{var T=0;r[4]>r[0]&&(T=1),r[8]>r[T*3+T]&&(T=2);var t=(T+1)%3,n=(T+2)%3;a=Math.sqrt(r[T*3+T]-r[t*3+t]-r[n*3+n]+1),g[T]=.5*a,a=.5/a,g[3]=(r[t*3+n]-r[n*3+t])*a,g[t]=(r[t*3+T]+r[T*3+t])*a,g[n]=(r[n*3+T]+r[T*3+n])*a}return g}var Kt=Tt,St=Bt;(function(){var g=ir(),r=sr(1,0,0),o=sr(0,1,0);return function(a,T,t){var n=Lt(T,t);return n<-.999999?(_r(g,r,T),Dt(g)<1e-6&&_r(g,o,T),Pr(g,g),qt(a,g,Math.PI),a):n>.999999?(a[0]=0,a[1]=0,a[2]=0,a[3]=1,a):(_r(g,T,t),a[0]=g[0],a[1]=g[1],a[2]=g[2],a[3]=1+n,St(a,a))}})();(function(){var g=Qr(),r=Qr();return function(o,a,T,t,n,h){return pr(g,a,n,h),pr(r,T,t,h),pr(o,g,r,2*h*(1-h)),o}})();(function(){var g=Ht();return function(r,o,a,T){return g[0]=a[0],g[3]=a[1],g[6]=a[2],g[1]=T[0],g[4]=T[1],g[7]=T[2],g[2]=-o[0],g[5]=-o[1],g[8]=-o[2],St(r,Xt(r,g))}})();const je={DEBUG:{level:0,token:"DEBUG"},INFO:{level:1,token:"INFO"},WARN:{level:2,token:"WARN"},ERROR:{level:3,token:"ERROR"}};class $t{handler;level=je.WARN.level;constructor(r=()=>{}){this.handler=r}debug(r){je.DEBUG.level>=this.level&&this.handler(`[${je.DEBUG.token}] ${r}`,je.DEBUG)}info(r){je.INFO.level>=this.level&&this.handler(`[${je.INFO.token}] ${r}`,je.INFO)}warn(r){je.WARN.level>=this.level&&this.handler(`[${je.WARN.token}] ${r}`,je.WARN)}error(r){je.ERROR.level>=this.level&&this.handler(`[${je.ERROR.token}] ${r}`,je.ERROR)}setHandler(r){this.handler=r}setLevel(r){typeof r=="number"?this.level=r:this.level=r.level}}const At=new $t;At.setHandler((g,r)=>{r===je.DEBUG||r===je.INFO?console.log(g):r===je.WARN?console.warn(g):console.error(g)});At.setLevel(je.DEBUG);var br={exports:{}},et;function Wt(){return et||(et=1,(function(g){function r(a){var T=Math.floor,t=new Array(64),n=new Array(64),h=new Array(64),s=new Array(64),m,x,f,v,p=new Array(65535),c=new Array(65535),C=new Array(64),I=new Array(64),d=[],_=0,A=7,O=new Array(64),N=new Array(64),S=new Array(64),E=new Array(256),y=new Array(2048),G,j=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],V=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],z=[0,1,2,3,4,5,6,7,8,9,10,11],U=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],D=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],J=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],$=[0,1,2,3,4,5,6,7,8,9,10,11],K=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],Z=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];function te(F){for(var _e=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],ve=0;ve<64;ve++){var be=T((_e[ve]*F+50)/100);be<1?be=1:be>255&&(be=255),t[j[ve]]=be}for(var ke=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],Me=0;Me<64;Me++){var Ie=T((ke[Me]*F+50)/100);Ie<1?Ie=1:Ie>255&&(Ie=255),n[j[Me]]=Ie}for(var fe=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],ce=0,he=0;he<8;he++)for(var ae=0;ae<8;ae++)h[ce]=1/(t[j[ce]]*fe[he]*fe[ae]*8),s[ce]=1/(n[j[ce]]*fe[he]*fe[ae]*8),ce++}function de(F,_e){for(var ve=0,be=0,ke=new Array,Me=1;Me<=16;Me++){for(var Ie=1;Ie<=F[Me];Ie++)ke[_e[be]]=[],ke[_e[be]][0]=ve,ke[_e[be]][1]=Me,be++,ve++;ve*=2}return ke}function Ee(){m=de(V,z),x=de(J,$),f=de(U,D),v=de(K,Z)}function pe(){for(var F=1,_e=2,ve=1;ve<=15;ve++){for(var be=F;be<_e;be++)c[32767+be]=ve,p[32767+be]=[],p[32767+be][1]=ve,p[32767+be][0]=be;for(var ke=-(_e-1);ke<=-F;ke++)c[32767+ke]=ve,p[32767+ke]=[],p[32767+ke][1]=ve,p[32767+ke][0]=_e-1+ke;F<<=1,_e<<=1}}function ge(){for(var F=0;F<256;F++)y[F]=19595*F,y[F+256>>0]=38470*F,y[F+512>>0]=7471*F+32768,y[F+768>>0]=-11059*F,y[F+1024>>0]=-21709*F,y[F+1280>>0]=32768*F+8421375,y[F+1536>>0]=-27439*F,y[F+1792>>0]=-5329*F}function re(F){for(var _e=F[0],ve=F[1]-1;ve>=0;)_e&1<<ve&&(_|=1<<A),ve--,A--,A<0&&(_==255?(X(255),X(0)):X(_),A=7,_=0)}function X(F){d.push(F)}function Q(F){X(F>>8&255),X(F&255)}function me(F,_e){var ve,be,ke,Me,Ie,fe,ce,he,ae=0,Ae,u=8,M=64;for(Ae=0;Ae<u;++Ae){ve=F[ae],be=F[ae+1],ke=F[ae+2],Me=F[ae+3],Ie=F[ae+4],fe=F[ae+5],ce=F[ae+6],he=F[ae+7];var P=ve+he,Y=ve-he,w=be+ce,B=be-ce,i=ke+fe,H=ke-fe,Te=Me+Ie,e=Me-Ie,R=P+Te,L=P-Te,l=w+i,b=w-i;F[ae]=R+l,F[ae+4]=R-l;var k=(b+L)*.707106781;F[ae+2]=L+k,F[ae+6]=L-k,R=e+H,l=H+B,b=B+Y;var xe=(R-b)*.382683433,ne=.5411961*R+xe,ue=1.306562965*b+xe,Fe=l*.707106781,Ye=Y+Fe,Be=Y-Fe;F[ae+5]=Be+ne,F[ae+3]=Be-ne,F[ae+1]=Ye+ue,F[ae+7]=Ye-ue,ae+=8}for(ae=0,Ae=0;Ae<u;++Ae){ve=F[ae],be=F[ae+8],ke=F[ae+16],Me=F[ae+24],Ie=F[ae+32],fe=F[ae+40],ce=F[ae+48],he=F[ae+56];var Ce=ve+he,Le=ve-he,Pe=be+ce,ze=be-ce,Qe=ke+fe,er=ke-fe,De=Me+Ie,Ve=Me-Ie,Oe=Ce+De,Ze=Ce-De,Ge=Pe+Qe,rr=Pe-Qe;F[ae]=Oe+Ge,F[ae+32]=Oe-Ge;var Vr=(rr+Ze)*.707106781;F[ae+16]=Ze+Vr,F[ae+48]=Ze-Vr,Oe=Ve+er,Ge=er+ze,rr=ze+Le;var Zr=(Oe-rr)*.382683433,Hr=.5411961*Oe+Zr,Yr=1.306562965*rr+Zr,qr=Ge*.707106781,Xr=Le+qr,Kr=Le-qr;F[ae+40]=Kr+Hr,F[ae+24]=Kr-Hr,F[ae+8]=Xr+Yr,F[ae+56]=Xr-Yr,ae++}var vr;for(Ae=0;Ae<M;++Ae)vr=F[Ae]*_e[Ae],C[Ae]=vr>0?vr+.5|0:vr-.5|0;return C}function ie(){Q(65504),Q(16),X(74),X(70),X(73),X(70),X(0),X(1),X(1),X(0),Q(1),Q(1),X(0),X(0)}function W(F){if(F){Q(65505),F[0]===69&&F[1]===120&&F[2]===105&&F[3]===102?Q(F.length+2):(Q(F.length+5+2),X(69),X(120),X(105),X(102),X(0));for(var _e=0;_e<F.length;_e++)X(F[_e])}}function Re(F,_e){Q(65472),Q(17),X(8),Q(_e),Q(F),X(3),X(1),X(17),X(0),X(2),X(17),X(1),X(3),X(17),X(1)}function Se(){Q(65499),Q(132),X(0);for(var F=0;F<64;F++)X(t[F]);X(1);for(var _e=0;_e<64;_e++)X(n[_e])}function se(){Q(65476),Q(418),X(0);for(var F=0;F<16;F++)X(V[F+1]);for(var _e=0;_e<=11;_e++)X(z[_e]);X(16);for(var ve=0;ve<16;ve++)X(U[ve+1]);for(var be=0;be<=161;be++)X(D[be]);X(1);for(var ke=0;ke<16;ke++)X(J[ke+1]);for(var Me=0;Me<=11;Me++)X($[Me]);X(17);for(var Ie=0;Ie<16;Ie++)X(K[Ie+1]);for(var fe=0;fe<=161;fe++)X(Z[fe])}function we(F){typeof F>"u"||F.constructor!==Array||F.forEach(_e=>{if(typeof _e=="string"){Q(65534);var ve=_e.length;Q(ve+2);var be;for(be=0;be<ve;be++)X(_e.charCodeAt(be))}})}function oe(){Q(65498),Q(12),X(3),X(1),X(0),X(2),X(17),X(3),X(17),X(0),X(63),X(0)}function q(F,_e,ve,be,ke){for(var Me=ke[0],Ie=ke[240],fe,ce=16,he=63,ae=64,Ae=me(F,_e),u=0;u<ae;++u)I[j[u]]=Ae[u];var M=I[0]-ve;ve=I[0],M==0?re(be[0]):(fe=32767+M,re(be[c[fe]]),re(p[fe]));for(var P=63;P>0&&I[P]==0;P--);if(P==0)return re(Me),ve;for(var Y=1,w;Y<=P;){for(var B=Y;I[Y]==0&&Y<=P;++Y);var i=Y-B;if(i>=ce){w=i>>4;for(var H=1;H<=w;++H)re(Ie);i=i&15}fe=32767+I[Y],re(ke[(i<<4)+c[fe]]),re(p[fe]),Y++}return P!=he&&re(Me),ve}function ye(){for(var F=String.fromCharCode,_e=0;_e<256;_e++)E[_e]=F(_e)}this.encode=function(F,_e){new Date().getTime(),_e&&le(_e),d=new Array,_=0,A=7,Q(65496),ie(),we(F.comments),W(F.exifBuffer),Se(),Re(F.width,F.height),se(),oe();var ve=0,be=0,ke=0;_=0,A=7,this.encode.displayName="_encode_";for(var Me=F.data,Ie=F.width,fe=F.height,ce=Ie*4,he,ae=0,Ae,u,M,P,Y,w,B,i;ae<fe;){for(he=0;he<ce;){for(P=ce*ae+he,Y=P,w=-1,B=0,i=0;i<64;i++)B=i>>3,w=(i&7)*4,Y=P+B*ce+w,ae+B>=fe&&(Y-=ce*(ae+1+B-fe)),he+w>=ce&&(Y-=he+w-ce+4),Ae=Me[Y++],u=Me[Y++],M=Me[Y++],O[i]=(y[Ae]+y[u+256>>0]+y[M+512>>0]>>16)-128,N[i]=(y[Ae+768>>0]+y[u+1024>>0]+y[M+1280>>0]>>16)-128,S[i]=(y[Ae+1280>>0]+y[u+1536>>0]+y[M+1792>>0]>>16)-128;ve=q(O,h,ve,m,f),be=q(N,s,be,x,v),ke=q(S,s,ke,x,v),he+=32}ae+=8}if(A>=0){var H=[];H[1]=A+1,H[0]=(1<<A+1)-1,re(H)}return Q(65497),Buffer.from(d)};function le(F){if(F<=0&&(F=1),F>100&&(F=100),G!=F){var _e=0;F<50?_e=Math.floor(5e3/F):_e=Math.floor(200-F*2),te(_e),G=F}}function ee(){var F=new Date().getTime();a||(a=50),ye(),Ee(),pe(),ge(),le(a),new Date().getTime()-F}ee()}g.exports=o;function o(a,T){typeof T>"u"&&(T=50);var t=new r(T),n=t.encode(a,T);return{data:n,width:a.width,height:a.height}}})(br)),br.exports}var wr={exports:{}},rt;function Jt(){return rt||(rt=1,(function(g){var r=(function(){var T=new Int32Array([0,1,8,16,9,2,3,10,17,24,32,25,18,11,4,5,12,19,26,33,40,48,41,34,27,20,13,6,7,14,21,28,35,42,49,56,57,50,43,36,29,22,15,23,30,37,44,51,58,59,52,45,38,31,39,46,53,60,61,54,47,55,62,63]),t=4017,n=799,h=3406,s=2276,m=1567,x=3784,f=5793,v=2896;function p(){}function c(N,S){for(var E=0,y=[],G,j,V=16;V>0&&!N[V-1];)V--;y.push({children:[],index:0});var z=y[0],U;for(G=0;G<V;G++){for(j=0;j<N[G];j++){for(z=y.pop(),z.children[z.index]=S[E];z.index>0;){if(y.length===0)throw new Error("Could not recreate Huffman Table");z=y.pop()}for(z.index++,y.push(z);y.length<=G;)y.push(U={children:[],index:0}),z.children[z.index]=U.children,z=U;E++}G+1<V&&(y.push(U={children:[],index:0}),z.children[z.index]=U.children,z=U)}return y[0].children}function C(N,S,E,y,G,j,V,z,U,D){E.precision,E.samplesPerLine,E.scanLines;var J=E.mcusPerLine,$=E.progressive;E.maxH,E.maxV;var K=S,Z=0,te=0;function de(){if(te>0)return te--,Z>>te&1;if(Z=N[S++],Z==255){var fe=N[S++];if(fe)throw new Error("unexpected marker: "+(Z<<8|fe).toString(16))}return te=7,Z>>>7}function Ee(fe){for(var ce=fe,he;(he=de())!==null;){if(ce=ce[he],typeof ce=="number")return ce;if(typeof ce!="object")throw new Error("invalid huffman sequence")}return null}function pe(fe){for(var ce=0;fe>0;){var he=de();if(he===null)return;ce=ce<<1|he,fe--}return ce}function ge(fe){var ce=pe(fe);return ce>=1<<fe-1?ce:ce+(-1<<fe)+1}function re(fe,ce){var he=Ee(fe.huffmanTableDC),ae=he===0?0:ge(he);ce[0]=fe.pred+=ae;for(var Ae=1;Ae<64;){var u=Ee(fe.huffmanTableAC),M=u&15,P=u>>4;if(M===0){if(P<15)break;Ae+=16;continue}Ae+=P;var Y=T[Ae];ce[Y]=ge(M),Ae++}}function X(fe,ce){var he=Ee(fe.huffmanTableDC),ae=he===0?0:ge(he)<<U;ce[0]=fe.pred+=ae}function Q(fe,ce){ce[0]|=de()<<U}var me=0;function ie(fe,ce){if(me>0){me--;return}for(var he=j,ae=V;he<=ae;){var Ae=Ee(fe.huffmanTableAC),u=Ae&15,M=Ae>>4;if(u===0){if(M<15){me=pe(M)+(1<<M)-1;break}he+=16;continue}he+=M;var P=T[he];ce[P]=ge(u)*(1<<U),he++}}var W=0,Re;function Se(fe,ce){for(var he=j,ae=V,Ae=0;he<=ae;){var u=T[he],M=ce[u]<0?-1:1;switch(W){case 0:var P=Ee(fe.huffmanTableAC),Y=P&15,Ae=P>>4;if(Y===0)Ae<15?(me=pe(Ae)+(1<<Ae),W=4):(Ae=16,W=1);else{if(Y!==1)throw new Error("invalid ACn encoding");Re=ge(Y),W=Ae?2:3}continue;case 1:case 2:ce[u]?ce[u]+=(de()<<U)*M:(Ae--,Ae===0&&(W=W==2?3:0));break;case 3:ce[u]?ce[u]+=(de()<<U)*M:(ce[u]=Re<<U,W=0);break;case 4:ce[u]&&(ce[u]+=(de()<<U)*M);break}he++}W===4&&(me--,me===0&&(W=0))}function se(fe,ce,he,ae,Ae){var u=he/J|0,M=he%J,P=u*fe.v+ae,Y=M*fe.h+Ae;fe.blocks[P]===void 0&&D.tolerantDecoding||ce(fe,fe.blocks[P][Y])}function we(fe,ce,he){var ae=he/fe.blocksPerLine|0,Ae=he%fe.blocksPerLine;fe.blocks[ae]===void 0&&D.tolerantDecoding||ce(fe,fe.blocks[ae][Ae])}var oe=y.length,q,ye,le,ee,F,_e;$?j===0?_e=z===0?X:Q:_e=z===0?ie:Se:_e=re;var ve=0,be,ke;oe==1?ke=y[0].blocksPerLine*y[0].blocksPerColumn:ke=J*E.mcusPerColumn,G||(G=ke);for(var Me,Ie;ve<ke;){for(ye=0;ye<oe;ye++)y[ye].pred=0;if(me=0,oe==1)for(q=y[0],F=0;F<G;F++)we(q,_e,ve),ve++;else for(F=0;F<G;F++){for(ye=0;ye<oe;ye++)for(q=y[ye],Me=q.h,Ie=q.v,le=0;le<Ie;le++)for(ee=0;ee<Me;ee++)se(q,_e,ve,le,ee);if(ve++,ve===ke)break}if(ve===ke)do{if(N[S]===255&&N[S+1]!==0)break;S+=1}while(S<N.length-2);if(te=0,be=N[S]<<8|N[S+1],be<65280)throw new Error("marker was not found");if(be>=65488&&be<=65495)S+=2;else break}return S-K}function I(N,S){var E=[],y=S.blocksPerLine,G=S.blocksPerColumn,j=y<<3,V=new Int32Array(64),z=new Uint8Array(64);function U(pe,ge,re){var X=S.quantizationTable,Q,me,ie,W,Re,Se,se,we,oe,q=re,ye;for(ye=0;ye<64;ye++)q[ye]=pe[ye]*X[ye];for(ye=0;ye<8;++ye){var le=8*ye;if(q[1+le]==0&&q[2+le]==0&&q[3+le]==0&&q[4+le]==0&&q[5+le]==0&&q[6+le]==0&&q[7+le]==0){oe=f*q[0+le]+512>>10,q[0+le]=oe,q[1+le]=oe,q[2+le]=oe,q[3+le]=oe,q[4+le]=oe,q[5+le]=oe,q[6+le]=oe,q[7+le]=oe;continue}Q=f*q[0+le]+128>>8,me=f*q[4+le]+128>>8,ie=q[2+le],W=q[6+le],Re=v*(q[1+le]-q[7+le])+128>>8,we=v*(q[1+le]+q[7+le])+128>>8,Se=q[3+le]<<4,se=q[5+le]<<4,oe=Q-me+1>>1,Q=Q+me+1>>1,me=oe,oe=ie*x+W*m+128>>8,ie=ie*m-W*x+128>>8,W=oe,oe=Re-se+1>>1,Re=Re+se+1>>1,se=oe,oe=we+Se+1>>1,Se=we-Se+1>>1,we=oe,oe=Q-W+1>>1,Q=Q+W+1>>1,W=oe,oe=me-ie+1>>1,me=me+ie+1>>1,ie=oe,oe=Re*s+we*h+2048>>12,Re=Re*h-we*s+2048>>12,we=oe,oe=Se*n+se*t+2048>>12,Se=Se*t-se*n+2048>>12,se=oe,q[0+le]=Q+we,q[7+le]=Q-we,q[1+le]=me+se,q[6+le]=me-se,q[2+le]=ie+Se,q[5+le]=ie-Se,q[3+le]=W+Re,q[4+le]=W-Re}for(ye=0;ye<8;++ye){var ee=ye;if(q[8+ee]==0&&q[16+ee]==0&&q[24+ee]==0&&q[32+ee]==0&&q[40+ee]==0&&q[48+ee]==0&&q[56+ee]==0){oe=f*re[ye+0]+8192>>14,q[0+ee]=oe,q[8+ee]=oe,q[16+ee]=oe,q[24+ee]=oe,q[32+ee]=oe,q[40+ee]=oe,q[48+ee]=oe,q[56+ee]=oe;continue}Q=f*q[0+ee]+2048>>12,me=f*q[32+ee]+2048>>12,ie=q[16+ee],W=q[48+ee],Re=v*(q[8+ee]-q[56+ee])+2048>>12,we=v*(q[8+ee]+q[56+ee])+2048>>12,Se=q[24+ee],se=q[40+ee],oe=Q-me+1>>1,Q=Q+me+1>>1,me=oe,oe=ie*x+W*m+2048>>12,ie=ie*m-W*x+2048>>12,W=oe,oe=Re-se+1>>1,Re=Re+se+1>>1,se=oe,oe=we+Se+1>>1,Se=we-Se+1>>1,we=oe,oe=Q-W+1>>1,Q=Q+W+1>>1,W=oe,oe=me-ie+1>>1,me=me+ie+1>>1,ie=oe,oe=Re*s+we*h+2048>>12,Re=Re*h-we*s+2048>>12,we=oe,oe=Se*n+se*t+2048>>12,Se=Se*t-se*n+2048>>12,se=oe,q[0+ee]=Q+we,q[56+ee]=Q-we,q[8+ee]=me+se,q[48+ee]=me-se,q[16+ee]=ie+Se,q[40+ee]=ie-Se,q[24+ee]=W+Re,q[32+ee]=W-Re}for(ye=0;ye<64;++ye){var F=128+(q[ye]+8>>4);ge[ye]=F<0?0:F>255?255:F}}O(j*G*8);for(var D,J,$=0;$<G;$++){var K=$<<3;for(D=0;D<8;D++)E.push(new Uint8Array(j));for(var Z=0;Z<y;Z++){U(S.blocks[$][Z],z,V);var te=0,de=Z<<3;for(J=0;J<8;J++){var Ee=E[K+J];for(D=0;D<8;D++)Ee[de+D]=z[te++]}}}return E}function d(N){return N<0?0:N>255?255:N}p.prototype={load:function(S){var E=new XMLHttpRequest;E.open("GET",S,!0),E.responseType="arraybuffer",E.onload=(function(){var y=new Uint8Array(E.response||E.mozResponseArrayBuffer);this.parse(y),this.onload&&this.onload()}).bind(this),E.send(null)},parse:function(S){var E=this.opts.maxResolutionInMP*1e3*1e3,y=0;S.length;function G(){var M=S[y]<<8|S[y+1];return y+=2,M}function j(){var M=G(),P=S.subarray(y,y+M-2);return y+=P.length,P}function V(M){var P=1,Y=1,w,B;for(B in M.components)M.components.hasOwnProperty(B)&&(w=M.components[B],P<w.h&&(P=w.h),Y<w.v&&(Y=w.v));var i=Math.ceil(M.samplesPerLine/8/P),H=Math.ceil(M.scanLines/8/Y);for(B in M.components)if(M.components.hasOwnProperty(B)){w=M.components[B];var Te=Math.ceil(Math.ceil(M.samplesPerLine/8)*w.h/P),e=Math.ceil(Math.ceil(M.scanLines/8)*w.v/Y),R=i*w.h,L=H*w.v,l=L*R,b=[];O(l*256);for(var k=0;k<L;k++){for(var xe=[],ne=0;ne<R;ne++)xe.push(new Int32Array(64));b.push(xe)}w.blocksPerLine=Te,w.blocksPerColumn=e,w.blocks=b}M.maxH=P,M.maxV=Y,M.mcusPerLine=i,M.mcusPerColumn=H}var z=null,U=null,D,J,$=[],K=[],Z=[],te=[],de=G(),Ee=-1;if(this.comments=[],de!=65496)throw new Error("SOI not found");for(de=G();de!=65497;){var pe,ge;switch(de){case 65280:break;case 65504:case 65505:case 65506:case 65507:case 65508:case 65509:case 65510:case 65511:case 65512:case 65513:case 65514:case 65515:case 65516:case 65517:case 65518:case 65519:case 65534:var re=j();if(de===65534){var X=String.fromCharCode.apply(null,re);this.comments.push(X)}de===65504&&re[0]===74&&re[1]===70&&re[2]===73&&re[3]===70&&re[4]===0&&(z={version:{major:re[5],minor:re[6]},densityUnits:re[7],xDensity:re[8]<<8|re[9],yDensity:re[10]<<8|re[11],thumbWidth:re[12],thumbHeight:re[13],thumbData:re.subarray(14,14+3*re[12]*re[13])}),de===65505&&re[0]===69&&re[1]===120&&re[2]===105&&re[3]===102&&re[4]===0&&(this.exifBuffer=re.subarray(5,re.length)),de===65518&&re[0]===65&&re[1]===100&&re[2]===111&&re[3]===98&&re[4]===101&&re[5]===0&&(U={version:re[6],flags0:re[7]<<8|re[8],flags1:re[9]<<8|re[10],transformCode:re[11]});break;case 65499:for(var Q=G(),me=Q+y-2;y<me;){var ie=S[y++];O(256);var W=new Int32Array(64);if(ie>>4===0)for(ge=0;ge<64;ge++){var Re=T[ge];W[Re]=S[y++]}else if(ie>>4===1)for(ge=0;ge<64;ge++){var Re=T[ge];W[Re]=G()}else throw new Error("DQT: invalid table spec");$[ie&15]=W}break;case 65472:case 65473:case 65474:G(),D={},D.extended=de===65473,D.progressive=de===65474,D.precision=S[y++],D.scanLines=G(),D.samplesPerLine=G(),D.components={},D.componentsOrder=[];var Se=D.scanLines*D.samplesPerLine;if(Se>E){var se=Math.ceil((Se-E)/1e6);throw new Error(`maxResolutionInMP limit exceeded by ${se}MP`)}var we=S[y++],oe;for(pe=0;pe<we;pe++){oe=S[y];var q=S[y+1]>>4,ye=S[y+1]&15,le=S[y+2];if(q<=0||ye<=0)throw new Error("Invalid sampling factor, expected values above 0");D.componentsOrder.push(oe),D.components[oe]={h:q,v:ye,quantizationIdx:le},y+=3}V(D),K.push(D);break;case 65476:var ee=G();for(pe=2;pe<ee;){var F=S[y++],_e=new Uint8Array(16),ve=0;for(ge=0;ge<16;ge++,y++)ve+=_e[ge]=S[y];O(16+ve);var be=new Uint8Array(ve);for(ge=0;ge<ve;ge++,y++)be[ge]=S[y];pe+=17+ve,(F>>4===0?te:Z)[F&15]=c(_e,be)}break;case 65501:G(),J=G();break;case 65500:G(),G();break;case 65498:G();var ke=S[y++],Me=[],Ie;for(pe=0;pe<ke;pe++){Ie=D.components[S[y++]];var fe=S[y++];Ie.huffmanTableDC=te[fe>>4],Ie.huffmanTableAC=Z[fe&15],Me.push(Ie)}var ce=S[y++],he=S[y++],ae=S[y++],Ae=C(S,y,D,Me,J,ce,he,ae>>4,ae&15,this.opts);y+=Ae;break;case 65535:S[y]!==255&&y--;break;default:if(S[y-3]==255&&S[y-2]>=192&&S[y-2]<=254){y-=3;break}else if(de===224||de==225){if(Ee!==-1)throw new Error(`first unknown JPEG marker at offset ${Ee.toString(16)}, second unknown JPEG marker ${de.toString(16)} at offset ${(y-1).toString(16)}`);Ee=y-1;const M=G();if(S[y+M-2]===255){y+=M-2;break}}throw new Error("unknown JPEG marker "+de.toString(16))}de=G()}if(K.length!=1)throw new Error("only single frame JPEGs supported");for(var pe=0;pe<K.length;pe++){var u=K[pe].components;for(var ge in u)u[ge].quantizationTable=$[u[ge].quantizationIdx],delete u[ge].quantizationIdx}this.width=D.samplesPerLine,this.height=D.scanLines,this.jfif=z,this.adobe=U,this.components=[];for(var pe=0;pe<D.componentsOrder.length;pe++){var Ie=D.components[D.componentsOrder[pe]];this.components.push({lines:I(D,Ie),scaleX:Ie.h/D.maxH,scaleY:Ie.v/D.maxV})}},getData:function(S,E){var y=this.width/S,G=this.height/E,j,V,z,U,D,J,$,K,Z,te,de=0,Ee,pe,ge,re,X,Q,me,ie,W,Re,Se,se=S*E*this.components.length;O(se);var we=new Uint8Array(se);switch(this.components.length){case 1:for(j=this.components[0],te=0;te<E;te++)for(D=j.lines[0|te*j.scaleY*G],Z=0;Z<S;Z++)Ee=D[0|Z*j.scaleX*y],we[de++]=Ee;break;case 2:for(j=this.components[0],V=this.components[1],te=0;te<E;te++)for(D=j.lines[0|te*j.scaleY*G],J=V.lines[0|te*V.scaleY*G],Z=0;Z<S;Z++)Ee=D[0|Z*j.scaleX*y],we[de++]=Ee,Ee=J[0|Z*V.scaleX*y],we[de++]=Ee;break;case 3:for(Se=!0,this.adobe&&this.adobe.transformCode?Se=!0:typeof this.opts.colorTransform<"u"&&(Se=!!this.opts.colorTransform),j=this.components[0],V=this.components[1],z=this.components[2],te=0;te<E;te++)for(D=j.lines[0|te*j.scaleY*G],J=V.lines[0|te*V.scaleY*G],$=z.lines[0|te*z.scaleY*G],Z=0;Z<S;Z++)Se?(Ee=D[0|Z*j.scaleX*y],pe=J[0|Z*V.scaleX*y],ge=$[0|Z*z.scaleX*y],ie=d(Ee+1.402*(ge-128)),W=d(Ee-.3441363*(pe-128)-.71413636*(ge-128)),Re=d(Ee+1.772*(pe-128))):(ie=D[0|Z*j.scaleX*y],W=J[0|Z*V.scaleX*y],Re=$[0|Z*z.scaleX*y]),we[de++]=ie,we[de++]=W,we[de++]=Re;break;case 4:if(!this.adobe)throw new Error("Unsupported color mode (4 components)");for(Se=!1,this.adobe&&this.adobe.transformCode?Se=!0:typeof this.opts.colorTransform<"u"&&(Se=!!this.opts.colorTransform),j=this.components[0],V=this.components[1],z=this.components[2],U=this.components[3],te=0;te<E;te++)for(D=j.lines[0|te*j.scaleY*G],J=V.lines[0|te*V.scaleY*G],$=z.lines[0|te*z.scaleY*G],K=U.lines[0|te*U.scaleY*G],Z=0;Z<S;Z++)Se?(Ee=D[0|Z*j.scaleX*y],pe=J[0|Z*V.scaleX*y],ge=$[0|Z*z.scaleX*y],re=K[0|Z*U.scaleX*y],X=255-d(Ee+1.402*(ge-128)),Q=255-d(Ee-.3441363*(pe-128)-.71413636*(ge-128)),me=255-d(Ee+1.772*(pe-128))):(X=D[0|Z*j.scaleX*y],Q=J[0|Z*V.scaleX*y],me=$[0|Z*z.scaleX*y],re=K[0|Z*U.scaleX*y]),we[de++]=255-X,we[de++]=255-Q,we[de++]=255-me,we[de++]=255-re;break;default:throw new Error("Unsupported color mode")}return we},copyToImageData:function(S,E){var y=S.width,G=S.height,j=S.data,V=this.getData(y,G),z=0,U=0,D,J,$,K,Z,te,de,Ee,pe;switch(this.components.length){case 1:for(J=0;J<G;J++)for(D=0;D<y;D++)$=V[z++],j[U++]=$,j[U++]=$,j[U++]=$,E&&(j[U++]=255);break;case 3:for(J=0;J<G;J++)for(D=0;D<y;D++)de=V[z++],Ee=V[z++],pe=V[z++],j[U++]=de,j[U++]=Ee,j[U++]=pe,E&&(j[U++]=255);break;case 4:for(J=0;J<G;J++)for(D=0;D<y;D++)Z=V[z++],te=V[z++],$=V[z++],K=V[z++],de=255-d(Z*(1-K/255)+K),Ee=255-d(te*(1-K/255)+K),pe=255-d($*(1-K/255)+K),j[U++]=de,j[U++]=Ee,j[U++]=pe,E&&(j[U++]=255);break;default:throw new Error("Unsupported color mode")}}};var _=0,A=0;function O(N=0){var S=_+N;if(S>A){var E=Math.ceil((S-A)/1024/1024);throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${E}MB`)}_=S}return p.resetMaxMemoryUsage=function(N){_=0,A=N},p.getBytesAllocated=function(){return _},p.requestMemoryAllocation=O,p})();g.exports=o;function o(a,T={}){var t={colorTransform:void 0,useTArray:!1,formatAsRGBA:!0,tolerantDecoding:!0,maxResolutionInMP:100,maxMemoryUsageInMB:512},n={...t,...T},h=new Uint8Array(a),s=new r;s.opts=n,r.resetMaxMemoryUsage(n.maxMemoryUsageInMB*1024*1024),s.parse(h);var m=n.formatAsRGBA?4:3,x=s.width*s.height*m;try{r.requestMemoryAllocation(x);var f={width:s.width,height:s.height,exifBuffer:s.exifBuffer,data:n.useTArray?new Uint8Array(x):Buffer.alloc(x)};s.comments.length>0&&(f.comments=s.comments)}catch(v){throw v instanceof RangeError?new Error("Could not allocate enough memory for the image. Required: "+x):v instanceof ReferenceError&&v.message==="Buffer is not defined"?new Error("Buffer is not globally defined in this environment. Consider setting useTArray to true"):v}return s.copyToImageData(f,n.formatAsRGBA),f}})(wr)),wr.exports}var Tr,tt;function Qt(){if(tt)return Tr;tt=1;var g=Wt(),r=Jt();return Tr={encode:g,decode:r},Tr}Qt();function en(g){throw new Error('Could not dynamically require "'+g+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var yr={exports:{}},Er={},nt;function Je(){return nt||(nt=1,(function(g){var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";function o(t,n){return Object.prototype.hasOwnProperty.call(t,n)}g.assign=function(t){for(var n=Array.prototype.slice.call(arguments,1);n.length;){var h=n.shift();if(h){if(typeof h!="object")throw new TypeError(h+"must be non-object");for(var s in h)o(h,s)&&(t[s]=h[s])}}return t},g.shrinkBuf=function(t,n){return t.length===n?t:t.subarray?t.subarray(0,n):(t.length=n,t)};var a={arraySet:function(t,n,h,s,m){if(n.subarray&&t.subarray){t.set(n.subarray(h,h+s),m);return}for(var x=0;x<s;x++)t[m+x]=n[h+x]},flattenChunks:function(t){var n,h,s,m,x,f;for(s=0,n=0,h=t.length;n<h;n++)s+=t[n].length;for(f=new Uint8Array(s),m=0,n=0,h=t.length;n<h;n++)x=t[n],f.set(x,m),m+=x.length;return f}},T={arraySet:function(t,n,h,s,m){for(var x=0;x<s;x++)t[m+x]=n[h+x]},flattenChunks:function(t){return[].concat.apply([],t)}};g.setTyped=function(t){t?(g.Buf8=Uint8Array,g.Buf16=Uint16Array,g.Buf32=Int32Array,g.assign(g,a)):(g.Buf8=Array,g.Buf16=Array,g.Buf32=Array,g.assign(g,T))},g.setTyped(r)})(Er)),Er}var or={},Ke={},tr={},at;function rn(){if(at)return tr;at=1;var g=Je(),r=4,o=0,a=1,T=2;function t(u){for(var M=u.length;--M>=0;)u[M]=0}var n=0,h=1,s=2,m=3,x=258,f=29,v=256,p=v+1+f,c=30,C=19,I=2*p+1,d=15,_=16,A=7,O=256,N=16,S=17,E=18,y=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],G=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],j=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],V=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=512,U=new Array((p+2)*2);t(U);var D=new Array(c*2);t(D);var J=new Array(z);t(J);var $=new Array(x-m+1);t($);var K=new Array(f);t(K);var Z=new Array(c);t(Z);function te(u,M,P,Y,w){this.static_tree=u,this.extra_bits=M,this.extra_base=P,this.elems=Y,this.max_length=w,this.has_stree=u&&u.length}var de,Ee,pe;function ge(u,M){this.dyn_tree=u,this.max_code=0,this.stat_desc=M}function re(u){return u<256?J[u]:J[256+(u>>>7)]}function X(u,M){u.pending_buf[u.pending++]=M&255,u.pending_buf[u.pending++]=M>>>8&255}function Q(u,M,P){u.bi_valid>_-P?(u.bi_buf|=M<<u.bi_valid&65535,X(u,u.bi_buf),u.bi_buf=M>>_-u.bi_valid,u.bi_valid+=P-_):(u.bi_buf|=M<<u.bi_valid&65535,u.bi_valid+=P)}function me(u,M,P){Q(u,P[M*2],P[M*2+1])}function ie(u,M){var P=0;do P|=u&1,u>>>=1,P<<=1;while(--M>0);return P>>>1}function W(u){u.bi_valid===16?(X(u,u.bi_buf),u.bi_buf=0,u.bi_valid=0):u.bi_valid>=8&&(u.pending_buf[u.pending++]=u.bi_buf&255,u.bi_buf>>=8,u.bi_valid-=8)}function Re(u,M){var P=M.dyn_tree,Y=M.max_code,w=M.stat_desc.static_tree,B=M.stat_desc.has_stree,i=M.stat_desc.extra_bits,H=M.stat_desc.extra_base,Te=M.stat_desc.max_length,e,R,L,l,b,k,xe=0;for(l=0;l<=d;l++)u.bl_count[l]=0;for(P[u.heap[u.heap_max]*2+1]=0,e=u.heap_max+1;e<I;e++)R=u.heap[e],l=P[P[R*2+1]*2+1]+1,l>Te&&(l=Te,xe++),P[R*2+1]=l,!(R>Y)&&(u.bl_count[l]++,b=0,R>=H&&(b=i[R-H]),k=P[R*2],u.opt_len+=k*(l+b),B&&(u.static_len+=k*(w[R*2+1]+b)));if(xe!==0){do{for(l=Te-1;u.bl_count[l]===0;)l--;u.bl_count[l]--,u.bl_count[l+1]+=2,u.bl_count[Te]--,xe-=2}while(xe>0);for(l=Te;l!==0;l--)for(R=u.bl_count[l];R!==0;)L=u.heap[--e],!(L>Y)&&(P[L*2+1]!==l&&(u.opt_len+=(l-P[L*2+1])*P[L*2],P[L*2+1]=l),R--)}}function Se(u,M,P){var Y=new Array(d+1),w=0,B,i;for(B=1;B<=d;B++)Y[B]=w=w+P[B-1]<<1;for(i=0;i<=M;i++){var H=u[i*2+1];H!==0&&(u[i*2]=ie(Y[H]++,H))}}function se(){var u,M,P,Y,w,B=new Array(d+1);for(P=0,Y=0;Y<f-1;Y++)for(K[Y]=P,u=0;u<1<<y[Y];u++)$[P++]=Y;for($[P-1]=Y,w=0,Y=0;Y<16;Y++)for(Z[Y]=w,u=0;u<1<<G[Y];u++)J[w++]=Y;for(w>>=7;Y<c;Y++)for(Z[Y]=w<<7,u=0;u<1<<G[Y]-7;u++)J[256+w++]=Y;for(M=0;M<=d;M++)B[M]=0;for(u=0;u<=143;)U[u*2+1]=8,u++,B[8]++;for(;u<=255;)U[u*2+1]=9,u++,B[9]++;for(;u<=279;)U[u*2+1]=7,u++,B[7]++;for(;u<=287;)U[u*2+1]=8,u++,B[8]++;for(Se(U,p+1,B),u=0;u<c;u++)D[u*2+1]=5,D[u*2]=ie(u,5);de=new te(U,y,v+1,p,d),Ee=new te(D,G,0,c,d),pe=new te(new Array(0),j,0,C,A)}function we(u){var M;for(M=0;M<p;M++)u.dyn_ltree[M*2]=0;for(M=0;M<c;M++)u.dyn_dtree[M*2]=0;for(M=0;M<C;M++)u.bl_tree[M*2]=0;u.dyn_ltree[O*2]=1,u.opt_len=u.static_len=0,u.last_lit=u.matches=0}function oe(u){u.bi_valid>8?X(u,u.bi_buf):u.bi_valid>0&&(u.pending_buf[u.pending++]=u.bi_buf),u.bi_buf=0,u.bi_valid=0}function q(u,M,P,Y){oe(u),X(u,P),X(u,~P),g.arraySet(u.pending_buf,u.window,M,P,u.pending),u.pending+=P}function ye(u,M,P,Y){var w=M*2,B=P*2;return u[w]<u[B]||u[w]===u[B]&&Y[M]<=Y[P]}function le(u,M,P){for(var Y=u.heap[P],w=P<<1;w<=u.heap_len&&(w<u.heap_len&&ye(M,u.heap[w+1],u.heap[w],u.depth)&&w++,!ye(M,Y,u.heap[w],u.depth));)u.heap[P]=u.heap[w],P=w,w<<=1;u.heap[P]=Y}function ee(u,M,P){var Y,w,B=0,i,H;if(u.last_lit!==0)do Y=u.pending_buf[u.d_buf+B*2]<<8|u.pending_buf[u.d_buf+B*2+1],w=u.pending_buf[u.l_buf+B],B++,Y===0?me(u,w,M):(i=$[w],me(u,i+v+1,M),H=y[i],H!==0&&(w-=K[i],Q(u,w,H)),Y--,i=re(Y),me(u,i,P),H=G[i],H!==0&&(Y-=Z[i],Q(u,Y,H)));while(B<u.last_lit);me(u,O,M)}function F(u,M){var P=M.dyn_tree,Y=M.stat_desc.static_tree,w=M.stat_desc.has_stree,B=M.stat_desc.elems,i,H,Te=-1,e;for(u.heap_len=0,u.heap_max=I,i=0;i<B;i++)P[i*2]!==0?(u.heap[++u.heap_len]=Te=i,u.depth[i]=0):P[i*2+1]=0;for(;u.heap_len<2;)e=u.heap[++u.heap_len]=Te<2?++Te:0,P[e*2]=1,u.depth[e]=0,u.opt_len--,w&&(u.static_len-=Y[e*2+1]);for(M.max_code=Te,i=u.heap_len>>1;i>=1;i--)le(u,P,i);e=B;do i=u.heap[1],u.heap[1]=u.heap[u.heap_len--],le(u,P,1),H=u.heap[1],u.heap[--u.heap_max]=i,u.heap[--u.heap_max]=H,P[e*2]=P[i*2]+P[H*2],u.depth[e]=(u.depth[i]>=u.depth[H]?u.depth[i]:u.depth[H])+1,P[i*2+1]=P[H*2+1]=e,u.heap[1]=e++,le(u,P,1);while(u.heap_len>=2);u.heap[--u.heap_max]=u.heap[1],Re(u,M),Se(P,Te,u.bl_count)}function _e(u,M,P){var Y,w=-1,B,i=M[1],H=0,Te=7,e=4;for(i===0&&(Te=138,e=3),M[(P+1)*2+1]=65535,Y=0;Y<=P;Y++)B=i,i=M[(Y+1)*2+1],!(++H<Te&&B===i)&&(H<e?u.bl_tree[B*2]+=H:B!==0?(B!==w&&u.bl_tree[B*2]++,u.bl_tree[N*2]++):H<=10?u.bl_tree[S*2]++:u.bl_tree[E*2]++,H=0,w=B,i===0?(Te=138,e=3):B===i?(Te=6,e=3):(Te=7,e=4))}function ve(u,M,P){var Y,w=-1,B,i=M[1],H=0,Te=7,e=4;for(i===0&&(Te=138,e=3),Y=0;Y<=P;Y++)if(B=i,i=M[(Y+1)*2+1],!(++H<Te&&B===i)){if(H<e)do me(u,B,u.bl_tree);while(--H!==0);else B!==0?(B!==w&&(me(u,B,u.bl_tree),H--),me(u,N,u.bl_tree),Q(u,H-3,2)):H<=10?(me(u,S,u.bl_tree),Q(u,H-3,3)):(me(u,E,u.bl_tree),Q(u,H-11,7));H=0,w=B,i===0?(Te=138,e=3):B===i?(Te=6,e=3):(Te=7,e=4)}}function be(u){var M;for(_e(u,u.dyn_ltree,u.l_desc.max_code),_e(u,u.dyn_dtree,u.d_desc.max_code),F(u,u.bl_desc),M=C-1;M>=3&&u.bl_tree[V[M]*2+1]===0;M--);return u.opt_len+=3*(M+1)+5+5+4,M}function ke(u,M,P,Y){var w;for(Q(u,M-257,5),Q(u,P-1,5),Q(u,Y-4,4),w=0;w<Y;w++)Q(u,u.bl_tree[V[w]*2+1],3);ve(u,u.dyn_ltree,M-1),ve(u,u.dyn_dtree,P-1)}function Me(u){var M=4093624447,P;for(P=0;P<=31;P++,M>>>=1)if(M&1&&u.dyn_ltree[P*2]!==0)return o;if(u.dyn_ltree[18]!==0||u.dyn_ltree[20]!==0||u.dyn_ltree[26]!==0)return a;for(P=32;P<v;P++)if(u.dyn_ltree[P*2]!==0)return a;return o}var Ie=!1;function fe(u){Ie||(se(),Ie=!0),u.l_desc=new ge(u.dyn_ltree,de),u.d_desc=new ge(u.dyn_dtree,Ee),u.bl_desc=new ge(u.bl_tree,pe),u.bi_buf=0,u.bi_valid=0,we(u)}function ce(u,M,P,Y){Q(u,(n<<1)+(Y?1:0),3),q(u,M,P)}function he(u){Q(u,h<<1,3),me(u,O,U),W(u)}function ae(u,M,P,Y){var w,B,i=0;u.level>0?(u.strm.data_type===T&&(u.strm.data_type=Me(u)),F(u,u.l_desc),F(u,u.d_desc),i=be(u),w=u.opt_len+3+7>>>3,B=u.static_len+3+7>>>3,B<=w&&(w=B)):w=B=P+5,P+4<=w&&M!==-1?ce(u,M,P,Y):u.strategy===r||B===w?(Q(u,(h<<1)+(Y?1:0),3),ee(u,U,D)):(Q(u,(s<<1)+(Y?1:0),3),ke(u,u.l_desc.max_code+1,u.d_desc.max_code+1,i+1),ee(u,u.dyn_ltree,u.dyn_dtree)),we(u),Y&&oe(u)}function Ae(u,M,P){return u.pending_buf[u.d_buf+u.last_lit*2]=M>>>8&255,u.pending_buf[u.d_buf+u.last_lit*2+1]=M&255,u.pending_buf[u.l_buf+u.last_lit]=P&255,u.last_lit++,M===0?u.dyn_ltree[P*2]++:(u.matches++,M--,u.dyn_ltree[($[P]+v+1)*2]++,u.dyn_dtree[re(M)*2]++),u.last_lit===u.lit_bufsize-1}return tr._tr_init=fe,tr._tr_stored_block=ce,tr._tr_flush_block=ae,tr._tr_tally=Ae,tr._tr_align=he,tr}var Sr,it;function kt(){if(it)return Sr;it=1;function g(r,o,a,T){for(var t=r&65535|0,n=r>>>16&65535|0,h=0;a!==0;){h=a>2e3?2e3:a,a-=h;do t=t+o[T++]|0,n=n+t|0;while(--h);t%=65521,n%=65521}return t|n<<16|0}return Sr=g,Sr}var Ar,st;function Rt(){if(st)return Ar;st=1;function g(){for(var a,T=[],t=0;t<256;t++){a=t;for(var n=0;n<8;n++)a=a&1?3988292384^a>>>1:a>>>1;T[t]=a}return T}var r=g();function o(a,T,t,n){var h=r,s=n+t;a^=-1;for(var m=n;m<s;m++)a=a>>>8^h[(a^T[m])&255];return a^-1}return Ar=o,Ar}var kr,ot;function Gr(){return ot||(ot=1,kr={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}),kr}var lt;function tn(){if(lt)return Ke;lt=1;var g=Je(),r=rn(),o=kt(),a=Rt(),T=Gr(),t=0,n=1,h=3,s=4,m=5,x=0,f=1,v=-2,p=-3,c=-5,C=-1,I=1,d=2,_=3,A=4,O=0,N=2,S=8,E=9,y=15,G=8,j=29,V=256,z=V+1+j,U=30,D=19,J=2*z+1,$=15,K=3,Z=258,te=Z+K+1,de=32,Ee=42,pe=69,ge=73,re=91,X=103,Q=113,me=666,ie=1,W=2,Re=3,Se=4,se=3;function we(e,R){return e.msg=T[R],R}function oe(e){return(e<<1)-(e>4?9:0)}function q(e){for(var R=e.length;--R>=0;)e[R]=0}function ye(e){var R=e.state,L=R.pending;L>e.avail_out&&(L=e.avail_out),L!==0&&(g.arraySet(e.output,R.pending_buf,R.pending_out,L,e.next_out),e.next_out+=L,R.pending_out+=L,e.total_out+=L,e.avail_out-=L,R.pending-=L,R.pending===0&&(R.pending_out=0))}function le(e,R){r._tr_flush_block(e,e.block_start>=0?e.block_start:-1,e.strstart-e.block_start,R),e.block_start=e.strstart,ye(e.strm)}function ee(e,R){e.pending_buf[e.pending++]=R}function F(e,R){e.pending_buf[e.pending++]=R>>>8&255,e.pending_buf[e.pending++]=R&255}function _e(e,R,L,l){var b=e.avail_in;return b>l&&(b=l),b===0?0:(e.avail_in-=b,g.arraySet(R,e.input,e.next_in,b,L),e.state.wrap===1?e.adler=o(e.adler,R,b,L):e.state.wrap===2&&(e.adler=a(e.adler,R,b,L)),e.next_in+=b,e.total_in+=b,b)}function ve(e,R){var L=e.max_chain_length,l=e.strstart,b,k,xe=e.prev_length,ne=e.nice_match,ue=e.strstart>e.w_size-te?e.strstart-(e.w_size-te):0,Fe=e.window,Ye=e.w_mask,Be=e.prev,Ce=e.strstart+Z,Le=Fe[l+xe-1],Pe=Fe[l+xe];e.prev_length>=e.good_match&&(L>>=2),ne>e.lookahead&&(ne=e.lookahead);do if(b=R,!(Fe[b+xe]!==Pe||Fe[b+xe-1]!==Le||Fe[b]!==Fe[l]||Fe[++b]!==Fe[l+1])){l+=2,b++;do;while(Fe[++l]===Fe[++b]&&Fe[++l]===Fe[++b]&&Fe[++l]===Fe[++b]&&Fe[++l]===Fe[++b]&&Fe[++l]===Fe[++b]&&Fe[++l]===Fe[++b]&&Fe[++l]===Fe[++b]&&Fe[++l]===Fe[++b]&&l<Ce);if(k=Z-(Ce-l),l=Ce-Z,k>xe){if(e.match_start=R,xe=k,k>=ne)break;Le=Fe[l+xe-1],Pe=Fe[l+xe]}}while((R=Be[R&Ye])>ue&&--L!==0);return xe<=e.lookahead?xe:e.lookahead}function be(e){var R=e.w_size,L,l,b,k,xe;do{if(k=e.window_size-e.lookahead-e.strstart,e.strstart>=R+(R-te)){g.arraySet(e.window,e.window,R,R,0),e.match_start-=R,e.strstart-=R,e.block_start-=R,l=e.hash_size,L=l;do b=e.head[--L],e.head[L]=b>=R?b-R:0;while(--l);l=R,L=l;do b=e.prev[--L],e.prev[L]=b>=R?b-R:0;while(--l);k+=R}if(e.strm.avail_in===0)break;if(l=_e(e.strm,e.window,e.strstart+e.lookahead,k),e.lookahead+=l,e.lookahead+e.insert>=K)for(xe=e.strstart-e.insert,e.ins_h=e.window[xe],e.ins_h=(e.ins_h<<e.hash_shift^e.window[xe+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[xe+K-1])&e.hash_mask,e.prev[xe&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=xe,xe++,e.insert--,!(e.lookahead+e.insert<K)););}while(e.lookahead<te&&e.strm.avail_in!==0)}function ke(e,R){var L=65535;for(L>e.pending_buf_size-5&&(L=e.pending_buf_size-5);;){if(e.lookahead<=1){if(be(e),e.lookahead===0&&R===t)return ie;if(e.lookahead===0)break}e.strstart+=e.lookahead,e.lookahead=0;var l=e.block_start+L;if((e.strstart===0||e.strstart>=l)&&(e.lookahead=e.strstart-l,e.strstart=l,le(e,!1),e.strm.avail_out===0)||e.strstart-e.block_start>=e.w_size-te&&(le(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,R===s?(le(e,!0),e.strm.avail_out===0?Re:Se):(e.strstart>e.block_start&&(le(e,!1),e.strm.avail_out===0),ie)}function Me(e,R){for(var L,l;;){if(e.lookahead<te){if(be(e),e.lookahead<te&&R===t)return ie;if(e.lookahead===0)break}if(L=0,e.lookahead>=K&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,L=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),L!==0&&e.strstart-L<=e.w_size-te&&(e.match_length=ve(e,L)),e.match_length>=K)if(l=r._tr_tally(e,e.strstart-e.match_start,e.match_length-K),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=K){e.match_length--;do e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,L=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart;while(--e.match_length!==0);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else l=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(l&&(le(e,!1),e.strm.avail_out===0))return ie}return e.insert=e.strstart<K-1?e.strstart:K-1,R===s?(le(e,!0),e.strm.avail_out===0?Re:Se):e.last_lit&&(le(e,!1),e.strm.avail_out===0)?ie:W}function Ie(e,R){for(var L,l,b;;){if(e.lookahead<te){if(be(e),e.lookahead<te&&R===t)return ie;if(e.lookahead===0)break}if(L=0,e.lookahead>=K&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,L=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=K-1,L!==0&&e.prev_length<e.max_lazy_match&&e.strstart-L<=e.w_size-te&&(e.match_length=ve(e,L),e.match_length<=5&&(e.strategy===I||e.match_length===K&&e.strstart-e.match_start>4096)&&(e.match_length=K-1)),e.prev_length>=K&&e.match_length<=e.prev_length){b=e.strstart+e.lookahead-K,l=r._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-K),e.lookahead-=e.prev_length-1,e.prev_length-=2;do++e.strstart<=b&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,L=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart);while(--e.prev_length!==0);if(e.match_available=0,e.match_length=K-1,e.strstart++,l&&(le(e,!1),e.strm.avail_out===0))return ie}else if(e.match_available){if(l=r._tr_tally(e,0,e.window[e.strstart-1]),l&&le(e,!1),e.strstart++,e.lookahead--,e.strm.avail_out===0)return ie}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(l=r._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<K-1?e.strstart:K-1,R===s?(le(e,!0),e.strm.avail_out===0?Re:Se):e.last_lit&&(le(e,!1),e.strm.avail_out===0)?ie:W}function fe(e,R){for(var L,l,b,k,xe=e.window;;){if(e.lookahead<=Z){if(be(e),e.lookahead<=Z&&R===t)return ie;if(e.lookahead===0)break}if(e.match_length=0,e.lookahead>=K&&e.strstart>0&&(b=e.strstart-1,l=xe[b],l===xe[++b]&&l===xe[++b]&&l===xe[++b])){k=e.strstart+Z;do;while(l===xe[++b]&&l===xe[++b]&&l===xe[++b]&&l===xe[++b]&&l===xe[++b]&&l===xe[++b]&&l===xe[++b]&&l===xe[++b]&&b<k);e.match_length=Z-(k-b),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=K?(L=r._tr_tally(e,1,e.match_length-K),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(L=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),L&&(le(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,R===s?(le(e,!0),e.strm.avail_out===0?Re:Se):e.last_lit&&(le(e,!1),e.strm.avail_out===0)?ie:W}function ce(e,R){for(var L;;){if(e.lookahead===0&&(be(e),e.lookahead===0)){if(R===t)return ie;break}if(e.match_length=0,L=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,L&&(le(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,R===s?(le(e,!0),e.strm.avail_out===0?Re:Se):e.last_lit&&(le(e,!1),e.strm.avail_out===0)?ie:W}function he(e,R,L,l,b){this.good_length=e,this.max_lazy=R,this.nice_length=L,this.max_chain=l,this.func=b}var ae;ae=[new he(0,0,0,0,ke),new he(4,4,8,4,Me),new he(4,5,16,8,Me),new he(4,6,32,32,Me),new he(4,4,16,16,Ie),new he(8,16,32,32,Ie),new he(8,16,128,128,Ie),new he(8,32,128,256,Ie),new he(32,128,258,1024,Ie),new he(32,258,258,4096,Ie)];function Ae(e){e.window_size=2*e.w_size,q(e.head),e.max_lazy_match=ae[e.level].max_lazy,e.good_match=ae[e.level].good_length,e.nice_match=ae[e.level].nice_length,e.max_chain_length=ae[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=K-1,e.match_available=0,e.ins_h=0}function u(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=S,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new g.Buf16(J*2),this.dyn_dtree=new g.Buf16((2*U+1)*2),this.bl_tree=new g.Buf16((2*D+1)*2),q(this.dyn_ltree),q(this.dyn_dtree),q(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new g.Buf16($+1),this.heap=new g.Buf16(2*z+1),q(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new g.Buf16(2*z+1),q(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function M(e){var R;return!e||!e.state?we(e,v):(e.total_in=e.total_out=0,e.data_type=N,R=e.state,R.pending=0,R.pending_out=0,R.wrap<0&&(R.wrap=-R.wrap),R.status=R.wrap?Ee:Q,e.adler=R.wrap===2?0:1,R.last_flush=t,r._tr_init(R),x)}function P(e){var R=M(e);return R===x&&Ae(e.state),R}function Y(e,R){return!e||!e.state||e.state.wrap!==2?v:(e.state.gzhead=R,x)}function w(e,R,L,l,b,k){if(!e)return v;var xe=1;if(R===C&&(R=6),l<0?(xe=0,l=-l):l>15&&(xe=2,l-=16),b<1||b>E||L!==S||l<8||l>15||R<0||R>9||k<0||k>A)return we(e,v);l===8&&(l=9);var ne=new u;return e.state=ne,ne.strm=e,ne.wrap=xe,ne.gzhead=null,ne.w_bits=l,ne.w_size=1<<ne.w_bits,ne.w_mask=ne.w_size-1,ne.hash_bits=b+7,ne.hash_size=1<<ne.hash_bits,ne.hash_mask=ne.hash_size-1,ne.hash_shift=~~((ne.hash_bits+K-1)/K),ne.window=new g.Buf8(ne.w_size*2),ne.head=new g.Buf16(ne.hash_size),ne.prev=new g.Buf16(ne.w_size),ne.lit_bufsize=1<<b+6,ne.pending_buf_size=ne.lit_bufsize*4,ne.pending_buf=new g.Buf8(ne.pending_buf_size),ne.d_buf=1*ne.lit_bufsize,ne.l_buf=3*ne.lit_bufsize,ne.level=R,ne.strategy=k,ne.method=L,P(e)}function B(e,R){return w(e,R,S,y,G,O)}function i(e,R){var L,l,b,k;if(!e||!e.state||R>m||R<0)return e?we(e,v):v;if(l=e.state,!e.output||!e.input&&e.avail_in!==0||l.status===me&&R!==s)return we(e,e.avail_out===0?c:v);if(l.strm=e,L=l.last_flush,l.last_flush=R,l.status===Ee)if(l.wrap===2)e.adler=0,ee(l,31),ee(l,139),ee(l,8),l.gzhead?(ee(l,(l.gzhead.text?1:0)+(l.gzhead.hcrc?2:0)+(l.gzhead.extra?4:0)+(l.gzhead.name?8:0)+(l.gzhead.comment?16:0)),ee(l,l.gzhead.time&255),ee(l,l.gzhead.time>>8&255),ee(l,l.gzhead.time>>16&255),ee(l,l.gzhead.time>>24&255),ee(l,l.level===9?2:l.strategy>=d||l.level<2?4:0),ee(l,l.gzhead.os&255),l.gzhead.extra&&l.gzhead.extra.length&&(ee(l,l.gzhead.extra.length&255),ee(l,l.gzhead.extra.length>>8&255)),l.gzhead.hcrc&&(e.adler=a(e.adler,l.pending_buf,l.pending,0)),l.gzindex=0,l.status=pe):(ee(l,0),ee(l,0),ee(l,0),ee(l,0),ee(l,0),ee(l,l.level===9?2:l.strategy>=d||l.level<2?4:0),ee(l,se),l.status=Q);else{var xe=S+(l.w_bits-8<<4)<<8,ne=-1;l.strategy>=d||l.level<2?ne=0:l.level<6?ne=1:l.level===6?ne=2:ne=3,xe|=ne<<6,l.strstart!==0&&(xe|=de),xe+=31-xe%31,l.status=Q,F(l,xe),l.strstart!==0&&(F(l,e.adler>>>16),F(l,e.adler&65535)),e.adler=1}if(l.status===pe)if(l.gzhead.extra){for(b=l.pending;l.gzindex<(l.gzhead.extra.length&65535)&&!(l.pending===l.pending_buf_size&&(l.gzhead.hcrc&&l.pending>b&&(e.adler=a(e.adler,l.pending_buf,l.pending-b,b)),ye(e),b=l.pending,l.pending===l.pending_buf_size));)ee(l,l.gzhead.extra[l.gzindex]&255),l.gzindex++;l.gzhead.hcrc&&l.pending>b&&(e.adler=a(e.adler,l.pending_buf,l.pending-b,b)),l.gzindex===l.gzhead.extra.length&&(l.gzindex=0,l.status=ge)}else l.status=ge;if(l.status===ge)if(l.gzhead.name){b=l.pending;do{if(l.pending===l.pending_buf_size&&(l.gzhead.hcrc&&l.pending>b&&(e.adler=a(e.adler,l.pending_buf,l.pending-b,b)),ye(e),b=l.pending,l.pending===l.pending_buf_size)){k=1;break}l.gzindex<l.gzhead.name.length?k=l.gzhead.name.charCodeAt(l.gzindex++)&255:k=0,ee(l,k)}while(k!==0);l.gzhead.hcrc&&l.pending>b&&(e.adler=a(e.adler,l.pending_buf,l.pending-b,b)),k===0&&(l.gzindex=0,l.status=re)}else l.status=re;if(l.status===re)if(l.gzhead.comment){b=l.pending;do{if(l.pending===l.pending_buf_size&&(l.gzhead.hcrc&&l.pending>b&&(e.adler=a(e.adler,l.pending_buf,l.pending-b,b)),ye(e),b=l.pending,l.pending===l.pending_buf_size)){k=1;break}l.gzindex<l.gzhead.comment.length?k=l.gzhead.comment.charCodeAt(l.gzindex++)&255:k=0,ee(l,k)}while(k!==0);l.gzhead.hcrc&&l.pending>b&&(e.adler=a(e.adler,l.pending_buf,l.pending-b,b)),k===0&&(l.status=X)}else l.status=X;if(l.status===X&&(l.gzhead.hcrc?(l.pending+2>l.pending_buf_size&&ye(e),l.pending+2<=l.pending_buf_size&&(ee(l,e.adler&255),ee(l,e.adler>>8&255),e.adler=0,l.status=Q)):l.status=Q),l.pending!==0){if(ye(e),e.avail_out===0)return l.last_flush=-1,x}else if(e.avail_in===0&&oe(R)<=oe(L)&&R!==s)return we(e,c);if(l.status===me&&e.avail_in!==0)return we(e,c);if(e.avail_in!==0||l.lookahead!==0||R!==t&&l.status!==me){var ue=l.strategy===d?ce(l,R):l.strategy===_?fe(l,R):ae[l.level].func(l,R);if((ue===Re||ue===Se)&&(l.status=me),ue===ie||ue===Re)return e.avail_out===0&&(l.last_flush=-1),x;if(ue===W&&(R===n?r._tr_align(l):R!==m&&(r._tr_stored_block(l,0,0,!1),R===h&&(q(l.head),l.lookahead===0&&(l.strstart=0,l.block_start=0,l.insert=0))),ye(e),e.avail_out===0))return l.last_flush=-1,x}return R!==s?x:l.wrap<=0?f:(l.wrap===2?(ee(l,e.adler&255),ee(l,e.adler>>8&255),ee(l,e.adler>>16&255),ee(l,e.adler>>24&255),ee(l,e.total_in&255),ee(l,e.total_in>>8&255),ee(l,e.total_in>>16&255),ee(l,e.total_in>>24&255)):(F(l,e.adler>>>16),F(l,e.adler&65535)),ye(e),l.wrap>0&&(l.wrap=-l.wrap),l.pending!==0?x:f)}function H(e){var R;return!e||!e.state?v:(R=e.state.status,R!==Ee&&R!==pe&&R!==ge&&R!==re&&R!==X&&R!==Q&&R!==me?we(e,v):(e.state=null,R===Q?we(e,p):x))}function Te(e,R){var L=R.length,l,b,k,xe,ne,ue,Fe,Ye;if(!e||!e.state||(l=e.state,xe=l.wrap,xe===2||xe===1&&l.status!==Ee||l.lookahead))return v;for(xe===1&&(e.adler=o(e.adler,R,L,0)),l.wrap=0,L>=l.w_size&&(xe===0&&(q(l.head),l.strstart=0,l.block_start=0,l.insert=0),Ye=new g.Buf8(l.w_size),g.arraySet(Ye,R,L-l.w_size,l.w_size,0),R=Ye,L=l.w_size),ne=e.avail_in,ue=e.next_in,Fe=e.input,e.avail_in=L,e.next_in=0,e.input=R,be(l);l.lookahead>=K;){b=l.strstart,k=l.lookahead-(K-1);do l.ins_h=(l.ins_h<<l.hash_shift^l.window[b+K-1])&l.hash_mask,l.prev[b&l.w_mask]=l.head[l.ins_h],l.head[l.ins_h]=b,b++;while(--k);l.strstart=b,l.lookahead=K-1,be(l)}return l.strstart+=l.lookahead,l.block_start=l.strstart,l.insert=l.lookahead,l.lookahead=0,l.match_length=l.prev_length=K-1,l.match_available=0,e.next_in=ue,e.input=Fe,e.avail_in=ne,l.wrap=xe,x}return Ke.deflateInit=B,Ke.deflateInit2=w,Ke.deflateReset=P,Ke.deflateResetKeep=M,Ke.deflateSetHeader=Y,Ke.deflate=i,Ke.deflateEnd=H,Ke.deflateSetDictionary=Te,Ke.deflateInfo="pako deflate (from Nodeca project)",Ke}var nr={},ft;function It(){if(ft)return nr;ft=1;var g=Je(),r=!0,o=!0;try{String.fromCharCode.apply(null,[0])}catch{r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{o=!1}for(var a=new g.Buf8(256),T=0;T<256;T++)a[T]=T>=252?6:T>=248?5:T>=240?4:T>=224?3:T>=192?2:1;a[254]=a[254]=1,nr.string2buf=function(n){var h,s,m,x,f,v=n.length,p=0;for(x=0;x<v;x++)s=n.charCodeAt(x),(s&64512)===55296&&x+1<v&&(m=n.charCodeAt(x+1),(m&64512)===56320&&(s=65536+(s-55296<<10)+(m-56320),x++)),p+=s<128?1:s<2048?2:s<65536?3:4;for(h=new g.Buf8(p),f=0,x=0;f<p;x++)s=n.charCodeAt(x),(s&64512)===55296&&x+1<v&&(m=n.charCodeAt(x+1),(m&64512)===56320&&(s=65536+(s-55296<<10)+(m-56320),x++)),s<128?h[f++]=s:s<2048?(h[f++]=192|s>>>6,h[f++]=128|s&63):s<65536?(h[f++]=224|s>>>12,h[f++]=128|s>>>6&63,h[f++]=128|s&63):(h[f++]=240|s>>>18,h[f++]=128|s>>>12&63,h[f++]=128|s>>>6&63,h[f++]=128|s&63);return h};function t(n,h){if(h<65534&&(n.subarray&&o||!n.subarray&&r))return String.fromCharCode.apply(null,g.shrinkBuf(n,h));for(var s="",m=0;m<h;m++)s+=String.fromCharCode(n[m]);return s}return nr.buf2binstring=function(n){return t(n,n.length)},nr.binstring2buf=function(n){for(var h=new g.Buf8(n.length),s=0,m=h.length;s<m;s++)h[s]=n.charCodeAt(s);return h},nr.buf2string=function(n,h){var s,m,x,f,v=h||n.length,p=new Array(v*2);for(m=0,s=0;s<v;){if(x=n[s++],x<128){p[m++]=x;continue}if(f=a[x],f>4){p[m++]=65533,s+=f-1;continue}for(x&=f===2?31:f===3?15:7;f>1&&s<v;)x=x<<6|n[s++]&63,f--;if(f>1){p[m++]=65533;continue}x<65536?p[m++]=x:(x-=65536,p[m++]=55296|x>>10&1023,p[m++]=56320|x&1023)}return t(p,m)},nr.utf8border=function(n,h){var s;for(h=h||n.length,h>n.length&&(h=n.length),s=h-1;s>=0&&(n[s]&192)===128;)s--;return s<0||s===0?h:s+a[n[s]]>h?s:h},nr}var Rr,ut;function Mt(){if(ut)return Rr;ut=1;function g(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}return Rr=g,Rr}var ct;function nn(){if(ct)return or;ct=1;var g=tn(),r=Je(),o=It(),a=Gr(),T=Mt(),t=Object.prototype.toString,n=0,h=4,s=0,m=1,x=2,f=-1,v=0,p=8;function c(_){if(!(this instanceof c))return new c(_);this.options=r.assign({level:f,method:p,chunkSize:16384,windowBits:15,memLevel:8,strategy:v,to:""},_||{});var A=this.options;A.raw&&A.windowBits>0?A.windowBits=-A.windowBits:A.gzip&&A.windowBits>0&&A.windowBits<16&&(A.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new T,this.strm.avail_out=0;var O=g.deflateInit2(this.strm,A.level,A.method,A.windowBits,A.memLevel,A.strategy);if(O!==s)throw new Error(a[O]);if(A.header&&g.deflateSetHeader(this.strm,A.header),A.dictionary){var N;if(typeof A.dictionary=="string"?N=o.string2buf(A.dictionary):t.call(A.dictionary)==="[object ArrayBuffer]"?N=new Uint8Array(A.dictionary):N=A.dictionary,O=g.deflateSetDictionary(this.strm,N),O!==s)throw new Error(a[O]);this._dict_set=!0}}c.prototype.push=function(_,A){var O=this.strm,N=this.options.chunkSize,S,E;if(this.ended)return!1;E=A===~~A?A:A===!0?h:n,typeof _=="string"?O.input=o.string2buf(_):t.call(_)==="[object ArrayBuffer]"?O.input=new Uint8Array(_):O.input=_,O.next_in=0,O.avail_in=O.input.length;do{if(O.avail_out===0&&(O.output=new r.Buf8(N),O.next_out=0,O.avail_out=N),S=g.deflate(O,E),S!==m&&S!==s)return this.onEnd(S),this.ended=!0,!1;(O.avail_out===0||O.avail_in===0&&(E===h||E===x))&&(this.options.to==="string"?this.onData(o.buf2binstring(r.shrinkBuf(O.output,O.next_out))):this.onData(r.shrinkBuf(O.output,O.next_out)))}while((O.avail_in>0||O.avail_out===0)&&S!==m);return E===h?(S=g.deflateEnd(this.strm),this.onEnd(S),this.ended=!0,S===s):(E===x&&(this.onEnd(s),O.avail_out=0),!0)},c.prototype.onData=function(_){this.chunks.push(_)},c.prototype.onEnd=function(_){_===s&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=_,this.msg=this.strm.msg};function C(_,A){var O=new c(A);if(O.push(_,!0),O.err)throw O.msg||a[O.err];return O.result}function I(_,A){return A=A||{},A.raw=!0,C(_,A)}function d(_,A){return A=A||{},A.gzip=!0,C(_,A)}return or.Deflate=c,or.deflate=C,or.deflateRaw=I,or.gzip=d,or}var lr={},qe={},Ir,ht;function an(){if(ht)return Ir;ht=1;var g=30,r=12;return Ir=function(a,T){var t,n,h,s,m,x,f,v,p,c,C,I,d,_,A,O,N,S,E,y,G,j,V,z,U;t=a.state,n=a.next_in,z=a.input,h=n+(a.avail_in-5),s=a.next_out,U=a.output,m=s-(T-a.avail_out),x=s+(a.avail_out-257),f=t.dmax,v=t.wsize,p=t.whave,c=t.wnext,C=t.window,I=t.hold,d=t.bits,_=t.lencode,A=t.distcode,O=(1<<t.lenbits)-1,N=(1<<t.distbits)-1;e:do{d<15&&(I+=z[n++]<<d,d+=8,I+=z[n++]<<d,d+=8),S=_[I&O];r:for(;;){if(E=S>>>24,I>>>=E,d-=E,E=S>>>16&255,E===0)U[s++]=S&65535;else if(E&16){y=S&65535,E&=15,E&&(d<E&&(I+=z[n++]<<d,d+=8),y+=I&(1<<E)-1,I>>>=E,d-=E),d<15&&(I+=z[n++]<<d,d+=8,I+=z[n++]<<d,d+=8),S=A[I&N];t:for(;;){if(E=S>>>24,I>>>=E,d-=E,E=S>>>16&255,E&16){if(G=S&65535,E&=15,d<E&&(I+=z[n++]<<d,d+=8,d<E&&(I+=z[n++]<<d,d+=8)),G+=I&(1<<E)-1,G>f){a.msg="invalid distance too far back",t.mode=g;break e}if(I>>>=E,d-=E,E=s-m,G>E){if(E=G-E,E>p&&t.sane){a.msg="invalid distance too far back",t.mode=g;break e}if(j=0,V=C,c===0){if(j+=v-E,E<y){y-=E;do U[s++]=C[j++];while(--E);j=s-G,V=U}}else if(c<E){if(j+=v+c-E,E-=c,E<y){y-=E;do U[s++]=C[j++];while(--E);if(j=0,c<y){E=c,y-=E;do U[s++]=C[j++];while(--E);j=s-G,V=U}}}else if(j+=c-E,E<y){y-=E;do U[s++]=C[j++];while(--E);j=s-G,V=U}for(;y>2;)U[s++]=V[j++],U[s++]=V[j++],U[s++]=V[j++],y-=3;y&&(U[s++]=V[j++],y>1&&(U[s++]=V[j++]))}else{j=s-G;do U[s++]=U[j++],U[s++]=U[j++],U[s++]=U[j++],y-=3;while(y>2);y&&(U[s++]=U[j++],y>1&&(U[s++]=U[j++]))}}else if((E&64)===0){S=A[(S&65535)+(I&(1<<E)-1)];continue t}else{a.msg="invalid distance code",t.mode=g;break e}break}}else if((E&64)===0){S=_[(S&65535)+(I&(1<<E)-1)];continue r}else if(E&32){t.mode=r;break e}else{a.msg="invalid literal/length code",t.mode=g;break e}break}}while(n<h&&s<x);y=d>>3,n-=y,d-=y<<3,I&=(1<<d)-1,a.next_in=n,a.next_out=s,a.avail_in=n<h?5+(h-n):5-(n-h),a.avail_out=s<x?257+(x-s):257-(s-x),t.hold=I,t.bits=d},Ir}var Mr,dt;function sn(){if(dt)return Mr;dt=1;var g=Je(),r=15,o=852,a=592,T=0,t=1,n=2,h=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],s=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],m=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],x=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];return Mr=function(v,p,c,C,I,d,_,A){var O=A.bits,N=0,S=0,E=0,y=0,G=0,j=0,V=0,z=0,U=0,D=0,J,$,K,Z,te,de=null,Ee=0,pe,ge=new g.Buf16(r+1),re=new g.Buf16(r+1),X=null,Q=0,me,ie,W;for(N=0;N<=r;N++)ge[N]=0;for(S=0;S<C;S++)ge[p[c+S]]++;for(G=O,y=r;y>=1&&ge[y]===0;y--);if(G>y&&(G=y),y===0)return I[d++]=1<<24|64<<16|0,I[d++]=1<<24|64<<16|0,A.bits=1,0;for(E=1;E<y&&ge[E]===0;E++);for(G<E&&(G=E),z=1,N=1;N<=r;N++)if(z<<=1,z-=ge[N],z<0)return-1;if(z>0&&(v===T||y!==1))return-1;for(re[1]=0,N=1;N<r;N++)re[N+1]=re[N]+ge[N];for(S=0;S<C;S++)p[c+S]!==0&&(_[re[p[c+S]]++]=S);if(v===T?(de=X=_,pe=19):v===t?(de=h,Ee-=257,X=s,Q-=257,pe=256):(de=m,X=x,pe=-1),D=0,S=0,N=E,te=d,j=G,V=0,K=-1,U=1<<G,Z=U-1,v===t&&U>o||v===n&&U>a)return 1;for(;;){me=N-V,_[S]<pe?(ie=0,W=_[S]):_[S]>pe?(ie=X[Q+_[S]],W=de[Ee+_[S]]):(ie=96,W=0),J=1<<N-V,$=1<<j,E=$;do $-=J,I[te+(D>>V)+$]=me<<24|ie<<16|W|0;while($!==0);for(J=1<<N-1;D&J;)J>>=1;if(J!==0?(D&=J-1,D+=J):D=0,S++,--ge[N]===0){if(N===y)break;N=p[c+_[S]]}if(N>G&&(D&Z)!==K){for(V===0&&(V=G),te+=E,j=N-V,z=1<<j;j+V<y&&(z-=ge[j+V],!(z<=0));)j++,z<<=1;if(U+=1<<j,v===t&&U>o||v===n&&U>a)return 1;K=D&Z,I[K]=G<<24|j<<16|te-d|0}}return D!==0&&(I[te+D]=N-V<<24|64<<16|0),A.bits=G,0},Mr}var vt;function on(){if(vt)return qe;vt=1;var g=Je(),r=kt(),o=Rt(),a=an(),T=sn(),t=0,n=1,h=2,s=4,m=5,x=6,f=0,v=1,p=2,c=-2,C=-3,I=-4,d=-5,_=8,A=1,O=2,N=3,S=4,E=5,y=6,G=7,j=8,V=9,z=10,U=11,D=12,J=13,$=14,K=15,Z=16,te=17,de=18,Ee=19,pe=20,ge=21,re=22,X=23,Q=24,me=25,ie=26,W=27,Re=28,Se=29,se=30,we=31,oe=32,q=852,ye=592,le=15,ee=le;function F(w){return(w>>>24&255)+(w>>>8&65280)+((w&65280)<<8)+((w&255)<<24)}function _e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new g.Buf16(320),this.work=new g.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function ve(w){var B;return!w||!w.state?c:(B=w.state,w.total_in=w.total_out=B.total=0,w.msg="",B.wrap&&(w.adler=B.wrap&1),B.mode=A,B.last=0,B.havedict=0,B.dmax=32768,B.head=null,B.hold=0,B.bits=0,B.lencode=B.lendyn=new g.Buf32(q),B.distcode=B.distdyn=new g.Buf32(ye),B.sane=1,B.back=-1,f)}function be(w){var B;return!w||!w.state?c:(B=w.state,B.wsize=0,B.whave=0,B.wnext=0,ve(w))}function ke(w,B){var i,H;return!w||!w.state||(H=w.state,B<0?(i=0,B=-B):(i=(B>>4)+1,B<48&&(B&=15)),B&&(B<8||B>15))?c:(H.window!==null&&H.wbits!==B&&(H.window=null),H.wrap=i,H.wbits=B,be(w))}function Me(w,B){var i,H;return w?(H=new _e,w.state=H,H.window=null,i=ke(w,B),i!==f&&(w.state=null),i):c}function Ie(w){return Me(w,ee)}var fe=!0,ce,he;function ae(w){if(fe){var B;for(ce=new g.Buf32(512),he=new g.Buf32(32),B=0;B<144;)w.lens[B++]=8;for(;B<256;)w.lens[B++]=9;for(;B<280;)w.lens[B++]=7;for(;B<288;)w.lens[B++]=8;for(T(n,w.lens,0,288,ce,0,w.work,{bits:9}),B=0;B<32;)w.lens[B++]=5;T(h,w.lens,0,32,he,0,w.work,{bits:5}),fe=!1}w.lencode=ce,w.lenbits=9,w.distcode=he,w.distbits=5}function Ae(w,B,i,H){var Te,e=w.state;return e.window===null&&(e.wsize=1<<e.wbits,e.wnext=0,e.whave=0,e.window=new g.Buf8(e.wsize)),H>=e.wsize?(g.arraySet(e.window,B,i-e.wsize,e.wsize,0),e.wnext=0,e.whave=e.wsize):(Te=e.wsize-e.wnext,Te>H&&(Te=H),g.arraySet(e.window,B,i-H,Te,e.wnext),H-=Te,H?(g.arraySet(e.window,B,i-H,H,0),e.wnext=H,e.whave=e.wsize):(e.wnext+=Te,e.wnext===e.wsize&&(e.wnext=0),e.whave<e.wsize&&(e.whave+=Te))),0}function u(w,B){var i,H,Te,e,R,L,l,b,k,xe,ne,ue,Fe,Ye,Be=0,Ce,Le,Pe,ze,Qe,er,De,Ve,Oe=new g.Buf8(4),Ze,Ge,rr=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!w||!w.state||!w.output||!w.input&&w.avail_in!==0)return c;i=w.state,i.mode===D&&(i.mode=J),R=w.next_out,Te=w.output,l=w.avail_out,e=w.next_in,H=w.input,L=w.avail_in,b=i.hold,k=i.bits,xe=L,ne=l,Ve=f;e:for(;;)switch(i.mode){case A:if(i.wrap===0){i.mode=J;break}for(;k<16;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if(i.wrap&2&&b===35615){i.check=0,Oe[0]=b&255,Oe[1]=b>>>8&255,i.check=o(i.check,Oe,2,0),b=0,k=0,i.mode=O;break}if(i.flags=0,i.head&&(i.head.done=!1),!(i.wrap&1)||(((b&255)<<8)+(b>>8))%31){w.msg="incorrect header check",i.mode=se;break}if((b&15)!==_){w.msg="unknown compression method",i.mode=se;break}if(b>>>=4,k-=4,De=(b&15)+8,i.wbits===0)i.wbits=De;else if(De>i.wbits){w.msg="invalid window size",i.mode=se;break}i.dmax=1<<De,w.adler=i.check=1,i.mode=b&512?z:D,b=0,k=0;break;case O:for(;k<16;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if(i.flags=b,(i.flags&255)!==_){w.msg="unknown compression method",i.mode=se;break}if(i.flags&57344){w.msg="unknown header flags set",i.mode=se;break}i.head&&(i.head.text=b>>8&1),i.flags&512&&(Oe[0]=b&255,Oe[1]=b>>>8&255,i.check=o(i.check,Oe,2,0)),b=0,k=0,i.mode=N;case N:for(;k<32;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}i.head&&(i.head.time=b),i.flags&512&&(Oe[0]=b&255,Oe[1]=b>>>8&255,Oe[2]=b>>>16&255,Oe[3]=b>>>24&255,i.check=o(i.check,Oe,4,0)),b=0,k=0,i.mode=S;case S:for(;k<16;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}i.head&&(i.head.xflags=b&255,i.head.os=b>>8),i.flags&512&&(Oe[0]=b&255,Oe[1]=b>>>8&255,i.check=o(i.check,Oe,2,0)),b=0,k=0,i.mode=E;case E:if(i.flags&1024){for(;k<16;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}i.length=b,i.head&&(i.head.extra_len=b),i.flags&512&&(Oe[0]=b&255,Oe[1]=b>>>8&255,i.check=o(i.check,Oe,2,0)),b=0,k=0}else i.head&&(i.head.extra=null);i.mode=y;case y:if(i.flags&1024&&(ue=i.length,ue>L&&(ue=L),ue&&(i.head&&(De=i.head.extra_len-i.length,i.head.extra||(i.head.extra=new Array(i.head.extra_len)),g.arraySet(i.head.extra,H,e,ue,De)),i.flags&512&&(i.check=o(i.check,H,ue,e)),L-=ue,e+=ue,i.length-=ue),i.length))break e;i.length=0,i.mode=G;case G:if(i.flags&2048){if(L===0)break e;ue=0;do De=H[e+ue++],i.head&&De&&i.length<65536&&(i.head.name+=String.fromCharCode(De));while(De&&ue<L);if(i.flags&512&&(i.check=o(i.check,H,ue,e)),L-=ue,e+=ue,De)break e}else i.head&&(i.head.name=null);i.length=0,i.mode=j;case j:if(i.flags&4096){if(L===0)break e;ue=0;do De=H[e+ue++],i.head&&De&&i.length<65536&&(i.head.comment+=String.fromCharCode(De));while(De&&ue<L);if(i.flags&512&&(i.check=o(i.check,H,ue,e)),L-=ue,e+=ue,De)break e}else i.head&&(i.head.comment=null);i.mode=V;case V:if(i.flags&512){for(;k<16;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if(b!==(i.check&65535)){w.msg="header crc mismatch",i.mode=se;break}b=0,k=0}i.head&&(i.head.hcrc=i.flags>>9&1,i.head.done=!0),w.adler=i.check=0,i.mode=D;break;case z:for(;k<32;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}w.adler=i.check=F(b),b=0,k=0,i.mode=U;case U:if(i.havedict===0)return w.next_out=R,w.avail_out=l,w.next_in=e,w.avail_in=L,i.hold=b,i.bits=k,p;w.adler=i.check=1,i.mode=D;case D:if(B===m||B===x)break e;case J:if(i.last){b>>>=k&7,k-=k&7,i.mode=W;break}for(;k<3;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}switch(i.last=b&1,b>>>=1,k-=1,b&3){case 0:i.mode=$;break;case 1:if(ae(i),i.mode=pe,B===x){b>>>=2,k-=2;break e}break;case 2:i.mode=te;break;case 3:w.msg="invalid block type",i.mode=se}b>>>=2,k-=2;break;case $:for(b>>>=k&7,k-=k&7;k<32;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if((b&65535)!==(b>>>16^65535)){w.msg="invalid stored block lengths",i.mode=se;break}if(i.length=b&65535,b=0,k=0,i.mode=K,B===x)break e;case K:i.mode=Z;case Z:if(ue=i.length,ue){if(ue>L&&(ue=L),ue>l&&(ue=l),ue===0)break e;g.arraySet(Te,H,e,ue,R),L-=ue,e+=ue,l-=ue,R+=ue,i.length-=ue;break}i.mode=D;break;case te:for(;k<14;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if(i.nlen=(b&31)+257,b>>>=5,k-=5,i.ndist=(b&31)+1,b>>>=5,k-=5,i.ncode=(b&15)+4,b>>>=4,k-=4,i.nlen>286||i.ndist>30){w.msg="too many length or distance symbols",i.mode=se;break}i.have=0,i.mode=de;case de:for(;i.have<i.ncode;){for(;k<3;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}i.lens[rr[i.have++]]=b&7,b>>>=3,k-=3}for(;i.have<19;)i.lens[rr[i.have++]]=0;if(i.lencode=i.lendyn,i.lenbits=7,Ze={bits:i.lenbits},Ve=T(t,i.lens,0,19,i.lencode,0,i.work,Ze),i.lenbits=Ze.bits,Ve){w.msg="invalid code lengths set",i.mode=se;break}i.have=0,i.mode=Ee;case Ee:for(;i.have<i.nlen+i.ndist;){for(;Be=i.lencode[b&(1<<i.lenbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Pe=Be&65535,!(Ce<=k);){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if(Pe<16)b>>>=Ce,k-=Ce,i.lens[i.have++]=Pe;else{if(Pe===16){for(Ge=Ce+2;k<Ge;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if(b>>>=Ce,k-=Ce,i.have===0){w.msg="invalid bit length repeat",i.mode=se;break}De=i.lens[i.have-1],ue=3+(b&3),b>>>=2,k-=2}else if(Pe===17){for(Ge=Ce+3;k<Ge;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}b>>>=Ce,k-=Ce,De=0,ue=3+(b&7),b>>>=3,k-=3}else{for(Ge=Ce+7;k<Ge;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}b>>>=Ce,k-=Ce,De=0,ue=11+(b&127),b>>>=7,k-=7}if(i.have+ue>i.nlen+i.ndist){w.msg="invalid bit length repeat",i.mode=se;break}for(;ue--;)i.lens[i.have++]=De}}if(i.mode===se)break;if(i.lens[256]===0){w.msg="invalid code -- missing end-of-block",i.mode=se;break}if(i.lenbits=9,Ze={bits:i.lenbits},Ve=T(n,i.lens,0,i.nlen,i.lencode,0,i.work,Ze),i.lenbits=Ze.bits,Ve){w.msg="invalid literal/lengths set",i.mode=se;break}if(i.distbits=6,i.distcode=i.distdyn,Ze={bits:i.distbits},Ve=T(h,i.lens,i.nlen,i.ndist,i.distcode,0,i.work,Ze),i.distbits=Ze.bits,Ve){w.msg="invalid distances set",i.mode=se;break}if(i.mode=pe,B===x)break e;case pe:i.mode=ge;case ge:if(L>=6&&l>=258){w.next_out=R,w.avail_out=l,w.next_in=e,w.avail_in=L,i.hold=b,i.bits=k,a(w,ne),R=w.next_out,Te=w.output,l=w.avail_out,e=w.next_in,H=w.input,L=w.avail_in,b=i.hold,k=i.bits,i.mode===D&&(i.back=-1);break}for(i.back=0;Be=i.lencode[b&(1<<i.lenbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Pe=Be&65535,!(Ce<=k);){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if(Le&&(Le&240)===0){for(ze=Ce,Qe=Le,er=Pe;Be=i.lencode[er+((b&(1<<ze+Qe)-1)>>ze)],Ce=Be>>>24,Le=Be>>>16&255,Pe=Be&65535,!(ze+Ce<=k);){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}b>>>=ze,k-=ze,i.back+=ze}if(b>>>=Ce,k-=Ce,i.back+=Ce,i.length=Pe,Le===0){i.mode=ie;break}if(Le&32){i.back=-1,i.mode=D;break}if(Le&64){w.msg="invalid literal/length code",i.mode=se;break}i.extra=Le&15,i.mode=re;case re:if(i.extra){for(Ge=i.extra;k<Ge;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}i.length+=b&(1<<i.extra)-1,b>>>=i.extra,k-=i.extra,i.back+=i.extra}i.was=i.length,i.mode=X;case X:for(;Be=i.distcode[b&(1<<i.distbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Pe=Be&65535,!(Ce<=k);){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if((Le&240)===0){for(ze=Ce,Qe=Le,er=Pe;Be=i.distcode[er+((b&(1<<ze+Qe)-1)>>ze)],Ce=Be>>>24,Le=Be>>>16&255,Pe=Be&65535,!(ze+Ce<=k);){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}b>>>=ze,k-=ze,i.back+=ze}if(b>>>=Ce,k-=Ce,i.back+=Ce,Le&64){w.msg="invalid distance code",i.mode=se;break}i.offset=Pe,i.extra=Le&15,i.mode=Q;case Q:if(i.extra){for(Ge=i.extra;k<Ge;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}i.offset+=b&(1<<i.extra)-1,b>>>=i.extra,k-=i.extra,i.back+=i.extra}if(i.offset>i.dmax){w.msg="invalid distance too far back",i.mode=se;break}i.mode=me;case me:if(l===0)break e;if(ue=ne-l,i.offset>ue){if(ue=i.offset-ue,ue>i.whave&&i.sane){w.msg="invalid distance too far back",i.mode=se;break}ue>i.wnext?(ue-=i.wnext,Fe=i.wsize-ue):Fe=i.wnext-ue,ue>i.length&&(ue=i.length),Ye=i.window}else Ye=Te,Fe=R-i.offset,ue=i.length;ue>l&&(ue=l),l-=ue,i.length-=ue;do Te[R++]=Ye[Fe++];while(--ue);i.length===0&&(i.mode=ge);break;case ie:if(l===0)break e;Te[R++]=i.length,l--,i.mode=ge;break;case W:if(i.wrap){for(;k<32;){if(L===0)break e;L--,b|=H[e++]<<k,k+=8}if(ne-=l,w.total_out+=ne,i.total+=ne,ne&&(w.adler=i.check=i.flags?o(i.check,Te,ne,R-ne):r(i.check,Te,ne,R-ne)),ne=l,(i.flags?b:F(b))!==i.check){w.msg="incorrect data check",i.mode=se;break}b=0,k=0}i.mode=Re;case Re:if(i.wrap&&i.flags){for(;k<32;){if(L===0)break e;L--,b+=H[e++]<<k,k+=8}if(b!==(i.total&4294967295)){w.msg="incorrect length check",i.mode=se;break}b=0,k=0}i.mode=Se;case Se:Ve=v;break e;case se:Ve=C;break e;case we:return I;case oe:default:return c}return w.next_out=R,w.avail_out=l,w.next_in=e,w.avail_in=L,i.hold=b,i.bits=k,(i.wsize||ne!==w.avail_out&&i.mode<se&&(i.mode<W||B!==s))&&Ae(w,w.output,w.next_out,ne-w.avail_out),xe-=w.avail_in,ne-=w.avail_out,w.total_in+=xe,w.total_out+=ne,i.total+=ne,i.wrap&&ne&&(w.adler=i.check=i.flags?o(i.check,Te,ne,w.next_out-ne):r(i.check,Te,ne,w.next_out-ne)),w.data_type=i.bits+(i.last?64:0)+(i.mode===D?128:0)+(i.mode===pe||i.mode===K?256:0),(xe===0&&ne===0||B===s)&&Ve===f&&(Ve=d),Ve}function M(w){if(!w||!w.state)return c;var B=w.state;return B.window&&(B.window=null),w.state=null,f}function P(w,B){var i;return!w||!w.state||(i=w.state,(i.wrap&2)===0)?c:(i.head=B,B.done=!1,f)}function Y(w,B){var i=B.length,H,Te,e;return!w||!w.state||(H=w.state,H.wrap!==0&&H.mode!==U)?c:H.mode===U&&(Te=1,Te=r(Te,B,i,0),Te!==H.check)?C:(e=Ae(w,B,i,i),e?(H.mode=we,I):(H.havedict=1,f))}return qe.inflateReset=be,qe.inflateReset2=ke,qe.inflateResetKeep=ve,qe.inflateInit=Ie,qe.inflateInit2=Me,qe.inflate=u,qe.inflateEnd=M,qe.inflateGetHeader=P,qe.inflateSetDictionary=Y,qe.inflateInfo="pako inflate (from Nodeca project)",qe}var Fr,xt;function Ft(){return xt||(xt=1,Fr={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}),Fr}var Cr,gt;function ln(){if(gt)return Cr;gt=1;function g(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}return Cr=g,Cr}var mt;function fn(){if(mt)return lr;mt=1;var g=on(),r=Je(),o=It(),a=Ft(),T=Gr(),t=Mt(),n=ln(),h=Object.prototype.toString;function s(f){if(!(this instanceof s))return new s(f);this.options=r.assign({chunkSize:16384,windowBits:0,to:""},f||{});var v=this.options;v.raw&&v.windowBits>=0&&v.windowBits<16&&(v.windowBits=-v.windowBits,v.windowBits===0&&(v.windowBits=-15)),v.windowBits>=0&&v.windowBits<16&&!(f&&f.windowBits)&&(v.windowBits+=32),v.windowBits>15&&v.windowBits<48&&(v.windowBits&15)===0&&(v.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new t,this.strm.avail_out=0;var p=g.inflateInit2(this.strm,v.windowBits);if(p!==a.Z_OK)throw new Error(T[p]);if(this.header=new n,g.inflateGetHeader(this.strm,this.header),v.dictionary&&(typeof v.dictionary=="string"?v.dictionary=o.string2buf(v.dictionary):h.call(v.dictionary)==="[object ArrayBuffer]"&&(v.dictionary=new Uint8Array(v.dictionary)),v.raw&&(p=g.inflateSetDictionary(this.strm,v.dictionary),p!==a.Z_OK)))throw new Error(T[p])}s.prototype.push=function(f,v){var p=this.strm,c=this.options.chunkSize,C=this.options.dictionary,I,d,_,A,O,N=!1;if(this.ended)return!1;d=v===~~v?v:v===!0?a.Z_FINISH:a.Z_NO_FLUSH,typeof f=="string"?p.input=o.binstring2buf(f):h.call(f)==="[object ArrayBuffer]"?p.input=new Uint8Array(f):p.input=f,p.next_in=0,p.avail_in=p.input.length;do{if(p.avail_out===0&&(p.output=new r.Buf8(c),p.next_out=0,p.avail_out=c),I=g.inflate(p,a.Z_NO_FLUSH),I===a.Z_NEED_DICT&&C&&(I=g.inflateSetDictionary(this.strm,C)),I===a.Z_BUF_ERROR&&N===!0&&(I=a.Z_OK,N=!1),I!==a.Z_STREAM_END&&I!==a.Z_OK)return this.onEnd(I),this.ended=!0,!1;p.next_out&&(p.avail_out===0||I===a.Z_STREAM_END||p.avail_in===0&&(d===a.Z_FINISH||d===a.Z_SYNC_FLUSH))&&(this.options.to==="string"?(_=o.utf8border(p.output,p.next_out),A=p.next_out-_,O=o.buf2string(p.output,_),p.next_out=A,p.avail_out=c-A,A&&r.arraySet(p.output,p.output,_,A,0),this.onData(O)):this.onData(r.shrinkBuf(p.output,p.next_out))),p.avail_in===0&&p.avail_out===0&&(N=!0)}while((p.avail_in>0||p.avail_out===0)&&I!==a.Z_STREAM_END);return I===a.Z_STREAM_END&&(d=a.Z_FINISH),d===a.Z_FINISH?(I=g.inflateEnd(this.strm),this.onEnd(I),this.ended=!0,I===a.Z_OK):(d===a.Z_SYNC_FLUSH&&(this.onEnd(a.Z_OK),p.avail_out=0),!0)},s.prototype.onData=function(f){this.chunks.push(f)},s.prototype.onEnd=function(f){f===a.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=f,this.msg=this.strm.msg};function m(f,v){var p=new s(v);if(p.push(f,!0),p.err)throw p.msg||T[p.err];return p.result}function x(f,v){return v=v||{},v.raw=!0,m(f,v)}return lr.Inflate=s,lr.inflate=m,lr.inflateRaw=x,lr.ungzip=m,lr}var Br,_t;function un(){if(_t)return Br;_t=1;var g=Je().assign,r=nn(),o=fn(),a=Ft(),T={};return g(T,r,o,a),Br=T,Br}var pt;function cn(){return pt||(pt=1,(function(g){(function(){var r={},o;g.exports=r,typeof en=="function"?o=un():o=window.pako,(function(a,T){a.toRGBA8=function(t){var n=t.width,h=t.height;if(t.tabs.acTL==null)return[a.toRGBA8.decodeImage(t.data,n,h,t).buffer];var s=[];t.frames[0].data==null&&(t.frames[0].data=t.data);for(var m,x=new Uint8Array(n*h*4),f=0;f<t.frames.length;f++){var v=t.frames[f],p=v.rect.x,c=v.rect.y,C=v.rect.width,I=v.rect.height,d=a.toRGBA8.decodeImage(v.data,C,I,t);if(f==0?m=d:v.blend==0?a._copyTile(d,C,I,m,n,h,p,c,0):v.blend==1&&a._copyTile(d,C,I,m,n,h,p,c,1),s.push(m.buffer),m=m.slice(0),v.dispose!=0){if(v.dispose==1)a._copyTile(x,C,I,m,n,h,p,c,0);else if(v.dispose==2){for(var _=f-1;t.frames[_].dispose==2;)_--;m=new Uint8Array(s[_]).slice(0)}}}return s},a.toRGBA8.decodeImage=function(t,n,h,s){var m=n*h,x=a.decode._getBPP(s),f=Math.ceil(n*x/8),v=new Uint8Array(m*4),p=new Uint32Array(v.buffer),c=s.ctype,C=s.depth,I=a._bin.readUshort;if(c==6){var d=m<<2;if(C==8)for(var _=0;_<d;_++)v[_]=t[_];if(C==16)for(var _=0;_<d;_++)v[_]=t[_<<1]}else if(c==2){var A=s.tabs.tRNS,O=-1,N=-1,S=-1;if(A&&(O=A[0],N=A[1],S=A[2]),C==8)for(var _=0;_<m;_++){var E=_<<2,y=_*3;v[E]=t[y],v[E+1]=t[y+1],v[E+2]=t[y+2],v[E+3]=255,O!=-1&&t[y]==O&&t[y+1]==N&&t[y+2]==S&&(v[E+3]=0)}if(C==16)for(var _=0;_<m;_++){var E=_<<2,y=_*6;v[E]=t[y],v[E+1]=t[y+2],v[E+2]=t[y+4],v[E+3]=255,O!=-1&&I(t,y)==O&&I(t,y+2)==N&&I(t,y+4)==S&&(v[E+3]=0)}}else if(c==3){var G=s.tabs.PLTE,j=s.tabs.tRNS,V=j?j.length:0;if(C==1)for(var z=0;z<h;z++)for(var U=z*f,D=z*n,_=0;_<n;_++){var E=D+_<<2,J=t[U+(_>>3)]>>7-((_&7)<<0)&1,$=3*J;v[E]=G[$],v[E+1]=G[$+1],v[E+2]=G[$+2],v[E+3]=J<V?j[J]:255}if(C==2)for(var z=0;z<h;z++)for(var U=z*f,D=z*n,_=0;_<n;_++){var E=D+_<<2,J=t[U+(_>>2)]>>6-((_&3)<<1)&3,$=3*J;v[E]=G[$],v[E+1]=G[$+1],v[E+2]=G[$+2],v[E+3]=J<V?j[J]:255}if(C==4)for(var z=0;z<h;z++)for(var U=z*f,D=z*n,_=0;_<n;_++){var E=D+_<<2,J=t[U+(_>>1)]>>4-((_&1)<<2)&15,$=3*J;v[E]=G[$],v[E+1]=G[$+1],v[E+2]=G[$+2],v[E+3]=J<V?j[J]:255}if(C==8)for(var _=0;_<m;_++){var E=_<<2,J=t[_],$=3*J;v[E]=G[$],v[E+1]=G[$+1],v[E+2]=G[$+2],v[E+3]=J<V?j[J]:255}}else if(c==4){if(C==8)for(var _=0;_<m;_++){var E=_<<2,K=_<<1,Z=t[K];v[E]=Z,v[E+1]=Z,v[E+2]=Z,v[E+3]=t[K+1]}if(C==16)for(var _=0;_<m;_++){var E=_<<2,K=_<<2,Z=t[K];v[E]=Z,v[E+1]=Z,v[E+2]=Z,v[E+3]=t[K+2]}}else if(c==0){var O=s.tabs.tRNS?s.tabs.tRNS:-1;if(C==1)for(var _=0;_<m;_++){var Z=255*(t[_>>3]>>7-(_&7)&1),te=Z==O*255?0:255;p[_]=te<<24|Z<<16|Z<<8|Z}if(C==2)for(var _=0;_<m;_++){var Z=85*(t[_>>2]>>6-((_&3)<<1)&3),te=Z==O*85?0:255;p[_]=te<<24|Z<<16|Z<<8|Z}if(C==4)for(var _=0;_<m;_++){var Z=17*(t[_>>1]>>4-((_&1)<<2)&15),te=Z==O*17?0:255;p[_]=te<<24|Z<<16|Z<<8|Z}if(C==8)for(var _=0;_<m;_++){var Z=t[_],te=Z==O?0:255;p[_]=te<<24|Z<<16|Z<<8|Z}if(C==16)for(var _=0;_<m;_++){var Z=t[_<<1],te=I(t,_<<1)==O?0:255;p[_]=te<<24|Z<<16|Z<<8|Z}}return v},a.decode=function(t){for(var n=new Uint8Array(t),h=8,s=a._bin,m=s.readUshort,x=s.readUint,f={tabs:{},frames:[]},v=new Uint8Array(n.length),p=0,c,C=0,I=[137,80,78,71,13,10,26,10],d=0;d<8;d++)if(n[d]!=I[d])throw"The input is not a PNG file!";for(;h<n.length;){var _=s.readUint(n,h);h+=4;var A=s.readASCII(n,h,4);if(h+=4,A=="IHDR")a.decode._IHDR(n,h,f);else if(A=="IDAT"){for(var d=0;d<_;d++)v[p+d]=n[h+d];p+=_}else if(A=="acTL")f.tabs[A]={num_frames:x(n,h),num_plays:x(n,h+4)},c=new Uint8Array(n.length);else if(A=="fcTL"){if(C!=0){var O=f.frames[f.frames.length-1];O.data=a.decode._decompress(f,c.slice(0,C),O.rect.width,O.rect.height),C=0}var N={x:x(n,h+12),y:x(n,h+16),width:x(n,h+4),height:x(n,h+8)},S=m(n,h+22);S=m(n,h+20)/(S==0?100:S);var E={rect:N,delay:Math.round(S*1e3),dispose:n[h+24],blend:n[h+25]};f.frames.push(E)}else if(A=="fdAT"){for(var d=0;d<_-4;d++)c[C+d]=n[h+d+4];C+=_-4}else if(A=="pHYs")f.tabs[A]=[s.readUint(n,h),s.readUint(n,h+4),n[h+8]];else if(A=="cHRM"){f.tabs[A]=[];for(var d=0;d<8;d++)f.tabs[A].push(s.readUint(n,h+d*4))}else if(A=="tEXt"){f.tabs[A]==null&&(f.tabs[A]={});var y=s.nextZero(n,h),G=s.readASCII(n,h,y-h),j=s.readASCII(n,y+1,h+_-y-1);f.tabs[A][G]=j}else if(A=="iTXt"){f.tabs[A]==null&&(f.tabs[A]={});var y=0,V=h;y=s.nextZero(n,V);var G=s.readASCII(n,V,y-V);V=y+1,n[V],n[V+1],V+=2,y=s.nextZero(n,V),s.readASCII(n,V,y-V),V=y+1,y=s.nextZero(n,V),s.readUTF8(n,V,y-V),V=y+1;var j=s.readUTF8(n,V,_-(V-h));f.tabs[A][G]=j}else if(A=="PLTE")f.tabs[A]=s.readBytes(n,h,_);else if(A=="hIST"){var z=f.tabs.PLTE.length/3;f.tabs[A]=[];for(var d=0;d<z;d++)f.tabs[A].push(m(n,h+d*2))}else if(A=="tRNS")f.ctype==3?f.tabs[A]=s.readBytes(n,h,_):f.ctype==0?f.tabs[A]=m(n,h):f.ctype==2&&(f.tabs[A]=[m(n,h),m(n,h+2),m(n,h+4)]);else if(A=="gAMA")f.tabs[A]=s.readUint(n,h)/1e5;else if(A=="sRGB")f.tabs[A]=n[h];else if(A=="bKGD")f.ctype==0||f.ctype==4?f.tabs[A]=[m(n,h)]:f.ctype==2||f.ctype==6?f.tabs[A]=[m(n,h),m(n,h+2),m(n,h+4)]:f.ctype==3&&(f.tabs[A]=n[h]);else if(A=="IEND"){if(C!=0){var O=f.frames[f.frames.length-1];O.data=a.decode._decompress(f,c.slice(0,C),O.rect.width,O.rect.height),C=0}f.data=a.decode._decompress(f,v,f.width,f.height);break}h+=_,s.readUint(n,h),h+=4}return delete f.compress,delete f.interlace,delete f.filter,f},a.decode._decompress=function(t,n,h,s){return t.compress==0&&(n=a.decode._inflate(n)),t.interlace==0?n=a.decode._filterZero(n,t,0,h,s):t.interlace==1&&(n=a.decode._readInterlace(n,t)),n},a.decode._inflate=function(t){return T.inflate(t)},a.decode._readInterlace=function(t,n){for(var h=n.width,s=n.height,m=a.decode._getBPP(n),x=m>>3,f=Math.ceil(h*m/8),v=new Uint8Array(s*f),p=0,c=[0,0,4,0,2,0,1],C=[0,4,0,2,0,1,0],I=[8,8,8,4,4,2,2],d=[8,8,4,4,2,2,1],_=0;_<7;){for(var A=I[_],O=d[_],N=0,S=0,E=c[_];E<s;)E+=A,S++;for(var y=C[_];y<h;)y+=O,N++;var G=Math.ceil(N*m/8);a.decode._filterZero(t,n,p,N,S);for(var j=0,V=c[_];V<s;){for(var z=C[_],U=p+j*G<<3;z<h;){if(m==1){var D=t[U>>3];D=D>>7-(U&7)&1,v[V*f+(z>>3)]|=D<<7-((z&3)<<0)}if(m==2){var D=t[U>>3];D=D>>6-(U&7)&3,v[V*f+(z>>2)]|=D<<6-((z&3)<<1)}if(m==4){var D=t[U>>3];D=D>>4-(U&7)&15,v[V*f+(z>>1)]|=D<<4-((z&1)<<2)}if(m>=8)for(var J=V*f+z*x,$=0;$<x;$++)v[J+$]=t[(U>>3)+$];U+=m,z+=O}j++,V+=A}N*S!=0&&(p+=S*(1+G)),_=_+1}return v},a.decode._getBPP=function(t){var n=[1,null,3,1,2,null,4][t.ctype];return n*t.depth},a.decode._filterZero=function(t,n,h,s,m){var x=a.decode._getBPP(n),f=Math.ceil(s*x/8),v=a.decode._paeth;x=Math.ceil(x/8);for(var p=0;p<m;p++){var c=h+p*f,C=c+p+1,I=t[C-1];if(I==0)for(var d=0;d<f;d++)t[c+d]=t[C+d];else if(I==1){for(var d=0;d<x;d++)t[c+d]=t[C+d];for(var d=x;d<f;d++)t[c+d]=t[C+d]+t[c+d-x]&255}else if(p==0){for(var d=0;d<x;d++)t[c+d]=t[C+d];if(I==2)for(var d=x;d<f;d++)t[c+d]=t[C+d]&255;if(I==3)for(var d=x;d<f;d++)t[c+d]=t[C+d]+(t[c+d-x]>>1)&255;if(I==4)for(var d=x;d<f;d++)t[c+d]=t[C+d]+v(t[c+d-x],0,0)&255}else{if(I==2)for(var d=0;d<f;d++)t[c+d]=t[C+d]+t[c+d-f]&255;if(I==3){for(var d=0;d<x;d++)t[c+d]=t[C+d]+(t[c+d-f]>>1)&255;for(var d=x;d<f;d++)t[c+d]=t[C+d]+(t[c+d-f]+t[c+d-x]>>1)&255}if(I==4){for(var d=0;d<x;d++)t[c+d]=t[C+d]+v(0,t[c+d-f],0)&255;for(var d=x;d<f;d++)t[c+d]=t[C+d]+v(t[c+d-x],t[c+d-f],t[c+d-x-f])&255}}}return t},a.decode._paeth=function(t,n,h){var s=t+n-h,m=Math.abs(s-t),x=Math.abs(s-n),f=Math.abs(s-h);return m<=x&&m<=f?t:x<=f?n:h},a.decode._IHDR=function(t,n,h){var s=a._bin;h.width=s.readUint(t,n),n+=4,h.height=s.readUint(t,n),n+=4,h.depth=t[n],n++,h.ctype=t[n],n++,h.compress=t[n],n++,h.filter=t[n],n++,h.interlace=t[n],n++},a._bin={nextZero:function(t,n){for(;t[n]!=0;)n++;return n},readUshort:function(t,n){return t[n]<<8|t[n+1]},writeUshort:function(t,n,h){t[n]=h>>8&255,t[n+1]=h&255},readUint:function(t,n){return t[n]*(256*256*256)+(t[n+1]<<16|t[n+2]<<8|t[n+3])},writeUint:function(t,n,h){t[n]=h>>24&255,t[n+1]=h>>16&255,t[n+2]=h>>8&255,t[n+3]=h&255},readASCII:function(t,n,h){for(var s="",m=0;m<h;m++)s+=String.fromCharCode(t[n+m]);return s},writeASCII:function(t,n,h){for(var s=0;s<h.length;s++)t[n+s]=h.charCodeAt(s)},readBytes:function(t,n,h){for(var s=[],m=0;m<h;m++)s.push(t[n+m]);return s},pad:function(t){return t.length<2?"0"+t:t},readUTF8:function(t,n,h){for(var s="",m,x=0;x<h;x++)s+="%"+a._bin.pad(t[n+x].toString(16));try{m=decodeURIComponent(s)}catch{return a._bin.readASCII(t,n,h)}return m}},a._copyTile=function(t,n,h,s,m,x,f,v,p){for(var c=Math.min(n,m),C=Math.min(h,x),I=0,d=0,_=0;_<C;_++)for(var A=0;A<c;A++)if(f>=0&&v>=0?(I=_*n+A<<2,d=(v+_)*m+f+A<<2):(I=(-v+_)*n-f+A<<2,d=_*m+A<<2),p==0)s[d]=t[I],s[d+1]=t[I+1],s[d+2]=t[I+2],s[d+3]=t[I+3];else if(p==1){var O=t[I+3]*.00392156862745098,N=t[I]*O,S=t[I+1]*O,E=t[I+2]*O,y=s[d+3]*(1/255),G=s[d]*y,j=s[d+1]*y,V=s[d+2]*y,z=1-O,U=O+y*z,D=U==0?0:1/U;s[d+3]=255*U,s[d+0]=(N+G*z)*D,s[d+1]=(S+j*z)*D,s[d+2]=(E+V*z)*D}else if(p==2){var O=t[I+3],N=t[I],S=t[I+1],E=t[I+2],y=s[d+3],G=s[d],j=s[d+1],V=s[d+2];O==y&&N==G&&S==j&&E==V?(s[d]=0,s[d+1]=0,s[d+2]=0,s[d+3]=0):(s[d]=N,s[d+1]=S,s[d+2]=E,s[d+3]=O)}else if(p==3){var O=t[I+3],N=t[I],S=t[I+1],E=t[I+2],y=s[d+3],G=s[d],j=s[d+1],V=s[d+2];if(O==y&&N==G&&S==j&&E==V)continue;if(O<220&&y>20)return!1}return!0},a.encode=function(t,n,h,s,m,x){s==null&&(s=0),x==null&&(x=!1);for(var f=new Uint8Array(t[0].byteLength*t.length+100),v=[137,80,78,71,13,10,26,10],p=0;p<8;p++)f[p]=v[p];var c=8,C=a._bin,I=a.crc.crc,d=C.writeUint,_=C.writeUshort,A=C.writeASCII,O=a.encode.compressPNG(t,n,h,s,x);d(f,c,13),c+=4,A(f,c,"IHDR"),c+=4,d(f,c,n),c+=4,d(f,c,h),c+=4,f[c]=O.depth,c++,f[c]=O.ctype,c++,f[c]=0,c++,f[c]=0,c++,f[c]=0,c++,d(f,c,I(f,c-17,17)),c+=4,d(f,c,1),c+=4,A(f,c,"sRGB"),c+=4,f[c]=1,c++,d(f,c,I(f,c-5,5)),c+=4;var N=t.length>1;if(N&&(d(f,c,8),c+=4,A(f,c,"acTL"),c+=4,d(f,c,t.length),c+=4,d(f,c,0),c+=4,d(f,c,I(f,c-12,12)),c+=4),O.ctype==3){var S=O.plte.length;d(f,c,S*3),c+=4,A(f,c,"PLTE"),c+=4;for(var p=0;p<S;p++){var E=p*3,y=O.plte[p],G=y&255,j=y>>8&255,V=y>>16&255;f[c+E+0]=G,f[c+E+1]=j,f[c+E+2]=V}if(c+=S*3,d(f,c,I(f,c-S*3-4,S*3+4)),c+=4,O.gotAlpha){d(f,c,S),c+=4,A(f,c,"tRNS"),c+=4;for(var p=0;p<S;p++)f[c+p]=O.plte[p]>>24&255;c+=S,d(f,c,I(f,c-S-4,S+4)),c+=4}}for(var z=0,U=0;U<O.frames.length;U++){var D=O.frames[U];N&&(d(f,c,26),c+=4,A(f,c,"fcTL"),c+=4,d(f,c,z++),c+=4,d(f,c,D.rect.width),c+=4,d(f,c,D.rect.height),c+=4,d(f,c,D.rect.x),c+=4,d(f,c,D.rect.y),c+=4,_(f,c,m[U]),c+=2,_(f,c,1e3),c+=2,f[c]=D.dispose,c++,f[c]=D.blend,c++,d(f,c,I(f,c-30,30)),c+=4);var J=D.cimg,S=J.length;d(f,c,S+(U==0?0:4)),c+=4;var $=c;A(f,c,U==0?"IDAT":"fdAT"),c+=4,U!=0&&(d(f,c,z++),c+=4);for(var p=0;p<S;p++)f[c+p]=J[p];c+=S,d(f,c,I(f,$,c-$)),c+=4}return d(f,c,0),c+=4,A(f,c,"IEND"),c+=4,d(f,c,I(f,c-4,4)),c+=4,f.buffer.slice(0,c)},a.encode.compressPNG=function(t,n,h,s,m){for(var x=a.encode.compress(t,n,h,s,!1,m),f=0;f<t.length;f++){var v=x.frames[f];v.rect.width;var p=v.rect.height,c=v.bpl,C=v.bpp,I=new Uint8Array(p*c+p);v.cimg=a.encode._filterZero(v.img,p,C,c,I)}return x},a.encode.compress=function(t,n,h,s,m,x){x==null&&(x=!1);for(var f=6,v=8,p=4,c=255,C=0;C<t.length;C++)for(var I=new Uint8Array(t[C]),d=I.length,_=0;_<d;_+=4)c&=I[_+3];var A=c!=255,O={},N=[];if(t.length!=0&&(O[0]=0,N.push(0),s!=0&&s--),s!=0){var S=a.quantize(t,s,m);t=S.bufs;for(var _=0;_<S.plte.length;_++){var E=S.plte[_].est.rgba;O[E]==null&&(O[E]=N.length,N.push(E))}}else for(var C=0;C<t.length;C++)for(var y=new Uint32Array(t[C]),d=y.length,_=0;_<d;_++){var E=y[_];if((_<n||E!=y[_-1]&&E!=y[_-n])&&O[E]==null&&(O[E]=N.length,N.push(E),N.length>=300))break}var G=A?m:!1,j=N.length;j<=256&&x==!1&&(j<=2?v=1:j<=4?v=2:j<=16?v=4:v=8,m&&(v=8),A=!0);for(var V=[],C=0;C<t.length;C++){var z=new Uint8Array(t[C]),U=new Uint32Array(z.buffer),D=0,J=0,$=n,K=h,Z=0;if(C!=0&&!G){for(var te=m||C==1||V[V.length-2].dispose==2?1:2,de=0,Ee=1e9,pe=0;pe<te;pe++){for(var Se=new Uint8Array(t[C-1-pe]),ge=new Uint32Array(t[C-1-pe]),re=n,X=h,Q=-1,me=-1,ie=0;ie<h;ie++)for(var W=0;W<n;W++){var _=ie*n+W;U[_]!=ge[_]&&(W<re&&(re=W),W>Q&&(Q=W),ie<X&&(X=ie),ie>me&&(me=ie))}var Re=Q==-1?1:(Q-re+1)*(me-X+1);Re<Ee&&(Ee=Re,de=pe,Q==-1?(D=J=0,$=K=1):(D=re,J=X,$=Q-re+1,K=me-X+1))}var Se=new Uint8Array(t[C-1-de]);de==1&&(V[V.length-1].dispose=2);var se=new Uint8Array($*K*4);new Uint32Array(se.buffer),a._copyTile(Se,n,h,se,$,K,-D,-J,0),a._copyTile(z,n,h,se,$,K,-D,-J,3)?(a._copyTile(z,n,h,se,$,K,-D,-J,2),Z=1):(a._copyTile(z,n,h,se,$,K,-D,-J,0),Z=0),z=se,U=new Uint32Array(z.buffer)}var we=4*$;if(j<=256&&x==!1){we=Math.ceil(v*$/8);for(var se=new Uint8Array(we*K),ie=0;ie<K;ie++){var _=ie*we,oe=ie*$;if(v==8)for(var W=0;W<$;W++)se[_+W]=O[U[oe+W]];else if(v==4)for(var W=0;W<$;W++)se[_+(W>>1)]|=O[U[oe+W]]<<4-(W&1)*4;else if(v==2)for(var W=0;W<$;W++)se[_+(W>>2)]|=O[U[oe+W]]<<6-(W&3)*2;else if(v==1)for(var W=0;W<$;W++)se[_+(W>>3)]|=O[U[oe+W]]<<7-(W&7)*1}z=se,f=3,p=1}else if(A==!1&&t.length==1){for(var se=new Uint8Array($*K*3),q=$*K,_=0;_<q;_++){var ye=_*3,le=_*4;se[ye]=z[le],se[ye+1]=z[le+1],se[ye+2]=z[le+2]}z=se,f=2,p=3,we=3*$}V.push({rect:{x:D,y:J,width:$,height:K},img:z,bpl:we,bpp:p,blend:Z,dispose:G?1:0})}return{ctype:f,depth:v,plte:N,gotAlpha:A,frames:V}},a.encode._filterZero=function(t,n,h,s,m){for(var x=[],f=0;f<5;f++)if(!(n*s>5e5&&(f==2||f==3||f==4))){for(var v=0;v<n;v++)a.encode._filterLine(m,t,v,s,h,f);if(x.push(T.deflate(m)),h==1)break}for(var p,c=1e9,C=0;C<x.length;C++)x[C].length<c&&(p=C,c=x[C].length);return x[p]},a.encode._filterLine=function(t,n,h,s,m,x){var f=h*s,v=f+h,p=a.decode._paeth;if(t[v]=x,v++,x==0)for(var c=0;c<s;c++)t[v+c]=n[f+c];else if(x==1){for(var c=0;c<m;c++)t[v+c]=n[f+c];for(var c=m;c<s;c++)t[v+c]=n[f+c]-n[f+c-m]+256&255}else if(h==0){for(var c=0;c<m;c++)t[v+c]=n[f+c];if(x==2)for(var c=m;c<s;c++)t[v+c]=n[f+c];if(x==3)for(var c=m;c<s;c++)t[v+c]=n[f+c]-(n[f+c-m]>>1)+256&255;if(x==4)for(var c=m;c<s;c++)t[v+c]=n[f+c]-p(n[f+c-m],0,0)+256&255}else{if(x==2)for(var c=0;c<s;c++)t[v+c]=n[f+c]+256-n[f+c-s]&255;if(x==3){for(var c=0;c<m;c++)t[v+c]=n[f+c]+256-(n[f+c-s]>>1)&255;for(var c=m;c<s;c++)t[v+c]=n[f+c]+256-(n[f+c-s]+n[f+c-m]>>1)&255}if(x==4){for(var c=0;c<m;c++)t[v+c]=n[f+c]+256-p(0,n[f+c-s],0)&255;for(var c=m;c<s;c++)t[v+c]=n[f+c]+256-p(n[f+c-m],n[f+c-s],n[f+c-m-s])&255}}},a.crc={table:(function(){for(var t=new Uint32Array(256),n=0;n<256;n++){for(var h=n,s=0;s<8;s++)h&1?h=3988292384^h>>>1:h=h>>>1;t[n]=h}return t})(),update:function(t,n,h,s){for(var m=0;m<s;m++)t=a.crc.table[(t^n[h+m])&255]^t>>>8;return t},crc:function(t,n,h){return a.crc.update(4294967295,t,n,h)^4294967295}},a.quantize=function(t,n,h){for(var s=[],m=0,x=0;x<t.length;x++)s.push(a.encode.alphaMul(new Uint8Array(t[x]),h)),m+=t[x].byteLength;for(var f=new Uint8Array(m),v=new Uint32Array(f.buffer),p=0,x=0;x<s.length;x++){for(var c=s[x],C=c.length,I=0;I<C;I++)f[p+I]=c[I];p+=C}var d={i0:0,i1:f.length,bst:null,est:null,tdst:0,left:null,right:null};d.bst=a.quantize.stats(f,d.i0,d.i1),d.est=a.quantize.estats(d.bst);for(var _=[d];_.length<n;){for(var A=0,O=0,x=0;x<_.length;x++)_[x].est.L>A&&(A=_[x].est.L,O=x);if(A<.001)break;var N=_[O],S=a.quantize.splitPixels(f,v,N.i0,N.i1,N.est.e,N.est.eMq255),E={i0:N.i0,i1:S,bst:null,est:null,tdst:0,left:null,right:null};E.bst=a.quantize.stats(f,E.i0,E.i1),E.est=a.quantize.estats(E.bst);var y={i0:S,i1:N.i1,bst:null,est:null,tdst:0,left:null,right:null};y.bst={R:[],m:[],N:N.bst.N-E.bst.N};for(var x=0;x<16;x++)y.bst.R[x]=N.bst.R[x]-E.bst.R[x];for(var x=0;x<4;x++)y.bst.m[x]=N.bst.m[x]-E.bst.m[x];y.est=a.quantize.estats(y.bst),N.left=E,N.right=y,_[O]=E,_.push(y)}_.sort(function(te,de){return de.bst.N-te.bst.N});for(var G=0;G<s.length;G++){for(var j=a.quantize.planeDst,V=new Uint8Array(s[G].buffer),z=new Uint32Array(s[G].buffer),U=V.length,x=0;x<U;x+=4){for(var D=V[x]*.00392156862745098,J=V[x+1]*(1/255),$=V[x+2]*(1/255),K=V[x+3]*(1/255),Z=d;Z.left;)Z=j(Z.est,D,J,$,K)<=0?Z.left:Z.right;z[x>>2]=Z.est.rgba}s[G]=z.buffer}return{bufs:s,plte:_}},a.quantize.getNearest=function(t,n,h,s,m){if(t.left==null)return t.tdst=a.quantize.dist(t.est.q,n,h,s,m),t;var x=a.quantize.planeDst(t.est,n,h,s,m),f=t.left,v=t.right;x>0&&(f=t.right,v=t.left);var p=a.quantize.getNearest(f,n,h,s,m);if(p.tdst<=x*x)return p;var c=a.quantize.getNearest(v,n,h,s,m);return c.tdst<p.tdst?c:p},a.quantize.planeDst=function(t,n,h,s,m){var x=t.e;return x[0]*n+x[1]*h+x[2]*s+x[3]*m-t.eMq},a.quantize.dist=function(t,n,h,s,m){var x=n-t[0],f=h-t[1],v=s-t[2],p=m-t[3];return x*x+f*f+v*v+p*p},a.quantize.splitPixels=function(t,n,h,s,m,x){var f=a.quantize.vecDot;for(s-=4;h<s;){for(;f(t,h,m)<=x;)h+=4;for(;f(t,s,m)>x;)s-=4;if(h>=s)break;var v=n[h>>2];n[h>>2]=n[s>>2],n[s>>2]=v,h+=4,s-=4}for(;f(t,h,m)>x;)h-=4;return h+4},a.quantize.vecDot=function(t,n,h){return t[n]*h[0]+t[n+1]*h[1]+t[n+2]*h[2]+t[n+3]*h[3]},a.quantize.stats=function(t,n,h){for(var s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],m=[0,0,0,0],x=h-n>>2,f=n;f<h;f+=4){var v=t[f]*.00392156862745098,p=t[f+1]*(1/255),c=t[f+2]*(1/255),C=t[f+3]*(1/255);m[0]+=v,m[1]+=p,m[2]+=c,m[3]+=C,s[0]+=v*v,s[1]+=v*p,s[2]+=v*c,s[3]+=v*C,s[5]+=p*p,s[6]+=p*c,s[7]+=p*C,s[10]+=c*c,s[11]+=c*C,s[15]+=C*C}return s[4]=s[1],s[8]=s[2],s[12]=s[3],s[9]=s[6],s[13]=s[7],s[14]=s[11],{R:s,m,N:x}},a.quantize.estats=function(t){var n=t.R,h=t.m,s=t.N,m=h[0],x=h[1],f=h[2],v=h[3],p=s==0?0:1/s,c=[n[0]-m*m*p,n[1]-m*x*p,n[2]-m*f*p,n[3]-m*v*p,n[4]-x*m*p,n[5]-x*x*p,n[6]-x*f*p,n[7]-x*v*p,n[8]-f*m*p,n[9]-f*x*p,n[10]-f*f*p,n[11]-f*v*p,n[12]-v*m*p,n[13]-v*x*p,n[14]-v*f*p,n[15]-v*v*p],C=c,I=a.M4,d=[.5,.5,.5,.5],_=0,A=0;if(s!=0)for(var O=0;O<10&&(d=I.multVec(C,d),A=Math.sqrt(I.dot(d,d)),d=I.sml(1/A,d),!(Math.abs(A-_)<1e-9));O++)_=A;var N=[m*p,x*p,f*p,v*p],S=I.dot(I.sml(255,N),d),E=N[3]<.001?0:1/N[3];return{Cov:c,q:N,e:d,L:_,eMq255:S,eMq:I.dot(d,N),rgba:(Math.round(255*N[3])<<24|Math.round(255*N[2]*E)<<16|Math.round(255*N[1]*E)<<8|Math.round(255*N[0]*E)<<0)>>>0}},a.M4={multVec:function(t,n){return[t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3],t[4]*n[0]+t[5]*n[1]+t[6]*n[2]+t[7]*n[3],t[8]*n[0]+t[9]*n[1]+t[10]*n[2]+t[11]*n[3],t[12]*n[0]+t[13]*n[1]+t[14]*n[2]+t[15]*n[3]]},dot:function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]},sml:function(t,n){return[t*n[0],t*n[1],t*n[2],t*n[3]]}},a.encode.alphaMul=function(t,n){for(var h=new Uint8Array(t.length),s=t.length>>2,m=0;m<s;m++){var x=m<<2,f=t[x+3];n&&(f=f<128?0:255);var v=f*(1/255);h[x+0]=t[x+0]*v,h[x+1]=t[x+1]*v,h[x+2]=t[x+2]*v,h[x+3]=f}return h}})(r,o)})()})(yr)),yr.exports}cn();async function hn(g,r){const o=new Blob([g],{type:r});return await createImageBitmap(o,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}const Ur={KHR_texture_transform:"KHR_texture_transform",KHR_materials_transmission:"KHR_materials_transmission"};class gr{offset;rotation;scale;texcoord;constructor(r){this.offset=r.offset??[0,0],this.rotation=r.rotation??0,this.scale=r.scale??[1,1],this.texcoord=r.texCoord}get data(){return{offset:this.offset,rotation:this.rotation,scale:this.scale}}static getDefaultData(){return{offset:[0,0],rotation:0,scale:[1,1]}}}class dn{factor;texture;constructor(r){this.factor=r.transmissionFactor,r.transmissionTexture!=null&&(this.texture=new Ct(r.transmissionTexture))}}function Lr(g){return sr(g[0],g[1],g[2])}function bt(g){const r=Xe();return fr(r,g),Ut(r,r),r}function jn(g,r){return Pt(ir(),g,r)}function Gn(g,r){return Nt(ir(),g,r)}function Vn(g,r){return yt(ir(),g,r)}function Zn(g){return Pr(ir(),g)}var Nr=`override MAX_LIGHTS: u32 = 10u;

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
    @align(16) offset: vec2f,\r
    @align(16) rotation: f32,\r
    @align(16) scale: vec2f\r
};

struct TextureInfo {\r
    @align(16) hasTexture: u32,\r
    @align(16) hasTextureTransform: u32,\r
    @align(16) textureTransform: TextureTransform\r
};

struct PbrMaterialUniform {\r
     @align(16) baseColorFactor: vec4f,\r
     @align(16) baseColorTexture: TextureInfo,\r
     @align(16) metallicFactor: f32,\r
     @align(16) roughnessFactor: f32,\r
     @align(16) metallicRoughnessTexture: TextureInfo,\r
     @align(16) normalScale: f32,\r
     @align(16) normalTexture: TextureInfo,\r
     @align(16) emmissiveFactor: vec3f,\r
     @align(16) emmissiveTexture: TextureInfo,\r
     @align(16) occlusionStrength: f32,\r
     @align(16) occlusionTexture: TextureInfo,\r
     @align(16) alphaMode: u32,\r
     @align(16) alphaCutoff: f32,

    @align(16) hasTransmission: u32,\r
    @align(16) transmissionFactor: f32\r
    
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
    @align(16) texcoordOrder: TexCoordOrder\r
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

}`;function Hn(g){return Object.keys(g).length}function Yn(g,r,o){return Math.min(Math.max(g,r),o)}function xr(g,r="Value must not be null or undefined"){if(g==null)throw new Error(r)}function qn(g,r){return Math.random()*(r-g)+g}class Dr{options;context;scene;definition;pipeline;constructor(r){this.options=r}static getAttributeOptions(r,o,a){const T=a in o.json.attributes;let t=0,n=0;if(T){const h=o.getAssessor(a);n=o.getBufferView(a).byteStride??h.getElementBytes(),t=0}else n=0,t=0;return{exists:T,stride:n,offset:t}}static getMultiAttributeOptions(r,o,a){return Object.keys(o.json.attributes).filter(T=>T.startsWith(a)).map(T=>{const t=o.json.attributes[T],n=r.assessors[t];return{exists:!0,stride:r.bufferViews[n.json.bufferView].byteStride??n.getElementBytes(),offset:0}})}static attributeKey(r,o){return o.exists?`${r}:T:${o.stride}:${o.offset}`:`${r}:F`}static multiAttributeKey(r,o){return o.map(a=>this.attributeKey(r,a)).join(",")}static getPipelineOptionsOfPrimitive(r,o){const a=o.getMeterial();return{mode:o.getMode(),indices:o.hasIndicies(),position:this.getAttributeOptions(r,o,Ue.POSITION),normal:this.getAttributeOptions(r,o,Ue.NORMAL),tangent:this.getAttributeOptions(r,o,Ue.TANGENT),texoord:this.getMultiAttributeOptions(r,o,Ue.TEXCOORD),joints:this.getMultiAttributeOptions(r,o,Ue.JOINTS),weights:this.getMultiAttributeOptions(r,o,Ue.WEIGHTS),morph:o.hasMorph(),colorTexutre:a.hasTexture(Ne.BaseColor),metalTexture:a.hasTexture(Ne.MetallicRoughness),normalTexture:a.hasTexture(Ne.Normal),emmissiveTexture:a.hasTexture(Ne.Emmissive),occlusionTexture:a.hasTexture(Ne.Occlusion),alphaMode:a.getAlphaMode(),doubleSided:a.getDoubleSided(),transmission:a.transmission!=null}}static getPipelineKeyOfOptions(r){function o(t,n){return n?`${t}:T`:`${t}:F`}return[r.mode,this.attributeKey("pos",r.position),this.attributeKey("nor",r.normal),this.attributeKey("tan",r.tangent),this.multiAttributeKey("tex",r.texoord),this.multiAttributeKey("jot",r.joints),this.multiAttributeKey("wgt",r.weights),o("mor",r.morph),r.alphaMode,o("dbs",r.doubleSided)].join("|")}getBlend(){if(this.options.alphaMode==="BLEND"||this.options.transmission)return{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}getCullMode(){return this.options.doubleSided?"none":"back"}getDepthWriteEnabled(){return this.options.alphaMode!=="BLEND"}createPipeline(r,o){this.context=r,this.scene=o;const a="gltf",T=this.context.device;this.definition=jr(Nr);const t=T.createShaderModule({label:a,code:Nr}),n=T.createBindGroupLayout({label:a,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),h=T.createPipelineLayout({label:a,bindGroupLayouts:[this.scene.bindGroupLayout,ar.getBindGroupLayout(T),n]});let s=0;const m=[];m.push({arrayStride:this.options.position.stride,attributes:[{shaderLocation:s++,offset:0,format:"float32x3"}]}),m.push({arrayStride:this.options.normal.stride,attributes:[{shaderLocation:s++,offset:0,format:"float32x3"}]}),m.push({arrayStride:this.options.tangent.stride,attributes:[{shaderLocation:s++,offset:0,format:"float32x3"}]});for(let f=0;f<5;++f){const v=this.options.texoord[f];m.push({arrayStride:v?.stride??8,attributes:[{shaderLocation:s++,offset:0,format:"float32x2"}]})}const x=T.createRenderPipeline({label:a,layout:h,vertex:{module:t,buffers:m},fragment:{module:t,targets:[{format:this.context.canvas.context.getConfiguration().format,blend:this.getBlend()}]},primitive:{topology:"triangle-list",cullMode:this.getCullMode(),frontFace:"ccw"},depthStencil:{depthWriteEnabled:this.getDepthWriteEnabled(),format:"depth32float",depthCompare:"less-equal"}});this.pipeline=x}}class mr{static pipelines={};webgpu;constructor(r,o){this.webgpu={context:r,scene:o}}render(r){const o=r.sceneRef??r.gltf.json.scene,a=r.gltf.scenes[o],T=[];this.preRenderScene(a,r,T);const t=[],n=[];for(const h of T)h.primitive.getMeterial().getAlphaMode()==="BLEND"?t.push(h):n.push(h);n.forEach(h=>{this.renderPrimitive(h.matrix,h.primitive,r)}),t.forEach(h=>{this.renderPrimitive(h.matrix,h.primitive,r)})}preRenderScene(r,o,a){for(const T of r.nodes){const t=o.gltf.nodes[T];this.preRenderNode(t,o.matrix??Xe(),o,a)}}preRenderNode(r,o,a,T){if(!r.enabled)return;const t=zt(Xe(),o,r.matrix);if(r.children!=null)for(const n of r.children){const h=a.gltf.nodes[n];this.preRenderNode(h,t,a,T)}if(r.camera!=null,r.skin!=null,r.mesh!=null){const n=a.gltf.meshes[r.mesh];this.preRenderMesh(n,t,a,T)}}preRenderMesh(r,o,a,T){if(r.enabled)for(const t of r.primitives)T.push({primitive:t,matrix:o})}renderPrimitive(r,o,a){const T=Dr.getPipelineOptionsOfPrimitive(a.gltf,o),t=Dr.getPipelineKeyOfOptions(T);let n;t in mr.pipelines?(n=mr.pipelines[t],n.pipeline==null&&n.createPipeline(this.webgpu.context,this.webgpu.scene)):(n=new Dr(T),n.createPipeline(this.webgpu.context,this.webgpu.scene),mr.pipelines[t]=n);const h=this.webgpu.context.device,s=zr(n.definition.uniforms.model),m=o.getGPUMaterialTexCoordMap();o.webgpu.uniform==null&&(o.webgpu.uniform=this.createModelUniform(h,s));const x={modelmtx:r,normalmtx:bt(r),tangentmtx:bt(r),hasTangent:o.hasTangent()?1:0,texcoordOrder:{baseColor:m.baseColor??0,metallicRoughness:m.metallicRoughness??0,normal:m.normal??0,emmissive:m.emmissive??0,occlusion:m.occlusion??0}};s.set(x),h.queue.writeBuffer(o.webgpu.uniform,0,s.arrayBuffer);const f=h.createBindGroup({label:"primitive",layout:n.pipeline.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:o.webgpu.uniform}}]});let v=null;if(o.hasIndicies()&&(v=this.getPrimitiveIndexBuffer(h,o),v==null))return;let p=null;if(o.hasPosition()&&(p=this.getPrimitiveAttributeBuffer(h,o,Ue.POSITION),p==null))return;let c=null;o.hasNormal()&&(c=this.getPrimitiveAttributeBuffer(h,o,Ue.NORMAL));let C=null;o.hasTangent()&&(C=this.getPrimitiveAttributeBuffer(h,o,Ue.TANGENT));const I=o.getOrderedTexcoordAttrName(),d=[];for(let _=0;_<5;++_){const A=I[_];if(A!=null){const O=parseInt(A.split("_")[1]);d.push(this.getPrimitiveAttributeBuffer(h,o,Ue.TEXCOORD,O))}else d.push(null)}a.pass.setPipeline(n.pipeline),a.pass.setVertexBuffer(0,p.buffer,p.offset,p.size),c!=null?a.pass.setVertexBuffer(1,c.buffer,c.offset,c.size):a.pass.setVertexBuffer(1,o.getDefaultVec3FloatGPUBuffer(h)),C!=null?a.pass.setVertexBuffer(2,C.buffer,C.offset,C.size):a.pass.setVertexBuffer(2,o.getDefaultVec4FloatGPUBuffer(h));for(let _=0;_<5;++_){const A=d[_];A!=null?a.pass.setVertexBuffer(3+_,A.buffer,A.offset,A.size):a.pass.setVertexBuffer(3+_,o.getDefaultVec2FloatGPUBuffer(h))}a.pass.setBindGroup(0,this.webgpu.scene.bindGroup),a.pass.setBindGroup(1,o.getMeterial().getGPUMaterial(h).getBindGroup(h)),a.pass.setBindGroup(2,f),o.hasIndicies()?(a.pass.setIndexBuffer(v.buffer,v.format,v.offset,v.size),a.pass.drawIndexed(v.count)):a.pass.draw(p.count)}getGPUIndexFormat(r){switch(r.json.componentType){case hr.UNSIGNED_BYTE:return"uint16";case hr.UNSIGNED_SHORT:return"uint16";case hr.UNSIGNED_INT:return"uint32"}}getPrimitiveIndexBuffer(r,o){const a=o.gltf.assessors[o.json.indices],T=o.gltf.bufferViews[a.json.bufferView],t=o.gltf.buffers[T.json.buffer],n=a.json.componentType,h=this.getGPUIndexFormat(a);if(n!==hr.UNSIGNED_BYTE){const s=a.json.byteOffset??0,m=T.json.byteOffset??0,x=T.byteLength,f=s+m,v=x-s,p=a.json.count,c=t.getGPUBuffer(r,GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST);return c==null?null:{buffer:c,format:h,offset:f,size:v,count:p}}else throw Error("Index Format 当前不支持uint8")}getPrimitiveAttributeBuffer(r,o,a,T){let t;T!=null?t=`${a}_${T}`:t=a;const n=o.json.attributes[t];xr(n);const h=o.gltf.assessors[n];xr(h);const s=o.gltf.bufferViews[h.json.bufferView];xr(s);const m=o.gltf.buffers[s.json.buffer];xr(m);const x=h.json.byteOffset??0,f=s.json.byteOffset??0,v=s.byteLength,p=x+f,c=v-x,C=h.json.count,I=m.getGPUBuffer(r,GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST);return I==null?null:{buffer:I,offset:p,size:c,count:C}}createModelUniform(r,o){return r.createBuffer({label:"model uniform",size:o.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}}const vn={OPAQUE:0,MASK:1,BLEND:2};class ar{material;static bindgroupLayout;bindgroup;webgpu={};static defaultTexture;static defaultSampler;constructor(r){this.material=r}static getBindGroupLayout(r){if(!ar.bindgroupLayout){const o=GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,a={sampleType:"float",viewDimension:"2d",multisampled:!1},T={type:"filtering"},t=r.createBindGroupLayout({label:"GLTFGPUMaterial",entries:[{binding:0,visibility:o,buffer:{type:"uniform"}},{binding:1,visibility:o,texture:a},{binding:2,visibility:o,sampler:T},{binding:3,visibility:o,texture:a},{binding:4,visibility:o,sampler:T},{binding:5,visibility:o,texture:a},{binding:6,visibility:o,sampler:T},{binding:7,visibility:o,texture:a},{binding:8,visibility:o,sampler:T},{binding:9,visibility:o,texture:a},{binding:10,visibility:o,sampler:T}]});ar.bindgroupLayout=t}return ar.bindgroupLayout}getBindGroup(r){if(!this.bindgroup||!this.material.isTextureReady()){const o=r.createBindGroup({label:"GLTFGPUMaterial",layout:ar.getBindGroupLayout(r),entries:[{binding:0,resource:{buffer:this.getUniform(r)}},{binding:1,resource:this.material.getGPUTexture(r,this.material.baseColor.texture)},{binding:2,resource:this.material.getGPUSampler(r,this.material.baseColor.texture)},{binding:3,resource:this.material.getGPUTexture(r,this.material.pbr.texture)},{binding:4,resource:this.material.getGPUSampler(r,this.material.pbr.texture)},{binding:5,resource:this.material.getGPUTexture(r,this.material.normal.texture)},{binding:6,resource:this.material.getGPUSampler(r,this.material.normal.texture)},{binding:7,resource:this.material.getGPUTexture(r,this.material.emmissive.texture)},{binding:8,resource:this.material.getGPUSampler(r,this.material.emmissive.texture)},{binding:9,resource:this.material.getGPUTexture(r,this.material.occlusion.texture)},{binding:10,resource:this.material.getGPUSampler(r,this.material.occlusion.texture)}]});this.bindgroup=o}return this.bindgroup}getUniform(r){if(!this.webgpu.uniform){const o=jr(Nr),a=zr(o.uniforms.pbrMaterial),T=r.createBuffer({label:"pbrMaterial",size:a.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),t={baseColorFactor:this.material.baseColor.factor,baseColorTexture:{hasTexture:He(this.material.hasTexture(Ne.BaseColor)),hasTextureTransform:He(this.material.hasTextureTransform(Ne.BaseColor)),textureTransform:this.material.getTextureTransformData(Ne.BaseColor)},metallicFactor:this.material.pbr.metallic,roughnessFactor:this.material.pbr.roughness,metallicRoughnessTexture:{hasTexture:He(this.material.hasTexture(Ne.MetallicRoughness)),hasTextureTransform:He(this.material.hasTextureTransform(Ne.MetallicRoughness)),textureTransform:this.material.getTextureTransformData(Ne.MetallicRoughness)},normalScale:this.material.normal.scale,normalTexture:{hasTexture:He(this.material.hasTexture(Ne.Normal)),hasTextureTransform:He(this.material.hasTextureTransform(Ne.Normal)),textureTransform:this.material.getTextureTransformData(Ne.Normal)},emmissiveFactor:this.material.emmissive.factor,emmissiveTexture:{hasTexture:He(this.material.hasTexture(Ne.Emmissive)),hasTextureTransform:He(this.material.hasTextureTransform(Ne.Emmissive)),textureTransform:this.material.getTextureTransformData(Ne.Emmissive)},occlusionStrength:this.material.occlusion.strength,occlusionTexture:{hasTexture:He(this.material.hasTexture(Ne.Occlusion)),hasTextureTransform:He(this.material.hasTextureTransform(Ne.Occlusion)),textureTransform:this.material.getTextureTransformData(Ne.Occlusion)},alphaMode:vn[this.material.getAlphaMode()],alphaCutoff:this.material.getAlphaCutoff(),hasTransmission:He(this.material.transmission!=null),transmissionFactor:this.material.transmission!=null?this.material.transmission.factor:0};a.set(t),r.queue.writeBuffer(T,0,a.arrayBuffer),this.webgpu.uniform=T}return this.webgpu.uniform}destroy(){this.webgpu.uniform?.destroy(),this.webgpu.uniform=null}}class xn{ref;gltf;json;nodes;constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a,this.nodes=a.nodes}}class gn{gltf;ref;json;matrix=Xe();children;camera;skin;mesh;#t=!0;constructor(r,o,a){if(this.gltf=r,this.ref=o,this.json=a,this.json.children&&(this.children=a.children),this.json.matrix)this.matrix=Et(...this.json.matrix);else if(this.json.translation){const T=this.json.translation??[0,0,0],t=this.json.rotation??[0,0,0,1],n=this.json.scale??[1,1,1];this.matrix=jt(Xe(),Kt(t[0],t[1],t[2],t[3]),sr(T[0],T[1],T[2]),sr(n[0],n[1],n[2]))}this.camera=this.json.camera,this.mesh=this.json.mesh,this.skin=this.json.skin}get enabled(){return this.#t}enable(){this.#t=!0}disable(){this.#t=!1}switch(){this.#t=!this.#t}}class mn{gltf;ref;json;primitives;#t=!0;disable(){this.#t=!1}enable(){this.#t=!0}get enabled(){return this.#t}constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a,this.primitives=this.json.primitives.map((T,t)=>new _n(r,this,t))}}const Ue={POSITION:"POSITION",NORMAL:"NORMAL",TANGENT:"TANGENT",TEXCOORD:"TEXCOORD",JOINTS:"JOINTS",WEIGHTS:"WEIGHTS"};class _n{gltf;ref;mesh;json;mode;indices;webgpu={};constructor(r,o,a){this.gltf=r,this.ref=a,this.mesh=o,this.json=o.json.primitives[a],this.mode=this.json.mode,this.indices=this.json.indices}getVertexCount(){return this.getAssessor(Ue.POSITION).count}getMode(){return this.mode}getMeterial(){return this.gltf.getMaterial(this.json.material)}hasIndicies(){return!!this.indices}hasPosition(){return Ue.POSITION in this.json.attributes}hasNormal(){return Ue.NORMAL in this.json.attributes}hasTangent(){return Ue.TANGENT in this.json.attributes}hasTexcoord(r=0){return`${Ue.TEXCOORD}_${r}`in this.json.attributes}numTexcoord(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.TEXCOORD)).length}hasJoints(r=0){return`${Ue.JOINTS}_${r}`in this.json.attributes}numJoints(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.JOINTS)).length}hasWeights(r=0){return`${Ue.WEIGHTS}_${r}`in this.json.attributes}numWeights(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.WEIGHTS)).length}hasMorph(){return!!this.json.targets}getAssessor(r,o){const a=o?`${r}_${o}`:r,T=this.json.attributes[a];return T==null?null:this.gltf.assessors[T]}getBufferView(r,o){const a=this.getAssessor(r,o);return a==null?null:this.gltf.bufferViews[a.json.bufferView]??null}getOrderedTexcoordAttrName(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.TEXCOORD)).sort((r,o)=>{const a=parseInt(r.split("_")[1]),T=parseInt(o.split("_")[1]);return a-T})}getGPUMaterialTexCoordMap(){const r=this.gltf.materials[this.json.material];if(r){const o=this.getTexCoordOrderMap(),a=r.getTexcoordIndexMap(),T=Object.entries(a).map(([t,n])=>{const h=o[n];return[t,h]});return Object.fromEntries(T)}return{}}getTexCoordOrderMap(){const r=Object.keys(this.json.attributes).filter(o=>o.startsWith(Ue.TEXCOORD)).map(o=>parseInt(o.split("_")[1])).sort().map((o,a)=>[o,a]);return Object.fromEntries(r)}getDefaultVec4FloatGPUBuffer(r){if(this.webgpu.defaultVec4FloatBuffer!=null)return this.webgpu.defaultVec4FloatBuffer;const a=16*this.getVertexCount(),T=new ArrayBuffer(a),t=r.createBuffer({label:"primitive default vec4f buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,T),this.webgpu.defaultVec4FloatBuffer=t,t}getDefaultVec3FloatGPUBuffer(r){if(this.webgpu.defaultVec3FloatBuffer!=null)return this.webgpu.defaultVec3FloatBuffer;const a=12*this.getVertexCount(),T=new ArrayBuffer(a),t=r.createBuffer({label:"primitive default vec3f buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,T),this.webgpu.defaultVec3FloatBuffer=t,t}getDefaultVec2FloatGPUBuffer(r){if(this.webgpu.defaultVec2FloatBuffer!=null)return this.webgpu.defaultVec2FloatBuffer;const a=8*this.getVertexCount(),T=new ArrayBuffer(a),t=r.createBuffer({label:"primitive default vec2f buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,T),this.webgpu.defaultVec2FloatBuffer=t,t}}const $e={NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987},Or={NEAREST:9728,LINEAR:9729},We={REPEAT:10497,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648},pn={label:"gltf default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"};class bn{gltf;ref;json;webgpu={};getImage(){return this.gltf.images[this.json.source]??null}constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a}getGPUTexture(r){if(this.webgpu.texture!=null)return this.webgpu.texture;const o=this.gltf.images[this.json.source];if(o==null)return null;if(o.loadImage(),o.status===ur.READY){const a=o.image,T=Gt(r,a,{mips:this.needMipmap(),format:"rgba8unorm",size:[a.width,a.height,1]});this.webgpu.texture=T}else return null}needMipmap(){const r=this.gltf.samplers[this.json.sampler];return r==null?!1:r.needMipmap()}getGPUSampler(r){if(this.webgpu.sampler!=null)return this.webgpu.sampler;{const o=this.gltf.samplers[this.json.sampler];return o==null?this.webgpu.sampler=r.createSampler(pn):this.webgpu.sampler=o.getGPUSampler(r),this.webgpu.sampler}}destroy(){this.webgpu.texture?.destroy(),this.webgpu.texture=null}}class wn{gltf;ref;json;minFilter;magFilter;wrapS;wrapT;webgpu={};constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a,this.minFilter=this.json.minFilter??$e.LINEAR,this.magFilter=this.json.magFilter??Or.LINEAR,this.wrapS=this.json.wrapS??We.REPEAT,this.wrapT=this.json.wrapT??We.REPEAT}needMipmap(){return this.minFilter===$e.NEAREST_MIPMAP_NEAREST||this.minFilter===$e.LINEAR_MIPMAP_NEAREST||this.minFilter===$e.NEAREST_MIPMAP_LINEAR||this.minFilter===$e.LINEAR_MIPMAP_LINEAR}getGPUSamplerDescriptor(){const r={label:"gltf sampler"};switch(this.minFilter){case $e.NEAREST:r.minFilter="nearest";break;case $e.LINEAR:r.minFilter="linear";break;case $e.NEAREST_MIPMAP_NEAREST:r.minFilter="nearest",r.mipmapFilter="nearest";break;case $e.LINEAR_MIPMAP_NEAREST:r.minFilter="linear",r.mipmapFilter="nearest";break;case $e.NEAREST_MIPMAP_LINEAR:r.minFilter="nearest",r.mipmapFilter="linear";break;case $e.LINEAR_MIPMAP_LINEAR:r.minFilter="linear",r.mipmapFilter="linear";break}switch(this.magFilter){case Or.NEAREST:r.magFilter="nearest";break;case Or.LINEAR:r.magFilter="linear";break}switch(this.wrapS){case We.REPEAT:r.addressModeU="repeat";break;case We.CLAMP_TO_EDGE:r.addressModeU="clamp-to-edge";break;case We.MIRRORED_REPEAT:r.addressModeU="mirror-repeat"}switch(this.wrapT){case We.REPEAT:r.addressModeV="repeat";break;case We.CLAMP_TO_EDGE:r.addressModeV="clamp-to-edge";break;case We.MIRRORED_REPEAT:r.addressModeV="mirror-repeat"}return r}getGPUSampler(r){if(this.webgpu.sampler==null){const o=this.getGPUSamplerDescriptor();this.webgpu.sampler=r.createSampler(o)}return this.webgpu.sampler}}class Ct{textureRef=0;texcoordRef;textureTransform;ready=!1;constructor(r){r!=null&&(this.textureRef=r.index,this.texcoordRef=r.texCoord??0,r.extensions!=null&&Ur.KHR_texture_transform in r.extensions&&(this.textureTransform=new gr(r.extensions.KHR_texture_transform),this.textureTransform.texcoord!=null&&(this.texcoordRef=this.textureTransform.texcoord)))}}const Ne={BaseColor:"BaseColor",MetallicRoughness:"MetallicRoughness",Normal:"Normal",Emmissive:"Emmissive",Occlusion:"Occlusion"};class wt{gltf;ref;json;alphaMode="OPAQUE";alphaCutoff=.5;doubleSided=!1;baseColor={factor:[1,1,1,1]};pbr={metallic:1,roughness:1};normal={scale:1};emmissive={factor:[0,0,0]};occlusion={strength:1};webgpu={};transmission;constructor(r,o,a){if(this.gltf=r,this.ref=o,this.json=a,this.json){const T=this.json.pbrMetallicRoughness;T&&(this.baseColor.factor=T.baseColorFactor??[1,1,1,1],this.baseColor.texture=this.getTextureInfo(T.baseColorTexture),this.pbr.metallic=T.metallicFactor??1,this.pbr.roughness=T.roughnessFactor??1,this.pbr.texture=this.getTextureInfo(T.metallicRoughnessTexture)),this.normal.scale=this.json.normalTexture?.scale??1,this.normal.texture=this.getTextureInfo(this.json.normalTexture),this.emmissive.factor=this.json.emissiveFactor??[0,0,0],this.emmissive.texture=this.getTextureInfo(this.json.emissiveTexture),this.occlusion.strength=this.json.occlusionTexture?.strength??1,this.occlusion.texture=this.getTextureInfo(this.json.occlusionTexture),this.alphaMode=this.json.alphaMode??"OPAQUE",this.alphaCutoff=this.json.alphaCutoff??.5,this.doubleSided=this.json.doubleSided??!1,this.json.extensions!=null&&Ur.KHR_materials_transmission in this.json.extensions&&(this.transmission=new dn(a.extensions[Ur.KHR_materials_transmission]),this.alphaMode="BLEND")}}getTextureInfo(r){return r==null?null:new Ct(r)}getAlphaMode(){return this.alphaMode}getAlphaCutoff(){return this.alphaCutoff}getDoubleSided(){return this.doubleSided}hasTexture(r){switch(r){case"BaseColor":return this.baseColor.texture!=null;case"MetallicRoughness":return this.pbr.texture!=null;case"Normal":return this.normal.texture!=null;case"Emmissive":return this.emmissive.texture!=null;case"Occlusion":return this.occlusion.texture!=null;default:return!1}}hasTextureTransform(r){if(!this.hasTexture(r))return!1;switch(r){case"BaseColor":return this.baseColor.texture.textureTransform!=null;case"MetallicRoughness":return this.pbr.texture.textureTransform!=null;case"Normal":return this.normal.texture.textureTransform!=null;case"Emmissive":return this.emmissive.texture.textureTransform!=null;case"Occlusion":return this.occlusion.texture.textureTransform!=null;default:return!1}}getTextureTransformData(r){if(!this.hasTexture(r)||!this.hasTextureTransform(r))return gr.getDefaultData();switch(r){case"BaseColor":return this.baseColor.texture.textureTransform.data;case"MetallicRoughness":return this.pbr.texture.textureTransform.data;case"Normal":return this.normal.texture.textureTransform.data;case"Emmissive":return this.emmissive.texture.textureTransform.data;case"Occlusion":return this.occlusion.texture.textureTransform.data;default:return gr.getDefaultData()}}getTexcoordIndexMap(){return{baseColor:this.baseColor.texture?.texcoordRef,metallicRoughness:this.pbr.texture?.texcoordRef,normal:this.normal.texture?.texcoordRef,emmissive:this.emmissive.texture?.texcoordRef,occlusion:this.occlusion.texture?.texcoordRef}}isTextureReady(){const r=this.baseColor.texture==null||this.baseColor.texture.ready,o=this.pbr.texture==null||this.pbr.texture.ready,a=this.normal.texture==null||this.normal.texture.ready,T=this.emmissive.texture==null||this.emmissive.texture.ready,t=this.occlusion.texture==null||this.occlusion.texture.ready;return r&&o&&a&&T&&t}getGPUTexture(r,o){if(o==null)return this.gltf.getDefaultTexture(r);const T=this.gltf.textures[o.textureRef].getGPUTexture(r);return T==null?this.gltf.getDefaultTexture(r):(o.ready=!0,T)}getGPUSampler(r,o){if(o==null)return this.gltf.getDefaultSampler(r);const T=this.gltf.textures[o.textureRef].getGPUSampler(r);return T??this.gltf.getDefaultSampler(r)}getGPUMaterial(r){if(this.webgpu.material==null){const o=new ar(this);this.webgpu.material=o}return this.webgpu.material}destroy(){this.webgpu.material?.destroy(),this.webgpu.material=null}}const ur={NONE:0,LOADING:1,READY:2,FAILED:3};class Tn{gltf;ref;json;image=null;status=ur.NONE;constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a}async loadImage(){if(this.status!==ur.NONE)return;this.status=ur.LOADING;let r=null;if(this.json.uri){let o="";this.json.uri.startsWith("data:")?o=this.json.uri:o=`${this.gltf.url}/${this.json.uri}`;const T=await(await fetch(o)).blob();r=await createImageBitmap(T,{colorSpaceConversion:"none",imageOrientation:"from-image",premultiplyAlpha:"none"})}else if(this.json.bufferView){const o=this.gltf.bufferViews[this.json.bufferView];if(!o)throw this.status=ur.FAILED,new Error("GLTFImage loadImage get bufferView Failed");const a=o.byteOffset,T=o.byteLength,t=await o.loadData(),n=this.json.mimeType,h=new ArrayBuffer(T);new Uint8Array(h).set(t.slice(a,a+T)),r=await hn(h,n)}return this.image=r,this.status=ur.READY,this.image}destroy(){}}class yn{gltf;ref;json;constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a}}class En{gltf;ref;json;constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a}}class Sn{gltf;ref;json;constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a}}const An={SCALA:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},hr={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,UNSIGNED_INT:5125,FLOAT:5126},kn=Object.fromEntries(Object.entries(hr).map(([g,r])=>[r,g])),Rn={BYTE:1,UNSIGNED_BYTE:1,SHORT:2,UNSIGNED_SHORT:2,UNSIGNED_INT:4,FLOAT:4};class In{gltf;ref;json;count;byteOffset;constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a,this.byteOffset=this.json.byteOffset??0,this.count=this.json.count??0}async loadData(){return this.gltf.bufferViews[this.json.bufferView].loadData()}getElementBytes(){const r=this.json.type,o=this.json.componentType,a=An[r],T=Rn[kn[o]];return a*T}}class Mn{gltf;ref;json;byteLength;byteOffset;byteStride;constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a,this.byteLength=this.json.byteLength,this.byteOffset=this.json.byteOffset??0,this.byteStride=this.json.byteStride}async loadData(){return this.gltf.buffers[this.json.buffer].loadData()}}const cr={NONE:0,LOADING:1,READY:2};class Fn{gltf;ref;json;byteLength;uri;data=null;status=cr.NONE;webgpu={buffers:{}};constructor(r,o,a){this.gltf=r,this.ref=o,this.json=a,this.byteLength=this.json.byteLength,this.uri=this.json.uri}loadData(){return this.status=cr.LOADING,(async()=>{let r=null;if(this.uri){let o=this.json.uri;this.uri.startsWith("data:")||(o=`${this.gltf.url}/${this.uri}`);const a=await fetch(o);if(!a.ok)throw new Error(`Failed to load buffer data: ${a.status}`);r=await a.arrayBuffer()}return this.data=new Uint8Array(r),this.status=cr.READY,this.data})()}getGPUBuffer(r,o){if(this.status===cr.NONE)return this.loadData(),null;if(this.status===cr.LOADING)return null;if(this.webgpu.buffers[o]!=null)return this.webgpu.buffers[o];{const a=r.createBuffer({label:this.json.name??"gltf buffer",size:this.json.byteLength,usage:o});r.queue.writeBuffer(a,0,this.data.buffer,0,this.byteLength),this.webgpu.buffers[o]=a}}destroy(){for(const r of Object.values(this.webgpu.buffers))r.destroy();this.webgpu.buffers={}}}class Xn{name="glTF";#t;#a;#e;#n;#i=!1;#r=[];scenes;nodes;meshes;camera;textures;samplers;materials;images;skins;animations;assessors;bufferViews;buffers;#s;webgpu={};constructor(r){this.#t=r.uri,this.#a=this.#t.replace(/\/[^\/]*$/,"/"),this.name=r.name??"gltf",this.#o(this.#t).then(o=>{this.#e=o;const T=o.asset.version;if(this.#n=T,T!=="2.0")throw Error("only supports glTF 2.0 currently.");this.build(),this.#i=!0;for(const t of this.#r)t(this)})}get ready(){return this.#i}get uri(){return this.#t}get url(){return this.#a}get json(){return this.#e}get version(){return this.#n}get defaultMaterial(){return this.#s||(this.#s=new wt(this)),this.#s}getMaterial(r){return r==null?this.defaultMaterial:this.materials[r]}onReady(r){this.ready?r(this):this.#r.push(r)}async#o(r){const o=await fetch(r);if(!o.ok)throw new Error(o.statusText);const a=await o.json();return this.#e=a,this.#e}build(){this.scenes=this.json.scenes?.map((r,o)=>new xn(this,o,r)),this.nodes=this.json.nodes?.map((r,o)=>new gn(this,o,r)),this.meshes=this.json.meshes?.map((r,o)=>new mn(this,o,r)),this.camera=this.json.cameras?.map((r,o)=>new yn(this,o,r)),this.textures=this.json.textures?.map((r,o)=>new bn(this,o,r)),this.samplers=this.json.samplers?.map((r,o)=>new wn(this,o,r)),this.materials=this.json.materials?.map((r,o)=>new wt(this,o,r)),this.images=this.json.images?.map((r,o)=>new Tn(this,o,r)),this.skins=this.json.skins?.map((r,o)=>new En(this,o,r)),this.animations=this.json.animations?.map((r,o)=>new Sn(this,o,r)),this.assessors=this.json.accessors?.map((r,o)=>new In(this,o,r)),this.bufferViews=this.json.bufferViews?.map((r,o)=>new Mn(this,o,r)),this.buffers=this.json.buffers?.map((r,o)=>new Fn(this,o,r))}getDefaultTexture(r){if(this.webgpu.defaultTexture==null){const o=r.createTexture({label:"pbrMaterial default texture",size:[1,1,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:o},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.webgpu.defaultTexture=o}return this.webgpu.defaultTexture}getDefaultSampler(r){if(this.webgpu.defaultSampler==null){const o=r.createSampler({label:"pbrMaterial default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.webgpu.defaultSampler=o}return this.webgpu.defaultSampler}destroy(){for(const r of this.buffers)r.destroy();for(const r of this.images)r.destroy();for(const r of this.textures)r.destroy();for(const r of this.materials)r.destroy();this.webgpu.defaultTexture!=null&&(this.webgpu.defaultTexture.destroy(),this.webgpu.defaultTexture=null)}}var Cn=`override MAX_LIGHTS: u32 = 10u;

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
}`;class Bn{#t;#a;#e;#n;#i;#r={};constructor(r){this.#t=r.label??"SimpleLine",this.#a=r.topology,this.#e=r.positions,this.#n=r.colors,this.#i=r.indices}get topology(){return this.#a}get positions(){return this.positions}get colors(){return this.#n}initWebGPU(r,o){this.#r.context=r,this.#r.scene=o,this.refreshUniforms(),this.refreshVertexBuffers(),this.createPileline()}createDefaultColors(){const r=this.positions.length/3,o=[0,1,0,1];this.#n=new Float32Array(Array(r).fill(o).flat())}refreshVertexBuffers(r=!1){if(!this.#r.context)return;const o=this.#r.context.device;if(r||!this.#r.buffer){this.colors||this.createDefaultColors();const a=this.#r.buffer;if(this.#i){const T=$r(o,{position:{data:this.#e,numComponents:3},colors:{data:this.#n,numComponents:4},indices:this.#i});this.#r.buffer=T}else{const T=$r(o,{position:{data:this.#e,numComponents:3},colors:{data:this.#n,numComponents:4}});this.#r.buffer=T}a&&(a.buffers.forEach(T=>T.destroy()),a.indexBuffer&&a.indexBuffer.destroy())}}refreshUniforms(){this.#r.scene.refreshUniform()}createPileline(){const r=this.#r.context.device;this.#r.module=r.createShaderModule({label:this.#t,code:Cn});const o=r.createPipelineLayout({bindGroupLayouts:[this.#r.scene.bindGroupLayout]}),a={label:this.#t,layout:o,vertex:{module:this.#r.module,buffers:this.#r.buffer.bufferLayouts},fragment:{module:this.#r.module,targets:[{format:this.#r.context.canvas.context.getConfiguration().format}]},primitive:{topology:this.#a},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};this.#r.pipeline=r.createRenderPipeline(a)}draw(r){this.refreshUniforms(),this.refreshVertexBuffers();const o=this.#r.scene,a=this.#r.buffer;r.setPipeline(this.#r.pipeline),r.setBindGroup(0,o.bindGroup),r.setVertexBuffer(0,a.buffers[0]),this.#i?(r.setIndexBuffer(a.indexBuffer,a.indexFormat),r.drawIndexed(a.numElements)):r.draw(this.#e.length/3)}destroy(){for(const r of this.#r.buffer.buffers)r.destroy()}}var Ln=`override MAX_LIGHTS: u32 = 10u;

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
}`;class Kn{camera;projection;worldmtx=Xe();#t=0;#a=0;lights=[];MAX_NUM_LIGHTS=16;ibl;#e={};#n={};on(r,o){r in this.#n||(this.#n[r]=[]),this.#n[r].push(o)}fire(r){if(r in this.#n)for(const o of this.#n[r])o(this)}constructor(r,o){this.camera=r,this.camera.on("change",()=>{this.fire("change")}),this.projection=o,this.projection.on("change",()=>{this.fire("change")})}setWorldMatrix(r){this.worldmtx=r,this.fire("change")}addLight(r){this.lights.push(r),this.fire("change")}setIBL(r){this.ibl=r,this.#e.context!=null&&r.webgpu.context==null&&r.initWebGPU(this.#e.context,this),this.fire("change")}canEnv(){return this.ibl!=null&&this.ibl.canEnv()}canIBL(){return this.ibl!=null&&this.ibl.canIBL()}getEnv(){return this.canEnv()?this.ibl.environment:null}refreshViewport(r,o){this.#t=r,this.#a=o,this.fire("change")}get viewportMatrix(){const a=this.#t/2,T=this.#a/2;return Et(a,0,0,0,0,T,0,0,0,0,1,0,0+a,0+T,0,1)}get viewportMatrixInv(){return fr(Xe(),this.viewportMatrix)}getRayOfPixel(r,o){o=this.#a-o;const a=this.viewportMatrix,T=this.projection.perspectiveMatrixZO,t=this.camera.viewMtx,n=Vt(Xe(),T,t),h=fr(Xe(),n),s=fr(Xe(),a),m=Tt(r,o,0,1),x=Wr(Jr(),m,s),f=Wr(Jr(),x,h),v=sr(f[0],f[1],f[2]),p=sr(this.camera.from[0],this.camera.from[1],this.camera.from[2]),c=Pr(ir(),yt(ir(),v,p));return new Zt(p,c)}initWebGPU(r){this.#e.context=r}refreshUniform(){if(this.#e.context){const r=this.#e.context.device;this.#e.definition||(this.#e.definition=jr(Ln));const o=zr(this.#e.definition.uniforms.scene);this.#e.uniform||(this.#e.uniform=r.createBuffer({label:"scene",size:o.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));const a={eye:Lr(this.camera.from),center:Lr(this.camera.to),up:Lr(this.camera.up),viewmtx:this.camera.viewMtx,viewmtxInv:fr(Xe(),this.camera.viewMtx)},T={near:this.projection.near,far:this.projection.far,fovy:this.projection.fovy,aspect:this.projection.aspect,projmtx:this.projection.perspectiveMatrixZO,projmtxInv:fr(Xe(),this.projection.perspectiveMatrixZO)},t={width:this.#t,height:this.#a,viewportmtx:this.viewportMatrix,viewportmtxInv:this.viewportMatrixInv},n=this.getIBLsh(),h={canIBL:He(this.canIBL()),prescaled:He(this.canIBL()&&this.ibl.sh.prescale),sh:n},s=Math.min(this.MAX_NUM_LIGHTS,this.lights.length),m=[];for(let f=0;f<s;++f)m.push({position:this.lights[f].position,color:this.lights[f].color});const x={worldmtx:this.worldmtx,camera:a,projection:T,viewport:t,ibl:h,numLights:s,lights:m};o.set(x),r.queue.writeBuffer(this.#e.uniform,0,o.arrayBuffer)}}get bindGroupLayout(){if(this.#e.context){const r=this.#e.context.device;return this.#e.layout||(this.#e.layout=r.createBindGroupLayout({label:"scene",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT|GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube",sampleType:"float",multisampled:!1}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"2d",sampleType:"float",multisampled:!1}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]})),this.#e.layout}return null}getPrefilterTexture(){let r;if(this.canIBL()&&(r=this.ibl.getPrefilterTexture()),r==null){const o=this.#e.context?.device;r=this.getDefaultCubeTexture(o)}return r}getPrefilterSampler(){let r;if(this.canIBL()&&(r=this.ibl.getPerfilterSampler()),r==null){const o=this.#e.context?.device;r=this.getDefaultCubeSampler(o)}return r}getLUTTexture(){let r;if(this.canIBL()&&(r=this.ibl.getLUTTexture()),r==null){const o=this.#e.context?.device;r=this.getDefault2DTexture(o)}return r}getLUTSampler(){let r;if(this.canIBL()&&(r=this.ibl.getLUTSampler()),r==null){const o=this.#e.context?.device;r=this.getDefault2DSampler(o)}return r}getIBLsh(){return this.canIBL()?this.ibl.sh.parameters:Array(9).fill([1,1,1])}get bindGroup(){if(this.#e.context){const r=this.#e.context.device,o=this.getPrefilterTexture(),a=this.getPrefilterSampler(),T=this.getLUTTexture(),t=this.getLUTSampler();return this.#e.bindgroup=r.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.#e.uniform}},{binding:1,resource:o.createView({dimension:"cube"})},{binding:2,resource:a},{binding:3,resource:T.createView({dimension:"2d"})},{binding:4,resource:t}]}),this.#e.bindgroup}return null}get uniform(){return this.#e.uniform}getDefaultCubeTexture(r){if(this.#e.defaultCubeTexture==null){const o=r.createTexture({label:"default texture",size:[1,1,6],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:o},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.#e.defaultCubeTexture=o}return this.#e.defaultCubeTexture}getDefaultCubeSampler(r){if(this.#e.defaultCubeSampler==null){const o=r.createSampler({label:"default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.#e.defaultCubeSampler=o}return this.#e.defaultCubeSampler}getDefault2DTexture(r){if(this.#e.default2DTexture==null){const o=r.createTexture({label:"default texture",size:[1,1,1],format:"rgba8unorm",dimension:"2d",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:o},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.#e.default2DTexture=o}return this.#e.default2DTexture}getDefault2DSampler(r){if(this.#e.default2DSampler==null){const o=r.createSampler({label:"default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.#e.default2DSampler=o}return this.#e.default2DSampler}destroy(){this.#e.uniform&&this.#e.uniform.destroy(),this.#e.defaultCubeTexture&&this.#e.defaultCubeTexture.destroy(),this.#e.default2DTexture&&this.#e.default2DTexture.destroy()}}class $n{#t;#a;#e;#n;#i;#r;#s;constructor(r){this.#t=r.xlim??[0,1],this.#a=r.ylim??[0,1],this.#e=r.zlim??[0,1],this.#n=r.xcolor??[1,0,0,1],this.#i=r.ycolor??[0,1,0,1],this.#r=r.zcolor??[0,0,1,1],this.#s=new Bn({topology:"line-list",positions:new Float32Array([this.#t[0],0,0,this.#t[1],0,0,0,this.#a[0],0,0,this.#a[1],0,0,0,this.#e[0],0,0,this.#e[1]]),colors:new Float32Array([...this.#n,...this.#n,...this.#i,...this.#i,...this.#r,...this.#r]),indices:null})}initWebGPU(r,o){this.#s.initWebGPU(r,o)}draw(r){this.#s.draw(r)}destroy(){this.#s.destroy()}}export{$n as A,mr as G,$t as L,Kn as S,Kt as a,Pn as b,Ht as c,Lr as d,Gn as e,Un as f,jn as g,Vn as h,gn as i,mn as j,Xn as k,At as l,zn as m,St as n,Yn as o,bt as p,Bn as q,qn as r,Hn as s,Nn as t,Zn as v};
