
dashboard = null;

// Creates the dashboard
function Dashboard() {
	dashboard = this;
	this.items = null;
	this.itemTags = null;
	this.achievedItems = null;
	this.currentTag = 'all';
	
	this.elementTags = $('#dashboard-tags');
	this.elementItems = $('#dashboard-items');
	
	this.initTemplates();
	this.update();
}

// Initializes templates
Dashboard.prototype.initTemplates = function() {
	$.template('itemTemplate', "\
	<div id='GridBox' class='GridBox ItemGridBox'>\
	<div id='ctlMinus' class='ctlPlMi' onclick='dashboard.decreaseAmount(${id})'>-</div>\
	<div id='varAmount-${id}' class='varAmountbox' onclick='dashboard.give(${id})'>${amount}</div>\
	<div id='ctlPlus' class='ctlPlMi' onclick='dashboard.increaseAmount(${id})'>+</div>\
	<div name='IconLayer-${id}' onclick='dashboard.give(${id})'>\
	<div style='padding: 25% 29% 4% 29%;'>\
	<img src='/icons/${id}.png' id='ItemImg-${id}' class='STicon' border='0'></div>\
	<div name='Namelabel-${id}' id='Namelabel-${id}' class='Namelabel'>${info}</div></div>\
	");
	
	$.template('itemTagTemplate', "\
	<div id='dashboard-item-tag-${name}' class='dashboard-item-tag' onclick='dashboard.selectTag(\"${name}\")'>${info}</div>\
	");
}

// Updates the data
Dashboard.prototype.update = function() {
	$.getJSON('/items.json', function(data) {
		dashboard.items = data.items;
		dashboard.itemTags = data.itemTags;
		dashboard.achievedItems = data.achievedItems;
		dashboard.render();
	});
}

// Renders the data
Dashboard.prototype.render = function() {
	if (!this.items || !this.itemTags)
		return;
	this.elementTags.html('');
	this.elementItems.html('');
	$.each(this.itemTags, function(i, tag) {
		$.tmpl('itemTagTemplate', tag).appendTo(dashboard.elementTags);
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