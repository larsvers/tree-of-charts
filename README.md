### The Tree of Charts
---

On the one hand the tree of charts is a simple visual search engine for different chart types. It has 88 charts dangling of its branches and you can pick them by just searching or browsing the tree. On the other hand it focuses the thought-process when moving from raw data to a visual. Often it's great to play around with data and different visuals in your tool of choice, but apart from being a time-saver having a pond of already tested and chewed over visual forms in place allows us to test more, fail quicker and find salvation sooner. Once we have followed some guidelines and understand the connection between data and their forms better, it's easier and clearly more enjoyable to break the rules where necessary. Once we know the traditional forms it'll be easier (and certaily better) to engage with individual visual primitives rather than set charts - as manifested in [Leland Wilkinson's Grammar of Graphics](http://www.springer.com/gp/book/9780387245447) and supported by free-ranging visual tools like ggplot2, processing, D3 etc.

The applied framework orders the chart-finding-process along 3 lines:

1. **What** data have we got ? 
2. **Why** are we producing a visual ?
3. **How** are we designing it ?

In fact, the tree has a lot more flexibility and doesn't force anyone to think along this straight line, but these 3 questions are recurring in the descriptions and the tree structure (= soft education).

#### Standing on the shoulders of Tamara Munzner

The framework (partly surely amateur-like) applied has been developped by [Tamara Munzner](https://en.wikipedia.org/wiki/Tamara_Munzner) in her 2014 book [Visualization Analysis and Design](https://www.crcpress.com/Visualization-Analysis-and-Design/Munzner/9781466508910) and leads the interested person through above pipeline of questions to arrive at the right visual idiom (in her case often large-scale visualization systems - in this case relatively standard charts). The above 3 steps are only a brief summary not encapsulating the more elaborate process she describes but for my small brain and this chart- rather than system-focussed project - they suffice.


#### How to use

###### Search

![search box](https://github.com/larsvers/tree-of-charts/blob/master/images/github/search.png)

Have some data and a vague idea of what you want to show. Search for:

* Chart name

* Data type (Munzner categories)
	* Tables
	* Spatial data
	* Network
	* Tree

* Data type (Schneiderman categories)
	* 1D/Linear
	* 2D/Planar
	* 3D/Volumetric
	* nD/Multidimensional
	* Tree/Hierarchical
	* Network
	* Temporal

* Number of variables in your ([long/narrow](https://en.wikipedia.org/wiki/Wide_and_narrow_data)) dataset
	* 1 variable
	* 2 variables
	* 3 variables
	* 4 or more variables

* Number of categories (maximum numbber of categories if you have a categorical key variable)
	* under 10 categories
	* 10-99 categories
	* 100-999 categories
	* 1000 and more categories

* Number of values (maximum number of datapoints the visual can/should display)
	* under 20 values
	* Dozens of values
	* Hundreds of values
	* Thousands of values
	* Infinite no. of values


###### Chart cards


![chart-card](https://github.com/larsvers/tree-of-charts/blob/master/images/github/chart-card.png)

The chart cards show an image, a quick description to the chart and under ![more info](https://github.com/larsvers/tree-of-charts/blob/master/images/github/more-info.png) you'll find keywords to Munzner's process, a description of a (potential) table structure, some example variables and historical background where available.


I did not try to re-invent wheels. Although most of the texts are written by myself and a good chunk of visuals are also hand-crafted in D3js, Tableau, Excel and R, a good piece of the material is taken from sources who have already described or produced the charts in a better way than I could. It's a medley...


###### The tree

You can either browse the tree freely or click ![browse tree](https://github.com/larsvers/tree-of-charts/blob/master/images/github/browse.png) on the found **chart cards** to find your visual in the tree. Once in there you can browse the tree and see what other charts might tickle your pickle.

![tree](https://github.com/larsvers/tree-of-charts/blob/master/images/github/tree.png)

The tree is also shape-shifting. It can change hierarchy depending on what conceptual journey you opt for to find your chart. You can for example start thinking about the type of dataset you have (table? network? etc.) and then what type your data is (quantitative, ordinal, categorical). To do so, hit **what data** (a short description of the hierarchy is shown underneath the buttons):

![tree options](https://github.com/larsvers/tree-of-charts/blob/master/images/github/tree-options.png)

Or you might come from less techincal and more conceptual ground thinking about why you want to build a chart (what is your main interest? what is the aim of the visual analysis?). There's a tree for that via the **why** button. 

Best to play around with really...

###### Credit

Conceptual credit goes to a number of ressources but mainly [Tamara Munzner](https://www.crcpress.com/Visualization-Analysis-and-Design/Munzner/9781466508910).

Coding credit to Mike Bostock for [D3](https://d3js.org/), [jjzieve](https://bl.ocks.org/jjzieve/a743242f46321491a950) and [select2](https://select2.github.io/).

Image credit belongs to a great number of sources, I have attributed wherever I could. Please let me know, if you find your image here and want to have it removed or replaced. The picture use in this context seems unproblematic due to the images' fair use for research and educational purposes, however, please raise your hand if you feel any images are inappropriate used.



