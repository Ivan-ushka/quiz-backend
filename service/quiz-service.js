const db = require("../db/db");
const ApiError = require("../exseptions/api-error");
const bcrypt = require("bcrypt");
const UserDto = require("../dtos/user-dto");
const tokenService = require("./token-service");

class QuizService{

    async setQuiz({quiz}) {
        let maxQuizID = (await db.query(
            `SELECT id FROM quizzes  WHERE id = (SELECT MAX(id) FROM quizzes);`
        )).rows[0];
        maxQuizID ?  maxQuizID = maxQuizID.id + 1 :maxQuizID = 1
        quiz.quizID = maxQuizID.toString().padStart(6, '0')

        const insertedQuiz = (await db.query(
            'INSERT INTO quizzes (quizId, quiz, userId) VALUES ($1, $2, $3) RETURNING *',
            [quiz.quizID, {quiz}, quiz.userID] // Replace `5` with the appropriate user ID
        )).rows[0]

        return insertedQuiz
    }

    async updateQuiz({quiz}){
        const updatedQuiz = (await db.query(
            'UPDATE quizzes SET quiz = $1 WHERE quizid = $2 RETURNING *',
            [quiz, quiz.quizID]
        )).rows[0];

        return updatedQuiz;
    }

    async getAllQuizzes(){
        let quizzes = (await db.query('SELECT * FROM quizzes')).rows
        quizzes = quizzes.map(item => item.quiz)
        return quizzes
    }

    async getAuthQuizzes(id){
        let quizzes = (await db.query('SELECT * FROM quizzes where userID =$1',[id])).rows
        quizzes = quizzes.map(item => item.quiz)
        return quizzes
    }

    async getQuizByID(quizID){
        try {
            const query = 'SELECT * FROM quizzes WHERE quizID = $1';
            const result = await db.query(query, [quizID]);
            const quiz = result.rows[0];
            return quiz;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = new QuizService();