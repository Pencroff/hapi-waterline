/**
 * Created by Pencroff on 11.12.2014.
 */

var path = require('path'),
    expect = require('chai').expect,
    root = __dirname,
    Hapi = require('hapi');

describe('Hapi Config', function () {
    var hapiWaterline = require('../src/hapi-waterline'),
        adapter = require('sails-disk'),
        server;

    beforeEach(function (done) {
        server = new Hapi.Server();
        hapiWaterline.reset();
        adapter.teardown(null, function () {
        });
        done();
    });

    // it('should expose waterline orm', function (done) {
    //     var options = {someFlag: true};
    //     server.register({
    //
    //         plugin: hapiWaterline,
    //         options: options
    //
    //     }).then(() => {
    //
    //         expect(server.plugins['hapi-waterline']).to.exist;
    //         expect(server.plugins['hapi-waterline'].orm).to.exist;
    //         done();
    //
    //     }).catch(err => {
    //
    //         done(err);
    //
    //     })
    // });

    it('should support orm adapters and datastores', function (done) {
        var options = {
            adapters: {
                'disk-adapter': adapter
            },
            datastores: {
                'datastore': {
                    adapter: 'disk-adapter'
                }
            }
        };
        server.register({

            plugin: hapiWaterline,
            options: options

        }).then(() => {

            expect(server.plugins['hapi-waterline'].databases).to.exist;
            expect(server.plugins['hapi-waterline'].models).to.exist;
            expect(server.plugins['hapi-waterline'].models).to.be.empty;
            done();

        }).catch(err => {

            done(err);

        })
    });

    it('should support path to models folder', function (done) {
        var options = {
            adapters: {
                'disk-adapter': adapter
            },
            datastores: {
                flat: {
                    adapter: 'disk-adapter'
                }
            },
            path: path.resolve(root, './models-admin')
        };
        server.register({
            plugin: hapiWaterline,
            options: options
        }).then(() => {

            expect(server.plugins['hapi-waterline'].models).to.exist;
            expect(server.plugins['hapi-waterline'].models).to.not.be.empty;
            expect(server.plugins['hapi-waterline'].models.user).to.exist;
            expect(server.plugins['hapi-waterline'].models.pet).to.exist;
            done();

        }).catch(err => {

            done(err);

        });
    });

    it('should support array of paths to models folders', function (done) {
        var options = {
            adapters: {
                'disk-adapter': adapter
            },
            datastores: {
                'flat': {
                    adapter: 'disk-adapter'
                }
            },
            path: [path.resolve(root, './models-admin'), path.resolve(root, './models-web')]
        };
        server.register({
                plugin: hapiWaterline,
                options: options
            }).then(()=>{
                expect(server.plugins['hapi-waterline'].models).to.exist;
                expect(server.plugins['hapi-waterline'].models).to.not.be.empty;
                expect(server.plugins['hapi-waterline'].models.user).to.exist;
                expect(server.plugins['hapi-waterline'].models.pet).to.exist;
                expect(server.plugins['hapi-waterline'].models.post).to.exist;
                expect(server.plugins['hapi-waterline'].models.tag).to.exist;
                done();

            }).catch(err=> {

                done(err);

            });
    });
    it('should support default section for model in plugin config', function (done) {
        var defaultDatastore = 'flat',
            options = {
                adapters: {
                    'disk-adapter': adapter
                },
                datastores: {
                    'flat': {
                        adapter: 'disk-adapter'
                    }
                },
                models: {
                    datastore: defaultDatastore
                },
                path: [path.resolve(root, './models-partial')]
            };
        server.register({
            plugin: hapiWaterline,
            options: options
        }).then(() => {
            var model = server.plugins['hapi-waterline'].models['pet-partial'],
                datastores = model._adapter.datastores;
            expect(model).to.exist;
            expect(datastores[defaultDatastore]).to.exist;
            done();

        }).catch(err => {
            done(err);
        });
    });

    it('should support binded to server method - getModel', function (done) {
        var defaultDatastore= 'flat',
            options = {
                adapters: {
                    'disk-adapter': adapter
                },
                datastores: {
                    'flat': {
                        adapter: 'disk-adapter'
                    }
                },
                models: {
                    datastore: defaultDatastore
                },
                path: [path.resolve(root, './models-partial')],
                decorateServer: true
            };
        server.register({

            plugin: hapiWaterline,
            options: options

        }).then(() => {

            var model = server.plugins['hapi-waterline'].models['pet-partial'];
            expect(model).to.equal(server.getModel('pet-partial'));
            done();

        }).catch(err => {

            done(err);

        });
    });
});