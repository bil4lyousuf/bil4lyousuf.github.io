
d3.csv("games-features.csv")
  .then((data) => {
    
    data.forEach((d) => {
      d.PriceFinal = +d.PriceFinal;
      d.Metacritic = +d.Metacritic;
      d.IsFree = +d.IsFree;
    });

    
    data = data.filter((d) => d.PriceFinal > 1 && d.Metacritic > 0);

    
    const minPriceGame = data.reduce((acc, curr) => {
      return acc.PriceFinal < curr.PriceFinal ? acc : curr;
    });

    
    const maxPriceGame = data.reduce((acc, curr) => {
      return acc.PriceFinal > curr.PriceFinal ? acc : curr;
    });

    
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    
    const svg = d3.select("#scatterplot-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    const xScale = d3.scaleLog()
      .domain(d3.extent(data, (d) => d.PriceFinal)) 
      .range([0, width])
      .nice(); 

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, (d) => d.Metacritic)) 
      .range([height, 0]);

    
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(10, "~s"))
      .call((g) => g.select(".domain").remove()) 
      .call((g) => g.append("path").attr("stroke", "currentColor").attr("d", "M0,0.5H" + width)); 

    
    svg.append("g")
      .call(d3.axisLeft(yScale));

    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("Price");

    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .text("Metacritic Score");

    
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.PriceFinal))
      .attr("cy", (d) => yScale(d.Metacritic))
      .attr("r", 2) 
      .attr("fill", "none") 
      .attr("stroke", "black"); 

    
    const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations([
        {
          note: {
            label: "Cheapest game"
          },
          x: xScale(minPriceGame.PriceFinal),
          y: yScale(minPriceGame.Metacritic),
          dx: 40,
          dy: -40,
          color: "black",
          connector: { type: "elbow", end: "dot" }
        },
        {
          note: {
            label: "Most expensive game"
          },
          x: xScale(maxPriceGame.PriceFinal),
          y: yScale(maxPriceGame.Metacritic),
          dx: 40,
          dy: 40,
          color: "black",
          connector: { type: "elbow", end: "dot" }
        }
      ]);

    
    const annotationGroup = svg.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);

    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Price vs. Metacritic");

    
    const histogramSvg = d3.select("#histogram-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    const bins = d3.bin()
      .domain(xScale.domain())
      .thresholds(d3.range(0, d3.max(data, (d) => d.PriceFinal), 5))
      .value((d) => d.PriceFinal)
      (data);

    
    const binAverages = bins.map((bin) => {
      const metacriticSum = bin.reduce((acc, d) => acc + d.Metacritic, 0);
      return {
        x0: bin.x0,
        x1: bin.x1,
        averageMetacritic: metacriticSum / bin.length,
      };
    });

    
    const xHistogramScale = d3.scaleLinear()
      .domain([0, d3.max(binAverages, (d) => d.x1)])
      .range([0, width]);

    const yHistogramScale = d3.scaleLinear()
      .domain([0, d3.max(binAverages, (d) => d.averageMetacritic)])
      .range([height, 0]);

    
    histogramSvg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xHistogramScale)
        .tickValues([0, ...binAverages.map((d) => d.x1)])) 
      .call((g) => g.select(".domain").remove()) 
      .call((g) => g.append("path").attr("stroke", "currentColor").attr("d", "M0,0.5H" + width)); 

    
    histogramSvg.append("g")
      .call(d3.axisLeft(yHistogramScale));

    
    histogramSvg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("Price");

    
    histogramSvg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .text("Average Metacritic Score");

    
    histogramSvg.selectAll("rect")
      .data(binAverages)
      .enter()
      .append("rect")
      .attr("x", (d) => xHistogramScale(d.x0))
      .attr("y", (d) => yHistogramScale(d.averageMetacritic))
      .attr("width", (d) => xHistogramScale(d.x1) - xHistogramScale(d.x0))
      .attr("height", (d) => height - yHistogramScale(d.averageMetacritic))
      .attr("fill", (d, i) => (i % 2 === 0) ? "steelblue" : "orange") 
      .attr("opacity", 0.7);

    
    histogramSvg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Average Metacritic vs Price");

    document.getElementById("nextButton").addEventListener("click", () => {
      window.location.href = "scene2.html";
    });

  })
  .catch((error) => console.error("Error loading the data:", error));
