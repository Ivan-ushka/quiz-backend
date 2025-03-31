const db = require("../db/db");

class QuizService{
    async setQuiz({quiz}) {

        let maxQuizId = (await db.query(
            `SELECT id FROM quizzes WHERE id = (SELECT MAX(id) FROM quizzes);`
        ))[0][0];

        maxQuizId ? maxQuizId = maxQuizId.id + 1 :maxQuizId = 1

        quiz.quizId = maxQuizId.toString().padStart(6, '0')

        await db.query(
            'INSERT INTO quizzes (quizId, quiz, userId) VALUES (?, ?, ?)',
            [quiz.quizId, JSON.stringify(quiz), quiz.userId]
        )

        const [selectedQuiz] = await db.query('SELECT * FROM quizzes WHERE quizId = ?', [quiz.quizId]);

        return selectedQuiz[0]
    }

    async updateQuiz({ quiz }) {
        console.log(4, quiz)
        const [result] = await db.query(
            'UPDATE quizzes SET quiz = ? WHERE quizId= ?',
            [JSON.stringify(quiz), quiz.quizId]
        );

        console.log(5, result)

        if (result.affectedRows === 0) {
            throw new Error('Quiz not found or not updated.');
        }

        const [updatedQuiz] = await db.query('SELECT * FROM quizzes WHERE quizId = ?', [quiz.quizId]);

        console.log(6, updatedQuiz)
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

    async getQuizById(quizId) {
        try {
            const [result] = await db.query('SELECT * FROM quizzes WHERE quizId = ?', [quizId]);
            return result[0]; // Return the quiz if found
        } catch (error) {
            throw error;
        }
    }

    async deleteQuizById(quizId) {
        const [result] = await db.query(
            'DELETE FROM quizzes WHERE quizId = ?',
            [quizId]
        );

        if (result.affectedRows === 0) {
            throw new Error('Quiz not found or not deleted.');
        }

        return { message: 'Quiz deleted successfully.' };
    }
}

module.exports = new QuizService();