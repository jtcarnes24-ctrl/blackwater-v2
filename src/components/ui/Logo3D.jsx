import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

/**
 * Logo3D: the BlackWater wave mark as a black-metal 3D object that floats in
 * the hero and then travels down the page with the scroll.
 *
 * It renders into one fixed, full-screen canvas (z-index 2, clicks pass
 * through). Each homepage section is wrapped in <div data-logo-pose="...">.
 * A wrapper marked data-logo-layer="behind" is lifted above the canvas, so
 * the logo slides BEHIND that section; every other section sits under the
 * canvas, so the logo floats IN FRONT of it.
 *
 * Geometry: public/3d/logo.svg is Jack's exact mark (traced from his file,
 * Oct 2026), extruded straight back with no bevel so the edges stay sharp.
 * Material: black metal using the free CC0 ambientCG Metal048A maps, lit by
 * the CC0 Poly Haven "studio_small_09" HDR (neutral, no warm tint).
 */

// Where the logo sits for each pose: x (share of half the screen width), y, scale, rotX, rotY, rotZ.
const POSES = {
  hero:     [0, 0.62, 1.25, 0.08, 0, 0],
  right:    [0.72, 0, 0.85, 0.25, -0.75, 0.05],
  left:     [-0.72, 0.15, 0.9, -0.1, 0.8, -0.15],
  tilt:     [0, 0.1, 1.3, 1.0, 0, 0],
  edgeRight:[0.78, 0.35, 0.62, 0.2, -0.8, 0.08],
  rightLow: [0.7, -0.3, 0.8, 0.15, -0.6, 0],
  finale:   [0.78, 0.9, 0.55, 0.1, Math.PI * 2, 0],
}

const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function Logo3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 9)

    const pmrem = new THREE.PMREMGenerator(renderer)
    new RGBELoader().load('/3d/studio.hdr', hdr => {
      scene.environment = pmrem.fromEquirectangular(hdr).texture
      scene.environmentRotation.set(0.15, Math.PI * 0.85, 0)
      hdr.dispose()
    })
    const lights = [
      [0x3f7bd6, 1.2, [-4, 3, -5]],
      [0x14477f, 1.0, [5, -2, -3]],
      [0xffffff, 3.0, [1.5, 2.5, 7]], // soft front light so the black face shows its grain
    ].map(([c, i, p]) => { const l = new THREE.DirectionalLight(c, i); l.position.set(...p); scene.add(l); return l })

    const tl = new THREE.TextureLoader()
    const map = f => {
      const t = tl.load('/3d/' + f)
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(1 / 420, 1 / 420) // extrude UVs are in SVG pixels
      t.anisotropy = 8
      return t
    }
    const material = new THREE.MeshStandardMaterial({
      color: 0x2b2d32, metalness: 1, metalnessMap: map('metal-metalness.jpg'),
      roughness: 0.38, normalMap: map('metal-normal.jpg'), normalScale: new THREE.Vector2(1.4, 1.4),
      envMapIntensity: 2.2,
    })

    const logo = new THREE.Group()
    logo.visible = false
    scene.add(logo)
    let geo
    fetch('/3d/logo.svg').then(r => r.text()).then(text => {
      const shapes = new SVGLoader().parse(text).paths.flatMap(p => SVGLoader.createShapes(p))
      geo = new THREE.ExtrudeGeometry(shapes, { depth: 64, bevelEnabled: false, curveSegments: 64 })
      geo.computeBoundingBox()
      const c = geo.boundingBox.getCenter(new THREE.Vector3())
      geo.translate(-c.x, -c.y, -c.z)
      const s = 1.6 / (geo.boundingBox.max.x - geo.boundingBox.min.x)
      geo.scale(s, -s, s) // SVG y points down
      // the mirror above flips triangle winding; swap two corners of each triangle to restore it
      for (const name of ['position', 'normal', 'uv']) {
        const a = geo.attributes[name], n = a.itemSize
        for (let i = 0; i < a.count; i += 3) for (let k = 0; k < n; k++) {
          const t = a.array[(i + 1) * n + k]; a.array[(i + 1) * n + k] = a.array[(i + 2) * n + k]; a.array[(i + 2) * n + k] = t
        }
        a.needsUpdate = true
      }
      logo.add(new THREE.Mesh(geo, material))
      logo.visible = true
    })

    // Section anchors: page-space centre of each wrapper and the pose it asks for.
    let anchors = []
    const measure = () => {
      anchors = [...document.querySelectorAll('[data-logo-pose]')].map(el => {
        const r = el.getBoundingClientRect()
        return { mid: r.top + window.scrollY + r.height / 2, top: r.top + window.scrollY, pose: POSES[el.dataset.logoPose] || POSES.hero }
      })
    }
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      measure()
    }
    resize()
    window.addEventListener('resize', resize)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)

    const mouse = { x: 0, y: 0 }
    const onMove = e => { mouse.x = e.clientX / window.innerWidth - 0.5; mouse.y = e.clientY / window.innerHeight - 0.5 }
    window.addEventListener('pointermove', onMove, { passive: true })

    // Blend between the two anchors either side of the middle of the screen.
    const targetPose = () => {
      if (!anchors.length) return POSES.hero
      const y = window.scrollY + window.innerHeight / 2
      if (y <= anchors[0].mid) return anchors[0].pose
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i], b = anchors[i + 1]
        if (y <= b.mid) {
          const f = ease(Math.min(1, Math.max(0, (y - a.mid) / (b.mid - a.mid))))
          return a.pose.map((v, k) => v + (b.pose[k] - v) * f)
        }
      }
      return anchors[anchors.length - 1].pose
    }

    const cur = POSES.hero.slice()
    const clock = new THREE.Clock()
    renderer.setAnimationLoop(() => {
      const t = clock.getElapsedTime()
      const mobile = window.innerWidth < 768
      const target = targetPose().slice()
      if (mobile) {
        target[0] *= 0.3; target[2] *= 0.55
        // phones: past the hero, park the logo in the top band so it never sits on the text
        if (window.scrollY > window.innerHeight * 0.6) target[1] = 1.55 + target[1] * 0.1
      }
      const k = reduce ? 1 : 0.09
      for (let n = 0; n < cur.length; n++) cur[n] += (target[n] - cur[n]) * k
      const idle = reduce ? 0 : 1
      // x in the poses is a share of the visible half-width (1 = screen edge), so a side
      // pose hugs the edge on a wide monitor instead of drifting over the copy
      const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect
      logo.position.set(cur[0] * halfW, cur[1] + Math.sin(t * 0.9) * 0.05 * idle, 0)
      logo.scale.setScalar(cur[2])
      logo.rotation.set(cur[3] + mouse.y * 0.25 * idle, cur[4] + Math.sin(t * 0.45) * 0.12 * idle + mouse.x * 0.35 * idle, cur[5])
      renderer.render(scene, camera)
    })

    return () => {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      ro.disconnect()
      geo?.dispose()
      material.dispose()
      lights.forEach(l => l.dispose())
      pmrem.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
    />
  )
}
