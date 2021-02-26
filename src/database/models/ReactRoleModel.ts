import mongoose from "mongoose";

const reactRoleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    settings: {
        type: Object,
        require: true
    }
}, { minimize: false });

export const reactRoleModel = mongoose.model("reactRole", reactRoleSchema);