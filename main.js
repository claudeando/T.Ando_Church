import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MeshStandardMaterial } from 'three'

const canvas = document.createElement('canvas')
canvas.width = 650
canvas.height = 650

window.addEventListener('load', init)

function init() {
  // basic setup
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(- 1.5, 1.5, 1.5, - 1.5, 0.0001, 1000)
  camera.position.set(2, 2, 2)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(canvas.width, canvas.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor('white')
  renderer.shadowMap.enabled = true
  document.body.append(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.125
  controls.update()



  const fog = new THREE.Fog('white', 2, 6)
  scene.fog = fog



  // objects setup
  const whole = new THREE.Group()


  const groundGeo = new THREE.PlaneGeometry(15, 15)
  const groundMat = new THREE.MeshStandardMaterial()
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true

  const churchMat = new THREE.MeshLambertMaterial({ color: 'lightgrey' })

  const church = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.65, 0.5),
    churchMat
  )
  church.position.y = .65 / 2
  church.castShadow = true

  const churchBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.01, 0.85),
    churchMat
  )
  churchBase.position.y = 0.01 / 2



  // church cross
  const cross = new THREE.Group()

  const crossX = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 1.15, 0.025),
    new THREE.MeshStandardMaterial()
  )
  crossX.position.y = -0.1
  const crossY = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.05, 0.025),
    new THREE.MeshStandardMaterial()
  )

  cross.add(crossX, crossY)
  cross.scale.set(0.5, 0.5)
  cross.position.x = 0.51
  cross.position.y = 0.35
  cross.rotation.y = Math.PI / 2


  // grass 
  const grassGeo = new THREE.SphereGeometry(0.1, 32, 32)
  const grassMat = new THREE.MeshStandardMaterial({ color: 'darkgreen' })
  for (let i = 0; i < 25; i++) {
    const grass = new THREE.Mesh(grassGeo, grassMat)
    grass.position.x = (Math.random() - .5) * 2.5
    grass.position.z = (Math.random() - .5) * 2.5
    // scene.add(grass)
  }


  // chairs
  const benchGeo = new THREE.BoxGeometry(0.05, 0.0075, 0.2)
  const benchMat = new THREE.MeshLambertMaterial({ color: 'maroon' })
  for (let i = 0; i < 15; i++) {
    const bench = new THREE.Mesh(benchGeo, benchMat)
    bench.position.x = i / 8 - 1
    bench.position.y = 0.05
    bench.position.z = -.85
    scene.add(bench)
    bench.castShadow = true
    bench.receiveShadow = true
  }
  for (let i = 0; i < 15; i++) {
    const bench = new THREE.Mesh(benchGeo, benchMat)
    bench.position.x = i / 8 - 1
    bench.position.y = 0.05
    bench.position.z = .85
    scene.add(bench)
    bench.castShadow = true
    bench.receiveShadow = true
  }


  // light setup
  const ambLight = new THREE.AmbientLight()
  ambLight.intensity = 0.25

  const dirLight = new THREE.DirectionalLight()
  dirLight.position.set(6.5, 2.5, 5)
  dirLight.castShadow = true

  scene.add(ground, church, churchBase, cross, ambLight, dirLight)







  // resize
  window.addEventListener('resize', () => {
    camera.aspect = canvas.width / canvas.height
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.width, canvas.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })


  // animate
  const clock = new THREE.Clock()

  const animate = () => {
    const elapsedTime = clock.getElapsedTime

    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()
}