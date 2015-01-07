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

    beforeEach(function(done){
        server = new Hapi.Server();
        hapiWaterline.reset();
        adapter.teardown(function () {});
        done();
    });

    it('should expose waterline orm', function (done) {
        var options = {someFlag: true};
        server.register({
                register: hapiWaterline,
                options: options
            }, function (err) {
                if (err) {
                    done(err);
                }
                expect(server.plugins['hapi-waterline']).to.exist;
                expect(server.plugins['hapi-waterline'].orm).to.exist;
                done();
            }
        );
    });

    it('should support orm adapters and connections', function (done) {
        var options = {
            adapters: {
                'disk-adapter': adapter
            },
            connections: {
                'connection': {
                    adapter: 'disk-adapter'
                }
            }
        };
        server.register({
                register: hapiWaterline,
                options: options
            }, function (err) {
                if (err) {
                    done(err);
                }
                expect(server.plugins['hapi-waterline'].databases).to.exist;
                expect(server.plugins['hapi-waterline'].models).to.exist;
                expect(server.plugins['hapi-waterline'].models).to.be.empty;
                done();
            }
        );
    });
    it('should support path to models folder', function (done) {
        var options = {
            adapters: {
                'disk-adapter': adapter
            },
            connections: {
                flat: {
                    adapter: 'disk-adapter'
                }
            },
            path: path.resolve(root, './models-admin')
        };
        server.register({
                register: hapiWaterline,
                options: options
            }, function (err) {
                if (err) {
                    done(err);
                }
                expect(server.plugins['hapi-waterline'].models).to.exist;
                expect(server.plugins['hapi-waterline'].models).to.not.be.empty;
                expect(server.plugins['hapi-waterline'].models.user).to.exist;
                expect(server.plugins['hapi-waterline'].models.pet).to.exist;
                done();
            }
        );
    });
    it('should support array of paths to models folders', function (done) {
        var options = {
            adapters: {
                'disk-adapter': adapter
            },
            connections: {
                'flat': {
                    adapter: 'disk-adapter'
                }
            },
            path: [path.resolve(root, './models-admin'), path.resolve(root, './models-web')]
        };
        server.register({
                register: hapiWaterline,
                options: options
            }, function (err) {
                if (err) {
                    done(err);
                }
                expect(server.plugins['hapi-waterline'].models).to.exist;
                expect(server.plugins['hapi-waterline'].models).to.not.be.empty;
                expect(server.plugins['hapi-waterline'].models.user).to.exist;
                expect(server.plugins['hapi-waterline'].models.pet).to.exist;
                expect(server.plugins['hapi-waterline'].models.post).to.exist;
                expect(server.plugins['hapi-waterline'].models.tag).to.exist;
                done();
            }
        );
    });
    it('should support default section for model in plugin config', function (done) {
        var defaultConnection = 'flat',
            options = {
            adapters: {
                'disk-adapter': adapter
            },
            connections: {
                'flat': {
                    adapter: 'disk-adapter'
                }
            },
            models: {
                connection: defaultConnection
            },
            path: [path.resolve(root, './models-partial')]
        };
        server.register({
                register: hapiWaterline,
                options: options
            }, function (err) {
                if (err) {
                    done(err);
                }
                var model = server.plugins['hapi-waterline'].models.pet2,
                    connections = model.connections;
                expect(model).to.exist;
                expect(connections[defaultConnection]).to.exist;
                done();
            }
        );
    });
    it('should support binded to server method - getModel', function (done) {
        var defaultConnection = 'flat',
            options = {
                adapters: {
                    'disk-adapter': adapter
                },
                connections: {
                    'flat': {
                        adapter: 'disk-adapter'
                    }
                },
                models: {
                    connection: defaultConnection
                },
                path: [path.resolve(root, './models-partial')],
                decorateServer: true
            };
        server.register({
                register: hapiWaterline,
                options: options
            }, function (err) {
                if (err) {
                    done(err);
                }
                var model = server.plugins['hapi-waterline'].models.pet2;
                expect(model).to.equal(server.getModel('pet2'));
                done();
            }
        );
    });
});