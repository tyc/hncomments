# HN Comments

So this bit of code started when I ask the question on Hackers News on how folks are keeping track of comments that they find interesting. There were some responses, but there was no real answer.

The HN item is here.

https://news.ycombinator.com/item?id=14045391

This python code is my prototype to get an algorithm.

The long term goal is to push this algorithm into something like a webextension so that it can be use in a web brower. Afterall, the HN is a website.

v1.0
* for a given comment HN ID, it will traverse all the child comments and collect all the comments which does not have any children. 