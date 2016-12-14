var bcrypt = require('bcryptjs'),
  d3 = require("d3"),
  format = d3.format("02d"),
  timeZoneFormat = d3.format("+03d"),

  esc = require("esc");

function RandomPassword() {
  var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    password = "",
    index;

  index = esc.randInt(numbers.length);
  password += numbers.splice(index, 1);
  index = esc.randInt(numbers.length);
  password += numbers.splice(index, 1);

  index = esc.randInt(letters.length);
  password += letters.splice(index, 1);
  index = esc.randInt(letters.length);
  password += letters.splice(index, 1).map(function(d) { return d.toUpperCase(); });
  index = esc.randInt(letters.length);
  password += letters.splice(index, 1);
  index = esc.randInt(letters.length);
  password += letters.splice(index, 1).map(function(d) { return d.toUpperCase(); });
  index = esc.randInt(letters.length);
  password += letters.splice(index, 1);

  index = esc.randInt(numbers.length);
  password += numbers.splice(index, 1);
  index = esc.randInt(numbers.length);
  password += numbers.splice(index, 1);

  return password;
}

module.exports = {

  passwordReset: function(req, res) {
    var email = req.param("email");

    Users.findOne({ email: email })
      .then(function(user) {

        if (!user) return;
        
        var password = RandomPassword();

        Users.update({ id: user.id }, { password: password, confirmation: password })
          .then(function(result) {
            var data = {
                from: 'Admin <admin@availabs.org>',
                to: user.email,
                subject: 'Password reset',
                text: 'Your new password is: ' + password
              };
          })
      })
      .catch(function(error) { console.log("ERROR:",error); });

    res.redirect('/login');
  },

  getUser: function(req, res) {
    var id = req.param("id"),
      find = id ? { id: id } : {};

    Users.find(find)
      .then(res.ok)
      .catch(res.serverError);
  },
  signupAuth: function(req,res,next){
    console.log("signup auth",req.allParams())
    if (!req.param('email') || !req.param('password') || !req.param('confirmpassword')) {
      console.log("missing")
      // return next({err: ["Password doesn't match password confirmation."]});

      var usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.'
      }]

      // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
      // the key of usernamePasswordRequiredError
      req.session.flash = {
        err: usernamePasswordRequiredError
      }

      return res.send('You must enter both a username and password.')
    }
    // else if(req.param('password').length < 7){
    //   console.log("password too short")
    //   var passwordLengthError = [{
    //     name: 'passwordLength',
    //     message: 'Passwords must be at least 7 characters long.'
    //   }]

    //   // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
    //   // the key of usernamePasswordRequiredError
    //   req.session.flash = {
    //     err: passwordLengthError
    //   }

    //   return res.send('Passwords must be at least 7 characters long.')      
    // }
    else if(req.param('password') !== req.param('confirmpassword')){
      console.log("no pass match")
      var passwordMatchError = [{
        name: 'passwordMatch',
        message: 'Passwords must match.'
      }]

      // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
      // the key of usernamePasswordRequiredError
      req.session.flash = {
        err: passwordMatchError
      }

      return res.send('Passwords must match.')
    }
    else{
      //Form validation is done
      Users.findOneByEmail(req.param('email'), function foundUser(err, user) {
        if(user){
          console.log("email already in use");

          var emailTakenError = [{
            name: 'emailTaken',
            message: 'This E-mail address is already in use.'
          }]

          // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
          // the key of usernamePasswordRequiredError
          req.session.flash = {
            err: emailTakenError
          }

          return res.send('This E-mail address is already in use.')          
        }
        else{
          //Email not taken. Create User.
          Users.create([{
            userName: req.param('email'),
            loginName: req.param('email'),
            email: req.param('email'),
            password: req.param('password'),
            confirmation: req.param('confirmpassword'),
            admin: false,
            group: "ry_test",
            userType: 'mpo'
          }]).exec(function(){
            Users.update({ userName: req.param('email') }, { password: req.param('password'), confirmation: req.param('confirmpassword') })
            .then(function(result) {
              console.log("updated",result)
              console.log("success made user")

              var userCreatedSuccess = [{
                name: 'userCreated',
                message: 'Success!'
              }]
              Users.findOneByEmail(req.param('email'), function foundUser(err, user) {
                // Change status to online
                user.online = true;
                user.token = jwToken.issue({id : user.id })
                console.log("signed up new user token",user.token)
                user.save(function(err) {
                  if (err) return next(err);
                  
                  // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
                  Users.publishUpdate(user.id, {
                    loggedIn: true,
                    id: user.id,
                    group:user.group,
                    userName: user.userName,
                    action: ' has logged in.'
                  });

                  //Redirect to their profile page (e.g. /views/user/show.ejs)
                  //Also does first auth check
                  if(user.id <= 2){
                    return res.send({id:user.id,token:user.token,status:true})
                  }
                  else{
                    return res.send({id:user.id,token:user.token,status:false})          
                  } 
                });
              }) 
            })
          })
        }
      })
    }
  },
  auth: function(req, res, next) {
    // console.log("req body",req.body)
    // console.log("req headers",req.headers)
    console.log("params login auth", req.allParams())
    // Check for username and password in params sent via the form, if none
    // redirect the browser back to the sign-in form.
    if (!req.param('email') || !req.param('password')) {
      // return next({err: ["Password doesn't match password confirmation."]});

      var usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.'
      }]

      // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
      // the key of usernamePasswordRequiredError
      req.session.flash = {
        err: usernamePasswordRequiredError
      }
      return res.send('You must enter both a username and password.');
    }

    // Try to find the user by there username address.
    // findOneByusername() is a dynamic finder in that it searches the model by a particular attribute.
    // User.findOneByusername(req.param('username')).done(function(err, user) {
    Users.findOneByEmail(req.param('email'), function foundUser(err, user) {
      if (err) return next(err);

      // If no user is found...
      if (!user) {
        var noAccountError = [{
          name: 'noAccount',
          message: 'The email address  "' + req.param('email') + '" was not found.'
        }]
        req.session.flash = {
          err: noAccountError
        }
        return res.send('The email address  "' + req.param('email') + '" was not found.')
      }

      // Compare password from the form params to the encrypted password of the user found.
      bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
        if (err) return next(err);

        // If the password from the form doesn't match the password from the database...
        if (!valid) {
          var emailPasswordMismatchError = [{
            name: 'emailPasswordMismatch',
            message: 'Invalid email and password combination.'
          }]
          req.session.flash = {
            err: emailPasswordMismatchError
          }
          return res.send('Invalid email and password combination.')
        }

        // Log user in
        req.session.authenticated = true;
        req.session.User = user;

        var date = new Date(),
          timestamp = date.getFullYear()+"-"+
            format(date.getUTCMonth()+1)+"-"+
            format(date.getDate())+" "+
            format(date.getUTCHours())+":"+
            format(date.getUTCMinutes())+":"+
            format(date.getUTCSeconds())+" "+
            -Math.floor(date.getTimezoneOffset()/60)+":00"
          loginData = {
            user: user.userName,
            timestamp: timestamp,
            ip: req.ip,
            user_agent: req.headers["user-agent"],
            application: "NPMRDS"
          };


        UserGroup.findOne({ name: user.group })
          .exec(function(error, result) {

            // Change status to online
            user.online = true;
            user.token = jwToken.issue({id : user.id })
            console.log("logged in token",user.token)
            user.save(function(err) {
              if (err) return next(err);
              
              var updateUser = {
                loggedIn: true,
                id: user.id,
                userGroup:result,
                userName: user.userName,
                action: ' has logged in.',
                token: user.token
              }
              // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
              Users.publishUpdate(user.id, updateUser);

              req.session.User.userGroup = result;
              //Redirect to their profile page (e.g. /views/user/show.ejs)
              //Also does first auth check
              if(user.id <= 2){
                updateUser.status = true;
                return res.json(updateUser)
              }
              else{
                updateUser.status = false;
                return res.json(updateUser)          
              }

              
            });

          })
      });
    });
  },
  checkAuth: function(req,res,next) {
    console.log("Check Auth Token",req.param('token'))  
    jwToken.verify(req.param('token'),(error,result) => {
      console.log("checkauth verify result",result)
      console.log("checkauth verify error",error)      
      if(error){
        return res.json({error:error})
      }

      var userId = result.id
      console.log("checkauth id from token",userId)

      Users.findOne(userId, function foundUser(err, user) {
        if (user) {
          UserGroup.findOne({ name: user.group })
            .exec(function(error, result) {
              user.token = req.param('token')
              user.userGroup = result;

              // Dummy auth check
              // Will eventually check DB to see if they have permission for requested content/app
              if(user.id <= 2){
                user.status = true;
              }
              else{
                user.status = false;        
              }
              console.log("testing",user)
              return res.json(user)  
            })
        }
        else{
          return res.json({error:{message:"Could not find user associated with that token"}})
        } 
      });
    })
  },
  logout: function(req, res, next) {
    var userId = req.session.User || req.param('id')
    console.log("logged out token",req.token)
    Users.findOne(userId, function foundUser(err, user) {
      if (user) {
        // The user is "logging out" (e.g. destroying the session) so change the online attribute to false.
        Users.update(userId, {
          online: false
        }, function(err) {
          if (err) return next(err);

          // Inform other sockets (e.g. connected sockets that are subscribed) that the session for this user has ended.
          Users.publishUpdate(userId, {
            loggedIn: false,
            id: userId,
            userName: user.userName,
            action: ' has logged out.'
          });

          // Wipe out the session (log out)
          req.session.destroy();

          // Redirect the browser to the sign-in screen
          return res.send('logged out')
        });
      } else {

        // Wipe out the session (log out)
        req.session.destroy();

        // Redirect the browser to the sign-in screen
        return res.send('logged out')
      }
    });
  },
  login:function(req,res){
    res.view();
  },
  signup:function(req,res){
    res.view();
  }

};
