/**
 * MailController
 *
 * @description :: Server-side logic for managing mails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  /**
   * `MailController.send()`
   */
  send: function (req, res) {
  	console.log("Sending Mail")
	console.log("email hook",sails.config.email)
  	console.log("just body",req.body)
	var outsideErr;
	sails.hooks.email.send(
		"testEmail",
		{
			recipientName: "Availabs",
			senderName: req.body.name,
			senderAddress:req.body.email,
			department:req.body.department
		},
		{
			to: "availabs@availabs.org",
			subject: "Requesting Access to PADWARE service"
		},
		function(err) {
			outsideErr = err;
			console.log(err || "It worked!");
		}
	)
   	return res.json({
      email: outsideErr || "It worked!"
    });
  }
};

