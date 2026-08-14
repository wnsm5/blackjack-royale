// Polyfill Web APIs for Hermes/React Native engine
if (typeof globalThis.DOMRect === 'undefined') {
  class DOMRectPolyfill {
    x: number; y: number; width: number; height: number;
    top: number; right: number; bottom: number; left: number;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = Number(x) || 0;
      this.y = Number(y) || 0;
      this.width = Number(width) || 0;
      this.height = Number(height) || 0;
      this.top = this.y;
      this.left = this.x;
      this.right = this.x + this.width;
      this.bottom = this.y + this.height;
    }
    static fromRect(rect?: { x?: number; y?: number; width?: number; height?: number }) {
      return new DOMRectPolyfill(rect?.x, rect?.y, rect?.width, rect?.height);
    }
    toJSON() {
      return { x: this.x, y: this.y, width: this.width, height: this.height, top: this.top, right: this.right, bottom: this.bottom, left: this.left };
    }
  }

  Object.defineProperty(globalThis, 'DOMRect', {
    value: DOMRectPolyfill,
    writable: true,
    configurable: true,
  });

  if (typeof global !== 'undefined') {
    (global as any).DOMRect = DOMRectPolyfill;
  }
  if (typeof window !== 'undefined') {
    (window as any).DOMRect = DOMRectPolyfill;
  }
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
