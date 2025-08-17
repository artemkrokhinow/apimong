import Post from "../models/postModels.js"

const  PostService =  {
    async create(postData){
        const createdPost = await Post.create(postData)
        return createdPost
    },
     async getOne(id){
        if (!id){
        }
        const post = await Post.findById(id)
        return post
     },
     async getAll(){
        const posts = await Post.find()
        return posts
     },
     async update(id, postData){
        if (!id){
        }
        const updatedPost = await Post.findByIdAndUpdate(id, postData, {
            new: true, runValidators: true})
        return updatedPost
     },
     async delete(id) {
        if (!id){
        }
        const deletedPost = await Post.findByIdAndDelete(id)
        console.log(deletedPost)
        return deletedPost
     }
}
export default PostService