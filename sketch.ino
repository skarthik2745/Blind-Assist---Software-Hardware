#define BLYNK_TEMPLATE_ID "TMPL3NJGrZTli"
#define BLYNK_TEMPLATE_NAME "PRISM for Blind"
#define BLYNK_AUTH_TOKEN "U0jtRl3irgawYNg3fUEUIfqcghiDLAXn"

#include <WiFi.h>
#include <HTTPClient.h>
#include <BlynkSimpleEsp32.h>

const char* ssid = "Galaxy sk";
const char* password = "ryg@2007";

const char* serverUrl = "https://prismforblind.netlify.app/api/sensor-data";


// =====================================================
// HARDWARE PINS
// =====================================================

// Push Buttons
#define BTN1 13       // SOS
#define BTN2 14       // Voice Recording

// SPDT Switches
#define SPDT1 26      // Object Detection
#define SPDT2 25      // Medicine Reminder

// LEDs
#define LED1 16       // SOS
#define LED2 17       // Voice Recording
#define LED3 18       // Object Detection
#define LED4 19       // Medicine Reminder

// RGB LED
#define RGB_R 21
#define RGB_G 22
#define RGB_B 23

// Buzzer
#define BUZZER 4


// =====================================================
// SOFTWARE STATES
// =====================================================

bool sosState = false;
bool voiceState = false;
bool objectState = false;
bool medicineState = false;


// Previous physical states
bool lastButton1State = HIGH;
bool lastButton2State = HIGH;

bool lastObjectSwitchState = HIGH;
bool lastMedicineSwitchState = HIGH;


// Buzzer
unsigned long buzzerStartTime = 0;
bool buzzerActive = false;


// Netlify sending interval
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 2000;


// =====================================================
// RGB LED FUNCTIONS
// =====================================================

void rgbOff() {

  digitalWrite(RGB_R, LOW);
  digitalWrite(RGB_G, LOW);
  digitalWrite(RGB_B, LOW);
}


void rgbRed() {

  digitalWrite(RGB_R, HIGH);
  digitalWrite(RGB_G, LOW);
  digitalWrite(RGB_B, LOW);
}


void rgbBlue() {

  digitalWrite(RGB_R, LOW);
  digitalWrite(RGB_G, LOW);
  digitalWrite(RGB_B, HIGH);
}


void rgbGreen() {

  digitalWrite(RGB_R, LOW);
  digitalWrite(RGB_G, HIGH);
  digitalWrite(RGB_B, LOW);
}


void rgbYellow() {

  digitalWrite(RGB_R, HIGH);
  digitalWrite(RGB_G, HIGH);
  digitalWrite(RGB_B, LOW);
}


// =====================================================
// BUZZER
// =====================================================

void startBuzzer() {

  digitalWrite(BUZZER, HIGH);

  buzzerStartTime = millis();

  buzzerActive = true;
}


// =====================================================
// UPDATE HARDWARE
// =====================================================

void updateHardware() {

  // Individual LEDs

  digitalWrite(LED1, sosState);
  digitalWrite(LED2, voiceState);
  digitalWrite(LED3, objectState);
  digitalWrite(LED4, medicineState);


  // RGB LED

  rgbOff();

  if (sosState) {

    rgbRed();
  }

  else if (voiceState) {

    rgbBlue();
  }

  else if (objectState) {

    rgbGreen();
  }

  else if (medicineState) {

    rgbYellow();
  }
}


// =====================================================
// UPDATE BLYNK
// =====================================================

void updateBlynk() {

  // V0 = SOS
  Blynk.virtualWrite(V0, sosState ? 1 : 0);

  // V1 = Voice Recording
  Blynk.virtualWrite(V1, voiceState ? 1 : 0);

  // V2 = Object Detection
  Blynk.virtualWrite(V2, objectState ? 1 : 0);

  // V3 = Medicine Reminder
  Blynk.virtualWrite(V3, medicineState ? 1 : 0);
}


// =====================================================
// SEND DATA TO NETLIFY
// =====================================================

void sendDataToNetlify() {

  if (WiFi.status() != WL_CONNECTED) {

    Serial.println("WiFi not connected");

    return;
  }


  HTTPClient http;

  http.begin(serverUrl);

  http.addHeader("Content-Type", "application/json");


  String jsonData = "{";


  // SOS

  jsonData += "\"button1\":";
  jsonData += sosState ? "true" : "false";

  jsonData += ",";


  // Voice Recording

  jsonData += "\"button2\":";
  jsonData += voiceState ? "true" : "false";

  jsonData += ",";


  // Object Detection

  jsonData += "\"throw1\":";
  jsonData += objectState ? "true" : "false";

  jsonData += ",";


  // Medicine Reminder

  jsonData += "\"throw2\":";
  jsonData += medicineState ? "true" : "false";


  jsonData += "}";


  Serial.println("Sending to Netlify:");

  Serial.println(jsonData);


  int responseCode = http.POST(jsonData);


  Serial.print("HTTP Response Code: ");

  Serial.println(responseCode);


  if (responseCode > 0) {

    String response = http.getString();

    Serial.println("Server Response:");

    Serial.println(response);
  }


  http.end();
}


// =====================================================
// SETUP
// =====================================================

