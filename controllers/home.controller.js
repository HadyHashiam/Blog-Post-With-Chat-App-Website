const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

exports.getHome = async (req, res) => {
    let id = req.params.id || req.session.userId;
    try {
        const userData = await userModel.getUserData(id);
        const friendsIds = userData.friends.map(friend => friend.id); // استخراج IDs الأصدقاء
        const posts = await postModel.getPostsByUserAndFriends(id, friendsIds);

        res.render("index", {
            pageTitle: "Home",
            isUser: req.session.userId,
            username: userData.username,
            posts: posts,
            friends: userData.friends,
            sentRequests: userData.sentRequests,
            friendRequests: userData.friendRequests,
            isFriends: userData.friends.some(friend => friend.id === req.session.userId),
            isRequestSent: userData.friendRequests.some(friend => friend.id === req.session.userId),
            isRequestReceived: userData.sentRequests.some(friend => friend.id === req.session.userId)
        });
    } catch (err) {
        console.error("Error fetching home data:", err);
        res.redirect("/error");
    }
};


exports.getFriends = (req, res, next) => {
    userModel
        .getFriends(req.session.userId)
        .then(friends => {
            res.render("friends", {
                pageTitle: "Friends",
                isUser: req.session.userId,
                friendRequests: req.friendRequests,
                friends: friends,
            });
        })
        .catch(err => {
            res.redirect("/error");
        });
};

exports.getSearch = (req, res, next) => {
    if (!req.query.name) {
        res.render('search', {
            pageTitle: "Search",
            isUser: req.session.userId,
            friendRequests: req.friendRequests,
            users: null,
            searchMode: false
        })
    } else {
        userModel.getUsers({
            username: {
                $regex: new RegExp("^" + req.query.name, "i")
            }
        })
            .then(users => {
                console.log(users)
                res.render('search', {
                    pageTitle: "Search",
                    isUser: req.session.userId,
                    friendRequests: req.friendRequests,
                    users: users,
                    searchMode: true
                })
            })
            .catch(err => {
                res.redirect("/error");
            });
    }
}

