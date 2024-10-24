import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // to avoid db chocking
  if (connection.isConnected) {
    console.log("Already connected to database.!");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log("-- from dbConnect.ts --", db);

    connection.isConnected = db.connections[0].readyState;

    console.log("-- db connected successfully \n from dbConnect.ts --", db);
    
  } catch (err) {

    console.log("-- db connection failed \n from dbConnect.ts --", err);

    process.exit(1);
  }
}
export default dbConnect;
