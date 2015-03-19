var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 3001;


var mubsub = require('mubsub');
var client = mubsub('mongodb://localhost/mra-dev');
var channel = client.channel('sync');

client.on('error', console.error);
channel.on('error', console.error);

channel.subscribe('sync', function (message) {
    console.log(message); // => 'bar'
});

//channel.publish('ips', {  });

app.get('/',function(req,res){
	//request : son cabeceras y datos que nos envia el navegador.
	//response : son todo lo que enviamos desde el servidor.
	res.sendFile(__dirname + '/index.html');
});


 
io.on('connection',function(socket){
	console.log("usuario id : %s",socket.id);
 	var ch = 'channel-a';
 
	socket.join(ch);


	//---------------------------------------------------------------------------
	channel.on('document', function(){
		//socket.broadcast.emit('message', 'El usuario '+socket.id+' se ha conectado!','System');
		console.log('update!')
		socket.emit('message', 'actualizar vista!','System');

	});
	//--------------------------------------------------------------------------- 




	socket.on('message',function(msj){
		//io.emit('message',msj,socket.id);
		io.sockets.in(ch).emit('message',msj,socket.id); //enviar a todos del canal
		//socket.broadcast.to(channel).emit('message',msj,socket.id); //enviar a todos del canal menos a mi
	});
 
	socket.on('disconnect',function(){
		console.log("Desconectado : %s",socket.id);
	});
 
	/*socket.on('change channel',function(newChannel){
		socket.leave(channel);
		socket.join(newChannel);
		channel = newChannel;
		socket.emit('change channel',newChannel);
	});*/
 
});
 
http.listen(PORT,function(){
	console.log('el servidor esta escuchando el puerto %s',PORT);
});