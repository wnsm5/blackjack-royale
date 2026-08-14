// Top-level Polyfills for React Native / Hermes
(function () {
  function DOMRect(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.top = this.y;
    this.left = this.x;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

  DOMRect.fromRect = function (rect) {
    return new DOMRect(rect && rect.x, rect && rect.y, rect && rect.width, rect && rect.height);
  };

  DOMRect.prototype.toJSON = function () {
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

  var target = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;

  if (target && !target.DOMRect) {
    target.DOMRect = DOMRect;
  }
  if (typeof global !== 'undefined' && !global.DOMRect) {
    global.DOMRect = DOMRect;
  }
})();

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
