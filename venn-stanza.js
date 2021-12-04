import { g as getAugmentedNamespace, c as commonjsGlobal, a as getDefaultExportFromCjs, d as defineStanzaElement } from './stanza-element-127b261a.js';
import { S as Stanza } from './stanza-dbdc7fa3.js';
import { l as loadData } from './load-data-2c1caadf.js';
import './index-57ff628c.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as appendCustomCss, s as select$1 } from './index-1a193a0d.js';

var venn$1 = {exports: {}};

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection$1(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection$1(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant$1(x) {
  return function() {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

function selection_data(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$1(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection$1(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection$1(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection$1(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS$1(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction$1(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS$1(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction$1(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove$1 : typeof value === "function"
            ? styleFunction$1
            : styleConstant$1)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction$1
          : textConstant$1)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

var filterEvents = {};

var event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).
    event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      event = event0;
    }
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, capture) {
  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = event;
  event1.sourceEvent = event;
  event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    event = event0;
  }
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

var root$1 = [null];

function Selection$1(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection$1([[document.documentElement]], root$1);
}

Selection$1.prototype = selection.prototype = {
  constructor: Selection$1,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
      : new Selection$1([[selector]], root$1);
}

function create$1(name) {
  return select(creator(name).call(document.documentElement));
}

var nextId = 0;

function local() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

function sourceEvent() {
  var current = event, source;
  while (source = current.sourceEvent) current = source;
  return current;
}

function point(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

function mouse(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
}

function selectAll(selector) {
  return typeof selector === "string"
      ? new Selection$1([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection$1([selector == null ? [] : selector], root$1);
}

function touch(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
}

function touches(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }

  return points;
}

var src$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$1,
  creator: creator,
  local: local,
  matcher: matcher,
  mouse: mouse,
  namespace: namespace,
  namespaces: namespaces,
  clientPoint: point,
  select: select,
  selectAll: selectAll,
  selection: selection,
  selector: selector,
  selectorAll: selectorAll,
  style: styleValue,
  touch: touch,
  touches: touches,
  window: defaultView,
  get event () { return event; },
  customEvent: customEvent
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(src$1);

var noop = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get$1(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var frame = 0, // is an animation frame pending?
    timeout$1 = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout$1 = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(function(elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color$1() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color$1, color$1, {
  copy: function(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color$1(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color$1)) o = color$1(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color$1, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(")
      + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.b) || 0))
      + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color$1)) o = color$1(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color$1, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(")
        + (this.h || 0) + ", "
        + (this.s || 0) * 100 + "%, "
        + (this.l || 0) * 100 + "%"
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

function constant(x) {
  return function() {
    return x;
  };
}

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;

  return rgb$1;
})(1);

function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

var degrees = 180 / Math.PI;

var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var cssNode,
    cssRoot,
    cssView,
    svgNode;

function parseCss(value) {
  if (value === "none") return identity;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get(node, id).value[name];
  };
}

function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color$1 ? interpolateRgb
      : (c = color$1(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
      : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get(this.node(), id).ease;
}

function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection = selection.prototype.constructor;

function transition_selection() {
  return new Selection(this._groups, this._parents);
}

function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = set(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant(name, i, value), priority)
      .on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction(tweenValue(this, "text", value))
      : textConstant(value == null ? "" : value + ""));
}

function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = set(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });
  });
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return selection().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  end: transition_end
};

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = now(), defaultTiming;
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

var root = [null];

function active(node, name) {
  var schedules = node.__transition,
      schedule,
      i;

  if (schedules) {
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
        return new Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}

var src = /*#__PURE__*/Object.freeze({
  __proto__: null,
  transition: transition,
  active: active,
  interrupt: interrupt
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(src);

(function (module, exports) {
(function (global, factory) {
	factory(exports, require$$0, require$$1) ;
}(commonjsGlobal, (function (exports,d3Selection,d3Transition) {
var SMALL = 1e-10;

/** Returns the intersection area of a bunch of circles (where each circle
 is an object having an x,y and radius property) */
function intersectionArea(circles, stats) {
    // get all the intersection points of the circles
    var intersectionPoints = getIntersectionPoints(circles);

    // filter out points that aren't included in all the circles
    var innerPoints = intersectionPoints.filter(function (p) {
        return containedInCircles(p, circles);
    });

    var arcArea = 0, polygonArea = 0, arcs = [], i;

    // if we have intersection points that are within all the circles,
    // then figure out the area contained by them
    if (innerPoints.length > 1) {
        // sort the points by angle from the center of the polygon, which lets
        // us just iterate over points to get the edges
        var center = getCenter(innerPoints);
        for (i = 0; i < innerPoints.length; ++i ) {
            var p = innerPoints[i];
            p.angle = Math.atan2(p.x - center.x, p.y - center.y);
        }
        innerPoints.sort(function(a,b) { return b.angle - a.angle;});

        // iterate over all points, get arc between the points
        // and update the areas
        var p2 = innerPoints[innerPoints.length - 1];
        for (i = 0; i < innerPoints.length; ++i) {
            var p1 = innerPoints[i];

            // polygon area updates easily ...
            polygonArea += (p2.x + p1.x) * (p1.y - p2.y);

            // updating the arc area is a little more involved
            var midPoint = {x : (p1.x + p2.x) / 2,
                            y : (p1.y + p2.y) / 2},
                arc = null;

            for (var j = 0; j < p1.parentIndex.length; ++j) {
                if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
                    // figure out the angle halfway between the two points
                    // on the current circle
                    var circle = circles[p1.parentIndex[j]],
                        a1 = Math.atan2(p1.x - circle.x, p1.y - circle.y),
                        a2 = Math.atan2(p2.x - circle.x, p2.y - circle.y);

                    var angleDiff = (a2 - a1);
                    if (angleDiff < 0) {
                        angleDiff += 2*Math.PI;
                    }

                    // and use that angle to figure out the width of the
                    // arc
                    var a = a2 - angleDiff/2,
                        width = distance(midPoint, {
                            x : circle.x + circle.radius * Math.sin(a),
                            y : circle.y + circle.radius * Math.cos(a)
                        });

                    // clamp the width to the largest is can actually be
                    // (sometimes slightly overflows because of FP errors)
                    if (width > circle.radius * 2) {
                        width = circle.radius * 2;
                    }

                    // pick the circle whose arc has the smallest width
                    if ((arc === null) || (arc.width > width)) {
                        arc = { circle : circle,
                                width : width,
                                p1 : p1,
                                p2 : p2};
                    }
                }
            }

            if (arc !== null) {
                arcs.push(arc);
                arcArea += circleArea(arc.circle.radius, arc.width);
                p2 = p1;
            }
        }
    } else {
        // no intersection points, is either disjoint - or is completely
        // overlapped. figure out which by examining the smallest circle
        var smallest = circles[0];
        for (i = 1; i < circles.length; ++i) {
            if (circles[i].radius < smallest.radius) {
                smallest = circles[i];
            }
        }

        // make sure the smallest circle is completely contained in all
        // the other circles
        var disjoint = false;
        for (i = 0; i < circles.length; ++i) {
            if (distance(circles[i], smallest) > Math.abs(smallest.radius - circles[i].radius)) {
                disjoint = true;
                break;
            }
        }

        if (disjoint) {
            arcArea = polygonArea = 0;

        } else {
            arcArea = smallest.radius * smallest.radius * Math.PI;
            arcs.push({circle : smallest,
                       p1: { x: smallest.x,        y : smallest.y + smallest.radius},
                       p2: { x: smallest.x - SMALL, y : smallest.y + smallest.radius},
                       width : smallest.radius * 2 });
        }
    }

    polygonArea /= 2;
    if (stats) {
        stats.area = arcArea + polygonArea;
        stats.arcArea = arcArea;
        stats.polygonArea = polygonArea;
        stats.arcs = arcs;
        stats.innerPoints = innerPoints;
        stats.intersectionPoints = intersectionPoints;
    }

    return arcArea + polygonArea;
}

/** returns whether a point is contained by all of a list of circles */
function containedInCircles(point, circles) {
    for (var i = 0; i < circles.length; ++i) {
        if (distance(point, circles[i]) > circles[i].radius + SMALL) {
            return false;
        }
    }
    return true;
}

/** Gets all intersection points between a bunch of circles */
function getIntersectionPoints(circles) {
    var ret = [];
    for (var i = 0; i < circles.length; ++i) {
        for (var j = i + 1; j < circles.length; ++j) {
            var intersect = circleCircleIntersection(circles[i],
                                                          circles[j]);
            for (var k = 0; k < intersect.length; ++k) {
                var p = intersect[k];
                p.parentIndex = [i,j];
                ret.push(p);
            }
        }
    }
    return ret;
}

/** Circular segment area calculation. See http://mathworld.wolfram.com/CircularSegment.html */
function circleArea(r, width) {
    return r * r * Math.acos(1 - width/r) - (r - width) * Math.sqrt(width * (2 * r - width));
}

/** euclidean distance between two points */
function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) +
                     (p1.y - p2.y) * (p1.y - p2.y));
}


/** Returns the overlap area of two circles of radius r1 and r2 - that
have their centers separated by distance d. Simpler faster
circle intersection for only two circles */
function circleOverlap(r1, r2, d) {
    // no overlap
    if (d >= r1 + r2) {
        return 0;
    }

    // completely overlapped
    if (d <= Math.abs(r1 - r2)) {
        return Math.PI * Math.min(r1, r2) * Math.min(r1, r2);
    }

    var w1 = r1 - (d * d - r2 * r2 + r1 * r1) / (2 * d),
        w2 = r2 - (d * d - r1 * r1 + r2 * r2) / (2 * d);
    return circleArea(r1, w1) + circleArea(r2, w2);
}

/** Given two circles (containing a x/y/radius attributes),
returns the intersecting points if possible.
note: doesn't handle cases where there are infinitely many
intersection points (circles are equivalent):, or only one intersection point*/
function circleCircleIntersection(p1, p2) {
    var d = distance(p1, p2),
        r1 = p1.radius,
        r2 = p2.radius;

    // if to far away, or self contained - can't be done
    if ((d >= (r1 + r2)) || (d <= Math.abs(r1 - r2))) {
        return [];
    }

    var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d),
        h = Math.sqrt(r1 * r1 - a * a),
        x0 = p1.x + a * (p2.x - p1.x) / d,
        y0 = p1.y + a * (p2.y - p1.y) / d,
        rx = -(p2.y - p1.y) * (h / d),
        ry = -(p2.x - p1.x) * (h / d);

    return [{x: x0 + rx, y : y0 - ry },
            {x: x0 - rx, y : y0 + ry }];
}

/** Returns the center of a bunch of points */
function getCenter(points) {
    var center = {x: 0, y: 0};
    for (var i =0; i < points.length; ++i ) {
        center.x += points[i].x;
        center.y += points[i].y;
    }
    center.x /= points.length;
    center.y /= points.length;
    return center;
}

/** finds the zeros of a function, given two starting points (which must
 * have opposite signs */
function bisect(f, a, b, parameters) {
    parameters = parameters || {};
    var maxIterations = parameters.maxIterations || 100,
        tolerance = parameters.tolerance || 1e-10,
        fA = f(a),
        fB = f(b),
        delta = b - a;

    if (fA * fB > 0) {
        throw "Initial bisect points must have opposite signs";
    }

    if (fA === 0) return a;
    if (fB === 0) return b;

    for (var i = 0; i < maxIterations; ++i) {
        delta /= 2;
        var mid = a + delta,
            fMid = f(mid);

        if (fMid * fA >= 0) {
            a = mid;
        }

        if ((Math.abs(delta) < tolerance) || (fMid === 0)) {
            return mid;
        }
    }
    return a + delta;
}

// need some basic operations on vectors, rather than adding a dependency,
// just define here
function zeros(x) { var r = new Array(x); for (var i = 0; i < x; ++i) { r[i] = 0; } return r; }
function zerosM(x,y) { return zeros(x).map(function() { return zeros(y); }); }

function dot(a, b) {
    var ret = 0;
    for (var i = 0; i < a.length; ++i) {
        ret += a[i] * b[i];
    }
    return ret;
}

function norm2(a)  {
    return Math.sqrt(dot(a, a));
}

function scale(ret, value, c) {
    for (var i = 0; i < value.length; ++i) {
        ret[i] = value[i] * c;
    }
}

function weightedSum(ret, w1, v1, w2, v2) {
    for (var j = 0; j < ret.length; ++j) {
        ret[j] = w1 * v1[j] + w2 * v2[j];
    }
}

/** minimizes a function using the downhill simplex method */
function nelderMead(f, x0, parameters) {
    parameters = parameters || {};

    var maxIterations = parameters.maxIterations || x0.length * 200,
        nonZeroDelta = parameters.nonZeroDelta || 1.05,
        zeroDelta = parameters.zeroDelta || 0.001,
        minErrorDelta = parameters.minErrorDelta || 1e-6,
        minTolerance = parameters.minErrorDelta || 1e-5,
        rho = (parameters.rho !== undefined) ? parameters.rho : 1,
        chi = (parameters.chi !== undefined) ? parameters.chi : 2,
        psi = (parameters.psi !== undefined) ? parameters.psi : -0.5,
        sigma = (parameters.sigma !== undefined) ? parameters.sigma : 0.5,
        maxDiff;

    // initialize simplex.
    var N = x0.length,
        simplex = new Array(N + 1);
    simplex[0] = x0;
    simplex[0].fx = f(x0);
    simplex[0].id = 0;
    for (var i = 0; i < N; ++i) {
        var point = x0.slice();
        point[i] = point[i] ? point[i] * nonZeroDelta : zeroDelta;
        simplex[i+1] = point;
        simplex[i+1].fx = f(point);
        simplex[i+1].id = i+1;
    }

    function updateSimplex(value) {
        for (var i = 0; i < value.length; i++) {
            simplex[N][i] = value[i];
        }
        simplex[N].fx = value.fx;
    }

    var sortOrder = function(a, b) { return a.fx - b.fx; };

    var centroid = x0.slice(),
        reflected = x0.slice(),
        contracted = x0.slice(),
        expanded = x0.slice();

    for (var iteration = 0; iteration < maxIterations; ++iteration) {
        simplex.sort(sortOrder);

        if (parameters.history) {
            // copy the simplex (since later iterations will mutate) and
            // sort it to have a consistent order between iterations
            var sortedSimplex = simplex.map(function (x) {
                var state = x.slice();
                state.fx = x.fx;
                state.id = x.id;
                return state;
            });
            sortedSimplex.sort(function(a,b) { return a.id - b.id; });

            parameters.history.push({x: simplex[0].slice(),
                                     fx: simplex[0].fx,
                                     simplex: sortedSimplex});
        }

        maxDiff = 0;
        for (i = 0; i < N; ++i) {
            maxDiff = Math.max(maxDiff, Math.abs(simplex[0][i] - simplex[1][i]));
        }

        if ((Math.abs(simplex[0].fx - simplex[N].fx) < minErrorDelta) &&
            (maxDiff < minTolerance)) {
            break;
        }

        // compute the centroid of all but the worst point in the simplex
        for (i = 0; i < N; ++i) {
            centroid[i] = 0;
            for (var j = 0; j < N; ++j) {
                centroid[i] += simplex[j][i];
            }
            centroid[i] /= N;
        }

        // reflect the worst point past the centroid  and compute loss at reflected
        // point
        var worst = simplex[N];
        weightedSum(reflected, 1+rho, centroid, -rho, worst);
        reflected.fx = f(reflected);

        // if the reflected point is the best seen, then possibly expand
        if (reflected.fx < simplex[0].fx) {
            weightedSum(expanded, 1+chi, centroid, -chi, worst);
            expanded.fx = f(expanded);
            if (expanded.fx < reflected.fx) {
                updateSimplex(expanded);
            }  else {
                updateSimplex(reflected);
            }
        }

        // if the reflected point is worse than the second worst, we need to
        // contract
        else if (reflected.fx >= simplex[N-1].fx) {
            var shouldReduce = false;

            if (reflected.fx > worst.fx) {
                // do an inside contraction
                weightedSum(contracted, 1+psi, centroid, -psi, worst);
                contracted.fx = f(contracted);
                if (contracted.fx < worst.fx) {
                    updateSimplex(contracted);
                } else {
                    shouldReduce = true;
                }
            } else {
                // do an outside contraction
                weightedSum(contracted, 1-psi * rho, centroid, psi*rho, worst);
                contracted.fx = f(contracted);
                if (contracted.fx < reflected.fx) {
                    updateSimplex(contracted);
                } else {
                    shouldReduce = true;
                }
            }

            if (shouldReduce) {
                // if we don't contract here, we're done
                if (sigma >= 1) break;

                // do a reduction
                for (i = 1; i < simplex.length; ++i) {
                    weightedSum(simplex[i], 1 - sigma, simplex[0], sigma, simplex[i]);
                    simplex[i].fx = f(simplex[i]);
                }
            }
        } else {
            updateSimplex(reflected);
        }
    }

    simplex.sort(sortOrder);
    return {fx : simplex[0].fx,
            x : simplex[0]};
}

/// searches along line 'pk' for a point that satifies the wolfe conditions
/// See 'Numerical Optimization' by Nocedal and Wright p59-60
/// f : objective function
/// pk : search direction
/// current: object containing current gradient/loss
/// next: output: contains next gradient/loss
/// returns a: step size taken
function wolfeLineSearch(f, pk, current, next, a, c1, c2) {
    var phi0 = current.fx, phiPrime0 = dot(current.fxprime, pk),
        phi = phi0, phi_old = phi0,
        phiPrime = phiPrime0,
        a0 = 0;

    a = a || 1;
    c1 = c1 || 1e-6;
    c2 = c2 || 0.1;

    function zoom(a_lo, a_high, phi_lo) {
        for (var iteration = 0; iteration < 16; ++iteration) {
            a = (a_lo + a_high)/2;
            weightedSum(next.x, 1.0, current.x, a, pk);
            phi = next.fx = f(next.x, next.fxprime);
            phiPrime = dot(next.fxprime, pk);

            if ((phi > (phi0 + c1 * a * phiPrime0)) ||
                (phi >= phi_lo)) {
                a_high = a;

            } else  {
                if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
                    return a;
                }

                if (phiPrime * (a_high - a_lo) >=0) {
                    a_high = a_lo;
                }

                a_lo = a;
                phi_lo = phi;
            }
        }

        return 0;
    }

    for (var iteration = 0; iteration < 10; ++iteration) {
        weightedSum(next.x, 1.0, current.x, a, pk);
        phi = next.fx = f(next.x, next.fxprime);
        phiPrime = dot(next.fxprime, pk);
        if ((phi > (phi0 + c1 * a * phiPrime0)) ||
            (iteration && (phi >= phi_old))) {
            return zoom(a0, a, phi_old);
        }

        if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
            return a;
        }

        if (phiPrime >= 0 ) {
            return zoom(a, a0, phi);
        }

        phi_old = phi;
        a0 = a;
        a *= 2;
    }

    return a;
}

function conjugateGradient(f, initial, params) {
    // allocate all memory up front here, keep out of the loop for perfomance
    // reasons
    var current = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
        next = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
        yk = initial.slice(),
        pk, temp,
        a = 1,
        maxIterations;

    params = params || {};
    maxIterations = params.maxIterations || initial.length * 20;

    current.fx = f(current.x, current.fxprime);
    pk = current.fxprime.slice();
    scale(pk, current.fxprime,-1);

    for (var i = 0; i < maxIterations; ++i) {
        a = wolfeLineSearch(f, pk, current, next, a);

        // todo: history in wrong spot?
        if (params.history) {
            params.history.push({x: current.x.slice(),
                                 fx: current.fx,
                                 fxprime: current.fxprime.slice(),
                                 alpha: a});
        }

        if (!a) {
            // faiiled to find point that satifies wolfe conditions.
            // reset direction for next iteration
            scale(pk, current.fxprime, -1);

        } else {
            // update direction using Polak–Ribiere CG method
            weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

            var delta_k = dot(current.fxprime, current.fxprime),
                beta_k = Math.max(0, dot(yk, next.fxprime) / delta_k);

            weightedSum(pk, beta_k, pk, -1, next.fxprime);

            temp = current;
            current = next;
            next = temp;
        }

        if (norm2(current.fxprime) <= 1e-5) {
            break;
        }
    }

    if (params.history) {
        params.history.push({x: current.x.slice(),
                             fx: current.fx,
                             fxprime: current.fxprime.slice(),
                             alpha: a});
    }

    return current;
}

/** given a list of set objects, and their corresponding overlaps.
updates the (x, y, radius) attribute on each set such that their positions
roughly correspond to the desired overlaps */
function venn(areas, parameters) {
    parameters = parameters || {};
    parameters.maxIterations = parameters.maxIterations || 500;
    var initialLayout = parameters.initialLayout || bestInitialLayout;
    var loss = parameters.lossFunction || lossFunction;

    // add in missing pairwise areas as having 0 size
    areas = addMissingAreas(areas);

    // initial layout is done greedily
    var circles = initialLayout(areas, parameters);

    // transform x/y coordinates to a vector to optimize
    var initial = [], setids = [], setid;
    for (setid in circles) {
        if (circles.hasOwnProperty(setid)) {
            initial.push(circles[setid].x);
            initial.push(circles[setid].y);
            setids.push(setid);
        }
    }

    // optimize initial layout from our loss function
    var solution = nelderMead(
        function(values) {
            var current = {};
            for (var i = 0; i < setids.length; ++i) {
                var setid = setids[i];
                current[setid] = {x: values[2 * i],
                                  y: values[2 * i + 1],
                                  radius : circles[setid].radius,
                                 // size : circles[setid].size
                                 };
            }
            return loss(current, areas);
        },
        initial,
        parameters);

    // transform solution vector back to x/y points
    var positions = solution.x;
    for (var i = 0; i < setids.length; ++i) {
        setid = setids[i];
        circles[setid].x = positions[2 * i];
        circles[setid].y = positions[2 * i + 1];
    }

    return circles;
}

var SMALL$1 = 1e-10;

/** Returns the distance necessary for two circles of radius r1 + r2 to
have the overlap area 'overlap' */
function distanceFromIntersectArea(r1, r2, overlap) {
    // handle complete overlapped circles
    if (Math.min(r1, r2) * Math.min(r1,r2) * Math.PI <= overlap + SMALL$1) {
        return Math.abs(r1 - r2);
    }

    return bisect(function(distance$$1) {
        return circleOverlap(r1, r2, distance$$1) - overlap;
    }, 0, r1 + r2);
}

/** Missing pair-wise intersection area data can cause problems:
 treating as an unknown means that sets will be laid out overlapping,
 which isn't what people expect. To reflect that we want disjoint sets
 here, set the overlap to 0 for all missing pairwise set intersections */
function addMissingAreas(areas) {
    areas = areas.slice();

    // two circle intersections that aren't defined
    var ids = [], pairs = {}, i, j, a, b;
    for (i = 0; i < areas.length; ++i) {
        var area = areas[i];
        if (area.sets.length == 1) {
            ids.push(area.sets[0]);
        } else if (area.sets.length == 2) {
            a = area.sets[0];
            b = area.sets[1];
            pairs[[a, b]] = true;
            pairs[[b, a]] = true;
        }
    }
    ids.sort(function(a, b) { return a > b; });

    for (i = 0; i < ids.length; ++i) {
        a = ids[i];
        for (j = i + 1; j < ids.length; ++j) {
            b = ids[j];
            if (!([a, b] in pairs)) {
                areas.push({'sets': [a, b],
                            'size': 0});
            }
        }
    }
    return areas;
}

/// Returns two matrices, one of the euclidean distances between the sets
/// and the other indicating if there are subset or disjoint set relationships
function getDistanceMatrices(areas, sets, setids) {
    // initialize an empty distance matrix between all the points
    var distances = zerosM(sets.length, sets.length),
        constraints = zerosM(sets.length, sets.length);

    // compute required distances between all the sets such that
    // the areas match
    areas.filter(function(x) { return x.sets.length == 2; })
        .map(function(current) {
        var left = setids[current.sets[0]],
            right = setids[current.sets[1]],
            r1 = Math.sqrt(sets[left].size / Math.PI),
            r2 = Math.sqrt(sets[right].size / Math.PI),
            distance$$1 = distanceFromIntersectArea(r1, r2, current.size);

        distances[left][right] = distances[right][left] = distance$$1;

        // also update constraints to indicate if its a subset or disjoint
        // relationship
        var c = 0;
        if (current.size + 1e-10 >= Math.min(sets[left].size,
                                             sets[right].size)) {
            c = 1;
        } else if (current.size <= 1e-10) {
            c = -1;
        }
        constraints[left][right] = constraints[right][left] = c;
    });

    return {distances: distances, constraints: constraints};
}

/// computes the gradient and loss simulatenously for our constrained MDS optimizer
function constrainedMDSGradient(x, fxprime, distances, constraints) {
    var loss = 0, i;
    for (i = 0; i < fxprime.length; ++i) {
        fxprime[i] = 0;
    }

    for (i = 0; i < distances.length; ++i) {
        var xi = x[2 * i], yi = x[2 * i + 1];
        for (var j = i + 1; j < distances.length; ++j) {
            var xj = x[2 * j], yj = x[2 * j + 1],
                dij = distances[i][j],
                constraint = constraints[i][j];

            var squaredDistance = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi),
                distance$$1 = Math.sqrt(squaredDistance),
                delta = squaredDistance - dij * dij;

            if (((constraint > 0) && (distance$$1 <= dij)) ||
                ((constraint < 0) && (distance$$1 >= dij))) {
                continue;
            }

            loss += 2 * delta * delta;

            fxprime[2*i]     += 4 * delta * (xi - xj);
            fxprime[2*i + 1] += 4 * delta * (yi - yj);

            fxprime[2*j]     += 4 * delta * (xj - xi);
            fxprime[2*j + 1] += 4 * delta * (yj - yi);
        }
    }
    return loss;
}

/// takes the best working variant of either constrained MDS or greedy
function bestInitialLayout(areas, params) {
    var initial = greedyLayout(areas, params);
    var loss = params.lossFunction || lossFunction;

    // greedylayout is sufficient for all 2/3 circle cases. try out
    // constrained MDS for higher order problems, take its output
    // if it outperforms. (greedy is aesthetically better on 2/3 circles
    // since it axis aligns)
    if (areas.length >= 8) {
        var constrained  = constrainedMDSLayout(areas, params),
            constrainedLoss = loss(constrained, areas),
            greedyLoss = loss(initial, areas);

        if (constrainedLoss + 1e-8 < greedyLoss) {
            initial = constrained;
        }
    }
    return initial;
}

/// use the constrained MDS variant to generate an initial layout
function constrainedMDSLayout(areas, params) {
    params = params || {};
    var restarts = params.restarts || 10;

    // bidirectionally map sets to a rowid  (so we can create a matrix)
    var sets = [], setids = {}, i;
    for (i = 0; i < areas.length; ++i ) {
        var area = areas[i];
        if (area.sets.length == 1) {
            setids[area.sets[0]] = sets.length;
            sets.push(area);
        }
    }

    var matrices = getDistanceMatrices(areas, sets, setids),
        distances = matrices.distances,
        constraints = matrices.constraints;

    // keep distances bounded, things get messed up otherwise.
    // TODO: proper preconditioner?
    var norm = norm2(distances.map(norm2))/(distances.length);
    distances = distances.map(function (row) {
        return row.map(function (value) { return value / norm; });});

    var obj = function(x, fxprime) {
        return constrainedMDSGradient(x, fxprime, distances, constraints);
    };

    var best, current;
    for (i = 0; i < restarts; ++i) {
        var initial = zeros(distances.length*2).map(Math.random);

        current = conjugateGradient(obj, initial, params);
        if (!best || (current.fx < best.fx)) {
            best = current;
        }
    }
    var positions = best.x;

    // translate rows back to (x,y,radius) coordinates
    var circles = {};
    for (i = 0; i < sets.length; ++i) {
        var set = sets[i];
        circles[set.sets[0]] = {
            x: positions[2*i] * norm,
            y: positions[2*i + 1] * norm,
            radius:  Math.sqrt(set.size / Math.PI)
        };
    }

    if (params.history) {
        for (i = 0; i < params.history.length; ++i) {
            scale(params.history[i].x, norm);
        }
    }
    return circles;
}

/** Lays out a Venn diagram greedily, going from most overlapped sets to
least overlapped, attempting to position each new set such that the
overlapping areas to already positioned sets are basically right */
function greedyLayout(areas, params) {
    var loss = params && params.lossFunction ? params.lossFunction : lossFunction;
    // define a circle for each set
    var circles = {}, setOverlaps = {}, set;
    for (var i = 0; i < areas.length; ++i) {
        var area = areas[i];
        if (area.sets.length == 1) {
            set = area.sets[0];
            circles[set] = {x: 1e10, y: 1e10,
                            rowid: circles.length,
                            size: area.size,
                            radius: Math.sqrt(area.size / Math.PI)};
            setOverlaps[set] = [];
        }
    }
    areas = areas.filter(function(a) { return a.sets.length == 2; });

    // map each set to a list of all the other sets that overlap it
    for (i = 0; i < areas.length; ++i) {
        var current = areas[i];
        var weight = current.hasOwnProperty('weight') ? current.weight : 1.0;
        var left = current.sets[0], right = current.sets[1];

        // completely overlapped circles shouldn't be positioned early here
        if (current.size + SMALL$1 >= Math.min(circles[left].size,
                                             circles[right].size)) {
            weight = 0;
        }

        setOverlaps[left].push ({set:right, size:current.size, weight:weight});
        setOverlaps[right].push({set:left,  size:current.size, weight:weight});
    }

    // get list of most overlapped sets
    var mostOverlapped = [];
    for (set in setOverlaps) {
        if (setOverlaps.hasOwnProperty(set)) {
            var size = 0;
            for (i = 0; i < setOverlaps[set].length; ++i) {
                size += setOverlaps[set][i].size * setOverlaps[set][i].weight;
            }

            mostOverlapped.push({set: set, size:size});
        }
    }

    // sort by size desc
    function sortOrder(a,b) {
        return b.size - a.size;
    }
    mostOverlapped.sort(sortOrder);

    // keep track of what sets have been laid out
    var positioned = {};
    function isPositioned(element) {
        return element.set in positioned;
    }

    // adds a point to the output
    function positionSet(point, index) {
        circles[index].x = point.x;
        circles[index].y = point.y;
        positioned[index] = true;
    }

    // add most overlapped set at (0,0)
    positionSet({x: 0, y: 0}, mostOverlapped[0].set);

    // get distances between all points. TODO, necessary?
    // answer: probably not
    // var distances = venn.getDistanceMatrices(circles, areas).distances;
    for (i = 1; i < mostOverlapped.length; ++i) {
        var setIndex = mostOverlapped[i].set,
            overlap = setOverlaps[setIndex].filter(isPositioned);
        set = circles[setIndex];
        overlap.sort(sortOrder);

        if (overlap.length === 0) {
            // this shouldn't happen anymore with addMissingAreas
            throw "ERROR: missing pairwise overlap information";
        }

        var points = [];
        for (var j = 0; j < overlap.length; ++j) {
            // get appropriate distance from most overlapped already added set
            var p1 = circles[overlap[j].set],
                d1 = distanceFromIntersectArea(set.radius, p1.radius,
                                               overlap[j].size);

            // sample positions at 90 degrees for maximum aesthetics
            points.push({x : p1.x + d1, y : p1.y});
            points.push({x : p1.x - d1, y : p1.y});
            points.push({y : p1.y + d1, x : p1.x});
            points.push({y : p1.y - d1, x : p1.x});

            // if we have at least 2 overlaps, then figure out where the
            // set should be positioned analytically and try those too
            for (var k = j + 1; k < overlap.length; ++k) {
                var p2 = circles[overlap[k].set],
                    d2 = distanceFromIntersectArea(set.radius, p2.radius,
                                                   overlap[k].size);

                var extraPoints = circleCircleIntersection(
                    { x: p1.x, y: p1.y, radius: d1},
                    { x: p2.x, y: p2.y, radius: d2});

                for (var l = 0; l < extraPoints.length; ++l) {
                    points.push(extraPoints[l]);
                }
            }
        }

        // we have some candidate positions for the set, examine loss
        // at each position to figure out where to put it at
        var bestLoss = 1e50, bestPoint = points[0];
        for (j = 0; j < points.length; ++j) {
            circles[setIndex].x = points[j].x;
            circles[setIndex].y = points[j].y;
            var localLoss = loss(circles, areas);
            if (localLoss < bestLoss) {
                bestLoss = localLoss;
                bestPoint = points[j];
            }
        }

        positionSet(bestPoint, setIndex);
    }

    return circles;
}

/** Given a bunch of sets, and the desired overlaps between these sets - computes
the distance from the actual overlaps to the desired overlaps. Note that
this method ignores overlaps of more than 2 circles */
function lossFunction(sets, overlaps) {
    var output = 0;

    function getCircles(indices) {
        return indices.map(function(i) { return sets[i]; });
    }

    for (var i = 0; i < overlaps.length; ++i) {
        var area = overlaps[i], overlap;
        if (area.sets.length == 1) {
            continue;
        } else if (area.sets.length == 2) {
            var left = sets[area.sets[0]],
                right = sets[area.sets[1]];
            overlap = circleOverlap(left.radius, right.radius,
                                    distance(left, right));
        } else {
            overlap = intersectionArea(getCircles(area.sets));
        }

        var weight = area.hasOwnProperty('weight') ? area.weight : 1.0;
        output += weight * (overlap - area.size) * (overlap - area.size);
    }

    return output;
}

// orientates a bunch of circles to point in orientation
function orientateCircles(circles, orientation, orientationOrder) {
    if (orientationOrder === null) {
        circles.sort(function (a, b) { return b.radius - a.radius; });
    } else {
        circles.sort(orientationOrder);
    }

    var i;
    // shift circles so largest circle is at (0, 0)
    if (circles.length > 0) {
        var largestX = circles[0].x,
            largestY = circles[0].y;

        for (i = 0; i < circles.length; ++i) {
            circles[i].x -= largestX;
            circles[i].y -= largestY;
        }
    }

    if (circles.length == 2) {
        // if the second circle is a subset of the first, arrange so that
        // it is off to one side. hack for https://github.com/benfred/venn.js/issues/120
        var dist = distance(circles[0], circles[1]);
        if (dist < Math.abs(circles[1].radius - circles[0].radius)) {
            circles[1].x = circles[0].x + circles[0].radius - circles[1].radius - 1e-10;
            circles[1].y = circles[0].y;
        }
    }

    // rotate circles so that second largest is at an angle of 'orientation'
    // from largest
    if (circles.length > 1) {
        var rotation = Math.atan2(circles[1].x, circles[1].y) - orientation,
            c = Math.cos(rotation),
            s = Math.sin(rotation), x, y;

        for (i = 0; i < circles.length; ++i) {
            x = circles[i].x;
            y = circles[i].y;
            circles[i].x = c * x - s * y;
            circles[i].y = s * x + c * y;
        }
    }

    // mirror solution if third solution is above plane specified by
    // first two circles
    if (circles.length > 2) {
        var angle = Math.atan2(circles[2].x, circles[2].y) - orientation;
        while (angle < 0) { angle += 2* Math.PI; }
        while (angle > 2*Math.PI) { angle -= 2* Math.PI; }
        if (angle > Math.PI) {
            var slope = circles[1].y / (1e-10 + circles[1].x);
            for (i = 0; i < circles.length; ++i) {
                var d = (circles[i].x + slope * circles[i].y) / (1 + slope*slope);
                circles[i].x = 2 * d - circles[i].x;
                circles[i].y = 2 * d * slope - circles[i].y;
            }
        }
    }
}

function disjointCluster(circles) {
    // union-find clustering to get disjoint sets
    circles.map(function(circle) { circle.parent = circle; });

    // path compression step in union find
    function find(circle) {
        if (circle.parent !== circle) {
            circle.parent = find(circle.parent);
        }
        return circle.parent;
    }

    function union(x, y) {
        var xRoot = find(x), yRoot = find(y);
        xRoot.parent = yRoot;
    }

    // get the union of all overlapping sets
    for (var i = 0; i < circles.length; ++i) {
        for (var j = i + 1; j < circles.length; ++j) {
            var maxDistance = circles[i].radius + circles[j].radius;
            if (distance(circles[i], circles[j]) + 1e-10 < maxDistance) {
                union(circles[j], circles[i]);
            }
        }
    }

    // find all the disjoint clusters and group them together
    var disjointClusters = {}, setid;
    for (i = 0; i < circles.length; ++i) {
        setid = find(circles[i]).parent.setid;
        if (!(setid in disjointClusters)) {
            disjointClusters[setid] = [];
        }
        disjointClusters[setid].push(circles[i]);
    }

    // cleanup bookkeeping
    circles.map(function(circle) { delete circle.parent; });

    // return in more usable form
    var ret = [];
    for (setid in disjointClusters) {
        if (disjointClusters.hasOwnProperty(setid)) {
            ret.push(disjointClusters[setid]);
        }
    }
    return ret;
}

function getBoundingBox(circles) {
    var minMax = function(d) {
        var hi = Math.max.apply(null, circles.map(
                                function(c) { return c[d] + c.radius; } )),
            lo = Math.min.apply(null, circles.map(
                                function(c) { return c[d] - c.radius;} ));
        return {max:hi, min:lo};
    };

    return {xRange: minMax('x'), yRange: minMax('y')};
}

function normalizeSolution(solution, orientation, orientationOrder) {
    if (orientation === null){
        orientation = Math.PI/2;
    }

    // work with a list instead of a dictionary, and take a copy so we
    // don't mutate input
    var circles = [], i, setid;
    for (setid in solution) {
        if (solution.hasOwnProperty(setid)) {
            var previous = solution[setid];
            circles.push({x: previous.x,
                          y: previous.y,
                          radius: previous.radius,
                          setid: setid});
        }
    }

    // get all the disjoint clusters
    var clusters = disjointCluster(circles);

    // orientate all disjoint sets, get sizes
    for (i = 0; i < clusters.length; ++i) {
        orientateCircles(clusters[i], orientation, orientationOrder);
        var bounds = getBoundingBox(clusters[i]);
        clusters[i].size = (bounds.xRange.max - bounds.xRange.min) * (bounds.yRange.max - bounds.yRange.min);
        clusters[i].bounds = bounds;
    }
    clusters.sort(function(a, b) { return b.size - a.size; });

    // orientate the largest at 0,0, and get the bounds
    circles = clusters[0];
    var returnBounds = circles.bounds;

    var spacing = (returnBounds.xRange.max - returnBounds.xRange.min)/50;

    function addCluster(cluster, right, bottom) {
        if (!cluster) return;

        var bounds = cluster.bounds, xOffset, yOffset, centreing;

        if (right) {
            xOffset = returnBounds.xRange.max  - bounds.xRange.min + spacing;
        } else {
            xOffset = returnBounds.xRange.max  - bounds.xRange.max;
            centreing = (bounds.xRange.max - bounds.xRange.min) / 2 -
                        (returnBounds.xRange.max - returnBounds.xRange.min) / 2;
            if (centreing < 0) xOffset += centreing;
        }

        if (bottom) {
            yOffset = returnBounds.yRange.max  - bounds.yRange.min + spacing;
        } else {
            yOffset = returnBounds.yRange.max  - bounds.yRange.max;
            centreing = (bounds.yRange.max - bounds.yRange.min) / 2 -
                        (returnBounds.yRange.max - returnBounds.yRange.min) / 2;
            if (centreing < 0) yOffset += centreing;
        }

        for (var j = 0; j < cluster.length; ++j) {
            cluster[j].x += xOffset;
            cluster[j].y += yOffset;
            circles.push(cluster[j]);
        }
    }

    var index = 1;
    while (index < clusters.length) {
        addCluster(clusters[index], true, false);
        addCluster(clusters[index+1], false, true);
        addCluster(clusters[index+2], true, true);
        index += 3;

        // have one cluster (in top left). lay out next three relative
        // to it in a grid
        returnBounds = getBoundingBox(circles);
    }

    // convert back to solution form
    var ret = {};
    for (i = 0; i < circles.length; ++i) {
        ret[circles[i].setid] = circles[i];
    }
    return ret;
}

/** Scales a solution from venn.venn or venn.greedyLayout such that it fits in
a rectangle of width/height - with padding around the borders. also
centers the diagram in the available space at the same time */
function scaleSolution(solution, width, height, padding) {
    var circles = [], setids = [];
    for (var setid in solution) {
        if (solution.hasOwnProperty(setid)) {
            setids.push(setid);
            circles.push(solution[setid]);
        }
    }

    width -= 2*padding;
    height -= 2*padding;

    var bounds = getBoundingBox(circles),
        xRange = bounds.xRange,
        yRange = bounds.yRange;

    if ((xRange.max == xRange.min) ||
        (yRange.max == yRange.min)) {
        console.log("not scaling solution: zero size detected");
        return solution;
    }

    var xScaling = width  / (xRange.max - xRange.min),
        yScaling = height / (yRange.max - yRange.min),
        scaling = Math.min(yScaling, xScaling),

        // while we're at it, center the diagram too
        xOffset = (width -  (xRange.max - xRange.min) * scaling) / 2,
        yOffset = (height - (yRange.max - yRange.min) * scaling) / 2;

    var scaled = {};
    for (var i = 0; i < circles.length; ++i) {
        var circle = circles[i];
        scaled[setids[i]] = {
            radius: scaling * circle.radius,
            x: padding + xOffset + (circle.x - xRange.min) * scaling,
            y: padding + yOffset + (circle.y - yRange.min) * scaling,
        };
    }

    return scaled;
}

/*global console:true*/

function VennDiagram() {
    var width = 600,
        height = 350,
        padding = 15,
        duration = 1000,
        orientation = Math.PI / 2,
        normalize = true,
        wrap = true,
        styled = true,
        fontSize = null,
        orientationOrder = null,

        // mimic the behaviour of d3.scale.category10 from the previous
        // version of d3
        colourMap = {},

        // so this is the same as d3.schemeCategory10, which is only defined in d3 4.0
        // since we can support older versions of d3 as long as we don't force this,
        // I'm hackily redefining below. TODO: remove this and change to d3.schemeCategory10
        colourScheme = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        colourIndex = 0,
        colours = function(key) {
            if (key in colourMap) {
                return colourMap[key];
            }
            var ret = colourMap[key] = colourScheme[colourIndex];
            colourIndex += 1;
            if (colourIndex >= colourScheme.length) {
                colourIndex = 0;
            }
            return ret;
        },
        layoutFunction = venn,
        loss = lossFunction;


    function chart(selection) {
        var data = selection.datum();

        // handle 0-sized sets by removing from input
        var toremove = {};
        data.forEach(function(datum) {
            if ((datum.size == 0) && datum.sets.length == 1) {
                toremove[datum.sets[0]] = 1;
            }
        });
        data = data.filter(function(datum) {
            return !datum.sets.some(function(set) { return set in toremove; });
        });

        var circles = {};
        var textCentres = {};

        if (data.length > 0) {
            var solution = layoutFunction(data, {lossFunction: loss});

            if (normalize) {
                solution = normalizeSolution(solution,
                                            orientation,
                                            orientationOrder);
            }

            circles = scaleSolution(solution, width, height, padding);
            textCentres = computeTextCentres(circles, data);
        }

        // Figure out the current label for each set. These can change
        // and D3 won't necessarily update (fixes https://github.com/benfred/venn.js/issues/103)
        var labels = {};
        data.forEach(function(datum) {
            if (datum.label) {
                labels[datum.sets] = datum.label;
            }
        });

        function label(d) {
            if (d.sets in labels) {
                return labels[d.sets];
            }
            if (d.sets.length == 1) {
                return '' + d.sets[0];
            }
        }

        // create svg if not already existing
        selection.selectAll("svg").data([circles]).enter().append("svg");

        var svg = selection.select("svg")
            .attr("width", width)
            .attr("height", height);

        // to properly transition intersection areas, we need the
        // previous circles locations. load from elements
        var previous = {}, hasPrevious = false;
        svg.selectAll(".venn-area path").each(function (d) {
            var path = d3Selection.select(this).attr("d");
            if ((d.sets.length == 1) && path) {
                hasPrevious = true;
                previous[d.sets[0]] = circleFromPath(path);
            }
        });

        // interpolate intersection area paths between previous and
        // current paths
        var pathTween = function(d) {
            return function(t) {
                var c = d.sets.map(function(set) {
                    var start = previous[set], end = circles[set];
                    if (!start) {
                        start = {x : width/2, y : height/2, radius : 1};
                    }
                    if (!end) {
                        end = {x : width/2, y : height/2, radius : 1};
                    }
                    return {'x' : start.x * (1 - t) + end.x * t,
                            'y' : start.y * (1 - t) + end.y * t,
                            'radius' : start.radius * (1 - t) + end.radius * t};
                });
                return intersectionAreaPath(c);
            };
        };

        // update data, joining on the set ids
        var nodes = svg.selectAll(".venn-area")
            .data(data, function(d) { return d.sets; });

        // create new nodes
        var enter = nodes.enter()
            .append('g')
            .attr("class", function(d) {
                return "venn-area venn-" +
                    (d.sets.length == 1 ? "circle" : "intersection");
            })
            .attr("data-venn-sets", function(d) {
                return d.sets.join("_");
            });

        var enterPath = enter.append("path"),
            enterText = enter.append("text")
            .attr("class", "label")
            .text(function (d) { return label(d); } )
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("x", width/2)
            .attr("y", height/2);


        // apply minimal style if wanted
        if (styled) {
            enterPath.style("fill-opacity", "0")
                .filter(function (d) { return d.sets.length == 1; } )
                .style("fill", function(d) { return colours(d.sets); })
                .style("fill-opacity", ".25");

            enterText
                .style("fill", function(d) { return d.sets.length == 1 ? colours(d.sets) : "#444"; });
        }

        // update existing, using pathTween if necessary
        var update = selection;
        if (hasPrevious) {
            update = selection.transition("venn").duration(duration);
            update.selectAll("path")
                .attrTween("d", pathTween);
        } else {
            update.selectAll("path")
                .attr("d", function(d) {
                    return intersectionAreaPath(d.sets.map(function (set) { return circles[set]; }));
                });
        }

        var updateText = update.selectAll("text")
            .filter(function (d) { return d.sets in textCentres; })
            .text(function (d) { return label(d); } )
            .attr("x", function(d) { return Math.floor(textCentres[d.sets].x);})
            .attr("y", function(d) { return Math.floor(textCentres[d.sets].y);});

        if (wrap) {
            if (hasPrevious) {
                // d3 4.0 uses 'on' for events on transitions,
                // but d3 3.0 used 'each' instead. switch appropiately
                if ('on' in updateText) {
                    updateText.on("end", wrapText(circles, label));
                } else {
                    updateText.each("end", wrapText(circles, label));
                }
            } else {
                updateText.each(wrapText(circles, label));
            }
        }

        // remove old
        var exit = nodes.exit().transition('venn').duration(duration).remove();
        exit.selectAll("path")
            .attrTween("d", pathTween);

        var exitText = exit.selectAll("text")
            .attr("x", width/2)
            .attr("y", height/2);

        // if we've been passed a fontSize explicitly, use it to
        // transition
        if (fontSize !== null) {
            enterText.style("font-size", "0px");
            updateText.style("font-size", fontSize);
            exitText.style("font-size", "0px");
        }


        return {'circles': circles,
                'textCentres': textCentres,
                'nodes': nodes,
                'enter': enter,
                'update': update,
                'exit': exit};
    }

    chart.wrap = function(_) {
        if (!arguments.length) return wrap;
        wrap = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.padding = function(_) {
        if (!arguments.length) return padding;
        padding = _;
        return chart;
    };

    chart.colours = function(_) {
        if (!arguments.length) return colours;
        colours = _;
        return chart;
    };

    chart.fontSize = function(_) {
        if (!arguments.length) return fontSize;
        fontSize = _;
        return chart;
    };

    chart.duration = function(_) {
        if (!arguments.length) return duration;
        duration = _;
        return chart;
    };

    chart.layoutFunction = function(_) {
        if (!arguments.length) return layoutFunction;
        layoutFunction = _;
        return chart;
    };

    chart.normalize = function(_) {
        if (!arguments.length) return normalize;
        normalize = _;
        return chart;
    };

    chart.styled = function(_) {
        if (!arguments.length) return styled;
        styled = _;
        return chart;
    };

    chart.orientation = function(_) {
        if (!arguments.length) return orientation;
        orientation = _;
        return chart;
    };

    chart.orientationOrder = function(_) {
        if (!arguments.length) return orientationOrder;
        orientationOrder = _;
        return chart;
    };

    chart.lossFunction = function(_) {
      if (!arguments.length) return loss;
      loss = _;
      return chart;
    };

    return chart;
}
// sometimes text doesn't fit inside the circle, if thats the case lets wrap
// the text here such that it fits
// todo: looks like this might be merged into d3 (
// https://github.com/mbostock/d3/issues/1642),
// also worth checking out is
// http://engineering.findthebest.com/wrapping-axis-labels-in-d3-js/
// this seems to be one of those things that should be easy but isn't
function wrapText(circles, labeller) {
    return function() {
        var text = d3Selection.select(this),
            data = text.datum(),
            width = circles[data.sets[0]].radius || 50,
            label = labeller(data) || '';

            var words = label.split(/\s+/).reverse(),
            maxLines = 3,
            minChars = (label.length + words.length) / maxLines,
            word = words.pop(),
            line = [word],
            joined,
            lineNumber = 0,
            lineHeight = 1.1, // ems
            tspan = text.text(null).append("tspan").text(word);

        while (true) {
            word = words.pop();
            if (!word) break;
            line.push(word);
            joined = line.join(" ");
            tspan.text(joined);
            if (joined.length > minChars && tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").text(word);
                lineNumber++;
            }
        }

        var initial = 0.35 - lineNumber * lineHeight / 2,
            x = text.attr("x"),
            y = text.attr("y");

        text.selectAll("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", function(d, i) {
                 return (initial + i * lineHeight) + "em";
            });
    };
}

function circleMargin(current, interior, exterior) {
    var margin = interior[0].radius - distance(interior[0], current), i, m;
    for (i = 1; i < interior.length; ++i) {
        m = interior[i].radius - distance(interior[i], current);
        if (m <= margin) {
            margin = m;
        }
    }

    for (i = 0; i < exterior.length; ++i) {
        m = distance(exterior[i], current) - exterior[i].radius;
        if (m <= margin) {
            margin = m;
        }
    }
    return margin;
}

// compute the center of some circles by maximizing the margin of
// the center point relative to the circles (interior) after subtracting
// nearby circles (exterior)
function computeTextCentre(interior, exterior) {
    // get an initial estimate by sampling around the interior circles
    // and taking the point with the biggest margin
    var points = [], i;
    for (i = 0; i < interior.length; ++i) {
        var c = interior[i];
        points.push({x: c.x, y: c.y});
        points.push({x: c.x + c.radius/2, y: c.y});
        points.push({x: c.x - c.radius/2, y: c.y});
        points.push({x: c.x, y: c.y + c.radius/2});
        points.push({x: c.x, y: c.y - c.radius/2});
    }
    var initial = points[0], margin = circleMargin(points[0], interior, exterior);
    for (i = 1; i < points.length; ++i) {
        var m = circleMargin(points[i], interior, exterior);
        if (m >= margin) {
            initial = points[i];
            margin = m;
        }
    }

    // maximize the margin numerically
    var solution = nelderMead(
                function(p) { return -1 * circleMargin({x: p[0], y: p[1]}, interior, exterior); },
                [initial.x, initial.y],
                {maxIterations:500, minErrorDelta:1e-10}).x;
    var ret = {x: solution[0], y: solution[1]};

    // check solution, fallback as needed (happens if fully overlapped
    // etc)
    var valid = true;
    for (i = 0; i < interior.length; ++i) {
        if (distance(ret, interior[i]) > interior[i].radius) {
            valid = false;
            break;
        }
    }

    for (i = 0; i < exterior.length; ++i) {
        if (distance(ret, exterior[i]) < exterior[i].radius) {
            valid = false;
            break;
        }
    }

    if (!valid) {
        if (interior.length == 1) {
            ret = {x: interior[0].x, y: interior[0].y};
        } else {
            var areaStats = {};
            intersectionArea(interior, areaStats);

            if (areaStats.arcs.length === 0) {
                ret = {'x': 0, 'y': -1000, disjoint:true};

            } else if (areaStats.arcs.length == 1) {
                ret = {'x': areaStats.arcs[0].circle.x,
                       'y': areaStats.arcs[0].circle.y};

            } else if (exterior.length) {
                // try again without other circles
                ret = computeTextCentre(interior, []);

            } else {
                // take average of all the points in the intersection
                // polygon. this should basically never happen
                // and has some issues:
                // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
                ret = getCenter(areaStats.arcs.map(function (a) { return a.p1; }));
            }
        }
    }

    return ret;
}

// given a dictionary of {setid : circle}, returns
// a dictionary of setid to list of circles that completely overlap it
function getOverlappingCircles(circles) {
    var ret = {}, circleids = [];
    for (var circleid in circles) {
        circleids.push(circleid);
        ret[circleid] = [];
    }
    for (var i  = 0; i < circleids.length; i++) {
        var a = circles[circleids[i]];
        for (var j = i + 1; j < circleids.length; ++j) {
            var b = circles[circleids[j]],
                d = distance(a, b);

            if (d + b.radius <= a.radius + 1e-10) {
                ret[circleids[j]].push(circleids[i]);

            } else if (d + a.radius <= b.radius + 1e-10) {
                ret[circleids[i]].push(circleids[j]);
            }
        }
    }
    return ret;
}

function computeTextCentres(circles, areas) {
    var ret = {}, overlapped = getOverlappingCircles(circles);
    for (var i = 0; i < areas.length; ++i) {
        var area = areas[i].sets, areaids = {}, exclude = {};
        for (var j = 0; j < area.length; ++j) {
            areaids[area[j]] = true;
            var overlaps = overlapped[area[j]];
            // keep track of any circles that overlap this area,
            // and don't consider for purposes of computing the text
            // centre
            for (var k = 0; k < overlaps.length; ++k) {
                exclude[overlaps[k]] = true;
            }
        }

        var interior = [], exterior = [];
        for (var setid in circles) {
            if (setid in areaids) {
                interior.push(circles[setid]);
            } else if (!(setid in exclude)) {
                exterior.push(circles[setid]);
            }
        }
        var centre = computeTextCentre(interior, exterior);
        ret[area] = centre;
        if (centre.disjoint && (areas[i].size > 0)) {
            console.log("WARNING: area " + area + " not represented on screen");
        }
    }
    return  ret;
}

// sorts all areas in the venn diagram, so that
// a particular area is on top (relativeTo) - and
// all other areas are so that the smallest areas are on top
function sortAreas(div, relativeTo) {

    // figure out sets that are completly overlapped by relativeTo
    var overlaps = getOverlappingCircles(div.selectAll("svg").datum());
    var exclude = {};
    for (var i = 0; i < relativeTo.sets.length; ++i) {
        var check = relativeTo.sets[i];
        for (var setid in overlaps) {
            var overlap = overlaps[setid];
            for (var j = 0; j < overlap.length; ++j) {
                if (overlap[j] == check) {
                    exclude[setid] = true;
                    break;
                }
            }
        }
    }

    // checks that all sets are in exclude;
    function shouldExclude(sets) {
        for (var i = 0; i < sets.length; ++i) {
            if (!(sets[i] in exclude)) {
                return false;
            }
        }
        return true;
    }

    // need to sort div's so that Z order is correct
    div.selectAll("g").sort(function (a, b) {
        // highest order set intersections first
        if (a.sets.length != b.sets.length) {
            return a.sets.length - b.sets.length;
        }

        if (a == relativeTo) {
            return shouldExclude(b.sets) ? -1 : 1;
        }
        if (b == relativeTo) {
            return shouldExclude(a.sets) ? 1 : -1;
        }

        // finally by size
        return b.size - a.size;
    });
}

function circlePath(x, y, r) {
    var ret = [];
    ret.push("\nM", x, y);
    ret.push("\nm", -r, 0);
    ret.push("\na", r, r, 0, 1, 0, r *2, 0);
    ret.push("\na", r, r, 0, 1, 0,-r *2, 0);
    return ret.join(" ");
}

// inverse of the circlePath function, returns a circle object from an svg path
function circleFromPath(path) {
    var tokens = path.split(' ');
    return {'x' : parseFloat(tokens[1]),
            'y' : parseFloat(tokens[2]),
            'radius' : -parseFloat(tokens[4])
            };
}

/** returns a svg path of the intersection area of a bunch of circles */
function intersectionAreaPath(circles) {
    var stats = {};
    intersectionArea(circles, stats);
    var arcs = stats.arcs;

    if (arcs.length === 0) {
        return "M 0 0";

    } else if (arcs.length == 1) {
        var circle = arcs[0].circle;
        return circlePath(circle.x, circle.y, circle.radius);

    } else {
        // draw path around arcs
        var ret = ["\nM", arcs[0].p2.x, arcs[0].p2.y];
        for (var i = 0; i < arcs.length; ++i) {
            var arc = arcs[i], r = arc.circle.radius, wide = arc.width > r;
            ret.push("\nA", r, r, 0, wide ? 1 : 0, 1,
                     arc.p1.x, arc.p1.y);
        }
        return ret.join(" ");
    }
}

exports.intersectionArea = intersectionArea;
exports.circleCircleIntersection = circleCircleIntersection;
exports.circleOverlap = circleOverlap;
exports.circleArea = circleArea;
exports.distance = distance;
exports.venn = venn;
exports.greedyLayout = greedyLayout;
exports.scaleSolution = scaleSolution;
exports.normalizeSolution = normalizeSolution;
exports.bestInitialLayout = bestInitialLayout;
exports.lossFunction = lossFunction;
exports.disjointCluster = disjointCluster;
exports.distanceFromIntersectArea = distanceFromIntersectArea;
exports.VennDiagram = VennDiagram;
exports.wrapText = wrapText;
exports.computeTextCentres = computeTextCentres;
exports.computeTextCentre = computeTextCentre;
exports.sortAreas = sortAreas;
exports.circlePath = circlePath;
exports.circleFromPath = circleFromPath;
exports.intersectionAreaPath = intersectionAreaPath;

Object.defineProperty(exports, '__esModule', { value: true });

})));
}(venn$1, venn$1.exports));

var venn = /*@__PURE__*/getDefaultExportFromCjs(venn$1.exports);

var colorString$1 = {exports: {}};

var colorName = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

var simpleSwizzle = {exports: {}};

var isArrayish$1 = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};

