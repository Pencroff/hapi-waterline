/**
 * Created by Pencroff on 05.01.2015.
 */
/*global exports: true, require: true*/

var requireDir = require('require-dir'),
    _ = require('lodash'),
    Waterline = require('waterline'),
    orm = new Waterline(),
    helpers = require('./helpers');

// just for testing
exports.reset = function () {
    orm = new Waterline();
};

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
        let all={};
        _(path).forEach(function (item, index, collection) {
            var models = requireDir(item, {recurse: true});
            var extendedModels = _(models).map(function (model, key, object) {
                if (modelsDefault) {
                    _(modelsDefault).forEach(function (value, key, object) {
                        if (typeof (model[key]) === 'undefined') {
                            model[key] = value;
                        }
                    });
                }
                all[model.identity]=model;
                return Waterline.Collection.extend(model);
            });
            _(extendedModels).forEach(function (extendedModel) {
                orm.registerModel(extendedModel)
            });
        });

        // For table creation with orm.define
        let definition_by_adapter=helpers.createDefinition(all, datastores)

        return new Promise((resolve, reject) => {

            var config ={
                adapters: adapters,
                datastores: datastores
            }

            orm.initialize(config, function (err, models) {
                if (err) reject(err);
                server.expose({
                    orm: orm,
                    models: models.collections,
                    databases: models.datastores
                });

                if (Object.keys( definition_by_adapter).length === 0){

                    return resolve()

                }

                helpers.createTables(definition_by_adapter, adapters).then(()=>{

                    resolve()


                }).catch(err=>{

                    reject(err)

                })
            });
        })
    },

    pkg: require('../package.json')

};