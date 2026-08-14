// EARLY POLYFILL IMPORT - Loaded before any React Native runtime module initialization
function applyDOMRectPolyfill() {
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

  const contexts = [
    typeof globalThis !== 'undefined' ? globalThis : null,
    typeof global !== 'undefined' ? global : null,
    typeof window !== 'undefined' ? window : null,
  ];

  contexts.forEach(function (ctx) {
    if (ctx && typeof ctx.DOMRect === 'undefined') {
      try {
        Object.defineProperty(ctx, 'DOMRect', {
          value: DOMRectPolyfill,
          writable: true,
          configurable: true,
          enumerable: false,
        });
      } catch (e) {
        ctx.DOMRect = DOMRectPolyfill;
      }
    }
  });
}

applyDOMRectPolyfill();

module.exports = applyDOMRectPolyfill;
