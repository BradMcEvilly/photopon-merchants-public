hound = require('hound')


var build = function() {
	var exec = require('child_process').exec;
	var cmd = 'grunt buildnu';

	exec(cmd, function(error, stdout, stderr) {
	  console.log(stdout);
	  console.log(stderr);
	});
}

var watchThis = function(dir) {
	var watcher = hound.watch(dir)

	watcher.on('create', function(file, stats) {
	  console.log(file + ' was created')
	  build();
	})
	watcher.on('change', function(file, stats) {
	  console.log(file + ' was changed')
	  build();
	})
	watcher.on('delete', function(file) {
	  console.log(file + ' was deleted')
	  build();
	})

}
// Create a directory tree watcher.
watchThis('./src/js/')
watchThis('./src/tpl/')

