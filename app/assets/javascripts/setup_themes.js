themes = {};
themes.bmbombs = {};
themes.cispa = {};
themes.google_glass = {};
themes.startups = {};
themes.mobile = {};
themes.twitter = {};
themes.bitcoin = {};
themes.servers = {};

theme_names = ['bmbombs','google_glass','cispa','startups','mobile','twitter','bitcoin','servers'];

function filter(article,keywords,min_overlap){
  return has_intersect(keywords,get_keywords(article),min_overlap);
}

function filter_articles(data,keywords,min_overlap){
  var filtered = _.filter(data,function(article){
    return filter(article,keywords,min_overlap);
  });
  return filtered;
}

// function get_theme(name){
// 	if(name == "bmbombs"){ return themes.bmbombs; }
// 	else if(name == "cispa"){ return themes.cispa;}
// 	else if(name == "google_glass"){ return themes.google_glass;}
// 	else if(name == "startups"){ return themes.startups;}
// }

function draw_theme(name){
	draw_bar(name);
	draw_scatter(name);
	//draw_stream(name);
}

function setup_themes(){
  themes.bmbombs.keywords = ['boston','bombing','bomb','bombs','marathon','dead',
  'terrorism','tsarnaev','reddit','police','mit','threat'];

  themes.bmbombs.articles = filter_articles(total_data,themes.bmbombs.keywords,2);


  themes.cispa.keywords = ['cispa','privacy','congress','bill','security','veto','white','freedom','lawmakers','cybersecurity','government'];

  themes.cispa.articles = filter_articles(total_data,themes.cispa.keywords,2);



  themes.google_glass.keywords = ['google','glass','glasses'];

  themes.google_glass.articles = filter_articles(total_data,themes.google_glass.keywords,2);


  themes.startups.keywords = ['startups','startup','founder','founders','funding','venture','capital'];

  themes.startups.articles = filter_articles(total_data,themes.startups.keywords,2);
  console.log('done with setup!')

  themes.mobile.keywords = ['mobile','android','iphone','ipad','microsoft','apple','smartphone','galaxy','ios']
  themes.mobile.articles = filter_articles(total_data,themes.mobile.keywords,2);

  themes.twitter.keywords = ['twitter']
  themes.twitter.articles = filter_articles(total_data,themes.twitter.keywords,1);

  themes.bitcoin.keywords = ['bitcoin','bitcoins','hacker','currency','coin','mining','encryption','mtgox','coinbase']
  themes.bitcoin.articles = filter_articles(total_data,themes.bitcoin.keywords,1);

  themes.servers.keywords = ['server','rails','heroku','hosting','host']
  themes.servers.articles = filter_articles(total_data,themes.servers.keywords,1);
}


