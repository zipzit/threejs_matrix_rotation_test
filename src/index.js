import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

const s_group = new THREE.Group();
const wheel_group = new THREE.Group();

function DegsToRadians(degrees) {
  return (degrees * Math.PI) / 180.0;
}

const main = () => {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(18);
  var pivot;
  //--
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();
  //--
  camera.position.z = -30;
  scene.add(s_group);
  scene.add(wheel_group);
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }
  //--
  const createElements = () => {
    const c_geo = new THREE.BoxGeometry(2.5, 0.12, 12);
    const c_mat = new THREE.MeshNormalMaterial();
    const board = new THREE.Mesh(c_geo, c_mat);
    board.position.y = 1.0;
    board.position.z = 5.0;
    s_group.add(board);

    const wheelGeometry = new THREE.CylinderGeometry(0.375, 0.375, 0.5, 40);
    const axleGeometry = new THREE.CylinderGeometry(0.04, 0.04, 2, 40);
    const wheel1 = new THREE.Mesh(wheelGeometry, c_mat);
    const wheel2 = new THREE.Mesh(wheelGeometry, c_mat);
    wheel1.position.x = 1;
    wheel1.rotation.z = DegsToRadians(90.0);
    wheel2.position.x = -1;
    wheel2.rotation.z = DegsToRadians(90.0);
    const axle = new THREE.Mesh(axleGeometry, c_mat);
    axle.rotation.z = DegsToRadians(90.0);
    wheel_group.add(wheel1);
    wheel_group.add(wheel2);
    wheel_group.add(axle);

    const pivotGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2, 5);
    pivot = new THREE.Mesh(pivotGeometry, c_mat);
    pivot.rotation.x = DegsToRadians(45.0);
    s_group.add(pivot);
  };
  
     document.getElementById("slider").addEventListener("input", () => {
        let tiltValue = document.getElementById("slider").value;
        document.getElementById("tilt").textContent = "Tilt: " + tiltValue + "° ";
        rotateMeshGroup(wheel_group, pivot, tiltValue);
     })
  
  var euler;
  const rotateMeshGroup =( meshGroup, rotationAxis, angleOfRotation) =>{
  euler = new THREE.Euler().setFromRotationMatrix(rotationAxis.matrixWorld);
    meshGroup.children.forEach(item => {
      item.rotateOnAxis(euler, DegsToRadians(angleOfRotation));
    }) 
//     console.log( "rotationAxis: ", rotationAxis);
//     console.log ("meshGroup: ", meshGroup);
//     console.log( "angle: ", angleOfRotation);
//     console.log( "s_group: ", s_group);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  const onWindowResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  animate();
  createElements();
  onWindowResize();

  window.addEventListener("resize", onWindowResize, false);
};

main();
