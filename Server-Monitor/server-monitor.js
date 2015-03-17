// Load the TCP Library
net = require('net');

var mongoose = require('mongoose'),
	crypto = require('crypto');


var db = mongoose.connection;

db.on('error', console.error);
//db.once('open', function() {
	/**
	* Module dependencies.
	*/
	var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

	/**
	* Ip Schema
	*/
	var IpSchema = new Schema({
		groupname: {type: String},
		ip: {type: String},
		status: {type: String},	
		statusping: {type: String},	
		site: {type: String},	
		zone: {type: String},	
		entrance: {type: String},
		devicetype: {type: String},
		devicekey: {type: String},
		entrancekey: {type: String},
		lastin: {type: String},	
		lastout: {type: String},
		lastcount: {type: Date},
		lastvisitas: {type: Date},
		lastpint: {type: Date},
		lastpingsuccess: {type: Date},
		ttl: {type: String},
		roundtrip: {type: String},
		buffer: {type: String},
		created: {type: Date, default: Date.now},
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		}
	});

	mongoose.model('Ip', IpSchema);

		/**
	 * User Schema
	 */
	var UserSchema = new Schema({
		firstName: {
			type: String,
			trim: true,
			default: ''
		},
		lastName: {
			type: String,
			trim: true,
			default: ''
		},
		displayName: {
			type: String,
			trim: true
		},
		empresa: {
			type: Schema.ObjectId,
			ref: 'Empresa',
			required: 'Ingrese la empresa'
		},
		email: {
			type: String,
			trim: true,
			default: '',
			match: [/.+\@.+\..+/, 'Ingrese una dirección de email válida']
		},
		username: {
			type: String,
			unique: 'El nombre de usuario ya existe',
			required: 'Ingrese el nombre de usuario',
			trim: true
		},
		password: {
			type: String,
			default: ''
		},
		salt: {
			type: String
		},
		provider: {
			type: String,
			required: 'Provider is required'
		},
		providerData: {},
		additionalProvidersData: {},
		roles: {
			type: [{
				type: String,
				enum: ['user', 'admin', 'superadmin']
			}],
			required: 'Ingrese el Rol del usuario',
			default: ['user'],
		},
		updated: {
			type: Date
		},
		created: {
			type: Date,
			default: Date.now
		},
		/* For reset password */
		resetPasswordToken: {
			type: String
		},
		resetPasswordExpires: {
			type: Date
		}
	});

	mongoose.model('User', UserSchema);

//});

mongoose.connect('mongodb://localhost/mra-dev');

User = mongoose.model('User'); 
Ip = mongoose.model('Ip'); 
 
