// var parseDate = d3.time.format("%m-%d-%H-%M").parse
// function clean_date(date_time2){
//   var month = date_time2.split(" ")[1];
//   var day = date_time2.split(" ")[0];
//   var hour = date_time2.split(" ")[2].split(":")[0];
//   var minute = date_time2.split(" ")[3];
//   return month + "-" + day + "-" + hour +"-"+ minute;
// }

function draw_stream(theme){
  // Write function to get data for all themes: this should be default.

  var margin = {top: 5, right: 5, bottom: 5, left: 5},
      width = $('#stream').width() - margin.left - margin.right,
      height = $('#stream').height() - margin.top - margin.bottom;

  var x = d3.scale.time()
      .domain([0, m - 1])
      .range([0, width]);

  var n = 5, // number of layers
      m = 14, // number of samples per layer
      stack = d3.layout.stack().offset("wiggle"),
      layers0 = stack(d3.range(x)),
      layers1 = stack(d3.range(n).map(function() { return bumpLayer(m); }));

}