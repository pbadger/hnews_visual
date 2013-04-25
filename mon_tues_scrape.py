# Mechanize is a library I found to deal with submitting forms. 
import time
import re
import mechanize
import csv
import string
from collections import Counter
from datetime import datetime
from datetime import timedelta
from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import random

output = open("hn_tues_23_1159pm.csv", "wb")
# output = open("testing.csv", "wb")
writer = csv.writer(output)
output2 = open("tues_23_no_keywords.csv", "wb")
writer2 = csv.writer(output2)
writer.writerow(["Title", "Points", "Url", "Time_Posted", "Keywords"])
writer2.writerow(["Title", "Points", "Url", "Time_Posted"])


# Mechanize simulates a browser 
br = mechanize.Browser()
br.set_handle_robots(False)
br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]

response = br.open('https://news.ycombinator.com/newest')
dom = DOM(response.read())

blocks = {'pre': ('', ' '), 'blockquote': ('', ' '), 'form': ('', ' '), 'h2': ('', ' '), 'h3': ('', ' '),
'h1': ('', ' '), 'h6': ('', ' '), 'h4': ('', ' '), 'h5': ('', ' '), 'code': ('', ' '),
'br': ('', ' '), 'table': ('', ' '), 'td': ('', ' '), 'ol': ('', ' '), 'center': ('', ' '),
'img': ('', ''), 'title': ('', ' '), 'tr': ('', ' '), 'li': ('', ' '), 'p': ('', ' '),
'th': ('', ' '), 'div': ('', ' '), 'ul': ('', ' ')}

stop_list = ['10','able','about','above','according','accordingly','across','actually','after','afterwards','again','against','ain','all',
'allow','allows','almost','alone','along','already','also','although','always','am','among','amongst','an','and','another','any',
'anybody','anyhow','anyone','anything','anyway','anyways','anywhere','apart','appear','appreciate','appropriate','are','aren',
'around','as','aside','ask','asking','associated','at','available','away','awfully','be','became','because','become','becomes',
'becoming','been','before','beforehand','behind','being','believe','below','beside','besides','best','better','between','beyond',
'both','brief','but','by','came','can','can','cannot','cant','cause','causes','certain','certainly','changes','clearly',
'co','com','come','comes','concerning','consequently','consider','considering','contain','containing','contains','corresponding',
'could','couldn','course','currently','definitely','described','despite','did','different','do','does','doing','done','down',
'downwards','during','e','each','edu','eg','eight','either','else','elsewhere','enough','entirely','especially','et','etc','even',
'ever','every','everybody','everyone','everything','everywhere','ex','exactly','example','except','far','few','fifth','first',
'five','followed','following','follows','for','former','formerly','forth','four','from','further','furthermore','get','gets',
'getting','given','gives','go','goes','going','gone','got','gotten','greetings','h','had','hadn','happens','hardly','has','hasn',
'have','haven','having','he','hello','help','hence','her','here','hereafter','hereby','herein','hereupon','hers','herself','hi',
'him','himself','his','hither','hopefully','how','howbeit','however','ie','if','ignored','immediate','in','inasmuch','inc',
'indeed','indicate','indicated','indicates','inner','insofar','instead','into','inward','is','it','its','itself','just',
'keep','keeps','kept','know','knows','known','l','last','lately','later','latter','latterly','least','less','lest','let','like',
'liked','likely','little','look','looking','looks','ltd','m','mainly','many','may','maybe','me','mean','meanwhile','merely','might',
'more','moreover','most','mostly','much','must','my','myself','name','namely','nd','near','nearly','necessary','need','needs',
'neither','never','nevertheless','new','next','nine','no','nobody','non','none','noone','nor','normally','not','nothing','novel',
'now','nowhere','obviously','of','off','often','oh','ok','okay','old','on','once','one','ones','only','onto','or','other',
'others','otherwise','ought','our','ours','ourselves','out','outside','over','overall','own','particular','particularly',
'per','perhaps','placed','please','plus','possible','presumably','probably','provides','que','quite','qv','rather','rd',
're','really','reasonably','regarding','regardless','regards','relatively','respectively','right','s','said','same','saw','say',
'saying','says','second','secondly','see','seeing','seem','seemed','seeming','seems','seen','self','selves','sensible','sent',
'serious','seriously','seven','several','shall','she','should ','since','six','so','some','somebody','somehow','someone','something',
'sometime','sometimes','somewhat','somewhere','soon','sorry','specified','specify','specifying','still','sub','such','sup','sure',
'take','taken','tell','tends','th','than','thank','thanks','thanx','that','thats','the','their','theirs','them','themselves',
'then','thence','there','thereafter','thereby','therefore','therein','theres','thereupon','these','they','think','third','this',
'thorough','thoroughly','those','though','three','through','throughout','thru','thus','to','together','too','took','toward',
'towards','tried','tries','truly','try','trying','twice','two','un','under','unfortunately','unless','unlikely','until','unto',
'up','upon','us','use','used','useful','uses','using','usually','uucp','value','various','very','via','viz','vs','want',
'wants','was','way','we','well','went','were','weren','what','whatever','when','whence','whenever','where','whereafter','whereas',
'whereby','wherein','whereupon','wherever','whether','which','while','whither','who','whoever','whole','whom','whose','why','will',
'willing','wish','with','within','without','won','wonder','would','would','wouldn','yes','yet','you','your','yours',
'yourself','yourselves','zero','day']

