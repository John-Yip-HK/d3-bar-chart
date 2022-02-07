const WIDTH = 700;
const HEIGHT = 400;
const PADDING = 50;

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
    const gdp = data.data.slice(0);

    const xScale = d3
      .scaleLinear()
      .domain([0, gdp.length - 1])
      .range([PADDING, WIDTH - PADDING]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(gdp, (d) => d[1])])
      .range([HEIGHT - PADDING, PADDING]);
    const valScale = d3
      .scaleLinear()
      .domain([0, d3.max(gdp, (d) => d[1])])
      .range([0, HEIGHT - 2 * PADDING]);
    const quarterScale = d3.scaleLinear().domain([1, 10]).range([1, 4]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .selectAll("rect")
      .data(gdp)
      .enter()
      .append("rect")
      .attr("width", 2)
      .attr("height", (d) => valScale(d[1]))
      .attr("x", (_, i) => xScale(i))
      .attr("y", (d) => yScale(d[1]))
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("class", "bar");

    const tooltip = d3
      .select("div#container")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .text("I'm a bar!");

    d3.select("#graph")
      .on("mouseover", () => tooltip.style("visibility", "visible"))
      .on("mousemove", () => tooltip.attr("x", 100).attr("y", 50))
      .on("mouseout", () => tooltip.style("visibility", "hidden"));

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${HEIGHT - PADDING})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${PADDING}, 0)`)
      .call(yAxis)
      .append("text");

    d3.selectAll(".tick text").attr("class", "tick");
  })
  .catch((err) => alert(err.message));
