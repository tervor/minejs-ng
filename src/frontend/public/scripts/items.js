
var items = null;
var itemTags = null;
var achievedItems = null;
var currentTag = 'all';

function initItems() {
	/*
	// Configure Items Grid
	$('#sortable').sortable({
		revert: true,
		snap: true,
		grid: [ 100, 100 ],
		opacity: 0.6,
		dropOnEmpty: false,
		receive: function(e, ui) {
			console.log('dropped');
		}
	});
	*/
	getItems();
}

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
	$('#itemTags').html('ölkjsdfg');
	$('#items').html('');
	$.each(itemTags, function(i, tag) {
		drawItemTag(tag);
	});
	$.each(items, function(i, item) {
		if (item.tags.indexOf(currentTag) >= 0)
//			if (achievedItems.indexOf(item.id) >= 0)
				drawItem(item);
	});
}

function drawItemTag(tag) {
	$('#itemTags').append('\
		<div id="ItemTag" onclick="selectItemTag(\'' + tag.name + '\')">' + tag.info + '</div>\
	');
}

function drawItem(item) {
	$('#items').append('\
		<!--add item---> \
		<div id="GridBox" class="GridBox ItemGridBox"> \
		<div id="ctlMinus" class="ctlPlMi" onclick="calAmount(\'' + item.id + '\',\'-\')">-</div> \
		<div id="varAmount-' + item.id + '" class="varAmountbox"  onclick="actGiveItem(' + item.id + ')">' + item.amount + '</div> \
		<div id="ctlPlus" class="ctlPlMi" onclick="calAmount(\'' + item.id + '\',\'+\')">+</div> \
		<div name="IconLayer-' + item.id + '" onclick="actGiveItem(\'' + item.id + '\')" > \
		<div style="padding: 25% 29% 4% 29%;"> \
		<img src="/icons/' + item.id + '.png" id=="ItemImg-' + item.id + '" class="STicon" border="0"></div> \
		<div name="Namelabel-' + item.id + '"  id="Namelabel-' + item.id + '" class="Namelabel">' + item.info + '</div></div>'
	);
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

function calAmount(id, action) {
	var calNum = parseInt(parseFloat($('#varAmount-' + id).text()));
	switch (action) {
	case '+':
		if (calNum < MaxLimitItems)
			calNum *= 2;
		break;
	case '-':
		if (calNum > 1)
			calNum /= 2;
		break;
	default:
		break;
	}
	console.log("DEBUG id: " + id + " action: " + action + " calNum: " + calNum);
	$('#varAmount-' + id).text(Math.floor(calNum));
}


function updateItemList() {

}
