var editors = {}
var metadata = {
  "title": {
    "name": "title",
    "title": "Title",
    "about": "The name of this card, e.g. 'Mineral Store' or 'Yellow Medium Star'",
    "type": "text",
    "placeholder": "[Title of Card]"},
  "text": {
    "name": "text",
    "title": "Description",
    "about": "A short summary of this card",
    "type": "textarea",
    "placeholder": "Lorem ipsum dolor sit amet..."},
  "image": {
    "name": "image",
    "title": "Image",
    "about": "A visual representation of this card. Enter the atlas name and corresponding key.",
    "type": "fixed-tag",
    "keys": ["atlas","key"]},
  "icon": {
    "name": "icon",
    "title": "Icon",
    "about": "The in-game icon displayed on this card. Enter the atlas name and corresponding key.",
    "type": "fixed-tag",
    "keys": ["atlas","key"]},
};
var scripts = {
  "onPlay": {
    "name": "onPlay",
    "title": "onPlay",
    "about": "Triggered when this card is played for the first time.",
    "type": "script"},
  "requires": {
    "name": "requires",
    "title": "Requirements",
    "about": "A fragment of script run to determine whether this card can be played onto another.",
    "type": "script"},
  "onLoad": {
    "name": "onLoad",
    "title": "onLoad",
    "about": "Triggered when this card is loaded from disk.",
    "type": "script"},
  "onAttach": {
    "name": "onAttach",
    "title": "onAttach",
    "about": "Triggered when a card is attached to this one.",
    "type": "script"},
  "onRemove": {
    "name": "onRemove",
    "title": "onRemove",
    "about": "Triggered when this card is removed from its parent.",
    "type": "script"},
  "onTurn": {
    "name": "onTurn",
    "title": "onTurn",
    "about": "Triggered when the player advances the turn.",
    "type": "script"}
};
$(document).ready(function() {
  for(var key in metadata) {
    $("#metadata").html($("#metadata").html() + generateHTML(metadata[key]));
  }
  
  for(var key in scripts) {
    $("#scripts").html($("#scripts").html() + generateHTML(scripts[key]));
    
  }
  
  // Transform code areas
  for(var key in scripts) {
    editors[key] = CodeMirror.fromTextArea(document.getElementById(scripts[key].name), {
      lineNumbers: true,
      mode: "lua",
    });
  }
  
  // UI fixups
  $("#menu-save").hide();
});

function generateHTML(description) {
  html = " \
    <div class='row'> \
      <div class='span3'> \
        <a onclick='toggleHide(\"form-element-"+description.name+"\")'><h3>"+description.title+"</h3></a> \
        <p>"+description.about+"</p> \
      </div> <!-- /span3 --> \
      <div class='span8 well' id='form-element-"+description.name+"'>";
  
  switch(description.type) {
    case "text":
      html += "<input type='text' class='span4' placeholder='"+description.placeholder+"' name='"+description.name+"'>";
      break;
    case "textarea":
      html += "<textarea class='input-xlarge' name='"+description.name+"' rows='3' placeholder='"+description.placeholder+"' style='width:98%'></textarea>";
      break;
    case "fixed-tag":
      for(var tag_index in description.keys) {
        tag = description.keys[tag_index];
        html += "<div class='input-prepend'><span class='add-on'>"+tag+"</span><input class='span3' name='"+description.name+"."+tag+"' size='16' type='text'></div>&nbsp;";
      }
      break;
    case "script":
      html += "<textarea id='"+description.name+"' name='"+description.name+"'></textarea>";
      break;
    case "tag":
      html += "<input type='text' class='span4' id='tag-"+description.name+"-name' placeholder='"+description.placeholder+"' name='"+description.name+"'><hr /><div id='tag-attributes-"+description.name+"'></div><a href='#' class='btn btn-primary' onclick=\"addAttribute('"+description.name+"', 'tag-attributes-"+description.name+"'); return false;\">Add Attribute</a>";
      break;
  }
  
  return html + "</div> <!-- /span9 --> \
    </div> <!-- /row -->";
}

var attrIndex = 0;
function addAttribute(name, target) {
  var element = $("#" + target);
  
  var newHTML = "<div style='padding-bottom:4px;'><input type='text' class='span3' placeholder='key' name='key-"+name+"-"+attrIndex+"' id='key-"+name+"-"+attrIndex+"'>&nbsp;=&nbsp;<input type='text' class='span3' placeholder='value' name='value-"+name+"-"+attrIndex+"' id='value-"+name+"-"+attrIndex+"'></div>";
  
  element.append(newHTML);
  
  var newElement = name + "-" +attrIndex;
  
  attrIndex++;
  return newElement;
}

var tagIndex = 0;
function addElementOfType(type, target) {
  desc = {
    "name": "customTag" + tagIndex,
    "type": type,
    "about": "An arbitrary XML tag",
    "title": "Tag",
    "placeholder": "tag name",
  };
  
  var element = $("#"+target);
  element.append(generateHTML(desc));
  
  tagIndex++;
  return desc.name;
}

function toggleHide(id) {
  var element = $("#" + id);
  if (element.css('display') == "none") {
    element.show('fast');
  } else {
    element.hide('fast');
  }
}