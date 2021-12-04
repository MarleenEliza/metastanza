import { d as defineStanzaElement } from './stanza-element-127b261a.js';
import { S as Stanza } from './timer-55a2463b.js';
import { d as defineComponent, r as reactive, c as createElementBlock, F as Fragment, a as renderList, b as resolveComponent, o as openBlock, n as normalizeClass, e as createBaseVNode, t as toDisplayString, f as createBlock, g as createCommentVNode, h as toRefs, i as ref, w as watchEffect, j as createApp } from './runtime-dom.esm-bundler-506579e8.js';
import { l as loadData } from './load-data-cd61f169.js';
import { l as library, f as faChevronRight, F as FontAwesomeIcon } from './index.es-9dcb5845.js';
import { b as appendCustomCss } from './index-962b3b53.js';
import './index-8d573ab7.js';
import './dsv-cd3740c6.js';

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "column-tree",
	"stanza:label": "Column tree",
	"stanza:definition": "Column tree MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Tree",
	"stanza:provider": "",
	"stanza:license": "MIT",
	"stanza:author": "MarleenEliza",
	"stanza:address": "marleen@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-08-13",
	"stanza:updated": "2021-08-13",
	"stanza:parameter": [
	{
		"stanza:key": "data-url",
		"stanza:example": "https://raw.githubusercontent.com/togostanza/togostanza-data/main/samples/json/tree-data.json",
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
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-column-background-color",
		"stanza:type": "color",
		"stanza:default": "#F8F9FA",
		"stanza:description": "Background color for single column"
	},
	{
		"stanza:key": "--togostanza-column-border",
		"stanza:type": "text",
		"stanza:default": "1px solid rgba(0, 0, 0, 0.1)",
		"stanza:description": "Border for single column"
	},
	{
		"stanza:key": "--togostanza-column-gap",
		"stanza:type": "text",
		"stanza:default": "10px",
		"stanza:description": "Gap between columns"
	},
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-font-size",
		"stanza:type": "text",
		"stanza:default": "14px",
		"stanza:description": "Font size of Nodes"
	},
	{
		"stanza:key": "--togostanza-hover-background-color",
		"stanza:type": "color",
		"stanza:default": "#FFFDD1",
		"stanza:description": "Hover color for background when hovering over Node"
	},
	{
		"stanza:key": "--togostanza-hover-text-color",
		"stanza:type": "color",
		"stanza:default": "#221727",
		"stanza:description": "Hover color for text when hovering over Node"
	},
	{
		"stanza:key": "--togostanza-font-color",
		"stanza:type": "color",
		"stanza:default": "#3c3744",
		"stanza:description": "Text color"
	},
	{
		"stanza:key": "--togostanza-selected-background-color",
		"stanza:type": "color",
		"stanza:default": "#256D80",
		"stanza:description": "Text color"
	},
	{
		"stanza:key": "--togostanza-selected-text-color",
		"stanza:type": "color",
		"stanza:default": "#FFFFFF",
		"stanza:description": "Text color"
	},
	{
		"stanza:key": "--togostanza-node-border-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "Border radius of highlighted/selected nodes"
	},
	{
		"stanza:key": "--togostanza-column-border-radius",
		"stanza:type": "text",
		"stanza:default": "3px",
		"stanza:description": "Border radius of highlighted/selected nodes"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

library.add(faChevronRight);

var script$1 = defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    layer: {
      type: Number,
      default: 0,
    },
    nodes: {
      type: Array,
      default: () => [],
    },
    children: {
      type: Boolean,
      default: false,
    },
    checkedNodes: {
      type: Map,
      required: true,
    },
  },
  emits: ["setParent", "setCheckedNode"],

  setup(props, context) {
    const state = reactive({
      highlightedNode: null,
    });
    function hasChildren(childrenProp) {
      if (typeof childrenProp === "string") {
        childrenProp = childrenProp
          .split(/,/)
          .map(parseFloat)
          .filter((prop) => !isNaN(prop));
      }
      return childrenProp && childrenProp.length > 0;
    }
    function resetHighlightedNode() {
      state.highlightedNode = null;
    }
    function selectionClass(id) {
      return id === state.selecedNode ? "node -highlighted" : "";
    }
    function setCheckedNode(node) {
      context.emit("setCheckedNode", node);
    }
    function setParent(id) {
      state.highlightedNode = id;
      context.emit("setParent", [props.layer + 1, id]);
    }
    return {
      setParent,
      setCheckedNode,
      resetHighlightedNode,
      hasChildren,
      state,
      selectionClass,
    };
  },
});

