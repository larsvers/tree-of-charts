/* dataindex js | v.7.0.4 | 1/7/15 | lv */
/* width of svg adjusted (to get the container as wide as possible w/o x-scrollbars) */


// utility ---------------------------------------------------------------------------------------------------------
var log = console.log.bind(console); // snippet log
var dir = console.dir.bind(console); // snippet dir
var spaceLess = function(x) { return x.replace(/[^A-Za-z]/g,''); } // remove all non-letter characters
var arrToStr = function(x) { return x.toString().replace(/,|,\s/g,' \u00B7 '); } // used e.g. in more info area
	
// ! not used, replaced with lodash's _.intersection !
// Prototype adjustments: compare 2 arrays and return true if there are any matches (*this* is the Array to call it on)
Array.prototype.anymatch = function(arr) {
    var result = false;
    for(var i = 0; i < this.length; i++) {
        if(arr.indexOf(this[i]) > -1) result = true;
    }
    return result;
};



var util = {};
util.unik = function(arr) { // http://jszen.com/best-way-to-get-unique-values-of-an-array-in-javascript.7.html
	var n = {}, r = [];
	for (var i = 0; i < arr.length; i++) {             // do for each element of the array
		if (!n[arr[i]]) {                                // if this element is not yet in n
			n[arr[i]] = true;                              // put it into the object n with the flag 'true'
			r.push(arr[i]);                                // and push it into the array r
		}
	}
	return r;
};



var vis = vis || {}; // top namespace



// data ------------------------------------------------------------------------------------------------------------

/* example data:
// tag-groups
var tags = [
	{ group: 'tight tags', tags: ['pimmeldimmelbummelbum', 'pom', 'pum'] },
	{ group: 'broad tags', tags: ['bim', 'bom', 'bum', 'tim', 'tom', 'tum'] },
	{ group: 'report names', tags: ['DTH-report', 'Nordics Brand Tracking', 'Scandi Cross-Promo', 'Eybrow-length report'] }
];
// data-index
var index = [
	{ name: 'blub', id: 'BUB', descr: 'this is a report about blubs', tags: ['pim', 'pom', 'DTH-report', 'pum'] },
	{ name: 'blob', id: 'BOB', descr: 'this is a report about blobs', tags: ['bim', 'bom', 'bum', 'Eybrow-length report'] },
	{ name: 'blab', id: 'BAB', descr: 'this is a report about blabs', tags: ['pimmeldimmelbummelbum', 'pimmeldimmelbummelbam', 'pimmeldimmelbummelbim'] },
	{ name: 'blib', id: 'BIB', descr: 'this is a report about blibs', tags: ['tim', 'tom', 'Scandi Cross-Promo', 'tum', ] }
];
*/


