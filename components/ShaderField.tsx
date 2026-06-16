"use client";

/**
 * ShaderField — animated WebGL gradient field (domain-warped fBm flow).
 *
 * Ported verbatim (shader maths) from the design handoff's `shader-field.js`,
 * wrapped as a React client component with three production niceties:
 *   - pauses the RAF loop when scrolled offscreen (IntersectionObserver)
 *   - renders a single static frame (no loop) under prefers-reduced-motion
 *   - falls back to nothing if WebGL is unavailable, so the parent's CSS
 *     gradient remains visible
 *
 * The parent must be positioned and supply a CSS background as the fallback.
 */

import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 p;
  void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;
  uniform vec2 u_res;
  uniform float u_time;

  vec2 hash22(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash22(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
          dot(hash22(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
      mix(dot(hash22(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
          dot(hash22(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++){
      v += a * noise(p);
      p = p * 2.0 + vec2(3.1, 1.7);
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res.xy;
    float asp = u_res.x / u_res.y;
    vec2 p = vec2(uv.x * asp, uv.y) * 2.0;
    float t = u_time * 0.06;

    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + 0.15 * t),
                  fbm(p + 2.0 * q + vec2(8.3, 2.8) - 0.13 * t));
    float f = fbm(p + 2.4 * r);
    f = clamp(f * 0.5 + 0.5, 0.0, 1.0);
    float rl = clamp(length(r), 0.0, 1.0);

    vec3 c1 = vec3(0.847, 0.902, 0.969); // #d8e6f7 pale
    vec3 c2 = vec3(0.561, 0.722, 0.941); // #8fb8f0 periwinkle
    vec3 c3 = vec3(0.373, 0.784, 0.910); // #5fc8e8 cyan
    vec3 c4 = vec3(0.890, 0.933, 0.988); // #e3eefc near-white
    vec3 c5 = vec3(0.310, 0.557, 0.941); // #4f8ef0 azure

    vec3 col = mix(c1, c2, smoothstep(0.25, 0.65, f));
    col = mix(col, c3, smoothstep(0.55, 0.92, f) * 0.55);
    col = mix(col, c4, smoothstep(0.0, 0.30, 1.0 - f) * 0.8);
    col = mix(col, c5, smoothstep(0.6, 1.0, rl) * 0.30);
    // lighten the left third so headline text stays legible
    col = mix(col, c4, (1.0 - smoothstep(0.0, 0.6, uv.x)) * 0.40);
    col = mix(col, vec3(1.0), 0.05);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("ShaderField compile error:", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function ShaderField({ className, style }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(canvas);

    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        (canvas.getContext("webgl", { antialias: true, alpha: false }) as
          | WebGLRenderingContext
          | null) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    } catch {
      /* ignore — CSS background fallback remains visible */
    }
    if (!gl) {
      canvas.remove();
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      canvas.remove();
      return;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("ShaderField link error:", gl.getProgramInfoLog(prog));
      canvas.remove();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl!.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const start = performance.now();
    let raf = 0;
    let visible = true;

    const draw = (now: number) => {
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    };

    if (prefersReduced) {
      // One representative static frame; no animation loop.
      draw(start + 3200);
    } else {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (visible) draw(now);
      };
      raf = requestAnimationFrame(loop);
    }

    // Pause the loop while the field is scrolled offscreen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" }
    );
    io.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}
    />
  );
}
