#!/usr/bin/python
import urllib2
import pickle as file_dumper
import simplejson as json
from optparse import OptionParser
from anytree import Node, RenderTree, PreOrderIter
import subprocess

# contains all the leaves in found.
leaves = [];
comment_count = 0;

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

def dump_tree(root_node):

    print "root = " + str(root_node.name.id);
    children = root_node.children;

    if len(children) != 0:
        for child in children :
            print "child = " + str(child.name.id);
            dump_tree(child);
    pass

# 1. get a list of branches.
# 2. iterate each branch by calling itself recursively. Recursion stops when
#    there are no more branches.
#
# the root from the tree is passed in. it is assumed tha the root is already 
# the datatype of Node.
def build_tree(root, root_node) :
    branches = get_hn_IDs(root.id);

    if len(branches) != 0 :
        print "root = " + str(root.id);

        for x in range(0, len(branches)) :
            branch = id_node();
            branch.id = branches[x];
            branch.status = "new";
            branch_node = Node(branch, parent=root_node);
            
            print "branch[" + str(x) + "] = " + str(branch.id);
            build_tree(branch, branch_node);
    else:
        leaves.append(root_node);    

    root.status = "old";
    pass


# Let's go
def main():
    global leaves;
    
    parser = OptionParser()
    parser.add_option("-i", "--id", dest="hn_id", help="the id of the HN comment to track")
    parser.add_option("-c", "--check", dest="check", action="store_false", help="check for new comments")

    (options, args)=parser.parse_args()

    if options.check != None:

        # setup the root of the tree
        root = id_node(); 
        root.id = options.hn_id;
        root.status = "new";

        root_node = Node(root);

        #read the data back in from disk.
        fl = open(str(root.id) + ".leaves", "rb");
        leaves = file_dumper.load(fl);
        fl.close();

        fl = open(str(root.id) + ".tree", "rb");
        root_node = file_dumper.load(fl);
        fl.close();

        for leaf_element in range(0, len(leaves)) :
            print "leaf[" + str(leaf_element) + "] = " + str(leaves[leaf_element].name.id)

        dump_tree(root_node);

    else:
        if options.hn_id != None:
            # setup the root of the tree
            root = id_node(); 
            root.id = options.hn_id;
            root.status = "new";

            root_node = Node(root);
            build_tree(root, root_node);

            for leaf_element in range(0, len(leaves)) :
                print "leaf[" + str(leaf_element) + "] = " + str(leaves[leaf_element].name.id)

            fl = open(str(root.id) + ".leaves", "wb");
            file_dumper.dump(leaves, fl);
            fl.close();

            fl = open(str(root.id) + ".tree", "wb");
            file_dumper.dump(root_node, fl);
            fl.close();
        else :
            show_help();

if __name__ == "__main__":
    main()

    
    
    