d3.tsv('data/data.tsv', function(err, data){
	if (err) log('data loading error');
	// log('data', data);

	
	// search data -------------------------------------------

	util.searchdataTransform = function(variable, groupname) {
		
		var arr = [];

		var tagdata = data.map(function(d){
			return { tags: d[variable] } // function parameter 1
		});

		function shove(x) { arr.push(x); } // utility fun: push each element into arr

		for (var i=0; i < tagdata.length; i++) {
			tagdata[i].tags.split(", ").forEach(shove); // for each tagdata-array, split the tags and push into an array
		}
		arr = util.unik(arr).sort(); // sort the array

		var tagobject = {}; // create final object per tag-group
		tagobject.group = groupname; // function parameter 2
		tagobject.tags = arr;
		
		return tagobject;
		
	} // util.searchdataTransform; input: raw data-index, variable of interest, desired label; output: object in appropriate shape
	// note: this can be moved up to the utility section but we would need to make the original data (here called 'data') available globally. 
	
	// decide here which tags should become searchable. 
	// Then create searchData array holding all the searchable tabs from all reports

	var tagobjects = {}; // create the objects you need for the search box (param 1: variable name, param 2: semantic name for the user)
	tagobjects.a = util.searchdataTransform('name', 'Name');
	tagobjects.b = util.searchdataTransform('dataset_type', 'What | Data Type (Munzner)');
	tagobjects.c = util.searchdataTransform('dataset_type_shneiderman', 'What | Data Type (Shneiderman)');
	tagobjects.d = util.searchdataTransform('number_of_variables_rough', 'What | Number of variables');
	tagobjects.e = util.searchdataTransform('categories_wo_aid_sum', 'What | Number of categories');
	tagobjects.f = util.searchdataTransform('values_sum', 'What | Number of values');
	
	tagobjects.g = util.searchdataTransform('data_type_sum_long', 'What | Variable type');
	
	tagobjects.h = util.searchdataTransform('target_usage_munzner_all', 'Why | General target of visual (Munzner)');
	tagobjects.i = util.searchdataTransform('target_specific_munzner', 'Why | Specific target of visual (Munzner)');
	tagobjects.j = util.searchdataTransform('target_usage_alternative_all', 'Why | General target of visual (alternative)');
	tagobjects.k = util.searchdataTransform('action_analysis', 'Why | Analysis action');
	tagobjects.l = util.searchdataTransform('action_search', 'Why | Search action');
	tagobjects.m = util.searchdataTransform('action_query_all', 'Why | Query action');
	tagobjects.n = util.searchdataTransform('all_marks', 'How | Visual mark');
	tagobjects.o = util.searchdataTransform('channel', 'How | Visual channel');
	tagobjects.p = util.searchdataTransform('type', 'How | Chart type');
	tagobjects.q = util.searchdataTransform('family', 'How | Chart family');
	
	var searchData = []; // create the final search data array of objects
	for (key in tagobjects) {
		searchData.push(tagobjects[key]);
	}

	log('searchData', searchData);

	
	// report card data -----------------------------------------
	
	// (1) Move all string-lists into arrays (to have clean objects) and 
	// (2) put all searchable tags into an extra property per object called 'searchTags'.
	// This array searchTags will later be matched with the user-selected tags which were produced for and live in searchData
	
	var reportData = data;

	
	// not in function; can be done with a little more flexibility allowing for variable number of key-names to coerce to objects (function would need to be based on arg-length)
	for (key in reportData) {

		if (reportData.hasOwnProperty(key)) {
			
			// turn comma-seperated lists into arrays
			reportData[key].data_type = reportData[key].data_type.split(', ');
						
			reportData[key].data_type_sum_long = reportData[key].data_type_sum_long.split(', ');

			reportData[key].target_usage_munzner_all = reportData[key].target_usage_munzner_all.split(', ');

			reportData[key].target_specific_munzner = reportData[key].target_specific_munzner.split(', ');
			
			reportData[key].target_usage_alternative_all = reportData[key].target_usage_alternative_all.split(', ');

			reportData[key].action_query_all = reportData[key].action_query_all.split(', ');

			reportData[key].all_marks = reportData[key].all_marks.split(', ');

			reportData[key].channel = reportData[key].channel.split(', ');

			// prepare extra arrays for report cards
			reportData[key].whatData = _.union(
					[reportData[key].dataset_type],
					[reportData[key].dataset_type_shneiderman],
					[reportData[key].data_type_sum_long]
				);

			reportData[key].whatScale = _.union(
					[reportData[key].number_of_variables_exact],
					[reportData[key].categories_wo_aid],
					[reportData[key].values_detailed]
				);

			reportData[key].whyTargets = _.union(
					reportData[key].target_usage_munzner_all,
					reportData[key].target_specific_munzner,
					reportData[key].target_usage_alternative_all
				);

			reportData[key].whyActions = _.union(
					[reportData[key].action_analysis],
					[reportData[key].action_search],
					reportData[key].action_query_all
				);

			reportData[key].howMarksChannels = _.union(
					reportData[key].all_marks,
					reportData[key].channel
				);

			reportData[key].cardTags = _.union(
				reportData[key].whatData,
				reportData[key].whatScale,
				reportData[key].whyTargets,
				reportData[key].whyActions,
				reportData[key].howMarksChannels
				)

			// create list of all searchable tags to display correct report cards 
			reportData[key].searchTags = _.union(
				[reportData[key].name],
				[reportData[key].dataset_type],
				[reportData[key].dataset_type_shneiderman],
				[reportData[key].number_of_variables_rough],
				[reportData[key].categories_wo_aid_sum],
				[reportData[key].values_sum],
				reportData[key].data_type_sum_long,
				reportData[key].target_usage_munzner_all,
				reportData[key].target_specific_munzner,
				reportData[key].target_usage_alternative_all,
				[reportData[key].action_analysis],
				[reportData[key].action_search],
				reportData[key].action_query_all,
				reportData[key].all_marks,
				reportData[key].channel,
				[reportData[key].type],
				[reportData[key].family]
       ); // create an array of unique elements (_.union requires arrays as input. Hence turn single strings into arrays with the [brackets])
		
		} // check for only enumerable non-inherited properties (objects at least have the length-property) - actually don't. at least not for the tree of charts
	
	} // for each row

	// log('reportData', reportData);
	
	

	// tree data -----------------------------------------------


	/* different tree structures ================================ */
	/* feed reportData into the d3.nest().entries() if the first category only includes flat, single values */
	/* feed reportDataClone into the d3.nest().entries() if the first category originally includes an array which is fanned out */


	// function to build nested data for the tree
	// number of nesting levels dependent on the array of variables we specify
	// sorts each key ascending unless we specify a custom order through the 'order' argument


	var setTreeStructure = function(arr, data, order) {

		var l = arr.length;
		var dataNest;

		if (l === 2) {

			dataNest = d3.nest()
				.key(function(d) { return d[arr[0]]; }).sortKeys(order[0].length === 0 ? d3.ascending : function(a,b) { return order[0].indexOf(a) - order[0].indexOf(b); })
				.key(function(d) { return d[arr[1]]; }).sortKeys(order[1].length === 0 ? d3.ascending : function(a,b) { return order[1].indexOf(a) - order[1].indexOf(b); })
				.entries(data);

			dataNest.forEach(function(d) {
				d.children = d.values;
				delete d.values;
 				
 				d.children.forEach(function(d) {
 					d.children = d.values;
 					delete d.values;

 				}); // name change 2nd level

			}); // name change 1st level

		} else if (l === 3) {

			dataNest = d3.nest()
				.key(function(d) { return d[arr[0]]; }).sortKeys(order[0].length === 0 ? d3.ascending : function(a,b) { return order[0].indexOf(a) - order[0].indexOf(b); })
				.key(function(d) { return d[arr[1]]; }).sortKeys(order[1].length === 0 ? d3.ascending : function(a,b) { return order[1].indexOf(a) - order[1].indexOf(b); })
				.key(function(d) { return d[arr[2]]; }).sortKeys(order[2].length === 0 ? d3.ascending : function(a,b) { return order[2].indexOf(a) - order[2].indexOf(b); })
				.entries(data);

			dataNest.forEach(function(d) {
				d.children = d.values;
				delete d.values;
 				
 				d.children.forEach(function(d) {
 					d.children = d.values;
 					delete d.values;

					d.children.forEach(function(d) {
	 					d.children = d.values;
	 					delete d.values;

 					}); // name change 3rd level

 				}); // name change 2nd level

			}); // name change 1st level

		} else if (l === 4) {

			dataNest = d3.nest()
				.key(function(d) { return d[arr[0]]; }).sortKeys(order[0].length === 0 ? d3.ascending : function(a,b) { return order[0].indexOf(a) - order[0].indexOf(b); })
				.key(function(d) { return d[arr[1]]; }).sortKeys(order[1].length === 0 ? d3.ascending : function(a,b) { return order[1].indexOf(a) - order[1].indexOf(b); })
				.key(function(d) { return d[arr[2]]; }).sortKeys(order[2].length === 0 ? d3.ascending : function(a,b) { return order[2].indexOf(a) - order[2].indexOf(b); })
				.key(function(d) { return d[arr[3]]; }).sortKeys(order[3].length === 0 ? d3.ascending : function(a,b) { return order[3].indexOf(a) - order[3].indexOf(b); })
				.entries(data);

			dataNest.forEach(function(d) {
				d.children = d.values;
				delete d.values;
 				
 				d.children.forEach(function(d) {
 					d.children = d.values;
 					delete d.values;

					d.children.forEach(function(d) {
	 					d.children = d.values;
	 					delete d.values;

						d.children.forEach(function(d) {
		 					d.children = d.values;
		 					delete d.values;

	 					}); // name change 4th level

 					}); // name change 3rd level

 				}); // name change 2nd level

			}); // name change 1st level

		} else {
			
			console.warn('Problem with setTreeStructure()')
		
		} // test for the array length and build dataNest accordingly

		return dataNest;

	} // setTreeStructure()

	
	// get the dataset names into an array (object you want to see first in button list needs to be last in array to show up first in view as it gets .appended)

	var treeDataNames = [
	
		{ prop1: 'across', prop2: 'c', label: 'scale \u00B7 action', id: 'scaleaction', info: 'Number of values the visual can show \u2192 What do we want to find \u2192 What do we want to do' },
		{ prop1: 'across', prop2: 'b', label: 'action \u00B7 scale \u00B7 type', id: 'actionscaletype', info: 'Key analysis actions \u2192 Chart family \u2192 Number of variables at hands' },
		{ prop1: 'across', prop2: 'a', label: 'data \u00B7 scale \u00B7 usage', id: 'datascaleusage', info: 'Type of data \u2192 Number of variables at hands \u2192 Main target of interest' },
		{ prop1: 'within', prop2: 'e', label: 'what type', id: 'whattype', info: '<strong>Chart categories</strong>: Type of visual \u2192 Chart family' },
		{ prop1: 'within', prop2: 'd', label: 'how', id: 'how', info: '<strong>How are we building the visual</strong>: Marks we use \u2192 Visual channels we use for encoding' },
		{ prop1: 'within', prop2: 'c', label: 'why', id: 'why', info: '<strong>Why are we building the visual</strong>: Main target of interest \u2192 High level analysis aim \u2192 Specific analysis aim' },
		{ prop1: 'within', prop2: 'b', label: 'what scale', id: 'whatscale', info: '<strong>How much data can we show</strong>: Number of variables \u2192 Number of categories \u2192 Number of values' },
		{ prop1: 'within', prop2: 'a', label: 'what data', id: 'whatdata', info: '<strong>What data have we got</strong>: Type of dataset \u2192 Type of data' }
		
	];



	// variables for tree that require custom order (3rd argument to setTreeStructure)

	var data_type_sum_short_order = ['Cat', 'Quant', 'Cat, Ord', 'Cat, Quant', 'Cat, Ord, Quant'],
			categories_wo_aid_sum_order = ['under 10 categories', '10-99 categories', '100-999 categories', '1000 and more categories'],
			values_sum_order = ['under 20 values', 'Dozens of values', 'Hundreds of values', 'Thousands of values', 'Infinite no. of values'],
			action_analysis_order = ['Explain', 'Discover', 'Discover and Explain'],
			main_mark_order = ['Points', 'Lines', 'Areas', 'Connection', 'Containment'],
			family_order = ['Bar chart', 'Line chart', 'Map', 'Tree', 'Network', 'Scatterplot', 'Distribution plot', 'Euler diagram', 'Flow diagram', 'Pie chart', 'Table', 'Multidimensional plot2', 'Other'];


	// set the arguments and get the data

	var treeData = {}; // holds all tree data
	treeData.within = {}; // data for within visual process stages
	treeData.across = {}; // data for across visual process stages
	
	// these are the nest combinations I chose (there can be more or less)
	treeData.within.a = setTreeStructure(['dataset_type', 'data_type_sum_short'], reportData, [[],data_type_sum_short_order]);
	treeData.within.b = setTreeStructure(['number_of_variables_rough', 'categories_wo_aid_sum', 'values_sum'], reportData, [[],categories_wo_aid_sum_order,values_sum_order]);
	treeData.within.c = setTreeStructure(['target_usage_munzner_main', 'action_analysis', 'action_query'], reportData, [[],action_analysis_order,[]]);
	treeData.within.d = setTreeStructure(['main_mark', 'main_channel'], reportData, [main_mark_order,[]]);
	treeData.within.e = setTreeStructure(['type', 'family'], reportData, [[],family_order]);

	treeData.across.a = setTreeStructure(['data_type_sum_short', 'number_of_variables_rough', 'target_usage_alternative_main'], reportData, [data_type_sum_short_order,[],[]]);
	treeData.across.b = setTreeStructure(['action_analysis', 'number_of_variables_rough', 'family'], reportData, [action_analysis_order,[],family_order]);
	treeData.across.c = setTreeStructure(['values_sum', 'action_search', 'action_query'], reportData, [values_sum_order,[],[]]);
	

	// set buttons
	d3.select('div#containerTree').selectAll('.buttons')
		.data(treeDataNames)
		.enter()
		.append('button')
		.attr('class', 'setTreeStructure')
		.attr('id', function(d) { return d.id; })
		.html(function(d) { return d.label; });


	
	// needs to be in Object for d3.tree() - - -
	var dataTree = {};
	dataTree.key = "Chart tree";
	

	// initialise state
	dataTree.children = treeData.within.a; // initial state for tree

	d3.select('button#whatdata').classed('active', true); // initial state for tree button

	var info = treeDataNames[7].info; // set initial state for tree hierarchy info

	d3.select('div.tooltip#treeStructure').html(info); // set initial state for tree hierarchy info

	
	log('dataTree', dataTree);
		

	// save data to a global window-object ----------------------
	
	// save data as a window object to let every function have access to it http://stackoverflow.com/questions/9491885/csv-to-array-in-d3-js
	window.gvis = {};
	gvis.dataTree = dataTree; // save data for tree  as window object
	gvis.dataSearch = searchData; // save data for searchbox as window object
	gvis.allData = reportData; // save data for the report cards as window object
	gvis.root; // the data variable used by the tree
  gvis.searchField; // search variable (for eval)
  gvis.searchText; // text to search

	// initialise select and tree -------------------------------

	// initialise the select box and the tree (report cards will be updated by the select module)
	vis.selectbox.init();
	vis.tree.init();
	
	// transition to basic instructions
	d3.selectAll('div#noteSearch, div#noteBrowse')
		.style('display', 'inherit')
		.style('opacity', 0)
		.transition()
		.duration(500)
		.delay(750)
		.style('opacity', 1);


	// add button handlers
	d3.selectAll('.setTreeStructure').on('mousedown', function() {

		// style
		d3.selectAll('button.setTreeStructure').classed('active', false);
		d3.select(this).classed('active', true);

		// info text
		info = d3.select(this).data()[0].info;
		d3.select('div.tooltip#treeStructure').html(info);

		// data
		var self = d3.select(this),
				prop1 = self.data()[0].prop1,
				prop2 = self.data()[0].prop2,
				data = treeData[prop1][prop2];

		dataTree.children = data;
		vis.tree.clearAll(gvis.root);
    gvis.root.children.forEach(vis.tree.collapse);
    vis.tree.update(gvis.root);

	});


	d3.selectAll('.setTreeStructure').on('mouseover', function() {

		// only show quick info of the respective button during hover. Back to active button after mouseout.
		var infoPrelim = d3.select(this).data()[0].info;
		d3.select('div.tooltip#treeStructure').html(infoPrelim);

	});

	d3.selectAll('.setTreeStructure').on('mouseout', function() {

		// snap info back to active button
		d3.select('div.tooltip#treeStructure').html(info);

	});


}); // data load and prep



