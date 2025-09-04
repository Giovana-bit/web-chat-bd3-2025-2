// importando os módulos necessários
const express = require('express');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

// criando a aplicação express e o servidor HTTP
const app = express();
const server = http.createServer(app);

// configurando arquivos estáticos, views e ejs
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// rota principal
app.get('/', (req, res) => {
    res.render('index.html');
});

// servidor 
server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
