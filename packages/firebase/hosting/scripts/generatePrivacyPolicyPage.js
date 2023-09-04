const fs = require("fs");
const path = require("path");

function generateHTML() {
  const data = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, "./../data/privacy-policy.json"),
      "utf8"
    )
  );

  let html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="destyle.css">
        <link rel="stylesheet" href="p.css">
        <title>${data.title}</title>
    </head>
    <body>
  `;

  html += `
    <h1>${data.title}</h1>
    <p>${data.description}</p>
  `;

  for (const policy of data.contents) {
    html += `
      <div class="content">
        <h2>${policy.title}</h2>
        <p>${policy.content}</p>
      </div>
    `;
  }

  html += `
    </body>
    </html>
  `;

  fs.writeFileSync(
    path.resolve(__dirname, "./../public/privacy-policy.html"),
    html
  );
}

generateHTML();
