const fs = require("fs");
const path = require("path");

function generateHTML() {
  const data = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./../data/licenses.json"), "utf8")
  );

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Licenses</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                word-wrap: break-word;
            }
            div, p, pre {
              word-wrap: break-word;
            }
            .license {
                border: 1px solid #ccc;
                margin: 20px;
                padding: 10px;
            }
            .license-header {
                background-color: #f2f2f2;
                padding: 5px 10px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
  `;

  for (const license in data) {
    html += `
      <div class="license">
          <div class="license-header">
              <p>${data[license].name}@${data[license].version}(${data[license].repository})</p>
          </div>
          <p><strong>Publisher:</strong> ${data[license].publisher}(${data[license].url})</p>
          <p><strong>License:</strong> ${data[license].licenses}</p>
          <p><strong>Description:</strong> ${data[license].description}</p>
          <p><strong>Copyright:</strong> ${data[license].copyright}</p>
          <p>${data[license].licenseText}</p>
      </div>
    `;
  }

  html += `
    </body>
    </html>
  `;

  fs.writeFileSync(path.resolve(__dirname, "./../public/licenses.html"), html);
}

generateHTML();
