

var fs = require('fs');
var path = require('path');
var argv = require('optimist').argv;


if(argv.help) {
	console.log('\t--search="строка"\tИскомая строка (обяз.)'); // argv.search
	console.log('\t--dir="строка"\t\tДиректория поиска (по умолчанию ./)'); // argv.dir
	console.log('\t--set="строка"\t\tЗаменять на (по умолчанию не заменяет)'); // argv.set
	console.log('\t--help\t\t\tВывод этой справки'); // argv.help
	process.exit(0);
}


var		f_searched_txt = './searched.txt',
		f_tree_json = './tree.json',
		f_walk_result_json = './walk_result.json',
		charset = 'utf8',
		root = argv.dir ? argv.dir : './',
		re_search = new RegExp('(' + argv.search + ')', 'ig')
;


fs.writeFileSync(f_searched_txt, 'Найдено "' + argv.search + '" в следующих файлах:\n', charset);


var clearHTML = function(str) {
	return str.replace(/<\/?[^>]+>/g,'');
}


var addToSearched = function(str) {
	
	fs.appendFile(f_searched_txt, str + '\n', charset, function(err){
		if(err) {
			console.log(err);
		} else {
			console.log(str);
		}
	});
	
}


var searchInFile = function(file, re, set) {
	
	fs.readFile(file, charset, function(err, text) {
		
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


var walk = function(dir, done) {
	
	var results = [];
	
	fs.readdir(dir, function(err, list) {
		
		if (err) return done(err);
		
		var pending = list.length;
		
		if (!pending) return done(null, results);
		
		list.forEach(function(file) {
			
			file = path.normalize(path.resolve(dir, file));
			
			fs.stat(file, function(err, stat) {
				
				if (stat && stat.isDirectory()) {
					
					walk(file, function(err, res) {
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
					
				} else if(stat && stat.isFile()) {
					
					//results.push(file);
					
					searchInFile(file, re_search, argv.set);
					
					if (!--pending) done(null, results);
					
				}
				
			});
			
		});
		
	});
	
};


walk(root, function(err, res){
	if(err) {
		console.log(err);
	} else {
		fs.writeFile(f_walk_result_json, JSON.stringify({}), function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log('Результаты поиска сохранены');
			}
		});
	}
});
