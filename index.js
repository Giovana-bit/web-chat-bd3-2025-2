// importando os módulos necessários
const express = require('express');
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const { Console, error } = require('console');

// criando a aplicação express e o servidor HTTP
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// configurando arquivos estáticos, views e ejs
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// rota principal
app.get('/', (req, res) => {
    res.render('index.html');
});

// conectando ao MongoDB
function connectDB() {
    let dbUrl = 'mongodb+srv://Giovana:aJn1CsroNtY6x0fY@cluster0.zsrgpf1.mongodb.net/'

    // Conexão com o banco de dados
    mongoose.connect(dbUrl);

    // Eventos de conexão de erro e sucesso
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback(){console.log("Conexão com o banco feita com sucesso!")});
}

let mensages = []; // array para armazenar mensagens

connectDB(); // chamando a função para conectar ao banco de dados

let Message = mongoose.model('Message', { usuario: String, data_hora: String, mensagem: String }); // definindo o modelo de mensagem

Message.find({}).then(docs=>{
    console.log("DOCS:"+  docs);
    
    mensages = docs; // carregando mensagens anteriores do banco de dados
    console.log("MENSAGES: " + mensages);
}).catch(error=>{ 
    console.log("ERRO: " + error); 
});

io.on('connection', (socket) => { 
    console.log('Usuário conectado ' + socket.id);

    socket.emit('previousMessage', mensages); // enviando mensagens anteriores ao novo usuário

    socket.on('sendMessage', (data) => {
       // mensages.push(data); // armazenando a nova mensagem

       let message = new Message(data); // criando uma nova instância de mensagem
        //socket.broadcast.emit('receivedMessage', data); // enviando a mensagem para todos os outros usuários

        message.save()
            .then(() => {
            // só emite para os outros clientes quando salvar no banco
            socket.broadcast.emit('receivedMessage', data);
             console.log("Mensagem salva no MongoDB:", data);
             })
            .catch(err => {
            console.error("Erro ao salvar no MongoDB:", err);
         });
    });
});

// servidor 
server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});