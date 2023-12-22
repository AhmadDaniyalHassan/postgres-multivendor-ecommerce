const User = require('../models/user');
const Review = require('../models/review');

const createReview = async (req, res) => {
    try {
        const { review, rating, ProductId } = req.body
        const userId = req.params.userId
        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const reviewData = await Review.create({
            review,
            rating,
            ProductId,
            userId
        })
        return res.status(201).json({ message: 'Review created successfully', review: reviewData })
    } catch (error) {
        res.status(500).json({ message: 'Error In Creating Review' })
    }
}


const getReview = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find all reviews associated with the specified product ID
        const reviews = await Review.findAll({
            where: {
                ProductId: productId,
            },
            include: [{
                model: User,
                attributes: ['id', 'username'], // Include only the 'id' and 'username' attributes of the User model
            }],
        });

        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in fetching reviews', error });
    }
};



const editReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const { review, rating } = req.body
        const reviewData = await Review.findByPk(reviewId)
        if (!reviewData) {
            return res.status(404).json({
                message: 'Review not found'
            })
        }
        reviewData.review = review
        reviewData.rating = rating
        await reviewData.save()
        return res.status(200).json({ message: 'Review updated successfully', review: reviewData })
    } catch (error) {
        res.status(500).json({ message: 'Error In Updating Review' })
        console.log(error);
    }
}


const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findByPk(reviewId)
        if (!review) {
            return res.status(404).json({
                message: 'Review not found'
            })
        }
        await review.destroy()
        return res.status(200).json({ message: 'Review deleted successfully' })

    } catch (error) {

    }
}
module.exports = { createReview, getReview, editReview, deleteReview };
