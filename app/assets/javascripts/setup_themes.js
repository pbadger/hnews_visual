themes = {};
themes.bmbombs = {};
themes.cispa = {};
themes.google_glass = {};
themes.startups = {};

function filter(article,keywords,min_overlap){
  return has_intersect(keywords,get_keywords(article),min_overlap);
}

function filter_articles(data,keywords,min_overlap){
  var filtered = _.filter(data,function(article){
    return filter(article,keywords,min_overlap);
  });
  return filtered;
}

var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });

function setup_themes(){

  themes.bmbombs.keywords = ['boston','bombing','bomb','bombs','marathon','dead',
  'terrorism','tsarnaev','reddit','police','mit','threat'];

  themes.bmbombs.articles = filter_articles(total_data,themes.bmbombs.keywords,2);


  themes.cispa.keywords = ['cispa','privacy','congress','bill','security'];

  themes.cispa.articles = filter_articles(total_data,themes.cispa.keywords,2);



  themes.google_glass.keywords = ['google','glass','glasses'];

  themes.google_glass.articles = filter_articles(total_data,themes.google_glass.keywords,2);


  themes.startups.keywords = ['startups','startup','founder','founders','funding','venture','capital'];

  themes.startups.articles = filter_articles(total_data,themes.startups.keywords,2);
  console.log('done with setup!')
}


