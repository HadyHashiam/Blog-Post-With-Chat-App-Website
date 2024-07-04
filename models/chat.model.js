const mongoose = require("mongoose");

const DB_URL = process.env.MONGODB_URI

const chatSchema = mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]
});

const Chat = mongoose.model("chat", chatSchema);
exports.Chat = Chat;

exports.getChat = async chatId => {
    try {
        await mongoose.connect(DB_URL);
        let chat = await Chat.findById(chatId).populate("users");
        mongoose.disconnect();
        return chat;
    } catch (error) {
        throw new Error(error);
    } finally {
        mongoose.disconnect();
    }
};
