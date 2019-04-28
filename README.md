# sort.js: Table Sorting

Sorting the contents of a table by clicking on the headers.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-sort">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/sort.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="lib/transitions.js"></script>
<script src="js/sort.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'lib/transitions.js',
	'js/sort.js'
], function(transitions, Sort) {
	...
});
```

Or import into an MVC framework.

```js
var transitions = require('lib/transitions.js');
var Sort = require('js/sort.js');
```

## How to start the script

```javascript
var sort = new Sort({
	'element' : document.getElementById('id'),
	'headers' : 'thead tr th',
	'rows' : 'tbody tr',
	'cols' : 'th, td'
});
```

**id : {string}** - The ID attribute of an element somewhere in the document.

**links : {string}** - A CSS rule that describes the clickable headers within *parent*.

**rows : {string}** - A CSS rule that describes the rows within *parent*.

**cols : {string}** - A CSS rule that describes the data cells within *rows*.

## How to control the script

### Perform

```javascript
sort.perform(index, direction);
```

Sorts a specific column.

**index : {integer}** - The index of column to sort.

**direction : {integer}** - A value of 1 or -1 to indicate the sorting direction.

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
