/*global $:true */
/*global Handlebars:true */
/*global Backbone:true */
'use strict';
var myAws;
var fileName;

var App = App || {};

App.getAmazonKey = function(){
  var apiURL = 'http://localhost:3000'
  $.ajax({
    url: apiURL + '/amazon/sign_key/image%2Fjpeg'
  }).done(function(data){
    myAws = data;
    App.buildFormData(data);
    App.sendImageToRails(data.key);
  });
};

App.buildFormData = function(myAws){
  fileName = myAws.key;
  $('form#avatar').append('<input type="hidden" name="key" value="' + myAws.key + '">')
  $('form#avatar').append('<input type="hidden" name="AWSAccessKeyId" value="' + myAws.access_key + '">')
  $('form#avatar').append('<input type="hidden" name="policy" value="' + myAws.policy + '">')
  $('form#avatar').append('<input type="hidden" name="signature" value="' + myAws.signature + '">')
  $('form#avatar').append('<input type="hidden" name="Content-Type" value="image/jpeg">')
  $('form#avatar').append('File to upload to S3');
  $('form#avatar').append('<input id="file_upload" name="file" type="file"><br>');
  $('form#avatar').append('<input id="form-submit" type="submit" value="Upload File to S3">');
}

App.sendImageToRails = function(fileName){
  var $form = $('form#avatar');
  $('body').on('submit',$form, function(e,$form){
      App.postImageToRails(fileName);
      $($form).submit();
    });
  };

App.postImageToRails = function(fileName){
  var locate = window.location.hash;
  var point = locate.lastIndexOf('/');
  var userId = parseInt(locate.substring(point+1, locate.length));
  $.ajax({
    url: 'https://localhost:3000/users/' + userId,
    type: 'PATCH',
    data: {
      user: {
        avatar: 'https://s3.amazonaws.com/studiously-bucket/' + fileName
      }
    }
  }).done(function(response){
      App.avatarSuccess(response);
    }).fail(function(jqXHR, textStatus, errorThrow){
      console.log(jqXHR, textStatus, errorThrow);
    }).always(function(response){
      console.log(response);
    });
};


App.avatarSuccess = function(response) {
    console.log('avatar changes!');
    // window.location.reload(true);
  };

///////////////////// The following code is for file upload

$('button#task-file').on('click', function(){
  console.log('im in the task file');
  // $('task-form').append('<input type="file" id="file">');
  // $('task-form').append('<input id="task-form-submit" type="submit" value="Upload File">');
  // var selectedFile = document.getElementById('#file');
  // console.log('selected file is ' + selectedFile);
});
