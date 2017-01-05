
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(x, y)
{
	var stack = [];
	var isEqual = eqHelp(x, y, 0, stack);
	var pair;
	while (isEqual && (pair = stack.pop()))
	{
		isEqual = eqHelp(pair.x, pair.y, 0, stack);
	}
	return isEqual;
}


function eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push({ x: x, y: y });
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object')
	{
		if (typeof x === 'function')
		{
			throw new Error(
				'Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.'
				+ ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#=='
				+ ' which describes why it is this way and what the better version will look like.'
			);
		}
		return false;
	}

	if (x === null || y === null)
	{
		return false
	}

	if (x instanceof Date)
	{
		return x.getTime() === y.getTime();
	}

	if (!('ctor' in x))
	{
		for (var key in x)
		{
			if (!eqHelp(x[key], y[key], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	// convert Dicts and Sets to lists
	if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin')
	{
		x = _elm_lang$core$Dict$toList(x);
		y = _elm_lang$core$Dict$toList(y);
	}
	if (x.ctor === 'Set_elm_builtin')
	{
		x = _elm_lang$core$Set$toList(x);
		y = _elm_lang$core$Set$toList(y);
	}

	// check if lists are equal without recursion
	if (x.ctor === '::')
	{
		var a = x;
		var b = y;
		while (a.ctor === '::' && b.ctor === '::')
		{
			if (!eqHelp(a._0, b._0, depth + 1, stack))
			{
				return false;
			}
			a = a._1;
			b = b._1;
		}
		return a.ctor === b.ctor;
	}

	// check if Arrays are equal
	if (x.ctor === '_Array')
	{
		var xs = _elm_lang$core$Native_Array.toJSArray(x);
		var ys = _elm_lang$core$Native_Array.toJSArray(y);
		if (xs.length !== ys.length)
		{
			return false;
		}
		for (var i = 0; i < xs.length; i++)
		{
			if (!eqHelp(xs[i], ys[i], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	if (!eqHelp(x.ctor, y.ctor, depth + 1, stack))
	{
		return false;
	}

	for (var key in x)
	{
		if (!eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}

	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? EQ : a < b ? LT : GT;
	}

	if (x.ctor === '::' || x.ctor === '[]')
	{
		while (x.ctor === '::' && y.ctor === '::')
		{
			var ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
		return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
	}

	if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var ord;
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}

	throw new Error(
		'Comparison error: comparison is only defined on ints, '
		+ 'floats, times, chars, strings, lists of comparable values, '
		+ 'and tuples of comparable values.'
	);
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		var name = v.func ? v.func.name : v.name;
		return '<function' + (name === '' ? '' : ':') + name + '>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'Set_elm_builtin')
		{
			return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin')
		{
			return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		if (v instanceof Date)
		{
			return '<' + v.toString() + '>';
		}

		if (v.elm_web_socket)
		{
			return '<websocket>';
		}

		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t')
			  .replace(/\r/g, '\\r')
			  .replace(/\v/g, '\\v')
			  .replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$never = function (_p0) {
	never:
	while (true) {
		var _p1 = _p0;
		var _v1 = _p1._0;
		_p0 = _v1;
		continue never;
	}
};
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$always = F2(
	function (a, _p4) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$JustOneMore = function (a) {
	return {ctor: 'JustOneMore', _0: a};
};

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p3 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p3.ctor === '_Tuple2') && (_p3._0.ctor === 'Just')) && (_p3._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p4 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p4.ctor === '_Tuple3') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === 'Just')) && (_p4._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p5 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p5.ctor === '_Tuple4') && (_p5._0.ctor === 'Just')) && (_p5._1.ctor === 'Just')) && (_p5._2.ctor === 'Just')) && (_p5._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p6 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p6.ctor === '_Tuple5') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) && (_p6._2.ctor === 'Just')) && (_p6._3.ctor === 'Just')) && (_p6._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			_elm_lang$core$List$any,
			function (_p2) {
				return !isOkay(_p2);
			},
			list);
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return {
						ctor: '::',
						_0: f(x),
						_1: acc
					};
				}),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (front, back) {
				return pred(front) ? {ctor: '::', _0: front, _1: back} : back;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return {ctor: '::', _0: _p10._0, _1: xs};
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			}),
		{ctor: '[]'},
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, x, _p11._0),
						_1: accAcc
					};
				} else {
					return {ctor: '[]'};
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				{
					ctor: '::',
					_0: b,
					_1: {ctor: '[]'}
				},
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		{ctor: '[]'},
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: {ctor: '::', _0: x, _1: _p16},
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: {ctor: '::', _0: x, _1: _p15}
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: {ctor: '[]'},
				_1: {ctor: '[]'}
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: _p19._0, _1: _p20._0},
				_1: {ctor: '::', _0: _p19._1, _1: _p20._1}
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var step = F2(
				function (x, rest) {
					return {
						ctor: '::',
						_0: sep,
						_1: {ctor: '::', _0: x, _1: rest}
					};
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				{ctor: '[]'},
				_p21._1);
			return {ctor: '::', _0: _p21._0, _1: spersed};
		}
	});
var _elm_lang$core$List$takeReverse = F3(
	function (n, list, taken) {
		takeReverse:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
						_v24 = _p22._1,
						_v25 = {ctor: '::', _0: _p22._0, _1: taken};
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
var _elm_lang$core$List$takeTailRec = F2(
	function (n, list) {
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$takeReverse,
				n,
				list,
				{ctor: '[]'}));
	});
var _elm_lang$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return {ctor: '[]'};
		} else {
			var _p23 = {ctor: '_Tuple2', _0: n, _1: list};
			_v26_5:
			do {
				_v26_1:
				do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: {ctor: '[]'}
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: {ctor: '[]'}
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if ((_p23._1._1._1.ctor === '::') && (_p23._1._1._1._1.ctor === '::')) {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return (_elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0) ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while(false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: {ctor: '[]'}
				};
			} while(false);
			return list;
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = {ctor: '::', _0: value, _1: result},
					_v28 = n - 1,
					_v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			{ctor: '[]'},
			n,
			value);
	});
var _elm_lang$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
					_v31 = hi - 1,
					_v32 = {ctor: '::', _0: hi, _1: list};
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var _elm_lang$core$List$range = F2(
	function (lo, hi) {
		return A3(
			_elm_lang$core$List$rangeHelp,
			lo,
			hi,
			{ctor: '[]'});
	});
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			A2(
				_elm_lang$core$List$range,
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});

var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		A2(
			_elm_lang$core$List$range,
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;
	
	if (subLen < 1)
	{
		return _elm_lang$core$Native_List.Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}	
	
	return _elm_lang$core$Native_List.fromArray(is);
}

function toInt(s)
{
	var len = s.length;
	if (len === 0)
	{
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
	}
	var start = 0;
	if (s[0] === '-')
	{
		if (len === 1)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
		}
		start = 1;
	}
	for (var i = start; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
		}
	}
	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function toFloat(s)
{
	var len = s.length;
	if (len === 0)
	{
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
	}
	var start = 0;
	if (s[0] === '-')
	{
		if (len === 1)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
		}
		start = 1;
	}
	var dotCount = 0;
	for (var i = start; i < len; ++i)
	{
		var c = s[i];
		if ('0' <= c && c <= '9')
		{
			continue;
		}
		if (c === '.')
		{
			dotCount += 1;
			if (dotCount <= 1)
			{
				continue;
			}
		}
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
	}
	return _elm_lang$core$Result$Ok(parseFloat(s));
}

function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$mapError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return {ctor: '::', _0: key, _1: keyList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return {ctor: '::', _0: value, _1: valueList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: key, _1: value},
					_1: list
				};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				stepState:
				while (true) {
					var _p3 = _p2;
					var _p9 = _p3._1;
					var _p8 = _p3._0;
					var _p4 = _p8;
					if (_p4.ctor === '[]') {
						return {
							ctor: '_Tuple2',
							_0: _p8,
							_1: A3(rightStep, rKey, rValue, _p9)
						};
					} else {
						var _p7 = _p4._1;
						var _p6 = _p4._0._1;
						var _p5 = _p4._0._0;
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
							var _v10 = rKey,
								_v11 = rValue,
								_v12 = {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A3(leftStep, _p5, _p6, _p9)
							};
							rKey = _v10;
							rValue = _v11;
							_p2 = _v12;
							continue stepState;
						} else {
							if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
								return {
									ctor: '_Tuple2',
									_0: _p8,
									_1: A3(rightStep, rKey, rValue, _p9)
								};
							} else {
								return {
									ctor: '_Tuple2',
									_0: _p7,
									_1: A4(bothStep, _p5, _p6, rValue, _p9)
								};
							}
						}
					}
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				{
					ctor: '::',
					_0: 'Internal red-black tree invariant violated, expected ',
					_1: {
						ctor: '::',
						_0: msg,
						_1: {
							ctor: '::',
							_0: ' and got ',
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Basics$toString(c),
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: lgot,
										_1: {
											ctor: '::',
											_0: '/',
											_1: {
												ctor: '::',
												_0: rgot,
												_1: {
													ctor: '::',
													_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v14_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v14_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v14_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
							_v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
							_v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v26 = _p18._1,
					_v27 = _p18._2,
					_v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v36_6:
	do {
		_v36_5:
		do {
			_v36_4:
			do {
				_v36_3:
				do {
					_v36_2:
					do {
						_v36_1:
						do {
							_v36_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v36_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v36_3;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v36_4;
																	} else {
																		break _v36_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	break _v36_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v36_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															} else {
																break _v36_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v36_5;
															} else {
																break _v36_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	break _v36_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v36_4;
															} else {
																break _v36_6;
															}
														default:
															break _v36_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v36_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v36_1;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v36_5;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v36_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v36_3;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v36_4;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										} else {
											break _v36_6;
										}
									}
								} else {
									break _v36_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (color, left, right) {
		var _p29 = {ctor: '_Tuple2', _0: left, _1: right};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						color,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						color,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeIndex(index, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'index',
		index: index,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function mapMany(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function andThen(callback, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function map1(f, d1)
{
	return mapMany(f, [d1]);
}

function map2(f, d1, d2)
{
	return mapMany(f, [d1, d2]);
}

function map3(f, d1, d2, d3)
{
	return mapMany(f, [d1, d2, d3]);
}

function map4(f, d1, d2, d3, d4)
{
	return mapMany(f, [d1, d2, d3, d4]);
}

function map5(f, d1, d2, d3, d4, d5)
{
	return mapMany(f, [d1, d2, d3, d4, d5]);
}

function map6(f, d1, d2, d3, d4, d5, d6)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6]);
}

function map7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function map8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok') ? result : badField(field, result);

		case 'index':
			var index = decoder.index;
			if (!(value instanceof Array))
			{
				return badPrimitive('an array', value);
			}
			if (index >= value.length)
			{
				return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
			}

			var result = runHelp(decoder.decoder, value[index]);
			return (result.tag === 'ok') ? result : badIndex(index, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'index':
			return a.index === b.index && equality(a.decoder, b.decoder);

		case 'map-many':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),
	decodeIndex: F2(decodeIndex),

	map1: F2(map1),
	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	map6: F7(map6),
	map7: F8(map7),
	map8: F9(map8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	andThen: F2(andThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$lazy = function (thunk) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		thunk,
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$nullable = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		{
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: {ctor: '[]'}
			}
		});
};
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

var _elm_lang$virtual_dom$Native_VirtualDom = function() {

var STYLE_KEY = 'STYLE';
var EVENT_KEY = 'EVENT';
var ATTR_KEY = 'ATTR';
var ATTR_NS_KEY = 'ATTR_NS';

var localDoc = typeof document !== 'undefined' ? document : {};


////////////  VIRTUAL DOM NODES  ////////////


function text(string)
{
	return {
		type: 'text',
		text: string
	};
}


function node(tag)
{
	return F2(function(factList, kidList) {
		return nodeHelp(tag, factList, kidList);
	});
}


function nodeHelp(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function keyedNode(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid._1.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'keyed-node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function custom(factList, model, impl)
{
	var facts = organizeFacts(factList).facts;

	return {
		type: 'custom',
		facts: facts,
		model: model,
		impl: impl
	};
}


function map(tagger, node)
{
	return {
		type: 'tagger',
		tagger: tagger,
		node: node,
		descendantsCount: 1 + (node.descendantsCount || 0)
	};
}


function thunk(func, args, thunk)
{
	return {
		type: 'thunk',
		func: func,
		args: args,
		thunk: thunk,
		node: undefined
	};
}

function lazy(fn, a)
{
	return thunk(fn, [a], function() {
		return fn(a);
	});
}

function lazy2(fn, a, b)
{
	return thunk(fn, [a,b], function() {
		return A2(fn, a, b);
	});
}

function lazy3(fn, a, b, c)
{
	return thunk(fn, [a,b,c], function() {
		return A3(fn, a, b, c);
	});
}



// FACTS


function organizeFacts(factList)
{
	var namespace, facts = {};

	while (factList.ctor !== '[]')
	{
		var entry = factList._0;
		var key = entry.key;

		if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY)
		{
			var subFacts = facts[key] || {};
			subFacts[entry.realKey] = entry.value;
			facts[key] = subFacts;
		}
		else if (key === STYLE_KEY)
		{
			var styles = facts[key] || {};
			var styleList = entry.value;
			while (styleList.ctor !== '[]')
			{
				var style = styleList._0;
				styles[style._0] = style._1;
				styleList = styleList._1;
			}
			facts[key] = styles;
		}
		else if (key === 'namespace')
		{
			namespace = entry.value;
		}
		else if (key === 'className')
		{
			var classes = facts[key];
			facts[key] = typeof classes === 'undefined'
				? entry.value
				: classes + ' ' + entry.value;
		}
 		else
		{
			facts[key] = entry.value;
		}
		factList = factList._1;
	}

	return {
		facts: facts,
		namespace: namespace
	};
}



////////////  PROPERTIES AND ATTRIBUTES  ////////////


function style(value)
{
	return {
		key: STYLE_KEY,
		value: value
	};
}


function property(key, value)
{
	return {
		key: key,
		value: value
	};
}


function attribute(key, value)
{
	return {
		key: ATTR_KEY,
		realKey: key,
		value: value
	};
}


function attributeNS(namespace, key, value)
{
	return {
		key: ATTR_NS_KEY,
		realKey: key,
		value: {
			value: value,
			namespace: namespace
		}
	};
}


function on(name, options, decoder)
{
	return {
		key: EVENT_KEY,
		realKey: name,
		value: {
			options: options,
			decoder: decoder
		}
	};
}


function equalEvents(a, b)
{
	if (!a.options === b.options)
	{
		if (a.stopPropagation !== b.stopPropagation || a.preventDefault !== b.preventDefault)
		{
			return false;
		}
	}
	return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
}


function mapProperty(func, property)
{
	if (property.key !== EVENT_KEY)
	{
		return property;
	}
	return on(
		property.realKey,
		property.value.options,
		A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder)
	);
}


////////////  RENDER  ////////////


function render(vNode, eventNode)
{
	switch (vNode.type)
	{
		case 'thunk':
			if (!vNode.node)
			{
				vNode.node = vNode.thunk();
			}
			return render(vNode.node, eventNode);

		case 'tagger':
			var subNode = vNode.node;
			var tagger = vNode.tagger;

			while (subNode.type === 'tagger')
			{
				typeof tagger !== 'object'
					? tagger = [tagger, subNode.tagger]
					: tagger.push(subNode.tagger);

				subNode = subNode.node;
			}

			var subEventRoot = { tagger: tagger, parent: eventNode };
			var domNode = render(subNode, subEventRoot);
			domNode.elm_event_node_ref = subEventRoot;
			return domNode;

		case 'text':
			return localDoc.createTextNode(vNode.text);

		case 'node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i], eventNode));
			}

			return domNode;

		case 'keyed-node':
			var domNode = vNode.namespace
				? localDoc.createElementNS(vNode.namespace, vNode.tag)
				: localDoc.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i]._1, eventNode));
			}

			return domNode;

		case 'custom':
			var domNode = vNode.impl.render(vNode.model);
			applyFacts(domNode, eventNode, vNode.facts);
			return domNode;
	}
}



////////////  APPLY FACTS  ////////////


function applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		switch (key)
		{
			case STYLE_KEY:
				applyStyles(domNode, value);
				break;

			case EVENT_KEY:
				applyEvents(domNode, eventNode, value);
				break;

			case ATTR_KEY:
				applyAttrs(domNode, value);
				break;

			case ATTR_NS_KEY:
				applyAttrsNS(domNode, value);
				break;

			case 'value':
				if (domNode[key] !== value)
				{
					domNode[key] = value;
				}
				break;

			default:
				domNode[key] = value;
				break;
		}
	}
}

function applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}

function applyEvents(domNode, eventNode, events)
{
	var allHandlers = domNode.elm_handlers || {};

	for (var key in events)
	{
		var handler = allHandlers[key];
		var value = events[key];

		if (typeof value === 'undefined')
		{
			domNode.removeEventListener(key, handler);
			allHandlers[key] = undefined;
		}
		else if (typeof handler === 'undefined')
		{
			var handler = makeEventHandler(eventNode, value);
			domNode.addEventListener(key, handler);
			allHandlers[key] = handler;
		}
		else
		{
			handler.info = value;
		}
	}

	domNode.elm_handlers = allHandlers;
}

function makeEventHandler(eventNode, info)
{
	function eventHandler(event)
	{
		var info = eventHandler.info;

		var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

		if (value.ctor === 'Ok')
		{
			var options = info.options;
			if (options.stopPropagation)
			{
				event.stopPropagation();
			}
			if (options.preventDefault)
			{
				event.preventDefault();
			}

			var message = value._0;

			var currentEventNode = eventNode;
			while (currentEventNode)
			{
				var tagger = currentEventNode.tagger;
				if (typeof tagger === 'function')
				{
					message = tagger(message);
				}
				else
				{
					for (var i = tagger.length; i--; )
					{
						message = tagger[i](message);
					}
				}
				currentEventNode = currentEventNode.parent;
			}
		}
	};

	eventHandler.info = info;

	return eventHandler;
}

function applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		if (typeof value === 'undefined')
		{
			domNode.removeAttribute(key);
		}
		else
		{
			domNode.setAttribute(key, value);
		}
	}
}

function applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.namespace;
		var value = pair.value;

		if (typeof value === 'undefined')
		{
			domNode.removeAttributeNS(namespace, key);
		}
		else
		{
			domNode.setAttributeNS(namespace, key, value);
		}
	}
}



////////////  DIFF  ////////////


function diff(a, b)
{
	var patches = [];
	diffHelp(a, b, patches, 0);
	return patches;
}


function makePatch(type, index, data)
{
	return {
		index: index,
		type: type,
		data: data,
		domNode: undefined,
		eventNode: undefined
	};
}


function diffHelp(a, b, patches, index)
{
	if (a === b)
	{
		return;
	}

	var aType = a.type;
	var bType = b.type;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (aType !== bType)
	{
		patches.push(makePatch('p-redraw', index, b));
		return;
	}

	// Now we know that both nodes are the same type.
	switch (bType)
	{
		case 'thunk':
			var aArgs = a.args;
			var bArgs = b.args;
			var i = aArgs.length;
			var same = a.func === b.func && i === bArgs.length;
			while (same && i--)
			{
				same = aArgs[i] === bArgs[i];
			}
			if (same)
			{
				b.node = a.node;
				return;
			}
			b.node = b.thunk();
			var subPatches = [];
			diffHelp(a.node, b.node, subPatches, 0);
			if (subPatches.length > 0)
			{
				patches.push(makePatch('p-thunk', index, subPatches));
			}
			return;

		case 'tagger':
			// gather nested taggers
			var aTaggers = a.tagger;
			var bTaggers = b.tagger;
			var nesting = false;

			var aSubNode = a.node;
			while (aSubNode.type === 'tagger')
			{
				nesting = true;

				typeof aTaggers !== 'object'
					? aTaggers = [aTaggers, aSubNode.tagger]
					: aTaggers.push(aSubNode.tagger);

				aSubNode = aSubNode.node;
			}

			var bSubNode = b.node;
			while (bSubNode.type === 'tagger')
			{
				nesting = true;

				typeof bTaggers !== 'object'
					? bTaggers = [bTaggers, bSubNode.tagger]
					: bTaggers.push(bSubNode.tagger);

				bSubNode = bSubNode.node;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && aTaggers.length !== bTaggers.length)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers)
			{
				patches.push(makePatch('p-tagger', index, bTaggers));
			}

			// diff everything below the taggers
			diffHelp(aSubNode, bSubNode, patches, index + 1);
			return;

		case 'text':
			if (a.text !== b.text)
			{
				patches.push(makePatch('p-text', index, b.text));
				return;
			}

			return;

		case 'node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffChildren(a, b, patches, index);
			return;

		case 'keyed-node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffKeyedChildren(a, b, patches, index);
			return;

		case 'custom':
			if (a.impl !== b.impl)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);
			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			var patch = b.impl.diff(a,b);
			if (patch)
			{
				patches.push(makePatch('p-custom', index, patch));
				return;
			}

			return;
	}
}


// assumes the incoming arrays are the same length
function pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function diffFacts(a, b, category)
{
	var diff;

	// look for changes and removals
	for (var aKey in a)
	{
		if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY)
		{
			var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[aKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(aKey in b))
		{
			diff = diff || {};
			diff[aKey] =
				(typeof category === 'undefined')
					? (typeof a[aKey] === 'string' ? '' : null)
					:
				(category === STYLE_KEY)
					? ''
					:
				(category === EVENT_KEY || category === ATTR_KEY)
					? undefined
					:
				{ namespace: a[aKey].namespace, value: undefined };

			continue;
		}

		var aValue = a[aKey];
		var bValue = b[aKey];

		// reference equal, so don't worry about it
		if (aValue === bValue && aKey !== 'value'
			|| category === EVENT_KEY && equalEvents(aValue, bValue))
		{
			continue;
		}

		diff = diff || {};
		diff[aKey] = bValue;
	}

	// add new stuff
	for (var bKey in b)
	{
		if (!(bKey in a))
		{
			diff = diff || {};
			diff[bKey] = b[bKey];
		}
	}

	return diff;
}


function diffChildren(aParent, bParent, patches, rootIndex)
{
	var aChildren = aParent.children;
	var bChildren = bParent.children;

	var aLen = aChildren.length;
	var bLen = bChildren.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (aLen > bLen)
	{
		patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
	}
	else if (aLen < bLen)
	{
		patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	var index = rootIndex;
	var minLen = aLen < bLen ? aLen : bLen;
	for (var i = 0; i < minLen; i++)
	{
		index++;
		var aChild = aChildren[i];
		diffHelp(aChild, bChildren[i], patches, index);
		index += aChild.descendantsCount || 0;
	}
}



////////////  KEYED DIFF  ////////////


function diffKeyedChildren(aParent, bParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var aChildren = aParent.children;
	var bChildren = bParent.children;
	var aLen = aChildren.length;
	var bLen = bChildren.length;
	var aIndex = 0;
	var bIndex = 0;

	var index = rootIndex;

	while (aIndex < aLen && bIndex < bLen)
	{
		var a = aChildren[aIndex];
		var b = bChildren[bIndex];

		var aKey = a._0;
		var bKey = b._0;
		var aNode = a._1;
		var bNode = b._1;

		// check if keys match

		if (aKey === bKey)
		{
			index++;
			diffHelp(aNode, bNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex++;
			bIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var aLookAhead = aIndex + 1 < aLen;
		var bLookAhead = bIndex + 1 < bLen;

		if (aLookAhead)
		{
			var aNext = aChildren[aIndex + 1];
			var aNextKey = aNext._0;
			var aNextNode = aNext._1;
			var oldMatch = bKey === aNextKey;
		}

		if (bLookAhead)
		{
			var bNext = bChildren[bIndex + 1];
			var bNextKey = bNext._0;
			var bNextNode = bNext._1;
			var newMatch = aKey === bNextKey;
		}


		// swap a and b
		if (aLookAhead && bLookAhead && newMatch && oldMatch)
		{
			index++;
			diffHelp(aNode, bNextNode, localPatches, index);
			insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			removeNode(changes, localPatches, aKey, aNextNode, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		// insert b
		if (bLookAhead && newMatch)
		{
			index++;
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			diffHelp(aNode, bNextNode, localPatches, index);
			index += aNode.descendantsCount || 0;

			aIndex += 1;
			bIndex += 2;
			continue;
		}

		// remove a
		if (aLookAhead && oldMatch)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 1;
			continue;
		}

		// remove a, insert b
		if (aLookAhead && bLookAhead && aNextKey === bNextKey)
		{
			index++;
			removeNode(changes, localPatches, aKey, aNode, index);
			insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
			index += aNode.descendantsCount || 0;

			index++;
			diffHelp(aNextNode, bNextNode, localPatches, index);
			index += aNextNode.descendantsCount || 0;

			aIndex += 2;
			bIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (aIndex < aLen)
	{
		index++;
		var a = aChildren[aIndex];
		var aNode = a._1;
		removeNode(changes, localPatches, a._0, aNode, index);
		index += aNode.descendantsCount || 0;
		aIndex++;
	}

	var endInserts;
	while (bIndex < bLen)
	{
		endInserts = endInserts || [];
		var b = bChildren[bIndex];
		insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
		bIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined')
	{
		patches.push(makePatch('p-reorder', rootIndex, {
			patches: localPatches,
			inserts: inserts,
			endInserts: endInserts
		}));
	}
}



////////////  CHANGES FROM KEYED DIFF  ////////////


var POSTFIX = '_elmW6BL';


function insertNode(changes, localPatches, key, vnode, bIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		entry = {
			tag: 'insert',
			vnode: vnode,
			index: bIndex,
			data: undefined
		};

		inserts.push({ index: bIndex, entry: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.tag === 'remove')
	{
		inserts.push({ index: bIndex, entry: entry });

		entry.tag = 'move';
		var subPatches = [];
		diffHelp(entry.vnode, vnode, subPatches, entry.index);
		entry.index = bIndex;
		entry.data.data = {
			patches: subPatches,
			entry: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
}


function removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (typeof entry === 'undefined')
	{
		var patch = makePatch('p-remove', index, undefined);
		localPatches.push(patch);

		changes[key] = {
			tag: 'remove',
			vnode: vnode,
			index: index,
			data: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.tag === 'insert')
	{
		entry.tag = 'move';
		var subPatches = [];
		diffHelp(vnode, entry.vnode, subPatches, index);

		var patch = makePatch('p-remove', index, {
			patches: subPatches,
			entry: entry
		});
		localPatches.push(patch);

		return;
	}

	// this key has already been removed or moved, a duplicate!
	removeNode(changes, localPatches, key + POSTFIX, vnode, index);
}



////////////  ADD DOM NODES  ////////////
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function addDomNodes(domNode, vNode, patches, eventNode)
{
	addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.index;

	while (index === low)
	{
		var patchType = patch.type;

		if (patchType === 'p-thunk')
		{
			addDomNodes(domNode, vNode.node, patch.data, eventNode);
		}
		else if (patchType === 'p-reorder')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var subPatches = patch.data.patches;
			if (subPatches.length > 0)
			{
				addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 'p-remove')
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;

			var data = patch.data;
			if (typeof data !== 'undefined')
			{
				data.entry.data = domNode;
				var subPatches = data.patches;
				if (subPatches.length > 0)
				{
					addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.index) > high)
		{
			return i;
		}
	}

	switch (vNode.type)
	{
		case 'tagger':
			var subNode = vNode.node;

			while (subNode.type === "tagger")
			{
				subNode = subNode.node;
			}

			return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

		case 'node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j];
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'keyed-node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j]._1;
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'text':
		case 'thunk':
			throw new Error('should never traverse `text` or `thunk` nodes like this');
	}
}



////////////  APPLY PATCHES  ////////////


function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return applyPatchesHelp(rootDomNode, patches);
}

function applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.domNode
		var newNode = applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function applyPatch(domNode, patch)
{
	switch (patch.type)
	{
		case 'p-redraw':
			return applyPatchRedraw(domNode, patch.data, patch.eventNode);

		case 'p-facts':
			applyFacts(domNode, patch.eventNode, patch.data);
			return domNode;

		case 'p-text':
			domNode.replaceData(0, domNode.length, patch.data);
			return domNode;

		case 'p-thunk':
			return applyPatchesHelp(domNode, patch.data);

		case 'p-tagger':
			if (typeof domNode.elm_event_node_ref !== 'undefined')
			{
				domNode.elm_event_node_ref.tagger = patch.data;
			}
			else
			{
				domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
			}
			return domNode;

		case 'p-remove-last':
			var i = patch.data;
			while (i--)
			{
				domNode.removeChild(domNode.lastChild);
			}
			return domNode;

		case 'p-append':
			var newNodes = patch.data;
			for (var i = 0; i < newNodes.length; i++)
			{
				domNode.appendChild(render(newNodes[i], patch.eventNode));
			}
			return domNode;

		case 'p-remove':
			var data = patch.data;
			if (typeof data === 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.entry;
			if (typeof entry.index !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.data = applyPatchesHelp(domNode, data.patches);
			return domNode;

		case 'p-reorder':
			return applyPatchReorder(domNode, patch);

		case 'p-custom':
			var impl = patch.data;
			return impl.applyPatch(domNode, impl.data);

		default:
			throw new Error('Ran into an unknown patch!');
	}
}


function applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = render(vNode, eventNode);

	if (typeof newNode.elm_event_node_ref === 'undefined')
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function applyPatchReorder(domNode, patch)
{
	var data = patch.data;

	// remove end inserts
	var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

	// removals
	domNode = applyPatchesHelp(domNode, data.patches);

	// inserts
	var inserts = data.inserts;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.entry;
		var node = entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode);
		domNode.insertBefore(node, domNode.childNodes[insert.index]);
	}

	// add end inserts
	if (typeof frag !== 'undefined')
	{
		domNode.appendChild(frag);
	}

	return domNode;
}


function applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (typeof endInserts === 'undefined')
	{
		return;
	}

	var frag = localDoc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.entry;
		frag.appendChild(entry.tag === 'move'
			? entry.data
			: render(entry.vnode, patch.eventNode)
		);
	}
	return frag;
}


// PROGRAMS

var program = makeProgram(checkNoFlags);
var programWithFlags = makeProgram(checkYesFlags);

function makeProgram(flagChecker)
{
	return F2(function(debugWrap, impl)
	{
		return function(flagDecoder)
		{
			return function(object, moduleName, debugMetadata)
			{
				var checker = flagChecker(flagDecoder, moduleName);
				if (typeof debugMetadata === 'undefined')
				{
					normalSetup(impl, object, moduleName, checker);
				}
				else
				{
					debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
				}
			};
		};
	});
}

function staticProgram(vNode)
{
	var nothing = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		_elm_lang$core$Platform_Cmd$none
	);
	return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
		init: nothing,
		view: function() { return vNode; },
		update: F2(function() { return nothing; }),
		subscriptions: function() { return _elm_lang$core$Platform_Sub$none; }
	})();
}


// FLAG CHECKERS

function checkNoFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flags === 'undefined')
		{
			return init;
		}

		var errorMessage =
			'The `' + moduleName + '` module does not need flags.\n'
			+ 'Initialize it with no arguments and you should be all set!';

		crash(errorMessage, domNode);
	};
}

function checkYesFlags(flagDecoder, moduleName)
{
	return function(init, flags, domNode)
	{
		if (typeof flagDecoder === 'undefined')
		{
			var errorMessage =
				'Are you trying to sneak a Never value into Elm? Trickster!\n'
				+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
				+ 'Use `program` instead if you do not want flags.'

			crash(errorMessage, domNode);
		}

		var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
		if (result.ctor === 'Ok')
		{
			return init(result._0);
		}

		var errorMessage =
			'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n'
			+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
			+ result._0;

		crash(errorMessage, domNode);
	};
}

function crash(errorMessage, domNode)
{
	if (domNode)
	{
		domNode.innerHTML =
			'<div style="padding-left:1em;">'
			+ '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>'
			+ '<pre style="padding-left:1em;">' + errorMessage + '</pre>'
			+ '</div>';
	}

	throw new Error(errorMessage);
}


//  NORMAL SETUP

function normalSetup(impl, object, moduleName, flagChecker)
{
	object['embed'] = function embed(node, flags)
	{
		while (node.lastChild)
		{
			node.removeChild(node.lastChild);
		}

		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update,
			impl.subscriptions,
			normalRenderer(node, impl.view)
		);
	};

	object['fullscreen'] = function fullscreen(flags)
	{
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update,
			impl.subscriptions,
			normalRenderer(document.body, impl.view)
		);
	};
}

function normalRenderer(parentNode, view)
{
	return function(tagger, initialModel)
	{
		var eventNode = { tagger: tagger, parent: undefined };
		var initialVirtualNode = view(initialModel);
		var domNode = render(initialVirtualNode, eventNode);
		parentNode.appendChild(domNode);
		return makeStepper(domNode, view, initialVirtualNode, eventNode);
	};
}


// STEPPER

var rAF =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { callback(); };

function makeStepper(domNode, view, initialVirtualNode, eventNode)
{
	var state = 'NO_REQUEST';
	var currNode = initialVirtualNode;
	var nextModel;

	function updateIfNeeded()
	{
		switch (state)
		{
			case 'NO_REQUEST':
				throw new Error(
					'Unexpected draw callback.\n' +
					'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.'
				);

			case 'PENDING_REQUEST':
				rAF(updateIfNeeded);
				state = 'EXTRA_REQUEST';

				var nextNode = view(nextModel);
				var patches = diff(currNode, nextNode);
				domNode = applyPatches(domNode, currNode, patches, eventNode);
				currNode = nextNode;

				return;

			case 'EXTRA_REQUEST':
				state = 'NO_REQUEST';
				return;
		}
	}

	return function stepper(model)
	{
		if (state === 'NO_REQUEST')
		{
			rAF(updateIfNeeded);
		}
		state = 'PENDING_REQUEST';
		nextModel = model;
	};
}


// DEBUG SETUP

function debugSetup(impl, object, moduleName, flagChecker)
{
	object['fullscreen'] = function fullscreen(flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, document.body),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};

	object['embed'] = function fullscreen(node, flags)
	{
		var popoutRef = { doc: undefined };
		return _elm_lang$core$Native_Platform.initialize(
			flagChecker(impl.init, flags, node),
			impl.update(scrollTask(popoutRef)),
			impl.subscriptions,
			debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut)
		);
	};
}

function scrollTask(popoutRef)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var doc = popoutRef.doc;
		if (doc)
		{
			var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
			if (msgs)
			{
				msgs.scrollTop = msgs.scrollHeight;
			}
		}
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}


function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut)
{
	return function(tagger, initialModel)
	{
		var appEventNode = { tagger: tagger, parent: undefined };
		var eventNode = { tagger: tagger, parent: undefined };

		// make normal stepper
		var appVirtualNode = view(initialModel);
		var appNode = render(appVirtualNode, appEventNode);
		parentNode.appendChild(appNode);
		var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

		// make overlay stepper
		var overVirtualNode = viewIn(initialModel)._1;
		var overNode = render(overVirtualNode, eventNode);
		parentNode.appendChild(overNode);
		var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
		var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

		// make debugger stepper
		var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

		return function stepper(model)
		{
			appStepper(model);
			overStepper(model);
			debugStepper(model);
		}
	};
}

function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef)
{
	var curr;
	var domNode;

	return function stepper(model)
	{
		if (!model.isDebuggerOpen)
		{
			return;
		}

		if (!popoutRef.doc)
		{
			curr = view(model);
			domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
			return;
		}

		// switch to document of popout
		localDoc = popoutRef.doc;

		var next = view(model);
		var patches = diff(curr, next);
		domNode = applyPatches(domNode, curr, patches, eventNode);
		curr = next;

		// switch back to normal document
		localDoc = document;
	};
}

function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode)
{
	var w = 900;
	var h = 360;
	var x = screen.width - w;
	var y = screen.height - h;
	var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

	// switch to window document
	localDoc = debugWindow.document;

	popoutRef.doc = localDoc;
	localDoc.title = 'Debugger - ' + moduleName;
	localDoc.body.style.margin = '0';
	localDoc.body.style.padding = '0';
	var domNode = render(virtualNode, eventNode);
	localDoc.body.appendChild(domNode);

	localDoc.addEventListener('keydown', function(event) {
		if (event.metaKey && event.which === 82)
		{
			window.location.reload();
		}
		if (event.which === 38)
		{
			eventNode.tagger({ ctor: 'Up' });
			event.preventDefault();
		}
		if (event.which === 40)
		{
			eventNode.tagger({ ctor: 'Down' });
			event.preventDefault();
		}
	});

	function close()
	{
		popoutRef.doc = undefined;
		debugWindow.close();
	}
	window.addEventListener('unload', close);
	debugWindow.addEventListener('unload', function() {
		popoutRef.doc = undefined;
		window.removeEventListener('unload', close);
		eventNode.tagger({ ctor: 'Close' });
	});

	// switch back to the normal document
	localDoc = document;

	return domNode;
}


// BLOCK EVENTS

function wrapViewIn(appEventNode, overlayNode, viewIn)
{
	var ignorer = makeIgnorer(overlayNode);
	var blocking = 'Normal';
	var overflow;

	var normalTagger = appEventNode.tagger;
	var blockTagger = function() {};

	return function(model)
	{
		var tuple = viewIn(model);
		var newBlocking = tuple._0.ctor;
		appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
		if (blocking !== newBlocking)
		{
			traverse('removeEventListener', ignorer, blocking);
			traverse('addEventListener', ignorer, newBlocking);

			if (blocking === 'Normal')
			{
				overflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			}

			if (newBlocking === 'Normal')
			{
				document.body.style.overflow = overflow;
			}

			blocking = newBlocking;
		}
		return tuple._1;
	}
}

function traverse(verbEventListener, ignorer, blocking)
{
	switch(blocking)
	{
		case 'Normal':
			return;

		case 'Pause':
			return traverseHelp(verbEventListener, ignorer, mostEvents);

		case 'Message':
			return traverseHelp(verbEventListener, ignorer, allEvents);
	}
}

function traverseHelp(verbEventListener, handler, eventNames)
{
	for (var i = 0; i < eventNames.length; i++)
	{
		document.body[verbEventListener](eventNames[i], handler, true);
	}
}

function makeIgnorer(overlayNode)
{
	return function(event)
	{
		if (event.type === 'keydown' && event.metaKey && event.which === 82)
		{
			return;
		}

		var isScroll = event.type === 'scroll' || event.type === 'wheel';

		var node = event.target;
		while (node !== null)
		{
			if (node.className === 'elm-overlay-message-details' && isScroll)
			{
				return;
			}

			if (node === overlayNode && !isScroll)
			{
				return;
			}
			node = node.parentNode;
		}

		event.stopPropagation();
		event.preventDefault();
	}
}

var mostEvents = [
	'click', 'dblclick', 'mousemove',
	'mouseup', 'mousedown', 'mouseenter', 'mouseleave',
	'touchstart', 'touchend', 'touchcancel', 'touchmove',
	'pointerdown', 'pointerup', 'pointerover', 'pointerout',
	'pointerenter', 'pointerleave', 'pointermove', 'pointercancel',
	'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
	'keyup', 'keydown', 'keypress',
	'input', 'change',
	'focus', 'blur'
];

var allEvents = mostEvents.concat('wheel', 'scroll');


return {
	node: node,
	text: text,
	custom: custom,
	map: F2(map),

	on: F3(on),
	style: style,
	property: F2(property),
	attribute: F2(attribute),
	attributeNS: F3(attributeNS),
	mapProperty: F2(mapProperty),

	lazy: F2(lazy),
	lazy2: F3(lazy2),
	lazy3: F4(lazy3),
	keyedNode: F3(keyedNode),

	program: program,
	programWithFlags: programWithFlags,
	staticProgram: staticProgram
};

}();

var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

var _elm_lang$core$Tuple$mapSecond = F2(
	function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
var _elm_lang$core$Tuple$mapFirst = F2(
	function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
var _elm_lang$core$Tuple$second = function (_p4) {
	var _p5 = _p4;
	return _p5._1;
};
var _elm_lang$core$Tuple$first = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};

//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function program(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flags !== 'undefined')
				{
					throw new Error(
						'The `' + moduleName + '` module does not need flags.\n'
						+ 'Call ' + moduleName + '.worker() with no arguments and you should be all set!'
					);
				}

				return initialize(
					impl.init,
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function programWithFlags(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flagDecoder === 'undefined')
				{
					throw new Error(
						'Are you trying to sneak a Never value into Elm? Trickster!\n'
						+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
						+ 'Use `program` instead if you do not want flags.'
					);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Err')
				{
					throw new Error(
						moduleName + '.worker(...) was called with an unexpected argument.\n'
						+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
						+ result._0
					);
				}

				return initialize(
					impl.init(result._0),
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function renderer(enqueue, _)
{
	return function(_) {};
}


// HTML TO PROGRAM

function htmlToProgram(vnode)
{
	var emptyBag = batch(_elm_lang$core$Native_List.Nil);
	var noChange = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		emptyBag
	);

	return _elm_lang$virtual_dom$VirtualDom$program({
		init: noChange,
		view: function(model) { return main; },
		update: F2(function(msg, model) { return noChange; }),
		subscriptions: function (model) { return emptyBag; }
	});
}


// INITIALIZE A PROGRAM

function initialize(init, update, subscriptions, renderer)
{
	// ambient state
	var managers = {};
	var updateView;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var model = init._0;
		updateView = renderer(enqueue, model);
		var cmds = init._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			updateView(model);
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, loop, handleMsg);
	}

	var task = A2(andThen, loop, init);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = converter(cmdList._0);
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


// INCOMING PORTS

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var sentBeforeInit = [];
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;
	var currentOnEffects = preInitOnEffects;
	var currentSend = preInitSend;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function preInitOnEffects(router, subList, state)
	{
		var postInitResult = postInitOnEffects(router, subList, state);

		for(var i = 0; i < sentBeforeInit.length; i++)
		{
			postInitSend(sentBeforeInit[i]);
		}

		sentBeforeInit = null; // to release objects held in queue
		currentSend = postInitSend;
		currentOnEffects = postInitOnEffects;
		return postInitResult;
	}

	function postInitOnEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	function onEffects(router, subList, state)
	{
		return currentOnEffects(router, subList, state);
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function preInitSend(value)
	{
		sentBeforeInit.push(value);
	}

	function postInitSend(incomingValue)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		var value = result._0;
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	function send(incomingValue)
	{
		currentSend(incomingValue);
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,

	htmlToProgram: htmlToProgram,
	program: program,
	programWithFlags: programWithFlags,
	initialize: initialize,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(callback, task)
{
	return {
		ctor: '_Task_andThen',
		callback: callback,
		task: task
	};
}

function onError(callback, task)
{
	return {
		ctor: '_Task_onError',
		callback: callback,
		task: task
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		if (process.root)
		{
			numSteps = step(numSteps, process);
		}
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _elm_lang$virtual_dom$VirtualDom$programWithFlags = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.programWithFlags, _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags, impl);
};
var _elm_lang$virtual_dom$VirtualDom$program = function (impl) {
	return A2(_elm_lang$virtual_dom$Native_VirtualDom.program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, impl);
};
var _elm_lang$virtual_dom$VirtualDom$keyedNode = _elm_lang$virtual_dom$Native_VirtualDom.keyedNode;
var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
var _elm_lang$virtual_dom$VirtualDom$defaultOptions = {stopPropagation: false, preventDefault: false};
var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
var _elm_lang$virtual_dom$VirtualDom$on = F2(
	function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
var _elm_lang$virtual_dom$VirtualDom$mapProperty = _elm_lang$virtual_dom$Native_VirtualDom.mapProperty;
var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
var _elm_lang$virtual_dom$VirtualDom$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});
var _elm_lang$virtual_dom$VirtualDom$Node = {ctor: 'Node'};
var _elm_lang$virtual_dom$VirtualDom$Property = {ctor: 'Property'};

var _elm_lang$html$Html$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
var _elm_lang$html$Html$program = _elm_lang$virtual_dom$VirtualDom$program;
var _elm_lang$html$Html$beginnerProgram = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$html$Html$program(
		{
			init: A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_p1.model,
				{ctor: '[]'}),
			update: F2(
				function (msg, model) {
					return A2(
						_elm_lang$core$Platform_Cmd_ops['!'],
						A2(_p1.update, msg, model),
						{ctor: '[]'});
				}),
			view: _p1.view,
			subscriptions: function (_p2) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
};
var _elm_lang$html$Html$map = _elm_lang$virtual_dom$VirtualDom$map;
var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
var _elm_lang$html$Html$main_ = _elm_lang$html$Html$node('main');
var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

var _elm_lang$html$Html_Attributes$map = _elm_lang$virtual_dom$VirtualDom$mapProperty;
var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
var _elm_lang$html$Html_Attributes$contextmenu = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
};
var _elm_lang$html$Html_Attributes$draggable = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'draggable', value);
};
var _elm_lang$html$Html_Attributes$itemprop = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'itemprop', value);
};
var _elm_lang$html$Html_Attributes$tabindex = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'tabIndex',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$charset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'charset', value);
};
var _elm_lang$html$Html_Attributes$height = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'height',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$width = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'width',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$formaction = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'formAction', value);
};
var _elm_lang$html$Html_Attributes$list = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'list', value);
};
var _elm_lang$html$Html_Attributes$minlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'minLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$maxlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'maxlength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$size = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'size',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$form = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'form', value);
};
var _elm_lang$html$Html_Attributes$cols = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'cols',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rows = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rows',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$challenge = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'challenge', value);
};
var _elm_lang$html$Html_Attributes$media = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'media', value);
};
var _elm_lang$html$Html_Attributes$rel = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'rel', value);
};
var _elm_lang$html$Html_Attributes$datetime = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'datetime', value);
};
var _elm_lang$html$Html_Attributes$pubdate = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'pubdate', value);
};
var _elm_lang$html$Html_Attributes$colspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'colspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rowspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$attribute,
		'rowspan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$manifest = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'manifest', value);
};
var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
var _elm_lang$html$Html_Attributes$stringProperty = F2(
	function (name, string) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$string(string));
	});
var _elm_lang$html$Html_Attributes$class = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
};
var _elm_lang$html$Html_Attributes$id = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
};
var _elm_lang$html$Html_Attributes$title = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
};
var _elm_lang$html$Html_Attributes$accesskey = function ($char) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'accessKey',
		_elm_lang$core$String$fromChar($char));
};
var _elm_lang$html$Html_Attributes$dir = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
};
var _elm_lang$html$Html_Attributes$dropzone = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
};
var _elm_lang$html$Html_Attributes$lang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
};
var _elm_lang$html$Html_Attributes$content = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
};
var _elm_lang$html$Html_Attributes$httpEquiv = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
};
var _elm_lang$html$Html_Attributes$language = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
};
var _elm_lang$html$Html_Attributes$src = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
};
var _elm_lang$html$Html_Attributes$alt = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
};
var _elm_lang$html$Html_Attributes$preload = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
};
var _elm_lang$html$Html_Attributes$poster = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
};
var _elm_lang$html$Html_Attributes$kind = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
};
var _elm_lang$html$Html_Attributes$srclang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
};
var _elm_lang$html$Html_Attributes$sandbox = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
};
var _elm_lang$html$Html_Attributes$srcdoc = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
};
var _elm_lang$html$Html_Attributes$type_ = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
};
var _elm_lang$html$Html_Attributes$value = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
};
var _elm_lang$html$Html_Attributes$defaultValue = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
};
var _elm_lang$html$Html_Attributes$placeholder = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
};
var _elm_lang$html$Html_Attributes$accept = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
};
var _elm_lang$html$Html_Attributes$acceptCharset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
};
var _elm_lang$html$Html_Attributes$action = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
};
var _elm_lang$html$Html_Attributes$autocomplete = function (bool) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var _elm_lang$html$Html_Attributes$enctype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
};
var _elm_lang$html$Html_Attributes$method = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
};
var _elm_lang$html$Html_Attributes$name = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
};
var _elm_lang$html$Html_Attributes$pattern = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
};
var _elm_lang$html$Html_Attributes$for = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
};
var _elm_lang$html$Html_Attributes$max = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
};
var _elm_lang$html$Html_Attributes$min = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
};
var _elm_lang$html$Html_Attributes$step = function (n) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
};
var _elm_lang$html$Html_Attributes$wrap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
};
var _elm_lang$html$Html_Attributes$usemap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
};
var _elm_lang$html$Html_Attributes$shape = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
};
var _elm_lang$html$Html_Attributes$coords = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
};
var _elm_lang$html$Html_Attributes$keytype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
};
var _elm_lang$html$Html_Attributes$align = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
};
var _elm_lang$html$Html_Attributes$cite = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
};
var _elm_lang$html$Html_Attributes$href = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
};
var _elm_lang$html$Html_Attributes$target = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
};
var _elm_lang$html$Html_Attributes$downloadAs = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
};
var _elm_lang$html$Html_Attributes$hreflang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
};
var _elm_lang$html$Html_Attributes$ping = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
};
var _elm_lang$html$Html_Attributes$start = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'start',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$headers = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
};
var _elm_lang$html$Html_Attributes$scope = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
};
var _elm_lang$html$Html_Attributes$boolProperty = F2(
	function (name, bool) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$bool(bool));
	});
var _elm_lang$html$Html_Attributes$hidden = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
};
var _elm_lang$html$Html_Attributes$contenteditable = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
};
var _elm_lang$html$Html_Attributes$spellcheck = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
};
var _elm_lang$html$Html_Attributes$async = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
};
var _elm_lang$html$Html_Attributes$defer = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
};
var _elm_lang$html$Html_Attributes$scoped = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
};
var _elm_lang$html$Html_Attributes$autoplay = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
};
var _elm_lang$html$Html_Attributes$controls = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
};
var _elm_lang$html$Html_Attributes$loop = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
};
var _elm_lang$html$Html_Attributes$default = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
};
var _elm_lang$html$Html_Attributes$seamless = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
};
var _elm_lang$html$Html_Attributes$checked = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
};
var _elm_lang$html$Html_Attributes$selected = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
};
var _elm_lang$html$Html_Attributes$autofocus = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
};
var _elm_lang$html$Html_Attributes$disabled = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
};
var _elm_lang$html$Html_Attributes$multiple = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
};
var _elm_lang$html$Html_Attributes$novalidate = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
};
var _elm_lang$html$Html_Attributes$readonly = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
};
var _elm_lang$html$Html_Attributes$required = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
};
var _elm_lang$html$Html_Attributes$ismap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
};
var _elm_lang$html$Html_Attributes$download = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
};
var _elm_lang$html$Html_Attributes$reversed = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
};
var _elm_lang$html$Html_Attributes$classList = function (list) {
	return _elm_lang$html$Html_Attributes$class(
		A2(
			_elm_lang$core$String$join,
			' ',
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$filter, _elm_lang$core$Tuple$second, list))));
};
var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$html$Html_Events$targetChecked = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'checked',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$bool);
var _elm_lang$html$Html_Events$targetValue = A2(
	_elm_lang$core$Json_Decode$at,
	{
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'value',
			_1: {ctor: '[]'}
		}
	},
	_elm_lang$core$Json_Decode$string);
var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
var _elm_lang$html$Html_Events$onFocus = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focus',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onBlur = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'blur',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(
	_elm_lang$html$Html_Events$defaultOptions,
	{preventDefault: true});
var _elm_lang$html$Html_Events$onSubmit = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'submit',
		_elm_lang$html$Html_Events$onSubmitOptions,
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onCheck = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
};
var _elm_lang$html$Html_Events$onInput = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'input',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
};
var _elm_lang$html$Html_Events$onMouseOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseOver = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseover',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseLeave = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseleave',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseEnter = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseenter',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseUp = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseup',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseDown = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mousedown',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onDoubleClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'dblclick',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'click',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});

var _elm_lang$svg$Svg$map = _elm_lang$virtual_dom$VirtualDom$map;
var _elm_lang$svg$Svg$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$svg$Svg$svgNamespace = A2(
	_elm_lang$virtual_dom$VirtualDom$property,
	'namespace',
	_elm_lang$core$Json_Encode$string('http://www.w3.org/2000/svg'));
var _elm_lang$svg$Svg$node = F3(
	function (name, attributes, children) {
		return A3(
			_elm_lang$virtual_dom$VirtualDom$node,
			name,
			{ctor: '::', _0: _elm_lang$svg$Svg$svgNamespace, _1: attributes},
			children);
	});
var _elm_lang$svg$Svg$svg = _elm_lang$svg$Svg$node('svg');
var _elm_lang$svg$Svg$foreignObject = _elm_lang$svg$Svg$node('foreignObject');
var _elm_lang$svg$Svg$animate = _elm_lang$svg$Svg$node('animate');
var _elm_lang$svg$Svg$animateColor = _elm_lang$svg$Svg$node('animateColor');
var _elm_lang$svg$Svg$animateMotion = _elm_lang$svg$Svg$node('animateMotion');
var _elm_lang$svg$Svg$animateTransform = _elm_lang$svg$Svg$node('animateTransform');
var _elm_lang$svg$Svg$mpath = _elm_lang$svg$Svg$node('mpath');
var _elm_lang$svg$Svg$set = _elm_lang$svg$Svg$node('set');
var _elm_lang$svg$Svg$a = _elm_lang$svg$Svg$node('a');
var _elm_lang$svg$Svg$defs = _elm_lang$svg$Svg$node('defs');
var _elm_lang$svg$Svg$g = _elm_lang$svg$Svg$node('g');
var _elm_lang$svg$Svg$marker = _elm_lang$svg$Svg$node('marker');
var _elm_lang$svg$Svg$mask = _elm_lang$svg$Svg$node('mask');
var _elm_lang$svg$Svg$pattern = _elm_lang$svg$Svg$node('pattern');
var _elm_lang$svg$Svg$switch = _elm_lang$svg$Svg$node('switch');
var _elm_lang$svg$Svg$symbol = _elm_lang$svg$Svg$node('symbol');
var _elm_lang$svg$Svg$desc = _elm_lang$svg$Svg$node('desc');
var _elm_lang$svg$Svg$metadata = _elm_lang$svg$Svg$node('metadata');
var _elm_lang$svg$Svg$title = _elm_lang$svg$Svg$node('title');
var _elm_lang$svg$Svg$feBlend = _elm_lang$svg$Svg$node('feBlend');
var _elm_lang$svg$Svg$feColorMatrix = _elm_lang$svg$Svg$node('feColorMatrix');
var _elm_lang$svg$Svg$feComponentTransfer = _elm_lang$svg$Svg$node('feComponentTransfer');
var _elm_lang$svg$Svg$feComposite = _elm_lang$svg$Svg$node('feComposite');
var _elm_lang$svg$Svg$feConvolveMatrix = _elm_lang$svg$Svg$node('feConvolveMatrix');
var _elm_lang$svg$Svg$feDiffuseLighting = _elm_lang$svg$Svg$node('feDiffuseLighting');
var _elm_lang$svg$Svg$feDisplacementMap = _elm_lang$svg$Svg$node('feDisplacementMap');
var _elm_lang$svg$Svg$feFlood = _elm_lang$svg$Svg$node('feFlood');
var _elm_lang$svg$Svg$feFuncA = _elm_lang$svg$Svg$node('feFuncA');
var _elm_lang$svg$Svg$feFuncB = _elm_lang$svg$Svg$node('feFuncB');
var _elm_lang$svg$Svg$feFuncG = _elm_lang$svg$Svg$node('feFuncG');
var _elm_lang$svg$Svg$feFuncR = _elm_lang$svg$Svg$node('feFuncR');
var _elm_lang$svg$Svg$feGaussianBlur = _elm_lang$svg$Svg$node('feGaussianBlur');
var _elm_lang$svg$Svg$feImage = _elm_lang$svg$Svg$node('feImage');
var _elm_lang$svg$Svg$feMerge = _elm_lang$svg$Svg$node('feMerge');
var _elm_lang$svg$Svg$feMergeNode = _elm_lang$svg$Svg$node('feMergeNode');
var _elm_lang$svg$Svg$feMorphology = _elm_lang$svg$Svg$node('feMorphology');
var _elm_lang$svg$Svg$feOffset = _elm_lang$svg$Svg$node('feOffset');
var _elm_lang$svg$Svg$feSpecularLighting = _elm_lang$svg$Svg$node('feSpecularLighting');
var _elm_lang$svg$Svg$feTile = _elm_lang$svg$Svg$node('feTile');
var _elm_lang$svg$Svg$feTurbulence = _elm_lang$svg$Svg$node('feTurbulence');
var _elm_lang$svg$Svg$font = _elm_lang$svg$Svg$node('font');
var _elm_lang$svg$Svg$linearGradient = _elm_lang$svg$Svg$node('linearGradient');
var _elm_lang$svg$Svg$radialGradient = _elm_lang$svg$Svg$node('radialGradient');
var _elm_lang$svg$Svg$stop = _elm_lang$svg$Svg$node('stop');
var _elm_lang$svg$Svg$circle = _elm_lang$svg$Svg$node('circle');
var _elm_lang$svg$Svg$ellipse = _elm_lang$svg$Svg$node('ellipse');
var _elm_lang$svg$Svg$image = _elm_lang$svg$Svg$node('image');
var _elm_lang$svg$Svg$line = _elm_lang$svg$Svg$node('line');
var _elm_lang$svg$Svg$path = _elm_lang$svg$Svg$node('path');
var _elm_lang$svg$Svg$polygon = _elm_lang$svg$Svg$node('polygon');
var _elm_lang$svg$Svg$polyline = _elm_lang$svg$Svg$node('polyline');
var _elm_lang$svg$Svg$rect = _elm_lang$svg$Svg$node('rect');
var _elm_lang$svg$Svg$use = _elm_lang$svg$Svg$node('use');
var _elm_lang$svg$Svg$feDistantLight = _elm_lang$svg$Svg$node('feDistantLight');
var _elm_lang$svg$Svg$fePointLight = _elm_lang$svg$Svg$node('fePointLight');
var _elm_lang$svg$Svg$feSpotLight = _elm_lang$svg$Svg$node('feSpotLight');
var _elm_lang$svg$Svg$altGlyph = _elm_lang$svg$Svg$node('altGlyph');
var _elm_lang$svg$Svg$altGlyphDef = _elm_lang$svg$Svg$node('altGlyphDef');
var _elm_lang$svg$Svg$altGlyphItem = _elm_lang$svg$Svg$node('altGlyphItem');
var _elm_lang$svg$Svg$glyph = _elm_lang$svg$Svg$node('glyph');
var _elm_lang$svg$Svg$glyphRef = _elm_lang$svg$Svg$node('glyphRef');
var _elm_lang$svg$Svg$textPath = _elm_lang$svg$Svg$node('textPath');
var _elm_lang$svg$Svg$text_ = _elm_lang$svg$Svg$node('text');
var _elm_lang$svg$Svg$tref = _elm_lang$svg$Svg$node('tref');
var _elm_lang$svg$Svg$tspan = _elm_lang$svg$Svg$node('tspan');
var _elm_lang$svg$Svg$clipPath = _elm_lang$svg$Svg$node('clipPath');
var _elm_lang$svg$Svg$colorProfile = _elm_lang$svg$Svg$node('colorProfile');
var _elm_lang$svg$Svg$cursor = _elm_lang$svg$Svg$node('cursor');
var _elm_lang$svg$Svg$filter = _elm_lang$svg$Svg$node('filter');
var _elm_lang$svg$Svg$script = _elm_lang$svg$Svg$node('script');
var _elm_lang$svg$Svg$style = _elm_lang$svg$Svg$node('style');
var _elm_lang$svg$Svg$view = _elm_lang$svg$Svg$node('view');

var _abadi199$elm_creditcard$CreditCard_Internal$getStateValue = function (state) {
	var _p0 = state;
	return _p0._0;
};
var _abadi199$elm_creditcard$CreditCard_Internal$StateValue = function (a) {
	return {flipped: a};
};
var _abadi199$elm_creditcard$CreditCard_Internal$CardStyle = F4(
	function (a, b, c, d) {
		return {background: a, textColor: b, lightTextColor: c, darkTextColor: d};
	});
var _abadi199$elm_creditcard$CreditCard_Internal$CardInfo = F5(
	function (a, b, c, d, e) {
		return {cardType: a, validLength: b, numberFormat: c, cardStyle: d, ccvPosition: e};
	});
var _abadi199$elm_creditcard$CreditCard_Internal$InternalState = function (a) {
	return {ctor: 'InternalState', _0: a};
};
var _abadi199$elm_creditcard$CreditCard_Internal$initialState = _abadi199$elm_creditcard$CreditCard_Internal$InternalState(
	{flipped: _elm_lang$core$Maybe$Nothing});
var _abadi199$elm_creditcard$CreditCard_Internal$VisaElectron = {ctor: 'VisaElectron'};
var _abadi199$elm_creditcard$CreditCard_Internal$Maestro = {ctor: 'Maestro'};
var _abadi199$elm_creditcard$CreditCard_Internal$Laser = {ctor: 'Laser'};
var _abadi199$elm_creditcard$CreditCard_Internal$JCB = {ctor: 'JCB'};
var _abadi199$elm_creditcard$CreditCard_Internal$DinersClubInternational = {ctor: 'DinersClubInternational'};
var _abadi199$elm_creditcard$CreditCard_Internal$DinersClubCarteBlanche = {ctor: 'DinersClubCarteBlanche'};
var _abadi199$elm_creditcard$CreditCard_Internal$Discover = {ctor: 'Discover'};
var _abadi199$elm_creditcard$CreditCard_Internal$Amex = {ctor: 'Amex'};
var _abadi199$elm_creditcard$CreditCard_Internal$Mastercard = {ctor: 'Mastercard'};
var _abadi199$elm_creditcard$CreditCard_Internal$Visa = {ctor: 'Visa'};
var _abadi199$elm_creditcard$CreditCard_Internal$Unknown = {ctor: 'Unknown'};
var _abadi199$elm_creditcard$CreditCard_Internal$Back = {ctor: 'Back'};
var _abadi199$elm_creditcard$CreditCard_Internal$Front = {ctor: 'Front'};

var _abadi199$elm_creditcard$CreditCard_Config$defaultPlaceholders = {number: 'Credit Card Number', name: 'First Last', month: 'MM', year: 'YYYY', ccv: 'CCV'};
var _abadi199$elm_creditcard$CreditCard_Config$defaultLabels = {number: 'Number', name: 'Full Name', month: 'Month', year: 'Year', ccv: 'CCV'};
var _abadi199$elm_creditcard$CreditCard_Config$defaultClasses = {number: 'Number', name: 'Name', month: 'Month', year: 'Year', ccv: 'CCV'};
var _abadi199$elm_creditcard$CreditCard_Config$defaultConfig = {
	blankChar: _elm_lang$core$Native_Utils.chr('•'),
	blankName: 'YOUR NAME'
};
var _abadi199$elm_creditcard$CreditCard_Config$defaultFormConfig = function (onChange) {
	return {blankChar: _abadi199$elm_creditcard$CreditCard_Config$defaultConfig.blankChar, blankName: _abadi199$elm_creditcard$CreditCard_Config$defaultConfig.blankName, onChange: onChange, showLabel: true, classes: _abadi199$elm_creditcard$CreditCard_Config$defaultClasses, labels: _abadi199$elm_creditcard$CreditCard_Config$defaultLabels, placeholders: _abadi199$elm_creditcard$CreditCard_Config$defaultPlaceholders};
};
var _abadi199$elm_creditcard$CreditCard_Config$FormConfig = F7(
	function (a, b, c, d, e, f, g) {
		return {blankChar: a, blankName: b, onChange: c, showLabel: d, classes: e, labels: f, placeholders: g};
	});
var _abadi199$elm_creditcard$CreditCard_Config$Form = F5(
	function (a, b, c, d, e) {
		return {number: a, name: b, month: c, year: d, ccv: e};
	});

var _elm_lang$svg$Svg_Attributes$writingMode = _elm_lang$virtual_dom$VirtualDom$attribute('writing-mode');
var _elm_lang$svg$Svg_Attributes$wordSpacing = _elm_lang$virtual_dom$VirtualDom$attribute('word-spacing');
var _elm_lang$svg$Svg_Attributes$visibility = _elm_lang$virtual_dom$VirtualDom$attribute('visibility');
var _elm_lang$svg$Svg_Attributes$unicodeBidi = _elm_lang$virtual_dom$VirtualDom$attribute('unicode-bidi');
var _elm_lang$svg$Svg_Attributes$textRendering = _elm_lang$virtual_dom$VirtualDom$attribute('text-rendering');
var _elm_lang$svg$Svg_Attributes$textDecoration = _elm_lang$virtual_dom$VirtualDom$attribute('text-decoration');
var _elm_lang$svg$Svg_Attributes$textAnchor = _elm_lang$virtual_dom$VirtualDom$attribute('text-anchor');
var _elm_lang$svg$Svg_Attributes$stroke = _elm_lang$virtual_dom$VirtualDom$attribute('stroke');
var _elm_lang$svg$Svg_Attributes$strokeWidth = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-width');
var _elm_lang$svg$Svg_Attributes$strokeOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-opacity');
var _elm_lang$svg$Svg_Attributes$strokeMiterlimit = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-miterlimit');
var _elm_lang$svg$Svg_Attributes$strokeLinejoin = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-linejoin');
var _elm_lang$svg$Svg_Attributes$strokeLinecap = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-linecap');
var _elm_lang$svg$Svg_Attributes$strokeDashoffset = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-dashoffset');
var _elm_lang$svg$Svg_Attributes$strokeDasharray = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-dasharray');
var _elm_lang$svg$Svg_Attributes$stopOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('stop-opacity');
var _elm_lang$svg$Svg_Attributes$stopColor = _elm_lang$virtual_dom$VirtualDom$attribute('stop-color');
var _elm_lang$svg$Svg_Attributes$shapeRendering = _elm_lang$virtual_dom$VirtualDom$attribute('shape-rendering');
var _elm_lang$svg$Svg_Attributes$pointerEvents = _elm_lang$virtual_dom$VirtualDom$attribute('pointer-events');
var _elm_lang$svg$Svg_Attributes$overflow = _elm_lang$virtual_dom$VirtualDom$attribute('overflow');
var _elm_lang$svg$Svg_Attributes$opacity = _elm_lang$virtual_dom$VirtualDom$attribute('opacity');
var _elm_lang$svg$Svg_Attributes$mask = _elm_lang$virtual_dom$VirtualDom$attribute('mask');
var _elm_lang$svg$Svg_Attributes$markerStart = _elm_lang$virtual_dom$VirtualDom$attribute('marker-start');
var _elm_lang$svg$Svg_Attributes$markerMid = _elm_lang$virtual_dom$VirtualDom$attribute('marker-mid');
var _elm_lang$svg$Svg_Attributes$markerEnd = _elm_lang$virtual_dom$VirtualDom$attribute('marker-end');
var _elm_lang$svg$Svg_Attributes$lightingColor = _elm_lang$virtual_dom$VirtualDom$attribute('lighting-color');
var _elm_lang$svg$Svg_Attributes$letterSpacing = _elm_lang$virtual_dom$VirtualDom$attribute('letter-spacing');
var _elm_lang$svg$Svg_Attributes$kerning = _elm_lang$virtual_dom$VirtualDom$attribute('kerning');
var _elm_lang$svg$Svg_Attributes$imageRendering = _elm_lang$virtual_dom$VirtualDom$attribute('image-rendering');
var _elm_lang$svg$Svg_Attributes$glyphOrientationVertical = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-orientation-vertical');
var _elm_lang$svg$Svg_Attributes$glyphOrientationHorizontal = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-orientation-horizontal');
var _elm_lang$svg$Svg_Attributes$fontWeight = _elm_lang$virtual_dom$VirtualDom$attribute('font-weight');
var _elm_lang$svg$Svg_Attributes$fontVariant = _elm_lang$virtual_dom$VirtualDom$attribute('font-variant');
var _elm_lang$svg$Svg_Attributes$fontStyle = _elm_lang$virtual_dom$VirtualDom$attribute('font-style');
var _elm_lang$svg$Svg_Attributes$fontStretch = _elm_lang$virtual_dom$VirtualDom$attribute('font-stretch');
var _elm_lang$svg$Svg_Attributes$fontSize = _elm_lang$virtual_dom$VirtualDom$attribute('font-size');
var _elm_lang$svg$Svg_Attributes$fontSizeAdjust = _elm_lang$virtual_dom$VirtualDom$attribute('font-size-adjust');
var _elm_lang$svg$Svg_Attributes$fontFamily = _elm_lang$virtual_dom$VirtualDom$attribute('font-family');
var _elm_lang$svg$Svg_Attributes$floodOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('flood-opacity');
var _elm_lang$svg$Svg_Attributes$floodColor = _elm_lang$virtual_dom$VirtualDom$attribute('flood-color');
var _elm_lang$svg$Svg_Attributes$filter = _elm_lang$virtual_dom$VirtualDom$attribute('filter');
var _elm_lang$svg$Svg_Attributes$fill = _elm_lang$virtual_dom$VirtualDom$attribute('fill');
var _elm_lang$svg$Svg_Attributes$fillRule = _elm_lang$virtual_dom$VirtualDom$attribute('fill-rule');
var _elm_lang$svg$Svg_Attributes$fillOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('fill-opacity');
var _elm_lang$svg$Svg_Attributes$enableBackground = _elm_lang$virtual_dom$VirtualDom$attribute('enable-background');
var _elm_lang$svg$Svg_Attributes$dominantBaseline = _elm_lang$virtual_dom$VirtualDom$attribute('dominant-baseline');
var _elm_lang$svg$Svg_Attributes$display = _elm_lang$virtual_dom$VirtualDom$attribute('display');
var _elm_lang$svg$Svg_Attributes$direction = _elm_lang$virtual_dom$VirtualDom$attribute('direction');
var _elm_lang$svg$Svg_Attributes$cursor = _elm_lang$virtual_dom$VirtualDom$attribute('cursor');
var _elm_lang$svg$Svg_Attributes$color = _elm_lang$virtual_dom$VirtualDom$attribute('color');
var _elm_lang$svg$Svg_Attributes$colorRendering = _elm_lang$virtual_dom$VirtualDom$attribute('color-rendering');
var _elm_lang$svg$Svg_Attributes$colorProfile = _elm_lang$virtual_dom$VirtualDom$attribute('color-profile');
var _elm_lang$svg$Svg_Attributes$colorInterpolation = _elm_lang$virtual_dom$VirtualDom$attribute('color-interpolation');
var _elm_lang$svg$Svg_Attributes$colorInterpolationFilters = _elm_lang$virtual_dom$VirtualDom$attribute('color-interpolation-filters');
var _elm_lang$svg$Svg_Attributes$clip = _elm_lang$virtual_dom$VirtualDom$attribute('clip');
var _elm_lang$svg$Svg_Attributes$clipRule = _elm_lang$virtual_dom$VirtualDom$attribute('clip-rule');
var _elm_lang$svg$Svg_Attributes$clipPath = _elm_lang$virtual_dom$VirtualDom$attribute('clip-path');
var _elm_lang$svg$Svg_Attributes$baselineShift = _elm_lang$virtual_dom$VirtualDom$attribute('baseline-shift');
var _elm_lang$svg$Svg_Attributes$alignmentBaseline = _elm_lang$virtual_dom$VirtualDom$attribute('alignment-baseline');
var _elm_lang$svg$Svg_Attributes$zoomAndPan = _elm_lang$virtual_dom$VirtualDom$attribute('zoomAndPan');
var _elm_lang$svg$Svg_Attributes$z = _elm_lang$virtual_dom$VirtualDom$attribute('z');
var _elm_lang$svg$Svg_Attributes$yChannelSelector = _elm_lang$virtual_dom$VirtualDom$attribute('yChannelSelector');
var _elm_lang$svg$Svg_Attributes$y2 = _elm_lang$virtual_dom$VirtualDom$attribute('y2');
var _elm_lang$svg$Svg_Attributes$y1 = _elm_lang$virtual_dom$VirtualDom$attribute('y1');
var _elm_lang$svg$Svg_Attributes$y = _elm_lang$virtual_dom$VirtualDom$attribute('y');
var _elm_lang$svg$Svg_Attributes$xmlSpace = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:space');
var _elm_lang$svg$Svg_Attributes$xmlLang = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:lang');
var _elm_lang$svg$Svg_Attributes$xmlBase = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:base');
var _elm_lang$svg$Svg_Attributes$xlinkType = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:type');
var _elm_lang$svg$Svg_Attributes$xlinkTitle = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:title');
var _elm_lang$svg$Svg_Attributes$xlinkShow = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:show');
var _elm_lang$svg$Svg_Attributes$xlinkRole = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:role');
var _elm_lang$svg$Svg_Attributes$xlinkHref = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:href');
var _elm_lang$svg$Svg_Attributes$xlinkArcrole = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:arcrole');
var _elm_lang$svg$Svg_Attributes$xlinkActuate = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:actuate');
var _elm_lang$svg$Svg_Attributes$xChannelSelector = _elm_lang$virtual_dom$VirtualDom$attribute('xChannelSelector');
var _elm_lang$svg$Svg_Attributes$x2 = _elm_lang$virtual_dom$VirtualDom$attribute('x2');
var _elm_lang$svg$Svg_Attributes$x1 = _elm_lang$virtual_dom$VirtualDom$attribute('x1');
var _elm_lang$svg$Svg_Attributes$xHeight = _elm_lang$virtual_dom$VirtualDom$attribute('x-height');
var _elm_lang$svg$Svg_Attributes$x = _elm_lang$virtual_dom$VirtualDom$attribute('x');
var _elm_lang$svg$Svg_Attributes$widths = _elm_lang$virtual_dom$VirtualDom$attribute('widths');
var _elm_lang$svg$Svg_Attributes$width = _elm_lang$virtual_dom$VirtualDom$attribute('width');
var _elm_lang$svg$Svg_Attributes$viewTarget = _elm_lang$virtual_dom$VirtualDom$attribute('viewTarget');
var _elm_lang$svg$Svg_Attributes$viewBox = _elm_lang$virtual_dom$VirtualDom$attribute('viewBox');
var _elm_lang$svg$Svg_Attributes$vertOriginY = _elm_lang$virtual_dom$VirtualDom$attribute('vert-origin-y');
var _elm_lang$svg$Svg_Attributes$vertOriginX = _elm_lang$virtual_dom$VirtualDom$attribute('vert-origin-x');
var _elm_lang$svg$Svg_Attributes$vertAdvY = _elm_lang$virtual_dom$VirtualDom$attribute('vert-adv-y');
var _elm_lang$svg$Svg_Attributes$version = _elm_lang$virtual_dom$VirtualDom$attribute('version');
var _elm_lang$svg$Svg_Attributes$values = _elm_lang$virtual_dom$VirtualDom$attribute('values');
var _elm_lang$svg$Svg_Attributes$vMathematical = _elm_lang$virtual_dom$VirtualDom$attribute('v-mathematical');
var _elm_lang$svg$Svg_Attributes$vIdeographic = _elm_lang$virtual_dom$VirtualDom$attribute('v-ideographic');
var _elm_lang$svg$Svg_Attributes$vHanging = _elm_lang$virtual_dom$VirtualDom$attribute('v-hanging');
var _elm_lang$svg$Svg_Attributes$vAlphabetic = _elm_lang$virtual_dom$VirtualDom$attribute('v-alphabetic');
var _elm_lang$svg$Svg_Attributes$unitsPerEm = _elm_lang$virtual_dom$VirtualDom$attribute('units-per-em');
var _elm_lang$svg$Svg_Attributes$unicodeRange = _elm_lang$virtual_dom$VirtualDom$attribute('unicode-range');
var _elm_lang$svg$Svg_Attributes$unicode = _elm_lang$virtual_dom$VirtualDom$attribute('unicode');
var _elm_lang$svg$Svg_Attributes$underlineThickness = _elm_lang$virtual_dom$VirtualDom$attribute('underline-thickness');
var _elm_lang$svg$Svg_Attributes$underlinePosition = _elm_lang$virtual_dom$VirtualDom$attribute('underline-position');
var _elm_lang$svg$Svg_Attributes$u2 = _elm_lang$virtual_dom$VirtualDom$attribute('u2');
var _elm_lang$svg$Svg_Attributes$u1 = _elm_lang$virtual_dom$VirtualDom$attribute('u1');
var _elm_lang$svg$Svg_Attributes$type_ = _elm_lang$virtual_dom$VirtualDom$attribute('type');
var _elm_lang$svg$Svg_Attributes$transform = _elm_lang$virtual_dom$VirtualDom$attribute('transform');
var _elm_lang$svg$Svg_Attributes$to = _elm_lang$virtual_dom$VirtualDom$attribute('to');
var _elm_lang$svg$Svg_Attributes$title = _elm_lang$virtual_dom$VirtualDom$attribute('title');
var _elm_lang$svg$Svg_Attributes$textLength = _elm_lang$virtual_dom$VirtualDom$attribute('textLength');
var _elm_lang$svg$Svg_Attributes$targetY = _elm_lang$virtual_dom$VirtualDom$attribute('targetY');
var _elm_lang$svg$Svg_Attributes$targetX = _elm_lang$virtual_dom$VirtualDom$attribute('targetX');
var _elm_lang$svg$Svg_Attributes$target = _elm_lang$virtual_dom$VirtualDom$attribute('target');
var _elm_lang$svg$Svg_Attributes$tableValues = _elm_lang$virtual_dom$VirtualDom$attribute('tableValues');
var _elm_lang$svg$Svg_Attributes$systemLanguage = _elm_lang$virtual_dom$VirtualDom$attribute('systemLanguage');
var _elm_lang$svg$Svg_Attributes$surfaceScale = _elm_lang$virtual_dom$VirtualDom$attribute('surfaceScale');
var _elm_lang$svg$Svg_Attributes$style = _elm_lang$virtual_dom$VirtualDom$attribute('style');
var _elm_lang$svg$Svg_Attributes$string = _elm_lang$virtual_dom$VirtualDom$attribute('string');
var _elm_lang$svg$Svg_Attributes$strikethroughThickness = _elm_lang$virtual_dom$VirtualDom$attribute('strikethrough-thickness');
var _elm_lang$svg$Svg_Attributes$strikethroughPosition = _elm_lang$virtual_dom$VirtualDom$attribute('strikethrough-position');
var _elm_lang$svg$Svg_Attributes$stitchTiles = _elm_lang$virtual_dom$VirtualDom$attribute('stitchTiles');
var _elm_lang$svg$Svg_Attributes$stemv = _elm_lang$virtual_dom$VirtualDom$attribute('stemv');
var _elm_lang$svg$Svg_Attributes$stemh = _elm_lang$virtual_dom$VirtualDom$attribute('stemh');
var _elm_lang$svg$Svg_Attributes$stdDeviation = _elm_lang$virtual_dom$VirtualDom$attribute('stdDeviation');
var _elm_lang$svg$Svg_Attributes$startOffset = _elm_lang$virtual_dom$VirtualDom$attribute('startOffset');
var _elm_lang$svg$Svg_Attributes$spreadMethod = _elm_lang$virtual_dom$VirtualDom$attribute('spreadMethod');
var _elm_lang$svg$Svg_Attributes$speed = _elm_lang$virtual_dom$VirtualDom$attribute('speed');
var _elm_lang$svg$Svg_Attributes$specularExponent = _elm_lang$virtual_dom$VirtualDom$attribute('specularExponent');
var _elm_lang$svg$Svg_Attributes$specularConstant = _elm_lang$virtual_dom$VirtualDom$attribute('specularConstant');
var _elm_lang$svg$Svg_Attributes$spacing = _elm_lang$virtual_dom$VirtualDom$attribute('spacing');
var _elm_lang$svg$Svg_Attributes$slope = _elm_lang$virtual_dom$VirtualDom$attribute('slope');
var _elm_lang$svg$Svg_Attributes$seed = _elm_lang$virtual_dom$VirtualDom$attribute('seed');
var _elm_lang$svg$Svg_Attributes$scale = _elm_lang$virtual_dom$VirtualDom$attribute('scale');
var _elm_lang$svg$Svg_Attributes$ry = _elm_lang$virtual_dom$VirtualDom$attribute('ry');
var _elm_lang$svg$Svg_Attributes$rx = _elm_lang$virtual_dom$VirtualDom$attribute('rx');
var _elm_lang$svg$Svg_Attributes$rotate = _elm_lang$virtual_dom$VirtualDom$attribute('rotate');
var _elm_lang$svg$Svg_Attributes$result = _elm_lang$virtual_dom$VirtualDom$attribute('result');
var _elm_lang$svg$Svg_Attributes$restart = _elm_lang$virtual_dom$VirtualDom$attribute('restart');
var _elm_lang$svg$Svg_Attributes$requiredFeatures = _elm_lang$virtual_dom$VirtualDom$attribute('requiredFeatures');
var _elm_lang$svg$Svg_Attributes$requiredExtensions = _elm_lang$virtual_dom$VirtualDom$attribute('requiredExtensions');
var _elm_lang$svg$Svg_Attributes$repeatDur = _elm_lang$virtual_dom$VirtualDom$attribute('repeatDur');
var _elm_lang$svg$Svg_Attributes$repeatCount = _elm_lang$virtual_dom$VirtualDom$attribute('repeatCount');
var _elm_lang$svg$Svg_Attributes$renderingIntent = _elm_lang$virtual_dom$VirtualDom$attribute('rendering-intent');
var _elm_lang$svg$Svg_Attributes$refY = _elm_lang$virtual_dom$VirtualDom$attribute('refY');
var _elm_lang$svg$Svg_Attributes$refX = _elm_lang$virtual_dom$VirtualDom$attribute('refX');
var _elm_lang$svg$Svg_Attributes$radius = _elm_lang$virtual_dom$VirtualDom$attribute('radius');
var _elm_lang$svg$Svg_Attributes$r = _elm_lang$virtual_dom$VirtualDom$attribute('r');
var _elm_lang$svg$Svg_Attributes$primitiveUnits = _elm_lang$virtual_dom$VirtualDom$attribute('primitiveUnits');
var _elm_lang$svg$Svg_Attributes$preserveAspectRatio = _elm_lang$virtual_dom$VirtualDom$attribute('preserveAspectRatio');
var _elm_lang$svg$Svg_Attributes$preserveAlpha = _elm_lang$virtual_dom$VirtualDom$attribute('preserveAlpha');
var _elm_lang$svg$Svg_Attributes$pointsAtZ = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtZ');
var _elm_lang$svg$Svg_Attributes$pointsAtY = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtY');
var _elm_lang$svg$Svg_Attributes$pointsAtX = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtX');
var _elm_lang$svg$Svg_Attributes$points = _elm_lang$virtual_dom$VirtualDom$attribute('points');
var _elm_lang$svg$Svg_Attributes$pointOrder = _elm_lang$virtual_dom$VirtualDom$attribute('point-order');
var _elm_lang$svg$Svg_Attributes$patternUnits = _elm_lang$virtual_dom$VirtualDom$attribute('patternUnits');
var _elm_lang$svg$Svg_Attributes$patternTransform = _elm_lang$virtual_dom$VirtualDom$attribute('patternTransform');
var _elm_lang$svg$Svg_Attributes$patternContentUnits = _elm_lang$virtual_dom$VirtualDom$attribute('patternContentUnits');
var _elm_lang$svg$Svg_Attributes$pathLength = _elm_lang$virtual_dom$VirtualDom$attribute('pathLength');
var _elm_lang$svg$Svg_Attributes$path = _elm_lang$virtual_dom$VirtualDom$attribute('path');
var _elm_lang$svg$Svg_Attributes$panose1 = _elm_lang$virtual_dom$VirtualDom$attribute('panose-1');
var _elm_lang$svg$Svg_Attributes$overlineThickness = _elm_lang$virtual_dom$VirtualDom$attribute('overline-thickness');
var _elm_lang$svg$Svg_Attributes$overlinePosition = _elm_lang$virtual_dom$VirtualDom$attribute('overline-position');
var _elm_lang$svg$Svg_Attributes$origin = _elm_lang$virtual_dom$VirtualDom$attribute('origin');
var _elm_lang$svg$Svg_Attributes$orientation = _elm_lang$virtual_dom$VirtualDom$attribute('orientation');
var _elm_lang$svg$Svg_Attributes$orient = _elm_lang$virtual_dom$VirtualDom$attribute('orient');
var _elm_lang$svg$Svg_Attributes$order = _elm_lang$virtual_dom$VirtualDom$attribute('order');
var _elm_lang$svg$Svg_Attributes$operator = _elm_lang$virtual_dom$VirtualDom$attribute('operator');
var _elm_lang$svg$Svg_Attributes$offset = _elm_lang$virtual_dom$VirtualDom$attribute('offset');
var _elm_lang$svg$Svg_Attributes$numOctaves = _elm_lang$virtual_dom$VirtualDom$attribute('numOctaves');
var _elm_lang$svg$Svg_Attributes$name = _elm_lang$virtual_dom$VirtualDom$attribute('name');
var _elm_lang$svg$Svg_Attributes$mode = _elm_lang$virtual_dom$VirtualDom$attribute('mode');
var _elm_lang$svg$Svg_Attributes$min = _elm_lang$virtual_dom$VirtualDom$attribute('min');
var _elm_lang$svg$Svg_Attributes$method = _elm_lang$virtual_dom$VirtualDom$attribute('method');
var _elm_lang$svg$Svg_Attributes$media = _elm_lang$virtual_dom$VirtualDom$attribute('media');
var _elm_lang$svg$Svg_Attributes$max = _elm_lang$virtual_dom$VirtualDom$attribute('max');
var _elm_lang$svg$Svg_Attributes$mathematical = _elm_lang$virtual_dom$VirtualDom$attribute('mathematical');
var _elm_lang$svg$Svg_Attributes$maskUnits = _elm_lang$virtual_dom$VirtualDom$attribute('maskUnits');
var _elm_lang$svg$Svg_Attributes$maskContentUnits = _elm_lang$virtual_dom$VirtualDom$attribute('maskContentUnits');
var _elm_lang$svg$Svg_Attributes$markerWidth = _elm_lang$virtual_dom$VirtualDom$attribute('markerWidth');
var _elm_lang$svg$Svg_Attributes$markerUnits = _elm_lang$virtual_dom$VirtualDom$attribute('markerUnits');
var _elm_lang$svg$Svg_Attributes$markerHeight = _elm_lang$virtual_dom$VirtualDom$attribute('markerHeight');
var _elm_lang$svg$Svg_Attributes$local = _elm_lang$virtual_dom$VirtualDom$attribute('local');
var _elm_lang$svg$Svg_Attributes$limitingConeAngle = _elm_lang$virtual_dom$VirtualDom$attribute('limitingConeAngle');
var _elm_lang$svg$Svg_Attributes$lengthAdjust = _elm_lang$virtual_dom$VirtualDom$attribute('lengthAdjust');
var _elm_lang$svg$Svg_Attributes$lang = _elm_lang$virtual_dom$VirtualDom$attribute('lang');
var _elm_lang$svg$Svg_Attributes$keyTimes = _elm_lang$virtual_dom$VirtualDom$attribute('keyTimes');
var _elm_lang$svg$Svg_Attributes$keySplines = _elm_lang$virtual_dom$VirtualDom$attribute('keySplines');
var _elm_lang$svg$Svg_Attributes$keyPoints = _elm_lang$virtual_dom$VirtualDom$attribute('keyPoints');
var _elm_lang$svg$Svg_Attributes$kernelUnitLength = _elm_lang$virtual_dom$VirtualDom$attribute('kernelUnitLength');
var _elm_lang$svg$Svg_Attributes$kernelMatrix = _elm_lang$virtual_dom$VirtualDom$attribute('kernelMatrix');
var _elm_lang$svg$Svg_Attributes$k4 = _elm_lang$virtual_dom$VirtualDom$attribute('k4');
var _elm_lang$svg$Svg_Attributes$k3 = _elm_lang$virtual_dom$VirtualDom$attribute('k3');
var _elm_lang$svg$Svg_Attributes$k2 = _elm_lang$virtual_dom$VirtualDom$attribute('k2');
var _elm_lang$svg$Svg_Attributes$k1 = _elm_lang$virtual_dom$VirtualDom$attribute('k1');
var _elm_lang$svg$Svg_Attributes$k = _elm_lang$virtual_dom$VirtualDom$attribute('k');
var _elm_lang$svg$Svg_Attributes$intercept = _elm_lang$virtual_dom$VirtualDom$attribute('intercept');
var _elm_lang$svg$Svg_Attributes$in2 = _elm_lang$virtual_dom$VirtualDom$attribute('in2');
var _elm_lang$svg$Svg_Attributes$in_ = _elm_lang$virtual_dom$VirtualDom$attribute('in');
var _elm_lang$svg$Svg_Attributes$ideographic = _elm_lang$virtual_dom$VirtualDom$attribute('ideographic');
var _elm_lang$svg$Svg_Attributes$id = _elm_lang$virtual_dom$VirtualDom$attribute('id');
var _elm_lang$svg$Svg_Attributes$horizOriginY = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-origin-y');
var _elm_lang$svg$Svg_Attributes$horizOriginX = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-origin-x');
var _elm_lang$svg$Svg_Attributes$horizAdvX = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-adv-x');
var _elm_lang$svg$Svg_Attributes$height = _elm_lang$virtual_dom$VirtualDom$attribute('height');
var _elm_lang$svg$Svg_Attributes$hanging = _elm_lang$virtual_dom$VirtualDom$attribute('hanging');
var _elm_lang$svg$Svg_Attributes$gradientUnits = _elm_lang$virtual_dom$VirtualDom$attribute('gradientUnits');
var _elm_lang$svg$Svg_Attributes$gradientTransform = _elm_lang$virtual_dom$VirtualDom$attribute('gradientTransform');
var _elm_lang$svg$Svg_Attributes$glyphRef = _elm_lang$virtual_dom$VirtualDom$attribute('glyphRef');
var _elm_lang$svg$Svg_Attributes$glyphName = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-name');
var _elm_lang$svg$Svg_Attributes$g2 = _elm_lang$virtual_dom$VirtualDom$attribute('g2');
var _elm_lang$svg$Svg_Attributes$g1 = _elm_lang$virtual_dom$VirtualDom$attribute('g1');
var _elm_lang$svg$Svg_Attributes$fy = _elm_lang$virtual_dom$VirtualDom$attribute('fy');
var _elm_lang$svg$Svg_Attributes$fx = _elm_lang$virtual_dom$VirtualDom$attribute('fx');
var _elm_lang$svg$Svg_Attributes$from = _elm_lang$virtual_dom$VirtualDom$attribute('from');
var _elm_lang$svg$Svg_Attributes$format = _elm_lang$virtual_dom$VirtualDom$attribute('format');
var _elm_lang$svg$Svg_Attributes$filterUnits = _elm_lang$virtual_dom$VirtualDom$attribute('filterUnits');
var _elm_lang$svg$Svg_Attributes$filterRes = _elm_lang$virtual_dom$VirtualDom$attribute('filterRes');
var _elm_lang$svg$Svg_Attributes$externalResourcesRequired = _elm_lang$virtual_dom$VirtualDom$attribute('externalResourcesRequired');
var _elm_lang$svg$Svg_Attributes$exponent = _elm_lang$virtual_dom$VirtualDom$attribute('exponent');
var _elm_lang$svg$Svg_Attributes$end = _elm_lang$virtual_dom$VirtualDom$attribute('end');
var _elm_lang$svg$Svg_Attributes$elevation = _elm_lang$virtual_dom$VirtualDom$attribute('elevation');
var _elm_lang$svg$Svg_Attributes$edgeMode = _elm_lang$virtual_dom$VirtualDom$attribute('edgeMode');
var _elm_lang$svg$Svg_Attributes$dy = _elm_lang$virtual_dom$VirtualDom$attribute('dy');
var _elm_lang$svg$Svg_Attributes$dx = _elm_lang$virtual_dom$VirtualDom$attribute('dx');
var _elm_lang$svg$Svg_Attributes$dur = _elm_lang$virtual_dom$VirtualDom$attribute('dur');
var _elm_lang$svg$Svg_Attributes$divisor = _elm_lang$virtual_dom$VirtualDom$attribute('divisor');
var _elm_lang$svg$Svg_Attributes$diffuseConstant = _elm_lang$virtual_dom$VirtualDom$attribute('diffuseConstant');
var _elm_lang$svg$Svg_Attributes$descent = _elm_lang$virtual_dom$VirtualDom$attribute('descent');
var _elm_lang$svg$Svg_Attributes$decelerate = _elm_lang$virtual_dom$VirtualDom$attribute('decelerate');
var _elm_lang$svg$Svg_Attributes$d = _elm_lang$virtual_dom$VirtualDom$attribute('d');
var _elm_lang$svg$Svg_Attributes$cy = _elm_lang$virtual_dom$VirtualDom$attribute('cy');
var _elm_lang$svg$Svg_Attributes$cx = _elm_lang$virtual_dom$VirtualDom$attribute('cx');
var _elm_lang$svg$Svg_Attributes$contentStyleType = _elm_lang$virtual_dom$VirtualDom$attribute('contentStyleType');
var _elm_lang$svg$Svg_Attributes$contentScriptType = _elm_lang$virtual_dom$VirtualDom$attribute('contentScriptType');
var _elm_lang$svg$Svg_Attributes$clipPathUnits = _elm_lang$virtual_dom$VirtualDom$attribute('clipPathUnits');
var _elm_lang$svg$Svg_Attributes$class = _elm_lang$virtual_dom$VirtualDom$attribute('class');
var _elm_lang$svg$Svg_Attributes$capHeight = _elm_lang$virtual_dom$VirtualDom$attribute('cap-height');
var _elm_lang$svg$Svg_Attributes$calcMode = _elm_lang$virtual_dom$VirtualDom$attribute('calcMode');
var _elm_lang$svg$Svg_Attributes$by = _elm_lang$virtual_dom$VirtualDom$attribute('by');
var _elm_lang$svg$Svg_Attributes$bias = _elm_lang$virtual_dom$VirtualDom$attribute('bias');
var _elm_lang$svg$Svg_Attributes$begin = _elm_lang$virtual_dom$VirtualDom$attribute('begin');
var _elm_lang$svg$Svg_Attributes$bbox = _elm_lang$virtual_dom$VirtualDom$attribute('bbox');
var _elm_lang$svg$Svg_Attributes$baseProfile = _elm_lang$virtual_dom$VirtualDom$attribute('baseProfile');
var _elm_lang$svg$Svg_Attributes$baseFrequency = _elm_lang$virtual_dom$VirtualDom$attribute('baseFrequency');
var _elm_lang$svg$Svg_Attributes$azimuth = _elm_lang$virtual_dom$VirtualDom$attribute('azimuth');
var _elm_lang$svg$Svg_Attributes$autoReverse = _elm_lang$virtual_dom$VirtualDom$attribute('autoReverse');
var _elm_lang$svg$Svg_Attributes$attributeType = _elm_lang$virtual_dom$VirtualDom$attribute('attributeType');
var _elm_lang$svg$Svg_Attributes$attributeName = _elm_lang$virtual_dom$VirtualDom$attribute('attributeName');
var _elm_lang$svg$Svg_Attributes$ascent = _elm_lang$virtual_dom$VirtualDom$attribute('ascent');
var _elm_lang$svg$Svg_Attributes$arabicForm = _elm_lang$virtual_dom$VirtualDom$attribute('arabic-form');
var _elm_lang$svg$Svg_Attributes$amplitude = _elm_lang$virtual_dom$VirtualDom$attribute('amplitude');
var _elm_lang$svg$Svg_Attributes$allowReorder = _elm_lang$virtual_dom$VirtualDom$attribute('allowReorder');
var _elm_lang$svg$Svg_Attributes$alphabetic = _elm_lang$virtual_dom$VirtualDom$attribute('alphabetic');
var _elm_lang$svg$Svg_Attributes$additive = _elm_lang$virtual_dom$VirtualDom$attribute('additive');
var _elm_lang$svg$Svg_Attributes$accumulate = _elm_lang$virtual_dom$VirtualDom$attribute('accumulate');
var _elm_lang$svg$Svg_Attributes$accelerate = _elm_lang$virtual_dom$VirtualDom$attribute('accelerate');
var _elm_lang$svg$Svg_Attributes$accentHeight = _elm_lang$virtual_dom$VirtualDom$attribute('accent-height');

var _abadi199$elm_creditcard$CreditCard_Components_Logo_Visa$viewLogo = A2(
	_elm_lang$svg$Svg$g,
	{
		ctor: '::',
		_0: _elm_lang$svg$Svg_Attributes$transform('matrix(0.26232469, 0, 0, -0.26232469, -17.6683614, 35.8078446)'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(143.448,67.609)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$path,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 10.938,67.713 17.484,0 L 17.485,0 0,0'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none'),
							_1: {ctor: '[]'}
						}
					},
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$svg$Svg$g,
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$transform('translate(224.353,133.66)'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$path,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 c -3.457,1.359 -8.894,2.842 -15.667,2.842 -17.286,0 -29.454,-9.19 -29.555,-22.348 -0.11,-9.732 8.683,-15.161 15.312,-18.396 6.813,-3.316 9.102,-5.438 9.075,-8.403 -0.047,-4.535 -5.438,-6.613 -10.465,-6.613 -7,0 -10.719,1.023 -16.469,3.551 l -2.249,1.078 -2.445,-15.157 c 4.077,-1.886 11.635,-3.523 19.479,-3.609 18.371,0 30.308,9.078 30.448,23.129 0.063,7.718 -4.596,13.569 -14.686,18.399 -6.11,3.139 -9.86,5.219 -9.817,8.397 0.004,2.815 3.168,5.827 10.016,5.827 5.719,0.092 9.859,-1.225 13.085,-2.601 l 1.57,-0.775 L 0,0'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none'),
								_1: {ctor: '[]'}
							}
						},
						{ctor: '[]'}),
					_1: {ctor: '[]'}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$g,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$transform('translate(247.634,91.616)'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$path,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 c 1.449,3.892 6.965,18.926 6.965,18.926 -0.102,-0.178 1.441,3.923 2.324,6.461 l 1.18,-5.84 c 0,0 3.355,-16.162 4.046,-19.547 C 11.793,0 3.414,0 0,0 Z m 21.57,43.637 -13.512,0 c -4.191,0 -7.328,-1.198 -9.164,-5.613 l -25.965,-62.055 18.364,0 c 0,0 2.996,8.348 3.676,10.18 2.003,0 19.847,-0.035 22.394,-0.035 0.524,-2.363 2.129,-10.145 2.129,-10.145 l 16.228,0 -14.15,67.668'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none'),
									_1: {ctor: '[]'}
								}
							},
							{ctor: '[]'}),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$g,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$transform('translate(128.78,135.265)'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$path,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 -17.113,-46.164 -1.833,9.384 c -3.189,10.812 -13.116,22.531 -24.22,28.403 l 15.656,-59.22 18.504,0.011 L 18.528,0 0,0'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none'),
										_1: {ctor: '[]'}
									}
								},
								{ctor: '[]'}),
							_1: {ctor: '[]'}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$g,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$transform('translate(95.781,135.311)'),
								_1: {ctor: '[]'}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$path,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 -28.195,0 -0.233,-1.403 C -6.488,-7.012 8.028,-20.551 14.053,-36.826 L 7.926,-5.713 C 6.869,-1.422 3.797,-0.15 0,0'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$style('fill:#f79510;fill-opacity:1;fill-rule:nonzero;stroke:none'),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {ctor: '[]'}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$g,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$transform('translate(288.329,72.034)'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$path,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$d('M 0,0 0.828,0 C 1.413,0 1.533,0.342 1.533,0.617 1.533,1.09 1.226,1.2 0.75,1.2 L 0,1.2 0,0 Z m -0.715,1.726 1.707,0 c 0.398,0 1.271,-0.105 1.271,-1.109 0,-0.266 -0.079,-0.641 -0.65,-0.885 l 0,-0.021 c 0.493,-0.084 0.519,-0.55 0.548,-0.925 0.036,-0.598 0,-0.705 0.156,-0.916 l -0.741,0 c -0.141,0.142 -0.109,0.253 -0.141,0.88 0,0.356 -0.045,0.719 -0.847,0.719 l -0.588,0 0,-1.599 -0.715,0 0,3.856 z m 1.41,-5.234 c 1.754,0 3.132,1.456 3.132,3.275 0,1.821 -1.378,3.276 -3.132,3.276 -1.753,0 -3.13,-1.455 -3.13,-3.276 0,-1.819 1.377,-3.275 3.13,-3.275 z m 0,7.137 c 2.163,0 3.862,-1.731 3.862,-3.862 0,-2.13 -1.699,-3.861 -3.862,-3.861 -2.162,0 -3.859,1.731 -3.859,3.861 0,2.131 1.697,3.862 3.859,3.862'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none'),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		}
	});

var _abadi199$elm_creditcard$CreditCard_Components_Logo_VisaElectron$viewLogo = A2(
	_elm_lang$svg$Svg$g,
	{
		ctor: '::',
		_0: _elm_lang$svg$Svg_Attributes$transform('matrix(0.25000001,0,0,0.25000001,-74.107462,-107.05361)'),
		_1: {
			ctor: '::',
			_0: _elm_lang$svg$Svg_Attributes$id('layer1'),
			_1: {ctor: '[]'}
		}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('matrix(0.92593451,0,0,-0.92593451,112.53737,857.68971)'),
				_1: {
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$id('g4145'),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$path,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$d('m 414.6,326.621 -215.998,0 0,137.208 215.998,0 0,-137.208 z'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$id('path4147'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none'),
								_1: {ctor: '[]'}
							}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$path,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$d('m 202.198,348.917 208.798,0 0,-18.722 -208.798,0 0,18.722 z'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$id('path4149'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$style('fill:#f7b600;fill-opacity:1;fill-rule:nonzero;stroke:none'),
									_1: {ctor: '[]'}
								}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$path,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$d('m 202.198,441.51 208.798,0 0,18.72 -208.798,0 0,-18.72 z'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$id('path4151'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
										_1: {ctor: '[]'}
									}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$g,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$id('g4153'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$g,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$clipPath('url(#clipPath4157)'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$id('g4155'),
												_1: {ctor: '[]'}
											}
										},
										{
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$g,
												{
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$transform('translate(302.4478,424.6084)'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$id('g4161'),
														_1: {ctor: '[]'}
													}
												},
												{
													ctor: '::',
													_0: A2(
														_elm_lang$svg$Svg$path,
														{
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 -10.464,-48.917 -12.656,0 L -12.656,0 0,0 z m 53.24,-31.586 6.664,18.37 3.828,-18.37 -10.492,0 z m 14.127,-17.331 11.701,0 L 68.845,0 58.049,0 C 55.614,0 53.568,-1.413 52.66,-3.586 l -18.99,-45.331 13.29,0 2.636,7.307 16.237,0 1.534,-7.307 z M 34.33,-32.946 c 0.053,12.908 -17.848,13.624 -17.731,19.392 0.043,1.753 1.713,3.62 5.369,4.097 1.811,0.234 6.814,0.421 12.481,-2.19 l 2.217,10.379 c -3.045,1.101 -6.963,2.161 -11.837,2.161 -12.511,0 -21.312,-6.645 -21.382,-16.168 -0.082,-7.044 6.286,-10.97 11.075,-13.316 4.933,-2.396 6.587,-3.936 6.564,-6.077 -0.035,-3.282 -3.939,-4.735 -7.569,-4.789 -6.365,-0.101 -10.055,1.72 -12.998,3.091 l -2.297,-10.723 c 2.961,-1.357 8.418,-2.536 14.07,-2.596 13.3,0 21.999,6.569 22.038,16.739 M -18.085,0 l -20.504,-48.917 -13.378,0 -10.091,39.04 c -0.611,2.399 -1.143,3.282 -3.005,4.296 -3.043,1.653 -8.068,3.199 -12.485,4.161 L -77.25,0 -55.713,0 c 2.741,0 5.209,-1.825 5.836,-4.985 L -44.545,-33.294 -31.382,0 -18.085,0 z'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$id('path4163'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																	_1: {ctor: '[]'}
																}
															}
														},
														{ctor: '[]'}),
													_1: {ctor: '[]'}
												}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$svg$Svg$g,
													{
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$transform('translate(318.6445,362.2266)'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$id('g4165'),
															_1: {ctor: '[]'}
														}
													},
													{
														ctor: '::',
														_0: A2(
															_elm_lang$svg$Svg$path,
															{
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 -5.142,0 0,-4.786 5.752,0 0,-1.439 -7.485,0 0,13.278 7.19,0 0,-1.439 -5.457,0 0,-4.195 L 0,1.419 0,0 z'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$id('path4167'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																		_1: {ctor: '[]'}
																	}
																}
															},
															{ctor: '[]'}),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$svg$Svg$path,
														{
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$d('m 321.911,369.988 1.733,0 0,-13.986 -1.733,0 0,13.986 z'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$id('path4169'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																	_1: {ctor: '[]'}
																}
															}
														},
														{ctor: '[]'}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$svg$Svg$g,
															{
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$transform('translate(333.0977,361.6953)'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$id('g4171'),
																	_1: {ctor: '[]'}
																}
															},
															{
																ctor: '::',
																_0: A2(
																	_elm_lang$svg$Svg$path,
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$d('M 0,0 C 0.02,1.083 -0.453,2.797 -2.403,2.797 -4.176,2.797 -4.925,1.201 -5.063,0 L 0,0 z m -5.082,-1.241 c 0.039,-2.345 1.517,-3.31 3.269,-3.31 1.242,0 2.01,0.217 2.641,0.492 L 1.143,-5.3 c -0.611,-0.275 -1.674,-0.61 -3.192,-0.61 -2.934,0 -4.687,1.95 -4.687,4.826 0,2.876 1.693,5.122 4.471,5.122 3.132,0 3.94,-2.719 3.94,-4.472 0,-0.354 -0.02,-0.61 -0.06,-0.807 l -6.697,0 z'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$id('path4173'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																				_1: {ctor: '[]'}
																			}
																		}
																	},
																	{ctor: '[]'}),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$svg$Svg$g,
																{
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$transform('translate(344.2041,356.3369)'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$id('g4175'),
																		_1: {ctor: '[]'}
																	}
																},
																{
																	ctor: '::',
																	_0: A2(
																		_elm_lang$svg$Svg$path,
																		{
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 c -0.453,-0.217 -1.458,-0.552 -2.738,-0.552 -2.876,0 -4.747,1.95 -4.747,4.866 0,2.935 2.008,5.082 5.121,5.082 1.024,0 1.93,-0.255 2.403,-0.512 l -0.393,-1.32 c -0.415,0.217 -1.065,0.454 -2.01,0.454 -2.187,0 -3.368,-1.635 -3.368,-3.606 0,-2.206 1.418,-3.565 3.309,-3.565 0.985,0 1.635,0.236 2.127,0.453 L 0,0 z'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$id('path4177'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																					_1: {ctor: '[]'}
																				}
																			}
																		},
																		{ctor: '[]'}),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$svg$Svg$g,
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$transform('translate(349.0664,367.8213)'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$id('g4179'),
																			_1: {ctor: '[]'}
																		}
																	},
																	{
																		ctor: '::',
																		_0: A2(
																			_elm_lang$svg$Svg$path,
																			{
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 0,-2.285 2.481,0 0,-1.319 -2.481,0 0,-5.142 c 0,-1.183 0.335,-1.852 1.3,-1.852 0.472,0 0.749,0.039 1.005,0.119 L 2.384,-11.8 c -0.335,-0.118 -0.867,-0.236 -1.537,-0.236 -0.808,0 -1.458,0.276 -1.871,0.728 -0.473,0.533 -0.67,1.379 -0.67,2.502 l 0,5.202 -1.478,0 0,1.319 1.478,0 0,1.773 L 0,0 z'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$id('path4181'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																						_1: {ctor: '[]'}
																					}
																				}
																			},
																			{ctor: '[]'}),
																		_1: {ctor: '[]'}
																	}),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_elm_lang$svg$Svg$g,
																		{
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$transform('translate(353.9688,362.5615)'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$id('g4183'),
																				_1: {ctor: '[]'}
																			}
																		},
																		{
																			ctor: '::',
																			_0: A2(
																				_elm_lang$svg$Svg$path,
																				{
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 c 0,1.123 -0.021,2.088 -0.079,2.975 l 1.517,0 0.079,-1.891 0.058,0 c 0.434,1.28 1.497,2.088 2.659,2.088 0.178,0 0.316,-0.02 0.474,-0.039 l 0,-1.636 C 4.53,1.537 4.354,1.537 4.116,1.537 2.896,1.537 2.028,0.631 1.792,-0.67 1.753,-0.906 1.733,-1.201 1.733,-1.478 l 0,-5.082 L 0,-6.56 0,0 z'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$id('path4185'),
																						_1: {
																							ctor: '::',
																							_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																							_1: {ctor: '[]'}
																						}
																					}
																				},
																				{ctor: '[]'}),
																			_1: {ctor: '[]'}
																		}),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_elm_lang$svg$Svg$g,
																			{
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$transform('translate(361.7861,360.749)'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$id('g4187'),
																					_1: {ctor: '[]'}
																				}
																			},
																			{
																				ctor: '::',
																				_0: A2(
																					_elm_lang$svg$Svg$path,
																					{
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 c 0,-2.088 1.182,-3.664 2.876,-3.664 1.655,0 2.895,1.557 2.895,3.704 0,1.615 -0.807,3.645 -2.856,3.645 C 0.887,3.685 0,1.793 0,0 m 7.545,0.099 c 0,-3.526 -2.463,-5.063 -4.748,-5.063 -2.561,0 -4.569,1.892 -4.569,4.905 0,3.172 2.107,5.043 4.727,5.043 2.738,0 4.59,-1.989 4.59,-4.885'),
																						_1: {
																							ctor: '::',
																							_0: _elm_lang$svg$Svg_Attributes$id('path4189'),
																							_1: {
																								ctor: '::',
																								_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																								_1: {ctor: '[]'}
																							}
																						}
																					},
																					{ctor: '[]'}),
																				_1: {ctor: '[]'}
																			}),
																		_1: {
																			ctor: '::',
																			_0: A2(
																				_elm_lang$svg$Svg$g,
																				{
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$transform('translate(371.9873,362.9561)'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$id('g4191'),
																						_1: {ctor: '[]'}
																					}
																				},
																				{
																					ctor: '::',
																					_0: A2(
																						_elm_lang$svg$Svg$path,
																						{
																							ctor: '::',
																							_0: _elm_lang$svg$Svg_Attributes$d('m 0,0 c 0,1.004 -0.021,1.792 -0.079,2.58 l 1.536,0 0.099,-1.576 0.039,0 c 0.473,0.887 1.576,1.773 3.152,1.773 1.319,0 3.368,-0.788 3.368,-4.057 l 0,-5.674 -1.733,0 0,5.496 c 0,1.536 -0.571,2.817 -2.206,2.817 -1.123,0 -2.01,-0.808 -2.324,-1.773 -0.08,-0.217 -0.119,-0.512 -0.119,-0.808 l 0,-5.732 L 0,-6.954 0,0 z'),
																							_1: {
																								ctor: '::',
																								_0: _elm_lang$svg$Svg_Attributes$id('path4193'),
																								_1: {
																									ctor: '::',
																									_0: _elm_lang$svg$Svg_Attributes$style('fill:#1a1f71;fill-opacity:1;fill-rule:nonzero;stroke:none'),
																									_1: {ctor: '[]'}
																								}
																							}
																						},
																						{ctor: '[]'}),
																					_1: {ctor: '[]'}
																				}),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}),
									_1: {ctor: '[]'}
								}),
							_1: {ctor: '[]'}
						}
					}
				}
			}),
		_1: {ctor: '[]'}
	});

var _abadi199$elm_creditcard$CreditCard_Components_Logo_Mastercard$viewLogo = A2(
	_elm_lang$svg$Svg$g,
	{
		ctor: '::',
		_0: _elm_lang$svg$Svg_Attributes$transform('matrix(0.15316351,0,0,0.15316351,-0.30127262,-0.2867216)'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$path,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('#F90'),
				_1: {
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$d('m298.03,90.5c0.014,48.936-39.646,88.614-88.582,88.627-48.937,0.012-88.614-39.646-88.627-88.582v-0.045c-0.013-48.935,39.647-88.615,88.581-88.628,48.937-0.013,88.615,39.647,88.628,88.583v0.045z'),
					_1: {ctor: '[]'}
				}
			},
			{ctor: '[]'}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$svg$Svg$path,
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$fill('#C00'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$d('M90.001,1.895c-48.646,0.309-88.034,39.886-88.034,88.605,0,48.909,39.695,88.604,88.605,88.604,22.955,0,43.879-8.748,59.624-23.086-0.001,0-0.003-0.002-0.007-0.004h0.019c3.224-2.938,6.231-6.108,8.995-9.488h-18.15c-2.424-2.928-4.627-5.979-6.606-9.127h31.308c1.904-3.047,3.628-6.211,5.158-9.488h-41.635c-1.419-3.042-2.651-6.153-3.703-9.309h49.045c2.956-8.832,4.56-18.281,4.56-28.103,0-6.512-0.706-12.861-2.042-18.974h-54.164c0.671-3.146,1.518-6.254,2.528-9.308h49.063c-1.097-3.25-2.371-6.417-3.82-9.487h-41.48c1.496-3.196,3.191-6.305,5.084-9.307h31.285c-2.082-3.317-4.386-6.486-6.877-9.488h-17.443c2.697-3.174,5.666-6.163,8.889-8.95-15.746-14.34-36.676-23.09-59.636-23.09-0.191,0-0.38-0.001-0.571,0z'),
						_1: {ctor: '[]'}
					}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$path,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$fill('#fcb340'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$d('m289.14,136.82c0.482,0,0.951,0.125,1.409,0.371,0.46,0.246,0.814,0.601,1.07,1.062,0.256,0.456,0.384,0.937,0.384,1.435,0,0.492-0.127,0.968-0.379,1.424-0.251,0.455-0.605,0.81-1.061,1.063-0.451,0.249-0.928,0.375-1.424,0.375s-0.972-0.126-1.426-0.375c-0.455-0.254-0.807-0.607-1.063-1.063-0.252-0.456-0.377-0.932-0.377-1.424,0-0.498,0.127-0.979,0.384-1.435,0.258-0.461,0.614-0.813,1.071-1.062,0.462-0.246,0.931-0.371,1.412-0.371m0,0.475c-0.401,0-0.793,0.104-1.176,0.311-0.38,0.207-0.677,0.5-0.891,0.888-0.217,0.382-0.325,0.778-0.325,1.194,0,0.412,0.106,0.81,0.315,1.188,0.214,0.377,0.51,0.673,0.888,0.885,0.381,0.211,0.776,0.315,1.188,0.315,0.414,0,0.81-0.104,1.189-0.315,0.378-0.212,0.673-0.508,0.884-0.885,0.209-0.378,0.313-0.775,0.313-1.188,0-0.416-0.106-0.813-0.321-1.194-0.213-0.388-0.511-0.681-0.894-0.888-0.379-0.208-0.769-0.311-1.17-0.311m-1.256,3.975v-3.082h1.062c0.36,0,0.622,0.028,0.784,0.088,0.162,0.057,0.291,0.154,0.388,0.297,0.095,0.141,0.144,0.291,0.144,0.451,0,0.226-0.08,0.422-0.242,0.588-0.158,0.166-0.373,0.261-0.639,0.281,0.109,0.045,0.196,0.102,0.264,0.164,0.125,0.12,0.275,0.323,0.455,0.61l0.375,0.603h-0.606l-0.272-0.485c-0.215-0.382-0.388-0.62-0.521-0.718-0.091-0.069-0.224-0.105-0.397-0.105h-0.293v1.311h-0.5m0.496-1.738h0.604c0.288,0,0.483-0.044,0.588-0.129,0.106-0.088,0.159-0.2,0.159-0.342,0-0.092-0.024-0.174-0.075-0.244-0.052-0.073-0.122-0.125-0.213-0.162-0.089-0.035-0.255-0.055-0.497-0.055h-0.564v0.932'),
							_1: {ctor: '[]'}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$g,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$transform('translate(-13.74405,15.9939)'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$path,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$d('m133.72,99.926,1.18-8.02c-0.645,0-1.593,0.279-2.431,0.279-3.284,0-3.694-1.755-3.436-3.037l3.236-16.13h4.992l1.029-9.103h-4.705l0.958-5.516h-9.84c-0.208,0.208-5.568,31.022-5.568,34.776,0,5.555,3.118,8.027,7.516,7.988,3.442-0.029,6.125-0.982,7.071-1.237z'),
										_1: {ctor: '[]'}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$path,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$d('m136.71,84.638c0,13.332,8.799,16.499,16.297,16.499,6.921,0,10.55-1.604,10.55-1.604l1.662-9.1s-5.848,2.378-10.601,2.378c-10.131,0-8.355-7.554-8.355-7.554l19.463,0.059s1.239-6.111,1.239-8.602c0-6.217-3.387-13.849-13.745-13.849-9.486,0.002-16.51,10.223-16.51,21.773zm16.546-13.325c5.324,0,4.342,5.984,4.342,6.469h-10.48c0-0.62,0.989-6.469,6.132-6.469z'),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$path,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$d('m212.99,99.923,1.689-10.284s-4.632,2.321-7.807,2.321c-6.693,0-9.378-5.11-9.378-10.601,0-11.137,5.758-17.265,12.168-17.265,4.808,0,8.665,2.699,8.665,2.699l1.54-9.993s-4.554-3.289-9.456-3.308c-14.745-0.058-23.182,10.208-23.182,27.955,0,11.763,6.248,19.768,17.506,19.768,3.183,0,8.255-1.292,8.255-1.292z'),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$path,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$d('m81.83,63.012c-6.469,0-11.427,2.079-11.427,2.079l-1.37,8.127s4.093-1.663,10.281-1.663c3.513,0,6.083,0.395,6.083,3.25,0,1.734-0.314,2.374-0.314,2.374s-2.772-0.231-4.056-0.231c-9.21,0-16.729,3.482-16.729,13.98,0,8.273,5.623,10.17,9.108,10.17,6.657,0,9.292-4.203,9.444-4.215l-0.077,3.488h8.307l3.706-25.98c0-11.024-9.616-11.378-12.956-11.378zm1.438,21.096c0.181,1.586-0.41,9.086-6.092,9.086-2.93,0-3.691-2.24-3.691-3.562,0-2.584,1.403-5.683,8.315-5.683,1.61,0,1.197,0.116,1.468,0.159z'),
													_1: {ctor: '[]'}
												}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$path,
												{
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$d('m103.62,100.91c2.125,0,14.272,0.541,14.272-11.994,0-11.721-11.244-9.404-11.244-14.114,0-2.342,1.833-3.08,5.184-3.08,1.329,0,6.447,0.423,6.447,0.423l1.189-8.33c0,0.001-3.312-0.741-8.704-0.741-6.979,0-14.063,2.786-14.063,12.318,0,10.802,11.812,9.717,11.812,14.267,0,3.037-3.3,3.287-5.844,3.287-4.401,0-8.363-1.511-8.377-1.438l-1.259,8.245c0.229,0.07,2.674,1.157,10.587,1.157z'),
														_1: {ctor: '[]'}
													}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$svg$Svg$path,
													{
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$d('m290.81,55.455-1.705,12.709s-3.553-4.905-9.112-4.905c-10.459,0-15.849,10.423-15.849,22.396,0,7.73,3.844,15.307,11.699,15.307,5.651,0,8.784-3.941,8.784-3.941l-0.415,3.365h9.178l7.207-44.862-9.787-0.069zm-4.052,24.701c0,4.983-2.468,11.64-7.581,11.64-3.396,0-4.988-2.851-4.988-7.324,0-7.315,3.285-12.14,7.432-12.14,3.394,0,5.137,2.33,5.137,7.824z'),
															_1: {ctor: '[]'}
														}
													},
													{ctor: '[]'}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$svg$Svg$path,
														{
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$d('m30.749,100.42,5.743-33.87,0.844,33.87h6.499l12.125-33.87-5.371,33.87h9.658l7.437-44.919-15.342-0.117-9.126,27.504-0.25-27.387h-14.06l-7.544,44.922h9.387z'),
																_1: {ctor: '[]'}
															}
														},
														{ctor: '[]'}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$svg$Svg$path,
															{
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$d('m176.1,100.49c2.746-15.615,3.724-27.947,11.732-25.393,1.15-6.044,3.891-11.3,5.143-13.858,0,0-0.396-0.589-2.871-0.589-4.225,0-9.866,8.574-9.866,8.574l0.843-5.301h-8.786l-5.884,36.566h9.689z'),
																	_1: {ctor: '[]'}
																}
															},
															{ctor: '[]'}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$svg$Svg$g,
																{
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$transform('translate(845.3001,0)'),
																	_1: {ctor: '[]'}
																},
																{
																	ctor: '::',
																	_0: A2(
																		_elm_lang$svg$Svg$path,
																		{
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$d('m-612.55,63.012c-6.472,0-11.43,2.079-11.43,2.079l-1.369,8.127s4.095-1.663,10.28-1.663c3.514,0,6.083,0.395,6.083,3.25,0,1.734-0.313,2.374-0.313,2.374s-2.771-0.231-4.055-0.231c-9.211,0-16.729,3.482-16.729,13.98,0,8.273,5.622,10.17,9.107,10.17,6.655,0,9.292-4.203,9.443-4.215l-0.078,3.488h8.309l3.705-25.98c0.001-11.025-9.615-11.379-12.953-11.379zm1.436,21.096c0.18,1.586-0.411,9.086-6.092,9.086-2.932,0-3.692-2.24-3.692-3.562,0-2.584,1.402-5.683,8.315-5.683,1.611,0,1.199,0.116,1.469,0.159z'),
																				_1: {ctor: '[]'}
																			}
																		},
																		{ctor: '[]'}),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$svg$Svg$path,
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$fill('#006'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$d('m255.27,100.49c1.508-11.488,4.299-27.616,11.731-25.393,1.149-6.044,0.041-6.028-2.433-6.028-4.228,0-5.164,0.154-5.164,0.154l0.844-5.301h-8.785l-5.884,36.567h9.691v0.001z'),
																			_1: {ctor: '[]'}
																		}
																	},
																	{ctor: '[]'}),
																_1: {ctor: '[]'}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$path,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$d('m122.43,113.06,1.181-8.019c-0.645,0-1.594,0.276-2.431,0.276-3.284,0-3.646-1.746-3.437-3.037l2.66-16.363h4.991l1.205-8.87h-4.706l0.958-5.516h-9.434c-0.208,0.208-5.569,31.023-5.569,34.775,0,5.555,3.119,8.029,7.517,7.989,3.444-0.029,6.126-0.982,7.072-1.236z'),
									_1: {ctor: '[]'}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$path,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$d('m125.42,97.77c0,13.332,8.8,16.5,16.297,16.5,6.92,0,9.965-1.547,9.965-1.547l1.662-9.099s-5.264,2.319-10.018,2.319c-10.13,0-8.356-7.553-8.356-7.553h19.172s1.238-6.113,1.238-8.604c0-6.216-3.094-13.79-13.452-13.79-9.486,0.002-16.508,10.223-16.508,21.774zm16.544-13.325c5.324,0,4.342,5.983,4.342,6.467h-10.474c0-0.618,0.99-6.467,6.132-6.467z'),
										_1: {ctor: '[]'}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$path,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$d('m201.71,113.06,1.688-10.285s-4.629,2.321-7.806,2.321c-6.692,0-9.376-5.11-9.376-10.6,0-11.137,5.758-17.264,12.168-17.264,4.807,0,8.665,2.699,8.665,2.699l1.54-9.993s-5.721-2.315-10.625-2.315c-10.891,0-21.486,9.448-21.486,27.192,0,11.766,5.721,19.537,16.979,19.537,3.183,0.001,8.253-1.292,8.253-1.292z'),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$path,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$d('m70.547,76.143c-6.469,0-11.428,2.079-11.428,2.079l-1.369,8.127s4.093-1.663,10.28-1.663c3.513,0,6.083,0.395,6.083,3.25,0,1.734-0.315,2.374-0.315,2.374s-2.771-0.232-4.054-0.232c-8.159,0-16.73,3.482-16.73,13.98,0,8.272,5.623,10.17,9.108,10.17,6.656,0,9.525-4.319,9.678-4.332l-0.311,3.605h8.307l3.706-25.98c0-11.022-9.615-11.377-12.955-11.377zm2.021,21.154c0.18,1.587-0.995,9.026-6.675,9.026-2.93,0-3.692-2.238-3.692-3.562,0-2.582,1.403-5.682,8.316-5.682,1.608,0.002,1.78,0.174,2.051,0.218z'),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$path,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$d('m92.331,114.04c2.125,0,14.273,0.54,14.273-11.995,0-11.719-11.245-9.404-11.245-14.112,0-2.344,1.833-3.082,5.183-3.082,1.33,0,6.447,0.423,6.447,0.423l1.19-8.33c0,0.001-3.312-0.741-8.704-0.741-6.979,0-14.063,2.786-14.063,12.318,0,10.801,11.812,9.717,11.812,14.267,0,3.037-3.3,3.284-5.843,3.284-4.401,0-8.364-1.51-8.378-1.438l-1.258,8.246c0.228,0.07,2.672,1.16,10.586,1.16z'),
													_1: {ctor: '[]'}
												}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$path,
												{
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$d('m279.85,68.668-2.035,12.627s-3.551-4.905-9.11-4.905c-8.644,0-15.849,10.422-15.849,22.397,0,7.73,3.843,15.304,11.699,15.304,5.651,0,8.784-3.94,8.784-3.94l-0.415,3.365h9.176l7.207-44.863-9.457,0.015zm-4.381,24.62c0,4.983-2.467,11.639-7.582,11.639-3.395,0-4.986-2.85-4.986-7.323,0-7.314,3.285-12.14,7.43-12.14,3.396-0.001,5.138,2.332,5.138,7.824z'),
														_1: {ctor: '[]'}
													}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$svg$Svg$path,
													{
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$d('m19.466,113.56,5.743-33.87,0.843,33.87h6.5l12.125-33.87-5.371,33.87h9.658l7.438-44.928h-14.935l-9.301,27.563-0.484-27.563h-13.767l-7.545,44.923h9.096z'),
															_1: {ctor: '[]'}
														}
													},
													{ctor: '[]'}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$svg$Svg$path,
														{
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$d('m164.82,113.62c2.746-15.616,3.255-28.296,9.808-25.975,1.147-6.044,2.254-8.382,3.506-10.94,0,0-0.587-0.123-1.819-0.123-4.225,0-7.355,5.772-7.355,5.772l0.841-5.301h-8.784l-5.885,36.567h9.688z'),
																_1: {ctor: '[]'}
															}
														},
														{ctor: '[]'}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$svg$Svg$g,
															{
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$transform('translate(847.0062,0)'),
																_1: {ctor: '[]'}
															},
															{
																ctor: '::',
																_0: A2(
																	_elm_lang$svg$Svg$path,
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$d('m-623.53,76.143c-6.469,0-11.428,2.079-11.428,2.079l-1.368,8.127s4.093-1.663,10.28-1.663c3.513,0,6.081,0.395,6.081,3.25,0,1.734-0.313,2.374-0.313,2.374s-2.771-0.232-4.055-0.232c-8.158,0-16.729,3.482-16.729,13.98,0,8.272,5.622,10.17,9.107,10.17,6.656,0,9.525-4.319,9.677-4.332l-0.309,3.605h8.307l3.705-25.981c0.001-11.022-9.615-11.377-12.955-11.377zm2.024,21.154c0.18,1.587-0.996,9.026-6.678,9.026-2.93,0-3.69-2.238-3.69-3.562,0-2.582,1.403-5.682,8.315-5.682,1.608,0.002,1.779,0.174,2.053,0.218z'),
																			_1: {ctor: '[]'}
																		}
																	},
																	{ctor: '[]'}),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$svg$Svg$g,
																{
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$transform('translate(442.2857,0)'),
																	_1: {ctor: '[]'}
																},
																{
																	ctor: '::',
																	_0: A2(
																		_elm_lang$svg$Svg$path,
																		{
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$d('m-198.26,113.62c2.747-15.616,3.256-28.296,9.807-25.975,1.149-6.044,2.257-8.382,3.508-10.94,0,0-0.587-0.123-1.819-0.123-4.225,0-7.355,5.772-7.355,5.772l0.841-5.301h-8.784l-5.885,36.567h9.687z'),
																				_1: {ctor: '[]'}
																			}
																		},
																		{ctor: '[]'}),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$svg$Svg$path,
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$d('m289.1,107.98c0.479,0,0.951,0.123,1.406,0.373,0.459,0.242,0.816,0.598,1.072,1.059,0.257,0.458,0.383,0.935,0.383,1.434,0,0.493-0.126,0.969-0.379,1.424-0.251,0.455-0.604,0.812-1.059,1.063-0.454,0.25-0.93,0.376-1.424,0.376-0.498,0-0.974-0.126-1.429-0.376-0.454-0.253-0.806-0.608-1.058-1.063-0.256-0.455-0.381-0.931-0.381-1.424,0-0.499,0.127-0.976,0.384-1.434,0.258-0.461,0.616-0.815,1.073-1.059,0.461-0.25,0.933-0.373,1.412-0.373m0,0.472c-0.401,0-0.793,0.104-1.176,0.313-0.382,0.204-0.679,0.499-0.894,0.885-0.214,0.381-0.322,0.78-0.322,1.194s0.104,0.81,0.313,1.188c0.213,0.377,0.509,0.673,0.891,0.886,0.378,0.208,0.773,0.313,1.188,0.313,0.412,0,0.81-0.105,1.188-0.313,0.378-0.213,0.674-0.509,0.884-0.886,0.211-0.381,0.314-0.774,0.314-1.188s-0.107-0.813-0.321-1.194c-0.213-0.386-0.51-0.681-0.894-0.885-0.38-0.208-0.769-0.313-1.171-0.313m-1.255,3.976v-3.083h1.061c0.361,0,0.625,0.029,0.785,0.088,0.162,0.055,0.289,0.154,0.388,0.297,0.097,0.142,0.146,0.291,0.146,0.451,0,0.225-0.082,0.422-0.244,0.588-0.158,0.166-0.371,0.262-0.637,0.28,0.106,0.046,0.194,0.101,0.262,0.163,0.123,0.122,0.275,0.326,0.455,0.611l0.377,0.604h-0.609l-0.271-0.485c-0.216-0.383-0.389-0.621-0.521-0.718-0.091-0.071-0.224-0.106-0.399-0.106h-0.291v1.311l-0.502-0.001m0.498-1.735h0.604c0.289,0,0.484-0.043,0.588-0.129,0.105-0.084,0.16-0.199,0.16-0.342,0-0.091-0.025-0.173-0.075-0.242-0.051-0.074-0.122-0.127-0.213-0.164-0.091-0.035-0.254-0.053-0.498-0.053h-0.565v0.93'),
																			_1: {ctor: '[]'}
																		}
																	},
																	{ctor: '[]'}),
																_1: {ctor: '[]'}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});

var _abadi199$elm_creditcard$CreditCard_Components_Logo_Amex$viewLogo = A2(
	_elm_lang$svg$Svg$g,
	{
		ctor: '::',
		_0: _elm_lang$svg$Svg_Attributes$transform('scale(0.8, 0.8)'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$radialGradient,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$id('SVGID_1_'),
				_1: {
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$cy('57.021'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$cx('57.388199'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$gradientTransform('matrix(0.17629284,0,0,0.17629284,-1.3465248,-1.3394739)'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$r('264.58'),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$stop,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$stopColor('#9DD5F6'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$offset('0'),
							_1: {ctor: '[]'}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$stop,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$stopColor('#98D3F5'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$offset('0.0711'),
								_1: {ctor: '[]'}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$stop,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$stopColor('#89CEF3'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$offset('0.1575'),
									_1: {ctor: '[]'}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$stop,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$stopColor('#70C6EF'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$offset('0.2516'),
										_1: {ctor: '[]'}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$stop,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$stopColor('#4EBBEA'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$offset('0.3514'),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$stop,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$stopColor('#23ADE3'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$offset('0.4546'),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$stop,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$stopColor('#0DA6E0'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$offset('0.5'),
													_1: {ctor: '[]'}
												}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$stop,
												{
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$stopColor('#2E77BC'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$offset('1'),
														_1: {ctor: '[]'}
													}
												},
												{ctor: '[]'}),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$svg$Svg$path,
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$fill('url(#SVGID_1_)'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$d('M49.705-8.2572E-7h-49.705v49.885h49.705v-16.463c0.19745-0.28542,0.29494-0.65052,0.29494-1.0969,0-0.5109-0.09749-0.82734-0.29494-1.0939'),
						_1: {ctor: '[]'}
					}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$path,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$d('M 4.4804828,21.585999 3.5242703,19.255938 2.5735229,21.585999 M 25.545714,20.658171 c -0.191981,0.116529 -0.419046,0.120408 -0.691066,0.120408 h -1.697171 v -1.29822 h 1.720265 c 0.243461,0 0.497499,0.01092 0.662509,0.105423 0.181227,0.08515 0.29335,0.266377 0.29335,0.516714 0,0.255449 -0.106657,0.461005 -0.287887,0.555675 z m 12.107442,0.927828 -0.96679,-2.330061 -0.961502,2.330061 h 1.928292 z m -22.569011,2.522046 h -1.432203 l -0.0053,-4.577619 -2.025781,4.577619 H 10.394257 L 8.3631564,19.526371 v 4.581674 H 5.5216683 L 4.9848566,22.80436 H 2.0760246 L 1.5337478,24.108045 H 0.01639523 L 2.518167,18.263233 h 2.075672 l 2.376075,5.533832 v -5.533832 h 2.2801716 l 1.8283334,3.965003 1.679542,-3.965003 h 2.326007 v 5.844812 z m 5.708187,0 H 16.12533 v -5.844812 h 4.667002 v 1.217126 H 17.52245 v 1.053527 h 3.191431 v 1.198086 H 17.52245 v 1.167235 h 3.269882 v 1.208838 z m 6.580307,-4.270693 c 0,0.931883 -0.621963,1.413339 -0.984421,1.557899 0.305693,0.116354 0.566782,0.32191 0.691068,0.49221 0.197272,0.290706 0.231296,0.550387 0.231296,1.072389 v 1.148195 h -1.409108 l -0.0053,-0.73708 c 0,-0.351703 0.03367,-0.857489 -0.220543,-1.138674 -0.204148,-0.205559 -0.515304,-0.250159 -1.018268,-0.250159 h -1.499722 v 2.125913 H 21.7607 v -5.844812 h 3.213288 c 0.713987,0 1.240045,0.01886 1.691705,0.279953 0.441968,0.261089 0.706937,0.642235 0.706937,1.294166 z m 2.235745,4.270693 H 28.18288 v -5.844812 h 1.425504 v 5.844812 z m 16.53768,0 h -1.97977 l -2.648095,-4.386871 v 4.386871 h -2.84519 L 38.129323,22.80436 H 35.22719 l -0.527469,1.303685 h -1.634763 c -0.67908,0 -1.538861,-0.1502 -2.025783,-0.646465 -0.490974,-0.496264 -0.746422,-1.168469 -0.746422,-2.231338 0,-0.866833 0.152669,-1.659269 0.753122,-2.285461 0.451663,-0.46647 1.15895,-0.681548 2.121686,-0.681548 h 1.352519 v 1.252384 h -1.324137 c -0.509838,0 -0.797723,0.07581 -1.075033,0.346239 -0.238171,0.246105 -0.401596,0.711341 -0.401596,1.323959 0,0.626194 0.124465,1.077678 0.384143,1.372617 0.215078,0.231296 0.605919,0.301461 0.973666,0.301461 h 0.627426 l 1.969014,-4.596484 h 2.093302 l 2.365321,5.528367 v -5.528367 h 2.127148 l 2.455761,4.070603 v -4.070603 h 1.430969 v 5.844636 z M 1.7629214e-4,25.256066 H 2.3871814 l 0.5382221,-1.298221 h 1.2049617 l 0.5368117,1.298221 h 4.6966177 v -0.99253 l 0.4192248,0.996759 H 12.22115 l 0.419224,-1.011567 v 1.007338 H 24.31237 l -0.0055,-2.131029 h 0.225832 c 0.158135,0.0055 0.204324,0.0201 0.204324,0.281188 v 1.849841 h 6.036794 v -0.496089 c 0.486922,0.260914 1.244276,0.496089 2.240859,0.496089 h 2.539676 l 0.543511,-1.298221 h 1.204961 l 0.531523,1.298221 h 4.894065 v -1.23317 l 0.741137,1.23317 h 3.921809 v -8.151782 h -3.881222 v 0.962735 l -0.543511,-0.962735 h -3.982631 v 0.962735 l -0.499085,-0.962735 h -5.379578 c -0.900504,0 -1.692058,0.125696 -2.331473,0.47599 v -0.47599 h -3.712374 v 0.47599 c -0.406883,-0.361048 -0.961324,-0.47599 -1.577821,-0.47599 H 11.920922 L 11.010898,19.209749 10.07637,17.104284 H 5.8044421 v 0.962735 L 5.3351506,17.104284 H 1.6918824 L 0,20.980081 v 4.275985 z'),
							_1: {ctor: '[]'}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$path,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$d('m 49.705064,29.567307 h -2.546197 c -0.254215,0 -0.423104,0.0095 -0.565373,0.105598 -0.147379,0.09467 -0.204147,0.235176 -0.204147,0.420636 0,0.220541 0.124464,0.370567 0.305517,0.435444 0.14738,0.0513 0.305691,0.06628 0.538397,0.06628 l 0.757178,0.02028 c 0.764053,0.01885 1.274067,0.150201 1.58505,0.470526 0.05659,0.04459 0.09062,0.09467 0.129575,0.144736 m 0,2.190791 c -0.339364,0.496265 -1.000637,0.747834 -1.895853,0.747834 h -2.697986 v -1.253617 h 2.687055 c 0.266554,0 0.453073,-0.03508 0.565372,-0.144737 0.09731,-0.09044 0.165187,-0.221777 0.165187,-0.381321 0,-0.170299 -0.06787,-0.305517 -0.170653,-0.386611 -0.101367,-0.08921 -0.248925,-0.129752 -0.49221,-0.129752 -1.311794,-0.04459 -2.94832,0.04055 -2.94832,-1.80947 0,-0.847967 0.538396,-1.740539 2.00445,-1.740539 h 2.782782 v -1.163179 h -2.585512 c -0.780271,0 -1.347053,0.18687 -1.748471,0.4774 v -0.4774 h -3.824321 c -0.611561,0 -1.329426,0.151612 -1.668964,0.4774 v -0.4774 h -6.829233 v 0.4774 c -0.543511,-0.392074 -1.460587,-0.4774 -1.883865,-0.4774 h -4.504636 v 0.4774 c -0.429979,-0.416404 -1.386192,-0.4774 -1.969014,-0.4774 h -5.041448 l -1.15366,1.248505 -1.080498,-1.248505 H 9.8843877 v 8.157422 h 7.3891383 l 1.188743,-1.268251 1.119811,1.268251 4.554702,0.0041 v -1.918931 h 0.447784 c 0.604332,0.0093 1.317084,-0.015 1.945922,-0.286827 v 2.201544 h 3.756799 v -2.126126 h 0.18123 c 0.231297,0 0.254036,0.0095 0.254036,0.240638 v 1.885275 h 11.412496 c 0.724563,0 1.481918,-0.18546 1.901318,-0.522002 v 0.522002 h 3.619997 c 0.7533,0 1.488971,-0.105599 2.0487,-0.376032 v -1.519644 z m -5.572795,-2.335527 c 0.272022,0.281539 0.417815,0.636944 0.417815,1.238633 0,1.257673 -0.785736,1.844728 -2.194668,1.844728 h -2.721081 v -1.253617 h 2.71015 c 0.264968,0 0.452896,-0.03508 0.57066,-0.144737 0.09608,-0.09044 0.16501,-0.221777 0.16501,-0.381321 0,-0.170299 -0.07457,-0.305517 -0.170475,-0.386611 -0.106832,-0.08921 -0.254215,-0.129752 -0.4975,-0.129752 -1.306505,-0.04459 -2.94268,0.04055 -2.94268,-1.80947 0,-0.847967 0.532757,-1.740539 1.9974,-1.740539 h 2.800763 v 1.244275 h -2.562769 c -0.254038,0 -0.419224,0.0095 -0.559729,0.1056 -0.153022,0.09467 -0.209789,0.235175 -0.209789,0.420635 0,0.220542 0.129929,0.370567 0.305691,0.435443 0.147382,0.0513 0.305692,0.06629 0.543688,0.06629 l 0.752066,0.02027 c 0.758411,0.01851 1.279004,0.149673 1.595448,0.470173 z m -12.606348,-0.36105 c -0.18687,0.110888 -0.41799,0.120407 -0.689832,0.120407 H 29.138916 V 29.5324 h 1.720265 c 0.24875,0 0.497676,0.0053 0.66674,0.1056 0.181053,0.09467 0.289296,0.275721 0.289296,0.525881 0,0.250161 -0.108243,0.451662 -0.289296,0.56114 z m 0.843736,0.727559 c 0.310983,0.114768 0.565196,0.320502 0.68437,0.4908 0.197272,0.285419 0.225832,0.551798 0.231472,1.067102 v 1.158948 h -1.402584 v -0.731438 c 0,-0.351706 0.03384,-0.872475 -0.225833,-1.144318 -0.204147,-0.209435 -0.515303,-0.2595 -1.024965,-0.2595 h -1.493024 v 2.135257 h -1.40382 v -5.846223 h 3.225452 c 0.707288,0 1.222417,0.0312 1.680955,0.275898 0.440907,0.266379 0.718217,0.631305 0.718217,1.298221 -1.75e-4,0.933118 -0.622492,1.409285 -0.99024,1.555254 z m 1.76487,-3.129373 h 4.662769 v 1.209016 H 35.52583 v 1.062869 h 3.191605 V 31.78789 H 35.52583 v 1.163181 l 3.271466,0.0053 v 1.213071 h -4.662769 v -5.846188 z m -9.42585,2.697988 h -1.805416 v -1.488794 h 1.821635 c 0.504372,0 0.854492,0.205557 0.854492,0.716807 0,0.505606 -0.333899,0.771987 -0.870711,0.771987 z m -3.196895,2.616537 -2.144955,-2.381363 2.144955,-2.305734 v 4.687097 z m -5.539298,-0.686661 h -3.43489 v -1.16318 h 3.067144 v -1.192798 h -3.067144 v -1.062869 h 3.502587 l 1.528106,1.703695 -1.595803,1.715152 z m 11.106802,-2.701863 c 0,1.624009 -1.211661,1.959317 -2.43284,1.959317 h -1.743185 v 1.960906 h -2.715437 l -1.720267,-1.935342 -1.787785,1.935342 h -5.533833 v -5.846223 h 5.618982 l 1.718854,1.916303 1.777033,-1.916303 h 4.464088 c 1.108705,0 2.35439,0.306925 2.35439,1.926 z'),
								_1: {ctor: '[]'}
							}
						},
						{ctor: '[]'}),
					_1: {ctor: '[]'}
				}
			}
		}
	});

var _abadi199$elm_creditcard$CreditCard_Components_Logo_Discover$viewLogo = A2(
	_elm_lang$svg$Svg$g,
	{
		ctor: '::',
		_0: _elm_lang$svg$Svg_Attributes$transform('scale(0.5, 0.5)'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$defs,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$id('defs78273'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$radialGradient,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$cx('121.25'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$cy('97.588577'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$r('77.916664'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$fx('141.25'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$fy('77.588577'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$id('radialGradient72834'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$xlinkHref('#radialGradient3202'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$radialGradient,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$cx('121.25'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$cy('97.588577'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$r('77.916664'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$fx('141.25'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$fy('77.588577'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$id('radialGradient3202'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$stop,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$id('stop2891'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$style('stop-color:#f0f0f0;stop-opacity:1'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$offset('0'),
											_1: {ctor: '[]'}
										}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$stop,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$id('stop2893'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$style('stop-color:#ff8330;stop-opacity:1'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$offset('1'),
												_1: {ctor: '[]'}
											}
										}
									},
									{ctor: '[]'}),
								_1: {ctor: '[]'}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$radialGradient,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$cx('121.25'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$cy('97.588577'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$r('77.916664'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$fx('141.25'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$fy('77.588577'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$id('radialGradient78349'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$xlinkHref('#radialGradient3202'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									}
								}
							},
							{ctor: '[]'}),
						_1: {ctor: '[]'}
					}
				}
			}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$svg$Svg$g,
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$transform('translate(-252.14253,-303.04125)'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$id('layer1'),
						_1: {ctor: '[]'}
					}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$g,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$transform('translate(-628.57143,740)'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$id('g78333'),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$g,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$id('g78318'),
									_1: {ctor: '[]'}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$path,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$d('m 900.9559,-406.27234 c -3.25849,3.02096 -7.92857,3.20391 -12.13479,3.13451 -0.81555,0.19363 -0.29025,-0.95359 -0.43813,-1.42763 0,-8.20059 0,-16.40117 0,-24.60175 4.1568,-0.0406 8.73662,-0.0667 12.09187,2.76255 5.04763,4.0191 6.14216,11.8108 2.8212,17.2525 -0.62941,1.07002 -1.41189,2.05395 -2.34015,2.88024 m -8.9658,-29.56795 c -3.75872,0 -7.51743,0 -11.27614,0 0,13.12233 0,26.24466 0,39.36699 4.54471,-0.0376 9.09338,0.0858 13.63493,-0.0845 4.94856,-0.24946 9.80815,-2.31386 13.2181,-5.94642 4.65786,-4.72998 6.56553,-11.86236 5.04763,-18.30679 -1.2297,-5.98926 -5.67803,-11.10148 -11.35798,-13.30835 -2.93127,-1.19555 -6.10934,-1.72289 -9.26727,-1.72149'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$id('path32942'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
													_1: {ctor: '[]'}
												}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$path,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$d('m 916.65395,-396.48059 c 2.55919,0 5.11837,0 7.67756,0 0,-13.12233 0,-26.24466 0,-39.36699 -2.55919,0 -5.11837,0 -7.67756,0 0,13.12233 0,26.24466 0,39.36699 z'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$id('path32944'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
														_1: {ctor: '[]'}
													}
												}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$path,
												{
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$d('m 943.10209,-420.75162 c -2.03076,-0.85735 -4.51131,-1.4866 -5.67601,-3.52642 -1.0168,-2.23871 0.69407,-4.74723 2.89161,-5.38053 2.76966,-1.02843 6.00074,-0.1619 7.98965,1.99193 0.63523,1.28453 1.12072,0.33686 1.64137,-0.38931 1.04129,-1.36394 2.08258,-2.72787 3.12387,-4.09181 -4.63849,-4.13536 -11.76185,-5.73042 -17.5022,-3.04469 -4.03798,1.84684 -6.70107,6.26106 -6.32932,10.70418 0.0113,2.8491 1.41524,5.64559 3.82349,7.2099 3.44272,2.50815 7.83161,3.08435 11.43369,5.27365 2.73978,1.7753 2.60111,6.09931 0.12709,8.03537 -2.96954,2.37171 -7.54679,1.54249 -10.22162,-0.89694 -1.04956,-0.56026 -1.65825,-2.68186 -2.43741,-2.74705 -1.58093,1.52336 -3.16186,3.04673 -4.74278,4.57009 2.41761,3.73052 6.24954,6.72458 10.75131,7.29027 5.01637,0.81312 10.73163,-0.56631 13.89885,-4.77883 2.70451,-3.55589 3.24872,-8.53967 1.77938,-12.70638 -1.52008,-3.72809 -5.49433,-5.49498 -8.98236,-6.91769 -0.5198,-0.20585 -1.04277,-0.40365 -1.56789,-0.59553'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$id('path32946'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
															_1: {ctor: '[]'}
														}
													}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$svg$Svg$path,
													{
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$d('m 956.8522,-416.16825 c -0.1037,7.16263 3.85678,14.2301 10.12149,17.74546 6.11365,3.55063 13.98906,3.7163 20.2797,0.50334 0,-3.01433 0,-6.02866 0,-9.043 -2.46882,2.635 -5.93054,4.5414 -9.62737,4.30699 -4.89301,0.0132 -9.72761,-2.9141 -11.63389,-7.48159 -2.58339,-5.77683 -1.08853,-13.34435 4.14738,-17.14025 4.41726,-3.38117 11.14219,-3.3146 15.35685,0.38893 0.94703,0.75777 2.0983,2.34375 1.75734,0.338 0,-2.59938 0,-5.19876 0,-7.79814 -4.82842,-2.66951 -10.71688,-3.11258 -15.94426,-1.42523 -7.41788,2.25756 -13.25772,8.99436 -14.25455,16.70954 -0.13524,0.95906 -0.20222,1.92764 -0.20217,2.89616'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$id('path32948'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
																_1: {ctor: '[]'}
															}
														}
													},
													{ctor: '[]'}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$svg$Svg$path,
														{
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$d('m 1048.1446,-409.39736 c -3.501,-8.81119 -7.0021,-17.62237 -10.5032,-26.43355 -2.7939,0 -5.5878,0 -8.3817,0 5.5677,13.45705 11.1355,26.91411 16.7033,40.37116 1.3797,0 2.7595,0 4.1393,0 5.6649,-13.45705 11.3299,-26.91411 16.9949,-40.37116 -2.7739,0 -5.5478,0 -8.3216,0 -3.5438,8.81118 -7.0876,17.62236 -10.6314,26.43355'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$id('path32950'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
																	_1: {ctor: '[]'}
																}
															}
														},
														{ctor: '[]'}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$svg$Svg$path,
															{
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$d('m 1070.5615,-396.48059 c 7.2598,0 14.5195,0 21.7793,0 0,-2.22425 0,-4.44851 0,-6.67276 -4.7004,0 -9.4007,0 -14.1011,0 0,-3.541 0,-7.082 0,-10.62301 4.5257,0 9.0514,0 13.5772,0 0,-2.2214 0,-4.44281 0,-6.66422 -4.5258,0 -9.0515,0 -13.5772,0 0,-2.91415 0,-5.82831 0,-8.74247 4.7004,0 9.4007,0 14.1011,0 0,-2.2214 0,-4.44281 0,-6.66422 -7.2598,0 -14.5195,0 -21.7793,0'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$id('path32952'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
																		_1: {ctor: '[]'}
																	}
																}
															},
															{ctor: '[]'}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$svg$Svg$path,
																{
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$d('m 1107.343,-417.73076 c -0.75,0 -1.5,0 -2.25,0 0,-3.9733 0,-7.9466 0,-11.91989 2.8414,0.009 6.0738,-0.25883 8.2918,1.86879 1.9593,2.07267 1.929,5.66563 0.1904,7.8616 -1.5251,1.77184 -4.0116,2.18323 -6.2322,2.1896 m 15.4064,-6.50099 c 0.1171,-3.79516 -1.6949,-7.72742 -5.1018,-9.59097 -3.6375,-2.1661 -7.9642,-2.0628 -12.0529,-2.02892 -2.7235,0 -5.447,0 -8.1705,0 0,13.12233 0,26.24466 0,39.367 2.5563,0 5.1127,0 7.669,0 0,-5.27297 0,-10.54593 0,-15.81889 0.6328,-0.0712 1.2177,-0.0524 1.4398,0.6473 3.3988,5.05719 6.7976,10.11439 10.1963,15.17159 3.1461,0 6.2921,0 9.4381,0 -4.1309,-5.52783 -8.2618,-11.05565 -12.3928,-16.58348 3.696,-0.6355 7.1831,-3.13285 8.3109,-6.81176 0.4732,-1.39826 0.6635,-2.88044 0.6635,-4.35291'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$id('path32954'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
																			_1: {ctor: '[]'}
																		}
																	}
																},
																{ctor: '[]'}),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$svg$Svg$path,
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$d('m 1127.4057,-433.35589 c -0.1453,0.0426 -0.1544,-0.051 -0.1374,-0.17076 0,-0.24364 0,-0.48728 0,-0.73092 0.2716,-0.005 0.6389,-0.008 0.7504,0.29372 0.1334,0.34349 -0.2082,0.63871 -0.5379,0.60615 l -0.037,0.001 -0.038,4.5e-4 z m 1.4599,-0.4723 c 0.025,-0.44035 -0.2703,-0.86545 -0.6975,-0.98375 -0.4596,-0.14327 -0.9457,-0.0728 -1.419,-0.0898 -0.096,0.0114 -0.2377,-0.0228 -0.3053,0.0171 0,1.15369 0,2.30738 0,3.46107 0.2748,0 0.5496,0 0.8245,0 0,-0.44945 0,-0.89889 0,-1.34834 0.3234,0.44945 0.6469,0.89889 0.9704,1.34834 0.3378,0 0.6756,0 1.0134,0 -0.3808,-0.47806 -0.7615,-0.95612 -1.1422,-1.43418 0.4508,-0.0986 0.7745,-0.50644 0.7557,-0.97042'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$id('path32956'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
																				_1: {ctor: '[]'}
																			}
																		}
																	},
																	{ctor: '[]'}),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_elm_lang$svg$Svg$path,
																		{
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$d('m 1127.7078,-430.64754 c -1.0665,0.0188 -2.0583,-0.77246 -2.3215,-1.79824 -0.307,-1.05526 0.1534,-2.29094 1.1172,-2.83931 0.8572,-0.52186 2.0396,-0.40493 2.772,0.28363 0.8462,0.74038 1.075,2.06683 0.539,3.0527 -0.3982,0.7754 -1.2281,1.31028 -2.1067,1.30122 z m 0.018,-5.51338 c -1.1417,-0.0169 -2.2551,0.67612 -2.7355,1.71329 -0.5241,1.07097 -0.3399,2.44368 0.4671,3.3258 0.8006,0.92262 2.1887,1.27113 3.326,0.81857 1.1309,-0.42347 1.9314,-1.57967 1.9307,-2.78718 0.032,-1.24744 -0.7928,-2.45737 -1.9649,-2.88465 -0.3263,-0.12278 -0.6747,-0.18609 -1.0234,-0.18583 z'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$id('path32958'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
																					_1: {ctor: '[]'}
																				}
																			}
																		},
																		{ctor: '[]'}),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_elm_lang$svg$Svg$g,
																			{
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$transform('matrix(1.0416753,0,0,1.0416753,336.08661,-1522.2191)'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$id('g39066'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$style('fill:#211e1e'),
																						_1: {ctor: '[]'}
																					}
																				}
																			},
																			{
																				ctor: '::',
																				_0: A2(
																					_elm_lang$svg$Svg$use,
																					{
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$id('use39068'),
																						_1: {
																							ctor: '::',
																							_0: _elm_lang$svg$Svg_Attributes$x('185.9502'),
																							_1: {
																								ctor: '::',
																								_0: _elm_lang$svg$Svg_Attributes$y('734.22101'),
																								_1: {
																									ctor: '::',
																									_0: _elm_lang$svg$Svg_Attributes$width('240.00002'),
																									_1: {
																										ctor: '::',
																										_0: _elm_lang$svg$Svg_Attributes$height('40.017803'),
																										_1: {
																											ctor: '::',
																											_0: _elm_lang$svg$Svg_Attributes$xlinkHref('#acj'),
																											_1: {ctor: '[]'}
																										}
																									}
																								}
																							}
																						}
																					},
																					{ctor: '[]'}),
																				_1: {ctor: '[]'}
																			}),
																		_1: {
																			ctor: '::',
																			_0: A2(
																				_elm_lang$svg$Svg$g,
																				{
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$transform('matrix(0.2659827,0,0,0.2659859,984.43476,-443.07312)'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$id('layer1-2'),
																						_1: {ctor: '[]'}
																					}
																				},
																				{
																					ctor: '::',
																					_0: A2(
																						_elm_lang$svg$Svg$path,
																						{
																							ctor: '::',
																							_0: _elm_lang$svg$Svg_Attributes$d('m 199.16666,97.588577 a 77.916664,77.916664 0 1 1 -155.833324,0 77.916664,77.916664 0 1 1 155.833324,0 z'),
																							_1: {
																								ctor: '::',
																								_0: _elm_lang$svg$Svg_Attributes$transform('translate(-25.8333,3.33333)'),
																								_1: {
																									ctor: '::',
																									_0: _elm_lang$svg$Svg_Attributes$id('path3194'),
																									_1: {
																										ctor: '::',
																										_0: _elm_lang$svg$Svg_Attributes$style('fill:url(#radialGradient78349)'),
																										_1: {ctor: '[]'}
																									}
																								}
																							}
																						},
																						{ctor: '[]'}),
																					_1: {ctor: '[]'}
																				}),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}),
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}),
			_1: {ctor: '[]'}
		}
	});

var _abadi199$elm_creditcard$CreditCard_Components_Logo_Maestro$viewLogo = A2(
	_elm_lang$svg$Svg$g,
	{
		ctor: '::',
		_0: _elm_lang$svg$Svg_Attributes$transform('matrix(0.36106379,0,0,0.36106379,-164.94919,-227.58523)'),
		_1: {ctor: '[]'}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$path,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('#0066cb'),
				_1: {
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$d('m520.2,696.93c7.598-6.875,12.347-16.811,12.347-27.854,0-11.042-4.749-20.97-12.347-27.846-6.648-6.044-15.531-9.722-25.196-9.722-20.783,0-37.599,16.819-37.599,37.568,0,20.757,16.816,37.576,37.599,37.576,9.664,0.001,18.547-3.685,25.196-9.722'),
					_1: {ctor: '[]'}
				}
			},
			{ctor: '[]'}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$svg$Svg$path,
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$fill('#0066cb'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$d('m520.2,696.93c7.598-6.875,12.347-16.811,12.347-27.854,0-11.042-4.749-20.97-12.347-27.846'),
						_1: {ctor: '[]'}
					}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$path,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$d('m520.2,696.93c7.598-6.875,12.347-16.811,12.347-27.854,0-11.042-4.749-20.97-12.347-27.846'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$stroke('#0066cb'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$strokeWidth('0.30970001'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$fill('none'),
									_1: {ctor: '[]'}
								}
							}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$path,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$fill('#cc0001'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$d('m545.46,631.5c-9.721,0-18.604,3.678-25.252,9.722-1.341,1.236-2.626,2.564-3.799,3.983h7.598c1.062,1.259,2.012,2.587,2.85,3.976h-13.297c-0.782,1.274-1.508,2.602-2.179,3.976h17.654c0.614,1.29,1.117,2.617,1.564,3.983h-20.783c-0.447,1.29-0.838,2.618-1.117,3.976h23.018c0.559,2.564,0.838,5.227,0.838,7.952,0,4.173-0.671,8.188-1.956,11.935h-20.782c0.447,1.365,0.95,2.693,1.564,3.982h17.654c-0.671,1.375-1.341,2.702-2.179,3.977h-13.297c0.838,1.389,1.844,2.717,2.85,3.977h7.598c-1.173,1.418-2.458,2.746-3.799,3.982,6.648,6.037,15.531,9.723,25.252,9.723,20.727,0,37.543-16.819,37.543-37.576,0-20.749-16.817-37.568-37.543-37.568'),
								_1: {ctor: '[]'}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$path,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$fill('#231f20'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$d('m579.03,689.94h0.168c0.057,0,0.111,0.008,0.111-0.016,0.057-0.03,0.112-0.076,0.112-0.121,0-0.047-0.056-0.092-0.112-0.115,0-0.023-0.111-0.016-0.111-0.016h-0.168v0.268zm0,0.61h-0.223v-1.068h0.447c0.111,0,0.167,0,0.279,0.054,0.056,0.061,0.111,0.16,0.111,0.268,0,0.121-0.056,0.229-0.168,0.273l0.168,0.474h-0.279l-0.111-0.427h-0.225v0.426h0.001zm0.168,0.39c0.503,0,0.95-0.412,0.95-0.924s-0.447-0.924-0.95-0.924c-0.502,0-0.894,0.412-0.894,0.924s0.392,0.924,0.894,0.924zm-1.229-0.924c0-0.672,0.559-1.213,1.229-1.213,0.671,0,1.229,0.541,1.229,1.213s-0.559,1.213-1.229,1.213-1.229-0.541-1.229-1.213'),
									_1: {ctor: '[]'}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$path,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$fill('#231f20'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$d('m489.14,679.53h-4.749l2.793-14.645-6.425,14.645h-3.911l-0.782-14.561-3.128,14.561h-4.302l3.631-19.047h7.431l0.111,11.79,5.14-11.79h7.877l-3.686,19.047'),
										_1: {ctor: '[]'}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$path,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$fill('#231f20'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$d('m541.38,679.34c-1.285,0.352-2.291,0.504-3.352,0.504-2.402,0-3.688-1.198-3.688-3.403,0-0.435,0-0.9,0.111-1.39l0.279-1.518,0.224-1.221,2.179-11.829h4.637l-0.67,3.556h2.402l-0.67,3.762h-2.402l-1.229,6.464c-0.056,0.289-0.056,0.496-0.056,0.641,0,0.801,0.447,1.152,1.564,1.152,0.559,0,0.949-0.045,1.285-0.145l-0.614,3.427'),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$path,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$fill('#231f20'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$d('m522.83,668.93c0,1.961,1.062,3.305,3.575,4.319,1.9,0.779,2.234,1.008,2.234,1.71,0,0.97-0.838,1.403-2.736,1.403-1.397,0-2.738-0.189-4.246-0.617l-0.615,3.578,0.168,0.031,0.894,0.16c0.279,0.046,0.671,0.092,1.229,0.137,1.117,0.084,2.011,0.131,2.625,0.131,4.973,0,7.264-1.641,7.264-5.174,0-2.122-0.95-3.373-3.297-4.313-2.011-0.786-2.234-0.954-2.234-1.678,0-0.84,0.782-1.267,2.291-1.267,0.949,0,2.234,0.092,3.407,0.237l0.671-3.587c-1.229-0.168-3.073-0.305-4.135-0.305-5.307,0-7.151,2.381-7.095,5.235'),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$path,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$fill('#231f20'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$d('m501.1,672.63c-0.502-0.054-0.726-0.068-1.062-0.068-2.625,0-3.966,0.793-3.966,2.357,0,0.961,0.67,1.58,1.676,1.58,1.899,0.001,3.296-1.579,3.352-3.869zm3.184,6.899h-3.911l0.112-1.61c-1.229,1.274-2.793,1.877-4.917,1.877-2.57,0-4.302-1.725-4.302-4.228,0-3.777,3.017-5.975,8.212-5.975,0.559,0,1.229,0.037,1.9,0.121,0.167-0.511,0.223-0.732,0.223-1.007,0-1.03-0.838-1.412-3.017-1.412-1.341,0-2.849,0.168-3.911,0.435l-0.615,0.16-0.447,0.099,0.67-3.479c2.346-0.596,3.854-0.824,5.586-0.824,4.022,0,6.146,1.572,6.146,4.548,0,0.763-0.056,1.343-0.391,3.068l-0.95,5.494-0.167,0.984-0.112,0.786-0.112,0.542v0.421'),
													_1: {ctor: '[]'}
												}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$path,
												{
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$fill('#231f20'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$d('m517.36,669.97c0-0.32,0.056-0.587,0.056-0.786,0-1.259-0.838-2-2.235-2-1.508,0-2.57,0.992-2.961,2.777l5.14,0.009zm2.29,9.219c-1.62,0.428-3.185,0.633-4.805,0.625-5.251,0-7.933-2.381-7.933-6.936,0-5.319,3.464-9.234,8.157-9.234,3.854,0,6.313,2.19,6.313,5.631,0,1.146-0.168,2.251-0.615,3.823h-9.274c-0.056,0.236-0.056,0.344-0.056,0.488,0,1.793,1.397,2.709,4.134,2.709,1.676,0,3.185-0.297,4.861-0.977l-0.782,3.871'),
														_1: {ctor: '[]'}
													}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$svg$Svg$path,
													{
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$fill('#231f20'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$d('m564.79,670.65c0-1.618-0.67-3.152-2.569-3.152-2.402,0-3.854,2.824-3.854,5.311,0,2.099,1.005,3.511,2.682,3.479,1.005,0,3.184-1.381,3.575-3.793,0.11-0.556,0.166-1.173,0.166-1.845zm4.749,1.853c-0.671,5.151-4.302,7.434-9.106,7.434-5.252,0-7.375-3.205-7.375-7.135,0-5.495,3.576-9.211,9.163-9.211,4.86,0,7.431,3.06,7.431,6.991-0.001,0.953-0.001,1.021-0.113,1.921'),
															_1: {ctor: '[]'}
														}
													},
													{ctor: '[]'}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$svg$Svg$path,
														{
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$d('m571.1,677.15h0.167l0.112-0.023c0.055-0.023,0.056-0.076,0.056-0.122,0-0.038,0-0.084-0.056-0.106,0-0.023-0.112-0.023-0.167-0.023h-0.11v0.274zm0,0.603h-0.224v-1.068h0.447c0.056,0,0.168,0.008,0.279,0.062,0.056,0.053,0.111,0.16,0.111,0.267,0,0.114-0.056,0.229-0.167,0.274l0.167,0.466h-0.279l-0.168-0.42h-0.17v0.419zm0.167,0.389c0.504,0,0.895-0.412,0.895-0.924,0-0.504-0.391-0.916-0.895-0.916-0.502,0-0.949,0.412-0.949,0.916,0,0.512,0.447,0.924,0.949,0.924zm-1.228-0.924c0-0.664,0.559-1.205,1.229-1.205,0.671,0,1.229,0.541,1.229,1.205,0,0.672-0.559,1.213-1.229,1.213-0.671,0-1.229-0.541-1.229-1.213'),
																_1: {ctor: '[]'}
															}
														},
														{ctor: '[]'}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$svg$Svg$path,
															{
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$d('m490.32,678.43h-4.693l2.793-14.644-6.425,14.644h-4.246l-0.782-14.552-2.793,14.552h-4.246l3.631-19.047h7.318l0.335,11.798,5.196-11.798h7.598l-3.686,19.047'),
																	_1: {ctor: '[]'}
																}
															},
															{ctor: '[]'}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$svg$Svg$path,
																{
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$d('m542.55,678.25c-1.285,0.351-2.291,0.503-3.353,0.503-2.402,0-3.688-1.205-3.688-3.402,0-0.436,0.056-0.9,0.112-1.389l0.279-1.52,0.223-1.229,2.18-11.828h4.637l-0.67,3.556h2.402l-0.671,3.77h-2.402l-1.229,6.463c-0.056,0.283-0.056,0.496-0.056,0.642,0,0.802,0.503,1.145,1.62,1.145,0.503,0,0.895-0.046,1.229-0.146l-0.613,3.435'),
																		_1: {ctor: '[]'}
																	}
																},
																{ctor: '[]'}),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$svg$Svg$path,
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$fill('#231f20'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$d('m554.56,667.39-0.111-0.488,0.95-2.427c-0.225-0.023-0.336-0.03-0.336-0.045-0.279-0.054-0.391-0.084-0.447-0.084-0.111-0.031-0.279-0.038-0.446-0.038-1.564,0-2.626,0.679-4.079,2.511l0.504-2.755h-4.861l-2.85,15.468h4.638c0.614-3.549,0.894-5.57,1.285-7.25,0.614-2.785,2.682-4.052,4.19-3.77,0.167,0.031,0.279,0.031,0.502,0.115l0.279,0.106,0.782-1.343'),
																			_1: {ctor: '[]'}
																		}
																	},
																	{ctor: '[]'}),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_elm_lang$svg$Svg$path,
																		{
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$d('m556.18,663.07c-0.391-0.153-0.447-0.153-0.502-0.168-0.225-0.054-0.392-0.084-0.392-0.092-0.167-0.023-0.335-0.038-0.503-0.038-1.508,0-2.625,0.687-4.078,2.519l0.447-2.351h-4.246l-2.85,15.491h4.693c1.676-9.47,2.402-11.133,4.637-11.133,0.168,0,0.335,0.015,0.559,0.038l0.559,0.114,1.676-4.38'),
																				_1: {ctor: '[]'}
																			}
																		},
																		{ctor: '[]'}),
																	_1: {
																		ctor: '::',
																		_0: A2(
																			_elm_lang$svg$Svg$path,
																			{
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$d('m524,667.84c0,1.953,1.117,3.304,3.632,4.319,1.899,0.771,2.179,1,2.179,1.71,0,0.961-0.838,1.396-2.682,1.396-1.453,0-2.738-0.191-4.246-0.611l-0.67,3.572,0.223,0.037,0.838,0.152c0.279,0.055,0.727,0.1,1.285,0.139,1.117,0.084,1.955,0.129,2.57,0.129,5.027,0,7.318-1.633,7.318-5.166,0-2.129-0.949-3.373-3.352-4.312-1.955-0.786-2.18-0.961-2.18-1.687,0-0.832,0.783-1.259,2.291-1.259,0.949,0,2.179,0.084,3.408,0.229l0.67-3.586c-1.229-0.168-3.072-0.306-4.189-0.306-5.251,0.001-7.095,2.382-7.095,5.244'),
																					_1: {ctor: '[]'}
																				}
																			},
																			{ctor: '[]'}),
																		_1: {
																			ctor: '::',
																			_0: A2(
																				_elm_lang$svg$Svg$path,
																				{
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$d('m502.1,671.53c-0.503-0.053-0.727-0.061-1.062-0.061-2.626,0-3.967,0.793-3.967,2.357,0,0.962,0.615,1.58,1.676,1.58,1.9,0.001,3.241-1.587,3.353-3.876zm3.407,6.898h-3.91l0.112-1.602c-1.173,1.273-2.793,1.869-4.917,1.869-2.514,0-4.246-1.725-4.246-4.228,0-3.771,3.017-5.975,8.212-5.975,0.503,0,1.173,0.045,1.899,0.122,0.112-0.512,0.167-0.725,0.167-1.007,0-1.023-0.838-1.404-3.017-1.404-1.341,0-2.85,0.16-3.855,0.427l-0.67,0.168-0.391,0.1,0.615-3.488c2.346-0.595,3.854-0.816,5.586-0.816,4.022,0,6.146,1.572,6.146,4.541,0,0.763-0.056,1.343-0.335,3.067l-1.006,5.503-0.167,0.984-0.112,0.786-0.056,0.533-0.054,0.42'),
																						_1: {ctor: '[]'}
																					}
																				},
																				{ctor: '[]'}),
																			_1: {
																				ctor: '::',
																				_0: A2(
																					_elm_lang$svg$Svg$path,
																					{
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																						_1: {
																							ctor: '::',
																							_0: _elm_lang$svg$Svg_Attributes$d('m518.36,668.88v-0.794c0-1.259-0.782-1.992-2.179-1.992-1.508,0-2.57,0.984-3.017,2.778l5.196,0.008zm2.459,9.218c-1.565,0.42-3.129,0.626-4.75,0.626-5.251,0-7.989-2.381-7.989-6.944,0-5.311,3.463-9.226,8.156-9.226,3.855,0,6.313,2.19,6.313,5.624,0,1.145-0.168,2.259-0.56,3.83h-9.273c-0.056,0.237-0.056,0.344-0.056,0.488,0,1.794,1.396,2.71,4.078,2.71,1.676,0,3.185-0.306,4.86-0.985l-0.779,3.877'),
																							_1: {ctor: '[]'}
																						}
																					},
																					{ctor: '[]'}),
																				_1: {
																					ctor: '::',
																					_0: A2(
																						_elm_lang$svg$Svg$path,
																						{
																							ctor: '::',
																							_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
																							_1: {
																								ctor: '::',
																								_0: _elm_lang$svg$Svg_Attributes$d('m565.9,669.42c0-1.618-0.67-3.151-2.569-3.151-2.402,0-3.854,2.823-3.854,5.311,0,2.106,1.006,3.519,2.682,3.487,1.006,0,3.184-1.381,3.575-3.793,0.111-0.565,0.166-1.182,0.166-1.854zm4.861,1.985c-0.727,5.15-4.303,7.439-9.106,7.439-5.308,0-7.431-3.213-7.431-7.143,0-5.487,3.631-9.21,9.219-9.21,4.859,0,7.43,3.06,7.43,6.99,0,0.961,0,1.023-0.112,1.924'),
																								_1: {ctor: '[]'}
																							}
																						},
																						{ctor: '[]'}),
																					_1: {ctor: '[]'}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});

var _abadi199$elm_creditcard$CreditCard_Components_Logo_JCB$viewLogo = A2(
	_elm_lang$svg$Svg$g,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$defs,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$style,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$type_('text/css'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg$text('.fil0 {fill:white}.fil1 {fill:url(#id0)}.fil3 {fill:url(#id1)}.fil2 {fill:url(#id2)}'),
						_1: {ctor: '[]'}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$linearGradient,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$id('id0'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$y2('43.335'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$x2('106.25'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$y1('43.335'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$x1('75.414'),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$stop,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$stopColor('#007B40'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$offset('0'),
										_1: {ctor: '[]'}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$stop,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$stopColor('#55B330'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$offset('1'),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {ctor: '[]'}
							}
						}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$linearGradient,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$id('id1'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$y2('43.335'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$x2('71.666'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$y1('43.335'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$x1('40.833'),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$stop,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$stopColor('#6E2B2F'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$offset('0'),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$stop,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$stopColor('#E30138'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$offset('1'),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {ctor: '[]'}
								}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$linearGradient,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$id('id2'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$y2('43.335'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$x2('37.082'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$y1('43.335'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$x1('6.2494'),
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$stop,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$stopColor('#1D2970'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$offset('0'),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$stop,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$stopColor('#006DBA'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$offset('1'),
													_1: {ctor: '[]'}
												}
											},
											{ctor: '[]'}),
										_1: {ctor: '[]'}
									}
								}),
							_1: {ctor: '[]'}
						}
					}
				}
			}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$svg$Svg$g,
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$transform('matrix(0.4,0,0,0.4,-4.5529425e-5,0)'),
					_1: {ctor: '[]'}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$path,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$fill('#FFF'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$class('fil0'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$d('m112.5,69.17c0,9.6629-7.8317,17.498-17.498,17.498h-94.999v-69.168c-0.0026-9.6645,7.8302-17.5,17.497-17.5l95-0.0001v69.17h0.0001z'),
									_1: {ctor: '[]'}
								}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$path,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$fill('url(#id0)'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$class('fil1'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$d('m81.526,44.854,0.0624,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1207,0,0.1206,0,0.1207,0,0.1206,0,0.1206,0,0.1004,0,0.0203,0.0005c0.0372,0.0009,0.0778,0.0026,0.1206,0.0049,0.0387,0.0021,0.0792,0.0048,0.1206,0.0079,0.0397,0.0029,0.0802,0.0063,0.1207,0.01,0.0406,0.0037,0.081,0.0078,0.1206,0.0122,0.0415,0.0046,0.0821,0.0095,0.1206,0.0147,0.0432,0.0058,0.0839,0.0118,0.1207,0.0181,0.0265,0.0045,0.051,0.0091,0.0729,0.0138l0.0477,0.0108c0.0404,0.0094,0.0806,0.0196,0.1206,0.0307,0.0405,0.0112,0.0807,0.023,0.1207,0.0358,0.0405,0.0129,0.0807,0.0266,0.1206,0.0411,0.0405,0.0147,0.0807,0.0302,0.1206,0.0465,0.0406,0.0166,0.0808,0.0341,0.1207,0.0523,0.0406,0.0186,0.0808,0.0379,0.1206,0.0582,0.0406,0.0206,0.0808,0.0422,0.1206,0.0646,0.0407,0.0229,0.081,0.0469,0.1207,0.0716,0.0407,0.0254,0.081,0.0515,0.1206,0.0787,0.0408,0.028,0.0811,0.0568,0.1206,0.0866,0.0409,0.0309,0.0812,0.0628,0.1207,0.0957,0.041,0.0342,0.0812,0.0695,0.1206,0.1057,0.0412,0.0379,0.0815,0.0766,0.1207,0.1166,0.0414,0.0421,0.0815,0.0856,0.1206,0.1301,0.0415,0.0473,0.0817,0.0959,0.1206,0.1458,0.0419,0.0537,0.0821,0.1088,0.1207,0.1654,0.0422,0.062,0.0825,0.1256,0.1206,0.1909,0.043,0.0736,0.0832,0.1494,0.1206,0.2272,0.0444,0.0922,0.0848,0.1872,0.1207,0.2849,0.0483,0.1313,0.0887,0.2674,0.1206,0.4079,0.0552,0.2435,0.0849,0.5,0.0849,0.7678,0,0.2691-0.0296,0.5267-0.0849,0.771-0.0319,0.1409-0.0723,0.2774-0.1206,0.4089-0.036,0.098-0.0763,0.1931-0.1207,0.2856-0.0374,0.0778-0.0776,0.1537-0.1206,0.2274-0.0381,0.0654-0.0783,0.129-0.1206,0.191-0.0386,0.0566-0.0789,0.1118-0.1207,0.1655-0.0389,0.0499-0.0791,0.0984-0.1206,0.1457-0.0391,0.0445-0.0793,0.0879-0.1206,0.13-0.0392,0.04-0.0796,0.0787-0.1207,0.1165-0.0394,0.0361-0.0796,0.0711-0.1206,0.1052-0.0395,0.0328-0.0797,0.0647-0.1207,0.0955-0.0395,0.0297-0.0798,0.0584-0.1206,0.0863-0.0396,0.0271-0.0799,0.0532-0.1206,0.0784-0.0397,0.0246-0.08,0.0484-0.1207,0.0712-0.0397,0.0223-0.0799,0.0437-0.1206,0.0642-0.0398,0.0201-0.08,0.0394-0.1206,0.0579-0.0399,0.0181-0.0801,0.0353-0.1207,0.0518-0.0399,0.0161-0.0801,0.0316-0.1206,0.0461-0.0399,0.0143-0.0801,0.0278-0.1206,0.0405-0.04,0.0126-0.0802,0.0243-0.1207,0.0353-0.04,0.0108-0.0802,0.0209-0.1206,0.0302l-0.0477,0.0107c-0.0219,0.005-0.0464,0.0099-0.0729,0.0146-0.0368,0.0065-0.0775,0.0127-0.1207,0.0186-0.0385,0.0052-0.0791,0.0102-0.1206,0.0148-0.0396,0.0044-0.08,0.0084-0.1206,0.012-0.0405,0.0037-0.081,0.007-0.1207,0.0098-0.0414,0.003-0.0819,0.0056-0.1206,0.0076-0.0428,0.0022-0.0834,0.0038-0.1206,0.0047l-0.0647,0.0008h-0.056-0.1206-0.1206-0.1207-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.0624v-6.5948zm9.7136-7.4639c0.0485,0.2214,0.0745,0.4558,0.0745,0.7027,0,0.2465-0.026,0.4808-0.0745,0.702-0.0312,0.1421-0.0717,0.2787-0.1207,0.4097-0.0358,0.0956-0.0761,0.1881-0.1206,0.2774-0.0373,0.0749-0.0776,0.1476-0.1206,0.2179-0.0381,0.0622-0.0785,0.1226-0.1207,0.1812-0.0386,0.0534-0.0788,0.1052-0.1206,0.1555-0.0389,0.0468-0.079,0.0922-0.1206,0.1363-0.0391,0.0414-0.0793,0.0815-0.1206,0.1204-0.0393,0.037-0.0795,0.0729-0.1207,0.1076-0.0394,0.0332-0.0796,0.0653-0.1206,0.0964-0.0395,0.03-0.0797,0.0589-0.1206,0.0869-0.0396,0.027-0.0799,0.053-0.1207,0.0781-0.0397,0.0244-0.0799,0.0479-0.1206,0.0704-0.0397,0.022-0.0799,0.0432-0.1206,0.0634-0.0398,0.0198-0.0801,0.0387-0.1207,0.0568-0.0398,0.0177-0.08,0.0345-0.1206,0.0505-0.0399,0.0157-0.0801,0.0306-0.1206,0.0447-0.0399,0.0139-0.0801,0.027-0.1206,0.0392-0.04,0.0121-0.0802,0.0235-0.1207,0.034-0.0399,0.0104-0.0801,0.02-0.1206,0.0288-0.0399,0.0088-0.0802,0.0166-0.1206,0.0238l-0.0293,0.0053c-0.0235,0.0041-0.0547,0.0087-0.0914,0.0133-0.0356,0.0045-0.0765,0.0092-0.1206,0.0136-0.0382,0.0039-0.0788,0.0077-0.1206,0.0112-0.0395,0.0033-0.0801,0.0062-0.1207,0.0088-0.0405,0.0026-0.0811,0.0048-0.1206,0.0064-0.0418,0.0017-0.0824,0.0028-0.1206,0.003l-0.0191,0.0001h-0.1015-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.1207-0.1206-0.1206-0.0632v-6.0857h0.0632,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.1206,0.1206,0.1207,0.1206,0.1206,0.1207,0.1206,0.0508l0.0698,0.0023c0.0395,0.0016,0.0801,0.004,0.1206,0.0066,0.0406,0.0026,0.0812,0.0056,0.1207,0.0088,0.0418,0.0034,0.0824,0.0072,0.1206,0.0109,0.0441,0.0043,0.085,0.0086,0.1206,0.0127,0.0367,0.0042,0.0679,0.0082,0.0914,0.0115l0.0293,0.0053c0.0404,0.0073,0.0807,0.0154,0.1206,0.0243,0.0405,0.0089,0.0807,0.0186,0.1206,0.0291,0.0405,0.0107,0.0807,0.022,0.1207,0.0342,0.0405,0.0124,0.0807,0.0256,0.1206,0.0395,0.0405,0.0142,0.0807,0.0292,0.1206,0.045,0.0406,0.0161,0.0808,0.0331,0.1206,0.0508,0.0406,0.0182,0.0809,0.0371,0.1207,0.0569,0.0407,0.0203,0.0809,0.0414,0.1206,0.0634,0.0407,0.0226,0.0809,0.0462,0.1206,0.0706,0.0408,0.0251,0.0811,0.0511,0.1207,0.0782,0.0409,0.0279,0.0811,0.0571,0.1206,0.0871,0.041,0.0311,0.0812,0.0632,0.1206,0.0964,0.0412,0.0348,0.0814,0.0707,0.1207,0.1077,0.0413,0.0389,0.0815,0.079,0.1206,0.1204,0.0416,0.044,0.0817,0.0895,0.1206,0.1363,0.0418,0.0503,0.082,0.1022,0.1206,0.1556,0.0422,0.0586,0.0826,0.1189,0.1207,0.1812,0.043,0.0703,0.0833,0.143,0.1206,0.2179,0.0445,0.0893,0.0848,0.182,0.1206,0.2776,0.049,0.131,0.0895,0.2677,0.1207,0.41zm14.96-31.557,0.0495,0-0.0001,62.502c0,0.3734-0.0173,0.7428-0.0494,1.1079-0.0282,0.3213-0.0686,0.6391-0.1207,0.953-0.035,0.2109-0.0752,0.4199-0.1206,0.6271-0.0369,0.1685-0.0771,0.3359-0.1207,0.5018-0.0377,0.1432-0.078,0.2853-0.1206,0.4264-0.0385,0.1276-0.0783,0.2546-0.1207,0.3805-0.0385,0.1141-0.079,0.2273-0.1206,0.34-0.0388,0.1049-0.0792,0.2091-0.1207,0.3127-0.039,0.0973-0.0792,0.1939-0.1206,0.29-0.0392,0.091-0.0795,0.1815-0.1207,0.2714-0.0393,0.0856-0.0795,0.1708-0.1206,0.2553-0.0395,0.081-0.0796,0.1617-0.1207,0.2417-0.0394,0.0767-0.0797,0.1531-0.1206,0.2288-0.0394,0.0729-0.0799,0.145-0.1207,0.217-0.0395,0.0697-0.0798,0.1389-0.1206,0.2077-0.0397,0.067-0.0799,0.1336-0.1207,0.1998-0.0398,0.0644-0.0798,0.1287-0.1207,0.1924-0.0396,0.0616-0.0801,0.1227-0.1207,0.1835-0.0396,0.0593-0.08,0.1179-0.1206,0.1765-0.0398,0.0575-0.08,0.1148-0.1207,0.1716-0.0398,0.0554-0.0799,0.1106-0.1206,0.1654-0.0397,0.0534-0.0802,0.1061-0.1207,0.1588-0.0399,0.0519-0.08,0.1037-0.1206,0.1549-0.0399,0.0503-0.08,0.1002-0.1207,0.1498-0.0398,0.0485-0.0802,0.0966-0.1206,0.1445-0.0401,0.0474-0.0799,0.095-0.1207,0.1418-0.0398,0.0457-0.0802,0.0908-0.1206,0.1359-0.0399,0.0446-0.0802,0.0889-0.1207,0.1329-0.04,0.0434-0.08,0.0867-0.1206,0.1295-0.0398,0.042-0.0803,0.0833-0.1207,0.1248-0.0401,0.0412-0.08,0.0826-0.1207,0.1232-0.0398,0.0397-0.0803,0.0786-0.1206,0.1178-0.0401,0.0389-0.0801,0.0779-0.1207,0.1163-0.0399,0.0377-0.0802,0.075-0.1206,0.1122-0.04,0.0369-0.0803,0.0736-0.1207,0.1099-0.04,0.0359-0.0801,0.0716-0.1206,0.107-0.04,0.035-0.0803,0.0696-0.1207,0.1041-0.0401,0.0342-0.0801,0.0683-0.1206,0.102-0.0399,0.0332-0.0803,0.0659-0.1207,0.0986-0.0401,0.0325-0.0801,0.065-0.1206,0.0971-0.0399,0.0316-0.0804,0.0625-0.1207,0.0936-0.0401,0.0309-0.0801,0.0619-0.1206,0.0924-0.0399,0.03-0.0804,0.0594-0.1207,0.089-0.0402,0.0294-0.0802,0.0591-0.1207,0.0881-0.0399,0.0286-0.0803,0.0564-0.1206,0.0845-0.0402,0.028-0.0802,0.0562-0.1207,0.0837-0.04,0.0272-0.0803,0.0537-0.1206,0.0805-0.0401,0.0266-0.0802,0.0533-0.1207,0.0795-0.04,0.0259-0.0803,0.0513-0.1206,0.0767-0.0401,0.0253-0.0803,0.0506-0.1207,0.0754-0.04,0.0246-0.0802,0.0489-0.1206,0.0731l-0.1207,0.0714c-0.0401,0.0234-0.0802,0.0468-0.1206,0.0698-0.04,0.0228-0.0804,0.0451-0.1207,0.0675-0.0402,0.0223-0.0802,0.0448-0.1206,0.0666-0.04,0.0216-0.0804,0.0425-0.1207,0.0637s-0.0802,0.0429-0.1207,0.0637c-0.0399,0.0205-0.0804,0.04-0.1206,0.0601s-0.0802,0.0403-0.1207,0.0599c-0.04,0.0194-0.0804,0.0384-0.1206,0.0574l-0.1207,0.0564-0.1206,0.0547c-0.0401,0.0179-0.0804,0.0353-0.1207,0.0528-0.0402,0.0174-0.0802,0.0353-0.1206,0.0523-0.04,0.0169-0.0804,0.0328-0.1207,0.0493-0.0402,0.0164-0.0802,0.0333-0.1206,0.0493-0.0401,0.0159-0.0804,0.031-0.1207,0.0465-0.0401,0.0154-0.0802,0.0308-0.1206,0.0458l-0.1207,0.0445c-0.0401,0.0145-0.0805,0.0285-0.1207,0.0425-0.0402,0.0141-0.0801,0.0287-0.1206,0.0424-0.04,0.0135-0.0805,0.0261-0.1207,0.0392l-0.1206,0.0391c-0.0401,0.0127-0.0804,0.0249-0.1207,0.0372l-0.1206,0.0359c-0.0402,0.0118-0.0803,0.0239-0.1207,0.0353-0.04,0.0113-0.0804,0.0218-0.1206,0.0327s-0.0803,0.0221-0.1207,0.0326l-0.1206,0.0304-0.1207,0.0295-0.1206,0.0287c-0.0401,0.0092-0.0804,0.0175-0.1207,0.0263-0.0402,0.0088-0.0803,0.0179-0.1207,0.0263l-0.1206,0.0241-0.1207,0.0231c-0.0402,0.0075-0.0803,0.0156-0.1206,0.0227-0.0401,0.0071-0.0805,0.0133-0.1207,0.02l-0.1206,0.02-0.1207,0.0181-0.1206,0.0169c-0.0403,0.0055-0.0803,0.0117-0.1207,0.0169-0.0401,0.0051-0.0805,0.0091-0.1206,0.0138-0.0402,0.0047-0.0804,0.0095-0.1207,0.0138-0.0402,0.0043-0.0803,0.0087-0.1206,0.0126-0.0401,0.0039-0.0805,0.0072-0.1207,0.0107-0.0403,0.0035-0.0804,0.0075-0.1207,0.0107-0.0401,0.0031-0.0804,0.0056-0.1206,0.0084l-0.1207,0.0076c-0.0402,0.0024-0.0803,0.0053-0.1206,0.0073-0.0401,0.002-0.0805,0.003-0.1207,0.0046l-0.1206,0.0046-0.1207,0.0031c-0.0401,0.0009-0.0804,0.001-0.1206,0.0016l-0.1207,0.0015-0.0249,0.0003h-0.0957-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.2603v-25.484h0.2603,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.064l0.0567-0.0005,0.1207-0.001,0.1206-0.0025c0.0403-0.001,0.0806-0.0016,0.1207-0.003,0.0404-0.0014,0.0804-0.0033,0.1206-0.0051l0.1207-0.0056,0.1206-0.0073,0.1207-0.0083,0.1206-0.0094,0.1207-0.0111c0.0402-0.0038,0.0806-0.0075,0.1206-0.0117,0.0404-0.0042,0.0805-0.009,0.1207-0.0137l0.1206-0.0147c0.0404-0.0052,0.0806-0.0102,0.1207-0.0158,0.0404-0.0056,0.0805-0.0118,0.1207-0.0178,0.0403-0.0061,0.0806-0.0121,0.1206-0.0186l0.1207-0.0203,0.1206-0.0217c0.0403-0.0075,0.0807-0.0148,0.1207-0.0227,0.0404-0.008,0.0805-0.0166,0.1206-0.025l0.1207-0.0261c0.0403-0.009,0.0806-0.018,0.1206-0.0274,0.0405-0.0095,0.0806-0.0196,0.1207-0.0296,0.0403-0.01,0.0806-0.0202,0.1206-0.0307,0.0403-0.0106,0.0807-0.0213,0.1207-0.0324,0.0404-0.0111,0.0805-0.0227,0.1206-0.0344,0.0404-0.0117,0.0807-0.0236,0.1207-0.0358l0.1207-0.0378c0.0405-0.0129,0.0805-0.0263,0.1206-0.0398,0.0404-0.0136,0.0807-0.0272,0.1207-0.0413,0.0404-0.0142,0.0807-0.0284,0.1206-0.0431,0.0406-0.0149,0.0806-0.0305,0.1207-0.0459,0.0404-0.0156,0.0806-0.0314,0.1206-0.0475,0.0404-0.0163,0.0808-0.0325,0.1207-0.0493,0.0405-0.017,0.0806-0.0344,0.1206-0.052,0.0405-0.0178,0.0807-0.036,0.1207-0.0544,0.0404-0.0186,0.0807-0.0373,0.1206-0.0564,0.0404-0.0193,0.0808-0.0388,0.1207-0.0587,0.0406-0.0203,0.0806-0.0409,0.1206-0.0618,0.0405-0.0211,0.0807-0.0428,0.1207-0.0646,0.0406-0.0221,0.0808-0.0444,0.1207-0.0671,0.0405-0.023,0.0808-0.0463,0.1206-0.07,0.0405-0.024,0.0809-0.0482,0.1207-0.0729,0.0406-0.0253,0.0807-0.0509,0.1206-0.0768,0.0407-0.0264,0.0808-0.0532,0.1207-0.0803,0.0406-0.0275,0.0808-0.0555,0.1206-0.0838,0.0407-0.0289,0.0809-0.0581,0.1207-0.0877,0.0407-0.0302,0.0809-0.0608,0.1206-0.0918,0.0407-0.0318,0.081-0.0638,0.1207-0.0963,0.0407-0.0333,0.0809-0.067,0.1206-0.1011,0.0408-0.035,0.081-0.0706,0.1207-0.1065,0.0408-0.0369,0.081-0.0744,0.1206-0.1122,0.0409-0.039,0.0811-0.0785,0.1207-0.1185,0.041-0.0414,0.0811-0.0832,0.1207-0.1256,0.0409-0.0438,0.0811-0.0883,0.1206-0.1332,0.041-0.0467,0.0813-0.094,0.1207-0.1419,0.0411-0.0499,0.0813-0.1004,0.1206-0.1515,0.0411-0.0536,0.0816-0.1075,0.1207-0.1624,0.0415-0.0583,0.0814-0.1176,0.1206-0.1774,0.0415-0.0634,0.0818-0.1276,0.1207-0.1926,0.0418-0.0699,0.082-0.1408,0.1206-0.2126,0.042-0.0781,0.0825-0.1571,0.1207-0.2374,0.0427-0.0897,0.0828-0.1809,0.1206-0.2733,0.0434-0.106,0.0838-0.2134,0.1207-0.3228,0.0454-0.1348,0.0854-0.2723,0.1206-0.4122,0.0515-0.2045,0.0919-0.4144,0.1207-0.6294,0.035-0.2609,0.0534-0.529,0.0534-0.8045,0-0.2683-0.0182-0.5289-0.0534-0.782-0.0289-0.2079-0.0693-0.4106-0.1207-0.6079-0.0351-0.1345-0.0754-0.2664-0.1206-0.3958-0.037-0.1061-0.0772-0.2107-0.1207-0.3133-0.0377-0.0889-0.078-0.1765-0.1206-0.2627-0.0383-0.0776-0.0786-0.1541-0.1207-0.2295-0.0387-0.0694-0.0788-0.138-0.1206-0.2055-0.0388-0.0627-0.0792-0.1245-0.1207-0.1855-0.0391-0.0576-0.0792-0.1148-0.1206-0.1709-0.0391-0.053-0.0795-0.1051-0.1207-0.1567-0.0393-0.0494-0.0795-0.0981-0.1206-0.1463-0.0395-0.0462-0.0796-0.092-0.1207-0.1371-0.0395-0.0434-0.0796-0.0863-0.1206-0.1286-0.0395-0.0408-0.0798-0.081-0.1207-0.1208-0.0396-0.0386-0.0799-0.0767-0.1207-0.1143-0.0396-0.0365-0.0799-0.0725-0.1206-0.1081-0.0397-0.0347-0.0799-0.069-0.1207-0.1028-0.0397-0.033-0.0799-0.0656-0.1206-0.0978-0.0398-0.0314-0.08-0.0625-0.1207-0.0931-0.0398-0.03-0.08-0.0595-0.1206-0.0888-0.0398-0.0286-0.0801-0.0569-0.1207-0.0848-0.0398-0.0273-0.08-0.0544-0.1206-0.0811-0.0399-0.0262-0.0801-0.0521-0.1207-0.0776-0.0399-0.025-0.08-0.0498-0.1206-0.0742-0.0398-0.0239-0.0801-0.0475-0.1207-0.0708-0.0399-0.0229-0.0801-0.0455-0.1206-0.0678-0.0399-0.022-0.0801-0.0436-0.1207-0.0649-0.0399-0.0211-0.0802-0.0419-0.1207-0.0625-0.0399-0.0202-0.0801-0.0403-0.1206-0.06-0.04-0.0194-0.0801-0.0387-0.1207-0.0576-0.0399-0.0186-0.0802-0.0367-0.1206-0.0547-0.0399-0.0178-0.0802-0.0353-0.1207-0.0526-0.04-0.0171-0.0802-0.0339-0.1206-0.0505-0.0401-0.0164-0.0801-0.0328-0.1207-0.0487-0.04-0.0157-0.0802-0.0312-0.1206-0.0464-0.04-0.015-0.0803-0.0295-0.1207-0.0441-0.04-0.0144-0.0802-0.0284-0.1206-0.0424-0.0401-0.0138-0.0802-0.0275-0.1207-0.0409-0.04-0.0132-0.0802-0.0261-0.1206-0.0388-0.04-0.0126-0.0804-0.0248-0.1207-0.0369l-0.1207-0.0354c-0.0401-0.0115-0.0802-0.023-0.1206-0.034-0.04-0.0109-0.0804-0.0214-0.1207-0.0318-0.04-0.0104-0.0802-0.0204-0.1206-0.0304-0.0401-0.0099-0.0803-0.0197-0.1207-0.0291-0.04-0.0094-0.0803-0.0185-0.1206-0.0274-0.04-0.0089-0.0803-0.0174-0.1207-0.0258-0.0401-0.0084-0.0802-0.0168-0.1206-0.0247l-7.49-0.022-0.121-0.021c-0.04-0.007-0.08-0.014-0.121-0.021l-0.1206-0.019c-0.0401-0.0061-0.0804-0.0118-0.1207-0.0174l-0.1207-0.0165-0.1206-0.0152-0.1207-0.0136-0.1206-0.0127-0.1207-0.0112-0.1206-0.0101-0.1114-0.0086-0.0001-0.1446,0.1115-0.0173,0.1206-0.0199c0.0404-0.0069,0.0807-0.0138,0.1207-0.0211l0.1206-0.0232c0.0405-0.008,0.0807-0.0163,0.1207-0.0248l0.1206-0.0263c0.0404-0.0091,0.0808-0.0183,0.1207-0.0279,0.0405-0.0098,0.0806-0.02,0.1207-0.0302,0.0405-0.0103,0.0806-0.0211,0.1206-0.0319,0.0404-0.011,0.0807-0.0222,0.1207-0.0337,0.0404-0.0116,0.0807-0.0233,0.1206-0.0354,0.0404-0.0122,0.0808-0.0248,0.1207-0.0376,0.0405-0.013,0.0806-0.0264,0.1206-0.0399,0.0406-0.0137,0.0807-0.0278,0.1207-0.042,0.0405-0.0144,0.0807-0.029,0.1206-0.044,0.0405-0.0152,0.0808-0.0306,0.1207-0.0463,0.0405-0.0159,0.0807-0.0322,0.1206-0.0487,0.0406-0.0168,0.0808-0.0338,0.1207-0.0512,0.0406-0.0177,0.0807-0.0357,0.1206-0.054,0.0406-0.0185,0.0808-0.0375,0.1207-0.0567,0.0406-0.0195,0.0808-0.0394,0.1207-0.0595,0.0405-0.0205,0.0808-0.0413,0.1206-0.0624,0.0406-0.0215,0.0809-0.0434,0.1207-0.0655,0.0406-0.0226,0.0808-0.0455,0.1206-0.0687,0.0406-0.0237,0.0809-0.0478,0.1207-0.0722,0.0407-0.0249,0.0808-0.0501,0.1206-0.0757,0.0407-0.0261,0.0809-0.0528,0.1207-0.0797,0.0407-0.0275,0.0809-0.0554,0.1206-0.0837,0.0408-0.029,0.081-0.0583,0.1207-0.088,0.0408-0.0305,0.081-0.0613,0.1206-0.0926,0.0408-0.0322,0.0811-0.0646,0.1207-0.0976,0.0408-0.034,0.081-0.0685,0.1206-0.1033,0.041-0.0361,0.0811-0.0726,0.1207-0.1095,0.0409-0.0381,0.0812-0.0767,0.1207-0.1157,0.0409-0.0404,0.0812-0.0812,0.1206-0.1225,0.0411-0.0432,0.0813-0.0868,0.1207-0.131,0.0411-0.046,0.0813-0.0927,0.1206-0.1398,0.0412-0.0493,0.0815-0.0993,0.1207-0.1498,0.0413-0.0533,0.0815-0.1073,0.1206-0.1619,0.0415-0.0579,0.0817-0.1165,0.1207-0.1757,0.0416-0.0632,0.0819-0.127,0.1206-0.1917,0.0419-0.0701,0.0822-0.141,0.1207-0.2127,0.0423-0.0789,0.0825-0.1587,0.1206-0.2394,0.0429-0.0908,0.0831-0.1829,0.1207-0.2759,0.0438-0.1084,0.084-0.2183,0.1206-0.3296,0.046-0.1399,0.0863-0.2821,0.1207-0.4261,0.0557-0.2336,0.0959-0.4721,0.1207-0.7147,0.0196-0.1914,0.0298-0.3854,0.0298-0.5813,0-0.2069-0.0103-0.4086-0.0298-0.6053-0.0249-0.2514-0.0654-0.4942-0.1207-0.7286-0.0345-0.1464-0.0748-0.2895-0.1207-0.4291-0.0367-0.1117-0.0769-0.2212-0.1206-0.3286-0.0377-0.0925-0.0779-0.1834-0.1207-0.2726-0.0382-0.0796-0.0785-0.1579-0.1206-0.2349-0.0386-0.0705-0.0789-0.1399-0.1207-0.2083-0.0389-0.0635-0.079-0.1261-0.1206-0.1877-0.039-0.0577-0.0793-0.1145-0.1207-0.1705-0.0391-0.053-0.0793-0.1053-0.1206-0.1568-0.0394-0.0492-0.0794-0.0979-0.1207-0.1458-0.0393-0.0455-0.0796-0.0902-0.1206-0.1345-0.0394-0.0426-0.0797-0.0846-0.1207-0.1261-0.0395-0.04-0.0797-0.0794-0.1206-0.1183-0.0396-0.0377-0.0798-0.075-0.1207-0.1116-0.0396-0.0355-0.0799-0.0706-0.1207-0.1052-0.0397-0.0336-0.0798-0.0668-0.1206-0.0995-0.0397-0.0318-0.0799-0.0633-0.1207-0.0942-0.0397-0.0302-0.0799-0.0599-0.1206-0.0892-0.0398-0.0287-0.08-0.0569-0.1207-0.0848-0.0398-0.0272-0.0799-0.054-0.1206-0.0805-0.0398-0.026-0.0801-0.0516-0.1207-0.0768-0.0398-0.0247-0.0801-0.049-0.1206-0.073-0.0399-0.0236-0.0801-0.0468-0.1207-0.0697-0.0398-0.0225-0.08-0.0447-0.1206-0.0665-0.0399-0.0215-0.0801-0.0425-0.1207-0.0634-0.0399-0.0205-0.0801-0.0407-0.1206-0.0606-0.04-0.0196-0.0801-0.0391-0.1207-0.058-0.047-0.016-0.088-0.034-0.128-0.052s-0.08-0.035-0.121-0.052c-0.04-0.017-0.08-0.034-0.12-0.05-0.04-0.017-0.081-0.033-0.121-0.048-0.04-0.0155-0.0802-0.0309-0.1207-0.0459-0.04-0.0148-0.0801-0.0293-0.1206-0.0436-0.04-0.0141-0.0802-0.0278-0.1207-0.0414-0.04-0.0134-0.0802-0.0265-0.1206-0.0394-0.04-0.0128-0.0802-0.0254-0.1207-0.0377-0.0401-0.0122-0.0801-0.0244-0.1206-0.0361-0.04-0.0115-0.0803-0.0226-0.1207-0.0336-0.04-0.011-0.0802-0.0216-0.1206-0.0321l-0.1207-0.0307c-0.0401-0.0099-0.0802-0.0196-0.1207-0.029-0.04-0.0093-0.0802-0.0183-0.1206-0.0271l-0.117-0.026c-0.04-0.008-0.08-0.016-0.121-0.024-0.04-0.008-0.08-0.015-0.12-0.023l-0.121-0.021c-0.04-0.007-0.08-0.013-0.121-0.02l-0.1206-0.0183-0.1207-0.017-0.1206-0.016-0.1207-0.0143-0.1206-0.013-0.1207-0.0121-0.1207-0.0106-0.1206-0.0093-0.1207-0.0086-0.1206-0.0069-0.0479-0.0027-0.0728-0.0045-0.1206-0.0071-0.1207-0.0067-0.1206-0.0063-0.1207-0.0058-0.1206-0.0052-0.1207-0.0044-0.1206-0.0037-0.1207-0.0027-0.1207-0.0016-0.0665-0.0002h-0.0541-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1206-0.1207-0.1207-0.1206-0.1207-0.1206-0.1207-0.2603v-12.981c0-0.8733,0.0899-1.7255,0.2603-2.5483,0.0366-0.1762,0.0769-0.3509,0.1207-0.5242,0.0375-0.1483,0.0779-0.2955,0.1206-0.4416,0.0382-0.1305,0.0784-0.2601,0.1207-0.3888,0.0386-0.1176,0.0786-0.2346,0.1206-0.3506,0.0389-0.1076,0.0789-0.2146,0.1207-0.3208,0.0391-0.0992,0.0792-0.1979,0.1207-0.2958,0.0392-0.0924,0.0793-0.1844,0.1206-0.2757,0.0392-0.0867,0.0796-0.1728,0.1207-0.2584,0.0392-0.0817,0.0796-0.1628,0.1206-0.2435,0.0394-0.0776,0.0798-0.1546,0.1207-0.2313,0.0394-0.0739,0.0797-0.1473,0.1206-0.2203,0.0396-0.0708,0.0798-0.141,0.1207-0.2109,0.0397-0.0678,0.0797-0.1353,0.1206-0.2022,0.0397-0.0649,0.0799-0.1293,0.1207-0.1934,0.0395-0.0621,0.08-0.1236,0.1206-0.1849,0.0398-0.06,0.0799-0.1198,0.1207-0.1791,0.0399-0.0581,0.0797-0.1162,0.1206-0.1736,0.0397-0.0556,0.0802-0.1105,0.1207-0.1654,0.0397-0.054,0.0801-0.1076,0.1207-0.1609,0.04-0.0525,0.0798-0.1052,0.1206-0.157,0.0397-0.0504,0.0803-0.1,0.1207-0.1498,0.0398-0.0491,0.08-0.0978,0.1206-0.1462,0.04-0.0478,0.08-0.0956,0.1207-0.1428,0.0397-0.046,0.0802-0.0912,0.1206-0.1366,0.0401-0.045,0.08-0.0901,0.1207-0.1345,0.0398-0.0435,0.0802-0.0866,0.1206-0.1296,0.0399-0.0424,0.0802-0.0845,0.1207-0.1264,0.04-0.0413,0.08-0.0826,0.1206-0.1234,0.0399-0.0401,0.0803-0.0796,0.1207-0.1191,0.0401-0.0393,0.0799-0.079,0.1206-0.1177,0.0398-0.0379,0.0804-0.0749,0.1207-0.1123,0.0401-0.0372,0.0801-0.0745,0.1207-0.1112,0.0399-0.0361,0.0803-0.0715,0.1206-0.107,0.0401-0.0353,0.0802-0.0706,0.1207-0.1054,0.04-0.0343,0.0802-0.0681,0.1206-0.1019,0.0401-0.0335,0.0802-0.0669,0.1207-0.0999,0.04-0.0327,0.0802-0.065,0.1206-0.0971l0.1207-0.0949,0.1206-0.0924c0.0401-0.0303,0.0803-0.0604,0.1207-0.0902,0.04-0.0295,0.0802-0.0589,0.1206-0.088l0.1207-0.0857c0.04-0.0281,0.0802-0.056,0.1206-0.0836l0.162-0.0808,0.121-0.0795c0.04-0.0261,0.08-0.0521,0.121-0.0777l0.12-0.0754c0.041-0.0249,0.081-0.0498,0.121-0.0742,0.04-0.0242,0.08-0.0477,0.121-0.0714,0.04-0.0237,0.08-0.0476,0.12-0.0708,0.04-0.0229,0.081-0.045,0.121-0.0675s0.08-0.0454,0.121-0.0674c0.04-0.0217,0.0805-0.0427,0.1207-0.064s0.0802-0.0427,0.1206-0.0636c0.04-0.0207,0.0804-0.0408,0.1207-0.061,0.0401-0.0201,0.0803-0.0403,0.1206-0.06l0.119-0.0583c0.04-0.0191,0.08-0.0377,0.121-0.0564,0.04-0.0186,0.08-0.0375,0.12-0.0557,0.04-0.018,0.0805-0.0352,0.1207-0.0528s0.0802-0.0355,0.1206-0.0527c0.04-0.017,0.0805-0.0332,0.1207-0.0498,0.0401-0.0165,0.0802-0.0332,0.1206-0.0493l0.119-0.0475,0.121-0.0459c0.0403-0.0152,0.0803-0.0306,0.1207-0.0453,0.04-0.0146,0.0804-0.0283,0.1206-0.0425,0.0403-0.0142,0.0803-0.0287,0.1207-0.0425,0.04-0.0137,0.0804-0.0266,0.1206-0.0399l0.1207-0.0391c0.0402-0.0128,0.0803-0.0257,0.1207-0.0381,0.04-0.0123,0.0804-0.0239,0.1206-0.0358,0.0402-0.012,0.0803-0.0244,0.1207-0.0359,0.04-0.0114,0.0804-0.022,0.1206-0.033s0.0803-0.0221,0.1207-0.0327l0.117-0.0312c0.0401-0.0101,0.0804-0.0197,0.1207-0.0294,0.0402-0.0097,0.0802-0.0201,0.1206-0.0294,0.04-0.0092,0.0805-0.0176,0.1207-0.0265l0.1206-0.0263,0.1207-0.0249c0.04-0.008,0.0804-0.0155,0.1206-0.0231,0.0403-0.0077,0.0803-0.0159,0.1207-0.0232,0.0401-0.0073,0.0805-0.0135,0.1207-0.0203l0.1206-0.02c0.0402-0.0064,0.0804-0.013,0.1207-0.019,0.0401-0.006,0.0804-0.0113,0.1206-0.0169,0.0403-0.0056,0.0803-0.0117,0.1207-0.0169,0.0401-0.0052,0.0804-0.0098,0.1206-0.0146l0.1207-0.0138c0.0402-0.0044,0.0803-0.0093,0.1206-0.0133,0.0401-0.004,0.0805-0.0071,0.1207-0.0107l0.115-0.0107,0.121-0.0091c0.04-0.0029,0.08-0.0052,0.121-0.0077,0.04-0.0024,0.08-0.0055,0.12-0.0076,0.041-0.0021,0.081-0.0033,0.121-0.005l0.1206-0.0045c0.0403-0.0013,0.0804-0.003,0.1207-0.0039,0.0401-0.0009,0.0804-0.001,0.1206-0.0016s0.0804-0.0013,0.1207-0.0015l0.0303-0.0004h0.0903,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1207,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207,0.1206,0.1207v-0.0001z'),
										_1: {ctor: '[]'}
									}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$path,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$fill('url(#id2)'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$class('fil2'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$d('M6.5081,49.331c-0.0863-0.041-0.1725-0.083-0.2587-0.124v-30.872c0-0.8708,0.0892-1.7208,0.2587-2.5414,0.0364-0.177,0.0768-0.351,0.1205-0.525,0.0374-0.148,0.0777-0.295,0.1204-0.442,0.0381-0.13,0.0783-0.26,0.1204-0.388,0.0386-0.118,0.0785-0.235,0.1205-0.351,0.0389-0.108,0.0787-0.215,0.1204-0.321,0.0389-0.099,0.0791-0.198,0.1205-0.296,0.0391-0.092,0.0792-0.184,0.1204-0.275,0.0392-0.087,0.0794-0.173,0.1204-0.259,0.0392-0.081,0.0796-0.163,0.1205-0.243,0.0393-0.078,0.0795-0.155,0.1204-0.232,0.0394-0.0739,0.0796-0.1473,0.1204-0.2203,0.0395-0.0707,0.0796-0.141,0.1205-0.2108,0.0396-0.0678,0.0795-0.1354,0.1204-0.2024,0.0396-0.0648,0.0798-0.1291,0.1205-0.1931,0.0394-0.062,0.0799-0.1236,0.1204-0.1849,0.0397-0.06,0.0797-0.1198,0.1204-0.1791,0.04-0.0582,0.0796-0.1163,0.1205-0.1738,0.0395-0.0555,0.08-0.1103,0.1204-0.1652,0.0398-0.054,0.0799-0.1076,0.1205-0.1609,0.0399-0.0524,0.0797-0.1052,0.1204-0.157,0.0396-0.05,0.0801-0.1,0.1204-0.15,0.0398-0.049,0.0799-0.098,0.1205-0.146,0.0399-0.048,0.0798-0.095,0.1204-0.143,0.0397-0.046,0.0801-0.091,0.1205-0.136,0.0399-0.0455,0.0798-0.0905,0.1204-0.1349,0.0397-0.0435,0.0801-0.0864,0.1204-0.1293,0.0399-0.0425,0.08-0.0846,0.1205-0.1265,0.0399-0.0413,0.0799-0.0826,0.1204-0.1234,0.0398-0.0401,0.0802-0.0796,0.1206-0.1191,0.04-0.0393,0.08-0.0789,0.12-0.1176,0.04-0.0379,0.081-0.0749,0.121-0.1123,0.0401-0.0373,0.0799-0.0747,0.1205-0.1114,0.0398-0.036,0.0802-0.0713,0.1204-0.1068,0.0401-0.0353,0.08-0.0707,0.1205-0.1055,0.0399-0.0343,0.0801-0.068,0.1204-0.1018,0.0399-0.0335,0.08-0.067,0.1204-0.1,0.0399-0.0326,0.0802-0.0649,0.1205-0.0971,0.04-0.0319,0.08-0.0635,0.1204-0.0949,0.0399-0.0311,0.0802-0.0618,0.1205-0.0924,0.04-0.0303,0.0801-0.0605,0.1204-0.0903l0.1204-0.0878c0.04-0.0289,0.0801-0.0576,0.1205-0.086,0.0399-0.0281,0.0801-0.0559,0.1204-0.0835,0.04-0.0275,0.0801-0.0548,0.1204-0.0818,0.04-0.0267,0.0802-0.053,0.1205-0.0793,0.04-0.0261,0.08-0.0524,0.1204-0.0781,0.0399-0.0254,0.0802-0.0502,0.1205-0.0752,0.0401-0.0249,0.08-0.0501,0.1204-0.0745,0.0398-0.0241,0.0802-0.0475,0.1204-0.0712s0.08-0.0478,0.1205-0.0711c0.0398-0.0229,0.0803-0.0448,0.1204-0.0673,0.0402-0.0225,0.0801-0.0453,0.1205-0.0674,0.0399-0.0218,0.0802-0.0428,0.1204-0.0641,0.0401-0.0213,0.0801-0.0427,0.1204-0.0636,0.04-0.0207,0.0802-0.041,0.1205-0.0613l0.1204-0.0598c0.0401-0.0197,0.0802-0.0394,0.1205-0.0586,0.04-0.0191,0.0802-0.0376,0.1204-0.0563s0.08-0.0378,0.1204-0.056c0.0399-0.0181,0.0803-0.0351,0.1205-0.0527,0.0401-0.0176,0.0801-0.0355,0.1204-0.0527,0.04-0.017,0.0803-0.0334,0.1205-0.05l0.1204-0.0492,0.1204-0.0478,0.1205-0.0458c0.0402-0.0152,0.08-0.0309,0.1204-0.0457,0.0399-0.0146,0.0804-0.0282,0.1205-0.0424s0.0801-0.0286,0.1204-0.0424l0.1204-0.0403,0.1205-0.0391c0.0401-0.0128,0.0801-0.0259,0.1204-0.0383,0.0399-0.0123,0.0803-0.024,0.1204-0.0359,0.0402-0.012,0.0802-0.0242,0.1205-0.0358,0.04-0.0115,0.0802-0.0222,0.1204-0.0333l0.1205-0.0327c0.0401-0.0106,0.0801-0.0214,0.1204-0.0316,0.04-0.0102,0.0803-0.0195,0.1204-0.0293s0.0802-0.02,0.1205-0.0294c0.04-0.0093,0.0803-0.018,0.1204-0.0269l0.1205-0.0262c0.0401-0.0086,0.0801-0.0173,0.1204-0.0254,0.04-0.008,0.0803-0.0154,0.1204-0.0231,0.0402-0.0077,0.0802-0.0157,0.1205-0.023,0.0401-0.0073,0.0802-0.0139,0.1204-0.0208l0.1205-0.02c0.0401-0.0064,0.0801-0.0133,0.1204-0.0194,0.04-0.0061,0.0803-0.0112,0.1204-0.0169,0.0401-0.0056,0.0802-0.0116,0.1205-0.0169l0.145-0.0151,0.121-0.0137c0.0402-0.0045,0.0801-0.0097,0.1204-0.0138,0.04-0.0041,0.0803-0.0071,0.1204-0.0108l0.121-0.0106c0.0401-0.0034,0.0802-0.0067,0.1204-0.0096,0.0401-0.0029,0.0803-0.0052,0.1205-0.0077s0.0802-0.0054,0.1204-0.0076c0.04-0.0022,0.0802-0.0037,0.1204-0.0055l0.1205-0.0046c0.0401-0.0014,0.0801-0.0035,0.1204-0.0045,0.04-0.001,0.0803-0.0009,0.1204-0.0015s0.0803-0.0013,0.1205-0.0015l0.0535-0.0007h0.0669,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1022v62.502c0,0.5437-0.0349,1.0793-0.1022,1.6047-0.0324,0.253-0.0732,0.5033-0.1205,0.7513-0.036,0.1886-0.076,0.3758-0.1204,0.5613-0.0374,0.1563-0.0774,0.3115-0.1205,0.4655-0.0379,0.1351-0.0782,0.2692-0.1204,0.4023-0.0383,0.1206-0.0786,0.2403-0.1204,0.3593-0.0387,0.1101-0.0788,0.2196-0.1205,0.3283-0.0389,0.1015-0.079,0.2023-0.1204,0.3025-0.039,0.0943-0.0792,0.1882-0.1204,0.2813-0.0392,0.0884-0.0794,0.1762-0.1205,0.2636-0.0392,0.0833-0.0794,0.166-0.1204,0.2483-0.0394,0.079-0.0795,0.1575-0.1205,0.2355-0.0394,0.0751-0.0795,0.1498-0.1204,0.224-0.0396,0.0718-0.0794,0.1433-0.1204,0.2142-0.0395,0.0684-0.0797,0.1364-0.1205,0.204-0.0394,0.0654-0.0798,0.1301-0.1204,0.1947-0.0396,0.0631-0.0798,0.1258-0.1205,0.1881-0.0398,0.0609-0.0796,0.1217-0.1204,0.1818-0.0396,0.0583-0.0799,0.1162-0.1204,0.1738-0.0396,0.0563-0.0799,0.1121-0.1205,0.1678-0.0398,0.0547-0.0798,0.1092-0.1204,0.1632-0.0397,0.0528-0.0799,0.1052-0.1205,0.1573-0.0397,0.0509-0.08,0.1013-0.1204,0.1516-0.0399,0.0497-0.0798,0.0994-0.1204,0.1484-0.0397,0.0479-0.0801,0.0952-0.1205,0.1425-0.0398,0.0466-0.0799,0.0928-0.1204,0.1388-0.04,0.0454-0.0798,0.091-0.1204,0.1358-0.0397,0.0438-0.0802,0.0868-0.1205,0.1301-0.04,0.0429-0.0798,0.0859-0.1204,0.1282-0.0398,0.0415-0.0801,0.0824-0.1205,0.1234-0.0399,0.0405-0.0799,0.0807-0.1204,0.1207-0.0399,0.0395-0.08,0.0787-0.1205,0.1177-0.0398,0.0383-0.0801,0.0761-0.1204,0.1139-0.04,0.0375-0.0799,0.0751-0.1204,0.1121-0.0398,0.0363-0.0802,0.0719-0.1205,0.1077-0.0401,0.0357-0.0798,0.0717-0.1204,0.1068-0.0397,0.0344-0.0803,0.0679-0.1204,0.1019-0.0401,0.0339-0.08,0.0681-0.1205,0.1015-0.0398,0.0328-0.0802,0.0649-0.1204,0.0971-0.0401,0.0322-0.08,0.0647-0.1205,0.0964-0.0398,0.0312-0.0802,0.0616-0.1204,0.0923-0.0401,0.0306-0.0799,0.0614-0.1204,0.0915-0.0398,0.0297-0.0803,0.0586-0.1205,0.0879-0.0401,0.0291-0.0799,0.0585-0.1204,0.0872-0.0398,0.0282-0.0802,0.0558-0.1204,0.0835-0.0402,0.0278-0.08,0.0559-0.1205,0.0832-0.0398,0.0268-0.0802,0.0529-0.1204,0.0793s-0.08,0.0533-0.1205,0.0793c-0.0398,0.0255-0.0803,0.05-0.1204,0.0751s-0.08,0.0506-0.1205,0.0752c-0.0399,0.0243-0.0803,0.0479-0.1204,0.0717s-0.08,0.0478-0.1204,0.0712c-0.04,0.0231-0.0802,0.0457-0.1205,0.0684-0.04,0.0226-0.0801,0.0452-0.1204,0.0673-0.04,0.022-0.0801,0.0438-0.1204,0.0653l-0.1205,0.0636c-0.0401,0.0209-0.0801,0.0418-0.1204,0.0623-0.04,0.0203-0.0802,0.04-0.1205,0.0599-0.0401,0.0198-0.08,0.0402-0.1204,0.0596-0.0399,0.0192-0.0803,0.0375-0.1204,0.0563-0.0402,0.0188-0.0801,0.0379-0.1205,0.0563-0.0399,0.0182-0.0803,0.0356-0.1204,0.0534l-0.1205,0.0527-0.1204,0.0511c-0.04,0.0167-0.0803,0.0329-0.1205,0.0492-0.0401,0.0163-0.0801,0.0329-0.1204,0.0488-0.0399,0.0157-0.0802,0.0304-0.1204,0.0457s-0.0801,0.0309-0.1205,0.0458c-0.04,0.0148-0.0802,0.0289-0.1204,0.0433l-0.1204,0.0424-0.1205,0.0413c-0.04,0.0134-0.0803,0.0262-0.1204,0.0391-0.0402,0.013-0.0801,0.0265-0.1205,0.0391-0.0399,0.0125-0.0803,0.024-0.1204,0.0361l-0.1204,0.0358-0.1205,0.0343c-0.04,0.0112-0.0802,0.0218-0.1204,0.0326s-0.0802,0.0222-0.1205,0.0325c-0.0399,0.0103-0.0804,0.0195-0.1204,0.0294-0.0401,0.0099-0.0802,0.0199-0.1204,0.0294l-0.1205,0.0277-0.1204,0.0263c-0.0402,0.0087-0.0801,0.018-0.1205,0.0263-0.04,0.0082-0.0803,0.0152-0.1204,0.023s-0.0802,0.0157-0.1204,0.0231l-0.1205,0.0217c-0.04,0.007-0.0802,0.0133-0.1204,0.0199s-0.0802,0.0138-0.1204,0.02c-0.04,0.0062-0.0803,0.0114-0.1205,0.0172l-0.1204,0.0169c-0.0401,0.0054-0.0802,0.0109-0.1205,0.0159-0.04,0.005-0.0803,0.0092-0.1204,0.0138-0.0402,0.0046-0.0802,0.0096-0.1205,0.0138-0.04,0.0042-0.0802,0.0078-0.1204,0.0116l-0.1204,0.0107c-0.0402,0.0034-0.0802,0.0076-0.1205,0.0106-0.04,0.003-0.0803,0.005-0.1204,0.0076l-0.1204,0.0076-0.1205,0.0064c-0.04,0.0019-0.0803,0.0031-0.1204,0.0046-0.0402,0.0015-0.0803,0.0034-0.1205,0.0046-0.04,0.0011-0.0803,0.0015-0.1204,0.0023l-0.1204,0.0015c-0.0372,0.0003-0.0743,0.0014-0.1117,0.0014h-0.0088-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.2587v-26.344s0.089,0.0245,0.2587,0.0673l0.1205,0.0301,0.1204,0.0294,0.1204,0.0289,0.1205,0.0285,0.1204,0.028,0.1205,0.0276,0.1204,0.0272,0.1204,0.0268,0.1205,0.0264,0.1204,0.0261,0.1204,0.0257,0.1205,0.0254,0.1204,0.0251,0.1205,0.0246,0.1204,0.0244,0.1204,0.0241,0.1205,0.0238,0.1204,0.0234,0.1205,0.0233,0.1204,0.0229,0.1204,0.0225,0.1205,0.0223,0.1204,0.022,0.1205,0.0217,0.1204,0.0215,0.1204,0.0211,0.1205,0.0209,0.1204,0.0205,0.1205,0.0203,0.1204,0.02,0.1204,0.0198,0.1205,0.0195,0.1204,0.0192,0.1205,0.019,0.1204,0.0187,0.1204,0.0185,0.1205,0.0181,0.1204,0.0179,0.1205,0.0176,0.1204,0.0174,0.1204,0.0171,0.1205,0.0169,0.1204,0.0165,0.1204,0.0164,0.1205,0.016,0.1204,0.0158,0.1205,0.0156,0.1204,0.0152,0.1204,0.0151,0.1205,0.0147,0.1204,0.0146,0.1205,0.0141,0.1204,0.0141,0.1204,0.0136,0.1205,0.0136,0.1204,0.0132,0.1205,0.0129,0.1204,0.0128,0.1204,0.0123,0.1205,0.0123,0.1204,0.0118,0.1205,0.0117,0.1204,0.0115,0.1204,0.011,0.1205,0.0111,0.1204,0.0104,0.1205,0.0104,0.1204,0.0101,0.1204,0.0098,0.1205,0.0097,0.1204,0.0091,0.1204,0.0092,0.1205,0.0087,0.1204,0.0085,0.1205,0.0084,0.1204,0.0078,0.1204,0.0078,0.1205,0.0075,0.1204,0.0071,0.1205,0.0071,0.1204,0.0065,0.1204,0.0064,0.1205,0.0062,0.1204,0.0057,0.1205,0.0057,0.1204,0.0052,0.1204,0.005,0.1205,0.005,0.1204,0.0042,0.1205,0.0043,0.1204,0.004,0.1204,0.0035,0.1205,0.0036,0.1204,0.003,0.1205,0.0027,0.1204,0.0028,0.1204,0.002,0.1205,0.002,0.1204,0.0018,0.1204,0.0012,0.1205,0.0013,0.1204,0.0009,0.1205,0.0004,0.1204,0.0003,0.0465,0.0002,0.0739-0.0004,0.1205-0.0008,0.1204-0.0007,0.1205-0.0007,0.1204-0.0007,0.1204-0.0022,0.1205-0.0022,0.1204-0.0022,0.1205-0.0022,0.1204-0.003,0.1204-0.0038,0.1205-0.0037,0.1204-0.0037,0.1205-0.004,0.1204-0.0053,0.1204-0.0053,0.1205-0.0054,0.1204-0.0053,0.1205-0.0067,0.1204-0.0069,0.1204-0.007,0.1205-0.007,0.1204-0.008,0.1205-0.0087,0.1204-0.0086,0.1204-0.0087,0.1205-0.0096,0.1204-0.0104,0.1205-0.0104,0.1204-0.0105,0.1204-0.0113,0.1205-0.0123,0.1204-0.0122,0.1204-0.0123,0.1205-0.0134,0.1204-0.0141,0.1205-0.0142,0.1204-0.0141,0.1204-0.0157,0.1205-0.0161,0.1204-0.0161,0.1205-0.0164c0.0406-0.0058,0.0801-0.0122,0.1204-0.0181l0.1204-0.0181,0.1205-0.0182,0.1204-0.0191c0.0405-0.0065,0.0802-0.0136,0.1205-0.0203l0.1204-0.0202c0.0399-0.0068,0.0808-0.0133,0.1204-0.0203,0.0406-0.0072,0.0801-0.0149,0.1205-0.0223l0.1204-0.0225,0.1205-0.0225,0.1204-0.0236c0.0405-0.008,0.0802-0.0166,0.1204-0.0248l0.1205-0.0248,0.1204-0.0252c0.0407-0.0087,0.0801-0.0181,0.1204-0.0271l0.1205-0.0272c0.0399-0.0092,0.0808-0.0178,0.1204-0.0271,0.0407-0.0096,0.0802-0.0197,0.1205-0.0294l0.1204-0.0297c0.04-0.0099,0.0808-0.0195,0.1205-0.0296,0.0405-0.0103,0.0803-0.0211,0.1204-0.0316l0.1204-0.0322c0.0401-0.0108,0.0808-0.0213,0.1205-0.0323,0.0405-0.0111,0.0803-0.0227,0.1204-0.0341l0.1204-0.0349c0.0401-0.0117,0.0808-0.0231,0.1205-0.035l0.1204-0.0369,0.1205-0.0378c0.04-0.0126,0.0808-0.0249,0.1204-0.0378l0.1204-0.0401,0.1205-0.0408c0.04-0.0137,0.0809-0.0269,0.1204-0.0408,0.0407-0.0143,0.0802-0.0292,0.1205-0.0437l0.1204-0.0439c0.0401-0.0149,0.0807-0.0295,0.1204-0.0446,0.0407-0.0154,0.0803-0.0314,0.1205-0.0471s0.0807-0.0313,0.1204-0.0472l0.1205-0.049,0.1204-0.0506c0.04-0.0169,0.0809-0.0333,0.1204-0.0505,0.0408-0.0177,0.0802-0.0362,0.1205-0.0542l0.1204-0.0541,0.1204-0.056c0.0405-0.0191,0.0805-0.0386,0.1205-0.058,0.0401-0.0194,0.0809-0.0386,0.1204-0.0583,0.0408-0.0204,0.0803-0.0414,0.1205-0.062s0.0808-0.041,0.1204-0.0619c0.0407-0.0214,0.0804-0.0433,0.1205-0.0651,0.0404-0.0219,0.0806-0.0439,0.1204-0.0661,0.0405-0.0226,0.0806-0.0454,0.1204-0.0683,0.0406-0.0233,0.0806-0.047,0.1205-0.0707,0.0403-0.0239,0.0807-0.0478,0.1204-0.072,0.0407-0.0249,0.0805-0.0501,0.1205-0.0753,0.0403-0.0253,0.0808-0.0506,0.1204-0.0763,0.0407-0.0264,0.0804-0.0535,0.1204-0.0803,0.0403-0.0271,0.0809-0.0539,0.1205-0.0813,0.0408-0.0282,0.0804-0.0569,0.1204-0.0855,0.0403-0.0288,0.0809-0.0577,0.1204-0.0869,0.0408-0.0301,0.0806-0.0606,0.1205-0.0911,0.0405-0.0309,0.0808-0.062,0.1204-0.0933,0.0406-0.0321,0.0807-0.0646,0.1205-0.0972,0.0406-0.0333,0.0807-0.067,0.1204-0.1007,0.0405-0.0344,0.081-0.0687,0.1205-0.1035,0.0409-0.036,0.0805-0.0727,0.1204-0.1092,0.0404-0.037,0.081-0.0739,0.1204-0.1114,0.0409-0.0389,0.0808-0.0782,0.1205-0.1176,0.0407-0.0404,0.0808-0.0812,0.1204-0.1221,0.0405-0.0418,0.0811-0.0835,0.1204-0.1258,0.041-0.0443,0.0807-0.0891,0.1205-0.134,0.0409-0.0461,0.0809-0.0926,0.1204-0.1393,0.0407-0.0481,0.0812-0.0963,0.1205-0.1451,0.0408-0.0507,0.0811-0.1014,0.1204-0.1527,0.0411-0.0537,0.0809-0.1079,0.1204-0.1623,0.0411-0.0566,0.0811-0.1136,0.1205-0.171,0.0411-0.0598,0.0812-0.1201,0.1204-0.1808,0.0411-0.0636,0.0813-0.1277,0.1204-0.1923,0.0412-0.0682,0.0815-0.1367,0.1205-0.2059,0.0414-0.0733,0.0815-0.1471,0.1204-0.2215,0.0416-0.0796,0.0817-0.1597,0.1205-0.2404,0.0418-0.0868,0.0818-0.1744,0.1204-0.2625,0.0419-0.0958,0.0822-0.1922,0.1205-0.2895,0.0422-0.1073,0.0825-0.2155,0.1204-0.3246,0.043-0.1238,0.0829-0.2489,0.1204-0.375,0.0438-0.1474,0.0839-0.2963,0.1205-0.4466,0.0454-0.1865,0.0857-0.3751,0.1204-0.5658,0.0516-0.2839,0.0914-0.5723,0.1204-0.8645,0.0405-0.4075,0.0602-0.8223,0.0602-1.2436v-14.504h-0.0602-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.0913v14.504c0,0.227-0.0099,0.4504-0.0292,0.6695-0.0246,0.2791-0.0649,0.5512-0.1204,0.8158-0.0343,0.1634-0.0745,0.3238-0.1204,0.4812-0.0366,0.1254-0.0766,0.2488-0.1205,0.3701-0.0374,0.1033-0.0777,0.2049-0.1204,0.3051-0.0381,0.0894-0.0782,0.1774-0.1205,0.2642-0.0385,0.079-0.0784,0.1571-0.1204,0.2338-0.0386,0.0706-0.079,0.1398-0.1204,0.2084-0.0389,0.0645-0.079,0.1282-0.1205,0.1909-0.039,0.0588-0.0792,0.1168-0.1204,0.174-0.0392,0.0545-0.0791,0.1086-0.1204,0.1617-0.0392,0.0504-0.0795,0.0998-0.1205,0.1488-0.0393,0.0469-0.0794,0.0931-0.1204,0.1388-0.0394,0.044-0.0795,0.0875-0.1205,0.1302-0.0395,0.0412-0.0795,0.082-0.1204,0.1221-0.0395,0.0387-0.0796,0.0771-0.1204,0.1147-0.0395,0.0364-0.0798,0.0721-0.1205,0.1075-0.0395,0.0343-0.0797,0.0682-0.1204,0.1015-0.0396,0.0324-0.0799,0.0643-0.1205,0.0958-0.0396,0.0306-0.0798,0.0608-0.1204,0.0906-0.0397,0.029-0.0798,0.0576-0.1204,0.0857-0.0397,0.0275-0.0798,0.0545-0.1205,0.0812-0.0397,0.026-0.0798,0.0516-0.1204,0.0768-0.0397,0.0246-0.0799,0.0488-0.1205,0.0726-0.0397,0.0233-0.0799,0.0461-0.1204,0.0687-0.0397,0.0221-0.0799,0.0436-0.1204,0.065-0.0398,0.021-0.0799,0.0415-0.1205,0.0617-0.0398,0.0198-0.0799,0.0393-0.1204,0.0585-0.0399,0.0188-0.0799,0.0375-0.1205,0.0556-0.0399,0.0178-0.0799,0.0354-0.1204,0.0525-0.0397,0.0168-0.08,0.033-0.1204,0.0491-0.0398,0.0159-0.0801,0.0314-0.1205,0.0466-0.0399,0.015-0.0799,0.0297-0.1204,0.0441-0.0399,0.0142-0.08,0.0283-0.1205,0.0418-0.0398,0.0133-0.08,0.0263-0.1204,0.039-0.0398,0.0125-0.0801,0.0245-0.1204,0.0364-0.0399,0.0118-0.0801,0.0234-0.1205,0.0345-0.04,0.011-0.08,0.0221-0.1204,0.0325-0.0399,0.0103-0.0801,0.0202-0.1205,0.0299-0.0398,0.0096-0.08,0.0188-0.1204,0.0278-0.0399,0.0089-0.08,0.0177-0.1204,0.0261-0.04,0.0083-0.08,0.0164-0.1205,0.0241-0.0399,0.0076-0.0801,0.0147-0.1204,0.0218-0.04,0.007-0.0801,0.014-0.1205,0.0205l-0.1204,0.0184c-0.0399,0.0058-0.0801,0.0111-0.1204,0.0164-0.04,0.0053-0.08,0.0105-0.1205,0.0152l-0.1204,0.0134c-0.0399,0.0041-0.0801,0.0077-0.1204,0.0114-0.0401,0.0036-0.0801,0.0073-0.1205,0.0104-0.0399,0.0031-0.0801,0.0058-0.1204,0.0084-0.04,0.0026-0.0802,0.0048-0.1205,0.0069-0.0401,0.0021-0.08,0.0042-0.1204,0.0058-0.0399,0.0016-0.0802,0.0025-0.1204,0.0037l-0.1205,0.0028c-0.0399,0.0007-0.0801,0.0009-0.1204,0.0012l-0.0453,0.0004-0.0752-0.0003-0.1204-0.0008h-0.124l-0.121-0.003-0.12-0.003-0.121-0.004-0.12-0.005-0.121-0.005-0.12-0.007-0.121-0.007-0.12-0.007-0.12-0.009-0.121-0.009-0.12-0.01-0.121-0.011-0.12-0.012-0.121-0.012-0.12-0.013-0.121-0.014-0.12-0.014-0.12-0.016-0.121-0.016-0.12-0.016-0.121-0.018-0.12-0.018-0.121-0.019-0.12-0.019-0.121-0.02-0.12-0.021-0.12-0.022-0.121-0.023-0.12-0.022-0.121-0.024-0.12-0.025-0.121-0.025-0.12-0.026-0.121-0.026-0.12-0.027-0.12-0.028-0.121-0.028-0.12-0.03-0.121-0.029-0.12-0.031-0.121-0.031-0.12-0.032-0.12-0.032-0.121-0.033-0.12-0.034-0.121-0.034-0.12-0.035-0.121-0.036-0.12-0.036-0.12-0.037-0.121-0.038-0.12-0.038-0.121-0.039-0.12-0.039-0.121-0.04-0.12-0.041-0.1206-0.041-0.1204-0.042-0.1205-0.042-0.1204-0.043-0.1204-0.044-0.1205-0.044-0.1204-0.045-0.1205-0.045-0.1204-0.046-0.1204-0.047-0.1205-0.047-0.1204-0.048-0.1205-0.048-0.1204-0.049-0.1204-0.049-0.1205-0.05-0.1204-0.051-0.1205-0.051-0.1204-0.051-0.1204-0.052-0.1205-0.053-0.1204-0.054-0.1204-0.053-0.1205-0.055-0.1204-0.054-0.1205-0.056-0.1204-0.056-0.1204-0.056-0.1205-0.057v-0.0001z'),
											_1: {ctor: '[]'}
										}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$path,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$fill('url(#id1)'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$class('fil3'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$d('m41.091,34.485c-0.0878,0.071-0.1742,0.1426-0.2586,0.2151v-16.366c0-0.8703,0.0893-1.7198,0.2586-2.5401,0.0364-0.1761,0.0767-0.3506,0.1204-0.5239,0.0375-0.1487,0.0778-0.2962,0.1205-0.4427,0.0381-0.1305,0.0783-0.2601,0.1205-0.3888,0.0385-0.1176,0.0785-0.2346,0.1204-0.3506,0.0388-0.1075,0.0788-0.2145,0.1205-0.3206,0.039-0.0992,0.079-0.1979,0.1204-0.2959,0.0391-0.0924,0.0792-0.1842,0.1204-0.2755,0.0391-0.0867,0.0795-0.1728,0.1205-0.2584,0.0392-0.0818,0.0795-0.1628,0.1204-0.2436,0.0393-0.0776,0.0796-0.1546,0.1205-0.2313,0.0394-0.0739,0.0796-0.1473,0.1204-0.2203,0.0395-0.0707,0.0796-0.1411,0.1205-0.2109,0.0396-0.0678,0.0795-0.1353,0.1204-0.2023,0.0395-0.0647,0.0797-0.129,0.1204-0.1929,0.0396-0.0622,0.0799-0.1237,0.1205-0.1851,0.0397-0.0601,0.0797-0.1198,0.1204-0.1791,0.0399-0.0582,0.0797-0.1164,0.1205-0.1738,0.0395-0.0556,0.08-0.1103,0.1204-0.1651,0.0398-0.054,0.0799-0.1077,0.1205-0.161,0.0399-0.0525,0.0797-0.1051,0.1204-0.1569,0.0395-0.0503,0.0802-0.0999,0.1205-0.1496,0.0398-0.0491,0.0799-0.098,0.1204-0.1464,0.0399-0.0478,0.0799-0.0954,0.1205-0.1425,0.0397-0.046,0.0801-0.0914,0.1204-0.1368,0.0399-0.045,0.0799-0.0902,0.1205-0.1347,0.0397-0.0435,0.08-0.0865,0.1203-0.1294,0.0398-0.0424,0.08-0.0845,0.1204-0.1264,0.04-0.0413,0.08-0.0826,0.1205-0.1234,0.0398-0.04,0.0801-0.0795,0.1204-0.119,0.0401-0.0393,0.0799-0.0789,0.1205-0.1177,0.0397-0.0379,0.0802-0.0749,0.1204-0.1123,0.04-0.0373,0.0799-0.0747,0.1205-0.1114,0.0398-0.036,0.0802-0.0714,0.1204-0.1069,0.04-0.0354,0.08-0.0707,0.1205-0.1055,0.0399-0.0343,0.0801-0.068,0.1204-0.1018,0.04-0.0335,0.0801-0.067,0.1205-0.1001,0.0399-0.0326,0.0801-0.0649,0.1204-0.097,0.04-0.0319,0.0801-0.0636,0.1205-0.095,0.0399-0.031,0.0801-0.0617,0.1204-0.0923,0.04-0.0303,0.0801-0.0605,0.1204-0.0903,0.0399-0.0296,0.0802-0.0588,0.1205-0.0879,0.04-0.0288,0.0801-0.0576,0.1204-0.086,0.04-0.0281,0.0802-0.0558,0.1205-0.0835,0.04-0.0275,0.0801-0.0549,0.1204-0.0819,0.0399-0.0267,0.0802-0.053,0.1205-0.0793,0.04-0.0262,0.08-0.0524,0.1204-0.0781,0.04-0.0254,0.0802-0.0502,0.1205-0.0752,0.0401-0.0249,0.08-0.0501,0.1204-0.0745,0.06-0.0223,0.101-0.0457,0.141-0.0694s0.08-0.0479,0.12-0.0711c0.04-0.0229,0.081-0.0449,0.121-0.0674s0.08-0.0452,0.12-0.0672c0.04-0.0218,0.08-0.0428,0.121-0.0642,0.04-0.0213,0.08-0.0427,0.12-0.0636l0.1204-0.0613,0.1205-0.0599c0.04-0.0196,0.0801-0.0394,0.1204-0.0586,0.04-0.0191,0.0803-0.0376,0.1205-0.0563,0.0402-0.0186,0.08-0.0378,0.1204-0.056,0.0399-0.0181,0.0803-0.0351,0.1205-0.0527,0.0401-0.0176,0.0801-0.0355,0.1204-0.0527,0.04-0.017,0.0802-0.0335,0.1204-0.0501l0.1205-0.0492c0.0401-0.0161,0.0801-0.0322,0.1204-0.0479,0.04-0.0156,0.0803-0.0306,0.1205-0.0458s0.08-0.0309,0.1204-0.0457c0.0399-0.0146,0.0804-0.0282,0.1205-0.0424s0.0801-0.0286,0.1204-0.0424c0.04-0.0138,0.0803-0.027,0.1205-0.0403l0.1204-0.0391c0.0401-0.0128,0.0802-0.0259,0.1205-0.0384,0.0399-0.0123,0.0803-0.0239,0.1204-0.0358,0.0401-0.012,0.0802-0.0243,0.1205-0.0359,0.04-0.0115,0.0802-0.0222,0.1204-0.0333l0.128-0.0327c0.0402-0.0106,0.0802-0.0214,0.1205-0.0316,0.04-0.0101,0.0803-0.0196,0.1204-0.0294s0.0802-0.02,0.1205-0.0294c0.04-0.0093,0.0803-0.018,0.1204-0.0269l0.123-0.0262c0.04-0.0085,0.08-0.0173,0.12-0.0254s0.081-0.0154,0.121-0.0231,0.08-0.0158,0.12-0.0231l0.121-0.0208,0.12-0.0199c0.04-0.0065,0.08-0.0134,0.121-0.0195,0.04-0.0061,0.08-0.0112,0.12-0.0169,0.04-0.0056,0.08-0.0115,0.12-0.0168l0.1205-0.0151,0.1204-0.0138c0.0402-0.0045,0.0802-0.0097,0.1205-0.0138,0.04-0.0041,0.0803-0.0071,0.1204-0.0108l0.123-0.0106c0.04-0.0034,0.08-0.0067,0.12-0.0096s0.08-0.0052,0.12-0.0077c0.041-0.0025,0.081-0.0054,0.121-0.0076s0.08-0.0037,0.12-0.0055l0.1204-0.0046c0.0402-0.0014,0.0802-0.0035,0.1205-0.0045,0.04-0.001,0.0803-0.0009,0.1204-0.0015,0.0402-0.0006,0.0803-0.0013,0.1205-0.0015l0.0531-0.0007h0.0673,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1205,0.1204,0.1204,0.1205,0.1205,0.1204,0.1021v62.502c0,0.5435-0.0348,1.0787-0.1021,1.6039-0.0324,0.2529-0.0731,0.5031-0.1204,0.751-0.036,0.1887-0.0761,0.376-0.1205,0.5616-0.0374,0.1563-0.0773,0.3116-0.1205,0.4656-0.0379,0.1351-0.0781,0.2692-0.1204,0.4024-0.0383,0.1206-0.0786,0.2402-0.1204,0.3592-0.0387,0.1101-0.0789,0.2196-0.1205,0.3283-0.0389,0.1014-0.0789,0.2021-0.1204,0.3023-0.0391,0.0944-0.0792,0.1883-0.1205,0.2815-0.0391,0.0884-0.0793,0.1761-0.1204,0.2634-0.0393,0.0834-0.0794,0.1663-0.1205,0.2486-0.0393,0.0789-0.0795,0.1574-0.1204,0.2354-0.0395,0.0752-0.0795,0.1499-0.1205,0.2242-0.0396,0.0718-0.0794,0.1433-0.1204,0.2142-0.0394,0.0683-0.0797,0.1362-0.1204,0.2037-0.0395,0.0655-0.0798,0.1302-0.1205,0.1949-0.0396,0.063-0.0797,0.1257-0.1204,0.1879-0.0398,0.0609-0.0796,0.1219-0.1205,0.182-0.0396,0.0583-0.0799,0.1161-0.1204,0.1737-0.0396,0.0563-0.0799,0.1121-0.1205,0.1678-0.0398,0.0547-0.0798,0.1093-0.1204,0.1633-0.0397,0.0527-0.0799,0.1049-0.1204,0.157-0.0397,0.051-0.0801,0.1015-0.1205,0.1518-0.0399,0.0497-0.0797,0.0993-0.1204,0.1484-0.0397,0.0479-0.0801,0.0952-0.1205,0.1426-0.0398,0.0466-0.0799,0.0927-0.1204,0.1387-0.04,0.0454-0.0799,0.0909-0.1205,0.1358-0.0397,0.0438-0.0802,0.0868-0.1204,0.1301-0.04,0.0429-0.0799,0.086-0.1205,0.1284-0.0398,0.0415-0.0801,0.0823-0.1204,0.1232-0.0399,0.0405-0.0799,0.0807-0.1204,0.1207-0.0399,0.0395-0.08,0.0787-0.1205,0.1177-0.0398,0.0383-0.0801,0.0761-0.1204,0.1139-0.0401,0.0375-0.08,0.0753-0.1205,0.1123-0.0398,0.0363-0.0802,0.0719-0.1205,0.1077-0.0401,0.0357-0.0798,0.0717-0.1204,0.1068-0.0398,0.0345-0.0803,0.0681-0.1205,0.102-0.0401,0.0339-0.0799,0.0681-0.1204,0.1014-0.0398,0.0328-0.0803,0.0647-0.1204,0.097-0.0401,0.0322-0.08,0.0647-0.1205,0.0964-0.0398,0.0312-0.0802,0.0616-0.1204,0.0923-0.0401,0.0306-0.08,0.0614-0.1205,0.0916-0.0398,0.0297-0.0802,0.0587-0.1204,0.0879-0.0401,0.0291-0.08,0.0586-0.1205,0.0872-0.0398,0.0282-0.0802,0.0557-0.1204,0.0835-0.0401,0.0278-0.08,0.0559-0.1205,0.0832-0.0398,0.0268-0.0802,0.0529-0.1204,0.0793-0.0401,0.0264-0.0799,0.0533-0.1204,0.0792-0.0399,0.0256-0.0804,0.0502-0.1205,0.0753s-0.08,0.0505-0.1204,0.0751c-0.0399,0.0243-0.0803,0.0478-0.1205,0.0717-0.0401,0.0238-0.0801,0.0478-0.1204,0.0712-0.04,0.0231-0.0802,0.0458-0.1205,0.0685l-0.1204,0.0673-0.1205,0.0653-0.1204,0.0635c-0.0401,0.0209-0.0801,0.0419-0.1204,0.0624-0.04,0.0203-0.0802,0.04-0.1205,0.0599-0.0401,0.0199-0.08,0.0402-0.1204,0.0596-0.0399,0.0192-0.0804,0.0375-0.1205,0.0563s-0.0801,0.038-0.1204,0.0563c-0.04,0.0182-0.0804,0.0357-0.1205,0.0535l-0.1204,0.0526-0.1205,0.0511-0.1204,0.0493c-0.0402,0.0163-0.0802,0.0329-0.1205,0.0488-0.0399,0.0157-0.0803,0.0304-0.1204,0.0457-0.0402,0.0153-0.0801,0.0309-0.1205,0.0458-0.04,0.0148-0.0802,0.0289-0.1204,0.0433l-0.1205,0.0425-0.1204,0.0412c-0.04,0.0134-0.0803,0.0261-0.1205,0.0391s-0.0801,0.0266-0.1204,0.0391c-0.0399,0.0125-0.0803,0.024-0.1204,0.0361l-0.1205,0.0358-0.1204,0.0343c-0.0401,0.0112-0.0803,0.0219-0.1205,0.0326-0.0402,0.0108-0.08,0.0222-0.1204,0.0326-0.04,0.0103-0.0803,0.0195-0.1205,0.0294-0.0401,0.0099-0.0802,0.0199-0.1204,0.0294l-0.1205,0.0278-0.1204,0.0262c-0.0402,0.0086-0.0801,0.0179-0.1204,0.0262-0.04,0.0082-0.0804,0.0154-0.1205,0.0232l-0.1204,0.023-0.1205,0.0217c-0.04,0.007-0.0802,0.0134-0.1204,0.02s-0.0802,0.0137-0.1205,0.0199c-0.04,0.0062-0.0803,0.0115-0.1204,0.0173l-0.1205,0.0169c-0.0401,0.0054-0.0802,0.0109-0.1204,0.0159-0.04,0.005-0.0803,0.0092-0.1204,0.0138-0.0402,0.0046-0.0802,0.0096-0.1205,0.0138-0.04,0.0042-0.0802,0.0078-0.1204,0.0116l-0.1205,0.0108c-0.0402,0.0034-0.0801,0.0075-0.1204,0.0105-0.04,0.003-0.0803,0.005-0.1205,0.0076l-0.1205,0.0077-0.1204,0.0064c-0.04,0.0019-0.0803,0.003-0.1204,0.0045-0.0402,0.0015-0.0803,0.0034-0.1205,0.0046-0.04,0.0011-0.0802,0.0015-0.1204,0.0023l-0.1205,0.0016c-0.0375,0.0003-0.0748,0.0014-0.1124,0.0014h-0.008-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1203-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1204-0.1205-0.1204-0.1204-0.1205-0.1204-0.1205-0.1205-0.1204-0.2586v-28.862c0.0844,0.0724,0.1708,0.1439,0.2586,0.2149,0.0398,0.0322,0.08,0.0642,0.1204,0.096,0.0399,0.0314,0.08,0.0627,0.1205,0.0938,0.04,0.0306,0.0799,0.0612,0.1205,0.0916,0.0397,0.0297,0.0801,0.059,0.1204,0.0884,0.0398,0.029,0.0801,0.0579,0.1205,0.0866,0.0399,0.0283,0.0799,0.0566,0.1204,0.0847l0.1204,0.0825c0.0398,0.0269,0.0801,0.0536,0.1205,0.0802l0.1204,0.0786c0.0399,0.0258,0.08,0.0515,0.1205,0.077,0.0397,0.025,0.0801,0.0498,0.1204,0.0746l0.1205,0.0733c0.04,0.024,0.08,0.048,0.1204,0.0717,0.0398,0.0234,0.0801,0.0464,0.1204,0.0695l0.1205,0.0685,0.1204,0.0667,0.1205,0.0652c0.04,0.0214,0.0799,0.043,0.1204,0.0642,0.0398,0.0209,0.0802,0.0414,0.1205,0.062l0.1204,0.0612,0.1205,0.0599,0.1204,0.0582c0.0401,0.0192,0.08,0.0386,0.1205,0.0576l0.1204,0.0556,0.1205,0.0551,0.1203,0.0533,0.1204,0.0526,0.1205,0.0514,0.1204,0.0502,0.1205,0.0494,0.1204,0.048,0.1205,0.0476,0.1204,0.0458c0.0401,0.0152,0.08,0.0306,0.1205,0.0456l0.1204,0.0439c0.0401,0.0146,0.08,0.0295,0.1205,0.0439,0.0398,0.0142,0.0803,0.0279,0.1204,0.0419l0.1205,0.042,0.1204,0.0403c0.0401,0.0134,0.0799,0.0271,0.1204,0.0403,0.0398,0.0131,0.0803,0.0257,0.1205,0.0386l0.1204,0.0386,0.1205,0.037,0.1204,0.0369,0.1205,0.0355,0.1204,0.0352,0.1205,0.0342,0.1204,0.0337,0.1205,0.0328,0.1204,0.0321,0.1205,0.0316,0.1204,0.0306,0.1204,0.0303,0.1205,0.0292,0.1204,0.0292,0.1205,0.0278,0.1204,0.0276,0.1205,0.0268,0.1204,0.0263,0.1205,0.0259,0.1204,0.0248,0.1204,0.0249,0.1205,0.0236,0.1204,0.0235,0.1205,0.0228,0.1204,0.0222,0.1205,0.022,0.1204,0.0209,0.1205,0.0208,0.1204,0.0201,0.1205,0.0196,0.1204,0.0194,0.1205,0.0183,0.1204,0.0184,0.1204,0.0176,0.1205,0.0171,0.1204,0.017,0.1205,0.0159,0.1204,0.0159,0.1205,0.0154,0.1204,0.0147,0.1205,0.0148,0.1204,0.0138,0.1205,0.0135,0.1204,0.0135,0.1205,0.0124,0.1204,0.0124,0.1204,0.012,0.1205,0.0113,0.1204,0.0113,0.1205,0.0106,0.1204,0.0102,0.1205,0.0102,0.1204,0.0093,0.1204,0.0091,0.1205,0.0092,0.1205,0.0081,0.1204,0.0081,0.1205,0.008,0.1204,0.007,0.1205,0.007,0.1204,0.0069,0.1205,0.0059,0.1204,0.006,0.1204,0.0059,0.1205,0.0049,0.1204,0.005,0.1205,0.0048,0.1204,0.004,0.1205,0.004,0.1204,0.0039,0.1205,0.003,0.1204,0.003,0.1204,0.003,0.1205,0.0021,0.1204,0.002,0.1205,0.0021,0.1204,0.0012,0.1205,0.0011,0.1204,0.0011,0.1204,0.0005,0.1205,0.0002,0.1204,0.0002,0.1205-0.0003,0.1204-0.0007,0.1205-0.0007,0.1205-0.001,0.1204-0.0016,0.1205-0.0016,0.1204-0.0016,0.1204-0.0025,0.1205-0.0024,0.1204-0.0025,0.1205-0.0031,0.1204-0.0033,0.1205-0.0034,0.1204-0.0036,0.1204-0.0042,0.1205-0.0041,0.1204-0.0042,0.1205-0.005,0.1204-0.005,0.1205-0.005,0.0588-0.0025,0.0616-0.003,0.1205-0.0058,0.1204-0.0064,0.1204-0.0066,0.1205-0.0073,0.1204-0.0074,0.1205-0.0081,0.1204-0.0082,0.1205-0.0089,0.1204-0.009,0.1205-0.0096,0.1204-0.0098,0.1204-0.0103,0.1205-0.0106,0.1205-0.0109,0.1204-0.0114,0.1205-0.0115,0.1204-0.0121,0.1205-0.0121,0.1204-0.0128,0.1204-0.0129,0.1205-0.0133,0.1204-0.0136,0.1205-0.0139,0.1204-0.0142,0.1205-0.0145,0.1204-0.0148,0.1205-0.0151,0.1204-0.0154,0.1204-0.0155,0.1205-0.0161,0.1204-0.0162,0.1205-0.0165,0.1204-0.0168,0.1205-0.017,0.1204-0.0174,0.1205-0.0175,0.1204-0.018,0.1204-0.0181,0.1205-0.0183,0.1204-0.0187,0.1205-0.0189,0.1204-0.0192,0.1205-0.0193,0.1204-0.0196,0.1205-0.02,0.1204-0.0201,0.1205-0.0204,0.1204-0.0206,0.1205-0.0209,0.1204-0.0211,0.1205-0.0214,0.1204-0.0216,0.1205-0.0218,0.1204-0.022,0.1204-0.0223,0.1205-0.0226,0.1204-0.0228,0.1205-0.023,0.1204-0.0232,0.1205-0.0235,0.1204-0.0237,0.1205-0.0239,0.1204-0.0242,0.1204-0.0244,0.1205-0.0247,0.1204-0.025,0.1205-0.0251,0.1204-0.0253,0.1205-0.0258,0.1204-0.0258,0.1205-0.0262,0.1204-0.0264,0.1204-0.0267,0.1205-0.0269,0.1204-0.0273,0.1205-0.0276,0.1205-0.0279,0.1204-0.0283,0.1205-0.0286,0.1204-0.029,0.1198-0.0296v-5.2878l-0.1198,0.0596-0.1204,0.0595-0.1205,0.0589-0.1204,0.0584-0.1205,0.058-0.1205,0.0573-0.1204,0.0566-0.1205,0.0562-0.1204,0.0555-0.1204,0.055-0.1205,0.0543-0.1204,0.0538-0.1205,0.053-0.1204,0.0524-0.1205,0.0519-0.1204,0.0512-0.1205,0.0506-0.1204,0.05-0.1204,0.0492-0.1205,0.0486-0.1204,0.048-0.1205,0.0474-0.1204,0.0465-0.1205,0.046-0.1204,0.0452-0.1205,0.0446-0.1204,0.0439-0.1204,0.0433-0.1205,0.0426-0.1204,0.0419-0.1205,0.0411-0.1204,0.0405-0.1205,0.0399-0.1204,0.0391-0.1205,0.0385-0.1204,0.0378-0.1205,0.037-0.1204,0.0364-0.1205,0.0358-0.1204,0.035-0.1205,0.0344-0.1204,0.0335-0.1205,0.033-0.1204,0.0323-0.1204,0.0316-0.1205,0.0309-0.1204,0.0302-0.1205,0.0295-0.1204,0.029-0.1205,0.0282-0.1204,0.0274-0.1205,0.0269-0.1204,0.0262-0.1204,0.0255-0.1205,0.0247-0.1204,0.0242-0.1205,0.0236-0.1204,0.0227-0.1205,0.0221-0.1204,0.0215-0.1205,0.0209-0.1204,0.02-0.1204,0.0195-0.1205,0.019-0.1204,0.0181-0.1205,0.0175-0.1204,0.017-0.1205,0.0162-0.1205,0.0155-0.1204,0.015-0.1204,0.0144-0.1205,0.0136-0.1204,0.013-0.1205,0.0125-0.1204,0.0116-0.1205,0.0112-0.1204,0.0106-0.1205,0.0098-0.073,0.0058-0.0474,0.0032-0.1204,0.0081-0.1205,0.008-0.1204,0.0065-0.1205,0.0061-0.1204,0.0056-0.1205,0.0039-0.1204,0.0039-0.1205,0.0026-0.1204,0.0018-0.1204,0.0015c-0.0404,0.0002-0.0803-0.0003-0.1205-0.0004l-0.105-0.006-0.121-0.001-0.12-0.003-0.12-0.003c-0.041-0.001-0.081-0.003-0.121-0.005s-0.08-0.003-0.12-0.005l-0.121-0.007-0.12-0.007-0.121-0.008-0.12-0.01c-0.04-0.003-0.081-0.006-0.121-0.009-0.04-0.004-0.08-0.009-0.12-0.013l-0.12-0.012-0.121-0.014-0.12-0.014-0.121-0.016-0.12-0.017c-0.04-0.006-0.081-0.012-0.121-0.018s-0.08-0.013-0.12-0.02-0.081-0.013-0.121-0.02-0.08-0.015-0.12-0.023c-0.04-0.007-0.081-0.014-0.12-0.022-0.041-0.008-0.081-0.017-0.121-0.025-0.04-0.009-0.081-0.017-0.12-0.026-0.041-0.009-0.081-0.018-0.121-0.027l-0.12-0.029c-0.041-0.01-0.081-0.02-0.121-0.03s-0.08-0.021-0.12-0.031c-0.041-0.011-0.081-0.022-0.121-0.034-0.04-0.011-0.08-0.022-0.12-0.034s-0.08-0.024-0.12-0.037c-0.041-0.012-0.081-0.024-0.121-0.037s-0.08-0.027-0.12-0.04c-0.041-0.013-0.081-0.027-0.121-0.041s-0.08-0.029-0.12-0.043c-0.04-0.015-0.081-0.029-0.121-0.045-0.04-0.015-0.08-0.031-0.12-0.047s-0.081-0.031-0.121-0.048c-0.04-0.016-0.08-0.034-0.12-0.051s-0.081-0.034-0.121-0.052-0.08-0.037-0.12-0.056-0.081-0.037-0.12-0.057c-0.041-0.019-0.081-0.039-0.121-0.059-0.04-0.021-0.08-0.041-0.12-0.062-0.041-0.021-0.081-0.042-0.121-0.064s-0.08-0.045-0.12-0.068c-0.041-0.022-0.081-0.045-0.121-0.069s-0.08-0.048-0.12-0.072c-0.041-0.025-0.081-0.051-0.12-0.076-0.041-0.026-0.081-0.051-0.121-0.078-0.041-0.027-0.08-0.055-0.12-0.082-0.041-0.028-0.081-0.057-0.121-0.085-0.04-0.029-0.081-0.058-0.12-0.088-0.041-0.031-0.081-0.062-0.121-0.094-0.04-0.031-0.08-0.063-0.12-0.096-0.041-0.033-0.081-0.066-0.121-0.1s-0.08-0.07-0.12-0.106c-0.041-0.036-0.081-0.073-0.121-0.11-0.04-0.038-0.08-0.076-0.12-0.115-0.041-0.039-0.081-0.079-0.121-0.119-0.04-0.042-0.08-0.085-0.12-0.128-0.041-0.044-0.081-0.088-0.12-0.133-0.041-0.046-0.081-0.093-0.121-0.14-0.041-0.049-0.081-0.098-0.12-0.147-0.041-0.052-0.081-0.104-0.121-0.156-0.04-0.055-0.081-0.11-0.12-0.166-0.041-0.057-0.081-0.116-0.121-0.175-0.041-0.062-0.081-0.125-0.12-0.188-0.041-0.066-0.081-0.134-0.121-0.202-0.041-0.071-0.081-0.144-0.12-0.217-0.041-0.078-0.081-0.156-0.12-0.236-0.042-0.085-0.082-0.171-0.121-0.258-0.041-0.093-0.082-0.188-0.12-0.284-0.043-0.106-0.082-0.214-0.121-0.323-0.042-0.121-0.082-0.244-0.12-0.369-0.044-0.144-0.084-0.292-0.121-0.441-0.045-0.186-0.085-0.376-0.12-0.57-0.0519-0.287-0.0923-0.582-0.1205-0.885-0.0324-0.3499-0.049-0.7104-0.049-1.0813,0-0.3711,0.0166-0.7318,0.049-1.082,0.0282-0.3031,0.0686-0.5982,0.1205-0.8854,0.035-0.1936,0.0748-0.384,0.1204-0.5702,0.0367-0.1496,0.077-0.2967,0.1205-0.4415,0.0376-0.1248,0.0779-0.2476,0.1204-0.3688,0.0384-0.1092,0.078-0.2174,0.1204-0.3236,0.0384-0.0961,0.0789-0.1905,0.1205-0.2841,0.0387-0.087,0.0789-0.1729,0.1204-0.2577,0.039-0.0797,0.079-0.1586,0.1205-0.2363,0.0391-0.0733,0.0791-0.1459,0.1204-0.2175,0.0392-0.068,0.0793-0.1353,0.1205-0.2017,0.0393-0.0634,0.0794-0.126,0.1204-0.1879,0.0393-0.0593,0.0796-0.1178,0.1205-0.1758,0.0393-0.0557,0.0796-0.1106,0.1204-0.1651,0.0394-0.0526,0.0797-0.1045,0.1205-0.156,0.0395-0.0497,0.0797-0.0988,0.1204-0.1474,0.0395-0.0473,0.0797-0.094,0.1205-0.1402,0.0396-0.0449,0.0796-0.0896,0.1204-0.1335,0.0397-0.0427,0.0796-0.0855,0.1204-0.1273,0.0395-0.0405,0.08-0.0802,0.1205-0.1198,0.0396-0.0387,0.0799-0.0769,0.1204-0.1148,0.0398-0.0371,0.0798-0.0741,0.1205-0.1104,0.0398-0.0355,0.0797-0.0711,0.1204-0.1059,0.0396-0.0338,0.0801-0.0668,0.1205-0.0999,0.0398-0.0325,0.0799-0.0646,0.1204-0.0964,0.0399-0.0314,0.0798-0.0627,0.1205-0.0933,0.0396-0.0298,0.08-0.0589,0.1204-0.088,0.0398-0.0288,0.08-0.057,0.1205-0.0851,0.04-0.0277,0.0797-0.0556,0.1204-0.0826,0.0396-0.0264,0.0802-0.052,0.1205-0.0777,0.0399-0.0255,0.0799-0.0508,0.1204-0.0756,0.0399-0.0245,0.0799-0.0488,0.1204-0.0727,0.0398-0.0235,0.0802-0.0463,0.1205-0.0692,0.04-0.0227,0.0798-0.0455,0.1204-0.0676,0.0397-0.0217,0.0802-0.0427,0.1205-0.0638,0.0399-0.0209,0.08-0.0416,0.1204-0.062,0.0399-0.0201,0.0801-0.04,0.1205-0.0596,0.0398-0.0193,0.0801-0.0381,0.1204-0.0569,0.04-0.0186,0.0799-0.0374,0.1204-0.0555,0.0398-0.0178,0.0802-0.0349,0.1205-0.0522,0.0401-0.0173,0.0799-0.0347,0.1205-0.0514,0.0398-0.0164,0.0802-0.0321,0.1204-0.048,0.0401-0.0159,0.08-0.0319,0.1205-0.0473,0.0398-0.0151,0.0802-0.0296,0.1204-0.0443,0.0401-0.0146,0.08-0.0293,0.1205-0.0435,0.0398-0.0139,0.0802-0.0274,0.1204-0.0409,0.04-0.0134,0.0801-0.0268,0.1205-0.0398,0.0399-0.0128,0.0801-0.0252,0.1204-0.0376,0.04-0.0123,0.08-0.0245,0.1204-0.0364l0.1205-0.0344c0.04-0.0112,0.08-0.0226,0.1204-0.0334,0.0399-0.0107,0.0802-0.0209,0.1205-0.0312,0.04-0.0102,0.08-0.0206,0.1204-0.0304l0.1205-0.0283c0.04-0.0093,0.08-0.0188,0.1204-0.0277,0.0399-0.0088,0.0803-0.017,0.1205-0.0254s0.0799-0.0172,0.1204-0.0252c0.0398-0.0079,0.0803-0.015,0.1204-0.0225,0.0402-0.0075,0.08-0.0154,0.1205-0.0226,0.0398-0.0071,0.0803-0.0133,0.1204-0.02s0.0801-0.0136,0.1205-0.0199l0.1204-0.0179,0.1205-0.0172,0.1204-0.0159,0.1204-0.0146,0.1205-0.014,0.1204-0.0121c0.0402-0.004,0.0801-0.0084,0.1205-0.0121,0.0399-0.0037,0.0803-0.0065,0.1204-0.0098l0.1205-0.0096,0.1205-0.0083,0.1204-0.0072,0.1205-0.0067c0.0399-0.002,0.0803-0.0033,0.1204-0.0049s0.08-0.0036,0.1204-0.0049l0.1205-0.0031,0.1204-0.0026,0.1205-0.0018,0.1204-0.0004c0.0402-0.0001,0.0801-0.0006,0.1205-0.0004l0.1204,0.0015,0.1204,0.0018,0.1205,0.0026,0.1204,0.0039,0.1205,0.0039,0.1204,0.0056,0.1205,0.0061,0.1204,0.0065,0.1205,0.008,0.1204,0.0081,0.0474,0.0032,0.073,0.0058,0.1205,0.0096,0.1204,0.0104,0.1205,0.011,0.1204,0.0115,0.1205,0.0123,0.1204,0.0129,0.1205,0.0134,0.1204,0.0141,0.1204,0.0148,0.1205,0.0153,0.1205,0.016,0.1204,0.0168,0.1205,0.0172,0.1204,0.0179,0.1205,0.0187,0.1204,0.0193,0.1204,0.0198,0.1205,0.0207,0.1204,0.0213,0.1205,0.0219,0.1204,0.0225,0.1205,0.0233,0.1204,0.0239,0.1205,0.0246,0.1204,0.0253,0.1204,0.026,0.1205,0.0267,0.1204,0.0272,0.1205,0.028,0.1204,0.0288,0.1205,0.0294,0.1204,0.03,0.1205,0.0308,0.1204,0.0315,0.1204,0.0321,0.1205,0.0329,0.1204,0.0336,0.1205,0.0342,0.1204,0.035,0.1205,0.0357,0.1204,0.0364,0.1205,0.037,0.1204,0.0377,0.1205,0.0385,0.1204,0.0392,0.1205,0.0399,0.1204,0.0406,0.1205,0.0412,0.1204,0.0419,0.1205,0.0428,0.1204,0.0434,0.1204,0.044,0.1205,0.0448,0.1204,0.0455,0.1205,0.0462,0.1204,0.0468,0.1205,0.0475,0.1204,0.0482,0.1205,0.0489,0.1204,0.0496,0.1204,0.0503,0.1205,0.0509,0.1204,0.0516,0.1205,0.0522,0.1204,0.0529,0.1205,0.0534,0.1204,0.0542,0.1205,0.0548,0.1204,0.0554,0.1204,0.056,0.1205,0.0567,0.1204,0.0572,0.1205,0.0578,0.1205,0.0584,0.1204,0.059,0.1205,0.0595,0.1204,0.0601,0.1198,0.0602v-5.2916l-0.045-0.029-0.12-0.029-0.121-0.029-0.12-0.028-0.121-0.028-0.12-0.027-0.121-0.028-0.12-0.027-0.121-0.026-0.12-0.027-0.121-0.026-0.12-0.026-0.12-0.025-0.121-0.026-0.12-0.025-0.121-0.025-0.12-0.024-0.121-0.025-0.12-0.024-0.121-0.024-0.12-0.024-0.12-0.023-0.121-0.023-0.12-0.023-0.121-0.023-0.12-0.022-0.121-0.023-0.12-0.022-0.121-0.022-0.12-0.021-0.12-0.022-0.121-0.021-0.12-0.021-0.121-0.02-0.12-0.02-0.121-0.02-0.12-0.02-0.121-0.02-0.12-0.019-0.12-0.019-0.121-0.019-0.12-0.019-0.121-0.018-0.12-0.018-0.121-0.018-0.12-0.018-0.121-0.017-0.12-0.017-0.12-0.017-0.121-0.016-0.12-0.017-0.121-0.016-0.12-0.015-0.121-0.015-0.12-0.016-0.121-0.014-0.12-0.015-0.12-0.014-0.121-0.014-0.12-0.013-0.121-0.014-0.12-0.012-0.121-0.013-0.12-0.012-0.121-0.012-0.12-0.012-0.12-0.011-0.121-0.011-0.12-0.01-0.121-0.011-0.12-0.009-0.121-0.01-0.12-0.009-0.121-0.009-0.12-0.008-0.12-0.008-0.121-0.007-0.12-0.007-0.121-0.007-0.12-0.006-0.121-0.006-0.061-0.003-0.059-0.003-0.121-0.004-0.12-0.006-0.12-0.004-0.121-0.005-0.12-0.004-0.121-0.004-0.12-0.004-0.121-0.003-0.12-0.003-0.121-0.003-0.12-0.003-0.12-0.002-0.121-0.003-0.12-0.001-0.121-0.002-0.1204-0.0016-0.1205-0.001-0.1205-0.0006-0.1204-0.0007-0.1205-0.0003-0.1204,0.0002-0.1205,0.0002-0.1204,0.0004-0.1204,0.0011-0.1205,0.0012-0.1204,0.0012-0.1205,0.0021-0.1204,0.002-0.1205,0.0021-0.1204,0.003-0.1204,0.003-0.1205,0.003-0.1204,0.0039-0.1205,0.004-0.1204,0.004-0.1205,0.0049-0.1204,0.005-0.1205,0.0049-0.1204,0.0059-0.1204,0.006-0.1205,0.0059-0.1204,0.0069-0.1205,0.007-0.1204,0.007-0.1205,0.008-0.1204,0.0081-0.1205,0.0081-0.1205,0.0092-0.1204,0.0091-0.1204,0.0094-0.1205,0.0102-0.1204,0.0101-0.1205,0.0107-0.1204,0.0113-0.1205,0.0113-0.1204,0.012-0.1204,0.0125-0.1205,0.0124-0.1204,0.0135-0.1205,0.0135-0.1204,0.0138-0.1205,0.0148-0.1204,0.0147-0.1205,0.0155-0.1204,0.0159-0.1205,0.0159-0.1204,0.017-0.1205,0.0171-0.1204,0.0176-0.1204,0.0184-0.1205,0.0183-0.1204,0.0194-0.1205,0.0197-0.1204,0.0201-0.1205,0.0208-0.1204,0.0209-0.1205,0.022-0.1204,0.0223-0.1205,0.0228-0.1204,0.0235-0.1205,0.0236-0.1204,0.0249-0.1204,0.0249-0.1205,0.0258-0.1204,0.0263-0.1205,0.0268-0.1204,0.0277-0.1205,0.0278-0.1204,0.0292-0.1205,0.0292-0.1204,0.0303-0.1204,0.0307-0.1205,0.0316-0.1204,0.0322-0.1205,0.0328-0.1204,0.0337-0.1205,0.0342-0.1204,0.0353-0.1205,0.0355-0.1204,0.0369-0.1205,0.0371-0.1204,0.0386c-0.0402,0.0129-0.0807,0.0255-0.1205,0.0386l-0.1204,0.0403c-0.0401,0.0134-0.0806,0.0266-0.1204,0.0403l-0.1205,0.042-0.1204,0.042c-0.0405,0.0144-0.0804,0.0293-0.1205,0.0439-0.0402,0.0146-0.0806,0.029-0.1204,0.0439l-0.1205,0.0457c-0.0402,0.0153-0.0806,0.0303-0.1204,0.0458l-0.1205,0.0476-0.1204,0.048-0.1205,0.0495-0.1204,0.0502-0.1205,0.0514-0.1204,0.0526-0.1203,0.0534-0.1205,0.0551-0.1204,0.0556c-0.0405,0.019-0.0804,0.0384-0.1205,0.0576l-0.1204,0.0583-0.1205,0.0599-0.1204,0.0612c-0.0403,0.0207-0.0807,0.0412-0.1205,0.0621-0.0405,0.0212-0.0804,0.0428-0.1204,0.0643l-0.1205,0.0652-0.1204,0.0667c-0.0405,0.0227-0.0805,0.0456-0.1205,0.0686-0.0403,0.0231-0.0806,0.0461-0.1204,0.0695-0.0404,0.0237-0.0804,0.0477-0.1204,0.0717-0.0405,0.0243-0.0806,0.0488-0.1205,0.0734-0.0403,0.0248-0.0807,0.0496-0.1204,0.0746-0.0405,0.0255-0.0806,0.0513-0.1205,0.077l-0.1204,0.0787c-0.0404,0.0267-0.0807,0.0532-0.1205,0.0802l-0.1204,0.0826c-0.0405,0.0281-0.0805,0.0564-0.1204,0.0847-0.0404,0.0287-0.0807,0.0576-0.1205,0.0867-0.0403,0.0294-0.0807,0.0587-0.1204,0.0884-0.0406,0.0304-0.0805,0.061-0.1205,0.0917-0.0405,0.0311-0.0806,0.0624-0.1205,0.0938-0.0404,0.0318-0.0806,0.0638-0.1204,0.096v-0.0001z'),
												_1: {ctor: '[]'}
											}
										}
									},
									{ctor: '[]'}),
								_1: {ctor: '[]'}
							}
						}
					}
				}),
			_1: {ctor: '[]'}
		}
	});

var _abadi199$elm_creditcard$CreditCard_Components_Logo_Diners$viewLogo = A2(
	_elm_lang$svg$Svg$g,
	{
		ctor: '::',
		_0: _elm_lang$svg$Svg_Attributes$id('g3578'),
		_1: {
			ctor: '::',
			_0: _elm_lang$svg$Svg_Attributes$transform('matrix(0.05,0,0,0.05,0,1.4175914e-6)'),
			_1: {ctor: '[]'}
		}
	},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$path,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$d('M 372.69,504 C 510.44,504.659 636.17,391.659 636.17,254.19 636.17,103.86 510.44,-0.05 372.69,0 H 254.14 C 114.74,-0.05 0,103.891 0,254.19 0,391.689 114.74,504.66 254.14,504 h 118.55 z'),
				_1: {
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$id('path3338'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$style('fill:#0079be'),
						_1: {ctor: '[]'}
					}
				}
			},
			{ctor: '[]'}),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_lang$svg$Svg$path,
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$d('M 254.701,20.83 C 127.321,20.87 24.101,124.12 24.071,251.551 24.101,378.96 127.32,482.2 254.701,482.24 382.111,482.2 485.352,378.96 485.37,251.551 485.351,124.12 382.111,20.87 254.701,20.83 z m -146.19,230.721 0,0 c 0.12,-62.27 39.01,-115.37 93.85,-136.471 v 272.91 c -54.84,-21.089 -93.731,-74.16 -93.85,-136.439 z m 198.51,136.499 0,0 V 115.071 c 54.86,21.05 93.81,74.18 93.91,136.48 -0.1,62.319 -39.05,115.409 -93.91,136.499 z'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$id('path3340'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffffff'),
							_1: {ctor: '[]'}
						}
					}
				},
				{ctor: '[]'}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$path,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$d('M 372.69,504 C 510.44,504.659 636.17,391.659 636.17,254.19 636.17,103.86 510.44,-0.05 372.69,0 H 254.14 C 114.74,-0.05 0,103.891 0,254.19 0,391.689 114.74,504.66 254.14,504 h 118.55 z'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$id('path3416'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$style('fill:#0079be'),
								_1: {ctor: '[]'}
							}
						}
					},
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$path,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$d('M 254.701,20.83 C 127.321,20.87 24.101,124.12 24.071,251.551 24.101,378.96 127.32,482.2 254.701,482.24 382.111,482.2 485.352,378.96 485.37,251.551 485.351,124.12 382.111,20.87 254.701,20.83 z m -146.19,230.721 0,0 c 0.12,-62.27 39.01,-115.37 93.85,-136.471 v 272.91 c -54.84,-21.089 -93.731,-74.16 -93.85,-136.439 z m 198.51,136.499 0,0 V 115.071 c 54.86,21.05 93.81,74.18 93.91,136.48 -0.1,62.319 -39.05,115.409 -93.91,136.499 z'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$id('path3418'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffffff'),
									_1: {ctor: '[]'}
								}
							}
						},
						{ctor: '[]'}),
					_1: {ctor: '[]'}
				}
			}
		}
	});

var _abadi199$elm_creditcard$Helpers_CardAnimation$fadeOutAnimation = _elm_lang$svg$Svg_Attributes$style('animation: hide 0.5s ease');
var _abadi199$elm_creditcard$Helpers_CardAnimation$fadeInAnimation = _elm_lang$svg$Svg_Attributes$style('animation: show 0.5s ease');
var _abadi199$elm_creditcard$Helpers_CardAnimation$transitionAnimation = _elm_lang$svg$Svg_Attributes$style('transition: fill 0.5s ease');
var _abadi199$elm_creditcard$Helpers_CardAnimation$keyframeAnimationDefs = A2(
	_elm_lang$svg$Svg$defs,
	{ctor: '[]'},
	{
		ctor: '::',
		_0: A2(
			_elm_lang$svg$Svg$style,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg$text('@keyframes show {\n                            0% { opacity: 0; }\n                            100% { opacity: 1; }\n                        }\n                        @keyframes hide {\n                            0% { opacity: 1; }\n                            100% { opacity: 0; }\n                        }\n                    '),
				_1: {ctor: '[]'}
			}),
		_1: {ctor: '[]'}
	});
var _abadi199$elm_creditcard$Helpers_CardAnimation$backsideAnimation = function (flipped) {
	var _p0 = flipped;
	if (_p0.ctor === 'Nothing') {
		return _elm_lang$svg$Svg_Attributes$style('transform: rotateY(180deg); transform-origin: 175px 110px; opacity: 0;');
	} else {
		return _p0._0 ? _elm_lang$svg$Svg_Attributes$style('transform: rotateY(180deg); transform-origin: 175px 110px; animation: show 0.175s 1 steps(1); opacity: 1;') : _elm_lang$svg$Svg_Attributes$style('transform: rotateY(180deg); transform-origin: 175px 110px; animation: hide 0.125s 1 steps(1); opacity: 0;');
	}
};
var _abadi199$elm_creditcard$Helpers_CardAnimation$flipAnimation = function (flipped) {
	return A2(_elm_lang$core$Maybe$withDefault, false, flipped) ? _elm_lang$svg$Svg_Attributes$style('transition: transform 0.5s; transform-origin: 50% 50%; transform: rotateY(180deg);') : _elm_lang$svg$Svg_Attributes$style('transition: transform 0.5s;');
};

var _abadi199$elm_creditcard$CreditCard_Components_Logo$viewLogo = F2(
	function (config, cardInfo) {
		var viewVisaElectron = A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(270,20)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$CreditCard_Components_Logo_VisaElectron$viewLogo,
				_1: {ctor: '[]'}
			});
		var viewDiners = A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(290,20)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$CreditCard_Components_Logo_Diners$viewLogo,
				_1: {ctor: '[]'}
			});
		var viewJCB = A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(285,15)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$CreditCard_Components_Logo_JCB$viewLogo,
				_1: {ctor: '[]'}
			});
		var viewMaestro = A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(280,20)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$CreditCard_Components_Logo_Maestro$viewLogo,
				_1: {ctor: '[]'}
			});
		var viewDiscover = A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(200,20)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$CreditCard_Components_Logo_Discover$viewLogo,
				_1: {ctor: '[]'}
			});
		var viewAmex = A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(285,20)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$CreditCard_Components_Logo_Amex$viewLogo,
				_1: {ctor: '[]'}
			});
		var viewMastercard = A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(280,20)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$CreditCard_Components_Logo_Mastercard$viewLogo,
				_1: {ctor: '[]'}
			});
		var viewVisa = A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform('translate(270,20)'),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$CreditCard_Components_Logo_Visa$viewLogo,
				_1: {ctor: '[]'}
			});
		var unknownLogo = _elm_lang$core$String$fromList(
			A2(_elm_lang$core$List$repeat, 4, config.blankChar));
		var viewUnknown = A2(
			_elm_lang$svg$Svg$text_,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$x('280'),
				_1: {
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$y('40'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$fontSize('12'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$fill(cardInfo.cardStyle.textColor),
							_1: {ctor: '[]'}
						}
					}
				}
			},
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg$text(unknownLogo),
				_1: {ctor: '[]'}
			});
		var cardType = cardInfo.cardType;
		return A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _abadi199$elm_creditcard$Helpers_CardAnimation$fadeInAnimation,
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: function () {
					var _p0 = cardType;
					switch (_p0.ctor) {
						case 'Visa':
							return viewVisa;
						case 'Mastercard':
							return viewMastercard;
						case 'Amex':
							return viewAmex;
						case 'Discover':
							return viewDiscover;
						case 'Maestro':
							return viewMaestro;
						case 'JCB':
							return viewJCB;
						case 'DinersClubCarteBlanche':
							return viewDiners;
						case 'DinersClubInternational':
							return viewDiners;
						case 'VisaElectron':
							return viewVisaElectron;
						case 'Laser':
							return viewUnknown;
						default:
							return viewUnknown;
					}
				}(),
				_1: {ctor: '[]'}
			});
	});

var _abadi199$elm_creditcard$Helpers_Misc$minMaxNumberLength = function (cardInfo) {
	return function (numbers) {
		return {
			ctor: '_Tuple2',
			_0: A2(
				_elm_lang$core$Maybe$withDefault,
				16,
				_elm_lang$core$List$minimum(numbers)),
			_1: A2(
				_elm_lang$core$Maybe$withDefault,
				16,
				_elm_lang$core$List$maximum(numbers))
		};
	}(
		function (_) {
			return _.validLength;
		}(cardInfo));
};
var _abadi199$elm_creditcard$Helpers_Misc$rightPad = F3(
	function ($char, length, number) {
		rightPad:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(
				_elm_lang$core$String$length(number),
				length) < 0) {
				var _v0 = $char,
					_v1 = length,
					_v2 = A2(
					_elm_lang$core$Basics_ops['++'],
					number,
					_elm_lang$core$String$fromChar($char));
				$char = _v0;
				length = _v1;
				number = _v2;
				continue rightPad;
			} else {
				return number;
			}
		}
	});
var _abadi199$elm_creditcard$Helpers_Misc$leftPad = F3(
	function ($char, length, number) {
		return (_elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$String$length(number),
			length) < 0) ? A3(
			_abadi199$elm_creditcard$Helpers_Misc$rightPad,
			$char,
			length,
			A2(
				_elm_lang$core$Basics_ops['++'],
				_elm_lang$core$String$fromChar($char),
				number)) : number;
	});
var _abadi199$elm_creditcard$Helpers_Misc$partitionStep = F3(
	function (groupSize, step, xs) {
		var okayArgs = (_elm_lang$core$Native_Utils.cmp(groupSize, 0) > 0) && (_elm_lang$core$Native_Utils.cmp(step, 0) > 0);
		var xs_ = A2(_elm_lang$core$List$drop, step, xs);
		var group = A2(_elm_lang$core$List$take, groupSize, xs);
		var okayLength = _elm_lang$core$Native_Utils.eq(
			groupSize,
			_elm_lang$core$List$length(group));
		return (okayArgs && okayLength) ? {
			ctor: '::',
			_0: group,
			_1: A3(_abadi199$elm_creditcard$Helpers_Misc$partitionStep, groupSize, step, xs_)
		} : {
			ctor: '::',
			_0: group,
			_1: {ctor: '[]'}
		};
	});
var _abadi199$elm_creditcard$Helpers_Misc$partition_ = F2(
	function (groupSize, xs) {
		return A3(_abadi199$elm_creditcard$Helpers_Misc$partitionStep, groupSize, groupSize, xs);
	});
var _abadi199$elm_creditcard$Helpers_Misc$partition = F2(
	function (numberFormat, xs) {
		var _p0 = numberFormat;
		if (_p0.ctor === '[]') {
			return {
				ctor: '::',
				_0: xs,
				_1: {ctor: '[]'}
			};
		} else {
			var _p1 = _p0._0;
			return {
				ctor: '::',
				_0: A2(_elm_lang$core$List$take, _p1, xs),
				_1: A2(
					_abadi199$elm_creditcard$Helpers_Misc$partition,
					_p0._1,
					A2(_elm_lang$core$List$drop, _p1, xs))
			};
		}
	});
var _abadi199$elm_creditcard$Helpers_Misc$formatNumber = F4(
	function (numberFormat, length, $char, number) {
		return _elm_lang$core$String$fromList(
			_elm_lang$core$List$concat(
				A2(
					_elm_lang$core$List$map,
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						})(
						_elm_lang$core$Native_Utils.chr(' ')),
					A2(
						_abadi199$elm_creditcard$Helpers_Misc$partition,
						numberFormat,
						_elm_lang$core$String$toList(
							A3(_abadi199$elm_creditcard$Helpers_Misc$rightPad, $char, length, number))))));
	});
var _abadi199$elm_creditcard$Helpers_Misc$printNumber = F4(
	function (numberFormat, length, $char, maybeNumber) {
		return A4(
			_abadi199$elm_creditcard$Helpers_Misc$formatNumber,
			numberFormat,
			length,
			$char,
			A2(_elm_lang$core$Maybe$withDefault, '', maybeNumber));
	});
var _abadi199$elm_creditcard$Helpers_Misc$onKeyDown = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'keydown',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$keyCode));
};

var _abadi199$elm_creditcard$CreditCard_Components_Chip$viewChipAlt = F2(
	function (x_, y_) {
		return A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform(
					A2(
						_elm_lang$core$Basics_ops['++'],
						'translate(',
						A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Basics$toString(x_),
							A2(
								_elm_lang$core$Basics_ops['++'],
								', ',
								A2(
									_elm_lang$core$Basics_ops['++'],
									_elm_lang$core$Basics$toString(y_),
									')'))))),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$defs,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$id('defs1200'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$linearGradient,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$x1('108.44'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$y1('17.976999'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$x2('110.62'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$y2('24.427'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$id('SVGID_5_'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$stop,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$id('stop914'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$style('stop-color:#ffffff;stop-opacity:1'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$offset('0.0055'),
												_1: {ctor: '[]'}
											}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$stop,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$id('stop916'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$style('stop-color:#9c9d9f;stop-opacity:1'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$offset('1'),
													_1: {ctor: '[]'}
												}
											}
										},
										{ctor: '[]'}),
									_1: {ctor: '[]'}
								}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$linearGradient,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$x1('107.86'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$y1('18.172001'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$x2('110.05'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$y2('24.622'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$id('SVGID_6_'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
														_1: {ctor: '[]'}
													}
												}
											}
										}
									}
								},
								{
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$stop,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$id('stop923'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$style('stop-color:#ffffff;stop-opacity:1'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$offset('0.0055'),
													_1: {ctor: '[]'}
												}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$stop,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$id('stop925'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$style('stop-color:#9c9d9f;stop-opacity:1'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$offset('1'),
														_1: {ctor: '[]'}
													}
												}
											},
											{ctor: '[]'}),
										_1: {ctor: '[]'}
									}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$linearGradient,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$x1('31.278999'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$y1('55.624001'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$x2('55.278999'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$y2('88.290001'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$id('SVGID_7_'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
															_1: {ctor: '[]'}
														}
													}
												}
											}
										}
									},
									{
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$stop,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$id('stop1188'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$style('stop-color:#ffe8a7;stop-opacity:1'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$offset('0.1319'),
														_1: {ctor: '[]'}
													}
												}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$stop,
												{
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$id('stop1190'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$style('stop-color:#ffd13b;stop-opacity:1'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$offset('0.4725'),
															_1: {ctor: '[]'}
														}
													}
												},
												{ctor: '[]'}),
											_1: {ctor: '[]'}
										}
									}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$linearGradient,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$x1('31.278999'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$y1('55.624001'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$x2('55.278999'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$y2('88.290001'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$id('linearGradient4188'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$xlinkHref('#SVGID_7_'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$gradientTransform('translate(34.376115,-13.620725)'),
																		_1: {ctor: '[]'}
																	}
																}
															}
														}
													}
												}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$linearGradient,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$x1('31.278999'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$y1('55.624001'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$x2('55.278999'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$y2('88.290001'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$id('linearGradient4334'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$xlinkHref('#SVGID_7_'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$gradientTransform('translate(34.376115,-13.620725)'),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											},
											{ctor: '[]'}),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$g,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$transform('translate(-55.712119,-37.207275)'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$id('g4330'),
								_1: {ctor: '[]'}
							}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$path,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$d('m 87.801115,37.207275 h -27.065 c -2.774,0 -5.024,2.249 -5.024,5.024 v 22.993 c 0,2.774 2.25,5.024 5.024,5.024 h 27.064 c 2.775,0 5.024,-2.25 5.024,-5.024 v -22.993 c 10e-4,-2.775 -2.248,-5.024 -5.023,-5.024 z'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$id('path1192'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$style('fill:url(#linearGradient4334)'),
											_1: {ctor: '[]'}
										}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$path,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$d('m 87.801115,37.207275 h -27.065 c -2.774,0 -5.024,2.249 -5.024,5.024 v 22.993 c 0,2.774 2.25,5.024 5.024,5.024 h 27.064 c 2.775,0 5.024,-2.25 5.024,-5.024 v -22.993 c 10e-4,-2.775 -2.248,-5.024 -5.023,-5.024 z m -31.62,5.024 c 0,-2.517 2.04,-4.556 4.556,-4.556 h 9.707 c -2.008,0.76 -2.939,2.42 -2.995,4.801 v 3.832 h -11.268 v -4.077 z m 0,4.544 h 11.268 v 6.718 h -11.268 v -6.718 z m 0,7.186 h 11.268 v 6.716 h -11.268 v -6.716 z m 4.555,15.818 c -2.516,0 -4.556,-2.04 -4.556,-4.556 v -4.078 h 11.736 v -18.201 h 12.705 v 21.565 h -12.938 c -0.312,0 -0.312,0.468 0,0.468 h 12.935 c -0.075,3.071 -1.657,4.802 -5.51,4.802 h -14.372 z m 31.62,-4.556 c 0,2.516 -2.04,4.556 -4.556,4.556 h -9.707 c 2.009,-0.761 2.938,-2.42 2.996,-4.802 v -3.832 h 11.267 v 4.078 z m 0,-4.546 h -11.266 v -6.716 h 11.266 v 6.716 z m 0,-7.184 h -11.266 v -6.718 h 11.266 v 6.718 z m 0,-7.185 h -11.266 v -3.832 h -13.17 c 0.075,-3.071 1.658,-4.801 5.511,-4.801 h 14.37 c 2.516,0 4.556,2.039 4.556,4.556 v 4.077 z'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$id('path1194'),
											_1: {ctor: '[]'}
										}
									},
									{ctor: '[]'}),
								_1: {ctor: '[]'}
							}
						}),
					_1: {ctor: '[]'}
				}
			});
	});
var _abadi199$elm_creditcard$CreditCard_Components_Chip$viewChip = F2(
	function (x_, y_) {
		return A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$transform(
					A2(
						_elm_lang$core$Basics_ops['++'],
						'translate(',
						A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Basics$toString(x_),
							A2(
								_elm_lang$core$Basics_ops['++'],
								', ',
								A2(
									_elm_lang$core$Basics_ops['++'],
									_elm_lang$core$Basics$toString(y_),
									')'))))),
				_1: {ctor: '[]'}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$g,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$transform('scale(0.13671875,0.13671875)'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$id('g3007'),
							_1: {ctor: '[]'}
						}
					},
					{
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$g,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$transform('translate(-96.5,-252.09375)'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$id('g3000'),
									_1: {ctor: '[]'}
								}
							},
							{
								ctor: '::',
								_0: A2(
									_elm_lang$svg$Svg$rect,
									{
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$width('250'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$height('250'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$rx('30'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$ry('30'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$x('99.510002'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$y('255.09'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$id('rect2818'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$style('fill:#ffcc00;stroke:#000000;stroke-width:6'),
																	_1: {ctor: '[]'}
																}
															}
														}
													}
												}
											}
										}
									},
									{ctor: '[]'}),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_lang$svg$Svg$path,
										{
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$d('m 351.51,320.65 v 2.875 h -73.719 l -16.5,16.5 v 40.625 h 90.219 v 2.875 h -90.219 v 40.625 l 16.5,16.5 h 73.719 v 2.875 h -74.906 l -18.188,-18.188 0.25,-0.25 h -0.25 v -85.719 h 0.5313 l -0.5313,-0.53125 18.188,-18.188 h 74.906 z'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$id('path3629'),
												_1: {ctor: '[]'}
											}
										},
										{ctor: '[]'}),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_lang$svg$Svg$path,
											{
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$d('m 188.28,422.65 v 2.875 h 34.812 v 81.562 h 2.8437 v -81.562 h 34.844 v -2.875 h -72.5 z'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$id('rect3596'),
													_1: {ctor: '[]'}
												}
											},
											{ctor: '[]'}),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$path,
												{
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$d('m 223.09,255.81 v 82.844 h -34.812 v 2.875 h 37.656 V 255.81 h -2.8437 z'),
													_1: {
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$id('rect3598'),
														_1: {ctor: '[]'}
													}
												},
												{ctor: '[]'}),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$svg$Svg$path,
													{
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$d('m 97.53,320.65 v 2.875 h 73.719 l 16.5,16.5 V 380.65 H 97.53 v 2.875 h 90.219 v 40.625 l -16.5,16.5 H 97.53 v 2.875 h 74.906 l 18.188,-18.188 -0.25,-0.25 h 0.25 v -85.719 h -0.5312 l 0.5312,-0.53125 -18.188,-18.188 H 97.53 z'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$id('rect3602'),
															_1: {ctor: '[]'}
														}
													},
													{ctor: '[]'}),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			});
	});

var _abadi199$elm_creditcard$CreditCard_Components_BackCard$viewBackCard = F2(
	function (cardInfo, cardData) {
		var stateValue = _abadi199$elm_creditcard$CreditCard_Internal$getStateValue(cardData.state);
		var ccv = A2(_elm_lang$core$Maybe$withDefault, 'CCV', cardData.ccv);
		var cardStyle = cardInfo.cardStyle;
		return A2(
			_elm_lang$svg$Svg$g,
			{
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$id('elmCardSvgBack'),
				_1: {
					ctor: '::',
					_0: _abadi199$elm_creditcard$Helpers_CardAnimation$backsideAnimation(stateValue.flipped),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$rect,
					A2(
						_elm_lang$core$List$append,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$x('0'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$y('0'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$width('350'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$height('220'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$rx('5'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$ry('5'),
												_1: {
													ctor: '::',
													_0: _elm_lang$svg$Svg_Attributes$fill('gray'),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						},
						cardStyle.background.attributes),
					{ctor: '[]'}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$rect,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$x('0'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$y('20'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$width('350'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$height('40'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$fill('#333'),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$rect,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$x('30'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$y('90'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$width('290'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$height('40'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$fill('rgba(255,255,255,0.5)'),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Native_Utils.eq(cardInfo.ccvPosition, _abadi199$elm_creditcard$CreditCard_Internal$Back) ? A2(
								_elm_lang$svg$Svg$text_,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$x('270'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$y('115'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$fontSize('14'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$fill(cardStyle.darkTextColor),
												_1: {ctor: '[]'}
											}
										}
									}
								},
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg$text(ccv),
									_1: {ctor: '[]'}
								}) : _elm_lang$svg$Svg$text(''),
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});

var _abadi199$elm_creditcard$CreditCard_Components_Card$card = F3(
	function (config, cardInfo, cardData) {
		var stateValue = _abadi199$elm_creditcard$CreditCard_Internal$getStateValue(cardData.state);
		var ccv = A2(_elm_lang$core$Maybe$withDefault, 'CCV', cardData.ccv);
		var numberLength = A2(
			_elm_lang$core$Maybe$withDefault,
			0,
			A2(_elm_lang$core$Maybe$map, _elm_lang$core$String$length, cardData.number));
		var numberFontSize = (_elm_lang$core$Native_Utils.cmp(numberLength, 16) > 0) ? _elm_lang$svg$Svg_Attributes$fontSize('20') : _elm_lang$svg$Svg_Attributes$fontSize('22');
		var cardStyle = cardInfo.cardStyle;
		var expirationYear = A3(
			_abadi199$elm_creditcard$Helpers_Misc$rightPad,
			config.blankChar,
			4,
			A2(_elm_lang$core$Maybe$withDefault, '', cardData.year));
		var blankMonth = _elm_lang$core$String$fromList(
			A2(_elm_lang$core$List$repeat, 2, config.blankChar));
		var expirationMonth = function (str) {
			return _elm_lang$core$String$isEmpty(str) ? blankMonth : A3(
				_abadi199$elm_creditcard$Helpers_Misc$leftPad,
				_elm_lang$core$Native_Utils.chr('0'),
				2,
				str);
		}(
			A2(_elm_lang$core$Maybe$withDefault, '', cardData.month));
		var blankName = config.blankName;
		var name = function (name) {
			return _elm_lang$core$String$isEmpty(name) ? blankName : name;
		}(
			A2(
				_elm_lang$core$Maybe$withDefault,
				'',
				A2(_elm_lang$core$Maybe$map, _elm_lang$core$String$toUpper, cardData.name)));
		var _p0 = _abadi199$elm_creditcard$Helpers_Misc$minMaxNumberLength(cardInfo);
		var minNumberLength = _p0._0;
		var maxNumberLength = _p0._1;
		var number = A4(_abadi199$elm_creditcard$Helpers_Misc$printNumber, cardInfo.numberFormat, minNumberLength, config.blankChar, cardData.number);
		return A2(
			_elm_lang$html$Html$div,
			{
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('elm-card-svg'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$style(
						{
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'perspective', _1: '1200px'},
							_1: {ctor: '[]'}
						}),
					_1: {ctor: '[]'}
				}
			},
			{
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$svg,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$width('350'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$height('220'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$viewBox('0 0 350 220'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$fontFamily('monospace'),
									_1: {
										ctor: '::',
										_0: _abadi199$elm_creditcard$Helpers_CardAnimation$flipAnimation(stateValue.flipped),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					},
					{
						ctor: '::',
						_0: _abadi199$elm_creditcard$Helpers_CardAnimation$keyframeAnimationDefs,
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$g,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$id('elmCardSvgFront'),
									_1: {ctor: '[]'}
								},
								A3(
									_elm_lang$core$Basics$flip,
									_elm_lang$core$List$append,
									{
										ctor: '::',
										_0: A2(_abadi199$elm_creditcard$CreditCard_Components_Chip$viewChip, 40, 70),
										_1: {
											ctor: '::',
											_0: A2(_abadi199$elm_creditcard$CreditCard_Components_Logo$viewLogo, config, cardInfo),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$svg$Svg$text_,
													{
														ctor: '::',
														_0: _elm_lang$svg$Svg_Attributes$x('40'),
														_1: {
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$y('130'),
															_1: {
																ctor: '::',
																_0: numberFontSize,
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$fill(cardStyle.textColor),
																	_1: {ctor: '[]'}
																}
															}
														}
													},
													{
														ctor: '::',
														_0: _elm_lang$svg$Svg$text(number),
														_1: {ctor: '[]'}
													}),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_lang$svg$Svg$foreignObject,
														{
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$x('40'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$y('160'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$fontSize('16'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$width('170'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$fill(cardStyle.textColor),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														},
														{
															ctor: '::',
															_0: A2(
																_elm_lang$html$Html$p,
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html_Attributes$style(
																		{
																			ctor: '::',
																			_0: {ctor: '_Tuple2', _0: 'color', _1: cardStyle.textColor},
																			_1: {ctor: '[]'}
																		}),
																	_1: {ctor: '[]'}
																},
																{
																	ctor: '::',
																	_0: _elm_lang$html$Html$text(name),
																	_1: {ctor: '[]'}
																}),
															_1: {ctor: '[]'}
														}),
													_1: {
														ctor: '::',
														_0: A2(
															_elm_lang$svg$Svg$text_,
															{
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$x('250'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$y('160'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$fontSize('10'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$fill(cardStyle.lightTextColor),
																			_1: {ctor: '[]'}
																		}
																	}
																}
															},
															{
																ctor: '::',
																_0: _elm_lang$svg$Svg$text('MONTH/YEAR'),
																_1: {ctor: '[]'}
															}),
														_1: {
															ctor: '::',
															_0: A2(
																_elm_lang$svg$Svg$text_,
																{
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$x('215'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$y('170'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$fontSize('8'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$fill(cardStyle.lightTextColor),
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																},
																{
																	ctor: '::',
																	_0: _elm_lang$svg$Svg$text('valid'),
																	_1: {ctor: '[]'}
																}),
															_1: {
																ctor: '::',
																_0: A2(
																	_elm_lang$svg$Svg$text_,
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$x('220'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$y('180'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$fontSize('8'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$fill(cardStyle.lightTextColor),
																					_1: {ctor: '[]'}
																				}
																			}
																		}
																	},
																	{
																		ctor: '::',
																		_0: _elm_lang$svg$Svg$text('thru'),
																		_1: {ctor: '[]'}
																	}),
																_1: {
																	ctor: '::',
																	_0: A2(
																		_elm_lang$svg$Svg$text_,
																		{
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$x('250'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$y('180'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$fontSize('14'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$fill(cardStyle.textColor),
																						_1: {ctor: '[]'}
																					}
																				}
																			}
																		},
																		{
																			ctor: '::',
																			_0: _elm_lang$svg$Svg$text(
																				A2(
																					_elm_lang$core$Basics_ops['++'],
																					expirationMonth,
																					A2(_elm_lang$core$Basics_ops['++'], '/', expirationYear))),
																			_1: {ctor: '[]'}
																		}),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$core$Native_Utils.eq(cardInfo.ccvPosition, _abadi199$elm_creditcard$CreditCard_Internal$Front) ? A2(
																			_elm_lang$svg$Svg$text_,
																			{
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$x('290'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$svg$Svg_Attributes$y('110'),
																					_1: {
																						ctor: '::',
																						_0: _elm_lang$svg$Svg_Attributes$fontSize('14'),
																						_1: {
																							ctor: '::',
																							_0: _elm_lang$svg$Svg_Attributes$fill(cardStyle.darkTextColor),
																							_1: {ctor: '[]'}
																						}
																					}
																				}
																			},
																			{
																				ctor: '::',
																				_0: _elm_lang$svg$Svg$text(ccv),
																				_1: {ctor: '[]'}
																			}) : _elm_lang$svg$Svg$text(''),
																		_1: {ctor: '[]'}
																	}
																}
															}
														}
													}
												}
											}
										}
									},
									A2(
										_elm_lang$core$List$append,
										{
											ctor: '::',
											_0: A2(
												_elm_lang$svg$Svg$defs,
												{ctor: '[]'},
												cardStyle.background.defs),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_lang$svg$Svg$rect,
													A2(
														_elm_lang$core$List$append,
														{
															ctor: '::',
															_0: _elm_lang$svg$Svg_Attributes$x('0'),
															_1: {
																ctor: '::',
																_0: _elm_lang$svg$Svg_Attributes$y('0'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$svg$Svg_Attributes$width('350'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$svg$Svg_Attributes$height('220'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$svg$Svg_Attributes$rx('5'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$svg$Svg_Attributes$ry('5'),
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																}
															}
														},
														cardStyle.background.attributes),
													{ctor: '[]'}),
												_1: {ctor: '[]'}
											}
										},
										cardStyle.background.svg))),
							_1: {
								ctor: '::',
								_0: A2(_abadi199$elm_creditcard$CreditCard_Components_BackCard$viewBackCard, cardInfo, cardData),
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: {ctor: '[]'}
			});
	});

//import Maybe, Native.List //

var _elm_lang$core$Native_Regex = function() {

function escape(str)
{
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function caseInsensitive(re)
{
	return new RegExp(re.source, 'gi');
}
function regex(raw)
{
	return new RegExp(raw, 'g');
}

function contains(re, string)
{
	return string.match(re) !== null;
}

function find(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex === re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		out.push({
			match: result[0],
			submatches: _elm_lang$core$Native_List.fromArray(subs),
			index: result.index,
			number: number
		});
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

function replace(n, re, replacer, string)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		return replacer({
			match: match,
			submatches: _elm_lang$core$Native_List.fromArray(submatches),
			index: arguments[arguments.length - 2],
			number: count
		});
	}
	return string.replace(re, jsReplacer);
}

function split(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	if (n === Infinity)
	{
		return _elm_lang$core$Native_List.fromArray(str.split(re));
	}
	var string = str;
	var result;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		if (!(result = re.exec(string))) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

return {
	regex: regex,
	caseInsensitive: caseInsensitive,
	escape: escape,

	contains: F2(contains),
	find: F3(find),
	replace: F4(replace),
	split: F3(split)
};

}();

var _elm_lang$core$Regex$split = _elm_lang$core$Native_Regex.split;
var _elm_lang$core$Regex$replace = _elm_lang$core$Native_Regex.replace;
var _elm_lang$core$Regex$find = _elm_lang$core$Native_Regex.find;
var _elm_lang$core$Regex$contains = _elm_lang$core$Native_Regex.contains;
var _elm_lang$core$Regex$caseInsensitive = _elm_lang$core$Native_Regex.caseInsensitive;
var _elm_lang$core$Regex$regex = _elm_lang$core$Native_Regex.regex;
var _elm_lang$core$Regex$escape = _elm_lang$core$Native_Regex.escape;
var _elm_lang$core$Regex$Match = F4(
	function (a, b, c, d) {
		return {match: a, submatches: b, index: c, number: d};
	});
var _elm_lang$core$Regex$Regex = {ctor: 'Regex'};
var _elm_lang$core$Regex$AtMost = function (a) {
	return {ctor: 'AtMost', _0: a};
};
var _elm_lang$core$Regex$All = {ctor: 'All'};

var _abadi199$elm_creditcard$Styles_Backgrounds_Gradient$background = function (options) {
	return A2(
		_elm_lang$svg$Svg$g,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(
				_elm_lang$svg$Svg$linearGradient,
				{
					ctor: '::',
					_0: _elm_lang$svg$Svg_Attributes$id('Gradient1'),
					_1: {
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$x1('0'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$x2('1'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$y1('0'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$y2('0.5'),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				},
				{
					ctor: '::',
					_0: A2(
						_elm_lang$svg$Svg$stop,
						{
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$offset('0%'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$stopColor(options.darkColor),
								_1: {ctor: '[]'}
							}
						},
						{ctor: '[]'}),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$svg$Svg$stop,
							{
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$offset('50%'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$stopColor('black'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$stopOpacity('0'),
										_1: {ctor: '[]'}
									}
								}
							},
							{ctor: '[]'}),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$svg$Svg$stop,
								{
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$offset('100%'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$stopColor(options.lightColor),
										_1: {ctor: '[]'}
									}
								},
								{ctor: '[]'}),
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$svg$Svg$rect,
					{
						ctor: '::',
						_0: _elm_lang$svg$Svg_Attributes$x('0'),
						_1: {
							ctor: '::',
							_0: _elm_lang$svg$Svg_Attributes$y('0'),
							_1: {
								ctor: '::',
								_0: _elm_lang$svg$Svg_Attributes$width('350'),
								_1: {
									ctor: '::',
									_0: _elm_lang$svg$Svg_Attributes$height('220'),
									_1: {
										ctor: '::',
										_0: _elm_lang$svg$Svg_Attributes$rx('5'),
										_1: {
											ctor: '::',
											_0: _elm_lang$svg$Svg_Attributes$ry('5'),
											_1: {
												ctor: '::',
												_0: _elm_lang$svg$Svg_Attributes$fill('url(#Gradient1)'),
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					},
					{ctor: '[]'}),
				_1: {ctor: '[]'}
			}
		});
};
var _abadi199$elm_creditcard$Styles_Backgrounds_Gradient$Config = F2(
	function (a, b) {
		return {darkColor: a, lightColor: b};
	});

var _abadi199$elm_creditcard$Styles_Cards_Visa$style = {
	background: {
		attributes: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Helpers_CardAnimation$transitionAnimation,
			_1: {
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('#025fd1'),
				_1: {ctor: '[]'}
			}
		},
		svg: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Styles_Backgrounds_Gradient$background(
				{darkColor: '#013a7e', lightColor: '#025fd1'}),
			_1: {ctor: '[]'}
		},
		defs: {ctor: '[]'}
	},
	textColor: 'rgba(255,255,255,0.7)',
	lightTextColor: 'rgba(255,255,255,0.3)',
	darkTextColor: '#000'
};

var _abadi199$elm_creditcard$Styles_Cards_Mastercard$style = {
	background: {
		attributes: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Helpers_CardAnimation$transitionAnimation,
			_1: {
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('#6E8398'),
				_1: {ctor: '[]'}
			}
		},
		svg: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Styles_Backgrounds_Gradient$background(
				{darkColor: '#152E42', lightColor: '#6E8398'}),
			_1: {ctor: '[]'}
		},
		defs: {ctor: '[]'}
	},
	textColor: 'rgba(255,255,255,0.7)',
	lightTextColor: 'rgba(255,255,255,0.3)',
	darkTextColor: '#000'
};

var _abadi199$elm_creditcard$Styles_Cards_Amex$style = {
	background: {
		attributes: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Helpers_CardAnimation$transitionAnimation,
			_1: {
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('#D4AF37'),
				_1: {ctor: '[]'}
			}
		},
		svg: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Styles_Backgrounds_Gradient$background(
				{darkColor: '#7D6720', lightColor: '#D4AF37'}),
			_1: {ctor: '[]'}
		},
		defs: {ctor: '[]'}
	},
	textColor: 'rgba(255,255,255,0.7)',
	lightTextColor: 'rgba(255,255,255,0.3)',
	darkTextColor: '#000'
};

var _abadi199$elm_creditcard$Styles_Cards_Discover$style = {
	background: {
		attributes: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Helpers_CardAnimation$transitionAnimation,
			_1: {
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('#ADDBE8'),
				_1: {ctor: '[]'}
			}
		},
		svg: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Styles_Backgrounds_Gradient$background(
				{darkColor: '#94B8CA', lightColor: '#ADDBE8'}),
			_1: {ctor: '[]'}
		},
		defs: {ctor: '[]'}
	},
	textColor: 'rgba(255,255,255,0.7)',
	lightTextColor: 'rgba(255,255,255,0.3)',
	darkTextColor: '#000'
};

var _abadi199$elm_creditcard$Styles_Cards_Diners$style = {
	background: {
		attributes: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Helpers_CardAnimation$transitionAnimation,
			_1: {
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('#C5C6C8'),
				_1: {ctor: '[]'}
			}
		},
		svg: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Styles_Backgrounds_Gradient$background(
				{darkColor: '#8B8E92', lightColor: '#C5C6C8'}),
			_1: {ctor: '[]'}
		},
		defs: {ctor: '[]'}
	},
	textColor: 'rgba(255,255,255,0.7)',
	lightTextColor: 'rgba(255,255,255,0.3)',
	darkTextColor: '#000'
};

var _abadi199$elm_creditcard$Styles_Cards_JCB$style = {
	background: {
		attributes: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Helpers_CardAnimation$transitionAnimation,
			_1: {
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('#0069CA'),
				_1: {ctor: '[]'}
			}
		},
		svg: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Styles_Backgrounds_Gradient$background(
				{darkColor: '#000F4B', lightColor: '#0069CA'}),
			_1: {ctor: '[]'}
		},
		defs: {ctor: '[]'}
	},
	textColor: 'rgba(255,255,255,0.7)',
	lightTextColor: 'rgba(255,255,255,0.3)',
	darkTextColor: '#000'
};

var _abadi199$elm_creditcard$Styles_Cards_Unknown$style = {
	background: {
		attributes: {
			ctor: '::',
			_0: _abadi199$elm_creditcard$Helpers_CardAnimation$transitionAnimation,
			_1: {
				ctor: '::',
				_0: _elm_lang$svg$Svg_Attributes$fill('rgba(102, 102, 102, 1)'),
				_1: {ctor: '[]'}
			}
		},
		svg: {ctor: '[]'},
		defs: {ctor: '[]'}
	},
	textColor: 'rgba(255,255,255,0.7)',
	lightTextColor: 'rgba(255,255,255,0.3)',
	darkTextColor: '#000'
};

var _abadi199$elm_creditcard$Helpers_CardType$unknownCard = {
	cardType: _abadi199$elm_creditcard$CreditCard_Internal$Unknown,
	validLength: {
		ctor: '::',
		_0: 16,
		_1: {ctor: '[]'}
	},
	numberFormat: {
		ctor: '::',
		_0: 4,
		_1: {
			ctor: '::',
			_0: 4,
			_1: {
				ctor: '::',
				_0: 4,
				_1: {ctor: '[]'}
			}
		}
	},
	cardStyle: _abadi199$elm_creditcard$Styles_Cards_Unknown$style,
	ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
};
var _abadi199$elm_creditcard$Helpers_CardType$cards = {
	ctor: '::',
	_0: {
		cardInfo: {
			cardType: _abadi199$elm_creditcard$CreditCard_Internal$Amex,
			validLength: {
				ctor: '::',
				_0: 15,
				_1: {ctor: '[]'}
			},
			numberFormat: {
				ctor: '::',
				_0: 4,
				_1: {
					ctor: '::',
					_0: 6,
					_1: {
						ctor: '::',
						_0: 5,
						_1: {ctor: '[]'}
					}
				}
			},
			cardStyle: _abadi199$elm_creditcard$Styles_Cards_Amex$style,
			ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Front
		},
		pattern: _elm_lang$core$Regex$regex('^3[47]')
	},
	_1: {
		ctor: '::',
		_0: {
			cardInfo: {
				cardType: _abadi199$elm_creditcard$CreditCard_Internal$DinersClubCarteBlanche,
				validLength: {
					ctor: '::',
					_0: 14,
					_1: {ctor: '[]'}
				},
				numberFormat: {
					ctor: '::',
					_0: 4,
					_1: {
						ctor: '::',
						_0: 6,
						_1: {
							ctor: '::',
							_0: 4,
							_1: {ctor: '[]'}
						}
					}
				},
				cardStyle: _abadi199$elm_creditcard$Styles_Cards_Diners$style,
				ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
			},
			pattern: _elm_lang$core$Regex$regex('^30[0-5]')
		},
		_1: {
			ctor: '::',
			_0: {
				cardInfo: {
					cardType: _abadi199$elm_creditcard$CreditCard_Internal$DinersClubInternational,
					validLength: {
						ctor: '::',
						_0: 14,
						_1: {ctor: '[]'}
					},
					numberFormat: {
						ctor: '::',
						_0: 4,
						_1: {
							ctor: '::',
							_0: 6,
							_1: {
								ctor: '::',
								_0: 4,
								_1: {ctor: '[]'}
							}
						}
					},
					cardStyle: _abadi199$elm_creditcard$Styles_Cards_Diners$style,
					ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
				},
				pattern: _elm_lang$core$Regex$regex('^36')
			},
			_1: {
				ctor: '::',
				_0: {
					cardInfo: {
						cardType: _abadi199$elm_creditcard$CreditCard_Internal$JCB,
						validLength: {
							ctor: '::',
							_0: 16,
							_1: {ctor: '[]'}
						},
						numberFormat: {
							ctor: '::',
							_0: 4,
							_1: {
								ctor: '::',
								_0: 4,
								_1: {
									ctor: '::',
									_0: 4,
									_1: {
										ctor: '::',
										_0: 4,
										_1: {ctor: '[]'}
									}
								}
							}
						},
						cardStyle: _abadi199$elm_creditcard$Styles_Cards_JCB$style,
						ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
					},
					pattern: _elm_lang$core$Regex$regex('^35(2[89]|[3-8][0-9])')
				},
				_1: {
					ctor: '::',
					_0: {
						cardInfo: {
							cardType: _abadi199$elm_creditcard$CreditCard_Internal$Laser,
							validLength: {
								ctor: '::',
								_0: 16,
								_1: {
									ctor: '::',
									_0: 17,
									_1: {
										ctor: '::',
										_0: 18,
										_1: {
											ctor: '::',
											_0: 19,
											_1: {ctor: '[]'}
										}
									}
								}
							},
							numberFormat: {
								ctor: '::',
								_0: 19,
								_1: {ctor: '[]'}
							},
							cardStyle: _abadi199$elm_creditcard$Styles_Cards_Visa$style,
							ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
						},
						pattern: _elm_lang$core$Regex$regex('^(6304|670[69]|6771)')
					},
					_1: {
						ctor: '::',
						_0: {
							cardInfo: {
								cardType: _abadi199$elm_creditcard$CreditCard_Internal$VisaElectron,
								validLength: {
									ctor: '::',
									_0: 16,
									_1: {ctor: '[]'}
								},
								numberFormat: {
									ctor: '::',
									_0: 4,
									_1: {
										ctor: '::',
										_0: 4,
										_1: {
											ctor: '::',
											_0: 4,
											_1: {
												ctor: '::',
												_0: 4,
												_1: {ctor: '[]'}
											}
										}
									}
								},
								cardStyle: _abadi199$elm_creditcard$Styles_Cards_Visa$style,
								ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
							},
							pattern: _elm_lang$core$Regex$regex('^(4026|417500|4508|4844|491(3|7))')
						},
						_1: {
							ctor: '::',
							_0: {
								cardInfo: {
									cardType: _abadi199$elm_creditcard$CreditCard_Internal$Visa,
									validLength: {
										ctor: '::',
										_0: 16,
										_1: {ctor: '[]'}
									},
									numberFormat: {
										ctor: '::',
										_0: 4,
										_1: {
											ctor: '::',
											_0: 4,
											_1: {
												ctor: '::',
												_0: 4,
												_1: {
													ctor: '::',
													_0: 4,
													_1: {ctor: '[]'}
												}
											}
										}
									},
									cardStyle: _abadi199$elm_creditcard$Styles_Cards_Visa$style,
									ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
								},
								pattern: _elm_lang$core$Regex$regex('^4')
							},
							_1: {
								ctor: '::',
								_0: {
									cardInfo: {
										cardType: _abadi199$elm_creditcard$CreditCard_Internal$Mastercard,
										validLength: {
											ctor: '::',
											_0: 16,
											_1: {ctor: '[]'}
										},
										numberFormat: {
											ctor: '::',
											_0: 4,
											_1: {
												ctor: '::',
												_0: 4,
												_1: {
													ctor: '::',
													_0: 4,
													_1: {
														ctor: '::',
														_0: 4,
														_1: {ctor: '[]'}
													}
												}
											}
										},
										cardStyle: _abadi199$elm_creditcard$Styles_Cards_Mastercard$style,
										ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
									},
									pattern: _elm_lang$core$Regex$regex('^5[1-5]')
								},
								_1: {
									ctor: '::',
									_0: {
										cardInfo: {
											cardType: _abadi199$elm_creditcard$CreditCard_Internal$Maestro,
											validLength: {
												ctor: '::',
												_0: 12,
												_1: {
													ctor: '::',
													_0: 13,
													_1: {
														ctor: '::',
														_0: 14,
														_1: {
															ctor: '::',
															_0: 15,
															_1: {
																ctor: '::',
																_0: 16,
																_1: {
																	ctor: '::',
																	_0: 17,
																	_1: {
																		ctor: '::',
																		_0: 18,
																		_1: {
																			ctor: '::',
																			_0: 19,
																			_1: {ctor: '[]'}
																		}
																	}
																}
															}
														}
													}
												}
											},
											numberFormat: {
												ctor: '::',
												_0: 4,
												_1: {
													ctor: '::',
													_0: 4,
													_1: {
														ctor: '::',
														_0: 4,
														_1: {ctor: '[]'}
													}
												}
											},
											cardStyle: _abadi199$elm_creditcard$Styles_Cards_Mastercard$style,
											ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
										},
										pattern: _elm_lang$core$Regex$regex('^(5018|5020|5038|6304|6759|676[1-3])')
									},
									_1: {
										ctor: '::',
										_0: {
											cardInfo: {
												cardType: _abadi199$elm_creditcard$CreditCard_Internal$Discover,
												validLength: {
													ctor: '::',
													_0: 16,
													_1: {ctor: '[]'}
												},
												numberFormat: {
													ctor: '::',
													_0: 4,
													_1: {
														ctor: '::',
														_0: 4,
														_1: {
															ctor: '::',
															_0: 4,
															_1: {
																ctor: '::',
																_0: 4,
																_1: {ctor: '[]'}
															}
														}
													}
												},
												cardStyle: _abadi199$elm_creditcard$Styles_Cards_Discover$style,
												ccvPosition: _abadi199$elm_creditcard$CreditCard_Internal$Back
											},
											pattern: _elm_lang$core$Regex$regex('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)')
										},
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _abadi199$elm_creditcard$Helpers_CardType$detect = function (model) {
	var number = A2(_elm_lang$core$Maybe$withDefault, '', model.number);
	return A2(
		_elm_lang$core$Maybe$withDefault,
		_abadi199$elm_creditcard$Helpers_CardType$unknownCard,
		A2(
			_elm_lang$core$Maybe$map,
			function (_p0) {
				var _p1 = _p0;
				return _p1._1.cardInfo;
			},
			_elm_lang$core$List$head(
				A2(
					_elm_lang$core$List$filter,
					function (_p2) {
						var _p3 = _p2;
						return _p3._0;
					},
					A2(
						_elm_lang$core$List$map,
						function (card) {
							return {
								ctor: '_Tuple2',
								_0: A2(_elm_lang$core$Regex$contains, card.pattern, number),
								_1: card
							};
						},
						_abadi199$elm_creditcard$Helpers_CardType$cards)))));
};
var _abadi199$elm_creditcard$Helpers_CardType$CardRegex = F2(
	function (a, b) {
		return {pattern: a, cardInfo: b};
	});

var _abadi199$elm_creditcard$CreditCard_Events$updateCCVFocus = F2(
	function (isFocused, cardData) {
		var cardInfo = _abadi199$elm_creditcard$Helpers_CardType$detect(cardData);
		var stateValue = _abadi199$elm_creditcard$CreditCard_Internal$getStateValue(cardData.state);
		var flip = function (value) {
			return _elm_lang$core$Native_Utils.update(
				stateValue,
				{
					flipped: _elm_lang$core$Maybe$Just(value)
				});
		};
		var updatedStateValue = function () {
			var _p0 = {ctor: '_Tuple2', _0: isFocused, _1: cardInfo.ccvPosition};
			_v0_0:
			do {
				if (_p0._1.ctor === 'Front') {
					if (_p0._0 === false) {
						break _v0_0;
					} else {
						return flip(false);
					}
				} else {
					if (_p0._0 === false) {
						break _v0_0;
					} else {
						return flip(true);
					}
				}
			} while(false);
			return flip(false);
		}();
		var updatedState = _abadi199$elm_creditcard$CreditCard_Internal$InternalState(updatedStateValue);
		return _elm_lang$core$Native_Utils.update(
			cardData,
			{state: updatedState});
	});
var _abadi199$elm_creditcard$CreditCard_Events$onCCVFocus = F2(
	function (tagger, cardData) {
		var updatedCardData = A2(_abadi199$elm_creditcard$CreditCard_Events$updateCCVFocus, true, cardData);
		return _elm_lang$html$Html_Events$onFocus(
			tagger(updatedCardData.state));
	});
var _abadi199$elm_creditcard$CreditCard_Events$onCCVBlur = F2(
	function (tagger, cardData) {
		var updatedCardData = A2(_abadi199$elm_creditcard$CreditCard_Events$updateCCVFocus, false, cardData);
		return _elm_lang$html$Html_Events$onBlur(
			tagger(updatedCardData.state));
	});

var _abadi199$elm_input_extra$Input_Decoder$Event = F4(
	function (a, b, c, d) {
		return {keyCode: a, ctrlKey: b, altKey: c, metaKey: d};
	});
var _abadi199$elm_input_extra$Input_Decoder$eventDecoder = A5(
	_elm_lang$core$Json_Decode$map4,
	_abadi199$elm_input_extra$Input_Decoder$Event,
	A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int),
	A2(_elm_lang$core$Json_Decode$field, 'ctrlKey', _elm_lang$core$Json_Decode$bool),
	A2(_elm_lang$core$Json_Decode$field, 'altKey', _elm_lang$core$Json_Decode$bool),
	A2(_elm_lang$core$Json_Decode$field, 'metaKey', _elm_lang$core$Json_Decode$bool));

var _abadi199$elm_input_extra$Input_KeyCode$downArrow = 40;
var _abadi199$elm_input_extra$Input_KeyCode$rightArrow = 39;
var _abadi199$elm_input_extra$Input_KeyCode$upArrow = 38;
var _abadi199$elm_input_extra$Input_KeyCode$leftArrow = 37;
var _abadi199$elm_input_extra$Input_KeyCode$enter = 13;
var _abadi199$elm_input_extra$Input_KeyCode$tab = 9;
var _abadi199$elm_input_extra$Input_KeyCode$backspace = 8;
var _abadi199$elm_input_extra$Input_KeyCode$delete = 46;
var _abadi199$elm_input_extra$Input_KeyCode$alt = 18;
var _abadi199$elm_input_extra$Input_KeyCode$ctrl = 17;
var _abadi199$elm_input_extra$Input_KeyCode$allowedKeyCodes = {
	ctor: '::',
	_0: _abadi199$elm_input_extra$Input_KeyCode$leftArrow,
	_1: {
		ctor: '::',
		_0: _abadi199$elm_input_extra$Input_KeyCode$upArrow,
		_1: {
			ctor: '::',
			_0: _abadi199$elm_input_extra$Input_KeyCode$rightArrow,
			_1: {
				ctor: '::',
				_0: _abadi199$elm_input_extra$Input_KeyCode$downArrow,
				_1: {
					ctor: '::',
					_0: _abadi199$elm_input_extra$Input_KeyCode$backspace,
					_1: {
						ctor: '::',
						_0: _abadi199$elm_input_extra$Input_KeyCode$ctrl,
						_1: {
							ctor: '::',
							_0: _abadi199$elm_input_extra$Input_KeyCode$alt,
							_1: {
								ctor: '::',
								_0: _abadi199$elm_input_extra$Input_KeyCode$delete,
								_1: {
									ctor: '::',
									_0: _abadi199$elm_input_extra$Input_KeyCode$tab,
									_1: {
										ctor: '::',
										_0: _abadi199$elm_input_extra$Input_KeyCode$enter,
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};

var _abadi199$elm_input_extra$Input_BigNumber$exceedMaxLength = F2(
	function (options, value) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			false,
			A2(
				_elm_lang$core$Maybe$map,
				_elm_lang$core$Basics$not,
				A2(
					_elm_lang$core$Maybe$map,
					function (maxLength) {
						return _elm_lang$core$Native_Utils.cmp(
							maxLength,
							_elm_lang$core$String$length(value)) > -1;
					},
					options.maxLength)));
	});
var _abadi199$elm_input_extra$Input_BigNumber$onChange = function (options) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, options.onInput, _elm_lang$html$Html_Events$targetValue));
};
var _abadi199$elm_input_extra$Input_BigNumber$isValid = F2(
	function (newValue, options) {
		var updatedNumber = _elm_lang$core$Result$toMaybe(
			_elm_lang$core$String$toInt(newValue));
		return !A2(_abadi199$elm_input_extra$Input_BigNumber$exceedMaxLength, options, newValue);
	});
var _abadi199$elm_input_extra$Input_BigNumber$onKeyDown = F2(
	function (options, currentValue) {
		var isNumber = function (keyCode) {
			return (_elm_lang$core$Native_Utils.cmp(keyCode, 48) > -1) && (_elm_lang$core$Native_Utils.cmp(keyCode, 57) < 1);
		};
		var isNumPad = function (keyCode) {
			return (_elm_lang$core$Native_Utils.cmp(keyCode, 96) > -1) && (_elm_lang$core$Native_Utils.cmp(keyCode, 105) < 1);
		};
		var newValue = function (keyCode) {
			return A2(
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					}),
				currentValue,
				_elm_lang$core$String$fromChar(
					_elm_lang$core$Char$fromCode(keyCode)));
		};
		var filterKey = function (event) {
			return (event.ctrlKey || (event.altKey || event.metaKey)) ? _elm_lang$core$Json_Decode$fail('modifier key is pressed') : (A2(
				_elm_lang$core$List$any,
				F2(
					function (x, y) {
						return _elm_lang$core$Native_Utils.eq(x, y);
					})(event.keyCode),
				_abadi199$elm_input_extra$Input_KeyCode$allowedKeyCodes) ? _elm_lang$core$Json_Decode$fail('allowedKeys') : (((isNumber(event.keyCode) || isNumPad(event.keyCode)) && A2(
				_abadi199$elm_input_extra$Input_BigNumber$isValid,
				newValue(event.keyCode),
				options)) ? _elm_lang$core$Json_Decode$fail('numeric') : _elm_lang$core$Json_Decode$succeed(event.keyCode)));
		};
		var decoder = A2(
			_elm_lang$core$Json_Decode$map,
			function (_p0) {
				return options.onInput(currentValue);
			},
			A2(_elm_lang$core$Json_Decode$andThen, filterKey, _abadi199$elm_input_extra$Input_Decoder$eventDecoder));
		var eventOptions = {stopPropagation: false, preventDefault: true};
		return A3(_elm_lang$html$Html_Events$onWithOptions, 'keydown', eventOptions, decoder);
	});
var _abadi199$elm_input_extra$Input_BigNumber$filterNonDigit = function (value) {
	return _elm_lang$core$String$fromList(
		A2(
			_elm_lang$core$List$filter,
			_elm_lang$core$Char$isDigit,
			_elm_lang$core$String$toList(value)));
};
var _abadi199$elm_input_extra$Input_BigNumber$input = F3(
	function (options, attributes, currentValue) {
		var toArray = A2(
			_elm_lang$core$Basics$flip,
			F2(
				function (x, y) {
					return {ctor: '::', _0: x, _1: y};
				}),
			{ctor: '[]'});
		var onFocusAttribute = A2(
			_elm_lang$core$Maybe$withDefault,
			{ctor: '[]'},
			A2(
				_elm_lang$core$Maybe$map,
				toArray,
				A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$html$Html_Events$onFocus,
					A2(
						_elm_lang$core$Maybe$map,
						function (f) {
							return f(true);
						},
						options.hasFocus))));
		var onBlurAttribute = A2(
			_elm_lang$core$Maybe$withDefault,
			{ctor: '[]'},
			A2(
				_elm_lang$core$Maybe$map,
				toArray,
				A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$html$Html_Events$onBlur,
					A2(
						_elm_lang$core$Maybe$map,
						function (f) {
							return f(false);
						},
						options.hasFocus))));
		return A2(
			_elm_lang$html$Html$input,
			A2(
				_elm_lang$core$List$append,
				onBlurAttribute,
				A2(
					_elm_lang$core$List$append,
					onFocusAttribute,
					A2(
						_elm_lang$core$List$append,
						attributes,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$value(currentValue),
							_1: {
								ctor: '::',
								_0: A2(_abadi199$elm_input_extra$Input_BigNumber$onKeyDown, options, currentValue),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Events$onInput(options.onInput),
									_1: {
										ctor: '::',
										_0: _abadi199$elm_input_extra$Input_BigNumber$onChange(options),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$type_('number'),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}))),
			{ctor: '[]'});
	});
var _abadi199$elm_input_extra$Input_BigNumber$defaultOptions = function (onInput) {
	return {onInput: onInput, maxLength: _elm_lang$core$Maybe$Nothing, hasFocus: _elm_lang$core$Maybe$Nothing};
};
var _abadi199$elm_input_extra$Input_BigNumber$Options = F3(
	function (a, b, c) {
		return {maxLength: a, onInput: b, hasFocus: c};
	});

var _abadi199$elm_input_extra$Input_Number$exceedMaxLength = F2(
	function (options, value) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			false,
			A2(
				_elm_lang$core$Maybe$map,
				_elm_lang$core$Basics$not,
				A2(
					_elm_lang$core$Maybe$map,
					function (maxLength) {
						return _elm_lang$core$Native_Utils.cmp(
							maxLength,
							_elm_lang$core$String$length(value)) > -1;
					},
					options.maxLength)));
	});
var _abadi199$elm_input_extra$Input_Number$exceedMaxValue = F2(
	function (options, number) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			false,
			A3(
				_elm_lang$core$Maybe$map2,
				F2(
					function (max, number) {
						return _elm_lang$core$Native_Utils.cmp(number, max) > 0;
					}),
				options.maxValue,
				number));
	});
var _abadi199$elm_input_extra$Input_Number$lessThanMinValue = F2(
	function (options, number) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			false,
			A3(
				_elm_lang$core$Maybe$map2,
				F2(
					function (min, number) {
						return _elm_lang$core$Native_Utils.cmp(number, min) < 0;
					}),
				options.minValue,
				number));
	});
var _abadi199$elm_input_extra$Input_Number$onChange = function (options) {
	var checkWithMaxValue = function (number) {
		return A2(_abadi199$elm_input_extra$Input_Number$exceedMaxValue, options, number) ? options.maxValue : number;
	};
	var checkWithMinValue = function (number) {
		return A2(_abadi199$elm_input_extra$Input_Number$lessThanMinValue, options, number) ? options.minValue : number;
	};
	var toInt = function (string) {
		return checkWithMaxValue(
			checkWithMinValue(
				_elm_lang$core$Result$toMaybe(
					_elm_lang$core$String$toInt(string))));
	};
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(
			_elm_lang$core$Json_Decode$map,
			function (_p0) {
				return options.onInput(
					toInt(_p0));
			},
			_elm_lang$html$Html_Events$targetValue));
};
var _abadi199$elm_input_extra$Input_Number$isValid = F2(
	function (newValue, options) {
		var updatedNumber = _elm_lang$core$Result$toMaybe(
			_elm_lang$core$String$toInt(newValue));
		return (!A2(_abadi199$elm_input_extra$Input_Number$exceedMaxLength, options, newValue)) && (!A2(_abadi199$elm_input_extra$Input_Number$exceedMaxValue, options, updatedNumber));
	});
var _abadi199$elm_input_extra$Input_Number$onKeyDown = F2(
	function (options, currentValue) {
		var isNumber = function (keyCode) {
			return (_elm_lang$core$Native_Utils.cmp(keyCode, 48) > -1) && (_elm_lang$core$Native_Utils.cmp(keyCode, 57) < 1);
		};
		var isNumPad = function (keyCode) {
			return (_elm_lang$core$Native_Utils.cmp(keyCode, 96) > -1) && (_elm_lang$core$Native_Utils.cmp(keyCode, 105) < 1);
		};
		var newValue = function (keyCode) {
			return A2(
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					}),
				A2(
					_elm_lang$core$Maybe$withDefault,
					'',
					A2(_elm_lang$core$Maybe$map, _elm_lang$core$Basics$toString, currentValue)),
				_elm_lang$core$String$fromChar(
					_elm_lang$core$Char$fromCode(keyCode)));
		};
		var filterKey = function (event) {
			return (event.ctrlKey || (event.altKey || event.metaKey)) ? _elm_lang$core$Json_Decode$fail('modifier key is pressed') : (A2(
				_elm_lang$core$List$any,
				F2(
					function (x, y) {
						return _elm_lang$core$Native_Utils.eq(x, y);
					})(event.keyCode),
				_abadi199$elm_input_extra$Input_KeyCode$allowedKeyCodes) ? _elm_lang$core$Json_Decode$fail('allowedKeys') : (((isNumber(event.keyCode) || isNumPad(event.keyCode)) && A2(
				_abadi199$elm_input_extra$Input_Number$isValid,
				newValue(event.keyCode),
				options)) ? _elm_lang$core$Json_Decode$fail('numeric') : _elm_lang$core$Json_Decode$succeed(event.keyCode)));
		};
		var decoder = A2(
			_elm_lang$core$Json_Decode$map,
			function (_p1) {
				return options.onInput(currentValue);
			},
			A2(_elm_lang$core$Json_Decode$andThen, filterKey, _abadi199$elm_input_extra$Input_Decoder$eventDecoder));
		var eventOptions = {stopPropagation: false, preventDefault: true};
		return A3(_elm_lang$html$Html_Events$onWithOptions, 'keydown', eventOptions, decoder);
	});
var _abadi199$elm_input_extra$Input_Number$filterNonDigit = function (value) {
	return _elm_lang$core$String$fromList(
		A2(
			_elm_lang$core$List$filter,
			_elm_lang$core$Char$isDigit,
			_elm_lang$core$String$toList(value)));
};
var _abadi199$elm_input_extra$Input_Number$input = F3(
	function (options, attributes, currentValue) {
		var toArray = A2(
			_elm_lang$core$Basics$flip,
			F2(
				function (x, y) {
					return {ctor: '::', _0: x, _1: y};
				}),
			{ctor: '[]'});
		var onFocusAttribute = A2(
			_elm_lang$core$Maybe$withDefault,
			{ctor: '[]'},
			A2(
				_elm_lang$core$Maybe$map,
				toArray,
				A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$html$Html_Events$onFocus,
					A2(
						_elm_lang$core$Maybe$map,
						function (f) {
							return f(true);
						},
						options.hasFocus))));
		var onBlurAttribute = A2(
			_elm_lang$core$Maybe$withDefault,
			{ctor: '[]'},
			A2(
				_elm_lang$core$Maybe$map,
				toArray,
				A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$html$Html_Events$onBlur,
					A2(
						_elm_lang$core$Maybe$map,
						function (f) {
							return f(false);
						},
						options.hasFocus))));
		var maxAttribute = A2(
			_elm_lang$core$Maybe$withDefault,
			{ctor: '[]'},
			A2(
				_elm_lang$core$Maybe$map,
				toArray,
				A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$html$Html_Attributes$max,
					A2(_elm_lang$core$Maybe$map, _elm_lang$core$Basics$toString, options.maxValue))));
		var minAttribute = A2(
			_elm_lang$core$Maybe$withDefault,
			{ctor: '[]'},
			A2(
				_elm_lang$core$Maybe$map,
				toArray,
				A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$html$Html_Attributes$min,
					A2(_elm_lang$core$Maybe$map, _elm_lang$core$Basics$toString, options.minValue))));
		return A2(
			_elm_lang$html$Html$input,
			A2(
				_elm_lang$core$List$append,
				minAttribute,
				A2(
					_elm_lang$core$List$append,
					maxAttribute,
					A2(
						_elm_lang$core$List$append,
						onBlurAttribute,
						A2(
							_elm_lang$core$List$append,
							onFocusAttribute,
							A2(
								_elm_lang$core$List$append,
								attributes,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$value(
										A2(
											_elm_lang$core$Maybe$withDefault,
											'',
											A2(_elm_lang$core$Maybe$map, _elm_lang$core$Basics$toString, currentValue))),
									_1: {
										ctor: '::',
										_0: A2(_abadi199$elm_input_extra$Input_Number$onKeyDown, options, currentValue),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Events$onInput(
												function (_p2) {
													return options.onInput(
														_elm_lang$core$Result$toMaybe(
															_elm_lang$core$String$toInt(_p2)));
												}),
											_1: {
												ctor: '::',
												_0: _abadi199$elm_input_extra$Input_Number$onChange(options),
												_1: {
													ctor: '::',
													_0: _elm_lang$html$Html_Attributes$type_('number'),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}))))),
			{ctor: '[]'});
	});
var _abadi199$elm_input_extra$Input_Number$defaultOptions = function (onInput) {
	return {onInput: onInput, maxLength: _elm_lang$core$Maybe$Nothing, maxValue: _elm_lang$core$Maybe$Nothing, minValue: _elm_lang$core$Maybe$Nothing, hasFocus: _elm_lang$core$Maybe$Nothing};
};
var _abadi199$elm_input_extra$Input_Number$Options = F5(
	function (a, b, c, d, e) {
		return {maxLength: a, maxValue: b, minValue: c, onInput: d, hasFocus: e};
	});

var _abadi199$elm_creditcard$CreditCard$updateName = F2(
	function (config, cardData) {
		var updatedCardData = function (name) {
			return _elm_lang$core$Native_Utils.update(
				cardData,
				{
					name: _elm_lang$core$Maybe$Just(name)
				});
		};
		return function (name) {
			return config.onChange(
				updatedCardData(name));
		};
	});
var _abadi199$elm_creditcard$CreditCard$updateNumber = F2(
	function (config, cardData) {
		var updatedCardData = function (number) {
			return _elm_lang$core$Native_Utils.update(
				cardData,
				{
					number: _elm_lang$core$Maybe$Just(number)
				});
		};
		return function (number) {
			return config.onChange(
				updatedCardData(number));
		};
	});
var _abadi199$elm_creditcard$CreditCard$updateMonth = F2(
	function (config, cardData) {
		var updatedCardData = function (maybeInt) {
			return _elm_lang$core$Native_Utils.update(
				cardData,
				{
					month: A2(_elm_lang$core$Maybe$map, _elm_lang$core$Basics$toString, maybeInt)
				});
		};
		return function (maybeInt) {
			return config.onChange(
				updatedCardData(maybeInt));
		};
	});
var _abadi199$elm_creditcard$CreditCard$updateYear = F2(
	function (config, cardData) {
		var updatedCardData = function (maybeInt) {
			return _elm_lang$core$Native_Utils.update(
				cardData,
				{
					year: A2(_elm_lang$core$Maybe$map, _elm_lang$core$Basics$toString, maybeInt)
				});
		};
		return function (maybeInt) {
			return config.onChange(
				updatedCardData(maybeInt));
		};
	});
var _abadi199$elm_creditcard$CreditCard$updateCCV = F2(
	function (config, cardData) {
		var updatedCardData = function (maybeInt) {
			return _elm_lang$core$Native_Utils.update(
				cardData,
				{
					ccv: A2(_elm_lang$core$Maybe$map, _elm_lang$core$Basics$toString, maybeInt)
				});
		};
		return function (maybeInt) {
			return config.onChange(
				updatedCardData(maybeInt));
		};
	});
var _abadi199$elm_creditcard$CreditCard$form = F2(
	function (config, cardData) {
		var focusHandler = function (hasFocus) {
			var updatedCardData = A2(_abadi199$elm_creditcard$CreditCard_Events$updateCCVFocus, hasFocus, cardData);
			return config.onChange(updatedCardData);
		};
		var ccvConfig = function () {
			var $default = _abadi199$elm_input_extra$Input_Number$defaultOptions(
				A2(_abadi199$elm_creditcard$CreditCard$updateCCV, config, cardData));
			return _elm_lang$core$Native_Utils.update(
				$default,
				{
					minValue: _elm_lang$core$Maybe$Just(1),
					maxValue: _elm_lang$core$Maybe$Just(9999),
					hasFocus: _elm_lang$core$Maybe$Just(focusHandler)
				});
		}();
		var yearConfig = function () {
			var $default = _abadi199$elm_input_extra$Input_Number$defaultOptions(
				A2(_abadi199$elm_creditcard$CreditCard$updateYear, config, cardData));
			return _elm_lang$core$Native_Utils.update(
				$default,
				{
					minValue: _elm_lang$core$Maybe$Just(1),
					maxValue: _elm_lang$core$Maybe$Just(9999)
				});
		}();
		var monthConfig = function () {
			var $default = _abadi199$elm_input_extra$Input_Number$defaultOptions(
				A2(_abadi199$elm_creditcard$CreditCard$updateMonth, config, cardData));
			return _elm_lang$core$Native_Utils.update(
				$default,
				{
					maxValue: _elm_lang$core$Maybe$Just(12),
					minValue: _elm_lang$core$Maybe$Just(1)
				});
		}();
		var field = F2(
			function (getter, inputElement) {
				return A2(
					_elm_lang$html$Html$p,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class(
							getter(config.classes)),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: config.showLabel ? A2(
							_elm_lang$html$Html$label,
							{ctor: '[]'},
							{
								ctor: '::',
								_0: _elm_lang$html$Html$text(
									getter(config.labels)),
								_1: {
									ctor: '::',
									_0: inputElement,
									_1: {ctor: '[]'}
								}
							}) : inputElement,
						_1: {ctor: '[]'}
					});
			});
		var toMaybeInt = F2(
			function (msg, maybeInt) {
				return msg(
					A2(_elm_lang$core$Maybe$map, _elm_lang$core$Basics$toString, maybeInt));
			});
		var unwrap = F2(
			function (msg, str) {
				return msg(
					_elm_lang$core$Maybe$Just(str));
			});
		var cardInfo = _abadi199$elm_creditcard$Helpers_CardType$detect(cardData);
		var _p0 = _abadi199$elm_creditcard$Helpers_Misc$minMaxNumberLength(cardInfo);
		var maxLength = _p0._1;
		var numberConfig = function () {
			var $default = _abadi199$elm_input_extra$Input_BigNumber$defaultOptions(
				A2(_abadi199$elm_creditcard$CreditCard$updateNumber, config, cardData));
			return _elm_lang$core$Native_Utils.update(
				$default,
				{
					maxLength: _elm_lang$core$Maybe$Just(maxLength)
				});
		}();
		return A2(
			_elm_lang$html$Html$div,
			{ctor: '[]'},
			{
				ctor: '::',
				_0: A3(_abadi199$elm_creditcard$CreditCard_Components_Card$card, config, cardInfo, cardData),
				_1: {
					ctor: '::',
					_0: A2(
						field,
						function (_) {
							return _.number;
						},
						A3(
							_abadi199$elm_input_extra$Input_BigNumber$input,
							numberConfig,
							{
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$placeholder(config.placeholders.number),
								_1: {ctor: '[]'}
							},
							A2(_elm_lang$core$Maybe$withDefault, '', cardData.number))),
					_1: {
						ctor: '::',
						_0: A2(
							field,
							function (_) {
								return _.name;
							},
							A2(
								_elm_lang$html$Html$input,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$type_('text'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$value(
											A2(_elm_lang$core$Maybe$withDefault, '', cardData.name)),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Events$onInput(
												A2(_abadi199$elm_creditcard$CreditCard$updateName, config, cardData)),
											_1: {
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$placeholder(config.placeholders.name),
												_1: {ctor: '[]'}
											}
										}
									}
								},
								{ctor: '[]'})),
						_1: {
							ctor: '::',
							_0: A2(
								field,
								function (_) {
									return _.month;
								},
								A3(
									_abadi199$elm_input_extra$Input_Number$input,
									monthConfig,
									{
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$placeholder(config.placeholders.month),
										_1: {ctor: '[]'}
									},
									A2(
										_elm_lang$core$Maybe$andThen,
										function (_p1) {
											return _elm_lang$core$Result$toMaybe(
												_elm_lang$core$String$toInt(_p1));
										},
										cardData.month))),
							_1: {
								ctor: '::',
								_0: A2(
									field,
									function (_) {
										return _.year;
									},
									A3(
										_abadi199$elm_input_extra$Input_Number$input,
										yearConfig,
										{
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$placeholder(config.placeholders.year),
											_1: {ctor: '[]'}
										},
										A2(
											_elm_lang$core$Maybe$andThen,
											function (_p2) {
												return _elm_lang$core$Result$toMaybe(
													_elm_lang$core$String$toInt(_p2));
											},
											cardData.year))),
								_1: {
									ctor: '::',
									_0: A2(
										field,
										function (_) {
											return _.ccv;
										},
										A3(
											_abadi199$elm_input_extra$Input_Number$input,
											ccvConfig,
											{
												ctor: '::',
												_0: _elm_lang$html$Html_Attributes$placeholder(config.placeholders.ccv),
												_1: {ctor: '[]'}
											},
											A2(
												_elm_lang$core$Maybe$andThen,
												function (_p3) {
													return _elm_lang$core$Result$toMaybe(
														_elm_lang$core$String$toInt(_p3));
												},
												cardData.ccv))),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			});
	});
var _abadi199$elm_creditcard$CreditCard$card = F2(
	function (config, cardData) {
		var cardInfo = _abadi199$elm_creditcard$Helpers_CardType$detect(cardData);
		return A3(_abadi199$elm_creditcard$CreditCard_Components_Card$card, config, cardInfo, cardData);
	});
var _abadi199$elm_creditcard$CreditCard$initialState = _abadi199$elm_creditcard$CreditCard_Internal$initialState;
var _abadi199$elm_creditcard$CreditCard$emptyCardData = {number: _elm_lang$core$Maybe$Nothing, name: _elm_lang$core$Maybe$Nothing, month: _elm_lang$core$Maybe$Nothing, year: _elm_lang$core$Maybe$Nothing, ccv: _elm_lang$core$Maybe$Nothing, state: _abadi199$elm_creditcard$CreditCard$initialState};

var _abadi199$elm_input_extra$Dropdown$onChange = F2(
	function (emptyItem, tagger) {
		var textToMaybe = function (string) {
			return A2(
				_elm_lang$core$Maybe$withDefault,
				false,
				A2(
					_elm_lang$core$Maybe$map,
					function (_p0) {
						return A2(
							F2(
								function (x, y) {
									return _elm_lang$core$Native_Utils.eq(x, y);
								}),
							string,
							function (_) {
								return _.value;
							}(_p0));
					},
					emptyItem)) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(string);
		};
		return A2(
			_elm_lang$html$Html_Events$on,
			'change',
			A2(
				_elm_lang$core$Json_Decode$map,
				function (_p1) {
					return tagger(
						textToMaybe(_p1));
				},
				_elm_lang$html$Html_Events$targetValue));
	});
var _abadi199$elm_input_extra$Dropdown$dropdown = F3(
	function (options, attributes, currentValue) {
		var itemsWithEmptyItems = function () {
			var _p2 = options.emptyItem;
			if (_p2.ctor === 'Just') {
				return {ctor: '::', _0: _p2._0, _1: options.items};
			} else {
				return options.items;
			}
		}();
		var isSelected = function (value) {
			return A2(
				_elm_lang$core$Maybe$withDefault,
				false,
				A2(
					_elm_lang$core$Maybe$map,
					F2(
						function (x, y) {
							return _elm_lang$core$Native_Utils.eq(x, y);
						})(value),
					currentValue));
		};
		var toOption = function (_p3) {
			var _p4 = _p3;
			var _p5 = _p4.value;
			return A2(
				_elm_lang$html$Html$option,
				{
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$value(_p5),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$selected(
							isSelected(_p5)),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$disabled(!_p4.enabled),
							_1: {ctor: '[]'}
						}
					}
				},
				{
					ctor: '::',
					_0: _elm_lang$html$Html$text(_p4.text),
					_1: {ctor: '[]'}
				});
		};
		return A2(
			_elm_lang$html$Html$select,
			A2(
				_elm_lang$core$Basics_ops['++'],
				attributes,
				{
					ctor: '::',
					_0: A2(_abadi199$elm_input_extra$Dropdown$onChange, options.emptyItem, options.onChange),
					_1: {ctor: '[]'}
				}),
			A2(_elm_lang$core$List$map, toOption, itemsWithEmptyItems));
	});
var _abadi199$elm_input_extra$Dropdown$defaultOptions = function (onChange) {
	return {
		items: {ctor: '[]'},
		emptyItem: _elm_lang$core$Maybe$Nothing,
		onChange: onChange
	};
};
var _abadi199$elm_input_extra$Dropdown$Item = F3(
	function (a, b, c) {
		return {value: a, text: b, enabled: c};
	});
var _abadi199$elm_input_extra$Dropdown$Options = F3(
	function (a, b, c) {
		return {items: a, emptyItem: b, onChange: c};
	});

var _abadi199$elm_creditcard$CardDemo$update = F2(
	function (msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'NoOp':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'SelectCardNumber':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{number: _p0._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				return {
					ctor: '_Tuple2',
					_0: A2(_abadi199$elm_creditcard$CreditCard_Events$updateCCVFocus, _p0._0, model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _abadi199$elm_creditcard$CardDemo$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$none;
};
var _abadi199$elm_creditcard$CardDemo$init = {
	ctor: '_Tuple2',
	_0: {
		number: _elm_lang$core$Maybe$Nothing,
		name: _elm_lang$core$Maybe$Just('John Smith'),
		month: _elm_lang$core$Maybe$Just('12'),
		year: _elm_lang$core$Maybe$Just('2025'),
		ccv: _elm_lang$core$Maybe$Just('1234'),
		state: _abadi199$elm_creditcard$CreditCard$initialState
	},
	_1: _elm_lang$core$Platform_Cmd$none
};
var _abadi199$elm_creditcard$CardDemo$cardNumbers = _elm_lang$core$Dict$fromList(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'MasterCard', _1: '5105105105105100'},
		_1: {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: 'Visa', _1: '4111111111111111'},
			_1: {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: 'AmericanExpress', _1: '378282246310005'},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: 'Discover', _1: '6011000990139424'},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'DinersClub', _1: '30569309025904'},
						_1: {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: 'JCB', _1: '3530111333300000'},
							_1: {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: 'Visa Electron', _1: '4917300800000000'},
								_1: {ctor: '[]'}
							}
						}
					}
				}
			}
		}
	});
var _abadi199$elm_creditcard$CardDemo$Model = F6(
	function (a, b, c, d, e, f) {
		return {number: a, name: b, month: c, year: d, ccv: e, state: f};
	});
var _abadi199$elm_creditcard$CardDemo$ViewCCV = function (a) {
	return {ctor: 'ViewCCV', _0: a};
};
var _abadi199$elm_creditcard$CardDemo$SelectCardNumber = function (a) {
	return {ctor: 'SelectCardNumber', _0: a};
};
var _abadi199$elm_creditcard$CardDemo$view = function (model) {
	var defaultOptions = _abadi199$elm_input_extra$Dropdown$defaultOptions(_abadi199$elm_creditcard$CardDemo$SelectCardNumber);
	var toItems = F2(
		function (name, number) {
			return {value: number, text: name, enabled: true};
		});
	var config = _abadi199$elm_creditcard$CreditCard_Config$defaultConfig;
	return A2(
		_elm_lang$html$Html$form,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(_abadi199$elm_creditcard$CreditCard$card, config, model),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$label,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('card-type-dropdown'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Card Type'),
						_1: {
							ctor: '::',
							_0: A3(
								_abadi199$elm_input_extra$Dropdown$dropdown,
								_elm_lang$core$Native_Utils.update(
									defaultOptions,
									{
										emptyItem: _elm_lang$core$Maybe$Just(
											{value: '', text: '-Please select-', enabled: true}),
										items: _elm_lang$core$Dict$values(
											A2(_elm_lang$core$Dict$map, toItems, _abadi199$elm_creditcard$CardDemo$cardNumbers))
									}),
								{ctor: '[]'},
								model.number),
							_1: {ctor: '[]'}
						}
					}),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$html$Html$label,
						{
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('see-ccv-checkbox'),
							_1: {ctor: '[]'}
						},
						{
							ctor: '::',
							_0: A2(
								_elm_lang$html$Html$input,
								{
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$type_('checkbox'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Events$onCheck(_abadi199$elm_creditcard$CardDemo$ViewCCV),
										_1: {ctor: '[]'}
									}
								},
								{ctor: '[]'}),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html$text('View CCV'),
								_1: {ctor: '[]'}
							}
						}),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _abadi199$elm_creditcard$CardDemo$main = _elm_lang$html$Html$program(
	{init: _abadi199$elm_creditcard$CardDemo$init, subscriptions: _abadi199$elm_creditcard$CardDemo$subscriptions, view: _abadi199$elm_creditcard$CardDemo$view, update: _abadi199$elm_creditcard$CardDemo$update})();
var _abadi199$elm_creditcard$CardDemo$NoOp = {ctor: 'NoOp'};

var _abadi199$elm_creditcard$FormDemo$update = F2(
	function (msg, model) {
		var _p0 = msg;
		if (_p0.ctor === 'NoOp') {
			return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
		} else {
			return {ctor: '_Tuple2', _0: _p0._0, _1: _elm_lang$core$Platform_Cmd$none};
		}
	});
var _abadi199$elm_creditcard$FormDemo$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$none;
};
var _abadi199$elm_creditcard$FormDemo$init = {
	ctor: '_Tuple2',
	_0: {number: _elm_lang$core$Maybe$Nothing, name: _elm_lang$core$Maybe$Nothing, month: _elm_lang$core$Maybe$Nothing, year: _elm_lang$core$Maybe$Nothing, ccv: _elm_lang$core$Maybe$Nothing, state: _abadi199$elm_creditcard$CreditCard$initialState, shippingAddress: _elm_lang$core$Maybe$Nothing, shippingState: _elm_lang$core$Maybe$Nothing},
	_1: _elm_lang$core$Platform_Cmd$none
};
var _abadi199$elm_creditcard$FormDemo$Model = F8(
	function (a, b, c, d, e, f, g, h) {
		return {number: a, name: b, month: c, year: d, ccv: e, state: f, shippingAddress: g, shippingState: h};
	});
var _abadi199$elm_creditcard$FormDemo$UpdateCardData = function (a) {
	return {ctor: 'UpdateCardData', _0: a};
};
var _abadi199$elm_creditcard$FormDemo$view = function (model) {
	var config = _abadi199$elm_creditcard$CreditCard_Config$defaultFormConfig(_abadi199$elm_creditcard$FormDemo$UpdateCardData);
	return A2(
		_elm_lang$html$Html$form,
		{ctor: '[]'},
		{
			ctor: '::',
			_0: A2(_abadi199$elm_creditcard$CreditCard$form, config, model),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_lang$html$Html$button,
					{
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$type_('button'),
						_1: {ctor: '[]'}
					},
					{
						ctor: '::',
						_0: _elm_lang$html$Html$text('Checkout'),
						_1: {ctor: '[]'}
					}),
				_1: {ctor: '[]'}
			}
		});
};
var _abadi199$elm_creditcard$FormDemo$main = _elm_lang$html$Html$program(
	{init: _abadi199$elm_creditcard$FormDemo$init, subscriptions: _abadi199$elm_creditcard$FormDemo$subscriptions, view: _abadi199$elm_creditcard$FormDemo$view, update: _abadi199$elm_creditcard$FormDemo$update})();
var _abadi199$elm_creditcard$FormDemo$NoOp = {ctor: 'NoOp'};

var Elm = {};
Elm['CardDemo'] = Elm['CardDemo'] || {};
if (typeof _abadi199$elm_creditcard$CardDemo$main !== 'undefined') {
    _abadi199$elm_creditcard$CardDemo$main(Elm['CardDemo'], 'CardDemo', undefined);
}
Elm['FormDemo'] = Elm['FormDemo'] || {};
if (typeof _abadi199$elm_creditcard$FormDemo$main !== 'undefined') {
    _abadi199$elm_creditcard$FormDemo$main(Elm['FormDemo'], 'FormDemo', undefined);
}

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);

