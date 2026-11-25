"use client";
/**
 * 3D physics lanyard badge (in the spirit of Vercel's lanyard demo, built from scratch):
 * a rope of rapier rigid bodies holds a double-sided card. It swings and twists on its own,
 * shows the QR code on the back when it turns, and can be grabbed and thrown.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, type RapierRigidBody } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import QRCode from "qrcode";

extend({ MeshLineGeometry, MeshLineMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, "args"> & { args?: ConstructorParameters<typeof MeshLineMaterial> };
  }
}

const CARD_W = 1.6;
const CARD_H = 2.25;
const SITE = "https://sohila-portfolio-ten.vercel.app";

/* ---------------------------------------------------------------- textures drawn on canvases */
function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function useCardTextures() {
  const [tex, setTex] = useState<{ front: THREE.CanvasTexture; back: THREE.CanvasTexture; strap: THREE.CanvasTexture } | null>(null);
  useEffect(() => {
    let alive = true;
    const font = getComputedStyle(document.body).fontFamily || "sans-serif";
    const W = 640, H = 900, R = 48;
    const make = () => {
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      return [cv, cv.getContext("2d")!] as const;
    };
    const img = new Image();
    img.src = "/avatar/sohila.webp";
    const ready = img.decode().catch(() => undefined);

    const qr = document.createElement("canvas");
    Promise.all([ready, QRCode.toCanvas(qr, SITE, { margin: 1, width: 380, color: { dark: "#140f22", light: "#ffffff" } })]).then(() => {
      if (!alive) return;
      // FRONT
      const [f, c] = make();
      roundRect(c, 0, 0, W, H, R);
      c.save();
      c.clip();
      const g = c.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#1d1830");
      g.addColorStop(1, "#0f0c19");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.fillStyle = "#8b5cf6";
      c.fillRect(0, 0, W, 92);
      c.fillStyle = "#fff";
      c.font = `800 30px ${font}`;
      c.textBaseline = "middle";
      c.fillText("D E V E L O P E R", 40, 48);
      c.textAlign = "right";
      c.fillText("2 0 2 6", W - 40, 48);
      c.textAlign = "left";
      c.fillStyle = "rgba(0,0,0,.45)";
      roundRect(c, W / 2 - 60, 120, 120, 16, 8);
      c.fill();
      // photo
      const ph = 380, px = (W - ph) / 2, py = 170;
      c.save();
      roundRect(c, px, py, ph, ph, 36);
      c.clip();
      if (img.complete && img.naturalWidth) c.drawImage(img, px, py, ph, ph);
      c.restore();
      c.strokeStyle = "rgba(255,255,255,.18)";
      c.lineWidth = 3;
      roundRect(c, px, py, ph, ph, 36);
      c.stroke();
      c.textAlign = "center";
      c.fillStyle = "#ffffff";
      c.font = `800 52px ${font}`;
      c.fillText("SOHILA EBRAHIM", W / 2, 610);
      c.fillStyle = "#a78bfa";
      c.font = `700 26px ${font}`;
      c.fillText("F U L L   S T A C K   D E V E L O P E R", W / 2, 660);
      c.strokeStyle = "rgba(255,255,255,.12)";
      c.beginPath();
      c.moveTo(40, 712);
      c.lineTo(W - 40, 712);
      c.stroke();
      c.textAlign = "left";
      c.fillStyle = "#8f8aa3";
      c.font = `600 22px ${font}`;
      c.fillText("ID", 40, 760);
      c.fillStyle = "#ece9f5";
      c.font = `700 28px ${font}`;
      c.fillText("SE-2026", 40, 800);
      let bx = W - 260;
      [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1].forEach((w) => {
        c.fillStyle = "#ece9f5";
        c.fillRect(bx, 745, w * 4, 75);
        bx += w * 4 + 5;
      });
      c.restore();
      // BACK
      const [b, k] = make();
      roundRect(k, 0, 0, W, H, R);
      k.save();
      k.clip();
      const gb = k.createLinearGradient(0, 0, W, H);
      gb.addColorStop(0, "#2a1760");
      gb.addColorStop(1, "#0f0c19");
      k.fillStyle = gb;
      k.fillRect(0, 0, W, H);
      k.fillStyle = "rgba(139,92,246,.25)";
      k.beginPath();
      k.arc(W * 0.8, H * 0.15, 220, 0, Math.PI * 2);
      k.fill();
      k.fillStyle = "#ffffff";
      roundRect(k, (W - 420) / 2, 170, 420, 420, 32);
      k.fill();
      k.drawImage(qr, (W - 380) / 2, 190, 380, 380);
      k.textAlign = "center";
      k.fillStyle = "#ffffff";
      k.font = `800 46px ${font}`;
      k.fillText("Scan to visit", W / 2, 680);
      k.fillStyle = "#a78bfa";
      k.font = `600 26px ${font}`;
      k.fillText("sohila-portfolio-ten.vercel.app", W / 2, 728);
      k.fillStyle = "rgba(255,255,255,.5)";
      k.font = `700 24px ${font}`;
      k.fillText("< SOHILA />", W / 2, 820);
      k.restore();
      // STRAP
      const s = document.createElement("canvas");
      s.width = 1024;
      s.height = 64;
      const t = s.getContext("2d")!;
      const gs = t.createLinearGradient(0, 0, 0, 64);
      gs.addColorStop(0, "#7c3aed");
      gs.addColorStop(0.5, "#8b5cf6");
      gs.addColorStop(1, "#6d28d9");
      t.fillStyle = gs;
      t.fillRect(0, 0, 1024, 64);
      t.fillStyle = "rgba(255,255,255,.85)";
      t.font = `800 30px ${font}`;
      t.textBaseline = "middle";
      for (let x = 10; x < 1024; x += 256) t.fillText("SOHILA ✦", x, 34);

      const mk = (cv: HTMLCanvasElement) => {
        const tx = new THREE.CanvasTexture(cv);
        tx.colorSpace = THREE.SRGBColorSpace;
        tx.anisotropy = 8;
        return tx;
      };
      const strap = mk(s);
      strap.wrapS = strap.wrapT = THREE.RepeatWrapping;
      setTex({ front: mk(f), back: mk(b), strap });
    });
    return () => {
      alive = false;
    };
  }, []);
  return tex;
}

