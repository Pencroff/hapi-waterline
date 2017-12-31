/**
 * Created by Pencroff on 05.01.2015.
 */

module.exports = {
    primaryKey: 'id',
    identity: 'user',
    datastore: 'flat',
    attributes: {

        id: { type: 'number', autoMigrations: { autoIncrement: true } },
        first_name: {type: 'string'},
        last_name: {type: 'string'}

    }
};
