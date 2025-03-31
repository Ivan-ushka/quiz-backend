const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const quizController = require('../controllers/quiz-controller');
const authMiddleware = require('../middlewares/auth-middleware')
const router = new Router();
const {body} = require('express-validator')

router.post('/registration',
    body('name').isLength({min:4, max: 32}),
    body('pwd').isLength({min:4, max: 32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/user', userController.getUser);
router.get('/user/:id', userController.getUser);
router.patch('/update/user/', userController.update);

router.post('/set/quiz', quizController.setQuiz);
router.put('/update/quiz', quizController.updateQuiz);
router.get('/all/quizzes', quizController.getAllQuizzes);
router.get('/auth/quizzes',authMiddleware, quizController.getAuthQuizzes);
router.get('/quiz/:id', quizController.getQuizByID);
router.delete('/delete/quiz/:id', quizController.deleteQuiz);

module.exports = router;


