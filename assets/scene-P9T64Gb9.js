import{a as Pr,m as Nr,b as Ft,c as Kr}from"./webgpu-utils.module--9rjYVl9.js";import{h as Ze,R as Ct}from"./webgpuUtils-WmS6MPjV.js";import{A as gr,f as wt,e as ar,d as ir,w as Bt,g as mr,x as Lt,n as zr,y as Dt,E as Ot,j as Ut,h as Pt,s as Tt,c as qe,i as fr,z as Nt,m as zt,B as yt,D as jt,F as Gt,t as Wr,o as $r}from"./camera-CxW_3t7Z.js";function Vt(){var T=new gr(9);return gr!=Float32Array&&(T[1]=0,T[2]=0,T[3]=0,T[5]=0,T[6]=0,T[7]=0),T[0]=1,T[4]=1,T[8]=1,T}function Jr(){var T=new gr(4);return gr!=Float32Array&&(T[0]=0,T[1]=0,T[2]=0),T[3]=1,T}function Zt(T,r,u){u=u*.5;var a=Math.sin(u);return T[0]=a*r[0],T[1]=a*r[1],T[2]=a*r[2],T[3]=Math.cos(u),T}function _r(T,r,u,a){var y=r[0],t=r[1],n=r[2],h=r[3],s=u[0],m=u[1],v=u[2],l=u[3],x,b,c,L,M;return b=y*s+t*m+n*v+h*l,b<0&&(b=-b,s=-s,m=-m,v=-v,l=-l),1-b>Ot?(x=Math.acos(b),c=Math.sin(x),L=Math.sin((1-a)*x)/c,M=Math.sin(a*x)/c):(L=1-a,M=a),T[0]=L*y+M*s,T[1]=L*t+M*m,T[2]=L*n+M*v,T[3]=L*h+M*l,T}function Ht(T,r){var u=r[0]+r[4]+r[8],a;if(u>0)a=Math.sqrt(u+1),T[3]=.5*a,a=.5/a,T[0]=(r[5]-r[7])*a,T[1]=(r[6]-r[2])*a,T[2]=(r[1]-r[3])*a;else{var y=0;r[4]>r[0]&&(y=1),r[8]>r[y*3+y]&&(y=2);var t=(y+1)%3,n=(y+2)%3;a=Math.sqrt(r[y*3+y]-r[t*3+t]-r[n*3+n]+1),T[y]=.5*a,a=.5/a,T[3]=(r[t*3+n]-r[n*3+t])*a,T[t]=(r[t*3+y]+r[y*3+t])*a,T[n]=(r[n*3+y]+r[y*3+n])*a}return T}var Yt=wt,Et=Dt;(function(){var T=ar(),r=ir(1,0,0),u=ir(0,1,0);return function(a,y,t){var n=Bt(y,t);return n<-.999999?(mr(T,r,y),Lt(T)<1e-6&&mr(T,u,y),zr(T,T),Zt(a,T,Math.PI),a):n>.999999?(a[0]=0,a[1]=0,a[2]=0,a[3]=1,a):(mr(T,y,t),a[0]=T[0],a[1]=T[1],a[2]=T[2],a[3]=1+n,Et(a,a))}})();(function(){var T=Jr(),r=Jr();return function(u,a,y,t,n,h){return _r(T,a,n,h),_r(r,y,t,h),_r(u,T,r,2*h*(1-h)),u}})();(function(){var T=Vt();return function(r,u,a,y){return T[0]=a[0],T[3]=a[1],T[6]=a[2],T[1]=y[0],T[4]=y[1],T[7]=y[2],T[2]=-u[0],T[5]=-u[1],T[8]=-u[2],Et(r,Ht(r,T))}})();var br={exports:{}},Qr;function qt(){return Qr||(Qr=1,(function(T){function r(a){var y=Math.floor,t=new Array(64),n=new Array(64),h=new Array(64),s=new Array(64),m,v,l,x,b=new Array(65535),c=new Array(65535),L=new Array(64),M=new Array(64),d=[],g=0,A=7,D=new Array(64),O=new Array(64),S=new Array(64),E=new Array(256),w=new Array(2048),G,j=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],V=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],z=[0,1,2,3,4,5,6,7,8,9,10,11],P=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],U=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],J=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],W=[0,1,2,3,4,5,6,7,8,9,10,11],K=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],Z=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];function te(F){for(var _e=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],ve=0;ve<64;ve++){var pe=y((_e[ve]*F+50)/100);pe<1?pe=1:pe>255&&(pe=255),t[j[ve]]=pe}for(var ke=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],Me=0;Me<64;Me++){var Re=y((ke[Me]*F+50)/100);Re<1?Re=1:Re>255&&(Re=255),n[j[Me]]=Re}for(var le=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],ce=0,he=0;he<8;he++)for(var ae=0;ae<8;ae++)h[ce]=1/(t[j[ce]]*le[he]*le[ae]*8),s[ce]=1/(n[j[ce]]*le[he]*le[ae]*8),ce++}function de(F,_e){for(var ve=0,pe=0,ke=new Array,Me=1;Me<=16;Me++){for(var Re=1;Re<=F[Me];Re++)ke[_e[pe]]=[],ke[_e[pe]][0]=ve,ke[_e[pe]][1]=Me,pe++,ve++;ve*=2}return ke}function Ee(){m=de(V,z),v=de(J,W),l=de(P,U),x=de(K,Z)}function be(){for(var F=1,_e=2,ve=1;ve<=15;ve++){for(var pe=F;pe<_e;pe++)c[32767+pe]=ve,b[32767+pe]=[],b[32767+pe][1]=ve,b[32767+pe][0]=pe;for(var ke=-(_e-1);ke<=-F;ke++)c[32767+ke]=ve,b[32767+ke]=[],b[32767+ke][1]=ve,b[32767+ke][0]=_e-1+ke;F<<=1,_e<<=1}}function ge(){for(var F=0;F<256;F++)w[F]=19595*F,w[F+256>>0]=38470*F,w[F+512>>0]=7471*F+32768,w[F+768>>0]=-11059*F,w[F+1024>>0]=-21709*F,w[F+1280>>0]=32768*F+8421375,w[F+1536>>0]=-27439*F,w[F+1792>>0]=-5329*F}function re(F){for(var _e=F[0],ve=F[1]-1;ve>=0;)_e&1<<ve&&(g|=1<<A),ve--,A--,A<0&&(g==255?(X(255),X(0)):X(g),A=7,g=0)}function X(F){d.push(F)}function Q(F){X(F>>8&255),X(F&255)}function me(F,_e){var ve,pe,ke,Me,Re,le,ce,he,ae=0,Ae,f=8,R=64;for(Ae=0;Ae<f;++Ae){ve=F[ae],pe=F[ae+1],ke=F[ae+2],Me=F[ae+3],Re=F[ae+4],le=F[ae+5],ce=F[ae+6],he=F[ae+7];var N=ve+he,Y=ve-he,p=pe+ce,C=pe-ce,i=ke+le,H=ke-le,Te=Me+Re,e=Me-Re,I=N+Te,B=N-Te,o=p+i,_=p-i;F[ae]=I+o,F[ae+4]=I-o;var k=(_+B)*.707106781;F[ae+2]=B+k,F[ae+6]=B-k,I=e+H,o=H+C,_=C+Y;var xe=(I-_)*.382683433,ne=.5411961*I+xe,ue=1.306562965*_+xe,Fe=o*.707106781,He=Y+Fe,Be=Y-Fe;F[ae+5]=Be+ne,F[ae+3]=Be-ne,F[ae+1]=He+ue,F[ae+7]=He-ue,ae+=8}for(ae=0,Ae=0;Ae<f;++Ae){ve=F[ae],pe=F[ae+8],ke=F[ae+16],Me=F[ae+24],Re=F[ae+32],le=F[ae+40],ce=F[ae+48],he=F[ae+56];var Ce=ve+he,Le=ve-he,Ne=pe+ce,ze=pe-ce,Je=ke+le,Qe=ke-le,De=Me+Re,Ge=Me-Re,Oe=Ce+De,Ve=Ce-De,je=Ne+Je,er=Ne-Je;F[ae]=Oe+je,F[ae+32]=Oe-je;var Gr=(er+Ve)*.707106781;F[ae+16]=Ve+Gr,F[ae+48]=Ve-Gr,Oe=Ge+Qe,je=Qe+ze,er=ze+Le;var Vr=(Oe-er)*.382683433,Zr=.5411961*Oe+Vr,Hr=1.306562965*er+Vr,Yr=je*.707106781,qr=Le+Yr,Xr=Le-Yr;F[ae+40]=Xr+Zr,F[ae+24]=Xr-Zr,F[ae+8]=qr+Hr,F[ae+56]=qr-Hr,ae++}var hr;for(Ae=0;Ae<R;++Ae)hr=F[Ae]*_e[Ae],L[Ae]=hr>0?hr+.5|0:hr-.5|0;return L}function ie(){Q(65504),Q(16),X(74),X(70),X(73),X(70),X(0),X(1),X(1),X(0),Q(1),Q(1),X(0),X(0)}function $(F){if(F){Q(65505),F[0]===69&&F[1]===120&&F[2]===105&&F[3]===102?Q(F.length+2):(Q(F.length+5+2),X(69),X(120),X(105),X(102),X(0));for(var _e=0;_e<F.length;_e++)X(F[_e])}}function Ie(F,_e){Q(65472),Q(17),X(8),Q(_e),Q(F),X(3),X(1),X(17),X(0),X(2),X(17),X(1),X(3),X(17),X(1)}function Se(){Q(65499),Q(132),X(0);for(var F=0;F<64;F++)X(t[F]);X(1);for(var _e=0;_e<64;_e++)X(n[_e])}function se(){Q(65476),Q(418),X(0);for(var F=0;F<16;F++)X(V[F+1]);for(var _e=0;_e<=11;_e++)X(z[_e]);X(16);for(var ve=0;ve<16;ve++)X(P[ve+1]);for(var pe=0;pe<=161;pe++)X(U[pe]);X(1);for(var ke=0;ke<16;ke++)X(J[ke+1]);for(var Me=0;Me<=11;Me++)X(W[Me]);X(17);for(var Re=0;Re<16;Re++)X(K[Re+1]);for(var le=0;le<=161;le++)X(Z[le])}function we(F){typeof F>"u"||F.constructor!==Array||F.forEach(_e=>{if(typeof _e=="string"){Q(65534);var ve=_e.length;Q(ve+2);var pe;for(pe=0;pe<ve;pe++)X(_e.charCodeAt(pe))}})}function oe(){Q(65498),Q(12),X(3),X(1),X(0),X(2),X(17),X(3),X(17),X(0),X(63),X(0)}function q(F,_e,ve,pe,ke){for(var Me=ke[0],Re=ke[240],le,ce=16,he=63,ae=64,Ae=me(F,_e),f=0;f<ae;++f)M[j[f]]=Ae[f];var R=M[0]-ve;ve=M[0],R==0?re(pe[0]):(le=32767+R,re(pe[c[le]]),re(b[le]));for(var N=63;N>0&&M[N]==0;N--);if(N==0)return re(Me),ve;for(var Y=1,p;Y<=N;){for(var C=Y;M[Y]==0&&Y<=N;++Y);var i=Y-C;if(i>=ce){p=i>>4;for(var H=1;H<=p;++H)re(Re);i=i&15}le=32767+M[Y],re(ke[(i<<4)+c[le]]),re(b[le]),Y++}return N!=he&&re(Me),ve}function ye(){for(var F=String.fromCharCode,_e=0;_e<256;_e++)E[_e]=F(_e)}this.encode=function(F,_e){new Date().getTime(),_e&&fe(_e),d=new Array,g=0,A=7,Q(65496),ie(),we(F.comments),$(F.exifBuffer),Se(),Ie(F.width,F.height),se(),oe();var ve=0,pe=0,ke=0;g=0,A=7,this.encode.displayName="_encode_";for(var Me=F.data,Re=F.width,le=F.height,ce=Re*4,he,ae=0,Ae,f,R,N,Y,p,C,i;ae<le;){for(he=0;he<ce;){for(N=ce*ae+he,Y=N,p=-1,C=0,i=0;i<64;i++)C=i>>3,p=(i&7)*4,Y=N+C*ce+p,ae+C>=le&&(Y-=ce*(ae+1+C-le)),he+p>=ce&&(Y-=he+p-ce+4),Ae=Me[Y++],f=Me[Y++],R=Me[Y++],D[i]=(w[Ae]+w[f+256>>0]+w[R+512>>0]>>16)-128,O[i]=(w[Ae+768>>0]+w[f+1024>>0]+w[R+1280>>0]>>16)-128,S[i]=(w[Ae+1280>>0]+w[f+1536>>0]+w[R+1792>>0]>>16)-128;ve=q(D,h,ve,m,l),pe=q(O,s,pe,v,x),ke=q(S,s,ke,v,x),he+=32}ae+=8}if(A>=0){var H=[];H[1]=A+1,H[0]=(1<<A+1)-1,re(H)}return Q(65497),Buffer.from(d)};function fe(F){if(F<=0&&(F=1),F>100&&(F=100),G!=F){var _e=0;F<50?_e=Math.floor(5e3/F):_e=Math.floor(200-F*2),te(_e),G=F}}function ee(){var F=new Date().getTime();a||(a=50),ye(),Ee(),be(),ge(),fe(a),new Date().getTime()-F}ee()}T.exports=u;function u(a,y){typeof y>"u"&&(y=50);var t=new r(y),n=t.encode(a,y);return{data:n,width:a.width,height:a.height}}})(br)),br.exports}var pr={exports:{}},et;function Xt(){return et||(et=1,(function(T){var r=(function(){var y=new Int32Array([0,1,8,16,9,2,3,10,17,24,32,25,18,11,4,5,12,19,26,33,40,48,41,34,27,20,13,6,7,14,21,28,35,42,49,56,57,50,43,36,29,22,15,23,30,37,44,51,58,59,52,45,38,31,39,46,53,60,61,54,47,55,62,63]),t=4017,n=799,h=3406,s=2276,m=1567,v=3784,l=5793,x=2896;function b(){}function c(O,S){for(var E=0,w=[],G,j,V=16;V>0&&!O[V-1];)V--;w.push({children:[],index:0});var z=w[0],P;for(G=0;G<V;G++){for(j=0;j<O[G];j++){for(z=w.pop(),z.children[z.index]=S[E];z.index>0;){if(w.length===0)throw new Error("Could not recreate Huffman Table");z=w.pop()}for(z.index++,w.push(z);w.length<=G;)w.push(P={children:[],index:0}),z.children[z.index]=P.children,z=P;E++}G+1<V&&(w.push(P={children:[],index:0}),z.children[z.index]=P.children,z=P)}return w[0].children}function L(O,S,E,w,G,j,V,z,P,U){E.precision,E.samplesPerLine,E.scanLines;var J=E.mcusPerLine,W=E.progressive;E.maxH,E.maxV;var K=S,Z=0,te=0;function de(){if(te>0)return te--,Z>>te&1;if(Z=O[S++],Z==255){var le=O[S++];if(le)throw new Error("unexpected marker: "+(Z<<8|le).toString(16))}return te=7,Z>>>7}function Ee(le){for(var ce=le,he;(he=de())!==null;){if(ce=ce[he],typeof ce=="number")return ce;if(typeof ce!="object")throw new Error("invalid huffman sequence")}return null}function be(le){for(var ce=0;le>0;){var he=de();if(he===null)return;ce=ce<<1|he,le--}return ce}function ge(le){var ce=be(le);return ce>=1<<le-1?ce:ce+(-1<<le)+1}function re(le,ce){var he=Ee(le.huffmanTableDC),ae=he===0?0:ge(he);ce[0]=le.pred+=ae;for(var Ae=1;Ae<64;){var f=Ee(le.huffmanTableAC),R=f&15,N=f>>4;if(R===0){if(N<15)break;Ae+=16;continue}Ae+=N;var Y=y[Ae];ce[Y]=ge(R),Ae++}}function X(le,ce){var he=Ee(le.huffmanTableDC),ae=he===0?0:ge(he)<<P;ce[0]=le.pred+=ae}function Q(le,ce){ce[0]|=de()<<P}var me=0;function ie(le,ce){if(me>0){me--;return}for(var he=j,ae=V;he<=ae;){var Ae=Ee(le.huffmanTableAC),f=Ae&15,R=Ae>>4;if(f===0){if(R<15){me=be(R)+(1<<R)-1;break}he+=16;continue}he+=R;var N=y[he];ce[N]=ge(f)*(1<<P),he++}}var $=0,Ie;function Se(le,ce){for(var he=j,ae=V,Ae=0;he<=ae;){var f=y[he],R=ce[f]<0?-1:1;switch($){case 0:var N=Ee(le.huffmanTableAC),Y=N&15,Ae=N>>4;if(Y===0)Ae<15?(me=be(Ae)+(1<<Ae),$=4):(Ae=16,$=1);else{if(Y!==1)throw new Error("invalid ACn encoding");Ie=ge(Y),$=Ae?2:3}continue;case 1:case 2:ce[f]?ce[f]+=(de()<<P)*R:(Ae--,Ae===0&&($=$==2?3:0));break;case 3:ce[f]?ce[f]+=(de()<<P)*R:(ce[f]=Ie<<P,$=0);break;case 4:ce[f]&&(ce[f]+=(de()<<P)*R);break}he++}$===4&&(me--,me===0&&($=0))}function se(le,ce,he,ae,Ae){var f=he/J|0,R=he%J,N=f*le.v+ae,Y=R*le.h+Ae;le.blocks[N]===void 0&&U.tolerantDecoding||ce(le,le.blocks[N][Y])}function we(le,ce,he){var ae=he/le.blocksPerLine|0,Ae=he%le.blocksPerLine;le.blocks[ae]===void 0&&U.tolerantDecoding||ce(le,le.blocks[ae][Ae])}var oe=w.length,q,ye,fe,ee,F,_e;W?j===0?_e=z===0?X:Q:_e=z===0?ie:Se:_e=re;var ve=0,pe,ke;oe==1?ke=w[0].blocksPerLine*w[0].blocksPerColumn:ke=J*E.mcusPerColumn,G||(G=ke);for(var Me,Re;ve<ke;){for(ye=0;ye<oe;ye++)w[ye].pred=0;if(me=0,oe==1)for(q=w[0],F=0;F<G;F++)we(q,_e,ve),ve++;else for(F=0;F<G;F++){for(ye=0;ye<oe;ye++)for(q=w[ye],Me=q.h,Re=q.v,fe=0;fe<Re;fe++)for(ee=0;ee<Me;ee++)se(q,_e,ve,fe,ee);if(ve++,ve===ke)break}if(ve===ke)do{if(O[S]===255&&O[S+1]!==0)break;S+=1}while(S<O.length-2);if(te=0,pe=O[S]<<8|O[S+1],pe<65280)throw new Error("marker was not found");if(pe>=65488&&pe<=65495)S+=2;else break}return S-K}function M(O,S){var E=[],w=S.blocksPerLine,G=S.blocksPerColumn,j=w<<3,V=new Int32Array(64),z=new Uint8Array(64);function P(be,ge,re){var X=S.quantizationTable,Q,me,ie,$,Ie,Se,se,we,oe,q=re,ye;for(ye=0;ye<64;ye++)q[ye]=be[ye]*X[ye];for(ye=0;ye<8;++ye){var fe=8*ye;if(q[1+fe]==0&&q[2+fe]==0&&q[3+fe]==0&&q[4+fe]==0&&q[5+fe]==0&&q[6+fe]==0&&q[7+fe]==0){oe=l*q[0+fe]+512>>10,q[0+fe]=oe,q[1+fe]=oe,q[2+fe]=oe,q[3+fe]=oe,q[4+fe]=oe,q[5+fe]=oe,q[6+fe]=oe,q[7+fe]=oe;continue}Q=l*q[0+fe]+128>>8,me=l*q[4+fe]+128>>8,ie=q[2+fe],$=q[6+fe],Ie=x*(q[1+fe]-q[7+fe])+128>>8,we=x*(q[1+fe]+q[7+fe])+128>>8,Se=q[3+fe]<<4,se=q[5+fe]<<4,oe=Q-me+1>>1,Q=Q+me+1>>1,me=oe,oe=ie*v+$*m+128>>8,ie=ie*m-$*v+128>>8,$=oe,oe=Ie-se+1>>1,Ie=Ie+se+1>>1,se=oe,oe=we+Se+1>>1,Se=we-Se+1>>1,we=oe,oe=Q-$+1>>1,Q=Q+$+1>>1,$=oe,oe=me-ie+1>>1,me=me+ie+1>>1,ie=oe,oe=Ie*s+we*h+2048>>12,Ie=Ie*h-we*s+2048>>12,we=oe,oe=Se*n+se*t+2048>>12,Se=Se*t-se*n+2048>>12,se=oe,q[0+fe]=Q+we,q[7+fe]=Q-we,q[1+fe]=me+se,q[6+fe]=me-se,q[2+fe]=ie+Se,q[5+fe]=ie-Se,q[3+fe]=$+Ie,q[4+fe]=$-Ie}for(ye=0;ye<8;++ye){var ee=ye;if(q[8+ee]==0&&q[16+ee]==0&&q[24+ee]==0&&q[32+ee]==0&&q[40+ee]==0&&q[48+ee]==0&&q[56+ee]==0){oe=l*re[ye+0]+8192>>14,q[0+ee]=oe,q[8+ee]=oe,q[16+ee]=oe,q[24+ee]=oe,q[32+ee]=oe,q[40+ee]=oe,q[48+ee]=oe,q[56+ee]=oe;continue}Q=l*q[0+ee]+2048>>12,me=l*q[32+ee]+2048>>12,ie=q[16+ee],$=q[48+ee],Ie=x*(q[8+ee]-q[56+ee])+2048>>12,we=x*(q[8+ee]+q[56+ee])+2048>>12,Se=q[24+ee],se=q[40+ee],oe=Q-me+1>>1,Q=Q+me+1>>1,me=oe,oe=ie*v+$*m+2048>>12,ie=ie*m-$*v+2048>>12,$=oe,oe=Ie-se+1>>1,Ie=Ie+se+1>>1,se=oe,oe=we+Se+1>>1,Se=we-Se+1>>1,we=oe,oe=Q-$+1>>1,Q=Q+$+1>>1,$=oe,oe=me-ie+1>>1,me=me+ie+1>>1,ie=oe,oe=Ie*s+we*h+2048>>12,Ie=Ie*h-we*s+2048>>12,we=oe,oe=Se*n+se*t+2048>>12,Se=Se*t-se*n+2048>>12,se=oe,q[0+ee]=Q+we,q[56+ee]=Q-we,q[8+ee]=me+se,q[48+ee]=me-se,q[16+ee]=ie+Se,q[40+ee]=ie-Se,q[24+ee]=$+Ie,q[32+ee]=$-Ie}for(ye=0;ye<64;++ye){var F=128+(q[ye]+8>>4);ge[ye]=F<0?0:F>255?255:F}}D(j*G*8);for(var U,J,W=0;W<G;W++){var K=W<<3;for(U=0;U<8;U++)E.push(new Uint8Array(j));for(var Z=0;Z<w;Z++){P(S.blocks[W][Z],z,V);var te=0,de=Z<<3;for(J=0;J<8;J++){var Ee=E[K+J];for(U=0;U<8;U++)Ee[de+U]=z[te++]}}}return E}function d(O){return O<0?0:O>255?255:O}b.prototype={load:function(S){var E=new XMLHttpRequest;E.open("GET",S,!0),E.responseType="arraybuffer",E.onload=(function(){var w=new Uint8Array(E.response||E.mozResponseArrayBuffer);this.parse(w),this.onload&&this.onload()}).bind(this),E.send(null)},parse:function(S){var E=this.opts.maxResolutionInMP*1e3*1e3,w=0;S.length;function G(){var R=S[w]<<8|S[w+1];return w+=2,R}function j(){var R=G(),N=S.subarray(w,w+R-2);return w+=N.length,N}function V(R){var N=1,Y=1,p,C;for(C in R.components)R.components.hasOwnProperty(C)&&(p=R.components[C],N<p.h&&(N=p.h),Y<p.v&&(Y=p.v));var i=Math.ceil(R.samplesPerLine/8/N),H=Math.ceil(R.scanLines/8/Y);for(C in R.components)if(R.components.hasOwnProperty(C)){p=R.components[C];var Te=Math.ceil(Math.ceil(R.samplesPerLine/8)*p.h/N),e=Math.ceil(Math.ceil(R.scanLines/8)*p.v/Y),I=i*p.h,B=H*p.v,o=B*I,_=[];D(o*256);for(var k=0;k<B;k++){for(var xe=[],ne=0;ne<I;ne++)xe.push(new Int32Array(64));_.push(xe)}p.blocksPerLine=Te,p.blocksPerColumn=e,p.blocks=_}R.maxH=N,R.maxV=Y,R.mcusPerLine=i,R.mcusPerColumn=H}var z=null,P=null,U,J,W=[],K=[],Z=[],te=[],de=G(),Ee=-1;if(this.comments=[],de!=65496)throw new Error("SOI not found");for(de=G();de!=65497;){var be,ge;switch(de){case 65280:break;case 65504:case 65505:case 65506:case 65507:case 65508:case 65509:case 65510:case 65511:case 65512:case 65513:case 65514:case 65515:case 65516:case 65517:case 65518:case 65519:case 65534:var re=j();if(de===65534){var X=String.fromCharCode.apply(null,re);this.comments.push(X)}de===65504&&re[0]===74&&re[1]===70&&re[2]===73&&re[3]===70&&re[4]===0&&(z={version:{major:re[5],minor:re[6]},densityUnits:re[7],xDensity:re[8]<<8|re[9],yDensity:re[10]<<8|re[11],thumbWidth:re[12],thumbHeight:re[13],thumbData:re.subarray(14,14+3*re[12]*re[13])}),de===65505&&re[0]===69&&re[1]===120&&re[2]===105&&re[3]===102&&re[4]===0&&(this.exifBuffer=re.subarray(5,re.length)),de===65518&&re[0]===65&&re[1]===100&&re[2]===111&&re[3]===98&&re[4]===101&&re[5]===0&&(P={version:re[6],flags0:re[7]<<8|re[8],flags1:re[9]<<8|re[10],transformCode:re[11]});break;case 65499:for(var Q=G(),me=Q+w-2;w<me;){var ie=S[w++];D(256);var $=new Int32Array(64);if(ie>>4===0)for(ge=0;ge<64;ge++){var Ie=y[ge];$[Ie]=S[w++]}else if(ie>>4===1)for(ge=0;ge<64;ge++){var Ie=y[ge];$[Ie]=G()}else throw new Error("DQT: invalid table spec");W[ie&15]=$}break;case 65472:case 65473:case 65474:G(),U={},U.extended=de===65473,U.progressive=de===65474,U.precision=S[w++],U.scanLines=G(),U.samplesPerLine=G(),U.components={},U.componentsOrder=[];var Se=U.scanLines*U.samplesPerLine;if(Se>E){var se=Math.ceil((Se-E)/1e6);throw new Error(`maxResolutionInMP limit exceeded by ${se}MP`)}var we=S[w++],oe;for(be=0;be<we;be++){oe=S[w];var q=S[w+1]>>4,ye=S[w+1]&15,fe=S[w+2];if(q<=0||ye<=0)throw new Error("Invalid sampling factor, expected values above 0");U.componentsOrder.push(oe),U.components[oe]={h:q,v:ye,quantizationIdx:fe},w+=3}V(U),K.push(U);break;case 65476:var ee=G();for(be=2;be<ee;){var F=S[w++],_e=new Uint8Array(16),ve=0;for(ge=0;ge<16;ge++,w++)ve+=_e[ge]=S[w];D(16+ve);var pe=new Uint8Array(ve);for(ge=0;ge<ve;ge++,w++)pe[ge]=S[w];be+=17+ve,(F>>4===0?te:Z)[F&15]=c(_e,pe)}break;case 65501:G(),J=G();break;case 65500:G(),G();break;case 65498:G();var ke=S[w++],Me=[],Re;for(be=0;be<ke;be++){Re=U.components[S[w++]];var le=S[w++];Re.huffmanTableDC=te[le>>4],Re.huffmanTableAC=Z[le&15],Me.push(Re)}var ce=S[w++],he=S[w++],ae=S[w++],Ae=L(S,w,U,Me,J,ce,he,ae>>4,ae&15,this.opts);w+=Ae;break;case 65535:S[w]!==255&&w--;break;default:if(S[w-3]==255&&S[w-2]>=192&&S[w-2]<=254){w-=3;break}else if(de===224||de==225){if(Ee!==-1)throw new Error(`first unknown JPEG marker at offset ${Ee.toString(16)}, second unknown JPEG marker ${de.toString(16)} at offset ${(w-1).toString(16)}`);Ee=w-1;const R=G();if(S[w+R-2]===255){w+=R-2;break}}throw new Error("unknown JPEG marker "+de.toString(16))}de=G()}if(K.length!=1)throw new Error("only single frame JPEGs supported");for(var be=0;be<K.length;be++){var f=K[be].components;for(var ge in f)f[ge].quantizationTable=W[f[ge].quantizationIdx],delete f[ge].quantizationIdx}this.width=U.samplesPerLine,this.height=U.scanLines,this.jfif=z,this.adobe=P,this.components=[];for(var be=0;be<U.componentsOrder.length;be++){var Re=U.components[U.componentsOrder[be]];this.components.push({lines:M(U,Re),scaleX:Re.h/U.maxH,scaleY:Re.v/U.maxV})}},getData:function(S,E){var w=this.width/S,G=this.height/E,j,V,z,P,U,J,W,K,Z,te,de=0,Ee,be,ge,re,X,Q,me,ie,$,Ie,Se,se=S*E*this.components.length;D(se);var we=new Uint8Array(se);switch(this.components.length){case 1:for(j=this.components[0],te=0;te<E;te++)for(U=j.lines[0|te*j.scaleY*G],Z=0;Z<S;Z++)Ee=U[0|Z*j.scaleX*w],we[de++]=Ee;break;case 2:for(j=this.components[0],V=this.components[1],te=0;te<E;te++)for(U=j.lines[0|te*j.scaleY*G],J=V.lines[0|te*V.scaleY*G],Z=0;Z<S;Z++)Ee=U[0|Z*j.scaleX*w],we[de++]=Ee,Ee=J[0|Z*V.scaleX*w],we[de++]=Ee;break;case 3:for(Se=!0,this.adobe&&this.adobe.transformCode?Se=!0:typeof this.opts.colorTransform<"u"&&(Se=!!this.opts.colorTransform),j=this.components[0],V=this.components[1],z=this.components[2],te=0;te<E;te++)for(U=j.lines[0|te*j.scaleY*G],J=V.lines[0|te*V.scaleY*G],W=z.lines[0|te*z.scaleY*G],Z=0;Z<S;Z++)Se?(Ee=U[0|Z*j.scaleX*w],be=J[0|Z*V.scaleX*w],ge=W[0|Z*z.scaleX*w],ie=d(Ee+1.402*(ge-128)),$=d(Ee-.3441363*(be-128)-.71413636*(ge-128)),Ie=d(Ee+1.772*(be-128))):(ie=U[0|Z*j.scaleX*w],$=J[0|Z*V.scaleX*w],Ie=W[0|Z*z.scaleX*w]),we[de++]=ie,we[de++]=$,we[de++]=Ie;break;case 4:if(!this.adobe)throw new Error("Unsupported color mode (4 components)");for(Se=!1,this.adobe&&this.adobe.transformCode?Se=!0:typeof this.opts.colorTransform<"u"&&(Se=!!this.opts.colorTransform),j=this.components[0],V=this.components[1],z=this.components[2],P=this.components[3],te=0;te<E;te++)for(U=j.lines[0|te*j.scaleY*G],J=V.lines[0|te*V.scaleY*G],W=z.lines[0|te*z.scaleY*G],K=P.lines[0|te*P.scaleY*G],Z=0;Z<S;Z++)Se?(Ee=U[0|Z*j.scaleX*w],be=J[0|Z*V.scaleX*w],ge=W[0|Z*z.scaleX*w],re=K[0|Z*P.scaleX*w],X=255-d(Ee+1.402*(ge-128)),Q=255-d(Ee-.3441363*(be-128)-.71413636*(ge-128)),me=255-d(Ee+1.772*(be-128))):(X=U[0|Z*j.scaleX*w],Q=J[0|Z*V.scaleX*w],me=W[0|Z*z.scaleX*w],re=K[0|Z*P.scaleX*w]),we[de++]=255-X,we[de++]=255-Q,we[de++]=255-me,we[de++]=255-re;break;default:throw new Error("Unsupported color mode")}return we},copyToImageData:function(S,E){var w=S.width,G=S.height,j=S.data,V=this.getData(w,G),z=0,P=0,U,J,W,K,Z,te,de,Ee,be;switch(this.components.length){case 1:for(J=0;J<G;J++)for(U=0;U<w;U++)W=V[z++],j[P++]=W,j[P++]=W,j[P++]=W,E&&(j[P++]=255);break;case 3:for(J=0;J<G;J++)for(U=0;U<w;U++)de=V[z++],Ee=V[z++],be=V[z++],j[P++]=de,j[P++]=Ee,j[P++]=be,E&&(j[P++]=255);break;case 4:for(J=0;J<G;J++)for(U=0;U<w;U++)Z=V[z++],te=V[z++],W=V[z++],K=V[z++],de=255-d(Z*(1-K/255)+K),Ee=255-d(te*(1-K/255)+K),be=255-d(W*(1-K/255)+K),j[P++]=de,j[P++]=Ee,j[P++]=be,E&&(j[P++]=255);break;default:throw new Error("Unsupported color mode")}}};var g=0,A=0;function D(O=0){var S=g+O;if(S>A){var E=Math.ceil((S-A)/1024/1024);throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${E}MB`)}g=S}return b.resetMaxMemoryUsage=function(O){g=0,A=O},b.getBytesAllocated=function(){return g},b.requestMemoryAllocation=D,b})();T.exports=u;function u(a,y={}){var t={colorTransform:void 0,useTArray:!1,formatAsRGBA:!0,tolerantDecoding:!0,maxResolutionInMP:100,maxMemoryUsageInMB:512},n={...t,...y},h=new Uint8Array(a),s=new r;s.opts=n,r.resetMaxMemoryUsage(n.maxMemoryUsageInMB*1024*1024),s.parse(h);var m=n.formatAsRGBA?4:3,v=s.width*s.height*m;try{r.requestMemoryAllocation(v);var l={width:s.width,height:s.height,exifBuffer:s.exifBuffer,data:n.useTArray?new Uint8Array(v):Buffer.alloc(v)};s.comments.length>0&&(l.comments=s.comments)}catch(x){throw x instanceof RangeError?new Error("Could not allocate enough memory for the image. Required: "+v):x instanceof ReferenceError&&x.message==="Buffer is not defined"?new Error("Buffer is not globally defined in this environment. Consider setting useTArray to true"):x}return s.copyToImageData(l,n.formatAsRGBA),l}})(pr)),pr.exports}var wr,rt;function Kt(){if(rt)return wr;rt=1;var T=qt(),r=Xt();return wr={encode:T,decode:r},wr}Kt();function Wt(T){throw new Error('Could not dynamically require "'+T+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Tr={exports:{}},yr={},tt;function $e(){return tt||(tt=1,(function(T){var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";function u(t,n){return Object.prototype.hasOwnProperty.call(t,n)}T.assign=function(t){for(var n=Array.prototype.slice.call(arguments,1);n.length;){var h=n.shift();if(h){if(typeof h!="object")throw new TypeError(h+"must be non-object");for(var s in h)u(h,s)&&(t[s]=h[s])}}return t},T.shrinkBuf=function(t,n){return t.length===n?t:t.subarray?t.subarray(0,n):(t.length=n,t)};var a={arraySet:function(t,n,h,s,m){if(n.subarray&&t.subarray){t.set(n.subarray(h,h+s),m);return}for(var v=0;v<s;v++)t[m+v]=n[h+v]},flattenChunks:function(t){var n,h,s,m,v,l;for(s=0,n=0,h=t.length;n<h;n++)s+=t[n].length;for(l=new Uint8Array(s),m=0,n=0,h=t.length;n<h;n++)v=t[n],l.set(v,m),m+=v.length;return l}},y={arraySet:function(t,n,h,s,m){for(var v=0;v<s;v++)t[m+v]=n[h+v]},flattenChunks:function(t){return[].concat.apply([],t)}};T.setTyped=function(t){t?(T.Buf8=Uint8Array,T.Buf16=Uint16Array,T.Buf32=Int32Array,T.assign(T,a)):(T.Buf8=Array,T.Buf16=Array,T.Buf32=Array,T.assign(T,y))},T.setTyped(r)})(yr)),yr}var sr={},Xe={},rr={},nt;function $t(){if(nt)return rr;nt=1;var T=$e(),r=4,u=0,a=1,y=2;function t(f){for(var R=f.length;--R>=0;)f[R]=0}var n=0,h=1,s=2,m=3,v=258,l=29,x=256,b=x+1+l,c=30,L=19,M=2*b+1,d=15,g=16,A=7,D=256,O=16,S=17,E=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],G=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],j=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],V=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=512,P=new Array((b+2)*2);t(P);var U=new Array(c*2);t(U);var J=new Array(z);t(J);var W=new Array(v-m+1);t(W);var K=new Array(l);t(K);var Z=new Array(c);t(Z);function te(f,R,N,Y,p){this.static_tree=f,this.extra_bits=R,this.extra_base=N,this.elems=Y,this.max_length=p,this.has_stree=f&&f.length}var de,Ee,be;function ge(f,R){this.dyn_tree=f,this.max_code=0,this.stat_desc=R}function re(f){return f<256?J[f]:J[256+(f>>>7)]}function X(f,R){f.pending_buf[f.pending++]=R&255,f.pending_buf[f.pending++]=R>>>8&255}function Q(f,R,N){f.bi_valid>g-N?(f.bi_buf|=R<<f.bi_valid&65535,X(f,f.bi_buf),f.bi_buf=R>>g-f.bi_valid,f.bi_valid+=N-g):(f.bi_buf|=R<<f.bi_valid&65535,f.bi_valid+=N)}function me(f,R,N){Q(f,N[R*2],N[R*2+1])}function ie(f,R){var N=0;do N|=f&1,f>>>=1,N<<=1;while(--R>0);return N>>>1}function $(f){f.bi_valid===16?(X(f,f.bi_buf),f.bi_buf=0,f.bi_valid=0):f.bi_valid>=8&&(f.pending_buf[f.pending++]=f.bi_buf&255,f.bi_buf>>=8,f.bi_valid-=8)}function Ie(f,R){var N=R.dyn_tree,Y=R.max_code,p=R.stat_desc.static_tree,C=R.stat_desc.has_stree,i=R.stat_desc.extra_bits,H=R.stat_desc.extra_base,Te=R.stat_desc.max_length,e,I,B,o,_,k,xe=0;for(o=0;o<=d;o++)f.bl_count[o]=0;for(N[f.heap[f.heap_max]*2+1]=0,e=f.heap_max+1;e<M;e++)I=f.heap[e],o=N[N[I*2+1]*2+1]+1,o>Te&&(o=Te,xe++),N[I*2+1]=o,!(I>Y)&&(f.bl_count[o]++,_=0,I>=H&&(_=i[I-H]),k=N[I*2],f.opt_len+=k*(o+_),C&&(f.static_len+=k*(p[I*2+1]+_)));if(xe!==0){do{for(o=Te-1;f.bl_count[o]===0;)o--;f.bl_count[o]--,f.bl_count[o+1]+=2,f.bl_count[Te]--,xe-=2}while(xe>0);for(o=Te;o!==0;o--)for(I=f.bl_count[o];I!==0;)B=f.heap[--e],!(B>Y)&&(N[B*2+1]!==o&&(f.opt_len+=(o-N[B*2+1])*N[B*2],N[B*2+1]=o),I--)}}function Se(f,R,N){var Y=new Array(d+1),p=0,C,i;for(C=1;C<=d;C++)Y[C]=p=p+N[C-1]<<1;for(i=0;i<=R;i++){var H=f[i*2+1];H!==0&&(f[i*2]=ie(Y[H]++,H))}}function se(){var f,R,N,Y,p,C=new Array(d+1);for(N=0,Y=0;Y<l-1;Y++)for(K[Y]=N,f=0;f<1<<w[Y];f++)W[N++]=Y;for(W[N-1]=Y,p=0,Y=0;Y<16;Y++)for(Z[Y]=p,f=0;f<1<<G[Y];f++)J[p++]=Y;for(p>>=7;Y<c;Y++)for(Z[Y]=p<<7,f=0;f<1<<G[Y]-7;f++)J[256+p++]=Y;for(R=0;R<=d;R++)C[R]=0;for(f=0;f<=143;)P[f*2+1]=8,f++,C[8]++;for(;f<=255;)P[f*2+1]=9,f++,C[9]++;for(;f<=279;)P[f*2+1]=7,f++,C[7]++;for(;f<=287;)P[f*2+1]=8,f++,C[8]++;for(Se(P,b+1,C),f=0;f<c;f++)U[f*2+1]=5,U[f*2]=ie(f,5);de=new te(P,w,x+1,b,d),Ee=new te(U,G,0,c,d),be=new te(new Array(0),j,0,L,A)}function we(f){var R;for(R=0;R<b;R++)f.dyn_ltree[R*2]=0;for(R=0;R<c;R++)f.dyn_dtree[R*2]=0;for(R=0;R<L;R++)f.bl_tree[R*2]=0;f.dyn_ltree[D*2]=1,f.opt_len=f.static_len=0,f.last_lit=f.matches=0}function oe(f){f.bi_valid>8?X(f,f.bi_buf):f.bi_valid>0&&(f.pending_buf[f.pending++]=f.bi_buf),f.bi_buf=0,f.bi_valid=0}function q(f,R,N,Y){oe(f),X(f,N),X(f,~N),T.arraySet(f.pending_buf,f.window,R,N,f.pending),f.pending+=N}function ye(f,R,N,Y){var p=R*2,C=N*2;return f[p]<f[C]||f[p]===f[C]&&Y[R]<=Y[N]}function fe(f,R,N){for(var Y=f.heap[N],p=N<<1;p<=f.heap_len&&(p<f.heap_len&&ye(R,f.heap[p+1],f.heap[p],f.depth)&&p++,!ye(R,Y,f.heap[p],f.depth));)f.heap[N]=f.heap[p],N=p,p<<=1;f.heap[N]=Y}function ee(f,R,N){var Y,p,C=0,i,H;if(f.last_lit!==0)do Y=f.pending_buf[f.d_buf+C*2]<<8|f.pending_buf[f.d_buf+C*2+1],p=f.pending_buf[f.l_buf+C],C++,Y===0?me(f,p,R):(i=W[p],me(f,i+x+1,R),H=w[i],H!==0&&(p-=K[i],Q(f,p,H)),Y--,i=re(Y),me(f,i,N),H=G[i],H!==0&&(Y-=Z[i],Q(f,Y,H)));while(C<f.last_lit);me(f,D,R)}function F(f,R){var N=R.dyn_tree,Y=R.stat_desc.static_tree,p=R.stat_desc.has_stree,C=R.stat_desc.elems,i,H,Te=-1,e;for(f.heap_len=0,f.heap_max=M,i=0;i<C;i++)N[i*2]!==0?(f.heap[++f.heap_len]=Te=i,f.depth[i]=0):N[i*2+1]=0;for(;f.heap_len<2;)e=f.heap[++f.heap_len]=Te<2?++Te:0,N[e*2]=1,f.depth[e]=0,f.opt_len--,p&&(f.static_len-=Y[e*2+1]);for(R.max_code=Te,i=f.heap_len>>1;i>=1;i--)fe(f,N,i);e=C;do i=f.heap[1],f.heap[1]=f.heap[f.heap_len--],fe(f,N,1),H=f.heap[1],f.heap[--f.heap_max]=i,f.heap[--f.heap_max]=H,N[e*2]=N[i*2]+N[H*2],f.depth[e]=(f.depth[i]>=f.depth[H]?f.depth[i]:f.depth[H])+1,N[i*2+1]=N[H*2+1]=e,f.heap[1]=e++,fe(f,N,1);while(f.heap_len>=2);f.heap[--f.heap_max]=f.heap[1],Ie(f,R),Se(N,Te,f.bl_count)}function _e(f,R,N){var Y,p=-1,C,i=R[1],H=0,Te=7,e=4;for(i===0&&(Te=138,e=3),R[(N+1)*2+1]=65535,Y=0;Y<=N;Y++)C=i,i=R[(Y+1)*2+1],!(++H<Te&&C===i)&&(H<e?f.bl_tree[C*2]+=H:C!==0?(C!==p&&f.bl_tree[C*2]++,f.bl_tree[O*2]++):H<=10?f.bl_tree[S*2]++:f.bl_tree[E*2]++,H=0,p=C,i===0?(Te=138,e=3):C===i?(Te=6,e=3):(Te=7,e=4))}function ve(f,R,N){var Y,p=-1,C,i=R[1],H=0,Te=7,e=4;for(i===0&&(Te=138,e=3),Y=0;Y<=N;Y++)if(C=i,i=R[(Y+1)*2+1],!(++H<Te&&C===i)){if(H<e)do me(f,C,f.bl_tree);while(--H!==0);else C!==0?(C!==p&&(me(f,C,f.bl_tree),H--),me(f,O,f.bl_tree),Q(f,H-3,2)):H<=10?(me(f,S,f.bl_tree),Q(f,H-3,3)):(me(f,E,f.bl_tree),Q(f,H-11,7));H=0,p=C,i===0?(Te=138,e=3):C===i?(Te=6,e=3):(Te=7,e=4)}}function pe(f){var R;for(_e(f,f.dyn_ltree,f.l_desc.max_code),_e(f,f.dyn_dtree,f.d_desc.max_code),F(f,f.bl_desc),R=L-1;R>=3&&f.bl_tree[V[R]*2+1]===0;R--);return f.opt_len+=3*(R+1)+5+5+4,R}function ke(f,R,N,Y){var p;for(Q(f,R-257,5),Q(f,N-1,5),Q(f,Y-4,4),p=0;p<Y;p++)Q(f,f.bl_tree[V[p]*2+1],3);ve(f,f.dyn_ltree,R-1),ve(f,f.dyn_dtree,N-1)}function Me(f){var R=4093624447,N;for(N=0;N<=31;N++,R>>>=1)if(R&1&&f.dyn_ltree[N*2]!==0)return u;if(f.dyn_ltree[18]!==0||f.dyn_ltree[20]!==0||f.dyn_ltree[26]!==0)return a;for(N=32;N<x;N++)if(f.dyn_ltree[N*2]!==0)return a;return u}var Re=!1;function le(f){Re||(se(),Re=!0),f.l_desc=new ge(f.dyn_ltree,de),f.d_desc=new ge(f.dyn_dtree,Ee),f.bl_desc=new ge(f.bl_tree,be),f.bi_buf=0,f.bi_valid=0,we(f)}function ce(f,R,N,Y){Q(f,(n<<1)+(Y?1:0),3),q(f,R,N)}function he(f){Q(f,h<<1,3),me(f,D,P),$(f)}function ae(f,R,N,Y){var p,C,i=0;f.level>0?(f.strm.data_type===y&&(f.strm.data_type=Me(f)),F(f,f.l_desc),F(f,f.d_desc),i=pe(f),p=f.opt_len+3+7>>>3,C=f.static_len+3+7>>>3,C<=p&&(p=C)):p=C=N+5,N+4<=p&&R!==-1?ce(f,R,N,Y):f.strategy===r||C===p?(Q(f,(h<<1)+(Y?1:0),3),ee(f,P,U)):(Q(f,(s<<1)+(Y?1:0),3),ke(f,f.l_desc.max_code+1,f.d_desc.max_code+1,i+1),ee(f,f.dyn_ltree,f.dyn_dtree)),we(f),Y&&oe(f)}function Ae(f,R,N){return f.pending_buf[f.d_buf+f.last_lit*2]=R>>>8&255,f.pending_buf[f.d_buf+f.last_lit*2+1]=R&255,f.pending_buf[f.l_buf+f.last_lit]=N&255,f.last_lit++,R===0?f.dyn_ltree[N*2]++:(f.matches++,R--,f.dyn_ltree[(W[N]+x+1)*2]++,f.dyn_dtree[re(R)*2]++),f.last_lit===f.lit_bufsize-1}return rr._tr_init=le,rr._tr_stored_block=ce,rr._tr_flush_block=ae,rr._tr_tally=Ae,rr._tr_align=he,rr}var Er,at;function St(){if(at)return Er;at=1;function T(r,u,a,y){for(var t=r&65535|0,n=r>>>16&65535|0,h=0;a!==0;){h=a>2e3?2e3:a,a-=h;do t=t+u[y++]|0,n=n+t|0;while(--h);t%=65521,n%=65521}return t|n<<16|0}return Er=T,Er}var Sr,it;function At(){if(it)return Sr;it=1;function T(){for(var a,y=[],t=0;t<256;t++){a=t;for(var n=0;n<8;n++)a=a&1?3988292384^a>>>1:a>>>1;y[t]=a}return y}var r=T();function u(a,y,t,n){var h=r,s=n+t;a^=-1;for(var m=n;m<s;m++)a=a>>>8^h[(a^y[m])&255];return a^-1}return Sr=u,Sr}var Ar,st;function jr(){return st||(st=1,Ar={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}),Ar}var ot;function Jt(){if(ot)return Xe;ot=1;var T=$e(),r=$t(),u=St(),a=At(),y=jr(),t=0,n=1,h=3,s=4,m=5,v=0,l=1,x=-2,b=-3,c=-5,L=-1,M=1,d=2,g=3,A=4,D=0,O=2,S=8,E=9,w=15,G=8,j=29,V=256,z=V+1+j,P=30,U=19,J=2*z+1,W=15,K=3,Z=258,te=Z+K+1,de=32,Ee=42,be=69,ge=73,re=91,X=103,Q=113,me=666,ie=1,$=2,Ie=3,Se=4,se=3;function we(e,I){return e.msg=y[I],I}function oe(e){return(e<<1)-(e>4?9:0)}function q(e){for(var I=e.length;--I>=0;)e[I]=0}function ye(e){var I=e.state,B=I.pending;B>e.avail_out&&(B=e.avail_out),B!==0&&(T.arraySet(e.output,I.pending_buf,I.pending_out,B,e.next_out),e.next_out+=B,I.pending_out+=B,e.total_out+=B,e.avail_out-=B,I.pending-=B,I.pending===0&&(I.pending_out=0))}function fe(e,I){r._tr_flush_block(e,e.block_start>=0?e.block_start:-1,e.strstart-e.block_start,I),e.block_start=e.strstart,ye(e.strm)}function ee(e,I){e.pending_buf[e.pending++]=I}function F(e,I){e.pending_buf[e.pending++]=I>>>8&255,e.pending_buf[e.pending++]=I&255}function _e(e,I,B,o){var _=e.avail_in;return _>o&&(_=o),_===0?0:(e.avail_in-=_,T.arraySet(I,e.input,e.next_in,_,B),e.state.wrap===1?e.adler=u(e.adler,I,_,B):e.state.wrap===2&&(e.adler=a(e.adler,I,_,B)),e.next_in+=_,e.total_in+=_,_)}function ve(e,I){var B=e.max_chain_length,o=e.strstart,_,k,xe=e.prev_length,ne=e.nice_match,ue=e.strstart>e.w_size-te?e.strstart-(e.w_size-te):0,Fe=e.window,He=e.w_mask,Be=e.prev,Ce=e.strstart+Z,Le=Fe[o+xe-1],Ne=Fe[o+xe];e.prev_length>=e.good_match&&(B>>=2),ne>e.lookahead&&(ne=e.lookahead);do if(_=I,!(Fe[_+xe]!==Ne||Fe[_+xe-1]!==Le||Fe[_]!==Fe[o]||Fe[++_]!==Fe[o+1])){o+=2,_++;do;while(Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&Fe[++o]===Fe[++_]&&o<Ce);if(k=Z-(Ce-o),o=Ce-Z,k>xe){if(e.match_start=I,xe=k,k>=ne)break;Le=Fe[o+xe-1],Ne=Fe[o+xe]}}while((I=Be[I&He])>ue&&--B!==0);return xe<=e.lookahead?xe:e.lookahead}function pe(e){var I=e.w_size,B,o,_,k,xe;do{if(k=e.window_size-e.lookahead-e.strstart,e.strstart>=I+(I-te)){T.arraySet(e.window,e.window,I,I,0),e.match_start-=I,e.strstart-=I,e.block_start-=I,o=e.hash_size,B=o;do _=e.head[--B],e.head[B]=_>=I?_-I:0;while(--o);o=I,B=o;do _=e.prev[--B],e.prev[B]=_>=I?_-I:0;while(--o);k+=I}if(e.strm.avail_in===0)break;if(o=_e(e.strm,e.window,e.strstart+e.lookahead,k),e.lookahead+=o,e.lookahead+e.insert>=K)for(xe=e.strstart-e.insert,e.ins_h=e.window[xe],e.ins_h=(e.ins_h<<e.hash_shift^e.window[xe+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[xe+K-1])&e.hash_mask,e.prev[xe&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=xe,xe++,e.insert--,!(e.lookahead+e.insert<K)););}while(e.lookahead<te&&e.strm.avail_in!==0)}function ke(e,I){var B=65535;for(B>e.pending_buf_size-5&&(B=e.pending_buf_size-5);;){if(e.lookahead<=1){if(pe(e),e.lookahead===0&&I===t)return ie;if(e.lookahead===0)break}e.strstart+=e.lookahead,e.lookahead=0;var o=e.block_start+B;if((e.strstart===0||e.strstart>=o)&&(e.lookahead=e.strstart-o,e.strstart=o,fe(e,!1),e.strm.avail_out===0)||e.strstart-e.block_start>=e.w_size-te&&(fe(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,I===s?(fe(e,!0),e.strm.avail_out===0?Ie:Se):(e.strstart>e.block_start&&(fe(e,!1),e.strm.avail_out===0),ie)}function Me(e,I){for(var B,o;;){if(e.lookahead<te){if(pe(e),e.lookahead<te&&I===t)return ie;if(e.lookahead===0)break}if(B=0,e.lookahead>=K&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,B=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),B!==0&&e.strstart-B<=e.w_size-te&&(e.match_length=ve(e,B)),e.match_length>=K)if(o=r._tr_tally(e,e.strstart-e.match_start,e.match_length-K),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=K){e.match_length--;do e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,B=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart;while(--e.match_length!==0);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else o=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(o&&(fe(e,!1),e.strm.avail_out===0))return ie}return e.insert=e.strstart<K-1?e.strstart:K-1,I===s?(fe(e,!0),e.strm.avail_out===0?Ie:Se):e.last_lit&&(fe(e,!1),e.strm.avail_out===0)?ie:$}function Re(e,I){for(var B,o,_;;){if(e.lookahead<te){if(pe(e),e.lookahead<te&&I===t)return ie;if(e.lookahead===0)break}if(B=0,e.lookahead>=K&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,B=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=K-1,B!==0&&e.prev_length<e.max_lazy_match&&e.strstart-B<=e.w_size-te&&(e.match_length=ve(e,B),e.match_length<=5&&(e.strategy===M||e.match_length===K&&e.strstart-e.match_start>4096)&&(e.match_length=K-1)),e.prev_length>=K&&e.match_length<=e.prev_length){_=e.strstart+e.lookahead-K,o=r._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-K),e.lookahead-=e.prev_length-1,e.prev_length-=2;do++e.strstart<=_&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+K-1])&e.hash_mask,B=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart);while(--e.prev_length!==0);if(e.match_available=0,e.match_length=K-1,e.strstart++,o&&(fe(e,!1),e.strm.avail_out===0))return ie}else if(e.match_available){if(o=r._tr_tally(e,0,e.window[e.strstart-1]),o&&fe(e,!1),e.strstart++,e.lookahead--,e.strm.avail_out===0)return ie}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(o=r._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<K-1?e.strstart:K-1,I===s?(fe(e,!0),e.strm.avail_out===0?Ie:Se):e.last_lit&&(fe(e,!1),e.strm.avail_out===0)?ie:$}function le(e,I){for(var B,o,_,k,xe=e.window;;){if(e.lookahead<=Z){if(pe(e),e.lookahead<=Z&&I===t)return ie;if(e.lookahead===0)break}if(e.match_length=0,e.lookahead>=K&&e.strstart>0&&(_=e.strstart-1,o=xe[_],o===xe[++_]&&o===xe[++_]&&o===xe[++_])){k=e.strstart+Z;do;while(o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&o===xe[++_]&&_<k);e.match_length=Z-(k-_),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=K?(B=r._tr_tally(e,1,e.match_length-K),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(B=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),B&&(fe(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,I===s?(fe(e,!0),e.strm.avail_out===0?Ie:Se):e.last_lit&&(fe(e,!1),e.strm.avail_out===0)?ie:$}function ce(e,I){for(var B;;){if(e.lookahead===0&&(pe(e),e.lookahead===0)){if(I===t)return ie;break}if(e.match_length=0,B=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,B&&(fe(e,!1),e.strm.avail_out===0))return ie}return e.insert=0,I===s?(fe(e,!0),e.strm.avail_out===0?Ie:Se):e.last_lit&&(fe(e,!1),e.strm.avail_out===0)?ie:$}function he(e,I,B,o,_){this.good_length=e,this.max_lazy=I,this.nice_length=B,this.max_chain=o,this.func=_}var ae;ae=[new he(0,0,0,0,ke),new he(4,4,8,4,Me),new he(4,5,16,8,Me),new he(4,6,32,32,Me),new he(4,4,16,16,Re),new he(8,16,32,32,Re),new he(8,16,128,128,Re),new he(8,32,128,256,Re),new he(32,128,258,1024,Re),new he(32,258,258,4096,Re)];function Ae(e){e.window_size=2*e.w_size,q(e.head),e.max_lazy_match=ae[e.level].max_lazy,e.good_match=ae[e.level].good_length,e.nice_match=ae[e.level].nice_length,e.max_chain_length=ae[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=K-1,e.match_available=0,e.ins_h=0}function f(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=S,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new T.Buf16(J*2),this.dyn_dtree=new T.Buf16((2*P+1)*2),this.bl_tree=new T.Buf16((2*U+1)*2),q(this.dyn_ltree),q(this.dyn_dtree),q(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new T.Buf16(W+1),this.heap=new T.Buf16(2*z+1),q(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new T.Buf16(2*z+1),q(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function R(e){var I;return!e||!e.state?we(e,x):(e.total_in=e.total_out=0,e.data_type=O,I=e.state,I.pending=0,I.pending_out=0,I.wrap<0&&(I.wrap=-I.wrap),I.status=I.wrap?Ee:Q,e.adler=I.wrap===2?0:1,I.last_flush=t,r._tr_init(I),v)}function N(e){var I=R(e);return I===v&&Ae(e.state),I}function Y(e,I){return!e||!e.state||e.state.wrap!==2?x:(e.state.gzhead=I,v)}function p(e,I,B,o,_,k){if(!e)return x;var xe=1;if(I===L&&(I=6),o<0?(xe=0,o=-o):o>15&&(xe=2,o-=16),_<1||_>E||B!==S||o<8||o>15||I<0||I>9||k<0||k>A)return we(e,x);o===8&&(o=9);var ne=new f;return e.state=ne,ne.strm=e,ne.wrap=xe,ne.gzhead=null,ne.w_bits=o,ne.w_size=1<<ne.w_bits,ne.w_mask=ne.w_size-1,ne.hash_bits=_+7,ne.hash_size=1<<ne.hash_bits,ne.hash_mask=ne.hash_size-1,ne.hash_shift=~~((ne.hash_bits+K-1)/K),ne.window=new T.Buf8(ne.w_size*2),ne.head=new T.Buf16(ne.hash_size),ne.prev=new T.Buf16(ne.w_size),ne.lit_bufsize=1<<_+6,ne.pending_buf_size=ne.lit_bufsize*4,ne.pending_buf=new T.Buf8(ne.pending_buf_size),ne.d_buf=1*ne.lit_bufsize,ne.l_buf=3*ne.lit_bufsize,ne.level=I,ne.strategy=k,ne.method=B,N(e)}function C(e,I){return p(e,I,S,w,G,D)}function i(e,I){var B,o,_,k;if(!e||!e.state||I>m||I<0)return e?we(e,x):x;if(o=e.state,!e.output||!e.input&&e.avail_in!==0||o.status===me&&I!==s)return we(e,e.avail_out===0?c:x);if(o.strm=e,B=o.last_flush,o.last_flush=I,o.status===Ee)if(o.wrap===2)e.adler=0,ee(o,31),ee(o,139),ee(o,8),o.gzhead?(ee(o,(o.gzhead.text?1:0)+(o.gzhead.hcrc?2:0)+(o.gzhead.extra?4:0)+(o.gzhead.name?8:0)+(o.gzhead.comment?16:0)),ee(o,o.gzhead.time&255),ee(o,o.gzhead.time>>8&255),ee(o,o.gzhead.time>>16&255),ee(o,o.gzhead.time>>24&255),ee(o,o.level===9?2:o.strategy>=d||o.level<2?4:0),ee(o,o.gzhead.os&255),o.gzhead.extra&&o.gzhead.extra.length&&(ee(o,o.gzhead.extra.length&255),ee(o,o.gzhead.extra.length>>8&255)),o.gzhead.hcrc&&(e.adler=a(e.adler,o.pending_buf,o.pending,0)),o.gzindex=0,o.status=be):(ee(o,0),ee(o,0),ee(o,0),ee(o,0),ee(o,0),ee(o,o.level===9?2:o.strategy>=d||o.level<2?4:0),ee(o,se),o.status=Q);else{var xe=S+(o.w_bits-8<<4)<<8,ne=-1;o.strategy>=d||o.level<2?ne=0:o.level<6?ne=1:o.level===6?ne=2:ne=3,xe|=ne<<6,o.strstart!==0&&(xe|=de),xe+=31-xe%31,o.status=Q,F(o,xe),o.strstart!==0&&(F(o,e.adler>>>16),F(o,e.adler&65535)),e.adler=1}if(o.status===be)if(o.gzhead.extra){for(_=o.pending;o.gzindex<(o.gzhead.extra.length&65535)&&!(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>_&&(e.adler=a(e.adler,o.pending_buf,o.pending-_,_)),ye(e),_=o.pending,o.pending===o.pending_buf_size));)ee(o,o.gzhead.extra[o.gzindex]&255),o.gzindex++;o.gzhead.hcrc&&o.pending>_&&(e.adler=a(e.adler,o.pending_buf,o.pending-_,_)),o.gzindex===o.gzhead.extra.length&&(o.gzindex=0,o.status=ge)}else o.status=ge;if(o.status===ge)if(o.gzhead.name){_=o.pending;do{if(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>_&&(e.adler=a(e.adler,o.pending_buf,o.pending-_,_)),ye(e),_=o.pending,o.pending===o.pending_buf_size)){k=1;break}o.gzindex<o.gzhead.name.length?k=o.gzhead.name.charCodeAt(o.gzindex++)&255:k=0,ee(o,k)}while(k!==0);o.gzhead.hcrc&&o.pending>_&&(e.adler=a(e.adler,o.pending_buf,o.pending-_,_)),k===0&&(o.gzindex=0,o.status=re)}else o.status=re;if(o.status===re)if(o.gzhead.comment){_=o.pending;do{if(o.pending===o.pending_buf_size&&(o.gzhead.hcrc&&o.pending>_&&(e.adler=a(e.adler,o.pending_buf,o.pending-_,_)),ye(e),_=o.pending,o.pending===o.pending_buf_size)){k=1;break}o.gzindex<o.gzhead.comment.length?k=o.gzhead.comment.charCodeAt(o.gzindex++)&255:k=0,ee(o,k)}while(k!==0);o.gzhead.hcrc&&o.pending>_&&(e.adler=a(e.adler,o.pending_buf,o.pending-_,_)),k===0&&(o.status=X)}else o.status=X;if(o.status===X&&(o.gzhead.hcrc?(o.pending+2>o.pending_buf_size&&ye(e),o.pending+2<=o.pending_buf_size&&(ee(o,e.adler&255),ee(o,e.adler>>8&255),e.adler=0,o.status=Q)):o.status=Q),o.pending!==0){if(ye(e),e.avail_out===0)return o.last_flush=-1,v}else if(e.avail_in===0&&oe(I)<=oe(B)&&I!==s)return we(e,c);if(o.status===me&&e.avail_in!==0)return we(e,c);if(e.avail_in!==0||o.lookahead!==0||I!==t&&o.status!==me){var ue=o.strategy===d?ce(o,I):o.strategy===g?le(o,I):ae[o.level].func(o,I);if((ue===Ie||ue===Se)&&(o.status=me),ue===ie||ue===Ie)return e.avail_out===0&&(o.last_flush=-1),v;if(ue===$&&(I===n?r._tr_align(o):I!==m&&(r._tr_stored_block(o,0,0,!1),I===h&&(q(o.head),o.lookahead===0&&(o.strstart=0,o.block_start=0,o.insert=0))),ye(e),e.avail_out===0))return o.last_flush=-1,v}return I!==s?v:o.wrap<=0?l:(o.wrap===2?(ee(o,e.adler&255),ee(o,e.adler>>8&255),ee(o,e.adler>>16&255),ee(o,e.adler>>24&255),ee(o,e.total_in&255),ee(o,e.total_in>>8&255),ee(o,e.total_in>>16&255),ee(o,e.total_in>>24&255)):(F(o,e.adler>>>16),F(o,e.adler&65535)),ye(e),o.wrap>0&&(o.wrap=-o.wrap),o.pending!==0?v:l)}function H(e){var I;return!e||!e.state?x:(I=e.state.status,I!==Ee&&I!==be&&I!==ge&&I!==re&&I!==X&&I!==Q&&I!==me?we(e,x):(e.state=null,I===Q?we(e,b):v))}function Te(e,I){var B=I.length,o,_,k,xe,ne,ue,Fe,He;if(!e||!e.state||(o=e.state,xe=o.wrap,xe===2||xe===1&&o.status!==Ee||o.lookahead))return x;for(xe===1&&(e.adler=u(e.adler,I,B,0)),o.wrap=0,B>=o.w_size&&(xe===0&&(q(o.head),o.strstart=0,o.block_start=0,o.insert=0),He=new T.Buf8(o.w_size),T.arraySet(He,I,B-o.w_size,o.w_size,0),I=He,B=o.w_size),ne=e.avail_in,ue=e.next_in,Fe=e.input,e.avail_in=B,e.next_in=0,e.input=I,pe(o);o.lookahead>=K;){_=o.strstart,k=o.lookahead-(K-1);do o.ins_h=(o.ins_h<<o.hash_shift^o.window[_+K-1])&o.hash_mask,o.prev[_&o.w_mask]=o.head[o.ins_h],o.head[o.ins_h]=_,_++;while(--k);o.strstart=_,o.lookahead=K-1,pe(o)}return o.strstart+=o.lookahead,o.block_start=o.strstart,o.insert=o.lookahead,o.lookahead=0,o.match_length=o.prev_length=K-1,o.match_available=0,e.next_in=ue,e.input=Fe,e.avail_in=ne,o.wrap=xe,v}return Xe.deflateInit=C,Xe.deflateInit2=p,Xe.deflateReset=N,Xe.deflateResetKeep=R,Xe.deflateSetHeader=Y,Xe.deflate=i,Xe.deflateEnd=H,Xe.deflateSetDictionary=Te,Xe.deflateInfo="pako deflate (from Nodeca project)",Xe}var tr={},ft;function kt(){if(ft)return tr;ft=1;var T=$e(),r=!0,u=!0;try{String.fromCharCode.apply(null,[0])}catch{r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{u=!1}for(var a=new T.Buf8(256),y=0;y<256;y++)a[y]=y>=252?6:y>=248?5:y>=240?4:y>=224?3:y>=192?2:1;a[254]=a[254]=1,tr.string2buf=function(n){var h,s,m,v,l,x=n.length,b=0;for(v=0;v<x;v++)s=n.charCodeAt(v),(s&64512)===55296&&v+1<x&&(m=n.charCodeAt(v+1),(m&64512)===56320&&(s=65536+(s-55296<<10)+(m-56320),v++)),b+=s<128?1:s<2048?2:s<65536?3:4;for(h=new T.Buf8(b),l=0,v=0;l<b;v++)s=n.charCodeAt(v),(s&64512)===55296&&v+1<x&&(m=n.charCodeAt(v+1),(m&64512)===56320&&(s=65536+(s-55296<<10)+(m-56320),v++)),s<128?h[l++]=s:s<2048?(h[l++]=192|s>>>6,h[l++]=128|s&63):s<65536?(h[l++]=224|s>>>12,h[l++]=128|s>>>6&63,h[l++]=128|s&63):(h[l++]=240|s>>>18,h[l++]=128|s>>>12&63,h[l++]=128|s>>>6&63,h[l++]=128|s&63);return h};function t(n,h){if(h<65534&&(n.subarray&&u||!n.subarray&&r))return String.fromCharCode.apply(null,T.shrinkBuf(n,h));for(var s="",m=0;m<h;m++)s+=String.fromCharCode(n[m]);return s}return tr.buf2binstring=function(n){return t(n,n.length)},tr.binstring2buf=function(n){for(var h=new T.Buf8(n.length),s=0,m=h.length;s<m;s++)h[s]=n.charCodeAt(s);return h},tr.buf2string=function(n,h){var s,m,v,l,x=h||n.length,b=new Array(x*2);for(m=0,s=0;s<x;){if(v=n[s++],v<128){b[m++]=v;continue}if(l=a[v],l>4){b[m++]=65533,s+=l-1;continue}for(v&=l===2?31:l===3?15:7;l>1&&s<x;)v=v<<6|n[s++]&63,l--;if(l>1){b[m++]=65533;continue}v<65536?b[m++]=v:(v-=65536,b[m++]=55296|v>>10&1023,b[m++]=56320|v&1023)}return t(b,m)},tr.utf8border=function(n,h){var s;for(h=h||n.length,h>n.length&&(h=n.length),s=h-1;s>=0&&(n[s]&192)===128;)s--;return s<0||s===0?h:s+a[n[s]]>h?s:h},tr}var kr,lt;function It(){if(lt)return kr;lt=1;function T(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}return kr=T,kr}var ut;function Qt(){if(ut)return sr;ut=1;var T=Jt(),r=$e(),u=kt(),a=jr(),y=It(),t=Object.prototype.toString,n=0,h=4,s=0,m=1,v=2,l=-1,x=0,b=8;function c(g){if(!(this instanceof c))return new c(g);this.options=r.assign({level:l,method:b,chunkSize:16384,windowBits:15,memLevel:8,strategy:x,to:""},g||{});var A=this.options;A.raw&&A.windowBits>0?A.windowBits=-A.windowBits:A.gzip&&A.windowBits>0&&A.windowBits<16&&(A.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new y,this.strm.avail_out=0;var D=T.deflateInit2(this.strm,A.level,A.method,A.windowBits,A.memLevel,A.strategy);if(D!==s)throw new Error(a[D]);if(A.header&&T.deflateSetHeader(this.strm,A.header),A.dictionary){var O;if(typeof A.dictionary=="string"?O=u.string2buf(A.dictionary):t.call(A.dictionary)==="[object ArrayBuffer]"?O=new Uint8Array(A.dictionary):O=A.dictionary,D=T.deflateSetDictionary(this.strm,O),D!==s)throw new Error(a[D]);this._dict_set=!0}}c.prototype.push=function(g,A){var D=this.strm,O=this.options.chunkSize,S,E;if(this.ended)return!1;E=A===~~A?A:A===!0?h:n,typeof g=="string"?D.input=u.string2buf(g):t.call(g)==="[object ArrayBuffer]"?D.input=new Uint8Array(g):D.input=g,D.next_in=0,D.avail_in=D.input.length;do{if(D.avail_out===0&&(D.output=new r.Buf8(O),D.next_out=0,D.avail_out=O),S=T.deflate(D,E),S!==m&&S!==s)return this.onEnd(S),this.ended=!0,!1;(D.avail_out===0||D.avail_in===0&&(E===h||E===v))&&(this.options.to==="string"?this.onData(u.buf2binstring(r.shrinkBuf(D.output,D.next_out))):this.onData(r.shrinkBuf(D.output,D.next_out)))}while((D.avail_in>0||D.avail_out===0)&&S!==m);return E===h?(S=T.deflateEnd(this.strm),this.onEnd(S),this.ended=!0,S===s):(E===v&&(this.onEnd(s),D.avail_out=0),!0)},c.prototype.onData=function(g){this.chunks.push(g)},c.prototype.onEnd=function(g){g===s&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=g,this.msg=this.strm.msg};function L(g,A){var D=new c(A);if(D.push(g,!0),D.err)throw D.msg||a[D.err];return D.result}function M(g,A){return A=A||{},A.raw=!0,L(g,A)}function d(g,A){return A=A||{},A.gzip=!0,L(g,A)}return sr.Deflate=c,sr.deflate=L,sr.deflateRaw=M,sr.gzip=d,sr}var or={},Ye={},Ir,ct;function en(){if(ct)return Ir;ct=1;var T=30,r=12;return Ir=function(a,y){var t,n,h,s,m,v,l,x,b,c,L,M,d,g,A,D,O,S,E,w,G,j,V,z,P;t=a.state,n=a.next_in,z=a.input,h=n+(a.avail_in-5),s=a.next_out,P=a.output,m=s-(y-a.avail_out),v=s+(a.avail_out-257),l=t.dmax,x=t.wsize,b=t.whave,c=t.wnext,L=t.window,M=t.hold,d=t.bits,g=t.lencode,A=t.distcode,D=(1<<t.lenbits)-1,O=(1<<t.distbits)-1;e:do{d<15&&(M+=z[n++]<<d,d+=8,M+=z[n++]<<d,d+=8),S=g[M&D];r:for(;;){if(E=S>>>24,M>>>=E,d-=E,E=S>>>16&255,E===0)P[s++]=S&65535;else if(E&16){w=S&65535,E&=15,E&&(d<E&&(M+=z[n++]<<d,d+=8),w+=M&(1<<E)-1,M>>>=E,d-=E),d<15&&(M+=z[n++]<<d,d+=8,M+=z[n++]<<d,d+=8),S=A[M&O];t:for(;;){if(E=S>>>24,M>>>=E,d-=E,E=S>>>16&255,E&16){if(G=S&65535,E&=15,d<E&&(M+=z[n++]<<d,d+=8,d<E&&(M+=z[n++]<<d,d+=8)),G+=M&(1<<E)-1,G>l){a.msg="invalid distance too far back",t.mode=T;break e}if(M>>>=E,d-=E,E=s-m,G>E){if(E=G-E,E>b&&t.sane){a.msg="invalid distance too far back",t.mode=T;break e}if(j=0,V=L,c===0){if(j+=x-E,E<w){w-=E;do P[s++]=L[j++];while(--E);j=s-G,V=P}}else if(c<E){if(j+=x+c-E,E-=c,E<w){w-=E;do P[s++]=L[j++];while(--E);if(j=0,c<w){E=c,w-=E;do P[s++]=L[j++];while(--E);j=s-G,V=P}}}else if(j+=c-E,E<w){w-=E;do P[s++]=L[j++];while(--E);j=s-G,V=P}for(;w>2;)P[s++]=V[j++],P[s++]=V[j++],P[s++]=V[j++],w-=3;w&&(P[s++]=V[j++],w>1&&(P[s++]=V[j++]))}else{j=s-G;do P[s++]=P[j++],P[s++]=P[j++],P[s++]=P[j++],w-=3;while(w>2);w&&(P[s++]=P[j++],w>1&&(P[s++]=P[j++]))}}else if((E&64)===0){S=A[(S&65535)+(M&(1<<E)-1)];continue t}else{a.msg="invalid distance code",t.mode=T;break e}break}}else if((E&64)===0){S=g[(S&65535)+(M&(1<<E)-1)];continue r}else if(E&32){t.mode=r;break e}else{a.msg="invalid literal/length code",t.mode=T;break e}break}}while(n<h&&s<v);w=d>>3,n-=w,d-=w<<3,M&=(1<<d)-1,a.next_in=n,a.next_out=s,a.avail_in=n<h?5+(h-n):5-(n-h),a.avail_out=s<v?257+(v-s):257-(s-v),t.hold=M,t.bits=d},Ir}var Rr,ht;function rn(){if(ht)return Rr;ht=1;var T=$e(),r=15,u=852,a=592,y=0,t=1,n=2,h=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],s=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],m=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],v=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];return Rr=function(x,b,c,L,M,d,g,A){var D=A.bits,O=0,S=0,E=0,w=0,G=0,j=0,V=0,z=0,P=0,U=0,J,W,K,Z,te,de=null,Ee=0,be,ge=new T.Buf16(r+1),re=new T.Buf16(r+1),X=null,Q=0,me,ie,$;for(O=0;O<=r;O++)ge[O]=0;for(S=0;S<L;S++)ge[b[c+S]]++;for(G=D,w=r;w>=1&&ge[w]===0;w--);if(G>w&&(G=w),w===0)return M[d++]=1<<24|64<<16|0,M[d++]=1<<24|64<<16|0,A.bits=1,0;for(E=1;E<w&&ge[E]===0;E++);for(G<E&&(G=E),z=1,O=1;O<=r;O++)if(z<<=1,z-=ge[O],z<0)return-1;if(z>0&&(x===y||w!==1))return-1;for(re[1]=0,O=1;O<r;O++)re[O+1]=re[O]+ge[O];for(S=0;S<L;S++)b[c+S]!==0&&(g[re[b[c+S]]++]=S);if(x===y?(de=X=g,be=19):x===t?(de=h,Ee-=257,X=s,Q-=257,be=256):(de=m,X=v,be=-1),U=0,S=0,O=E,te=d,j=G,V=0,K=-1,P=1<<G,Z=P-1,x===t&&P>u||x===n&&P>a)return 1;for(;;){me=O-V,g[S]<be?(ie=0,$=g[S]):g[S]>be?(ie=X[Q+g[S]],$=de[Ee+g[S]]):(ie=96,$=0),J=1<<O-V,W=1<<j,E=W;do W-=J,M[te+(U>>V)+W]=me<<24|ie<<16|$|0;while(W!==0);for(J=1<<O-1;U&J;)J>>=1;if(J!==0?(U&=J-1,U+=J):U=0,S++,--ge[O]===0){if(O===w)break;O=b[c+g[S]]}if(O>G&&(U&Z)!==K){for(V===0&&(V=G),te+=E,j=O-V,z=1<<j;j+V<w&&(z-=ge[j+V],!(z<=0));)j++,z<<=1;if(P+=1<<j,x===t&&P>u||x===n&&P>a)return 1;K=U&Z,M[K]=G<<24|j<<16|te-d|0}}return U!==0&&(M[te+U]=O-V<<24|64<<16|0),A.bits=G,0},Rr}var dt;function tn(){if(dt)return Ye;dt=1;var T=$e(),r=St(),u=At(),a=en(),y=rn(),t=0,n=1,h=2,s=4,m=5,v=6,l=0,x=1,b=2,c=-2,L=-3,M=-4,d=-5,g=8,A=1,D=2,O=3,S=4,E=5,w=6,G=7,j=8,V=9,z=10,P=11,U=12,J=13,W=14,K=15,Z=16,te=17,de=18,Ee=19,be=20,ge=21,re=22,X=23,Q=24,me=25,ie=26,$=27,Ie=28,Se=29,se=30,we=31,oe=32,q=852,ye=592,fe=15,ee=fe;function F(p){return(p>>>24&255)+(p>>>8&65280)+((p&65280)<<8)+((p&255)<<24)}function _e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new T.Buf16(320),this.work=new T.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function ve(p){var C;return!p||!p.state?c:(C=p.state,p.total_in=p.total_out=C.total=0,p.msg="",C.wrap&&(p.adler=C.wrap&1),C.mode=A,C.last=0,C.havedict=0,C.dmax=32768,C.head=null,C.hold=0,C.bits=0,C.lencode=C.lendyn=new T.Buf32(q),C.distcode=C.distdyn=new T.Buf32(ye),C.sane=1,C.back=-1,l)}function pe(p){var C;return!p||!p.state?c:(C=p.state,C.wsize=0,C.whave=0,C.wnext=0,ve(p))}function ke(p,C){var i,H;return!p||!p.state||(H=p.state,C<0?(i=0,C=-C):(i=(C>>4)+1,C<48&&(C&=15)),C&&(C<8||C>15))?c:(H.window!==null&&H.wbits!==C&&(H.window=null),H.wrap=i,H.wbits=C,pe(p))}function Me(p,C){var i,H;return p?(H=new _e,p.state=H,H.window=null,i=ke(p,C),i!==l&&(p.state=null),i):c}function Re(p){return Me(p,ee)}var le=!0,ce,he;function ae(p){if(le){var C;for(ce=new T.Buf32(512),he=new T.Buf32(32),C=0;C<144;)p.lens[C++]=8;for(;C<256;)p.lens[C++]=9;for(;C<280;)p.lens[C++]=7;for(;C<288;)p.lens[C++]=8;for(y(n,p.lens,0,288,ce,0,p.work,{bits:9}),C=0;C<32;)p.lens[C++]=5;y(h,p.lens,0,32,he,0,p.work,{bits:5}),le=!1}p.lencode=ce,p.lenbits=9,p.distcode=he,p.distbits=5}function Ae(p,C,i,H){var Te,e=p.state;return e.window===null&&(e.wsize=1<<e.wbits,e.wnext=0,e.whave=0,e.window=new T.Buf8(e.wsize)),H>=e.wsize?(T.arraySet(e.window,C,i-e.wsize,e.wsize,0),e.wnext=0,e.whave=e.wsize):(Te=e.wsize-e.wnext,Te>H&&(Te=H),T.arraySet(e.window,C,i-H,Te,e.wnext),H-=Te,H?(T.arraySet(e.window,C,i-H,H,0),e.wnext=H,e.whave=e.wsize):(e.wnext+=Te,e.wnext===e.wsize&&(e.wnext=0),e.whave<e.wsize&&(e.whave+=Te))),0}function f(p,C){var i,H,Te,e,I,B,o,_,k,xe,ne,ue,Fe,He,Be=0,Ce,Le,Ne,ze,Je,Qe,De,Ge,Oe=new T.Buf8(4),Ve,je,er=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!p||!p.state||!p.output||!p.input&&p.avail_in!==0)return c;i=p.state,i.mode===U&&(i.mode=J),I=p.next_out,Te=p.output,o=p.avail_out,e=p.next_in,H=p.input,B=p.avail_in,_=i.hold,k=i.bits,xe=B,ne=o,Ge=l;e:for(;;)switch(i.mode){case A:if(i.wrap===0){i.mode=J;break}for(;k<16;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if(i.wrap&2&&_===35615){i.check=0,Oe[0]=_&255,Oe[1]=_>>>8&255,i.check=u(i.check,Oe,2,0),_=0,k=0,i.mode=D;break}if(i.flags=0,i.head&&(i.head.done=!1),!(i.wrap&1)||(((_&255)<<8)+(_>>8))%31){p.msg="incorrect header check",i.mode=se;break}if((_&15)!==g){p.msg="unknown compression method",i.mode=se;break}if(_>>>=4,k-=4,De=(_&15)+8,i.wbits===0)i.wbits=De;else if(De>i.wbits){p.msg="invalid window size",i.mode=se;break}i.dmax=1<<De,p.adler=i.check=1,i.mode=_&512?z:U,_=0,k=0;break;case D:for(;k<16;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if(i.flags=_,(i.flags&255)!==g){p.msg="unknown compression method",i.mode=se;break}if(i.flags&57344){p.msg="unknown header flags set",i.mode=se;break}i.head&&(i.head.text=_>>8&1),i.flags&512&&(Oe[0]=_&255,Oe[1]=_>>>8&255,i.check=u(i.check,Oe,2,0)),_=0,k=0,i.mode=O;case O:for(;k<32;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}i.head&&(i.head.time=_),i.flags&512&&(Oe[0]=_&255,Oe[1]=_>>>8&255,Oe[2]=_>>>16&255,Oe[3]=_>>>24&255,i.check=u(i.check,Oe,4,0)),_=0,k=0,i.mode=S;case S:for(;k<16;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}i.head&&(i.head.xflags=_&255,i.head.os=_>>8),i.flags&512&&(Oe[0]=_&255,Oe[1]=_>>>8&255,i.check=u(i.check,Oe,2,0)),_=0,k=0,i.mode=E;case E:if(i.flags&1024){for(;k<16;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}i.length=_,i.head&&(i.head.extra_len=_),i.flags&512&&(Oe[0]=_&255,Oe[1]=_>>>8&255,i.check=u(i.check,Oe,2,0)),_=0,k=0}else i.head&&(i.head.extra=null);i.mode=w;case w:if(i.flags&1024&&(ue=i.length,ue>B&&(ue=B),ue&&(i.head&&(De=i.head.extra_len-i.length,i.head.extra||(i.head.extra=new Array(i.head.extra_len)),T.arraySet(i.head.extra,H,e,ue,De)),i.flags&512&&(i.check=u(i.check,H,ue,e)),B-=ue,e+=ue,i.length-=ue),i.length))break e;i.length=0,i.mode=G;case G:if(i.flags&2048){if(B===0)break e;ue=0;do De=H[e+ue++],i.head&&De&&i.length<65536&&(i.head.name+=String.fromCharCode(De));while(De&&ue<B);if(i.flags&512&&(i.check=u(i.check,H,ue,e)),B-=ue,e+=ue,De)break e}else i.head&&(i.head.name=null);i.length=0,i.mode=j;case j:if(i.flags&4096){if(B===0)break e;ue=0;do De=H[e+ue++],i.head&&De&&i.length<65536&&(i.head.comment+=String.fromCharCode(De));while(De&&ue<B);if(i.flags&512&&(i.check=u(i.check,H,ue,e)),B-=ue,e+=ue,De)break e}else i.head&&(i.head.comment=null);i.mode=V;case V:if(i.flags&512){for(;k<16;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if(_!==(i.check&65535)){p.msg="header crc mismatch",i.mode=se;break}_=0,k=0}i.head&&(i.head.hcrc=i.flags>>9&1,i.head.done=!0),p.adler=i.check=0,i.mode=U;break;case z:for(;k<32;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}p.adler=i.check=F(_),_=0,k=0,i.mode=P;case P:if(i.havedict===0)return p.next_out=I,p.avail_out=o,p.next_in=e,p.avail_in=B,i.hold=_,i.bits=k,b;p.adler=i.check=1,i.mode=U;case U:if(C===m||C===v)break e;case J:if(i.last){_>>>=k&7,k-=k&7,i.mode=$;break}for(;k<3;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}switch(i.last=_&1,_>>>=1,k-=1,_&3){case 0:i.mode=W;break;case 1:if(ae(i),i.mode=be,C===v){_>>>=2,k-=2;break e}break;case 2:i.mode=te;break;case 3:p.msg="invalid block type",i.mode=se}_>>>=2,k-=2;break;case W:for(_>>>=k&7,k-=k&7;k<32;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if((_&65535)!==(_>>>16^65535)){p.msg="invalid stored block lengths",i.mode=se;break}if(i.length=_&65535,_=0,k=0,i.mode=K,C===v)break e;case K:i.mode=Z;case Z:if(ue=i.length,ue){if(ue>B&&(ue=B),ue>o&&(ue=o),ue===0)break e;T.arraySet(Te,H,e,ue,I),B-=ue,e+=ue,o-=ue,I+=ue,i.length-=ue;break}i.mode=U;break;case te:for(;k<14;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if(i.nlen=(_&31)+257,_>>>=5,k-=5,i.ndist=(_&31)+1,_>>>=5,k-=5,i.ncode=(_&15)+4,_>>>=4,k-=4,i.nlen>286||i.ndist>30){p.msg="too many length or distance symbols",i.mode=se;break}i.have=0,i.mode=de;case de:for(;i.have<i.ncode;){for(;k<3;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}i.lens[er[i.have++]]=_&7,_>>>=3,k-=3}for(;i.have<19;)i.lens[er[i.have++]]=0;if(i.lencode=i.lendyn,i.lenbits=7,Ve={bits:i.lenbits},Ge=y(t,i.lens,0,19,i.lencode,0,i.work,Ve),i.lenbits=Ve.bits,Ge){p.msg="invalid code lengths set",i.mode=se;break}i.have=0,i.mode=Ee;case Ee:for(;i.have<i.nlen+i.ndist;){for(;Be=i.lencode[_&(1<<i.lenbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(Ce<=k);){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if(Ne<16)_>>>=Ce,k-=Ce,i.lens[i.have++]=Ne;else{if(Ne===16){for(je=Ce+2;k<je;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if(_>>>=Ce,k-=Ce,i.have===0){p.msg="invalid bit length repeat",i.mode=se;break}De=i.lens[i.have-1],ue=3+(_&3),_>>>=2,k-=2}else if(Ne===17){for(je=Ce+3;k<je;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}_>>>=Ce,k-=Ce,De=0,ue=3+(_&7),_>>>=3,k-=3}else{for(je=Ce+7;k<je;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}_>>>=Ce,k-=Ce,De=0,ue=11+(_&127),_>>>=7,k-=7}if(i.have+ue>i.nlen+i.ndist){p.msg="invalid bit length repeat",i.mode=se;break}for(;ue--;)i.lens[i.have++]=De}}if(i.mode===se)break;if(i.lens[256]===0){p.msg="invalid code -- missing end-of-block",i.mode=se;break}if(i.lenbits=9,Ve={bits:i.lenbits},Ge=y(n,i.lens,0,i.nlen,i.lencode,0,i.work,Ve),i.lenbits=Ve.bits,Ge){p.msg="invalid literal/lengths set",i.mode=se;break}if(i.distbits=6,i.distcode=i.distdyn,Ve={bits:i.distbits},Ge=y(h,i.lens,i.nlen,i.ndist,i.distcode,0,i.work,Ve),i.distbits=Ve.bits,Ge){p.msg="invalid distances set",i.mode=se;break}if(i.mode=be,C===v)break e;case be:i.mode=ge;case ge:if(B>=6&&o>=258){p.next_out=I,p.avail_out=o,p.next_in=e,p.avail_in=B,i.hold=_,i.bits=k,a(p,ne),I=p.next_out,Te=p.output,o=p.avail_out,e=p.next_in,H=p.input,B=p.avail_in,_=i.hold,k=i.bits,i.mode===U&&(i.back=-1);break}for(i.back=0;Be=i.lencode[_&(1<<i.lenbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(Ce<=k);){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if(Le&&(Le&240)===0){for(ze=Ce,Je=Le,Qe=Ne;Be=i.lencode[Qe+((_&(1<<ze+Je)-1)>>ze)],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(ze+Ce<=k);){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}_>>>=ze,k-=ze,i.back+=ze}if(_>>>=Ce,k-=Ce,i.back+=Ce,i.length=Ne,Le===0){i.mode=ie;break}if(Le&32){i.back=-1,i.mode=U;break}if(Le&64){p.msg="invalid literal/length code",i.mode=se;break}i.extra=Le&15,i.mode=re;case re:if(i.extra){for(je=i.extra;k<je;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}i.length+=_&(1<<i.extra)-1,_>>>=i.extra,k-=i.extra,i.back+=i.extra}i.was=i.length,i.mode=X;case X:for(;Be=i.distcode[_&(1<<i.distbits)-1],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(Ce<=k);){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if((Le&240)===0){for(ze=Ce,Je=Le,Qe=Ne;Be=i.distcode[Qe+((_&(1<<ze+Je)-1)>>ze)],Ce=Be>>>24,Le=Be>>>16&255,Ne=Be&65535,!(ze+Ce<=k);){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}_>>>=ze,k-=ze,i.back+=ze}if(_>>>=Ce,k-=Ce,i.back+=Ce,Le&64){p.msg="invalid distance code",i.mode=se;break}i.offset=Ne,i.extra=Le&15,i.mode=Q;case Q:if(i.extra){for(je=i.extra;k<je;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}i.offset+=_&(1<<i.extra)-1,_>>>=i.extra,k-=i.extra,i.back+=i.extra}if(i.offset>i.dmax){p.msg="invalid distance too far back",i.mode=se;break}i.mode=me;case me:if(o===0)break e;if(ue=ne-o,i.offset>ue){if(ue=i.offset-ue,ue>i.whave&&i.sane){p.msg="invalid distance too far back",i.mode=se;break}ue>i.wnext?(ue-=i.wnext,Fe=i.wsize-ue):Fe=i.wnext-ue,ue>i.length&&(ue=i.length),He=i.window}else He=Te,Fe=I-i.offset,ue=i.length;ue>o&&(ue=o),o-=ue,i.length-=ue;do Te[I++]=He[Fe++];while(--ue);i.length===0&&(i.mode=ge);break;case ie:if(o===0)break e;Te[I++]=i.length,o--,i.mode=ge;break;case $:if(i.wrap){for(;k<32;){if(B===0)break e;B--,_|=H[e++]<<k,k+=8}if(ne-=o,p.total_out+=ne,i.total+=ne,ne&&(p.adler=i.check=i.flags?u(i.check,Te,ne,I-ne):r(i.check,Te,ne,I-ne)),ne=o,(i.flags?_:F(_))!==i.check){p.msg="incorrect data check",i.mode=se;break}_=0,k=0}i.mode=Ie;case Ie:if(i.wrap&&i.flags){for(;k<32;){if(B===0)break e;B--,_+=H[e++]<<k,k+=8}if(_!==(i.total&4294967295)){p.msg="incorrect length check",i.mode=se;break}_=0,k=0}i.mode=Se;case Se:Ge=x;break e;case se:Ge=L;break e;case we:return M;case oe:default:return c}return p.next_out=I,p.avail_out=o,p.next_in=e,p.avail_in=B,i.hold=_,i.bits=k,(i.wsize||ne!==p.avail_out&&i.mode<se&&(i.mode<$||C!==s))&&Ae(p,p.output,p.next_out,ne-p.avail_out),xe-=p.avail_in,ne-=p.avail_out,p.total_in+=xe,p.total_out+=ne,i.total+=ne,i.wrap&&ne&&(p.adler=i.check=i.flags?u(i.check,Te,ne,p.next_out-ne):r(i.check,Te,ne,p.next_out-ne)),p.data_type=i.bits+(i.last?64:0)+(i.mode===U?128:0)+(i.mode===be||i.mode===K?256:0),(xe===0&&ne===0||C===s)&&Ge===l&&(Ge=d),Ge}function R(p){if(!p||!p.state)return c;var C=p.state;return C.window&&(C.window=null),p.state=null,l}function N(p,C){var i;return!p||!p.state||(i=p.state,(i.wrap&2)===0)?c:(i.head=C,C.done=!1,l)}function Y(p,C){var i=C.length,H,Te,e;return!p||!p.state||(H=p.state,H.wrap!==0&&H.mode!==P)?c:H.mode===P&&(Te=1,Te=r(Te,C,i,0),Te!==H.check)?L:(e=Ae(p,C,i,i),e?(H.mode=we,M):(H.havedict=1,l))}return Ye.inflateReset=pe,Ye.inflateReset2=ke,Ye.inflateResetKeep=ve,Ye.inflateInit=Re,Ye.inflateInit2=Me,Ye.inflate=f,Ye.inflateEnd=R,Ye.inflateGetHeader=N,Ye.inflateSetDictionary=Y,Ye.inflateInfo="pako inflate (from Nodeca project)",Ye}var Mr,vt;function Rt(){return vt||(vt=1,Mr={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}),Mr}var Fr,xt;function nn(){if(xt)return Fr;xt=1;function T(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}return Fr=T,Fr}var gt;function an(){if(gt)return or;gt=1;var T=tn(),r=$e(),u=kt(),a=Rt(),y=jr(),t=It(),n=nn(),h=Object.prototype.toString;function s(l){if(!(this instanceof s))return new s(l);this.options=r.assign({chunkSize:16384,windowBits:0,to:""},l||{});var x=this.options;x.raw&&x.windowBits>=0&&x.windowBits<16&&(x.windowBits=-x.windowBits,x.windowBits===0&&(x.windowBits=-15)),x.windowBits>=0&&x.windowBits<16&&!(l&&l.windowBits)&&(x.windowBits+=32),x.windowBits>15&&x.windowBits<48&&(x.windowBits&15)===0&&(x.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new t,this.strm.avail_out=0;var b=T.inflateInit2(this.strm,x.windowBits);if(b!==a.Z_OK)throw new Error(y[b]);if(this.header=new n,T.inflateGetHeader(this.strm,this.header),x.dictionary&&(typeof x.dictionary=="string"?x.dictionary=u.string2buf(x.dictionary):h.call(x.dictionary)==="[object ArrayBuffer]"&&(x.dictionary=new Uint8Array(x.dictionary)),x.raw&&(b=T.inflateSetDictionary(this.strm,x.dictionary),b!==a.Z_OK)))throw new Error(y[b])}s.prototype.push=function(l,x){var b=this.strm,c=this.options.chunkSize,L=this.options.dictionary,M,d,g,A,D,O=!1;if(this.ended)return!1;d=x===~~x?x:x===!0?a.Z_FINISH:a.Z_NO_FLUSH,typeof l=="string"?b.input=u.binstring2buf(l):h.call(l)==="[object ArrayBuffer]"?b.input=new Uint8Array(l):b.input=l,b.next_in=0,b.avail_in=b.input.length;do{if(b.avail_out===0&&(b.output=new r.Buf8(c),b.next_out=0,b.avail_out=c),M=T.inflate(b,a.Z_NO_FLUSH),M===a.Z_NEED_DICT&&L&&(M=T.inflateSetDictionary(this.strm,L)),M===a.Z_BUF_ERROR&&O===!0&&(M=a.Z_OK,O=!1),M!==a.Z_STREAM_END&&M!==a.Z_OK)return this.onEnd(M),this.ended=!0,!1;b.next_out&&(b.avail_out===0||M===a.Z_STREAM_END||b.avail_in===0&&(d===a.Z_FINISH||d===a.Z_SYNC_FLUSH))&&(this.options.to==="string"?(g=u.utf8border(b.output,b.next_out),A=b.next_out-g,D=u.buf2string(b.output,g),b.next_out=A,b.avail_out=c-A,A&&r.arraySet(b.output,b.output,g,A,0),this.onData(D)):this.onData(r.shrinkBuf(b.output,b.next_out))),b.avail_in===0&&b.avail_out===0&&(O=!0)}while((b.avail_in>0||b.avail_out===0)&&M!==a.Z_STREAM_END);return M===a.Z_STREAM_END&&(d=a.Z_FINISH),d===a.Z_FINISH?(M=T.inflateEnd(this.strm),this.onEnd(M),this.ended=!0,M===a.Z_OK):(d===a.Z_SYNC_FLUSH&&(this.onEnd(a.Z_OK),b.avail_out=0),!0)},s.prototype.onData=function(l){this.chunks.push(l)},s.prototype.onEnd=function(l){l===a.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=r.flattenChunks(this.chunks)),this.chunks=[],this.err=l,this.msg=this.strm.msg};function m(l,x){var b=new s(x);if(b.push(l,!0),b.err)throw b.msg||y[b.err];return b.result}function v(l,x){return x=x||{},x.raw=!0,m(l,x)}return or.Inflate=s,or.inflate=m,or.inflateRaw=v,or.ungzip=m,or}var Cr,mt;function sn(){if(mt)return Cr;mt=1;var T=$e().assign,r=Qt(),u=an(),a=Rt(),y={};return T(y,r,u,a),Cr=y,Cr}var _t;function on(){return _t||(_t=1,(function(T){(function(){var r={},u;T.exports=r,typeof Wt=="function"?u=sn():u=window.pako,(function(a,y){a.toRGBA8=function(t){var n=t.width,h=t.height;if(t.tabs.acTL==null)return[a.toRGBA8.decodeImage(t.data,n,h,t).buffer];var s=[];t.frames[0].data==null&&(t.frames[0].data=t.data);for(var m,v=new Uint8Array(n*h*4),l=0;l<t.frames.length;l++){var x=t.frames[l],b=x.rect.x,c=x.rect.y,L=x.rect.width,M=x.rect.height,d=a.toRGBA8.decodeImage(x.data,L,M,t);if(l==0?m=d:x.blend==0?a._copyTile(d,L,M,m,n,h,b,c,0):x.blend==1&&a._copyTile(d,L,M,m,n,h,b,c,1),s.push(m.buffer),m=m.slice(0),x.dispose!=0){if(x.dispose==1)a._copyTile(v,L,M,m,n,h,b,c,0);else if(x.dispose==2){for(var g=l-1;t.frames[g].dispose==2;)g--;m=new Uint8Array(s[g]).slice(0)}}}return s},a.toRGBA8.decodeImage=function(t,n,h,s){var m=n*h,v=a.decode._getBPP(s),l=Math.ceil(n*v/8),x=new Uint8Array(m*4),b=new Uint32Array(x.buffer),c=s.ctype,L=s.depth,M=a._bin.readUshort;if(c==6){var d=m<<2;if(L==8)for(var g=0;g<d;g++)x[g]=t[g];if(L==16)for(var g=0;g<d;g++)x[g]=t[g<<1]}else if(c==2){var A=s.tabs.tRNS,D=-1,O=-1,S=-1;if(A&&(D=A[0],O=A[1],S=A[2]),L==8)for(var g=0;g<m;g++){var E=g<<2,w=g*3;x[E]=t[w],x[E+1]=t[w+1],x[E+2]=t[w+2],x[E+3]=255,D!=-1&&t[w]==D&&t[w+1]==O&&t[w+2]==S&&(x[E+3]=0)}if(L==16)for(var g=0;g<m;g++){var E=g<<2,w=g*6;x[E]=t[w],x[E+1]=t[w+2],x[E+2]=t[w+4],x[E+3]=255,D!=-1&&M(t,w)==D&&M(t,w+2)==O&&M(t,w+4)==S&&(x[E+3]=0)}}else if(c==3){var G=s.tabs.PLTE,j=s.tabs.tRNS,V=j?j.length:0;if(L==1)for(var z=0;z<h;z++)for(var P=z*l,U=z*n,g=0;g<n;g++){var E=U+g<<2,J=t[P+(g>>3)]>>7-((g&7)<<0)&1,W=3*J;x[E]=G[W],x[E+1]=G[W+1],x[E+2]=G[W+2],x[E+3]=J<V?j[J]:255}if(L==2)for(var z=0;z<h;z++)for(var P=z*l,U=z*n,g=0;g<n;g++){var E=U+g<<2,J=t[P+(g>>2)]>>6-((g&3)<<1)&3,W=3*J;x[E]=G[W],x[E+1]=G[W+1],x[E+2]=G[W+2],x[E+3]=J<V?j[J]:255}if(L==4)for(var z=0;z<h;z++)for(var P=z*l,U=z*n,g=0;g<n;g++){var E=U+g<<2,J=t[P+(g>>1)]>>4-((g&1)<<2)&15,W=3*J;x[E]=G[W],x[E+1]=G[W+1],x[E+2]=G[W+2],x[E+3]=J<V?j[J]:255}if(L==8)for(var g=0;g<m;g++){var E=g<<2,J=t[g],W=3*J;x[E]=G[W],x[E+1]=G[W+1],x[E+2]=G[W+2],x[E+3]=J<V?j[J]:255}}else if(c==4){if(L==8)for(var g=0;g<m;g++){var E=g<<2,K=g<<1,Z=t[K];x[E]=Z,x[E+1]=Z,x[E+2]=Z,x[E+3]=t[K+1]}if(L==16)for(var g=0;g<m;g++){var E=g<<2,K=g<<2,Z=t[K];x[E]=Z,x[E+1]=Z,x[E+2]=Z,x[E+3]=t[K+2]}}else if(c==0){var D=s.tabs.tRNS?s.tabs.tRNS:-1;if(L==1)for(var g=0;g<m;g++){var Z=255*(t[g>>3]>>7-(g&7)&1),te=Z==D*255?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}if(L==2)for(var g=0;g<m;g++){var Z=85*(t[g>>2]>>6-((g&3)<<1)&3),te=Z==D*85?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}if(L==4)for(var g=0;g<m;g++){var Z=17*(t[g>>1]>>4-((g&1)<<2)&15),te=Z==D*17?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}if(L==8)for(var g=0;g<m;g++){var Z=t[g],te=Z==D?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}if(L==16)for(var g=0;g<m;g++){var Z=t[g<<1],te=M(t,g<<1)==D?0:255;b[g]=te<<24|Z<<16|Z<<8|Z}}return x},a.decode=function(t){for(var n=new Uint8Array(t),h=8,s=a._bin,m=s.readUshort,v=s.readUint,l={tabs:{},frames:[]},x=new Uint8Array(n.length),b=0,c,L=0,M=[137,80,78,71,13,10,26,10],d=0;d<8;d++)if(n[d]!=M[d])throw"The input is not a PNG file!";for(;h<n.length;){var g=s.readUint(n,h);h+=4;var A=s.readASCII(n,h,4);if(h+=4,A=="IHDR")a.decode._IHDR(n,h,l);else if(A=="IDAT"){for(var d=0;d<g;d++)x[b+d]=n[h+d];b+=g}else if(A=="acTL")l.tabs[A]={num_frames:v(n,h),num_plays:v(n,h+4)},c=new Uint8Array(n.length);else if(A=="fcTL"){if(L!=0){var D=l.frames[l.frames.length-1];D.data=a.decode._decompress(l,c.slice(0,L),D.rect.width,D.rect.height),L=0}var O={x:v(n,h+12),y:v(n,h+16),width:v(n,h+4),height:v(n,h+8)},S=m(n,h+22);S=m(n,h+20)/(S==0?100:S);var E={rect:O,delay:Math.round(S*1e3),dispose:n[h+24],blend:n[h+25]};l.frames.push(E)}else if(A=="fdAT"){for(var d=0;d<g-4;d++)c[L+d]=n[h+d+4];L+=g-4}else if(A=="pHYs")l.tabs[A]=[s.readUint(n,h),s.readUint(n,h+4),n[h+8]];else if(A=="cHRM"){l.tabs[A]=[];for(var d=0;d<8;d++)l.tabs[A].push(s.readUint(n,h+d*4))}else if(A=="tEXt"){l.tabs[A]==null&&(l.tabs[A]={});var w=s.nextZero(n,h),G=s.readASCII(n,h,w-h),j=s.readASCII(n,w+1,h+g-w-1);l.tabs[A][G]=j}else if(A=="iTXt"){l.tabs[A]==null&&(l.tabs[A]={});var w=0,V=h;w=s.nextZero(n,V);var G=s.readASCII(n,V,w-V);V=w+1,n[V],n[V+1],V+=2,w=s.nextZero(n,V),s.readASCII(n,V,w-V),V=w+1,w=s.nextZero(n,V),s.readUTF8(n,V,w-V),V=w+1;var j=s.readUTF8(n,V,g-(V-h));l.tabs[A][G]=j}else if(A=="PLTE")l.tabs[A]=s.readBytes(n,h,g);else if(A=="hIST"){var z=l.tabs.PLTE.length/3;l.tabs[A]=[];for(var d=0;d<z;d++)l.tabs[A].push(m(n,h+d*2))}else if(A=="tRNS")l.ctype==3?l.tabs[A]=s.readBytes(n,h,g):l.ctype==0?l.tabs[A]=m(n,h):l.ctype==2&&(l.tabs[A]=[m(n,h),m(n,h+2),m(n,h+4)]);else if(A=="gAMA")l.tabs[A]=s.readUint(n,h)/1e5;else if(A=="sRGB")l.tabs[A]=n[h];else if(A=="bKGD")l.ctype==0||l.ctype==4?l.tabs[A]=[m(n,h)]:l.ctype==2||l.ctype==6?l.tabs[A]=[m(n,h),m(n,h+2),m(n,h+4)]:l.ctype==3&&(l.tabs[A]=n[h]);else if(A=="IEND"){if(L!=0){var D=l.frames[l.frames.length-1];D.data=a.decode._decompress(l,c.slice(0,L),D.rect.width,D.rect.height),L=0}l.data=a.decode._decompress(l,x,l.width,l.height);break}h+=g,s.readUint(n,h),h+=4}return delete l.compress,delete l.interlace,delete l.filter,l},a.decode._decompress=function(t,n,h,s){return t.compress==0&&(n=a.decode._inflate(n)),t.interlace==0?n=a.decode._filterZero(n,t,0,h,s):t.interlace==1&&(n=a.decode._readInterlace(n,t)),n},a.decode._inflate=function(t){return y.inflate(t)},a.decode._readInterlace=function(t,n){for(var h=n.width,s=n.height,m=a.decode._getBPP(n),v=m>>3,l=Math.ceil(h*m/8),x=new Uint8Array(s*l),b=0,c=[0,0,4,0,2,0,1],L=[0,4,0,2,0,1,0],M=[8,8,8,4,4,2,2],d=[8,8,4,4,2,2,1],g=0;g<7;){for(var A=M[g],D=d[g],O=0,S=0,E=c[g];E<s;)E+=A,S++;for(var w=L[g];w<h;)w+=D,O++;var G=Math.ceil(O*m/8);a.decode._filterZero(t,n,b,O,S);for(var j=0,V=c[g];V<s;){for(var z=L[g],P=b+j*G<<3;z<h;){if(m==1){var U=t[P>>3];U=U>>7-(P&7)&1,x[V*l+(z>>3)]|=U<<7-((z&3)<<0)}if(m==2){var U=t[P>>3];U=U>>6-(P&7)&3,x[V*l+(z>>2)]|=U<<6-((z&3)<<1)}if(m==4){var U=t[P>>3];U=U>>4-(P&7)&15,x[V*l+(z>>1)]|=U<<4-((z&1)<<2)}if(m>=8)for(var J=V*l+z*v,W=0;W<v;W++)x[J+W]=t[(P>>3)+W];P+=m,z+=D}j++,V+=A}O*S!=0&&(b+=S*(1+G)),g=g+1}return x},a.decode._getBPP=function(t){var n=[1,null,3,1,2,null,4][t.ctype];return n*t.depth},a.decode._filterZero=function(t,n,h,s,m){var v=a.decode._getBPP(n),l=Math.ceil(s*v/8),x=a.decode._paeth;v=Math.ceil(v/8);for(var b=0;b<m;b++){var c=h+b*l,L=c+b+1,M=t[L-1];if(M==0)for(var d=0;d<l;d++)t[c+d]=t[L+d];else if(M==1){for(var d=0;d<v;d++)t[c+d]=t[L+d];for(var d=v;d<l;d++)t[c+d]=t[L+d]+t[c+d-v]&255}else if(b==0){for(var d=0;d<v;d++)t[c+d]=t[L+d];if(M==2)for(var d=v;d<l;d++)t[c+d]=t[L+d]&255;if(M==3)for(var d=v;d<l;d++)t[c+d]=t[L+d]+(t[c+d-v]>>1)&255;if(M==4)for(var d=v;d<l;d++)t[c+d]=t[L+d]+x(t[c+d-v],0,0)&255}else{if(M==2)for(var d=0;d<l;d++)t[c+d]=t[L+d]+t[c+d-l]&255;if(M==3){for(var d=0;d<v;d++)t[c+d]=t[L+d]+(t[c+d-l]>>1)&255;for(var d=v;d<l;d++)t[c+d]=t[L+d]+(t[c+d-l]+t[c+d-v]>>1)&255}if(M==4){for(var d=0;d<v;d++)t[c+d]=t[L+d]+x(0,t[c+d-l],0)&255;for(var d=v;d<l;d++)t[c+d]=t[L+d]+x(t[c+d-v],t[c+d-l],t[c+d-v-l])&255}}}return t},a.decode._paeth=function(t,n,h){var s=t+n-h,m=Math.abs(s-t),v=Math.abs(s-n),l=Math.abs(s-h);return m<=v&&m<=l?t:v<=l?n:h},a.decode._IHDR=function(t,n,h){var s=a._bin;h.width=s.readUint(t,n),n+=4,h.height=s.readUint(t,n),n+=4,h.depth=t[n],n++,h.ctype=t[n],n++,h.compress=t[n],n++,h.filter=t[n],n++,h.interlace=t[n],n++},a._bin={nextZero:function(t,n){for(;t[n]!=0;)n++;return n},readUshort:function(t,n){return t[n]<<8|t[n+1]},writeUshort:function(t,n,h){t[n]=h>>8&255,t[n+1]=h&255},readUint:function(t,n){return t[n]*(256*256*256)+(t[n+1]<<16|t[n+2]<<8|t[n+3])},writeUint:function(t,n,h){t[n]=h>>24&255,t[n+1]=h>>16&255,t[n+2]=h>>8&255,t[n+3]=h&255},readASCII:function(t,n,h){for(var s="",m=0;m<h;m++)s+=String.fromCharCode(t[n+m]);return s},writeASCII:function(t,n,h){for(var s=0;s<h.length;s++)t[n+s]=h.charCodeAt(s)},readBytes:function(t,n,h){for(var s=[],m=0;m<h;m++)s.push(t[n+m]);return s},pad:function(t){return t.length<2?"0"+t:t},readUTF8:function(t,n,h){for(var s="",m,v=0;v<h;v++)s+="%"+a._bin.pad(t[n+v].toString(16));try{m=decodeURIComponent(s)}catch{return a._bin.readASCII(t,n,h)}return m}},a._copyTile=function(t,n,h,s,m,v,l,x,b){for(var c=Math.min(n,m),L=Math.min(h,v),M=0,d=0,g=0;g<L;g++)for(var A=0;A<c;A++)if(l>=0&&x>=0?(M=g*n+A<<2,d=(x+g)*m+l+A<<2):(M=(-x+g)*n-l+A<<2,d=g*m+A<<2),b==0)s[d]=t[M],s[d+1]=t[M+1],s[d+2]=t[M+2],s[d+3]=t[M+3];else if(b==1){var D=t[M+3]*.00392156862745098,O=t[M]*D,S=t[M+1]*D,E=t[M+2]*D,w=s[d+3]*(1/255),G=s[d]*w,j=s[d+1]*w,V=s[d+2]*w,z=1-D,P=D+w*z,U=P==0?0:1/P;s[d+3]=255*P,s[d+0]=(O+G*z)*U,s[d+1]=(S+j*z)*U,s[d+2]=(E+V*z)*U}else if(b==2){var D=t[M+3],O=t[M],S=t[M+1],E=t[M+2],w=s[d+3],G=s[d],j=s[d+1],V=s[d+2];D==w&&O==G&&S==j&&E==V?(s[d]=0,s[d+1]=0,s[d+2]=0,s[d+3]=0):(s[d]=O,s[d+1]=S,s[d+2]=E,s[d+3]=D)}else if(b==3){var D=t[M+3],O=t[M],S=t[M+1],E=t[M+2],w=s[d+3],G=s[d],j=s[d+1],V=s[d+2];if(D==w&&O==G&&S==j&&E==V)continue;if(D<220&&w>20)return!1}return!0},a.encode=function(t,n,h,s,m,v){s==null&&(s=0),v==null&&(v=!1);for(var l=new Uint8Array(t[0].byteLength*t.length+100),x=[137,80,78,71,13,10,26,10],b=0;b<8;b++)l[b]=x[b];var c=8,L=a._bin,M=a.crc.crc,d=L.writeUint,g=L.writeUshort,A=L.writeASCII,D=a.encode.compressPNG(t,n,h,s,v);d(l,c,13),c+=4,A(l,c,"IHDR"),c+=4,d(l,c,n),c+=4,d(l,c,h),c+=4,l[c]=D.depth,c++,l[c]=D.ctype,c++,l[c]=0,c++,l[c]=0,c++,l[c]=0,c++,d(l,c,M(l,c-17,17)),c+=4,d(l,c,1),c+=4,A(l,c,"sRGB"),c+=4,l[c]=1,c++,d(l,c,M(l,c-5,5)),c+=4;var O=t.length>1;if(O&&(d(l,c,8),c+=4,A(l,c,"acTL"),c+=4,d(l,c,t.length),c+=4,d(l,c,0),c+=4,d(l,c,M(l,c-12,12)),c+=4),D.ctype==3){var S=D.plte.length;d(l,c,S*3),c+=4,A(l,c,"PLTE"),c+=4;for(var b=0;b<S;b++){var E=b*3,w=D.plte[b],G=w&255,j=w>>8&255,V=w>>16&255;l[c+E+0]=G,l[c+E+1]=j,l[c+E+2]=V}if(c+=S*3,d(l,c,M(l,c-S*3-4,S*3+4)),c+=4,D.gotAlpha){d(l,c,S),c+=4,A(l,c,"tRNS"),c+=4;for(var b=0;b<S;b++)l[c+b]=D.plte[b]>>24&255;c+=S,d(l,c,M(l,c-S-4,S+4)),c+=4}}for(var z=0,P=0;P<D.frames.length;P++){var U=D.frames[P];O&&(d(l,c,26),c+=4,A(l,c,"fcTL"),c+=4,d(l,c,z++),c+=4,d(l,c,U.rect.width),c+=4,d(l,c,U.rect.height),c+=4,d(l,c,U.rect.x),c+=4,d(l,c,U.rect.y),c+=4,g(l,c,m[P]),c+=2,g(l,c,1e3),c+=2,l[c]=U.dispose,c++,l[c]=U.blend,c++,d(l,c,M(l,c-30,30)),c+=4);var J=U.cimg,S=J.length;d(l,c,S+(P==0?0:4)),c+=4;var W=c;A(l,c,P==0?"IDAT":"fdAT"),c+=4,P!=0&&(d(l,c,z++),c+=4);for(var b=0;b<S;b++)l[c+b]=J[b];c+=S,d(l,c,M(l,W,c-W)),c+=4}return d(l,c,0),c+=4,A(l,c,"IEND"),c+=4,d(l,c,M(l,c-4,4)),c+=4,l.buffer.slice(0,c)},a.encode.compressPNG=function(t,n,h,s,m){for(var v=a.encode.compress(t,n,h,s,!1,m),l=0;l<t.length;l++){var x=v.frames[l];x.rect.width;var b=x.rect.height,c=x.bpl,L=x.bpp,M=new Uint8Array(b*c+b);x.cimg=a.encode._filterZero(x.img,b,L,c,M)}return v},a.encode.compress=function(t,n,h,s,m,v){v==null&&(v=!1);for(var l=6,x=8,b=4,c=255,L=0;L<t.length;L++)for(var M=new Uint8Array(t[L]),d=M.length,g=0;g<d;g+=4)c&=M[g+3];var A=c!=255,D={},O=[];if(t.length!=0&&(D[0]=0,O.push(0),s!=0&&s--),s!=0){var S=a.quantize(t,s,m);t=S.bufs;for(var g=0;g<S.plte.length;g++){var E=S.plte[g].est.rgba;D[E]==null&&(D[E]=O.length,O.push(E))}}else for(var L=0;L<t.length;L++)for(var w=new Uint32Array(t[L]),d=w.length,g=0;g<d;g++){var E=w[g];if((g<n||E!=w[g-1]&&E!=w[g-n])&&D[E]==null&&(D[E]=O.length,O.push(E),O.length>=300))break}var G=A?m:!1,j=O.length;j<=256&&v==!1&&(j<=2?x=1:j<=4?x=2:j<=16?x=4:x=8,m&&(x=8),A=!0);for(var V=[],L=0;L<t.length;L++){var z=new Uint8Array(t[L]),P=new Uint32Array(z.buffer),U=0,J=0,W=n,K=h,Z=0;if(L!=0&&!G){for(var te=m||L==1||V[V.length-2].dispose==2?1:2,de=0,Ee=1e9,be=0;be<te;be++){for(var Se=new Uint8Array(t[L-1-be]),ge=new Uint32Array(t[L-1-be]),re=n,X=h,Q=-1,me=-1,ie=0;ie<h;ie++)for(var $=0;$<n;$++){var g=ie*n+$;P[g]!=ge[g]&&($<re&&(re=$),$>Q&&(Q=$),ie<X&&(X=ie),ie>me&&(me=ie))}var Ie=Q==-1?1:(Q-re+1)*(me-X+1);Ie<Ee&&(Ee=Ie,de=be,Q==-1?(U=J=0,W=K=1):(U=re,J=X,W=Q-re+1,K=me-X+1))}var Se=new Uint8Array(t[L-1-de]);de==1&&(V[V.length-1].dispose=2);var se=new Uint8Array(W*K*4);new Uint32Array(se.buffer),a._copyTile(Se,n,h,se,W,K,-U,-J,0),a._copyTile(z,n,h,se,W,K,-U,-J,3)?(a._copyTile(z,n,h,se,W,K,-U,-J,2),Z=1):(a._copyTile(z,n,h,se,W,K,-U,-J,0),Z=0),z=se,P=new Uint32Array(z.buffer)}var we=4*W;if(j<=256&&v==!1){we=Math.ceil(x*W/8);for(var se=new Uint8Array(we*K),ie=0;ie<K;ie++){var g=ie*we,oe=ie*W;if(x==8)for(var $=0;$<W;$++)se[g+$]=D[P[oe+$]];else if(x==4)for(var $=0;$<W;$++)se[g+($>>1)]|=D[P[oe+$]]<<4-($&1)*4;else if(x==2)for(var $=0;$<W;$++)se[g+($>>2)]|=D[P[oe+$]]<<6-($&3)*2;else if(x==1)for(var $=0;$<W;$++)se[g+($>>3)]|=D[P[oe+$]]<<7-($&7)*1}z=se,l=3,b=1}else if(A==!1&&t.length==1){for(var se=new Uint8Array(W*K*3),q=W*K,g=0;g<q;g++){var ye=g*3,fe=g*4;se[ye]=z[fe],se[ye+1]=z[fe+1],se[ye+2]=z[fe+2]}z=se,l=2,b=3,we=3*W}V.push({rect:{x:U,y:J,width:W,height:K},img:z,bpl:we,bpp:b,blend:Z,dispose:G?1:0})}return{ctype:l,depth:x,plte:O,gotAlpha:A,frames:V}},a.encode._filterZero=function(t,n,h,s,m){for(var v=[],l=0;l<5;l++)if(!(n*s>5e5&&(l==2||l==3||l==4))){for(var x=0;x<n;x++)a.encode._filterLine(m,t,x,s,h,l);if(v.push(y.deflate(m)),h==1)break}for(var b,c=1e9,L=0;L<v.length;L++)v[L].length<c&&(b=L,c=v[L].length);return v[b]},a.encode._filterLine=function(t,n,h,s,m,v){var l=h*s,x=l+h,b=a.decode._paeth;if(t[x]=v,x++,v==0)for(var c=0;c<s;c++)t[x+c]=n[l+c];else if(v==1){for(var c=0;c<m;c++)t[x+c]=n[l+c];for(var c=m;c<s;c++)t[x+c]=n[l+c]-n[l+c-m]+256&255}else if(h==0){for(var c=0;c<m;c++)t[x+c]=n[l+c];if(v==2)for(var c=m;c<s;c++)t[x+c]=n[l+c];if(v==3)for(var c=m;c<s;c++)t[x+c]=n[l+c]-(n[l+c-m]>>1)+256&255;if(v==4)for(var c=m;c<s;c++)t[x+c]=n[l+c]-b(n[l+c-m],0,0)+256&255}else{if(v==2)for(var c=0;c<s;c++)t[x+c]=n[l+c]+256-n[l+c-s]&255;if(v==3){for(var c=0;c<m;c++)t[x+c]=n[l+c]+256-(n[l+c-s]>>1)&255;for(var c=m;c<s;c++)t[x+c]=n[l+c]+256-(n[l+c-s]+n[l+c-m]>>1)&255}if(v==4){for(var c=0;c<m;c++)t[x+c]=n[l+c]+256-b(0,n[l+c-s],0)&255;for(var c=m;c<s;c++)t[x+c]=n[l+c]+256-b(n[l+c-m],n[l+c-s],n[l+c-m-s])&255}}},a.crc={table:(function(){for(var t=new Uint32Array(256),n=0;n<256;n++){for(var h=n,s=0;s<8;s++)h&1?h=3988292384^h>>>1:h=h>>>1;t[n]=h}return t})(),update:function(t,n,h,s){for(var m=0;m<s;m++)t=a.crc.table[(t^n[h+m])&255]^t>>>8;return t},crc:function(t,n,h){return a.crc.update(4294967295,t,n,h)^4294967295}},a.quantize=function(t,n,h){for(var s=[],m=0,v=0;v<t.length;v++)s.push(a.encode.alphaMul(new Uint8Array(t[v]),h)),m+=t[v].byteLength;for(var l=new Uint8Array(m),x=new Uint32Array(l.buffer),b=0,v=0;v<s.length;v++){for(var c=s[v],L=c.length,M=0;M<L;M++)l[b+M]=c[M];b+=L}var d={i0:0,i1:l.length,bst:null,est:null,tdst:0,left:null,right:null};d.bst=a.quantize.stats(l,d.i0,d.i1),d.est=a.quantize.estats(d.bst);for(var g=[d];g.length<n;){for(var A=0,D=0,v=0;v<g.length;v++)g[v].est.L>A&&(A=g[v].est.L,D=v);if(A<.001)break;var O=g[D],S=a.quantize.splitPixels(l,x,O.i0,O.i1,O.est.e,O.est.eMq255),E={i0:O.i0,i1:S,bst:null,est:null,tdst:0,left:null,right:null};E.bst=a.quantize.stats(l,E.i0,E.i1),E.est=a.quantize.estats(E.bst);var w={i0:S,i1:O.i1,bst:null,est:null,tdst:0,left:null,right:null};w.bst={R:[],m:[],N:O.bst.N-E.bst.N};for(var v=0;v<16;v++)w.bst.R[v]=O.bst.R[v]-E.bst.R[v];for(var v=0;v<4;v++)w.bst.m[v]=O.bst.m[v]-E.bst.m[v];w.est=a.quantize.estats(w.bst),O.left=E,O.right=w,g[D]=E,g.push(w)}g.sort(function(te,de){return de.bst.N-te.bst.N});for(var G=0;G<s.length;G++){for(var j=a.quantize.planeDst,V=new Uint8Array(s[G].buffer),z=new Uint32Array(s[G].buffer),P=V.length,v=0;v<P;v+=4){for(var U=V[v]*.00392156862745098,J=V[v+1]*(1/255),W=V[v+2]*(1/255),K=V[v+3]*(1/255),Z=d;Z.left;)Z=j(Z.est,U,J,W,K)<=0?Z.left:Z.right;z[v>>2]=Z.est.rgba}s[G]=z.buffer}return{bufs:s,plte:g}},a.quantize.getNearest=function(t,n,h,s,m){if(t.left==null)return t.tdst=a.quantize.dist(t.est.q,n,h,s,m),t;var v=a.quantize.planeDst(t.est,n,h,s,m),l=t.left,x=t.right;v>0&&(l=t.right,x=t.left);var b=a.quantize.getNearest(l,n,h,s,m);if(b.tdst<=v*v)return b;var c=a.quantize.getNearest(x,n,h,s,m);return c.tdst<b.tdst?c:b},a.quantize.planeDst=function(t,n,h,s,m){var v=t.e;return v[0]*n+v[1]*h+v[2]*s+v[3]*m-t.eMq},a.quantize.dist=function(t,n,h,s,m){var v=n-t[0],l=h-t[1],x=s-t[2],b=m-t[3];return v*v+l*l+x*x+b*b},a.quantize.splitPixels=function(t,n,h,s,m,v){var l=a.quantize.vecDot;for(s-=4;h<s;){for(;l(t,h,m)<=v;)h+=4;for(;l(t,s,m)>v;)s-=4;if(h>=s)break;var x=n[h>>2];n[h>>2]=n[s>>2],n[s>>2]=x,h+=4,s-=4}for(;l(t,h,m)>v;)h-=4;return h+4},a.quantize.vecDot=function(t,n,h){return t[n]*h[0]+t[n+1]*h[1]+t[n+2]*h[2]+t[n+3]*h[3]},a.quantize.stats=function(t,n,h){for(var s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],m=[0,0,0,0],v=h-n>>2,l=n;l<h;l+=4){var x=t[l]*.00392156862745098,b=t[l+1]*(1/255),c=t[l+2]*(1/255),L=t[l+3]*(1/255);m[0]+=x,m[1]+=b,m[2]+=c,m[3]+=L,s[0]+=x*x,s[1]+=x*b,s[2]+=x*c,s[3]+=x*L,s[5]+=b*b,s[6]+=b*c,s[7]+=b*L,s[10]+=c*c,s[11]+=c*L,s[15]+=L*L}return s[4]=s[1],s[8]=s[2],s[12]=s[3],s[9]=s[6],s[13]=s[7],s[14]=s[11],{R:s,m,N:v}},a.quantize.estats=function(t){var n=t.R,h=t.m,s=t.N,m=h[0],v=h[1],l=h[2],x=h[3],b=s==0?0:1/s,c=[n[0]-m*m*b,n[1]-m*v*b,n[2]-m*l*b,n[3]-m*x*b,n[4]-v*m*b,n[5]-v*v*b,n[6]-v*l*b,n[7]-v*x*b,n[8]-l*m*b,n[9]-l*v*b,n[10]-l*l*b,n[11]-l*x*b,n[12]-x*m*b,n[13]-x*v*b,n[14]-x*l*b,n[15]-x*x*b],L=c,M=a.M4,d=[.5,.5,.5,.5],g=0,A=0;if(s!=0)for(var D=0;D<10&&(d=M.multVec(L,d),A=Math.sqrt(M.dot(d,d)),d=M.sml(1/A,d),!(Math.abs(A-g)<1e-9));D++)g=A;var O=[m*b,v*b,l*b,x*b],S=M.dot(M.sml(255,O),d),E=O[3]<.001?0:1/O[3];return{Cov:c,q:O,e:d,L:g,eMq255:S,eMq:M.dot(d,O),rgba:(Math.round(255*O[3])<<24|Math.round(255*O[2]*E)<<16|Math.round(255*O[1]*E)<<8|Math.round(255*O[0]*E)<<0)>>>0}},a.M4={multVec:function(t,n){return[t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3],t[4]*n[0]+t[5]*n[1]+t[6]*n[2]+t[7]*n[3],t[8]*n[0]+t[9]*n[1]+t[10]*n[2]+t[11]*n[3],t[12]*n[0]+t[13]*n[1]+t[14]*n[2]+t[15]*n[3]]},dot:function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]},sml:function(t,n){return[t*n[0],t*n[1],t*n[2],t*n[3]]}},a.encode.alphaMul=function(t,n){for(var h=new Uint8Array(t.length),s=t.length>>2,m=0;m<s;m++){var v=m<<2,l=t[v+3];n&&(l=l<128?0:255);var x=l*(1/255);h[v+0]=t[v+0]*x,h[v+1]=t[v+1]*x,h[v+2]=t[v+2]*x,h[v+3]=l}return h}})(r,u)})()})(Tr)),Tr.exports}on();async function fn(T,r){const u=new Blob([T],{type:r});return await createImageBitmap(u,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}const Or={KHR_texture_transform:"KHR_texture_transform",KHR_materials_transmission:"KHR_materials_transmission"};class vr{offset;rotation;scale;texcoord;constructor(r){this.offset=r.offset??[0,0],this.rotation=r.rotation??0,this.scale=r.scale??[1,1],this.texcoord=r.texCoord}get data(){return{offset:this.offset,rotation:this.rotation,scale:this.scale}}static getDefaultData(){return{offset:[0,0],rotation:0,scale:[1,1]}}}class ln{factor;texture;constructor(r){this.factor=r.transmissionFactor,r.transmissionTexture!=null&&(this.texture=new Mt(r.transmissionTexture))}}function Br(T){return ir(T[0],T[1],T[2])}function bt(T){const r=qe();return fr(r,T),Nt(r,r),r}function Ln(T,r){return Pt(ar(),T,r)}function Dn(T,r){return Ut(ar(),T,r)}function On(T,r){return Tt(ar(),T,r)}function Un(T){return zr(ar(),T)}var Ur=`override MAX_LIGHTS: u32 = 10u;

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
@group(0) @binding(4) var lutSampler: sampler;\r
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

    finalColor.a = cbase.a;

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

}`;function Pn(T){return Object.keys(T).length}function Nn(T,r,u){return Math.min(Math.max(T,r),u)}function dr(T,r="Value must not be null or undefined"){if(T==null)throw new Error(r)}class Lr{options;gpuinfo;canvasinfo;scene;definition;pipeline;constructor(r){this.options=r}static getAttributeOptions(r,u,a){const y=a in u.json.attributes;let t=0,n=0;if(y){const h=u.getAssessor(a);n=u.getBufferView(a).byteStride??h.getElementBytes(),t=0}else n=0,t=0;return{exists:y,stride:n,offset:t}}static getMultiAttributeOptions(r,u,a){return Object.keys(u.json.attributes).filter(y=>y.startsWith(a)).map(y=>{const t=u.json.attributes[y],n=r.assessors[t];return{exists:!0,stride:r.bufferViews[n.json.bufferView].byteStride??n.getElementBytes(),offset:0}})}static attributeKey(r,u){return u.exists?`${r}:T:${u.stride}:${u.offset}`:`${r}:F`}static multiAttributeKey(r,u){return u.map(a=>this.attributeKey(r,a)).join(",")}static getPipelineOptionsOfPrimitive(r,u){const a=u.getMeterial();return{mode:u.getMode(),indices:u.hasIndicies(),position:this.getAttributeOptions(r,u,Ue.POSITION),normal:this.getAttributeOptions(r,u,Ue.NORMAL),tangent:this.getAttributeOptions(r,u,Ue.TANGENT),texoord:this.getMultiAttributeOptions(r,u,Ue.TEXCOORD),joints:this.getMultiAttributeOptions(r,u,Ue.JOINTS),weights:this.getMultiAttributeOptions(r,u,Ue.WEIGHTS),morph:u.hasMorph(),colorTexutre:a.hasTexture(Pe.BaseColor),metalTexture:a.hasTexture(Pe.MetallicRoughness),normalTexture:a.hasTexture(Pe.Normal),emmissiveTexture:a.hasTexture(Pe.Emmissive),occlusionTexture:a.hasTexture(Pe.Occlusion),alphaMode:a.getAlphaMode(),doubleSided:a.getDoubleSided()}}static getPipelineKeyOfOptions(r){function u(t,n){return n?`${t}:T`:`${t}:F`}return[r.mode,this.attributeKey("pos",r.position),this.attributeKey("nor",r.normal),this.attributeKey("tan",r.tangent),this.multiAttributeKey("tex",r.texoord),this.multiAttributeKey("jot",r.joints),this.multiAttributeKey("wgt",r.weights),u("mor",r.morph),r.alphaMode,u("dbs",r.doubleSided)].join("|")}getBlend(){if(this.options.alphaMode==="BLEND")return{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}getCullMode(){return this.options.doubleSided?"none":"back"}getDepthWriteEnabled(){return this.options.alphaMode!=="BLEND"}createPipeline(r,u,a){this.gpuinfo=r,this.canvasinfo=u,this.scene=a;const y="gltf",t=r.device;this.definition=Nr(Ur);const n=t.createShaderModule({label:y,code:Ur}),h=t.createBindGroupLayout({label:y,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),s=t.createPipelineLayout({label:y,bindGroupLayouts:[this.scene.bindGroupLayout,nr.getBindGroupLayout(t),h]});let m=0;const v=[];v.push({arrayStride:this.options.position.stride,attributes:[{shaderLocation:m++,offset:0,format:"float32x3"}]}),v.push({arrayStride:this.options.normal.stride,attributes:[{shaderLocation:m++,offset:0,format:"float32x3"}]}),v.push({arrayStride:this.options.tangent.stride,attributes:[{shaderLocation:m++,offset:0,format:"float32x3"}]});for(let x=0;x<5;++x){const b=this.options.texoord[x];v.push({arrayStride:b?.stride??8,attributes:[{shaderLocation:m++,offset:0,format:"float32x2"}]})}const l=t.createRenderPipeline({label:y,layout:s,vertex:{module:n,buffers:v},fragment:{module:n,targets:[{format:u.context.getConfiguration().format,blend:this.getBlend()}]},primitive:{topology:"triangle-list",cullMode:this.getCullMode(),frontFace:"ccw"},depthStencil:{depthWriteEnabled:this.getDepthWriteEnabled(),format:"depth32float",depthCompare:"less-equal"}});this.pipeline=l}}class xr{static pipelines={};webgpu;constructor(r,u,a){this.webgpu={gpuinfo:r,canvasinfo:u,scene:a}}render(r){const u=r.sceneRef??r.gltf.json.scene,a=r.gltf.scenes[u];this.renderScene(a,r)}renderScene(r,u){for(const a of r.nodes){const y=u.gltf.nodes[a];this.renderNode(y,u.matrix??qe(),u)}}renderNode(r,u,a){if(!r.enabled)return;const y=zt(qe(),u,r.matrix);if(r.children!=null)for(const t of r.children){const n=a.gltf.nodes[t];this.renderNode(n,y,a)}if(r.camera!=null,r.skin!=null,r.mesh!=null){const t=a.gltf.meshes[r.mesh];this.renderMesh(r,t,y,a)}}renderMesh(r,u,a,y){for(const t of u.primitives)this.renderPrimitive(u,a,t,y)}renderPrimitive(r,u,a,y){const t=Lr.getPipelineOptionsOfPrimitive(y.gltf,a),n=Lr.getPipelineKeyOfOptions(t);let h;n in xr.pipelines?(h=xr.pipelines[n],h.pipeline==null&&h.createPipeline(this.webgpu.gpuinfo,this.webgpu.canvasinfo,this.webgpu.scene)):(h=new Lr(t),h.createPipeline(this.webgpu.gpuinfo,this.webgpu.canvasinfo,this.webgpu.scene),xr.pipelines[n]=h);const s=this.webgpu.gpuinfo.device,m=Pr(h.definition.uniforms.model),v=a.getGPUMaterialTexCoordMap();a.webgpu.uniform==null&&(a.webgpu.uniform=this.createModelUniform(s,m));const l={modelmtx:u,normalmtx:bt(u),tangentmtx:bt(u),hasTangent:a.hasTangent()?1:0,texcoordOrder:{baseColor:v.baseColor??0,metallicRoughness:v.metallicRoughness??0,normal:v.normal??0,emmissive:v.emmissive??0,occlusion:v.occlusion??0}};m.set(l),s.queue.writeBuffer(a.webgpu.uniform,0,m.arrayBuffer);const x=s.createBindGroup({label:"primitive",layout:h.pipeline.getBindGroupLayout(2),entries:[{binding:0,resource:{buffer:a.webgpu.uniform}}]});let b=null;if(a.hasIndicies()&&(b=this.getPrimitiveIndexBuffer(s,a),b==null))return;let c=null;if(a.hasPosition()&&(c=this.getPrimitiveAttributeBuffer(s,a,Ue.POSITION),c==null))return;let L=null;a.hasNormal()&&(L=this.getPrimitiveAttributeBuffer(s,a,Ue.NORMAL));let M=null;a.hasTangent()&&(M=this.getPrimitiveAttributeBuffer(s,a,Ue.TANGENT));const d=a.getOrderedTexcoordAttrName(),g=[];for(let A=0;A<5;++A){const D=d[A];if(D!=null){const O=parseInt(D.split("_")[1]);g.push(this.getPrimitiveAttributeBuffer(s,a,Ue.TEXCOORD,O))}else g.push(null)}y.pass.setPipeline(h.pipeline),y.pass.setVertexBuffer(0,c.buffer,c.offset,c.size),L!=null?y.pass.setVertexBuffer(1,L.buffer,L.offset,L.size):y.pass.setVertexBuffer(1,a.getDefaultVec3FloatGPUBuffer(s)),M!=null?y.pass.setVertexBuffer(2,M.buffer,M.offset,M.size):y.pass.setVertexBuffer(2,a.getDefaultVec4FloatGPUBuffer(s));for(let A=0;A<5;++A){const D=g[A];D!=null?y.pass.setVertexBuffer(3+A,D.buffer,D.offset,D.size):y.pass.setVertexBuffer(3+A,a.getDefaultVec2FloatGPUBuffer(s))}y.pass.setBindGroup(0,this.webgpu.scene.bindGroup),y.pass.setBindGroup(1,a.getMeterial().getGPUMaterial(s).getBindGroup(s)),y.pass.setBindGroup(2,x),a.hasIndicies()?(y.pass.setIndexBuffer(b.buffer,b.format,b.offset,b.size),y.pass.drawIndexed(b.count)):y.pass.draw(c.count)}getGPUIndexFormat(r){switch(r.json.componentType){case cr.UNSIGNED_BYTE:return"uint16";case cr.UNSIGNED_SHORT:return"uint16";case cr.UNSIGNED_INT:return"uint32"}}getPrimitiveIndexBuffer(r,u){const a=u.gltf.assessors[u.json.indices],y=u.gltf.bufferViews[a.json.bufferView],t=u.gltf.buffers[y.json.buffer],n=a.json.componentType,h=this.getGPUIndexFormat(a);if(n!==cr.UNSIGNED_BYTE){const s=a.json.byteOffset??0,m=y.json.byteOffset??0,v=y.byteLength,l=s+m,x=v-s,b=a.json.count,c=t.getGPUBuffer(r,GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST);return c==null?null:{buffer:c,format:h,offset:l,size:x,count:b}}else throw Error("Index Format 当前不支持uint8")}getPrimitiveAttributeBuffer(r,u,a,y){let t;y!=null?t=`${a}_${y}`:t=a;const n=u.json.attributes[t];dr(n);const h=u.gltf.assessors[n];dr(h);const s=u.gltf.bufferViews[h.json.bufferView];dr(s);const m=u.gltf.buffers[s.json.buffer];dr(m);const v=h.json.byteOffset??0,l=s.json.byteOffset??0,x=s.byteLength,b=v+l,c=x-v,L=h.json.count,M=m.getGPUBuffer(r,GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST);return M==null?null:{buffer:M,offset:b,size:c,count:L}}createModelUniform(r,u){return r.createBuffer({label:"model uniform",size:u.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}}const un={OPAQUE:0,MASK:1,BLEND:2};class nr{material;static bindgroupLayout;bindgroup;webgpu={};static defaultTexture;static defaultSampler;constructor(r){this.material=r}static getBindGroupLayout(r){if(!nr.bindgroupLayout){const u=GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,a={sampleType:"float",viewDimension:"2d",multisampled:!1},y={type:"filtering"},t=r.createBindGroupLayout({label:"GLTFGPUMaterial",entries:[{binding:0,visibility:u,buffer:{type:"uniform"}},{binding:1,visibility:u,texture:a},{binding:2,visibility:u,sampler:y},{binding:3,visibility:u,texture:a},{binding:4,visibility:u,sampler:y},{binding:5,visibility:u,texture:a},{binding:6,visibility:u,sampler:y},{binding:7,visibility:u,texture:a},{binding:8,visibility:u,sampler:y},{binding:9,visibility:u,texture:a},{binding:10,visibility:u,sampler:y}]});nr.bindgroupLayout=t}return nr.bindgroupLayout}getBindGroup(r){if(!this.bindgroup||!this.material.isTextureReady()){const u=r.createBindGroup({label:"GLTFGPUMaterial",layout:nr.getBindGroupLayout(r),entries:[{binding:0,resource:{buffer:this.getUniform(r)}},{binding:1,resource:this.material.getGPUTexture(r,this.material.baseColor.texture)},{binding:2,resource:this.material.getGPUSampler(r,this.material.baseColor.texture)},{binding:3,resource:this.material.getGPUTexture(r,this.material.pbr.texture)},{binding:4,resource:this.material.getGPUSampler(r,this.material.pbr.texture)},{binding:5,resource:this.material.getGPUTexture(r,this.material.normal.texture)},{binding:6,resource:this.material.getGPUSampler(r,this.material.normal.texture)},{binding:7,resource:this.material.getGPUTexture(r,this.material.emmissive.texture)},{binding:8,resource:this.material.getGPUSampler(r,this.material.emmissive.texture)},{binding:9,resource:this.material.getGPUTexture(r,this.material.occlusion.texture)},{binding:10,resource:this.material.getGPUSampler(r,this.material.occlusion.texture)}]});this.bindgroup=u}return this.bindgroup}getUniform(r){if(!this.webgpu.uniform){const u=Nr(Ur),a=Pr(u.uniforms.pbrMaterial),y=r.createBuffer({label:"pbrMaterial",size:a.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),t={baseColorFactor:this.material.baseColor.factor,baseColorTexture:{hasTexture:Ze(this.material.hasTexture(Pe.BaseColor)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.BaseColor)),textureTransform:this.material.getTextureTransformData(Pe.BaseColor)},metallicFactor:this.material.pbr.metallic,roughnessFactor:this.material.pbr.roughness,metallicRoughnessTexture:{hasTexture:Ze(this.material.hasTexture(Pe.MetallicRoughness)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.MetallicRoughness)),textureTransform:this.material.getTextureTransformData(Pe.MetallicRoughness)},normalScale:this.material.normal.scale,normalTexture:{hasTexture:Ze(this.material.hasTexture(Pe.Normal)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.Normal)),textureTransform:this.material.getTextureTransformData(Pe.Normal)},emmissiveFactor:this.material.emmissive.factor,emmissiveTexture:{hasTexture:Ze(this.material.hasTexture(Pe.Emmissive)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.Emmissive)),textureTransform:this.material.getTextureTransformData(Pe.Emmissive)},occlusionStrength:this.material.occlusion.strength,occlusionTexture:{hasTexture:Ze(this.material.hasTexture(Pe.Occlusion)),hasTextureTransform:Ze(this.material.hasTextureTransform(Pe.Occlusion)),textureTransform:this.material.getTextureTransformData(Pe.Occlusion)},alphaMode:un[this.material.getAlphaMode()],alphaCutoff:this.material.getAlphaCutoff(),hasTransmission:Ze(this.material.transmission!=null),transmissionFactor:this.material.transmission!=null?this.material.transmission.factor:0};a.set(t),r.queue.writeBuffer(y,0,a.arrayBuffer),this.webgpu.uniform=y}return this.webgpu.uniform}destroy(){this.webgpu.uniform?.destroy(),this.webgpu.uniform=null}}class cn{ref;gltf;json;nodes;constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a,this.nodes=a.nodes}}class hn{gltf;ref;json;matrix=qe();children;camera;skin;mesh;#t=!0;constructor(r,u,a){if(this.gltf=r,this.ref=u,this.json=a,this.json.children&&(this.children=a.children),this.json.matrix)this.matrix=yt(...this.json.matrix);else if(this.json.translation){const y=this.json.translation??[0,0,0],t=this.json.rotation??[0,0,0,1],n=this.json.scale??[1,1,1];this.matrix=jt(qe(),Yt(t[0],t[1],t[2],t[3]),ir(y[0],y[1],y[2]),ir(n[0],n[1],n[2]))}this.camera=this.json.camera,this.mesh=this.json.mesh,this.skin=this.json.skin}get enabled(){return this.#t}enable(){this.#t=!0}disable(){this.#t=!1}switch(){this.#t=!this.#t}}class dn{gltf;ref;json;primitives;constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a,this.primitives=this.json.primitives.map((y,t)=>new vn(r,this,t))}}const Ue={POSITION:"POSITION",NORMAL:"NORMAL",TANGENT:"TANGENT",TEXCOORD:"TEXCOORD",JOINTS:"JOINTS",WEIGHTS:"WEIGHTS"};class vn{gltf;ref;mesh;json;mode;indices;webgpu={};constructor(r,u,a){this.gltf=r,this.ref=a,this.mesh=u,this.json=u.json.primitives[a],this.mode=this.json.mode,this.indices=this.json.indices}getVertexCount(){return this.getAssessor(Ue.POSITION).count}getMode(){return this.mode}getMeterial(){return this.gltf.getMaterial(this.json.material)}hasIndicies(){return!!this.indices}hasPosition(){return Ue.POSITION in this.json.attributes}hasNormal(){return Ue.NORMAL in this.json.attributes}hasTangent(){return Ue.TANGENT in this.json.attributes}hasTexcoord(r=0){return`${Ue.TEXCOORD}_${r}`in this.json.attributes}numTexcoord(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.TEXCOORD)).length}hasJoints(r=0){return`${Ue.JOINTS}_${r}`in this.json.attributes}numJoints(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.JOINTS)).length}hasWeights(r=0){return`${Ue.WEIGHTS}_${r}`in this.json.attributes}numWeights(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.WEIGHTS)).length}hasMorph(){return!!this.json.targets}getAssessor(r,u){const a=u?`${r}_${u}`:r,y=this.json.attributes[a];return y==null?null:this.gltf.assessors[y]}getBufferView(r,u){const a=this.getAssessor(r,u);return a==null?null:this.gltf.bufferViews[a.json.bufferView]??null}getOrderedTexcoordAttrName(){return Object.keys(this.json.attributes).filter(r=>r.startsWith(Ue.TEXCOORD)).sort((r,u)=>{const a=parseInt(r.split("_")[1]),y=parseInt(u.split("_")[1]);return a-y})}getGPUMaterialTexCoordMap(){const r=this.gltf.materials[this.json.material];if(r){const u=this.getTexCoordOrderMap(),a=r.getTexcoordIndexMap(),y=Object.entries(a).map(([t,n])=>{const h=u[n];return[t,h]});return Object.fromEntries(y)}return{}}getTexCoordOrderMap(){const r=Object.keys(this.json.attributes).filter(u=>u.startsWith(Ue.TEXCOORD)).map(u=>parseInt(u.split("_")[1])).sort().map((u,a)=>[u,a]);return Object.fromEntries(r)}getDefaultVec4FloatGPUBuffer(r){if(this.webgpu.defaultVec4FloatBuffer!=null)return this.webgpu.defaultVec4FloatBuffer;const a=16*this.getVertexCount(),y=new ArrayBuffer(a),t=r.createBuffer({label:"primitive default vec4f buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,y),this.webgpu.defaultVec4FloatBuffer=t,t}getDefaultVec3FloatGPUBuffer(r){if(this.webgpu.defaultVec3FloatBuffer!=null)return this.webgpu.defaultVec3FloatBuffer;const a=12*this.getVertexCount(),y=new ArrayBuffer(a),t=r.createBuffer({label:"primitive default vec3f buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,y),this.webgpu.defaultVec3FloatBuffer=t,t}getDefaultVec2FloatGPUBuffer(r){if(this.webgpu.defaultVec2FloatBuffer!=null)return this.webgpu.defaultVec2FloatBuffer;const a=8*this.getVertexCount(),y=new ArrayBuffer(a),t=r.createBuffer({label:"primitive default vec2f buffer",size:a,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});return r.queue.writeBuffer(t,0,y),this.webgpu.defaultVec2FloatBuffer=t,t}}const Ke={NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987},Dr={NEAREST:9728,LINEAR:9729},We={REPEAT:10497,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648},xn={label:"gltf default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"};class gn{gltf;ref;json;webgpu={};getImage(){return this.gltf.images[this.json.source]??null}constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a}getGPUTexture(r){if(this.webgpu.texture!=null)return this.webgpu.texture;const u=this.gltf.images[this.json.source];if(u==null)return null;if(u.loadImage(),u.status===lr.READY){const a=u.image,y=Ft(r,a,{mips:this.needMipmap(),format:"rgba8unorm",size:[a.width,a.height,1]});this.webgpu.texture=y}else return null}needMipmap(){const r=this.gltf.samplers[this.json.sampler];return r==null?!1:r.needMipmap()}getGPUSampler(r){if(this.webgpu.sampler!=null)return this.webgpu.sampler;{const u=this.gltf.samplers[this.json.sampler];return u==null?this.webgpu.sampler=r.createSampler(xn):this.webgpu.sampler=u.getGPUSampler(r),this.webgpu.sampler}}destroy(){this.webgpu.texture?.destroy(),this.webgpu.texture=null}}class mn{gltf;ref;json;minFilter;magFilter;wrapS;wrapT;webgpu={};constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a,this.minFilter=this.json.minFilter??Ke.LINEAR,this.magFilter=this.json.magFilter??Dr.LINEAR,this.wrapS=this.json.wrapS??We.REPEAT,this.wrapT=this.json.wrapT??We.REPEAT}needMipmap(){return this.minFilter===Ke.NEAREST_MIPMAP_NEAREST||this.minFilter===Ke.LINEAR_MIPMAP_NEAREST||this.minFilter===Ke.NEAREST_MIPMAP_LINEAR||this.minFilter===Ke.LINEAR_MIPMAP_LINEAR}getGPUSamplerDescriptor(){const r={label:"gltf sampler"};switch(this.minFilter){case Ke.NEAREST:r.minFilter="nearest";break;case Ke.LINEAR:r.minFilter="linear";break;case Ke.NEAREST_MIPMAP_NEAREST:r.minFilter="nearest",r.mipmapFilter="nearest";break;case Ke.LINEAR_MIPMAP_NEAREST:r.minFilter="linear",r.mipmapFilter="nearest";break;case Ke.NEAREST_MIPMAP_LINEAR:r.minFilter="nearest",r.mipmapFilter="linear";break;case Ke.LINEAR_MIPMAP_LINEAR:r.minFilter="linear",r.mipmapFilter="linear";break}switch(this.magFilter){case Dr.NEAREST:r.magFilter="nearest";break;case Dr.LINEAR:r.magFilter="linear";break}switch(this.wrapS){case We.REPEAT:r.addressModeU="repeat";break;case We.CLAMP_TO_EDGE:r.addressModeU="clamp-to-edge";break;case We.MIRRORED_REPEAT:r.addressModeU="mirror-repeat"}switch(this.wrapT){case We.REPEAT:r.addressModeV="repeat";break;case We.CLAMP_TO_EDGE:r.addressModeV="clamp-to-edge";break;case We.MIRRORED_REPEAT:r.addressModeV="mirror-repeat"}return r}getGPUSampler(r){if(this.webgpu.sampler==null){const u=this.getGPUSamplerDescriptor();this.webgpu.sampler=r.createSampler(u)}return this.webgpu.sampler}}class Mt{textureRef=0;texcoordRef;textureTransform;ready=!1;constructor(r){r!=null&&(this.textureRef=r.index,this.texcoordRef=r.texCoord??0,r.extensions!=null&&Or.KHR_texture_transform in r.extensions&&(this.textureTransform=new vr(r.extensions.KHR_texture_transform),this.textureTransform.texcoord!=null&&(this.texcoordRef=this.textureTransform.texcoord)))}}const Pe={BaseColor:"BaseColor",MetallicRoughness:"MetallicRoughness",Normal:"Normal",Emmissive:"Emmissive",Occlusion:"Occlusion"};class pt{gltf;ref;json;alphaMode="OPAQUE";alphaCutoff=.5;doubleSided=!1;baseColor={factor:[1,1,1,1]};pbr={metallic:1,roughness:1};normal={scale:1};emmissive={factor:[0,0,0]};occlusion={strength:1};webgpu={};transmission;constructor(r,u,a){if(this.gltf=r,this.ref=u,this.json=a,this.json){const y=this.json.pbrMetallicRoughness;y&&(this.baseColor.factor=y.baseColorFactor??[1,1,1,1],this.baseColor.texture=this.getTextureInfo(y.baseColorTexture),this.pbr.metallic=y.metallicFactor??1,this.pbr.roughness=y.roughnessFactor??1,this.pbr.texture=this.getTextureInfo(y.metallicRoughnessTexture)),this.normal.scale=this.json.normalTexture?.scale??1,this.normal.texture=this.getTextureInfo(this.json.normalTexture),this.emmissive.factor=this.json.emissiveFactor??[0,0,0],this.emmissive.texture=this.getTextureInfo(this.json.emissiveTexture),this.occlusion.strength=this.json.occlusionTexture?.strength??1,this.occlusion.texture=this.getTextureInfo(this.json.occlusionTexture),this.alphaMode=this.json.alphaMode??"OPAQUE",this.alphaCutoff=this.json.alphaCutoff??.5,this.doubleSided=this.json.doubleSided??!1,this.json.extensions!=null&&Or.KHR_materials_transmission in this.json.extensions&&(this.transmission=new ln(a.extensions[Or.KHR_materials_transmission]))}}getTextureInfo(r){return r==null?null:new Mt(r)}getAlphaMode(){return this.alphaMode}getAlphaCutoff(){return this.alphaCutoff}getDoubleSided(){return this.doubleSided}hasTexture(r){switch(r){case"BaseColor":return this.baseColor.texture!=null;case"MetallicRoughness":return this.pbr.texture!=null;case"Normal":return this.normal.texture!=null;case"Emmissive":return this.emmissive.texture!=null;case"Occlusion":return this.occlusion.texture!=null;default:return!1}}hasTextureTransform(r){if(!this.hasTexture(r))return!1;switch(r){case"BaseColor":return this.baseColor.texture.textureTransform!=null;case"MetallicRoughness":return this.pbr.texture.textureTransform!=null;case"Normal":return this.normal.texture.textureTransform!=null;case"Emmissive":return this.emmissive.texture.textureTransform!=null;case"Occlusion":return this.occlusion.texture.textureTransform!=null;default:return!1}}getTextureTransformData(r){if(!this.hasTexture(r)||!this.hasTextureTransform(r))return vr.getDefaultData();switch(r){case"BaseColor":return this.baseColor.texture.textureTransform.data;case"MetallicRoughness":return this.pbr.texture.textureTransform.data;case"Normal":return this.normal.texture.textureTransform.data;case"Emmissive":return this.emmissive.texture.textureTransform.data;case"Occlusion":return this.occlusion.texture.textureTransform.data;default:return vr.getDefaultData()}}getTexcoordIndexMap(){return{baseColor:this.baseColor.texture?.texcoordRef,metallicRoughness:this.pbr.texture?.texcoordRef,normal:this.normal.texture?.texcoordRef,emmissive:this.emmissive.texture?.texcoordRef,occlusion:this.occlusion.texture?.texcoordRef}}isTextureReady(){const r=this.baseColor.texture==null||this.baseColor.texture.ready,u=this.pbr.texture==null||this.pbr.texture.ready,a=this.normal.texture==null||this.normal.texture.ready,y=this.emmissive.texture==null||this.emmissive.texture.ready,t=this.occlusion.texture==null||this.occlusion.texture.ready;return r&&u&&a&&y&&t}getGPUTexture(r,u){if(u==null)return this.gltf.getDefaultTexture(r);const y=this.gltf.textures[u.textureRef].getGPUTexture(r);return y==null?this.gltf.getDefaultTexture(r):(u.ready=!0,y)}getGPUSampler(r,u){if(u==null)return this.gltf.getDefaultSampler(r);const y=this.gltf.textures[u.textureRef].getGPUSampler(r);return y??this.gltf.getDefaultSampler(r)}getGPUMaterial(r){if(this.webgpu.material==null){const u=new nr(this);this.webgpu.material=u}return this.webgpu.material}destroy(){this.webgpu.material?.destroy(),this.webgpu.material=null}}const lr={NONE:0,LOADING:1,READY:2,FAILED:3};class _n{gltf;ref;json;image=null;status=lr.NONE;constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a}async loadImage(){if(this.status!==lr.NONE)return;this.status=lr.LOADING;let r=null;if(this.json.uri){let u="";this.json.uri.startsWith("data:")?u=this.json.uri:u=`${this.gltf.url}/${this.json.uri}`;const y=await(await fetch(u)).blob();r=await createImageBitmap(y,{colorSpaceConversion:"none",imageOrientation:"from-image",premultiplyAlpha:"none"})}else if(this.json.bufferView){const u=this.gltf.bufferViews[this.json.bufferView];if(!u)throw this.status=lr.FAILED,new Error("GLTFImage loadImage get bufferView Failed");const a=u.byteOffset,y=u.byteLength,t=await u.loadData(),n=this.json.mimeType,h=new ArrayBuffer(y);new Uint8Array(h).set(t.slice(a,a+y)),r=await fn(h,n)}return this.image=r,this.status=lr.READY,this.image}destroy(){}}class bn{gltf;ref;json;constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a}}class pn{gltf;ref;json;constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a}}class wn{gltf;ref;json;constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a}}const Tn={SCALA:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},cr={BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,UNSIGNED_INT:5125,FLOAT:5126},yn=Object.fromEntries(Object.entries(cr).map(([T,r])=>[r,T])),En={BYTE:1,UNSIGNED_BYTE:1,SHORT:2,UNSIGNED_SHORT:2,UNSIGNED_INT:4,FLOAT:4};class Sn{gltf;ref;json;count;byteOffset;constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a,this.byteOffset=this.json.byteOffset??0,this.count=this.json.count??0}async loadData(){return this.gltf.bufferViews[this.json.bufferView].loadData()}getElementBytes(){const r=this.json.type,u=this.json.componentType,a=Tn[r],y=En[yn[u]];return a*y}}class An{gltf;ref;json;byteLength;byteOffset;byteStride;constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a,this.byteLength=this.json.byteLength,this.byteOffset=this.json.byteOffset??0,this.byteStride=this.json.byteStride}async loadData(){return this.gltf.buffers[this.json.buffer].loadData()}}const ur={NONE:0,LOADING:1,READY:2};class kn{gltf;ref;json;byteLength;uri;data=null;status=ur.NONE;webgpu={buffers:{}};constructor(r,u,a){this.gltf=r,this.ref=u,this.json=a,this.byteLength=this.json.byteLength,this.uri=this.json.uri}loadData(){return this.status=ur.LOADING,(async()=>{let r=null;if(this.uri){let u=this.json.uri;this.uri.startsWith("data:")||(u=`${this.gltf.url}/${this.uri}`);const a=await fetch(u);if(!a.ok)throw new Error(`Failed to load buffer data: ${a.status}`);r=await a.arrayBuffer()}return this.data=new Uint8Array(r),this.status=ur.READY,this.data})()}getGPUBuffer(r,u){if(this.status===ur.NONE)return this.loadData(),null;if(this.status===ur.LOADING)return null;if(this.webgpu.buffers[u]!=null)return this.webgpu.buffers[u];{const a=r.createBuffer({label:this.json.name??"gltf buffer",size:this.json.byteLength,usage:u});r.queue.writeBuffer(a,0,this.data.buffer,0,this.byteLength),this.webgpu.buffers[u]=a}}destroy(){for(const r of Object.values(this.webgpu.buffers))r.destroy();this.webgpu.buffers={}}}class zn{name="glTF";#t;#n;#e;#a;#i=!1;#r=[];scenes;nodes;meshes;camera;textures;samplers;materials;images;skins;animations;assessors;bufferViews;buffers;#s;webgpu={};constructor(r){this.#t=r.uri,this.#n=this.#t.replace(/\/[^\/]*$/,"/"),this.name=r.name??"gltf",this.#o(this.#t).then(u=>{this.#e=u;const y=u.asset.version;if(this.#a=y,y!=="2.0")throw Error("only supports glTF 2.0 currently.");this.build(),this.#i=!0;for(const t of this.#r)t(this)})}get ready(){return this.#i}get uri(){return this.#t}get url(){return this.#n}get json(){return this.#e}get version(){return this.#a}get defaultMaterial(){return this.#s||(this.#s=new pt(this)),this.#s}getMaterial(r){return r==null?this.defaultMaterial:this.materials[r]}onReady(r){this.ready?r(this):this.#r.push(r)}async#o(r){const u=await fetch(r);if(!u.ok)throw new Error(u.statusText);const a=await u.json();return this.#e=a,this.#e}build(){this.scenes=this.json.scenes?.map((r,u)=>new cn(this,u,r)),this.nodes=this.json.nodes?.map((r,u)=>new hn(this,u,r)),this.meshes=this.json.meshes?.map((r,u)=>new dn(this,u,r)),this.camera=this.json.cameras?.map((r,u)=>new bn(this,u,r)),this.textures=this.json.textures?.map((r,u)=>new gn(this,u,r)),this.samplers=this.json.samplers?.map((r,u)=>new mn(this,u,r)),this.materials=this.json.materials?.map((r,u)=>new pt(this,u,r)),this.images=this.json.images?.map((r,u)=>new _n(this,u,r)),this.skins=this.json.skins?.map((r,u)=>new pn(this,u,r)),this.animations=this.json.animations?.map((r,u)=>new wn(this,u,r)),this.assessors=this.json.accessors?.map((r,u)=>new Sn(this,u,r)),this.bufferViews=this.json.bufferViews?.map((r,u)=>new An(this,u,r)),this.buffers=this.json.buffers?.map((r,u)=>new kn(this,u,r))}getDefaultTexture(r){if(this.webgpu.defaultTexture==null){const u=r.createTexture({label:"pbrMaterial default texture",size:[1,1,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:u},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.webgpu.defaultTexture=u}return this.webgpu.defaultTexture}getDefaultSampler(r){if(this.webgpu.defaultSampler==null){const u=r.createSampler({label:"pbrMaterial default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.webgpu.defaultSampler=u}return this.webgpu.defaultSampler}destroy(){for(const r of this.buffers)r.destroy();for(const r of this.images)r.destroy();for(const r of this.textures)r.destroy();for(const r of this.materials)r.destroy();this.webgpu.defaultTexture!=null&&(this.webgpu.defaultTexture.destroy(),this.webgpu.defaultTexture=null)}}var In=`override MAX_LIGHTS: u32 = 10u;

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
}`;class Rn{#t;#n;#e;#a;#i;#r={};constructor(r){this.#t=r.label??"SimpleLine",this.#n=r.topology,this.#e=r.positions,this.#a=r.colors,this.#i=r.indices}get topology(){return this.#n}get positions(){return this.positions}get colors(){return this.#a}initWebGPU(r,u,a){this.#r.gpuinfo=r,this.#r.canvasinfo=u,this.#r.scene=a,this.refreshUniforms(),this.refreshVertexBuffers(),this.createPileline()}createDefaultColors(){const r=this.positions.length/3,u=[0,1,0,1];this.#a=new Float32Array(Array(r).fill(u).flat())}refreshVertexBuffers(r=!1){if(!this.#r.gpuinfo)return;const u=this.#r.gpuinfo.device;if(r||!this.#r.buffer){this.colors||this.createDefaultColors();const a=this.#r.buffer;if(this.#i){const y=Kr(u,{position:{data:this.#e,numComponents:3},colors:{data:this.#a,numComponents:4},indices:this.#i});this.#r.buffer=y}else{const y=Kr(u,{position:{data:this.#e,numComponents:3},colors:{data:this.#a,numComponents:4}});this.#r.buffer=y}a&&(a.buffers.forEach(y=>y.destroy()),a.indexBuffer&&a.indexBuffer.destroy())}}refreshUniforms(){this.#r.scene.refreshUniform()}createPileline(){const r=this.#r.gpuinfo.device;this.#r.module=r.createShaderModule({label:this.#t,code:In});const u=r.createPipelineLayout({bindGroupLayouts:[this.#r.scene.bindGroupLayout]}),a={label:this.#t,layout:u,vertex:{module:this.#r.module,buffers:this.#r.buffer.bufferLayouts},fragment:{module:this.#r.module,targets:[{format:this.#r.canvasinfo.context.getConfiguration().format}]},primitive:{topology:this.#n},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less-equal"}};this.#r.pipeline=r.createRenderPipeline(a)}draw(r){this.refreshUniforms(),this.refreshVertexBuffers();const u=this.#r.scene,a=this.#r.buffer;r.setPipeline(this.#r.pipeline),r.setBindGroup(0,u.bindGroup),r.setVertexBuffer(0,a.buffers[0]),this.#i?(r.setIndexBuffer(a.indexBuffer,a.indexFormat),r.drawIndexed(a.numElements)):r.draw(this.#e.length/3)}destroy(){for(const r of this.#r.buffer.buffers)r.destroy()}}class jn{#t;#n;#e;#a;#i;#r;#s;constructor(r){this.#t=r.xlim??[0,1],this.#n=r.ylim??[0,1],this.#e=r.zlim??[0,1],this.#a=r.xcolor??[1,0,0,1],this.#i=r.ycolor??[0,1,0,1],this.#r=r.zcolor??[0,0,1,1],this.#s=new Rn({topology:"line-list",positions:new Float32Array([this.#t[0],0,0,this.#t[1],0,0,0,this.#n[0],0,0,this.#n[1],0,0,0,this.#e[0],0,0,this.#e[1]]),colors:new Float32Array([...this.#a,...this.#a,...this.#i,...this.#i,...this.#r,...this.#r]),indices:null})}initWebGPU(r,u,a){this.#s.initWebGPU(r,u,a)}draw(r){this.#s.draw(r)}}var Mn=`override MAX_LIGHTS: u32 = 10u;

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
@group(0) @binding(4) var lutSampler: sampler;`;class Gn{camera;projection;worldmtx=qe();#t=0;#n=0;lights=[];MAX_NUM_LIGHTS=16;ibl;#e={};constructor(r,u){this.camera=r,this.projection=u}setWorldMatrix(r){this.worldmtx=r}addLight(r){this.lights.push(r)}setIBL(r){this.ibl=r,this.#e.gpuinfo!=null&&r.webgpu.gpuinfo==null&&r.initWebGPU(this.#e.gpuinfo,this.#e.canvasinfo,this)}canEnv(){return this.ibl!=null&&this.ibl.canEnv()}canIBL(){return this.ibl!=null&&this.ibl.canIBL()}getEnv(){return this.canEnv()?this.ibl.environment:null}refreshViewport(r,u){this.#t=r,this.#n=u}get viewportMatrix(){const a=this.#t/2,y=this.#n/2;return yt(a,0,0,0,0,y,0,0,0,0,1,0,0+a,0+y,0,1)}get viewportMatrixInv(){return fr(qe(),this.viewportMatrix)}getRayOfPixel(r,u){u=this.#n-u;const a=this.viewportMatrix,y=this.projection.perspectiveMatrixZO,t=this.camera.viewMtx,n=Gt(qe(),y,t),h=fr(qe(),n),s=fr(qe(),a),m=wt(r,u,0,1),v=Wr($r(),m,s),l=Wr($r(),v,h),x=ir(l[0],l[1],l[2]),b=ir(this.camera.from[0],this.camera.from[1],this.camera.from[2]),c=zr(ar(),Tt(ar(),x,b));return new Ct(b,c)}initWebGPU(r,u){this.#e.gpuinfo=r,this.#e.canvasinfo=u}refreshUniform(){if(this.#e.gpuinfo){const r=this.#e.gpuinfo.device;this.#e.definition||(this.#e.definition=Nr(Mn));const u=Pr(this.#e.definition.uniforms.scene);this.#e.uniform||(this.#e.uniform=r.createBuffer({label:"scene",size:u.arrayBuffer.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}));const a={eye:Br(this.camera.from),center:Br(this.camera.to),up:Br(this.camera.up),viewmtx:this.camera.viewMtx,viewmtxInv:fr(qe(),this.camera.viewMtx)},y={near:this.projection.near,far:this.projection.far,fovy:this.projection.fovy,aspect:this.projection.aspect,projmtx:this.projection.perspectiveMatrixZO,projmtxInv:fr(qe(),this.projection.perspectiveMatrixZO)},t={width:this.#t,height:this.#n,viewportmtx:this.viewportMatrix,viewportmtxInv:this.viewportMatrixInv},n=this.getIBLsh(),h={canIBL:Ze(this.canIBL()),prescaled:Ze(this.canIBL()&&this.ibl.sh.prescale),sh:n},s=Math.min(this.MAX_NUM_LIGHTS,this.lights.length),m=[];for(let l=0;l<s;++l)m.push({position:this.lights[l].position,color:this.lights[l].color});const v={worldmtx:this.worldmtx,camera:a,projection:y,viewport:t,ibl:h,numLights:s,lights:m};u.set(v),r.queue.writeBuffer(this.#e.uniform,0,u.arrayBuffer)}}get bindGroupLayout(){if(this.#e.gpuinfo){const r=this.#e.gpuinfo.device;return this.#e.layout||(this.#e.layout=r.createBindGroupLayout({label:"scene",entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"cube",sampleType:"float",multisampled:!1}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:3,visibility:GPUShaderStage.FRAGMENT,texture:{viewDimension:"2d",sampleType:"float",multisampled:!1}},{binding:4,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}}]})),this.#e.layout}return null}getPrefilterTexture(){let r;if(this.canIBL()&&(r=this.ibl.getPrefilterTexture()),r==null){const u=this.#e.gpuinfo?.device;r=this.getDefaultCubeTexture(u)}return r}getPrefilterSampler(){let r;if(this.canIBL()&&(r=this.ibl.getPerfilterSampler()),r==null){const u=this.#e.gpuinfo?.device;r=this.getDefaultCubeSampler(u)}return r}getLUTTexture(){let r;if(this.canIBL()&&(r=this.ibl.getLUTTexture()),r==null){const u=this.#e.gpuinfo?.device;r=this.getDefault2DTexture(u)}return r}getLUTSampler(){let r;if(this.canIBL()&&(r=this.ibl.getLUTSampler()),r==null){const u=this.#e.gpuinfo?.device;r=this.getDefault2DSampler(u)}return r}getIBLsh(){return this.canIBL()?this.ibl.sh.parameters:Array(9).fill([1,1,1])}get bindGroup(){if(this.#e.gpuinfo){const r=this.#e.gpuinfo.device,u=this.getPrefilterTexture(),a=this.getPrefilterSampler(),y=this.getLUTTexture(),t=this.getLUTSampler();return this.#e.bindgroup=r.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.#e.uniform}},{binding:1,resource:u.createView({dimension:"cube"})},{binding:2,resource:a},{binding:3,resource:y.createView({dimension:"2d"})},{binding:4,resource:t}]}),this.#e.bindgroup}return null}get uniform(){return this.#e.uniform}getDefaultCubeTexture(r){if(this.#e.defaultCubeTexture==null){const u=r.createTexture({label:"default texture",size:[1,1,6],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:u},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.#e.defaultCubeTexture=u}return this.#e.defaultCubeTexture}getDefaultCubeSampler(r){if(this.#e.defaultCubeSampler==null){const u=r.createSampler({label:"default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.#e.defaultCubeSampler=u}return this.#e.defaultCubeSampler}getDefault2DTexture(r){if(this.#e.default2DTexture==null){const u=r.createTexture({label:"default texture",size:[1,1,1],format:"rgba8unorm",dimension:"2d",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});r.queue.writeTexture({texture:u},new Uint8Array([0,0,0,0]),{bytesPerRow:4},{width:1,height:1}),this.#e.default2DTexture=u}return this.#e.default2DTexture}getDefault2DSampler(r){if(this.#e.default2DSampler==null){const u=r.createSampler({label:"default sampler",minFilter:"linear",magFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"});this.#e.default2DSampler=u}return this.#e.default2DSampler}destroy(){this.#e.uniform&&this.#e.uniform.destroy(),this.#e.defaultCubeTexture&&this.#e.defaultCubeTexture.destroy(),this.#e.default2DTexture&&this.#e.default2DTexture.destroy()}}export{jn as A,xr as G,Gn as S,Un as a,Dn as b,Ln as c,On as d,hn as e,zn as f,Nn as g,Rn as h,bt as n,Pn as o,Br as v};
