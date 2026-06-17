import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { act, createElement } from "react";
import ShaderField from "./ShaderField";

/**
 * ShaderField is a `useEffect`-driven WebGL component. It creates a <canvas>,
 * asks for a `webgl` context, compiles + links shaders, wires buffers/uniforms,
 * then either spins a RAF loop (normal) or draws a single frame (reduced motion).
 *
 * jsdom has no real WebGL, so we MOCK the GL context to make the real
 * setup/draw/cleanup code run. We mock only the browser/GL primitives
 * (getContext, requestAnimationFrame, matchMedia, IntersectionObserver) and let
 * ShaderField's own logic execute against them.
 */

/* GL constants — the actual values don't matter, only that they're consistent. */
const GL_CONST = {
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  COMPILE_STATUS: 35713,
  LINK_STATUS: 35714,
  ARRAY_BUFFER: 34962,
  STATIC_DRAW: 35044,
  FLOAT: 5126,
  TRIANGLES: 4,
} as const;

type FakeGL = Record<string, unknown> & { drawArrays: ReturnType<typeof vi.fn> };

/**
 * Build a fake WebGL context implementing every method/constant ShaderField
 * touches. `shaderOk`/`programOk` toggle the COMPILE_STATUS / LINK_STATUS
 * outcomes so we can drive the compile/link failure branches.
 */
function makeFakeGL(opts: { shaderOk?: boolean; programOk?: boolean } = {}): FakeGL {
  const { shaderOk = true, programOk = true } = opts;
  return {
    ...GL_CONST,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => shaderOk),
    getShaderInfoLog: vi.fn(() => "shader info log"),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => programOk),
    getProgramInfoLog: vi.fn(() => "program info log"),
    useProgram: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    getUniformLocation: vi.fn(() => ({})),
    uniform2f: vi.fn(),
    uniform1f: vi.fn(),
    drawArrays: vi.fn(),
    viewport: vi.fn(),
  };
}

const origGetContext = HTMLCanvasElement.prototype.getContext;
const origRAF = globalThis.requestAnimationFrame;
const origCAF = globalThis.cancelAnimationFrame;
const origMatchMedia = window.matchMedia;
const origIO = globalThis.IntersectionObserver;

/** Override matchMedia. ShaderField reads `(prefers-reduced-motion: reduce)`. */
function setReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

/**
 * Install a mocked canvas getContext that returns `gl` for "webgl" /
 * "experimental-webgl" requests (and falls through to the real impl for any
 * other context type, e.g. "2d", though ShaderField never asks for those).
 */
