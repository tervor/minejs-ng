var items = null;
var itemTags = null;
var achievedItems = null;
var currentTag = 'all';

function initItems() {
	initItemTemplates();

	getItems();
}

//this code is making the fronted display very slow.... 
function initItemTemplates() {
	$.template('itemTemplate', "\
	<div id='GridBox' class='GridBox ItemGridBox'>\
	<div id='ctlMinus' class='ctlPlMi' onclick='decreaseAmount(${id})'>-</div>\
	<div id='varAmount-${id}' class='varAmountbox' onclick='actGiveItem(${id})'>${amount}</div>\
	<div id='ctlPlus' class='ctlPlMi' onclick='increaseAmount(${id})'>+</div>\
	<div name='IconLayer-${id}' onclick='actGiveItem(${id})'>\
	<div style='padding: 25% 29% 4% 29%;'>\
	<img src='/icons/${id}.png' id='ItemImg-${id}' class='STicon' border='0'></div>\
	<div name='Namelabel-${id}' id='Namelabel-${id}' class='Namelabel'>${info}</div></div>\
	");
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

//TODO sortable data need to be computed... i/o is in jason
function getItems() {
	$.getJSON('/items.json', function(data) {
		items = data.items;
		itemTags = data.itemTags;
		achievedItems = data.achievedItems;
		updateItems();
	});
}

function updateItems() {
	if (!items || !itemTags)
		return;
	//$('#itemTags').html('Tags: ');
	$('#items').html('');
	$.each(itemTags, function(i, tag) {
		drawItemTag(tag);
	});
	$.each(items, function(i, item) {
		if (item.tags.indexOf(currentTag) >= 0) {
//			if (achievedItems.indexOf(item.id) >= 0)
			$.tmpl('itemTemplate', item).appendTo('#items');
		}
	});
}

function drawItemTag(tag) {
	$('#itemTags').append('\
		<div id="ItemTag" class="itemTags" onclick="selectItemTag(\'' + tag.name + '\')">' + tag.info + '</div>\
	');
}

function selectItemTag(name) {
	currentTag = name;
	updateItems();
}

function actGiveItem(id) {
	var amount = parseInt(parseFloat($('#varAmount-' + id).text()));
	console.log("DEBUG id is: " + id + " amount is: " + amount);
	notify("fade", "DEBUG id is: " + id + " amount is: " + amount);
	clientGive(id, amount);
}

function decreaseAmount(id) {
	var amount = parseInt(parseFloat($('#varAmount-' + id).text()));
	if (amount > 1)
		amount /= 2;
	$('#varAmount-' + id).text(Math.floor(amount));
}

function increaseAmount(id) {
	var amount = parseInt(parseFloat($('#varAmount-' + id).text()));
	if (amount < MaxLimitItems)
		amount *= 2;
	$('#varAmount-' + id).text(Math.floor(amount));
}


function updateItemList() {

}
