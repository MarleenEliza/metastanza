import { d as defineStanzaElement } from './stanza-element-127b261a.js';
import { S as Stanza } from './stanza-dbdc7fa3.js';
import { e as embed } from './vega-embed.module-83e6e0b7.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as appendCustomCss } from './index-1a193a0d.js';
import './index-57ff628c.js';

class Treemap extends Stanza {
  //TODO ここのclass名はスタンザ名にする必要があります
  menu() {
    return [
      downloadSvgMenuItem(this, "tree"),
      downloadPngMenuItem(this, "tree"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);

    // const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    //width,height,padding
    const width = 960;
    const height = 500;
    const padding = 2.5;

    //TODO this.paramsが記載されていながらも、metastanza.jsonに対応する設定の記述がなかったためビルドできていないようでした
    //TODO こちらの設定は現在は使わないですが、後ほど設定するのでひとまずコメントアウトしております
    // //data
    // const labelVariable = this.params["label"]; //"name"
    // const parentVariable = this.params["parent-node"]; //"parent"
    // const idVariable = this.params["node"]; //"id-variable"

    // const values = await loadData(
    //   this.params["data-url"],
    //   this.params["data-type"]
    // );

    const signals = [
      {
        name: "layout",
        value: "squarify",
        bind: {
          input: "select",
          options: ["squarify", "binary", "slicedice"],
        },
      },
      {
        name: "aspectRatio",
        value: "1.6",
        bind: { input: "range", min: 1, max: 5, step: 0.1 },
      },
    ];

    const data = [
      {
        name: "tree",
        // url: "data/flare.json", //TODO 相対パスになっています。同ディレクトリ内にデータがない場合は、絶対パスで記述する必要があります。
        url: "https://vega.github.io/vega/data/flare.json", //TODO 絶対パスに変更しました。
        transform: [
          {
            type: "stratify",
            key: "id",
            parentKey: "parent",
          },
          {
            type: "treemap",
            field: "size",
            sort: { field: "value" },
            round: true,
            method: { signal: "layout" },
            ratio: { signal: "aspectRatio" },
            size: [{ signal: "width" }, { signal: "height" }],
          },
        ],
      },
      {
        name: "nodes",
        source: "tree",
        transform: [
          {
            type: "filter",
            expr: "datum.children",
          },
        ],
      },
      {
        name: "leaves",
        source: "tree",
        transform: [
          {
            type: "filter",
            expr: "!datum.children",
          },
        ],
      },
    ];

    //scales
    const scales = [
      {
        name: "color",
        type: "ordinal",
        domain: { data: "nodes", field: "name" },
        range: [
          "#3182bd",
          "#6baed6",
          "#9ecae1",
          "#c6dbef",
          "#e6550d",
          "#fd8d3c",
          "#fdae6b",
          "#fdd0a2",
          "#31a354",
          "#74c476",
          "#a1d99b",
          "#c7e9c0",
          "#756bb1",
          "#9e9ac8",
          "#bcbddc",
          "#dadaeb",
          "#636363",
          "#969696",
          "#bdbdbd",
          "#d9d9d9",
        ],
      },
      {
        name: "size",
        type: "ordinal",
        domain: [0, 1, 2, 3],
        range: [256, 28, 20, 14],
      },
      {
        name: "opacity",
        type: "ordinal",
        domain: [0, 1, 2, 3],
        range: [0.15, 0.5, 0.8, 1.0],
      },
    ];

    //marks
    const marks = [
      {
        type: "rect",
        from: { data: "nodes" },
        interactive: false,
        encode: {
          enter: {
            fill: { scale: "color", field: "name" },
          },
        },
        update: {
          x: { field: "x0" },
          y: { field: "y0" },
          x2: { field: "x1" },
          y2: { field: "y1" },
        },
      },
      {
        type: "rect",
        from: { data: "leaves" },
        encode: {
          enter: {
            stroke: { value: "#fff" },
          },
          update: {
            x: { field: "x0" },
            y: { field: "y0" },
            x2: { field: "x1" },
            y2: { field: "y1" },
            fill: { value: "transparent" },
          },
          hover: {
            fill: { value: "red" },
          },
        },
      },
      {
        type: "text",
        from: { data: "nodes" },
        interactive: false,
        encode: {
          enter: {
            font: { value: "Helvetica Neue, Arial" },
            align: { value: "center" },
            baseline: { value: "middle" },
            fill: { value: "#000" },
            text: { field: "name" },
            fontSize: { scale: "size", field: "depth" },
            fillOpacity: { scale: "opacity", field: "depth" },
          },
          update: {
            x: { signal: "0.5 * (datum.x0 + datum.x1)" },
            y: { signal: "0.5 * (datum.y0 + datum.y1)" },
          },
        },
      },
    ];

    const spec = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      width,
      height,
      padding,
      signals,
      data,
      scales,
      marks,
    };

    const el = this.root.querySelector("main");
    const opts = {
      renderer: "svg",
    };
    await embed(el, spec, opts);
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Treemap
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "treemap",
	"stanza:label": "Treemap",
	"stanza:definition": "Treemap MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Tree",
	"stanza:provider": "TogoStanza",
	"stanza:license": "MIT",
	"stanza:author": "anton",
	"stanza:address": "anton@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-10-25",
	"stanza:updated": "2021-10-25",
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
	},
	{
		"stanza:key": "width",
		"stanza:type": "number",
		"stanza:example": 400,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 300,
		"stanza:description": "Height"
	},
	{
		"stanza:key": "color-scale",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"schemeCategory10",
			"schemeAccent",
			"schemeDark2",
			"schemePastel2",
			"schemeSet2",
			"schemeSet1",
			"schemePastel1",
			"schemeSet3",
			"schemePaired"
		],
		"stanza:example": "schemePastel1",
		"stanza:description": "Color scale to display"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Font family"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#333333",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 11,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-border-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Border color"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 0.5,
		"stanza:description": "Border width"
	},
	{
		"stanza:key": "--togostanza-edge-color",
		"stanza:type": "color",
		"stanza:default": "#AEB3BF",
		"stanza:description": "Edge color"
	},
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "rgba(255,255,255,0)",
		"stanza:description": "Background color"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"treemap\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=treemap.js.map
