total_data = [];
d3.csv('/assets/mon_15_to_fri_19.csv',function(d){total_data = total_data.concat(d.reverse());
  d3.csv('/assets/sat_20_sun_21.csv',function(d){total_data = total_data.concat(d.reverse());
    d3.csv('/assets/mon_22.csv',function(d){total_data = total_data.concat(d.reverse());
      d3.csv('/assets/tues_23.csv',function(d){total_data = total_data.concat(d.reverse());
        d3.csv('/assets/wed_24_fri_27.csv',function(d){total_data = total_data.concat(d.reverse());
          d3.csv('/assets/sat_27_sun_28.csv',function(d){total_data = total_data.concat(d.reverse());              
            var num_articles_each_hour = {};
            num_articles_each_hour = _.countBy(total_data, function(d){
              return d.Time_Posted;
            });

            var article_counter = 0;
            var current_time = 0;

            total_data.forEach(function(d) {
              if(d.Time_Posted != current_time){
                article_counter = 0;
              }
              else{article_counter += 1;}
              current_time = d.Time_Posted;

              d.date_time = d.Time_Posted + " " + Math.ceil(60/(num_articles_each_hour[d.Time_Posted])*article_counter);
              d.keywords = get_keywords(d);
            });

            var grouped_data = _.groupBy(total_data, function(d){ return d.date_time.split(' ')[0]});
            total_data.monday1 = grouped_data['15'];
            total_data.tuesday1 = grouped_data['16'];
            total_data.wednesday = grouped_data['17'];
            total_data.thursday = grouped_data['18'];
            total_data.friday = grouped_data['19'];
            total_data.saturday = grouped_data['20'];
            total_data.sunday = grouped_data['21'];
            total_data.monday2 = grouped_data['22'];
            total_data.tuesday2 = grouped_data['23'];
            total_data.wednesday2 = grouped_data['24'];
            total_data.thursday2 = grouped_data['25'];
            total_data.friday2 = grouped_data['26'];
            total_data.saturday2 = grouped_data['27'];
            total_data.sunday2 = grouped_data['28'];

            setup_themes();
            draw_theme("google_glass");
          })
        })
      })
    })
  })
})