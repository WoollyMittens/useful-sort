# useful.sort.js: Table Sorting

The contents of the table can be sorted by clicking on the headers.

## How to use the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/sort.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful.sort.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*. To provide an alternative for *document.querySelectorAll* in Internet Explorer 8 and lower, include *jQuery*.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
<![endif]-->
```

### Using vanilla JavaScript

This is the safest way of starting the script, but allows for only one target element at a time.

```javascript
var parent = documentGetElementById('id');
useful.sort.start(parent, {
	'headers' : 'thead tr th',
	'rows' : 'tbody tr',
	'cols' : 'th, td'
});
```

**id : {string}** - The ID attribute of an element somewhere in the document.
**parent : {DOM node}** - The DOM element around which the functionality is centred.
**links : {string}** - A CSS rule that describes the clickable headers within *parent*.
**rows : {string}** - A CSS rule that describes the rows within *parent*.
**cols : {string}** - A CSS rule that describes the data cells within *rows*.

### Using document.querySelectorAll

This method allows CSS Rules to be used to apply the script to one or more nodes at the same time.

```javascript
useful.css.select({
	rule : '.sort',
	handler : useful.sort.start,
	data : {
		'headers' : 'thead tr th',
		'rows' : 'tbody tr',
		'cols' : 'th, td'
	}
});
```

**rule : {string}** - The CSS Rule for the intended target(s) of the script.
**handler : {function}** - The public function that starts the script.
**data : {object}** - Name-value pairs with configuration data.

### Using jQuery

This method is similar to the previous one, but uses jQuery for processing the CSS rule.

```javascript
$('.sort').each(function (index, element) {
	useful.sort.start(element, {
		'headers' : 'thead tr th',
		'rows' : 'tbody tr',
		'cols' : 'th, td'
	});
});
```

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