def keep_word(word):
  return len(word) > 2
stop_list = filter(keep_word, stop_list)

def get_post_attrs(dom,post_index):
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
  if 'day' in time_string:
    hours_since_post = 0;
  return [title,url,hours_since_post,time_string,points]


def get_keywords(article_url,title):
  try:
    response = br.open( article_url, timeout=8.0 )
    article_dom = DOM(response.read())

    article_text = plaintext(article_dom.html, keep=[], replace=blocks, linebreaks=1, indentation=False)
    word_list = re.findall(r"[\w']+", article_text.lower())
    word_list = filter(keep_word, word_list)

    word_count = Counter()
    word_list = word_list[0:2500]
    for word in word_list:
      word_count[word] += 1
    for word in word_count:
      if word in stop_list:
        word_count[word] = 0
    title_words = re.findall(r"[\w']+", title.lower())
    top_word_number = int(word_count.most_common(1)[0][1]*.95)
    for t_word in title_words:
      if t_word not in stop_list:
        word_count[word] += top_word_number
    common_words = word_count.most_common(12)
  except:
    pass
    common_words = []
  return common_words

def parse_time(hours_since_posted):
  diff = timedelta(hours=hours_since_posted)
  time_posted = datetime.now() - diff
  time_parsed = time_posted.strftime("%d %m %H:00")
  return time_parsed
  # returns: '30 03, 23:00' NOTE: This can be changed using http://docs.python.org/2/library/datetime.html#strftime-and-strptime-behavior

def print_to_csv(article_attributes):
  title = article_attributes[0]
  points = article_attributes[1]
  article_url = article_attributes[2]
  time_parsed = article_attributes[3]

  common_words = get_keywords(article_url,title)

  title = title.encode('ascii','ignore')
  encoded_url = article_url.encode('ascii','ignore')
  time_parsed = time_parsed.encode('ascii','ignore')
  print title
  writer.writerow( [title.replace(',', ' '), points, encoded_url, time_parsed, common_words] )


end_scrape = False
article_list = []
thursday_counter = 0 
wednesday_counter = 0 
tuesday_counter = 0 
monday_counter = 0

while end_scrape == False:

  attributes_1 = get_post_attrs(dom,1);
  print attributes_1[3]
  attributes_30 = get_post_attrs(dom,30);
  print attributes_30[3]

  for post_index in range(1,31):
    
    attributes = get_post_attrs(dom,post_index);
    title = attributes[0]
    article_url = attributes[1]
    hours_since_post = attributes[2]
    time_string = attributes[3]
    points = attributes[4]

    if(post_index % 5 == 0):
      print post_index
    # NOTE: THE FOLLOWING 23 REFERS TO THE NUMBER OF HOURS, AND ASSUMES THIS WILL BE RUN AT 1AM 
    if hours_since_post < 24:
      time_parsed = parse_time(hours_since_post)

    if '1 day' in time_string:
      end_scrape = True
      # thursday_counter += 1
      # time_parsed = 'saturday' + str(thursday_counter) 
    if '2 days' in time_string:
      end_scrape = True
      # wednesday_counter += 1
      # time_parsed = 'wednesday' + str(wednesday_counter)  
    if '3 days' in time_string:
      tuesday_counter += 1
      # time_parsed = 'tuesday' + str(tuesday_counter)  
    if '4 days' in time_string:
      monday_counter += 1
      # time_parsed = 'monday' + str(monday_counter) 

    article_attributes = [[title, points, article_url, time_parsed]]    
    article_list += article_attributes
    # if '5 days' in time_string:
      # end_scrape = True

    title = title.encode('ascii','ignore')
    encoded_url = article_url.encode('ascii','ignore')
    time_parsed = time_parsed.encode('ascii','ignore')
    writer2.writerow( [title.replace(',', ' '), points, encoded_url, time_parsed] )

  wait_time = random.randint(6, 8)
  time.sleep(wait_time)

  new_link = 'http://news.ycombinator.com' + dom.by_tag('table')[2][91][1][0].href
  print new_link
  response = br.open(new_link)
  dom = DOM(response.read())

for article_attrs in article_list:
  print_to_csv(article_attrs)
