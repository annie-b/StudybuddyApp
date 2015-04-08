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
var User = User || {};

var Router = Backbone.Router.extend({
  routes: {
    'home': 'home',
    'users': 'users',
    'users/:id': 'user',
    'categories': 'categories',
    'categories/:id': 'category',
    'new-category': 'newCategory',
    'update-category': 'updateCategory',
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
        App.updateCategory();
      });

      $('#delete-category').on('click', function(){
        var result = confirm("Do you want to delete this category?");
        if (result) {
          App.deleteCategory();
        }
      });

      $('#new-resource').on('click', function(){
        Resource.newResource();
      });
      $('#new-category').on('click', function(){
        Category.newCategory();
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
        Category.newCategoryForm(event,$form,router);
      });
    });
  },
});

Category.newCategoryForm = function(e,form,router){
  if(e.preventDefault) e.preventDefault();
  var name = $(form).find("input[name='category-name']").val();
  Category.newCategoryParams(name, router);
};

Category.newCategoryParams = function(name, router){
   $.ajax({
     url: App.url + '/categories',
    type: 'POST',
     data: {
       category: {
        name: name
       },
     },
     complete: function(jqXHR,textStatus){
      trace(jqXHR, textStatus, "complete category!!");
     },
     success: function(data, textStatus, jqXHR){
       router.navigate("categories",{trigger: true});
       trace(data,textStatus, jqXHR, "successful post!!");
    },
    error: function(jqXHR,error,exception){
      trace(jqXHR,error,exception);
    },
   }).done(function(response){
     trace(response, "posted category!!");
   }).fail(function(jqXHR, textStatus, thrownError){
     trace(jqXHR, textStatus, thrownError);
    router.navigate("categories",{trigger: true});
  }).always(function(response){
     trace(response);
   });
 };

 Resource.newResource = function(){
   $('#container').empty().load('partials/resource-form.html',function(response,status,xhr){
     var $form = $('#resource-form');
    $form.on('submit',function(event){
       Resource.newResourceForm(event,$form,router);
     });
   });
 };

