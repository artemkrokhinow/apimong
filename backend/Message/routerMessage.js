import MessageController from "../auth/MessageController.js"
import MessageService from "./MessageService.js"
import {Router} from'express'
import authMiddleware  from '../middleware/authMiddleware.js'
import MongoMessage from '../models/messageModels.js'

const routerMessage = new Router()

routerMessage.post('/chat', authMiddleware, MessageController.create)
routerMessage.get('/chat/:otherUserId', authMiddleware, MessageController.getConversation)

export default routerMessage