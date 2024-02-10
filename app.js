const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

// Create a new SerialPort instance using the settings
// const portArduino = new SerialPort(settings.path, settings);
const portArduino = new SerialPort({
  path: "COM3",
  baudRate: 9600,
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());

// Route for handling GET requests at the root path
app.get("/", (req, res) => {
  res.send("Hello, this is the root path!");
});

app.get("/api/get", (req, res) => {
  console.log(req);
  res.json({ message: "GET request received" });
});

app.post("/api/post", (req, res) => {
  const postData = req.body;
  console.log(postData.data);
  portArduino.write(postData.data);
  res.json({ receivedData: postData });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

setTimeout(() => {
  portArduino.write("1");
}, 1000);

portArduino.on("readable", function () {
  const data = portArduino.read();
  //   console.count("portArduino:");
  //   console.log("Data:", data);
  if (data) {
    // console.count("Data:");
    // console.log("Data:", data.toString("utf-8"));
    // Call your function or perform actions with the data here
  }
});
const parser = portArduino.pipe(new ReadlineParser({ delimiter: "\r\n" }));
parser.on("data", console.log);