/* ---------------------------------------------------------------- the rope + card */
function Band({ textures }: { textures: NonNullable<ReturnType<typeof useCardTextures>> }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const { size } = useThree();
  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = "chordal";
    return c;
  }, []);
  const seg = { type: "dynamic" as const, canSleep: false, colliders: false as const, angularDamping: 0.6, linearDamping: 1.2 };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, CARD_H / 2 + 0.12, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, dragged]);

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (!fixed.current || !band.current) return;
    curve.points[0].copy(j3.current.translation() as THREE.Vector3);
    curve.points[1].copy(j2.current.translation() as THREE.Vector3);
    curve.points[2].copy(j1.current.translation() as THREE.Vector3);
    curve.points[3].copy(fixed.current.translation() as THREE.Vector3);
    band.current.geometry.setPoints(curve.getPoints(32));
    if (!dragged) {
      // gentle idle life: a slow twist around the strap and a soft sideways sway
      const t = state.clock.elapsedTime;
      const av = card.current.angvel();
      // spring the card's facing angle toward a slow swing that sometimes turns past 90°, showing the QR back
      const q = card.current.rotation();
      fwd.set(0, 0, 1).applyQuaternion(quat.set(q.x, q.y, q.z, q.w));
      const yaw = Math.atan2(fwd.x, fwd.z);
      const target = Math.sin(t * 0.32) * 2.1;
      let diff = target - yaw;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      card.current.setAngvel({ x: av.x * 0.98, y: av.y * 0.97 + diff * 0.05, z: av.z * 0.98 }, true);
      const lv = card.current.linvel();
      card.current.setLinvel({ x: lv.x + Math.sin(t * 0.8) * 0.006, y: lv.y, z: lv.z }, true);
    }
  });

  return (
    <>
      <group position={[0, 4.2, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...seg} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.02]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture?.(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture?.(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation() as THREE.Vector3)));
            }}
          >
            {/* front */}
            <mesh position={[0, 0, 0.012]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshPhysicalMaterial map={textures.front} transparent alphaTest={0.5} roughness={0.35} clearcoat={1} clearcoatRoughness={0.15} />
            </mesh>
            {/* back */}
            <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshPhysicalMaterial map={textures.back} transparent alphaTest={0.5} roughness={0.35} clearcoat={1} clearcoatRoughness={0.15} />
            </mesh>
            {/* metal clip */}
            <mesh position={[0, CARD_H / 2 + 0.06, 0]}>
              <boxGeometry args={[0.32, 0.16, 0.06]} />
              <meshStandardMaterial color="#d4d4dc" metalness={1} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={new THREE.Vector2(size.width, size.height)}
          useMap={1}
          map={textures.strap}
          repeat={new THREE.Vector2(-3, 1)}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

export default function Badge3D({ className = "" }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const textures = useCardTextures();

  // pause physics and rendering while the hero is off-screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={className}>
      <Canvas camera={{ position: [0, 0, typeof window !== "undefined" && window.innerWidth < 768 ? 15 : 10], fov: 25 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} frameloop={visible ? "always" : "never"} style={{ background: "transparent" }}>
        <ambientLight intensity={Math.PI * 0.6} />
        {textures && (
          <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!visible} interpolate>
            <Band textures={textures} />
          </Physics>
        )}
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="#c4b5fd" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="#f9a8d4" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
