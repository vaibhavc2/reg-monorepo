export const emailHTML = (
  heading: string,
  message?: string,
  content?: string,
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1, p {
          margin: 0 0 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${heading}</h1>
        <p>${message}</p>
        <div>${content}</div>
      </div>
    </body>
    </html>
  `;
};
