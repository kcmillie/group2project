// read instructions wrong
// built not needed function
// keeping it in code if i ever want to use it in the future
function ArrtoDict (blah){
  var foo = [];
  var keys = Object.keys(blah);
  var keyLen = Object.keys(blah).length;
  var arrLen = blah[keys[0]].length;
  for (var i = 0; i<arrLen; i++){
    var boo = {};
    for (var k = 0; k < keyLen; k++){
      boo[keys[k]] = blah[keys[k]][i]
    }
    foo.push(boo)
  }
  return foo
}

function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json('/metadata/'+sample).then((sampledata) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    var paneldata = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    paneldata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    paneldata.selectAll('div')
      .data(Object.entries(sampledata))
      .enter()
      .append("div")
      .html(entry => {
        return entry[0] + ' : ' + entry[1];
      });
  });


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json('/samples/'+sample).then(function(data){
    // Use sample_values as the values for the PIE chart
    // Use otu_ids as the labels for the pie chart
    // Use otu_labels as the hovertext for the chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var Values = data.sample_values.slice(0,10);
    var ids = data.otu_ids.slice(0,10);
    var labels = data.otu_labels.slice(0,10);
    var D = [{
      values: Values,
      labels: ids,
      type: 'pie',
      hovertext: labels
    }];
    Plotly.newPlot('pie', D);
  })

  // @TODO: Build a Bubble Chart using the sample data
  // Use otu_ids for the x values
  // Use sample_values for the y values
  // Use sample_values for the marker size
  // Use otu_ids for the marker colors
  // Use otu_labels for the text values
  d3.json('/samples/'+sample).then(function(data){
    var Values = data.sample_values;
    var ids = data.otu_ids;
    var labels = data.otu_labels;
    var trace = [{
      x: ids,
      y: Values,
      text: labels,
      mode: 'markers',
      marker:{
        size: Values,
        color: ids
      }
    }];
    Plotly.newPlot('bubble', trace);
  })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