function installGetContext(gl: FakeGL | null) {
  HTMLCanvasElement.prototype.getContext = vi.fn(function (
    this: HTMLCanvasElement,
    type: string
  ) {
    if (type === "webgl" || type === "experimental-webgl") return gl;
    return null;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

beforeEach(() => {
  setReducedMotion(false);
});

afterEach(() => {
  cleanup();
  HTMLCanvasElement.prototype.getContext = origGetContext;
  globalThis.requestAnimationFrame = origRAF;
  globalThis.cancelAnimationFrame = origCAF;
  window.matchMedia = origMatchMedia;
  globalThis.IntersectionObserver = origIO;
  vi.restoreAllMocks();
});

describe("ShaderField — happy path (WebGL available)", () => {
  it("appends a canvas, draws a frame in the RAF loop, runs interactive handlers, and cleans up", () => {
    const gl = makeFakeGL();
    installGetContext(gl);

    // Drive the RAF loop synchronously: invoke the callback once, then stop
    // (return 0 and don't re-schedule) so the loop body runs exactly once.
    const rafCb: FrameRequestCallback[] = [];
    let rafCalls = 0;
    const raf = vi.fn((cb: FrameRequestCallback) => {
      rafCalls += 1;
      if (rafCalls === 1) {
        rafCb.push(cb);
        // Invoke the loop body once. Inside, ShaderField re-calls rAF (call #2),
        // which we no-op below so the loop doesn't run away.
        cb(16);
      }
      return rafCalls;
    });
    globalThis.requestAnimationFrame = raf as unknown as typeof requestAnimationFrame;
    const caf = vi.fn();
    globalThis.cancelAnimationFrame = caf as unknown as typeof cancelAnimationFrame;

    const { container, unmount } = render(createElement(ShaderField, { interactive: true }));

    let host!: HTMLElement;
    act(() => {
      host = container.firstChild as HTMLElement;
    });

    // The host div is rendered and a <canvas> was appended into it by the effect.
    expect(host).toBeTruthy();
    const canvas = host.querySelector("canvas");
    expect(canvas).toBeTruthy();

    // Full GL setup ran.
    expect(gl.createProgram).toHaveBeenCalled();
    expect(gl.useProgram).toHaveBeenCalled();
    expect(gl.getUniformLocation).toHaveBeenCalled();

    // The RAF loop executed its body and drew a frame.
    expect(raf).toHaveBeenCalled();
    expect(gl.drawArrays).toHaveBeenCalled();

    // Interactive handlers: pointermove + pointerleave on the host must not throw.
    act(() => {
      host.dispatchEvent(
        new MouseEvent("pointermove", { clientX: 40, clientY: 20, bubbles: true })
      );
      host.dispatchEvent(new MouseEvent("pointerleave", { bubbles: true }));
    });

    // Unmount → cleanup: cancelAnimationFrame runs and the canvas is removed.
    act(() => {
      unmount();
    });
    expect(caf).toHaveBeenCalled();
    expect(host.querySelector("canvas")).toBeNull();
  });
});

describe("ShaderField — reduced motion", () => {
  it("draws one static frame and does NOT start a RAF loop", () => {
    setReducedMotion(true);
    const gl = makeFakeGL();
    installGetContext(gl);

    const raf = vi.fn(() => 1);
    globalThis.requestAnimationFrame = raf as unknown as typeof requestAnimationFrame;

    render(createElement(ShaderField, { interactive: true }));
    act(() => {});

    // The single static `draw()` path ran (drawArrays once)...
    expect(gl.drawArrays).toHaveBeenCalledTimes(1);
    // ...and no RAF loop was started.
    expect(raf).not.toHaveBeenCalled();
  });
});

describe("ShaderField — no WebGL fallback", () => {
  it("removes the canvas and does not throw when getContext returns null", () => {
    installGetContext(null);

    let container!: HTMLElement;
    expect(() => {
      const r = render(createElement(ShaderField, {}));
      container = r.container as unknown as HTMLElement;
      act(() => {});
    }).not.toThrow();

    // Early `if (!gl)` return removes the canvas it had appended.
    const host = container.firstChild as HTMLElement;
    expect(host.querySelector("canvas")).toBeNull();
  });
});

describe("ShaderField — compile failure", () => {
  it("warns and bails (canvas removed) when a shader fails to compile", () => {
    const gl = makeFakeGL({ shaderOk: false });
    installGetContext(gl);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    let container!: HTMLElement;
    act(() => {
      const r = render(createElement(ShaderField, {}));
      container = r.container as unknown as HTMLElement;
    });

    expect(warn).toHaveBeenCalledWith(
      "ShaderField compile error:",
      expect.anything()
    );
    // Bailed before drawing.
    expect(gl.drawArrays).not.toHaveBeenCalled();
    const host = container.firstChild as HTMLElement;
    expect(host.querySelector("canvas")).toBeNull();
  });

  it("warns and bails (canvas removed) when the program fails to link", () => {
    const gl = makeFakeGL({ programOk: false });
    installGetContext(gl);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    let container!: HTMLElement;
    act(() => {
      const r = render(createElement(ShaderField, {}));
      container = r.container as unknown as HTMLElement;
    });

    expect(warn).toHaveBeenCalledWith(
      "ShaderField link error:",
      expect.anything()
    );
    expect(gl.drawArrays).not.toHaveBeenCalled();
    const host = container.firstChild as HTMLElement;
    expect(host.querySelector("canvas")).toBeNull();
  });
});

describe("ShaderField — IntersectionObserver visibility toggle", () => {
  it("pauses then resumes drawing as the field leaves and re-enters the viewport", () => {
    const gl = makeFakeGL();
    installGetContext(gl);

    // Capture the IO callback so we can toggle `visible` ourselves.
    const ioCallbacks: Array<(entries: unknown[]) => void> = [];
    class CapturingIO {
      cb: (entries: unknown[]) => void;
      constructor(cb: (entries: unknown[]) => void) {
        this.cb = cb;
        ioCallbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    globalThis.IntersectionObserver =
      CapturingIO as unknown as typeof IntersectionObserver;

    // Capture the loop callback but DON'T auto-invoke it — we step it manually.
    let loopCb: FrameRequestCallback | null = null;
    const raf = vi.fn((cb: FrameRequestCallback) => {
      loopCb = cb;
      return 1;
    });
    globalThis.requestAnimationFrame = raf as unknown as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = vi.fn() as unknown as typeof cancelAnimationFrame;

    render(createElement(ShaderField, {}));
    act(() => {});

    expect(loopCb).toBeTruthy();
    expect(ioCallbacks.length).toBe(1);

    // Toggle offscreen → visible=false. The next loop tick must early-return
    // (no draw).
    act(() => {
      ioCallbacks[0]([{ isIntersecting: false }]);
    });
    gl.drawArrays.mockClear();
    act(() => {
      loopCb!(32);
    });
    expect(gl.drawArrays).not.toHaveBeenCalled();

    // Toggle back onscreen → visible=true. Now the loop draws again.
    act(() => {
      ioCallbacks[0]([{ isIntersecting: true }]);
    });
    act(() => {
      loopCb!(48);
    });
    expect(gl.drawArrays).toHaveBeenCalled();
  });
});