const _hoisted_1$1 = { class: "column" };
const _hoisted_2 = ["checked", "onInput"];
const _hoisted_3 = ["onClick"];

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_font_awesome_icon = resolveComponent("font-awesome-icon");

  return (openBlock(), createElementBlock("div", _hoisted_1$1, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.nodes, (node) => {
      return (openBlock(), createElementBlock("span", {
        key: node.id,
        class: normalizeClass(["node", { '-highlighted': node.id === _ctx.state.highlightedNode }])
      }, [
        createBaseVNode("input", {
          type: "checkbox",
          checked: _ctx.checkedNodes.get(node.id),
          onInput: $event => (_ctx.setCheckedNode(node))
        }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_2),
        createBaseVNode("span", {
          class: "content",
          onClick: $event => (_ctx.hasChildren(node.children) ? _ctx.setParent(node.id) : null)
        }, [
          createBaseVNode("span", null, toDisplayString(node.label), 1 /* TEXT */),
          (_ctx.hasChildren(node.children))
            ? (openBlock(), createBlock(_component_font_awesome_icon, {
                key: 0,
                icon: "chevron-right",
                class: "icon"
              }))
            : createCommentVNode("v-if", true)
        ], 8 /* PROPS */, _hoisted_3)
      ], 2 /* CLASS */))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

script$1.render = render$1;
script$1.__file = "stanzas/column-tree/NodeColumn.vue";

function isRootNode(parent) {
  return !parent || isNaN(parent);
}

var script = defineComponent({
  components: { NodeColumn: script$1 },
  props: metadata["stanza:parameter"].map((p) => p["stanza:key"]),
  emits: ["resetHighlightedNode"],

  setup(params) {
    params = toRefs(params);
    const layerRefs = ref([]);
    const state = reactive({
      responseJSON: null,
      columnData: [],
      checkedNodes: new Map(),
    });

    watchEffect(
      async () => {
        state.responseJSON = null;
        state.responseJSON = await loadData(
          params.dataUrl.value,
          params.dataType.value
        );
        state.checkedNodes = new Map();
      },
      { immediate: true }
    );

    watchEffect(() => {
      const data = state.responseJSON || [];
      state.columnData.push(data.filter((obj) => isRootNode(obj.parent)));
    });

    function updateCheckedNodes(node) {
      const { id, ...obj } = node;
      state.checkedNodes.has(id)
        ? state.checkedNodes.delete(id)
        : state.checkedNodes.set(id, { id, ...obj });
      // TODO: add event handler
      // console.log([...state.checkedNodes.values()]);
    }

    function resetHighlightedNodes() {
      for (const [index, layer] of layerRefs.value.entries()) {
        if (layer && index >= state.columnData.length - 1) {
          layer.resetHighlightedNode();
        }
      }
    }

    function getChildNodes([layer, parentId]) {
      const children = state.responseJSON.filter(
        (node) => node.parent === parentId
      );
      const indexesToRemove = state.columnData.length - layer;
      state.columnData.splice(layer, indexesToRemove, children);

      resetHighlightedNodes();

      return children;
    }

    return {
      state,
      layerRefs,
      updateCheckedNodes,
      getChildNodes,
    };
  },
});

const _hoisted_1 = { id: "wrapper" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NodeColumn = resolveComponent("NodeColumn");

  return (openBlock(), createElementBlock("section", _hoisted_1, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.state.columnData, (column, index) => {
      return (openBlock(), createElementBlock("div", {
        key: index,
        class: "container"
      }, [
        (column.length > 0)
          ? (openBlock(), createBlock(_component_NodeColumn, {
              key: 0,
              ref: 
          (el) => {
            _ctx.layerRefs[index] = el;
          }
        ,
              nodes: column,
              layer: index,
              "checked-nodes": _ctx.state.checkedNodes,
              onSetParent: _ctx.getChildNodes,
              onSetCheckedNode: _ctx.updateCheckedNodes
            }, null, 8 /* PROPS */, ["nodes", "layer", "checked-nodes", "onSetParent", "onSetCheckedNode"]))
          : createCommentVNode("v-if", true)
      ]))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

script.render = render;
script.__file = "stanzas/column-tree/app.vue";

class ColumnTree extends Stanza {
  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    const main = this.root.querySelector("main");
    main.parentNode.style.backgroundColor =
      "var(--togostanza-background-color)";

    this._app?.unmount();
    this._app = createApp(script, this.params);
    this._app.mount(main);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ColumnTree
});

var templates = [
  
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=column-tree.js.map
