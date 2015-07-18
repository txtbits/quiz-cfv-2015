var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var creditsController = require('../controllers/credits_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statsController = require('../controllers/stats_controller');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Autoload de comandos con :quizId y commentId
router.param('quizId',		quizController.load);
router.param('commentId',	commentController.load); 

//Definicion de rutas de sesion
router.get('/login',	sessionController.new);
router.post('/login',	sessionController.create);
router.get('/logout',	sessionController.destroy);

//definicion de rutas de /quizes
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new', 					sessionController.loginRequired, quizController.new);
router.post('/quizes/create', 				sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', 		sessionController.loginRequired, quizController.destroy);

//definicion de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',	sessionController.loginRequired, commentController.publish);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/unpublish',	sessionController.loginRequired, commentController.unpublish);
router.delete('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)',	sessionController.loginRequired, commentController.destroy);

//Opcional final 
router.get('/quizes/statistics',			statsController.getstats);

//Definicion de rutas custom
router.get('/author', 						creditsController.credits);


/*  //Forma alternativa sin usar controllers
router.get('/author', function (req, res, next) {
  res.render('author', {});
});
*/

module.exports = router;
