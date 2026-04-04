const reviewService = require('./review.service');
const { createReviewSchema, updateReviewSchema } = require('./review.validation');

module.exports = {
    // POST /review
    create: async (req, res) => {
        try {
            const { error } = createReviewSchema.validate(req.body);
            if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

            const { userId, productId, rating, comment } = req.body;
            const newReview = await reviewService.CreateReview(userId, productId, rating, comment);
            res.status(201).json({ status: 'success', data: newReview });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },
    
    // GET /review
    getAll: async (req, res) => {
        try {
            const reviews = await reviewService.GetAllReviews();
            res.status(200).json({ status: 'success', data: reviews });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // GET /review/:id
    getById: async (req, res) => {
        try {
            const review = await reviewService.GetReviewById(req.params.id);
            if (!review) return res.status(404).json({ status: 'error', message: 'Review not found' });
            res.status(200).json({ status: 'success', data: review });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // GET /review/product/:productId
    getByProduct: async (req, res) => {
        try {
            const reviews = await reviewService.GetReviewsByProduct(req.params.productId);
            res.status(200).json({ status: 'success', data: reviews });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // GET /review/user/:userId
    getByUser: async (req, res) => {
        try {
            const reviews = await reviewService.GetReviewsByUser(req.params.userId);
            res.status(200).json({ status: 'success', data: reviews });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // PUT /review/:id
    update: async (req, res) => {
        try {
            const { error } = updateReviewSchema.validate(req.body);
            if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

            const updatedReview = await reviewService.UpdateReview(req.params.id, req.body);
            if (!updatedReview) return res.status(404).json({ status: 'error', message: 'Review not found' });
            res.status(200).json({ status: 'success', data: updatedReview });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    // DELETE /review/:id
    delete: async (req, res) => {
        try {
            const result = await reviewService.DeleteReview(req.params.id);
            if (!result) return res.status(404).json({ status: 'error', message: 'Review not found' });
            res.status(200).json({ status: 'success', message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};
