import * as THREE from 'three';

export function createJourney(container: HTMLElement, onUnavailable: () => void) {
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(37, 1, .1, 200);
 camera.position.set(24, 32, 29); camera.lookAt(0, 0, 0);
 let renderer: THREE.WebGLRenderer;
 try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); } catch { onUnavailable(); return {update:(_p:number)=>{},setTheme:(_d:boolean)=>{}}; }
 renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.setClearColor(0,0); renderer.domElement.setAttribute('aria-hidden','true'); container.prepend(renderer.domElement);
 scene.add(new THREE.AmbientLight(0xffffff, 2.1));
 const sun=new THREE.DirectionalLight(0xfff5e5,3.4); sun.position.set(-8,22,12); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24}); sun.shadow.normalBias=.03; scene.add(sun);
 const mat=(color:THREE.ColorRepresentation, roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
 const grass=mat('#d9e1c9'), edge=mat('#c1cbb0'), asphalt=mat('#535862'), white=mat('#f6f3dd'), purple=mat('#8351d8'), dark=mat('#25313b'), leaf=mat('#729773'), trunk=mat('#9a8467');
 function box(w:number,h:number,d:number,m:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=scene){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 const island=box(29,.65,24,edge,0,-.58,0); island.rotation.y=-.06;
 const ground=box(28.9,.12,23.9,grass,0,-.2,0); ground.rotation.y=-.06;
 const curve=new THREE.CatmullRomCurve3([
 new THREE.Vector3(-9,0,8),new THREE.Vector3(-10,0,3),new THREE.Vector3(-8,0,-2),new THREE.Vector3(-10,0,-7),new THREE.Vector3(-5,0,-8),new THREE.Vector3(-2,0,-4),new THREE.Vector3(3,0,-5),new THREE.Vector3(7,0,-8),new THREE.Vector3(11,0,-4),new THREE.Vector3(8,0,0),new THREE.Vector3(3,0,1),new THREE.Vector3(2,0,5),new THREE.Vector3(8,0,6),new THREE.Vector3(9,0,9),new THREE.Vector3(3,0,9),new THREE.Vector3(-2,0,7),new THREE.Vector3(-5,0,8)
 ],false,'catmullrom',.45);
 function ribbon(width:number,y:number,material:THREE.Material){const vertices:number[]=[]; const indices:number[]=[];for(let i=0;i<=500;i++){const t=i/500,p=curve.getPointAt(t),v=curve.getTangentAt(t); const n=new THREE.Vector3(-v.z,0,v.x).normalize().multiplyScalar(width/2);vertices.push(p.x+n.x,y,p.z+n.z,p.x-n.x,y,p.z-n.z);if(i<500){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();const m=new THREE.Mesh(geo,material);m.receiveShadow=true;scene.add(m);return m;}
 ribbon(2.3,-.09,white); ribbon(2.05,-.07,asphalt);
 for(let i=0;i<145;i++){const t=i/145,p=curve.getPointAt(t),v=curve.getTangentAt(t);const dash=box(.065,.025,.27,white,p.x,-.045,p.z);dash.rotation.y=Math.atan2(v.x,v.z);}
 // A small, hand-modelled hatchback, facing local +Z.
 const car=new THREE.Group(); scene.add(car);
 box(.84,.33,1.6,purple,0,.39,0,car);box(.72,.34,.8,purple,0,.7,-.08,car);
 const glass=mat('#243948',.2);box(.64,.27,.035,glass,0,.69,.34,car);box(.64,.25,.035,glass,0,.69,-.49,car);
 for(const x of [-.37,.37])box(.025,.24,.65,glass,x,.7,-.08,car);
 box(.72,.04,.62,purple,0,.89,-.08,car);
 for(const x of [-.44,.44])for(const z of [-.51,.51]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.16,16),dark);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.23,z);wheel.castShadow=true;car.add(wheel);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.165,12),mat('#bbc2cc'));hub.rotation.z=Math.PI/2;hub.position.copy(wheel.position);car.add(hub);}
 for(const x of [-.27,.27]){box(.2,.1,.04,mat('#fff2cc'),x,.44,.81,car);box(.18,.09,.04,mat('#ed9177'),x,.43,-.81,car);}box(.29,.08,.025,white,0,.3,-.83,car);
 function tree(x:number,z:number,s=1){box(.16,.7*s,.16,trunk,x,.2,z);const crown=new THREE.Mesh(new THREE.ConeGeometry(.65*s,1.8*s,7),leaf);crown.position.set(x,1.2*s,z);crown.castShadow=true;scene.add(crown);}
 // Deterministic placement keeps scenery clear of the roadway.
 let seed=42;const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};const samples=curve.getSpacedPoints(250);
 for(let i=0;i<180;i++){const x=rand()*26-13,z=rand()*21-10.5;if(samples.every(p=>Math.hypot(x-p.x,z-p.z)>2.1)&&rand()>.2)tree(x,z,.55+rand()*.55);}
 // Welcome gate and finish line.
 for(const x of [-10.3,-7.8])box(.12,1.8,.12,white,x,.8,8);
 box(2.65,.45,.15,purple,-9.05,1.65,8);
 const end=curve.getPointAt(1), tangent=curve.getTangentAt(1);const flag=new THREE.Group();flag.position.copy(end);flag.rotation.y=Math.atan2(tangent.x,tangent.z);scene.add(flag);
 for(let i=0;i<6;i++)for(let j=0;j<2;j++)box(.34,.025,.28,(i+j)%2?dark:white,-.85+i*.34,-.035,-.15+j*.28,flag);
 const surroundings = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), grass);
 surroundings.rotation.x = -Math.PI / 2;
 surroundings.position.y = -.26;
 surroundings.receiveShadow = true;
 scene.add(surroundings);
 const pins:HTMLElement[]=[]; const pinPositions:THREE.Vector3[]=[];
 for(let i=0;i<8;i++){const p=curve.getPointAt(i/7);const pole=box(.065,.95,.065,purple,p.x,.4,p.z-1.25);pole.castShadow=false;const pin=document.createElement('button');pin.className='map-pin';pin.textContent=String(i+1).padStart(2,'0');pin.dataset.stop=String(i);container.append(pin);pins.push(pin);pinPositions.push(new THREE.Vector3(p.x,1.1,p.z-1.25));}
 let current = 0, target = 0, raf = 0;
 let mobile = false, isDark = false;
 let viewportWidth = 1, viewportHeight = 1;
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const mobileQuery = matchMedia('(max-width: 720px)');
 const cameraTarget = new THREE.Vector3();
 const projectedPin = new THREE.Vector3();

 function positionCamera() {
  const p = curve.getPointAt(current);
  const heading = curve.getTangentAt(current);
  car.position.copy(p);
  car.position.y = .015;
  car.rotation.y = Math.atan2(heading.x, heading.z);
  if (mobile) {
   // A fixed offset in the car's reference frame keeps its rear in view,
   // including while scrolling backwards and at the ends of the road.
   camera.position.copy(p).addScaledVector(heading, -5.2);
   camera.position.y = 3.2;
   cameraTarget.copy(p).addScaledVector(heading, 2.1);
   cameraTarget.y = .5;
   camera.lookAt(cameraTarget);
  } else {
   camera.position.set(24, 32, 29).multiplyScalar(Math.max(1, 1.5 / camera.aspect));
   camera.lookAt(0, 0, 0);
  }
  camera.updateMatrixWorld();
 }

 function positionPins() {
  const nearest = Math.round(current * 7);
  pins.forEach((pin, i) => {
   projectedPin.copy(pinPositions[i]).project(camera);
   // Do not leave floating labels from the other side of the circuit,
   // or labels projected behind the chase camera, in the driving view.
   pin.hidden = mobile && (Math.abs(i - nearest) > 1 ||
    projectedPin.z < -1 || projectedPin.z > 1 ||
    Math.abs(projectedPin.x) > .9 || Math.abs(projectedPin.y) > .85);
   pin.style.left = `${(projectedPin.x * .5 + .5) * viewportWidth}px`;
   pin.style.top = `${(-projectedPin.y * .5 + .5) * viewportHeight}px`;
  });
 }

 function applyAtmosphere() {
  const color = new THREE.Color(isDark ? '#283b35' : '#d9e1c9');
  scene.background = mobile ? color : null;
  scene.fog = mobile ? new THREE.Fog(color, 14, 36) : null;
  surroundings.visible = mobile;
 }

 function render() {
  positionCamera();
  positionPins();
  renderer.render(scene, camera);
 }

 function resize() {
  const {width, height} = container.getBoundingClientRect();
  viewportWidth = Math.max(width, 1);
  viewportHeight = Math.max(height, 1);
  mobile = mobileQuery.matches;
  container.dataset.camera = mobile ? 'chase' : 'overview';
  renderer.setSize(viewportWidth, viewportHeight);
  camera.aspect = viewportWidth / viewportHeight;
  camera.fov = mobile ? 58 : 37;
  camera.updateProjectionMatrix();
  applyAtmosphere();
  render();
 }

 function tick() {
  current = reduce.matches ? target : THREE.MathUtils.lerp(current, target, .11);
  if (Math.abs(current - target) <= .00001) current = target;
  render();
  raf = current !== target ? requestAnimationFrame(tick) : 0;
 }
 mobileQuery.addEventListener('change', resize);
 const observer=new ResizeObserver(resize);observer.observe(container);
 return {
  update(p: number) {
   target = THREE.MathUtils.clamp(p, 0, 1);
   pins.forEach((pin, i) => {
    const active = Math.round(target * 7) === i;
    pin.classList.toggle('active', active);
    pin.setAttribute('aria-current', active ? 'step' : 'false');
   });
   if (!raf) raf = requestAnimationFrame(tick);
  },
  setTheme(value: boolean) {
   isDark = value;
   grass.color.set(isDark ? '#283b35' : '#d9e1c9');
   edge.color.set(isDark ? '#1d2b29' : '#c1cbb0');
   asphalt.color.set(isDark ? '#626777' : '#535862');
   leaf.color.set(isDark ? '#416e5b' : '#729773');
   applyAtmosphere();
   render();
  }
 };
}
