import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MeshStandardMaterial } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

const canvas = document.createElement('canvas')
canvas.width = 650
canvas.height = 650

window.addEventListener('load', init)

function init() {
  // basic setup
  const scene = new THREE.Scene()

  const aspectRatio = canvas.width / canvas.height
  const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.1, 100)
  camera.position.set(2, 2, 2)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(canvas.width, canvas.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor('white')
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.append(renderer.domElement)

  const effectComposer = new EffectComposer(renderer)
  effectComposer.setSize(canvas.width, canvas.height)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  const renderPass = new RenderPass(scene, camera)
  effectComposer.addPass(renderPass)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.autoRotate = true
  controls.enableDamping = true
  controls.dampingFactor = 0.125
  controls.update()


  const fog = new THREE.Fog('white', 2, 6)
  scene.fog = fog



  // light setup
  const ambLight = new THREE.AmbientLight()
  ambLight.intensity = 0.1

  const dirLight = new THREE.DirectionalLight()
  dirLight.shadow.mapSize.width = 1024
  dirLight.shadow.mapSize.height = 1024
  // dirLight.shadow.radius = 100
  dirLight.position.set(6.5, 2.5, 5)
  dirLight.castShadow = true
  dirLight.lookAt(0, 0, 0)

  scene.add(ambLight)





  // objects setup
  const whole = new THREE.Group()

  // ground
  const groundGeo = new THREE.PlaneGeometry(15, 15)
  const groundMat = new THREE.MeshStandardMaterial()
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true


  // church
  const churchMat = new THREE.MeshLambertMaterial({ color: 'lightgrey' })
  const church = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 0.5),
    churchMat
  )
  church.position.y = .5 / 2
  church.castShadow = true

  const churchBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.01, 0.85),
    churchMat
  )
  churchBase.position.y = 0.01 / 2



  // church cross
  const cross = new THREE.Group()

  const crossMat = new THREE.MeshStandardMaterial({
    emissive: 'white',
    emissiveIntensity: 1.5
  })
  const crossX = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 0.9, 0.025),
    crossMat
  )
  crossX.position.y = - 0.25

  const crossY = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.035, 0.025),
    crossMat
  )
  crossY.position.y = - 0.15

  cross.add(crossX, crossY)
  cross.scale.set(0.5, 0.5)
  cross.position.x = 0.51
  cross.position.y = 0.35
  cross.rotation.y = Math.PI / 2


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
  for (let i = 0; i < 15; i++) {
    const bench = new THREE.Mesh(benchGeo, benchMat)
    bench.position.x = i / 8 - 1.015
    bench.position.y = 0.05
    bench.position.z = -.85
    bench.rotation.z = Math.PI / 1.75
    scene.add(bench)
    bench.castShadow = true
    bench.receiveShadow = true
  }
  for (let i = 0; i < 15; i++) {
    const bench = new THREE.Mesh(benchGeo, benchMat)
    bench.position.x = i / 8 - 1.015
    bench.position.y = 0.05
    bench.position.z = .85
    bench.rotation.z = Math.PI / 1.75
    scene.add(bench)
    bench.castShadow = true
    bench.receiveShadow = true
  }



  // grass 
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.01, 16, 16),
    new THREE.MeshStandardMaterial({ color: 'black' })
  )
  center.add(dirLight)
  scene.add(center)



  scene.add(ground, church, churchBase, cross)





  // resize
  window.addEventListener('resize', () => {
    camera.aspect = canvas.width / canvas.height
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.width, canvas.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(canvas.width, canvas.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })


  // animate
  const clock = new THREE.Clock()

  const animate = () => {
    const elapsedTime = clock.getElapsedTime()

    center.rotation.x = elapsedTime

    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
    effectComposer.render()
  }
  animate()
}