// Start a TCP Server
net.createServer(function (socket) {
try {

  	// Identify this client
  	socket.name = socket.remoteAddress + ":" + socket.remotePort 

  	// Handle incoming messages from clients.
  	socket.on('close', function (sock){
  		console.log(sock.name + ' Cerrado! -----------------------')

  	});

	socket.on('error', function  (err) {
		console.log("Socket error: ");
	    console.log(err.stack);
	}); 

  	socket.on('data', function (data) {
  		data = JSON.parse(data);
		console.log('DATA  -->> ' + data);
if (data.header=='$auth') {
	validarUsuario(data.user,data.pass,socket);
}else if (data.header=='$data'){
	socket.write('ok');
	userid = socket.user._id;
	guardarTrama(userid, data);
}
		/**********************************+
		var arrData = data.toString().split('|');
		//reviso cabecera para ver que estan enviando
		//si viene $auth, verificar si el usuario existe
		if (arrData[0]==='$auth'){
			var u = arrData[1];
			var p = arrData[2];
			validarUsuario(u,p,socket);

			//console.log('USER ' + socket.name + ' -->> ' + data);
		}else if (arrData[0]==='$data'){
			//console.log('DATA ' + socket.name + ' -->> ' + data);
			socket.write('ok');
			userid = socket.user._id;
			guardarTrama(userid, arrData);
		}
		***********************************/

  	});
 
 	function guardarTrama (userid, trama){
  		/***********************
  		var trama = {
	 		group: arrayData[1],
	 		ip: arrayData[2],
	 		statusping: arrayData[3],
	 		site: arrayData[4],
	 		zone: arrayData[5],
	 		entrance: arrayData[6],
	 		devicetype: arrayData[7],
	 		devicekey: arrayData[8],
	 		entrancekey: arrayData[9],
	 		lastin: arrayData[10],
	 		lastout: arrayData[11],
	 		lastcount: arrayData[12],
	 		lastvisitas: arrayData[13],
	 		lastping: arrayData[14],
	 		ttl: arrayData[15],
	 		roundtrip: arrayData[16],
	 		buffer: arrayData[17]
  		}
  		**********************/
		//console.log(trama);
		Ip.findOne({ $and: [
 			{ groupname: trama.groupname }, 
 			{ devicekey: trama.devicekey },
 			{ entrancekey: trama.entrancekey },
 			{ ip: trama.ip  }]}, function(err, ip) {
    			if(!err) {
        			if(!ip) {
        				//No encontro el registro, crear uno nuevo
			            ip = new Ip();
						console.log('nueva ip');
						if (trama.statusping !== 'Success') {
							// SIN PING
							ip.lastpingsuccess	= new Date('1900-01-01');
							ip.status = "error"
						}else{
							// CON PING
							ip.lastpingsuccess	= trama.lastping;
							ip.status = "success"
						}
			        }else{
						if (trama.statusping !== 'Success') {
							//SIN PING
							ip.lastpingsuccess	= trama.lastping;
							ip.status = "error";
						}else{
							//CON PING
							ip.status = "success";
						}
			        }

			        //verificar desde cuando tiene conteo
			        var tiemposinconteo;
			        var ultimoconteo = new Date(trama.lastcount);
			        var ahora = new Date();
			        tiemposinconteo = (((ahora - ultimoconteo)/1000)/60);
					if (tiemposinconteo > 60 && ip.status == 'success') {
						ip.status = "warning";
					}else{

					}



					ip.groupname = trama.groupname;        
					ip.ip = trama.ip;              
					ip.statusping = trama.statusping;  
		        	ip.site = trama.site;          
		        	ip.zone = trama.zone;          
					ip.entrance = trama.entrance;    
					ip.devicetype = trama.devicetype;    
					ip.devicekey = trama.devicekey;    
					ip.entrancekey = trama.entrancekey;    
					ip.lastin = trama.lastin;      
					ip.lastout = trama.lastout;     
					ip.lastcount = trama.lastcount;     
					ip.lastvisitas = trama.lastvisitas;    
					ip.lastping = trama.lastping;    
					ip.ttl = trama.ttl;           
					ip.roundtrip = trama.roundtrip;    
					ip.buffer = trama.buffer;         
					ip.created = new Date();
					ip.user =  userid;

			        ip.save(function(err) {
			            if(!err) {
			                console.log("IP ID" + ip._id + " created at " + ip.entrance );
			            }
			            else {
			                console.log("Error: could not save ip " + err);
			            }
			        });
	    		}
			}); 
		
 	}

 	function validarUsuario(username, password,sock){
 		var res;
console.log('u: ' + username );
console.log('p: ' + password );

 		User.findOne({
 			username: username
			}).exec(function(err, user) {
				if (err) {
					sock.write('Acceso denegado!');
					//sock.destroy();
					return false;
				}
				if (!user) {
					sock.write('Acceso denegado1!');
					return false;
					
					//sock.destroy();
				}
				if (user.password != crypto.pbkdf2Sync(password, user.salt, 10000, 64).toString('base64')) {
					sock.write('Acceso denegado!');
					return false;
					
					//sock.destroy();
				}
				res = user;
				sock.name = user._id.toString();
				sock.user = user;
				sock.write('ok!');
			});	


 	}


} catch (ex) {
    console.log("ERROR " + ex);
}

}).listen(4000);
 
// Put a friendly message on the terminal of the server.
console.log("Server running at port 4000\n");
