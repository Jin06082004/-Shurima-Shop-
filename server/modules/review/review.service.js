const Review = require('./review.model');

module.exports = {
    CreateReview: async function (userId, productId, rating, comment) {
        let newReview = new Review({
            user: userId,
            product: productId,
            rating: rating,
            comment: comment
        });
        return await newReview.save();
    },
    GetAllReviews: async function () {
        return await Review.find()
            .populate('user', 'name auth')
            .populate('product', 'name price');
    },
    GetReviewById: async function (id) {
        return await Review.findById(id).populate('user').populate('product');
    },
    GetReviewsByProduct: async function (productId) {
        return await Review.find({ product: productId }).populate('user', 'name');
    },
    GetReviewsByUser: async function (userId) {
        return await Review.find({ user: userId }).populate('product', 'name front_image');
    },
    UpdateReview: async function (id, updateData) {
        return await Review.findByIdAndUpdate(id, updateData, { new: true });
    },
    DeleteReview: async function (id) {
        return await Review.findByIdAndDelete(id);
    }
};
