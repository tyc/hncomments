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

    node1 = id_node();
    node1.id = 123;
    node1.status = "old";
 
    node2 = id_node();
    node2.id = 456;
    node2.status = "new";

    node3 = id_node();
    node3.id = 789;
    node3.status = "old";


    tree_root = Node(node1);
    Node(node2, parent=tree_root);
    Node(node3, parent=tree_root);

    # print (RenderTree(tree_root))
 
    fatx = [node.name for node in PreOrderIter(tree_root)];
    
    for x in range (0, len(fatx)) : 
        print str(fatx[x].id) + " is " + str(fatx[x].status);

    # a = Node (1)
    # b = Node (2, parent=a)
    # c = Node (3, parent=a)
    # d = Node (4, parent=a)
    # e = Node (9, parent=b)
    # f = Node (5, parent=b)
    # g = Node (6, parent=f)
    # h = Node (7, parent=g)
    # i = Node (8, parent=g)
    
    # print (RenderTree(a))
    
    # array_x = [node.name for node in PreOrderIter(a)]
    
    # length = len(array_x)
    
    # print length;

# for a given HN comment ID, it returns a list of kids ID.
# It will return an empty array of no kids were found.
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
    

def play_array() :
    
    test_array = [];

    test_array.append(id_node())
    test_array.append(id_node())
    test_array.append(id_node())

    test_array[0].id = 123;
    test_array[1].id = 456;
    test_array[2].id = 789;

    for x in range(0, len(test_array)) :
        print "test array["+ str(x) + "] = " + str(test_array[x].id)

    pass

play_array()
pass

# build_node()

# test_nodes = id_node();
# test_nodes.id = 14113587;
# test_nodes.status = "old";

# print test_nodes.id;

parser = OptionParser()
parser.add_option("-i", "--id", dest="hn_id", help="the id of the HN comment to track")

(options, args)=parser.parse_args()

array_x = [];

if options.hn_id != None:

    # setup the root of the tree

    tree_root_id = id_node(); 
    tree_root_id.id = options.hn_id;
    tree_root_id.status = "new"; 

    tree_root = Node(tree_root_id);
    kids = get_hn_IDs(tree_root_id.id);
    
    if len(kids) != 0:
        for x in range(0, len(kids)):
            array_x[x].append(id_node());
            array_x[x].id = kids[x];
            array_x[x].status = "new";

            print "kid = " + str(kids[x]);

        # for x in range(0,len(array_x)) :
        #    print "kid = " + str(array_x[x].id)
else :
    show_help();

    
    
    