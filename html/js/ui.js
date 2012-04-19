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
    url: remoteURL + "/save",
    crossDomain: true,
    data: $("#data").serialize(),
    type: "POST",
    dataType: "text",
  });
  
  request.success(function(resp) {
    logResponse("alert-success", "Saved", resp);
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
  $("#menu-save").hide();

  var request = $.ajax({
    url: remoteURL + "/load",
    crossDomain: true,
    data: {"filename" : filename},
    type: "POST",
    dataType: "text",
  });
  
  request.success(function(resp) {
    clearForm();
    logResponse("alert-success", "Load Success", "");
    $("#menu-save").show();
    
    json = JSON.parse(resp);
    console.log(json);
    $("#filename").val(json.filename);
    
    // Populate form fields
    $("#form-element-title input").val(json.title);
    $("#form-element-text textarea").val(json.title);
    $($("#form-element-icon input")[0]).val(json.icon.atlas);
    $($("#form-element-icon input")[1]).val(json.icon.key);
    $($("#form-element-image input")[0]).val(json.image.atlas);
    $($("#form-element-image input")[1]).val(json.image.key);
    
    for (var key in scripts) {
      if (json[key]) {
        editors[key].setValue(json[key]);
        $("#form-element-"+key).show('fast');
      } else {
        $("#form-element-"+key).hide('fast');
      }
    }
    
    for (var key in json.tags) {
      tag = json.tags[key];
      var elementName = addElementOfType("tag","tags");
      $("#tag-"+elementName+"-name").val("" + tag.name);
      
      if (tag.attributes) {
        for(var attr in tag.attributes) {
          var attrName = addAttribute(elementName, 'tag-attributes-'+elementName);
          $("#key-"+attrName).val(attr);
          $("#value-"+attrName).val(tag.attributes[attr]);
        }
      }
    }
  });
  
  request.fail(function(resp) {
    logResponse("alert-error", "Error", resp.responseText);
    console.log(resp);
  });
}

function clearForm() {
  // Clear tags
  $("#tags").html("");
  
  // Reset indices
  attrIndex = 0;
  tagIndex = 0;
  
  // Clear editors
  for (var key in scripts) {
    editors[key].setValue("");
  }

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