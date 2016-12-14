module.exports = {

  groups: function(req, res) {
    UserGroup.find()
      .then(groups => {

        if (!groups) return;
        
        console.log(groups)
        return res.json({"groups":groups})
      })
      .catch(function(error) { console.log("ERROR:",error); });

  }

  // updateGroup: function(req,res){

  //   UserGroup.update({id:req.param("id")})
  //     .then(group => {
  //       if(err){
  //         console.log(err);
  //         return;
  //       }

  //       return res.json({"group":group})
  //     })
  //     .catch(function(error) { console.log("ERROR:",error); });
  // }
}
