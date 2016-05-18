var fs = require('fs');

var result = {
	'./' : {
		item_list : {
			
		},
		is_file : 0,
		name : './',
		path : './',
	},
};

var searchInFile = function(file, re) {
	
}

var readDir = function(base, parent) {
	
	items = fs.readdirSync(base);
	items.forEach(function(item){
		
		parent.item_list[item] = {};
		var state = fs.statSync(base + '/' + item);
		
		parent.item_list[item].name = item;
		parent.item_list[item].path = base + '/' +item;
		
		if(state.isDirectory()) {
			parent.item_list[item].is_file = 0;
			parent.item_list[item].item_list = {};
			readDir(base + '/' + item, parent.item_list[item]);
		} else {
			parent.item_list[item].is_file = 1;
		}
		
	});
	
};

readDir('./', result['./']);

console.log((result));
