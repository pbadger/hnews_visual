days = ['monday1','tuesday1','wednesday','thursday','friday','saturday','sunday','monday2','tuesday2',
'wednesday2','thursday2','friday2','saturday2','sunday2']

function get_total_keyword_frequency(keywords){
  _.each(days, function(day){
    var points = get_theme_points(day,keywords);
    return console.log(points);
  });
}

function get_theme_points(day,keywords)
{ 
  points = 0;
  occurrences = 0;
  _.each(total_data[day], function(post){
    var post_words = get_keywords(post);
    if(has_intersect(post_words, keywords)) 
    {
      points += parseInt(post.Points);
      occurrences += 1;
    }
  });
  theme_points = occurrences * 1 + points * 0;
  return theme_points;
}

function has_intersect(a, b, min_intersections)
{
  var count = 0;
  for(i=0;i<a.length;i++)
  {
    for(j=0;j<b.length;j++)
    {
      if(a[i] == b[j]){
        count +=1;
        if(count >= min_intersections){return true;}
      }
    }
  }
  return false;
}

function get_keywords(post){
    var words=[];
    for(word_num=0;word_num<10;word_num++)
    {
      try{
        words[word_num]=post.Keywords.match(/(\w+)/g)[1+word_num*3];
      }
      catch(e){}
    }
    return words;
}

var parseDate = d3.time.format("%m-%d-%H-%M").parse
function clean_date(date_time2){
  var month = date_time2.split(" ")[1];
  var day = date_time2.split(" ")[0];
  var hour = date_time2.split(" ")[2].split(":")[0];
  var minute = date_time2.split(" ")[3];
  return month + "-" + day + "-" + hour +"-"+ minute;
}