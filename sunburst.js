import { d as defineStanzaElement } from './stanza-element-ac887ac3.js';
import { S as Stanza } from './timer-4a7721ea.js';
import './transform-450ed364.js';
import { l as loadData } from './load-data-b8c62ee7.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as appendCustomCss } from './index-c8e08cbb.js';
import { s as stratify, f as format, o as ordinal, p as partition, m as max, a as arc, i as interpolate, h as hierarchy, b as sum, c as path } from './arc-a7e8258b.js';
import { s as select } from './select-7a3cbce4.js';
import './dsv-9b0090c9.js';
import './dsv-cd3740c6.js';

class Sunburst extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "sunburstStanza"),
      downloadPngMenuItem(this, "sunburstStanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    // get value of css vars
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    const width = this.params["width"];
    const height = this.params["height"];
    const colorScale = [];

    const borderWidth = this.params["gap-width"] || 2;
    const nodesGapWidth = this.params["nodes-gap-width"] || 8;
    const cornerRadius = this.params["nodes-corner-radius"] || 0;
    const showNumbers = this.params["show-numbers"];
    const depthLim = +this.params["max-depth"] || 0;
    const scalingMethod = this.params["scaling"];

    const data = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    for (let i = 0; i < 6; i++) {
      colorScale.push(`--togostanza-series-${i}-color`);
    }

    this.renderTemplate({
      template: "stanza.html.hbs",
    });

    const filteredData = data.filter(
      (item) => (item.children && !item.n) || (item.n && item.n > 0)
    );

    //Add root element if there are more than one elements without parent. D3 cannot process data with more than one root elements
    const rootElemIndexes = [];
    for (let i = 0; i < filteredData.length - 1; i++) {
      if (!filteredData[i]?.parent) {
        rootElemIndexes.push(i);
      }
    }
    if (rootElemIndexes.length > 1) {
      filteredData.push({ id: -1, value: "", label: "" });

      rootElemIndexes.forEach((index) => {
        filteredData[index].parent = -1;
      });
    }

    const sunburstElement = this.root.querySelector("#sunburst");

    const opts = {
      css,
      width,
      height,
      colorScale,
      borderWidth,
      nodesGapWidth,
      cornerRadius,
      showNumbers,
      depthLim,
      scalingMethod,
    };

    draw(sunburstElement, filteredData, opts);
  }
}

