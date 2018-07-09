/*
	Source:
	van Creij, Maurice (2018). "transitions.js: A library of useful functions to ease working with CSS3 transitions.", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var transitions = {

	// applies functionality to node that conform to a given CSS rule, or returns them
	select: function(input, parent) {
		var a,
			b,
			elements;
		// validate the input
		parent = parent || document.body;
		input = (typeof input === 'string')
			? {
				'rule': input,
				'parent': parent
			}
			: input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined')
			? input.parent.querySelectorAll(input.rule)
			: (typeof(jQuery) !== 'undefined')
				? jQuery(input.parent).find(input.rule).get()
				: [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0, b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], input.data.create());
			}
			// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	},

	// checks the compatibility of CSS3 transitions for this browser
	compatibility: function() {
		var eventName,
			newDiv,
			empty;
		// create a test div
		newDiv = document.createElement('div');
		// use various tests for transition support
		if (typeof(newDiv.style.MozTransition) !== 'undefined') {
			eventName = 'transitionend';
		}
		try {
			document.createEvent('OTransitionEvent');
			eventName = 'oTransitionEnd';
		} catch (e) {
			empty = null;
		}
		try {
			document.createEvent('WebKitTransitionEvent');
			eventName = 'webkitTransitionEnd';
		} catch (e) {
			empty = null;
		}
		try {
			document.createEvent('transitionEvent');
			eventName = 'transitionend';
		} catch (e) {
			empty = null;
		}
		// remove the test div
		newDiv = empty;
		// pass back working event name
		return eventName;
	},

	// performs a transition between two classnames
	byClass: function(element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
		var replaceThis,
			replaceWith,
			endEventName,
			endEventFunction;
		// validate the input
		endEventHandler = endEventHandler || function() {};
		endEventName = this.compatibility();
		// turn the classnames into regular expressions
		replaceThis = new RegExp(removedClass.trim().replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
		replaceWith = new RegExp(addedClass, 'g');
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function() {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// replace the class name
			element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
			// else if jQuery UI is available
		} else if (typeof jQuery !== 'undefined' && typeof jQuery.ui !== 'undefined') {
			// retrieve any extra information for jQuery
			jQueryDuration = jQueryDuration || 500;
			jQueryEasing = jQueryEasing || 'swing';
			// use switchClass from jQuery UI to approximate CSS3 transitions
			jQuery(element).switchClass(removedClass.replace(replaceWith, ''), addedClass, jQueryDuration, jQueryEasing, endEventHandler);
			// if all else fails
		} else {
			// just replace the class name
			element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
			// and call the onComplete handler
			endEventHandler();
		}
	},

	// adds the relevant browser prefix to a style property
	prefix: function(property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi))
			? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1)
			: (navigator.userAgent.match(/firefox/gi))
				? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1)
				: (navigator.userAgent.match(/microsoft/gi))
					? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1)
					: (navigator.userAgent.match(/opera/gi))
						? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1)
						: property;
	},

	// applies a list of rules
	byRules: function(element, rules, endEventHandler) {
		var rule,
			endEventName,
			endEventFunction;
		// validate the input
		rules.transitionProperty = rules.transitionProperty || 'all';
		rules.transitionDuration = rules.transitionDuration || '300ms';
		rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
		endEventHandler = endEventHandler || function() {};
		endEventName = this.compatibility();
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function() {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[this.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// else if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			var jQueryEasing,
				jQueryDuration;
			// pick the equivalent jQuery animation function
			jQueryEasing = (rules.transitionTimingFunction.match(/ease/gi))
				? 'swing'
				: 'linear';
			jQueryDuration = parseInt(rules.transitionDuration.replace(/s/g, '000').replace(/ms/g, ''), 10);
			// remove rules that will make Internet Explorer complain
			delete rules.transitionProperty;
			delete rules.transitionDuration;
			delete rules.transitionTimingFunction;
			// use animate from jQuery
			jQuery(element).animate(rules, jQueryDuration, jQueryEasing, endEventHandler);
			// else
		} else {
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[this.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// call the onComplete handler
			endEventHandler();
		}
	}

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = transitions;
}

/*
	Source:
	van Creij, Maurice (2018). "sort.js: Simple table sorting functionality", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Sort = function (config) {

	// PROPERTIES

	// METHODS

	this.init = function (config) {
		var a, b;
		// store the configuration
		this.config = config;
		this.element = config.element;
		// get the headers
		this.config.headers = transitions.select(this.config.headers, this.element);
		this.config.links = [];
		// add links to all the headers
		for (a = 0 , b = this.config.headers.length; a < b; a += 1) {
			this.config.links[a] = document.createElement('a');
			this.config.links[a].href = '#';
			this.config.links[a].className = 'sort-none';
			this.config.links[a].innerHTML = this.config.headers[a].innerHTML;
			this.config.headers[a].innerHTML = '';
			this.config.headers[a].appendChild(this.config.links[a]);
			this.config.links[a].onclick = this.onClicked(this.config.links[a]);
		}
		// return the object
		return this;
	};

	this.update = function (context) {
		var a, b, selection, index, type, tbody, fragment, rows = [];
		// update the headers
		for (a = 0 , b = this.config.links.length; a < b; a += 1) {
			if (this.config.active === a) {
				this.config.links[a].className = (this.config.direction > 0) ?
					this.config.links[a].className.replace(/sort-up|sort-none/gi, 'sort-down'):
					this.config.links[a].className.replace(/sort-down|sort-none/gi, 'sort-up');
			} else {
				this.config.links[a].className = this.config.links[a].className.replace(/sort-up|sort-down/gi, 'sort-none');
			}
		}
		// create a sortable array for the rows
		selection = transitions.select(this.config.rows, this.element);
		for (a = 0 , b = selection.length; a < b; a += 1) {
			rows[a] = selection[a];
		}
		// determine the data type
		index = parseInt(rows.length/2);
		type = this.guessType(transitions.select(this.config.cols, rows[index])[this.config.active]);
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
		cola = transitions.select(this.config.cols, a)[this.config.active];
		colb = transitions.select(this.config.cols, b)[this.config.active];
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
		return (this.config.direction > 0) ? vala > valb : vala < valb;
	};

	this.perform = function (index, direction) {
		// store the target column
		this.config.active = index;
		// store the search direction
		this.config.direction = direction;
		// perform the sort
		this.update();
	};

	// EVENTS

	this.onClicked = function (element) {
		var _this = this;
		return function () {
			// get the index of the column
			var index = _this.config.links.indexOf(element);
			// toggle the search direction
			var direction = (_this.config.links[index].className.match(/sort-up|sort-none/gi)) ? 1 : -1;
			// perform the sort
			_this.perform(index, direction);
			// cancel the click
			return false;
		};
	};

	this.init(config);
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = Sort;
}
