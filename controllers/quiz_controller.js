var models = require('../models/models.js')

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId). then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next()
			} else { next(new_Error('No existe quizId' + quizId));}
		}
		).catch(function(error) { next(error);});
};
var models = require('../models/models.js')

//GET /author
exports.author = function(req, res){
	res.render('author', {autor: 'Christian Forcada Vitalla'})
}

//GET /quizes
exports.index = function(req,res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index', { quizes: quizes});
	}).catch(function(error) { next (error);})
};

//GEt /quizes/:Id
exports.show = function(req,res) {
	res.render('quizes/show', { quiz: req.quiz});
//GEt /quizes/question
exports.question = function(req,res) {
	models.Quiz.findAll().then(function(quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta});
	})
};

//GEt /quizes/:Id/answer
exports.answer = function(req,res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}	
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};