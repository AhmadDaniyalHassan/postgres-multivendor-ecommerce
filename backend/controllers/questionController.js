const User = require('../models/user');
const Question = require('../models/question');

const createQuestion = async (req, res) => {
    try {
        const { title, question, ProductId } = req.body
        const userId = req.params.userId
        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const newQuestion = await Question.create({
            title,
            question,
            userId,
            ProductId
        })
        return res.status(201).json({ message: 'Question created successfully', question: newQuestion })
    } catch (error) { res.status(500).json({ message: 'Error In Creating Questions' }) }
}


const getQuestion = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Find all questions associated with the specified product ID
        const questions = await Question.findAll({
            where: {
                ProductId: productId,
            },
            include: [{
                model: User,
                attributes: ['id', 'username'], // Include only the 'id' and 'username' attributes of the User model
            }],
        });

        res.status(200).json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in fetching questions', error });
    }
}


const editQuestion = async (req, res) => {
    try {
        const { title, question } = req.body
        const { questionId } = req.params
        const questions = await Question.findByPk(questionId)
        if (!questions) {
            return res.status(404).json({
                message: 'Question not found'
            })
        }
        questions.title = title
        questions.question = question
        await questions.save()
        console.log(question);
        return res.status(200).json({ message: 'Question updated successfully', question: question })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error In Updating Questions' })
    }
}


const deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params
        const question = await Question.findByPk(questionId)
        if (!question) {
            return res.status(404).json({
                message: 'Question not found'
            })
        }
        await question.destroy()
        return res.status(200).json({ message: 'Question deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error In Deleting Questions' })
        console.log(error);
    }
}
const editAnwerQuestion = async (req, res) => {
    try {
        const { answer } = req.body
        const { questionId } = req.params
        const question = await Question.findByPk(questionId)
        if (!question) {
            return res.status(404).json({
                message: 'Question not found'
            })
        }
        question.answer = answer
        await question.save()
        console.log(question);
        return res.status(200).json({ message: 'Question updated successfully', question: question })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error In Updating Questions' })

    }
}
module.exports = { createQuestion, getQuestion, editQuestion, deleteQuestion, editAnwerQuestion };
