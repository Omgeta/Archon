// import { token, owners, mongodb_uri } from "./Config";
const mongodb_uri: string = process.env.MONGODB_URI;
const token: string = process.env.TOKEN;
const owners: string[] = (process.env.OWNERS || "").split(",");

// Initialize database
import mongoose from "mongoose";
mongoose.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize ArchonClient
import ArchonClient from "./client/ArchonClient";
const client: ArchonClient = new ArchonClient({ token, owners });
client.start();