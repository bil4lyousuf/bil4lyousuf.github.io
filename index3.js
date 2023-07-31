
d3.csv("games-features.csv")
  .then((data) => {
    
    data.forEach((d) => {
      d.Metacritic = +d.Metacritic;
      d.PriceFinal = +d.PriceFinal;
    });

    
    const genres = new Set(["Action", "Indie", "RPG", "Casual", "Adventure", "Simulation", "Sports", "Racing", "MassivelyMultiplayer"]);
    data = data.filter((d) => d.Genre !== "" && genres.has(d.Genre) && d.Metacritic != 0);

    
    const minPrice = 0;
    const maxPrice = d3.max(data, (d) => d.PriceFinal);

    
    const minPriceSlider = d3.select("#min-price-range");
    const maxPriceSlider = d3.select("#max-price-range");
    const minPriceLabel = d3.select("#min-price-label");
    const maxPriceLabel = d3.select("#max-price-label");

    minPriceSlider
      .attr("min", minPrice)
      .attr("max", maxPrice)
      .attr("value", minPrice)
      .on("input", updatePriceRange);

    maxPriceSlider
      .attr("min", minPrice)
      .attr("max", maxPrice)
      .attr("value", maxPrice)
      .on("input", updatePriceRange);

    minPriceLabel.text(`Min Price: $${minPrice}`);
    maxPriceLabel.text(`Max Price: $${maxPrice}`);

    function updatePriceRange() {
      const selectedMinPrice = +minPriceSlider.property("value");
      const selectedMaxPrice = +maxPriceSlider.property("value");
      minPriceLabel.text(`Min Price: $${selectedMinPrice}`);
      maxPriceLabel.text(`Max Price: $${selectedMaxPrice}`);
      updateBarChart(selectedMinPrice, selectedMaxPrice);
    }

    
    const margin = { top: 50, right: 50, bottom: 80, left: 150 }; 
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    const genreMetacriticMap = d3.rollup(data, v => d3.mean(v, d => d.Metacritic), d => d.Genre);

    
    const xScale = d3.scaleBand()
      .domain(Array.from(genreMetacriticMap.keys()))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(genreMetacriticMap.values())])
      .range([height, 0]);

    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(yAxis);

    
    
function updateBarChart(minPrice, maxPrice) {
    const filteredData = data.filter((d) => d.PriceFinal >= minPrice && d.PriceFinal <= maxPrice);
    const genreMetacriticMap = d3.rollup(filteredData, v => d3.mean(v, d => d.Metacritic), d => d.Genre);
  
    yScale.domain([0, d3.max(genreMetacriticMap.values())]);
  
    
    svg.selectAll(".tooltip").remove();
  
    svg.selectAll(".bar")
      .data(Array.from(genreMetacriticMap.entries()))
      .join(
        enter => enter.append("rect")
          .attr("class", "bar")
          .attr("x", d => xScale(d[0]))
          .attr("y", d => yScale(d[1]))
          .attr("width", xScale.bandwidth())
          .attr("height", d => height - yScale(d[1]))
          .on("mouseover", function (event, d) {
            
            event.stopPropagation();
  
            const tooltip = svg.append("g")
              .attr("class", "tooltip")
              .attr("pointer-events", "none");
  
            const tooltipBox = tooltip.append("rect")
              .attr("width", 120)
              .attr("height", 50)
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("rx", 5)
              .attr("ry", 5)
              .attr("x", xScale(d[0]) + xScale.bandwidth() / 2 - 60)
              .attr("y", yScale(d[1]) - 60);
  
            tooltip.append("text")
              .text(`${d[0]}`)
              .attr("x", xScale(d[0]) + xScale.bandwidth() / 2)
              .attr("y", yScale(d[1]) - 40)
              .attr("text-anchor", "middle")
              .attr("pointer-events", "none");
  
            tooltip.append("text")
              .text(`Average Rating: ${d[1].toFixed(2)}`)
              .attr("x", xScale(d[0]) + xScale.bandwidth() / 2)
              .attr("y", yScale(d[1]) - 25)
              .attr("text-anchor", "middle")
              .attr("pointer-events", "none");
          })
          .on("mouseout", function () {
            svg.selectAll(".tooltip").remove();
          }),
        update => update
          .attr("x", d => xScale(d[0]))
          .attr("y", d => yScale(d[1]))
          .attr("width", xScale.bandwidth())
          .attr("height", d => height - yScale(d[1])),
        exit => exit.remove()
      );
  }
  

    
    updatePriceRange();

    
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Rating vs Genre");

  
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .style("text-anchor", "middle")
    .text("Average Metacritic Score");

  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .style("text-anchor", "middle")
    .text("Genre");

    d3.select("#bar-chart-container")
      .insert("button", ":first-child")
      .text("Back to start")
      .on("click", () => {
        window.location.href = "scene1.html";
      });
      
  })
  .catch((error) => console.error("Error loading the data:", error));
