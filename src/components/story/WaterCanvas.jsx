import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl'

/**
 * Scroll-driven water surface.
 *
 * The reference piece renders a rigged 3D bird. Water has no silhouette to
 * model, so this is a single full-screen fragment shader instead: a height
 * field built from domain-warped noise, shaded from its own derivatives.
 * One triangle, no geometry, no texture loads, which is what keeps it at
 * frame rate on a phone where a particle system of this size would not be.
 *
 * Scroll drives four things at once, the same way the reference ties every
 * parameter to one progress value: the camera descends toward the surface,
 * the swell builds then settles, the horizon light sinks, and the palette
 * travels from near-black into the deep navy.
 */

const VERT = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;      // 0 at the top of the piece, 1 at the bottom
  uniform vec2  uRes;
  varying vec2  vUv;

  const vec3 INK   = vec3(0.031, 0.031, 0.031);  // #080808 black
  const vec3 DEEP  = vec3(0.043, 0.106, 0.188);  // #0B1B30 deep navy, the body of the water
  const vec3 NAVY  = vec3(0.078, 0.278, 0.498);  // #14477F brand navy, already the services swatch
  const vec3 ICE   = vec3(0.863, 0.910, 0.957);  // #DCE8F4 very light blue, almost white
  const vec3 WHITE = vec3(1.000, 1.000, 1.000);

  // Value noise. Cheaper than simplex and the artefacts vanish once it is
  // folded through several octaves and warped.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.02 + vec2(37.1, 17.3);
      a *= 0.5;
    }
    return v;
  }

  // Height of the surface at p. Warping the sample position by another fbm
  // is what stops it reading as rolling hills and starts it reading as water.
  float height(vec2 p, float swell) {
    float t = uTime * 0.085;
    vec2 warp = vec2(fbm(p * 0.8 + t), fbm(p * 0.8 - t + 5.2));
    float h = fbm(p * 1.6 + warp * 1.4 + vec2(0.0, t * 1.8));
    // Long directional swell underneath the chop, so there is a sense of
    // something large moving rather than only surface texture.
    h += 0.22 * sin(p.y * 1.1 - uTime * 0.28 + warp.x * 2.0);
    return h * swell;
  }

  void main() {
    vec2 res = max(uRes, vec2(1.0));
    vec2 uv  = (gl_FragCoord.xy - 0.5 * res) / res.y;

    float s = clamp(uScroll, 0.0, 1.0);

    // Camera descends toward the surface, so the horizon climbs and the
    // perspective compresses as the piece goes on.
    float horizon = mix(0.30, -0.06, smoothstep(0.0, 0.85, s));
    float swell   = mix(0.55, 1.0, smoothstep(0.0, 0.5, s))
                  * mix(1.0, 0.72, smoothstep(0.6, 1.0, s));

    vec3 col;

    if (uv.y > horizon) {
      // Sky: a flat gradient carrying the light source, kept very dark so
      // the type stays the brightest thing on screen.
      float k = smoothstep(horizon, horizon + 0.95, uv.y);
      col = mix(DEEP * 1.25, INK, k);
    } else {
      // Project the pixel onto the surface plane. Points near the horizon
      // map far away, which gives the chop its falloff for free.
      float depth = max(horizon - uv.y, 0.0012);
      vec2  p     = vec2(uv.x / depth, 1.0 / depth) * 0.9;
      p.y -= uTime * 0.12;

      float e  = 0.035;
      float h  = height(p, swell);
      float hx = height(p + vec2(e, 0.0), swell);
      float hy = height(p + vec2(0.0, e), swell);
      vec3  n  = normalize(vec3(h - hx, e * 2.2, h - hy));

      vec3 viewDir = normalize(vec3(uv.x, 0.45, 1.0));
      // The light sinks toward the horizon across the scroll, so the
      // highlight road on the water lengthens as you descend.
      vec3 lightDir = normalize(vec3(0.18, mix(0.95, 0.22, s), -0.75));

      float diff = max(dot(n, lightDir), 0.0);
      float spec = pow(max(dot(reflect(-lightDir, n), viewDir), 0.0), 48.0);
      float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 3.2);

      // Distance fade: far water flattens into the horizon haze.
      float far = smoothstep(0.0, 0.42, depth);

      col  = mix(INK, DEEP, far);
      col += NAVY  * diff * 0.42 * far;          // broad shading is the navy
      col += WHITE * spec * 0.90 * far;          // crests catch white
      col += ICE   * spec * 0.50 * far;          // ice blue rides the highlight
      col += NAVY  * fres * 0.14;                // navy rim where the surface turns away

      // Foam picked out only on the steepest crests, so it reads as water
      // breaking rather than as noise laid over the top.
      float crest = smoothstep(0.62, 0.95, h) * far;
      col = mix(col, ICE, crest * 0.18);
    }

    // The light itself, sitting on the horizon. Mirrors the role the sun
    // plays in the reference without being a visible disc.
    vec2  lp    = vec2(0.16, horizon + 0.12);
    float glow  = exp(-length((uv - lp) * vec2(0.8, 1.9)) * 2.6);
    col += mix(WHITE, ICE, 0.55) * glow * mix(0.32, 0.11, s);

    // Horizon seam, kept subtle: a hard line reads as a mistake.
    col += ICE * exp(-abs(uv.y - horizon) * 150.0) * 0.05;

    // Vignette, then a touch of grain so the large flat areas do not band.
    col *= 1.0 - 0.55 * pow(length(uv * vec2(0.62, 0.95)), 2.4);
    col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.016;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`

export function WaterCanvas({ progressRef }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer
    try {
      renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio, 2) })
    } catch {
      return // no WebGL: the CSS fallback behind the canvas stands in
    }

    const gl = renderer.gl
    gl.clearColor(0.031, 0.031, 0.031, 1)
    Object.assign(gl.canvas.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block',
    })
    host.appendChild(gl.canvas)

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uRes: { value: new Vec2(1, 1) },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      const w = host.clientWidth || window.innerWidth
      const h = host.clientHeight || window.innerHeight
      renderer.setSize(w, h)
      program.uniforms.uRes.value.set(gl.drawingBufferWidth, gl.drawingBufferHeight)
    }
    resize()
    window.addEventListener('resize', resize)

    /* Paused while offscreen or on a hidden tab. A full-screen fragment
       shader is the most expensive thing on the page and there is no reason
       to run it for someone who has switched away. */
    let raf = 0
    let running = false
    let smoothed = 0

    const frame = (t) => {
      program.uniforms.uTime.value = reduced ? 8.0 : t * 0.001
      const target = progressRef.current || 0
      smoothed += (target - smoothed) * 0.08
      program.uniforms.uScroll.value = smoothed
      renderer.render({ scene: mesh })
      raf = requestAnimationFrame(frame)
    }

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame) } }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    if (reduced) {
      // One frame, held. No loop at all.
      program.uniforms.uTime.value = 8.0
      program.uniforms.uScroll.value = progressRef.current || 0
      renderer.render({ scene: mesh })
    } else {
      start()
    }

    const onVis = () => (document.hidden ? stop() : (!reduced && start()))
    document.addEventListener('visibilitychange', onVis)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      gl.canvas.remove()
      const ext = gl.getExtension('WEBGL_lose_context')
      if (ext) ext.loseContext()
    }
  }, [progressRef])

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 0, background: '#080808', overflow: 'hidden',
      }}
    />
  )
}
