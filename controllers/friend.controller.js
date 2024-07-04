const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");

exports.cancel = (req, res, next) => {
    userModel
        .cancelFriendRequest(req.body)
        .then(() => {
            res.redirect("/profile2/" + req.body.friendId);
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.accept = (req, res, next) => {
    userModel
        .acceptFriendRequest(req.body)
        .then(() => {
            res.redirect("/profile2/" + req.body.friendId);
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.reject = (req, res, next) => {
    userModel
        .rejectFriendRequest(req.body)
        .then(() => {
            res.redirect("/profile2/" + req.body.friendId);
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.delete = (req, res, next) => {
    userModel
        .deleteFriend(req.body)
        .then(() => {
            res.redirect("/profile2/" + req.body.friendId);
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.getChat = (req, res, next) => {
    let chatId = req.params.id;
    messageModel.getMessages(chatId).then(messages => {
        if (messages.length === 0) {
            chatModel.getChat(chatId).then(chat => {
                let friendData = chat.users.find(
                    user => user._id != req.session.userId
                );
                res.render("chat", {
                    pageTitle: friendData.username,
                    isUser: req.session.userId,
                    friendRequests: req.friendRequests,
                    messages: messages,
                    friendData: friendData,
                    chatId: chatId
                });
            });
        } else {
            let friendData = messages[0].chat.users.find(
                user => user._id != req.session.userId
            );
            res.render("chat", {
                pageTitle: friendData.username,
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                messages: messages,
                friendData: friendData,
                chatId: chatId
            });
        }
    });
};