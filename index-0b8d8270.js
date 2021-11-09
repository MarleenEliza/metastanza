import './index-49bb1ecc.js';
import { s as select } from './select-9137152e.js';

function downloadImg(_svg, format, filename, root) {
  let url, img, canvas, context;
  const pngZoom = 2; // png resolution rate
  const svg = select(_svg);

  svg.attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg");

  let style = "";
  console.log('root.querySelector("style")', root.querySelector("style"));
  if (root.host && root.querySelector("style")) {
    style += root
      .querySelector("style")
      .innerHTML.replace(/[\r\n]/g, "")
      .match(/^\s*:host\s*{(.+)}\s*$/)[1];
  }
  console.log("root.host", root.host);

  const outerCode = document
    .querySelector(".overflow-auto")
    .innerHTML.replace("<code>", "")
    .replace("</code>", "");
  const customizedStyle = outerCode
    .replaceAll('""', "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .match(/<style>[\s\S]*?<\/style>/);
  if (customizedStyle) {
    //when customize styles exist
    style += customizedStyle[0]
      .replace("<style>", "")
      .replace("</style>", "")
      .replace(/[\r\n]/g, "")
      .match(/^\s*togostanza-.+\s{\s(.+\s)+}\s*$/)[1];
  }

  const tmp = svg.node().outerHTML.match(/^([^>]+>)([\s\S]+)$/);
  const string = tmp[1] + "<style>svg{" + style + "}</style>" + tmp[2];
  const w = parseInt(svg.style("width"));
  const h = parseInt(svg.style("height"));

  // downloading function
  const aLinkClickDL = function () {
    if (format === "png") {
      context.drawImage(img, 0, 0, w, h, 0, 0, w * pngZoom, h * pngZoom);
      url = canvas.node().toDataURL("image/png");
    }

    const a = select("body").append("a");
    a.attr("class", "downloadLink")
      .attr("download", filename)
      .attr("href", url)
      .text("test")
      .style("display", "none");

    a.node().click();

    setTimeout(function () {
      window.URL.revokeObjectURL(url);
      if (format === "png") {
        canvas.remove();
      }
      a.remove();
    }, 10);
  };

  if (format === "svg") {
    // SVG
    filename += ".svg";
    const blobObject = new Blob([string], {
      type: "data:image/svg+xml;base64",
    });
    url = window.URL.createObjectURL(blobObject);
    aLinkClickDL();
  } else if (format === "png") {
    // PNG
    console.log(string);
    filename += ".png";
    img = new Image();
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(string);
    img.addEventListener("load", aLinkClickDL, false);

    canvas = select("body")
      .append("canvas")
      .attr("width", w * pngZoom)
      .attr("height", h * pngZoom)
      .style("display", "none");
    context = canvas.node().getContext("2d");
  }
}

function downloadSvgMenuItem(stanza, filename) {
  return {
    type: "item",
    label: "Download SVG",
    handler: () => {
      downloadImg(
        stanza.root.querySelector("svg"),
        "svg",
        filename,
        stanza.root
      );
    },
  };
}

function downloadPngMenuItem(stanza, filename) {
  return {
    type: "item",
    label: "Download PNG",
    handler: () => {
      downloadImg(
        stanza.root.querySelector("svg"),
        "png",
        filename,
        stanza.root
      );
    },
  };
}

function appendCustomCss(stanza, customCssUrl) {
  const links = stanza.root.querySelectorAll(
    "link[data-togostanza-custom-css]"
  );
  for (const link of links) {
    link.remove();
  }

  if (customCssUrl) {
    const link = document.createElement("link");
    stanza.root.appendChild(link);

    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", customCssUrl);
    link.setAttribute("data-togostanza-custom-css", "");
  }
}

export { downloadPngMenuItem as a, appendCustomCss as b, downloadSvgMenuItem as d };
//# sourceMappingURL=index-0b8d8270.js.map
