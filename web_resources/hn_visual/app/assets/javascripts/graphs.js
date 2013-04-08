var data;
var words=[]; 

$(function(){

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);


  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // NOTE THIS IS AN ASYNCHRONOUS REQUEST SO YOU HAVE TO RUN THINGS IN THE CALLBACK
  d3.csv('/assets/hn_mon_129pm.csv',function(d)
  {
    data = d;
    for(word_num=0;word_num<7;word_num++)
    {
      words[word_num]=d[0].Keywords.match(/(\w+)\W/g)[1+word_num*3];
    }
  });

});


// LOADING CSVs. Note: the csv call is asynchronous,
// so this ordering ensures the csvs get loaded in correct order. 
var a = []
d3.csv('/assets/hn_mon_1_129am.csv',function(d){a = a.concat(d.reverse());
  d3.csv('/assets/hn_mon_1_129pm.csv',function(d){a = a.concat(d.reverse());
    d3.csv('/assets/hn_tues_156am.csv',function(d){a = a.concat(d.reverse());
      d3.csv('/assets/hn_tues_203pm.csv',function(d){a = a.concat(d.reverse());
        d3.csv('/assets/hn_wed_203am.csv',function(d){a = a.concat(d.reverse());
          d3.csv('/assets/hn_thurs_203am.csv',function(d){a = a.concat(d.reverse());
            d3.csv('/assets/hn_fri_103am.csv',function(d){a = a.concat(d.reverse());
              d3.csv('/assets/hn_sun_300am.csv',function(d){a = a.concat(d.reverse())
              ;})
            ;})
          ;})
        ;})
      ;})
    ;})
  ;})
;});

a.forEach(function(d) {
  d.date_time = +d.;
  d.title = +d.sepalWidth;
  keywords =
});


// This goes through each entry and prints the time, since I was checking what times we are missing.
// var time = '';
var num_articles_each_hour = {};
var article_counter;
a.forEach(function(c){
  article_counter = article_counter++;
  if(c.Time_Posted != time)
  {
    num_articles_each_hour[c.Time_Posted] = article_counter + 1;
    console.log(c.Time_Posted);

    time = c.Time_Posted;
  }
})
num_articles_each_hour

// It turns out we have complete (12am to 12pm) data for Monday, Tuesday, Wednesday, Thursday, Sunday, and this Monday.
// We have partial data for the other days but we're missing too many hours. Sorry about that, I accidentally 
// overwrote one of the files yesterday night, which cost two days from rounding 