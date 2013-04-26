days = ['monday1','tuesday1','wednesday','thursday','friday','saturday','sunday','monday2','tuesday2']

// keywords.bombing,'bombing\n',
// keywords.bomb,'bomb\n',
// keywords.bombs,'bombs\n',
// keywords.marathon,'marathon\n',
// keywords.dead,'dead\n',
// keywords.terrorism,'terrorism\n',
// keywords.tsarnaev,'tsarnaev\n',
// keywords.reddit,'reddit\n'

function get_total_keyword_frequency(keywords){
  _.each(days, function(day){
    var points = get_theme_points(day,keywords)
    console.log(points)
  });
}

function get_theme_points(day,keywords)
{ 
  points = 0;
  occurrences = 0;
  _.each(data[day], function(post){
    var post_words = get_keywords(post);
    if(has_intersect(post_words, keywords)) 
    {
      points += parseInt(post.Points);
      occurrences += 1;
    }
  });
  theme_points = occurrences * 1 + points;
  return theme_points;
}

function has_intersect(a, b)
{
  for(i=0;i<a.length;i++)
  {
    for(j=0;j<b.length;j++)
    {
      if(a[i] == b[j]){return true;}
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