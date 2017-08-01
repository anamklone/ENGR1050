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
    if (!req.get("Authorization") || !authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to get charging sessions", 400);
    } else {
        client.query("SELECT * FROM chargingsessions", (err, results) => {
            if (err) {
                handleError(res, err.message, "failed to get charging sessions");
            }
            if (results.rows.length === 0) {
                handleError(res, "no charging sessions found", "failed to get charging sessions", 404);
            } else {
                res.status(200).json(results.rows);
            }
        });
    }
});

app.post("/api/charging-session", function(req, res) {
    console.log("create new charging session");

    if (!req.get("Authorization") || !authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to create new charging session", 400);
    } else {
        var data = JSON.parse(req.body.data);

        // Check that all required fields have values
        if ("undefined" === typeof data.pinId) {
            handleError(res, "invalid input", "must provide pinId", 400);
        } else if ("undefined" === typeof data.maxChargeRate) {
            handleError(res, "invalid input", "must provide maxChargeRate", 400);
        } else {

            var columns = "(id, active, pinId, maxChargeRate)";
            var values = "('" + generateUniqueId() + "', false, " + data.pinId + ", " + data.maxChargeRate + ")";

            client.query("INSERT INTO chargingsessions " + columns + " VALUES " + values + " RETURNING *", (err, results) => {
                if (err) {
                    handleError(res, err.message, "failed to create new charging session");
                }

                console.log(results);

                if (results.rows.length === 0) {
                    handleError(res, "charging session not created", "failed to create new charging session", 404);
                } else {
                    res.status(200).json(results.rows[0].pinId + ": https://ev-charging.herokuapp.com/" + results.rows[0].id);
                }
            });
        }
    }
});

/*
 * "/api/charging-session/:id"
 *   GET: find charging session by id
 *   POST: update charging session by id
 *   DELETE: delete charging session by id
 */
app.get("/api/charging-session/:id", function(req, res) {
    console.log("find charging session by id (id = " + req.params.id + ")");
    if (!req.get("Authorization") || !authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to get charging session (id = " + req.params.id + ")", 400);
    } else {
        client.query("SELECT * FROM chargingsessions WHERE id = '" + req.params.id + "'", (err, results) => {
            if (err) {
                handleError(res, err.message, "failed to get charging session (id = " + req.params.id + ")");
            }
            if (results.rows.length === 0) {
                handleError(res, "charging session not found", "failed to get charging session (id = " + req.params.id + ")", 404);
            } else {
                res.status(200).json(results.rows);
            }
        });
    }
});

app.post("/api/charging-session/:id", function(req, res) {
    console.log("update charging session by id (id = " + req.params.id + ")");

    /*
    if (!req.get("Authorization") || !authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to update charging session (id = " + req.params.id + ")", 400);
    } else {*/
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

        var dataToUpdate = "active = true, estimatedTime.hours = '" + req.body.estimatedTime.hours + "', estimatedTime.minutes = '" + req.body.estimatedTime.minutes + "'";

        console.log("dataToUpdate = " + dataToUpdate);

        client.query("UPDATE chargingsessions SET " + dataToUpdate + " WHERE id = '" + req.params.id + "' RETURNING *", (err, results) => {
            if (err) {
                handleError(res, err.message, "failed to update charging session (id = " + req.params.id + ")");
            }

            console.log("results = " + results);

            if (results.rows.length === 0) {
                handleError(res, "charging session not found", "failed to update charging session (id = " + req.params.id + ")", 404);
            } else {
                res.status(200).json(results.rows);
                sendUpdateToChargers();
            }
        });
    //}
});

app.delete("/api/charging-session/:id", function(req, res) {
    console.log("delete charging session by id");
    if (!req.get("Authorization") || !authenticate(req.get("Authorization").toString().slice(6))) {
        handleError(res, "authentication failed", "failed to delete charging session (id = " + req.params.id + ")", 400);
    } else {
        client.query("DELETE FROM chargingsessions WHERE id = '" + req.params.id + "' RETURNING *", (err, results) => {
            if (err) {
                handleError(res, err.message, "failed to delete charging session (id = " + req.params.id + ")");
            }
            if (results.rows.length === 0) {
                handleError(res, "charging session not found", "failed to delete charging session (id = " + req.params.id + ")", 404);
            } else {
                res.status(200).json(results.rows);
            }
        });
    }
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var binary_charge_values = [
    [0, 3.3, 4.56, 5.82, 6.6, 7, 7.2, 8.34, 9.6],
    [0, 50, 70, 90, 110, 130, 150, 170, 220]
];

// Find infrastructure max
var max_infra_cap = 50;

// Max charger capacity - 40 amps (most common)
var max_charger_cap_amps = 40;

// Max kW capacity of each charger
var charger_kW = (max_charger_cap_amps * 240) / 1000;

var max_num_cars = 8;

var request = require("request");

function calculateOutputs() {

}

function sendUpdateToChargers() {
    console.log("sending update to ev chargers");

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
