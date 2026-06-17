"use client";

/**
 * ShaderField — animated WebGL "aurora / flowing silk" field.
 *
 * A domain-warped fBm flow shaped into smooth silk ribbons, coloured with an
 * iridescent blue→cyan→periwinkle→violet ramp, with fine grain to kill banding.
 * Production niceties:
 *   - `interactive`: the field gently warps + brightens toward the pointer
 *   - entrance "bloom": ramps from a calm pale state to full flow on mount
 *   - pauses the RAF loop when scrolled offscreen (IntersectionObserver)
 *   - one static frame (no loop, no pointer) under prefers-reduced-motion
 *   - falls back to nothing if WebGL is unavailable (parent CSS bg shows)
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
  uniform vec2  u_res;
  uniform float u_time;
  uniform vec2  u_mouse;  // pointer in [0,1] uv space (y up)
  uniform float u_mInf;   // eased pointer influence 0..1
  uniform float u_intro;  // entrance bloom 0..1

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

  // 5-stop gradient: deep azure → azure → cyan → periwinkle → soft violet.
  // Deliberately blue-only (no green) — Preecursor's brand, not BCG's.
  vec3 grad5(float s){
    vec3 c0 = vec3(0.16, 0.34, 0.76);
    vec3 c1 = vec3(0.33, 0.58, 0.93);
    vec3 c2 = vec3(0.44, 0.78, 0.93);
    vec3 c3 = vec3(0.62, 0.72, 0.96);
    vec3 c4 = vec3(0.64, 0.57, 0.96);
    s = clamp(s, 0.0, 1.0) * 4.0;
    if (s < 1.0) return mix(c0, c1, s);
    if (s < 2.0) return mix(c1, c2, s - 1.0);
    if (s < 3.0) return mix(c2, c3, s - 2.0);
    return mix(c3, c4, s - 3.0);
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_res.xy;
    float asp = u_res.x / u_res.y;
    vec2 ar = vec2(uv.x * asp, uv.y);          // aspect-corrected
    float t = u_time * 0.045;

    // Pointer influence — a soft falloff around the cursor.
    vec2 m = vec2(u_mouse.x * asp, u_mouse.y);
    float mInf = u_mInf * smoothstep(0.85, 0.0, distance(ar, m));

    vec2 p = ar * 1.6;
    vec2 flow = vec2(t * 0.5, t * 0.32);       // slow diagonal drift

    // Two-level domain warp, gently pulled toward the pointer.
    vec2 q = vec2(fbm(p + flow), fbm(p + vec2(3.7, 1.3) - flow * 0.85));
    q += (m - ar) * mInf * 0.5;
    vec2 r = vec2(fbm(p + 1.9 * q + vec2(1.7, 9.2) + 0.16 * t),
                  fbm(p + 1.9 * q + vec2(8.3, 2.8) - 0.13 * t));
    float f = fbm(p + 2.3 * r);

    // Silk folds — smooth bands flowing across the warped field.
    float band = sin((f * 3.2 + r.x * 2.2 + length(q) * 1.5 + t * 0.5) * 3.14159);
    float silk = 0.5 + 0.5 * band;
    float fold = pow(silk, 5.0);                // bright fold sheen

    float fv = clamp(f * 0.5 + 0.5, 0.0, 1.0);
    float rl = clamp(length(r), 0.0, 1.0);

    // Luminous core drifting on a slow Lissajous path; pointer brightens it.
    vec2 ctr = vec2(0.64 + 0.16 * sin(t * 0.6), 0.46 + 0.15 * cos(t * 0.5));
    float glow = smoothstep(1.0, 0.0, distance(ar, vec2(ctr.x * asp, ctr.y)));
    glow += mInf * 0.6;

    // Iridescent colour across the blue gradient, lifted to white along folds.
    float hue = fv * 0.55 + silk * 0.28 + rl * 0.18 + 0.05 * sin(t);
    vec3 col = grad5(hue);
    col = mix(col, vec3(0.97, 0.98, 1.0), clamp(fold * 0.5 + glow * 0.5, 0.0, 0.9));

    // Entrance bloom — start calm/pale, ramp to full flow.
    vec3 calm = vec3(0.86, 0.91, 0.97);
    col = mix(calm, col, smoothstep(0.0, 1.0, u_intro));

    // Keep the left side light so the dark headline stays legible.
    float leftLight = 1.0 - smoothstep(0.0, 0.55, uv.x);
    col = mix(col, vec3(0.88, 0.92, 0.98), leftLight * 0.55);
    col = mix(col, vec3(1.0), leftLight * 0.22);

    // Fine animated grain to kill gradient banding.
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + u_time) * 43758.5453);
    col += (g - 0.5) * 0.022;

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
  /** Enable the subtle pointer-reactive warp/brighten (hero only). */
  interactive?: boolean;
  /**
   * Optional CSS mask applied to the aurora canvas so its alpha fades at the
   * edges (dissolving into adjacent sections instead of hard-clipping). Set as
   * both `maskImage` and `WebkitMaskImage` on the canvas (and the host).
   */
  maskImage?: string;
};

export default function ShaderField({
  className,
  style,
  interactive = false,
  maskImage,
}: Props) {
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
    // Fade the aurora's alpha toward the edges so it dissolves into the
    // neighbouring sections rather than clipping at a hard boundary.
    if (maskImage) {
      canvas.style.maskImage = maskImage;
      canvas.style.webkitMaskImage = maskImage;
    }
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
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMInf = gl.getUniformLocation(prog, "u_mInf");
    const uIntro = gl.getUniformLocation(prog, "u_intro");
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

    // Pointer state (smoothed). target* is where the cursor is; the rendered
    // values ease toward it for a fluid, non-jittery reaction.
    let mx = 0.5,
      my = 0.5,
      tmx = 0.5,
      tmy = 0.5;
    let mInf = 0,
      tMInf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      tmx = (e.clientX - rect.left) / rect.width;
      tmy = 1 - (e.clientY - rect.top) / rect.height;
      tMInf = 0.55;
    };
    const onLeave = () => {
      tMInf = 0;
    };
    if (interactive && !prefersReduced) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    const start = performance.now();
    let raf = 0;
    let visible = true;

    const draw = (now: number, intro: number) => {
      // Ease pointer state toward its target.
      mx += (tmx - mx) * 0.1;
      my += (tmy - my) * 0.1;
      mInf += (tMInf - mInf) * 0.07;

      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.uniform2f(uMouse, mx, my);
      gl!.uniform1f(uMInf, mInf);
      gl!.uniform1f(uIntro, intro);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    };

    if (prefersReduced) {
      // One representative, fully-bloomed static frame; no loop, no pointer.
      draw(start + 3200, 1);
    } else {
      const INTRO_MS = 1400;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        const intro = Math.min(1, (now - start) / INTRO_MS);
        draw(now, intro);
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
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      canvas.remove();
    };
  }, [interactive, maskImage]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        ...(maskImage
          ? { maskImage, WebkitMaskImage: maskImage }
          : null),
        ...style,
      }}
    />
  );
}
