/*global $:true */
/*global Handlebars:true */
'use strict';

var authToken;

var UserApp = (function() {
  var apiHost;

  var run = function() {
    authToken = localStorage.getItem('authToken');
    apiHost = 'http://localhost:3000';
    setupAjaxRequests();
    $('#sign-in-form').on('submit', submitLogin);
    $('#sign-up-form').on('submit', submitRegistration);
    $('#signout').on('click', signOut);
  };

  var submitRegistration = function(event) {
    event.preventDefault();
    $.ajax({
      url: apiHost + '/users',
      type: 'POST',
      data: {user: {username: $('#username').val(), name: $('#name').val(),email: $('#email').val(), password: $('#password').val()}},
    })
    .done(function(results){
      loginSuccess(results);
    })
    .fail(function(err) {
      console.log(err);
    });
    return false;
  };

  var loginSuccess = function(userData) {
    event.preventDefault();
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('currentUser', userData.id);
    $.ajax({
      url: App.url + '/users/' + userData.id,
      type: 'GET'
    }).done(function(response){
      var template = Handlebars.compile($('#userTemplate').html());
      $('#container').html(template({
        user: response
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
     window.location.href = '/#/users/' + userData.id;
  };

  var submitLogin = function(event) {
    var $form;
    event.preventDefault();
    $form = $(this);
    $.ajax({
      url: apiHost + '/users/sign_in',
      type: 'POST',
      data: $form.serialize()
    })
    .done(function(results){
      loginSuccess(results);
    })
    .fail(function(err) {
      console.log(err);
    });
    // (loginSuccess)
    // .fail(function(err) {
    //   console.log(err);
    // });
    return false;
  };

  var setupAjaxRequests = function() {
    $.ajaxPrefilter(function ( options ) {
      options.headers = {};
      options.headers['AUTHORIZATION'] = "Token token=" + localStorage.authToken;
    });
  };

  var acceptFailure = function(error) {
    if (error.status === 401) {
      console.log('SEND TO LOGIN SCREEN');
      window.location.href = '/';
    }
  };

  var signOut = function(event){
    event.preventDefault();
    localStorage.removeItem('authToken');
    authToken = undefined;
    location.reload();
     window.location.href = '/';
  };
  return {run: run};
})();

$(document).ready(function() {
  UserApp.run();
});

