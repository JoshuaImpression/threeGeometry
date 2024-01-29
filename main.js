import * as THREE from 'three';
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

// Scene
const scene = new THREE.Scene();

// Sphere Geometry
const geometry = new THREE.TorusGeometry( 10, 3, 16, 200 );
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  roughness: 0.1,
}); 
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Light
const light = new THREE.PointLight(0xffffff, 70, 70, 1.7);
light.position.set(0, 10, 10);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.z = 40;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(2);
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene, camera);

// Resizing
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;

const raf = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(raf);
}
raf();


// Gsap
const tl = gsap.timeline({ defaults: {duration: 1, ease: 'expo.inOut'}});
tl.fromTo(mesh.scale, { x:0, y:0, z:0 }, { x:1, y:1, z:1 });

// Mouse animation color 
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if(mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150
    ];
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
    gsap.to(mesh.material.color, {r: newColor.r, g: newColor.g, b: newColor.b});
  }
});