var isArrayish = isArrayish$1;

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle$1 = simpleSwizzle.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle$1.wrap = function (fn) {
	return function () {
		return fn(swizzle$1(arguments));
	};
};

/* MIT license */

var colorNames = colorName;
var swizzle = simpleSwizzle.exports;

var reverseNames = {};

// create a list of reverse color names
for (var name in colorNames) {
	if (colorNames.hasOwnProperty(name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = colorString$1.exports = {
	to: {},
	get: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var keyword = /(\D+)/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha, 16) / 255;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = parseFloat(match[4]);
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		rgb = colorNames[match[1]];

		if (!rgb) {
			return null;
		}

		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = (parseFloat(match[1]) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = num.toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}

/* MIT license */

/* eslint-disable no-mixed-operators */
const cssKeywords = colorName;

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert$2 = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

var conversions$2 = convert$2;

// Hide .channels and .labels properties
for (const model of Object.keys(convert$2)) {
	if (!('channels' in convert$2[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert$2[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert$2[model].labels.length !== convert$2[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert$2[model];
	delete convert$2[model].channels;
	delete convert$2[model].labels;
	Object.defineProperty(convert$2[model], 'channels', {value: channels});
	Object.defineProperty(convert$2[model], 'labels', {value: labels});
}

convert$2.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert$2.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert$2.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert$2.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert$2.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert$2.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert$2.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert$2.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert$2.rgb.lab = function (rgb) {
	const xyz = convert$2.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert$2.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert$2.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert$2.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert$2.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert$2.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert$2.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert$2.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert$2.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert$2.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert$2.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert$2.rgb.ansi16(convert$2.hsv.rgb(args), args[2]);
};

convert$2.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert$2.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert$2.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert$2.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert$2.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert$2.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert$2.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert$2.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert$2.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert$2.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert$2.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert$2.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert$2.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert$2.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert$2.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert$2.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert$2.gray.hsv = convert$2.gray.hsl;

convert$2.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert$2.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert$2.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert$2.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};

const conversions$1 = conversions$2;

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions$1);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions$1[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions$1[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions$1[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

var route$1 = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};

const conversions = conversions$2;
const route = route$1;

const convert$1 = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert$1[fromModel] = {};

	Object.defineProperty(convert$1[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert$1[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert$1[fromModel][toModel] = wrapRounded(fn);
		convert$1[fromModel][toModel].raw = wrapRaw(fn);
	});
});

var colorConvert = convert$1;

const colorString = colorString$1.exports;
const convert = colorConvert;

const _slice = [].slice;

const skippedModels = [
	// To be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// Gray conflicts with some method names, and has its own method defined.
	'gray',

	// Shouldn't really be in color-convert either...
	'hex',
];

const hashedModelKeys = {};
for (const model of Object.keys(convert)) {
	hashedModelKeys[_slice.call(convert[model].labels).sort().join('')] = model;
}

const limiters = {};

function Color(object, model) {
	if (!(this instanceof Color)) {
		return new Color(object, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	let i;
	let channels;

	if (object == null) { // eslint-disable-line no-eq-null,eqeqeq
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (object instanceof Color) {
		this.model = object.model;
		this.color = object.color.slice();
		this.valpha = object.valpha;
	} else if (typeof object === 'string') {
		const result = colorString.get(object);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + object);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (object.length > 0) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		const newArray = _slice.call(object, 0, channels);
		this.color = zeroArray(newArray, channels);
		this.valpha = typeof object[channels] === 'number' ? object[channels] : 1;
	} else if (typeof object === 'number') {
		// This is always RGB - can be converted later on.
		this.model = 'rgb';
		this.color = [
			(object >> 16) & 0xFF,
			(object >> 8) & 0xFF,
			object & 0xFF,
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		const keys = Object.keys(object);
		if ('alpha' in object) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof object.alpha === 'number' ? object.alpha : 0;
		}

		const hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(object));
		}

		this.model = hashedModelKeys[hashedKeys];

		const labels = convert[this.model].labels;
		const color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(object[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// Perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			const limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString() {
		return this.string();
	},

	toJSON() {
		return this[this.model]();
	},

	string(places) {
		let self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to[self.model](args);
	},

	percentString(places) {
		const self = this.rgb().round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
		return colorString.to.rgb.percent(args);
	},

	array() {
		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
	},

	object() {
		const result = {};
		const channels = convert[this.model].channels;
		const labels = convert[this.model].labels;

		for (let i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray() {
		const rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject() {
		const rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round(places) {
		places = Math.max(places || 0, 0);
		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
	},

	alpha(value) {
		if (arguments.length > 0) {
			return new Color(this.color.concat(Math.max(0, Math.min(1, value))), this.model);
		}

		return this.valpha;
	},

	// Rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, value => ((value % 360) + 360) % 360),

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(100)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(100)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword(value) {
		if (arguments.length > 0) {
			return new Color(value);
		}

		return convert[this.model].keyword(this.color);
	},

	hex(value) {
		if (arguments.length > 0) {
			return new Color(value);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	rgbNumber() {
		const rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity() {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		const rgb = this.rgb().color;

		const lum = [];
		for (const [i, element] of rgb.entries()) {
			const chan = element / 255;
			lum[i] = (chan <= 0.039_28) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast(color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		const lum1 = this.luminosity();
		const lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level(color2) {
		const contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7.1) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	isDark() {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		const rgb = this.rgb().color;
		const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return yiq < 128;
	},

	isLight() {
		return !this.isDark();
	},

	negate() {
		const rgb = this.rgb();
		for (let i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}

		return rgb;
	},

	lighten(ratio) {
		const hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken(ratio) {
		const hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten(ratio) {
		const hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken(ratio) {
		const hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale() {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		const rgb = this.rgb().color;
		const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(value, value, value);
	},

	fade(ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer(ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate(degrees) {
		const hsl = this.hsl();
		let hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix(mixinColor, weight) {
		// Ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		if (!mixinColor || !mixinColor.rgb) {
			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
		}

		const color1 = mixinColor.rgb();
		const color2 = this.rgb();
		const p = weight === undefined ? 0.5 : weight;

		const w = 2 * p - 1;
		const a = color1.alpha() - color2.alpha();

		const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
		const w2 = 1 - w1;

		return Color.rgb(
			w1 * color1.red() + w2 * color2.red(),
			w1 * color1.green() + w2 * color2.green(),
			w1 * color1.blue() + w2 * color2.blue(),
			color1.alpha() * p + color2.alpha() * (1 - p));
	},
};

// Model conversion methods and static constructors
for (const model of Object.keys(convert)) {
	if (skippedModels.includes(model)) {
		continue;
	}

	const channels = convert[model].channels;

	// Conversion methods
	Color.prototype[model] = function () {
		if (this.model === model) {
			return new Color(this);
		}

		if (arguments.length > 0) {
			return new Color(arguments, model);
		}

		const newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
		return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
	};

	// 'static' construction methods
	Color[model] = function (color) {
		if (typeof color === 'number') {
			color = zeroArray(_slice.call(arguments), channels);
		}

		return new Color(color, model);
	};
}

function roundTo(number, places) {
	return Number(number.toFixed(places));
}

function roundToPlace(places) {
	return function (number) {
		return roundTo(number, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	for (const m of model) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	}

	model = model[0];

	return function (value) {
		let result;

		if (arguments.length > 0) {
			if (modifier) {
				value = modifier(value);
			}

			result = this[model]();
			result.color[channel] = value;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(value) {
	return Array.isArray(value) ? value : [value];
}

function zeroArray(array, length) {
	for (let i = 0; i < length; i++) {
		if (typeof array[i] !== 'number') {
			array[i] = 0;
		}
	}

	return array;
}

var color = Color;

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,e$2=Symbol(),n$3=new Map;class s$3{constructor(t,n){if(this._$cssResult$=!0,n!==e$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t;}get styleSheet(){let e=n$3.get(this.cssText);return t$1&&void 0===e&&(n$3.set(this.cssText,e=new CSSStyleSheet),e.replaceSync(this.cssText)),e}toString(){return this.cssText}}const o$3=t=>new s$3("string"==typeof t?t:t+"",e$2),i$1=(e,n)=>{t$1?e.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((t=>{const n=document.createElement("style"),s=window.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,e.appendChild(n);}));},S$1=t$1?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return o$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$1=window.trustedTypes,r$1=e$1?e$1.emptyScript:"",h$1=window.reactiveElementPolyfillSupport,o$2={toAttribute(t,i){switch(i){case Boolean:t=t?r$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},n$2=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:o$2,reflect:!1,hasChanged:n$2};class a$1 extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o();}static addInitializer(t){var i;null!==(i=this.l)&&void 0!==i||(this.l=[]),this.l.push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Eh(s,i);void 0!==e&&(this._$Eu.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(S$1(i));}else void 0!==i&&s.push(S$1(i));return s}static _$Eh(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$Eg)&&void 0!==i?i:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$Eg)||void 0===i||i.splice(this._$Eg.indexOf(t)>>>0,1);}_$Em(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Et.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return i$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$ES(t,i,s=l$2){var e,r;const h=this.constructor._$Eh(t,s);if(void 0!==h&&!0===s.reflect){const n=(null!==(r=null===(e=s.converter)||void 0===e?void 0:e.toAttribute)&&void 0!==r?r:o$2.toAttribute)(i,s.type);this._$Ei=t,null==n?this.removeAttribute(h):this.setAttribute(h,n),this._$Ei=null;}}_$AK(t,i){var s,e,r;const h=this.constructor,n=h._$Eu.get(t);if(void 0!==n&&this._$Ei!==n){const t=h.getPropertyOptions(n),l=t.converter,a=null!==(r=null!==(e=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==e?e:"function"==typeof l?l:null)&&void 0!==r?r:o$2.fromAttribute;this._$Ei=n,this[n]=a(i,t.type),this._$Ei=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||n$2)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$Ep=this._$EC());}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,i)=>this[i]=t)),this._$Et=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$EU();}catch(t){throw i=!1,this._$EU(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$Eg)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EU(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return !0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,i)=>this._$ES(i,this[i],t))),this._$E_=void 0),this._$EU();}updated(t){}firstUpdated(t){}}a$1.finalized=!0,a$1.elementProperties=new Map,a$1.elementStyles=[],a$1.shadowRootOptions={mode:"open"},null==h$1||h$1({ReactiveElement:a$1}),(null!==(s$2=globalThis.reactiveElementVersions)&&void 0!==s$2?s$2:globalThis.reactiveElementVersions=[]).push("1.0.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i=globalThis.trustedTypes,s$1=i?i.createPolicy("lit-html",{createHTML:t=>t}):void 0,e=`lit$${(Math.random()+"").slice(9)}$`,o$1="?"+e,n$1=`<${o$1}>`,l$1=document,h=(t="")=>l$1.createComment(t),r=t=>null===t||"object"!=typeof t&&"function"!=typeof t,d=Array.isArray,u=t=>{var i;return d(t)||"function"==typeof(null===(i=t)||void 0===i?void 0:i[Symbol.iterator])},c=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,a=/>/g,f=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,_=/'/g,m=/"/g,g=/^(?:script|style|textarea)$/i,$=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),p=$(1),b=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),x=new WeakMap,w=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new N(i.insertBefore(h(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l},A=l$1.createTreeWalker(l$1,129,null,!1),C=(t,i)=>{const o=t.length-1,l=[];let h,r=2===i?"<svg>":"",d=c;for(let i=0;i<o;i++){const s=t[i];let o,u,$=-1,p=0;for(;p<s.length&&(d.lastIndex=p,u=d.exec(s),null!==u);)p=d.lastIndex,d===c?"!--"===u[1]?d=v:void 0!==u[1]?d=a:void 0!==u[2]?(g.test(u[2])&&(h=RegExp("</"+u[2],"g")),d=f):void 0!==u[3]&&(d=f):d===f?">"===u[0]?(d=null!=h?h:c,$=-1):void 0===u[1]?$=-2:($=d.lastIndex-u[2].length,o=u[1],d=void 0===u[3]?f:'"'===u[3]?m:_):d===m||d===_?d=f:d===v||d===a?d=c:(d=f,h=void 0);const y=d===f&&t[i+1].startsWith("/>")?" ":"";r+=d===c?s+n$1:$>=0?(l.push(o),s.slice(0,$)+"$lit$"+s.slice($)+e+y):s+e+(-2===$?(l.push(void 0),i):y);}const u=r+(t[o]||"<?>")+(2===i?"</svg>":"");return [void 0!==s$1?s$1.createHTML(u):u,l]};class P{constructor({strings:t,_$litType$:s},n){let l;this.parts=[];let r=0,d=0;const u=t.length-1,c=this.parts,[v,a]=C(t,s);if(this.el=P.createElement(v,n),A.currentNode=this.el.content,2===s){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(l=A.nextNode())&&c.length<u;){if(1===l.nodeType){if(l.hasAttributes()){const t=[];for(const i of l.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(e)){const s=a[d++];if(t.push(i),void 0!==s){const t=l.getAttribute(s.toLowerCase()+"$lit$").split(e),i=/([.?@])?(.*)/.exec(s);c.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?M:"?"===i[1]?H:"@"===i[1]?I:S});}else c.push({type:6,index:r});}for(const i of t)l.removeAttribute(i);}if(g.test(l.tagName)){const t=l.textContent.split(e),s=t.length-1;if(s>0){l.textContent=i?i.emptyScript:"";for(let i=0;i<s;i++)l.append(t[i],h()),A.nextNode(),c.push({type:2,index:++r});l.append(t[s],h());}}}else if(8===l.nodeType)if(l.data===o$1)c.push({type:2,index:r});else {let t=-1;for(;-1!==(t=l.data.indexOf(e,t+1));)c.push({type:7,index:r}),t+=e.length-1;}r++;}}static createElement(t,i){const s=l$1.createElement("template");return s.innerHTML=t,s}}function V(t,i,s=t,e){var o,n,l,h;if(i===b)return i;let d=void 0!==e?null===(o=s._$Cl)||void 0===o?void 0:o[e]:s._$Cu;const u=r(i)?void 0:i._$litDirective$;return (null==d?void 0:d.constructor)!==u&&(null===(n=null==d?void 0:d._$AO)||void 0===n||n.call(d,!1),void 0===u?d=void 0:(d=new u(t),d._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Cl)&&void 0!==l?l:h._$Cl=[])[e]=d:s._$Cu=d),void 0!==d&&(i=V(t,d._$AS(t,i.values),d,e)),i}class E{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:l$1).importNode(s,!0);A.currentNode=o;let n=A.nextNode(),h=0,r=0,d=e[0];for(;void 0!==d;){if(h===d.index){let i;2===d.type?i=new N(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new L(n,this,t)),this.v.push(i),d=e[++r];}h!==(null==d?void 0:d.index)&&(n=A.nextNode(),h++);}return o}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class N{constructor(t,i,s,e){var o;this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cg=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=V(this,t,i),r(t)?t===T||null==t||""===t?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==b&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):u(t)?this.M(t):this.$(t);}A(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t));}$(t){this._$AH!==T&&r(this._$AH)?this._$AA.nextSibling.data=t:this.S(l$1.createTextNode(t)),this._$AH=t;}T(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=P.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.m(s);else {const t=new E(o,this),i=t.p(this.options);t.m(s),this.S(i),this._$AH=t;}}_$AC(t){let i=x.get(t.strings);return void 0===i&&x.set(t.strings,i=new P(t)),i}M(t){d(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new N(this.A(h()),this.A(h()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cg=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class S{constructor(t,i,s,e,o){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=T;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=V(this,t,i,0),n=!r(t)||t!==this._$AH&&t!==b,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=V(this,e[s+l],i,l),h===b&&(h=this._$AH[l]),n||(n=!r(h)||h!==this._$AH[l]),h===T?t=T:t!==T&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.k(t);}k(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class M extends S{constructor(){super(...arguments),this.type=3;}k(t){this.element[this.name]=t===T?void 0:t;}}const k=i?i.emptyScript:"";class H extends S{constructor(){super(...arguments),this.type=4;}k(t){t&&t!==T?this.element.setAttribute(this.name,k):this.element.removeAttribute(this.name);}}class I extends S{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=V(this,t,i,0))&&void 0!==s?s:T)===b)return;const e=this._$AH,o=t===T&&e!==T||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==T&&(e===T||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class L{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){V(this,t);}}const z=window.litHtmlPolyfillSupport;null==z||z(P,N),(null!==(t=globalThis.litHtmlVersions)&&void 0!==t?t:globalThis.litHtmlVersions=[]).push("2.0.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends a$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=w(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1);}render(){return b}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.0.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */console.warn("The main 'lit-element' module entrypoint is deprecated. Please update your imports to use the 'lit' package: 'lit' and 'lit/decorators.ts' or import from 'lit-element/lit-element.ts'. See https://lit.dev/msg/deprecated-import-path for more information.");

class ToolTip extends s {

  constructor() {
    super();
  }

  render() {
    return p`
    <style>
      .origin {
        position: absolute;
        top: 0;
        left: 0;
      }
      .tooltip {
        padding: 2px 12px;
        position: absolute;
        transition: all .2s;
        z-index: 10000;
        background-color: white;
        filter: drop-shadow(0 .5px 1px black);
        font-size: 12px;
        line-height: 1.5;
        transform: translate(-50%, -100%);
        border-radius: 10px;
        opacity: 0;
      }
      .tooltip::before {
        content: "";
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 5px 0 4px;
        border-color: white transparent transparent transparent;
        display: block;
        position: absolute;
        left: 50%;
        bottom: -5px;
        transform: translateX(-50%);
      }
      .tooltip.-show {
        opacity: 1;
      }
    </style>
    <div class="origin"></div>
    <div class="tooltip"></div>
    `;
  }

  setup(nodes) {
    const tooltip = this.shadowRoot.querySelector('.tooltip');
    nodes.forEach(node => {
      node.addEventListener('mouseover', () => {
        const originRect = this.shadowRoot.querySelector('.origin').getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        if (node.dataset.tooltipHtml === 'true') {
          tooltip.innerHTML = node.dataset.tooltip;
        } else {
          tooltip.textContent = node.dataset.tooltip;
        }
        tooltip.style.left = (rect.x + rect.width * .5 - originRect.x) + 'px';
        tooltip.style.top = (rect.y - originRect.y) + 'px';
        tooltip.classList.add('-show');
      });
      node.addEventListener('mouseleave', () => {
        tooltip.classList.remove('-show');
      });
    });
  }

}

customElements.define('togostanza--tooltip', ToolTip);

class Legend extends s {

  constructor() {
    super();
    this.items = [];
  }

  static get properties() {
    return {
      items: {type: Array}
    }
  }

  render() {
    return p`
    <style>
      .origin {
        position: absolute;
        top: 0;
        left: 0;
      }
      .legend {
        padding: 3px 9px;
        position: absolute;
        font-size: 10px;
        line-height: 1.5;
        max-height: 100%;
        overflow-y: auto;
        color: var(--togostanza-label-font-color);
        background-color: rgba(255, 255, 255, .8);
        box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
        white-space: nowrap;
      }
      .legend > table > tbody > tr > td > .marker {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 100%;
        vertical-align: middle;
        margin-right: .3em;
      }
      .legend > table > tbody > tr > td.number {
        text-align: right;
      }
      .leader {
        position: absolute;
        border-left: dotted 1px black;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: all .2s;
      }
      .leader[data-direction="top"] {
        border-top: dotted 1px black;
      }
      .leader[data-direction="bottom"] {
        border-bottom: dotted 1px black;
      }
      .leader.-show {
        opacity: .5;
      }
    </style>
    <div class="origin"></div>
    <div class="legend">
      <table>
        <tbody>
          ${this.items.map(item => {
            return p`
            <tr data-id="${item.id}">
              <td>
                <span class="marker" style="background-color: ${item.color}"></span>${item.label}
              </td>
              ${item.value ? p`<td class="${(typeof item.value).toLowerCase()}">${item.value}</td>` : ''}
            </tr>`;
          })}
        </tbody>
      </table>
    </div>
    <div class="leader"></div>
    `;
  }

  /**
   *
   * @param {*} data
   * @param {Node} container
   * @param {Object} opt
   *  - direction 'vertical' or 'horizontal'
   *  - position
   *  - fadeoutNodes
   */
  setup(items, container, opt) {
    this.items = items;
    this.render();
    const positions = opt.position || ['top', 'right'];

    // placement
    const legend = this.shadowRoot.querySelector('.legend');
    positions.forEach(position => legend.style[position] = 0);

    if (!opt.fadeoutNodes) {return;}
    const leader = this.shadowRoot.querySelector('.leader');

    // event
    window.requestAnimationFrame(() => {
      this.shadowRoot.querySelectorAll('.legend > table > tbody > tr').forEach(tr => {
        tr.addEventListener('mouseover', () => {
          const datum = items.find(item => item.id === tr.dataset.id);
          if (datum) {
            opt.fadeoutNodes.forEach(node => node.style.opacity = .2);
            datum.node.style.opacity = "";
            leader.classList.add('-show');
            const originRect = this.shadowRoot.querySelector('.origin').getBoundingClientRect();
            const legendRect = tr.getBoundingClientRect();
            const targetRect = datum.node.getBoundingClientRect();
            leader.style.left = (targetRect.x + targetRect.width * .5 - originRect.x) + 'px';
            leader.style.width = (legendRect.x - targetRect.right + targetRect.width * .5) + 'px';
            const legendMiddle = legendRect.y + legendRect.height * .5;
            const targetMiddle = targetRect.y + targetRect.height * .5;
            if (legendMiddle < targetMiddle) {
              leader.dataset.direction = 'top';
              leader.style.top = (legendMiddle - originRect.y) + 'px';
              leader.style.height = (targetMiddle - legendMiddle) + 'px';
            } else {
              leader.dataset.direction = 'bottom';
              leader.style.top = (targetMiddle - originRect.y) + 'px';
              leader.style.height = (legendMiddle - targetMiddle) + 'px';
            }
          }        });
        tr.addEventListener('mouseleave', () => {
          opt.fadeoutNodes.forEach(node => node.style.opacity = "");
          leader.classList.remove('-show');
        });
      });
    });
  }

}

customElements.define('togostanza--legend', Legend);

class VennStanza extends Stanza {

  // colorSeries;
  // data;
  // totals;
  // dataLabels;
  // numberOfData;
  // venn;
  // tooltip;
  // legend;

  menu() {
    return [
      downloadSvgMenuItem(this, 'vennstanza'),
      downloadPngMenuItem(this, 'vennstanza'),
    ];
  }

  async render() {

    appendCustomCss(this, this.params['custom-css-url']);
    this.colorSeries = this.getColorSeries();

    this.renderTemplate({ template: 'stanza.html.hbs' });

    // append tooltip, legend
    const root = this.root.querySelector(':scope > div');
    if (!this.tooltip) {
      this.tooltip = new ToolTip();
      root.append(this.tooltip);
      this.legend = new Legend();
      root.append(this.legend);
    }

    // get data
    this.data = await this.getData();
    console.log(this.data);
    this.totals = this.data.map(datum => {
      const total = {
        set: datum.set,
        size: 0
      };
      const matchedData = this.data.filter(datum2 => datum.set.every(item => datum2.set.indexOf(item) !== -1));
      total.size = matchedData.reduce((acc, datum) => acc + datum.size, 0);
      return total;
    });
    this.dataLabels = Array.from(new Set(this.data.map(datum => datum.set).flat()));
    this.numberOfData = this.dataLabels.length;
    this.venn = new Map();

    // draw
    switch (this.params['chart-type']) {
      case 'Venn diagram':
        this.drawVennDiagram();
        break;
      case 'Euler diagram':
        this.drawEulerDiagram();
        break;
    }
  }

  drawVennDiagram() {
    // set common parameters and styles
    const container = this.root.querySelector('#venn-diagrams');
    const svgWidth = this.params['width'];
    const svgHeight = this.params['height'];
    container.style.width = svgWidth + 'px';
    container.style.height = svgHeight + 'px';

    // show venn diagram corresponds to data(circle numbers to draw)
    const selectedDiagram = this.root.querySelector(`.venn-diagram[data-number-of-data="${this.numberOfData}"]`);
    if (!selectedDiagram) {
      console.error('Venn diagrams with more than six elements are not supported. Please try using Euler diagrams.');
      return;
    }
    selectedDiagram.classList.add('-current');
    this.venn.set('node', selectedDiagram);

    // set scale
    const containerRect = this.root.querySelector('main').getBoundingClientRect();
    const rect = selectedDiagram.getBoundingClientRect();
    const margin = Math.max(rect.x - containerRect.x, rect.y - containerRect.y);
    const scale = Math.min(
      svgWidth / (rect.width + margin * 2),
      svgHeight / (rect.height + margin * 2)
    );
    selectedDiagram.setAttribute('transform', `scale(${scale})`);
    const labelFontSize = +window.getComputedStyle(this.element).getPropertyValue('--togostanza-label-font-size').trim();
    selectedDiagram.querySelectorAll('text').forEach(text => {
      text.style.fontSize = (labelFontSize / scale) + 'px';
    });

    // shapes
    selectedDiagram.querySelectorAll(':scope > g').forEach(group => {
      const targets = group.dataset.targets.split(',').map(target => +target);
      const labels = targets.map(target => this.dataLabels[target]);
      const count = this.data.find(datum => {
        return datum.set.length === labels.length && labels.every(label => datum.set.find(label2 => label === label2));
      })?.size ?? '';
      // set color
      const color = this.getBlendedColor(targets);
      group.querySelector(':scope > .part').setAttribute('fill', color.toString());
      // set label
      group.querySelector(':scope > text.label').textContent = labels.join(',');
      group.querySelector(':scope > text.value').textContent = count;
      // tooltip
      group.dataset.tooltip = `<strong>${labels.join('∩')}</strong>: ${count}`;
      group.dataset.tooltipHtml = true;
      // this.setTooltip(group);
    });
    this.tooltip.setup(selectedDiagram.querySelectorAll('[data-tooltip]'));

    // legend
    const items = this.data.map(datum => {
      const id = datum.set.map(item => this.dataLabels.indexOf(item)).sort().join(',');
      const color = this.getBlendedColor(datum.set.map(item => this.dataLabels.indexOf(item)));
      return Object.fromEntries([
        ['id', id],
        ['label', datum.set.map(item => item).join('∩')],
        ['color', color.toString()],
        ['value', datum.size],
        ['node', selectedDiagram.querySelector(`:scope > g[data-targets="${id}"]`)]
      ]);
    });
    this.legend.setup(
      items,
      this.root.querySelector('main'),
      {
        fadeoutNodes: selectedDiagram.querySelectorAll(':scope > g')
      }
    );
  }

  drawEulerDiagram() {

    const container = this.root.querySelector('#euler-diagram');
    container.style.width = this.params['width'] + 'px';
    container.style.height = this.params['height'] + 'px';
    container.dataset.blendMode = this.params['blend-mode'];
    const d3Container = select$1(container);
    const convertedData = this.totals.map(datum => Object.fromEntries([
      ['sets', datum.set],
      ['size', datum.size]
    ]));
    const euler = venn.VennDiagram()
      .width(this.params['width'])
      .height(this.params['height']);
    d3Container.datum(convertedData).call(euler);
    const labelFontSize = +window.getComputedStyle(this.element).getPropertyValue('--togostanza-label-font-size').trim();

    // path
    // d3Container.selectAll('.venn-circle path')
    //   .style('fill', (d, i) => this.colorSeries[i])
    //   .style('stroke', (d, i) => this.colorSeries[i]);

    const legendItems = [];
    container.querySelectorAll('.venn-area').forEach(group => {
      const labels = group.dataset.vennSets.split('_');
      const targets = labels.map(label => this.dataLabels.indexOf(label));
      const count = this.totals.find(datum => {
        return datum.set.length === labels.length && labels.every(label => datum.set.find(label2 => label === label2));
      })?.size ?? '';
      // set color
      const color = this.getBlendedColor(targets);
      const path = group.querySelector(':scope > path');
      path.style.fill = color.toString();
      path.style.fillOpacity = 1;
      // set labels
      const labelNode = group.querySelector(':scope > text > tspan');
      labelNode.textContent = labels.join(',');
      const countNode = labelNode.cloneNode();
      const y = +countNode.getAttribute('y');
      countNode.textContent = count;
      group.querySelector(':scope > text').append(countNode);
      labelNode.setAttribute('y', y - labelFontSize * .5);
      countNode.setAttribute('y', y + labelFontSize * .5);
      // tooltip
      group.dataset.tooltip = `<strong>${labels.join('∩')}</strong>: ${count}`;
      group.dataset.tooltipHtml = true;
      // legend
      legendItems.push({
        id: group.dataset.vennSets,
        label: labels.join('∩'),
        color: color.toString(),
        value: count,
        node: group
      });
    });
    this.tooltip.setup(container.querySelectorAll('[data-tooltip]'));

    // legend
    this.legend.setup(
      legendItems,
      this.root.querySelector('main'),
      {
        fadeoutNodes: container.querySelectorAll('.venn-area')
      }
    );
  }

  getColorSeries() {
    const getPropertyValue = (key) => window.getComputedStyle(this.element).getPropertyValue(key);
    const series = Array(6);
    for (let i = 0; i < series.length; i++) {
      series[i] = `--togostanza-series-${i}-color`;
    }
    return series.map(variable => getPropertyValue(variable).trim());
  }

  getBlendedColor(targets) {
    let blendedColor = color(this.colorSeries[targets[0]]);
    targets.forEach((target, index) => {
      if (index > 0) {
        blendedColor = blendedColor.mix(color(this.colorSeries[target]), 1 / (index + 1));
      }
    });
    const ratio = (targets.length - 1) / (this.numberOfData - 1);
    switch (this.params['blend-mode']) {
      case 'multiply':
        blendedColor = blendedColor.saturate(ratio);
        blendedColor = blendedColor.darken(ratio * .5);
        break;
      case 'screen':
        blendedColor = blendedColor.saturate(ratio);
        blendedColor = blendedColor.lighten(ratio * .5);
        break;
    }
    return blendedColor;
  }

  async getData() {
    const data = await loadData(this.params['data-url'], this.params['data-type']);
    // // processing
    // for (const datum of data) {
    //   datum.orgs = datum.orgs.split(', ');
    //   datum.count = Number(datum.count);
    // }
    return data;
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': VennStanza
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "venn-stanza",
	"stanza:label": "Venn stanza",
	"stanza:definition": "Venn stanza MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Image",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "c-nakashima",
	"stanza:address": "nakashima@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-08-03",
	"stanza:updated": "2021-08-03",
	"stanza:parameter": [
	{
		"stanza:key": "chart-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"Venn diagram",
			"Euler diagram"
		],
		"stanza:example": "Venn diagram",
		"stanza:description": "Type of venn diagram",
		"stanza:required": true
	},
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/3sets-data.json",
		"stanza:description": "Data source URL",
		"stanza:required": true
	},
	{
		"stanza:key": "data-type",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"json",
			"tsv",
			"csv",
			"sparql-results-json"
		],
		"stanza:example": "json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "custom-css-url",
		"stanza:example": "",
		"stanza:description": "Stylesheet(css file) URL to override current style",
		"stanza:required": false
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 800,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 380,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "blend-mode",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"normal",
			"multiply",
			"screen"
		],
		"stanza:example": "screen",
		"stanza:description": "How to mix colors in overlapping areas",
		"stanza:required": true
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Group color 0"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Group color 1"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Group color 2"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Group color 3"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Group color 4"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Group color 5"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#000000",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 12,
		"stanza:description": "Label font size"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"drawArea\">\n  <svg id=\"venn-diagrams\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n    xmlns:a=\"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/\" xml:space=\"preserve\">\n\n    <!-- 1 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"1\">\n      <g data-targets=\"0\">\n        <circle class=\"part\" cx=\"182.5\" cy=\"182.5\" r=\"90\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"178\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"192\"></text>\n      </g>\n    </g>\n\n    <!-- 2 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"2\">\n      <g data-targets=\"0\">\n        <path class=\"part\" d=\"M182.5,62.5c-49.7,0-90,40.3-90,90c0,10.5,1.8,20.6,5.1,30c12.4-35,45.7-60,84.9-60s72.5,25,84.9,60 c3.3-9.4,5.1-19.5,5.1-30C272.5,102.8,232.2,62.5,182.5,62.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"93\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"107\"></text>\n      </g>\n      <g data-targets=\"1\">\n        <path class=\"part\" d=\"M182.5,242.5c-39.2,0-72.5-25-84.9-60c-3.3,9.4-5.1,19.5-5.1,30c0,49.7,40.3,90,90,90s90-40.3,90-90 c0-10.5-1.8-20.6-5.1-30C255,217.5,221.7,242.5,182.5,242.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"266\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"280\"></text>\n      </g>\n      <g data-targets=\"0,1\">\n        <path class=\"part\" d=\"M182.5,122.5c-39.2,0-72.5,25-84.9,60c12.4,35,45.7,60,84.9,60s72.5-25,84.9-60 C255,147.5,221.7,122.5,182.5,122.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"178\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"192\"></text>\n      </g>\n    </g>\n\n    <!-- 3 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"3\">\n      <g data-targets=\"0\">\n        <path class=\"part\" d=\"M182.5,135.1c25.9-12.4,57.2-12.3,84,3.2c2,1.1,3.9,2.4,5.7,3.6c-3.5-46.5-42.3-83.2-89.7-83.2 S96.3,95.4,92.8,142c1.9-1.3,3.8-2.5,5.7-3.6C125.3,122.9,156.6,122.7,182.5,135.1z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"98\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"112\"></text>\n      </g>\n      <g data-targets=\"1\">\n        <path class=\"part\" d=\"M272.2,142c0.2,2.2,0.3,4.5,0.3,6.8c0,30.9-15.5,58.1-39.2,74.3c-2.2,28.6-18,55.7-44.7,71.1 c-2,1.1-4,2.2-6,3.2c42,20.2,93.2,5,116.9-36.1C323.1,220.2,310.8,168.2,272.2,142z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"264\" y=\"233\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"264\" y=\"247\"></text>\n      </g>\n      <g data-targets=\"2\">\n        <path class=\"part\" d=\"M131.7,223.1c-23.7-16.2-39.2-43.4-39.2-74.3c0-2.3,0.1-4.6,0.3-6.8c-38.6,26.3-50.9,78.2-27.2,119.3 c23.7,41.1,74.9,56.3,116.9,36.1c-2-1-4-2-6-3.2C149.7,278.8,133.9,251.7,131.7,223.1z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"102\" y=\"233\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"102\" y=\"247\"></text>\n      </g>\n      <g data-targets=\"0,1\">\n        <path class=\"part\" d=\"M182.5,135.1c15.8,7.6,29.6,19.8,39,36.1s13.1,34.3,11.8,51.8c23.7-16.2,39.2-43.4,39.2-74.3 c0-2.3-0.1-4.6-0.3-6.8c-1.9-1.3-3.8-2.5-5.7-3.6C239.7,122.9,208.4,122.7,182.5,135.1z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"242\" y=\"156\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"242\" y=\"170\"></text>\n      </g>\n      <g data-targets=\"0,2\">\n        <path class=\"part\" d=\"M131.7,223.1c-1.3-17.5,2.4-35.5,11.8-51.8s23.2-28.6,39-36.1c-25.9-12.4-57.2-12.3-84,3.2 c-2,1.1-3.9,2.4-5.7,3.6c-0.2,2.2-0.3,4.5-0.3,6.8C92.5,179.6,108,206.9,131.7,223.1z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"122\" y=\"156\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"122\" y=\"170\"></text>\n      </g>\n      <g data-targets=\"1,2\">\n        <path class=\"part\" d=\"M233.3,223.1c-14.5,9.9-31.9,15.7-50.8,15.7s-36.3-5.8-50.8-15.7c2.2,28.6,18,55.7,44.7,71.1 c2,1.1,4,2.2,6,3.2c2-1,4-2,6-3.2C215.3,278.8,231.1,251.7,233.3,223.1z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"258\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"272\"></text>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path class=\"part\" d=\"M221.5,171.3c-9.4-16.3-23.2-28.6-39-36.1c-15.8,7.6-29.6,19.8-39,36.1 s-13.1,34.3-11.8,51.8c14.5,9.9,31.9,15.7,50.8,15.7s36.3-5.8,50.8-15.7C234.6,205.6,230.9,187.6,221.5,171.3z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"190\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"204\"></text>\n      </g>\n    </g>\n\n    <!-- 4 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"4\">\n      <g data-targets=\"0\">\n        <path class=\"part\" d=\"M247.2,98.5c16.1-1.5,31.3,0.5,44.4,5.9c-2.6-8.9-6.9-17-12.9-24.2c-21-25-58.1-31.2-96.2-19.7 c19.7,5.9,39.6,16.6,57.7,31.7C242.6,94.3,244.9,96.4,247.2,98.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"244\" y=\"75\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"244\" y=\"89\"></text>\n      </g>\n      <g data-targets=\"1\">\n        <path class=\"part\" d=\"M291.6,104.4c5,17.1,3.9,36.8-2.8,56.5c10.1,30,7.5,59.8-10,80.7c-7,8.4-15.9,14.7-26,18.9 c-2.6,8.9-6.9,17-12.9,24.2c-13.7,16.3-34.2,24.6-57.3,25.2c30.8,0.9,66.2-11.8,96.5-37.2c53.1-44.6,70.4-111.5,38.5-149.5 C310.6,114.9,301.7,108.6,291.6,104.4z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"312\" y=\"160\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"312\" y=\"174\"></text>\n      </g>\n      <g data-targets=\"2\">\n        <path class=\"part\" d=\"M125.2,284.8c-6-7.2-10.3-15.3-12.9-24.2c-10.1-4.2-19-10.5-26-18.9c-17.6-21-20.2-50.8-10-80.7 c-6.7-19.8-7.8-39.4-2.8-56.5c-10.1,4.2-19,10.5-26,18.9c-31.9,38-14.6,104.9,38.5,149.5c30.3,25.4,65.8,38.1,96.5,37.2 C159.3,309.4,138.8,301.1,125.2,284.8z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"53\" y=\"160\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"53\" y=\"174\"></text>\n      </g>\n      <g data-targets=\"3\">\n        <path class=\"part\" d=\"M117.8,98.5c2.3-2.1,4.6-4.2,7-6.3c18.1-15.2,38-25.8,57.7-31.7c-38.1-11.5-75.2-5.3-96.2,19.7 c-6,7.2-10.3,15.3-12.9,24.2C86.5,99,101.8,97,117.8,98.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"121\" y=\"75\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"121\" y=\"89\"></text>\n      </g>\n      <g data-targets=\"0,1\">\n        <path class=\"part\" d=\"M247.2,98.5c20,18.7,34.2,40.6,41.6,62.5c6.7-19.8,7.8-39.4,2.8-56.5C278.5,99,263.2,97,247.2,98.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"280\" y=\"113\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"280\" y=\"127\"></text>\n      </g>\n      <g data-targets=\"0,2\">\n        <path class=\"part\" d=\"M111.5,217.2C94.8,200,82.8,180.4,76.2,161c-10.1,30-7.5,59.8,10,80.7c7,8.4,15.9,14.7,26,18.9 C108.4,247.3,108.2,232.5,111.5,217.2z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"92\" y=\"217\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"92\" y=\"231\"></text>\n      </g>\n      <g data-targets=\"0,3\">\n        <path class=\"part\" d=\"M117.8,98.5c21.1,1.9,43.6,9.7,64.7,23.1c21.1-13.4,43.6-21.2,64.7-23.1c-2.3-2.1-4.6-4.2-7-6.3 c-18.1-15.2-38-25.8-57.7-31.7c-19.7,5.9-39.6,16.6-57.7,31.7C122.4,94.3,120.1,96.4,117.8,98.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"91\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"105\"></text>\n      </g>\n      <g data-targets=\"1,2\">\n        <path class=\"part\" d=\"M239.8,284.8c6-7.2,10.3-15.3,12.9-24.2c-20,8.3-44.9,8.5-70.2,0.9c-25.3,7.6-50.2,7.5-70.2-0.9 c2.6,8.9,6.9,17,12.9,24.2c13.7,16.3,34.2,24.6,57.3,25.2C205.7,309.4,226.2,301.1,239.8,284.8z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"283\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"297\"></text>\n      </g>\n      <g data-targets=\"1,3\">\n        <path class=\"part\" d=\"M252.7,260.6c10.1-4.2,19-10.5,26-18.9c17.6-21,20.2-50.8,10-80.7c-6.6,19.5-18.5,39-35.2,56.3 C256.8,232.5,256.6,247.3,252.7,260.6z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"273\" y=\"217\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"273\" y=\"231\"></text>\n      </g>\n      <g data-targets=\"2,3\">\n        <path class=\"part\" d=\"M76.2,161c7.4-21.8,21.5-43.8,41.6-62.5c-16.1-1.5-31.3,0.5-44.4,5.9C68.4,121.6,69.6,141.2,76.2,161z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"85\" y=\"113\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"85\" y=\"127\"></text>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path class=\"part\" d=\"M111.5,217.2c-3.2,15.2-3.1,30,0.8,43.3c20,8.3,44.9,8.5,70.2,0.9c-19.7-5.9-39.6-16.6-57.7-31.7 C120.1,225.7,115.6,221.5,111.5,217.2z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"134\" y=\"251\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"134\" y=\"265\"></text>\n      </g>\n      <g data-targets=\"0,1,3\">\n        <path class=\"part\" d=\"M247.2,98.5c-21.1,1.9-43.6,9.7-64.7,23.1c6.4,4.1,12.7,8.6,18.8,13.7c28.1,23.6,46.2,53.4,52.2,81.9 c16.7-17.3,28.6-36.8,35.2-56.3C281.4,139.1,267.2,117.2,247.2,98.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"246\" y=\"143\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"246\" y=\"157\"></text>\n      </g>\n      <g data-targets=\"0,2,3\">\n        <path class=\"part\" d=\"M163.7,135.3c6.1-5.1,12.4-9.7,18.8-13.7c-21.1-13.4-43.6-21.2-64.7-23.1c-20,18.7-34.2,40.6-41.6,62.5 c6.6,19.5,18.5,39,35.2,56.3C117.5,188.7,135.6,158.9,163.7,135.3z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"119\" y=\"143\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"119\" y=\"157\"></text>\n      </g>\n      <g data-targets=\"1,2,3\">\n        <path class=\"part\" d=\"M253.5,217.2c-4.2,4.3-8.6,8.5-13.4,12.5c-18.1,15.2-38,25.8-57.7,31.7c25.3,7.6,50.2,7.5,70.2-0.9 C256.6,247.3,256.8,232.5,253.5,217.2z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"231\" y=\"251\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"231\" y=\"265\"></text>\n      </g>\n      <g data-targets=\"0,1,2,3\">\n        <path class=\"part\" d=\"M253.5,217.2c-6.1-28.5-24.1-58.3-52.2-81.9c-6.1-5.1-12.4-9.7-18.8-13.7c-6.4,4.1-12.7,8.6-18.8,13.7 c-28.1,23.6-46.2,53.4-52.2,81.9c4.2,4.3,8.6,8.5,13.4,12.5c18.1,15.2,38,25.8,57.7,31.7c19.7-5.9,39.6-16.6,57.7-31.7 C244.9,225.7,249.4,221.5,253.5,217.2z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"182.5\" y=\"190\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"182.5\" y=\"204\"></text>\n      </g>\n    </g>\n\n    <!-- 5 -->\n    <g class=\"venn-diagram\" data-number-of-data=\"5\">\n      <g data-targets=\"0\">\n        <path class=\"part\" d=\"M234.9,81.5c9.7,7,15.5,18.2,17.7,32.2c4.4-0.3,8.7-0.4,12.9-0.5C255.3,55,227.6,13.2,195,13.2 c-26.8,0-50.3,28.2-63.5,70.6c9.3,1.3,18.8,3.2,28.5,5.7C189.3,72.5,216.9,68.5,234.9,81.5z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"196\" y=\"50\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"196\" y=\"64\"></text>\n      </g>\n      <g data-targets=\"1\">\n        <path class=\"part\" d=\"M351.2,151.8c-8.2-25.3-41.8-38.9-85.7-38.6c1.8,10.1,3,20.7,3.7,31.7c24.1,22.2,35.7,46.6,29,67.3 c-3.7,11.4-12.6,20.4-25.3,26.9c1.5,3.8,2.8,7.5,4.1,11.2C329.8,222.6,361.4,183,351.2,151.8z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"314\" y=\"158\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"314\" y=\"172\"></text>\n      </g>\n      <g data-targets=\"2\">\n        <path class=\"part\" d=\"M195,312.3c-12.1,0-23.5-5.8-33.6-16c-3.5,2.9-7,5.6-10.4,8.2c42.5,41.2,89.6,58.7,116,39.5 c21.6-15.7,24.1-52,10.1-93.7c-8.3,4.3-17,8.4-26.3,12.1C237.1,293,217.2,312.3,195,312.3z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"240\" y=\"321\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"240\" y=\"335\"></text>\n      </g>\n      <g data-targets=\"3\">\n        <path class=\"part\" d=\"M129.9,281.7c-32.6-3.8-56.4-16.7-63.2-37.4c-3.6-11.2-1.9-23.4,4.2-35.8c-3.6-2.3-7-4.6-10.4-7 c-25.8,53-27.8,102.9-1.5,122c21.5,15.6,56.6,6.9,91.8-19C143.8,297.6,136.7,289.9,129.9,281.7z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"88\" y=\"295\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"88\" y=\"309\"></text>\n      </g>\n      <g data-targets=\"4\">\n        <path class=\"part\" d=\"M91.1,102c9.9-7.2,22.8-9.2,37.2-6.7c1-4,2.1-7.8,3.3-11.6c-58.9-8.5-107.6,4.9-117.8,36.1 c-8.2,25.3,11.1,56.2,46.8,81.7c4.3-8.8,9.2-17.6,14.7-26.4C68.4,142.3,73.2,115.1,91.1,102z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"46\" y=\"125\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"46\" y=\"139\"></text>\n      </g>\n      <g data-targets=\"0,1\">\n        <path class=\"part\" d=\"M253.6,132.1c5.7,4.2,10.9,8.4,15.6,12.8c-0.7-11-1.9-21.6-3.7-31.7c-4.2,0-8.5,0.2-12.9,0.5 C253.6,119.4,253.9,125.6,253.6,132.1z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"261\" y=\"124\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"261\" y=\"138\"></text>\n      </g>\n      <g data-targets=\"0,2\">\n        <path class=\"part\" d=\"M177.9,281.2c-5.5,5.4-11,10.5-16.6,15.1c10.1,10.2,21.5,16,33.6,16c22.2,0,42.1-19.3,55.7-49.9 c-6,2.4-12.2,4.7-18.6,6.8C213.5,275.2,195.2,279.2,177.9,281.2z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"199\" y=\"292\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"199\" y=\"306\"></text>\n      </g>\n      <g data-targets=\"0,3\">\n        <path class=\"part\" d=\"M228.9,116.4c8.1-1.3,16-2.2,23.7-2.7c-2.2-14-8.1-25.1-17.7-32.2c-18-13.1-45.7-9.1-74.9,7.9 c6.3,1.6,12.7,3.4,19.1,5.5C197.2,100.8,214,108.2,228.9,116.4z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"214\" y=\"90\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"214\" y=\"104\"></text>\n      </g>\n      <g data-targets=\"0,4\">\n        <path class=\"part\" d=\"M144.3,99.6c5.2-3.8,10.5-7.2,15.7-10.2c-9.7-2.5-19.2-4.3-28.5-5.7c-1.2,3.7-2.2,7.6-3.3,11.6 C133.4,96.2,138.8,97.6,144.3,99.6z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"140\" y=\"89\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"140\" y=\"103\"></text>\n      </g>\n      <g data-targets=\"1,2\">\n        <path class=\"part\" d=\"M257.4,245.3c-2,6-4.2,11.8-6.6,17.1c9.2-3.7,18-7.7,26.3-12.1c-1.2-3.7-2.6-7.4-4.1-11.2 C268.2,241.5,263,243.6,257.4,245.3z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"264\" y=\"248\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"264\" y=\"262\"></text>\n      </g>\n      <g data-targets=\"1,3\">\n        <path class=\"part\" d=\"M90.5,219.6c-6.9-3.5-13.4-7.3-19.6-11.1c-6.1,12.4-7.8,24.6-4.2,35.8c6.7,20.7,30.6,33.6,63.2,37.4 c-3.9-4.7-7.7-9.6-11.4-14.7C107.1,251.4,97.8,235.3,90.5,219.6z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"86\" y=\"243\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"86\" y=\"257\"></text>\n      </g>\n      <g data-targets=\"1,4\">\n        <path class=\"part\" d=\"M264.2,219.6c3.3,6.6,6.2,13.1,8.8,19.6c12.7-6.5,21.6-15.5,25.3-26.9c6.7-20.7-4.9-45.1-29-67.3 c0.3,5.8,0.5,11.8,0.5,17.8C269.8,182.9,267.8,202.1,264.2,219.6z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"282\" y=\"201\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"282\" y=\"215\"></text>\n      </g>\n      <g data-targets=\"2,3\">\n        <path class=\"part\" d=\"M150.4,282.8c-7.1,0-14-0.4-20.5-1.2c6.8,8.2,13.8,15.9,21,22.8c3.5-2.6,7-5.3,10.4-8.2 C157.5,292.4,153.9,287.9,150.4,282.8z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"148\" y=\"290\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"148\" y=\"304\"></text>\n      </g>\n      <g data-targets=\"2,4\">\n        <path class=\"part\" d=\"M123.9,116.4c1.2-7.3,2.7-14.3,4.4-21.1c-14.4-2.5-27.3-0.5-37.2,6.7c-17.9,13-22.7,40.3-15.8,73.1 c3.5-5.5,7.2-11.1,11.2-16.6C98.2,142.5,110.9,128.4,123.9,116.4z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"99\" y=\"114\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"99\" y=\"128\"></text>\n      </g>\n      <g data-targets=\"3,4\">\n        <path class=\"part\" d=\"M80.3,193.7c-2-6.3-3.7-12.5-5-18.6c-5.5,8.8-10.5,17.6-14.7,26.4c3.3,2.4,6.8,4.7,10.4,7 C73.4,203.6,76.5,198.6,80.3,193.7z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"71\" y=\"190\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"71\" y=\"204\"></text>\n      </g>\n      <g data-targets=\"0,1,2\">\n        <path class=\"part\" d=\"M204.4,250.6c-8.4,11.2-17.3,21.4-26.5,30.6c17.3-2,35.6-6,54.2-12c6.4-2.1,12.6-4.4,18.6-6.8 c2.4-5.4,4.6-11.1,6.6-17.1C242.4,249.7,224.3,251.5,204.4,250.6z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"220\" y=\"259\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"220\" y=\"273\"></text>\n      </g>\n      <g data-targets=\"0,1,3\">\n        <path class=\"part\" d=\"M253.6,132.1c0.3-6.5-0.1-12.7-1-18.4c-7.7,0.5-15.6,1.4-23.7,2.7C237.9,121.4,246.1,126.6,253.6,132.1z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"244\" y=\"117\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"244\" y=\"131\"></text>\n      </g>\n      <g data-targets=\"0,1,4\">\n        <path class=\"part\" d=\"M242.3,183c8.5,12.1,15.8,24.4,21.9,36.6c3.6-17.5,5.6-36.7,5.6-56.8c0-6-0.2-12-0.5-17.8 c-4.7-4.4-10-8.6-15.6-12.8C253,147.5,249.1,164.8,242.3,183z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"257\" y=\"177\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"257\" y=\"191\"></text>\n      </g>\n      <g data-targets=\"0,2,3\">\n        <path class=\"part\" d=\"M150.4,282.8c3.4,5.1,7.1,9.6,10.9,13.5c5.6-4.6,11.1-9.7,16.6-15.1C168.4,282.3,159.2,282.9,150.4,282.8z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"164\" y=\"285\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"164\" y=\"299\"></text>\n      </g>\n      <g data-targets=\"0,2,4\">\n        <path class=\"part\" d=\"M144.3,99.6c-5.5-2-10.9-3.5-16.1-4.3c-1.7,6.8-3.2,13.8-4.4,21.1C130.7,110.2,137.5,104.6,144.3,99.6z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"131\" y=\"102\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"131\" y=\"116\"></text>\n      </g>\n      <g data-targets=\"0,3,4\">\n        <path class=\"part\" d=\"M228.9,116.4c-14.9-8.3-31.7-15.6-49.8-21.5c-6.4-2.1-12.8-3.9-19.1-5.5c-5.2,3-10.4,6.4-15.7,10.2 c14.4,5.2,29.7,14.2,44.9,26.2C202.7,121.7,216.1,118.5,228.9,116.4z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"187\" y=\"108\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"187\" y=\"122\"></text>\n      </g>\n      <g data-targets=\"1,2,3\">\n        <path class=\"part\" d=\"M90.5,219.6c7.3,15.7,16.6,31.7,28,47.4c3.7,5.1,7.5,10,11.4,14.7c6.5,0.8,13.4,1.1,20.5,1.2 c-8.4-12.5-15.4-28.4-20.6-46.7C115.8,231.4,102.6,225.8,90.5,219.6z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"122\" y=\"253\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"122\" y=\"267\"></text>\n      </g>\n      <g data-targets=\"1,2,4\">\n        <path class=\"part\" d=\"M257.4,245.3c5.7-1.7,10.9-3.7,15.6-6.1c-2.6-6.5-5.5-13-8.8-19.6C262.3,228.6,260,237.2,257.4,245.3z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"265\" y=\"232\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"265\" y=\"246\"></text>\n      </g>\n      <g data-targets=\"1,3,4\">\n        <path class=\"part\" d=\"M80.3,193.7c-3.8,4.9-6.9,9.9-9.3,14.8c6.1,3.9,12.7,7.6,19.6,11.1C86.4,210.8,83,202.2,80.3,193.7z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"78\" y=\"205\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"78\" y=\"219\"></text>\n      </g>\n      <g data-targets=\"2,3,4\">\n        <path class=\"part\" d=\"M120.3,157.9c0.2-14.5,1.5-28.4,3.6-41.5c-13,12-25.7,26.1-37.4,42.2c-4,5.5-7.7,11-11.2,16.6 c1.3,6,2.9,12.2,5,18.6C89.9,181.2,103.5,169,120.3,157.9z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"102\" y=\"154\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"102\" y=\"168\"></text>\n      </g>\n      <g data-targets=\"0,1,2,3\">\n        <path class=\"part\" d=\"M204.4,250.6c-22.2-1-46.6-5.4-71.5-13.5c-1-0.3-2-0.7-3-1c5.2,18.3,12.2,34.2,20.6,46.7 c8.8,0,18-0.5,27.5-1.6C187.1,272.1,196,261.8,204.4,250.6z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"165\" y=\"262\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"165\" y=\"276\"></text>\n      </g>\n      <g data-targets=\"0,1,2,4\">\n        <path class=\"part\" d=\"M242.3,183c-7.8,20.7-19.5,42.4-34.8,63.5c-1,1.4-2.1,2.8-3.1,4.1c19.9,0.9,38-1,53-5.4 c2.7-8,5-16.6,6.8-25.7C258.1,207.4,250.8,195.1,242.3,183z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"241\" y=\"222\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"241\" y=\"236\"></text>\n      </g>\n      <g data-targets=\"0,1,3,4\">\n        <path class=\"part\" d=\"M189.2,125.9c17.5,13.9,34.8,31.9,50.3,53.2c0.9,1.3,1.9,2.6,2.8,3.9c6.9-18.2,10.7-35.6,11.3-50.9 c-7.5-5.5-15.8-10.8-24.7-15.7C216.1,118.5,202.7,121.7,189.2,125.9z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"232\" y=\"141\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"232\" y=\"155\"></text>\n      </g>\n      <g data-targets=\"0,2,3,4\">\n        <path class=\"part\" d=\"M120.3,157.9c18.5-12.2,40.8-23,65.6-31c1.1-0.4,2.2-0.7,3.3-1c-15.2-12.1-30.5-21-44.9-26.2 c-6.8,5-13.7,10.6-20.4,16.8C121.8,129.5,120.5,143.5,120.3,157.9z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"147\" y=\"122\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"147\" y=\"136\"></text>\n      </g>\n      <g data-targets=\"1,2,3,4\">\n        <path class=\"part\" d=\"M129.8,236.1c-6.1-21.7-9.6-46.7-9.6-73.4c0-1.6,0-3.2,0.1-4.8c-16.8,11.1-30.4,23.3-40,35.8 c2.7,8.4,6.1,17.1,10.2,25.9C102.6,225.8,115.8,231.4,129.8,236.1z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"105\" y=\"198\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"105\" y=\"212\"></text>\n      </g>\n      <g data-targets=\"0,1,2,3,4\">\n        <path class=\"part\" d=\"M189.2,125.9c-1.1,0.3-2.2,0.7-3.3,1c-24.8,8.1-47.1,18.8-65.6,31c0,1.6-0.1,3.2-0.1,4.8 c0,26.7,3.5,51.7,9.6,73.4c1,0.3,2,0.7,3,1c24.9,8.1,49.3,12.5,71.5,13.5c1-1.4,2.1-2.7,3.1-4.1c15.3-21.1,27-42.8,34.8-63.5 c-0.9-1.3-1.8-2.6-2.8-3.9C224,157.8,206.7,139.8,189.2,125.9z\" />\n        <text class=\"label\" text-anchor=\"middle\" x=\"176\" y=\"187\"></text>\n        <text class=\"value\" text-anchor=\"middle\" x=\"176\" y=\"201\"></text>\n      </g>\n    </g>\n\n  </svg>\n  <div id=\"euler-diagram\"></div>\n</div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=venn-stanza.js.map
