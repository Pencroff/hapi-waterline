/**
 *Created by Mikael Lindahl on 2018-01-05
 */

"use strict";

const TYPES = {
    number: 'INTEGER',
    string: 'TEXT',
    boolean: 'BOOLEAN',
    json: 'JSON'
}

/**
 * Crete model definitions to be used when defining tables
 * with the dapteres
 *
 * @param models
 * @param datastores
 * @returns {{}}
 */
function createDefinition(models, datastores) {

    let definition = {};

    for (let key1 in models) {

        let model = models[key1];
        let adapter = datastores[model.datastore].adapter;

        if (!definition[adapter]){

            definition[adapter]={}

        }

        definition[adapter][key1]= {
                config: JSON.parse(JSON.stringify(model.attributes)),
                datastore: model.datastore
            }


        for (let key2 in model.attributes) {

            definition[adapter][key1].config[key2].columnName = key2;

            if (key2 == model.primaryKey) {

                definition[adapter][key1].config[key2].primaryKey = true

            }

            if (model.attributes[key2].autoMigrations != {}) {
                for (let key3 in model.attributes[key2].autoMigrations) {

                    let migration = model.attributes[key2].autoMigrations[key3]
                    definition[adapter][key1].config[key2][key3] = migration


                }

                delete definition[adapter][key1].config[key2].autoMigrations
            }

            if (!definition[adapter][key1].config[key2].columnType) {

                let type = definition[adapter][key1].config[key2].type;

                definition[adapter][key1].config[key2].columnType = TYPES[type]


            }
        }
    }
    return definition
}

/**
 * Create tables using adapter define method
 *
 * @param definition_by_adapter
 * @param adapters
 * @returns {Promise.<void>}
 */
async function createTables(definition_by_adapter, adapters) {

    for (let adapter_name in definition_by_adapter) {

        let models = definition_by_adapter[adapter_name]

        for (let table in models) {

            let datastore = models[table].datastore;
            let config = models[table].config;

            let adapter = adapters[adapter_name]

            await new Promise((resolve, reject) => {

                adapter.define(datastore, table, config, (err, res) => {

                    if (err) {

                        reject(err)

                    }

                    resolve()

                })
            })
        }
    }
}

module.exports = {
    createDefinition,
    createTables

}

