// from data.js
// var tableData = DATA; //individualized data per beer with brewery info

// var year = year;//has lat and long info; everything else is average data

// console.log(year)

function buildMap(){
  d3.json('/breweries').then((year) => {
    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      id: "mapbox.light",
      maxzoom: 18,
      accessToken: API_KEY
    });

    // Initialize all of the LayerGroups we'll be using
    var layers = {
      Founded_2016_now: new L.LayerGroup(),
      Founded_2010_to_2015: new L.LayerGroup(),
      Before_2010: new L.LayerGroup()
    };

    // Create the map object with options
    var map = L.map("map-id", {
      center: [39.0997, -94.5786],
      zoom: 11,
      layers:[
      layers.Founded_2016_now,
      layers.Founded_2010_to_2015,
      layers.Before_2010
      ]
    });

    lightmap.addTo(map);

    var overlays = {
      "Opened in 2016 to now": layers.Founded_2016_now,
      "Opened between 2010 to 2015": layers.Founded_2010_to_2015,
      "Opened before 2010": layers.Before_2010
    }

    L.control.layers(null, overlays).addTo(map);

    var info = L.control({
      position: "bottomright"
    });

    info.onAdd = function(){
      var div = L.DomUtil.create("div", "legend");
      return div
    }
    info.addTo(map);

    var brewCount = {
      Founded_2016_now: 0,
      Founded_2010_to_2015: 0,
      Before_2010: 0
    }

    var brewCode;

    for(var i = 0; i<year.length; i++) {
      brewCode = year[i].year;
      if(brewCode > 2015) {
        brewCode = "Founded_2016_now";
      } else if(brewCode > 2009) {
        // console.log(brewCode)
        brewCode = "Founded_2010_to_2015";
      } else {
        brewCode = "Before_2010";
      }

      brewCount[brewCode]++;

      var newMarker = L.marker([year[i].lat, year[i].long]);

      newMarker.addTo(layers[brewCode]);

      newMarker.bindPopup(year[i].name + "<br> Year Opened: " + year[i].year);
    }
    console.log(brewCount)
  });
}

function boozybeerPlot(){
  d3.json('/beers').then((beer) => {
    var BeerCount= [
      {'abv': 'no info', '2016tonow': 0, '2010to2015': 0, 'Before2010':0},
      {'abv': 'Water Beer', '2016tonow': 0, '2010to2015': 0, 'Before2010':0},
      {'abv': 'Regular', '2016tonow': 0, '2010to2015': 0, 'Before2010':0},
      {'abv': 'Boozy', '2016tonow': 0, '2010to2015': 0, 'Before2010':0},
      {'abv': 'Very Boozy', '2016tonow': 0, '2010to2015': 0, 'Before2010':0}
    ];

    function p2f(x){
      return parseFloat(x.slice(0, -1));
    }

    function stripScore(x){
      return parseFloat(x.slice(0, -2));
    }

    for (var i = 0; i < beer.length; i++) {
      if(beer[i]['abv'] == '-'){
        // BeerCount[0]['total']++;
        if(beer[i]['yearfounded'] > 2015){
          BeerCount[0]['2016tonow']++;
        } else if(beer[i]['yearfounded'] > 2009) {
          BeerCount[0]['2010to2015']++;
        } else {
          BeerCount[0][['breakdown']['Before2010']]++;
        };
      } else if (p2f(beer[i]['abv']) < 5.0){
        // BeerCount[1]['total']++;
        if(beer[i]['yearfounded'] > 2015){
          BeerCount[1]['2016tonow']++;
        } else if(beer[i]['yearfounded'] > 2009) {
          BeerCount[1]['2010to2015']++;
        } else {
          BeerCount[1]['Before2010']++;
        };
      } else if (p2f(beer[i]['abv']) < 7.0) {
        // BeerCount[2]['total']++;
        if(beer[i]['yearfounded'] > 2015){
          BeerCount[2]['2016tonow']++;
        } else if(beer[i]['yearfounded'] > 2009) {
          BeerCount[2]['2010to2015']++;
        } else {
          BeerCount[2]['Before2010']++;
        };
      } else if (p2f(beer[i]['abv']) < 9.0) {
        // BeerCount[3]['total']++;
        if(beer[i]['yearfounded'] > 2015){
          BeerCount[3]['2016tonow']++;
        } else if(beer[i]['yearfounded'] > 2009) {
          BeerCount[3]['2010to2015']++;
        } else {
          BeerCount[3]['Before2010']++;
        };
      } else {
        // BeerCount[4]['total']++;
        if(beer[i]['yearfounded'] > 2015){
          BeerCount[4]['2016tonow']++;
        } else if(beer[i]['yearfounded'] > 2009) {
          BeerCount[4]['2010to2015']++;
        } else {
          BeerCount[4]['Before2010']++;
        };
      }
    }
    console.log(BeerCount);
    var svgWidth = 600,
        svgHeight = 500;

    var svg = d3.select("#boozyplot")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set x scale
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    // set y scale
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // load the csv and create the chart
    x.domain(BeerCount.map(function(d) { return d.abv; }));
    y.domain([0, 200]).nice();
    var z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888"]);

    var keys = ['2016tonow', '2010to2015','Before2010'];

    var rectangles = g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(BeerCount))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.abv); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start");

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .html(function(d) {
        return (`Quantity: ${d[1]-d[0]}`);
      });

    g.call(toolTip);

    rectangles.on("click", function(data){
      toolTip.show(data, this);
      })
      .on("mouseout", function(data, index){
        toolTip.hide(data);
      });

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });
};

buildMap();
boozybeerPlot();


