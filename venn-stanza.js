import { d as defineStanzaElement } from './stanza-element-6b870fae.js';
import { S as Stanza } from './timer-a4127ebb.js';
import { l as loadData } from './load-data-22873c13.js';
import { d as downloadSvgMenuItem, a as downloadPngMenuItem, b as appendCustomCss, s as select } from './metastanza_utils-23320c62.js';
import './dsv-cd3740c6.js';

class VennStanza extends Stanza {
  menu() {
    return [
      downloadSvgMenuItem(this, "vennstanza"),
      downloadPngMenuItem(this, "vennstanza"),
    ];
  }

  async render() {
    appendCustomCss(this, this.params["custom-css-url"]);
    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    this.renderTemplate({ template: 'stanza.html.hbs' });

    //set common parameters and styles
    const width = this.params['width'];
    const height = this.params['height'];
    const colorScheme = [
      css('--togostanza-series-0-color'),
      css('--togostanza-series-1-color'),
      css('--togostanza-series-2-color'),
      css('--togostanza-series-3-color'),
      css('--togostanza-series-4-color'),
      css('--togostanza-series-5-color')
    ];

    // draw venn diagram
    // const drawArea = this.root.querySelector('#drawArea'); //TODO: set to use tooltip
    const vennElement = this.root.querySelector('#venn-diagrams');
    const vennGroup = select(vennElement);

    vennGroup
      .attr('width', width)
      .attr('height', height);

    //get data
    let dataset = await loadData(
      this.params["data-url"],
      this.params["data-type"]
    );

    //convert data
    for (let i = 0; i < dataset.length; i++) {
      dataset[i].orgs = dataset[i].orgs.split(', ');
      dataset[i].count = Number(dataset[i].count);
    }

    // get circle number to draw
    let datasetNums = [];
    for (let i = 0; i < dataset.length; i++) {
      datasetNums.push(dataset[i].orgs.length);
    }

    const aryMax = function (a, b) { return Math.max(a, b); };
    const circleNum = datasetNums.reduce(aryMax); //TODO 円の数はユーザーParameterとして入力する形でもいいかもしれません

    // show venn diagram corresponds to data(circle numbers to draw)
    const vennDiagrams = this.root.querySelectorAll('.venn-diagram');
    Array.from(vennDiagrams).forEach((vennDiagram, i) => {
      vennDiagram.getAttribute('id') === `venn-diagram${circleNum}` ? vennDiagram.style.display = "block" : vennDiagram.style.display = "none";
    });

    // assign labels to each circles : set as parameter by user 
    const LABEL0 = this.params["label-0"];
    const LABEL1 = this.params["label-1"];
    const LABEL2 = this.params["label-2"];
    const LABEL3 = this.params["label-3"];
    const LABEL4 = this.params["label-4"];

    //get paths(=venn shapes) and texts(=venn labels), and these nodelists are listed in vennSet3Arr's order
    const part1Paths = this.root.querySelectorAll('.part1-path');
    const part1Texts = this.root.querySelectorAll('.part1-text');
    const vennSet1Arr = ['1-0'];

    const part2Paths = this.root.querySelectorAll('.part2-path');
    const part2Texts = this.root.querySelectorAll('.part2-text');
    const vennSet2Arr = ['2-0', '2-1', '2-0_1'];

    const part3Paths = this.root.querySelectorAll('.part3-path');
    const part3Texts = this.root.querySelectorAll('.part3-text');
    const vennSet3Arr = ['3-0', '3-1', '3-2', '3-0_1', '3-0_2', '3-1_2', '3-0_1_2'];

    const part4Paths = this.root.querySelectorAll('.part4-path');
    const part4Texts = this.root.querySelectorAll('.part4-text');
    const vennSet4Arr = ['4-0', '4-1', '4-2', '4-3', '4-0_1', '4-0_2', '4-0_3', '4-1_2', '4-1_3', '4-2_3', '4-0_1_2', '4-0_1_3', '4-0_2_3', '4-1_2_3', '4-0_1_2_3'];

    const part5Paths = this.root.querySelectorAll('.part5-path');
    const part5Texts = this.root.querySelectorAll('.part5-text');
    const vennSet5Arr = ['5-0', '5-1', '5-2', '5-3', '5-4', '5-0_1', '5-0_2', '5-0_3', '5-0_4', '5-1_2', '5-1_3', '5-1_4', '5-2_3', '5-2_4', '5-3_4', '5-0_1_2', '5-0_1_3', '5-0_1_4', '5-0_2_3', '5-0_2_4', '5-0_3_4', '5-1_2_3', '5-1_2_4', '5-1_3_4', '5-2_3_4', '5-0_1_2_3', '5-0_1_2_4', '5-0_1_3_4', '5-0_2_3_4', '5-1_2_3_4', '5-0_1_2_3_4'];

    //set venn diagram depends on circle numbers //TODO: check and adjust opacity value
    switch (circleNum) {
      case 1:
        set1Venn();
        part1Paths[0].setAttribute('fill',colorScheme[0].trim());
        break;
      case 2:
        set2Venn();
        const part2ColorScheme = [
          colorScheme[0].trim(),
          colorScheme[1].trim(),
          '#FFFFFF'
        ];
        part2Paths.forEach((path, i) => {path.setAttribute('fill', part2ColorScheme[i]);});
        break;
      case 3:
        set3Venn();
        const part3ColorScheme = [
          colorScheme[0].trim(),
          colorScheme[1].trim(),
          colorScheme[2].trim(),
          rgb2hex(blendRgb(.8, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()))),
          rgb2hex(blendRgb(.8, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[2].trim()))),
          rgb2hex(blendRgb(.8, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()))),
          '#FFFFFF'
        ];
        part3Paths.forEach((path, i) => {path.setAttribute('fill', part3ColorScheme[i]);});
        break;
      case 4:
        set4Venn();
        const part4ColorScheme = [
          colorScheme[0].trim(),
          colorScheme[1].trim(),
          colorScheme[2].trim(),
          colorScheme[3].trim(),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()))),
          '#FFFFFF'
        ];
        part4Paths.forEach((path, i) => {path.setAttribute('fill', part4ColorScheme[i]);});
        break;
      case 5:
        set5Venn();
        const part5ColorScheme = [
          colorScheme[0].trim(),
          colorScheme[1].trim(),
          colorScheme[2].trim(),
          colorScheme[3].trim(),
          colorScheme[4].trim(),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[3].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[3].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[3].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[3].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[0].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()), hex2rgb(colorScheme[4].trim()))),
          rgb2hex(blendRgb(.6, hex2rgb(colorScheme[1].trim()), hex2rgb(colorScheme[2].trim()), hex2rgb(colorScheme[3].trim()), hex2rgb(colorScheme[4].trim()))),
          '#FFFFFF'
        ];
        part5Paths.forEach((path, i) => {path.setAttribute('fill', part5ColorScheme[i]);});
        break;
      default:
        console.log(`Circle number(${circleNum}) is invalid. Please set from 1 to 5 circles.`);
    }

    //convert hex to rgb (retrun [red, green, blue])
    function hex2rgb(colorCode){
      const red = parseInt(colorCode.substring(1, 3), 16);
      const green = parseInt(colorCode.substring(3, 5), 16);
      const blue = parseInt(colorCode.substring(5, 7), 16);
      return [red,green,blue];
    }
    
    //convert hex to rgb (retrun [red, green, blue])
    function rgb2hex(rgb) {
      return "#" + rgb.map(  value => {
        return ("0" + value.toString(16)).slice(-2);
      } ).join( "" ) ;
    }

    //blend two colors to draw overlapping color
    //rgbArr is supporsed to be like [red, green, blue]
    function blendRgb(opacity, rgbArr1, rgbArr2, rgbArr3, rgbArr4){
      rgbArr3 ? rgbArr3 : rgbArr3 = [0,0,0];
      rgbArr4 ? rgbArr4 : rgbArr4 = [0,0,0];

      let red = Math.round((rgbArr1[0] + rgbArr2[0] + rgbArr3[0] + rgbArr4[0]) * opacity);
      let green = Math.round((rgbArr1[1] + rgbArr2[1] + rgbArr3[1] + rgbArr4[1]) * opacity);
      let blue = Math.round((rgbArr1[2] + rgbArr2[2] + rgbArr3[2] + rgbArr4[2]) * opacity);

      red > 255 ? red = 255 : red; 
      green > 255 ? green = 255 : green; 
      blue > 255 ? blue = 255 : blue;       
      
      return [red, green, blue];
    }

    // //set tooltip for fixed venn 
    // const tooltip = d3.select(drawArea) //TODO: set tooltip
    //   .append('div')
    //   .attr('class', 'fixed-tooltip');

    //function: set highlight event which fire when hovered
    function highlightParts(vennSetArr, pathsArr, TextsArr, targetElm, label, count) {
      select(targetElm)
        .on("mouseenter", function (e) {
          // tooltip //TODO: set tooltip
          //   .style("display", "block")
          //   .style("left", `${d3.pointer(e)[0] + 8}px`)
          //   .style(
          //     "top",
          //     `${d3.pointer(e)[1]}px`
          //   ).html(`
          //     <p>Organisms: ${label}</p>
          //     <p>Count: ${count}</p>
          //     `);
          //highlight the selected part
          for (let i = 0; i < vennSetArr.length; i++) {
            if (targetElm.id === `venn-shape-set${vennSetArr[i]}` || targetElm.id === `venn-text-set${vennSetArr[i]}`) {
              pathsArr[i].dataset.highlight = "selected";
              TextsArr[i].dataset.highlight = "selected";
            } else {
              pathsArr[i].dataset.highlight = "unselected";
              TextsArr[i].dataset.highlight = "unselected";
            }
          }
        })
        .on("mousemove", function (e) {
          // tooltip //TODO: set tooltip
          //   .style("left", `${d3.pointer(e)[0] + 8}px`)
          //   .style(
          //     "top",
          //     `${d3.pointer(e)[1]}px`
          //   )
        })
        .on("mouseleave", function () {
          tooltip.style("display", "none");
          Array.from(pathsArr).forEach(path => {
            path.dataset.highlight = "default";
          });
          Array.from(TextsArr).forEach(text => {
            text.dataset.highlight = "default";
          });
        });
    }

    //【organism num: 2】set highlight event and count labels to each parts
    function set1Venn() {
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean

        if (hasLabel0) { //1-0 (=vennSet1Arr[0])
          highlightParts(vennSet1Arr, part1Paths, part1Texts, part1Paths[0], data.orgs, data.count);
          highlightParts(vennSet1Arr, part1Paths, part1Texts, part1Texts[0], data.orgs, data.count);
          part1Texts[0].textContent = data.count;
        }      });
    }

    //【organism num: 2】set highlight event and count labels to each parts
    function set2Venn() {
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
        const hasLabel1 = orgArray.includes(LABEL1); //boolean

        if (hasLabel0 && hasLabel1) { //2-0_1 (=vennSet2Arr[2])
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Paths[2], data.orgs, data.count);
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Texts[2], data.orgs, data.count);
          part2Texts[2].textContent = data.count;
        } else if (hasLabel1) { //2-1 (=vennSet2Arr[1])
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Paths[1], data.orgs, data.count);
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Texts[1], data.orgs, data.count);
          part2Texts[1].textContent = data.count;
        } else if (hasLabel0) { //2-0 (=vennSet2Arr[0])
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Paths[0], data.orgs, data.count);
          highlightParts(vennSet2Arr, part2Paths, part2Texts, part2Texts[0], data.orgs, data.count);
          part2Texts[0].textContent = data.count;
        }      });
    }

    //【organism num: 3】set highlight event and count labels to each parts
    function set3Venn() {
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
        const hasLabel1 = orgArray.includes(LABEL1); //boolean
        const hasLabel2 = orgArray.includes(LABEL2); //boolean

        if (hasLabel0 && hasLabel1 && hasLabel2) { //3-0_1_2 (=vennSet3Arr[6])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[6], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[6], data.orgs, data.count);
          part3Texts[6].textContent = data.count;
        } else if (hasLabel0 && hasLabel1) { //3-0_1 (=vennSet3Arr[3])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[3], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[3], data.orgs, data.count);
          part3Texts[3].textContent = data.count;
        } else if (hasLabel1 && hasLabel2) { //3-1_2 (=vennSet3Arr[5])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[5], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[5], data.orgs, data.count);
          part3Texts[5].textContent = data.count;
        } else if (hasLabel0 && hasLabel2) { //3-0_2 (=vennSet3Arr[4])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[4], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[4], data.orgs, data.count);
          part3Texts[4].textContent = data.count;
        } else if (hasLabel0) { //3-0 (=vennSet3Arr[0])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[0], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[0], data.orgs, data.count);
          part3Texts[0].textContent = data.count;
        } else if (hasLabel1) { //3-1 (=vennSet3Arr[1])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[1], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[1], data.orgs, data.count);
          part3Texts[1].textContent = data.count;
        } else if (hasLabel2) { //3-1 (=vennSet3Arr[2])
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Paths[2], data.orgs, data.count);
          highlightParts(vennSet3Arr, part3Paths, part3Texts, part3Texts[2], data.orgs, data.count);
          part3Texts[2].textContent = data.count;
        }      });
    }

    //【organism num: 4】set highlight event and count labels to each parts
    function set4Venn() {
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
        const hasLabel1 = orgArray.includes(LABEL1); //boolean
        const hasLabel2 = orgArray.includes(LABEL2); //boolean
        const hasLabel3 = orgArray.includes(LABEL3); //boolean

        if (hasLabel0 && hasLabel1 && hasLabel2 && hasLabel3) { //4-0_1_2_3 (=vennSet4Arr[14])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[14], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[14], data.orgs, data.count);
          part4Texts[14].textContent = data.count;
        } else if (hasLabel1 && hasLabel2 && hasLabel3) { //4-1_2_3 (=vennSet4Arr[13])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[13], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[13], data.orgs, data.count);
          part4Texts[13].textContent = data.count;
        } else if (hasLabel0 && hasLabel2 && hasLabel3) { //4-0_2_3 (=vennSet4Arr[12])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[12], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[12], data.orgs, data.count);
          part4Texts[12].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel3) { //4-0_1_3 (=vennSet4Arr[11])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[11], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[11], data.orgs, data.count);
          part4Texts[11].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel2) { //4-0_1_2 (=vennSet4Arr[10])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[10], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[10], data.orgs, data.count);
          part4Texts[10].textContent = data.count;
        } else if (hasLabel2 && hasLabel3) { //4-2_3 (=vennSet4Arr[9])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[9], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[9], data.orgs, data.count);
          part4Texts[9].textContent = data.count;
        } else if (hasLabel1 && hasLabel3) { //4-1_3 (=vennSet4Arr[8])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[8], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[8], data.orgs, data.count);
          part4Texts[8].textContent = data.count;
        } else if (hasLabel1 && hasLabel2) { //4-1_2 (=vennSet4Arr[7])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[7], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[7], data.orgs, data.count);
          part4Texts[7].textContent = data.count;
        } else if (hasLabel0 && hasLabel3) { //4-0_3 (=vennSet4Arr[6])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[6], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[6], data.orgs, data.count);
          part4Texts[6].textContent = data.count;
        } else if (hasLabel0 && hasLabel2) { //4-0_2 (=vennSet4Arr[5])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[5], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[5], data.orgs, data.count);
          part4Texts[5].textContent = data.count;
        } else if (hasLabel0 && hasLabel1) { //4-0_1 (=vennSet4Arr[4])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[4], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[4], data.orgs, data.count);
          part4Texts[4].textContent = data.count;
        } else if (hasLabel3) { //4-3 (=vennSet4Arr[3])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[3], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[3], data.orgs, data.count);
          part4Texts[3].textContent = data.count;
        } else if (hasLabel2) { //4-2 (=vennSet4Arr[2])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[2], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[2], data.orgs, data.count);
          part4Texts[2].textContent = data.count;
        } else if (hasLabel1) { //4-1 (=vennSet4Arr[1])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[1], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[1], data.orgs, data.count);
          part4Texts[1].textContent = data.count;
        } else if (hasLabel0) { //4-0 (=vennSet4Arr[0])
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Paths[0], data.orgs, data.count);
          highlightParts(vennSet4Arr, part4Paths, part4Texts, part4Texts[0], data.orgs, data.count);
          part4Texts[0].textContent = data.count;
        }      });
    }

    //【organism num: 5】set highlight event and count labels to each parts
    function set5Venn() {
      dataset.forEach(data => {
        const orgArray = data.orgs;
        const hasLabel0 = orgArray.includes(LABEL0); //boolean
        const hasLabel1 = orgArray.includes(LABEL1); //boolean
        const hasLabel2 = orgArray.includes(LABEL2); //boolean
        const hasLabel3 = orgArray.includes(LABEL3); //boolean
        const hasLabel4 = orgArray.includes(LABEL4); //boolean

        if (hasLabel0 && hasLabel1 && hasLabel2 && hasLabel3 && hasLabel4) { //5-0_1_2_3_4 (=vennSet5Arr[14])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[30], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[30], data.orgs, data.count);
          part5Texts[30].textContent = data.count;
        } else if (hasLabel1 && hasLabel2 && hasLabel3 && hasLabel4) { //5-1_2_3_4 (=vennSet5Arr[29])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[29], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[29], data.orgs, data.count);
          part5Texts[29].textContent = data.count;
        } else if (hasLabel0 && hasLabel2 && hasLabel3 && hasLabel4) { //5-0_2_3_4 (=vennSet5Arr[28])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[28], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[28], data.orgs, data.count);
          part5Texts[28].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel3 && hasLabel4) { //5-0_1_3_4 (=vennSet5Arr[27])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[27], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[27], data.orgs, data.count);
          part5Texts[27].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel2 && hasLabel4) { //5-0_1_2_4 (=vennSet5Arr[26])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[26], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[26], data.orgs, data.count);
          part5Texts[26].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel2 && hasLabel3) { //5-0_1_2_3 (=vennSet5Arr[25])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[25], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[25], data.orgs, data.count);
          part5Texts[25].textContent = data.count;
        } else if (hasLabel2 && hasLabel3 && hasLabel4) { //5-2_3_4 (=vennSet5Arr[24])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[24], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[24], data.orgs, data.count);
          part5Texts[24].textContent = data.count;
        } else if (hasLabel1 && hasLabel3 && hasLabel4) { //5-1_3_4 (=vennSet5Arr[23])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[23], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[23], data.orgs, data.count);
          part5Texts[23].textContent = data.count;
        } else if (hasLabel1 && hasLabel2 && hasLabel4) { //5-1_2_4 (=vennSet5Arr[22])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[22], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[22], data.orgs, data.count);
          part5Texts[22].textContent = data.count;
        } else if (hasLabel1 && hasLabel2 && hasLabel3) { //5-1_2_3 (=vennSet5Arr[21])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[21], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[21], data.orgs, data.count);
          part5Texts[21].textContent = data.count;
        } else if (hasLabel0 && hasLabel3 && hasLabel4) { //5-0_3_4 (=vennSet5Arr[20])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[20], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[20], data.orgs, data.count);
          part5Texts[20].textContent = data.count;
        } else if (hasLabel0 && hasLabel2 && hasLabel4) { //5-0_2_4 (=vennSet5Arr[19])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[19], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[19], data.orgs, data.count);
          part5Texts[19].textContent = data.count;
        } else if (hasLabel0 && hasLabel2 && hasLabel3) { //5-0_2_3 (=vennSet5Arr[18])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[18], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[18], data.orgs, data.count);
          part5Texts[18].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel4) { //5-0_1_4 (=vennSet5Arr[17])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[17], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[17], data.orgs, data.count);
          part5Texts[17].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel3) { //5-0_1_3 (=vennSet5Arr[16])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[16], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[16], data.orgs, data.count);
          part5Texts[16].textContent = data.count;
        } else if (hasLabel0 && hasLabel1 && hasLabel2) { //5-0_1_2 (=vennSet5Arr[15])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[15], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[15], data.orgs, data.count);
          part5Texts[15].textContent = data.count;
        } else if (hasLabel3 && hasLabel4) { //5-3_4 (=vennSet5Arr[14])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[14], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[14], data.orgs, data.count);
          part5Texts[14].textContent = data.count;
        } else if (hasLabel2 && hasLabel4) { //5-2_4 (=vennSet5Arr[13])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[13], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[13], data.orgs, data.count);
          part5Texts[13].textContent = data.count;
        } else if (hasLabel2 && hasLabel3) { //5-2_3 (=vennSet5Arr[12])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[12], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[12], data.orgs, data.count);
          part5Texts[12].textContent = data.count;
        } else if (hasLabel1 && hasLabel4) { //5-1_4 (=vennSet5Arr[11])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[11], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[11], data.orgs, data.count);
          part5Texts[11].textContent = data.count;
        } else if (hasLabel1 && hasLabel3) { //5-1_3 (=vennSet5Arr[10])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[10], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[10], data.orgs, data.count);
          part5Texts[10].textContent = data.count;
        } else if (hasLabel1 && hasLabel2) { //5-1_2 (=vennSet5Arr[9])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[9], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[9], data.orgs, data.count);
          part5Texts[9].textContent = data.count;
        } else if (hasLabel0 && hasLabel4) { //5-0_4 (=vennSet5Arr[8])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[8], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[8], data.orgs, data.count);
          part5Texts[8].textContent = data.count;
        } else if (hasLabel0 && hasLabel3) { //5-0_3 (=vennSet5Arr[7])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[7], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[7], data.orgs, data.count);
          part5Texts[7].textContent = data.count;
        } else if (hasLabel0 && hasLabel2) { //5-0_2 (=vennSet5Arr[6])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[6], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[6], data.orgs, data.count);
          part5Texts[6].textContent = data.count;
        } else if (hasLabel0 && hasLabel1) { //5-0_1 (=vennSet5Arr[5])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[5], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[5], data.orgs, data.count);
          part5Texts[5].textContent = data.count;
        } else if (hasLabel4) { //5-4 (=vennSet5Arr[4])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[4], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[4], data.orgs, data.count);
          part5Texts[4].textContent = data.count;
        } else if (hasLabel3) { //4-3 (=vennSet5Arr[3])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[3], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[3], data.orgs, data.count);
          part5Texts[3].textContent = data.count;
        } else if (hasLabel2) { //5-2 (=vennSet5Arr[2])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[2], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[2], data.orgs, data.count);
          part5Texts[2].textContent = data.count;
        } else if (hasLabel1) { //5-1 (=vennSet5Arr[1])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[1], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[1], data.orgs, data.count);
          part5Texts[1].textContent = data.count;
        } else if (hasLabel0) { //5-0 (=vennSet5Arr[0])
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Paths[0], data.orgs, data.count);
          highlightParts(vennSet5Arr, part5Paths, part5Texts, part5Texts[0], data.orgs, data.count);
          part5Texts[0].textContent = data.count;
        }      });
    }

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
			"original",
			"rings",
			"mono"
		],
		"stanza:example": "original",
		"stanza:description": "Type of benn diagram",
		"stanza:required": true
	},
	{
		"stanza:key": "data-url",
		"stanza:example": "https://c-nakashima.github.io/metastanza-dev-test/venn-3orgs-sparql.json",
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
		"stanza:example": "sparql-results-json",
		"stanza:description": "Data type",
		"stanza:required": true
	},
	{
		"stanza:key": "label-0",
		"stanza:type": "string",
		"stanza:example": "10090",
		"stanza:description": "Label name",
		"stanza:required": true
	},
	{
		"stanza:key": "label-1",
		"stanza:type": "string",
		"stanza:example": "7955",
		"stanza:description": "Label name",
		"stanza:required": false
	},
	{
		"stanza:key": "label-2",
		"stanza:type": "string",
		"stanza:example": "9606",
		"stanza:description": "Label name",
		"stanza:required": false
	},
	{
		"stanza:key": "label-3",
		"stanza:type": "string",
		"stanza:example": "9601",
		"stanza:description": "Label name",
		"stanza:required": false
	},
	{
		"stanza:key": "label-4",
		"stanza:type": "string",
		"stanza:example": "9606",
		"stanza:description": "Label name",
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
		"stanza:example": 800,
		"stanza:description": "Width"
	},
	{
		"stanza:key": "height",
		"stanza:type": "number",
		"stanza:example": 380,
		"stanza:description": "Height"
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
		"stanza:default": "#FFFFFF",
		"stanza:description": "Label font color"
	},
	{
		"stanza:key": "--togostanza-label-font-size",
		"stanza:type": "number",
		"stanza:default": 20,
		"stanza:description": "Label font size"
	},
	{
		"stanza:key": "--togostanza-border-width",
		"stanza:type": "number",
		"stanza:default": 2,
		"stanza:description": "Border width"
	},
	{
		"stanza:key": "--togostanza-border-opacity",
		"stanza:type": "number",
		"stanza:default": 0.5,
		"stanza:description": "Border opacity"
	},
	{
		"stanza:key": "--togostanza-opacity",
		"stanza:type": "number",
		"stanza:default": 0.5,
		"stanza:description": "Fill opacity"
	}
],
	"stanza:incomingEvent": [
],
	"stanza:outgoingEvent": [
]
};

