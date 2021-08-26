import Stanza from "togostanza/stanza";
import * as d3 from "d3";

export default class Heatmap extends Stanza {
  async render() {

    const css = (key) => getComputedStyle(this.element).getPropertyValue(key);

    // set the dimensions and margins of the graph

    const margin = { top: this.params["top"], 
                     right: this.params["right"], 
                     bottom: this.params["bottom"], 
                     left: this.params["left"] },
      width = this.params["width"] - margin.left - margin.right,
      height = this.params["height"] - margin.top - margin.bottom;

    const chartElement = this.root.querySelector("main");

    // append the svg object to the body of the page
    const svg = d3
      .select(chartElement)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Labels of row and columns
    const myGroups = [this.params["label1"], 
                      this.params["label2"],
                      this.params["label3"], 
                      this.params["label4"],
                      this.params["label5"], 
                      this.params["label6"], 
                      this.params["label7"], 
                      this.params["label8"],
                      this.params["label9"], 
                      this.params["label10"]];
    const myVars = [
      "v1",
      "v2",
      "v3",
      "v4",
      "v5",
      "v6",
      "v7",
      "v8",
      "v9",
      "v10",
    ];

    // const myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    // const myVars = [
    //   "v1",
    //   "v2",
    //   "v3",
    //   "v4",
    //   "v5",
    //   "v6",
    //   "v7",
    //   "v8",
    //   "v9",
    //   "v10",
    // ];

    // Build X scales and axis:
    const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.01);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Build X scales and axis:
    const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.01);
    svg.append("g").call(d3.axisLeft(y));

    // Build color scale
    const myColor = d3
      .scaleLinear()
      .range([css("--togostanza-series-0-color"), css("--togostanza-series-1-color")])
      .domain([1, 100]);

    //Read the data
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv"
    ).then(function (data) {
      svg
        .selectAll()
        .data(data, function (d) {
          return d.group + ":" + d.variable;
        })
        .join("rect")
        .attr("x", function (d) {
          return x(d.group);
        })
        .attr("y", function (d) {
          return y(d.variable);
        })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) {
          return myColor(d.value);
        });
    });
    // this.renderTemplate({
    //   template: "stanza.html.hbs",
      
    // });
  }
}
