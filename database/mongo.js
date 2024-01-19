const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

(async () => {
  const mongod = new MongoMemoryServer();
  await mongod.start();
  const mongoUri = mongod.getUri();

  await mongoose.connect(mongoUri);
})();

module.exports = mongoose;
