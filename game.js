import * as THREE from 'three';

const host = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#18212a');
scene.fog = new THREE.Fog('#18212a', 10, 25);
const camera = new THREE.PerspectiveCamera(43, 1, .1, 100);
camera.position.set(0, 5.2, 10.5);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xbcd2e2, 0x29201c, 2.0));
const key = new THREE.DirectionalLight(0xffe0b8, 4.1); key.position.set(-4, 8, 5); key.castShadow = true; key.shadow.mapSize.set(2048,2048); key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=9;key.shadow.camera.bottom=-9;scene.add(key);
const rim = new THREE.PointLight(0x54bff3, 25, 12); rim.position.set(4,3,1); scene.add(rim);
const warm = new THREE.PointLight(0xff8b4c, 18, 9); warm.position.set(-4,2,-2); scene.add(warm);

const floorMat = new THREE.MeshStandardMaterial({ color: '#3a4143', roughness: .78, metalness: .18 });
const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), floorMat); floor.rotation.x=-Math.PI/2; floor.position.y=-.08; floor.receiveShadow=true; scene.add(floor);
const grid = new THREE.GridHelper(22, 22, 0x657279, 0x465159); grid.position.y=-.065; grid.material.transparent=true;grid.material.opacity=.38;scene.add(grid);
function box(w,h,d,mat,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
const wallMat=new THREE.MeshStandardMaterial({color:'#29343b',roughness:.88});
box(22,7,.35,wallMat,0,3.4,-7.4);box(.35,7,15,wallMat,-10.9,3.4,0);box(.35,7,15,wallMat,10.9,3.4,0);
// Industrial wall ribs and a soft overhead panel
const ribMat=new THREE.MeshStandardMaterial({color:'#445057',metalness:.55,roughness:.55});
for(let x=-9;x<=9;x+=3)box(.08,6.5,.1,ribMat,x,3.4,-7.18);
const ceiling=new THREE.Mesh(new THREE.PlaneGeometry(8,3),new THREE.MeshBasicMaterial({color:0xd8edff,transparent:true,opacity:.16}));ceiling.rotation.x=Math.PI/2;ceiling.position.set(0,6.8,-2);scene.add(ceiling);
// Raised test pad
const padMat=new THREE.MeshStandardMaterial({color:'#555e60',roughness:.5,metalness:.5});
const pad=box(5.2,.16,4.2,padMat,0,.06,-.35);pad.position.y=-.03;
for(const [x,z] of [[-2.35,-2.15],[2.35,-2.15],[-2.35,1.45],[2.35,1.45]]){const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.02,16),new THREE.MeshStandardMaterial({color:'#a7b0ad',metalness:.85,roughness:.25}));bolt.position.set(x,.065,z);scene.add(bolt)}
// The pillar Paul described: a heavy, ribbed steel column with an amber status ring.
const pillarMat=new THREE.MeshStandardMaterial({color:'#667074',metalness:.76,roughness:.28});
const pillar=new THREE.Group();pillar.position.set(-3.55,0,-1.3);scene.add(pillar);
const base=new THREE.Mesh(new THREE.CylinderGeometry(.8,.9,.3,48),new THREE.MeshStandardMaterial({color:'#252d31',metalness:.82,roughness:.3}));base.position.y=.15;base.castShadow=true;pillar.add(base);
const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.48,.62,2.65,48),pillarMat);shaft.position.y=1.62;shaft.castShadow=true;shaft.receiveShadow=true;pillar.add(shaft);
const cap=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.17,48),new THREE.MeshStandardMaterial({color:'#303a3e',metalness:.85,roughness:.23}));cap.position.y=2.98;cap.castShadow=true;pillar.add(cap);
const amber=new THREE.Mesh(new THREE.TorusGeometry(.51,.045,12,48),new THREE.MeshStandardMaterial({color:'#ff9b48',emissive:'#e35216',emissiveIntensity:2.2,metalness:.3,roughness:.22}));amber.rotation.x=Math.PI/2;amber.position.y=2.78;pillar.add(amber);
for(let y=.55;y<2.65;y+=.42){const band=new THREE.Mesh(new THREE.TorusGeometry(.51+(2.6-y)*.035,.028,8,48),new THREE.MeshStandardMaterial({color:'#313b40',metalness:.9,roughness:.28}));band.rotation.x=Math.PI/2;band.position.y=y;pillar.add(band)}
// Compact spherical singularity and accretion disk
const hole=new THREE.Group();hole.position.set(.25,.67,-.35);scene.add(hole);
const core=new THREE.Mesh(new THREE.SphereGeometry(.39,48,32),new THREE.MeshBasicMaterial({color:0x020206}));hole.add(core);
const haloLight=new THREE.PointLight(0x9a54ff,0,7);haloLight.position.y=.5;hole.add(haloLight);
const diskMat=new THREE.MeshBasicMaterial({color:0xffb257,transparent:true,opacity:.86,side:THREE.DoubleSide});
const disk=new THREE.Mesh(new THREE.TorusGeometry(.76,.19,16,96),diskMat);disk.rotation.x=Math.PI/2.28;hole.add(disk);
const disk2=new THREE.Mesh(new THREE.TorusGeometry(.58,.07,12,80),new THREE.MeshBasicMaterial({color:0x56c7f5,transparent:true,opacity:.9,side:THREE.DoubleSide}));disk2.rotation.x=Math.PI/2.28;disk2.rotation.y=.35;hole.add(disk2);
const ring=new THREE.Mesh(new THREE.TorusGeometry(.47,.018,8,72),new THREE.MeshBasicMaterial({color:0xe6d4ff,transparent:true,opacity:.45}));ring.rotation.x=Math.PI/2.28;hole.add(ring);
// Props scattered around the test chamber
const objects=[];
const mats=[new THREE.MeshStandardMaterial({color:'#e6ae6b',roughness:.3,metalness:.45}),new THREE.MeshStandardMaterial({color:'#6dc4ca',roughness:.24,metalness:.6}),new THREE.MeshStandardMaterial({color:'#d86955',roughness:.36,metalness:.25}),new THREE.MeshStandardMaterial({color:'#a9b1b5',roughness:.26,metalness:.82}),new THREE.MeshStandardMaterial({color:'#8b79d9',roughness:.3,metalness:.5})];
function addProp(geo,mat,x,z,s=1){const m=new THREE.Mesh(geo,mat);m.position.set(x,.42*s,z);m.scale.setScalar(s);m.castShadow=true;m.receiveShadow=true;scene.add(m);objects.push({mesh:m, home:m.position.clone(), rot:m.rotation.clone(), phase:Math.random()*6.28, scale:s, gone:false});return m;}
addProp(new THREE.BoxGeometry(.68,.78,.62),mats[0],-2.25,-2.25,.8);
addProp(new THREE.DodecahedronGeometry(.46,1),mats[1],2.35,-2.1,.95);
addProp(new THREE.CylinderGeometry(.28,.33,.85,32),mats[2],3.2,.82,.88);
addProp(new THREE.TorusKnotGeometry(.32,.12,80,12),mats[4],-2.4,1.95,.83);
addProp(new THREE.SphereGeometry(.43,32,24),mats[3],4.3,-.8,.82);
addProp(new THREE.ConeGeometry(.43,.82,6),mats[0],-5.3,.55,.9);
addProp(new THREE.BoxGeometry(.7,.7,.7),mats[2],5,-3.2,.75);
addProp(new THREE.TorusGeometry(.42,.13,18,32),mats[1],-5.7,-3.5,.9);
addProp(new THREE.CylinderGeometry(.35,.35,.7,8),mats[4],6,-1.1,.75);
addProp(new THREE.IcosahedronGeometry(.47,1),mats[0],-1.7,-5.1,.82);
addProp(new THREE.BoxGeometry(.58,.95,.55),mats[3],3.2,-5,.82);
// Dust glints
const dustGeo=new THREE.BufferGeometry(), dustCount=260, positions=new Float32Array(dustCount*3);for(let i=0;i<dustCount;i++){positions[i*3]=(Math.random()-.5)*19;positions[i*3+1]=Math.random()*5.5+.15;positions[i*3+2]=(Math.random()-.5)*12-1;}dustGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xc9deec,size:.025,transparent:true,opacity:.52}));scene.add(dust);

