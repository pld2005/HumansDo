// Load the TCP Library
net = require('net');
var moment = require('moment');
var mongoose = require('mongoose'),
	crypto = require('crypto');

var mubsub = require('mubsub');
var client = mubsub('mongodb://localhost/mra-dev');
var channel = client.channel('sync');

client.on('error', console.error);
channel.on('error', console.error);

channel.subscribe('sync', function (message) {
    console.log(message); // => 'bar'
});


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
		firstdata: {type: Date},
		uptimeminutes: {type: Number},
		uptime: {type: String},
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
  	// Identify this client
  	socket.name = socket.remoteAddress + ":" + socket.remotePort 

  	// Handle incoming messages from clients.
  	socket.on('close', function (sock){
  		console.log('Socket Closed! -----------------------');
  	});

	socket.on('error', function  (err) {
		console.log("Socket error: ");
	    console.log(err.stack);
	}); 

  	socket.on('data', function (data) {
  		data = JSON.parse(data);
		if (data.header=='$auth') {
			validarUsuario(data.user,data.pass,socket);
		}else if (data.header=='$data'){
			socket.write('ok');
			userid = socket.user._id;
			guardarTrama(userid, data);
		}else if (data.header=='$end'){
			channel.publish('ips', {update: new Date()});
			console.log('FIN--------------------');
		}

  	});
 
 	function guardarTrama (userid, trama){
  		
		Ip.findOne({ $and: [
 			{ groupname: trama.groupname }, 
 			{ devicekey: trama.devicekey },
 			{ entrancekey: trama.entrancekey },
 			{ ip: trama.ip  }]}, function(err, ip) {
    			if(!err) {
					var ahoraLocal = moment(new Date()).add(trama.timeoffset, 'hours');;

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
						//es la primer trama de esta ip, guardar la fecha 
						ip.firstdata = new Date();
						ip.uptimeminutes = 0;
						ip.uptime = '100%';
			        }else{
			        	var signo;
						if (trama.statusping !== 'Success') {
							//SIN PING
							//ip.lastpingsuccess	= trama.lastping;
							ip.status = "error";
							signo = -1;
						}else{
							//CON PING
							ip.status = "success";
							signo = 1;
						}

						//actualizar uptime
						var tiempoTotal;
						var tiempoParcial;
						tiempoParcial = (((ahoraLocal - ip.firstdata)/1000)/60)*signo;
						tiempoTotal = (((ahoraLocal - ip.firstdata)/1000)/60);
						
						var uptime = Math.round( tiempoParcial*100/tiempoTotal, 2)
						ip.uptimeminutes =  ip.uptimeminutes+tiempoParcial;


						ip.uptime =  uptime + '%';
			        }

			        //verificar desde cuando tiene conteo
			        var tiemposinconteo;
			        console.log('timeoff ' + trama.timeoffset);
			        var ultimoconteo = moment(new Date(trama.lastcount)).add(trama.timeoffset, 'hours');
			       
			        

			        tiemposinconteo = (((ahoraLocal - ultimoconteo)/1000)/60);
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
					ip.lastvisitas = trama.lastvisitas    
					ip.lastping = trama.lastping;    
					ip.ttl = trama.ttl;           
					ip.roundtrip = trama.roundtrip;    
					ip.buffer = trama.buffer;         
					ip.created = new Date();
					ip.user =  userid;

			        ip.save(function(err) {
			            if(!err) {
			                console.log("d_ID: " + trama.devicekey + " e_ID: " + trama.entrancekey + " IP: " + trama.ip + " UPDATED!");
			                
			            }
			            else {
			                console.log("Error: could not save ip " + err);
			                console.log("             " + trama.devicekey);
			                console.log("             " + trama.entrancekey);
			                console.log("             " + trama.lastvisitas);
			            }
			        });
	    		}
			}); 		
 	}

 	function validarUsuario(username, password,sock){
 		var res;
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

}).listen(4000);
 
// Put a friendly message on the terminal of the server.
console.log("Server running at port 4000\n");
