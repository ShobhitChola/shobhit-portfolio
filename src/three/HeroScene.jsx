import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { reducedMotion, supportsWebGL } from '../hooks/useMedia'

// ── GLSL ─────────────────────────────────────────────────────

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const NET_VERT = /* glsl */ `
uniform float uTime;
uniform float uScatter;
uniform float uReveal;
uniform float uSize;
attribute float aRand;
attribute float aDim;
attribute float aBirth;
varying float vMix;
varying float vFade;
varying float vDim;
${SIMPLEX}
void main() {
  vec3 pos = position;
  vec3 dir = normalize(pos + vec3(0.0001));
  float n = snoise(pos * 0.8 + vec3(0.0, 0.0, uTime * 0.2));
  // gentle breathing, calmer on the connection dots so the net stays legible
  pos += dir * n * (0.11 + 0.04 * sin(uTime * 0.35)) * (1.0 - aDim * 0.5);
  pos += dir * uScatter * (2.2 + aRand * 5.5);
  // build-in sweeps left to right: each particle pops once the front passes it
  float p = smoothstep(0.0, 1.0, clamp((uReveal * 1.18 - aBirth) / 0.18, 0.0, 1.0));
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float sz = uSize * (0.55 + aRand * 0.9) * (1.0 - aDim * 0.28) * p;
  gl_PointSize = sz * (6.0 / -mv.z);
  vMix = clamp(n * 0.5 + 0.5, 0.0, 1.0);
  vFade = (1.0 - uScatter * 0.9) * p;
  vDim = aDim;
}
`

