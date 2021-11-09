import { S as Selection, r as root } from './index-49bb1ecc.js';

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

export { select as s };
//# sourceMappingURL=select-9137152e.js.map
