const quizService = require("../service/quiz-service");
const userService = require("../service/user-service");

class QuizController{
    async setQuiz(req, res, next){
        try {
            const quiz = req.body;
            const quizData = await quizService.setQuiz(quiz);
            return res.json(quizData);
        } catch (error) {
            next(error);
        }
    }

    async updateQuiz(req, res, next){
        try {
            const quiz = req.body;
            const quizData = await quizService.updateQuiz(quiz);
            return res.json(quizData);
        } catch (error) {
            next(error);
        }
    }

    async getAllQuizzes(req, res, next){
        try {
            const quizData = await quizService.getAllQuizzes();
            return res.json(quizData);
        } catch (error) {
            next(error);
        }
    }

    async getAuthQuizzes(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData  = await userService.refresh(refreshToken);
            const quizzes = await quizService.getAuthQuizzes(userData.user.id)
            return res.json(quizzes);
        } catch (error) {
            next(error);
        }
    }

    async getQuizByID(req, res, next) {
        try {
            const quizId = req.params.id;
            const quizData = await quizService.getQuizById(quizId);
            return res.json(quizData);
        } catch (error) {
            next(error);
        }
    }

    async deleteQuiz(req, res, next) {
        try {
            const quizId = req.params.id;
            return res.json(await quizService.deleteQuizById(quizId));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new QuizController();