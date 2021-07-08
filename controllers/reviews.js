const Post = require("../models/post")
const Review = require("../models/review")

module.exports = {
    //Reviews Create
    async reviewCreate(req, res, next) {
        //find Post by its id
            let post =await Post.findById(req.params.id).populate("reviews").exec();
            let hasReviewed = post.reviews.filter(review => {
                return review.author.equals(req.user._id);
            }).length
            if(hasReviewed) {
                req.session.error = "Sorry you can only create one review per report"
                return res.redirect(`/posts/${post.id}`)
            }
        //create a review
            req.body.review.author = req.user._id;
            let review = await Review.create(req.body.review)
        //assign review to post
            post.reviews.push(review);
        //sacve post
        post.save();
        // redirect to tj4e post
        req.session.success = "Review Created Successfully"
        res.redirect(`/posts/${post.id}`);
    },
    //Posts Update 
    async reviewUpdate(req, res, next) {
		await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
        req.session.success = "Review Updated Successfully"
        res.redirect(`/posts/${req.params.id}`)
	},
    async reviewDestroy(req, res, next) {
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: {reviews: req.params.review_id}
        })
        await Review.findByIdAndRemove(req.params.review_id)
        req.session.success = "Review Deleted Successfully"
        res.redirect(`/posts/${req.params.id}`)
	}
}