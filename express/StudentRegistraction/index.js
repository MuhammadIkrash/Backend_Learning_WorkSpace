import express from 'express'
const app = express();
app.set('view engine', "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/show-contact', (req, res) => {
    res.send('Hello World!');
});
app.get('/add-contact', (req, res) => {
    res.send('Hello World!');
});
app.post('/add-contact', (req, res) => {
    res.send('Hello World!');
});
app.put('/update-contact', (req, res) => {
    res.send('Hello World!');
});
app.get('/update-contact', (req, res) => {
    res.send('Hello World!');
});
app.delete('/delete-contact', (req, res) => {
    res.send('Hello World!');
});
app.listen(3000, () => {
    console.log('Server app listening on 3000 port!');
});
