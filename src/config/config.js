/**
 * Created by r1cebank on 8/19/15.
 */

/*!
 *  This is the config file, will include everything needed to bootstrap the app
  *  Minor configuration is needed but not required.
 */

var config = {
    server: {
        storage: {
            dest: 'storage/',
            processed: 'processed/'
        },
        index:      'db/index',
        buckets:    'db/bucket/',
        host:       'http://localhost:3939',
        port:       3939
    },
    auth: {
        type: 'local',
        keys: {
            c9cba3d805ff526866d27b5504005766: {
                roles: [
                    'yaas:list',
                    'bucket:create',
                    'bucket:upload',
                    'bucket:list',
                    'file:get',
                    'version:list'
                ]
            }
        },
        overwrites: {
            'file:get': 'none',
            'version:list': 'none'
        }
    }
};

export default config;