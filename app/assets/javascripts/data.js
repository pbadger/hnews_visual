data = [];
d3.csv('/assets/mon_15_to_fri_19.csv',function(d){console.log(d);data = data.concat(d.reverse());
  d3.csv('/assets/sat_20_sun_21.csv',function(d){data = data.concat(d.reverse());
    d3.csv('/assets/mon_22.csv',function(d){data = data.concat(d.reverse());
      d3.csv('/assets/tues_23.csv',function(d){data = data.concat(d.reverse());
        
        var num_articles_each_hour = {};
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
        data.monday1 = grouped_data['15'];
        data.tuesday1 = grouped_data['16'];
        data.wednesday = grouped_data['17'];
        data.thursday = grouped_data['18'];
        data.friday = grouped_data['19'];
        data.saturday = grouped_data['20'];
        data.sunday = grouped_data['21'];
        data.monday2 = grouped_data['22'];
        data.tuesday2 = grouped_data['23'];
        // console.log(window[day])

        draw_scatter("wednesday");
      })
    })
  })
})