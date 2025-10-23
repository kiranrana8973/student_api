const mongoose = require("mongoose");

class MongoDBConnection {
  constructor(uri) {
    this.uri = uri;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mongoose.connect(this.uri);
      console.log(
        `MongoDB connected to: ${this.connection.connection.host}`.white
          .underline.bold
      );
      return this.connection;
    } catch (error) {
      console.error(`MongoDB connection error: ${error.message}`.red.underline.bold);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("MongoDB disconnected".yellow);
    } catch (error) {
      console.error(`MongoDB disconnection error: ${error.message}`.red);
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = MongoDBConnection;
