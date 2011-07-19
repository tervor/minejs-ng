itemList = null;

function initItemList() {
	itemList = new ItemList();
}

// Creates the item list
function ItemList() {
	this.items = null;
	this.itemTags = null;
	this.achievedItems = null;
	this.currentTag = 'all';
	
	this.initTemplates();
	this.update();
}

// Initializes templates
ItemList.prototype.initTemplates = function() {
	$.template('itemTemplate', "\
	<div id='GridBox' class='GridBox ItemGridBox'>\
	<div id='ctlMinus' class='ctlPlMi' onclick='itemList.decreaseAmount(${id})'>-</div>\
	<div id='varAmount-${id}' class='varAmountbox' onclick='itemList.give(${id})'>${amount}</div>\
	<div id='ctlPlus' class='ctlPlMi' onclick='itemList.increaseAmount(${id})'>+</div>\
	<div name='IconLayer-${id}' onclick='itemList.give(${id})'>\
	<div style='padding: 25% 29% 4% 29%;'>\
	<img src='/icons/${id}.png' id='ItemImg-${id}' class='STicon' border='0'></div>\
	<div name='Namelabel-${id}' id='Namelabel-${id}' class='Namelabel'>${info}</div></div>\
	");
	
	$.template('itemTagTemplate', "\
	<div id='ItemTag' class='itemTags' onclick='itemList.selectTag(\"${name}\")'>${info}</div>\
	");
}

// Updates the data
ItemList.prototype.update = function() {
	$.getJSON('/items.json', function(data) {
		itemList.items = data.items;
		itemList.itemTags = data.itemTags;
		itemList.achievedItems = data.achievedItems;
		itemList.render();
	});
}

// Renders the data
ItemList.prototype.render = function() {
	if (!this.items || !this.itemTags)
		return;
	$('#item-tags').html('');
	$('#items').html('');
	$.each(this.itemTags, function(i, tag) {
		$.tmpl('itemTagTemplate', tag).appendTo('#item-tags');
	});
	$.each(this.items, function(i, item) {
		if (item.tags.indexOf(itemList.currentTag) >= 0) {
			//if (itemList.achievedItems.indexOf(item.id) >= 0)
				$.tmpl('itemTemplate', item).appendTo('#items');
		}
	});
}

// Called to select a new tag
ItemList.prototype.selectTag = function(tag) {
	this.currentTag = tag;
	this.render();
}

// Called to increase amount of item
ItemList.prototype.increaseAmount = function(id) {
	var amount = parseInt($('#varAmount-' + id).text());
	if (amount > 1)
		amount /= 2;
	$('#varAmount-' + id).text(amount);
}

// Called to decrease amount of item
ItemList.prototype.decreaseAmount = function(id) {
	var amount = parseInt($('#varAmount-' + id).text());
	if (amount > 1)
		amount /= 2;
	$('#varAmount-' + id).text(amount);
}

// Called to give item
ItemList.prototype.give = function(id) {
	var amount = parseInt($('#varAmount-' + id).text());
	clientGive(id, amount);
}


//this performs much faster i think, maybe we can remove some more elements
/*
function drawItem(id, name, amount) {
	$('#sortable').append('<!--add item---> \
	<div id="GridBox" class="GridBox ItemGridBox"> \
	<div id="ctlMinus" class="ctlPlMi" onclick="calAmount(\'' + id + '\',\'-\')">-</div> \
	div id="varAmount-' + id + '" class="varAmountbox"  onclick="actGiveItem(' + id + ')">' + amount + '</div> \
	<div id="ctlPlus" class="ctlPlMi" onclick="calAmount(\'' + id + '\',\'+\')">+</div> \
	<div name="IconLayer-' + id + '" onclick="actGiveItem(\'' + id + '\')" > \
	<div style="padding: 25% 29% 4% 29%;"> \
	<img src="/icons/' + id + '.png" id=="ItemImg-' + id + '" class="STicon" border="0"></div> \
	<div name="Namelabel-' + id + '"  id="Namelabel-' + id + '" class="Namelabel">' + name + '</div></div>');
}
*/
