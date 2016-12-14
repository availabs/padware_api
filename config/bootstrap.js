module.exports.bootstrap = function(cb) {
    createNewCategories(function() {
        createNewPages(cb);
    })
};

function createNewCategories(cb) {
    Categories.count().exec(function(err,count) {
        if(err) {
            sails.log.error('Already boostrapping data');
            return cb(err);
        }
        if(count > 0) return cb()

        Categories.create([
        {
          name:"tools",
          label:"Tools",
          description: "Optional label_description for category"
        },
        {
          name:"apis",
          label:"APIs" ,
          description:"Optional label_description. NOT shown on home page" 
        },
        {
          name:"data",
          label:"Data" ,
          description: ""
        },
        ]).exec(cb);
    })
}

function createNewPages(cb) {

  Pages.count().exec(function(err,count) {
    if(err) {
      sails.log.error('Already boostrapping data');
      return cb(err);
    }
    if(count > 0) return cb()

    Pages.create([
      {
        "name":"wimweb",
        "label":"WimWeb",
        "category_id":1,
        "sub_header":"Optional sub_title for page",
        "image_path":"/assets/images/npmrds1.jpg",
        "description":"description_0 paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida odio vitae blandit euismod. Sed sodales feugiat est, eu commodo est pretium sed. Morbi sed rutrum velit. Aenean at porta urna. Sed sem eros, dapibus id pharetra a, consectetur sagittis ante. Donec quis ex odio. Etiam et felis eget enim.|description_1. Can add/remove as many paragraphs as you want|description_2|description_3",
        "app_link":"http://wim.availabs.org/"
      },
      {
        "name":"npmrds",
        "label":"NPMRDS Congestion Performance - Traffic Data Analytics",
        "category_id":1,
        "sub_header":"",
        "image_path":"/assets/images/npmrds1.jpg",
        "description":"description_0 paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida odio vitae blandit euismod. Sed sodales feugiat est, eu commodo est pretium sed. Morbi sed rutrum velit. Aenean at porta urna. Sed sem eros, dapibus id pharetra a, consectetur sagittis ante. Donec quis ex odio. Etiam et felis eget enim.",
        "app_link":"http://npmrds.availabs.org/"
      },
      {
        "name":"freightatlas",
        "label":"Freight Atlas",
        "category_id":1,
        "sub_header":"",
        "image_path":"/assets/images/npmrds1.jpg",
        "description":"description_0 paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida odio vitae blandit euismod. Sed sodales feugiat est, eu commodo est pretium sed. Morbi sed rutrum velit. Aenean at porta urna. Sed sem eros, dapibus id pharetra a, consectetur sagittis ante. Donec quis ex odio. Etiam et felis eget enim.",
        "app_link":"http://freightatlas.availabs.org/"
      },
      {
        "name":"continuouscounts",
        "label":"Continuous Counts - Traffic Data Analytics",
        "category_id":2,
        "sub_header":"sub_header. Lorem ipsum dolor sit amet.",
        "image_path":"/assets/images/npmrds2.jpg",
        "description":"description_0 paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida odio vitae blandit euismod. Sed sodales feugiat est, eu commodo est pretium sed. Morbi sed rutrum velit. Aenean at porta urna. Sed sem eros, dapibus id pharetra a, consectetur sagittis ante. Donec quis ex odio. Etiam et felis eget enim.",
        "app_link":"http://availabs.org/"
      },
      {
        "name":"npmrds",
        "label":"NPMRDS Congestion Performance - Traffic Data Analytics",
        "category_id":2,
        "sub_header":"sub_header. Lorem ipsum dolor sit amet.",
        "image_path":"/assets/images/npmrds2.jpg",
        "description":"description_0 paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida odio vitae blandit euismod. Sed sodales feugiat est, eu commodo est pretium sed. Morbi sed rutrum velit. Aenean at porta urna. Sed sem eros, dapibus id pharetra a, consectetur sagittis ante. Donec quis ex odio. Etiam et felis eget enim.",
        "app_link":"http://npmrds.availabs.org/"
      },
      {
        "name":"uscensus",
        "label":"US Census",
        "category_id":2,
        "sub_header":"",
        "image_path":"/assets/images/npmrds2.jpg",
        "description":"description_0 paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida odio vitae blandit euismod. Sed sodales feugiat est, eu commodo est pretium sed. Morbi sed rutrum velit. Aenean at porta urna. Sed sem eros, dapibus id pharetra a, consectetur sagittis ante. Donec quis ex odio. Etiam et felis eget enim.",
        "app_link":"http://availabs.org/"
      },
      {
        "name":"continuouscounts",
        "label":"Continuous Counts",
        "category_id":2,
        "sub_header":"",
        "image_path":"/assets/images/npmrds3.jpg",
        "description":"description_0 paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida odio vitae blandit euismod. Sed sodales feugiat est, eu commodo est pretium sed. Morbi sed rutrum velit. Aenean at porta urna. Sed sem eros, dapibus id pharetra a, consectetur sagittis ante. Donec quis ex odio. Etiam et felis eget enim.",
        "app_link":"http://availabs.org/"
      },
      {
        "name":"npmrds",
        "label":"NPMRDS",
        "category_id":2,
        "sub_header":"",
        "image_path":"/assets/images/npmrds3.jpg",
        "description":"description_0 paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc gravida odio vitae blandit euismod. Sed sodales feugiat est, eu commodo est pretium sed. Morbi sed rutrum velit. Aenean at porta urna. Sed sem eros, dapibus id pharetra a, consectetur sagittis ante. Donec quis ex odio. Etiam et felis eget enim.",
        "app_link":"http://npmrds.availabs.org/"
      }
    ]).exec(cb);
  })
}
