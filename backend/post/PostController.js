import PostService from "./PostService.js"

const PostController = {
  async create(req, res ){
    try {
      const postData = req.body
      const createdPost = await PostService.create(postData)
      res.status(201).json(createdPost) } catch(e){
        res.status(500).json({message: 'fail create' + e.message})
      }
    },
  
  async getAll(req, res){
    try {
      const posts = await PostService.getAll()
      res.json(posts)
    }catch (e){
      res.status(500).json({message: 'take all fail' + e.message})
    }
    },
  async getOne(req, res){
    try{
      const postId  = req.params.id
      const post = await PostService.getOne(postId)
      if(!post){
        return res.status(404).json({message: '0 posts' })
      }
      res.json(post)
    } catch (e){
      res.status(500).json({message: 'error take post' + e.message})
    }
  },
  async update(req, res){
    try {
      const postId = req.params.id
      const updateData = req.body
if(Object.keys(updateData).length === 0 ){
  return res.status(400).json({message: "post = 0 "})
}
  const updatePost = await PostService.update(postId, updateData)
  if (!updatePost){
    return res.status(400).json({message: "post for update 0" })
  
  }
  res.json(updatePost)
    } catch (e){
      res.status(500).json({message: "fail update" + e.message})
    }
  },
  async delete (req, res ){
    try{ 
      const postId = req.params.id
      const deletedPost = await PostService.delete(postId)

      if (!deletedPost) {
        return res.status(400).json({message: 'post = 0'})
      }
      res.json({message: ' post delet', post: deletedPost})
    } catch(e){
      res.status(500).json({message: "fail delet" + e.message})
    }
  }
}
export default PostController
