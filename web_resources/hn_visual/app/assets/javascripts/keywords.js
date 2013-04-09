var stop_words = ['100','able','about','above','according','accordingly','across','actually','after','afterwards','again','against','ain','all',
'allow','allows','almost','alone','along','already','also','although','always','among','amongst','an','and','another','any',
'anybody','anyhow','anyone','anything','anyway','anyways','anywhere','apart','appear','appreciate','appropriate','are','aren',
'around','aside','ask','asking','associated','at','available','away','awfully','became','because','become','becomes',
'becoming','been','before','beforehand','behind','being','believe','below','beside','besides','best','better','between','beyond',
'both','brief','but','came','can','can','cannot','cant','cause','causes','certain','certainly','changes','clearly',
'com','come','comes','concerning','consequently','consider','considering','contain','containing','contains','corresponding',
'could','couldn','course','currently','definitely','described','despite','did','different','do','does','doing','done','down',
'downwards','during','each','edu','eight','either','else','elsewhere','enough','entirely','especially','etc','even',
'ever','every','everybody','everyone','everything','everywhere','ex','exactly','example','except','f','far','few','fifth','first',
'five','followed','following','follows','for','former','formerly','forth','four','from','further','furthermore','get','gets',
'getting','given','gives','goes','going','gone','got','gotten','greetings','had','hadn','happens','hardly','has','hasn',
'have','haven','having','he','hello','help','hence','her','here','hereafter','hereby','herein','hereupon','hers','herself',
'him','himself','his','hither','hopefully','how','howbeit','however','ie','if','ignored','immediate','in','inasmuch','inc',
'indeed','indicate','indicated','indicates','inner','insofar','instead','into','inward','its','itself','just',
'keep','keeps','kept','know','knows','known','last','lately','later','latter','latterly','least','less','lest','let','like',
'liked','likely','little','look','looking','looks','ltd','mainly','many','may','maybe','mean','meanwhile','merely','might',
'more','moreover','most','mostly','much','must','myself','name','namely','nd','near','nearly','necessary','need','needs',
'neither','never','nevertheless','new','next','nine','nobody','non','none','noone','nor','normally','not','nothing','novel',
'now','nowhere','obviously','off','often','okay','old','once','one','ones','only','onto','other',
'others','otherwise','ought','our','ours','ourselves','out','outside','over','overall','own','particular','particularly',
'per','perhaps','placed','please','plus','possible','presumably','probably','provides','que','quite','rather',
'really','reasonably','regarding','regardless','regards','relatively','respectively','right','said','same','saw','say',
'saying','says','second','secondly','see','seeing','seem','seemed','seeming','seems','seen','self','selves','sensible','sent',
'serious','seriously','seven','several','shall','she','should ','since','six','some','somebody','somehow','someone','something',
'sometime','sometimes','somewhat','somewhere','soon','sorry','specified','specify','specifying','still','sub','such','sup','sure',
'take','taken','tell','tends','th','than','thank','thanks','thanx','that','thats','the','their','theirs','them','themselves',
'then','thence','there','thereafter','thereby','therefore','therein','theres','thereupon','these','they','think','third','this',
'thorough','thoroughly','those','though','three','through','throughout','thru','thus','together','too','took','toward',
'towards','tried','tries','truly','try','trying','twice','two','under','unfortunately','unless','unlikely','until','unto',
'up','upon','use','used','useful','uses','using','usually','uucp','value','various','very','via','viz','want',
'wants','was','way','we','well','went','were','weren','what','whatever','when','whence','whenever','where','whereafter','whereas',
'whereby','wherein','whereupon','wherever','whether','which','while','whither','who','whoever','whole','whom','whose','why','will',
'willing','wish','with','within','without','won','wonder','would','would','wouldn','yes','yet','you','your','yours',
'yourself','yourselves','zero']


var calculate_keywords = function(day){
  // console.log(scatter[day])
  var data = scatter[day]
  var keywords = [];
  _.each(data, function(d){
    keywords = keywords.concat(get_keywords(d),d.Title.match(/(\w+)/g),d.Title.match(/(\w+)/g))
  });
  // console.log(keywords,2);
  
  keywords = _.filter(keywords, function(word){
    if(word)
      {return (word.length >= 3 && stop_words.indexOf(word.toLowerCase()) == -1)}
    else
      {return 0;}});

  keywords = _.countBy(keywords, function(word) {
    return word;
  });

  keywords = $.map(keywords, function (value, key){
    return key+"_"+value})

  keywords = _.sortBy(keywords, function(string){ return -string.split("_")[1]});

  // console.log(keywords,4)

  draw_bars(keywords.slice(0,10))

}


var draw_bars = function(keywords){
  data = {};
  keywords.forEach(function(dat,i) {
    d = {};
    d.word = dat.split('_')[0];
    d.fre = parseInt(dat.split('_')[1]);
    data[i] = d;
  })

  console.log(data);

  // #ff6600 <---- ORANGE
  var chart = d3.select("body").append("svg")
    .attr("class", "chart")
    .attr("width", 620)
    .attr("height", 20 * 20);

  var x = d3.scale.linear()
    .domain([0, 200])
    .range([0, 420]);

  chart.selectAll("rect")
    .data(data)
  .enter().append("rect")
    .attr("y", function(d, i) { return i * 20; })
    .attr("width", function(d,i){return d.fre})
    .attr("height", 20);
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

