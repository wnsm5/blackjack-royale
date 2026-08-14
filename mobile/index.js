// Polyfill Web APIs for Hermes/React Native JS engine
if (typeof globalThis.DOMRect === 'undefined') {
  function DOMRectPolyfill(x, y, width, height) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.width = Number(width) || 0;
    this.height = Number(height) || 0;
    this.top = this.y;
    this.left = this.x;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

  DOMRectPolyfill.fromRect = function (rect) {
    return new DOMRectPolyfill(
      rect && rect.x,
      rect && rect.y,
      rect && rect.width,
      rect && rect.height
    );
  };

  DOMRectPolyfill.prototype.toJSON = function () {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    };
  };

  Object.defineProperty(globalThis, 'DOMRect', {
    value: DOMRectPolyfill,
    writable: true,
    configurable: true,
  });

  if (typeof global !== 'undefined') {
    global.DOMRect = DOMRectPolyfill;
  }
  if (typeof window !== 'undefined') {
    window.DOMRect = DOMRectPolyfill;
  }
}

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
