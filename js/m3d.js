/* Sina 3D anatomy viewer (ES module). Loaded on demand by app.js for 3D questions and the 3D explorer.
   Models: files/m3d/<id>.glb, one named node per structure (built from Z-Anatomy, CC BY-SA 4.0). */
import * as THREE from "./vendor/three/three.module.min.js";
import { GLTFLoader } from "./vendor/three/GLTFLoader.js";
import { DRACOLoader } from "./vendor/three/DRACOLoader.js";
import { OrbitControls } from "./vendor/three/OrbitControls.js";

const draco = new DRACOLoader();
draco.setDecoderPath(new URL("./vendor/three/draco/", import.meta.url).href);
draco.setDecoderConfig({ type: "wasm" });
const loader = new GLTFLoader();
loader.setDRACOLoader(draco);
const cache = {};
function loadModel(id) {
  if (!cache[id]) cache[id] = loader.loadAsync(new URL("../files/m3d/" + id + ".glb", import.meta.url).href).then(function (g) { return g.scene; });
  return cache[id];
}

const HL = new THREE.Color("#ff7a1a");
function dark() { return document.documentElement.getAttribute("data-theme") === "dark" || (document.documentElement.getAttribute("data-theme") !== "light" && matchMedia("(prefers-color-scheme: dark)").matches); }

/* mount(el, opts)
   opts.model      model id
   opts.colors     {key: "#rrggbb"} base colour per structure (others neutral)
   opts.highlight  [keys] shown in bright orange
   opts.hide       [keys] not drawn
   opts.ghost      [keys] drawn see-through
   opts.view       [x, y, z] camera direction (model space, Y up); default front
   opts.focus      true: frame the highlighted structures
   opts.pick       function(key) called when a structure is tapped (explorer and tap questions)
   opts.names      {key: "Name"} for the tap label
   returns { destroy, setHighlight(keys), reset() } */
export async function mount(el, opts) {
  el.classList.add("m3d-on");
  el.innerHTML = '<div class="m3d-load">Loading 3D model…</div>';
  let scene0;
  try { scene0 = await loadModel(opts.model); } catch (e) { el.innerHTML = '<div class="m3d-load">The 3D model could not load. Check your connection and try again.</div>'; return { destroy() {}, setHighlight() {}, reset() {} }; }
  el.innerHTML = "";
  const W = () => el.clientWidth || 320, H = () => el.clientHeight || 300;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(W(), H());
  el.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(35, W() / H(), 0.01, 50);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6b6b6b, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(2, 3, 4); cam.add(key); scene.add(cam);
  const root = scene0.clone(true);
  scene.add(root);
  const meshes = {};
  const neutral = dark() ? "#9a948c" : "#d9d2c7";
  root.traverse(function (o) {
    if (!o.isMesh) return;
    const k = o.name.replace(/_\d+$/, "");
    (meshes[k] = meshes[k] || []).push(o);
    o.material = new THREE.MeshStandardMaterial({ color: (opts.colors || {})[k] || neutral, roughness: 0.75, metalness: 0, side: THREE.DoubleSide });
  });
  function paint(hl) {
    const set = new Set(hl || []);
    Object.keys(meshes).forEach(function (k) {
      meshes[k].forEach(function (m) {
        const hide = (opts.hide || []).indexOf(k) > -1, ghost = (opts.ghost || []).indexOf(k) > -1;
        m.visible = !hide;
        const base = new THREE.Color((opts.colors || {})[k] || neutral);
        if (set.size && !set.has(k)) base.lerp(new THREE.Color(dark() ? "#3a3a3a" : "#f2efe9"), 0.35);
        m.material.color.copy(set.has(k) ? HL : base);
        m.material.emissive = set.has(k) ? new THREE.Color("#5a2200") : new THREE.Color(0);
        m.material.polygonOffset = set.has(k); m.material.polygonOffsetFactor = -2; m.material.polygonOffsetUnits = -24; m.renderOrder = set.has(k) ? 2 : 0;
        m.material.transparent = ghost && !set.has(k); m.material.opacity = ghost && !set.has(k) ? 0.18 : 1; m.material.depthWrite = !(ghost && !set.has(k));
      });
    });
  }
  paint(opts.highlight);
  const controls = new OrbitControls(cam, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.12; controls.enablePan = false; controls.rotateSpeed = 0.8;
  function frame() {
    const box = new THREE.Box3();
    const hl = (opts.focus && opts.highlight && opts.highlight.length) ? opts.highlight : null;
    Object.keys(meshes).forEach(function (k) { if (hl && hl.indexOf(k) < 0) return; meshes[k].forEach(function (m) { if (m.visible) box.expandByObject(m); }); });
    if (box.isEmpty()) box.setFromObject(root);
    const sz = box.getSize(new THREE.Vector3()), r = Math.max(0.12, Math.max(sz.x, sz.y, sz.z) / 2) * (hl ? 3.2 : 1.12), c = box.getCenter(new THREE.Vector3());
    const dir = new THREE.Vector3().fromArray(opts.view || [0, 0, 1]).normalize();
    controls.target.copy(hl ? c : new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3()));
    if (hl) controls.target.lerp(new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3()), 0.35);
    const d = r / Math.sin((cam.fov * Math.PI / 180) / 2);
    cam.position.copy(controls.target).addScaledVector(dir, d);
    cam.near = d / 50; cam.far = d * 10; cam.updateProjectionMatrix();
    controls.minDistance = d * 0.35; controls.maxDistance = d * 2.5; controls.update();
  }
  frame();
  let label = null;
  if (opts.pick) {
    label = document.createElement("div"); label.className = "m3d-tag"; label.hidden = true; el.appendChild(label);
    const ray = new THREE.Raycaster(), v = new THREE.Vector2(); let down = null;
    renderer.domElement.addEventListener("pointerdown", function (e) { down = [e.clientX, e.clientY]; });
    renderer.domElement.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      const r = renderer.domElement.getBoundingClientRect();
      v.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(v, cam);
      const hits = ray.intersectObjects(root.children, true).filter(function (h) { return h.object.visible && !(h.object.material.transparent && h.object.material.opacity < 0.5); });
      if (!hits.length) return;
      const k = hits[0].object.name.replace(/_\d+$/, "");
      opts.pick(k, function (text) { label.textContent = text; label.hidden = !text; });
    });
  }
  const hint = document.createElement("div"); hint.className = "m3d-hint"; hint.textContent = opts.pick ? "Drag to turn · pinch to zoom · tap a structure" : "Drag to turn · pinch to zoom";
  el.appendChild(hint);
  const resetBtn = document.createElement("button"); resetBtn.type = "button"; resetBtn.className = "m3d-reset"; resetBtn.textContent = "Reset view"; resetBtn.onclick = frame; el.appendChild(resetBtn);
  let alive = true, raf = 0;
  const ro = new ResizeObserver(function () { renderer.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); });
  ro.observe(el);
  /* only render while visible on screen */
  let onScreen = true;
  const io = new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }); io.observe(el);
  (function loop() { if (!alive) return; raf = requestAnimationFrame(loop); if (!onScreen || !el.isConnected) { if (!el.isConnected) destroy(); return; } controls.update(); renderer.render(scene, cam); })();
  function destroy() {
    if (!alive) return; alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); controls.dispose();
    root.traverse(function (o) { if (o.isMesh) o.material.dispose(); });
    renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss();
  }
  return { destroy: destroy, setHighlight: function (k) { opts.highlight = k; paint(k); }, reset: frame };
}
