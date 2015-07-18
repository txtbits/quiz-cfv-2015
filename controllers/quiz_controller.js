var models = require ('../models/models.js');

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models
	.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	})
	.then(
		function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error('No existe quizId='+quizId));
			}
		}).catch(function (error){next(error);});
};

//GET quizes
exports.index = function (req, res){
	var search="%";
	if(req.query.search && req.query.search.trim().length){
		search=req.query.search.replace(/\s/g,"%");
		search="%"+search+"%";
		search=search.toLowerCase();
	}
	models
	.Quiz.findAll({where: ["LOWER(pregunta) like ?", search],order:"pregunta"})
	.then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes, search: req.query.search, errors: []});	
	}).catch(function (error){next(error);});
};

//GET quizes/:id
exports.show = function (req, res){
	res.render('quizes/show', {quiz: req.quiz, errors: []});	
};

//GET quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta.toLowerCase()== req.quiz.respuesta.toLowerCase()){
	        resultado = 'Correcto';
	    }
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET quizes/new
exports.new =  function (req, res) {
	var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta"});
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
  	quiz
  	.validate()
  	.then(
    	function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz 
				.save({fields: ["pregunta","respuesta","tema"]})
				.then( function(){ res.redirect('/quizes')}) 
    		}
  		});
	};

//Version alternativa
/*
exports.create = function (req,res){
	var quiz = models.Quiz.build(req.body.quiz);
	var errors = quiz.validate();
	if (errors){
		var i = 0;
		var errores = new Array();
		for (var prop in errors) {
			errores[i++] = {message: errors[prop]};
		}
		res.render('quizes/new', {quiz: quiz, errors: errores});
	}
	else {
		quiz
		.save({fields: ["pregunta","respuesta"]})
		.then(function (){res.redirect('/quizes')});
	}
};
*/
//GET /quizes/:quizId/edit
exports.edit = function (req,res){
	var quiz = req.quiz; //autoload de instancia de quiz
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:quizId  
exports.update = function (req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;
	req.quiz
	.validate()
	.then(function(err){
		if(err){
			res.render('quizes/edit', {quiz:req.quiz, errors: err.errors});
		} else {
			req.quiz
			.save({fields: ["pregunta","respuesta","tema"]})
			.then(function (){res.redirect('/quizes')});
		}
	})
};

//DELETE /quizes/:quizId  
exports.destroy = function (req,res){
	req.quiz.destroy()
	.then(function(){
		res.redirect('/quizes');})
	.catch(function(error){next(error)});
};
