var data;
var words=[]; 

var draw_scatter = function(day){

  var parseDate = d3.time.format("%H-%M").parse
  var clean_date = function(date_time){
    var hour = date_time.split(" ")[2].split(":")[0];
    var minute = date_time.split(" ")[3];
    return hour +"-"+ minute;
  }

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width])
    .domain(d3.extent(scatter[day], function(d) { return parseDate(clean_date(d.date_time)) }))

  var y = d3.scale.linear()
      .range([height, 0])
      .domain(d3.extent(scatter[day], function(d) { return parseInt(d.Points) }));

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

  svg.append("g")
    .attr("class","x axis")
    .attr("transform","translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("class","label")
    .attr("x", width/2)
    .attr("y", 30)
    .style("text-anchor","end")
    .text("Time")

  svg.append("g")
    .attr("class","y axis")
    .call(yAxis)
  .append("text")
    .attr("class","label")
    // .attr("transform","rotate(-90)")
    .attr("y", height/2)
    .attr("x", 50)
    .attr("dy", '.72em')
    .style("text-anchor","end")
    .text("Points")

  svg.selectAll("circle")
    .data(scatter[day])
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
    .attr('opacity', function(d){
      return Math.log(d.Points)/8 + 0.13;
    })
    .on("mouseover", function(d,i){ d3.select(d3.event.target).attr('r',6.5); })
    .on("mouseout", function(){d3.select(this).attr('r',3.5); })
    .append("svg:title")
      .text(function(d, i) { return d.Title; })

    if($($('text')[0]).text() == '1900'){$('text')[0].remove()}

    calculate_keywords(day);
};

var scatter = {};
scatter.tooltip;
scatter.tuesday;
scatter.wednesday;
scatter.thursday;
scatter.friday;
scatter.sunday;

// LOADING CSVs. Note: the csv call is asynchronous,
// so this ordering ensures the csvs get loaded in correct order. 
var data = []
d3.csv('/assets/hn_mon_1_129am.csv',function(d){data = data.concat(d.reverse());
  d3.csv('/assets/hn_mon_1_129pm.csv',function(d){data = data.concat(d.reverse());
    d3.csv('/assets/hn_tues_156am.csv',function(d){data = data.concat(d.reverse());
      d3.csv('/assets/hn_tues_203pm.csv',function(d){data = data.concat(d.reverse());
        d3.csv('/assets/hn_wed_203am.csv',function(d){data = data.concat(d.reverse());
          d3.csv('/assets/hn_thurs_203am.csv',function(d){data = data.concat(d.reverse());
            d3.csv('/assets/hn_fri_103am.csv',function(d){data = data.concat(d.reverse());
              d3.csv('/assets/hn_sun_300am.csv',function(d){data = data.concat(d.reverse());
                d3.csv('/assets/hn_mon_2_202am.csv',function(d){data = data.concat(d.reverse())
              

  var num_articles_each_hour = {};
  // console.log(data);

  var get_keywords = function(post){
    var words=[];
    for(word_num=0;word_num<7;word_num++)
    {
      try{
        words[word_num]=post.Keywords.match(/(\w+)/g)[1+word_num*3];
      }
      catch(e){}
    }
    return words;
  }

  num_articles_each_hour = _.countBy(data, function(d){
    return d.Time_Posted;
  });


  var article_counter = 0;
  var current_time = 0;

  data.forEach(function(d) {
    if(d.Time_Posted != current_time){
      article_counter = 0;
    }
    else{article_counter += 1;}
    current_time = d.Time_Posted;

    d.date_time = d.Time_Posted + " " + Math.ceil(60/(num_articles_each_hour[d.Time_Posted])*article_counter);
    d.keywords = get_keywords(d);
  });

  var grouped_data = _.groupBy(data, function(d){ return d.date_time.split(' ')[0]});
  scatter.monday = grouped_data['01'];
  scatter.tuesday = grouped_data['02'];
  scatter.wednesday = grouped_data['03'];
  scatter.thursday = grouped_data['04']
  scatter.friday = grouped_data['05']
  scatter.sunday = grouped_data['07']

  // console.log(window[day])
                
                })
              })
            })
          })
        })
      })
    })
  })
})





// It turns out we have complete (12am to 12pm) data for Monday, Tuesday, Wednesday, Thursday, Sunday, and this Monday.
// We have partial data for the other days but we're missing too many hours. Sorry about that, I accidentally 
// overwrote one of the files yesterday night, which cost two days from rounding 