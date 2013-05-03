function highlight_scatter(word){
  scatter['svg'].selectAll("circle")   
      .attr("r",function(d,i){
        if(get_keywords(d).indexOf(word)!= -1){return 4.5}
        else{return 3.5}})
      .attr('opacity', function(d){
        if(get_keywords(d).indexOf(word)!= -1){return 1}
        else{return 0.4}
      })
      .style('fill',function(d){
        if(get_keywords(d).indexOf(word)!= -1){return 'green'}
        else{return 'black'}
      })
}


// function clear_scatter_highlight(){
//   scatter['svg'].selectAll("circle")   
//     .attr("r",3.5)
//     .attr('opacity',1);
// } 
// var get_keywords = function(post){
//     var words=[];
//     for(word_num=0;word_num<7;word_num++)
//     {
//       try{
//         words[word_num]=post.Keywords.match(/(\w+)/g)[1+word_num*3];
//       }
//       catch(e){}
//     }
//     return words;
// }
