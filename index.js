
/**
 * Module dependencies.
 */

var Client = require('elastical').Client;
var parse = require('url').parse;
var moment = require('moment');
var assert = require('assert');

/**
 * Initialize the ES plugin with elasticsearch `addr`.
 *
 * @param {String} addr
 * @return {Function}
 * @api public
 */

module.exports = function(addr){
  var es = new ES(addr);

  return function(server){
    server.on('message', function(msg){
      es.index(msg, function(err){
        if (err) console.error(err.stack);
      })
    });
  }
}

/**
 * Initialize an ES client with the given `addr`.
 *
 * @param {String} addr
 * @api public
 */

function ES(addr) {
  var self = this;
  assert(addr, 'elasticsearch address required');
  this.addr = addr;
  var url = parse(addr);
  this.client = new Client(url.hostname, { port: url.port });
  this._index = date();
  setInterval(function(){ self._index = date() }, 5000);
}

/**
 * Index the given `msg`.
 *
 * @param {Object} msg
 * @param {Function} [fn]
 * @api public
 */

ES.prototype.index = function(msg, fn){
  msg.message = JSON.stringify(msg.message);
  this.client.index(this._index, msg.type, msg, fn);
};

/**
 * Return formatted date.
 */

function date() {
  return moment().format('YYYY-MM-DD');
}
