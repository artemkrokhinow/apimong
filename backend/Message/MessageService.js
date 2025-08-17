import Message from './models/messageModels.js'

const MessageService = {
    async create(senderId, receiverId, text){
        console.log(`service create message from ${senderId} to ${receiverId}`)
        const message = await Message.create({
            senderId : senderId,
            receiverId : receiverId,
            text: text 
        })
        return message
    },
    async getConversation(user1_ID, user2_ID ){
        const chatMessage = await Message.find({
              $or: [
                    {senderId:  user1_ID , receiverId : user2_ID },
                    {senderId:  user2_ID , receiverId : user1_ID }
                ]
        }).sort({ createdAt: 1 })
        return chatMessage
    }
}

export default MessageService  