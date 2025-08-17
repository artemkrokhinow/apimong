import {Router} from "express"
import PostController from "./PostController.js"
import {authorValidator}from '../validations/PAuth.js'
const router = new Router()

router.post('/posts',authorValidator , PostController.create)
router.get('/posts', PostController.getAll)
router.get('/posts/:id', PostController.getOne)
router.put('/posts/:id', authorValidator, PostController.update) 
router.delete('/posts/:id', PostController.delete)

export default router  
