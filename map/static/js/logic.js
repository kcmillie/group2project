// from data.js
var tableData = DATA;
var averageScore = averageScore;
// console.log(averageScore[1]);
// console.log(tableData)

// ***** PLOT SECTION **//

function buildChart(data5) {
  var svgWidth = 900;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select("#bigbeerbarplot")

  svg.html("");

  // var chart = svg.append("svg")
  //       .attr("width", width + margin.left + margin.right)
  //       .attr("height", height + margin.top + margin.bottom)
  //       .append("g")
  //       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // // parse data as numbers
  // tableData.forEach(function(data){
  //   data.abv = parseFloat(data.abv);
  //   data.calories = parseFloat(data.calories);
  //   data.ibu = parseFloat(data.ibu);
  // });

  // console.log(tableData)

  // var x = d3.scaleBand()
  //     .range([0, width])
  //     .padding(0.1);

  // var y = d3.scaleLinear()
  //     .range([height, 0]);

  // var bottomAxis = d3.axisBottom(x)
  //     .tickFormat(function(d){ return d['RateBeer ID'];});
  // var leftAxis = d3.axisLeft(y);

  // y.domain([0, d3.max(tableData, function(d){
  //   if(isNaN(d.abv)){
  //         return 0;
  //       } else{
  //       return d.abv;
  //     }
  // })])

  // x.domain(tableData.map(function(d) {
  //   return d['RateBeer ID'];
  // }))

  // var bars = chart.selectAll(".bar")
  //     .data(tableData)
  //     .enter()
  //     .append("rect")
  //     .attr("class", "bar")
  //     .attr("height", function(d){
  //         if(isNaN(d.abv)){
  //           return 0;
  //         } else{
  //           return y(d.abv);
  //         }
  //     })
  //     .attr("x", function(d){
  //       return x(d['RateBeer ID']);
  //     })
  //     .attr("height", x.bandwidth());

  // chart.append("g")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x));
  // svg.selectAll("text")
  //   .attr("transform", "rotate(90)")
  //   .style("text-anchor", "start");

  // // add the y Axis
  // chart.append("g")
  //     .call(d3.axisLeft(y));

  // // Step 6: Initialize tool tip
  //   // ==============================
  // var toolTip = d3.tip()
  //   .attr("class", "tooltip")
  //   // .offset([80, -60])
  //   .html(function(d) {
  //     return (`Beer:${d.name}`);
  //   });

  // bars.call(toolTip);

  // // Step 7: Create tooltip in the chart
  // // ==============================
  // chart.call(toolTip);

  // // Step 8: Create event listeners to display and hide the tooltip
  // // ==============================
  // bars.on("click", function(data) {
  //   toolTip.show(data, this);
  //   })
  //   // onmouseout event
  //   .on("mouseout", function(data, index) {
  //     toolTip.hide(data);
  //   })

}

 //*** Build Beer List ***
function buildBeerList(data) {
  // Use d3 to select the panel with id of `#sample-metadata`
  var beerlist = d3.select('#beerlist');

  // Use `.html("") to clear any existing data
  beerlist.html("");
  // console.log(data)
  beerlist.selectAll('button')
    .data(Object.entries(data))
    .enter()
    .append("button")
    .attr("class", "beer_item")
    .html(entry => {
        return entry[1]['name'];
      })
    .on("click", entry => {
      // console.log(entry)
      var beerdetail = d3.select('#beerdetail');
      beerdetail.html("");
      beerdetail.selectAll('li')
      .data(['name', 'style', 'abv', 'score'])
      .enter()
      .append('li')
      .html(blah => {
        return blah + ' : ' + entry[1][blah];
      });
    });
}


function getBeers(brewery) {
  filteredData = tableData.filter(d => d.brewery === brewery);
  // console.log(brewery);
  // console.log(filteredData[0]['name']);
  buildBeerList(filteredData);
  buildChart(filteredData);
}

function createMap(beerStations) {
  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the layers
  var overlayMaps = {
    "Breweries": beerStations,
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [39.0997, -94.5786],
    zoom: 12,
    layers: [lightmap, beerStations]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function onClick(e) {
   var popup = e.target.getPopup();
   var content = popup.getContent();
   getBeers(content);
}

// For each station, create a marker and bind a popup with the station's name
var strangedays = L.marker([39.110027, -94.57997499999999]).bindPopup("Strange Days").on('click', onClick);
var boulevard = L.marker([39.082248, -94.596602]).bindPopup("Boulevard").on('click', onClick);
var bigrip = L.marker([39.125946, -94.578436]).bindPopup("The Big Rip").on('click', onClick);

// Add the marker to the bikeMarkers array
beerMarkers = []
beerMarkers.push(strangedays);
beerMarkers.push(boulevard);
beerMarkers.push(bigrip);

// Create a layer group made from the bike markers array, pass it into the createMap function
createMap(L.layerGroup(beerMarkers));
