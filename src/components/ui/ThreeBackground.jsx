import { useEffect, useRef } from 'react'

export default function ThreeBackground() {
  const canvasRef  = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    let renderer, animId
    const cleanup = []

    const init = async () => {
      const THREE = await import('three')
      const canvas = canvasRef.current
      if (!canvas) return

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.2

      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 30

      scene.add(new THREE.AmbientLight(0x220000, 0.5))
      const redLight = new THREE.PointLight(0xe01b24, 2, 80)
      redLight.position.set(10, 10, 15)
      scene.add(redLight)
      const whiteLight = new THREE.PointLight(0xffffff, 1.5, 60)
      whiteLight.position.set(-15, -5, 10)
      scene.add(whiteLight)
      const dimRedLight = new THREE.PointLight(0x8b0000, 1, 100)
      dimRedLight.position.set(0, -15, 5)
      scene.add(dimRedLight)

      const sphereMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime:   { value: 0 },
          uMouse:  { value: new THREE.Vector2(0, 0) },
          uColor1: { value: new THREE.Color(0x1a0000) },
          uColor2: { value: new THREE.Color(0xe01b24) },
          uColor3: { value: new THREE.Color(0xff4444) },
          uColor4: { value: new THREE.Color(0x000000) },
        },
        vertexShader: `
          varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;varying float vDisplacement;
          uniform float uTime;
          vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
          vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
          vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
          vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
          float snoise(vec3 v){
            const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
            vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
            vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
            vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
            vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
            i=mod289(i);
            vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
            float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
            vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
            vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
            vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
            vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
            vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
            vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
            vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
            p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
            vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
            m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
          }
          void main(){
            vUv=uv;vNormal=normalize(normalMatrix*normal);
            float noise=snoise(position*.4+uTime*.15);
            float noise2=snoise(position*.8+uTime*.1+50.);
            float displacement=noise*.3+noise2*.15;
            vDisplacement=displacement;
            vec3 newPos=position+normal*displacement*.3;
            vPosition=newPos;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(newPos,1.);
          }`,
        fragmentShader: `
          varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;varying float vDisplacement;
          uniform float uTime;uniform vec2 uMouse;
          uniform vec3 uColor1,uColor2,uColor3,uColor4;
          void main(){
            float fresnel=pow(1.-abs(dot(vNormal,vec3(0.,0.,1.))),2.5);
            float flow=vDisplacement*2.+.5;flow=clamp(flow,0.,1.);
            vec3 color=mix(uColor4,uColor1,flow);
            color=mix(color,uColor2,smoothstep(.4,.7,flow));
            color=mix(color,uColor3,smoothstep(.7,.95,flow));
            float veins=smoothstep(.55,.65,flow);color+=uColor2.rgb*veins*.8;
            color+=vec3(.88,.1,.14)*fresnel*.6;
            float pulse=sin(uTime*.8)*.5+.5;color+=uColor2.rgb*pulse*.08;
            gl_FragColor=vec4(color,1.);
          }`,
      })
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 128, 128), sphereMat)
      sphere.position.set(10, 2, -5)
      scene.add(sphere)

      const glowMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 vNormal;uniform float uTime;void main(){float intensity=pow(.6-dot(vNormal,vec3(0.,0.,1.)),3.);float pulse=sin(uTime*1.2)*.15+.85;gl_FragColor=vec4(.88,.1,.14,intensity*.25*pulse);}`,
        transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const glow = new THREE.Mesh(new THREE.SphereGeometry(5.8, 64, 64), glowMat)
      glow.position.copy(sphere.position)
      scene.add(glow)

      const ringMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec2 vUv;uniform float uTime;void main(){float alpha=sin(vUv.x*30.+uTime*2.)*.5+.5;alpha*=smoothstep(0.,.3,vUv.y)*smoothstep(1.,.7,vUv.y)*.12;vec3 col=mix(vec3(.88,.1,.14),vec3(1.,.3,.2),sin(vUv.x*10.+uTime)*.5+.5);gl_FragColor=vec4(col,alpha);}`,
        transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const ring = new THREE.Mesh(new THREE.RingGeometry(6.5, 7.4, 128), ringMat)
      ring.position.copy(sphere.position)
      ring.rotation.x = Math.PI * 0.45
      scene.add(ring)
      const ring2 = new THREE.Mesh(new THREE.RingGeometry(7.0, 7.5, 128), ringMat.clone())
      ring2.position.copy(sphere.position)
      ring2.rotation.x = Math.PI * 0.7
      ring2.rotation.z = Math.PI * 0.3
      scene.add(ring2)

      const shardBaseMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0.1, roughness: 0.05,
        transmission: 0.9, transparent: true, opacity: 0.3, thickness: 0.5, ior: 1.5,
      })
      const shardGeos = [
        new THREE.OctahedronGeometry(0.8, 0), new THREE.TetrahedronGeometry(0.6, 0),
        new THREE.IcosahedronGeometry(0.5, 0), new THREE.DodecahedronGeometry(0.7, 0),
        new THREE.ConeGeometry(0.4, 1.0, 4),
      ]
      const shards = []
      for (let i = 0; i < 45; i++) {
        const mat = shardBaseMat.clone()
        const isRed = Math.random() > 0.4
        if (isRed) {
          mat.color = new THREE.Color().setHSL(Math.random() * 0.02, 0.9, 0.3 + Math.random() * 0.3)
          mat.emissive = new THREE.Color(0xe01b24)
          mat.emissiveIntensity = 0.1 + Math.random() * 0.15
        } else {
          mat.color = new THREE.Color(Math.random() > 0.5 ? 0xffffff : 0x444444)
        }
        mat.opacity = 0.12 + Math.random() * 0.28
        const mesh = new THREE.Mesh(shardGeos[Math.floor(Math.random() * shardGeos.length)], mat)
        const angle = Math.random() * Math.PI * 2
        const radius = 8 + Math.random() * 20
        const y = (Math.random() - 0.5) * 22
        mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius - 10)
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
        const sc = 0.3 + Math.random() * 1.4
        mesh.scale.set(sc, sc * (0.8 + Math.random() * 0.6), sc)
        mesh.userData = {
          rotSpeed: { x:(Math.random()-0.5)*0.025, y:(Math.random()-0.5)*0.025, z:(Math.random()-0.5)*0.025 },
          baseY: y, floatAmp: 0.4+Math.random()*2, floatSpeed: 0.3+Math.random()*1,
          angle, radius, orbitSpeed: (Math.random()-0.5)*0.08,
          pulseSpeed: 1+Math.random()*2, pulseAmp: 0.05+Math.random()*0.1, baseScale: sc,
        }
        shards.push(mesh)
        scene.add(mesh)
      }

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(3, 0.8, 16, 60),
        new THREE.MeshBasicMaterial({ color: 0xe01b24, wireframe: true, transparent: true, opacity: 0.1 })
      )
      torus.position.set(-14, -6, -8)
      scene.add(torus)
      const torusGlow = new THREE.Mesh(
        new THREE.TorusGeometry(3, 1.2, 16, 60),
        new THREE.MeshBasicMaterial({ color: 0xe01b24, transparent: true, opacity: 0.015, side: THREE.BackSide })
      )
      torusGlow.position.copy(torus.position)
      scene.add(torusGlow)
      const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.5, 1),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 })
      )
      ico.position.set(-12, 8, -12)
      scene.add(ico)
      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(2, 0.5, 100, 16),
        new THREE.MeshBasicMaterial({ color: 0xe01b24, wireframe: true, transparent: true, opacity: 0.04 })
      )
      knot.position.set(18, -10, -15)
      scene.add(knot)

      const energyRings = []
      for (let i = 0; i < 3; i++) {
        const er = new THREE.Mesh(
          new THREE.TorusGeometry(6 + i * 1.2, 0.02, 8, 128),
          new THREE.MeshBasicMaterial({ color: 0xe01b24, transparent: true, opacity: 0.08 - i * 0.02, blending: THREE.AdditiveBlending })
        )
        er.position.copy(sphere.position)
        er.rotation.set(Math.PI * 0.3 + i * 0.4, i * 0.6, i * 0.3)
        scene.add(er)
        energyRings.push(er)
      }

      const rsGeos = [
        new THREE.OctahedronGeometry(1,0), new THREE.TetrahedronGeometry(1,0),
        new THREE.IcosahedronGeometry(1,0), new THREE.DodecahedronGeometry(1,0),
        new THREE.ConeGeometry(0.7,1.8,4), new THREE.ConeGeometry(0.5,2.2,3),
        new THREE.BoxGeometry(1,1.6,0.3), new THREE.CylinderGeometry(0,1,1.8,5),
        new THREE.TorusGeometry(0.8,0.15,4,6), new THREE.TorusKnotGeometry(0.6,0.15,32,4),
      ]
      const redShapes = []
      const redShapesGroup = new THREE.Group()
      for (let i = 0; i < 60; i++) {
        const isWire = Math.random() > 0.5
        const col = new THREE.Color().setHSL(Math.random()*0.03, 0.95, 0.15+Math.random()*0.35)
        const mat = isWire
          ? new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.15+Math.random()*0.25 })
          : new THREE.MeshPhysicalMaterial({ color: col, metalness: 0.6+Math.random()*0.3, roughness: 0.1+Math.random()*0.3, emissive: new THREE.Color(0xe01b24), emissiveIntensity: 0.05+Math.random()*0.15, transparent: true, opacity: 0.2+Math.random()*0.4, flatShading: true })
        const mesh = new THREE.Mesh(rsGeos[Math.floor(Math.random() * rsGeos.length)], mat)
        const px=(Math.random()-0.5)*70, py=(Math.random()-0.5)*35, pz=-5-Math.random()*30
        mesh.position.set(px,py,pz)
        const sc=0.15+Math.random()*1
        mesh.scale.set(sc*(0.6+Math.random()*0.8), sc*(0.6+Math.random()*1.2), sc*(0.6+Math.random()*0.8))
        mesh.rotation.set(Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2)
        mesh.userData = {
          origPos: mesh.position.clone(),
          rotSpd: new THREE.Vector3((Math.random()-0.5)*0.03,(Math.random()-0.5)*0.03,(Math.random()-0.5)*0.02),
          floatFreq:0.3+Math.random()*1.5, floatAmp:0.3+Math.random()*1.5, floatPhase:Math.random()*Math.PI*2,
          mouseReact:0.3+Math.random()*1.5, pulseSpeed:0.8+Math.random()*2, pulseAmp:0.08+Math.random()*0.15,
          baseScale:mesh.scale.clone(), driftAngle:Math.random()*Math.PI*2,
          driftSpeed:(Math.random()-0.5)*0.15, driftRadius:0.5+Math.random()*2,
        }
        redShapes.push(mesh)
        redShapesGroup.add(mesh)
      }
      scene.add(redShapesGroup)

      for (let i = 0; i < 3; i++) {
        const grid = new THREE.Mesh(
          new THREE.PlaneGeometry(12+i*4,12+i*4,8,8),
          new THREE.MeshBasicMaterial({ color:0xe01b24, wireframe:true, transparent:true, opacity:0.025+i*0.008, blending:THREE.AdditiveBlending })
        )
        grid.position.set((i-1)*18,(Math.random()-0.5)*15,-20-i*5)
        grid.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI)
        grid.userData = { rotSpd: new THREE.Vector3(0.002,0.003,0.001) }
        redShapes.push(grid)
        scene.add(grid)
      }

      const pPos = new Float32Array(500 * 3)
      for (let i=0;i<500;i++) { pPos[i*3]=(Math.random()-0.5)*80; pPos[i*3+1]=(Math.random()-0.5)*80; pPos[i*3+2]=(Math.random()-0.5)*60-10 }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3))
      const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color:0xe01b24, size:0.08, transparent:true, opacity:0.4, sizeAttenuation:true, blending:THREE.AdditiveBlending }))
      scene.add(particles)

      const wPos = new Float32Array(200 * 3)
      for (let i=0;i<200;i++) { wPos[i*3]=(Math.random()-0.5)*100; wPos[i*3+1]=(Math.random()-0.5)*100; wPos[i*3+2]=(Math.random()-0.5)*60-15 }
      const wGeo = new THREE.BufferGeometry()
      wGeo.setAttribute('position', new THREE.BufferAttribute(wPos,3))
      const wParticles = new THREE.Points(wGeo, new THREE.PointsMaterial({ color:0xffffff, size:0.04, transparent:true, opacity:0.3, sizeAttenuation:true }))
      scene.add(wParticles)

      let scrollY = 0, mouseX = 0, mouseY = 0, tMX = 0, tMY = 0
      let canvasOpacity = 0, overlayOpacity = 0
      let initDone = false

      const onScroll = () => { scrollY = window.scrollY }
      const onMove   = e  => { tMX = (e.clientX/window.innerWidth-0.5)*2; tMY = (e.clientY/window.innerHeight-0.5)*2 }
      const onResize = () => { camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight) }
      window.addEventListener('scroll',    onScroll, { passive: true })
      window.addEventListener('mousemove', onMove,   { passive: true })
      window.addEventListener('resize',    onResize)
      cleanup.push(() => {
        window.removeEventListener('scroll',    onScroll)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('resize',    onResize)
      })

      const clock = new THREE.Clock()

      const animate = () => {
        animId = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()

        mouseX += (tMX - mouseX) * 0.05
        mouseY += (tMY - mouseY) * 0.05

        camera.position.x = mouseX * 1.5
        camera.position.y = -mouseY - scrollY * 0.003
        camera.lookAt(0, -scrollY * 0.003, 0)

        sphere.rotation.y = t * 0.15
        sphere.rotation.x = Math.sin(t * 0.1) * 0.1
        glow.position.copy(sphere.position)
        ring.rotation.z = t * 0.08

        shards.forEach(s => {
          const d = s.userData
          s.rotation.x += d.rotSpeed.x; s.rotation.y += d.rotSpeed.y; s.rotation.z += d.rotSpeed.z
          s.position.y = d.baseY + Math.sin(t * d.floatSpeed) * d.floatAmp
          d.angle += d.orbitSpeed * 0.01
          s.position.x = Math.cos(d.angle) * d.radius + mouseX * 0.3
          s.position.z = Math.sin(d.angle) * d.radius - 10
          s.scale.setScalar(d.baseScale * (1 + Math.sin(t * d.pulseSpeed) * d.pulseAmp))
          s.position.y += mouseY * 0.2
        })

        redShapes.forEach(rs => {
          const d = rs.userData
          if (d.origPos) {
            rs.rotation.x += d.rotSpd.x; rs.rotation.y += d.rotSpd.y; rs.rotation.z += d.rotSpd.z
            rs.position.y = d.origPos.y + Math.sin(t * d.floatFreq + d.floatPhase) * d.floatAmp
            d.driftAngle += d.driftSpeed * 0.01
            rs.position.x = d.origPos.x + Math.sin(d.driftAngle) * d.driftRadius + mouseX * d.mouseReact
            rs.position.z = d.origPos.z + Math.cos(d.driftAngle) * d.driftRadius * 0.5
            const p = 1 + Math.sin(t * d.pulseSpeed) * d.pulseAmp
            rs.scale.set(d.baseScale.x*p, d.baseScale.y*p, d.baseScale.z*p)
            rs.position.y += mouseY * d.mouseReact * 0.6
          } else if (d.rotSpd) {
            rs.rotation.x += d.rotSpd.x; rs.rotation.y += d.rotSpd.y
          }
        })

        torus.rotation.x = t*0.25; torus.rotation.y = t*0.18
        torusGlow.rotation.x = t*0.25; torusGlow.rotation.y = t*0.18
        ico.rotation.x = t*0.12; ico.rotation.z = t*0.14
        knot.rotation.x = t*0.1;  knot.rotation.y = t*0.08
        energyRings.forEach((er,i) => { er.rotation.x += 0.003+i*0.001; er.rotation.z += 0.002+i*0.001 })

        sphereMat.uniforms.uTime.value = t
        sphereMat.uniforms.uMouse.value.set(mouseX, mouseY)
        glowMat.uniforms.uTime.value = t
        ringMat.uniforms.uTime.value = t
        particles.rotation.y  = t * 0.02
        wParticles.rotation.y = -t * 0.015
        redLight.position.x = Math.sin(t*0.3)*15
        redLight.position.y = Math.cos(t*0.2)*10

        renderer.render(scene, camera)

        if (!initDone) {
          initDone = true
          canvas.style.opacity = '0'
        }

        const capEl = document.getElementById('capabilities')
        let targetCanvas  = 1
        let targetOverlay = 0

        if (capEl) {
          const rect = capEl.getBoundingClientRect()
          const vh   = window.innerHeight

          if (rect.top < vh * 5 && rect.bottom > 0) {
            const prog = Math.max(0, Math.min(1, (vh * 1.78 - rect.top) / (vh * 1.4)))
            const eased = prog * prog * (3 - 2 * prog)
            targetCanvas  = 1 - eased
            targetOverlay = eased
          }

          if (rect.bottom < vh * 0.2) {
            const prog = Math.max(0, Math.min(1, (vh * 0.2 - rect.bottom) / (vh * 0.4)))
            const eased = prog * prog * (3 - 2 * prog)
            targetCanvas  = eased
            targetOverlay = 1 - eased
          }
        }

        canvasOpacity  += (targetCanvas  - canvasOpacity)  * 0.04
        overlayOpacity += (targetOverlay - overlayOpacity) * 0.04

        canvas.style.opacity = canvasOpacity.toFixed(3)
        if (overlayRef.current) {
          overlayRef.current.style.opacity = overlayOpacity.toFixed(3)
        }
      }

      animate()
    }

    setTimeout(() => init(), 400)

    return () => {
      cancelAnimationFrame(animId)
      renderer?.dispose()
      cleanup.forEach(fn => fn())
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 0, opacity: 0,
          willChange: 'opacity',
        }}
        aria-hidden="true"
      />
      <div
        ref={overlayRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 0, opacity: 0,
          background: '#050505',
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
        aria-hidden="true"
      />
    </>
  )
}