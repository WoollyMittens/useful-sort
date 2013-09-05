# useful.sort.js: Table Sorting

Sorting the contents of a table by clicking on the headers.

Try the <a href="http://www.woollymittens.nl/useful/default.php?url=useful-sort">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/sort.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/sort.min.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
```

## How to start the script

```javascript
var sort = new useful.Sort( document.getElementById('id'), {
	'headers' : 'thead tr th',
	'rows' : 'tbody tr',
	'cols' : 'th, td'
});
sort.start();
```

**id : {string}** - The ID attribute of an element somewhere in the document.

**links : {string}** - A CSS rule that describes the clickable headers within *parent*.

**rows : {string}** - A CSS rule that describes the rows within *parent*.

**cols : {string}** - A CSS rule that describes the data cells within *rows*.

## How to control the script

### Focus

```javascript
sort.perform(index, direction);
```

Sorts a specific column.

**index : {integer}** - The index of column to sort.

**direction : {integer}** - A value of 1 or -1 to indicate the sorting direction.

## Prerequisites

To concatenate and minify the script yourself, the following prerequisites are required:
+ https://github.com/WoollyMittens/useful-transitions
+ https://github.com/WoollyMittens/useful-polyfills

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
