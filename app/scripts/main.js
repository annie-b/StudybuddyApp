/*global $:true */
/*global Backbone:true */
// test comment
'use strict';

var trace = function(){
  for(var i = 0; i < arguments.length; i++){
    console.log(arguments[i]);
  }
};

var App = App || {
  url: 'http://localhost:3000'
};

var Category = Category || {};
var Resource = Resource || {};
var Flashcard = Flashcard || {};

var Router = Backbone.Router.extend({
  routes: {
    'home': 'home',  //http://localhost:9000/#/home,
    'users': 'users', // http://localhost:9000/users
    'users/:id': 'user',  //http://localhost:9000/#/users/1
    'categories': 'categories', //http://localhost:9000/#/categories
    'categories/:id': 'category',  //http://localhost:9000/#/categories/1
    'new-category': 'newcategory',//http://localhost:9000/#/new-category
    'update-category': 'updatecategory',//http://localhost:9000/#/update-category
    'resources': 'resources', //http://localhost:9000/#/resources
    'resources/:id': 'resource',  //http://localhost:9000/#/resources/1
},

  home: function(){
    $('#container').empty();
  },

  users: function(){
    $('#container').empty();
    $('.jumbotron').hide();
    $.ajax({
      url: App.url + '/users',
      type: 'GET'
    }).done(function(response){
      debugger;
      var template = Handlebars.compile($('#usersTemplate').html());
      $('#container').html(template({
        users: response.users
      }));
    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    }).always(function(response){
      trace(response);
    });
  },

  user: function(id){
    trace('hello from the user backbone!',id);
    $('#container').empty();
    $('.jumbotron').hide();

    var locate = window.location.hash;
    var point = locate.lastIndexOf('/');
    var userId = parseInt(locate.substring(point+1, locate.length));
    $.ajax({
      url: App.url + '/users/' + userId,
      type: 'GET'
    }).done(function(response){
      debugger;
      var template = Handlebars.compile($('#userTemplate').html());
      $('#container').html(template({
        user: response.user
      }));
      $( 'button#avatar-change' ).click(function () {
        if ( $( "div#sign-in-form-slide" ).is( ":hidden" ) ) {
          $( "div#avatar-form" ).slideDown( "slow" );
          App.getAmazonKey();
        } else {
          $( "div#sign-in-form-slide" ).hide();
        }
      });
    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    }).always(function(response){
      trace(response);
    });
  },

  categories: function(){
    $('#container').empty();
    $('.jumbotron').hide();

    $.ajax({
      url: App.url + '/categories',
      type: 'GET'
    }).done(function(response){
      var template = Handlebars.compile($('#categoriesTemplate').html());
      $('#container').html(template({
        categories: response.categories
      }));
    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    }).always(function(response){
      trace(response);
    });
  },

  category: function(id){
    $('#container').empty();
    $('.jumbotron').hide();
    var locate = window.location.hash;
    var point = locate.lastIndexOf('/');
    var categoryId = parseInt(locate.substring(point+1, locate.length));
    $.ajax({
      url: App.url + '/categories/' + categoryId,
      type: 'GET'
    }).done(function(response){
      console.log("I'm getting the category params back here");
      console.log(response);
      var template = Handlebars.compile($('#categoryTemplate').html());
      $('#container').html(template({
        category: response.category
      }));

      $('#update-category').on('click', function(){
        App.updatecategory();
      });

      $('#delete-category').on('click', function(){
        var result = confirm("Do you want to delete this category?");
        if (result) {
          App.deletecategory();
        }
      });

      $('#new-resource').on('click', function(){
        resource.newresource();
      });

    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    }).always(function(response){
      trace(response);
    });
  },

  newCategory: function(){
    $('#container').empty().load('partials/category-form.html',function(response,status,xhr){
      var $form = $('#category-form');
      $form.on('submit',function(event){
        category.newProcessForm(event,$form,router);
      });
    });
  },

  resource: function(id){
    $('#container').empty();
    $('.jumbotron').hide();
    var locate = window.location.hash;
    var point = locate.lastIndexOf('/');
    var resourceId = parseInt(locate.substring(point+1, locate.length));
    $.ajax({
      url: App.url + '/resources/' + resourceId,
      type: 'GET'
    }).done(function(response){
      var template = Handlebars.compile($('#resourceTemplate').html());
      $('#container').html(template({
        resource: response.resource
      }));

      $('#update-resource').on('click', function(){
        resource.updateResource();
        trace('hi update button is active');
      });

      $('#delete-resource').on('click', function(){
        var result = confirm("Do you want to delete this resource?");
        if (result) {
          resource.deleteResource();
        }
      });

    }).fail(function(jqXHR, textStatus, errorThrown){
      trace(jqXHR, textStatus, errorThrown);
    }).always(function(response){
      trace(response);
    });
  },


});

