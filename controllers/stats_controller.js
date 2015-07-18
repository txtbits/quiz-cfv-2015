var models = require ('../models/models.js');

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.getstats = function(req, res, next){
	var stats = {'totPregs':0,
			'totComm': 0,
			'pregsConComm': 0,
			'commHidden': 0
			}
	models
	.Quiz.findAll({
		include: [{model: models.Comment}]
	})
	.then(
		function(quiz){
			stats['totPregs'] = quiz.length;

			for(var i in quiz){
				if(quiz[i].Comments){
					stats['totComm']+=quiz[i].Comments.length;
					if(quiz[i].Comments.length>0){
						stats['pregsConComm']++;	
					} 					
				} 
			}
			for( var key in stats){console.log(key+": "+stats[key]);}
			//res.render('quizes/statistics', {stats: stats, errors: []});	
		}).catch(function (error){next(error);});

	
       
	models.Comment.findAndCountAll({where: {publicado:false}})
	.then(function(result){
		stats['commHidden']=result.count;
		res.render('quizes/statistics', {stats: stats, errors: []});	
	}).catch(function (error){next(error);});
   
};
