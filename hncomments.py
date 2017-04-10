#!/usr/bin/python
import urllib2
import simplejson as json
import smtplib
import datetime 
from optparse import OptionParser 
import subprocess

hn_comment_id = "14081599"

base_url = "https://hacker-news.firebaseio.com/v0/item/"

url = base_url + hn_comment_id + ".json"

req = urllib2.Request(url)
opener = urllib2.build_opener()
f = opener.open(req)
json_obj = json.load(f)

print json_obj["by"];
print json_obj["kids"];
for id in json_obj["kids"]:
    print "kid = " + repr(id);