
const margin = { left:80, right:20, top:50, bottom:100 };

const width = 800 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

const t = d3.transition().duration(300);

const g = d3.select("#chart-area")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

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

	// X as
	const xas = g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height +")");
	// Y as
	const yas = g.append("g")
	  .attr("class", "y axis");

	// y Scale (de max lengte van je y as)
	const y = d3.scaleLinear()
	    .range([height, 0])
	    .domain([0, maxLE]);

	const x = d3.scaleLog()
			.base(10)
	    .range([0, width])
	    .domain([0, maxGDP]);

	const area = d3.scaleSqrt()
		.range([0, 30])
		.domain([0, maxPOP]);

	// Y Label
/*
	// Refresh every sec
	d3.interval( () => {
		//JOIN
		const circles = g.selectAll("circles")
			.data(data);
		//EXIT
		circles.exit().remove();
		//UPDATE
		circles
			.attr("x")
			.attr("y")
			.attr("cy")
			.attr("cx")
			.attr("r")
		//ENTER
		circles.enter()
			.append("circles")
				.attr("x")
				.attr("y")
				.attr("cy")
				.attr("cx")
				.attr("r")
				.fill("fill")
	},1000);
*/
})
