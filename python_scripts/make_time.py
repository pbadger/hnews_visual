import time
import re
import mechanize
import csv
import string

in_file_name = 'fri_to_mon_copy.csv'
in_file = open(in_file_name,'r')
in_file.readline()

output = open("mon_15_fri_19_final.csv", "w")
writer = csv.writer(output,lineterminator='\n')
writer.writerow(["Title", "Points", "Url", "Time_Posted", "Keywords"])

monday_num = 0
tuesday_num = 0
wednesday_num = 0
thursday_num = 0
friday_num = 0
saturday_num = 0

def set_up_day_nums():
  global monday_num,tuesday_num,wednesday_num,thursday_num, saturday_num
  for line in in_file:
    try:
      line = line.split(',')
      time_posted = line[3]

      if bool(re.search('[a-z]',time_posted)):
        # print time_posted
        split_time = time_posted.split('y')
        day = split_time[0] + 'y'
        post_number = int(split_time[1])

        if day == 'monday':
          monday_num = post_number
        elif day == 'tuesday':
          tuesday_num = post_number
        elif day == 'wednesday':
          wednesday_num = post_number
        elif day == 'thursday':
          thursday_num = post_number
          # print str(thursday_num)+'<<TN'
        elif day == 'saturday':
          saturday_num = post_number
    except Exception as inst:
      pass
      print inst
  print str(thursday_num)+'<<TN'

def format_time(hour):
  if hour < 10:
    return '0' + str(hour)+':00'
  else:
    return str(hour) + ':00'

hour_distribution = [23,19,18,19,18,17,16,24,30,40,62,57,60,58,63,61,40,50,43,38,43,37,40,27]
percent_distribution = map(lambda x: x / 903.0, hour_distribution) 
def get_time(post_num, posts_in_day):
  post_percent = float(post_num) / posts_in_day
  for hour in range(0,24):
    if post_percent <= percent_distribution[hour]:
      return format_time(hour) 
    else:
      post_percent -= percent_distribution[hour]



set_up_day_nums()
print str(thursday_num)+'<<TN'

in_file = open(in_file_name,'r')
in_file.readline()

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
      # print time_posted
      

      split_time = time_posted.split('y')
      day = split_time[0] + 'y'
      post_number = int(split_time[1])
      if day == 'monday':
        date = '15 04 '
        time_posted = get_time(post_number,monday_num+1)
      elif day == 'tuesday':
        date = '16 04 '
        time_posted = get_time(post_number,tuesday_num+1)
      elif day == 'wednesday':
        date = '17 04 '
        time_posted = get_time(post_number,wednesday_num+1)
      elif day == 'thursday':
        date = '18 04 '
        time_posted = get_time(post_number,thursday_num+1)
      elif day == 'saturday':
        date = '27 04 '
        time_posted = get_time(post_number,saturday_num+1)
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
    # print printed_line
    writer.writerow( [title.replace(',', ' '), points, encoded_url, time_encoded, common_words] )
  except Exception as inst:
    pass
    print 'FAILED'
    print title
    print inst
    print '\n'
    
