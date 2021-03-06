const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../db/Schema/userSchema");
const { Conversation, Message } = require("../db/Schema/chatSchema");

// Get all user conversations
router.get(
  "/conversations",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const conversations = await User.findOne(
        { username: req.user.username },
        { conversations: 1 }
      )
        .populate({
          path: "conversations",
          select: "participants updatedAt",
          options: { sort: { updatedAt: -1 } },
          populate: {
            path: "messages",
            select: "content sender",
            populate: {
              path: "sender",
              model: "User",
              select: "username name profileImg",
            },
          },
        })
        .populate({
          path: "conversations",
          select: "participants updatedAt",
          options: { sort: { updatedAt: -1 } },
          populate: {
            path: "participants",
            select: "username name profileImg",
          },
        });
      // conversations.notifications = []
      // conversations.save()
      res.send({ conversations });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, msg: "error getting conversations" });
    }
  }
);

// Get single conversation
router.get(
  "/conversation",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.query.id).populate({
        path: "messages",
        populate: { path: "sender", model: "User", select: "username name" },
      });
      if (!conversation) {
        res.status(404).send({ msg: "Conversation not found" });
      } else {
        if (conversation.participants.includes(req.user._id)) {
          res.send({ conversation });
        } else {
          res.status(401).send({ msg: "Unauthorized access" });
        }
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, msg: "error getting conversation" });
    }
  }
);

router.post("/test", (req, res) => {
  res.json({ req, res });
});

// Start a new conversation
router.post(
  "/conversation",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let user1 = req.user._id;
    let user2 = req.body.id;
    let content = req.body.content;
    // let user2 = "60424901acda1e34d44590f2";
    // let content = "hello";

    console.log("here is the body:", req.body, user2, user1);

    try {
      const findChat = await Conversation.find({
        participants: { $all: [user1, user2] },
      });
      if (findChat.length < 1) {
        let newConversation = await Conversation.create({
          participants: [user1, user2],
        });

        if (content) {
          let firstmessage = {
            sender: req.user._id,
            content: content,
          };
          let newMessage = await Message.create(firstmessage);
          newConversation.messages.push(newMessage);
        }

        let userA = await User.findById(user1);
        let userB = await User.findById(user2);
        newConversation.save();
        userA.conversations.unshift(newConversation);
        userA.save();
        userB.conversations.unshift(newConversation);
        userB.save();
      }
      if (findChat.length > 0 && content) {
        let newMsg = {
          sender: user1,
          content: content,
        };
        let addMsg = await Message.create(newMsg);
        findChat[0].messages.push(addMsg);
        findChat[0].save();
      }
      res.send({ msg: "messsage sent" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: "Unknown server error" });
    }
  }
);

module.exports = router;
