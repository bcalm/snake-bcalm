const { Server } = require("net");
const fs = require("fs");

const defaultResponse = function() {
  return ["HTTP/1.1 400 bad Request", "content-type:text/html", "content-length:0", ""].join("\n");
};

const fileNotPresent = [
  "HTTP/1.1 404 file not found",
  "content-type:text/html",
  "content-length:0",
  ""
].join("\n");

const handleRequest = function(requestUrl) {
  const path = requestUrl.slice(1) || "index.html";
  try {
    const html = fs.readFileSync(path, "utf8");
    const contentType = path.split(".").pop();
    return [
      `HTTP/1.0 200 OK`,
      `Content-Type: text/${contentType}`,
      `Content-Length: ${html.length}`,
      "",
      html
    ].join("\n");
  } catch (err) {
    return fileNotPresent;
  }
};

const generateResponse = function(text) {
  const [request, ...headerAndBody] = text.split("\n");
  const [method, requestUrl, protocol] = request.split(" ");

  if (requestUrl) {
    return method === "GET" ? handleRequest(requestUrl) : defaultResponse();
  }
};

const main = function() {
  const server = new Server();
  server.on("connection", socket => {
    socket.setEncoding("utf8");
    socket.on("data", text => {
      socket.write(generateResponse(text));
      socket.end();
    });
  });

  server.on("error", err => console.log(err));
  server.on("listening", () => console.log(`Server is listening on port: 8080`));
  server.on("end", () => console.log("server is ended ${server}"));
  server.listen(8080);
};

main();
