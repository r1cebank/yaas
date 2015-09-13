/**
 * Created by r1cebank on 8/11/15.
 */

/**
 * This sis the AppSingleton, this is shared across entire app
 *
 * @class AppSingleton
 * @constructor
 */
class AppSingleton {
    constructor() {
        console.error("Do not construct singleton using the constructor!");
        this.sharedInstance = { };
    }
    /**
     * Get current instance from the singleton
     *
     * @method getInstance
     * @return {Object} Returns current singleton instance
     */
    static getInstance() {
        if(!this.sharedInstance) {
            this.sharedInstance = { };
        }
        return this.sharedInstance;
    }
}

export default AppSingleton;