let active=false, yaw=0, pitch=0, zoom=10.5, dragging=false,lastX=0,lastY=0, audioOn=false, audioCtx=null;
const $=s=>document.querySelector(s), activate=$('#activate'), absorbedCount=$('#absorbedCount'), sceneMessage=$('#sceneMessage');
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(host);resize();
function setActive(value){active=value;activate.classList.toggle('running',active);activate.setAttribute('aria-pressed',String(active));$('#buttonLabel').textContent=active?'OPREȘTE GAURA':'ACTIVEAZĂ GAURA';$('#controlTitle').textContent=active?'Gaura e pornită!':'Gata de pornire?';$('#controlText').textContent=active?'Privește obiectele cum sunt atrase. Apasă din nou ca să resetezi runda.':'Apasă butonul și atrage toate cele 11 obiecte în gaură.';sceneMessage.textContent=active?'ATRACȚIE ACTIVĂ · 0 / 11':'APASĂ BUTONUL CA SĂ ÎNCEPI';$('#status').dataset.active=String(active);$('#statusLabel').textContent=active?'GRAVITAȚIE ACTIVĂ':'GATA DE PORNIRE';if(audioOn)beep(active?110:260,.13)}
activate.addEventListener('click',()=>setActive(!active));window.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();setActive(!active)}});
host.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;host.setPointerCapture(e.pointerId)});host.addEventListener('pointermove',e=>{if(!dragging)return;yaw+=(e.clientX-lastX)*.004;pitch=Math.max(-.2,Math.min(.45,pitch+(e.clientY-lastY)*.0025));lastX=e.clientX;lastY=e.clientY});host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('wheel',e=>{zoom=Math.max(7.5,Math.min(14,zoom+e.deltaY*.005))},{passive:true});
$('#zoomIn').addEventListener('click',()=>zoom=Math.max(7.5,zoom-.8));$('#zoomOut').addEventListener('click',()=>zoom=Math.min(14,zoom+.8));
function beep(freq,duration){if(!audioCtx)audioCtx=new AudioContext();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.frequency.value=freq;osc.type='sine';gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.07,audioCtx.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration)}
$('#soundButton').addEventListener('click',()=>{audioOn=!audioOn;$('#soundButton').classList.toggle('active',audioOn);$('#soundButton').setAttribute('aria-label',audioOn?'Oprește sunetul':'Pornește sunetul');if(audioOn)beep(440,.15)});
function animate(){requestAnimationFrame(animate);const t=performance.now()*.001;hole.rotation.y+=.007;disk.rotation.z+=.003;disk2.rotation.z-=.005;core.scale.setScalar(1+Math.sin(t*2)*.025);dust.rotation.y+=.00018;
  for(const o of objects){const m=o.mesh;if(active&&!o.gone){const dx=hole.position.x-m.position.x,dz=hole.position.z-m.position.z,dist=Math.max(.01,Math.hypot(dx,dz));const force=Math.min(.07,.014/(dist*.24+.09));m.position.x+=dx*force;m.position.z+=dz*force;m.position.y+=((.7+Math.min(1.7,1.2/dist))-m.position.y)*.018;m.rotation.x+=.012+force*5;m.rotation.y+=.02+force*8;if(dist<.57){o.gone=true;m.visible=false;if(audioOn)beep(160+Math.random()*120,.12)}}else if(!o.gone){m.position.y=o.home.y+Math.sin(t*1.7+o.phase)*.025;m.rotation.y+=(o.rot.y+Math.sin(t+o.phase)*.08-m.rotation.y)*.025}}
  const absorbed=objects.filter(o=>o.gone).length;absorbedCount.textContent=`${absorbed} / ${objects.length}`;if(active){haloLight.intensity=30+Math.sin(t*5)*5;diskMat.opacity=.72+Math.sin(t*7)*.12;hole.scale.setScalar(1+Math.sin(t*3)*.035);if(absorbed===objects.length){sceneMessage.textContent='CAMERĂ GOLITĂ · PAUL A REUȘIT';$('#controlTitle').textContent='Ai absorbit tot!';$('#controlText').textContent='Apasă „Oprește gaura” pentru o nouă rundă.'}else sceneMessage.textContent=`ATRACȚIE ACTIVĂ · ${absorbed} / ${objects.length}`}else{haloLight.intensity=0;hole.scale.setScalar(1);for(const o of objects)if(o.gone){o.gone=false;o.mesh.visible=true;o.mesh.position.lerp(o.home,.045);o.mesh.rotation.set(0,0,0)}}
 const target=new THREE.Vector3(Math.sin(yaw)*zoom,4.4+pitch*5,Math.cos(yaw)*zoom);target.y+=.2;camera.position.lerp(target,.025);camera.lookAt(0,1.1,-.5);renderer.render(scene,camera)}animate();