const NET_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
varying float vMix;
varying float vFade;
varying float vDim;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float mask = smoothstep(0.5, 0.06, d);
  vec3 col = mix(uColA, uColB, vMix);
  col = mix(col, uColC, smoothstep(0.62, 0.97, vMix));
  gl_FragColor = vec4(col, mask * vFade * (1.0 - vDim * 0.2));
}
`

const SIGNAL_VERT = /* glsl */ `
uniform float uSize;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (6.0 / -mv.z);
}
`

const SIGNAL_FRAG = /* glsl */ `
precision highp float;
uniform float uFade;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float mask = smoothstep(0.5, 0.04, d);
  vec3 col = mix(vec3(0.83, 1.0, 0.31), vec3(1.0), smoothstep(0.22, 0.0, d));
  gl_FragColor = vec4(col, mask * uFade);
}
`

const STAR_VERT = /* glsl */ `
uniform float uTime;
attribute float aSize;
attribute float aPhase;
varying float vTwinkle;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * (14.0 / -mv.z);
  vTwinkle = 0.55 + 0.45 * sin(uTime * 0.8 + aPhase);
}
`

const STAR_FRAG = /* glsl */ `
precision highp float;
varying float vTwinkle;
void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float mask = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vec3(0.75, 0.82, 0.95), mask * 0.5 * vTwinkle);
}
`

// ── Neural network layout (an MLP, read left → right) ────────

const LAYERS = [5, 9, 12, 9, 6]

function buildNetwork() {
  const nodes = []
  const xSpan = 4.4
  const layerStart = []
  let acc = 0
  LAYERS.forEach((count, li) => {
    layerStart[li] = acc
    acc += count
    const x = -xSpan / 2 + (xSpan * li) / (LAYERS.length - 1)
    const spread = 1.05 + Math.sin((li / (LAYERS.length - 1)) * Math.PI) * 0.55
    for (let i = 0; i < count; i++) {
      const y = count === 1 ? 0 : ((i / (count - 1)) - 0.5) * 2 * spread
      nodes.push(
        new THREE.Vector3(
          x + (Math.random() - 0.5) * 0.24,
          y + (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.8
        )
      )
    }
  })

  // each neuron feeds 2-3 of its nearest neighbours in the next layer
  const edges = []
  const outgoing = new Map()
  nodes.forEach((pos, ni) => {
    const layer = layerStart.findIndex(
      (s, li) => ni >= s && ni < s + LAYERS[li]
    )
    if (layer >= LAYERS.length - 1) return
    const next = layer + 1
    const candidates = []
    for (let j = 0; j < LAYERS[next]; j++) {
      const idx = layerStart[next] + j
      candidates.push([idx, pos.distanceTo(nodes[idx])])
    }
    candidates.sort((a, b) => a[1] - b[1])
    const k = 2 + Math.floor(Math.random() * 2)
    for (let c = 0; c < Math.min(k, candidates.length); c++) {
      const ei = edges.length
      edges.push([ni, candidates[c][0]])
      if (!outgoing.has(ni)) outgoing.set(ni, [])
      outgoing.get(ni).push(ei)
    }
  })

  const inputEdges = []
  for (let i = 0; i < LAYERS[0]; i++) {
    ;(outgoing.get(i) || []).forEach((ei) => inputEdges.push(ei))
  }

  return { nodes, edges, outgoing, inputEdges }
}

// ── The living network ───────────────────────────────────────

function NeuralField({ scatterRef, mobile, reduced, on }) {
  const netRef = useRef(null)
  const signalGeoRef = useRef(null)

  const network = useMemo(() => buildNetwork(), [])

  // one point cloud: fuzzy glowing neurons + dotted synapses
  const { geometry } = useMemo(() => {
    const clusterN = mobile ? 40 : 62
    const edgeDots = mobile ? 11 : 17
    const total = network.nodes.length * clusterN + network.edges.length * edgeDots
    const positions = new Float32Array(total * 3)
    const rands = new Float32Array(total)
    const dims = new Float32Array(total)
    const births = new Float32Array(total)
    let p = 0

    const gauss = (k) =>
      (Math.random() + Math.random() + Math.random() - 1.5) * k
    // normalized left→right position drives the build-in order
    const birthOf = (x) => Math.min(1, Math.max(0, (x + 2.35) / 4.7))

    network.nodes.forEach((node) => {
      for (let i = 0; i < clusterN; i++) {
        const first = i === 0
        positions[p * 3] = node.x + (first ? 0 : gauss(0.12))
        positions[p * 3 + 1] = node.y + (first ? 0 : gauss(0.12))
        positions[p * 3 + 2] = node.z + (first ? 0 : gauss(0.11))
        rands[p] = first ? 1 : Math.random()
        dims[p] = 0
        births[p] = birthOf(node.x)
        p++
      }
    })

    network.edges.forEach(([a, b]) => {
      const pa = network.nodes[a]
      const pb = network.nodes[b]
      for (let d = 1; d <= edgeDots; d++) {
        const t = d / (edgeDots + 1)
        const x = pa.x + (pb.x - pa.x) * t + gauss(0.015)
        positions[p * 3] = x
        positions[p * 3 + 1] = pa.y + (pb.y - pa.y) * t + gauss(0.015)
        positions[p * 3 + 2] = pa.z + (pb.z - pa.z) * t + gauss(0.015)
        rands[p] = Math.random()
        dims[p] = 1
        births[p] = birthOf(x)
        p++
      }
    })

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rands, 1))
    g.setAttribute('aDim', new THREE.BufferAttribute(dims, 1))
    g.setAttribute('aBirth', new THREE.BufferAttribute(births, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30)
    return { geometry: g }
  }, [network, mobile])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: NET_VERT,
        fragmentShader: NET_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uScatter: { value: 0 },
          uReveal: { value: reduced ? 1 : 0 },
          uSize: { value: 3 },
          uColA: { value: new THREE.Color('#7c5cff') },
          uColB: { value: new THREE.Color('#56e1ff') },
          uColC: { value: new THREE.Color('#d4ff4f') },
        },
      }),
    [reduced]
  )

  // lime sparks flowing forward through the net
  const signalCount = mobile ? 26 : 55
  const signals = useMemo(() => {
    const spawn = () => ({
      edge: network.inputEdges[Math.floor(Math.random() * network.inputEdges.length)],
      t: Math.random(),
      speed: 0.35 + Math.random() * 0.5,
    })
    return Array.from({ length: signalCount }, spawn)
  }, [network, signalCount])

  const signalGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const attr = new THREE.BufferAttribute(new Float32Array(signalCount * 3), 3)
    attr.setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('position', attr)
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30)
    return g
  }, [signalCount])

  const signalMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SIGNAL_VERT,
        fragmentShader: SIGNAL_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uSize: { value: 4.2 },
          uFade: { value: 0 },
        },
      }),
    []
  )

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
      signalGeometry.dispose()
      signalMaterial.dispose()
    },
    [geometry, material, signalGeometry, signalMaterial]
  )

  // left→right build once the preloader lifts
  useEffect(() => {
    if (!on || reduced) return
    const tween = gsap.to(material.uniforms.uReveal, {
      value: 1,
      duration: 2.6,
      ease: 'power2.inOut',
      delay: 0.2,
    })
    return () => tween.kill()
  }, [on, reduced, material])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const u = material.uniforms
    const dpr = state.gl.getPixelRatio()

    u.uTime.value = t * (reduced ? 0.25 : 1)
    u.uSize.value = (mobile ? 2.5 : 3) * dpr

    const target = scatterRef?.current ?? 0
    u.uScatter.value += (target - u.uScatter.value) * Math.min(1, delta * 5)

    // gentle sway keeps the layered structure readable
    const net = netRef.current
    if (net) {
      net.rotation.y = -0.22 + Math.sin(t * 0.16) * 0.2
      net.rotation.x = 0.12 + Math.sin(t * 0.09) * 0.06
      net.rotation.z = -0.04 + Math.sin(t * 0.07) * 0.05
    }

    // advance the sparks (they start flowing once the net has built)
    signalMaterial.uniforms.uSize.value = (mobile ? 3.4 : 4.2) * dpr
    const flowIn = Math.min(1, Math.max(0, (u.uReveal.value - 0.8) / 0.2))
    signalMaterial.uniforms.uFade.value =
      flowIn * flowIn * (3 - 2 * flowIn) * (1 - u.uScatter.value) * 0.95
    const attr = signalGeoRef.current?.attributes.position
    if (attr && !reduced) {
      const speedScale = 1
      for (let i = 0; i < signals.length; i++) {
        const s = signals[i]
        s.t += delta * s.speed * speedScale
        while (s.t >= 1) {
          s.t -= 1
          const endNode = network.edges[s.edge][1]
          const outs = network.outgoing.get(endNode)
          s.edge = outs
            ? outs[Math.floor(Math.random() * outs.length)]
            : network.inputEdges[Math.floor(Math.random() * network.inputEdges.length)]
        }
        const [a, b] = network.edges[s.edge]
        const pa = network.nodes[a]
        const pb = network.nodes[b]
        attr.array[i * 3] = pa.x + (pb.x - pa.x) * s.t
        attr.array[i * 3 + 1] = pa.y + (pb.y - pa.y) * s.t
        attr.array[i * 3 + 2] = pa.z + (pb.z - pa.z) * s.t
      }
      attr.needsUpdate = true
    }
  })

  return (
    <group ref={netRef} rotation={[0.12, -0.22, -0.04]}>
      <points frustumCulled={false}>
        <primitive object={geometry} attach="geometry" />
        <primitive object={material} attach="material" />
      </points>
      <points frustumCulled={false}>
        <primitive object={signalGeometry} attach="geometry" ref={signalGeoRef} />
        <primitive object={signalMaterial} attach="material" />
      </points>
    </group>
  )
}

// ── Ambient starfield ────────────────────────────────────────

function Stars({ mobile }) {
  const ref = useRef(null)

  const geometry = useMemo(() => {
    const count = mobile ? 260 : 620
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 7 + Math.random() * 9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      positions[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 1.5
      sizes[i] = 0.8 + Math.random() * 1.6
      phases[i] = Math.random() * Math.PI * 2
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    return g
  }, [mobile])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 } },
      }),
    []
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </points>
  )
}

// ── Scene ────────────────────────────────────────────────────

export default function HeroScene({ scatterRef, on }) {
  const wrapRef = useRef(null)
  const [active, setActive] = useState(true)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 820px)').matches)
  const reduced = useMemo(() => reducedMotion(), [])
  const webgl = useMemo(() => supportsWebGL(), [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)')
    const cb = (e) => setMobile(e.matches)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }, [])

  // stop rendering entirely once the hero is off screen
  useEffect(() => {
    if (!wrapRef.current) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting))
    io.observe(wrapRef.current)
    return () => io.disconnect()
  }, [])

  if (!webgl) {
    return <div className="hero-canvas hero-fallback" aria-hidden="true" />
  }

  return (
    <div className={`hero-canvas ${on ? 'is-on' : ''}`} ref={wrapRef} aria-hidden="true">
      <Canvas
        dpr={mobile ? [1, 1.6] : [1, 2]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 5.6], fov: 50 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor('#07070b', 1)}
      >
        <group
          position={mobile ? [0, 1.0, 0] : [1.35, 0.1, 0]}
          scale={mobile ? 0.52 : 0.92}
        >
          <NeuralField scatterRef={scatterRef} mobile={mobile} reduced={reduced} on={on} />
        </group>
        <Stars mobile={mobile} />
        {!mobile && !reduced && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.75}
              luminanceThreshold={0.12}
              luminanceSmoothing={0.35}
              mipmapBlur
              radius={0.72}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
