// EARLY POLYFILL SCRIPT - Injected by Metro before React Native runtime initialization
(function () {
  var target = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;
  if (!target) return;

  function DOMRectPolyfill(x, y, w, h) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.width = Number(w) || 0;
    this.height = Number(h) || 0;
    this.top = this.y;
    this.left = this.x;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }
  DOMRectPolyfill.fromRect = function (r) {
    return new DOMRectPolyfill(r && r.x, r && r.y, r && r.width, r && r.height);
  };
  DOMRectPolyfill.prototype.toJSON = function () {
    return { x: this.x, y: this.y, width: this.width, height: this.height, top: this.top, right: this.right, bottom: this.bottom, left: this.left };
  };

  function DOMRectReadOnlyPolyfill(x, y, w, h) {
    return new DOMRectPolyfill(x, y, w, h);
  }
  DOMRectReadOnlyPolyfill.fromRect = DOMRectPolyfill.fromRect;
  DOMRectReadOnlyPolyfill.prototype = DOMRectPolyfill.prototype;

  function DOMPointPolyfill(x, y, z, w) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.z = Number(z) || 0;
    this.w = Number(w) || 1;
  }

  function DOMMatrixPolyfill() {
    this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
  }

  const polyfills = {
    DOMRect: DOMRectPolyfill,
    DOMRectReadOnly: DOMRectReadOnlyPolyfill,
    DOMPoint: DOMPointPolyfill,
    DOMPointReadOnly: DOMPointPolyfill,
    DOMMatrix: DOMMatrixPolyfill,
    DOMMatrixReadOnly: DOMMatrixPolyfill,
  };

  Object.keys(polyfills).forEach(function (key) {
    if (typeof target[key] === 'undefined') {
      try {
        Object.defineProperty(target, key, {
          value: polyfills[key],
          writable: true,
          configurable: true,
          enumerable: false,
        });
      } catch (e) {
        target[key] = polyfills[key];
      }
    }
  });
})();
