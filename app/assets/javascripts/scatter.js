var words=[]; 
var scatter = {};
scatter.fill_show_tooltip = function(d){
  window.clearTimeout(window.timeoutHandle);
  $('#scatter_tt').show();
  $('#scatter_tt .tt_title').text(d.Title);
  $('#scatter_tt .tt_points').text('Points: '+d.Points);
}
scatter.hide_tooltip = function(){
  window.timeoutHandle = window.setTimeout(function() {
    $(".tooltip").hide();
  }, 80)
}
scatter.tuesday;
scatter.wednesday;
scatter.thursday;
scatter.friday;
scatter.sunday;


function draw_scatter(theme){

  // console.log(articles);
  var articles = themes[theme].articles

  var margin = {top: 20, right: 20, bottom: 60, left: 40},
    width = 700 - margin.left - margin.right,
    height = 275 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width])
    .domain(d3.extent(articles, function(d) { return parseDate(clean_date(d.date_time)) }))

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(d3.extent(articles, function(d) { return parseInt(d.Points) }));

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var brush = d3.svg.brush()
      .x(x)
      .y(y)
      .on("brushstart", brushstart)
      .on("brush", brushmove)
      .on("brushend", brushend);

  var brush_coords = [ [0,0],[0,0] ];

  function brushstart(p) {
    brush.clear()
    brush_coords = [ [0,0],[0,0] ];
    console.log(p,'brushstart')
    // if (brushCell !== p) {
    //   cell.call(brush.clear());
    //   x.domain(domainByTrait[p.x]);
    //   y.domain(domainByTrait[p.y]);
    //   brushCell = p;
    // }
  }

  function brushmove(p) {
    var e = brush.extent();
    console.log(e,'brushmove')
    brush_coords = e
    // bottom left to top right
    // brush_coords = [ [date_1,point_1],[date_2,points_2] ] 
  }

  function brushend(p) {
    console.log(brush_coords,'0,0')
    var selected_articles = _.filter(themes[theme].articles,function(article){
      if((brush_coords[0][0] < parseDate(clean_date(article.date_time))) &&
        (brush_coords[1][0] > parseDate(clean_date(article.date_time))) &&
        (brush_coords[0][1] < article.Points) &&
        (article.Points < brush_coords[1][1])){
        return true
      }
      else{return false}
    });
    $('svg.chart').hide()
    if(selected_articles.length === 0){
      draw_bar(theme);
    }
    else{
      draw_bar('none',selected_articles);
    }
    // if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
  }

  var svg = d3.select("#scatter").append("svg")
    .attr("class", "scatter_plot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  scatter['svg'] = svg;

  svg.append("g")
    .attr("class","x axis")
    .attr("transform","translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class","label")
    .attr("x", width/2)
    .attr("y", 40)
    .style("text-anchor","end")
    .text("Time")
    .style("font-size",20)

  svg.append("g")
    .attr("class","y axis")
    .call(yAxis)
  .append("text")
    .attr("class","label")
   // .attr("transform","rotate(-90)")
    .attr("y", height/2)
    .attr("x", 60)
    .attr("dy", '.72em')
    .style("text-anchor","end")
    .text("Points")
    .style("font-size",15);

  svg.call(brush);

  svg.append("text")
    .attr("y", 10)
    .attr("x", width/2 - 100)
    .text("Articles by Theme")
    .style("font-size",15);

  svg.selectAll("circle")
    .data(articles)
    .enter()
    .append("svg:a")
      .attr('xlink:href',function(d){return d.Url})
      .attr('target',"_blank")
    .append("circle")
    .attr("cx",function(d){
      return x(parseDate(clean_date(d.date_time)));
    })
    .attr("cy",function(d){
      return y(parseInt(d.Points));
    })
    .attr("r",3.5)
    // .attr('opacity', function(d){
    //   return Math.log(d.Points)/8 + 0.13;
    // })
    .on("mouseover", function(d,i){ d3.select(d3.event.target).attr('r',6.5);scatter.fill_show_tooltip(d)})
    .on("mouseout", function(){d3.select(this).attr('r',3.5);scatter.hide_tooltip()})
    .on("mousedown", function(d){window.open(d.Url,'_blank',false)})

    $('.scatter_plot .tick')[0].remove()

    $('.scatter_plot a').mouseover(function(e){
      var mouse_top = e.pageY;
      var mouse_left = e.pageX;
      $('#scatter_tt').offset({top: mouse_top-50, left: mouse_left+5})
    });

};
