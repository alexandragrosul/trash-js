const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

// Replace 'COM1' with your actual serial port name
const portName = "USB\\VID_2341&PID_0042\\x3d75834353830351814011";

// Define the settings object
const settings = {
  path: portName,
  baudRate: 9600,
  // Add any other settings you need
};

// Create a new SerialPort instance using the settings
// const portArduino = new SerialPort(settings.path, settings);
const portArduino = new SerialPort({
  path: "COM3",
  baudRate: 9600,
});

// for (let i = 0; i < 10; i++) {
//   setTimeout(() => {
//     portArduino.write("1");
//   }, i * 1000);
// }

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

// Open the serial port
// portArduino.open((err) => {
//   if (err) {
//     console.error("Error opening port:", err.message);
//   } else {
//     console.log(`Serial port ${settings.path} opened.`);

//     // Event handler for receiving data
//     portArduino.on("data", (data) => {
//       console.log(`Received data: ${data.toString()}`);
//       // Handle the received data as needed
//     });

//     // Event handler for errors
//     portArduino.on("error", (err) => {
//       console.error("Error:", err.message);
//     });

//     // Event handler for closing the port
//     portArduino.on("close", () => {
//       console.log(`Serial port ${settings.path} closed.`);
//     });

//     // Perform other actions as needed
//   }
// });
