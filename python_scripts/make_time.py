import time
import re
import mechanize
import csv
import string


in_file = open('hn_sun_21_with_keywords.csv','r')
in_file.readline()

output = open("sat_sun_final3.csv", "w")
writer = csv.writer(output,lineterminator='\n')
writer.writerow(["Title", "Points", "Url", "Time_Posted", "Keywords"])


def format_time(hour):
  if hour < 10:
    return '0' + str(hour)+':00'
  else:
    return str(hour) + ':00'

hour_distribution = [23,19,18,19,18,17,16,24,30,40,62,57,60,58,63,61,40,50,43,38,43,37,40,27]
percent_distribution = map(lambda x: x / 903.0, hour_distribution) 
def get_time(post_num, posts_in_day):
  post_percent = post_num / posts_in_day
  for hour in range(0,24):
    if post_percent <= percent_distribution[hour]:
      return format_time(hour) 
    else:
      post_percent -= percent_distribution[hour]

post_number = 0
day = 'none'
for line in in_file:
  post_number += 1
  try:
    line = line.split(',')
    title = line[0]
    points = line[1]
    article_url = line[2]
    time_posted = line[3]

    common_words = ','.join(line[4:])

    if bool(re.search('[a-z]',time_posted)):
      print time_posted
      split_time = time_posted.split('y')
      day = split_time[0] + 'y'
      post_number = int(split_time[1])

      if day == 'monday':
        date = '15 04 '
        time_posted = get_time(post_number,834+1)
      elif day == 'tuesday':
        date = '16 04 '
        time_posted = get_time(post_number,960+1)
      elif day == 'wednesday':
        date = '17 04 '
        time_posted = get_time(post_number,877+1)
      elif day == 'thursday':
        date = '18 04 '
        time_posted = get_time(post_number,896+1)
      elif day == 'saturday':
        date = '20 04 '
        time_posted = get_time(post_number,357+1)
      else:
        date = 'no_match'
      time_posted = date + time_posted

    title = title.encode('ascii','ignore')
    encoded_url = article_url.encode('ascii','ignore')
    time_encoded = time_posted.encode('ascii','ignore')
    # print title
    common_words = common_words.replace('\r\n','')
    # common_words = common_words[1:]
    printed_line = [title.replace(',', ' '), points, encoded_url, time_encoded, common_words]
    # printed_line = map(lambda string: string.replace('\"',''),[title.replace(',', ' '), points, encoded_url, time_encoded, common_words])
    print printed_line
    writer.writerow( [title.replace(',', ' '), points, encoded_url, time_encoded, common_words] )
  except:
    pass
    print post_number
