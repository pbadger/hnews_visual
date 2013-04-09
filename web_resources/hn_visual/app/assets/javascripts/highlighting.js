var highlight = function(word,day){
  console.log(word)
  scatter['svg'].selectAll("circle")
    
      .attr("r",function(d,i){
        if(get_keywords(d).indexOf(word)!= -1){return 7.5}
        else{return 3.5}})
      .attr('opacity', function(d){
        if(get_keywords(d).indexOf(word)!= -1){return .8}
        else{return Math.log(d.Points)/8 + 0.13}
      })
}

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