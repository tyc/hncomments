#!/usr/bin/python
import urllib2
import pickle as file_dumper
import simplejson as json
from os import path
from optparse import OptionParser
from anytree import Node, RenderTree, PreOrderIter, AsciiStyle
import subprocess

# contains all the leaves in found.
leaves = [];
comment_count = 0;

class id_node :
    id = ''         # the ID of HN comment 
    status = ''     # whether the comment is old or new.
    read = ''       # flag whether the comment has been read

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

    for pre, _, node in RenderTree(root_node, style=AsciiStyle()):
        print ("%s%s" % (pre, (str(node.name.id) + "-" + str(node.name.status))))

    pass

def mark_all_node(root_node, status):
    
    root_node.name.status = status;
    branches=root_node.children;
    if len(branches)!=0:
        for branch in branches:
            mark_all_node(branch,status)

    pass


def check_for_new_id(id, children):

    result = False;

    if len(children) > 0:
        for x in range(0, len(children)):
            if (id == children[x].name.id):
                result = True;

    return result;


def get_children_index(id, children):

    index = None;

    if len(children) > 0:
        for x in range(0, len(children)):
            if (id == children[x].name.id):
                index = x;

    return index;



# 1. get a list of branches.
# 2. iterate each branch by calling itself recursively. Recursion stops when
#    there are no more branches.
#
# the root from the tree is passed in. it is assumed tha the root is already 
# the datatype of Node.
def build_tree(root, root_node) :


    branches = get_hn_IDs(root.id);

    # branches is returned as a array of IDs from get_hn_IDs();
    # root_node.children contains a list of nodes from the previous time.
    # so we need to extract the list of IDs from a children and compare it
    # the arrays of ID.
    # 
    # if the ID does matches, it is an old ID and can be dropped
    # branches array.

    # iterates over the list of old IDs. What is left in the branches array
    # should be the new IDs.

    # bug: if there are no new nodes at this check, subsequent new nodes at
    # lower level are ignored.

#    for root_leaf in range(0, len(root_node.children)):
#        result = root_node.children[root_leaf].name.id in branches; 
#        if result == True :
#            drop_index = branches.index(root_node.children[root_leaf].name.id);
#            print "old = " + str(root_node.children[root_leaf].name.id) + " " + str(result) + " " + str(drop_index);
#            branches.pop(drop_index);
    
    if len(branches) != 0 :
        print "root = " + str(root.id);

        for x in range(0, len(branches)) :
            result = check_for_new_id(branches[x], root_node.children);

            # only create a node if the node is new.
            if result != True:
                branch = id_node();
                branch.id = branches[x];
                branch.status = "new";
                branch_node = Node(branch, parent=root_node);
            else:
                index = get_children_index(branches[x], root_node.children);
                branch = root_node.children[index].name;
                branch_node = root_node.children[index];
            
            print "branch[" + str(x) + "] = " + str(branch.id);
            build_tree(branch, branch_node);
    else:
        if (root_node.name.status != "new"):
            if (root_node.name.status != "old"):
                leaves.append(root_node);    

    pass


# Let's go
def main():
    global leaves;
    
    parser = OptionParser()
    parser.add_option("-i", "--id", dest="hn_id", help="the id of the HN comment to track")

    (options, args)=parser.parse_args()

    if options.hn_id != None:

        # setup the root of the tree
        root = id_node(); 
        root.id = options.hn_id;
        root.status = "new";

        root_node = Node(root);
        # there is a save file already, use it.
        if path.exists(str(root.id) + ".leaves") == True :
            #read the data back in from disk.
            fl = open(str(root.id) + ".leaves", "rb");
            leaves = file_dumper.load(fl);
            old_leaves = leaves;
            fl.close();

            fl = open(str(root.id) + ".tree", "rb");
            root_node = file_dumper.load(fl);
            fl.close();

            mark_all_node(root_node, "old");
            dump_tree(root_node);

        build_tree(root, root_node);

        dump_tree(root_node);

        # saves the data away for next time.
        fl = open(str(root.id) + ".leaves", "wb");
        file_dumper.dump(leaves, fl);
        fl.close();

        fl = open(str(root.id) + ".tree", "wb");
        file_dumper.dump(root_node, fl);
        fl.close();


if __name__ == "__main__":
    main()
