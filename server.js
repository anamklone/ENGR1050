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
 * TEST PAGE
 */
app.get("/", function(req, res) {
    console.log("testing...");
});

/*
 * "/api/charging-session"
 *   GET: find all charging sessions
 *   POST: create a new charging session
 */
app.get("/api/charging-session", function(req, res) {
    console.log("find all charging sessions")
});

app.post("/api/charging-session", function(req, res) {
    console.log("create new charging session");
})

/*
 * "/api/charging-session/:id"
 *   GET: find charging session by id
 *   PUT: update charging session by id
 *   DELETE: delete charging session by id
 */
app.get("/api/charging-session/:id", function(req, res) {
    console.log("find charging session by id");
});

app.put("/api/charging-session/:id", function(req, res) {
    console.log("update charging session by id");
});

app.delete("/api/charging-session/:id", function(req, res) {
    console.log("delete charging session by id");
});
