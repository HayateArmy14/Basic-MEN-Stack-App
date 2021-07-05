const Post = require("../models/post")
const cloudinary = require("cloudinary")

cloudinary.config({
    cloud_name: "dbetljphk",
    api_key: "522894463171735",
    api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = {
    //POSTS Index
    async postIndex(req, res, next) {
        let posts = await Post.find({})
        res.render("posts/index", {posts})
    },

    //POSTS New
    postNew(req, res, next) {
        res.render("posts/new")
    },

    //POSTS Create
    async postCreate(req, res, next) {
        req.body.post.images = []
        for (const file of req.files) {
          let image =  await cloudinary.v2.uploader.upload(file.path)
          req.body.post.images.push({
              url: image.secure_url,
              public_id: image.public_id
          })
        }
        let post = await Post.create(req.body.post);
        res.redirect(`/posts/${post.id}`)
    },

    //Posts show 
    async postShow(req, res, next) {
        let post = await Post.findById(req.params.id)
        res.render("posts/show", {post})
    },

    //Post edit

    async postEdit(req, res, next) {
        let post = await Post.findById(req.params.id);
        res.render("posts/edit", {post})
    },

    //Posts Update 
    async postUpdate(req, res, next) {
		// destructure post from res.locals
		let post = await Post.findById(req.params.id)
		// check if there's any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {	
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const public_id of deleteImages) {
				// delete images from cloudinary
				await cloudinary.v2.uploader.destroy(public_id);
				// delete image from post.images
				for(const image of post.images) {
					if(image.public_id === public_id) {
						let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		
		if(req.files) {
			for(const file of req.files){
				let image = await cloudinary.v2.uploader.upload(file.path);
				post.images.push({
					url: image.secure_url,
					public_id: image.public_id
				})
			}
		}
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.price = req.body.post.price;
		post.location = req.body.post.location
		// save the updated post into the db
		 post.save();
		// redirect to show page
		res.redirect(`/posts/${post.id}`);
	},

    //Posts Destroy 
    // async postDestroy(req, res, next) {
    //     await Post.findByIdAndRemove(req.params.id);
    //     res.redirect("/posts")
    // }
    async postDestroy(req, res, next) {

		let post = await Post.findById(req.params.id);
		for(const image of post.images) {
			await cloudinary.v2.uploader.destroy(image.public_id)
		}
		await post.remove();
		res.redirect("/posts")
	}
}