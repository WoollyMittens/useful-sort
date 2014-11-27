/*
	Source:
	van Creij, Maurice (2014). "useful.sort.js: Simple table sorting functionality", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Sort = useful.Sort || function () {};

// extend the constructor
useful.Sort.prototype.init = function (cfg) {
	// properties
	"use strict";
	this.cfg = cfg;
	this.obj = cfg.element;
	// methods
	this.start = function () {
		var a, b;
		// get the headers
		this.cfg.headers = useful.transitions.select(this.cfg.headers, this.obj);
		this.cfg.links = [];
		// add links to all the headers
		for (a = 0 , b = this.cfg.headers.length; a < b; a += 1) {
			this.cfg.links[a] = document.createElement('a');
			this.cfg.links[a].href = '#';
			this.cfg.links[a].className = 'sort-none';
			this.cfg.links[a].innerHTML = this.cfg.headers[a].innerHTML;
			this.cfg.headers[a].innerHTML = '';
			this.cfg.headers[a].appendChild(this.cfg.links[a]);
			this.cfg.links[a].onclick = this.onClicked(this.cfg.links[a]);
		}
		// disable the start function so it can't be started twice
		this.init = function () {};
	};
	this.update = function (context) {
		var a, b, selection, index, type, tbody, fragment, rows = [];
		// update the headers
		for (a = 0 , b = this.cfg.links.length; a < b; a += 1) {
			if (this.cfg.active === a) {
				this.cfg.links[a].className = (this.cfg.direction > 0) ?
					this.cfg.links[a].className.replace(/sort-up|sort-none/gi, 'sort-down'):
					this.cfg.links[a].className.replace(/sort-down|sort-none/gi, 'sort-up');
			} else {
				this.cfg.links[a].className = this.cfg.links[a].className.replace(/sort-up|sort-down/gi, 'sort-none');
			}
		}
		// create a sortable array for the rows
		selection = useful.transitions.select(this.cfg.rows, this.obj);
		for (a = 0 , b = selection.length; a < b; a += 1) {
			rows[a] = selection[a];
		}
		// determine the data type
		index = parseInt(rows.length/2);
		type = this.guessType(useful.transitions.select(this.cfg.cols, rows[index])[this.cfg.active]);
		// sort the array by the relevant column
		var _this = this;
		rows.sort(function (a, b) {
			return _this.sortType(a, b, type);
		});
		// for all rows in the array
		fragment = document.createDocumentFragment();
		tbody = rows[0].parentNode;
		for (a = 0 , b = rows.length; a < b; a += 1) {
			// remove the row and store it in the fragment
			fragment.appendChild(tbody.removeChild(rows[a]));
		}
		// put the fragment back
		tbody.appendChild(fragment);
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
	this.sortType = function (a, b, type) {
		var cola, colb, vala, valb;
		// get the two columns
		cola = useful.transitions.select(this.cfg.cols, a)[this.cfg.active];
		colb = useful.transitions.select(this.cfg.cols, b)[this.cfg.active];
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
		return (this.cfg.direction > 0) ? vala > valb : vala < valb;
	};
	this.onClicked = function (element) {
		var _this = this;
		return function () {
			// get the index of the column
			var index = _this.cfg.links.indexOf(element);
			// toggle the search direction
			var direction = (_this.cfg.links[index].className.match(/sort-up|sort-none/gi)) ? 1 : -1;
			// perform the sort
			_this.perform(index, direction);
			// cancel the click
			return false;
		};
	};
	this.perform = function (index, direction) {
		// store the target column
		this.cfg.active = index;
		// store the search direction
		this.cfg.direction = direction;
		// perform the sort
		this.update();
	};
	// go
	this.start();
	return this;
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Sort;
}
