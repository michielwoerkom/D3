let time = 0;
let moving = 0;

const margin = { left:80, right:20, top:50, bottom:100 };

const width = 800 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

const g = d3.select("#chart-area")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left +
        ", " + margin.top + ")");

// Labels
const xlabel = g.append("text")
  .attr("x", width/2)
  .attr("y", height + margin.top)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP per Capita ($)");

const ylabel = g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -(height /2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Life Expectancy (Years)");

const yearLabel = g.append("text")
  .attr("x", width - 40)
  .attr("y", height - 40)
  .attr("opacity", "0.4")
  .attr("font-size", "40px")
  .attr("text-anchor", "middle")
  .text("1800");

  //Geef kleur aan continenten
  const continentColor = d3.scaleOrdinal(d3.schemeCategory10);

  const x = d3.scaleLog()
	.base(10)
  .range([0, width])

  // y Scale (de max lengte van je y as)
	const y = d3.scaleLinear()
  .range([height, 0])

  // Scale om het oppervlakte van een cirkel te berekenen
  const area = d3.scaleSqrt()
  .range([0, 40]);

  const pauze =
//Get DATA
d3.json("data/data.json").then(data => {
	let le = [];
	let pop = [];
	let gdp = [];

	let formattedData = data.map(year => {
			return year["countries"].filter(country => {
					let dataExists = (country.income && country.life_exp);
					return dataExists;
			}).map(country => {
					country.income = +country.income;
					country.life_exp = +country.life_exp;
					pop.push(country.population);
					le.push(country.life_exp);
					gdp.push(country.income);
					return country;
			})
	});

	const maxLE = le.reduce((a,b) => Math.max(a,b));
	const maxPOP = pop.reduce((a,b) => Math.max(a,b));
	const maxGDP = gdp.reduce((a,b) => Math.max(a,b));

  // x Scale (de max lengte van je x as)
  x.domain([142, maxGDP]);
  y.domain([0, maxLE]);
	area.domain([0, maxPOP]);

  //Axis opbouwen
  const xaxis = d3.axisBottom(x)
    .tickValues([400,4000,40000])
    .tickFormat(d3.format(" $"));
    g.append("g")
      .attr("transform", "translate(0," + height +")")
      .attr("class", "x axis")
      .call(xaxis);

  const yaxis = d3.axisLeft(y)
    .tickFormat(d => +d);
    g.append("g")
      .attr("class", "y axis")
      .call(yaxis);

	// Refresh every sec

	d3.interval( () => {
    time = (time < 214) ? time+1 : 0
    update(formattedData[time]);
  },100);

  update(formattedData[0]);
});

function update(data) {

  const t = d3.transition()
    .duration(100);
	//JOIN
	const circles = g.selectAll("circle")
		.data(data, d => d.country);

	//EXIT
	circles.exit()
  .attr("class", "exit")
  .remove();

	//ENTER
	circles.enter()
		.append("circle")
      .attr("class", "enter")
      .attr("fill", d => continentColor(d.continent))
      .merge(circles)
      .transition(t)
			.attr("cy", d => y(d.life_exp))
			.attr("cx", d => x(d.income))
			.attr("r", d => area(d.population));

  //Update time
  yearLabel.text(+(time+1800));

}
