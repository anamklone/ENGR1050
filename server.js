var express = require("express");
var bodyParser = require("body-parser");
var pg = require("pg");

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

pg.defaults.ssl = true;

// Connect to the database before starting the application server
var client = new pg.Client(process.env.DATABASE_URL);
client.connect(function(err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    console.log("database connection ready");

    // Initialize the app
    var server = app.listen(process.env.PORT || 8080, function() {
        var port = server.address().port;
        console.log("app now running on port " + port);
    });
});

app.get("/:id", function(req, res) {
    console.log("opening page for charging session (id = " + req.params.id + ")");
    res.sendfile("./src/index.html");
});

// REST API DEFINED BELOW

// Generic error handler used by all endpoints
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*
 * "/api/charging-session"
 *   GET: find all charging sessions
 *   POST: create a new charging session
 */
app.get("/api/charging-session", function(req, res) {
    console.log("find all charging sessions");
    client.query("SELECT * FROM chargingsessions", (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to get charging sessions");
        }
        if (results.rows.length === 0) {
            handleError(res, err.message, "failed to get charging sessions", 404);
        }
        res.status(200).json(results.rows);
    });
});

app.post("/api/charging-session", function(req, res) {
    console.log("create new charging session");

    // Check that all required fields have values
    //if (!req.body.???) {
    //    handleError(res, "invalid input", "must provide ???", 400);
    //}

    var columns = "(id";
    var values = "('" + generateUniqueId() + "'";
    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            columns += ", " + key;
            values += ", '" + req.body[key] + "'";
        }
    }
    columns += ")";
    values += ")";

    client.query("INSERT INTO chargingsessions " + columns + " VALUES " + values, (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to create new charging session");
        }
        //if (results.rows.length === 0) {
        //    handleError(res, err.message, "failed to create new charging session", 404);
        //}
        res.status(200).json(results);
        //res.status(200).json({"url": "https://ev-charging.herokuapp.com/qvn10hvg"});
    });
});

/*
 * "/api/charging-session/:id"
 *   GET: find charging session by id
 *   PUT: update charging session by id
 *   DELETE: delete charging session by id
 */
app.get("/api/charging-session/:id", function(req, res) {
    console.log("find charging session by id (id = " + req.params.id + ")");
    client.query("SELECT * FROM chargingsessions WHERE id = '" + req.params.id + "'", (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to get charging session (id = " + req.params.id + ")");
        }
        if (results.rows.length === 0) {
            handleError(res, err.message, "failed to get charging session (id = " + req.params.id + ")", 404);
        }
        res.status(200).json(results.rows);
    });
});

app.put("/api/charging-session/:id", function(req, res) {
    console.log("update charging session by id");
    client.query("SELECT * FROM chargingsessions WHERE id = '" + req.params.id + "'", (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to update charging session (id = " + req.params.id + ")");
        }
        if (results.rows.length === 0) {
            handleError(res, err.message, "failed to update charging session (id = " + req.params.id + ")", 404);
        }
        res.status(200).json(results.rows);
    });
});

app.delete("/api/charging-session/:id", function(req, res) {
    console.log("delete charging session by id");
    client.query("SELECT * FROM chargingsessions WHERE id = '" + req.params.id + "'", (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to delete charging session (id = " + req.params.id + ")");
        }
        if (results.rows.length === 0) {
            handleError(res, err.message, "failed to delete charging session (id = " + req.params.id + ")", 404);
        }
        res.status(200).json(results.rows);
    });
});

// Implementation derived from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
generateUniqueId() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
