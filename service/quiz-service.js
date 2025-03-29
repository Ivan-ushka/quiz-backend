const db = require("../db/db");

class QuizService{
    async setQuiz({quiz}) {

        let maxQuizID = (await db.query(
            `SELECT id FROM quizzes WHERE id = (SELECT MAX(id) FROM quizzes);`
        ))[0][0];

        maxQuizID ? maxQuizID = maxQuizID.id + 1 :maxQuizID = 1

        quiz.quizID = maxQuizID.toString().padStart(6, '0')

        const insertedQuiz = (await db.query(
            'INSERT INTO quizzes (quizId, quiz, userId) VALUES (?, ?, ?)',
            [quiz.quizID, JSON.stringify(quiz), quiz.userID]
        ))

        return insertedQuiz[0]
    }

    async updateQuiz({ quiz }) {
        const [result] = await db.query(
            'UPDATE quizzes SET quiz = ? WHERE quizId = ?',
            [quiz.quiz, quiz.quizID]
        );

        if (result.affectedRows === 0) {
            throw new Error('Quiz not found or not updated.');
        }

        const [updatedQuiz] = await db.query('SELECT * FROM quizzes WHERE quizId = ?', [quiz.quizID]);
        return updatedQuiz[0];
    }

    async getAllQuizzes() {
        const [quizzes] = await db.query('SELECT * FROM quizzes');
        console.log(quizzes.map(item => item.quiz))
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

    async deleteQuizById(quizID) {
        console.log(quizID)
        const [result] = await db.query(
            'DELETE FROM quizzes WHERE quizId = ?',
            [quizID]
        );

        if (result.affectedRows === 0) {
            throw new Error('Quiz not found or not deleted.');
        }

        return { message: 'Quiz deleted successfully.' };
    }
}

module.exports = new QuizService();