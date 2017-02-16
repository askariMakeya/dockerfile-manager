// load <http> and <fs> modules 
var http = require('http');
var fs = require('fs');

// load <utils.js> module which contains helper functions 
var util = require('./utils');

var d_dirs = require('./dockerfile_DIRs');
var d_dir = require('./dockerfile_DIR');

// main 
function process_incoming_requests(req, res) {
    /*
    The following requests are allowed
    /dockerfile_dirs => returns a list of all dockerfile directories
                        available

    /dockerfile_dirs/dockerfile_dir_name.dir => returns a list of the
    dockerfiles in the *dir_name* directory 

    */ 

    var msg = "INCOMING REQUEST: " + req.method + " " + req.url;
    console.log(msg);

    // process requests depending on the url requests received
    if (req.url == '/dockerfile_dirs') {
		// a list of the available Dockerfile directories has been requested
		handle_dockerfile_dirs(req, res); 

    } else if (req.url.substr(0, 16) == '/dockerfile_dirs'
            && req.url.substr(req.url.length - 4) == '.dir') {
		// a list of dockerfiles within a given directory has been requested
		handle_get_dockerfile_dir(req, res);
    } else {
        util.send_failure(res, 404, util.invalid_resource());
    }
}

function handle_dockerfile_dirs (req, res) {
    d_dirs.load_Dockerfile_DIRs( (err, dirs) => { 
        // error check 
    	if (err) {
            util.send_failure(res, 500, err);
            return;
        }

        // if we got here, we successfully got the dockerfile directories 
        util.send_success(res, { "Docker Directories": dirs });
    });
}

function handle_get_dockerfile_dir(req, res) {
    // the request format is as follows
    //  ... /dockerfile_dirs/dockerfile_dir_name.dir 
    var dir_name = req.url.substr(16, req.url.length - 20);

    var docker_DIR = d_dir.load_dockerfile_DIR(dir_name); 

    // obtain all the corresponding dockerfiles for the created Dockerfile
    // directory obj

    docker_DIR.dockerfiles( (err, dockerfiles) => {
        if (err && err.error == "no_such_directory") {
            // server has not found anything matching the URI given
            util.send_failure(res, 404, err);
        }  else if (err) {
            // server encountered an unexpected condition which prevented 
            // it from fulfilling the request
            util.send_failure(res, 500, err);
        } else {
            var json = {}; 
            json[docker_DIR.name] = dockerfiles;
            util.send_success(res, json);
        }
    });
}

var server = http.createServer(process_incoming_requests);
server.listen(8080);
