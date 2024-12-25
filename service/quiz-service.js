const db = require("../db/db");
const ApiError = require("../exseptions/api-error");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/user-dto");
const tokenService = require("./token-service");

class QuizService{

    async setQuiz({quiz}) {
        let maxQuizID = (await db.query(
            `SELECT id FROM quizzes  WHERE id = (SELECT MAX(id) FROM quizzes);`
        ))[0][0];
        maxQuizID ?  maxQuizID = maxQuizID.id + 1 :maxQuizID = 1

        quiz.quizID = maxQuizID.toString().padStart(6, '0')

        const insertedQuiz = (await db.query(
            'INSERT INTO quizzes (quizId, quiz, userId) VALUES (?, ?, ?)',
            [quiz.quizID, JSON.stringify({quiz}), quiz.userID]
        ))[0]

        return insertedQuiz
    }

    async updateQuiz({ quiz }) {
        const [result] = await db.query(
            'UPDATE quizzes SET quiz = ? WHERE quizId = ?',
            [quiz.quiz, quiz.quizID]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            throw new Error('Quiz not found or not updated.');
        }

        // Optionally, you can retrieve the updated quiz
        const [updatedQuiz] = await db.query('SELECT * FROM quizzes WHERE quizId = ?', [quiz.quizID]);
        return updatedQuiz[0]; // Return the updated quiz
    }

    async getAllQuizzes() {
        const [quizzes] = await db.query('SELECT * FROM quizzes');
        return quizzes.map(item => item.quiz);
    }

    async getAuthQuizzes(id) {
        const [quizzes] = await db.query('SELECT * FROM quizzes WHERE userId = ?', [id]);
        return quizzes.map(item => item.quiz);
    }

    async getQuizByID(quizID) {
        try {
            const [result] = await db.query('SELECT * FROM quizzes WHERE quizId = ?', [quizID]);
            return result[0]; // Return the quiz if found
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new QuizService();