// category.newProcessForm = function(e,form,router){
//   if(e.preventDefault) e.preventDefault();
//   var name = $(form).find("input[name='category-name']").val();
//   category.newPostParams(name, router);
// };

// category.newPostParams = function(name, router){
//   $.ajax({
//     url: App.url + '/categories',
//     type: 'POST',
//     data: {
//       category: {
//         name: name
//       },
//     },
//     complete: function(jqXHR,textStatus){
//       trace(jqXHR, textStatus, "complete category!!");
//     },
//     success: function(data, textStatus, jqXHR){
//       router.navigate("categories",{trigger: true});
//       trace(data,textStatus, jqXHR, "successful post!!");
//     },
//     error: function(jqXHR,error,exception){
//       trace(jqXHR,error,exception);
//     },
//   }).done(function(response){
//     trace(response, "posted category!!");
//   }).fail(function(jqXHR, textStatus, thrownError){
//     trace(jqXHR, textStatus, thrownError);
//     router.navigate("categories",{trigger: true});
//   }).always(function(response){
//     trace(response);
//   });
// };

// resource.newResource = function(){
//   $('#container').empty().load('partials/resource-form.html',function(response,status,xhr){
//     var $form = $('#resource-form');
//     $form.on('submit',function(event){
//       resource.newResourceForm(event,$form,router);
//     });
//   });
// };

// resource.newResourceForm = function(e,form,router){
//   if(e.preventDefault) e.preventDefault();
//   var title = $(form).find("input[name='resource-title']").val();
//   var url = $(form).find("input[name='resource-url']").val();
//   resource.newResourceParams(title, url, router);
// };

// resource.newResourceParams = function(title, url, router){
//   var locate = window.location.hash;
//   var point = locate.lastIndexOf('/');
//   var categoryId = parseInt(locate.substring(point+1, locate.length));
//   $.ajax({
//     url: App.url + '/categories/' + categoryId + '/resources',
//     type: 'POST',
//     data: {
//       resource: {
//         title: title,
//         url: url
//       },
//     },
//     complete: function(jqXHR,textStatus){
//       trace(jqXHR, textStatus, "complete resource!!");
//     },
//     success: function(data, textStatus, jqXHR){
//       router.navigate("categories",{trigger: true});
//       trace(data,textStatus, jqXHR, "successful resource!!");
//     },
//     error: function(jqXHR,error,exception){
//       trace(jqXHR,error,exception);
//     },
//   }).done(function(response){
//     trace(response, "posted resource!!");
//   }).fail(function(jqXHR, textStatus, thrownError){
//     trace(jqXHR, textStatus, thrownError);
//     router.navigate("categories",{trigger: true});
//   }).always(function(response){
//     trace(response);
//   });
// };

// resource.updateResource = function(){
//   $('#container').empty().load('partials/resource-form.html',function(response,status,xhr){
//     var $form = $('#resource-form');
//     $form.on('submit',function(event){
//       resource.updateResourceForm(event,$form);
//     });
//   });
// };

// resource.updateResourceForm = function(e,form){
//   var locate = window.location.hash;
//   var point = locate.lastIndexOf('/');
//   var resourceId = parseInt(locate.substring(point+1, locate.length));
//   if(e.preventDefault) e.preventDefault();
//   var title = $(form).find("input[name='resource-title']").val();
//   var url = $(form).find("input[name='resource-url']").val();
//   resource.updateResourceParams(title, url, resourceId);
// };

