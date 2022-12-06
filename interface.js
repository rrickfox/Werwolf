var pagehistory = [];

function gotoPage(event) {  
  target = event.target.dataset.target; 
  from = event.target.parentElement.parentElement.id;
  document.getElementById(target).style.display = "block";
  document.getElementById(from).style.display = "none";
  pagehistory.push(from);
  //console.log(event);
}

function back(event) {
  if(event.target.nodeName == "BUTTON"){
    from = event.target.parentElement.parentElement.id;
  } else {
    from = event.target.parentElement.parentElement.parentElement.id;
  }
  //console.log(from);  
  target = pagehistory.pop();             
  document.getElementById(target).style.display = "block";
  document.getElementById(from).style.display = "none";
  //console.log(pagehistory);
}

function gotoSettings(event) {
  target = "page_settings"
  from = event.target.parentElement.parentElement.id;
  document.getElementById(target).style.display = "block";
  document.getElementById(from).style.display = "none";
  pagehistory.push(from);
  //console.log(pagehistory);
}

function initInterface() {
  var buttons = document.getElementsByClassName("button");
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    if(button.dataset.target.startsWith("page_")) {          
      button.addEventListener("click", gotoPage);
    }
  }
  var backBtns = document.getElementsByClassName("back");
  for(var i = 0; i < backBtns.length; i++) {
    var backBtn = backBtns[i];
    backBtn.addEventListener("click", back);
  }
  var settingBtns = document.getElementsByClassName("settings");
  for(var i = 0; i < settingBtns.length; i++) {
    var settingBtn = settingBtns[i];
    settingBtn.addEventListener("click", gotoSettings);
  } 
}

window.addEventListener("load", initInterface);     