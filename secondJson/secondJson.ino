#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define green 4
#define red 16

LiquidCrystal_I2C lcd(0x27, 16, 2);
WebServer server(80);

const char* ssid="Password";
const char* pass="password";

void addCORS(){
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleOptions(){
  addCORS();
  server.send(204);
}

bool salvaJSON(StaticJsonDocument<4096>& doc){
  File tmp=SPIFFS.open("/tmp.json", "w");
  if (!tmp){
    return false;
  }
  serializeJson(doc, tmp);
  tmp.close();
  SPIFFS.remove("/database.json");
  SPIFFS.rename("/tmp.json", "/database.json");
  return true;
}

bool aggiungiUtente(const char* userCode, const char* userName, const char* email){
  if (!SPIFFS.exists("/database.json")){
    File f=SPIFFS.open("/database.json", "w");
    f.print("{\"utenti\":[]}");
    f.close();
  }
  
  File f=SPIFFS.open("/database.json", "r");
  StaticJsonDocument<4096> doc;
  deserializeJson(doc, f);
  f.close();
  
  JsonArray utenti=doc["utenti"];
  JsonObject u=utenti.createNestedObject();
  u["userCode"]=userCode;
  u["userName"]=userName;
  u["email"]=email;
  u["timestamp"]=millis();
  
  return salvaJSON(doc);
}

void handlePing(){
  addCORS();
  server.send(200, "text/plain", "pong");
}

void handleAdd() {
  addCORS();
  if (!server.hasArg("nome")|| !server.hasArg("cognome")){
    server.send(400, "text/plain", "Parametri mancanti");
    return;
  }
  String nome=server.arg("nome");
  String cognome=server.arg("cognome");
  aggiungiUtente(nome.c_str(), cognome.c_str(), "");
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Benvenuto");
  lcd.setCursor(0, 1);
  lcd.print(nome+" "+cognome);
  
  server.send(200, "text/plain", "OK");
}

// /user
void handleUser() {
  addCORS();
  
  if (server.method()!=HTTP_POST) {
    server.send(405, "application/json", "{\"error\":\"Method Not Allowed\"}");
    return;
  }

  String body=server.arg("plain");
  StaticJsonDocument<512> reqDoc;
  DeserializationError error=deserializeJson(reqDoc, body);
  
  if (error){
    Serial.println("JSON parsing failed!");
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }
  
  //Estraiamo i dati
  const char* userCode=reqDoc["userCode"];
  const char* userName=reqDoc["userName"];
  const char* email=reqDoc["email"];
  
  if (!userCode||!userName){
    server.send(400, "application/json", "{\"error\":\"Missing required fields\"}");
    return;
  }
  
  if (aggiungiUtente(userCode, userName, email)) {

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Benvenuto");
    lcd.setCursor(0, 1);
    
    String displayName=String(userName);
    if (displayName.length()>16){
      displayName=displayName.substring(0, 13)+"...";
    }
    lcd.print(displayName);
    digitalWrite(red, LOW);
    digitalWrite(green, HIGH);
    
    String response="{\"success\":true,\"message\":\"Benvenuto " + String(userName) + "\"}";
    server.send(200, "application/json", response);
  } else {
    server.send(500, "application/json", "{\"error\":\"Failed to save user\"}");
  }
  delay(15000);
  lcd.clear();
  return;
}

void setup() {
  Serial.begin(115200);
  SPIFFS.begin(true);
  
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Avvio...");

  pinMode(green, OUTPUT);
  pinMode(red, OUTPUT);
  digitalWrite(red, HIGH);
  
  WiFi.begin(ssid, pass);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status()!=WL_CONNECTED){
    delay(200);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi OK");
  lcd.setCursor(0, 1);
  lcd.print(WiFi.localIP());
  
  //Registra tutti gli endpoint
  server.on("/ping", HTTP_GET, handlePing);
  server.on("/ping", HTTP_OPTIONS, handleOptions);
  
  server.on("/add", HTTP_GET, handleAdd);
  server.on("/add", HTTP_OPTIONS, handleOptions);
  
  server.on("/user", HTTP_POST, handleUser);
  server.on("/user", HTTP_OPTIONS, handleOptions);
  
  server.begin();
  Serial.println("Server avviato!");
  
  delay(2000);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Pronto!");
}

void loop(){
  server.handleClient();
}
