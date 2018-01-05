/**
 *Created by Mikael Lindahl on 2018-01-05
 */

"use strict";

/**
 * Crete model definitions to be used when defining tables
 * with the dapteres
 *
 * @param models
 * @param datastores
 * @returns {{}}
 */
function createDefinition(models, datastores){

    let definition={};

    for (let key1 in models) {

        let model = models[key1];
        let adapter = datastores[model.datastore].adapter;

        definition[adapter] = {
            config: {[key1]: JSON.parse(JSON.stringify(model.attributes))},
            datastore: model.datastore
        };

        for (let key2 in model.attributes){

            definition[adapter].config[key1][key2].columnName = key2;

            if (key2 == model.primaryKey) {

                definition[adapter].config[key1][key2].primaryKey = true

            }

            if (model.attributes[key2].autoMigrations!={}) {
                for (let key3 in model.attributes[key2].autoMigrations){

                    let migration = model.attributes[key2].autoMigrations[key3]
                    definition[adapter].config[key1][key2][key3] = migration


                }

                delete definition[adapter].config[key1][key2].autoMigrations
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
async function createTables(definition_by_adapter, adapters){

    for (let adapter_name in definition_by_adapter){

        let models=definition_by_adapter[adapter_name]

        for (let table in models.config) {

            let datastore=models.datastore;
            let config=models.config[table];

            let adapter = adapters[adapter_name]

            await new Promise((resolve, reject)=>{

                adapter.define(datastore, table, config, (err, res)=> {

                    if (err){

                        reject(err)

                    }

                    resolve()

                })
            })
        }
    }
}

module.exports={
    createDefinition,
    createTables

}

