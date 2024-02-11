const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const utils = require("./utils");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

// Create a new SerialPort instance using the settings
// const portArduino = new SerialPort(settings.path, settings);
let isEnabledArduino = false;
if (isEnabledArduino) {
  const portArduino = new SerialPort({
    path: "COM3",
    baudRate: 9600,
  });
}

const app = express();
const port = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "trash",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Replace the following values with your custom SMTP server details
const smtpConfig = {
  host: "mail.alexweb.md",
  port: 465, // Adjust the port as needed (typically 587 or 465 for TLS/SSL)
  secure: true, // Use true for SSL, false for TLS
  auth: {
    user: "trash@alexweb.md",
    pass: "OfY}NDTd0,E8",
  },
};

// Create a transporter using your custom SMTP server details
const transporter = nodemailer.createTransport(smtpConfig);

// // Create a transporter using your SMTP credentials
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "marinamotelica@gmail.com", // Replace with your email address
//     pass: "Motelic@2024", // Replace with your email password or an app-specific password
//   },
// });

// Set up the email options
const mailOptions = {
  from: "trash@alexweb.md", // Sender email address
  to: "maximgrosul@gmail.com", // Recipient email address
  subject: "Cutia de gunoi cu plastic este plina!",
  html: utils.createEmailTemplate(
    "Alexandra",
    "Verificati cutia de gunoi cu plastic deore ce este plina."
  ),
};

app.use(bodyParser.json());
// Enable CORS for all routes
app.use(cors());

// Allow Express to use the MySQL pool
app.use((req, res, next) => {
  req.mysql = pool;
  next();
});

// Send the email
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error("Error sending email:", error.message);
//   } else {
//     console.log("Email sent successfully:", info.response);
//   }
// });

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
  if (isEnabledArduino) {
    portArduino.write(postData.data);
  }
  const mysql = req.mysql;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  const insertQuery = `INSERT INTO trash (type, added_at) VALUES ('${postData.data}', '${currentDate}')`;

  mysql.query(insertQuery, (error, results, fields) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Error inserting record into database" });
    }

    res.json({ receivedData: postData });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

if (isEnabledArduino) {
  // setTimeout(() => {
  //   portArduino.write("1");
  // }, 1000);
}

app.get("/trash", (req, res) => {
  const mysql = req.mysql;

  mysql.query("SELECT * FROM trash", (error, results, fields) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Error retrieving users from database" });
    }

    res.json({ users: results });
  });
});

if (isEnabledArduino) {
  // setTimeout(() => {
  //   portArduino.write("1");
  // }, 1000);

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
  // parser.on("data", console.log);
  parser.on("data", processData);
  function processData(data) {
    if (data && data.length < 5) {
      console.log("Data:", data);
      //TODO send email
      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.error("Error sending email:", error.message);
      //   } else {
      //     console.log("Email sent successfully:", info.response);
      //   }
      // });
    }
  }
}
