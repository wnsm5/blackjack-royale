// EARLY POLYFILL SCRIPT - Loaded by Metro before setupDOM / module initialization
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

  var targets = [
    typeof globalThis !== 'undefined' ? globalThis : null,
    typeof global !== 'undefined' ? global : null,
    typeof window !== 'undefined' ? window : null,
  ];

  targets.forEach(function (target) {
    if (!target) return;

    if (typeof target.DOMRect === 'undefined') {
      try {
        Object.defineProperty(target, 'DOMRect', {
          value: DOMRectPolyfill,
          writable: true,
          configurable: true,
          enumerable: false,
        });
      } catch (e) {
        target.DOMRect = DOMRectPolyfill;
      }
    }

    if (typeof target.DOMRectReadOnly === 'undefined') {
      try {
        Object.defineProperty(target, 'DOMRectReadOnly', {
          value: DOMRectReadOnlyPolyfill,
          writable: true,
          configurable: true,
          enumerable: false,
        });
      } catch (e) {
        target.DOMRectReadOnly = DOMRectReadOnlyPolyfill;
      }
    }
  });
})();
