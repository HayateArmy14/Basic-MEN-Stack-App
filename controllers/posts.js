const Post = require("../models/post")
const {cloudinary} = require("../cloudinary")

module.exports = {
    //POSTS Index
    async postIndex(req, res, next) {
        let posts = await Post.paginate({}, {
			page: req.query.page || 1,
			limit: 10
		})
		//turn the result from string to number
		posts.page = Number(posts.page)
        res.render("posts/index", {posts, title:"Posts Index"})
    },

    //POSTS New
    postNew(req, res, next) {
        res.render("posts/new")
    },

    //POSTS Create
    async postCreate(req, res, next) {
        req.body.post.images = []
        for (const file of req.files) {
          req.body.post.images.push({
              path: file.path,
              filename: file.filename
          })
        }
		req.body.post.author = req.user._id;
        let post = await Post.create(req.body.post);
		req.session.success = "Post created Successfully"
        res.redirect(`/posts/${post.id}`)
    },

    //Posts show 
    async postShow(req, res, next) {
        let post = await Post.findById(req.params.id).populate({
			path:"reviews",
			options: {sort: { "_id": -1 }},
			populate: {
				path: "author",
				model: "User"
			}
		});
		const floorRating = post.calculateAvgRating();
        res.render("posts/show", {post, floorRating})
    },

    //Post edit

    async postEdit(req, res, next) {
        res.render("posts/edit")
    },

    //Posts Update 
    async postUpdate(req, res, next) {
		// destructure post from res.locals
		const {post} = res.locals;
		// check if there's any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length) {	
			// assign deleteImages from req.body to its own variable
			let deleteImages = req.body.deleteImages;
			// loop over deleteImages
			for(const filename of deleteImages) {
				// delete images from cloudinary
				await cloudinary.uploader.destroy(filename);
				// delete image from post.images
				for(const image of post.images) {
					if(image.filename === filename) {
						let index = post.images.indexOf(image);
						post.images.splice(index, 1);
					}
				}
			}
		}
		
		if(req.files) {
			for(const file of req.files){
				post.images.push({
					path: file.path,
					filename: file.filename
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
    async postDestroy(req, res, next) {

		const {post} = res.locals;
		for(const image of post.images) {
			await cloudinary.uploader.destroy(image.filename)
		}
		await post.remove();
		req.session.success = "Post deleted Succesfully"
		res.redirect("/posts")
	}
}