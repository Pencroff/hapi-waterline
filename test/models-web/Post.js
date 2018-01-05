/**
 * Created by Pencroff on 05.01.2015.
 */

module.exports = {
    primaryKey: 'id',
    identity: 'post',
    datastore: 'flat',
    attributes: {
        id: { type: 'number', autoMigrations: { autoIncrement: true , columnType:'integer'} },
        title: {type: 'string',autoMigrations: { columnType:'text' } },
        text: {type: 'string',autoMigrations: { columnType:'text' } }
    }
};