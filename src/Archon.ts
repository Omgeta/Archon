import { token, owners, mongodb_uri } from "./Config";

// Initialize database
import mongoose from "mongoose";
mongoose.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize ArchonClient
import ArchonClient from "./client/ArchonClient";
const client: ArchonClient = new ArchonClient({ token, owners });
client.start();