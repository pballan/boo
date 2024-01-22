const cluster = require("cluster");

if (cluster.isMaster) {
  for (let i = 0; i <= 4; i++) cluster.fork();
} else {
  require("./app.js");
}