function draw(el, dataset, opts) {
  let { depthLim } = opts;

  const {
    css,
    width,
    height,
    colorScale,
    borderWidth,
    nodesGapWidth,
    cornerRadius,
    showNumbers,
    scalingMethod,
  } = opts;

  const data = stratify()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parent;
    })(dataset);

  const formatNumber = format(",d");

  const color = ordinal(colorScale);

  const partition$1 = (data) => {
    const root = hierarchy(data);
    switch (scalingMethod) {
      case "Natural":
        root.sum((d) => d.data.n);
        break;
      case "Equal children":
        root.sum((d) => (d.children ? 0 : 1));
        break;
      case "Equal parents":
        root.each(
          (d) =>
            (d.value = d.parent ? d.parent.value / d.parent.children.length : 1)
        );
        break;
    }

    root
      .sort((a, b) => b.value - a.value)
      // store real values for number labels in d.value2
      .each((d) => (d.value2 = sum(d, (dd) => dd.data.data.n)));
    return partition().size([2 * Math.PI, root.height + 1])(root);
  };

  const root = partition$1(data);

  root.each((d) => (d.current = d));

  // if depthLim 0 of negative, show all levels
  const maxDepth = max(root, (d) => d.depth);
  if (depthLim <= 0 || depthLim > maxDepth) {
    depthLim = maxDepth;
  }

  const radius = width / ((depthLim + 1) * 2);

  const arc$1 = arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, nodesGapWidth / 500))
    .padRadius(radius * 1.5)
    .innerRadius((d) => d.y0 * radius)
    .outerRadius((d) =>
      Math.max(d.y0 * radius, d.y1 * radius - borderWidth / 2)
    )
    .cornerRadius(cornerRadius);

  const middleArcLabelLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [d.x0 - halfPi, d.x1 - halfPi];
    let r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 2.5) * radius);
      angles.reverse();
    }

    if (Math.abs(angles[1] - angles[0]) > Math.PI && d.y0 < 1) {
      angles[0] = middleAngle + Math.PI / 2;
      angles[1] = middleAngle - Math.PI / 2;

      r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 5) * radius);
    }

    const path$1 = path();
    path$1.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path$1.toString();
  };

  const middleArcNumberLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [d.x0 - halfPi, d.x1 - halfPi];
    let r = Math.max(0, (d.y0 + (d.y1 - d.y0) / 2.5) * radius);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);

      angles.reverse();
    }

    if (Math.abs(angles[1] - angles[0]) > Math.PI && d.y0 < 1) {
      r = Math.max(0, (d.y1 - (d.y1 - d.y0) / 2.5) * radius);
    }

    const path$1 = path();
    path$1.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path$1.toString();
  };

  function textFits(d, charWidth, text) {
    const deltaAngle = d.x1 - d.x0;
    const r = Math.max(0, ((d.y0 + d.y1) * radius) / 2);
    const perimeter = r * deltaAngle;

    return text.length * charWidth < perimeter;
  }

  const svg = select(el)
    .append("svg")
    .style("width", width)
    .style("height", height)
    .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);

  //Get character width
  const testText = svg
    .append("g")
    .attr("class", "labels")
    .append("text")
    .text("a");
  const CHAR_SPACE = testText.node().getComputedTextLength();
  testText.remove();

  const g = svg.append("g");

  const path$1 = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", (d) => {
      while (d.depth > 1) {
        d = d.parent;
      }
      return css(color(d.data.data.label));
    })
    .attr("fill-opacity", (d) =>
      arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
    )
    .attr("d", (d) => arc$1(d.current));

  path$1
    .filter((d) => d.children)
    .style("cursor", "pointer")
    .on("click", clicked);

  path$1.append("title").text(
    (d) =>
      `${d
        .ancestors()
        .map((d) => d.data.data.label)
        .reverse()
        .join("/")}\n${formatNumber(d.value2)}`
  );

  //add hidden arcs for text
  const textArcs = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("class", "hidden-arc")
    .attr("id", (_, i) => `hiddenLabelArc${i}`)
    .attr("d", middleArcLabelLine);

  //For numbers
  const numArcs = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("class", "hidden-arc")
    .attr("id", (_, i) => `hiddenNumberArc${i}`)
    .attr("d", middleArcNumberLine);

  // Center circle
  const parent = g
    .append("circle")
    .datum(root)
    .attr("r", radius - borderWidth / 2)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

  //Text labels
  const textLabels = g
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    .attr(
      "fill-opacity",
      (d) => +(labelVisible(d) && textFits(d, CHAR_SPACE, d.data.data.label))
    )
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("href", (_, i) => `#hiddenLabelArc${i}`)
    .text((d) => d.data.data.label);

  //Number labels
  const numLabels = g
    .append("g")
    .attr("class", "numbers")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    //Show only if label is supposed to be shown, label text fits into node and showNumbers =true
    .attr(
      "fill-opacity",
      (d) =>
        +(
          labelVisible(d) &&
          textFits(d, CHAR_SPACE, d.data.data.label) &&
          showNumbers
        )
    )
    .append("textPath")
    .attr("startOffset", "50%")
    .attr("href", (_, i) => `#hiddenNumberArc${i}`)
    .text((d) => formatNumber(d.value2));

  function clicked(event, p) {
    if (!arcVisible(p.current) && p.current.y1 > 1) {
      return;
    }

    parent.datum(p.parent || root);

    parent.attr("cursor", (d) => (d === root ? "auto" : "pointer"));

    root.each(
      (d) =>
        (d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        })
    );

    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path$1
      .transition(t)
      .tween("data", (d) => {
        const i = interpolate(d.current, d.target);
        return (t) => (d.current = i(t));
      })
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("cursor", (d) =>
        d.children && arcVisible(d.target) ? "pointer" : "auto"
      )

      .attrTween("d", (d) => () => arc$1(d.current));

    parent.transition(t).attr("fill", () => {
      let b = p;
      while (b.depth > 1) {
        b = b.parent;
      }

      return b.data?.data?.label
        ? css(color(b.data.data.label))
        : "rgba(0,0,0,0)";
    });

    textLabels
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || +labelVisible(d.target);
      })
      .transition(t)
      .attr(
        "fill-opacity",
        (d) =>
          +(
            labelVisible(d.target) &&
            textFits(d.target, CHAR_SPACE, d.data.data.label)
          )
      );

    textArcs
      .transition(t)
      .attrTween("d", (d) => () => middleArcLabelLine(d.current));

    numLabels
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      })
      .transition(t)
      .attr(
        "fill-opacity",
        (d) =>
          +(
            labelVisible(d.target) &&
            textFits(d.target, CHAR_SPACE, d.data.data.label) &&
            showNumbers
          )
      );

    numArcs
      .transition(t)
      .attrTween("d", (d) => () => middleArcNumberLine(d.current));
  }

  function arcVisible(d) {
    return d.y1 <= depthLim + 1 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= depthLim + 1 && d.y0 >= 0;
  }
}

