const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");

async function renderChat(res, req, messages, chatId) {
    let friendData = messages.length > 0
        ? messages[0].chat.users.find(user => user._id != req.session.userId)
        : await chatModel.getChat(chatId).then(chat => chat.users.find(user => user._id != req.session.userId));

    res.render("chat", {
        pageTitle: friendData.username,
        isUser: req.session.userId,
        friendRequests: req.friendRequests,
        messages: messages,
        friendData: friendData,
        chatId: chatId
    });
}

exports.getChat = async (req, res, next) => {
    let chatId = req.params.id;
    try {
        let messages = await messageModel.getMessages(chatId);
        await renderChat(res, req, messages, chatId);
    } catch (err) {
        res.redirect("/error");
    }
};
