const port = 8081;

var express = require('express'),
    app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));


app.use(bodyParser.urlencoded({
   extended: false
}));

app.use(bodyParser.json());

var apiRoutes = express.Router(); 


apiRoutes.use(function(req, res, next) {

  var pwd = req.body.passwordInput;

  if (pwd == "abc@123") {
	
	next();
	
  } else {
	  
    return res.status(403).send({ 
        success: false, 
        message: 'False Password. Try again' 
    });

  }
});

apiRoutes.get('/download-area', function (req, res)  {
    res.send('LOL');
});



app.use('/', apiRoutes);

app.listen(port);