import express from "express";

const app = express();

const PORT = 3030;

app.set('views', '${ __dirname }/build');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', express.static(`${__dirname}/build`));
app.get('/', (req, res) => {
	res.render('index', {});
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});