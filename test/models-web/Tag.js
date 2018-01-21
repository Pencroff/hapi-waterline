/**
 * Created by Pencroff on 05.01.2015.
 */

module.exports = {
    primaryKey: 'id',
    identity: 'tag',
    datastore: 'flat',
    attributes: {

        id: { type: 'number', autoMigrations: { autoIncrement: true, columnType:'integer' } },
        name: {type: 'string',autoMigrations: { columnType:'text' } }
    }
};