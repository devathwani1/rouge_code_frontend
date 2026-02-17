import { useEffect, useRef, useMemo, useCallback } from "react";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
  Vector3,
  Color,
} from "three";

/* ================= SHADERS ================= */

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

/* ---- fragment shader: SAME AS YOUR CODE ---- */
/* ⚠️ KEEP YOUR FRAGMENT SHADER EXACTLY AS YOU ALREADY HAVE IT */
/* I am not repeating it here to avoid mistakes */

/* ================= COMPONENT ================= */

interface LandingPageProps {
  color?: string;
  flakeSize?: number;
  minFlakeSize?: number;
  pixelResolution?: number;
  speed?: number;
  depthFade?: number;
  farPlane?: number;
  brightness?: number;
  gamma?: number;
  density?: number;
  variant?: "square" | "round" | "snowflake";
  direction?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function LandingPage({
  color = "#ffffff",
  flakeSize = 0.01,
  minFlakeSize = 1.25,
  pixelResolution = 200,
  speed = 1.25,
  depthFade = 8,
  farPlane = 20,
  brightness = 1,
  gamma = 0.4545,
  density = 0.3,
  variant = "square",
  direction = 125,
  className = "",
  style = {},
}: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const materialRef = useRef<ShaderMaterial | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  const variantValue = useMemo(() => {
    return variant === "round" ? 1.0 : variant === "snowflake" ? 2.0 : 0.0;
  }, [variant]);

  const colorVector = useMemo(() => {
    const c = new Color(color);
    return new Vector3(c.r, c.g, c.b);
  }, [color]);

  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    resizeTimeoutRef.current = window.setTimeout(() => {
      if (!containerRef.current || !rendererRef.current || !materialRef.current)
        return;
      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;
      rendererRef.current.setSize(w, h);
      materialRef.current.uniforms.uResolution.value.set(w, h);
    }, 100);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const material = new ShaderMaterial({
      vertexShader,
      
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Vector2(container.offsetWidth, container.offsetHeight),
        },
        uFlakeSize: { value: flakeSize },
        uMinFlakeSize: { value: minFlakeSize },
        uPixelResolution: { value: pixelResolution },
        uSpeed: { value: speed },
        uDepthFade: { value: depthFade },
        uFarPlane: { value: farPlane },
        uColor: { value: colorVector.clone() },
        uBrightness: { value: brightness },
        uGamma: { value: gamma },
        uDensity: { value: density },
        uVariant: { value: variantValue },
        uDirection: { value: (direction * Math.PI) / 180 },
      },
      transparent: true,
    });

    materialRef.current = material;
    const geometry = new PlaneGeometry(2, 2);
    scene.add(new Mesh(geometry, material));

    const start = performance.now();
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      material.uniforms.uTime.value = (performance.now() - start) * 0.001;
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [handleResize]);

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uFlakeSize.value = flakeSize;
    materialRef.current.uniforms.uMinFlakeSize.value = minFlakeSize;
    materialRef.current.uniforms.uPixelResolution.value = pixelResolution;
    materialRef.current.uniforms.uSpeed.value = speed;
    materialRef.current.uniforms.uDepthFade.value = depthFade;
    materialRef.current.uniforms.uFarPlane.value = farPlane;
    materialRef.current.uniforms.uBrightness.value = brightness;
    materialRef.current.uniforms.uGamma.value = gamma;
    materialRef.current.uniforms.uDensity.value = density;
    materialRef.current.uniforms.uVariant.value = variantValue;
    materialRef.current.uniforms.uDirection.value =
      (direction * Math.PI) / 180;
    materialRef.current.uniforms.uColor.value.copy(colorVector);
  }, [
    flakeSize,
    minFlakeSize,
    pixelResolution,
    speed,
    depthFade,
    farPlane,
    brightness,
    gamma,
    density,
    variantValue,
    direction,
    colorVector,
  ]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transform-gpu will-change-transform backface-hidden ${className}`}
      style={style}
    />
  );
}