var templates = [
  ["stanza.html.hbs", {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"drawArea\">\n  <svg id=\"venn-diagrams\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n    xmlns:a=\"http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/\" xml:space=\"preserve\">\n\n    <!-- 1 -->\n    <g class=\"venn-diagram\" id=\"venn-diagram1\">\n      <circle class=\"part part1-path\" id=\"venn-shape-set1-0\" cx=\"182.5\" cy=\"182.5\" r=\"90\" />\n      <text class=\"part1-text\" id=\"venn-text-set1-0\" text-anchor=\"middle\" x=\"182.5\" y=\"185\"></text>\n    </g>\n\n    <!-- 2 -->\n    <g class=\"venn-diagram\" id=\"venn-diagram2\">\n      <path class=\"part part2-path\" id=\"venn-shape-set2-0\" d=\"M182.5,62.5c-49.7,0-90,40.3-90,90c0,10.5,1.8,20.6,5.1,30c12.4-35,45.7-60,84.9-60s72.5,25,84.9,60\n						c3.3-9.4,5.1-19.5,5.1-30C272.5,102.8,232.2,62.5,182.5,62.5z\" />\n      <path class=\"part part2-path\" id=\"venn-shape-set2-1\" d=\"M182.5,242.5c-39.2,0-72.5-25-84.9-60c-3.3,9.4-5.1,19.5-5.1,30c0,49.7,40.3,90,90,90s90-40.3,90-90\n						c0-10.5-1.8-20.6-5.1-30C255,217.5,221.7,242.5,182.5,242.5z\" />\n      <path class=\"part part2-path\" id=\"venn-shape-set2-0_1\" opacity=\"0.4\" d=\"M182.5,122.5c-39.2,0-72.5,25-84.9,60c12.4,35,45.7,60,84.9,60s72.5-25,84.9-60\n						C255,147.5,221.7,122.5,182.5,122.5z\" />\n      <text class=\"part2-text\" id=\"venn-text-set2-0\" text-anchor=\"middle\" x=\"182.5\" y=\"100\"></text>\n      <text class=\"part2-text\" id=\"venn-text-set2-1\" text-anchor=\"middle\" x=\"182.5\" y=\"273\"></text>\n      <text class=\"part2-text\" id=\"venn-text-set2-0_1\" text-anchor=\"middle\" x=\"182.5\" y=\"185\"></text>\n    </g>\n\n    <!-- 3 -->\n    <g class=\"venn-diagram\" id=\"venn-diagram3\">\n      <path class=\"part part3-path\" id=\"venn-shape-set3-0\" d=\"M182.5,135.1c25.9-12.4,57.2-12.3,84,3.2c2,1.1,3.9,2.4,5.7,3.6c-3.5-46.5-42.3-83.2-89.7-83.2\n							S96.3,95.4,92.8,142c1.9-1.3,3.8-2.5,5.7-3.6C125.3,122.9,156.6,122.7,182.5,135.1z\" />\n      <path class=\"part part3-path\" id=\"venn-shape-set3-1\" d=\"M272.2,142c0.2,2.2,0.3,4.5,0.3,6.8c0,30.9-15.5,58.1-39.2,74.3c-2.2,28.6-18,55.7-44.7,71.1\n						c-2,1.1-4,2.2-6,3.2c42,20.2,93.2,5,116.9-36.1C323.1,220.2,310.8,168.2,272.2,142z\" />\n      <path class=\"part part3-path\" id=\"venn-shape-set3-2\" d=\"M131.7,223.1c-23.7-16.2-39.2-43.4-39.2-74.3c0-2.3,0.1-4.6,0.3-6.8c-38.6,26.3-50.9,78.2-27.2,119.3\n						c23.7,41.1,74.9,56.3,116.9,36.1c-2-1-4-2-6-3.2C149.7,278.8,133.9,251.7,131.7,223.1z\" />\n      <path class=\"part part3-path\" id=\"venn-shape-set3-0_1\" d=\"M182.5,135.1c15.8,7.6,29.6,19.8,39,36.1s13.1,34.3,11.8,51.8c23.7-16.2,39.2-43.4,39.2-74.3\n						c0-2.3-0.1-4.6-0.3-6.8c-1.9-1.3-3.8-2.5-5.7-3.6C239.7,122.9,208.4,122.7,182.5,135.1z\" />\n      <path class=\"part part3-path\" id=\"venn-shape-set3-0_2\" d=\"M131.7,223.1c-1.3-17.5,2.4-35.5,11.8-51.8s23.2-28.6,39-36.1c-25.9-12.4-57.2-12.3-84,3.2\n						c-2,1.1-3.9,2.4-5.7,3.6c-0.2,2.2-0.3,4.5-0.3,6.8C92.5,179.6,108,206.9,131.7,223.1z\" />\n      <path class=\"part part3-path\" id=\"venn-shape-set3-1_2\" d=\"M233.3,223.1c-14.5,9.9-31.9,15.7-50.8,15.7s-36.3-5.8-50.8-15.7c2.2,28.6,18,55.7,44.7,71.1\n						c2,1.1,4,2.2,6,3.2c2-1,4-2,6-3.2C215.3,278.8,231.1,251.7,233.3,223.1z\" />\n      <path class=\"part part3-path\" id=\"venn-shape-set3-0_1_2\" d=\"M221.5,171.3c-9.4-16.3-23.2-28.6-39-36.1c-15.8,7.6-29.6,19.8-39,36.1\n						s-13.1,34.3-11.8,51.8c14.5,9.9,31.9,15.7,50.8,15.7s36.3-5.8,50.8-15.7C234.6,205.6,230.9,187.6,221.5,171.3z\" />\n      <text class=\"part3-text\" id=\"venn-text-set3-0\" text-anchor=\"middle\" x=\"182.5\" y=\"105\"></text>\n      <text class=\"part3-text\" id=\"venn-text-set3-1\" text-anchor=\"middle\" x=\"264\" y=\"240\"></text>\n      <text class=\"part3-text\" id=\"venn-text-set3-2\" text-anchor=\"middle\" x=\"102\" y=\"240\"></text>\n      <text class=\"part3-text\" id=\"venn-text-set3-0_1\" text-anchor=\"middle\" x=\"242\" y=\"163\"></text>\n      <text class=\"part3-text\" id=\"venn-text-set3-0_2\" text-anchor=\"middle\" x=\"122\" y=\"163\"></text>\n      <text class=\"part3-text\" id=\"venn-text-set3-1_2\" text-anchor=\"middle\" x=\"182.5\" y=\"265\"></text>\n      <text class=\"part3-text\" id=\"venn-text-set3-0_1_2\" text-anchor=\"middle\" x=\"182.5\" y=\"197\"></text>\n    </g>\n\n    <!-- 4 -->\n    <g class=\"venn-diagram\" id=\"venn-diagram4\">\n      <path class=\"part part4-path\" id=\"venn-shape-set4-0\" d=\"M247.2,98.5c16.1-1.5,31.3,0.5,44.4,5.9c-2.6-8.9-6.9-17-12.9-24.2c-21-25-58.1-31.2-96.2-19.7\n						c19.7,5.9,39.6,16.6,57.7,31.7C242.6,94.3,244.9,96.4,247.2,98.5z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-1\" d=\"M291.6,104.4c5,17.1,3.9,36.8-2.8,56.5c10.1,30,7.5,59.8-10,80.7c-7,8.4-15.9,14.7-26,18.9\n						c-2.6,8.9-6.9,17-12.9,24.2c-13.7,16.3-34.2,24.6-57.3,25.2c30.8,0.9,66.2-11.8,96.5-37.2c53.1-44.6,70.4-111.5,38.5-149.5\n						C310.6,114.9,301.7,108.6,291.6,104.4z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-2\" d=\"M125.2,284.8c-6-7.2-10.3-15.3-12.9-24.2c-10.1-4.2-19-10.5-26-18.9c-17.6-21-20.2-50.8-10-80.7\n						c-6.7-19.8-7.8-39.4-2.8-56.5c-10.1,4.2-19,10.5-26,18.9c-31.9,38-14.6,104.9,38.5,149.5c30.3,25.4,65.8,38.1,96.5,37.2\n						C159.3,309.4,138.8,301.1,125.2,284.8z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-3\" d=\"M117.8,98.5c2.3-2.1,4.6-4.2,7-6.3c18.1-15.2,38-25.8,57.7-31.7c-38.1-11.5-75.2-5.3-96.2,19.7\n						c-6,7.2-10.3,15.3-12.9,24.2C86.5,99,101.8,97,117.8,98.5z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-0_1\"\n        d=\"M247.2,98.5c20,18.7,34.2,40.6,41.6,62.5c6.7-19.8,7.8-39.4,2.8-56.5C278.5,99,263.2,97,247.2,98.5z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-0_2\" d=\"M111.5,217.2C94.8,200,82.8,180.4,76.2,161c-10.1,30-7.5,59.8,10,80.7c7,8.4,15.9,14.7,26,18.9\n						C108.4,247.3,108.2,232.5,111.5,217.2z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-0_3\" d=\"M117.8,98.5c21.1,1.9,43.6,9.7,64.7,23.1c21.1-13.4,43.6-21.2,64.7-23.1c-2.3-2.1-4.6-4.2-7-6.3\n						c-18.1-15.2-38-25.8-57.7-31.7c-19.7,5.9-39.6,16.6-57.7,31.7C122.4,94.3,120.1,96.4,117.8,98.5z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-1_2\" d=\"M239.8,284.8c6-7.2,10.3-15.3,12.9-24.2c-20,8.3-44.9,8.5-70.2,0.9c-25.3,7.6-50.2,7.5-70.2-0.9\n						c2.6,8.9,6.9,17,12.9,24.2c13.7,16.3,34.2,24.6,57.3,25.2C205.7,309.4,226.2,301.1,239.8,284.8z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-1_3\" d=\"M252.7,260.6c10.1-4.2,19-10.5,26-18.9c17.6-21,20.2-50.8,10-80.7c-6.6,19.5-18.5,39-35.2,56.3\n						C256.8,232.5,256.6,247.3,252.7,260.6z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-2_3\"\n        d=\"M76.2,161c7.4-21.8,21.5-43.8,41.6-62.5c-16.1-1.5-31.3,0.5-44.4,5.9C68.4,121.6,69.6,141.2,76.2,161z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-0_1_2\" d=\"M111.5,217.2c-3.2,15.2-3.1,30,0.8,43.3c20,8.3,44.9,8.5,70.2,0.9c-19.7-5.9-39.6-16.6-57.7-31.7\n						C120.1,225.7,115.6,221.5,111.5,217.2z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-0_1_3\" d=\"M247.2,98.5c-21.1,1.9-43.6,9.7-64.7,23.1c6.4,4.1,12.7,8.6,18.8,13.7c28.1,23.6,46.2,53.4,52.2,81.9\n						c16.7-17.3,28.6-36.8,35.2-56.3C281.4,139.1,267.2,117.2,247.2,98.5z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-0_2_3\" d=\"M163.7,135.3c6.1-5.1,12.4-9.7,18.8-13.7c-21.1-13.4-43.6-21.2-64.7-23.1c-20,18.7-34.2,40.6-41.6,62.5\n						c6.6,19.5,18.5,39,35.2,56.3C117.5,188.7,135.6,158.9,163.7,135.3z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-1_2_3\" d=\"M253.5,217.2c-4.2,4.3-8.6,8.5-13.4,12.5c-18.1,15.2-38,25.8-57.7,31.7c25.3,7.6,50.2,7.5,70.2-0.9\n						C256.6,247.3,256.8,232.5,253.5,217.2z\" />\n      <path class=\"part part4-path\" id=\"venn-shape-set4-0_1_2_3\" d=\"M253.5,217.2c-6.1-28.5-24.1-58.3-52.2-81.9c-6.1-5.1-12.4-9.7-18.8-13.7c-6.4,4.1-12.7,8.6-18.8,13.7\n						c-28.1,23.6-46.2,53.4-52.2,81.9c4.2,4.3,8.6,8.5,13.4,12.5c18.1,15.2,38,25.8,57.7,31.7c19.7-5.9,39.6-16.6,57.7-31.7\n						C244.9,225.7,249.4,221.5,253.5,217.2z\" />\n      <text class=\"part4-text\" id=\"venn-text-set4-0\" text-anchor=\"middle\" x=\"244\" y=\"82\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-1\" text-anchor=\"middle\" x=\"312\" y=\"167\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-2\" text-anchor=\"middle\" x=\"53\" y=\"167\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-3\" text-anchor=\"middle\" x=\"121\" y=\"82\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-0_1\" text-anchor=\"middle\" x=\"280\" y=\"120\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-0_2\" text-anchor=\"middle\" x=\"92\" y=\"224\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-0_3\" text-anchor=\"middle\" x=\"182.5\" y=\"98\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-1_2\" text-anchor=\"middle\" x=\"182.5\" y=\"290\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-1_3\" text-anchor=\"middle\" x=\"273\" y=\"224\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-2_3\" text-anchor=\"middle\" x=\"85\" y=\"120\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-0_1_2\" text-anchor=\"middle\" x=\"134\" y=\"258\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-0_1_3\" text-anchor=\"middle\" x=\"246\" y=\"150\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-0_2_3\" text-anchor=\"middle\" x=\"119\" y=\"150\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-1_2_3\" text-anchor=\"middle\" x=\"231\" y=\"258\"></text>\n      <text class=\"part4-text\" id=\"venn-text-set4-0_1_2_3\" text-anchor=\"middle\" x=\"182.5\" y=\"197\"></text>\n    </g>\n\n    <!-- 5 -->\n    <g class=\"venn-diagram\" id=\"venn-diagram5\">\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0\" fill=\"#804040\"\n        d=\"M234.9,81.5c9.7,7,15.5,18.2,17.7,32.2c4.4-0.3,8.7-0.4,12.9-0.5C255.3,55,227.6,13.2,195,13.2 c-26.8,0-50.3,28.2-63.5,70.6c9.3,1.3,18.8,3.2,28.5,5.7C189.3,72.5,216.9,68.5,234.9,81.5z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-1\" fill=\"#738040\"\n        d=\"M351.2,151.8c-8.2-25.3-41.8-38.9-85.7-38.6c1.8,10.1,3,20.7,3.7,31.7c24.1,22.2,35.7,46.6,29,67.3 c-3.7,11.4-12.6,20.4-25.3,26.9c1.5,3.8,2.8,7.5,4.1,11.2C329.8,222.6,361.4,183,351.2,151.8z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-2\" fill=\"#40805A\"\n        d=\"M195,312.3c-12.1,0-23.5-5.8-33.6-16c-3.5,2.9-7,5.6-10.4,8.2c42.5,41.2,89.6,58.7,116,39.5 c21.6-15.7,24.1-52,10.1-93.7c-8.3,4.3-17,8.4-26.3,12.1C237.1,293,217.2,312.3,195,312.3z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-3\" fill=\"#405A80\"\n        d=\"M129.9,281.7c-32.6-3.8-56.4-16.7-63.2-37.4c-3.6-11.2-1.9-23.4,4.2-35.8c-3.6-2.3-7-4.6-10.4-7 c-25.8,53-27.8,102.9-1.5,122c21.5,15.6,56.6,6.9,91.8-19C143.8,297.6,136.7,289.9,129.9,281.7z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-4\" fill=\"#734080\"\n        d=\"M91.1,102c9.9-7.2,22.8-9.2,37.2-6.7c1-4,2.1-7.8,3.3-11.6c-58.9-8.5-107.6,4.9-117.8,36.1 c-8.2,25.3,11.1,56.2,46.8,81.7c4.3-8.8,9.2-17.6,14.7-26.4C68.4,142.3,73.2,115.1,91.1,102z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_1\" fill=\"#C6AA61\"\n        d=\"M253.6,132.1c5.7,4.2,10.9,8.4,15.6,12.8c-0.7-11-1.9-21.6-3.7-31.7c-4.2,0-8.5,0.2-12.9,0.5 C253.6,119.4,253.9,125.6,253.6,132.1z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_2\" fill=\"#ACAC81\"\n        d=\"M177.9,281.2c-5.5,5.4-11,10.5-16.6,15.1c10.1,10.2,21.5,16,33.6,16c22.2,0,42.1-19.3,55.7-49.9 c-6,2.4-12.2,4.7-18.6,6.8C213.5,275.2,195.2,279.2,177.9,281.2z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_3\" fill=\"#AC85AC\"\n        d=\"M228.9,116.4c8.1-1.3,16-2.2,23.7-2.7c-2.2-14-8.1-25.1-17.7-32.2c-18-13.1-45.7-9.1-74.9,7.9 c6.3,1.6,12.7,3.4,19.1,5.5C197.2,100.8,214,108.2,228.9,116.4z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_4\" fill=\"#C869A8\"\n        d=\"M144.3,99.6c5.2-3.8,10.5-7.2,15.7-10.2c-9.7-2.5-19.2-4.3-28.5-5.7c-1.2,3.7-2.2,7.6-3.3,11.6 C133.4,96.2,138.8,97.6,144.3,99.6z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-1_2\" fill=\"#9ECD88\"\n        d=\"M257.4,245.3c-2,6-4.2,11.8-6.6,17.1c9.2-3.7,18-7.7,26.3-12.1c-1.2-3.7-2.6-7.4-4.1-11.2 C268.2,241.5,263,243.6,257.4,245.3z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-1_3\" fill=\"#9CBAA9\"\n        d=\"M90.5,219.6c-6.9-3.5-13.4-7.3-19.6-11.1c-6.1,12.4-7.8,24.6-4.2,35.8c6.7,20.7,30.6,33.6,63.2,37.4 c-3.9-4.7-7.7-9.6-11.4-14.7C107.1,251.4,97.8,235.3,90.5,219.6z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-1_4\" fill=\"#C1A9AA\"\n        d=\"M264.2,219.6c3.3,6.6,6.2,13.1,8.8,19.6c12.7-6.5,21.6-15.5,25.3-26.9c6.7-20.7-4.9-45.1-29-67.3 c0.3,5.8,0.5,11.8,0.5,17.8C269.8,182.9,267.8,202.1,264.2,219.6z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-2_3\" fill=\"#6FBAB2\"\n        d=\"M150.4,282.8c-7.1,0-14-0.4-20.5-1.2c6.8,8.2,13.8,15.9,21,22.8c3.5-2.6,7-5.3,10.4-8.2 C157.5,292.4,153.9,287.9,150.4,282.8z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-2_4\" fill=\"#A0AAB7\"\n        d=\"M123.9,116.4c1.2-7.3,2.7-14.3,4.4-21.1c-14.4-2.5-27.3-0.5-37.2,6.7c-17.9,13-22.7,40.3-15.8,73.1 c3.5-5.5,7.2-11.1,11.2-16.6C98.2,142.5,110.9,128.4,123.9,116.4z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-3_4\" fill=\"#9F85CB\"\n        d=\"M80.3,193.7c-2-6.3-3.7-12.5-5-18.6c-5.5,8.8-10.5,17.6-14.7,26.4c3.3,2.4,6.8,4.7,10.4,7 C73.4,203.6,76.5,198.6,80.3,193.7z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_1_2\" fill=\"#E3E6B5\"\n        d=\"M204.4,250.6c-8.4,11.2-17.3,21.4-26.5,30.6c17.3-2,35.6-6,54.2-12c6.4-2.1,12.6-4.4,18.6-6.8 c2.4-5.4,4.6-11.1,6.6-17.1C242.4,249.7,224.3,251.5,204.4,250.6z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_1_3\" fill=\"#E3DAD1\"\n        d=\"M253.6,132.1c0.3-6.5-0.1-12.7-1-18.4c-7.7,0.5-15.6,1.4-23.7,2.7C237.9,121.4,246.1,126.6,253.6,132.1z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_1_4\" fill=\"#EED1D1\"\n        d=\"M242.3,183c8.5,12.1,15.8,24.4,21.9,36.6c3.6-17.5,5.6-36.7,5.6-56.8c0-6-0.2-12-0.5-17.8 c-4.7-4.4-10-8.6-15.6-12.8C253,147.5,249.1,164.8,242.3,183z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_2_3\" fill=\"#D1DADB\"\n        d=\"M150.4,282.8c3.4,5.1,7.1,9.6,10.9,13.5c5.6-4.6,11.1-9.7,16.6-15.1C168.4,282.3,159.2,282.9,150.4,282.8z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_2_4\" fill=\"#E3D1DB\"\n        d=\"M144.3,99.6c-5.5-2-10.9-3.5-16.1-4.3c-1.7,6.8-3.2,13.8-4.4,21.1C130.7,110.2,137.5,104.6,144.3,99.6z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_3_4\" fill=\"#E3B7E7\"\n        d=\"M228.9,116.4c-14.9-8.3-31.7-15.6-49.8-21.5c-6.4-2.1-12.8-3.9-19.1-5.5c-5.2,3-10.4,6.4-15.7,10.2 c14.4,5.2,29.7,14.2,44.9,26.2C202.7,121.7,216.1,118.5,228.9,116.4z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-1_2_3\" fill=\"#C8ECDB\"\n        d=\"M90.5,219.6c7.3,15.7,16.6,31.7,28,47.4c3.7,5.1,7.5,10,11.4,14.7c6.5,0.8,13.4,1.1,20.5,1.2 c-8.4-12.5-15.4-28.4-20.6-46.7C115.8,231.4,102.6,225.8,90.5,219.6z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-1_2_4\" fill=\"#DEE7DB\"\n        d=\"M257.4,245.3c5.7-1.7,10.9-3.7,15.6-6.1c-2.6-6.5-5.5-13-8.8-19.6C262.3,228.6,260,237.2,257.4,245.3z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-1_3_4\" fill=\"#DEDAE7\"\n        d=\"M80.3,193.7c-3.8,4.9-6.9,9.9-9.3,14.8c6.1,3.9,12.7,7.6,19.6,11.1C86.4,210.8,83,202.2,80.3,193.7z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-2_3_4\" fill=\"#C8DAEC\"\n        d=\"M120.3,157.9c0.2-14.5,1.5-28.4,3.6-41.5c-13,12-25.7,26.1-37.4,42.2c-4,5.5-7.7,11-11.2,16.6 c1.3,6,2.9,12.2,5,18.6C89.9,181.2,103.5,169,120.3,157.9z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_1_2_3\" fill=\"#F3F6EF\"\n        d=\"M204.4,250.6c-22.2-1-46.6-5.4-71.5-13.5c-1-0.3-2-0.7-3-1c5.2,18.3,12.2,34.2,20.6,46.7 c8.8,0,18-0.5,27.5-1.6C187.1,272.1,196,261.8,204.4,250.6z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_1_2_4\" fill=\"#F6F4EF\"\n        d=\"M242.3,183c-7.8,20.7-19.5,42.4-34.8,63.5c-1,1.4-2.1,2.8-3.1,4.1c19.9,0.9,38-1,53-5.4 c2.7-8,5-16.6,6.8-25.7C258.1,207.4,250.8,195.1,242.3,183z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_1_3_4\" fill=\"#F6EFF4\"\n        d=\"M189.2,125.9c17.5,13.9,34.8,31.9,50.3,53.2c0.9,1.3,1.9,2.6,2.8,3.9c6.9-18.2,10.7-35.6,11.3-50.9 c-7.5-5.5-15.8-10.8-24.7-15.7C216.1,118.5,202.7,121.7,189.2,125.9z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_2_3_4\" fill=\"#F3EFF6\"\n        d=\"M120.3,157.9c18.5-12.2,40.8-23,65.6-31c1.1-0.4,2.2-0.7,3.3-1c-15.2-12.1-30.5-21-44.9-26.2 c-6.8,5-13.7,10.6-20.4,16.8C121.8,129.5,120.5,143.5,120.3,157.9z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-1_2_3_4\" fill=\"#F0F6F6\"\n        d=\"M129.8,236.1c-6.1-21.7-9.6-46.7-9.6-73.4c0-1.6,0-3.2,0.1-4.8c-16.8,11.1-30.4,23.3-40,35.8 c2.7,8.4,6.1,17.1,10.2,25.9C102.6,225.8,115.8,231.4,129.8,236.1z\" />\n      <path class=\"part part5-path\" id=\"venn-shape-set5-0_1_2_3_4\"\n        d=\"M189.2,125.9c-1.1,0.3-2.2,0.7-3.3,1c-24.8,8.1-47.1,18.8-65.6,31c0,1.6-0.1,3.2-0.1,4.8 c0,26.7,3.5,51.7,9.6,73.4c1,0.3,2,0.7,3,1c24.9,8.1,49.3,12.5,71.5,13.5c1-1.4,2.1-2.7,3.1-4.1c15.3-21.1,27-42.8,34.8-63.5 c-0.9-1.3-1.8-2.6-2.8-3.9C224,157.8,206.7,139.8,189.2,125.9z\" />\n      <text class=\"part5-text\" id=\"venn-text-set5-0\" text-anchor=\"middle\" x=\"196\" y=\"57\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-1\" text-anchor=\"middle\" x=\"314\" y=\"165\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-2\" text-anchor=\"middle\" x=\"240\" y=\"328\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-3\" text-anchor=\"middle\" x=\"88\" y=\"302\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-4\" text-anchor=\"middle\" x=\"46\" y=\"132\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_1\" text-anchor=\"middle\" x=\"261\" y=\"131\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_2\" text-anchor=\"middle\" x=\"199\" y=\"299\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_3\" text-anchor=\"middle\" x=\"214\" y=\"97\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_4\" text-anchor=\"middle\" x=\"140\" y=\"96\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-1_2\" text-anchor=\"middle\" x=\"264\" y=\"255\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-1_3\" text-anchor=\"middle\" x=\"86\" y=\"250\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-1_4\" text-anchor=\"middle\" x=\"282\" y=\"208\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-2_3\" text-anchor=\"middle\" x=\"148\" y=\"297\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-2_4\" text-anchor=\"middle\" x=\"99\" y=\"121\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-3_4\" text-anchor=\"middle\" x=\"71\" y=\"197\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_1_2\" text-anchor=\"middle\" x=\"220\" y=\"266\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_1_3\" text-anchor=\"middle\" x=\"244\" y=\"124\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_1_4\" text-anchor=\"middle\" x=\"257\" y=\"184\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_2_3\" text-anchor=\"middle\" x=\"164\" y=\"292\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_2_4\" text-anchor=\"middle\" x=\"131\" y=\"109\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_3_4\" text-anchor=\"middle\" x=\"187\" y=\"115\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-1_2_3\" text-anchor=\"middle\" x=\"122\" y=\"260\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-1_2_4\" text-anchor=\"middle\" x=\"265\" y=\"239\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-1_3_4\" text-anchor=\"middle\" x=\"78\" y=\"212\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-2_3_4\" text-anchor=\"middle\" x=\"102\" y=\"161\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_1_2_3\" text-anchor=\"middle\" x=\"165\" y=\"269\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_1_2_4\" text-anchor=\"middle\" x=\"241\" y=\"229\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_1_3_4\" text-anchor=\"middle\" x=\"232\" y=\"148\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_2_3_4\" text-anchor=\"middle\" x=\"147\" y=\"129\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-1_2_3_4\" text-anchor=\"middle\" x=\"105\" y=\"205\"></text>\n      <text class=\"part5-text\" id=\"venn-text-set5-0_1_2_3_4\" text-anchor=\"middle\" x=\"176\" y=\"194\"></text>\n    </g>\n\n  </svg>\n</div>";
},"useData":true}]
];

const url = import.meta.url.replace(/\?.*$/, '');

defineStanzaElement({stanzaModule, metadata, templates, url});
//# sourceMappingURL=venn-stanza.js.map
