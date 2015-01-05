/**
 * Created by Pencroff on 05.01.2015.
 */
/*global exports: true, require: true*/

var requireDir = require('require-dir'),
    _ = require('lodash'),
    Waterline = require('waterline'),
    orm = new Waterline();
// just for testing
exports.reset = function () {
    orm = new Waterline();
};

exports.register = function (server, options, next) {
    var adapters = options.adapters || {},
        connections = options.connections || {},
        path = options.path || [];
    if (_.isString(path)) {
        path = [path];
    }
    _(path).forEach(function (item, index, collection) {
        var models = requireDir(item, {recurse: true});
        var extendedModels = _(models).map(function (model, key, object) {
            return Waterline.Collection.extend(model);
        });
        _(extendedModels).forEach(function (extendedModel) {
            orm.loadCollection(extendedModel)
        });
    });
    orm.initialize({
        adapters: adapters,
        connections: connections
    }, function (err, models) {
        if(err) throw err;
        server.expose({
            orm: orm,
            models: models.collections,
            connections: models.connections
        });

        next();
    });
};

exports.register.attributes = {
    pkg: require('../package.json')
};