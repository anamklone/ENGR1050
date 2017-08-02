// ----------------------------------------------------------
// Firmware for Particle Electron connected to EV charger
// ----------------------------------------------------------

int button = D6;
char PIN[8] = {B3, B2, B1, B0, D3, D2, D1, D0};
int carRead[8];
double previousCharge[8] = {0, 0, 0, 0, 0, 0, 0, 0};
double channelMaxCharge[8];
int channelSupplyCharge[8];

int i = 0;

void setup() {
    Serial.begin(9600);   // open serial over USB
    
    // Declare a Particle.function to trigger new client instance request
    Particle.function("new-session", newSession);
    
    // Subscribe to new client instance response event
    Particle.subscribe(System.deviceID() + "/hook-response/new_session/", newSessionHandler, MY_DEVICES);
    
    // Declare a Particle.function to trigger update for all chargers
    Particle.function("ev-update", evUpdate);
    
    pinMode(D7, OUTPUT);    // On board LED for debugging
    
    pinMode(B3, OUTPUT);    // Car 1 output
    pinMode(B2, OUTPUT);    // Car 2 output
    pinMode(B1, OUTPUT);    // Car 3 output
    pinMode(B0, OUTPUT);    // Car 4 output
    pinMode(D3, OUTPUT);    // Car 5 output
    pinMode(D2, OUTPUT);    // Car 6 output
    pinMode(D1, OUTPUT);    // Car 7 output
    pinMode(D0, OUTPUT);    // Car 8 output
    
    pinMode(D6, INPUT);     // Button input
    
    pinMode(A5, INPUT);     // Car 1 input
    pinMode(A4, INPUT);     // Car 2 input
    pinMode(A3, INPUT);     // Car 3 input
    pinMode(A2, INPUT);     // Car 4 input
    pinMode(A1, INPUT);     // Car 5 input
    pinMode(A0, INPUT);     // Car 6 input
    pinMode(B5, INPUT);     // Car 7 input
    pinMode(B4, INPUT);     // Car 8 input
}

void loop() {
    // Read all 8 channels and save values in carRead[]
    carRead[0] = analogRead(A5);
    carRead[1] = analogRead(A4);
    carRead[2] = analogRead(A3);
    carRead[3] = analogRead(A2);
    carRead[4] = analogRead(A1);
    carRead[5] = analogRead(A0);
    carRead[6] = analogRead(B5);
    carRead[7] = analogRead(B4);
    
    // Assign values to channelMaxCharge[] based on carRead[]
    for (i = 0; i < 8; i++) {
        if (carRead[i] > 275 && carRead[i] < 475) {
            channelMaxCharge[i] = 10;
        } else if (carRead[i] > 642 && carRead[i] < 842) {
            channelMaxCharge[i] = 7;
        } else if (carRead[i] > 850 && carRead[i] < 1050) {
            channelMaxCharge[i] = 7.7;
        } else if (carRead[i] > 1280 && carRead[i] < 1480) {
            channelMaxCharge[i] = 7.2;
        } else if (carRead[i] > 1770 && carRead[i] < 1970) {
            channelMaxCharge[i] = 3.6;
        } else if (carRead[i] > 2630 && carRead[i] < 2830) {
            channelMaxCharge[i] = 3.3;
        } else if (carRead[i] > 3155 && carRead[i] < 3355) {
            channelMaxCharge[i] = 6.6;
        } else {
            channelMaxCharge[i] = 0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        if (channelMaxCharge[i] == 0) {
            analogWrite(PIN[i], 0);
        }
    }
    
    // Print out the measured rates for debugging purposes
    /*
    for (i = 0; i < 8; i++) {
        Serial.println(channelMaxCharge[i]);
    }
    */
    
    // At this point, the max rate of charge for each car has been measured
    // 0 means that there isn't a car connected
    // If the button is not pressed, it will loop
    
    if (digitalRead(D6) == LOW) {    // if the button is pressed
        // Send request to create a new charging session
        // Pass the data from channelMaxCharge[]
        
        Serial.println("button press");
        
        digitalWrite(D7, HIGH);
        
        for (i = 0; i < 8; i++) {
            if ((previousCharge[i] == 0 && channelMaxCharge[i] != 0) || (previousCharge[i] != 0 && channelMaxCharge[i] == 0)) {
                String data = String("{\"pinId\": " + String(i) + ", \"maxChargeRate\": " + String(channelMaxCharge[i]) + "}");
                newSession(data);
                previousCharge[i] = channelMaxCharge[i];
            }
        }
        
        delay(1000);    // 1s delay
        digitalWrite(D7, LOW);
    }
    
    delay(0.5); // 500us delay
}

int newSession(String data) {
    // Trigger the new charging session 
    Serial.println("creating a new charging session");
    Serial.println(data);
    Particle.publish("new_session", data, PRIVATE);
    return 1;
}

void newSessionHandler(const char *event, const char *data) {
    // Handle the response
    Serial.println(data);
}

int evUpdate(String data) {
    Serial.println("updating ev charger output");
    Serial.println(data);
    
    int index = 0;
    String temp = "";
    for (i = 0; i < data.length(); i++) {
        if (data.charAt(i) == ',') {
            channelSupplyCharge[index++] = temp.toInt();
            temp = "";
        } else {
            String digit = String(data.charAt(i));
            temp.concat(digit);
        }
    }
    channelSupplyCharge[index++] = temp.toInt();
    
    // Print out the supply rates for debugging purposes
    for (i = 0; i < 8; i++) {
        Serial.println(channelSupplyCharge[i]);
    }
    
    // Set the 8 outputs
    analogWrite(B3, channelSupplyCharge[0]);
    analogWrite(B2, channelSupplyCharge[1]);
    analogWrite(B1, channelSupplyCharge[2]);
    analogWrite(B0, channelSupplyCharge[3]);
    analogWrite(D3, channelSupplyCharge[4]);
    analogWrite(D2, channelSupplyCharge[5]);
    analogWrite(D1, channelSupplyCharge[6]);
    analogWrite(D0, channelSupplyCharge[7]);
    
    return 1;
}
