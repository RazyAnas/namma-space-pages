import"./modulepreload-polyfill-B5Qt9EMX.js";import{A as ye,a as tt,b as nt,_ as it,c as at,d as rt,e as Ue,f as ot,g as Ee}from"./navgrid-B9Dodm_m.js";function st(){try{const t=Number(localStorage.getItem("namma.xrFovY"));if(t>.5&&t<2)return t}catch{}return 64*Math.PI/180}class ct{onImage=null;stream=null;video=document.createElement("video");canvas=document.createElement("canvas");timer=0;async start(e){this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1});const n=this.video;n.playsInline=!0,n.muted=!0,n.srcObject=this.stream,n.className="scan-video",e.prepend(n),await n.play();const i=this.canvas.getContext("2d",{willReadFrequently:!0}),a=()=>{if(!this.stream)return;const o=Math.min(1,640/Math.max(n.videoWidth,n.videoHeight)),r=Math.round(n.videoWidth*o),s=Math.round(n.videoHeight*o);if(r&&s){this.canvas.width=r,this.canvas.height=s;const c=performance.now();i.drawImage(n,0,0,r,s);const h=i.getImageData(0,0,r,s).data;this.onImage?.({rgba:h.buffer,width:r,height:s,fy:s/2/Math.tan(st()/2),t:c})}this.timer=window.setTimeout(a,150)};a()}stop(){clearTimeout(this.timer),this.stream?.getTracks().forEach(e=>e.stop()),this.stream=null,this.video.remove()}}class dt{worker;nextId=1;pending=new Map;busy=!1;constructor(){this.worker=new Worker(new URL("/namma-space-pages/app/assets/detector.worker-Ca6dXHvN.js",import.meta.url),{type:"module"}),this.worker.onmessage=e=>{const{id:n,markers:i,ms:a,error:o}=e.data;this.busy=!1,o&&console.warn("[detector]",o),this.pending.get(n)?.({markers:i,ms:a}),this.pending.delete(n)}}detect(e,n,i,a=0){if(this.busy)return null;this.busy=!0;const o=this.nextId++;return new Promise(r=>{this.pending.set(o,r),this.worker.postMessage({id:o,width:n,height:i,data:e,maxBitErrors:a},[e])})}dispose(){this.worker.terminate()}}const lt=.2,Se=2*Math.PI;function q(t){const e=Math.hypot(t[0],t[1],t[2],t[3]);if(!Number.isFinite(e)||e<1e-12)throw new Error(`cannot normalize quaternion with norm ${e}`);return[t[0]/e,t[1]/e,t[2]/e,t[3]/e]}const ht=t=>[0,Math.sin(t/2),0,Math.cos(t/2)];function xt(t,e){const n=Math.hypot(t[0],t[1],t[2]);if(n<1e-12)throw new Error("zero rotation axis");const i=Math.sin(e/2)/n;return[t[0]*i,t[1]*i,t[2]*i,Math.cos(e/2)]}function $(t,e){const[n,i,a,o]=t,[r,s,c,h]=e;return[o*r+n*h+i*c-a*s,o*s-n*c+i*h+a*r,o*c+n*s-i*r+a*h,o*h-n*r-i*s-a*c]}const ee=t=>[-t[0],-t[1],-t[2],t[3]];function P(t,e){const[n,i,a,o]=t,[r,s,c]=e,h=2*(i*c-a*s),d=2*(a*r-n*c),u=2*(n*s-i*r);return[r+o*h+(i*u-a*d),s+o*d+(a*h-n*u),c+o*u+(n*d-i*h)]}function we(t){let e=0;for(let r=0;r<3;r++)for(let s=0;s<3;s++){const c=t[r][0]*t[s][0]+t[r][1]*t[s][1]+t[r][2]*t[s][2];e=Math.max(e,Math.abs(c-(r===s?1:0)))}const n=t[0][0]*(t[1][1]*t[2][2]-t[1][2]*t[2][1])-t[0][1]*(t[1][0]*t[2][2]-t[1][2]*t[2][0])+t[0][2]*(t[1][0]*t[2][1]-t[1][1]*t[2][0]);if(!(e<=.001)||n<0)throw new Error("matrix is not a proper rotation");const i=t[0][0]+t[1][1]+t[2][2];let a;if(i>0){const r=.5/Math.sqrt(i+1);a=[(t[2][1]-t[1][2])*r,(t[0][2]-t[2][0])*r,(t[1][0]-t[0][1])*r,.25/r]}else if(t[0][0]>=t[1][1]&&t[0][0]>=t[2][2]){const r=2*Math.sqrt(1+t[0][0]-t[1][1]-t[2][2]);a=[.25*r,(t[1][0]+t[0][1])/r,(t[0][2]+t[2][0])/r,(t[2][1]-t[1][2])/r]}else if(t[1][1]>=t[2][2]){const r=2*Math.sqrt(1-t[0][0]+t[1][1]-t[2][2]);a=[(t[1][0]+t[0][1])/r,.25*r,(t[2][1]+t[1][2])/r,(t[0][2]-t[2][0])/r]}else{const r=2*Math.sqrt(1-t[0][0]-t[1][1]+t[2][2]);a=[(t[0][2]+t[2][0])/r,(t[2][1]+t[1][2])/r,.25*r,(t[1][0]-t[0][1])/r]}const o=q(a);return o[3]<0?[-o[0],-o[1],-o[2],-o[3]]:o}function O(t){let e=(t+Math.PI)%Se;return e!==0&&e<0&&(e+=Se),e-Math.PI}function X(t){const e=P(t,[0,0,-1]);if(Math.hypot(e[0],e[2])>=lt)return Math.atan2(-e[0],-e[2]);let n=P(t,[0,1,0]);if(e[1]>0&&(n=[-n[0],-n[1],-n[2]]),Math.hypot(n[0],n[2])<1e-9)throw new Error("heading undefined");return Math.atan2(-n[0],-n[2])}const Te=.4,z=(t,e)=>{const n=Math.cos(t),i=Math.sin(t);return[n*e[0]+i*e[2],e[1],-i*e[0]+n*e[2]]};function ut(t){if(t.length!==3||!t.every(Number.isFinite))throw new Error("expected a finite [x, y, z]")}function ft(t,e,n,i){[t,e,n,i].forEach(ut);const a=Math.atan2(n[0]-t[0],-(n[2]-t[2])),o=Math.atan2(i[0]-e[0],-(i[2]-e[2])),r=Math.hypot(n[0]-t[0],n[2]-t[2]),s=Math.hypot(i[0]-e[0],i[2]-e[2]);if(r<Te||s<Te||Math.abs(r-s)>Math.max(.5,.25*r))return null;const c=O(o-a),h=[0,1,2].map(x=>(t[x]+n[x])/2),d=[0,1,2].map(x=>(e[x]+i[x])/2),u=z(c,d);return{yaw:c,t:[h[0]-u[0],h[1]-u[1],h[2]-u[2]]}}function pt(t,e,n,i){if(![...t.position,...t.quaternion,...e.position,...e.quaternion,...i.position,...i.quaternion,n].every(Number.isFinite))throw new Error("non-finite input");const o=q(t.quaternion),r=q(e.quaternion),s=ee(o),c=P(s,t.position).map(f=>-f),h=$(r,s),d=P(r,c),u=[e.position[0]+d[0],e.position[1]+d[1],e.position[2]+d[2]],x=O(X(h)+n-X(i.quaternion)),l=z(x,i.position);return{yaw:x,t:[u[0]-l[0],u[1]-l[1],u[2]-l[2]]}}function je(t,e,n=[0,0,0]){const i=z(t.yaw,n),a=z(e.yaw,n);return[Math.hypot(i[0]+t.t[0]-a[0]-e.t[0],i[1]+t.t[1]-a[1]-e.t[1],i[2]+t.t[2]-a[2]-e.t[2]),Math.abs(O(e.yaw-t.yaw))]}function mt(t,e,n,i=ye,a=[0,0,0]){if(!e||!Number.isFinite(n)||n>i||![e.yaw,...e.t,...a,...t?[t.yaw,...t.t]:[]].every(Number.isFinite))return!0;if(!t)return!1;const[r,s]=je(t,e,a);return r>tt||s>nt}const ve=(t,e)=>t.map(n=>e[0].map((i,a)=>n.reduce((o,r,s)=>o+r*e[s][a],0))),Ve=(t,e)=>[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]],Xe=(t,e)=>t.reduce((n,i,a)=>n+i*e[a],0),fe=t=>Math.sqrt(Xe(t,t));function ke(t,e){const n=e.length,i=t.map((r,s)=>[...r,e[s]]);let a=0;for(const r of t)for(const s of r)a=Math.max(a,Math.abs(s));for(let r=0;r<n;r++){let s=r;for(let c=r+1;c<n;c++)Math.abs(i[c][r])>Math.abs(i[s][r])&&(s=c);if(Math.abs(i[s][r])<=1e-14*(a||1))return null;[i[r],i[s]]=[i[s],i[r]];for(let c=r+1;c<n;c++){const h=i[c][r]/i[r][r];for(let d=r;d<=n;d++)i[c][d]-=h*i[r][d]}}const o=new Array(n).fill(0);for(let r=n-1;r>=0;r--){let s=i[r][n];for(let c=r+1;c<n;c++)s-=i[r][c]*o[c];o[r]=s/i[r][r]}return o}function $e(t){const e=fe(t);if(e<1e-12)return[[1,-t[2],t[1]],[t[2],1,-t[0]],[-t[1],t[0],1]];const n=t.map(s=>s/e),i=[[0,-n[2],n[1]],[n[2],0,-n[0]],[-n[1],n[0],0]],a=ve(i,i),o=Math.sin(e),r=1-Math.cos(e);return i.map((s,c)=>s.map((h,d)=>(c===d?1:0)+o*h+r*a[c][d]))}function Ye(t){const e=[t[0][0],t[1][0],t[2][0]],n=[t[0][1],t[1][1],t[2][1]],i=fe(e),a=e.map(d=>d/i),o=Xe(a,n),r=n.map((d,u)=>d-o*a[u]),s=fe(r),c=r.map(d=>d/s),h=Ve(a,c);return[[a[0],c[0],h[0]],[a[1],c[1],h[1]],[a[2],c[2],h[2]]]}const bt=16;function gt(t){const e=[];let n=0;for(let i=0;i<4;i++){const a=t[i],o=t[(i+1)%4],r=t[(i+2)%4];e.push((o[0]-a[0])*(r[1]-o[1])-(o[1]-a[1])*(r[0]-o[0])),n+=a[0]*o[1]-o[0]*a[1]}return(e.every(i=>i>0)||e.every(i=>i<0))&&Math.abs(n)/2>=bt}function yt(t){const e=t/2;return[[-e,e,0],[e,e,0],[e,-e,0],[-e,-e,0]]}function pe(t,e,n,i,a){let o=0;for(let r=0;r<4;r++){const s=n[r],c=t[0][0]*s[0]+t[0][1]*s[1]+t[0][2]*s[2]+e[0],h=t[1][0]*s[0]+t[1][1]*s[1]+t[1][2]*s[2]+e[1],d=t[2][0]*s[0]+t[2][1]*s[1]+t[2][2]*s[2]+e[2];if(!(d>0))return 1/0;const u=a[0][0]*(c/d)+a[0][1]*(h/d)+a[0][2],x=a[1][1]*(h/d)+a[1][2];o+=(u-i[r][0])**2+(x-i[r][1])**2}return Math.sqrt(o/4)}function wt(t,e,n){const i=[[0,0,0],[0,0,0],[0,0,0]],a=[0,0,0];for(let o=0;o<4;o++){const r=e[o],s=[0,1,2].map(u=>t[u][0]*r[0]+t[u][1]*r[1]+t[u][2]*r[2]),[c,h]=n[o],d=[[[1,0,-c],c*s[2]-s[0]],[[0,1,-h],h*s[2]-s[1]]];for(const[u,x]of d)for(let l=0;l<3;l++){a[l]+=u[l]*x;for(let f=0;f<3;f++)i[l][f]+=u[l]*u[f]}}return ke(i,a)}function vt(t,e){const n=[],i=[];for(let A=0;A<4;A++){const[I,F]=t[A],[N,D]=e[A];n.push([I,F,1,0,0,0,-N*I,-N*F]),i.push(N),n.push([0,0,0,I,F,1,-D*I,-D*F]),i.push(D)}const a=ke(n,i);if(!a)return null;const o=[[a[0],a[1],a[2]],[a[3],a[4],a[5]],[a[6],a[7],1]],r=o[0][2],s=o[1][2],c=[[o[0][0]-o[2][0]*r,o[0][1]-o[2][1]*r],[o[1][0]-o[2][0]*s,o[1][1]-o[2][1]*s]],h=Math.sqrt(r*r+s*s+1),d=Math.hypot(r,s);let u;if(d<1e-12)u=[[1,0,0],[0,1,0],[0,0,1]];else{const A=Math.atan2(d/h,1/h);u=$e([-s/d*A,r/d*A,0])}const x=[[u[0][0]-r*u[2][0],u[0][1]-r*u[2][1]],[u[1][0]-s*u[2][0],u[1][1]-s*u[2][1]]],l=x[0][0]*x[1][1]-x[0][1]*x[1][0];if(Math.abs(l)<1e-12)return null;const f=[[x[1][1]/l,-x[0][1]/l],[-x[1][0]/l,x[0][0]/l]],k=f[0][0]*c[0][0]+f[0][1]*c[1][0],b=f[0][0]*c[0][1]+f[0][1]*c[1][1],g=f[1][0]*c[0][0]+f[1][1]*c[1][0],y=f[1][0]*c[0][1]+f[1][1]*c[1][1],_=k*k+b*b,w=k*g+b*y,p=g*g+y*y,R=.5*(_+p+Math.sqrt((_-p)**2+4*w*w));if(!(R>1e-24))return null;const v=Math.sqrt(R),T=k/v,M=b/v,C=g/v,E=y/v,S=Math.sqrt(Math.max(0,1-T*T-C*C));let B=Math.sqrt(Math.max(0,1-M*M-E*E));-(T*M+C*E)<0&&(B=-B);const m=[];for(const A of[1,-1]){const I=[T,C,A*S],F=[M,E,A*B],N=Ve(I,F),D=[[I[0],F[0],N[0]],[I[1],F[1],N[1]],[I[2],F[2],N[2]]];m.push(Ye(ve(u,D)))}return m}function kt(t,e,n,i,a){let o=t,r=e,s=pe(o,r,n,i,a),c=.001;const h=a[0][0],d=a[1][1],u=a[0][1];for(let x=0;x<100&&Number.isFinite(s)&&s>1e-12;x++){const l=Array.from({length:6},()=>new Array(6).fill(0)),f=new Array(6).fill(0);for(let b=0;b<4;b++){const g=n[b],y=[0,1,2].map(M=>o[M][0]*g[0]+o[M][1]*g[1]+o[M][2]*g[2]),_=y[0]+r[0],w=y[1]+r[1],p=y[2]+r[2],R=[h*(_/p)+u*(w/p)+a[0][2]-i[b][0],d*(w/p)+a[1][2]-i[b][1]],v=[[h/p,u/p,-(h*_+u*w)/(p*p)],[0,d/p,-d*w/(p*p)]],T=[[0,y[2],-y[1]],[-y[2],0,y[0]],[y[1],-y[0],0]];for(let M=0;M<2;M++){const C=[...[0,1,2].map(E=>v[M][0]*T[0][E]+v[M][1]*T[1][E]+v[M][2]*T[2][E]),...v[M]];for(let E=0;E<6;E++){f[E]+=C[E]*R[M];for(let S=0;S<6;S++)l[E][S]+=C[E]*C[S]}}}let k=!1;for(let b=0;b<10;b++){const g=l.map((R,v)=>R.map((T,M)=>v===M?T*(1+c)+1e-18:T)),y=ke(g,f.map(R=>-R));if(!y){c*=10;continue}const _=Ye(ve($e(y.slice(0,3)),o)),w=[r[0]+y[3],r[1]+y[4],r[2]+y[5]],p=pe(_,w,n,i,a);if(p<s){const R=Math.hypot(...y);o=_,r=w;const v=(s-p)/Math.max(s,1e-300);s=p,c=Math.max(c/10,1e-12),k=R>1e-15&&v>1e-14;break}c*=10}if(!k)break}return{R:o,T:r}}function Rt(t,e,n){if(t.length!==4||!t.every(x=>x.length===2&&x.every(Number.isFinite)))throw new Error("cornersPx must be 4 finite [u, v]");if(!(e>0)||!(n[0][0]>0)||!(n[1][1]>0))throw new Error("sizeM and focal lengths must be positive");if(!gt(t))return null;const i=yt(e),a=t.map(x=>{const l=(x[1]-n[1][2])/n[1][1];return[(x[0]-n[0][2]-n[0][1]*l)/n[0][0],l]}),o=vt(i,a);if(!o)return null;const r=[];for(const x of o){const l=wt(x,i,a);if(!l||!(l[2]>0))continue;const{R:f,T:k}=kt(x,l,i,t,n),b=pe(f,k,i,t,n);Number.isFinite(b)&&k[2]>0&&r.push({err:b,R:f,T:k})}if(!r.length)return null;r.sort((x,l)=>x.err-l.err);const{R:s,T:c}=r[0],d=s.map(x=>[x[0],x[2],-x[1]]).map((x,l)=>l===0?x:x.map(f=>-f));return{pose:{position:[c[0],-c[1],-c[2]],quaternion:we(d)},reprojErrPx:r[0].err,altReprojErrPx:r.length>1?r[1].err:1/0}}const At=.1;function Ge(t,e,n){if(t.length!==16)throw new Error("projection matrix must have 16 numbers");const i=Array.from(t);if(!i.every(Number.isFinite))throw new Error("projection matrix must be finite");if(!(e>0&&n>0))throw new Error("image size must be positive");const[a,o,r,s,c]=[i[0],i[4],i[8],i[5],i[9]];return Math.abs(i[11]+1)>1e-6||Math.abs(i[3])>1e-9||Math.abs(i[7])>1e-9||Math.abs(i[15])>1e-9||Math.abs(i[1])>1e-9||Math.abs(i[2])>1e-9||Math.abs(i[6])>1e-9||!(a>0&&s>0)||Math.abs(o)>1e-6*a?null:{fx:a*e/2,fy:s*n/2,cx:(1-r)*e/2-.5,cy:(1+c)*n/2-.5}}const _t=t=>[[t.fx,0,t.cx],[0,t.fy,t.cy],[0,0,1]];function Mt(t,e,n){if(![...t.position,...t.quaternion,...e.position,...e.quaternion,...n.position,...n.quaternion].every(Number.isFinite))throw new Error("non-finite input");const a=q(t.quaternion),o=q(e.quaternion),r=q(n.quaternion),s=$($(o,ee(a)),ee(r)),c=P(s,[0,1,0]),h=Math.acos(Math.max(-1,Math.min(1,c[1])));if(Math.hypot(s[1],s[3])<1e-6)return null;const d=O(2*Math.atan2(s[1],s[3])),u=P(r,t.position),x=[u[0]+n.position[0],u[1]+n.position[1],u[2]+n.position[2]],l=z(d,x),f=e.position;return{yaw:d,t:[f[0]-l[0],f[1]-l[1],f[2]-l[2]],residualTiltRad:h}}function Et(t,e=[0,0,0],n=At){if(!t.length||!(n>0))return null;const i=[];for(const b of t){const g=b.weight??1;if(b.t.length!==3||![b.yaw,g,...b.t].every(Number.isFinite)||g<0)return null;i.push(g)}const a=i.reduce((b,g)=>b+g,0);if(!(a>0))return null;let o=0,r=0;t.forEach((b,g)=>{o+=i[g]*Math.sin(b.yaw),r+=i[g]*Math.cos(b.yaw)});const s=Math.hypot(o,r)/a;if(s<1e-9)return null;const c=Math.atan2(o,r),h=Math.sqrt(Math.max(0,-2*Math.log(Math.min(1,s)))),d=t.map(b=>{const g=z(b.yaw,e);return[g[0]+b.t[0],g[1]+b.t[1],g[2]+b.t[2]]});let u=[0,1,2].map(b=>d.reduce((g,y,_)=>g+i[_]*y[b],0)/a);const x=b=>Math.hypot(b[0]-u[0],b[1]-u[1],b[2]-u[2]);for(let b=0;b<200;b++){const g=d.map((p,R)=>{const v=x(p);return i[R]*(v>n?n/Math.max(v,1e-300):1)}),y=g.reduce((p,R)=>p+R,0),_=[0,1,2].map(p=>d.reduce((R,v,T)=>R+g[T]*v[p],0)/y),w=Math.hypot(_[0]-u[0],_[1]-u[1],_[2]-u[2])<1e-12;if(u=_,w)break}let l=0,f=0;d.forEach((b,g)=>{const y=x(b);l+=i[g]*y*y,y<=n&&i[g]>0&&f++});const k=z(c,e);return{yaw:c,t:[u[0]-k[0],u[1]-k[1],u[2]-k[2]],spreadYawRad:h,spreadM:Math.sqrt(l/a),inliers:f,n:t.length}}function St(t){const e=Math.hypot(t[0],t[1],t[2]);if(!Number.isFinite(e)||e<1e-12)throw new Error("zero normal");const n=[t[0]/e,t[1]/e,t[2]/e],i=n[1],a=[-n[2],0,n[0]],o=Math.hypot(a[0],a[1],a[2]);if(o<1e-12)return i>0?[[1,0,0],[0,1,0],[0,0,1]]:[[1,0,0],[0,-1,0],[0,0,-1]];const r=a.map(c=>c/o),s=[[0,-r[2],r[1]],[r[2],0,-r[0]],[-r[1],r[0],0]];return s.map((c,h)=>c.map((d,u)=>(h===u?1:0)+o*d+(1-i)*(s[h][0]*s[0][u]+s[h][1]*s[1][u]+s[h][2]*s[2][u])))}const ae=Math.PI/180;function Tt(t,e,n){const i=t*ae,a=e*ae,o=n*ae,r=Math.cos(i),s=Math.sin(i),c=Math.cos(a),h=Math.sin(a),d=Math.cos(o),u=Math.sin(o),x=[[r*d-s*h*u,-s*c,r*u+s*h*d],[s*d+r*h*u,r*c,s*u-r*h*d],[-c*u,h,c*d]];return we([x[0],x[2],x[1].map(l=>-l)])}class It{constructor(e={}){this.opts=e,this.ori=[],this.gyro=[],this.lastSource=null}get maxGap(){return this.opts.maxGapMs??200}prune(e,n){const i=this.opts.keepMs??2e4;for(;e.length&&e[0].t<n-i;)e.shift()}addOrientation(e,n,i,a){if(n==null||i==null||a==null||![e,n,i,a].every(Number.isFinite))return;const o=Tt(n,i,a);this.ori.push({t:e,yaw:X(o),q:o}),this.prune(this.ori,e)}addGyro(e,n,i,a,o){if(![e,n,i,a].every(Number.isFinite))return;const r=o&&o.every(Number.isFinite)&&Math.hypot(...o)>1e-6?o.slice(0,3):void 0;this.gyro.push({t:e,w:[n,i,a],up:r}),this.prune(this.gyro,e)}reset(){this.ori=[],this.gyro=[],this.lastSource=null}window(e,n,i){if(!e.length)return null;let a=-1;for(let s=0;s<e.length;s++)e[s].t<=n&&(a=s);a<0&&(a=0);let o=-1;for(let s=e.length-1;s>=0;s--)e[s].t>=i&&(o=s);if(o<0&&(o=e.length-1),Math.abs(e[a].t-n)>this.maxGap||Math.abs(e[o].t-i)>this.maxGap||o<a)return null;const r=e.slice(a,o+1);for(let s=1;s<r.length;s++)if(r[s].t-r[s-1].t>this.maxGap)return null;return r}deltaYaw(e,n){if(!(n>=e))throw new Error("t1Ms must be >= t0Ms");const i=this.window(this.ori,e,n);if(i){let o=0;for(let r=1;r<i.length;r++)o+=O(i[r].yaw-i[r-1].yaw);return this.lastSource="orientation",o}const a=this.window(this.gyro,e,n);if(a){const o=a.find(x=>x.up)?.up??this.upFromOrientation(e);if(!o)return this.lastSource=null;let r=we(St(o)),c=X(r),h=0;const d=(x,l)=>{if(l<=0)return;const f=l/1e3,k=Math.hypot(x[0],x[1],x[2])*f,b=k>1e-12?Math.sin(k/2)/(k/f):f/2;r=q($(r,[x[0]*b,x[1]*b,x[2]*b,Math.cos(k/2)]));const g=X(r);h+=O(g-c),c=g};a[0].t>e&&d(a[0].w,a[0].t-e);for(let x=0;x+1<a.length;x++){const l=Math.max(a[x].t,e),f=Math.min(a[x+1].t,n),k=[(a[x].w[0]+a[x+1].w[0])/2,(a[x].w[1]+a[x+1].w[1])/2,(a[x].w[2]+a[x+1].w[2])/2];d(k,f-l)}const u=a[a.length-1];return u.t<n&&d(u.w,n-u.t),this.lastSource="gyroscope",h}return this.lastSource=null,null}upFromOrientation(e){let n=null;for(const i of this.ori)(!n||Math.abs(i.t-e)<Math.abs(n.t-e))&&(n=i);return!n||Math.abs(n.t-e)>this.maxGap?null:P(ee(n.q),[0,1,0])}}const K=O,He=t=>X(t),Ie=(t,e)=>$(t,e),Ft=(t,e)=>P(t,e),me=ht,Fe=(t,e)=>xt(t,e);function L(t,e){const n=z(t.yaw,e);return[n[0]+t.t[0],n[1]+t.t[1],n[2]+t.t[2]]}function Ct(t){const e=z(-t.yaw,t.t);return{yaw:-t.yaw,t:[-e[0],-e[1],-e[2]]}}function be(t,e){const n=P(t.quaternion,e.position);return{position:[t.position[0]+n[0],t.position[1]+n[1],t.position[2]+n[2]],quaternion:q($(t.quaternion,e.quaternion))}}function Dt(t){const e=ee(t.quaternion),n=P(e,t.position);return{position:[-n[0],-n[1],-n[2]],quaternion:e}}function Ce(t,e,n){return Rt(t,e,_t(n))}function Nt(t,e,n,i,a){const o=n.position,r=[];for(const[p,R]of t){const v=P(n.quaternion,[(p-e.cx)/e.fx,-(R-e.cy)/e.fy,-1]);if(v[1]>-.05)return null;r.push([-v[0]/v[1],-1,-v[2]/v[1]])}let s=0;for(let p=0;p<4;p++)s+=Math.hypot(r[(p+1)%4][0]-r[p][0],r[(p+1)%4][2]-r[p][2]);const c=a/(s/4);if(!(c>.1&&c<4))return null;const h=a/2,d=[[-h,0,-h],[h,0,-h],[h,0,h],[-h,0,h]],u=r.map(p=>[o[0]+c*p[0],o[1]-c,o[2]+c*p[2]]),x=d.map(p=>be(i,{position:p,quaternion:[0,0,0,1]}).position),l=[0,1,2].map(p=>u.reduce((R,v)=>R+v[p],0)/4),f=[0,1,2].map(p=>x.reduce((R,v)=>R+v[p],0)/4);let k=0,b=0;for(let p=0;p<4;p++){const R=u[p][0]-l[0],v=u[p][2]-l[2],T=x[p][0]-f[0],M=x[p][2]-f[2];b+=T*R+M*v,k+=T*v-M*R}const g=Math.atan2(k,b),y=z(g,l),_=[f[0]-y[0],f[1]-y[1],f[2]-y[2]];let w=0;for(let p=0;p<4;p++){const R=L({yaw:g,t:_},u[p]);w+=(R[0]-x[p][0])**2+(R[2]-x[p][2])**2}return{mapFromXr:{yaw:g,t:_},markerXr:l,residualM:Math.sqrt(w/4),rangeM:Math.hypot(l[0]-o[0],l[1]-o[1],l[2]-o[2])}}const Lt={composeMapFromXr:pt,solveTwo:ft,shouldRefuse:mt,disagreement:je,fuseMarkerObservations:Et};function De(t){let e=0;for(let n=1;n<t.length;n++)e+=Math.hypot(t[n][0]-t[n-1][0],t[n][1]-t[n-1][1]);return e}function We(t,e){if(t.length===1)return{dist:Math.hypot(e[0]-t[0][0],e[1]-t[0][1]),along:0,seg:0,point:t[0]};let n={dist:1/0,along:0,seg:0,point:t[0]},i=0;for(let a=1;a<t.length;a++){const o=t[a-1],r=t[a],s=r[0]-o[0],c=r[1]-o[1],h=s*s+c*c,d=Math.sqrt(h),u=h>0?Math.max(0,Math.min(1,((e[0]-o[0])*s+(e[1]-o[1])*c)/h)):0,x=[o[0]+u*s,o[1]+u*c],l=Math.hypot(e[0]-x[0],e[1]-x[1]);l<n.dist-1e-9&&(n={dist:l,along:i+u*d,seg:a-1,point:x}),i+=d}return n}function ge(t,e){let n=0;for(let i=1;i<t.length;i++){const a=t[i-1],o=t[i],r=Math.hypot(o[0]-a[0],o[1]-a[1]);if(r!==0){if(n+r>=e||i===t.length-1){const s=Math.max(0,Math.min(1,(e-n)/r));return{point:[a[0]+s*(o[0]-a[0]),a[1]+s*(o[1]-a[1])],dir:[(o[0]-a[0])/r,(o[1]-a[1])/r]}}n+=r}}return{point:t[t.length-1],dir:[0,-1]}}function Pt(t,e=30*Math.PI/180){const n=[];let i=0;for(let a=1;a<t.length-1;a++){const o=t[a-1],r=t[a],s=t[a+1];i+=Math.hypot(r[0]-o[0],r[1]-o[1]);const c=Math.atan2(r[1]-o[1],r[0]-o[0]),h=Math.atan2(s[1]-r[1],s[0]-r[0]),d=K(h-c);if(Math.abs(d)>=e){const u=(r[0]-o[0])*(s[1]-r[1])-(r[1]-o[1])*(s[0]-r[0]);n.push({index:a,along:i,dir:u>0?"right":"left",angle:Math.abs(d)})}}return n}const zt=(t,e)=>Math.atan2(-t,-e),Ke=(t,e)=>Math.hypot(t[0]-e[0],t[1]-e[1]);function Bt(t,e){const n=Math.max(1,Math.round(e));return`Turn ${t} in ${n} ${n===1?"metre":"metres"}`}const W={CHEVRON:0,LINE:1,RING:2,DEST:3,SQUARE:4},qt=`#version 300 es
layout(location=0) in vec2 a_uv;
layout(location=1) in vec4 i_pose;   // x, z, dirX, dirZ (map frame)
layout(location=2) in vec4 i_param;  // halfAcross, halfAlong, kind, phase
layout(location=3) in vec4 i_color;  // rgb, alpha
uniform mat4 u_proj, u_view, u_model;
uniform float u_floorY;
out vec2 v_uv; out vec4 v_param; out vec4 v_color;
void main(){
  vec2 d = i_pose.zw;
  vec2 across = vec2(-d.y, d.x);
  vec2 p = i_pose.xy + across * a_uv.x * i_param.x + d * a_uv.y * i_param.y;
  gl_Position = u_proj * u_view * u_model * vec4(p.x, u_floorY + 0.01, p.y, 1.0);
  v_uv = a_uv; v_param = i_param; v_color = i_color;
}`,Ot=`#version 300 es
precision mediump float;
in vec2 v_uv; in vec4 v_param; in vec4 v_color;
uniform float u_time;
out vec4 o;
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h); }
void main(){
  int kind = int(v_param.z + 0.5);
  float a = 0.0;
  if (kind == 0) {            // chevron pointing along +v
    vec2 q = vec2(abs(v_uv.x), v_uv.y);
    float d = seg(q, vec2(0.0, 0.55), vec2(0.9, -0.35));
    float core = smoothstep(0.17, 0.09, d);
    float glow = exp(-d * 5.0) * 0.55;
    float wave = fract(v_param.w * 0.6 - u_time * 1.4);   // bright band sweeping forward
    float pulse = 0.35 + 0.65 * pow(wave, 3.0);
    a = (core + glow) * pulse;
  } else if (kind == 1) {     // guide line
    float d = abs(v_uv.x);
    a = smoothstep(0.35, 0.0, d) * 0.8 + exp(-d * 3.0) * 0.25;
  } else if (kind == 2) {     // reticle ring
    float d = abs(length(v_uv) - 0.75);
    a = smoothstep(0.12, 0.04, d) + exp(-d * 8.0) * 0.4;
    a *= step(length(v_uv), 1.0);
    a += smoothstep(0.12, 0.05, length(v_uv));
  } else if (kind == 3) {     // destination: pulsing rings
    float r = length(v_uv);
    float ring = abs(fract(r * 2.0 - u_time * 0.8) - 0.5);
    a = smoothstep(0.12, 0.02, ring) * smoothstep(1.0, 0.6, r) + smoothstep(0.25, 0.15, r);
  } else {                    // square outline
    vec2 q = abs(v_uv);
    float d = abs(max(q.x, q.y) - 0.92);
    a = smoothstep(0.08, 0.02, d);
  }
  a *= v_color.a;
  o = vec4(v_color.rgb * a, a);   // premultiplied
}`,Ne=[.15,.95,1];class Ut{constructor(e){this.gl=e,this.prog=Z(e,qt,Ot);for(const i of["u_proj","u_view","u_model","u_floorY","u_time"])this.u[i]=e.getUniformLocation(this.prog,i);this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);const n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.inst=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.inst),e.bufferData(e.ARRAY_BUFFER,this.data.byteLength,e.DYNAMIC_DRAW);for(let i=0;i<3;i++)e.enableVertexAttribArray(1+i),e.vertexAttribPointer(1+i,4,e.FLOAT,!1,48,i*16),e.vertexAttribDivisor(1+i,1);e.bindVertexArray(null)}gl;prog;vao;inst;data=new Float32Array(12*512);count=0;u={};push(e,n,i,a,o,r,s,c,h,d){this.count>=512||(this.data.set([e,n,i,a,o,r,s,c,h[0],h[1],h[2],d],this.count*12),this.count++)}build(e){if(this.count=0,e.showArrows&&e.route&&e.route.length>1&&e.mapFromXr){const n=Math.max(0,e.along+.8),i=Math.min(e.routeLengthM,e.along+14);for(let a=Math.max(0,e.along);a<i;a+=.5){const o=ge(e.route,a+.25),r=1-Math.max(0,(a-e.along)/14);this.push(o.point[0],o.point[1],o.dir[0],o.dir[1],.035,.26,W.LINE,a,Ne,.55*r)}for(let a=n-n%.7;a<i;a+=.7){if(a<n)continue;const o=ge(e.route,a),r=Math.min(1,(a-e.along)/1.5)*(1-Math.max(0,(a-e.along-6)/8));this.push(o.point[0],o.point[1],o.dir[0],o.dir[1],.22,.2,W.CHEVRON,a,Ne,r)}}e.destination&&e.showArrows&&this.push(e.destination[0],e.destination[1],0,-1,.6,.6,W.DEST,0,[1,.25,.85],.9);for(const n of e.markerOutlines){const i=(n[0][0]+n[2][0])/2,a=(n[0][2]+n[2][2])/2,o=n[0][0]-n[3][0],r=n[0][2]-n[3][2],s=Math.hypot(o,r)||1;this.push(i,a,o/s,r/s,s/2/.92,s/2/.92,W.SQUARE,0,[1,.85,.2],.9)}if(e.reticle&&e.mapFromXr){const n=L(e.mapFromXr,e.reticle);this.push(n[0],n[2],0,-1,.12,.12,W.RING,0,e.reticleColor,1)}return this.count}draw(e,n,i,a,o){const r=this.gl;this.count&&(r.useProgram(this.prog),r.uniformMatrix4fv(this.u.u_proj,!1,e),r.uniformMatrix4fv(this.u.u_view,!1,n),r.uniformMatrix4fv(this.u.u_model,!1,jt(Ct(i??{yaw:0,t:[0,0,0]}))),r.uniform1f(this.u.u_floorY,a),r.uniform1f(this.u.u_time,o),r.bindVertexArray(this.vao),r.bindBuffer(r.ARRAY_BUFFER,this.inst),r.bufferSubData(r.ARRAY_BUFFER,0,this.data,0,this.count*12),r.disable(r.DEPTH_TEST),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA),r.drawArraysInstanced(r.TRIANGLE_STRIP,0,4,this.count),r.bindVertexArray(null))}}function jt(t){const e=Math.cos(t.yaw),n=Math.sin(t.yaw);return new Float32Array([e,0,-n,0,0,1,0,0,n,0,e,0,t.t[0],t.t[1],t.t[2],1])}function Z(t,e,n){const i=(o,r)=>{const s=t.createShader(o);if(t.shaderSource(s,r),t.compileShader(s),!t.getShaderParameter(s,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(s)??"shader");return s},a=t.createProgram();if(t.attachShader(a,i(t.VERTEX_SHADER,e)),t.attachShader(a,i(t.FRAGMENT_SHADER,n)),t.linkProgram(a),!t.getProgramParameter(a,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(a)??"link");return a}function re(t,e){const[n,i,a,o]=t;return new Float32Array([1-2*(i*i+a*a),2*(n*i+a*o),2*(n*a-i*o),0,2*(n*i-a*o),1-2*(n*n+a*a),2*(i*a+n*o),0,2*(n*a+i*o),2*(i*a-n*o),1-2*(n*n+i*i),0,e[0],e[1],e[2],1])}function oe(t){const e=new Float32Array(16);return e[0]=t[0],e[1]=t[4],e[2]=t[8],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[12]=-(e[0]*t[12]+e[4]*t[13]+e[8]*t[14]),e[13]=-(e[1]*t[12]+e[5]*t[13]+e[9]*t[14]),e[14]=-(e[2]*t[12]+e[6]*t[13]+e[10]*t[14]),e[15]=1,e}function Le(t,e,n=.05,i=100){const a=1/Math.tan(t/2);return new Float32Array([a/e,0,0,0,0,a,0,0,0,0,(i+n)/(n-i),-1,0,0,2*i*n/(n-i),0])}const Vt=`#version 300 es
out vec2 v_uv;
void main(){ vec2 p = vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2)); v_uv = p; gl_Position = vec4(p*2.0-1.0, 0.0, 1.0); }`,Xt=`#version 300 es
precision mediump float;
in vec2 v_uv; uniform sampler2D u_cam; out vec4 o;
void main(){ vec3 c = texture(u_cam, v_uv).rgb; float y = dot(c, vec3(0.299, 0.587, 0.114)); o = vec4(y, y, y, 1.0); }`,Pe=t=>({position:[t.position.x,t.position.y,t.position.z],quaternion:[t.orientation.x,t.orientation.y,t.orientation.z,t.orientation.w]});class $t{gl;onFrame=null;onCameraImage=null;onTap=null;onEnd=null;flipRows=!0;lastError="";canvas=document.createElement("canvas");session=null;layer=null;ref=null;hitSource=null;binding=null;reticle=null;hz=5;ds=2;lastCapture=0;dsProg=null;fbo=null;fboTex=null;fboSize=[0,0];pbo=null;pending=null;constructor(){const e=this.canvas.getContext("webgl2",{xrCompatible:!0,alpha:!0,antialias:!1,depth:!1});if(!e)throw new Error("WebGL2 unavailable");this.gl=e}setCapture(e,n){this.hz=e,this.ds=n}async start(e){if(!navigator.xr)throw new Error("WebXR not available");const n={requiredFeatures:["local-floor"],optionalFeatures:["hit-test","anchors","dom-overlay","camera-access"],domOverlay:{root:e}},i=await navigator.xr.requestSession("immersive-ar",n);this.session=i;const a=this.gl;await a.makeXRCompatible(),this.layer=new XRWebGLLayer(i,a,{alpha:!0,antialias:!1,depth:!1}),i.updateRenderState({baseLayer:this.layer}),this.ref=await i.requestReferenceSpace("local-floor");const o=await i.requestReferenceSpace("viewer"),r=[...i.enabledFeatures??[]];try{this.hitSource=await i.requestHitTestSource?.({space:o})??null}catch(h){this.lastError=`hit-test: ${h}`}const s=globalThis.XRWebGLBinding,c=r.includes("camera-access")&&!!s;return c&&s&&(this.binding=new s(i,a)),e.addEventListener("beforexrselect",h=>{h.target?.closest?.("[data-ui]")&&h.preventDefault()}),i.addEventListener("select",h=>{this.reticle&&this.onTap?.(this.reticle,(h.frame,performance.now()))}),i.addEventListener("end",()=>{this.session=null,this.hitSource=null,this.binding=null,this.pending=null,this.onEnd?.()}),i.requestAnimationFrame(this.loop),{cameraAccess:c,hitTest:!!this.hitSource,enabledFeatures:r}}end(){this.session?.end().catch(()=>{})}loop=(e,n)=>{const i=this.session;if(!i||!this.ref||!this.layer)return;i.requestAnimationFrame(this.loop);const a=this.gl,o=n.getViewerPose(this.ref);if(this.reticle=null,this.hitSource){const h=n.getHitTestResults(this.hitSource)[0]?.getPose(this.ref);h&&(this.reticle=[h.transform.position.x,h.transform.position.y,h.transform.position.z])}this.pollRead(e),a.bindFramebuffer(a.FRAMEBUFFER,this.layer.framebuffer),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT);const r=[];if(o){for(const h of o.views){const d=this.layer.getViewport(h);r.push({projection:h.projectionMatrix,viewMatrix:h.transform.inverse.matrix,viewport:[d.x,d.y,d.width,d.height],framebuffer:this.layer.framebuffer})}const c=o.views[0].camera;if(c&&this.binding&&this.onCameraImage&&!this.pending&&e-this.lastCapture>=1e3/this.hz&&!o.emulatedPosition){this.lastCapture=e;try{this.capture(c,o.views[0],e)}catch(h){this.lastError=`capture: ${h}`}}}const s={t:e,viewer:o?Pe(o.transform):null,emulated:!!o?.emulatedPosition,views:r,reticle:this.reticle};a.bindFramebuffer(a.FRAMEBUFFER,this.layer.framebuffer),this.onFrame?.(s)};capture(e,n,i){const a=this.gl,o=this.binding.getCameraImage(e);if(!o)return;const r=Math.max(64,Math.floor(e.width/this.ds)),s=Math.max(64,Math.floor(e.height/this.ds));this.dsProg||(this.dsProg=Z(a,Vt,Xt)),(!this.fbo||this.fboSize[0]!==r||this.fboSize[1]!==s)&&(this.fboTex=a.createTexture(),a.bindTexture(a.TEXTURE_2D,this.fboTex),a.texStorage2D(a.TEXTURE_2D,1,a.RGBA8,r,s),this.fbo=a.createFramebuffer(),a.bindFramebuffer(a.FRAMEBUFFER,this.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,this.fboTex,0),this.pbo=a.createBuffer(),a.bindBuffer(a.PIXEL_PACK_BUFFER,this.pbo),a.bufferData(a.PIXEL_PACK_BUFFER,r*s*4,a.STREAM_READ),a.bindBuffer(a.PIXEL_PACK_BUFFER,null),this.fboSize=[r,s]);const c=performance.now();a.bindFramebuffer(a.FRAMEBUFFER,this.fbo),a.viewport(0,0,r,s),a.disable(a.BLEND),a.useProgram(this.dsProg),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,o),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.uniform1i(a.getUniformLocation(this.dsProg,"u_cam"),0),a.bindVertexArray(null),a.drawArrays(a.TRIANGLES,0,3),a.bindBuffer(a.PIXEL_PACK_BUFFER,this.pbo),a.readPixels(0,0,r,s,a.RGBA,a.UNSIGNED_BYTE,0),a.bindBuffer(a.PIXEL_PACK_BUFFER,null);const h=a.fenceSync(a.SYNC_FENCE,0),d=Ge(n.projectionMatrix,r,s);d&&(this.pending={sync:h,w:r,h:s,K:d,pose:Pe(n.transform),t:i,t0:c})}pollRead(e){const n=this.pending;if(!n)return;const i=this.gl,a=i.clientWaitSync(n.sync,0,0);if(a===i.TIMEOUT_EXPIRED||(i.deleteSync(n.sync),this.pending=null,a===i.WAIT_FAILED))return;const o=new Uint8Array(n.w*n.h*4);i.bindBuffer(i.PIXEL_PACK_BUFFER,this.pbo),i.getBufferSubData(i.PIXEL_PACK_BUFFER,0,o),i.bindBuffer(i.PIXEL_PACK_BUFFER,null),this.flipRows&&Ze(o,n.w,n.h),this.onCameraImage?.({t:n.t,rgba:o.buffer,width:n.w,height:n.h,K:n.K,xrFromView:n.pose,readMs:performance.now()-n.t0})}}function Ze(t,e,n){const i=new Uint8Array(e*4);for(let a=0;a<n>>1;a++){const o=a*e*4,r=(n-1-a)*e*4;i.set(t.subarray(o,o+e*4)),t.copyWithin(o,r,r+e*4),t.set(i,r)}}const Yt=`/*
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "OpenCV: Open Computer Vision Library"
  http://sourceforge.net/projects/opencvlibrary/
- "Stack Blur: Fast But Goodlooking"
  http://incubator.quasimondo.com/processing/fast_blur_deluxe.php
*/

var CV = CV || {};
this.CV = CV;

CV.Image = function(width, height, data){
  this.width = width || 0;
  this.height = height || 0;
  this.data = data || [];
};

CV.grayscale = function(imageSrc, imageDst){
  var src = imageSrc.data, dst = imageDst.data, len = src.length,
      i = 0, j = 0;

  for (; i < len; i += 4){
    dst[j ++] =
      (src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 + 0.5) & 0xff;
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

  return imageDst;
};

CV.threshold = function(imageSrc, imageDst, threshold){
  var src = imageSrc.data, dst = imageDst.data,
      len = src.length, tab = [], i;

  for (i = 0; i < 256; ++ i){
    tab[i] = i <= threshold? 0: 255;
  }

  for (i = 0; i < len; ++ i){
    dst[i] = tab[ src[i] ];
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

  return imageDst;
};

CV.adaptiveThreshold = function(imageSrc, imageDst, kernelSize, threshold){
  var src = imageSrc.data, dst = imageDst.data, len = src.length, tab = [], i;

  CV.stackBoxBlur(imageSrc, imageDst, kernelSize);

  for (i = 0; i < 768; ++ i){
    tab[i] = (i - 255 <= -threshold)? 255: 0;
  }

  for (i = 0; i < len; ++ i){
    dst[i] = tab[ src[i] - dst[i] + 255 ];
  }

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

  return imageDst;
};

CV.otsu = function(imageSrc){
  var src = imageSrc.data, len = src.length, hist = [],
      threshold = 0, sum = 0, sumB = 0, wB = 0, wF = 0, max = 0,
      mu, between, i;

  for (i = 0; i < 256; ++ i){
    hist[i] = 0;
  }

  for (i = 0; i < len; ++ i){
    hist[ src[i] ] ++;
  }

  for (i = 0; i < 256; ++ i){
    sum += hist[i] * i;
  }

  for (i = 0; i < 256; ++ i){
    wB += hist[i];
    if (0 !== wB){

      wF = len - wB;
      if (0 === wF){
        break;
      }

      sumB += hist[i] * i;

      mu = (sumB / wB) - ( (sum - sumB) / wF );

      between = wB * wF * mu * mu;

      if (between > max){
        max = between;
        threshold = i;
      }
    }
  }

  return threshold;
};

CV.stackBoxBlurMult =
  [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265];

CV.stackBoxBlurShift =
  [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13];

CV.BlurStack = function(){
  this.color = 0;
  this.next = null;
};

CV.stackBoxBlur = function(imageSrc, imageDst, kernelSize){
  var src = imageSrc.data, dst = imageDst.data,
      height = imageSrc.height, width = imageSrc.width,
      heightMinus1 = height - 1, widthMinus1 = width - 1,
      size = kernelSize + kernelSize + 1, radius = kernelSize + 1,
      mult = CV.stackBoxBlurMult[kernelSize],
      shift = CV.stackBoxBlurShift[kernelSize],
      stack, stackStart, color, sum, pos, start, p, x, y, i;

  stack = stackStart = new CV.BlurStack();
  for (i = 1; i < size; ++ i){
    stack = stack.next = new CV.BlurStack();
  }
  stack.next = stackStart;

  pos = 0;

  for (y = 0; y < height; ++ y){
    start = pos;

    color = src[pos];
    sum = radius * color;

    stack = stackStart;
    for (i = 0; i < radius; ++ i){
      stack.color = color;
      stack = stack.next;
    }
    for (i = 1; i < radius; ++ i){
      stack.color = src[pos + i];
      sum += stack.color;
      stack = stack.next;
    }

    stack = stackStart;
    for (x = 0; x < width; ++ x){
      dst[pos ++] = (sum * mult) >>> shift;

      p = x + radius;
      p = start + (p < widthMinus1? p: widthMinus1);
      sum -= stack.color - src[p];

      stack.color = src[p];
      stack = stack.next;
    }
  }

  for (x = 0; x < width; ++ x){
    pos = x;
    start = pos + width;

    color = dst[pos];
    sum = radius * color;

    stack = stackStart;
    for (i = 0; i < radius; ++ i){
      stack.color = color;
      stack = stack.next;
    }
    for (i = 1; i < radius; ++ i){
      stack.color = dst[start];
      sum += stack.color;
      stack = stack.next;

      start += width;
    }

    stack = stackStart;
    for (y = 0; y < height; ++ y){
      dst[pos] = (sum * mult) >>> shift;

      p = y + radius;
      p = x + ( (p < heightMinus1? p: heightMinus1) * width );
      sum -= stack.color - dst[p];

      stack.color = dst[p];
      stack = stack.next;

      pos += width;
    }
  }

  return imageDst;
};

CV.gaussianBlur = function(imageSrc, imageDst, imageMean, kernelSize){
  var kernel = CV.gaussianKernel(kernelSize);

  imageDst.width = imageSrc.width;
  imageDst.height = imageSrc.height;

  imageMean.width = imageSrc.width;
  imageMean.height = imageSrc.height;

  CV.gaussianBlurFilter(imageSrc, imageMean, kernel, true);
  CV.gaussianBlurFilter(imageMean, imageDst, kernel, false);

  return imageDst;
};

CV.gaussianBlurFilter = function(imageSrc, imageDst, kernel, horizontal){
  var src = imageSrc.data, dst = imageDst.data,
      height = imageSrc.height, width = imageSrc.width,
      pos = 0, limit = kernel.length >> 1,
      cur, value, i, j, k;

  for (i = 0; i < height; ++ i){

    for (j = 0; j < width; ++ j){
      value = 0.0;

      for (k = -limit; k <= limit; ++ k){

        if (horizontal){
          cur = pos + k;
          if (j + k < 0){
            cur = pos;
          }
          else if (j + k >= width){
            cur = pos;
          }
        }else{
          cur = pos + (k * width);
          if (i + k < 0){
            cur = pos;
          }
          else if (i + k >= height){
            cur = pos;
          }
        }

        value += kernel[limit + k] * src[cur];
      }

      dst[pos ++] = horizontal? value: (value + 0.5) & 0xff;
    }
  }

  return imageDst;
};

CV.gaussianKernel = function(kernelSize){
  var tab =
    [ [1],
      [0.25, 0.5, 0.25],
      [0.0625, 0.25, 0.375, 0.25, 0.0625],
      [0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125] ],
    kernel = [], center, sigma, scale2X, sum, x, i;

  if ( (kernelSize <= 7) && (kernelSize % 2 === 1) ){
    kernel = tab[kernelSize >> 1];
  }else{
    center = (kernelSize - 1.0) * 0.5;
    sigma = 0.8 + (0.3 * (center - 1.0) );
    scale2X = -0.5 / (sigma * sigma);
    sum = 0.0;
    for (i = 0; i < kernelSize; ++ i){
      x = i - center;
      sum += kernel[i] = Math.exp(scale2X * x * x);
    }
    sum = 1 / sum;
    for (i = 0; i < kernelSize; ++ i){
      kernel[i] *= sum;
    }
  }

  return kernel;
};

CV.findContours = function(imageSrc, binary){
  var width = imageSrc.width, height = imageSrc.height, contours = [],
      src, deltas, pos, pix, nbd, outer, hole, i, j;

  src = CV.binaryBorder(imageSrc, binary);

  deltas = CV.neighborhoodDeltas(width + 2);

  pos = width + 3;
  nbd = 1;

  for (i = 0; i < height; ++ i, pos += 2){

    for (j = 0; j < width; ++ j, ++ pos){
      pix = src[pos];

      if (0 !== pix){
        outer = hole = false;

        if (1 === pix && 0 === src[pos - 1]){
          outer = true;
        }
        else if (pix >= 1 && 0 === src[pos + 1]){
          hole = true;
        }

        if (outer || hole){
          ++ nbd;

          contours.push( CV.borderFollowing(src, pos, nbd, {x: j, y: i}, hole, deltas) );
        }
      }
    }
  }

  return contours;
};

CV.borderFollowing = function(src, pos, nbd, point, hole, deltas){
  var contour = [], pos1, pos3, pos4, s, s_end, s_prev;

  contour.hole = hole;

  s = s_end = hole? 0: 4;
  do{
    s = (s - 1) & 7;
    pos1 = pos + deltas[s];
    if (src[pos1] !== 0){
      break;
    }
  }while(s !== s_end);

  if (s === s_end){
    src[pos] = -nbd;
    contour.push( {x: point.x, y: point.y} );

  }else{
    pos3 = pos;
    s_prev = s ^ 4;

    while(true){
      s_end = s;

      do{
        pos4 = pos3 + deltas[++ s];
      }while(src[pos4] === 0);

      s &= 7;

      if ( ( (s - 1) >>> 0) < (s_end >>> 0) ){
        src[pos3] = -nbd;
      }
      else if (src[pos3] === 1){
        src[pos3] = nbd;
      }

      contour.push( {x: point.x, y: point.y} );

      s_prev = s;

      point.x += CV.neighborhood[s][0];
      point.y += CV.neighborhood[s][1];

      if ( (pos4 === pos) && (pos3 === pos1) ){
        break;
      }

      pos3 = pos4;
      s = (s + 4) & 7;
    }
  }

  return contour;
};

CV.neighborhood =
  [ [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1] ];

CV.neighborhoodDeltas = function(width){
  var deltas = [], len = CV.neighborhood.length, i = 0;

  for (; i < len; ++ i){
    deltas[i] = CV.neighborhood[i][0] + (CV.neighborhood[i][1] * width);
  }

  return deltas.concat(deltas);
};

CV.approxPolyDP = function(contour, epsilon){
  var slice = {start_index: 0, end_index: 0},
      right_slice = {start_index: 0, end_index: 0},
      poly = [], stack = [], len = contour.length,
      pt, start_pt, end_pt, dist, max_dist, le_eps,
      dx, dy, i, j, k;

  epsilon *= epsilon;

  k = 0;

  for (i = 0; i < 3; ++ i){
    max_dist = 0;

    k = (k + right_slice.start_index) % len;
    start_pt = contour[k];
    if (++ k === len) {k = 0;}

    for (j = 1; j < len; ++ j){
      pt = contour[k];
      if (++ k === len) {k = 0;}

      dx = pt.x - start_pt.x;
      dy = pt.y - start_pt.y;
      dist = dx * dx + dy * dy;

      if (dist > max_dist){
        max_dist = dist;
        right_slice.start_index = j;
      }
    }
  }

  if (max_dist <= epsilon){
    poly.push( {x: start_pt.x, y: start_pt.y} );

  }else{
    slice.start_index = k;
    slice.end_index = (right_slice.start_index += slice.start_index);

    right_slice.start_index -= right_slice.start_index >= len? len: 0;
    right_slice.end_index = slice.start_index;
    if (right_slice.end_index < right_slice.start_index){
      right_slice.end_index += len;
    }

    stack.push( {start_index: right_slice.start_index, end_index: right_slice.end_index} );
    stack.push( {start_index: slice.start_index, end_index: slice.end_index} );
  }

  while(stack.length !== 0){
    slice = stack.pop();

    end_pt = contour[slice.end_index % len];
    start_pt = contour[k = slice.start_index % len];
    if (++ k === len) {k = 0;}

    if (slice.end_index <= slice.start_index + 1){
      le_eps = true;

    }else{
      max_dist = 0;

      dx = end_pt.x - start_pt.x;
      dy = end_pt.y - start_pt.y;

      for (i = slice.start_index + 1; i < slice.end_index; ++ i){
        pt = contour[k];
        if (++ k === len) {k = 0;}

        dist = Math.abs( (pt.y - start_pt.y) * dx - (pt.x - start_pt.x) * dy);

        if (dist > max_dist){
          max_dist = dist;
          right_slice.start_index = i;
        }
      }

      le_eps = max_dist * max_dist <= epsilon * (dx * dx + dy * dy);
    }

    if (le_eps){
      poly.push( {x: start_pt.x, y: start_pt.y} );

    }else{
      right_slice.end_index = slice.end_index;
      slice.end_index = right_slice.start_index;

      stack.push( {start_index: right_slice.start_index, end_index: right_slice.end_index} );
      stack.push( {start_index: slice.start_index, end_index: slice.end_index} );
    }
  }

  return poly;
};

CV.warp = function(imageSrc, imageDst, contour, warpSize){
  var src = imageSrc.data, dst = imageDst.data,
      width = imageSrc.width, height = imageSrc.height,
      pos = 0,
      sx1, sx2, dx1, dx2, sy1, sy2, dy1, dy2, p1, p2, p3, p4,
      m, r, s, t, u, v, w, x, y, i, j;

  m = CV.getPerspectiveTransform(contour, warpSize - 1);

  r = m[8];
  s = m[2];
  t = m[5];

  for (i = 0; i < warpSize; ++ i){
    r += m[7];
    s += m[1];
    t += m[4];

    u = r;
    v = s;
    w = t;

    for (j = 0; j < warpSize; ++ j){
      u += m[6];
      v += m[0];
      w += m[3];

      x = v / u;
      y = w / u;

      sx1 = x >>> 0;
      sx2 = (sx1 === width - 1)? sx1: sx1 + 1;
      dx1 = x - sx1;
      dx2 = 1.0 - dx1;

      sy1 = y >>> 0;
      sy2 = (sy1 === height - 1)? sy1: sy1 + 1;
      dy1 = y - sy1;
      dy2 = 1.0 - dy1;

      p1 = p2 = sy1 * width;
      p3 = p4 = sy2 * width;

      dst[pos ++] =
        (dy2 * (dx2 * src[p1 + sx1] + dx1 * src[p2 + sx2]) +
         dy1 * (dx2 * src[p3 + sx1] + dx1 * src[p4 + sx2]) ) & 0xff;

    }
  }

  imageDst.width = warpSize;
  imageDst.height = warpSize;

  return imageDst;
};

CV.getPerspectiveTransform = function(src, size){
  var rq = CV.square2quad(src);

  rq[0] /= size;
  rq[1] /= size;
  rq[3] /= size;
  rq[4] /= size;
  rq[6] /= size;
  rq[7] /= size;

  return rq;
};

CV.square2quad = function(src){
  var sq = [], px, py, dx1, dx2, dy1, dy2, den;

  px = src[0].x - src[1].x + src[2].x - src[3].x;
  py = src[0].y - src[1].y + src[2].y - src[3].y;

  if (0 === px && 0 === py){
    sq[0] = src[1].x - src[0].x;
    sq[1] = src[2].x - src[1].x;
    sq[2] = src[0].x;
    sq[3] = src[1].y - src[0].y;
    sq[4] = src[2].y - src[1].y;
    sq[5] = src[0].y;
    sq[6] = 0;
    sq[7] = 0;
    sq[8] = 1;

  }else{
    dx1 = src[1].x - src[2].x;
    dx2 = src[3].x - src[2].x;
    dy1 = src[1].y - src[2].y;
    dy2 = src[3].y - src[2].y;
    den = dx1 * dy2 - dx2 * dy1;

    sq[6] = (px * dy2 - dx2 * py) / den;
    sq[7] = (dx1 * py - px * dy1) / den;
    sq[8] = 1;
    sq[0] = src[1].x - src[0].x + sq[6] * src[1].x;
    sq[1] = src[3].x - src[0].x + sq[7] * src[3].x;
    sq[2] = src[0].x;
    sq[3] = src[1].y - src[0].y + sq[6] * src[1].y;
    sq[4] = src[3].y - src[0].y + sq[7] * src[3].y;
    sq[5] = src[0].y;
  }

  return sq;
};

CV.isContourConvex = function(contour){
  var orientation = 0, convex = true,
      len = contour.length, i = 0, j = 0,
      cur_pt, prev_pt, dxdy0, dydx0, dx0, dy0, dx, dy;

  prev_pt = contour[len - 1];
  cur_pt = contour[0];

  dx0 = cur_pt.x - prev_pt.x;
  dy0 = cur_pt.y - prev_pt.y;

  for (; i < len; ++ i){
    if (++ j === len) {j = 0;}

    prev_pt = cur_pt;
    cur_pt = contour[j];

    dx = cur_pt.x - prev_pt.x;
    dy = cur_pt.y - prev_pt.y;
    dxdy0 = dx * dy0;
    dydx0 = dy * dx0;

    orientation |= dydx0 > dxdy0? 1: (dydx0 < dxdy0? 2: 3);

    if (3 === orientation){
        convex = false;
        break;
    }

    dx0 = dx;
    dy0 = dy;
  }

  return convex;
};

CV.perimeter = function(poly){
  var len = poly.length, i = 0, j = len - 1,
      p = 0.0, dx, dy;

  for (; i < len; j = i ++){
    dx = poly[i].x - poly[j].x;
    dy = poly[i].y - poly[j].y;

    p += Math.sqrt(dx * dx + dy * dy) ;
  }

  return p;
};

CV.minEdgeLength = function(poly){
  var len = poly.length, i = 0, j = len - 1,
      min = Infinity, d, dx, dy;

  for (; i < len; j = i ++){
    dx = poly[i].x - poly[j].x;
    dy = poly[i].y - poly[j].y;

    d = dx * dx + dy * dy;

    if (d < min){
      min = d;
    }
  }

  return Math.sqrt(min);
};

CV.countNonZero = function(imageSrc, square){
  var src = imageSrc.data, height = square.height, width = square.width,
      pos = square.x + (square.y * imageSrc.width),
      span = imageSrc.width - width,
      nz = 0, i, j;

  for (i = 0; i < height; ++ i){

    for (j = 0; j < width; ++ j){

      if ( 0 !== src[pos ++] ){
        ++ nz;
      }
    }

    pos += span;
  }

  return nz;
};

CV.binaryBorder = function(imageSrc, dst){
  var src = imageSrc.data, height = imageSrc.height, width = imageSrc.width,
      posSrc = 0, posDst = 0, i, j;

  for (j = -2; j < width; ++ j){
    dst[posDst ++] = 0;
  }

  for (i = 0; i < height; ++ i){
    dst[posDst ++] = 0;

    for (j = 0; j < width; ++ j){
      dst[posDst ++] = (0 === src[posSrc ++]? 0: 1);
    }

    dst[posDst ++] = 0;
  }

  for (j = -2; j < width; ++ j){
    dst[posDst ++] = 0;
  }

  return dst;
};
`,Gt=`/*
Copyright (c) 2020 Damiano Falcioni
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "ArUco: a minimal library for Augmented Reality applications based on OpenCv"
  http://www.uco.es/investiga/grupos/ava/node/26
- "js-aruco: a port to JavaScript of the ArUco library"
  https://github.com/jcmellado/js-aruco
*/

var AR = {};
var CV = this.CV || require('./cv').CV;
this.AR = AR;

AR.DICTIONARIES = {
  ARUCO: {
    nBits: 25,
    tau: 3,
    codeList: [0x1084210,0x1084217,0x1084209,0x108420e,0x10842f0,0x10842f7,0x10842e9,0x10842ee,0x1084130,0x1084137,0x1084129,0x108412e,0x10841d0,0x10841d7,0x10841c9,0x10841ce,0x1085e10,0x1085e17,0x1085e09,0x1085e0e,0x1085ef0,0x1085ef7,0x1085ee9,0x1085eee,0x1085d30,0x1085d37,0x1085d29,0x1085d2e,0x1085dd0,0x1085dd7,0x1085dc9,0x1085dce,0x1082610,0x1082617,0x1082609,0x108260e,0x10826f0,0x10826f7,0x10826e9,0x10826ee,0x1082530,0x1082537,0x1082529,0x108252e,0x10825d0,0x10825d7,0x10825c9,0x10825ce,0x1083a10,0x1083a17,0x1083a09,0x1083a0e,0x1083af0,0x1083af7,0x1083ae9,0x1083aee,0x1083930,0x1083937,0x1083929,0x108392e,0x10839d0,0x10839d7,0x10839c9,0x10839ce,0x10bc210,0x10bc217,0x10bc209,0x10bc20e,0x10bc2f0,0x10bc2f7,0x10bc2e9,0x10bc2ee,0x10bc130,0x10bc137,0x10bc129,0x10bc12e,0x10bc1d0,0x10bc1d7,0x10bc1c9,0x10bc1ce,0x10bde10,0x10bde17,0x10bde09,0x10bde0e,0x10bdef0,0x10bdef7,0x10bdee9,0x10bdeee,0x10bdd30,0x10bdd37,0x10bdd29,0x10bdd2e,0x10bddd0,0x10bddd7,0x10bddc9,0x10bddce,0x10ba610,0x10ba617,0x10ba609,0x10ba60e,0x10ba6f0,0x10ba6f7,0x10ba6e9,0x10ba6ee,0x10ba530,0x10ba537,0x10ba529,0x10ba52e,0x10ba5d0,0x10ba5d7,0x10ba5c9,0x10ba5ce,0x10bba10,0x10bba17,0x10bba09,0x10bba0e,0x10bbaf0,0x10bbaf7,0x10bbae9,0x10bbaee,0x10bb930,0x10bb937,0x10bb929,0x10bb92e,0x10bb9d0,0x10bb9d7,0x10bb9c9,0x10bb9ce,0x104c210,0x104c217,0x104c209,0x104c20e,0x104c2f0,0x104c2f7,0x104c2e9,0x104c2ee,0x104c130,0x104c137,0x104c129,0x104c12e,0x104c1d0,0x104c1d7,0x104c1c9,0x104c1ce,0x104de10,0x104de17,0x104de09,0x104de0e,0x104def0,0x104def7,0x104dee9,0x104deee,0x104dd30,0x104dd37,0x104dd29,0x104dd2e,0x104ddd0,0x104ddd7,0x104ddc9,0x104ddce,0x104a610,0x104a617,0x104a609,0x104a60e,0x104a6f0,0x104a6f7,0x104a6e9,0x104a6ee,0x104a530,0x104a537,0x104a529,0x104a52e,0x104a5d0,0x104a5d7,0x104a5c9,0x104a5ce,0x104ba10,0x104ba17,0x104ba09,0x104ba0e,0x104baf0,0x104baf7,0x104bae9,0x104baee,0x104b930,0x104b937,0x104b929,0x104b92e,0x104b9d0,0x104b9d7,0x104b9c9,0x104b9ce,0x1074210,0x1074217,0x1074209,0x107420e,0x10742f0,0x10742f7,0x10742e9,0x10742ee,0x1074130,0x1074137,0x1074129,0x107412e,0x10741d0,0x10741d7,0x10741c9,0x10741ce,0x1075e10,0x1075e17,0x1075e09,0x1075e0e,0x1075ef0,0x1075ef7,0x1075ee9,0x1075eee,0x1075d30,0x1075d37,0x1075d29,0x1075d2e,0x1075dd0,0x1075dd7,0x1075dc9,0x1075dce,0x1072610,0x1072617,0x1072609,0x107260e,0x10726f0,0x10726f7,0x10726e9,0x10726ee,0x1072530,0x1072537,0x1072529,0x107252e,0x10725d0,0x10725d7,0x10725c9,0x10725ce,0x1073a10,0x1073a17,0x1073a09,0x1073a0e,0x1073af0,0x1073af7,0x1073ae9,0x1073aee,0x1073930,0x1073937,0x1073929,0x107392e,0x10739d0,0x10739d7,0x10739c9,0x10739ce,0x1784210,0x1784217,0x1784209,0x178420e,0x17842f0,0x17842f7,0x17842e9,0x17842ee,0x1784130,0x1784137,0x1784129,0x178412e,0x17841d0,0x17841d7,0x17841c9,0x17841ce,0x1785e10,0x1785e17,0x1785e09,0x1785e0e,0x1785ef0,0x1785ef7,0x1785ee9,0x1785eee,0x1785d30,0x1785d37,0x1785d29,0x1785d2e,0x1785dd0,0x1785dd7,0x1785dc9,0x1785dce,0x1782610,0x1782617,0x1782609,0x178260e,0x17826f0,0x17826f7,0x17826e9,0x17826ee,0x1782530,0x1782537,0x1782529,0x178252e,0x17825d0,0x17825d7,0x17825c9,0x17825ce,0x1783a10,0x1783a17,0x1783a09,0x1783a0e,0x1783af0,0x1783af7,0x1783ae9,0x1783aee,0x1783930,0x1783937,0x1783929,0x178392e,0x17839d0,0x17839d7,0x17839c9,0x17839ce,0x17bc210,0x17bc217,0x17bc209,0x17bc20e,0x17bc2f0,0x17bc2f7,0x17bc2e9,0x17bc2ee,0x17bc130,0x17bc137,0x17bc129,0x17bc12e,0x17bc1d0,0x17bc1d7,0x17bc1c9,0x17bc1ce,0x17bde10,0x17bde17,0x17bde09,0x17bde0e,0x17bdef0,0x17bdef7,0x17bdee9,0x17bdeee,0x17bdd30,0x17bdd37,0x17bdd29,0x17bdd2e,0x17bddd0,0x17bddd7,0x17bddc9,0x17bddce,0x17ba610,0x17ba617,0x17ba609,0x17ba60e,0x17ba6f0,0x17ba6f7,0x17ba6e9,0x17ba6ee,0x17ba530,0x17ba537,0x17ba529,0x17ba52e,0x17ba5d0,0x17ba5d7,0x17ba5c9,0x17ba5ce,0x17bba10,0x17bba17,0x17bba09,0x17bba0e,0x17bbaf0,0x17bbaf7,0x17bbae9,0x17bbaee,0x17bb930,0x17bb937,0x17bb929,0x17bb92e,0x17bb9d0,0x17bb9d7,0x17bb9c9,0x17bb9ce,0x174c210,0x174c217,0x174c209,0x174c20e,0x174c2f0,0x174c2f7,0x174c2e9,0x174c2ee,0x174c130,0x174c137,0x174c129,0x174c12e,0x174c1d0,0x174c1d7,0x174c1c9,0x174c1ce,0x174de10,0x174de17,0x174de09,0x174de0e,0x174def0,0x174def7,0x174dee9,0x174deee,0x174dd30,0x174dd37,0x174dd29,0x174dd2e,0x174ddd0,0x174ddd7,0x174ddc9,0x174ddce,0x174a610,0x174a617,0x174a609,0x174a60e,0x174a6f0,0x174a6f7,0x174a6e9,0x174a6ee,0x174a530,0x174a537,0x174a529,0x174a52e,0x174a5d0,0x174a5d7,0x174a5c9,0x174a5ce,0x174ba10,0x174ba17,0x174ba09,0x174ba0e,0x174baf0,0x174baf7,0x174bae9,0x174baee,0x174b930,0x174b937,0x174b929,0x174b92e,0x174b9d0,0x174b9d7,0x174b9c9,0x174b9ce,0x1774210,0x1774217,0x1774209,0x177420e,0x17742f0,0x17742f7,0x17742e9,0x17742ee,0x1774130,0x1774137,0x1774129,0x177412e,0x17741d0,0x17741d7,0x17741c9,0x17741ce,0x1775e10,0x1775e17,0x1775e09,0x1775e0e,0x1775ef0,0x1775ef7,0x1775ee9,0x1775eee,0x1775d30,0x1775d37,0x1775d29,0x1775d2e,0x1775dd0,0x1775dd7,0x1775dc9,0x1775dce,0x1772610,0x1772617,0x1772609,0x177260e,0x17726f0,0x17726f7,0x17726e9,0x17726ee,0x1772530,0x1772537,0x1772529,0x177252e,0x17725d0,0x17725d7,0x17725c9,0x17725ce,0x1773a10,0x1773a17,0x1773a09,0x1773a0e,0x1773af0,0x1773af7,0x1773ae9,0x1773aee,0x1773930,0x1773937,0x1773929,0x177392e,0x17739d0,0x17739d7,0x17739c9,0x17739ce,0x984210,0x984217,0x984209,0x98420e,0x9842f0,0x9842f7,0x9842e9,0x9842ee,0x984130,0x984137,0x984129,0x98412e,0x9841d0,0x9841d7,0x9841c9,0x9841ce,0x985e10,0x985e17,0x985e09,0x985e0e,0x985ef0,0x985ef7,0x985ee9,0x985eee,0x985d30,0x985d37,0x985d29,0x985d2e,0x985dd0,0x985dd7,0x985dc9,0x985dce,0x982610,0x982617,0x982609,0x98260e,0x9826f0,0x9826f7,0x9826e9,0x9826ee,0x982530,0x982537,0x982529,0x98252e,0x9825d0,0x9825d7,0x9825c9,0x9825ce,0x983a10,0x983a17,0x983a09,0x983a0e,0x983af0,0x983af7,0x983ae9,0x983aee,0x983930,0x983937,0x983929,0x98392e,0x9839d0,0x9839d7,0x9839c9,0x9839ce,0x9bc210,0x9bc217,0x9bc209,0x9bc20e,0x9bc2f0,0x9bc2f7,0x9bc2e9,0x9bc2ee,0x9bc130,0x9bc137,0x9bc129,0x9bc12e,0x9bc1d0,0x9bc1d7,0x9bc1c9,0x9bc1ce,0x9bde10,0x9bde17,0x9bde09,0x9bde0e,0x9bdef0,0x9bdef7,0x9bdee9,0x9bdeee,0x9bdd30,0x9bdd37,0x9bdd29,0x9bdd2e,0x9bddd0,0x9bddd7,0x9bddc9,0x9bddce,0x9ba610,0x9ba617,0x9ba609,0x9ba60e,0x9ba6f0,0x9ba6f7,0x9ba6e9,0x9ba6ee,0x9ba530,0x9ba537,0x9ba529,0x9ba52e,0x9ba5d0,0x9ba5d7,0x9ba5c9,0x9ba5ce,0x9bba10,0x9bba17,0x9bba09,0x9bba0e,0x9bbaf0,0x9bbaf7,0x9bbae9,0x9bbaee,0x9bb930,0x9bb937,0x9bb929,0x9bb92e,0x9bb9d0,0x9bb9d7,0x9bb9c9,0x9bb9ce,0x94c210,0x94c217,0x94c209,0x94c20e,0x94c2f0,0x94c2f7,0x94c2e9,0x94c2ee,0x94c130,0x94c137,0x94c129,0x94c12e,0x94c1d0,0x94c1d7,0x94c1c9,0x94c1ce,0x94de10,0x94de17,0x94de09,0x94de0e,0x94def0,0x94def7,0x94dee9,0x94deee,0x94dd30,0x94dd37,0x94dd29,0x94dd2e,0x94ddd0,0x94ddd7,0x94ddc9,0x94ddce,0x94a610,0x94a617,0x94a609,0x94a60e,0x94a6f0,0x94a6f7,0x94a6e9,0x94a6ee,0x94a530,0x94a537,0x94a529,0x94a52e,0x94a5d0,0x94a5d7,0x94a5c9,0x94a5ce,0x94ba10,0x94ba17,0x94ba09,0x94ba0e,0x94baf0,0x94baf7,0x94bae9,0x94baee,0x94b930,0x94b937,0x94b929,0x94b92e,0x94b9d0,0x94b9d7,0x94b9c9,0x94b9ce,0x974210,0x974217,0x974209,0x97420e,0x9742f0,0x9742f7,0x9742e9,0x9742ee,0x974130,0x974137,0x974129,0x97412e,0x9741d0,0x9741d7,0x9741c9,0x9741ce,0x975e10,0x975e17,0x975e09,0x975e0e,0x975ef0,0x975ef7,0x975ee9,0x975eee,0x975d30,0x975d37,0x975d29,0x975d2e,0x975dd0,0x975dd7,0x975dc9,0x975dce,0x972610,0x972617,0x972609,0x97260e,0x9726f0,0x9726f7,0x9726e9,0x9726ee,0x972530,0x972537,0x972529,0x97252e,0x9725d0,0x9725d7,0x9725c9,0x9725ce,0x973a10,0x973a17,0x973a09,0x973a0e,0x973af0,0x973af7,0x973ae9,0x973aee,0x973930,0x973937,0x973929,0x97392e,0x9739d0,0x9739d7,0x9739c9,0x9739ce,0xe84210,0xe84217,0xe84209,0xe8420e,0xe842f0,0xe842f7,0xe842e9,0xe842ee,0xe84130,0xe84137,0xe84129,0xe8412e,0xe841d0,0xe841d7,0xe841c9,0xe841ce,0xe85e10,0xe85e17,0xe85e09,0xe85e0e,0xe85ef0,0xe85ef7,0xe85ee9,0xe85eee,0xe85d30,0xe85d37,0xe85d29,0xe85d2e,0xe85dd0,0xe85dd7,0xe85dc9,0xe85dce,0xe82610,0xe82617,0xe82609,0xe8260e,0xe826f0,0xe826f7,0xe826e9,0xe826ee,0xe82530,0xe82537,0xe82529,0xe8252e,0xe825d0,0xe825d7,0xe825c9,0xe825ce,0xe83a10,0xe83a17,0xe83a09,0xe83a0e,0xe83af0,0xe83af7,0xe83ae9,0xe83aee,0xe83930,0xe83937,0xe83929,0xe8392e,0xe839d0,0xe839d7,0xe839c9,0xe839ce,0xebc210,0xebc217,0xebc209,0xebc20e,0xebc2f0,0xebc2f7,0xebc2e9,0xebc2ee,0xebc130,0xebc137,0xebc129,0xebc12e,0xebc1d0,0xebc1d7,0xebc1c9,0xebc1ce,0xebde10,0xebde17,0xebde09,0xebde0e,0xebdef0,0xebdef7,0xebdee9,0xebdeee,0xebdd30,0xebdd37,0xebdd29,0xebdd2e,0xebddd0,0xebddd7,0xebddc9,0xebddce,0xeba610,0xeba617,0xeba609,0xeba60e,0xeba6f0,0xeba6f7,0xeba6e9,0xeba6ee,0xeba530,0xeba537,0xeba529,0xeba52e,0xeba5d0,0xeba5d7,0xeba5c9,0xeba5ce,0xebba10,0xebba17,0xebba09,0xebba0e,0xebbaf0,0xebbaf7,0xebbae9,0xebbaee,0xebb930,0xebb937,0xebb929,0xebb92e,0xebb9d0,0xebb9d7,0xebb9c9,0xebb9ce,0xe4c210,0xe4c217,0xe4c209,0xe4c20e,0xe4c2f0,0xe4c2f7,0xe4c2e9,0xe4c2ee,0xe4c130,0xe4c137,0xe4c129,0xe4c12e,0xe4c1d0,0xe4c1d7,0xe4c1c9,0xe4c1ce,0xe4de10,0xe4de17,0xe4de09,0xe4de0e,0xe4def0,0xe4def7,0xe4dee9,0xe4deee,0xe4dd30,0xe4dd37,0xe4dd29,0xe4dd2e,0xe4ddd0,0xe4ddd7,0xe4ddc9,0xe4ddce,0xe4a610,0xe4a617,0xe4a609,0xe4a60e,0xe4a6f0,0xe4a6f7,0xe4a6e9,0xe4a6ee,0xe4a530,0xe4a537,0xe4a529,0xe4a52e,0xe4a5d0,0xe4a5d7,0xe4a5c9,0xe4a5ce,0xe4ba10,0xe4ba17,0xe4ba09,0xe4ba0e,0xe4baf0,0xe4baf7,0xe4bae9,0xe4baee,0xe4b930,0xe4b937,0xe4b929,0xe4b92e,0xe4b9d0,0xe4b9d7,0xe4b9c9,0xe4b9ce,0xe74210,0xe74217,0xe74209,0xe7420e,0xe742f0,0xe742f7,0xe742e9,0xe742ee,0xe74130,0xe74137,0xe74129,0xe7412e,0xe741d0,0xe741d7,0xe741c9,0xe741ce,0xe75e10,0xe75e17,0xe75e09,0xe75e0e,0xe75ef0,0xe75ef7,0xe75ee9,0xe75eee,0xe75d30,0xe75d37,0xe75d29,0xe75d2e,0xe75dd0,0xe75dd7,0xe75dc9,0xe75dce,0xe72610,0xe72617,0xe72609,0xe7260e,0xe726f0,0xe726f7,0xe726e9,0xe726ee,0xe72530,0xe72537,0xe72529,0xe7252e,0xe725d0,0xe725d7,0xe725c9,0xe725ce,0xe73a10,0xe73a17,0xe73a09,0xe73a0e,0xe73af0,0xe73af7,0xe73ae9,0xe73aee,0xe73930,0xe73937,0xe73929,0xe7392e,0xe739d0,0xe739d7,0xe739c9]
  },
  ARUCO_MIP_36h12: {
    nBits: 36,
    tau: 12,
    codeList: [0xd2b63a09d,0x6001134e5,0x1206fbe72,0xff8ad6cb4,0x85da9bc49,0xb461afe9c,0x6db51fe13,0x5248c541f,0x8f34503,0x8ea462ece,0xeac2be76d,0x1af615c44,0xb48a49f27,0x2e4e1283b,0x78b1f2fa8,0x27d34f57e,0x89222fff1,0x4c1669406,0xbf49b3511,0xdc191cd5d,0x11d7c3f85,0x16a130e35,0xe29f27eff,0x428d8ae0c,0x90d548477,0x2319cbc93,0xc3b0c3dfc,0x424bccc9,0x2a081d630,0x762743d96,0xd0645bf19,0xf38d7fd60,0xc6cbf9a10,0x3c1be7c65,0x276f75e63,0x4490a3f63,0xda60acd52,0x3cc68df59,0xab46f9dae,0x88d533d78,0xb6d62ec21,0xb3c02b646,0x22e56d408,0xac5f5770a,0xaaa993f66,0x4caa07c8d,0x5c9b4f7b0,0xaa9ef0e05,0x705c5750,0xac81f545e,0x735b91e74,0x8cc35cee4,0xe44694d04,0xb5e121de0,0x261017d0f,0xf1d439eb5,0xa1a33ac96,0x174c62c02,0x1ee27f716,0x8b1c5ece9,0x6a05b0c6a,0xd0568dfc,0x192d25e5f,0x1adbeccc8,0xcfec87f00,0xd0b9dde7a,0x88dcef81e,0x445681cb9,0xdbb2ffc83,0xa48d96df1,0xb72cc2e7d,0xc295b53f,0xf49832704,0x9968edc29,0x9e4e1af85,0x8683e2d1b,0x810b45c04,0x6ac44bfe2,0x645346615,0x3990bd598,0x1c9ed0f6a,0xc26729d65,0x83993f795,0x3ac05ac5d,0x357adff3b,0xd5c05565,0x2f547ef44,0x86c115041,0x640fd9e5f,0xce08bbcf7,0x109bb343e,0xc21435c92,0x35b4dfce4,0x459752cf2,0xec915b82c,0x51881eed0,0x2dda7dc97,0x2e0142144,0x42e890f99,0x9a8856527,0x8e80d9d80,0x891cbcf34,0x25dd82410,0x239551d34,0x8fe8f0c70,0x94106a970,0x82609b40c,0xfc9caf36,0x688181d11,0x718613c08,0xf1ab7629,0xa357bfc18,0x4c03b7a46,0x204dedce6,0xad6300d37,0x84cc4cd09,0x42160e5c4,0x87d2adfa8,0x7850e7749,0x4e750fc7c,0xbf2e5dfda,0xd88324da5,0x234b52f80,0x378204514,0xabdf2ad53,0x365e78ef9,0x49caa6ca2,0x3c39ddf3,0xc68c5385d,0x5bfcbbf67,0x623241e21,0xabc90d5cc,0x388c6fe85,0xda0e2d62d,0x10855dfe9,0x4d46efd6b,0x76ea12d61,0x9db377d3d,0xeed0efa71,0xe6ec3ae2f,0x441faee83,0xba19c8ff5,0x313035eab,0x6ce8f7625,0x880dab58d,0x8d3409e0d,0x2be92ee21,0xd60302c6c,0x469ffc724,0x87eebeed3,0x42587ef7a,0x7a8cc4e52,0x76a437650,0x999e41ef4,0x7d0969e42,0xc02baf46b,0x9259f3e47,0x2116a1dc0,0x9f2de4d84,0xeffac29,0x7b371ff8c,0x668339da9,0xd010aee3f,0x1cd00b4c0,0x95070fc3b,0xf84c9a770,0x38f863d76,0x3646ff045,0xce1b96412,0x7a5d45da8,0x14e00ef6c,0x5e95abfd8,0xb2e9cb729,0x36c47dd7,0xb8ee97c6b,0xe9e8f657,0xd4ad2ef1a,0x8811c7f32,0x47bde7c31,0x3adadfb64,0x6e5b28574,0x33e67cd91,0x2ab9fdd2d,0x8afa67f2b,0xe6a28fc5e,0x72049cdbd,0xae65dac12,0x1251a4526,0x1089ab841,0xe2f096ee0,0xb0caee573,0xfd6677e86,0x444b3f518,0xbe8b3a56a,0x680a75cfc,0xac02baea8,0x97d815e1c,0x1d4386e08,0x1a14f5b0e,0xe658a8d81,0xa3868efa7,0x3668a9673,0xe8fc53d85,0x2e2b7edd5,0x8b2470f13,0xf69795f32,0x4589ffc8e,0x2e2080c9c,0x64265f7d,0x3d714dd10,0x1692c6ef1,0x3e67f2f49,0x5041dad63,0x1a1503415,0x64c18c742,0xa72eec35,0x1f0f9dc60,0xa9559bc67,0xf32911d0d,0x21c0d4ffc,0xe01cef5b0,0x4e23a3520,0xaa4f04e49,0xe1c4fcc43,0x208e8f6e8,0x8486774a5,0x9e98c7558,0x2c59fb7dc,0x9446a4613,0x8292dcc2e,0x4d61631,0xd05527809,0xa0163852d,0x8f657f639,0xcca6c3e37,0xcb136bc7a,0xfc5a83e53,0x9aa44fc30,0xbdec1bd3c,0xe020b9f7c,0x4b8f35fb0,0xb8165f637,0x33dc88d69,0x10a2f7e4d,0xc8cb5ff53,0xde259ff6b,0x46d070dd4,0x32d3b9741,0x7075f1c04,0x4d58dbea0]
  }
};

AR.Dictionary = function (dicName) {
  this.codes = {};
  this.codeList = [];
  this.tau = 0;
  this._initialize(dicName);
};

AR.Dictionary.prototype._initialize = function (dicName) {
  this.codes = {};
  this.codeList = [];
  this.tau = 0;
  this.nBits = 0;
  this.markSize = 0;
  this.dicName = dicName;
  var dictionary = AR.DICTIONARIES[dicName];
  if (!dictionary)
    throw 'The dictionary "' + dicName + '" is not recognized.';
  
  this.nBits = dictionary.nBits;
  this.markSize = Math.sqrt(dictionary.nBits) + 2;
  for (var i = 0; i < dictionary.codeList.length; i++) {
    var code = null;
    if (typeof dictionary.codeList[i] === 'number')
      code = this._hex2bin(dictionary.codeList[i], dictionary.nBits);
    if (typeof dictionary.codeList[i] === 'string')
      code = this._hex2bin(parseInt(dictionary.codeList[i], 16), dictionary.nBits);
    if (Array.isArray(dictionary.codeList[i])) 
      code = this._bytes2bin(dictionary.codeList[i], dictionary.nBits);
    if (code === null) 
      throw 'Invalid code ' + i + ' in dictionary ' + dicName + ': ' + JSON.stringify(dictionary.codeList[i]);
    if (code.length != dictionary.nBits)
      throw 'The code ' + i + ' in dictionary ' + dicName + ' is not ' +  dictionary.nBits + ' bits long but ' + code.length + ': ' + code;
    this.codeList.push(code);
    this.codes[code] = {
      id: i
    };
  }
  this.tau = dictionary.tau || this._calculateTau();
};

AR.Dictionary.prototype.find = function (bits) {
  var val = '',
    i, j;
  for (i = 0; i < bits.length; i++) {
    var bitRow = bits[i];
    for (j = 0; j < bitRow.length; j++) {
      val += bitRow[j];
    }
  }
  var minFound = this.codes[val];
  if (minFound)
    return {
      id: minFound.id,
      distance: 0
    };

  for (i = 0; i < this.codeList.length; i++) {
    var code = this.codeList[i];
    var distance = this._hammingDistance(val, code);
    if (this._hammingDistance(val, code) < this.tau) {
      if (!minFound || minFound.distance > distance) {
        minFound = {
          id: this.codes[code].id,
          distance: distance
        };
      }
    }
  }
  return minFound;
};

AR.Dictionary.prototype._hex2bin = function (hex, nBits) {
  return hex.toString(2).padStart(nBits, '0');
};

AR.Dictionary.prototype._bytes2bin = function (byteList, nBits) {
  var bits = '', byte;
  for (byte of byteList) {
    bits += byte.toString(2).padStart(bits.length + 8 > nBits?nBits - bits.length:8, '0');
  }
  return bits;
};

AR.Dictionary.prototype._hammingDistance = function (str1, str2) {
  if (str1.length != str2.length)
    throw 'Hamming distance calculation require inputs of the same length';
  var distance = 0,
    i;
  for (i = 0; i < str1.length; i++)
    if (str1[i] !== str2[i])
      distance += 1;
  return distance;
};

AR.Dictionary.prototype._calculateTau = function () {
  var tau = Number.MAX_VALUE;
  for(var i=0;i<this.codeList.length;i++)
    for(var j=i+1;j<this.codeList.length;j++) {
      var distance = this._hammingDistance(this.codeList[i], this.codeList[j]);
      tau = distance < tau ? distance : tau;
    }
  return tau;
};

AR.Dictionary.prototype.generateSVG = function (id) {
  var code = this.codeList[id];
  if (code == null)
    throw 'The id "' + id + '" is not valid for the dictionary "' + this.dicName + '". ID must be between 0 and ' + (this.codeList.length-1) + ' included.';
  var size = this.markSize - 2;
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+ (size+4) + ' ' + (size+4) + '">';
  svg += '<rect x="0" y="0" width="' + (size+4) + '" height="' + (size+4) + '" fill="white"/>';
  svg += '<rect x="1" y="1" width="' + (size+2) + '" height="' + (size+2) + '" fill="black"/>';
  for(var y=0;y<size;y++) {
    for(var x=0;x<size;x++) {
      if (code[y*size+x]=='1') 
        svg += '<rect x="' + (x+2) + '" y="' + (y+2) + '" width="1" height="1" fill="white"/>';
    }
  }
  svg += '</svg>';
  return svg;
};

AR.Marker = function (id, corners, hammingDistance) {
  this.id = id;
  this.corners = corners;
  this.hammingDistance = hammingDistance;
};

AR.Detector = function (config) {
  config = config || {};
  this.grey = new CV.Image();
  this.thres = new CV.Image();
  this.homography = new CV.Image();
  this.binary = [];
  this.contours = [];
  this.polys = [];
  this.candidates = [];
  config.dictionaryName = config.dictionaryName || 'ARUCO_MIP_36h12';
  this.dictionary = new AR.Dictionary(config.dictionaryName);
  this.dictionary.tau = config.maxHammingDistance != null ? config.maxHammingDistance : this.dictionary.tau;
};

AR.Detector.prototype.detectImage = function (width, height, data) {
  return this.detect({
    width: width,
    height: height,
    data: data
  });
};

AR.Detector.prototype.detectStreamInit = function (width, height, callback) {
  this.streamConfig = {};
  this.streamConfig.width = width;
  this.streamConfig.height = height;
  this.streamConfig.imageSize = width * height * 4; //provided image must be a sequence of rgba bytes (4 bytes represent a pixel)
  this.streamConfig.index = 0;
  this.streamConfig.imageData = new Uint8ClampedArray(this.streamConfig.imageSize);
  this.streamConfig.callback = callback || function (image, markerList) {};
};

//accept data chunks of different sizes
AR.Detector.prototype.detectStream = function (data) {
  for (var i = 0; i < data.length; i++) {
    this.streamConfig.imageData[this.streamConfig.index] = data[i];
    this.streamConfig.index = (this.streamConfig.index + 1) % this.streamConfig.imageSize;
    if (this.streamConfig.index == 0) {
      var image = {
        width: this.streamConfig.width,
        height: this.streamConfig.height,
        data: this.streamConfig.imageData
      };
      var markerList = this.detect(image);
      this.streamConfig.callback(image, markerList);
    }
  }
};

AR.Detector.prototype.detectMJPEGStreamInit = function (width, height, callback, decoderFn) {
  this.mjpeg = {
    decoderFn: decoderFn,
    chunks: [],
    SOI: [0xff, 0xd8],
    EOI: [0xff, 0xd9]
  };
  this.detectStreamInit(width, height, callback);
};

AR.Detector.prototype.detectMJPEGStream = function (chunk) {
  var eoiPos = chunk.findIndex(function (element, index, array) {
    return this.mjpeg.EOI[0] == element && array.length > index + 1 && this.mjpeg.EOI[1] == array[index + 1];
  });
  var soiPos = chunk.findIndex(function (element, index, array) {
    return this.mjpeg.SOI[0] == element && array.length > index + 1 && this.mjpeg.SOI[1] == array[index + 1];
  });

  if (eoiPos === -1) {
    this.mjpeg.chunks.push(chunk);
  } else {
    var part1 = chunk.slice(0, eoiPos + 2);
    if (part1.length) {
      this.mjpeg.chunks.push(part1);
    }
    if (this.mjpeg.chunks.length) {
      var jpegImage = this.mjpeg.chunks.flat();
      var rgba = this.mjpeg.decoderFn(jpegImage);
      this.detectStream(rgba);
    }
    this.mjpeg.chunks = [];
  }
  if (soiPos > -1) {
    this.mjpeg.chunks = [];
    this.mjpeg.chunks.push(chunk.slice(soiPos));
  }
};

AR.Detector.prototype.detect = function (image) {
  CV.grayscale(image, this.grey);
  CV.adaptiveThreshold(this.grey, this.thres, 2, 7);

  this.contours = CV.findContours(this.thres, this.binary);
  //Scale Fix: https://stackoverflow.com/questions/35936397/marker-detection-on-paper-sheet-using-javascript
  //this.candidates = this.findCandidates(this.contours, image.width * 0.20, 0.05, 10);
  this.candidates = this.findCandidates(this.contours, image.width * 0.01, 0.05, 10);
  this.candidates = this.clockwiseCorners(this.candidates);
  this.candidates = this.notTooNear(this.candidates, 10);

  return this.findMarkers(this.grey, this.candidates, 49);
};

AR.Detector.prototype.findCandidates = function (contours, minSize, epsilon, minLength) {
  var candidates = [],
    len = contours.length,
    contour, poly, i;

  this.polys = [];

  for (i = 0; i < len; ++i) {
    contour = contours[i];

    if (contour.length >= minSize) {
      poly = CV.approxPolyDP(contour, contour.length * epsilon);

      this.polys.push(poly);

      if ((4 === poly.length) && (CV.isContourConvex(poly))) {

        if (CV.minEdgeLength(poly) >= minLength) {
          candidates.push(poly);
        }
      }
    }
  }

  return candidates;
};

AR.Detector.prototype.clockwiseCorners = function (candidates) {
  var len = candidates.length,
    dx1, dx2, dy1, dy2, swap, i;

  for (i = 0; i < len; ++i) {
    dx1 = candidates[i][1].x - candidates[i][0].x;
    dy1 = candidates[i][1].y - candidates[i][0].y;
    dx2 = candidates[i][2].x - candidates[i][0].x;
    dy2 = candidates[i][2].y - candidates[i][0].y;

    if ((dx1 * dy2 - dy1 * dx2) < 0) {
      swap = candidates[i][1];
      candidates[i][1] = candidates[i][3];
      candidates[i][3] = swap;
    }
  }

  return candidates;
};

AR.Detector.prototype.notTooNear = function (candidates, minDist) {
  var notTooNear = [],
    len = candidates.length,
    dist, dx, dy, i, j, k;

  for (i = 0; i < len; ++i) {

    for (j = i + 1; j < len; ++j) {
      dist = 0;

      for (k = 0; k < 4; ++k) {
        dx = candidates[i][k].x - candidates[j][k].x;
        dy = candidates[i][k].y - candidates[j][k].y;

        dist += dx * dx + dy * dy;
      }

      if ((dist / 4) < (minDist * minDist)) {

        if (CV.perimeter(candidates[i]) < CV.perimeter(candidates[j])) {
          candidates[i].tooNear = true;
        } else {
          candidates[j].tooNear = true;
        }
      }
    }
  }

  for (i = 0; i < len; ++i) {
    if (!candidates[i].tooNear) {
      notTooNear.push(candidates[i]);
    }
  }

  return notTooNear;
};

AR.Detector.prototype.findMarkers = function (imageSrc, candidates, warpSize) {
  var markers = [],
    len = candidates.length,
    candidate, marker, i;

  for (i = 0; i < len; ++i) {
    candidate = candidates[i];

    CV.warp(imageSrc, this.homography, candidate, warpSize);

    CV.threshold(this.homography, this.homography, CV.otsu(this.homography));

    marker = this.getMarker(this.homography, candidate);
    if (marker) {
      markers.push(marker);
    }
  }

  return markers;
};

AR.Detector.prototype.getMarker = function (imageSrc, candidate) {
  var markSize = this.dictionary.markSize;
  var width = (imageSrc.width / markSize) >>> 0,
    minZero = (width * width) >> 1,
    bits = [],
    rotations = [],
    square, inc, i, j;

  for (i = 0; i < markSize; ++i) {
    inc = (0 === i || (markSize - 1) === i) ? 1 : (markSize - 1);

    for (j = 0; j < markSize; j += inc) {
      square = {
        x: j * width,
        y: i * width,
        width: width,
        height: width
      };
      if (CV.countNonZero(imageSrc, square) > minZero) {
        return null;
      }
    }
  }

  for (i = 0; i < markSize - 2; ++i) {
    bits[i] = [];

    for (j = 0; j < markSize - 2; ++j) {
      square = {
        x: (j + 1) * width,
        y: (i + 1) * width,
        width: width,
        height: width
      };

      bits[i][j] = CV.countNonZero(imageSrc, square) > minZero ? 1 : 0;
    }
  }

  rotations[0] = bits;

  var foundMin = null;
  var rot = 0;
  for (i = 0; i < 4; i++) {
    var found = this.dictionary.find(rotations[i]);
    if (found && (foundMin === null || found.distance < foundMin.distance)) {
      foundMin = found;
      rot = i;
      if (foundMin.distance === 0)
        break;
    }
    rotations[i + 1] = this.rotate(rotations[i]);
  }

  if (foundMin)
    return new AR.Marker(foundMin.id, this.rotate2(candidate, 4 - rot), foundMin.distance);

  return null;
};

AR.Detector.prototype.rotate = function (src) {
  var dst = [],
    len = src.length,
    i, j;

  for (i = 0; i < len; ++i) {
    dst[i] = [];
    for (j = 0; j < src[i].length; ++j) {
      dst[i][j] = src[src[i].length - j - 1][i];
    }
  }

  return dst;
};

AR.Detector.prototype.rotate2 = function (src, rotation) {
  var dst = [],
    len = src.length,
    i;

  for (i = 0; i < len; ++i) {
    dst[i] = src[(rotation + i) % len];
  }

  return dst;
};
`,Ht=`/*
By downloading, copying, installing or using the software you agree to this
license. If you do not agree to this license, do not download, install,
copy or use the software.
                          License Agreement
               For Open Source Computer Vision Library
                       (3-clause BSD License)
Copyright (C) 2013, OpenCV Foundation, all rights reserved.
Third party copyrights are property of their respective owners.
Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:
  * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.
  * Neither the names of the copyright holders nor the names of the contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.
This software is provided by the copyright holders and contributors "as is" and
any express or implied warranties, including, but not limited to, the implied
warranties of merchantability and fitness for a particular purpose are
disclaimed. In no event shall copyright holders or contributors be liable for
any direct, indirect, incidental, special, exemplary, or consequential damages
(including, but not limited to, procurement of substitute goods or services;
loss of use, data, or profits; or business interruption) however caused
and on any theory of liability, whether in contract, strict liability,
or tort (including negligence or otherwise) arising in any way out of
the use of this software, even if advised of the possibility of such damage.
*/

//Dictionary extracted from https://github.com/opencv/opencv_contrib/blob/4.x/modules/aruco/src/predefined_dictionaries.hpp

var AR = this.AR || require('../aruco').AR;
AR.DICTIONARIES['ARUCO_4X4_1000'] = {
  nBits: 16,
  tau: null,
  codeList: [[181,50],[15,154],[51,45],[153,70],[84,158],[121,205],[158,46],[196,242],[254,218],[207,86],[249,145],[17,167],[14,183],[42,15],[36,177],[38,62],[70,101],[102,0],[108,94],[118,175],[134,139],[176,43],[204,213],[221,130],[254,71],[148,113],[172,228],[165,84],[33,35],[52,111],[68,21],[87,178],[158,207],[240,203],[8,174],[9,41],[24,117],[4,255],[13,246],[28,90],[23,24],[42,40],[50,140],[56,178],[36,232],[46,235],[45,63],[75,100],[80,46],[80,19],[81,148],[85,104],[93,65],[95,151],[104,1],[104,103],[97,36],[97,233],[107,18],[111,229],[103,223],[126,27],[128,160],[131,68],[139,162],[147,122],[132,108],[133,42],[133,156],[156,137],[159,161],[187,124],[188,4],[182,91],[191,200],[183,171],[202,31],[201,98],[217,88],[211,213],[204,152],[199,160],[197,55],[233,93],[249,37],[251,187],[238,42],[247,77],[53,117],[138,173],[118,23],[10,207],[6,75],[45,193],[73,216],[67,244],[79,54],[79,211],[105,228],[112,199],[122,110],[180,234],[237,79],[252,231],[254,166],[0,37],[0,67],[10,136],[10,134],[2,111],[0,28],[0,151],[8,55],[10,49],[9,198],[11,1],[9,251],[11,88],[16,130],[24,45],[16,120],[16,115],[18,116],[18,177],[26,249],[19,6],[12,14],[12,241],[4,51],[12,159],[14,242],[14,253],[7,76],[15,164],[7,47],[5,181],[15,145],[7,219],[30,228],[20,57],[29,128],[21,200],[31,139],[21,186],[29,177],[32,128],[40,233],[34,162],[40,83],[42,240],[34,247],[41,64],[33,70],[41,185],[43,156],[43,178],[56,202],[56,46],[48,7],[56,231],[58,73],[58,101],[50,93],[59,136],[57,29],[59,211],[38,71],[39,128],[47,170],[45,20],[37,222],[37,83],[47,119],[52,72],[60,168],[60,65],[52,13],[52,251],[54,154],[61,224],[53,106],[61,9],[61,237],[63,196],[63,108],[55,206],[61,92],[61,118],[55,176],[63,23],[63,255],[72,229],[66,104],[74,45],[65,96],[73,81],[65,221],[75,223],[88,79],[90,72],[88,22],[80,93],[90,250],[90,181],[81,35],[91,138],[89,25],[81,53],[76,105],[70,193],[78,11],[68,95],[78,89],[77,131],[77,125],[71,216],[71,115],[92,133],[94,68],[86,43],[92,187],[85,195],[95,110],[95,235],[93,18],[85,94],[98,112],[98,21],[97,194],[107,32],[99,69],[107,92],[107,91],[120,12],[122,207],[120,127],[121,128],[113,229],[113,116],[121,182],[113,211],[123,51],[100,106],[102,168],[110,167],[110,145],[101,34],[109,203],[103,141],[109,49],[126,128],[126,226],[126,141],[116,210],[124,50],[126,53],[117,171],[119,5],[127,43],[125,218],[127,146],[128,117],[128,243],[129,166],[137,237],[129,252],[152,166],[154,32],[145,67],[153,249],[145,147],[155,212],[132,9],[132,107],[134,196],[142,100],[134,26],[133,78],[141,203],[133,103],[133,175],[133,215],[135,179],[156,225],[156,242],[148,23],[149,0],[149,162],[157,35],[159,98],[157,82],[149,218],[160,197],[170,205],[162,216],[162,87],[169,61],[169,87],[171,82],[163,54],[163,89],[176,244],[184,18],[176,191],[178,157],[187,237],[185,114],[185,150],[164,195],[172,210],[174,177],[165,130],[175,101],[165,123],[175,250],[180,100],[188,98],[180,129],[182,160],[190,238],[190,13],[188,217],[190,248],[181,40],[183,9],[183,210],[192,234],[192,25],[192,253],[200,211],[202,90],[193,77],[201,180],[193,87],[195,152],[195,29],[216,128],[216,239],[218,43],[208,30],[209,5],[211,173],[219,167],[196,201],[204,120],[205,69],[197,11],[207,207],[220,172],[212,2],[220,99],[212,39],[212,245],[214,120],[222,184],[221,230],[213,93],[221,189],[223,29],[226,202],[234,107],[224,180],[226,56],[226,212],[227,34],[225,216],[240,3],[242,204],[248,246],[241,73],[243,234],[241,156],[249,245],[241,59],[236,141],[238,201],[230,15],[228,247],[231,96],[239,232],[237,178],[229,21],[239,209],[244,134],[252,1],[246,195],[244,124],[252,147],[245,66],[253,152],[245,61],[2,189],[0,225],[2,226],[2,174],[8,120],[0,116],[8,158],[8,209],[8,125],[10,50],[10,222],[2,81],[1,162],[3,128],[11,131],[11,75],[11,39],[11,239],[9,182],[9,89],[9,147],[11,248],[3,217],[3,241],[16,196],[24,171],[26,160],[26,4],[26,108],[26,174],[18,137],[16,23],[26,243],[25,64],[17,2],[17,43],[17,207],[27,34],[19,46],[17,21],[19,187],[12,32],[12,201],[12,220],[12,54],[6,20],[6,114],[13,97],[5,13],[13,143],[15,224],[15,73],[7,133],[5,144],[13,51],[15,150],[15,118],[20,96],[28,141],[20,218],[28,115],[30,148],[30,186],[22,217],[30,61],[22,251],[29,233],[29,254],[31,159],[40,139],[32,175],[34,14],[34,169],[42,141],[42,163],[42,239],[40,144],[40,59],[42,88],[34,51],[33,160],[33,2],[33,165],[33,199],[43,3],[35,103],[41,48],[41,210],[43,25],[43,155],[43,151],[56,40],[56,165],[58,134],[50,1],[56,159],[50,210],[58,153],[58,213],[57,232],[59,193],[51,67],[59,231],[49,154],[51,144],[59,158],[36,196],[44,74],[44,173],[44,207],[44,103],[38,234],[46,229],[44,112],[46,18],[46,209],[46,57],[37,100],[37,231],[47,204],[45,188],[45,113],[37,213],[37,155],[39,16],[47,124],[39,242],[39,58],[47,182],[39,211],[47,179],[39,31],[60,75],[54,192],[54,238],[62,233],[52,184],[60,20],[60,82],[52,114],[52,126],[52,191],[62,113],[62,83],[61,140],[53,162],[53,46],[53,45],[55,172],[53,112],[55,250],[63,241],[63,219],[72,196],[72,233],[74,194],[74,65],[66,235],[72,19],[74,216],[66,253],[74,23],[73,99],[67,110],[65,58],[73,177],[65,61],[75,146],[75,155],[67,63],[88,34],[80,170],[88,39],[82,200],[82,132],[82,10],[90,15],[88,152],[88,92],[80,219],[80,247],[90,244],[81,236],[81,66],[81,13],[91,3],[83,235],[81,118],[89,113],[81,147],[83,249],[91,179],[83,151],[76,76],[68,75],[76,35],[70,140],[78,39],[70,144],[78,212],[69,206],[69,229],[69,39],[79,193],[71,5],[69,52],[69,114],[92,200],[92,14],[84,235],[86,137],[86,67],[94,231],[92,112],[84,178],[94,121],[86,243],[93,163],[93,242],[85,29],[93,157],[87,252],[87,210],[95,115],[104,45],[104,195],[104,135],[106,74],[98,105],[96,185],[104,255],[106,220],[106,218],[106,62],[106,81],[106,49],[98,215],[97,204],[107,130],[107,227],[105,58],[97,158],[97,149],[97,117],[105,95],[105,55],[99,218],[112,2],[120,99],[112,79],[114,202],[122,173],[112,123],[122,20],[122,249],[122,211],[122,187],[121,226],[113,41],[123,103],[113,208],[121,57],[115,48],[115,185],[115,83],[115,255],[108,136],[100,9],[108,67],[102,6],[102,131],[100,176],[100,218],[110,159],[103,200],[111,238],[109,59],[111,210],[116,128],[124,171],[126,104],[126,2],[124,156],[116,54],[124,17],[126,222],[126,182],[118,219],[125,196],[125,138],[117,109],[119,136],[119,32],[119,65],[117,56],[117,190],[125,155],[119,87],[136,40],[128,172],[136,13],[136,103],[130,78],[138,161],[130,43],[128,24],[136,249],[128,157],[138,156],[130,49],[138,117],[130,151],[129,9],[129,235],[129,7],[139,40],[139,172],[131,46],[131,229],[129,80],[137,50],[139,122],[139,150],[131,125],[144,135],[154,252],[146,245],[145,170],[147,65],[147,37],[155,235],[153,52],[145,247],[155,218],[147,86],[132,66],[140,129],[140,79],[134,72],[134,166],[142,3],[134,227],[134,111],[142,175],[132,94],[132,119],[134,250],[142,30],[142,55],[135,10],[143,138],[143,38],[135,33],[135,13],[133,114],[135,62],[156,67],[158,97],[148,88],[148,248],[156,50],[148,118],[148,177],[148,221],[148,155],[156,219],[158,156],[158,210],[150,25],[158,177],[149,105],[159,109],[151,43],[149,182],[149,185],[157,61],[157,87],[168,236],[168,37],[162,172],[162,2],[170,102],[170,143],[170,231],[168,48],[168,122],[168,246],[168,147],[162,20],[170,52],[162,114],[170,242],[162,241],[161,64],[169,10],[161,38],[169,197],[169,207],[161,52],[169,18],[161,250],[171,152],[163,247],[176,6],[176,69],[184,141],[178,132],[184,240],[184,85],[178,118],[186,145],[178,113],[185,192],[185,66],[185,42],[179,140],[179,202],[187,102],[179,15],[177,218],[187,20],[187,246],[179,19],[164,104],[172,44],[172,161],[172,235],[172,199],[164,103],[166,192],[174,224],[166,35],[173,232],[165,204],[167,236],[173,124],[165,26],[165,145],[173,25],[165,151],[180,109],[190,203],[188,58],[188,245],[190,189],[190,243],[181,37],[181,143],[183,104],[191,228],[189,254],[189,157],[181,245],[181,243],[191,176],[183,90],[191,62],[183,57],[191,213],[183,29],[191,53],[183,127],[200,1],[192,165],[194,130],[200,189],[194,252],[202,145],[194,91],[201,68],[193,42],[195,192],[201,122],[193,185],[201,117],[193,247],[203,177],[208,108],[216,135],[208,175],[218,196],[210,12],[218,9],[208,48],[216,148],[208,58],[208,182],[208,117],[210,118],[218,93],[218,53],[210,23],[217,2],[211,232],[211,229],[209,154],[209,246],[209,81],[219,20],[211,62],[211,211],[196,96],[204,167],[198,66],[198,71],[206,231],[196,92],[204,29],[204,53],[198,188],[205,168],[197,12],[197,228],[197,194],[205,45],[205,89],[205,149],[197,147],[199,95],[212,197],[222,136],[214,36],[222,236],[214,226],[222,198],[222,35],[220,220],[220,26],[212,17],[222,84],[214,148],[222,157],[221,129],[213,165],[215,172],[215,102],[223,169],[213,220],[221,31],[223,240],[226,72],[226,232],[226,7],[224,93],[234,245],[235,38],[235,237],[225,82],[225,126],[233,219],[248,6],[240,238],[248,161],[250,0],[250,194],[240,155],[250,244],[250,60],[242,252],[242,189],[242,147],[241,96],[249,236],[241,70],[249,225],[243,72],[243,174],[243,193],[243,139],[243,167],[241,115],[241,151],[243,244],[251,50],[228,7],[230,77],[236,85],[237,192],[237,133],[239,162],[231,78],[229,213],[239,80],[244,34],[244,137],[244,41],[246,106],[254,11],[254,111],[244,149],[244,53],[244,31],[246,176],[245,232],[245,197],[253,35],[255,192],[247,204],[247,233],[245,188],[253,246],[245,217],[253,151],[253,63],[255,156],[255,90],[247,254],[255,17],[247,191]]
};`;let se=null;function Wt(){if(se)return se;const t={},e=i=>{throw new Error(`vendored js-aruco2 tried to require(${i}); load order is wrong`)};for(const i of[Yt,Gt,Ht])new Function("require",i).call(t,e);const n=t.AR;return n.DICTIONARIES.DICT_4X4_50={nBits:16,tau:null,codeList:n.DICTIONARIES.ARUCO_4X4_1000.codeList.slice(0,50)},se=n,n}function Kt(t){const e=Wt(),i=new e.Dictionary("DICT_4X4_50").codeList[t];if(!i)throw new Error(`DICT_4X4_50 has no id ${t}`);return[...i].map(a=>a==="1"?1:0)}const Zt=`#version 300 es
layout(location=0) in vec3 a_pos; layout(location=1) in vec3 a_nrm;
layout(location=2) in vec3 i_c; layout(location=3) in vec3 i_s; layout(location=4) in vec3 i_col;
uniform mat4 u_pv; out vec3 v_n; out vec3 v_col; out vec3 v_w;
void main(){ vec3 w = i_c + a_pos * i_s; v_w = w; v_n = a_nrm; v_col = i_col; gl_Position = u_pv * vec4(w, 1.0); }`,Jt=`#version 300 es
precision mediump float;
in vec3 v_n; in vec3 v_col; in vec3 v_w; out vec4 o;
void main(){
  float l = 0.45 + 0.55 * max(0.0, dot(normalize(v_n), normalize(vec3(0.4, 1.0, 0.3))));
  float shelfLine = step(0.92, fract(v_w.y * 2.5)) * 0.35;
  o = vec4(v_col * l * (1.0 - shelfLine), 1.0);
}`,Qt=`#version 300 es
layout(location=0) in vec2 a_p; uniform mat4 u_pv; out vec2 v_p;
void main(){ v_p = a_p; gl_Position = u_pv * vec4(a_p.x, 0.0, a_p.y, 1.0); }`,en=`#version 300 es
precision mediump float;
in vec2 v_p; out vec4 o;
void main(){
  vec2 g = abs(fract(v_p) - 0.5);
  float line = step(0.485, max(g.x, g.y));
  float chk = mod(floor(v_p.x * 2.0) + floor(v_p.y * 2.0), 2.0);
  o = vec4(vec3(0.62 + 0.04 * chk - 0.18 * line), 1.0);
}`,tn=`#version 300 es
layout(location=0) in vec2 a_uv;
layout(location=1) in vec4 i_m;  // x, z, yaw, id
layout(location=2) in vec4 i_q;  // halfW, halfH, offsetZ, kind
uniform mat4 u_pv; out vec2 v_uv; flat out int v_id; flat out int v_kind;
void main(){
  float lx = (a_uv.x * 2.0 - 1.0) * i_q.x;
  float lz = (a_uv.y * 2.0 - 1.0) * i_q.y + i_q.z;
  float c = cos(i_m.z), s = sin(i_m.z);
  vec3 w = vec3(i_m.x + c * lx + s * lz, 0.002 + 0.001 * i_q.w, i_m.y - s * lx + c * lz);
  v_uv = a_uv; v_id = int(i_m.w + 0.5); v_kind = int(i_q.w + 0.5);
  gl_Position = u_pv * vec4(w, 1.0);
}`,nn=`#version 300 es
precision mediump float;
in vec2 v_uv; flat in int v_id; flat in int v_kind; uniform sampler2D u_bits; out vec4 o;
void main(){
  if (v_kind == 0) { o = vec4(0.97, 0.97, 0.95, 1.0); return; }
  ivec2 cell = ivec2(floor(v_uv * 6.0));
  if (cell.x <= 0 || cell.y <= 0 || cell.x >= 5 || cell.y >= 5) { o = vec4(0.05, 0.05, 0.05, 1.0); return; }
  float b = texelFetch(u_bits, ivec2((cell.x - 1) + (cell.y - 1) * 4, v_id), 0).r;
  o = vec4(vec3(b > 0.5 ? 0.97 : 0.05), 1.0);
}`;class an{constructor(e,n){this.gl=e,this.box=Z(e,Zt,Jt),this.floor=Z(e,Qt,en),this.mark=Z(e,tn,nn);const i=[];if(n.shelves.length)for(const l of n.shelves)i.push((l.x0+l.x1)/2,l.h/2,(l.z0+l.z1)/2,l.x1-l.x0,l.h,l.z1-l.z0,...l.color);else if(n.grid){const l=n.grid;for(let f=0;f<l.height;f++){let k=0;for(;k<l.width;){if(l.occupancy[f*l.width+k]!==1){k++;continue}const b=k;for(;k<l.width&&l.occupancy[f*l.width+k]===1;)k++;const g=l.originX+b*l.cellSize,y=l.originX+k*l.cellSize;i.push((g+y)/2,.8,l.originZ+(f+.5)*l.cellSize,y-g,1.6,l.cellSize,.55,.6,.7)}}}this.boxCount=i.length/9,this.boxVao=e.createVertexArray(),e.bindVertexArray(this.boxVao);const{pos:a,nrm:o,idx:r}=on();te(e,0,3,a),te(e,1,3,o);const s=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,s),e.bufferData(e.ELEMENT_ARRAY_BUFFER,r,e.STATIC_DRAW);const c=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,c),e.bufferData(e.ARRAY_BUFFER,new Float32Array(i),e.STATIC_DRAW);for(let l=0;l<3;l++)e.enableVertexAttribArray(2+l),e.vertexAttribPointer(2+l,3,e.FLOAT,!1,36,l*12),e.vertexAttribDivisor(2+l,1);this.floorVao=e.createVertexArray(),e.bindVertexArray(this.floorVao);const h=60;te(e,0,2,new Float32Array([-h,-h,h,-h,-h,h,h,h])),this.markVao=e.createVertexArray(),e.bindVertexArray(this.markVao),te(e,0,2,new Float32Array([0,0,1,0,0,1,1,1]));const d=rn(n.markers);this.markCount=d.length/8;const u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,new Float32Array(d),e.STATIC_DRAW);for(let l=0;l<2;l++)e.enableVertexAttribArray(1+l),e.vertexAttribPointer(1+l,4,e.FLOAT,!1,32,l*16),e.vertexAttribDivisor(1+l,1);e.bindVertexArray(null);const x=new Uint8Array(800);for(let l=0;l<50;l++)Kt(l).forEach((f,k)=>x[l*16+k]=f?255:0);this.bits=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.bits),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texImage2D(e.TEXTURE_2D,0,e.R8,16,50,0,e.RED,e.UNSIGNED_BYTE,x),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST)}gl;box;floor;mark;boxVao;boxCount;floorVao;markVao;markCount;bits;draw(e){const n=this.gl;n.clearColor(.13,.14,.17,1),n.clear(n.COLOR_BUFFER_BIT|n.DEPTH_BUFFER_BIT),n.enable(n.DEPTH_TEST),n.disable(n.BLEND),n.useProgram(this.floor),n.uniformMatrix4fv(n.getUniformLocation(this.floor,"u_pv"),!1,e),n.bindVertexArray(this.floorVao),n.drawArrays(n.TRIANGLE_STRIP,0,4),n.useProgram(this.mark),n.uniformMatrix4fv(n.getUniformLocation(this.mark,"u_pv"),!1,e),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.bits),n.uniform1i(n.getUniformLocation(this.mark,"u_bits"),0),n.bindVertexArray(this.markVao),n.drawArraysInstanced(n.TRIANGLE_STRIP,0,4,this.markCount),this.boxCount&&(n.useProgram(this.box),n.uniformMatrix4fv(n.getUniformLocation(this.box,"u_pv"),!1,e),n.bindVertexArray(this.boxVao),n.drawElementsInstanced(n.TRIANGLES,36,n.UNSIGNED_SHORT,0,this.boxCount)),n.bindVertexArray(null),n.disable(n.DEPTH_TEST)}}function rn(t){const e=[],n=t.sizeM/2;for(const i of t.markers){const[a,,o]=i.pose.position,r=He(i.pose.quaternion);e.push(a,o,r,i.id,.105,.1485,-.0035,0),e.push(a,o,r,i.id,n,n,0,1)}return e}function te(t,e,n,i){const a=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,n,t.FLOAT,!1,0,0)}function on(){const t=[[[1,0,0],[0,1,0],[0,0,1]],[[-1,0,0],[0,1,0],[0,0,-1]],[[0,1,0],[0,0,1],[1,0,0]],[[0,-1,0],[0,0,-1],[1,0,0]],[[0,0,1],[1,0,0],[0,1,0]],[[0,0,-1],[-1,0,0],[0,1,0]]],e=[],n=[],i=[];return t.forEach(([a,o,r],s)=>{for(const[c,h]of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(.5*(a[0]+c*o[0]+h*r[0]),.5*(a[1]+c*o[1]+h*r[1]),.5*(a[2]+c*o[2]+h*r[2])),n.push(...a);i.push(s*4,s*4+1,s*4+2,s*4,s*4+2,s*4+3)}),{pos:new Float32Array(e),nrm:new Float32Array(n),idx:new Uint16Array(i)}}const ze=62*Math.PI/180,ce=1.45;class sn{constructor(e,n){this.canvas=e,this.store=n;const i=e.getContext("webgl2",{antialias:!0,alpha:!1,preserveDrawingBuffer:!0});if(!i)throw new Error("WebGL2 unavailable");this.gl=i,this.scene=new an(i,n),this.rep=L(this.xrFromMap0,[this.truth.x,0,this.truth.z]),this.bindInput(),requestAnimationFrame(this.loop)}canvas;store;gl;onFrame=null;onCameraImage=null;onTap=null;onEnd=null;flipRows=!1;drift={linearPct:0,yawDegPer10m:0,lost:!1};cameraAccess=!0;headings=[];truth={x:0,z:1.1,yaw:0,pitch:-.85};xrFromMap0={yaw:.9,t:[2.3,0,-1.7]};yawDrift=0;rep=[0,0,0];frozen=null;running=!1;keys=new Set;scene;hz=5;ds=2;lastCap=0;lastT=0;reticle=null;fbo=null;setCapture(e,n){this.hz=e,this.ds=n}async start(){return await new Promise(e=>setTimeout(e,400)),this.running=!0,{cameraAccess:this.cameraAccess,hitTest:!0,enabledFeatures:["local-floor","hit-test","anchors","dom-overlay",...this.cameraAccess?["camera-access"]:[]]}}end(){this.running&&(this.running=!1,this.xrFromMap0={yaw:this.xrFromMap0.yaw+1.1,t:[this.xrFromMap0.t[0]-1.3,0,this.xrFromMap0.t[2]+.7]},this.yawDrift=0,this.rep=L(this.xrFromMap0,[this.truth.x,0,this.truth.z]),setTimeout(()=>this.onEnd?.(),0))}teleport(e,n,i){this.truth={...this.truth,x:e,z:n,yaw:i},this.rep=L({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[e,0,n]).map((a,o)=>a+(this.rep[o]-L({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[this.truth.x,0,this.truth.z])[o])),this.rep=L(this.xrFromMap0,[e,0,n]),this.yawDrift=0}truePose(){const e=Ie(me(this.truth.yaw),Fe([1,0,0],this.truth.pitch));return{position:[this.truth.x,ce,this.truth.z],quaternion:e}}reportedPose(){const e=Ie(me(this.truth.yaw+this.xrFromMap0.yaw+this.yawDrift),Fe([1,0,0],this.truth.pitch));return{position:[this.rep[0],ce,this.rep[2]],quaternion:e}}walkable(e,n){const i=this.store.grid;if(!i)return!0;const a=Math.floor((e-i.originX)/i.cellSize),o=Math.floor((n-i.originZ)/i.cellSize);return a<0||o<0||a>=i.width||o>=i.height?!1:i.occupancy[o*i.width+a]===0&&i.clearanceMm[o*i.width+a]>=150}bindInput(){const e=i=>i.target?.closest?.("input, textarea, select");window.addEventListener("keydown",i=>{e(i)||(this.keys.add(i.key.toLowerCase()),i.key===" "&&(i.preventDefault(),this.reticle&&this.running&&this.onTap?.(this.reticle,performance.now())),i.key.toLowerCase()==="l"&&(this.drift.lost=!this.drift.lost))}),window.addEventListener("keyup",i=>this.keys.delete(i.key.toLowerCase()));let n=null;this.canvas.addEventListener("pointerdown",i=>n={x:i.clientX,y:i.clientY,moved:!1}),window.addEventListener("pointermove",i=>{if(!n)return;const a=i.clientX-n.x,o=i.clientY-n.y;Math.abs(a)+Math.abs(o)>3&&(n.moved=!0),this.truth.yaw-=a*.005,this.truth.pitch=Math.max(-1.45,Math.min(.3,this.truth.pitch-o*.004)),n.x=i.clientX,n.y=i.clientY}),window.addEventListener("pointerup",()=>{n&&!n.moved&&this.reticle&&this.running&&this.onTap?.(this.reticle,performance.now()),n=null})}step(e){const n=this.keys,i=(n.has("q")||n.has("arrowleft")?1:0)-(n.has("e")||n.has("arrowright")?1:0);this.truth.yaw+=i*1.4*e;const a=(n.has("r")||n.has("arrowup")?1:0)-(n.has("f")||n.has("arrowdown")?1:0);this.truth.pitch=Math.max(-1.45,Math.min(.3,this.truth.pitch+a*.9*e));const o=(n.has("w")?1:0)-(n.has("s")?1:0),r=(n.has("d")?1:0)-(n.has("a")?1:0);if(!o&&!r)return;const s=(n.has("shift")?2.4:1.2)*e,c=this.truth.yaw,h=(-Math.sin(c)*o+Math.cos(c)*r)*s,d=(-Math.cos(c)*o-Math.sin(c)*r)*s,u=this.truth.x+h,x=this.truth.z+d;this.walkable(u,x)&&(this.truth.x=u,this.truth.z=x,this.applyDrift(h,d))}applyDrift(e,n){const i=Math.hypot(e,n);this.yawDrift+=this.drift.yawDegPer10m*Math.PI/180/10*i;const a=L({yaw:this.xrFromMap0.yaw+this.yawDrift,t:[0,0,0]},[e,0,n]),o=1+this.drift.linearPct/100;this.rep=[this.rep[0]+a[0]*o,0,this.rep[2]+a[2]*o]}loop=e=>{requestAnimationFrame(this.loop);const n=Math.min(.05,(e-(this.lastT||e))/1e3);this.lastT=e,this.step(n),this.headings.push({t:e,yaw:this.truth.yaw}),this.headings.length>600&&this.headings.shift();const i=this.gl,a=Math.min(2,window.devicePixelRatio||1),o=Math.floor(this.canvas.clientWidth*a),r=Math.floor(this.canvas.clientHeight*a);(this.canvas.width!==o||this.canvas.height!==r)&&(this.canvas.width=o,this.canvas.height=r);const s=Le(ze,o/r),c=this.truePose(),h=Be(s,oe(re(c.quaternion,c.position)));i.bindFramebuffer(i.FRAMEBUFFER,null),i.viewport(0,0,o,r),this.scene.draw(h);let d=this.reportedPose();this.drift.lost?d=this.frozen??(this.frozen=d):this.frozen=null,this.reticle=null;const u=Ft(c.quaternion,[0,0,-1]);if(u[1]<-.05){const x=ce/-u[1],l=[c.position[0]+x*u[0],0,c.position[2]+x*u[2]],f=be(Dt(c),{position:l,quaternion:[0,0,0,1]}).position;this.reticle=be(this.reportedPose(),{position:f,quaternion:[0,0,0,1]}).position}this.running&&(this.cameraAccess&&this.onCameraImage&&!this.drift.lost&&e-this.lastCap>=1e3/this.hz&&(this.lastCap=e,this.onCameraImage(this.captureTruth(s,this.reportedPose(),e)),i.bindFramebuffer(i.FRAMEBUFFER,null),i.viewport(0,0,o,r)),this.onFrame?.({t:e,viewer:d,emulated:this.drift.lost,views:[{projection:s,viewMatrix:oe(re(d.quaternion,d.position)),viewport:[0,0,o,r],framebuffer:null}],reticle:this.reticle}))};captureTruth(e,n,i){const a=this.gl,o=Math.max(64,Math.floor(this.canvas.width/this.ds)),r=Math.max(64,Math.floor(this.canvas.height/this.ds));if(!this.fbo||this.fbo.w!==o||this.fbo.h!==r){const d=a.createFramebuffer();a.bindFramebuffer(a.FRAMEBUFFER,d);const u=a.createRenderbuffer();a.bindRenderbuffer(a.RENDERBUFFER,u),a.renderbufferStorage(a.RENDERBUFFER,a.RGBA8,o,r),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,u);const x=a.createRenderbuffer();a.bindRenderbuffer(a.RENDERBUFFER,x),a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_COMPONENT24,o,r),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,x),this.fbo={fb:d,w:o,h:r}}const s=performance.now();a.bindFramebuffer(a.FRAMEBUFFER,this.fbo.fb),a.viewport(0,0,o,r);const c=this.truePose();this.scene.draw(Be(e,oe(re(c.quaternion,c.position))));const h=new Uint8Array(o*r*4);return a.readPixels(0,0,o,r,a.RGBA,a.UNSIGNED_BYTE,h),this.flipRows&&Ze(h,o,r),{t:i,rgba:h.buffer,width:o,height:r,K:Ge(e,o,r),xrFromView:n,readMs:performance.now()-s}}captureForScan(e){const n=Le(ze,this.canvas.width/this.canvas.height),i=this.flipRows;this.flipRows=!0;const a=this.captureTruth(n,this.truePose(),e);return this.flipRows=i,{rgba:a.rgba,width:a.width,height:a.height,K:a.K,t:e}}headingDelta(e,n){const i=a=>this.headings.reduce((o,r)=>Math.abs(r.t-a)<Math.abs(o.t-a)?r:o,this.headings[0]);return this.headings.length?i(n).yaw-i(e).yaw:null}}function Be(t,e){const n=new Float32Array(16);for(let i=0;i<4;i++)for(let a=0;a<4;a++){let o=0;for(let r=0;r<4;r++)o+=t[r*4+a]*e[i*4+r];n[i*4+a]=o}return n}function cn(t,e,n={}){return{markers:new Map(t.markers.map(i=>[i.id,{centre:i.pose.position,label:i.label??`M${i.id}`,pose:i.pose}])),maxWalkM:ye,offPathM:1.5,rerouteMinMs:2e3,geofenceM:3,resyncPromptM:2,arriveM:1,arriveFacingRad:Math.PI/4,lostResyncMs:1500,refineMaxM:1,liveSamples:3,liveWindowMs:1500,liveSpreadM:.05,liveSpreadRad:2*Math.PI/180,confirmMoveM:.5,stepM:.25,liveResyncEveryMs:1e3,math:e,...n}}function dn(){return{phase:"SELECT_DESTINATION",mode:"live",destination:null,xrAlive:!1,hitTest:!1,hidden:!1,alignment:null,landmarks:[],scan:null,live:null,confirmFrom:null,refusal:null,tracking:"ok",lostSince:null,lastXr:null,viewerXr:null,totalWalkedM:0,route:null,routePending:!1,lastRouteAt:-1/0,fired:[],guide:null,resyncMarkerId:null,pendingTap:null,ambiguous:null,message:"Where do you want to go?",lastLiveResyncAt:-1/0}}function Re(t){return t.phase==="GUIDE"&&t.xrAlive&&t.tracking==="ok"&&t.refusal===null&&t.confirmFrom===null&&t.alignment!==null&&t.route!==null}const ln=t=>[t[0],t[2]],U=(t,e)=>t.markers.get(e)?.label??`M${e}`;function hn(t,e,n){const i={...t},a=[];switch(e.type){case"SELECT":{i.destination=e.poi,i.route=null,i.fired=[],i.guide=null,i.xrAlive&&i.alignment?(i.phase=i.refusal||i.confirmFrom?"RESYNC":"GUIDE",i.message=`Guiding to ${e.poi.name}`):i.xrAlive?i.phase=i.mode==="live"?"SCAN_MARKER":"REFINE_TAP":(i.phase="START_XR",i.message=`Going to ${e.poi.name}. Tap Start AR, then point the camera at a floor marker.`);break}case"BACK":{i.phase="SELECT_DESTINATION",i.destination=null,i.route=null,i.guide=null,i.message="Where do you want to go?";break}case"START_AR":{if(i.phase==="START_XR"||i.phase==="SELECT_DESTINATION")a.push({type:"requestXr"}),i.message="Starting AR…";else if(i.phase==="CAMERA_SCAN"){if(!i.scan||e.t-i.scan.t>1500){i.message="Keep the marker in view, then tap Start AR.";break}a.push({type:"stopCamera"},{type:"requestXr"}),i.phase="ALIGN",i.message="Starting AR… keep the phone still."}break}case"XR_STARTED":{i.xrAlive=!0,i.hitTest=e.hitTest,i.tracking="ok",i.lostSince=null,i.phase==="ALIGN"&&i.scan?(i.mode="fallback",i.message="Hold still while AR starts tracking…"):e.cameraAccess?(i.mode="live",i.phase="SCAN_MARKER",i.message="Point the camera at a floor marker."):(i.mode="fallback",i.xrAlive=!1,i.phase="CAMERA_SCAN",i.message="Scan a floor marker with the camera, then tap Start AR.",a.push({type:"endXr"},{type:"startCamera"}));break}case"XR_FAILED":{i.xrAlive=!1,i.phase=i.destination?"START_XR":"SELECT_DESTINATION",i.message=`AR could not start: ${e.reason}`;break}case"XR_ENDED":{const o=i.xrAlive;if(i.xrAlive=!1,i.alignment=null,i.landmarks=[],i.live=null,i.confirmFrom=null,i.refusal=null,i.guide=null,i.lastXr=null,i.viewerXr=null,i.phase==="CAMERA_SCAN")break;o&&(i.phase=i.destination?"START_XR":"SELECT_DESTINATION",i.message="AR stopped. Tap Start AR and look at a floor marker to continue.");break}case"VISIBILITY":{i.hidden=e.hidden;break}case"CAM_MARKER":{if(i.phase!=="CAMERA_SCAN")break;if(!n.markers.has(e.markerId)){i.message=`Marker ${e.markerId} is not in this store's map.`;break}i.scan={markerId:e.markerId,camFromMarker:e.camFromMarker,t:e.t},i.message=`${U(n,e.markerId)} found. Tap Start AR.`;break}case"POSE":xn(i,e,n,a);break;case"LIVE_MARKER":un(i,e,n,a);break;case"TAP":fn(i,e,n,a);break;case"CHOOSE_MARKER":{if(!i.pendingTap)break;const o=i.pendingTap;i.pendingTap=null,i.ambiguous=null,Qe(i,e.markerId,o,e.t,n,a,"marker-tap");break}case"ROUTE":{i.routePending=!1,i.lastRouteAt=e.t,i.route={points:e.points,lengthM:e.lengthM,turns:Pt(e.points),version:(i.route?.version??0)+1},i.fired=[];break}case"ROUTE_FAILED":{i.routePending=!1,i.lastRouteAt=e.t,i.message="No walkable route from here. Step back into the aisle.";break}case"RESCAN":{i.alignment=null,i.landmarks=[],i.live=null,i.confirmFrom=null,i.refusal=null,i.xrAlive&&i.mode==="live"?(i.phase="SCAN_MARKER",i.message="Point the camera at a floor marker."):(i.phase="CAMERA_SCAN",i.scan=null,i.message="Scan a floor marker with the camera, then tap Start AR.",i.xrAlive&&a.push({type:"endXr"}),i.xrAlive=!1,a.push({type:"startCamera"}));break}}return{state:i,effects:a}}function xn(t,e,n,i){if(!t.xrAlive)return;if(!e.viewer||e.emulated){t.lostSince??=e.t,t.tracking="lost",t.phase==="GUIDE"&&e.t-t.lostSince>n.lostResyncMs?(t.phase="RESYNC",t.refusal="tracking",t.message=de(t,n),i.push({type:"speak",text:"Tracking lost. Look at a floor marker to re-sync."})):(t.phase==="GUIDE"||t.phase==="RESYNC")&&(t.message="Tracking lost — point the phone at the floor and move slowly.");return}t.tracking==="lost"&&(t.tracking="ok",t.lostSince=null,t.lastXr=e.viewer.position,t.phase==="GUIDE"&&(t.message=t.destination?`Guiding to ${t.destination.name}`:"")),t.viewerXr=e.viewer;const a=e.viewer.position;t.lastXr||(t.lastXr=a);const o=Math.hypot(a[0]-t.lastXr[0],a[2]-t.lastXr[2]);if(o>=n.stepM&&(t.totalWalkedM+=o,t.alignment&&(t.alignment={...t.alignment,walkedSinceM:t.alignment.walkedSinceM+o}),t.lastXr=a),t.phase==="ALIGN"&&t.scan){const _=n.math.composeMapFromXr(t.scan.camFromMarker,n.markers.get(t.scan.markerId).pose,e.gyroYawDelta??0,e.viewer);t.alignment={mapFromXr:{yaw:_.yaw,t:_.t},source:"marker-scan",at:e.t,walkedSinceM:0,residualM:0},t.hitTest?(t.phase="REFINE_TAP",t.message=`Aim the ring at the centre of ${U(n,t.scan.markerId)} and tap.`):(t.phase="GUIDE",t.message="No hit-test on this phone: alignment is from the scan only.");return}if(!t.alignment||!t.destination)return;const r=t.alignment.mapFromXr,s=L(r,a),c=[s[0],s[2]],h=K(r.yaw+He(e.viewer.quaternion));t.phase==="GUIDE"&&n.math.shouldRefuse(null,r,t.alignment.walkedSinceM,n.maxWalkM,a)&&(t.phase="RESYNC",t.refusal="walked",t.message=de(t,n,c),i.push({type:"speak",text:"Please re-sync at the nearest floor marker."},{type:"vibrate",pattern:[80,60,80]}));const d=Je(n,c),u=t.landmarks[t.landmarks.length-1],x=u&&d&&u.markerId===d.id&&t.alignment.walkedSinceM<3;t.resyncMarkerId=d&&d.d<=n.resyncPromptM&&!x?d.id:null,t.phase==="RESYNC"&&(t.message=de(t,n,c));const l=t.destination.approach;if(!t.route&&!t.routePending&&(t.routePending=!0,i.push({type:"route",from:c,to:l})),!t.route)return;const f=We(t.route.points,c);f.dist>n.offPathM&&!t.routePending&&e.t-t.lastRouteAt>=n.rerouteMinMs&&t.phase==="GUIDE"&&(t.routePending=!0,i.push({type:"route",from:c,to:l},{type:"toast",text:"Re-routing"}));const k=Math.max(0,t.route.lengthM-f.along)+f.dist,b=ge(t.route.points,Math.min(t.route.lengthM,f.along+2)).point,g=K(zt(b[0]-c[0],b[1]-c[1])-h),y=t.route.turns.find(_=>_.along>f.along+.3);if(t.guide={mapPos:c,heading:h,offPathM:f.dist,remainingM:k,relBearing:g,nextTurn:y?{dir:y.dir,inM:y.along-f.along}:null},!(t.phase!=="GUIDE"||!Re(t))){for(let _=0;_<t.route.turns.length;_++){const w=t.route.turns[_],p=w.along-f.along;!t.fired.includes(_)&&p<=n.geofenceM&&p>.3&&(t.fired=[...t.fired,_],i.push({type:"speak",text:Bt(w.dir,p)},{type:"vibrate",pattern:w.dir==="left"?[60]:[60,40,60]}))}if(Ke(c,l)<=n.arriveM){const _=t.destination.facing;if(_===void 0||Math.abs(K(h-_))<=n.arriveFacingRad){t.phase="ARRIVED";const w=t.destination.shelf,p=w?[w.aisle&&`aisle ${w.aisle}`,w.level!==void 0&&`shelf ${w.level}`].filter(Boolean).join(", "):"";t.message=`${t.destination.name}${p?` — ${p}`:""}`,i.push({type:"speak",text:`You have arrived. ${t.message}.`},{type:"vibrate",pattern:[200]})}else t.message="Almost there — turn to face the shelf."}}}function de(t,e,n){const i=t.refusal==="walked"?"Arrows paused: long walk since the last marker.":t.refusal==="tracking"?"Arrows paused: tracking was lost.":"Arrows paused: alignment needs confirming.",a=n?Je(e,n):null,o=t.mode==="live"?"Point the camera at":"Tap the centre of";return a?`${i} ${o} ${U(e,a.id)} (about ${Math.round(a.d)} m away).`:`${i} ${o} any floor marker.`}function Je(t,e){let n=null;for(const[i,a]of t.markers){const o=Ke(e,ln(a.centre));(!n||o<n.d)&&(n={id:i,d:o})}return n}function un(t,e,n,i){if(!t.xrAlive||t.mode!=="live"||t.tracking!=="ok"||!["SCAN_MARKER","GUIDE","RESYNC","ARRIVED"].includes(t.phase)||!n.markers.has(e.markerId))return;const o=[...t.live&&t.live.markerId===e.markerId?t.live.samples.filter(d=>e.t-d.t<=n.liveWindowMs):[],{t:e.t,a:e.mapFromXr,markerXr:e.markerXr}];if(t.live={markerId:e.markerId,samples:o},o.length<n.liveSamples){t.phase==="SCAN_MARKER"&&(t.message=`${U(n,e.markerId)} seen — hold steady…`);return}const r=o.slice(-n.liveSamples),s=r[r.length-1],c=n.math.fuseMarkerObservations(r.map(d=>({yaw:d.a.yaw,t:d.a.t})),s.markerXr);if(!c||c.spreadM>n.liveSpreadM||c.spreadYawRad>n.liveSpreadRad||c.inliers<c.n){t.live={markerId:e.markerId,samples:r.slice(1)};return}const h={yaw:c.yaw,t:c.t};t.live=null,!(t.phase==="GUIDE"&&t.landmarks.at(-1)?.markerId===e.markerId&&e.t-t.lastLiveResyncAt<n.liveResyncEveryMs)&&(t.lastLiveResyncAt=e.t,Ae(t,e.markerId,s.markerXr,h,e.t,n,i,"marker-scan"))}function Ae(t,e,n,i,a,o,r,s){const c=o.markers.get(e).centre,h=!t.alignment,d=t.viewerXr?.position??n,[u,x]=t.alignment?o.math.disagreement(t.alignment.mapFromXr,i,d):[0,0];if(t.confirmFrom){const k=Math.hypot(d[0]-t.confirmFrom[0],d[2]-t.confirmFrom[2]),b=t.landmarks.at(-1)?.markerId!==e;if(k<o.confirmMoveM&&!b)return}const l=!h&&o.math.shouldRefuse(t.alignment.mapFromXr,i,0,o.maxWalkM,d);if(t.alignment={mapFromXr:i,source:s,at:a,walkedSinceM:0,residualM:u},t.landmarks=[...t.landmarks,{markerId:e,xr:n,map:c,t:a}].slice(-4),t.resyncMarkerId=null,t.route=t.route,l){t.phase="RESYNC",t.refusal="disagreement",t.confirmFrom=d,t.message=`Alignment moved ${u.toFixed(2)} m / ${(Math.abs(x)*180/Math.PI).toFixed(1)}°. ${t.mode==="live"?"Step to a new spot and look at a marker again":"Tap one more marker"} to confirm.`,r.push({type:"speak",text:"Checking alignment. Look at a marker again from another spot."});return}const f=t.phase==="RESYNC"||t.phase==="SCAN_MARKER"||t.phase==="REFINE_TAP";t.refusal=null,t.confirmFrom=null,t.phase!=="ARRIVED"&&(t.phase=t.destination?"GUIDE":t.phase),h||f?(t.message=t.destination?`Aligned at ${U(o,e)}. Follow the arrows to ${t.destination.name}.`:"Aligned.",r.push({type:"speak",text:h?"Aligned. Follow the arrows.":"Re-synced. Arrows back on."},{type:"vibrate",pattern:[40]})):u>=.05&&r.push({type:"toast",text:`Re-synced at ${U(o,e)} (${(u*100).toFixed(0)} cm)`})}function fn(t,e,n,i){if(!t.xrAlive||!t.alignment)return;if(t.phase==="REFINE_TAP"&&t.scan){const r=n.markers.get(t.scan.markerId).centre,s=L(t.alignment.mapFromXr,e.pXr),c=Math.hypot(s[0]-r[0],s[2]-r[2]);if(c>n.refineMaxM){t.message=`That tap is ${c.toFixed(1)} m from where ${U(n,t.scan.markerId)} should be. Tap its centre.`;return}const h=t.alignment.mapFromXr.yaw,d=L({yaw:h,t:[0,0,0]},e.pXr);t.alignment=null,Ae(t,t.scan.markerId,e.pXr,{yaw:h,t:[r[0]-d[0],r[1]-d[1],r[2]-d[2]]},e.t,n,i,"marker-tap");const u=t.alignment;u&&(t.alignment={...u,residualM:c});return}if(t.phase!=="RESYNC"&&!(t.phase==="GUIDE"&&t.resyncMarkerId!==null))return;const a=L(t.alignment.mapFromXr,e.pXr),o=[...n.markers.entries()].map(([r,s])=>({id:r,d:Math.hypot(a[0]-s.centre[0],a[2]-s.centre[2])})).sort((r,s)=>r.d-s.d);if(!o.length||o[0].d>3){t.message="No marker is known near that spot. Tap the centre of a floor marker.";return}if(o[1]&&o[1].d<3&&o[1].d<o[0].d+1){t.pendingTap=e.pXr,t.ambiguous=o.filter(r=>r.d<3).map(r=>r.id),t.message="Which marker did you tap? Read the number on the sheet.";return}Qe(t,o[0].id,e.pXr,e.t,n,i,"marker-tap")}function Qe(t,e,n,i,a,o,r){if(!t.alignment||!a.markers.has(e))return;const s=a.markers.get(e).centre,c=[...t.landmarks].reverse().find(l=>l.markerId!==e),h=c?a.math.solveTwo(c.map,c.xr,s,n):null,d=h?h.yaw:t.alignment.mapFromXr.yaw,u=L({yaw:d,t:[0,0,0]},n),x={yaw:d,t:[s[0]-u[0],s[1]-u[1],s[2]-u[2]]};Ae(t,e,n,x,i,a,o,h?"two-landmark":r)}const pn=Object.assign({"../../../../shared/nav/route.ts":it}),J=Object.values(pn)[0]??null;J&&J.findPath;function mn(t,e,n,i=at){if(!t)return{points:[e,n],lengthM:De([e,n]),source:"straight-line"};if(J&&typeof J.findPath=="function"){const o=J.findPath(t,e,n,{radiusMm:i});return o&&{points:o.points,lengthM:o.lengthM,source:"shared-nav"}}const a=gn(t,e,n,i);return a&&{points:a,lengthM:De(a),source:"interim-astar"}}const Q=(t,e,n)=>t.occupancy[e]===0&&t.clearanceMm[e]>=n;function qe(t,e,n,i=2){const o=Ue(t,e[0],e[1])??[Math.max(0,Math.min(t.width-1,Math.floor((e[0]-t.originX)/t.cellSize))),Math.max(0,Math.min(t.height-1,Math.floor((e[1]-t.originZ)/t.cellSize)))],r=Math.ceil(i/t.cellSize);let s=null,c=1/0;for(let h=0;h<=r&&s===null;h++)for(let d=-h;d<=h;d++)for(let u=-h;u<=h;u++){if(Math.max(Math.abs(u),Math.abs(d))!==h)continue;const x=o[0]+u,l=o[1]+d;if(x<0||l<0||x>=t.width||l>=t.height)continue;const f=l*t.width+x;Q(t,f,n)&&u*u+d*d<c&&(c=u*u+d*d,s=f)}return s}function bn(t,e,n,i){const a=Math.hypot(n[0]-e[0],n[1]-e[1]),o=Math.max(1,Math.ceil(a/(t.cellSize*.5)));for(let r=0;r<=o;r++){const s=Ue(t,e[0]+(n[0]-e[0])*r/o,e[1]+(n[1]-e[1])*r/o);if(!s||!Q(t,s[1]*t.width+s[0],i))return!1}return!0}function gn(t,e,n,i){const a=qe(t,e,i),o=qe(t,n,i);if(a===null||o===null)return null;const r=t.width*t.height,s=new Float32Array(r).fill(1/0),c=new Int32Array(r).fill(-1),h=new Uint8Array(r),d=o%t.width,u=o/t.width|0,x=w=>{const p=Math.abs(w%t.width-d),R=Math.abs((w/t.width|0)-u);return Math.max(p,R)+(Math.SQRT2-1)*Math.min(p,R)},l=[],f=(w,p)=>{l.push(w,p);let R=l.length/2-1;for(;R>0;){const v=(R-1)/2|0;if(l[2*v]<=l[2*R])break;[l[2*v],l[2*R]]=[l[2*R],l[2*v]],[l[2*v+1],l[2*R+1]]=[l[2*R+1],l[2*v+1]],R=v}},k=()=>{const w=l[1],p=l.pop(),R=l.pop();if(l.length){l[0]=R===void 0?l[0]:p,l[1]=R;let v=0;const T=l.length/2;for(;;){const M=2*v+1,C=M+1;let E=v;if(M<T&&l[2*M]<l[2*E]&&(E=M),C<T&&l[2*C]<l[2*E]&&(E=C),E===v)break;[l[2*E],l[2*v]]=[l[2*v],l[2*E]],[l[2*E+1],l[2*v+1]]=[l[2*v+1],l[2*E+1]],v=E}}return w};s[a]=0,f(x(a),a);const b=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,Math.SQRT2],[1,-1,Math.SQRT2],[-1,1,Math.SQRT2],[-1,-1,Math.SQRT2]];for(;l.length;){const w=k();if(h[w])continue;if(w===o)break;h[w]=1;const p=w%t.width,R=w/t.width|0;for(const[v,T,M]of b){const C=p+v,E=R+T;if(C<0||E<0||C>=t.width||E>=t.height)continue;const S=E*t.width+C;if(h[S]||!Q(t,S,i)||v&&T&&(!Q(t,R*t.width+C,i)||!Q(t,E*t.width+p,i)))continue;const B=s[w]+M;B<s[S]&&(s[S]=B,c[S]=w,f(B+x(S),S))}}if(a!==o&&c[o]<0)return null;const g=[];for(let w=o;w!==-1;w=c[w])g.push(rt(t,w%t.width,w/t.width|0));g.reverse();const y=[g[0]];let _=0;for(;_<g.length-1;){let w=g.length-1;for(;w>_+1&&!bn(t,g[_],g[w],i);)w--;y.push(g[w]),_=w}return y}const le=-6,yn=14,he=-22,wn=2,V=.1;function vn(){const t=[],e=[[-5,-4.2],[-2,-1.2],[1.2,2],[4.2,5],[7.2,8],[10.2,11]],n=[[-10.5,-3.5],[-18.5,-13.5]],i=[[.85,.45,.25],[.3,.6,.85],[.45,.75,.4],[.85,.75,.3],[.65,.45,.8],[.8,.35,.45]];e.forEach(([x,l],f)=>n.forEach(([k,b],g)=>t.push({x0:x,z0:k,x1:l,z1:b,h:1.8,color:i[(f+g)%i.length]}))),t.push({x0:8.5,z0:-1.2,x1:12.5,z1:-.6,h:1,color:[.6,.6,.65]});const a=Math.round((yn-le)/V),o=Math.round((wn-he)/V),r=new Uint8Array(a*o);for(let x=0;x<o;x++)for(let l=0;l<a;l++){const f=le+(l+.5)*V,k=he+(x+.5)*V,b=l===0||x===0||l===a-1||x===o-1,g=t.some(y=>f>=y.x0&&f<=y.x1&&k>=y.z0&&k<=y.z1);r[x*a+l]=b||g?1:0}const s={width:a,height:o,cellSize:V,originX:le,originZ:he,floorY:0,occupancy:r,clearanceMm:kn(r,a,o,V)},c=(x,l,f,k,b)=>{const g=me(b),y=.09,_=Math.cos(b),w=Math.sin(b),p=(R,v)=>[f+_*R+w*v,0,k-w*R+_*v];return{id:x,label:l,pose:{position:[f,0,k],quaternion:g},corners:[p(-y,-y),p(y,-y),p(y,y),p(-y,y)],residualM:0,observations:0}},h={schema:"namma.markers/1",dictionary:"DICT_4X4_50",sizeM:.18,markers:[c(0,"M0 Entrance",0,0,0),c(1,"M1",0,-12,0),c(2,"M2",6,-12,-Math.PI/2),c(3,"M3",6,-2.5,Math.PI),c(4,"M4",-3,-20,Math.PI/2)]},d=(x,l,f,k,b,g,y,_=[])=>({id:x,name:l,kind:"product",aliases:_,categories:[],position:f,approach:k,facing:b,shelf:{aisle:g,level:y},source:"manual",confidence:1,confirmed:!0});return{storeId:"demo-mart",source:"demo-fallback",pois:{schema:"namma.pois/1",storeId:"demo-mart",updatedAt:"2026-09-14T00:00:00Z",pois:[d("poi_oats_01","Oats",[4.2,1.1,-16],[3.1,-16],-Math.PI/2,"A4",2,["rolled oats","oatmeal","jai"]),d("poi_rice_01","Basmati rice",[-1.2,.6,-6],[0,-6],Math.PI/2,"A2",1,["rice","chawal"]),d("poi_milk_01","Milk",[8,1,-21.8],[8,-20.6],0,"Dairy wall",2,["doodh","dairy"]),d("poi_tea_01","Tea",[-4.2,1.4,-15],[-3.1,-15],Math.PI/2,"A1",3,["chai"]),{...d("poi_checkout","Checkout",[10.5,1,-.9],[10.5,-2.2],Math.PI,"Front",0),kind:"checkout",shelf:void 0}]},markers:h,grid:s,shelves:t}}function kn(t,e,n,i){const a=e*n,o=new Int32Array(a).fill(-1),r=new Int32Array(a).fill(-1),s=new Float64Array(a).fill(1/0);for(let d=0;d<a;d++)t[d]!==0&&(o[d]=d%e,r[d]=d/e|0,s[d]=0);const c=(d,u)=>{if(o[u]<0)return;const x=d%e,l=d/e|0,f=(x-o[u])**2+(l-r[u])**2;f<s[d]&&(s[d]=f,o[d]=o[u],r[d]=r[u])};for(let d=0;d<n;d++)for(let u=0;u<e;u++){const x=d*e+u;u>0&&c(x,x-1),d>0&&c(x,x-e),u>0&&d>0&&c(x,x-e-1),u<e-1&&d>0&&c(x,x-e+1)}for(let d=n-1;d>=0;d--)for(let u=e-1;u>=0;u--){const x=d*e+u;u<e-1&&c(x,x+1),d<n-1&&c(x,x+e),u<e-1&&d<n-1&&c(x,x+e+1),u>0&&d<n-1&&c(x,x+e-1)}const h=new Uint16Array(a);for(let d=0;d<a;d++)h[d]=t[d]!==0?0:Math.min(65535,Math.max(0,Math.round((Math.sqrt(s[d])-.5)*i*1e3)));return h}async function xe(t){const e=await fetch(t);if(!e.ok)throw new Error(`${t}: ${e.status}`);return await e.json()}async function Rn(t,e){const n=`/namma-space-pages/app/stores/${encodeURIComponent(t)}/public/`;try{const i=await xe(n+"manifest.json"),[a,o]=await Promise.all([xe(n+i.pois),xe(n+i.markers)]);let r=null;try{const s=await fetch(n+i.navgrid.url);s.ok&&(r=ot(await s.arrayBuffer()))}catch{r=null}return a.pois=a.pois.filter(s=>s.confirmed),{storeId:t,source:"bundle",pois:a,markers:o,grid:r,shelves:[]}}catch{return vn()}}const An=`
#hud{position:fixed;inset:0;font:16px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#eafcff;pointer-events:none;z-index:2}
#hud *{box-sizing:border-box}
#hud [data-ui]{pointer-events:auto}
#hud [hidden]{display:none!important}
.hud-top{position:absolute;left:12px;right:12px;top:max(12px,env(safe-area-inset-top));display:flex;flex-direction:column;gap:8px;align-items:stretch}
.hud-msg{background:rgba(6,16,24,.78);border:1px solid rgba(80,230,255,.35);border-radius:14px;padding:12px 14px;font-size:20px;font-weight:600;backdrop-filter:blur(6px)}
.hud-msg.warn{border-color:#ffb020;color:#ffe2a8}
.hud-pills{display:flex;flex-wrap:wrap;gap:6px;font-size:12px}
.pill{background:rgba(6,16,24,.7);border-radius:999px;padding:3px 9px;border:1px solid rgba(255,255,255,.15)}
.pill.ok{border-color:#2fe39a;color:#b9ffe0}.pill.bad{border-color:#ff5a5a;color:#ffd0d0}
.hud-arrow{position:absolute;left:50%;top:34%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:4px;filter:drop-shadow(0 0 12px rgba(40,230,255,.9))}
.hud-arrow svg{width:120px;height:120px;transition:transform .15s linear}
.hud-dist{font-size:34px;font-weight:800;text-shadow:0 0 10px rgba(0,0,0,.8)}
.hud-next{font-size:18px;font-weight:600;background:rgba(6,16,24,.7);padding:4px 12px;border-radius:10px}
.hud-bottom{position:absolute;left:12px;right:12px;bottom:max(14px,env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:8px}
.sheet{background:rgba(6,16,24,.88);border:1px solid rgba(80,230,255,.3);border-radius:18px;padding:12px;max-height:55vh;overflow:auto}
.btn{appearance:none;border:0;border-radius:14px;padding:14px 16px;font-size:18px;font-weight:700;background:#16d9ff;color:#012;min-height:52px;width:100%}
.btn.ghost{background:rgba(255,255,255,.1);color:#eafcff}
.row{display:flex;gap:8px}.row .btn{flex:1}
.search{width:100%;font-size:18px;padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:rgba(0,0,0,.35);color:#fff;margin-bottom:8px}
.poi{display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;background:rgba(255,255,255,.06);margin-top:6px;font-size:18px}
.poi small{opacity:.7}
.card h2{margin:0 0 4px;font-size:28px}.card p{margin:0 0 10px;font-size:20px;opacity:.9}
.toast{position:absolute;left:50%;top:56%;transform:translateX(-50%);background:rgba(20,220,140,.9);color:#012;font-weight:700;padding:8px 14px;border-radius:12px;opacity:0;transition:opacity .3s}
.toast.show{opacity:1}
.scan-video{position:fixed;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}
`;class _n{constructor(e,n,i){this.pois=n,this.h=i;const a=document.createElement("style");a.textContent=An,document.head.append(a),this.root=document.createElement("div"),this.root.id="hud",this.root.innerHTML=`
      <div class="hud-top"><div class="hud-msg" id="msg"></div><div class="hud-pills" id="pills"></div></div>
      <div class="hud-arrow" id="arrow" hidden>
        <svg viewBox="-50 -50 100 100" id="arrowSvg"><path d="M0,-42 L34,4 L12,4 L12,40 L-12,40 L-12,4 L-34,4 Z" fill="#26e6ff" stroke="#e8feff" stroke-width="3"/></svg>
        <div class="hud-dist" id="dist"></div><div class="hud-next" id="next"></div>
      </div>
      <div class="toast" id="toast"></div>
      <div class="hud-bottom" id="bottom"></div>`,e.append(this.root);for(const o of["msg","pills","arrow","arrowSvg","dist","next","toast","bottom"])this.el[o]=this.root.querySelector(`#${o}`)}pois;h;root;el={};lastSheet="";toastTimer=0;toast(e){const n=this.el.toast;n.textContent=e,n.classList.add("show"),clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>n.classList.remove("show"),1800)}render(e,n){this.el.msg.textContent=e.message,this.el.msg.classList.toggle("warn",e.phase==="RESYNC"||e.tracking==="lost");const i=e.alignment,a=[[e.xrAlive?e.tracking==="ok"?"ok":"bad":"",e.xrAlive?`tracking ${e.tracking}`:"AR off"],[i?"ok":"",i?`aligned ${i.source} · yaw ${(i.mapFromXr.yaw*180/Math.PI).toFixed(1)}° · Δ ${(i.residualM*100).toFixed(0)} cm · walked ${i.walkedSinceM.toFixed(1)} m`:"not aligned"],["",`${n.fps.toFixed(0)} fps`],["",n.detect],[n.storeSource==="bundle"?"":"bad",n.storeSource]];this.el.pills.innerHTML=a.map(([r,s])=>`<span class="pill ${r}">${s}</span>`).join("");const o=Re(e)&&!!e.guide;if(this.el.arrow.hidden=!o,o&&e.guide){const r=-e.guide.relBearing*180/Math.PI;this.el.arrowSvg.style.transform=`rotate(${r.toFixed(1)}deg)`,this.el.dist.textContent=`${e.guide.remainingM.toFixed(0)} m`;const s=e.guide.nextTurn;this.el.next.textContent=s?`Turn ${s.dir} in ${Math.max(1,Math.round(s.inM))} m`:"Straight on"}this.renderSheet(e,n)}renderSheet(e,n){const i=`${e.phase}|${e.destination?.id}|${e.ambiguous?.join()}|${e.mode}|${e.phase==="GUIDE"?e.resyncMarkerId:""}`;if(i===this.lastSheet)return;this.lastSheet=i;const a=this.el.bottom;a.innerHTML="";const o=(s,c,h=!1)=>{const d=document.createElement("button");return d.className=`btn${h?" ghost":""}`,d.dataset.ui="",d.textContent=s,d.onclick=u=>{u.stopPropagation(),c()},d},r=document.createElement("div");switch(r.className="sheet",r.dataset.ui="",e.phase){case"SELECT_DESTINATION":{const s=document.createElement("input");s.className="search",s.placeholder="Search: oats, rice, milk…",s.dataset.ui="";const c=document.createElement("div"),h=()=>{const d=s.value.trim().toLowerCase();c.innerHTML="";for(const u of this.pois.filter(x=>!d||[x.name,...x.aliases,...x.categories].some(l=>l.toLowerCase().includes(d))).slice(0,8)){const x=document.createElement("div");x.className="poi",x.dataset.ui="",x.innerHTML=`<span>${u.name}</span><small>${u.shelf?.aisle??u.kind}</small>`,x.onclick=()=>this.h.select(u),c.append(x)}};s.oninput=h,h(),r.append(s,c);break}case"START_XR":r.append(o("Start AR",this.h.startAr),o("Choose another item",this.h.back,!0));break;case"CAMERA_SCAN":r.append(o("Start AR",this.h.startAr),o("Cancel",this.h.back,!0));break;case"SCAN_MARKER":case"ALIGN":r.append(o("End AR",this.h.end,!0));break;case"REFINE_TAP":r.append(o("Mark marker centre here",this.h.tapHere),o("Re-scan",this.h.rescan,!0));break;case"GUIDE":{const s=document.createElement("div");s.className="row",e.mode==="fallback"&&e.resyncMarkerId!==null&&s.append(o(`Re-sync at ${n.markerLabel(e.resyncMarkerId)}`,this.h.tapHere)),s.append(o("Other item",this.h.back,!0),o("End",this.h.end,!0)),r.append(s);break}case"RESYNC":{if(e.ambiguous)for(const s of e.ambiguous)r.append(o(`I tapped ${n.markerLabel(s)}`,()=>this.h.chooseMarker(s)));else e.mode==="fallback"&&r.append(o("Mark marker centre here",this.h.tapHere));r.append(o("Start over from a marker",this.h.rescan,!0));break}case"ARRIVED":{const s=e.destination,c=document.createElement("div");c.className="card",c.innerHTML=`<h2>${s?.name??""}</h2><p>${[s?.shelf?.aisle&&`Aisle ${s.shelf.aisle}`,s?.shelf?.bay!==void 0&&`Bay ${s.shelf.bay}`,s?.shelf?.level!==void 0&&`Shelf ${s.shelf.level}`].filter(Boolean).join(" · ")}</p>`,r.append(c,o("Find next item",this.h.back),o("Done",this.h.end,!0));break}}a.append(r)}}const ne={maxResidualM:.02,maxRangeM:3,crossCheckRad:3*Math.PI/180,rowLockVotes:3};async function Mn(t,e){const n=await Rn(e.storeId),i=new Map(n.markers.markers.map(m=>[m.id,m])),a=cn(n.markers,Lt,{maxWalkM:ye});let o=dn(),r=null,s;if(e.emulate){const m=document.createElement("canvas");m.style.cssText="position:fixed;inset:0;width:100%;height:100%;display:block;z-index:0",t.append(m),r=new sn(m,n),r.cameraAccess=e.cameraAccess,s=r}else s=new $t;const c=new Ut(s.gl),h=new dt,d=new It;e.emulate||window.addEventListener("deviceorientation",m=>d.addOrientation(m.timeStamp,m.alpha,m.beta,m.gamma));const u=(m,A)=>r?r.headingDelta(m,A):d.deltaYaw(m,A);let x=0,l=0,f=performance.now(),k="detector idle",b=null,g=2,y=null;const _={true:0,false:0};let w=0;const p=m=>i.get(m)?.label??`M${m}`,R=new _n(t,n.pois.pois,{select:m=>S({type:"SELECT",poi:m}),back:()=>S({type:"BACK"}),startAr:()=>S({type:"START_AR",t:performance.now()}),rescan:()=>S({type:"RESCAN"}),tapHere:()=>v&&S({type:"TAP",t:performance.now(),pXr:v}),chooseMarker:m=>S({type:"CHOOSE_MARKER",t:performance.now(),markerId:m}),end:()=>{s.end(),S({type:"BACK"})}});let v=null;const T=()=>R.render(o,{fps:x,detect:k,storeSource:n.source==="bundle"?n.storeId:"demo store (no bundle)",markerLabel:p});let M=null,C="";function E(m){switch(m.type){case"requestXr":s.start(R.root).then(A=>{window.__xrInfo=A,S({type:"XR_STARTED",t:performance.now(),cameraAccess:A.cameraAccess,hitTest:A.hitTest})}).catch(A=>S({type:"XR_FAILED",reason:String(A?.message??A)}));break;case"endXr":s.end();break;case"startCamera":M=r?En(r):new ct,M.onImage=B,M.start(t).catch(A=>R.toast(`Camera: ${A}`));break;case"stopCamera":M?.stop(),M=null;break;case"route":{const A=mn(n.grid,m.from,m.to),I=performance.now();S(A?{type:"ROUTE",t:I,points:A.points,lengthM:A.lengthM}:{type:"ROUTE_FAILED",t:I});break}case"speak":if("speechSynthesis"in window&&m.text!==C){C=m.text,speechSynthesis.cancel();const A=new SpeechSynthesisUtterance(m.text);A.onend=()=>C="",speechSynthesis.speak(A)}break;case"vibrate":navigator.vibrate?.(m.pattern);break;case"toast":R.toast(m.text);break}}function S(m){const A=hn(o,m,a),I=A.state.phase!==o.phase;o=A.state,A.effects.forEach(E);const F=performance.now();(m.type!=="POSE"||I||F-w>100)&&(w=F,T())}s.onFrame=m=>{if(l++,m.t-f>=1e3&&(x=l*1e3/(m.t-f),l=0,f=m.t),v=m.reticle,m.views[0])try{localStorage.setItem("namma.xrFovY",String(2*Math.atan(1/m.views[0].projection[5])))}catch{}S({type:"POSE",t:m.t,viewer:m.viewer,emulated:m.emulated,gyroYawDelta:o.phase==="ALIGN"&&o.scan?u(o.scan.t,m.t):null});const A=s.gl,I=o.route&&o.guide?We(o.route.points,o.guide.mapPos).along:0,F=o.mode==="fallback"&&(o.phase==="REFINE_TAP"||o.phase==="RESYNC"||o.resyncMarkerId!==null),N=b&&m.t-b.t<1200?i.get(b.id):null;c.build({mapFromXr:o.alignment?.mapFromXr??null,route:o.route?.points??null,routeLengthM:o.route?.lengthM??0,along:I,floorY:n.grid?.floorY??0,showArrows:Re(o),reticle:F?m.reticle:null,reticleColor:[1,.85,.2],destination:o.destination?.approach??null,markerOutlines:N&&o.alignment?[N.corners]:[]});for(const D of m.views)A.bindFramebuffer(A.FRAMEBUFFER,D.framebuffer),A.viewport(D.viewport[0],D.viewport[1],D.viewport[2],D.viewport[3]),c.draw(D.projection,D.viewMatrix,o.alignment?.mapFromXr??null,n.grid?.floorY??0,m.t/1e3)},s.onTap=(m,A)=>S({type:"TAP",t:A,pXr:m}),s.onEnd=()=>S({type:"XR_ENDED"}),document.addEventListener("visibilitychange",()=>S({type:"VISIBILITY",hidden:document.hidden})),s.onCameraImage=m=>{if(o.mode!=="live"||!["SCAN_MARKER","GUIDE","RESYNC","ARRIVED"].includes(o.phase))return;const A=s.flipRows,I=h.detect(m.rgba,m.width,m.height);I&&I.then(F=>{let N=0,D=!1;for(const Y of F.markers){const ie=i.get(Y.id);if(!ie)continue;const G=Ce(Y.corners,n.markers.sizeM,m.K),H=G&&Mt(G.pose,ie.pose,m.xrFromView),Me=!!G&&G.altReprojErrPx>1.5*G.reprojErrPx,et=!!H&&Me&&H.residualTiltRad<=Ee;if(y===null){et&&(D=!0,++_[A?"true":"false"]>=ne.rowLockVotes&&(y=A,R.toast("Camera image orientation locked")));continue}const j=Nt(Y.corners,m.K,m.xrFromView,ie.pose,n.markers.sizeM);!j||j.residualM>ne.maxResidualM||j.rangeM>ne.maxRangeM||Me&&H&&(H.residualTiltRad>Ee||Math.abs(K(H.yaw-j.mapFromXr.yaw))>ne.crossCheckRad)||(N++,b={id:Y.id,t:performance.now()},S({type:"LIVE_MARKER",t:performance.now(),markerId:Y.id,mapFromXr:j.mapFromXr,markerXr:j.markerXr}))}y===null&&!D&&(s.flipRows=!s.flipRows);const _e=F.ms+m.readMs;_e>150&&g<4?g++:_e<50&&g>2&&g--,s.setCapture(5,g),k=`${m.width}×${m.height} ${F.ms.toFixed(0)}+${m.readMs.toFixed(0)} ms · ${F.markers.length} seen · ${N} used${y===null?" · orienting":""}`})};function B(m){const A=h.detect(m.rgba,m.width,m.height);A&&A.then(I=>{k=`scan ${m.width}×${m.height} ${I.ms.toFixed(0)} ms · ${I.markers.length} seen`;for(const F of I.markers){if(!i.has(F.id))continue;const N={fx:m.fy,fy:m.fy,cx:m.width/2-.5,cy:m.height/2-.5},D=Ce(F.corners,n.markers.sizeM,N);if(!(!D||D.altReprojErrPx<1.5*D.reprojErrPx)){S({type:"CAM_MARKER",t:m.t,markerId:F.id,camFromMarker:D.pose});break}}T()})}r&&Sn(t,r,e),T(),window.__ar={get state(){return o},emu:r,store:n}}function En(t){let e=0;const n={onImage:null,async start(){const i=()=>{const a=t.captureForScan(performance.now());n.onImage?.({rgba:a.rgba,width:a.width,height:a.height,fy:a.K.fy,t:a.t}),e=window.setTimeout(i,200)};i()},stop(){clearTimeout(e)}};return n}function Sn(t,e,n){const i=document.createElement("div");i.dataset.ui="",i.style.cssText="position:fixed;left:10px;top:150px;z-index:3;background:rgba(6,16,24,.85);color:#dff;font:12px system-ui;padding:10px;border-radius:12px;width:210px;border:1px solid rgba(80,230,255,.3)",i.innerHTML=`<details id="emud"><summary><b>Emulator</b> (${n.cameraAccess?"camera-access":"fallback"})</summary>
    WASD walk · Q/E turn · R/F tilt · drag look · Space/click = tap · L = lose tracking
    <label style="display:block;margin-top:8px">Scale drift <span id="lv">0</span> %<input id="lin" type="range" min="0" max="10" step="0.5" value="0" style="width:100%"></label>
    <label style="display:block">Yaw drift <span id="yv">0</span> °/10 m<input id="yaw" type="range" min="0" max="15" step="0.5" value="0" style="width:100%"></label>
    <label><input id="lost" type="checkbox"> tracking lost (emulatedPosition)</label>
    <div id="truth" style="margin-top:6px;opacity:.8"></div></details>`,t.append(i);const a=o=>i.querySelector(`#${o}`);a("lin").oninput=()=>{e.drift.linearPct=Number(a("lin").value),a("lv").textContent=a("lin").value},a("yaw").oninput=()=>{e.drift.yawDegPer10m=Number(a("yaw").value),a("yv").textContent=a("yaw").value},a("lost").onchange=()=>e.drift.lost=a("lost").checked,setInterval(()=>{a("lost").checked=e.drift.lost,i.querySelector("#truth").textContent=`truth x ${e.truth.x.toFixed(2)} z ${e.truth.z.toFixed(2)} yaw ${(e.truth.yaw*180/Math.PI).toFixed(0)}°`},250)}const ue=new URLSearchParams(location.search),Oe=document.getElementById("app");Mn(Oe,{emulate:ue.has("emulate"),storeId:ue.get("store")??"demo-mart",cameraAccess:ue.get("camera")!=="0"}).catch(t=>{Oe.textContent=`AR failed to start: ${t?.message??t}`,console.error(t)});
