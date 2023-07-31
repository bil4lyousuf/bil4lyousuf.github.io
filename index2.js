
d3.csv("games-features.csv")
  .then((data) => {
    
    data = data.filter((d) => d.Metacritic > 0 && d.SteamSpyPlayersEstimate > 0 && d.SteamSpyPlayersEstimate < 1000000);

    
    const margin = { top: 50, right: 50, bottom: 100, left: 100 };
    const width = 800 - margin.left - margin.right; 
    const height = 600 - margin.top - margin.bottom; 

    
    const svg = d3.select("#scatterplot-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    const xScale = d3.scalePow()
      .exponent(0.35) 
      .domain([1, 1000000]) 
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, (d) => d.Metacritic)) 
      .range([height, 0]);

    


const delaunay = d3.Delaunay.from(data, (d) => xScale(d.SteamSpyPlayersEstimate), (d) => yScale(d.Metacritic));
const voronoi = delaunay.voronoi();


const voronoiPaths = svg.selectAll("path")
  .data(data)
  .enter()
  .append("path")
  .attr("d", (_, i) => voronoi.renderCell(i)) 
  .style("fill", "none")
  .style("pointer-events", "all") 
  .on("mouseover", function (event, d) {
    const [x, y] = d3.pointer(event, this); 
    showTooltip(x, y, d);
  })
  .on("mouseout", hideTooltip);







function showTooltip(x, y, data) {
    
    const svgContainer = d3.select("svg").node().getBoundingClientRect();
    const dataPointX = xScale(data.SteamSpyPlayersEstimate);
    const dataPointY = yScale(data.Metacritic);
  
    
    let tooltipX, tooltipY;
  
    
    if (dataPointY - 10 > 0) {
      tooltipY = dataPointY + svgContainer.top - 10;
    } else {
      
      tooltipY = dataPointY + svgContainer.top + 10;
    }
  
    
    if (dataPointX + 10 + 200 < svgContainer.right) {
      tooltipX = dataPointX + svgContainer.left + 10;
    } else {
      
      tooltipX = dataPointX + svgContainer.left - 210;
    }
  
    
    tooltip.html(`Game: ${data.QueryName}<br>
                  Metacritic score: ${data.Metacritic}<br>
                  Number of players: ${data.SteamSpyPlayersEstimate}`)
      .style("display", "block")
      .style("left", `${tooltipX}px`)
      .style("top", `${tooltipY}px`);
  }
  
  
  



    
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".0s"))) 
      .call((g) => g.select(".tick:last-of-type text").clone() 
        .attr("x", width)
        .attr("y", 35)
        .attr("text-anchor", "end")
        .text("Number of Players"))
       

    
    svg.append("g")
      .call(d3.axisLeft(yScale));

    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .text("Metacritic Rating");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("Number of Players");

    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Rating vs Number of Players");

    
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.SteamSpyPlayersEstimate))
      .attr("cy", (d) => yScale(d.Metacritic))
      .attr("r", 4) 
      .attr("fill", "none") 
      .attr("stroke", "black") 

    
    const tooltip = d3.select("#scatterplot-container")
      .append("div")
      .attr("class", "tooltip")
      .style("display", "none")
      .style("position", "absolute")
      .style("background-color", "#f9f9f9")
      .style("border", "1px solid #ccc")
      .style("padding", "8px");


    
    function hideTooltip() {
      tooltip.style("display", "none");
    }

    
    document.getElementById("nextButton").addEventListener("click", () => {
      window.location.href = "scene3.html";
    });
  })
  .catch((error) => console.error("Error loading the data:", error));
