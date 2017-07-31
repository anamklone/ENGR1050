const username = "particle-electron";
const password = "engr1050";

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
    // Get to see if id exists in database
    console.log("opening page for charging session (id = " + req.params.id + ")");
    res.sendFile("./src/index.html");
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
    if (!authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to get charging sessions", 400);
    }
    client.query("SELECT * FROM chargingsessions", (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to get charging sessions");
        }
        if (results.rows.length === 0) {
            handleError(res, "no charging sessions found", "failed to get charging sessions", 404);
        }
        res.status(200).json(results.rows);
    });
});

app.post("/api/charging-session", function(req, res) {
    console.log("create new charging session");

    if (!authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to create new charging session", 400);
    }

    console.log(req.body);

    // Check that all required fields have values
    if (!req.body.data) {
        handleError(res, "invalid input", "must provide max charge rates", 400);
    }

    var maxChargeRates = req.body.data.split(",");
    var response = [];
    for (i = 0; i < data.length(); i++) {
        console.log(maxChargeRates[i]);

        if (maxChargeRates[i] != 0) {
            client.query("SELECT * FROM chargingsession WHERE pinId = '" + i + "' AND active = true", (err, results) => {
                if (err) {
                    handleError(res, err.message, "failed to get charging session");
                }
                if (results.rows.length === 0) {
                    var columns = "(id, active, pinId, maxChargeRate)";
                    var values = "('" + generateUniqueId() + "', true, " + i + ", " + maxChargeRates[i] + ")";

                    client.query("INSERT INTO chargingsessions " + columns + " VALUES " + values + " RETURNING *", (err, results) => {
                        if (err) {
                            handleError(res, err.message, "failed to create new charging session");
                        }
                        if (results.rows.length === 0) {
                            handleError(res, "charging session not created", "failed to create new charging session", 404);
                        }
                        //response[i] = "https://ev-charging.herokuapp.com/" + results.rows[0].id;
                        response.push("https://ev-charging.herokuapp.com/" + results.rows[0].id);
                    });
                }
            });
        }
    }
    //res.status(200).json({1: response[0], 2: response[1], 3: response[2], 4: response[3], 5: response[4], 6: response[5], 7: response[6], 8: response[7]});
    res.status(200).json(response);
});

/*
 * "/api/charging-session/:id"
 *   GET: find charging session by id
 *   POST: update charging session by id
 *   DELETE: delete charging session by id
 */
app.get("/api/charging-session/:id", function(req, res) {
    console.log("find charging session by id (id = " + req.params.id + ")");
    if (!authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to get charging session (id = " + req.params.id + ")", 400);
    }
    client.query("SELECT * FROM chargingsessions WHERE id = '" + req.params.id + "'", (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to get charging session (id = " + req.params.id + ")");
        }
        if (results.rows.length === 0) {
            handleError(res, "charging session not found", "failed to get charging session (id = " + req.params.id + ")", 404);
        }
        res.status(200).json(results.rows);
    });
});

app.post("/api/charging-session/:id", function(req, res) {
    console.log("update charging session by id (id = " + req.params.id + ")");

    /*
    if (!authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to update charging session (id = " + req.params.id + ")", 400);
    }
    */

    // Check that all required fields have values
    //if (!req.body.???) {
    //    handleError(res, "invalid input", "must provide ???", 400);
    //}

    /*
    var dataToUpdate = "";
    for (var key in req.body) {
        console.log(key + " = " + req.body[key]);
        if (req.body.hasOwnProperty(key)) {
            dataToUpdate += key + " = '" + req.body[key] + "', ";
        }
    }
    dataToUpdate = dataToUpdate.substring(0, dataToUpdate.length - 2);
    */

    var dataToUpdate = "estimatedTime.hours = '" + req.body.estimatedTime.hours + "', estimatedTime.minutes = '" + req.body.estimatedTime.minutes + "'";

    console.log("dataToUpdate = " + dataToUpdate);

    client.query("UPDATE chargingsessions SET " + dataToUpdate + " WHERE id = '" + req.params.id + "' RETURNING *", (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to update charging session (id = " + req.params.id + ")");
        }

        console.log("results = " + results);

        if (results.rows.length === 0) {
            handleError(res, "charging session not found", "failed to update charging session (id = " + req.params.id + ")", 404);
        }
        res.status(200).json(results.rows);
    });
    sendUpdateToChargers();
});

app.delete("/api/charging-session/:id", function(req, res) {
    console.log("delete charging session by id");
    if (!authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to delete charging session (id = " + req.params.id + ")", 400);
    }
    client.query("DELETE FROM chargingsessions WHERE id = '" + req.params.id + "' RETURNING *", (err, results) => {
        if (err) {
            handleError(res, err.message, "failed to delete charging session (id = " + req.params.id + ")");
        }
        if (results.rows.length === 0) {
            handleError(res, "charging session not found", "failed to delete charging session (id = " + req.params.id + ")", 404);
        }
        res.status(200).json(results.rows);
    });
});

function authenticate(key) {
    if (Buffer.from(username + ":" + password).toString("base64") === key) {
        return true;
    }
    return false;
}

// Implementation derived from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUniqueId() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function sendUpdateToChargers() {
    console.log("sending update to ev chargers");








    var request = require("request");

    // Set the headers
    var headers = {
        "Authorization": "Bearer 5bd46a6f30e814a8faf8df960b5d6154be7e4859",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    // Configure the request
    var options = {
        url: "https://requestb.in/q01bmgq0", // "https://api.particle.io/v1/devices/230055001951353338363036/ev-update"
        method: "POST",
        headers: headers,
        form: {"data": "0,0,0,0,0,0,0,0"}
    }

    // Start the request
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });
}
