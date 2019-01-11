const http = require("http");
const spawn = require("child_process").spawn;
const createHandler = require("github-webhook-handler");
const handler = createHandler({ path: "/webhook", secret: "bookinfo-node" });

const rumCommand = (cmd, args, callback) => {
  const child = spawn(cmd, args);
  let response = "";
  child.stdout.on("data", buffer => (response += buffer.toString()));
  child.stdout.on("end", () => callback(response));
};

http
  .createServer(function(req, res) {
    console.log(123456);
    handler(req, res, function(err) {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(7777, () => {
    console.log("listening at 7777");
  });

handler.on("error", function(err) {
  console.error("Error:", err.message);
});

handler.on("push", function(event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
  rumCommand("sh", ["./deploy.sh"], txt => {
    console.log("deploy====", txt);
  });
});