// resource.updateResourceParams = function(title, url, resourceId){
//   $.ajax({
//     url: App.url + '/resources/' + resourceId,
//     type: 'PATCH',
//     data: {
//       resource: {
//         title: title,
//         url: url
//       },
//     },
//     complete: function(jqXHR,textStatus){
//       trace(jqXHR, textStatus, "complete resource!!");
//     },
//     success: function(data, textStatus, jqXHR){
//       router.navigate("categories",{trigger: true});
//       trace(data,textStatus, jqXHR, "successful resource!!");
//     },
//     error: function(jqXHR,error,exception){
//       trace(jqXHR,error,exception);
//     },
//   }).done(function(response){
//     trace(response, "posted resource!!");
//   }).fail(function(jqXHR, textStatus, thrownError){
//     trace(jqXHR, textStatus, thrownError);
//     router.navigate("categories",{trigger: true});
//   }).always(function(response){
//     trace(response);
//   });
// };

// resource.deleteResource = function(){
//   $('#container').empty();
//   $('.jumbotron').hide();
//   var locate = window.location.hash;
//   var point = locate.lastIndexOf('/');
//   var resourceId = parseInt(locate.substring(point+1, locate.length));
//   $.ajax({
//     url: App.url + '/resources/' + resourceId,
//     type: 'DELETE',
//   }).done(function(data){
//     trace(data);
//     trace('deleted category');
//     window.location.href = '/categories';
//   }).fail(function(jqXHR, textStatus, errorThrown){
//     trace(jqXHR, textStatus, errorThrown);
//   });
// }

// App.updateCategory = function(){
//     $('#container').empty().load('partials/category-form.html',function(response,status,xhr){
//       var $form = $('#category-form');
//       $form.on('submit',function(event){
//         category.updateProcessForm(event,$form);
//       });
//     });
// };

// category.updateProcessForm = function(e,form){
//   var locate = window.location.hash;
//   var point = locate.lastIndexOf('/');
//   var categoryId = parseInt(locate.substring(point+1, locate.length));
//   if(e.preventDefault) e.preventDefault();
//   var name = $(form).find("input[name='category-name']").val();
//   category.updatePostParams(name, categoryId);
// };

// category.updatePostParams = function(name, categoryId){
//   $.ajax({
//     url: App.url + '/categories/' + categoryId,
//     type: 'PATCH',
//     data: {
//       category: {
//         name: name
//       },
//     },
//     complete: function(jqXHR,textStatus){
//       trace(jqXHR, textStatus, "complete post!!");
//     },
//     success: function(data, textStatus, jqXHR){
//       router.navigate("categories",{trigger: true});
//       trace(data,textStatus, jqXHR, "successful post!!");
//     },
//     error: function(jqXHR,error,exception){
//       trace(jqXHR,error,exception);
//     },
//   }).done(function(response){
//     trace(response, "posted category!!");
//   }).fail(function(jqXHR, textStatus, thrownError){
//     trace(jqXHR, textStatus, thrownError);
//     router.navigate("categories",{trigger: true});
//   }).always(function(response){
//     trace(response);
//   });
// };

// App.deleteCategory = function(){
//   $('#container').empty();
//   $('.jumbotron').hide();
//   var locate = window.location.hash;
//   var point = locate.lastIndexOf('/');
//   var categoryId = parseInt(locate.substring(point+1, locate.length));
//   $.ajax({
//     url: App.url + '/categories/' + categoryId,
//     type: 'DELETE',
//   }).done(function(data){
//     trace(data);
//     window.location.href = '/categories';
//   }).fail(function(jqXHR, textStatus, errorThrown){
//     trace(App.url + '/#/categories/' + categoryId);
//     trace(jqXHR, textStatus, errorThrown);
//   });
// }

var router = new Router();
Backbone.history.start();

$(document).ready(function(){
  $( "div#avatar-change" ).hide();
});
