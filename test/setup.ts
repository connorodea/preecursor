import { vi } from "vitest";
import { MotionGlobalConfig } from "motion-utils";

// Make framer-motion animations resolve to their final keyframe instantly so
// AnimatePresence exit/enter transitions settle synchronously in tests (no real
// RAF clock). Render-presence and reduced-motion assertions are unaffected.
MotionGlobalConfig.skipAnimations = true;

// jsdom lacks these browser APIs that framer-motion + our components touch.
// Provide inert stubs so components render without throwing in tests.
const g = globalThis as unknown as Record<string, unknown>;

if (!window.matchMedia) {
  g.matchMedia = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}

g.IntersectionObserver ||= IO;
g.ResizeObserver ||= RO;
