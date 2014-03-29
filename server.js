var connect = require('connect')
    , http = require('http')
    , port = 3000
    , app = connect().use(connect.static(__dirname + '/app'));


// Start the app
console.log('App started on port ' + port);
var server = http.createServer(app).listen(port);

// Configure socket.io for WebSockets
var io = require('socket.io')
            .listen(server)
            .set('log level', 1);
