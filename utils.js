exports.createEmailTemplate = (name, message) => {
  const emailTemplate = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 20px;
            }
  
            h1 {
              color: #333;
            }
  
            p {
              color: #666;
            }
          </style>
        </head>
        <body>
          <h1>Hello ${name}!</h1>
          <p>${message}</p>
          <p>Thank you for using our service.</p>
        </body>
      </html>
    `;

  return emailTemplate;
};