// select box --------------------------------------------------------------------------------------------------------

vis.selectbox = (function() {

	var searchMethodBouncer = 'any';

	var my = {},
			reports;
	
	my.init = function() {

		// set inline-width with .style('width') if required or remove for auto width (as long as longest tag)

		// build nested select for tags (https://gist.github.com/jfreels/6811178)
		var selectOptions = d3.select('select#select')
			.selectAll('.optgroup')
				.data(gvis.dataSearch) // data saved globally
				.enter()
			.append('optgroup')
				.attr('label', function(d) { return d.group; })
			.selectAll('.option')
				.data(function(d) { return d.tags; })
				.enter()
			.append('option')
				.attr('value', function(d) { return d; })
				.text(function(d) { return d; });

		// button mechanics and related styles
		d3.select('button#any').style('color', '#555');
				
		d3.selectAll('.method').on('click', function() {
			d3.selectAll('.method').style('color', '#bbb');
			d3.select(this).style('color', '#555');
			searchMethodBouncer = d3.select(this).attr('id');
			// !!! best to trigger new search with currently searched for tags; alternative - clear searchbox and trigger new search
		}); // toggle serch method used for search


		// start select2
		$('#select').select2({
			placeholder: "Start typing or select...",
			allowClear: true
		});

		
		// get the data-objects that match the selected tags
		function showSelectedReports() {

			var objSelected = $('#select').select2('data'); // get the full array of tags https://github.com/select2/select2/issues/2929

			var tagsSelected = []; // this will hold the chosen tags



			for (var i = 0; i < objSelected.length; i++) tagsSelected.push(objSelected[i].text); // loop through all tags in the array and push only the chosen into tagsSelected

			reports = gvis.allData.filter(function(el) {

				var intersect = _.intersection(el.searchTags, tagsSelected); // for easier reading - not needed

				var intersectLength = intersect.length;

				if (searchMethodBouncer === 'any') {
					return intersectLength > 0; // 'any' mode: if there are any intersections between the chosen tags and the report's tags
				} else if (searchMethodBouncer === 'strict') {
					return intersectLength === tagsSelected.length; // 'strict' mode: if all chosen tags can be found in the report's tag-array
				}

			}); // return only the report-elements that match the selected tags.

			vis.cards.updateCards(reports);
		} // showSelectedReports

		$('#select').on('change', showSelectedReports); // update reports object through select field

		d3.select('button#refresh').on('click', showSelectedReports); // update reports object through refresh button
		d3.select('button#refresh').on('mouseover', function(){
			d3.select(this).transition().style({'background': '#eaeaea', 'color': '#555'});
		}); // button style change
		d3.select('button#refresh').on('mouseout', function(){
			d3.select(this).transition().style({'background': '#f7f7f7', 'color': '#999'});
		}); // button style change
		
		$('#select').on('select2:close', function(e){
			if ($('#select').select2('data').length === 0) {
				vis.tree.clearAll(gvis.root);
		    gvis.root.children.forEach(vis.tree.collapse);
		    vis.tree.update(gvis.root);
				d3.selectAll('.report').remove(); // the listener reacts differently for strict search mode and shows all reports upon closing. lazy remove instead of de-bugging
				d3.selectAll('div#noteSearch, div#noteBrowse')
					.style('display', 'inherit')
					.style('opacity', 0)
					.transition().duration(500)
					.style('opacity', .5);
				d3.select('div#cards')
					.style('overflow', 'hidden'); // remove scrollbar on pc's
			} // collapse tree if selection is empty
		});
		
	}; // my.init

	return my;


})(); // vis.selectbox module




