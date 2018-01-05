/**
 * Created by Pencroff on 05.01.2015.
 */

module.exports = {
    primaryKey: 'id',
    identity: 'user',
    datastore: 'flat',
    attributes: {

        id: { type: 'number', autoMigrations: { autoIncrement: true , columnType:'integer'} },
        first_name: {type: 'string',autoMigrations: { columnType:'text' } },
        last_name: {type: 'string',autoMigrations: { columnType:'text' } }

    }
};
