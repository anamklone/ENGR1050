var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Initialize the app
var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// REST API DEFINED BELOW

// Generic error handler used by all endpoints
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*
 * "/api/client-instance"
 *   GET: find all charging sessions
 */
app.get("/api/client-instance", function(req, res) {
    console.log("return new client instance url");
    res.status(200).json({"data": "This is a test"});
});

/*
 * "/api/charging-session"
 *   GET: find all charging sessions
 *   POST: create a new charging session
 */
app.get("/api/charging-session", function(req, res) {
    console.log("find all charging sessions");
    res.status(200).json();
});

app.post("/api/charging-session", function(req, res) {
    console.log("create new charging session");
    res.status(200).json();
});

/*
 * "/api/charging-session/:id"
 *   GET: find charging session by id
 *   PUT: update charging session by id
 *   DELETE: delete charging session by id
 */
app.get("/api/charging-session/:id", function(req, res) {
    console.log("find charging session by id");
    res.status(200).json();
});

app.put("/api/charging-session/:id", function(req, res) {
    console.log("update charging session by id");
    res.status(200).json();
});

app.delete("/api/charging-session/:id", function(req, res) {
    console.log("delete charging session by id");
    res.status(200).json();
});
