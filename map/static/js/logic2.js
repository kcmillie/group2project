// from data.js
var tableData = DATA;
var averageScore = averageScore;
// console.log(averageScore[1]);
// console.log(tableData)

// ***** PLOT SECTION **//
function buildbigChart(){
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // get the data
  // format the data
  var chartData = tableData.forEach(function(d) {
    d.abv = +d.abv;
  });

  // Scale the range of the data in the domains
  x.domain(tableData.map(function(d) { return d['RateBeer ID']; }));
  y.domain([0, d3.max(tableData, function(d) { return d.abv; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d['RateBeer ID']); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.abv); })
      .attr("height", function(d) { return height - y(d.abv); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
    .call(d3.axisLeft(y));
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
      beerdetail.selectAll('div')
      .data(['name', 'abv', 'ibu', 'calories', 'score', '# of ratings', 'RateBeer ID'])
      .enter()
      .append('div')
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
buildbigChart();
