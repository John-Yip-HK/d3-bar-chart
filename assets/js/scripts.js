const WIDTH = 700;
const HEIGHT = 400;
const PADDING = 30;

const svg = d3
  .select("div#container")
  .append("svg")
    .attr("id", "graph")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((data) => {
    const gdp = data.data.slice(0, 20);
    const xScale = d3.scaleLinear()
                      .domain([0, gdp.length-1])
                      .range([PADDING, WIDTH - PADDING]);
    const yScale = d3.scaleLinear()
                      .domain([0, d3.max(gdp, (d) => d[1])])
                      .range([HEIGHT - PADDING, PADDING]);
    const valScale = d3.scaleLinear()
                      .domain([0, d3.max(gdp, (d) => d[1])])
                      .range([0, HEIGHT - 2 * PADDING]);
    
    svg
      .selectAll("rect")
      .data(gdp)
      .enter()
      .append("rect")
        .attr("width", 10)
        .attr("height", (d) => valScale(d[1]))
        .attr("x", (_, i) => xScale(i))
        .attr("y", (d) => yScale(d[1]))
        .attr("class", "bar");

    svg.selectAll("text")
      .data(gdp)
      .enter()
      .append("text")
        .attr("x", (_, i) => xScale(i))
        .attr("y", (d) => yScale(d[1]) - 10)
        .text((d) => d[1])
    
    window.onresize = () => {
      console.log("window width = " + window.innerWidth);
    };
  })
  .catch((err) => alert(err.message));