Resource.newResourceForm = function(e,form,router){
   if(e.preventDefault) e.preventDefault();
   var title = $(form).find("input[name='resource-title']").val();
   var url = $(form).find("input[name='resource-url']").val();
   Resource.newResourceParams(title, url, router);
 };

 Resource.newResourceParams = function(title, url, router){
   var locate = window.location.hash;
   var point = locate.lastIndexOf('/');
   var categoryId = parseInt(locate.substring(point+1, locate.length));
   $.ajax({
     url: App.url + '/categories/' + categoryId + '/resources',
     type: 'POST',
     data: {
       resource: {
         title: title,
         url: url
       },
     },
     complete: function(jqXHR,textStatus){
       trace(jqXHR, textStatus, "complete resource!!");
     },
     success: function(data, textStatus, jqXHR){
       router.navigate("categories",{trigger: true});
       trace(data,textStatus, jqXHR, "successful resource!!");
     },
     error: function(jqXHR,error,exception){
       trace(jqXHR,error,exception);
     },
   }).done(function(response){
     trace(response, "posted resource!!");
   }).fail(function(jqXHR, textStatus, thrownError){
     trace(jqXHR, textStatus, thrownError);
     router.navigate("categories",{trigger: true});
   }).always(function(response){
     trace(response);
   });
 };

 Resource.updateResource = function(){
   $('#container').empty().load('partials/resource-form.html',function(response,status,xhr){
     var $form = $('#resource-form');
     $form.on('submit',function(event){
       Resource.updateResourceForm(event,$form);
     });
   });
 };

 Resource.updateResourceForm = function(e,form){
   var locate = window.location.hash;
   var point = locate.lastIndexOf('/');
   var resourceId = parseInt(locate.substring(point+1, locate.length));
   if(e.preventDefault) e.preventDefault();
   var title = $(form).find("input[name='resource-title']").val();
   var url = $(form).find("input[name='resource-url']").val();
   Resource.updateResourceParams(title, url, resourceId);
 };

 Resource.updateResourceParams = function(title, url, resourceId){
   $.ajax({
     url: App.url + '/resources/' + resourceId,
     type: 'PATCH',
     data: {
       resource: {
         title: title,
         url: url
       },
     },
    complete: function(jqXHR,textStatus){
       trace(jqXHR, textStatus, "complete resource!!");
     },
     success: function(data, textStatus, jqXHR){
       router.navigate("categories",{trigger: true});
       trace(data,textStatus, jqXHR, "successful resource!!");
     },
     error: function(jqXHR,error,exception){
       trace(jqXHR,error,exception);
     },
   }).done(function(response){
     trace(response, "posted resource!!");
   }).fail(function(jqXHR, textStatus, thrownError){
     trace(jqXHR, textStatus, thrownError);
     router.navigate("categories",{trigger: true});
   }).always(function(response){
     trace(response);
   });
 };

 Resource.deleteResource = function(){
   $('#container').empty();
   $('.jumbotron').hide();
   var locate = window.location.hash;
   var point = locate.lastIndexOf('/');
   var resourceId = parseInt(locate.substring(point+1, locate.length));
   $.ajax({
     url: App.url + '/resources/' + resourceId,
     type: 'DELETE',
   }).done(function(data){
     trace(data);
     trace('deleted category');
     window.location.href = '/#/categories';
   }).fail(function(jqXHR, textStatus, errorThrown){
     trace(jqXHR, textStatus, errorThrown);
   });
 };

 App.updateCategory = function(){
     $('#container').empty().load('partials/category-form.html',function(response,status,xhr){
       var $form = $('#category-form');
       $form.on('submit',function(event){
         Category.updateCategoryForm(event,$form);
       });
     });
 };

 Category.updateCategoryForm = function(e,form){
   var locate = window.location.hash;
   var point = locate.lastIndexOf('/');
   var categoryId = parseInt(locate.substring(point+1, locate.length));
   if(e.preventDefault) e.preventDefault();
   var name = $(form).find("input[name='category-name']").val();
   Category.updateCategoryParams(name, categoryId);
 };

 Category.updateCategoryParams = function(name, categoryId){
   $.ajax({
     url: App.url + '/categories/' + categoryId,
     type: 'PATCH',
     data: {
       category: {
         name: name
       },
     },
     complete: function(jqXHR,textStatus){
       trace(jqXHR, textStatus, "complete post!!");
     },
     success: function(data, textStatus, jqXHR){
       router.navigate("categories",{trigger: true});
       trace(data,textStatus, jqXHR, "successful post!!");
     },
     error: function(jqXHR,error,exception){
       trace(jqXHR,error,exception);
     },
   }).done(function(response){
     trace(response, "posted category!!");
   }).fail(function(jqXHR, textStatus, thrownError){
     trace(jqXHR, textStatus, thrownError);
     router.navigate("categories",{trigger: true});
   }).always(function(response){
    trace(response);
   });
 };

 App.deleteCategory = function(){
   $('#container').empty();
   $('.jumbotron').hide();
   var locate = window.location.hash;
   var point = locate.lastIndexOf('/');
   var categoryId = parseInt(locate.substring(point+1, locate.length));
   $.ajax({
     url: App.url + '/categories/' + categoryId,
     type: 'DELETE',
   }).done(function(data){
     trace(data);
     window.location.href = '/#/categories';
   }).fail(function(jqXHR, textStatus, errorThrown){
     trace(App.url + '/#/categories/' + categoryId);
     trace(jqXHR, textStatus, errorThrown);
   });
 };

 App.deleteFlashcard = function(){
   $('#container').empty();
   $('.jumbotron').hide();
   var locate = window.location.hash;
   var point = locate.lastIndexOf('/');
   var categoryId = parseInt(locate.substring(point+1, locate.length));
   $.ajax({
     url: App.url + '/categories/' + categoryId,
     type: 'DELETE',
   }).done(function(data){
     trace(data);
     window.location.href = '/#/categories';
   }).fail(function(jqXHR, textStatus, errorThrown){
     trace(App.url + '/#/categories/' + categoryId);
     trace(jqXHR, textStatus, errorThrown);
   });
 };

 App.updateUser = function(){
     $('#container').empty().load('partials/user-form.html',function(response,status,xhr){
       var $form = $('#user-form');
       $form.on('submit',function(event){
         User.updateUserForm(event,$form);
       });
     });
 };

 User.updateUserForm = function(e,form){
   var locate = window.location.hash;
   var point = locate.lastIndexOf('/');
   var userId = parseInt(locate.substring(point+1, locate.length));
   if(e.preventDefault) e.preventDefault();
   var name = $(form).find("input[name='user-name']").val();
   var email = $(form).find("input[name='user-email']").val();
   User.updateUserParams(name, email, userId);
 };

 User.updateUserParams = function(name, email, userId){
   $.ajax({
     url: App.url + '/users/' + userId,
     type: 'PATCH',
     data: {
       user: {
         name: name,
         email: email
       },
     },
     complete: function(jqXHR,textStatus){
       trace(jqXHR, textStatus, "complete post!!");
     },
     success: function(data, textStatus, jqXHR){
       router.navigate("users",{trigger: true});
       trace(data,textStatus, jqXHR, "successful post!!");
     },
     error: function(jqXHR,error,exception){
       trace(jqXHR,error,exception);
     },
   }).done(function(response){
     trace(response, "posted user!!");
   }).fail(function(jqXHR, textStatus, thrownError){
     trace(jqXHR, textStatus, thrownError);
     router.navigate("users",{trigger: true});
   }).always(function(response){
    trace(response);
   });
 };


var router = new Router();
Backbone.history.start();

$(document).ready(function(){
  $( "div#avatar-change" ).hide();
});
