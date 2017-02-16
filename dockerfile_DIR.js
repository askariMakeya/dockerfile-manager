var fs = require('fs');
var path = require('path');

// load utility module containing helper functions
var util = require('./utils');

function Dockerfile_DIR (dockerfile_DIR_path) {
    // object attributes
    this.path = dockerfile_DIR_path;
    this.name = path.basename(dockerfile_DIR_path); 
    this._dockerfiles = [];
}
// set properties on all instances of this class 
Dockerfile_DIR.prototype.name = null;
Dockerfile_DIR.prototype.path = null;
Dockerfile_DIR.prototype._dockerfiles = [];

// object methods 
Dockerfile_DIR.prototype.dockerfiles = function (callback) {
    // this method returns dockerfiles contained in the corresponding
    // dockerfile_DIR directory
    if (this._dockerfiles.length != 0) {
        callback(null, this._dockerfiles);
	    return;
    }

    // obtain dockerfiles given the <dockerfile_DIR_path> specified
    fs.readdir("DOCKERFILE_DIRs" + this.path, (err, dockerfile) => {
        // error checks
        if (err) {
            // it could be that the specified path is not a valid directory
            // entry. As such, check for "ENOENT" error code
            if (err.code == "ENOENT") {
                callback(util.no_such_dockerfile_DIR(this.path));
            } else { 
                // error seen while processing directory path
                callback(util.raise_error("dir_error", JSON.stringify(err)));
            }
            return;
        }
		
        // validate <dockerfile> to ensure it is of type <file>
        var dockerfile_list = [];
		
        var iterator = (index) => { 
            if (index < dockerfile.length) { 
                var path_check = "DOCKERFILE_DIRs" + this.path 
                    + "/" + dockerfile[index]; 
                fs.stat(path_check, (err, stats) => { 
                    // error checks 
                    if (err) { 
                        callback(util.raise_error("dockerfile_error",
                                                  JSON.stringify(err)));
                        return;
                    }
					
                    if (stats.isFile()) {
                        dockerfile_list.push(dockerfile[index]);
                    }
					
                    iterator(index + 1);
                });
            } else {
                callback(null, dockerfile_list);
            }
        }
        iterator(0);
    });
}

// return a dockerfile_DIR object 
exports.load_dockerfile_DIR = function (path) {
    var obj = new Dockerfile_DIR(path);

    return obj;
}
