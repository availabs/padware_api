/**
 * Categories.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


module.exports = {
  schema: true,
  migrate: "safe",
  autosubscribe: ['create','destroy', 'update'],

  attributes: {

    id: {
      type: 'integer',
      required: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true
    },
    label: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: false
    },

    toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        delete obj.confirmation;
        delete obj.encryptedPassword;
        delete obj._csrf;
        return obj;
    }
  }
};