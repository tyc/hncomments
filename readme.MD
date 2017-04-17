# HN Comments


#17April2017
The code under the webext folder is an firefox web extension javascript that tries to do the same as what the python code is doing. The python code can workout the new comments from the last interrogation. The javascript code cannot. 

For this verison there is a hack to get around the cross domiain request problem. It is a security restriction that stops the javascript from requesting data while its active tab is in a different url domain. So requesting it the JSON data from "www.google.com" is not going to work here. The work around is to open a window and point it to "https://hacker-news.firebaseio.com/v0/item/1.json" and then on the next click, populate it with the comments.
 

# before 17April2017
So this bit of code started when I ask the question on Hackers News on how folks are keeping track of comments that they find interesting. There were some responses, but there was no real answer.

The HN item is here.

https://news.ycombinator.com/item?id=14045391

This python code is my prototype to get an algorithm.

The long term goal is to push this algorithm into something like a webextension so that it can be use in a web brower. Afterall, the HN is a website.

# TODO
* for a given comment HN ID, it will traverse all the child comments and collect all the comments which does not have any children. 