// report cards ------------------------------------------------------------------------------------------------------

vis.cards = (function() {

	var my = {};
	
	my.updateCards = function(data){

			d3.selectAll('div#noteSearch, div#noteBrowse').style('display', 'none');

			d3.selectAll('.containerCards').remove(); // hard clean, no enter - update - exit
		
			d3.select('div#cards')
					.style('overflow', 'scroll')
					.style('overflow-x', 'hidden'); // switch on only y-scrolling (for windows run browsers)
		
			var containerCards = d3.select('div#cards')
				.append('div')
					.attr('class', 'containerCards');

			d3.selectAll('.report').remove();

			var reports = containerCards.selectAll('.report')
				.data(data);
			
			reports.enter()
				.append('div')
					.attr('class', 'report')
					.attr('id', function(d) { return d.identifier; })
					.style('opacity', 0)
					.style('background-color', '#fff')
					.transition()
					.style('opacity', 1)
					.style('background-color', function(d,i) { return i%2 === 0 ? '#F7F7F7' : '#fff' });
			
			// headers
			reports.append('h1')
					.attr('class', 'header1')
					.html(function(d) { return d.name; });
					
			reports.append('h3')
					.attr('class', 'header2')
					.html(function(d) { 
						return d.alternative_names !== "NA" ?  
							'Type: ' + d.type + ' \u00B7 Family: ' + d.family + ' \u00B7 Alternative: ' + d.alternative_names : 
							'Type: ' + d.type + ' \u00B7 Family: ' + d.family; 
					});


			// buttons
			var buttonList = reports.append('ul')
				.attr('class', 'taglist');

			buttonList.append('li')
					.attr('class', 'buttonTags')
					.attr('id', 'browseTree')
					.html('browse tree');
	
			buttonList.append('li')
					.attr('class', 'buttonTags')
					.attr('id', 'moreInfo')
					.html('more info');

			buttonList.append('li')
				.attr('class', 'buttonTags')
				.attr('id', 'source')
				.html('web \u00B7 source');
		

			// image
			reports.append('img')
				.attr('src', function(d) { return 'images/graphs/' + d.image_file; })
				.attr('id', 'graph');

			// description
			reports.append('p')
				.attr('class', 'description')
				.html(function(d) { return d.description; });
	
			// paragraph element underneath the floated image to clear the float
			// this way the image doesn't overlap the container in any case
			reports.append('p')
				.attr('class', 'clearFix')
				.html('');
	

			// more info (\u007C = |)
			reports.append('p')
					.attr('class', 'moreInfoText')
					.attr('id', function(d) { return 'moreInfoText' + d.identifier; })
					.html(function(d) {
						return '<strong>What</strong> data: ' + arrToStr(d.whatData)
						+ ' \u007C <strong>What</strong> scale: ' + arrToStr(d.whatScale)
						+ ' \u007C <strong>Why</strong> targets: ' + arrToStr(d.whyTargets)
						+ ' \u007C <strong>Why</strong> actions: ' + arrToStr(d.whyActions)
						+ ' \u007C <strong>How</strong> encoding: ' + arrToStr(d.howMarksChannels)
						+ ( d.aid === 'NA' ? '' : '</br></br><strong>Suggested interactions</strong>: ' + arrToStr(d.aid) )
						+ '</br></br>'
						+ ( d.history === 'NA' ? '' : '<strong>History</strong>: ' + d.history )
						+ ( d.image_source === 'NA' ? '' : '</br><strong>Image source</strong>: ' + d.image_source );
					});



			/* button-listeners and handlers */
					

			// d3.selectAll('li.')

			// find report in tree
			d3.selectAll('.header1, .header2, #browseTree, .description').on('mousedown', function(e){
    
					vis.tree.clearAll(gvis.root); // collapse data
			    vis.tree.expandAll(gvis.root); // expand data
			    vis.tree.update(gvis.root); // show tree
					// !!! to sort out when we get there, but probably best to pass a 'search' object with searchField, searchText and maybe the data ?
			    gvis.searchField = "d.identifier"; // find the right node(s)...
			    gvis.searchText = e.identifier;
			    vis.tree.searchTree(gvis.root);
			    gvis.root.children.forEach(vis.tree.collapseAllNotFound); // collapse all non-found
			    vis.tree.update(gvis.root); // update
		
			});

			// go to web
			d3.selectAll('#source').on('mousedown', function(e){
			
				// open report in new window
				var url = e.source;
				var win = window.open(url, '_blank');
				win ? win.focus() : alert('please allow pop-ups for this site'); // this needs to get tested
			
			});

			// show more info
			d3.selectAll('#moreInfo').on('mousedown', function(d) {

				if (d3.select('#moreInfoText' + d.identifier).style('display') === 'none') {
				
					d3.select(this).html('less info'); // toggle name
					d3.select('#moreInfoText' + d.identifier)
						.style('display', 'inherit')
						.style('font-size', 1e-6 + 'px')
						.transition()
						.style('font-size', '1em'); // toggle display
				
				} else {
				
					d3.select(this).html('more info'); // toggle name
					d3.select('#moreInfoText' + d.identifier)
						.style('font-size', '1em')
						.transition()
						.style('font-size', 1e-6 + 'px'); // toggle display

					setTimeout(function(){
						d3.select('#moreInfoText' + d.identifier)
							.style('display', 'none');
					}, 250); // wait until transition has finished before setting display to none
				
				} // toggle based on display property

			});

			// image hover shows picture in big
			d3.selectAll('img#graph').on('mouseover', function(d) {

				// get client width (the browser-safe way)
				var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

				// get the image tag code (including inline style to set max-width and max-height) and the source
				var image = '<img src=' + this.src + ' style="min-width: 200px; max-width:'+ w/2 + 'px; max-height:' + (h * 0.9) + 'px">'
				var source = '</br></br>Note: ' + d.image_note + '</br>';
				var html = d.image_note === 'NA' ? image : image + source;

				// tooltip to always be 5% from top and a maximum of 90% tall so that it's always in sight'
				d3.select('div.tooltip')
					.style('left', (d3.event.pageX + 20) + 'px')
					.style('top', '5vh')
					.html(html)
					.style('opacity', 0)
					.transition()
					.style('opacity', 0.9);

			});
			d3.selectAll('img#graph').on('mousemove', function() {

				// only move horizontally
				d3.select('div.tooltip')
					.style('left', (d3.event.pageX + 20) + 'px')
					.style('top', '5vh');

			});
			d3.selectAll('img#graph').on('mouseout', function() {

				d3.select('div.tooltip')
					.transition()
					.style('opacity', 0);

			}); // image hover


					

			
	} // vis.cards.updateCards()

	return my;


})(); // vis.cards module




