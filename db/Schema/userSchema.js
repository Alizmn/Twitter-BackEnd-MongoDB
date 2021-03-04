const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      default: "",
      required: true,
      unique: true,
      type: String,
    },
    name: {
      default: "",
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    retweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
      },
    ],
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    notifications: {
      required: false,
      default: [],
      type: Array,
    },
    conversations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
