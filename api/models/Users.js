module.exports = {

    schema: true,
  	migrate: "safe",
    autosubscribe: ['create','destroy', 'update'],

    attributes: {

        userName: {
            type: 'string',
            required: true
        },

      	loginName: {
            type: 'string',
            required: true,
      		unique: true
      	},

      	email: {
            type: 'email',
      		required: true,
      		unique: true
      	},

      	encryptedPassword: {
      		type: 'string',
      		unique: true
      	},

        online: {
            type: 'boolean',
            defaultsTo: false
        },

        group: {                // various user types and sysAdmin
            type: 'string',
      		required: true
        },

        userState: {
            type: 'integer',
            defaultsTo: 36
        },

        admin: {
            type: 'boolean',
            defaultsTo: false
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            delete obj.confirmation;
            delete obj.encryptedPassword;
            delete obj._csrf;
            return obj;
        }
    },

    beforeCreate: function (values, next) {
        // This checks to make sure the password and password confirmation match before creating record
        if (!values.password || values.password != values.confirmation) {
            return next({err: ["Password doesn't match password confirmation."]});
        }
        require('bcryptjs').hash(values.password, 10, function(err, encryptedPassword) {
            if (err) return next(err);
            values.encryptedPassword = encryptedPassword;
            next();
        });
    },

    beforeUpdate: function (values, next) {
        // This checks to make sure the password and password confirmation match before creating record
        if (!values.password) {
            return next();
        }
        if (values.password && values.password != values.confirmation) {
            return next({err: ["Password doesn't match password confirmation."]});
        }
        require('bcryptjs').hash(values.password, 10, function(err, encryptedPassword) {
            if (err) return next(err);
            values.encryptedPassword = encryptedPassword;
            next();
        });
    }
};
