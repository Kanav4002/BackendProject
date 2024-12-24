const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET") {
    if (url === "/") {
      fs.readFile("User.json", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        }
      });
    } else if (url === "/allstudent") {
      fs.readFile("allstudent.html", "utf8", (err, html) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Server Error");
        } else {
          fs.readFile("User.json", "utf8", (jsonErr, usersData) => {
            if (jsonErr) {
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("Error reading users data");
            } else {
              const users = JSON.parse(usersData || "[]");
              let userListHTML = "";

              users.forEach((user) => {
                userListHTML += `
                  <tr>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                  </tr>`;
              });

              const updatedHTML = html.replace("{{userList}}", userListHTML);

              res.writeHead(200, { "Content-Type": "text/html" });
              res.end(updatedHTML);
            }
          });
        }
      });
    } else if (url === "/index") {
      fs.readFile("index.html", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } else if (method === "POST" && url === "/index") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      fs.readFile("User.json", "utf8", (readErr, data) => {
        let users = [];
        if (!readErr && data) {
          try {
            users = JSON.parse(data || "[]");
          } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
          }
        }

        const newUser = qs.decode(body);
        users.push(newUser);

        fs.writeFile("User.json", JSON.stringify(users), (writeErr) => {
          if (writeErr) {
            console.error("Error writing to User.json:", writeErr);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Server Error");
          } else {
            console.log("User data inserted successfully");
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Registration Successful!");
          }
        });
      });
    });
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});