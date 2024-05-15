import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId,io } from "../socket/socket.js";

export const sendMessage=async(req,res)=>{
        try{
            const { message } = req.body;//getting message from user.
            const { id: receiverId } = req.params;
            const senderId = req.user._id;//Here protectRoute will happen to know if user is logged in or not.

            //Finding the conversation array where participants are these two sender.   
            let conversation = await Conversation.findOne({
                    participants: { $all: [senderId, receiverId] },//gives conversation between these two users.
            });

            //If intitally no conversation between user we will create a new one.
            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId],//dont need to create message array as initially it would be empty array.

                });
            }
            //creating message coming from user.

            const newMessage = new Message({
                senderId,
                receiverId,
                message,
            });
            //If new message successfully created.
            if (newMessage) {
                conversation.messages.push(newMessage._id);
            }
        
            // await conversation.save();
            // await newMessage.save();

            // this will run in parallel
            await Promise.all([conversation.save(), newMessage.save()]);
            
            // SOCKET IO FUNCTIONALITY WILL GO HERE
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                // io.to(<socket_id>).emit() used to send events to specific client
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            
            res.status(201).json(newMessage);
    
        }
        catch(error){
            console.log("Error in sendMessage controller: ", error.message);
		    res.status(500).json({ error: "Internal server error in messaging" });
        }
};

export const getMessages = async (req, res) => {
	try {
            const { id: userToChatId } = req.params;
            const senderId = req.user._id;//Coming from protectRoute function

            const conversation = await Conversation.findOne({
                    participants: { $all: [senderId, userToChatId] },
            }).populate("messages"); 
            // NOT REFERENCE BUT ACTUAL MESSAGES . getting message we have in our array message.   
            //Using populate which is a mongoDB command we get the actual message.

            if (!conversation) return res.status(200).json([]);

            const messages = conversation.messages;

            res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};