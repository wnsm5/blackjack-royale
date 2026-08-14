// EARLY POLYFILL SCRIPT - Loaded by Metro before CommonJS runtime / module.exports is setup
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

  var target = typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this;

  if (target && typeof target.DOMRect === 'undefined') {
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

  if (typeof global !== 'undefined' && typeof global.DOMRect === 'undefined') {
    global.DOMRect = DOMRectPolyfill;
  }
})();
