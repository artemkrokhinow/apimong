import MongoMessage from '../models/messageModels.js'
import MessageService from './MessageService.js'
const MessageController = {
    async create(req, res){
        try{
            const senderId = req.user.id 
            const {receiverId, text } = req.body
            console.log(`Conroller аccepted request to create message`)
            const newMessage = await MessageService.create(senderId, receiverId , text)
            res.status(201).json(newMessage)

        } catch(e){
            res.status(500).json ({message: "fail on server "})
        }
    }
,

    async getConversation(req, res){
        try {
            console.log('--- getConversation Controller ---');
        console.log('Current User ID:', req.user.id);
        console.log('Other User ID:', req.params.otherUserId);
            const currentId = req.user.id 
            const otherId = req.params.otherUserId
            const conversation = await MessageService.getConversation(currentId, otherId)
            console.log(conversation)
            return res.json(conversation)
        } catch(e) {
            res.status(500).json({message: "controll getConversation error"})
        }
    }
   }

   export default MessageController 