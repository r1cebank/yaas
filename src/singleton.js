
/**
 * This is the Singleton, this is shared across entire app
 *
 * @class Singleton
 * @constructor
 */
class Singleton {
    constructor() {
        this.sharedInstance = { };
    }
    /**
    * Get current instance from the singleton
    *
    * @method getInstance
    * @return {Object} Returns current singleton instance
    */
    static getInstance() {
        if (!this.sharedInstance) {
            this.sharedInstance = { };
        }
        return this.sharedInstance;
    }
}

module.exports = Singleton;
