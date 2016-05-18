var fs = require('fs');
var path = require('path');

var argv = require('optimist').argv;
//console.log(argv.search);		// --search
//console.log(argv.set);		// --set
//console.log(argv.c);			// -c


var re_search = new RegExp('(' + argv.search + ')', 'ig');

var tree = {
	'./' : {
		item_list : {
			
		},
		is_file : 0,
		name : './',
		path : './',
	},
};

var searched = {
	
};


fs.writeFileSync('./searched.txt', '', 'utf8');




var addToSearched = function(str) {
	fs.appendFile('./searched.txt', str + '\n', 'utf8', function(err){
		if(err) {
			console.log(err);
		} else {
			console.log('Результат добавлен');
		}
	});
}

var searchInFile = function(file, re, set) {
	fs.readFile(file, 'utf8', function(err, text) {
		if(err) {
			console.log(err);
		} else if(re.test(text)) {
			addToSearched(path.resolve(file));
			if(set && set != '') {
				
				var _result = text.replace(re, set);
				
				if(_result != '') {
					fs.writeFile(file, _result, function(err) {
						if(err) {
							console.log(err);
						} else {
							console.log('Значение ' + argv.search + ' в файле ' + file + ' обновлено');
						}
					});
				}
				
			}
		}
	});
};

var readDir = function(base, parent) {
	
	items = fs.readdirSync(base);
	items.forEach(function(item){
		
		parent.item_list[item] = {};
		var state = fs.statSync(base + '/' + item);
		
		parent.item_list[item].name = item;
		parent.item_list[item].path = base + '/' +item;
		
		if(state.isFile()) {
			parent.item_list[item].is_file = 1;
			
			searchInFile(path.normalize(base + '/' + item), re_search, argv.set);
			
		} else {
			parent.item_list[item].is_file = 0;
			parent.item_list[item].item_list = {};
			readDir(path.normalize(base + '/' + item), parent.item_list[item]);
		}
		
		/*
		if(state.isDirectory()) {
			parent.item_list[item].is_file = 0;
			parent.item_list[item].item_list = {};
			readDir(base + '/' + item, parent.item_list[item]);
		} else {
			parent.item_list[item].is_file = 1;
		}
		*/
		
	});
	
};

readDir('./', tree['./']);

fs.writeFile("./tree.json", JSON.stringify(tree), function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('Дерево сохранено');
	}
});



//var searched = searchInFile(tree, argv.search);
/*
fs.writeFile("./searched.json", JSON.stringify(searched), function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('Результаты поиска ' + argv.search + ' сохранены в архив');
	}
});
*/

//console.log(tree);
