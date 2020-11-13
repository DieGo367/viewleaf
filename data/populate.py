import csv
from datetime import datetime
import json
import random
import sqlite3

# open database
conn = sqlite3.connect("data.sqlite")
c = conn.cursor()

# copy trail data
trail_ids = []
with open("nationalpark.csv", newline='', encoding='utf-8') as csvfile:
	reader = csv.reader(csvfile,delimiter=',',quotechar='"')
	first = True
	for row in reader:
		if first:
			first = False
		else:
			# trail_id, name, area_name, city_name, state_name,
			# country_name, _geoloc, popularity, length ,elevation_gain,
			# difficulty_rating, route_type, visitor_usage, avg_rating, num_reviews,
			# features, activities, units

			selected_data = row[0:5] + row[7:10]
			values = str(selected_data)[1:-1]

			trail_ids.append(row[0])

			c.execute(
				"INSERT INTO Trail "
				"(t_trailid, t_name, t_park, t_city, t_state, t_popularity, t_length, t_elevation_gain) "
				f"VALUES ({values});"
			)

# generate example data

random.seed("viewleaf")
with open("words.txt") as wordfile:
	words = wordfile.readlines()
def random_word():
	return words[random.randint(0,len(words)-1)].strip()

# user
for i in range(100):
	c.execute(f"INSERT INTO User (u_userid, u_name) VALUES ({i},'{random_word()}')")

# plans
for i in range(30):
	c.execute(
		"INSERT INTO Plans (p_planid, p_userid, p_name) VALUES "
		f"({i},{random.randint(0,99)},'{random_word()}')"
	)
	# plan item
	items = random.randint(0,10)
	for j in range(items):
		trailid = trail_ids[random.randint(0,len(trail_ids)-1)]
		c.execute(
			"INSERT INTO PlanItem (pi_planid, pi_trailid, pi_ordering) VALUES "
			f"({i},{trailid},{j})"
		)

# comment
gets_replies = []
gets_photo = []
for i in range(30):
	date = datetime(2020, random.randint(1,12), random.randint(1,28))
	datestr = date.strftime("%d-%m-%Y")
	trailid = trail_ids[random.randint(0,len(trail_ids)-1)]
	message = random_word()
	for _ in range(random.randint(4,20)):
		message += " " + random_word()
	if random.randint(1,10) > 5:
		gets_replies.append([i,trailid,datestr])
	if random.randint(1,10) > 8:
		gets_photo.append([i,trailid,datestr])
	c.execute(
		"INSERT INTO Comment (c_commentid, c_userid, c_trailid, c_date, c_message) "
		f"VALUES ({i},{random.randint(0,99)},{trailid},'{datestr}','{message}')"
	)
amount = 30
for comment in gets_replies:
	reply_to, trailid, datestr = comment
	for i in range(random.randint(1,4)):
		message = random_word()
		for _ in range(random.randint(4,20)):
			message += " " + random_word()
		c.execute(
			"INSERT INTO Comment (c_commentid, c_userid, c_trailid, c_date, c_message, c_reply_to) "
			f"VALUES ({amount},{random.randint(0,99)},{trailid},'{datestr}','{message}',{reply_to})"
		)
		amount += 1

# comment vote
for i in range(0,500):
	cid = random.randint(0,amount-1)
	vote = ['u','d'][random.randint(0,1)]
	c.execute(
		"INSERT INTO CommentVote (cv_commentid, cv_userid, cv_vote) "
		f"VALUES ({cid},{random.randint(0,99)},'{vote}')"
	)

# photo
for i, comment in enumerate(gets_photo):
	cid, trailid, datestr = comment
	c.execute(
		"INSERT INTO Photo (ph_photoid, ph_commentid, ph_userid, ph_trailid) "
		f"VALUES ({i},{cid},{random.randint(0,99)},{trailid})"
	)


# save changes
conn.commit()