void setup() {

  Serial.begin(115200);


  // ---------------------------------------------------
  // INPUTS
  // ---------------------------------------------------

  pinMode(BTN1, INPUT_PULLUP);

  pinMode(BTN2, INPUT_PULLUP);

  pinMode(SPDT1, INPUT_PULLUP);

  pinMode(SPDT2, INPUT_PULLUP);


  // ---------------------------------------------------
  // LED OUTPUTS
  // ---------------------------------------------------

  pinMode(LED1, OUTPUT);

  pinMode(LED2, OUTPUT);

  pinMode(LED3, OUTPUT);

  pinMode(LED4, OUTPUT);


  // ---------------------------------------------------
  // RGB LED
  // ---------------------------------------------------

  pinMode(RGB_R, OUTPUT);

  pinMode(RGB_G, OUTPUT);

  pinMode(RGB_B, OUTPUT);


  // ---------------------------------------------------
  // BUZZER
  // ---------------------------------------------------

  pinMode(BUZZER, OUTPUT);

  digitalWrite(BUZZER, LOW);


  // Turn LEDs OFF

  digitalWrite(LED1, LOW);

  digitalWrite(LED2, LOW);

  digitalWrite(LED3, LOW);

  digitalWrite(LED4, LOW);

  rgbOff();


  // ---------------------------------------------------
  // WIFI
  // ---------------------------------------------------

  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");


  while (WiFi.status() != WL_CONNECTED) {

    delay(500);

    Serial.print(".");
  }


  Serial.println();

  Serial.println("WiFi Connected");


  Serial.print("IP Address: ");

  Serial.println(WiFi.localIP());


  // ---------------------------------------------------
  // BLYNK
  // ---------------------------------------------------

  Blynk.config(BLYNK_AUTH_TOKEN);

  Serial.println("Connecting to Blynk...");

  Blynk.connect();


  // ---------------------------------------------------
  // INITIAL PHYSICAL STATES
  // ---------------------------------------------------

  lastButton1State = digitalRead(BTN1);

  lastButton2State = digitalRead(BTN2);

  lastObjectSwitchState = digitalRead(SPDT1);

  lastMedicineSwitchState = digitalRead(SPDT2);


  // Read SPDT initial states

  objectState = (digitalRead(SPDT1) == LOW);

  medicineState = (digitalRead(SPDT2) == LOW);


  updateHardware();

  updateBlynk();

  sendDataToNetlify();


  Serial.println("System Ready");
}


// =====================================================
// LOOP
// =====================================================

void loop() {

  Blynk.run();


  bool currentButton1State = digitalRead(BTN1);

  bool currentButton2State = digitalRead(BTN2);

  bool currentObjectSwitchState = digitalRead(SPDT1);

  bool currentMedicineSwitchState = digitalRead(SPDT2);


  bool inputChanged = false;


  // ===================================================
  // SOS BUTTON
  // ===================================================

  // Detect button press
  // INPUT_PULLUP means LOW = pressed

  if (lastButton1State == HIGH &&
      currentButton1State == LOW) {

    // Toggle SOS

    sosState = !sosState;

    inputChanged = true;

    startBuzzer();

    Serial.print("SOS: ");

    Serial.println(sosState ? "ON" : "OFF");

    delay(50);
  }


  // ===================================================
  // VOICE RECORDING BUTTON
  // ===================================================

  if (lastButton2State == HIGH &&
      currentButton2State == LOW) {

    // Toggle voice recording

    voiceState = !voiceState;

    inputChanged = true;

    startBuzzer();

    Serial.print("Voice Recording: ");

    Serial.println(voiceState ? "ON" : "OFF");

    delay(50);
  }


  // ===================================================
  // OBJECT DETECTION SPDT
  // ===================================================

  if (currentObjectSwitchState != lastObjectSwitchState) {

    objectState = (currentObjectSwitchState == LOW);

    inputChanged = true;

    startBuzzer();

    Serial.print("Object Detection: ");

    Serial.println(objectState ? "ON" : "OFF");
  }


  // ===================================================
  // MEDICINE REMINDER SPDT
  // ===================================================

  if (currentMedicineSwitchState != lastMedicineSwitchState) {

    medicineState = (currentMedicineSwitchState == LOW);

    inputChanged = true;

    startBuzzer();

    Serial.print("Medicine Reminder: ");

    Serial.println(medicineState ? "ON" : "OFF");
  }


  // ===================================================
  // IF ANY INPUT CHANGED
  // ===================================================

  if (inputChanged) {

    updateHardware();

    updateBlynk();

    sendDataToNetlify();

    lastSendTime = millis();
  }


  // ===================================================
  // UPDATE PREVIOUS STATES
  // ===================================================

  lastButton1State = currentButton1State;

  lastButton2State = currentButton2State;

  lastObjectSwitchState = currentObjectSwitchState;

  lastMedicineSwitchState = currentMedicineSwitchState;


  // ===================================================
  // PERIODIC NETLIFY UPDATE
  // ===================================================

  if (millis() - lastSendTime >= sendInterval) {

    sendDataToNetlify();

    lastSendTime = millis();
  }


  // ===================================================
  // BUZZER AUTO OFF AFTER 3 SECONDS
  // ===================================================

  if (buzzerActive) {

    if (millis() - buzzerStartTime >= 3000) {

      digitalWrite(BUZZER, LOW);

      buzzerActive = false;
    }
  }


  delay(20);
}