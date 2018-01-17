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

/**
 *
 *
 *
 * @type {{register: exports.plugin.register, pkg}}
 */
exports.plugin = {
    register: async function (server, options) {
        var adapters = options.adapters || {},
            datastores = options.datastores || {},
            modelsDefault = options.models,
            bindFlag = options.decorateServer || false;
        path = options.path || [];
        if (bindFlag) {
            server.decorate('server', 'getModel', function (model) {
                return server.plugins['hapi-waterline'].models[model];
            });
        }
        if (_.isString(path)) {
            path = [path];
        }

        _(path).forEach(function (item, index, collection) {
            var models = requireDir(item, {recurse: true});

            var extendedModels = _(models).map(function (model, key, object) {

                if (options.serverBindLifecycle){

                    _(options.serverBindLifecycle).forEach(function (item, index, collection) {

                        if(model[item]){

                            model[item] = model[item].bind({server})

                        }
                    })
                }

                if (modelsDefault) {
                    _(modelsDefault).forEach(function (value, key, object) {
                        if (typeof (model[key]) === 'undefined') {
                            model[key] = value;
                        }
                    });
                }

                return Waterline.Collection.extend(model);
            });
            _(extendedModels).forEach(function (extendedModel) {
                orm.registerModel(extendedModel)
            });
        });


        await new Promise((resolve, reject) => {

            var config ={
                adapters: adapters,
                datastores: datastores
            }

            orm.initialize(config, async function (err, models) {
                if (err) reject(err);
                server.expose({
                    orm: orm,
                    models: models.collections,
                    databases: models.datastores
                });

                resolve()
            });
        })
    },

    pkg: require('../package.json')

};