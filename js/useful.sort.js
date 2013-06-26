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
	var sort = {};
	sort = {
		start : function (element, settings) {
			var a, b;
			// store the parent element
			settings.parent = element;
			// get the headers
			settings.headers = useful.css.select(settings.headers, settings.parent);
			settings.links = [];
			// add links to all the headers
			for (a = 0 , b = settings.headers.length; a < b; a += 1) {
				settings.links[a] = document.createElement('a');
				settings.links[a].href = '#';
				settings.links[a].className = 'sort-none';
				settings.links[a].innerHTML = settings.headers[a].innerHTML;
				settings.headers[a].innerHTML = '';
				settings.headers[a].appendChild(settings.links[a]);
				sort.events.click(settings.links[a], settings);
			}
		},
		update : function (settings) {
			var a, b, selection, type, tbody, rows = [];
			// update the headers
			for (a = 0 , b = settings.links.length; a < b; a += 1) {
				if (settings.active === a) {
					settings.links[a].className = (settings.direction > 0) ?
						settings.links[a].className.replace(/sort-up|sort-none/gi, 'sort-down'):
						settings.links[a].className.replace(/sort-down|sort-none/gi, 'sort-up');
				} else {
					settings.links[a].className = settings.links[a].className.replace(/sort-up|sort-down/gi, 'sort-none');
				}
			}
			// create a sortable array for the rows
			selection = useful.css.select(settings.rows, settings.parent);
			for (a = 0 , b = selection.length; a < b; a += 1) {
				rows[a] = selection[a];
			}
			// determine the data type
			type = sort.guessType(useful.css.select(settings.cols, rows[0])[settings.active]);
			// sort the array by the relevant column
			rows.sort(function (a, b) {
				return sort.sortType(a, b, type, settings);
			});
			// for all rows in the array
			for (a = 0 , b = rows.length; a < b; a += 1) {
				// remove the row from the table
				tbody = rows[a].parentNode;
				rows[a] = tbody.removeChild(rows[a]);
				// add the row back at the bottom of the table
				tbody.appendChild(rows[a]);
			}
		},
		guessType : function (element) {
			var type;
			// if the content is an HTML5 time element
			if (element.getElementsByTagName('time').length > 0 && element.getElementsByTagName('time')[0].getAttribute('datetime')) {
				type = 'html5time';
			// else if the content are a date
			} else if (!isNaN(new Date(element.innerHTML.replace(/(<([^>]+)>)/ig, '')))) {
				type = 'stringdate';
			// else if the contents are a number
			} else if (!isNaN(parseFloat(element.innerHTML.replace(/(<([^>]+)>)/ig, '')))) {
				type = 'number';
			// else if the contents are an image
			} else if (element.getElementsByTagName('img').length > 0 && element.getElementsByTagName('img')[0].alt) {
				type = 'alt';
			} else if (element.getElementsByTagName('img').length > 0 && element.getElementsByTagName('img')[0].title) {
				type = 'title';
			// else if the contents are a currency
			} else if (element.innerHTML.replace(/(<([^>]+)>)/ig, '').match(/^\$?(\d{1,3}[ ,]?)*(\.\d{0,2})?$/gi)) {
				type = 'currency';
			// else assume it's a string
			} else {
				type = 'string';
			}
			// return the guess
			return type;
		},
		sortType : function (a, b, type, settings) {
			var cola, colb, vala, valb;
			// get the two columns
			cola = useful.css.select(settings.cols, a)[settings.active];
			colb = useful.css.select(settings.cols, b)[settings.active];
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
			return (settings.direction > 0) ? vala > valb : vala < valb;
		},
		events : {
			click : function (element, settings) {
				element.onclick = function () {
					// store the relevant column
					settings.active = settings.links.indexOf(element);
					// figure out the direction
					settings.direction = (settings.links[settings.active].className.match(/sort-up|sort-none/gi)) ? 1 : -1;
					// update the view
					sort.update(settings);
					// cancel the click
					return false;
				};
			}
		}
	};

	// public functions
	useful.models = useful.models || {};
	useful.models.clone = function (model) {
		var clonedModel, ClonedModel;
		// if the method exists
		if (typeof(Object.create) !== 'undefined') {
			clonedModel = Object.create(model);
		}
		// else use a fall back
		else {
			ClonedModel = function () {};
			ClonedModel.prototype = model;
			clonedModel = new ClonedModel();
		}
		// return the clone
		return clonedModel;
	};

	useful.css = useful.css || {};
	useful.css.select = function (input, parent) {
		var a, b, elements;
		// validate the input
		parent = parent || document;
		input = (typeof input === 'string') ? {'rule' : input, 'parent' : parent} : input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined') ?
			input.parent.querySelectorAll(input.rule) :
			(typeof(jQuery) !== 'undefined') ? jQuery(input.parent).find(input.rule).get() : [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0 , b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], useful.models.clone(input.data));
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};

	useful.sort = {};
	useful.sort.start = sort.start;

}(window.useful = window.useful || {}));
