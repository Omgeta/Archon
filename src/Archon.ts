import { token, owners } from "./Config";
import ArchonClient from "./client/ArchonClient";

const client: ArchonClient = new ArchonClient({ token, owners });
client.start();