import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    settings: {
        type: Object,
        require: true
    }
}, { minimize: false });

export const guildModel = mongoose.model("guild", guildSchema);