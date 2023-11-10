var express = require('express');
var app = express();

app.set('views', '${ __dirname }/build');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', express.static(`${__dirname}/build`));
app.get('/', (req : any, res: any) => {
	res.render('index', {});
});
var server = app.listen(3030, () => {
});