var stanzaModule = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Sunburst
});

var metadata = {
	"@context": {
	stanza: "http://togostanza.org/resource/stanza#"
},
	"@id": "sunburst",
	"stanza:label": "Sunburst",
	"stanza:definition": "Sunburst MetaStanza",
	"stanza:type": "Stanza",
	"stanza:display": "Chart",
	"stanza:provider": "Togostanza",
	"stanza:license": "MIT",
	"stanza:author": "Anton Zhuravlev",
	"stanza:address": "anton@penqe.com",
	"stanza:contributor": [
],
	"stanza:created": "2021-10-28",
	"stanza:updated": "2021-10-28",
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
		"stanza:key": "scaling",
		"stanza:type": "single-choice",
		"stanza:choice": [
			"Natural",
			"Equal children",
			"Equal parents"
		],
		"stanza:example": "Natural",
		"stanza:description": "Scaling of nodes",
		"stanza:required": true
	},
	{
		"stanza:key": "max-depth",
		"stanza:type": "number",
		"stanza:example": 3,
		"stanza:description": "Maximum depth to show",
		"stanza:required": false
	},
	{
		"stanza:key": "show-numbers",
		"stanza:type": "boolean",
		"stanza:example": true,
		"stanza:description": "Show numbers under labels",
		"stanza:required": false
	},
	{
		"stanza:key": "gap-width",
		"stanza:type": "number",
		"stanza:example": 2,
		"stanza:description": "Gap between chart nodes levels, in px",
		"stanza:required": false
	},
	{
		"stanza:key": "nodes-gap-width",
		"stanza:type": "number",
		"stanza:example": 8,
		"stanza:description": "Gap between chart nodes that are on same level, unitless coefficient",
		"stanza:required": false
	},
	{
		"stanza:key": "nodes-corner-radius",
		"stanza:type": "number",
		"stanza:example": 0,
		"stanza:description": "Corner radius of nodes",
		"stanza:required": false
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
		"stanza:example": 400,
		"stanza:description": "Height"
	}
],
	"stanza:menu-placement": "bottom-right",
	"stanza:style": [
	{
		"stanza:key": "--togostanza-background-color",
		"stanza:type": "color",
		"stanza:default": "#eeeeee",
		"stanza:description": "Background color"
	},
	{
		"stanza:key": "--togostanza-label-text-outline",
		"stanza:type": "color",
		"stanza:default": "rgba(0,0,0,0)",
		"stanza:description": "Label text outline. 'rgba(0,0,0,0)' for no outline"
	},
	{
		"stanza:key": "--togostanza-label-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Label font family"
	},
	{
		"stanza:key": "--togostanza-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "string",
		"stanza:default": "11px",
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-label-font-weight",
		"stanza:type": "string",
		"stanza:default": "normal",
		"stanza:description": "Label font weight"
	},
	{
		"stanza:key": "--togostanza-number-label-font-family",
		"stanza:type": "text",
		"stanza:default": "Helvetica Neue",
		"stanza:description": "Number label font family"
	},
	{
		"stanza:key": "--togostanza-number-label-font-color",
		"stanza:type": "color",
		"stanza:default": "#4E5059",
		"stanza:description": "Number label font color"
	},
	{
		"stanza:key": "--togostanza-number-label-font-size",
		"stanza:type": "string",
		"stanza:default": "7px",
		"stanza:description": "Number label font size"
	},
	{
		"stanza:key": "--togostanza-number-label-font-weight",
		"stanza:type": "string",
		"stanza:default": "normal",
		"stanza:description": "Number label font weight"
	},
	{
		"stanza:key": "--togostanza-series-0-color",
		"stanza:type": "color",
		"stanza:default": "#6590e6",
		"stanza:description": "Color 1"
	},
	{
		"stanza:key": "--togostanza-series-1-color",
		"stanza:type": "color",
		"stanza:default": "#3ac9b6",
		"stanza:description": "Color 2"
	},
	{
		"stanza:key": "--togostanza-series-2-color",
		"stanza:type": "color",
		"stanza:default": "#9ede2f",
		"stanza:description": "Color 3"
	},
	{
		"stanza:key": "--togostanza-series-3-color",
		"stanza:type": "color",
		"stanza:default": "#F5DA64",
		"stanza:description": "Color 4"
	},
	{
		"stanza:key": "--togostanza-series-4-color",
		"stanza:type": "color",
		"stanza:default": "#F57F5B",
		"stanza:description": "Color 5"
	},
	{
		"stanza:key": "--togostanza-series-5-color",
		"stanza:type": "color",
		"stanza:default": "#F75976",
		"stanza:description": "Color 6"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"sunburst\"></div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=sunburst.js.map
