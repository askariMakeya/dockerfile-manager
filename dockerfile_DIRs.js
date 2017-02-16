// load <fs> modules 
var fs = require('fs');

// load <utils.js> module which contains helper functions 
var util = require('./utils');

var d_dir = require('./dockerfile_DIR');

/*
###############################################################################

Function name:  load_Dockerfile_DIRs
Arguments:     	<none>
				( assumption is that Dockerfile_DIRs already exists. Each of
				  the subsequent directories in Dockerfile_DIRs is a directory
				  containing Dockerfiles. These directories are named after a 
				  couple of the official repositories in the docker hub. They
				  contain corresponding Dockerfiles particular to the
				  aforementioned repo. The overall subfolder / directory
				  hierarchy is as follows:

					+ dockerfile_dir
						+ nginx
							+ Dockerfile.nginx
						+ redis
							+ Dockerfile.redis
						+ busybox
							+ Dockerfile.busybox
  						+ ubuntu
			  				+ Dockerfile.ubuntu
					  ...
				   
Return:         an array of <Dockerfile Directory> objects contained within
                the Dockerfile_DIRs directory

###############################################################################
*/
exports.load_Dockerfile_DIRs = function(callback) { 
    fs.readdir("DOCKERFILE_DIRs", (err, dir) => {
	// process any errors from fs.readdir and immediately exit
	if (err) {
		callback(util.raise_error("dir_error", JSON.stringify(err)));
		return;
	}
    
	// validate <dir> contents to ensure that they are of type <directory>
	var dir_list = []

	// use recursion to avoid running into any asynchronous loops
    var iterator = (index) => {
        if (index < dir.length) {
            var path_check = "DOCKERFILE_DIRs/" + dir[index];
            fs.stat(path_check, (err, stats) => {
                // error checks
                if (err) {
                    callback(util.raise_error("dir_error",
                                              JSON.stringify(err)));
                    return;
                }

                // directory type checks
                if (stats.isDirectory) {
                    dir_list.push(d_dir.load_dockerfile_DIR(dir[index]));
                }

                // increment index to move to the next item upon getting a
                // value from fs.stat
                iterator(index + 1);
            });
	    } else {
                // there are no more items to check in <dir> as the following
                // condition(s) hold true : index >= dir.length. fs.stat's
                // anonymous function calls are done and we can invoke callback
                // with the results
                callback(null, dir_list)
                return;
            }
        }
        iterator(0);
    });
}
