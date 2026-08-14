// EARLY POLYFILL SCRIPT - Injected by Metro before React Native MessageQueue & setupDOM initialization
(function () {
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

  var polyfills = {
    DOMRect: DOMRectPolyfill,
    DOMRectReadOnly: DOMRectReadOnlyPolyfill,
    DOMPoint: DOMPointPolyfill,
    DOMPointReadOnly: DOMPointPolyfill,
    DOMMatrix: DOMMatrixPolyfill,
    DOMMatrixReadOnly: DOMMatrixPolyfill,
  };

  var allContexts = [
    typeof globalThis !== 'undefined' ? globalThis : null,
    typeof global !== 'undefined' ? global : null,
    typeof window !== 'undefined' ? window : null,
    typeof self !== 'undefined' ? self : null,
  ];

  allContexts.forEach(function (ctx) {
    if (!ctx) return;
    for (var key in polyfills) {
      if (Object.prototype.hasOwnProperty.call(polyfills, key)) {
        try {
          ctx[key] = polyfills[key];
          Object.defineProperty(ctx, key, {
            value: polyfills[key],
            writable: true,
            configurable: true,
            enumerable: false,
          });
        } catch (e) {
          try {
            ctx[key] = polyfills[key];
          } catch (err) {}
        }
      }
    }
  });
})();
