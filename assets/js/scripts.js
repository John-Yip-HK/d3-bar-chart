import * as d3 from "https://cdn.skypack.dev/d3@7";

const WIDTH = 800;
const HEIGHT = 400;
const PADDING = 50;

const container = d3.select("div#container");
container.append("h2").attr("id", "title").text("United States GDP");

const svg = container
  .append("svg")
  .attr("id", "graph")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((data) => {
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -250)
      .attr("y", 70)
      .text("Gross Domestic Product");

    svg
      .append("text")
      .attr("x", WIDTH / 2 - 200)
      .attr("y", HEIGHT - 5)
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

    const gdp = data.data;

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(gdp, (d) => d[1])])
      .range([HEIGHT - PADDING, PADDING]);
    const valScale = d3
      .scaleLinear()
      .domain([0, d3.max(gdp, (d) => d[1])])
      .range([0, HEIGHT - 2 * PADDING]);
    const quarterScale = d3.scaleLinear().domain([1, 10]).range([1, 4]);
    const yearScale = d3
      .scaleTime()
      .domain([new Date(gdp[0][0]), new Date(gdp[gdp.length - 1][0])])
      .range([PADDING, WIDTH - PADDING]);

    let xAxis = d3.axisBottom(yearScale);
    let yAxis = d3.axisLeft(yScale);

    const tooltip = container
      .append("div")
      .attr("id", "tooltip")
      .html("Date<br>GDP");

    function mouseover() {
      const bar = d3.select(this);

      tooltip
        .style("display", "block")
        .attr("data-date", bar.attr("data-date"))
        .attr("data-gdp", bar.attr("data-gdp"));

      bar.style("opacity", "0.4");
    }

    function mousemove(event) {
      const date = tooltip.attr("data-date").split("-");
      const gdp = tooltip.attr("data-gdp");

      // const pointer = d3.pointer(event, container.node());

      tooltip
        .html(`${date[0]}-Q${quarterScale(date[1])}<br>$${gdp} Billion`)
        .style("top", `${event.pageY}px`)
        .style("left", `${event.pageX + 15}px`);
    }

    function mouseout() {
      d3.select(this).style("opacity", "1");
      tooltip.style("display", "none");
    }

    svg
      .selectAll("rect")
      .data(gdp)
      .enter()
      .append("rect")
      .attr("width", 2.5)
      .attr("height", (d) => valScale(d[1]))
      .attr("x", (d) => {
        const date = new Date(d[0]);
        return yearScale(date);
      })
      .attr("y", (d) => yScale(d[1]))
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("class", "bar")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

    xAxis = svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${HEIGHT - PADDING})`)
      .call(xAxis);

    yAxis = svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${PADDING}, 0)`)
      .call(yAxis);
  })
  .catch((err) => alert(err.message));
