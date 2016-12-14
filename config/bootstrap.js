module.exports.bootstrap = function(cb) {
    createNewGroup(function() {
        createNewUser(cb);
    })
};

function createNewGroup(cb) {
    UserGroup.count().exec(function(err,count) {
        if(err) {
            sails.log.error('Already boostrapping data');
            return cb(err);
        }
        if(count > 0) return cb()

        UserGroup.create([{
            name: 'AVAIL',
            displayName: "AVAILabs",
            type: "sysAdmin"
        }]).exec(cb);
    })
}
function createNewUser(cb) {
    Users.count().exec(function(err,count) {
        if(err) {
            sails.log.error('Already boostrapping data');
            return cb(err);
        }
        if(count > 0) return cb()

        Users.create([{
            userName: "AVAILabs",
            loginName: "avail",
            email: "availabs@gmail.com",
            password: "password",
            confirmation: "password",
            admin: true,
            group: "AVAIL",
            userType: 'sysAdmin'
        }]).exec(cb);
    })
}
