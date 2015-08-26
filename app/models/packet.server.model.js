'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Packet Schema
 */
var PacketSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Packet name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Packet', PacketSchema);