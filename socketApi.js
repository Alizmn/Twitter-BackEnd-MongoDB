let socket_io = require("socket.io");
let io = socket_io();
let socketApi = {};
//Your socket logic here
// ----------------------SOCKET.IO------------
// const io = require("socket.io")(server);
io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.on("subscribe", (room) => {
    console.log("joining room", room);
    socket.join(room);
  });

  socket.on("leaveRoom", (room) => {
    console.log("leaving room", room);
    socket.leave(room);
  });

  socket.on("chat", (msg) => {
    connect.then(async (db) => {
      try {
        const findChat = await Conversation.find({
          participants: { $all: [msg.id, socket.decoded.id] },
        }).populate({
          path: "messages",
          populate: { path: "sender", select: "username name" },
        });
        if (findChat.length < 1) {
          console.log("new conversation");
          let firstmessage = {
            sender: socket.decoded.id,
            content: msg.content,
          };
          let newMessage = await Message.create(firstmessage);
          let newConversation = await Conversation.create({
            participants: [msg.id, socket.decoded.id],
          });
          let user1 = await User.findById(socket.decoded.id);
          let user2 = await User.findById(msg.id);
          newConversation.messages.push(newMessage);
          newConversation.save((err, doc) => {
            user1.conversations.unshift(newConversation);
            user1.save();
            user2.conversations.unshift(newConversation);
            user2.save();
            return socket.broadcast.to(msg.room).emit("output", doc.messages);
          });
        } else if (findChat.length > 0) {
          let newMsg = {
            sender: socket.decoded.id,
            content: msg.content,
          };
          io.in(msg.room).clients(async (err, clients) => {
            if (clients.length < 2) {
              // let receiver = await User.findById(msg.id)
              // if(!receiver.notifications.find(x=> x.from == socket.decoded.id)){
              //     receiver.notifications.push({
              //         from: socket.decoded.username,
              //         description: msg.content,
              //     })
              //     receiver.save()
              // }
            }
          });
          let addMsg = await Message.create(newMsg);
          findChat[0].messages.push(addMsg);
          let popMsg = await addMsg
            .populate("sender", "name username")
            .execPopulate();
          findChat[0].save((err, doc) => {
            console.log(popMsg);
            return io.in(msg.room).emit("output", popMsg);
            // return io.emit('output', doc.messages)
          });
        } else {
          return io.emit("error sending message");
        }
      } catch (error) {
        console.log(error);
        return io.emit("output", "Unknown server error");
      }
    });
  });
});
// -------------------------------------------------
socketApi.io = io;
module.exports = socketApi;
