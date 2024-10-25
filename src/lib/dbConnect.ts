import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // to avoid db chocking
  // Check if we have a connection to the database or if it's currently connecting

  if (connection.isConnected) {
    // console.log("-- Already connected to database.!");
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    // console.log("-- from dbConnect.ts --", db);

    connection.isConnected = db.connections[0].readyState;

    console.log("-- db connected successfully from dbConnect.ts --");
    
  } catch (err) {

    console.log("-- db connection failed from dbConnect.ts --", err);
    // Graceful exit in case of a connection error
    process.exit(1);
  }
}
export default dbConnect;
