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

# for a given HN comment ID, it returns a list of kids ID.
# It will return an empty array of no kids were found.
def get_hn_IDs(current_id) :
    
    base_url = "https://hacker-news.firebaseio.com/v0/item/"

    url = base_url + str(current_id) + ".json"
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
    
# 1. get a list of branches.
# 2. iterate each branch by calling itself recursively. Recursion stops when
#    there are no more branches.
#
# the root from the tree is passed in. it is assumed tha the root is already 
# the datatype of Node.
def build_tree(root) :

    print "root = " + str(root.id);

    branches = get_hn_IDs(root.id);

    if len(branches) != 0 :
         for x in range(0, len(branches)) :
            temp_branch = id_node();
            temp_branch.id = branches[x];
            temp_branch.status = "new";
#             Node(temp_branch, parent=root)
    
            print "branch[" + str(x) + "] = " + str(temp_branch.id);
            build_tree(temp_branch);    

    root.status = "old";
    pass

parser = OptionParser()
parser.add_option("-i", "--id", dest="hn_id", help="the id of the HN comment to track")

(options, args)=parser.parse_args()

array_x = [];

if options.hn_id != None:

    # setup the root of the tree

    tree_root_id = id_node(); 
    tree_root_id.id = options.hn_id;
    tree_root_id.status = "new"; 
    build_tree(tree_root_id);

else :
    show_help();

    
    
    