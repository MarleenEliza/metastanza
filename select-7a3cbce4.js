import { S as Selection, r as root } from './transform-450ed364.js';

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

export { select as s };
//# sourceMappingURL=select-7a3cbce4.js.map
