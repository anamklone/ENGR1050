// ----------------------------------------------------------
// Firmware for Particle Electron connected to EV charger
// ----------------------------------------------------------

void setup() {
    Serial.begin(9600);   // open serial over USB

    // Declare a Particle.function to trigger new client instance request
    Particle.function("new-instance", newInstance);

    // Subscribe to new client instance response event
    Particle.subscribe(System.deviceID() + "/hook-response/new_instance/", newInstanceHandler, MY_DEVICES);
}

int newInstance(String data) {
    // Trigger the new charging session
    Particle.publish("new_instance", data, PRIVATE);
    return 1;
}

void newInstanceHandler(const char *event, const char *data) {
    // Handle the response
    Serial.println(data);
}
