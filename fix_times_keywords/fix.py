import csv

infile = open('fri_to_mon_final.csv', 'r')
output = open('mon_15_to_fri_19.csv', 'w')
writer = csv.writer(output)
writer.writerow(["Title", "Points", "Url", "Time_Posted", "Keywords"])

string = infile.read()
lines = string.split("\n")

print lines[0:5]
for line in lines:
	if(line[0] == "\""): newline = line[1:]
	else: newline = line
	
	writer.writerow(newline);
		