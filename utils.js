/*
 Helper functions
 */

exports.raise_error = function (err, message) {
	var error = new Error(message);
	error.code = err; 

	return error; 
}

exports.no_such_dockerfile_DIR = function (path) {
	var error = { error: "no_such_dockerfile_directory",
				  message: `The specified directory <${path}> does not exist`};
	return error;
}

exports.invalid_resource = function (resource) {
	var error = { error: "invalid_resource",
				  message: `The specified resource <${resource}> does not exist`};
	return error;
}

// 
exports.send_success = function (res, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };

    res.end(JSON.stringify(output, null, 4) + "\n");
}

exports.send_failure = function (res, server_code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(server_code, { "Content-Type" : "application/json" });

    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}
