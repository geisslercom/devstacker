'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Packet = mongoose.model('Packet'),
	_ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	replace = require('replace');

exports.gen = function(req, res){
	var payload = req.body;
	console.log(payload);
	var statics = fs.readFileSync("./app/shell/main.sh", 'utf8')
	if (Buffer.isBuffer(statics)) statics = statics.toString('utf8') ;
	
	if (payload.shell) statics = statics.replace("<% packets.shell %>", payload.shell.join(" "))
	if (payload.node){
		var npm = fs.readFileSync("./app/shell/npm.sh", "utf8");
		if (Buffer.isBuffer(npm)) npm = npm.toString('utf8') ;
		npm = npm.replace("<% packets.npm %>", payload.node.join(" "))	
		statics = statics.replace("<% packets.node %>", npm)	
	}
	if (payload.dpkg) {
		var str = "";
		for (var pkg in payload.dpkg) {
			var dpkgtmpl = fs.readFileSync("./app/shell/dpkg.sh", "utf8");
			if (Buffer.isBuffer(dpkgtmpl)) dpkgtmpl = dpkgtmpl.toString('utf8') ;
			dpkgtmpl= dpkgtmpl
							.replace("<% dpkg.name %>", payload.dpkg[pkg].name)
							.replace("<% dpkg.link %>", payload.dpkg[pkg].link)
			console.log(dpkgtmpl)
			str += dpkgtmpl;
		};
		statics = statics.replace("<% packets.dpkg %>", str)	

	};
	if (payload.other){
		for(var thing in payload.other ) {
			var other = fs.readFileSync("./app/shell/"+payload.other[thing].tmpl, "utf8");
			if (Buffer.isBuffer(other)) other = other.toString('utf8') ;
			statics = statics.replace("<% packet.other."+payload.other[thing].tmpl+" %>", other)
		}
	} 


	statics = statics.replace(/\<\% .* \%\>/g , "")
	res.send(statics)
}

function temper(file , search, replace){
	var regex = new RegExp("\<\% \w.\w \%\>", "gi");
	console.log(1,2,file.match(regex))
	file.replace(regex , replace);
	console.info(file)
}





















/**
 * Create a Packet
 */
exports.create = function(req, res) {
	var packet = new Packet(req.body);
	packet.user = req.user;

	packet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(packet);
		}
	});
};

/**
 * Show the current Packet
 */
exports.read = function(req, res) {
	res.jsonp(req.packet);
};

/**
 * Update a Packet
 */
exports.update = function(req, res) {
	var packet = req.packet ;

	packet = _.extend(packet , req.body);

	packet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(packet);
		}
	});
};

/**
 * Delete an Packet
 */
exports.delete = function(req, res) {
	var packet = req.packet ;

	packet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(packet);
		}
	});
};

/**
 * List of Packets
 */
exports.list = function(req, res) { 
	Packet.find().sort('-created').populate('user', 'displayName').exec(function(err, packets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(packets);
		}
	});
};

/**
 * Packet middleware
 */
exports.packetByID = function(req, res, next, id) { 
	Packet.findById(id).populate('user', 'displayName').exec(function(err, packet) {
		if (err) return next(err);
		if (! packet) return next(new Error('Failed to load Packet ' + id));
		req.packet = packet ;
		next();
	});
};

/**
 * Packet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.packet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
