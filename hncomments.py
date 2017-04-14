#!/usr/bin/python
import urllib2
import simplejson as json
import smtplib
import datetime 
from optparse import OptionParser
from anytree import Node, RenderTree, PreOrderIter
import subprocess

class id_node :
    id = ''         # the ID of HN comment 
    status = ''     # whether the comment is old or new.
    walked = ''     # the status of the id during tree creation


def preorder(tree):
    if tree:
        print(tree.name)
        preorder(tree.left_node)
        preorder(tree.right_node)

def build_node ():
    a = Node (1)
    b = Node (2, parent=a)
    c = Node (3, parent=a)
    d = Node (4, parent=a)
    e = Node (9, parent=b)
    f = Node (5, parent=b)
    g = Node (6, parent=f)
    h = Node (7, parent=g)
    i = Node (8, parent=g)
    
    print (RenderTree(a))
    
    array_x = [node.name for node in PreOrderIter(a)]
    
    length = len(array_x)
    
    print length;

def get_hn_IDs(current_id) :
    
    base_url = "https://hacker-news.firebaseio.com/v0/item/"

    url = base_url + current_id + ".json"
    req = urllib2.Request(url)
    opener = urllib2.build_opener()
    f = opener.open(req)
    json_obj = json.load(f)

    #check only process if the ID belongs to a comment

    if json_obj["type"] == "comment":
        # don't count if it does not have any kids.
        if json_obj.has_key("kids"):
            hn_IDs = json_obj["kids"];
        else:
            #return an empty array
            hn_IDs = [];
    else:
        #return an empty array
        hn_IDs = [];

    return (hn_IDs);

def show_help():
    print "hncomments.py help"
    print "-i --> the ID for the HN comment";

    pass;
    

#build_node()

# test_nodes = id_node();
# test_nodes.id = 14113587;
# test_nodes.status = "old";

# print test_nodes.id;

parser = OptionParser()
parser.add_option("-i", "--id", dest="hn_id", help="the id of the HN comment to track")

(options, args)=parser.parse_args()

if options.hn_id != None:
    hn_comment_id = options.hn_id;
    kids = get_hn_IDs(hn_comment_id);
    if len(kids) != 0:
        for id in kids:
            print "kid = " + repr(id);
else :
    show_help();

    
    
    