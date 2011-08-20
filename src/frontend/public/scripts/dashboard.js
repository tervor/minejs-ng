
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
	<div id='dashboard-item-${name}' class='dashboard-item'>\
	<div class='dashboard-item-decinc' onclick='dashboard.decreaseAmount(${id})'>-</div>\
	<div id='dashboard-item-amount-${id}' class='dashboard-item-amount' onclick='dashboard.give(${id})'>${amount}</div>\
	<div class='dashboard-item-decinc' onclick='dashboard.increaseAmount(${id})'>+</div>\
	<div class='dashboard-item-icon' onclick='dashboard.give(${id})'>\
	<div style='width: ${image.width}px; height: ${image.height}px; background: url(\"/images/items.png\") no-repeat; background-position: -${image.x}px -${image.y}px'></div>\
	</div>\
	<div class='dashboard-item-label'>${info}</div>\
	</div>\
	");
	
	$.template('kitTemplate', "\
	<div class='dashboard-kit' onclick='dashboard.kit(\"${name}\")'>\
	<div class='dashboard-kit-label'>${info}</div>\
	<div class='dashboard-kit-items'/>\
	</div>\
	");
	
	$.template('kitItemTemplate', "\
	<div class='dashboard-kit-item'>\
	<div class='dashboard-kit-item-icon'>\
	<div style='width: ${image.width}px; height: ${image.height}px; background: url(\"/images/items.png\") no-repeat; background-position: -${image.x}px -${image.y}px'></div>\
	</div>\
	<div class='dashboard-kit-item-label'>${amount} x</div>\
	</div>\
	");
}

// Updates the data
Dashboard.prototype.update = function() {
	$.getJSON('/items.json', function(data) {
		dashboard.items = data.items;
		dashboard.kits = data.kits;
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
	if (dashboard.currentTag == 'kit') {
		$.each(this.kits, function(i, kit) {
			var element = $.tmpl('kitTemplate', kit);
			$.each(kit.items, function(i, kitItem) {
				item = dashboard.itemByNameOrId(kitItem.id);
				if (item) {
					kitItem.image = item.image;
					$.tmpl('kitItemTemplate', kitItem).appendTo($('.dashboard-kit-items', element));
				}
			});
			element.appendTo(dashboard.elementItems);
		});
	}
}

// Called to select a new tag
Dashboard.prototype.selectTag = function(tag) {
	this.currentTag = tag;
	this.render();
	$('#dashboard-item-tag-' + tag).addClass('selected');
}

// Called to increase amount of item
Dashboard.prototype.increaseAmount = function(id) {
	var amount = parseInt($('#dashboard-item-amount-' + id).text());
	var max = this.itemById(id).amount * config.maxStacks;
	if (amount < max)
		amount *= 2;
	$('#dashboard-item-amount-' + id).text(amount);
}

// Called to decrease amount of item
Dashboard.prototype.decreaseAmount = function(id) {
	var amount = parseInt($('#dashboard-item-amount-' + id).text());
	if (amount > 1)
		amount /= 2;
	$('#dashboard-item-amount-' + id).text(amount);
}

// Called to give item
Dashboard.prototype.give = function(id) {
	var amount = parseInt($('#dashboard-item-amount-' + id).text());
	client.give(id, amount);
}

// Called to give item kit
Dashboard.prototype.kit = function(name) {
	client.kit(name);
}

Dashboard.prototype.itemById = function(id) {
	for (var key in this.items)
		if (this.items[key].id == id)
			return this.items[key];
	return null;
}	

Dashboard.prototype.itemByName = function(name) {
	for (var key in this.items)
		if (this.items[key].name == name)
			return this.items[key];
	return null;
}

Dashboard.prototype.itemByNameOrId = function(name) {
	var item = this.itemByName(name);
	if (!item)
		item = this.itemById(name);
	return item;
}

