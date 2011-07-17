
function initDashboard() {
	//Configure Items Grid
	$("#sortable").sortable({
		revert: true,
		snap: true,
		grid: [ 100, 100 ],
		opacity: 0.6,
		dropOnEmpty: false,
		receive: function(e, ui) {
			console.log('dropped');
		}
	});
}

//TODO sortable data need to be computed... i/o is in jason
function getItems() {
	$.getJSON('/items.json', function(data) {
		$('body').append('<div style="float:left;">total items: ' + data.length + '</div>');
		$.each(data, function(i, item) {
			drawItem(item.id, item.name, item.amount)
		});
		drawItem("1", "paypal", "1")
	});
}

function drawItem(id, name, amount) {
	$('#sortable').append('\
		<!--add item---> \
		<div id="GridBox" class="GridBox ItemGridBox"> \
		<div id="ctlMinus" class="ctlPlMi" onclick="calAmount(\'' + id + '\',\'-\')">-</div> \
		<div id="varAmount-' + id + '" class="varAmountbox"  onclick="actGiveItem(' + id + ')">' + amount + '</div> \
		<div id="ctlPlus" class="ctlPlMi" onclick="calAmount(\'' + id + '\',\'+\')">+</div> \
		<div name="IconLayer-' + id + '" onclick="actGiveItem(\'' + id + '\')" > \
		<div style="padding: 25% 29% 4% 29%;"> \
		<img src="/icons/' + id + '.png" id=="ItemImg-' + id + '" class="STicon" border="0"></div> \
		<div name="Namelabel-' + id + '"  id="Namelabel-' + id + '" class="Namelabel">' + name + '</div></div>'
	);
}

function actGiveItem(id) {
	var amount = parseInt(parseFloat($('#varAmount-' + id).text()));
	console.log("DEBUG id is: " + id + " amount is: " + amount);
	notify("fade", "DEBUG id is: " + id + " amount is: " + amount);
	//call give?origin=player&name=cobblestone&count=100
	$.ajax({
		url: config.cmdhost + '/give?origin=player&name=cobblestone&count=100',
		context: document.body,
		success: function() {
			//$(this).addClass("done");
			console.log("actGiveItem ajax request called back")
		}
	});
	console.log(" call done ?");
}

function calAmount(id, action) {
	var calNum = parseInt(parseFloat($('#varAmount-' + id).text()));
	switch (action) {
		case '+':
			if (calNum == MaxLimitItems) {
				calNum = MaxLimitItems;
			} else if (calNum == 1) {
				calNum = calNum * 2
			} else if (calNum == MaxLimitItems || calNum > MaxLimitItems) {
				calNum = MaxLimitItems;
			} else if (calNum == 0) {
				calNum = 1;
			} else {
				calNum = calNum * 2;
			}
			break;
		case '-':
			if (calNum == MaxLimitItems || calNum
					< MaxLimitItems && calNum > 1) {
				calNum = calNum / 2
			} else if (calNum == 0) {
				calNum = 1;
			} else if (calNum > MaxLimitItems) {
				calNum = MaxLimitItems;
			} else {
				calNum = calNum / 2;
			}
			break;
		default:
			alert("Something went wrong in calAmount")
	}
	console.log("DEBUG id: " + id + " action: " + action + " calNum: " + calNum);
	$('#varAmount-' + id).text(Math.floor(calNum));
}


function updateItemList() {

}
