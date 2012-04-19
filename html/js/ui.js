// User interface callbacks

var remoteURL = "http://localhost:8088"

var alertID = 0;
function logResponse(type,title,message) {
  $("#log").html($("#log").html() + "<div id='alert"+alertID+"' class='alert "+type+" fade in'> <a class='close' data-dismiss='alert'>x</a><h4>"+title+"</h4>" + message + "</div>");
  
  if (type == "alert-success") {
    $("#alert"+alertID).delay(3000).hide('fast');
  }
  
  alertID++;
}

function save_as(filename) {
  updateEditors();
  $("#filename").val(filename);
  
  var request = $.ajax({
    url: remoteURL + "/saveas",
    crossDomain: true,
    data: $("#data").serialize(),
    type: "POST",
    dataType: "text",
  });
  
  request.success(function(resp) {
    logResponse("alert-success", "Saved", resp.responseText);
    console.log(resp);
  });
  
  request.fail(function(resp) {
    logResponse("alert-error", "Error", resp);
  });
}

function updateEditors() {
  for (var key in editors) {
    $("#" + key).val(editors[key].getValue());
  }
}

function load(filename) {
  $("#filename").val(filename);

  var request = $.ajax({
    url: remoteURL + "/load",
    crossDomain: true,
    data: {"key" : "value"},
    type: "POST",
    dataType: "text",
  });
  
  request.success(function(resp) {
    logResponse("alert-success", "Load Success", resp);
  });
  
  request.fail(function(resp) {
    logResponse("alert-error", "Error", resp.responseText);
    console.log(resp);
  });
}

function clearForm() {
  // Clear tags
  $("#tags").html("");

  // Clear fixed form widgets
  $("#data").find(':input').each(function() {
      switch(this.type) {
          case 'password':
          case 'select-multiple':
          case 'select-one':
          case 'text':
          case 'textarea':
              $(this).val('');
              break;
          case 'checkbox':
          case 'radio':
              this.checked = false;
      }
  });
}