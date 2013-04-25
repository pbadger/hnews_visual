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

br = mechanize.Browser()
br.set_handle_robots(False)
br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]

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
'yourself','yourselves','zero','isn']

def keep_word(word):
  return len(word) > 2
stop_list = filter(keep_word, stop_list)

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
    common_words = word_count.most_common(10)
  except:
    pass
    common_words = []
  return common_words

output = open("hn_sun_21_with_keywords.csv", "wb")
writer = csv.writer(output)
writer.writerow(["Title", "Points", "Url", "Time_Posted", "Keywords"])

in_file = open('hn_sun_21_1200am.csv','r')
in_file.readline()
for line in in_file:
  line = line.split(',')
  title = line[0]
  points = line[1]
  article_url = line[2]
  time_parsed = line[3]

  common_words = get_keywords(article_url,title)

  title = title.encode('ascii','ignore')
  encoded_url = article_url.encode('ascii','ignore')
  time_parsed = time_parsed.encode('ascii','ignore')
  print title
  writer.writerow( [title.replace(',', ' '), points, encoded_url, time_parsed, common_words] )
  