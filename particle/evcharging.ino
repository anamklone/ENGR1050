// ----------------------------------------------------------
// Firmware for Particle Electron connected to EV charger
// ----------------------------------------------------------

void setup() {
    // Declare a Particle.function to trigger new charging session request
    Particle.function("new-session", newSession);

    // Subscribe to new charging session response event
    Particle.subscribe(System.deviceID() + "/hook-response/new_session/", newSessionHandler, MY_DEVICES);
}

int newSession(String data) {
    // Trigger the new charging session
    Particle.publish("new_session", data, PRIVATE);
    return 1;
}

void newSessionHandler(const char *event, const char *data) {
    // Handle the response
}
