# sort.js: Table Sorting

*DEPRICATION WARNING: the functionality in this script has been superceeded / trivialised by updated web standards.*

Sorting the contents of a table by clicking on the headers.

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

Or use imported as a component in existing projects.

```js
@import {transitions = require('lib/transitions.js";
@import {Sort} from "js/sort.js";
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

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).
