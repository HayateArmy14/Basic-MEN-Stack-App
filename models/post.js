const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review = require("./review");
const mongoosePaginate  = require("mongoose-paginate")

const PostSchema = new Schema ({
    title: String, 
    price: String, 
    description: String,
    images: [{
        path: String,
        filename: String
    }],
    location: String,
    lat: Number,
    lng: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    avgRating :{ type: Number, default: 0}
})

PostSchema.pre("remove", async function() {
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    })
})


PostSchema.methods.calculateAvgRating = function () {
    let ratingsTotal = 0;
    if(this.reviews.length){
    this.reviews.forEach(review => ratingsTotal += review.rating)
    }else{
        this.avgRating = ratingsTotal;
    }
    this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) /10;
    const floorRating = Math.floor(this.avgRating);
    this.save();
    return floorRating;
}

PostSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("Post", PostSchema)