/*global $:true */
/*global Backbone:true */
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
    'home': 'home',
    'users': 'users',
    'users/:id': 'user',
    'resources': 'resources',
    'resources/:id': 'resource',
    'flashcards': 'flashcards',
    'flashcards/:id': 'flashcard',
  },

  home: function(){
    $('#container').empty();
  },

  users: function(){
    $.ajax({
      url: App.url + '/users',
      type: 'GET'
    }).done(function(response){
      var template = Handlebars.compile($('#usersTemplate').html());
      $('#container').html(template({
        users: response.users
      }));
    }).fail(function(jqXHR, textStatus, errorThrown){
      race(jqXHR, textStatus, errorThrown);
    }).always(function(response){
      trace(response);
    });
  },

  user: function(id){
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
      $( 'button#avatar-change').click(function () {
        if ( $( "div#sign-in-form-slide" ).is( ":hidden" )
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

    resources: function(){
      $('#container').empty();
      $('.jumbotron').hide();

      $.ajax({
        url: App.url + '/resources',
        type: 'GET'
      }).done(function(response){
        var template = Handlebars.compile($('#resourcesTemplate').html());
        $('#container').html(template({
          resources: response.resources
        }));
      }).fail(function(jqXHR, textStatus, errorThrown){
        trace(jqXHR, textStatus, errorThrown);
      }).always(function(response){
        trace(response);
      });
    },


    })
  }
  )}
