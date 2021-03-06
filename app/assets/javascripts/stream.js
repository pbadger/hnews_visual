stream = {};

theme_dict = {'bmbombs':'Boston Marathon Events','google_glass':'Google Glass','cispa':'CISPA','startups':'Startup News','mobile':'Mobile News','bitcoin':'Bitcoin News','servers':'Back-End Development'};

stream.show_tooltip = function(d){
  window.clearTimeout(window.timeoutHandle);
  $('#stream_tt').show();
  $('#stream_tt .tt_title').text(theme_dict[d[0].name]);
  //$('#stream_tt .tt_points').text('Points: '+d.Points);
}
stream.hide_tooltip = function(){
  window.timeoutHandle = window.setTimeout(function() {
    $("#stream_tt").hide();
  }, 80)
}

function draw_stream(){
  var short_days = ['Mon','Tues','Wed','Thurs','Fri','Sat','Sun','Mon','Tues','Wed','Thurs','Fri','Sat','Sun'];
  var articles = [];
  _.each(theme_names,function(name){
    console.log(themes[name],name);
    articles = articles.concat(themes[name].articles);
  });

  var n = theme_names.length, // number of layers
      stack = d3.layout.stack().offset("wiggle"),
      layers0 = stack(d3.range(n).map(function(i){ return get_layer(i)}));

  var margin = {top: 5, right: 5, bottom: 5, left: 5},
      width = $('#stream').width() - margin.left - margin.right,
      height = $('#stream').height() - margin.top - margin.bottom;

  var xAxis = d3.svg.axis().scale(x);

  var x = d3.scale.linear()
    .domain([0,13])
    .range([0+width*.03,width*.97])

  var xAxis = d3.svg.axis().scale(x);

  var y = d3.scale.linear()
    .domain([0, d3.max(layers0, function(layer) {
      return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
    .range([0+height*.0,height*.9]);

  var yAxis = d3.svg.axis().scale(y);

  // var color = d3.scale.linear()
  //   .range(["#333", "#eee"]);

  var color = d3.scale.category20c()

  var area = d3.svg.area()
      .x(function(d,i) { return x(d.x);})
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var svg = d3.select("#stream").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.selectAll("path")
      .data(layers0)
    .enter().append("path")
      .attr("d", area)
      .attr("id", function(d){ return d[0].name; })
      .style("fill", function() { return color(Math.random()); })
      .style("cursor",'pointer')
      .on("mouseover", function(d,i){
        d3.select(this).style('stroke','black').style("stroke-width","3px");
        stream.show_tooltip(d); 
      }) 
      .on("mouseout", function(){
        d3.select(this).style('stroke','none');
        stream.hide_tooltip();
      })
      .on("click",function(d,i){
        $('.middle-area button').removeClass('selected');
        $('.middle-area .'+d[0].name).addClass('selected');
        var theme_name = d[0].name;
        remove_bar_and_scatter();
        draw_bar(theme_name);
        draw_scatter(theme_name);
      })

  window.svg = svg;
  window.xAxis = xAxis;
  window.height = height;
  window.short_days = short_days;
  window.width = width;
  window.stream_axis = stream_xaxis;

  var stream_xaxis = svg.append("g")
    .attr("class","yaxis")
    .style("stroke","black")
    .attr("transform","translate(0 "+ (height - 10) +")")
    .call(xAxis.orient("top").tickFormat(""))
    .style("stroke-width",1)

  _.each(short_days,function(d,i){
    stream_xaxis.append("text")
      .attr("transform","translate( "+(88*i+20)+" 0)"+"rotate(-30)")
      .style("font-size",20)
      .text(short_days[i]);
  });

  svg.append("text")
    .attr("transform","translate( "+(width / 2 - 220)+" 20)")
    .style("font-size",20)
    .text("HN Themes From April 15th to April 28th")

  var y_axis = svg.append("g")
    .attr("class","y axis")
    .attr("transform","translate(30 0) rotate(90)")
    .call(yAxis.tickFormat(""))
    .append("text")
      .attr("transform","translate(300 14) rotate(180)")
      .style("font-size",14)
      .text("Theme Points: 1 tick = 200 points")
  
  $('.loading').hide();
  $('.modal.fade').css('top', '10%')
  $('.loading').html('<button class="btn premade color8">Continue');
  $('.loading button').click(function() {
    $('#video_modal').modal('hide');
    introJs().start();
  });
  $('.loading').show();

  $('#stream svg').mouseover(function(e){
    var mouse_top = e.pageY;
    var mouse_left = e.pageX;
    $('#stream_tt').offset({top: mouse_top-50, left: mouse_left+5})
  });

  function reset_highlight(){
    $('#bmbombs').attr('stroke', 'none');
  }

  function get_layer(i){
    layer = []
    point = {}
    name = theme_names[i];
    day_array = get_total_keyword_points(themes[name].keywords);
    for(var i=0; i<14; i++){
      point = {x:i,y:day_array[i],name:name};
      layer.push(point);
    }
    console.log(layer,"layer")
    return layer;
  }


}

function get_keywords_for_days(){
  var keywords = [];
  total_data.monday2.concat(total_data.tuesday2,total_data.wednesday2,total_data.thursday2,total_data.friday2,total_data.saturday2,total_data.sunday2)
  _.each(total_data, function(d){
    keywords = keywords.concat(get_keywords(d),d.Title.match(/(\w+)/g),d.Title.match(/(\w+)/g))
  });

  keywords = _.filter(keywords, function(word){
    if(word)
      {return (word.length >= 3 && stop_words.indexOf(word.toLowerCase()) == -1)}
    else
      {return 0;}});

  keywords = _.countBy(keywords, function(word) {
    return word.toLowerCase();
  });

  keywords = $.map(keywords, function (value, key){
    return key+"_"+value})

  keywords = _.sortBy(keywords, function(string){ return -string.split("_")[1]});
  console.log(keywords)
}

function get_pop_keywords_from_articles(articles){
  var keywords = [];
  _.each(articles, function(d){
    keywords = keywords.concat(get_keywords(d),d.Title.match(/(\w+)/g),d.Title.match(/(\w+)/g))
  });

  keywords = _.filter(keywords, function(word){
    if(word)
      {return (word.length >= 3 && stop_words.indexOf(word.toLowerCase()) == -1)}
    else
      {return 0;}});

  keywords = _.countBy(keywords, function(word) {
    return word.toLowerCase();
  });

  keywords = $.map(keywords, function (value, key){
    return key+"_"+value})

  keywords = _.sortBy(keywords, function(string){ return -string.split("_")[1]});
  return keywords
}


