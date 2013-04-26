// var words=[]; 

// var scatter = {};
// scatter.fill_show_tooltip = function(d){
//   $('#scatter_tt').show();
//   $('#scatter_tt .tt_title').text(d.Title);
//   $('#scatter_tt .tt_points').text('Points: '+d.Points);
// }
// scatter.hide_tooltip = function(){
//   $('#scatter_tt').hide();
// }
// scatter.tuesday;
// scatter.wednesday;
// scatter.thursday;
// scatter.friday;
// scatter.sunday;



// var draw_scatter = function(day){
  
//   var parseDate = d3.time.format("%H-%M").parse
//   var clean_date = function(date_time2){
//     var hour = date_time2.split(" ")[2].split(":")[0];
//     var minute = date_time2.split(" ")[3];
//     return hour +"-"+ minute;
//   }

//   var margin = {top: 20, right: 20, bottom: 60, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

//   var x = d3.time.scale()
//     .range([0, width])
//     .domain(d3.extent(scatter[day], function(d) { return parseDate(clean_date(d.date_time)) }))

//   var y = d3.scale.linear()
//     .range([height, 0])
//     .domain(d3.extent(scatter[day], function(d) { return parseInt(d.Points) }));

//   var color = d3.scale.category10();

//   var xAxis = d3.svg.axis()
//       .scale(x)
//       .orient("bottom");

//   var yAxis = d3.svg.axis()
//       .scale(y)
//       .orient("left");

//   var svg = d3.select("body").append("svg")
//     .attr("class", "scatter_plot")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   scatter['svg'] = svg;

//   svg.append("g")
//     .attr("class","x axis")
//     .attr("transform","translate(0," + height + ")")
//     .call(xAxis)
//   .append("text")
//     .attr("class","label")
//     .attr("x", width/2)
//     .attr("y", 40)
//     .style("text-anchor","end")
//     .text("Time")
//     .style("font-size",20)

//   svg.append("g")
//     .attr("class","y axis")
//     .call(yAxis)
//   .append("text")
//     .attr("class","label")
//     // .attr("transform","rotate(-90)")
//     .attr("y", height/2)
//     .attr("x", 60)
//     .attr("dy", '.72em')
//     .style("text-anchor","end")
//     .text("Points")
//     .style("font-size",15)

//   svg.selectAll("circle")
//     .data(scatter[day])
//     .enter()
//     .append("svg:a")
//       .attr('xlink:href',function(d){return d.Url})
//       .attr('target',"_blank")
//     .append("circle")
//     .attr("cx",function(d){
//       return x(parseDate(clean_date(d.date_time)));
//     })
//     .attr("cy",function(d){
//       return y(parseInt(d.Points));
//     })
//     .attr("r",3.5)
//     .attr('opacity', function(d){
//       return Math.log(d.Points)/8 + 0.13;
//     })
//     .on("mouseover", function(d,i){ d3.select(d3.event.target).attr('r',6.5);scatter.fill_show_tooltip(d)})
//     .on("mouseout", function(){d3.select(this).attr('r',3.5);scatter.hide_tooltip()})
//     // .append("svg:title")
//     //   .text(function(d, i) { return d.Title; })

//     $('.scatter_plot .tick')[0].remove()

//     calculate_keywords(day);

//     $('.scatter_plot a').mouseover(function(e){
//       var mouse_top = e.clientY;
//       var mouse_left = e.clientX;
//       $('#scatter_tt').offset({top: mouse_top-50, left: mouse_left})
//     });
// };

// // LOADING CSVs. Note: the csv call is asynchronous,
// // so this callback syntax ordering ensures the csvs get loaded in correct order. 
// scatter.data = []
// d3.csv('/assets/hn_mon_1_129am.csv',function(d){scatter.data = scatter.data.concat(d.reverse());
//   d3.csv('/assets/hn_mon_1_129pm.csv',function(d){scatter.data = scatter.data.concat(d.reverse());
//     d3.csv('/assets/hn_tues_156am.csv',function(d){scatter.data = scatter.data.concat(d.reverse());
//       d3.csv('/assets/hn_tues_203pm.csv',function(d){scatter.data = scatter.data.concat(d.reverse());
//         d3.csv('/assets/hn_wed_203am.csv',function(d){scatter.data = scatter.data.concat(d.reverse());
//           d3.csv('/assets/hn_thurs_203am.csv',function(d){scatter.data = scatter.data.concat(d.reverse());
//             d3.csv('/assets/hn_fri_103am.csv',function(d){scatter.data = scatter.data.concat(d.reverse());
//               d3.csv('/assets/hn_sun_300am.csv',function(d){scatter.data = scatter.data.concat(d.reverse());
//                 d3.csv('/assets/hn_mon_2_202am.csv',function(d){scatter.data = scatter.data.concat(d.reverse())
              
//                   var num_articles_each_hour = {};
//                   num_articles_each_hour = _.countBy(scatter.data, function(d){
//                     return d.Time_Posted;
//                   });

//                   var article_counter = 0;
//                   var current_time = 0;

//                   scatter.data.forEach(function(d) {
//                     if(d.Time_Posted != current_time){
//                       article_counter = 0;
//                     }
//                     else{article_counter += 1;}
//                     current_time = d.Time_Posted;

//                     d.date_time = d.Time_Posted + " " + Math.ceil(60/(num_articles_each_hour[d.Time_Posted])*article_counter);
//                     d.keywords = get_keywords(d);
//                   });

//                   var grouped_data = _.groupBy(scatter.data, function(d){ return d.date_time.split(' ')[0]});
//                   scatter.monday = grouped_data['01'];
//                   scatter.tuesday = grouped_data['02'];
//                   scatter.wednesday = grouped_data['03'];
//                   scatter.thursday = grouped_data['04']
//                   scatter.friday = grouped_data['05']
//                   scatter.sunday = grouped_data['07']

//                   // console.log(window[day])
                
//                 })
//               })
//             })
//           })
//         })
//       })
//     })
//   })
// })

// // It turns out we have complete (12am to 12pm) data for Monday, Tuesday, Wednesday, Thursday, Sunday, and this Monday.
// // We have partial data for the other days but we're missing too many hours. Sorry about that, I accidentally 
// // overwrote one of the files yesterday night, which cost two days from rounding 