// tree --------------------------------------------------------------------------------------------------------------

vis.tree = (function() {


	var my = {};


	//===============================================
	my.searchTree = function(d) {
	    if (d.children)
	        d.children.forEach(my.searchTree);
	    else if (d._children)
	        d._children.forEach(my.searchTree);
	    var searchFieldValue = eval(gvis.searchField);
	    if (searchFieldValue && searchFieldValue.match(gvis.searchText)) {
	            // Walk parent chain
	            var ancestors = [];
	            var parent = d;
	            while (typeof(parent) !== "undefined") {
	                ancestors.push(parent);
	                parent.class = "found";
	                parent = parent.parent;
	            }
	    }
	}

	//===============================================
	my.clearAll = function(d) {
		  d.class = "";
	    if (d.children)
	        d.children.forEach(my.clearAll);
	    else if (d._children)
	        d._children.forEach(my.clearAll);
	}

	//===============================================
	my.collapse = function(d) {
	    if (d.children) {
	        d._children = d.children;
	        d._children.forEach(my.collapse);
	        d.children = null;
	    }
	}

	//===============================================
	my.collapseAllNotFound = function(d) {
	    if (d.children) {
	    	if (d.class !== "found") {
	        	d._children = d.children;
	        	d._children.forEach(my.collapseAllNotFound);
	        	d.children = null;
		} else 
	        	d.children.forEach(my.collapseAllNotFound);
	    }
	}

	//===============================================
	my.expandAll = function(d) {
	    if (d._children) {
	        d.children = d._children;
	        d.children.forEach(my.expandAll);
	        d._children = null;
	    } else if (d.children)
	        d.children.forEach(my.expandAll);
	}

	//= private func ================================
	// Toggle children on click.
	function toggle(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  my.clearAll(gvis.root);
	  my.update(d);
	  // $("#searchName").select2("val", "");
	  // $("#searchName").val("").trigger("change");
	}



	var width = document.getElementById('containerTree').clientWidth * .9,
	    height = document.getElementById('containerTree').clientHeight * .9,
			margin = { top: height * .05, right: width * .1, bottom: height * 1e-6, left: width * .2 };
		
	var i = 0,
	    duration = 600;

	var tree = d3.layout.tree()
	    .size([height, width]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var svg; // needs to be accessible for both my.init and my.update function

	var expandBouncer = false; // for opening/closing all nodes on index-node double-click

	// public variables ----------------------------

	my.init = function() {

		svg = d3.select('div#containerTree')
			.append('svg')
				.attr('id', 'svg')
		    .attr('width', width + margin.right)
		    .attr('height', height + margin.top + margin.bottom)
		  .append('g')
		    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		
		// rename data for use in tree
	  gvis.root = gvis.dataTree;
	  gvis.root.x0 = height / 2;
	  gvis.root.y0 = 0;

	  gvis.root.children.forEach(my.collapse); // applies collapse only to the root's children
	  my.update(gvis.root); // calls the vis-building function 
		

		// allow opening/closing entire tree on index-node double-click
		var l = d3.selectAll('.node')[0].length;
		var indexNode = d3.selectAll('.node')[0][l-1];
		indexNode.id = 'indexNode';
		
		d3.select('.node#indexNode').on('dblclick', function(){
			expandBouncer = !expandBouncer;
			if(expandBouncer){
		    my.collapse(gvis.root);
		    my.expandAll(gvis.root);
		    my.update(gvis.root);
			} else {
				my.clearAll(gvis.root);
		    gvis.root.children.forEach(vis.tree.collapse);
		    my.update(gvis.root);
			}
		}); // listener and handler for opening/closing all nodes
		
	}

	my.update = function(source) {

	  // Compute the new tree layout.
	  var nodes = tree.nodes(gvis.root).reverse(), // first node will be last in the returned object. doesn't seem to impact on the layout though
	      links = tree.links(nodes);

	  // Normalize for fixed-depth.
		nodes.forEach(function(d) { d.y = d.depth * 100; }); // change node-distances (width of the vis)

	  // Update the nodes…
	  var node = svg.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); }); // key function. Rank by id or assign an id based on the last available id + 1

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append("g")
	      .classed('node', true)
	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
				.on("click", toggle); // moves child objects into children key 


	  nodeEnter.append("circle")
	      .attr("r", 1e-6)
	      .style("fill", function(d) { return d._children ? "#ccc" : "#fff"; });

	  nodeEnter.append("text")
				.classed('reportNode', function(d) { return !d.children && !d._children; })
	      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	      .text(function(d) { return d.key || d.name; }) // returns the parent name for all parents and the report name for all leave nodes
	      .style("fill-opacity", 1e-6); // small number for transition

		// event listender and handler for node-report-link 
		d3.selectAll('.reportNode').on('mousedown', function(d){

			// option (1) show report card
			vis.cards.updateCards([d]);

			// // option (2) open report in new window
			// var url = d.Link;
			// var win = window.open(url, '_blank');
			// win ? win.focus() : alert('please allow pop-ups for this site'); // this needs to get tested
		});

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	  nodeUpdate.select("circle")
	      .attr("r", 4.5)
	      .style("fill", function(d) {
	            if (d.class === "found") {
                return "#6194F2"; // blue
								} else if (d._children) {
	                return "#ccc";
	            } else {
	                return "#fff";
	            }
        })
        .style("stroke", function(d) {
	            if (d.class === "found") {
                return "#6194F2"; // blue
	            }
	        });

	  nodeUpdate.select("text")
	      .style("fill-opacity", 1);

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	      .remove();

	  nodeExit.select("circle")
	      .attr("r", 1e-6);

	  nodeExit.select("text")
	      .style("fill-opacity", 1e-6);

	  // Update the links…
	  var link = svg.selectAll("path.link")
	      .data(links, function(d) { return d.target.id; }); // key function is the id - equivalent to the node id above

	  // Enter any new links at the parent's previous position.
	  link.enter().insert("path", "g")
	      .attr("class", "link")
	      .attr("d", function(d) {
	        var o = { x: source.x0, y: source.y0 };
	        return diagonal({ source: o, target: o });
	      });

	  // Transition links to their new position.
	  link.transition()
	      .duration(duration)
	      .attr("d", diagonal)
	      .style("stroke", function(d) {
	            if (d.target.class === "found") {
                return "#6194F2"; // blue
	            }
	      });

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
	      .duration(duration)
	      .attr("d", function(d) {
	        var o = {x: source.x, y: source.y};
	        return diagonal({source: o, target: o});
	      })
	      .remove();

	  // Stash the old positions for transition.
	  nodes.forEach(function(d) {
	    d.x0 = d.x;
	    d.y0 = d.y;
	  });
	


	} // update function ?
	
	return my;
	
	
})(); // vis.tree
	
