/**
 * checkupdate.js
 *
 * @author  Siyuan Gao <siyuangao@gmail.com>
 * @license MIT
 */

import updateChecker       from 'check-update';
import pkg                 from '../package.json';

updateChecker({packageName: pkg.name, packageVersion: pkg.version, isCLI: false}, function(err, latestVersion, defaultMessage){
    if(!err){
        console.log(defaultMessage);
    }
});