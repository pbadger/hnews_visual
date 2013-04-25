# Mechanize is a library I found to deal with submitting forms. 
import re
import mechanize
import csv
import string
from collections import Counter
from datetime import datetime
from datetime import timedelta
from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

output = open("hn_mon_202am.csv", "wb")
writer = csv.writer(output)
writer.writerow(["Title", "Points", "Url", "Time_Posted", "Keywords"])

# Mechanize simulates a browser 
br = mechanize.Browser()
br.set_handle_robots(False)
br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]

response = br.open('https://news.ycombinator.com/newest')
dom = DOM(response.read())



stop_list = ['1','2','3','4','5','6','7','8','9','10','a','able','about','above','according','accordingly','across','actually','after','afterwards','again','against','ain','all',
'allow','allows','almost','alone','along','already','also','although','always','am','among','amongst','an','and','another','any',
'anybody','anyhow','anyone','anything','anyway','anyways','anywhere','apart','appear','appreciate','appropriate','are','aren',
'around','as','aside','ask','asking','associated','at','available','away','awfully','b','be','became','because','become','becomes',
'becoming','been','before','beforehand','behind','being','believe','below','beside','besides','best','better','between','beyond',
'both','brief','but','by','c','came','can','can','cannot','cant','cause','causes','certain','certainly','changes','clearly',
'co','com','come','comes','concerning','consequently','consider','considering','contain','containing','contains','corresponding',
'could','couldn','course','currently','d','definitely','described','despite','did','different','do','does','doing','done','down',
'downwards','during','e','each','edu','eg','eight','either','else','elsewhere','enough','entirely','especially','et','etc','even',
'ever','every','everybody','everyone','everything','everywhere','ex','exactly','example','except','f','far','few','fifth','first',
'five','followed','following','follows','for','former','formerly','forth','four','from','further','furthermore','g','get','gets',
'getting','given','gives','go','goes','going','gone','got','gotten','greetings','h','had','hadn','happens','hardly','has','hasn',
'have','haven','having','he','hello','help','hence','her','here','hereafter','hereby','herein','hereupon','hers','herself','hi',
'him','himself','his','hither','hopefully','how','howbeit','however','i','ie','if','ignored','immediate','in','inasmuch','inc',
'indeed','indicate','indicated','indicates','inner','insofar','instead','into','inward','is','it','its','itself','j','just','k',
'keep','keeps','kept','know','knows','known','l','last','lately','later','latter','latterly','least','less','lest','let','like',
'liked','likely','little','look','looking','looks','ltd','m','mainly','many','may','maybe','me','mean','meanwhile','merely','might',
'more','moreover','most','mostly','much','must','my','myself','n','name','namely','nd','near','nearly','necessary','need','needs',
'neither','never','nevertheless','new','next','nine','no','nobody','non','none','noone','nor','normally','not','nothing','novel',
'now','nowhere','o','obviously','of','off','often','oh','ok','okay','old','on','once','one','ones','only','onto','or','other',
'others','otherwise','ought','our','ours','ourselves','out','outside','over','overall','own','p','particular','particularly',
'per','perhaps','placed','please','plus','possible','presumably','probably','provides','q','que','quite','qv','r','rather','rd',
're','really','reasonably','regarding','regardless','regards','relatively','respectively','right','s','said','same','saw','say',
'saying','says','second','secondly','see','seeing','seem','seemed','seeming','seems','seen','self','selves','sensible','sent',
'serious','seriously','seven','several','shall','she','should ','since','six','so','some','somebody','somehow','someone','something',
'sometime','sometimes','somewhat','somewhere','soon','sorry','specified','specify','specifying','still','sub','such','sup','sure',
't','take','taken','tell','tends','th','than','thank','thanks','thanx','that','thats','the','their','theirs','them','themselves',
'then','thence','there','thereafter','thereby','therefore','therein','theres','thereupon','these','they','think','third','this',
'thorough','thoroughly','those','though','three','through','throughout','thru','thus','to','together','too','took','toward',
'towards','tried','tries','truly','try','trying','twice','two','u','un','under','unfortunately','unless','unlikely','until','unto',
'up','upon','us','use','used','useful','uses','using','usually','uucp','v','value','various','very','via','viz','vs','w','want',
'wants','was','way','we','well','went','were','weren','what','whatever','when','whence','whenever','where','whereafter','whereas',
'whereby','wherein','whereupon','wherever','whether','which','while','whither','who','whoever','whole','whom','whose','why','will',
'willing','wish','with','within','without','won','wonder','would','would','wouldn','x','y','yes','yet','you','your','yours',
'yourself','yourselves','z','zero']

article_number = 0
end_scrape = False

while end_scrape == False:
  for post_index in range(1,31):
    article_number += 1
    first_line = dom.by_tag('table')[2][ 3*post_index - 3 ][2]
    second_line = dom.by_tag('table')[2][ 3*post_index - 2 ][1]

    title = first_line[0].content
    
    url = first_line[0].href
    if 'item?' in url[0:8]:
      url = 'http://news.ycombinator.com/' + url

    points = int(second_line[0].content.split(" ")[0])

    # Time calculations
    time_string = second_line[3].html[1:15]
    if 'hour' in time_string:
      hours_since_post = int(time_string[0:2])
    else:
      min_since_post = float(time_string[0:2])/60
      if min_since_post < .5:
        hours_since_post = 0
      else:
        hours_since_post = 1
    # NOTE: THE FOLLOWING 23 REFERS TO THE NUMBER OF HOURS, AND ASSUMES THIS WILL BE RUN AT 1AM 
    if hours_since_post < 23:
      diff = timedelta(hours=hours_since_post)
      time_posted = datetime.now() - diff
      time_parsed = time_posted.strftime("%d %m %H:00")
      # returns: '30 03, 23:00' NOTE: This can be changed using http://docs.python.org/2/library/datetime.html#strftime-and-strptime-behavior

      title = title.encode('ascii','ignore')
      # points = points.encode('ascii','ignore')
      url = url.encode('ascii','ignore')
      time_parsed = time_parsed.encode('ascii','ignore')

      print (title, points, article_number)
    
      # Linked article parsing
      try:
        response = br.open( url, timeout=15.0 )
        dom2 = DOM(response.read())
        article_text = plaintext(dom2.html, keep=[], replace={}, linebreaks=1, indentation=False)
        word_list = re.findall(r"[\w']+", article_text.lower())
        count = Counter()
        word_list = word_list[0:3000]
        for word in word_list:
          count[word] += 1
        for word in count:
          if word in stop_list:
            count[word] = 0
        title_words = re.findall(r"[\w']+", title.lower())
        top_word_number = int(count.most_common(1)[0][1]*.75)
        for t_word in title_words:
          if word not in stop_list:
            count[word] += top_word_number
        common_words = count.most_common(7)
        # CHECK FOR PLURALS? 
      except:
        pass
        common_words = []
      writer.writerow( (title.replace(',', ' '), points, url, time_parsed, common_words) )
    else:
      end_scrape = True
    if 'day' in time_string:
      end_scrape = True

  new_link = 'http://news.ycombinator.com' + dom.by_tag('table')[2][91][1][0].href
  print new_link
  response = br.open(new_link)
  dom = DOM(response.read())

