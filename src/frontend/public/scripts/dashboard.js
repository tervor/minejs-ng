
dashboard = null;

// Creates the dashboard
function Dashboard() {
	dashboard = this;
	this.items = null;
	this.itemTags = null;
	this.itemMap = null;
	this.achievedItems = null;
	this.currentTag = 'all';
	
	this.elementTags = $('#nav-sub-dashboard');
	this.elementItems = $('#dashboard-items');
	
	this.initTemplates();
	this.update();
}

// Initializes templates
Dashboard.prototype.initTemplates = function() {
	$.template('itemTagTemplate', "\
	<div id='dashboard-item-tag-${name}' class='dashboard-item-tag' onclick='dashboard.selectTag(\"${name}\")'>${info}</div>\
	");
	
	$.template('itemTemplate', "\
	<div id='GridBox' class='GridBox ItemGridBox'>\
	<div id='ctlMinus' class='ctlPlMi' onclick='dashboard.decreaseAmount(${id})'>-</div>\
	<div id='varAmount-${id}' class='varAmountbox' onclick='dashboard.give(${id})'>${amount}</div>\
	<div id='ctlPlus' class='ctlPlMi' onclick='dashboard.increaseAmount(${id})'>+</div>\
	<div name='IconLayer-${id}' onclick='dashboard.give(${id})'>\
	<div style='padding: 25% 29% 4% 29%;'>\
	<div style='width: ${image.width}px; height: ${image.height}px; background: url(\"/images/items.png\") no-repeat; background-position: -${image.x}px -${image.y}px'></div>\
	</div>\
	<div name='Namelabel-${id}' id='Namelabel-${id}' class='Namelabel'>${info}</div>\
	</div>\
	");
}

// Updates the data
Dashboard.prototype.update = function() {
	$.getJSON('/items.json', function(data) {
		dashboard.items = data.items;
		dashboard.itemTags = data.itemTags;
		dashboard.itemMap = data.itemMap;
		dashboard.achievedItems = data.achievedItems;
		dashboard.updateImageMap();
		dashboard.render();
	});
}

Dashboard.prototype.updateImageMap = function() {
	var mapInfo = dashboard.itemMap.info;
	$.each(this.items, function(i, item) {
		item.image = {};
		var mapItem = dashboard.itemMap.cells[item.id];
		if (mapItem) {
			item.image.x = mapItem.x * mapInfo.cellwidth;
			item.image.y = mapItem.y * mapInfo.cellheight;
			item.image.width = mapInfo.cellwidth;
			item.image.height = mapInfo.cellheight;
		} else {
			item.image.x = 0;
			item.image.y = 0;
			item.image.width = mapInfo.cellwidth;
			item.image.height = mapInfo.cellheight;
		}
	});
}

// Renders the data
Dashboard.prototype.render = function() {
	if (!this.items || !this.itemTags)
		return;
	this.elementTags.html('');
	this.elementItems.html('');
	$.each(this.itemTags, function(i, tag) {
		var element = $.tmpl('itemTagTemplate', tag);
		if (dashboard.currentTag == tag.name)
			element.addClass('selected');
		element.appendTo(dashboard.elementTags);
	});
	$.each(this.items, function(i, item) {
		if (item.tags.indexOf(dashboard.currentTag) >= 0) {
			//if (dashboard.achievedItems.indexOf(item.id) >= 0)
				$.tmpl('itemTemplate', item).appendTo(dashboard.elementItems);
		}
	});
}

// Called to select a new tag
Dashboard.prototype.selectTag = function(tag) {
	this.currentTag = tag;
	this.render();
	$('#dashboard-item-tag-' + tag).addClass('selected');
}

// Called to increase amount of item
Dashboard.prototype.increaseAmount = function(id) {
	var amount = parseInt($('#varAmount-' + id).text());
	var max = this.itemById(id).amount * config.maxStacks;
	if (amount < max)
		amount *= 2;
	$('#varAmount-' + id).text(amount);
}

// Called to decrease amount of item
Dashboard.prototype.decreaseAmount = function(id) {
	var amount = parseInt($('#varAmount-' + id).text());
	if (amount > 1)
		amount /= 2;
	$('#varAmount-' + id).text(amount);
}

// Called to give item
Dashboard.prototype.give = function(id) {
	var amount = parseInt($('#varAmount-' + id).text());
	client.give(id, amount);
}

Dashboard.prototype.itemById = function(id) {
	for (var key in this.items)
		if (this.items[key].id == id)
			return this.items[key];
	return null;
}