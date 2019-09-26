function buildMetadata(station) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${station}`;


    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(url, function(error, station) {
      if (error) return console.warn(error);
      var sampleMetadata = d3.select("#sample-metadata");
  
    // Use `.html("") to clear any existing metadata
      sampleMetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(station).forEach(function ([key, value]) {
        var row = sampleMetadata.append("p");
        row.text(`${key}: ${value}`);
      });
    });
}


function buildLineChart(station) {
  // TO DO: Iterate through all states
  var url = `/total/${station}`
  
  d3.json(url, function(error, data) {     
    if (error) return console.warn(error);  
      // Build line chart
      var x= data.year;
      var y= data.ridership;
      var values= data.year;

          var trace1 = {
              x: x,
              y: y,
              text: values,
              mode: 'line'
          };
      var data = [trace1];

      var layout = {
          title: `Total Ridership for: ${station}`,
          xaxis: { title: "Year"},
          yaxis: { title: "Total Ridership over the years"}
      };
      Plotly.newPlot("line", data, layout, {responsive: true});        
  });
}

function buildBarChart(station) {
  var url = `/station/${station}`
  
  d3.json(url, function(error, data) {       
    if (error) return console.warn(error);
    var x= data.year; 
    var y_weekday= data.weekday_ridership;
    var y_saturday = data.saturday_ridership;
    var y_sunday = data.sunday_ridership;    
    var values= data.year;

    var trace1 = {
            x: x,
            y: y_weekday,
            text: values,
            type: 'bar',
            name: "Weekday Ridership"
    };
        var trace2 = {
          x: x,
          y: y_saturday,
          text: values,
          type: 'bar',
          name: "Saturday Average Ridership"          
      };

      var trace3 = {
        x: x,
        y: y_sunday,
        text: values,
        type: 'bar',
        name: "Sunday/Holiday Average Ridership"        
    };      
      var data = [trace1, trace2, trace3];

      var layout = {
          title: `Average Day-Type Ridership for: ${station}`,
          xaxis: { title: "Year"},
          yaxis: { title: "Average Day-Type Ridership"},
          barmode: 'stack'
      };
      Plotly.newPlot("bar", data, layout);        
    });

}


function init() {      

  // Set up the dropdown menu
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/stations", function(error, data) {
    if (error) return console.warn(error);
    data.forEach((station) => {
      selector
          .append("option")
          .text(station)
          .property("value", station);
      });
  // d3.json("/stations").then((stationNames) => {
  //   stationNames.forEach((station) => {
  //   selector
  //       .append("option")
  //       .text(station)
  //       .property("value", station);
  //   });
  
  // Use the first sample from the list to build the initial plots
  const firstStation = data[0];
  
  buildMetadata(firstStation);
  buildLineChart(firstStation);
  buildBarChart(firstStation);
  });

  // //create a list of years to populate select options
  // var selector2 = d3.select("#selDatasetYear");
  // d3.json("/years").then((years) => {
  //   console.log(years)
  //   years.forEach((year) => {
  //     selector2
  //         .append("option")
  //         .text(year)
  //         .property("value", year);
  //   });
  //   const firstYear = years[0];
  // });
}

function optionChanged(newStation) {
  // Fetch new data each time a new state is selected
  buildMetadata(newStation);
  buildLineChart(newStation);
  buildBarChart(newStation);
}

init();