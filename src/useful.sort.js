/*
	Source:
	van Creij, Maurice (2012). "useful.sort.js: Simple table sorting functionality", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Sort = function (obj, cfg) {
		// properties
		this.obj = obj;
		this.cfg = cfg;
		// methods
		this.start = function () {
			var a, b, context = this;
			// get the headers
			context.cfg.headers = useful.transitions.select(context.cfg.headers, context.obj);
			context.cfg.links = [];
			// add links to all the headers
			for (a = 0 , b = context.cfg.headers.length; a < b; a += 1) {
				context.cfg.links[a] = document.createElement('a');
				context.cfg.links[a].href = '#';
				context.cfg.links[a].className = 'sort-none';
				context.cfg.links[a].innerHTML = context.cfg.headers[a].innerHTML;
				context.cfg.headers[a].innerHTML = '';
				context.cfg.headers[a].appendChild(context.cfg.links[a]);
				context.cfg.links[a].onclick = context.onClicked(context.cfg.links[a], context);
			}
		};
		this.update = function (context) {
			var a, b, selection, index, type, tbody, rows = [];
			// update the headers
			for (a = 0 , b = context.cfg.links.length; a < b; a += 1) {
				if (context.cfg.active === a) {
					context.cfg.links[a].className = (context.cfg.direction > 0) ?
						context.cfg.links[a].className.replace(/sort-up|sort-none/gi, 'sort-down'):
						context.cfg.links[a].className.replace(/sort-down|sort-none/gi, 'sort-up');
				} else {
					context.cfg.links[a].className = context.cfg.links[a].className.replace(/sort-up|sort-down/gi, 'sort-none');
				}
			}
			// create a sortable array for the rows
			selection = useful.transitions.select(context.cfg.rows, context.obj);
			for (a = 0 , b = selection.length; a < b; a += 1) {
				rows[a] = selection[a];
			}
			// determine the data type
			index = parseInt(rows.length/2);
			type = context.guessType(useful.transitions.select(context.cfg.cols, rows[index])[context.cfg.active]);
			// sort the array by the relevant column
			rows.sort(function (a, b) {
				return context.sortType(a, b, type, context);
			});
			// for all rows in the array
			for (a = 0 , b = rows.length; a < b; a += 1) {
				// remove the row from the table
				tbody = rows[a].parentNode;
				rows[a] = tbody.removeChild(rows[a]);
				// add the row back at the bottom of the table
				tbody.appendChild(rows[a]);
			}
		};
		this.guessType = function (element) {
			var type, contents = element.innerHTML.replace(/(<([^>]+)>)/ig, '');
			// if the content is an HTML5 time element
			if (element.getElementsByTagName('time').length > 0 && element.getElementsByTagName('time')[0].getAttribute('datetime')) {
				type = 'html5time';
			// else if the content are a date
			} else if (!isNaN(new Date(contents))) {
				type = 'stringdate';
			// else if the contents are a number
			} else if (!isNaN(parseFloat(contents))) {
				type = 'number';
			// else if the contents are an image
			} else if (element.getElementsByTagName('img').length > 0 && element.getElementsByTagName('img')[0].alt) {
				type = 'alt';
			} else if (element.getElementsByTagName('img').length > 0 && element.getElementsByTagName('img')[0].title) {
				type = 'title';
			// else if the contents are a currency
			} else if (contents !== '' && contents.match(/^\$?(\d{1,3}[ ,]?)*(\.\d{0,2})?$/gi)) {
				type = 'currency';
			// else assume it's a string
			} else {
				type = 'string';
			}
			// return the guess
			return type;
		};
		this.sortType = function (a, b, type, context) {
			var cola, colb, vala, valb;
			// get the two columns
			cola = useful.transitions.select(context.cfg.cols, a)[context.cfg.active];
			colb = useful.transitions.select(context.cfg.cols, b)[context.cfg.active];
			// if the content are an HTML5 date
			switch (type) {
			case 'html5time' :
				vala = new Date(cola.getElementsByTagName('time')[0].getAttribute('datetime'));
				valb = new Date(colb.getElementsByTagName('time')[0].getAttribute('datetime'));
				break;
			case 'stringdate' :
				vala = new Date(cola.innerHTML.replace(/(<([^>]+)>)/ig, ''));
				valb = new Date(colb.innerHTML.replace(/(<([^>]+)>)/ig, ''));
				break;
			case 'number' :
				vala = parseFloat(cola.innerHTML.replace(/(<([^>]+)>)/ig, ''));
				valb = parseFloat(colb.innerHTML.replace(/(<([^>]+)>)/ig, ''));
				break;
			case 'currency' :
				vala = parseFloat(cola.innerHTML.replace(/(<([^>]+)>)/ig, '').replace(/[^0-9-.]/ig, ''));
				valb = parseFloat(colb.innerHTML.replace(/(<([^>]+)>)/ig, '').replace(/[^0-9-.]/ig, ''));
				break;
			case 'alt' :
				vala = cola.getElementsByTagName('img')[0].alt;
				valb = colb.getElementsByTagName('img')[0].alt;
				break;
			case 'title' :
				vala = cola.getElementsByTagName('img')[0].title;
				valb = colb.getElementsByTagName('img')[0].title;
				break;
			default :
				vala = cola.innerHTML.replace(/(<([^>]+)>)/ig, '').toLowerCase();
				valb = colb.innerHTML.replace(/(<([^>]+)>)/ig, '').toLowerCase();
			}
			// compare the contents
			return (context.cfg.direction > 0) ? vala > valb : vala < valb;
		};
		this.onClicked = function (element, context) {
			return function () {
				// get the index of the column
				var index = context.cfg.links.indexOf(element);
				// toggle the search direction
				var direction = (context.cfg.links[index].className.match(/sort-up|sort-none/gi)) ? 1 : -1;
				// perform the sort
				context.perform(index, direction);
				// cancel the click
				return false;
			};
		};
		this.perform = function (index, direction) {
			var context = this;
			// store the target column
			context.cfg.active = index;
			// store the search direction
			context.cfg.direction = direction;
			// perform the sort
			context.update(context);
		};
	};

}(window.useful = window.useful || {}));
