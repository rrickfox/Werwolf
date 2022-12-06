var allpersons;
var newGroup;
var allGroups;
var game = {};
var newGamePageIndex = 0;
var pages = ["page_select_group", "page_select_players", "page_select_cards"];

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function loadAllPersons() {
  var persons = localStorage.getItem("allPersons");
  if(persons != null) {
    allpersons = JSON.parse(persons);         
    var ul = document.getElementsByClassName("allPersons")[0];
    for(var i = 0; i < allpersons.length; i++) {
      var elem = document.createElement("li");
      elem.setAttribute("class", "person");
      elem.setAttribute("data-index", i);
      elem.innerHTML = allpersons[i];    
      var span = document.createElement("span");
      span.innerHTML = "&times;";
      span.setAttribute("class", "deletePerson");
      span.addEventListener("click", deletePerson);
      elem.appendChild(span);
      ul.appendChild(elem);  
    }   
  } else {
    allpersons = [];
  }
  //console.log(allpersons);
}

function addPerson() {
  var person = document.getElementById("addPerson").value;
  if(person != "") {
    allpersons.push(person);
    localStorage.setItem("allPersons", JSON.stringify(allpersons));
    document.getElementById("addPerson").value = "";
    var elem = document.createElement("li");
    elem.setAttribute("class", "person");  
    elem.setAttribute("data-index", allpersons.length - 1);
    var span = document.createElement("span");
    span.innerHTML = "&times;";
    span.setAttribute("class", "deletePerson");
    span.addEventListener("click", deletePerson);
    elem.innerHTML = person;
    elem.appendChild(span);
    document.getElementsByClassName("allPersons")[0].appendChild(elem);
    //console.log(allpersons);
  }
}

function deletePerson(event) {
  var index = parseInt(event.target.parentElement.dataset.index);      
  //console.log(index)
  allpersons.splice(index, 1);
  localStorage.setItem("allPersons", JSON.stringify(allpersons));
  var child = event.target.parentElement;           
  var ul = child.parentElement;
  child.parentElement.removeChild(child);
  for(var i = 0; i < ul.children.length; i++) {
    var elem = ul.children[i];    
    var index2 = parseInt(elem.dataset.index);
    if(index2 > index) {
      elem.dataset.index = --index2;
    } 
  }
}

function addByEnter(event) {
  if(event.keyCode == 13) {
    //console.log("ENTER!");
    if(event.target.id == "addPerson") {
      addPerson();
    }      
  }
}

function loadAllGroups() {
  var groups = localStorage.getItem("allGroups");
  if(groups != null) {
    allGroups = JSON.parse(groups);                  
    var ul = document.getElementsByClassName("allGroups")[0];
    for(var i = 0; i < allGroups.length; i++) {
      var group = allGroups[i];
      var li = document.createElement("li");  
      li.setAttribute("class", "group");
      li.innerHTML = group.name;
      li.dataset.index = allGroups.length - 1;
      var span = document.createElement("span");
      span.innerHTML = "&times;";
      span.setAttribute("class", "deleteGroup");
      span.addEventListener("click", deleteGroup);
      li.appendChild(span);
      li.addEventListener("click", editGroup);
      ul.appendChild(li);
    }
  } else {
    allGroups = [];
  }
}

function loadNewGroup() {
  newGroup = [];
  var ul = document.getElementsByClassName("allPersons")[1];
  document.getElementById("addGroup").value = "";
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.lastChild);
  }
  for(var i = 0; i < allpersons.length; i++) {
    var elem = document.createElement("li");
    elem.setAttribute("class", "person");
    elem.setAttribute("data-index", i);
    elem.innerHTML = allpersons[i];   
    elem.addEventListener("click", addPersonToGroup);
    ul.appendChild(elem);  
  }    
}

function addPersonToGroup(event) {
  var child = event.target;
  child.style.backgroundColor = "#99e699";
  child.style.border = "1px solid #666";
  child.removeEventListener("click", addPersonToGroup);
  child.addEventListener("click", removePersonFromGroup);
  child.dataset.groupindex = newGroup.length;
  newGroup.push(child.innerHTML);
  //console.log(newGroup);
}

function removePersonFromGroup(event) {
  var child = event.target;  
  child.style.backgroundColor = "#fff";
  child.style.border = "1px solid #ccc";                        
  child.removeEventListener("click", removePersonFromGroup);
  child.addEventListener("click", addPersonToGroup);
  var groupindex = child.dataset.groupindex;
  newGroup.splice(groupindex, 1);
  child.removeAttribute("data-groupindex");
  //console.log(newGroup);
  var ul = child.parentElement;
  for(var i = 0; i < ul.children.length; i++) {
    var elem = ul.children[i];    
    var index2 = parseInt(elem.dataset.groupindex);
    if(index2 !== undefined && index2 > groupindex) {
      elem.dataset.groupindex = --index2;
    } 
  }
}

function generateGroup() {
  var group = {};
  group.name = document.getElementById("addGroup").value;
  if(group.name != "") {
    group.array = newGroup;
    allGroups.push(group);
    localStorage.setItem("allGroups", JSON.stringify(allGroups));
    //console.log(allGroups);
    loadNewGroup();
    var ul = document.getElementsByClassName("allGroups")[0];
    var li = document.createElement("li");
    li.setAttribute("class", "group");
    li.innerHTML = group.name;
    li.dataset.index = allGroups.length - 1;
    var span = document.createElement("span");
    span.innerHTML = "&times;";
    span.setAttribute("class", "deleteGroup");
    span.addEventListener("click", deleteGroup);
    li.appendChild(span);
    li.addEventListener("click", editGroup);
    ul.appendChild(li);
    document.getElementById("page_manage_groups").style.display = "block";
    document.getElementById("page_new_group").style.display = "none";
    pagehistory.pop();
  }
}

function deleteGroup(event) {
  var index = parseInt(event.target.parentElement.dataset.index);      
  allGroups.splice(index, 1);
  localStorage.setItem("allGroups", JSON.stringify(allGroups));
  var child = event.target.parentElement;           
  var ul = child.parentElement;
  child.parentElement.removeChild(child);
  for(var i = 0; i < ul.children.length; i++) {
    var elem = ul.children[i];    
    var index2 = parseInt(elem.dataset.index);
    if(index2 > index) {
      elem.dataset.index = --index2;
    } 
  }
  
}

function editGroup(event) {
  //console.log(event);
  if(event.target.nodeName != "SPAN") {
    var index = parseInt(event.target.dataset.index);
    var group = allGroups[index];
    newGroup = group.array;
    var ul = document.getElementsByClassName("allPersons")[1];
    document.getElementById("addGroup").value = group.name;
    while (ul.hasChildNodes()) {
      ul.removeChild(ul.lastChild);
    }
    for(var i = 0; i < allpersons.length; i++) {
      var elem = document.createElement("li");
      elem.setAttribute("class", "person");
      elem.setAttribute("data-index", i);
      elem.innerHTML = allpersons[i];   
      if(newGroup.includes(allpersons[i])) {
        elem.style.backgroundColor = "#99e699";
        elem.style.border = "1px solid #666";
        elem.addEventListener("click", removePersonFromGroup);
        elem.dataset.groupindex = newGroup.indexOf(allpersons[i]);    
        ul.appendChild(elem); 
      } else {    
        elem.addEventListener("click", addPersonToGroup);
        ul.appendChild(elem);
      }
    }
    document.getElementById("page_manage_groups").style.display = "none";
    document.getElementById("page_new_group").style.display = "block";  
    pagehistory.push("page_manage_groups");
  }
}

function newGame() {
  game.groups = [];
  newGamePageIndex = 0;
  var ul = document.getElementsByClassName("allGroups")[1];
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.lastChild);
  }
  for(var i = 0; i < allGroups.length; i++) {
    var group = allGroups[i];
    var li = document.createElement("li");  
    li.setAttribute("class", "group");
    li.innerHTML = group.name;
    li.dataset.index = allGroups.length - 1;
    li.addEventListener("click", selectGroup);
    ul.appendChild(li);
  }
  for(var i = 0; i < pages.length; i++) {
    document.getElementById(pages[i]).getElementsByClassName("next")[0].addEventListener("click", next);
  }
}

function selectGroup(event) {
  var child = event.target;
  child.style.backgroundColor = "#99e699";
  child.style.border = "1px solid #666";
  child.removeEventListener("click", selectGroup);
  child.addEventListener("click", deselectGroup);
  child.dataset.index = game.groups.length;
  game.groups.push(allGroups.find(p => p.name === child.innerHTML));
  //console.log(game.groups);
}

function deselectGroup(event) {
  var child = event.target;  
  child.style.backgroundColor = "#fff";
  child.style.border = "1px solid #ccc";                        
  child.removeEventListener("click", deselectGroup);
  child.addEventListener("click", selectGroup);
  var index = child.dataset.index;
  game.groups.splice(index, 1);
  child.removeAttribute("index");
  //console.log(game.groups);
  var ul = child.parentElement;
  for(var i = 0; i < ul.children.length; i++) {
    var elem = ul.children[i];    
    var index2 = parseInt(elem.dataset.index);
    if(index2 !== undefined && index2 > index) {
      elem.dataset.index = --index2;
    } 
  }
}

function selectPlayer(event) {
  //console.log("player selected");
  var child = event.target;
  child.style.backgroundColor = "#99e699";
  child.style.border = "1px solid #666";
  child.removeEventListener("click", selectPlayer);
  child.addEventListener("click", deselectPlayer);
  child.dataset.gameindex = game.allplayers.length;
  game.allplayers.push(child.innerHTML);
  //console.log(game.allplayers)
}

function deselectPlayer(event) {
  //console.log("player deselected");
  var child = event.target;  
  child.style.backgroundColor = "#fff";
  child.style.border = "1px solid #ccc";                        
  child.removeEventListener("click", deselectPlayer);
  child.addEventListener("click", selectPlayer);
  var index = child.dataset.gameindex;
  game.allplayers.splice(index, 1);
  child.removeAttribute("data-gameindex");
  var ul = child.parentElement;
  for(var i = 0; i < ul.children.length; i++) {
    var elem = ul.children[i];    
    var index2 = parseInt(elem.dataset.gameindex);
    if(index2 !== undefined && index2 > index) {
      elem.dataset.gameindex = --index2;
    } 
  }
}

function selectCard(event) {
  //console.log("card selected");
  var child = event.target;
  child.style.backgroundColor = "#99e699";
  child.style.border = "1px solid #666";
  child.removeEventListener("click", selectCard);
  child.addEventListener("click", deselectCard);
  child.dataset.cardindex = game.cards.length;
  var card = types.find(p => p.gername === child.innerHTML);
  game.cards.push(card.name);
  updateCardCount();
  //console.log(game.cards);  
}

function deselectCard(event) {
  //console.log("card deselected");
  var child = event.target;  
  child.style.backgroundColor = "#fff";
  child.style.border = "1px solid #ccc";                        
  child.removeEventListener("click", deselectCard);
  child.addEventListener("click", selectCard);
  var index = child.dataset.cardindex;
  game.cards.splice(index, 1);
  child.removeAttribute("data-cardindex");
  var ul = child.parentElement;
  for(var i = 0; i < ul.children.length; i++) {
    var elem = ul.children[i];    
    var index2 = parseInt(elem.dataset.cardindex);
    if(index2 !== undefined && index2 > index) {
      elem.dataset.cardindex = --index2;
    } 
  }
  updateCardCount();
  //console.log(game.cards);
}

function updatePlayers(notType = null) {
  var ul = document.getElementById("allPlayers");
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.lastChild);
  }
  for(let i = 0; i < game.players.length; i++) {
    let player = game.players[i];
    if(player.status == "alive") {
      //console.log("spieler '" + player.name + "' ist am leben");
      if(notType) {
        if(player.type == notType) {
          console.log("Spieler '" + player.name + "' wird nicht angezeigt");
        } else {
          let li = document.createElement("li");
          li.innerHTML = player.name;
          li.setAttribute("class", "player");
          li.addEventListener("click", gameListener);
          ul.appendChild(li);
        }
      } else {
        if(player.type == "bewohner") {
          let li = document.createElement("li");
          li.innerHTML = player.name;
          li.setAttribute("class", "player");
          li.addEventListener("click", gameListener);
          ul.appendChild(li);
        }
      }
    }
  }
  ul = document.getElementById("allDeaths");
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.lastChild);
  }
  for(let i = 0; i < game.deaths.length; i++) {
    let player = game.deaths[i];
    if(player.status == "dead") {
      //console.log("spieler '" + player.name + "' ist tot");
      let li = document.createElement("li");
      li.innerHTML = player.name;
      li.setAttribute("class", "player");
      li.addEventListener("click", gameListener);
      ul.appendChild(li);
    }
  }
  ul = document.getElementById("allCards");
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.lastChild);
  }
  for(var i = 0; i < types.length; i++) {
    var card = types[i];
    if(game.players.find(p => p.type === card.name) && !(card.name == "bewohner" || card.name == "werwolf" || card.name == "vampir")) {
      //card is already assigned
    } else {
      var li = document.createElement("li");
      li.setAttribute("class", "card");
      li.innerHTML = card.gername;
      li.addEventListener("click", gameListener);
      ul.appendChild(li);
    }
  }
}

function gameListener(event) {
  if(types.find(p => p.gername === event.target.innerHTML)) {
    var card = types.find(p => p.gername === event.target.innerHTML);
    var child = event.target;
    if(!game.actions.includes(card.name)){
      game.actions.push(card.name);
      child.style.backgroundColor = "#99e699";
      child.style.border = "1px solid #666";
    } else {
      let index = game.actions.indexOf(card.name);
      game.actions.splice(index, 1);
      child.style.backgroundColor = "#fff";
      child.style.border = "1px solid #ccc";  
    }
  } else {
    var player = game.players.find(p => p.name === event.target.innerHTML);
    //console.log("spieler '" + player.name + "' wurde gewählt");         
    var child = event.target;
    if(!game.actions.includes(player.name)){
      game.actions.push(player.name);
      child.style.backgroundColor = "#99e699";
      child.style.border = "1px solid #666";
    } else {
      let index = game.actions.indexOf(player.name);
      game.actions.splice(index, 1);
      child.style.backgroundColor = "#fff";
      child.style.border = "1px solid #ccc";  
    }
    //console.log(game.actions); 
  }
}

function edit() {
  var type = document.getElementById("type").value;
  if(type == "liebespaar") {
    let player1 = game.players.filter(p => p.amor === true)[0];
    let index1 = game.players.indexOf(player1);
    let player2 = game.players.filter(p => p.amor === true)[1];
    let index2 = game.players.indexOf(player2);
    game.players[index1].amor = false;
    game.players[index2].amor = false; 
  } else if(type == "strolchopfer") {
    let player1 = game.players.filter(p => p.strolch === true)[0];
    let index1 = game.players.indexOf(player1);
    let player2 = game.players.filter(p => p.strolch === true)[1];
    let index2 = game.players.indexOf(player2);
    game.players[index1].strolch = false;
    game.players[index2].strolch = false; 
  } else if(type == "doppelgangerperson") {
    let player = game.players.find(p => p.type === "doppelganger");
    let index = game.players.indexOf(player);
    game.players[index].special = "";
  } else {
    var player = game.players.find(p => p.type === type);
    while(player) {
      changetype(player.name, "bewohner");
      player = game.players.find(p => p.type === type);
    }
  }
  document.getElementById("next_ingame").removeAttribute("disabled");
  document.getElementById("next_ingame").style.backgroundColor = "#0073e6";
  game.daystate--;
  prepareLayout("");  
}

function updateCardCount() {
  var cardCount = game.cards.length;
  cardCount += parseInt(document.getElementById("count_bewohner").value); 
  cardCount += parseInt(document.getElementById("count_werwolf").value); 
  cardCount += parseInt(document.getElementById("count_vampir").value); 
  document.getElementById("num_persons").innerHTML = game.allplayers.length + " Personen<br>" + cardCount + " Karten";
}

//-----------------------------------------------------------------------------
//TO DO's:
//herausfinden wie Doppelgänger gesagt wird, welche identität er annimmt
//-----------------------------------------------------------------------------

function prepareGame() {
  var error = "";
  var next = document.getElementById("next_ingame");
  console.log("------------------------------");  
  
  console.log("processing daystate " + game.daystate + "...");
  if(isEven(game.daycycle)) {
    if(game.daystate == 0) {
      document.getElementById("edit").style.display = "block";
    } else if(game.daystate == 1) {
      console.log("amor festlegen");
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "amor");
    } else if(game.daystate == 2) {
      console.log("amor bestätigen");
      game.actions = [];  
      updatePlayers("amor"); //Beim Liebespaar nicht Amor anzeigen
    } else if(game.daystate == 3) {
      console.log("liebespaar festlegen");
      if(!game.actions[0] || !game.actions[1]) {
        error = "Du musst zwei Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      let player1 = game.players.find(p => p.name === game.actions[0]);
      let index1 = game.players.indexOf(player1);
      let player2 = game.players.find(p => p.name === game.actions[1]);
      let index2 = game.players.indexOf(player2);
      game.players[index1].amor = true;
      game.players[index2].amor = true;
      console.log("'" + player1.name + "' mit '" + player2.name + "' verkuppelt");
    } else if(game.daystate == 4) {
      console.log("liebespaar bestätigen");
      game.actions = [];
      updatePlayers();
    } else if(game.daystate == 5) {
      console.log("harter bursche festlegen");  
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "bursche");
    } else if(game.daystate == 6) {
      console.log("harter bursche bestätigen");
      game.actions = [];                       
      updatePlayers();
    } else if(game.daystate == 7) {
      console.log("aussätzige festlegen");       
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "aussatzige");
    } else if(game.daystate == 8) {
      console.log("aussätzige bestätigen");    
      game.actions = [];  
      updatePlayers();
    } else if(game.daystate == 9) {
      console.log("lykanthrophin festlegen");    
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "lykanthrophin");
    } else if(game.daystate == 10) {
      console.log("lykanthrophin bestätigen");   
      game.actions = [];    
      updatePlayers();
    } else if(game.daystate == 11) {
      console.log("jäger festlegen");          
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "jager");
    } else if(game.daystate == 12) {
      console.log("jäger bestätigen");
      game.actions = [];  
      updatePlayers();
    } else if(game.daystate == 13) {
      console.log("altermann festlegen");   
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "altermann");
    } else if(game.daystate == 14) {
      console.log("altermann bestätigen"); 
      game.actions = [];    
      updatePlayers();
    } else if(game.daystate == 15) {
      console.log("trunkenbold festlegen");
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "trunkenbold");
    } else if(game.daystate == 16) {
      console.log("trunkenbold bestätigen"); 
      game.actions = [];  
      updatePlayers();
    } else if(game.daystate == 17) {
      console.log("trunkenbold identität festlegen");
      if(!game.actions[0]) {
        game.actions[0] = "bewohner";
      }
      var player = game.players.find(p => p.type === "trunkenbold");
      let index = game.players.indexOf(player);
      game.players[index].special = game.actions[0];
      game.actions = [];                             
      allCards.style.display = "none";
    } else if(game.daystate == 18) {
      console.log("wolfsjunges festlegen");         
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "wolfsjunges");
    } else if(game.daystate == 19) {
      console.log("wolfsjunges bestätigen");
      game.actions = [];   
      updatePlayers();
    } else if(game.daystate == 20) {
      console.log("strolch festlegen");
      changetype(game.actions[0], "strolch");
    } else if(game.daystate == 21) {
      console.log("strolch bestätigen");
      game.actions = [];  
      updatePlayers();
    } else if(game.daystate == 22) {
      console.log("strolch opfer festlegen");  
      if(!game.actions[0] || !game.actions[1]) {
        error = "Du musst zwei Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      let player1 = game.players.find(p => p.name === game.actions[0]);
      let index1 = game.players.indexOf(player1);
      let player2 = game.players.find(p => p.name === game.actions[1]);
      let index2 = game.players.indexOf(player2);
      game.players[index1].strolch = true;
      game.players[index2].strolch = true;
      console.log("'" + player1.name + "' und '" + player2.name + "' sind Strolchopfer");
    } else if(game.daystate == 23) {
      console.log("strolch opfer bestätigen"); 
      game.actions = [];  
      updatePlayers();
    } else if(game.daystate == 24) {
      console.log("geist festlegen");   
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "geist");
    } else if(game.daystate == 25) {
      console.log("geist bestätigen");
      game.actions = [];  
      updatePlayers();
    } else if(game.daystate == 26) {
      console.log("einsamer werwolf festlegen");  
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "einsamerwerwolf");
    } else if(game.daystate == 27) {
      console.log("einsamer werwolf bestätigen");
      game.actions = [];  
      updatePlayers();
    } else if(game.daystate == 28) {
      console.log("gerber festlegen");      
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "gerber");
    } else if(game.daystate == 29) {
      console.log("gerber bestätigen");  
      game.actions = [];    
      updatePlayers();
    } else if(game.daystate == 30) {
      console.log("doppelgänger festlegen"); 
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "doppelganger");
    } else if(game.daystate == 31) {
      console.log("doppelgänger bestätigen");
      game.actions = [];    
      updatePlayers("doppelganger"); //bei Wahl von Doppelgänger Person Doppelgänger nicht anzeigen
    } else if(game.daystate == 32) {
      console.log("doppelgänger person wählen"); 
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      var player = game.players.find(p => p.type === "doppelganger");
      let index = game.players.indexOf(player);
      game.players[index].special = game.actions[0];
    } else if(game.daystate == 33) {
      console.log("doppelgänger person bestätigen");
      game.actions = [];   
      updatePlayers();
    } else if(game.daystate == 34) {
      console.log("prinz festlegen");     
      if(!game.actions[0]) {
        error = "Du musst eine Person wählen!";
        next.setAttribute("disabled", "disabled");
        next.style.backgroundColor = "lightsteelblue";
        return null;
      }
      changetype(game.actions[0], "prinz");
    } else if(game.daystate == 35) {
      console.log("prinz bestätigen");
      game.actions = []; 
      updatePlayers(); 
    } else if(game.daystate == 36) {
      console.log("trunkenbold identität freigeben");    //nur nacht 3, daystate 4
      document.getElementById("edit").style.display = "none";
    } else if(game.daystate == 37) {
      console.log("schlampe festlegen");
    } else if(game.daystate == 38) {
      console.log("schlampe bestätigen");
    } else if(game.daystate == 39) {
      console.log("schlampe ziel wählen");
    } else if(game.daystate == 40) {
      console.log("schlampe ziel bestätigen");
    } else if(game.daystate == 41) {
      console.log("leibwächter festlegen");
    } else if(game.daystate == 42) {
      console.log("leibwächter bestätigen");
    } else if(game.daystate == 43) {
      console.log("leibwächter ziel wählen");
    } else if(game.daystate == 44) {
      console.log("leibwächter ziel bestätigen");
    } else if(game.daystate == 45) {
      console.log("werwölfe festlegen");
    } else if(game.daystate == 46) {
      console.log("werwölfe bestätigen");
    } else if(game.daystate == 47) {
      console.log("werwölfe opfer wählen");
    } else if(game.daystate == 48) {
      console.log("werwölfe opfer bestätigen");
    } else if(game.daystate == 49) {
      console.log("vampire festlegen");
    } else if(game.daystate == 50) {
      console.log("vampire bestätigen");
    } else if(game.daystate == 51) {
      console.log("vampire opfer wählen");
    } else if(game.daystate == 52) {
      console.log("vampire opfer bestätigen");
    } else if(game.daystate == 53) {
      console.log("hexe festlegen");
    } else if(game.daystate == 54) {
      console.log("hexe bestätigen");
    } else if(game.daystate == 55) {
      console.log("hexe heilen wählen");
    } else if(game.daystate == 56) {
      console.log("hexe heilen bestätigen");
    } else if(game.daystate == 57) {
      console.log("hexe töten wählen");
    } else if(game.daystate == 58) {
      console.log("hexe töten bestätigen");
    } else if(game.daystate == 59) {
      console.log("hexer festlegen");
    } else if(game.daystate == 60) {
      console.log("hexer bestätigen");
    } else if(game.daystate == 61) {
      console.log("hexer heilen wählen");
    } else if(game.daystate == 62) {
      console.log("hexer heilen bestätigen");
    } else if(game.daystate == 63) {
      console.log("hexer töten wählen");
    } else if(game.daystate == 64) {
      console.log("hexer töten bestätigen");
    } else if(game.daystate == 65) {
      console.log("seherin festlegen");
    } else if(game.daystate == 66) {
      console.log("seherin bestätigen");
    } else if(game.daystate == 67) {
      console.log("seherin spieler wählen");
    } else if(game.daystate == 68) {
      console.log("seherin spieler bestätigen + anzeigen");
    } else if(game.daystate == 69) {
      console.log("seher festlegen");
    } else if(game.daystate == 70) {
      console.log("seher bestätigen");
    } else if(game.daystate == 71) {
      console.log("seher spieler wählen");
    } else if(game.daystate == 72) {
      console.log("seher spieler bestätigen + anzeigen");
    } else if(game.daystate == 73) {
      console.log("alte vettel festlegen");
    } else if(game.daystate == 74) {
      console.log("alte vettel bestätigen");
    } else if(game.daystate == 75) {
      console.log("alte vettel opfer wählen");
    } else if(game.daystate == 76) {
      console.log("alte vettel opfer bestätigen");
    } else if(game.daystate == 77) {
      console.log("kultführer festlegen");
    } else if(game.daystate == 78) {
      console.log("kultführer bestätigen");
    } else if(game.daystate == 79) {
      console.log("kultführer spieler wählen");
    } else if(game.daystate == 80) {
      console.log("kultführer spieler bestätigen");
    } else if(game.daystate == 81) {
      console.log("unruherstifterin festlegen");
    } else if(game.daystate == 82) {
      console.log("unruhestifterin bestätigen");
    } else if(game.daystate == 83) {
      console.log("unruhestifterin aufmischen");
    } else if(game.daystate == 84) {
      console.log("priester festlegen");
    } else if(game.daystate == 85) {
      console.log("priester bestätigen");
    } else if(game.daystate == 86) {
      console.log("priester spieler wählen");
    } else if(game.daystate == 87) {
      console.log("priester spieler bestätigen");
    }
  } else {
    if(game.daystate == 0) {
      console.log("anzeige wer gestorben ist und warum");
    } else if(game.daystate == 1) {
      console.log("person zum lynchen wählen");
    } else if(game.daystate == 2) {
      console.log("person zum lynchen bestätigen");
    } else if(game.daystate == 3) {
      console.log("märtyrerin fragen");
    } else if(game.daystate == 4) {
      console.log("märtyrerin festlegen");
    }
  }
  console.log("done");
  game.daystate = nextState();
  console.log("next daystate is: " + game.daystate);
  if(isEven(game.daycycle)) {
    console.log("prepare night");
  } else {
    console.log("prepare day");
  }
  console.log("preparing layout...");
  //prepare layout
  prepareLayout(error);
  console.log("done")
}

function prepareLayout(error) {   
  var heading = document.getElementById("game_heading");
  var allPlayers = document.getElementById("allPlayers");
  var allDeaths = document.getElementById("allDeaths");
  var allCards = document.getElementById("allCards");
  var message = document.getElementById("game_message");
  var message_text = document.getElementsByClassName("message")[0];
  var edit = document.getElementById("edit");
  var type = document.getElementById("type");
  
  if(isEven(game.daycycle)) {
    if(game.daystate == 1) {
      console.log("layout amor festlegen");
      heading.innerHTML = "Amor";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "block";
    } else if(game.daystate == 2) {
      console.log("layout amor bestätigen");
      heading.innerHTML = "Amor";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "amor";
        return null;
      }
      let player = game.players.find(p => p.type === "amor");
      message_text.innerHTML = "Du hast als Amor '" + player.name + "' gewählt. Stimmt das?";
      type.value = "amor";
    } else if(game.daystate == 3) {
      console.log("layout liebespaar festlegen");
      heading.innerHTML = "Liebespaar";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "block";  
    } else if(game.daystate == 4) {
      console.log("layout liebespaar bestätigen");
      heading.innerHTML = "Liebespaar";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";       
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "amor";
        return null;
      }
      let player1 = game.players.filter(p => p.amor === true)[0];
      let player2 = game.players.filter(p => p.amor === true)[1];
      message_text.innerHTML = "Du hast als Liebespaar '" + player1.name + "' und '" + player2.name + "' gewählt. Stimmt das?";
      type.value = "liebespaar";
    } else if(game.daystate == 5) {
      console.log("layout harter bursche festlegen");
      heading.innerHTML = "Harter Bursche";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "block";
    } else if(game.daystate == 6) {
      console.log("layout harter bursche bestätigen");
      heading.innerHTML = "Harter Bursche";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";    
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "bursche";
        return null;
      }
      let player = game.players.find(p => p.type === "bursche");
      message_text.innerHTML = "Du hast als Harter Bursche '" + player.name + "' gewählt. Stimmt das?";
      type.value = "bursche";
    } else if(game.daystate == 7) {
      console.log("layout aussätzige festlegen");  
      heading.innerHTML = "Aussätzige";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "block";
    } else if(game.daystate == 8) {
      console.log("layout aussätzige bestätigen");
      heading.innerHTML = "Aussätzige";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "aussatzige";
        return null;
      }
      let player = game.players.find(p => p.type === "aussatzige");
      message_text.innerHTML = "Du hast als Aussätzige '" + player.name + "' gewählt. Stimmt das?";
      type.value = "aussatzige";
    } else if(game.daystate == 9) {
      console.log("layout lykanthrophin festlegen"); 
      heading.innerHTML = "Lykanthrophin";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "block";
    } else if(game.daystate == 10) {
      console.log("layout lykanthrophin bestätigen");
      heading.innerHTML = "Lykanthrophin";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "lykanthrophin";
        return null;
      }
      let player = game.players.find(p => p.type === "lykanthrophin");
      message_text.innerHTML = "Du hast als Lykanthrophin '" + player.name + "' gewählt. Stimmt das?";
      type.value = "lykanthrophin";
    } else if(game.daystate == 11) {
      console.log("layout jäger festlegen"); 
      heading.innerHTML = "Jäger";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "block";
    } else if(game.daystate == 12) {
      console.log("layout jäger bestätigen"); 
      heading.innerHTML = "Jäger";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "jager";
        return null;
      }
      let player = game.players.find(p => p.type === "jager");
      message_text.innerHTML = "Du hast als Jäger '" + player.name + "' gewählt. Stimmt das?";
      type.value = "jager";
    } else if(game.daystate == 13) {
      console.log("layout altermann festlegen");   
      heading.innerHTML = "Alter Mann";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "block";
    } else if(game.daystate == 14) {
      console.log("layout altermann bestätigen");   
      heading.innerHTML = "Alter Mann";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";   
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "altermann";
        return null;
      }
      let player = game.players.find(p => p.type === "altermann");
      message_text.innerHTML = "Du hast als Alter Mann '" + player.name + "' gewählt. Stimmt das?";
      type.value = "altermann";
    } else if(game.daystate == 15) {
      console.log("layout trunkenbold festlegen"); 
      heading.innerHTML = "Trunkenbold";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "block";
    } else if(game.daystate == 16) {
      console.log("layout trunkenbold bestätigen");  
      heading.innerHTML = "Trunkenbold";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";   
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "trunkenbold";
        return null;
      }
      let player = game.players.find(p => p.type === "trunkenbold");
      message_text.innerHTML = "Du hast als Trunkenbold '" + player.name + "' gewählt. Stimmt das?";
      type.value = "trunkenbold";
    } else if(game.daystate == 17) {
      console.log("layout trunkenbold identität festlegen"); 
      heading.innerHTML = "Trunkenbold";
      message.style.display = "none";
      allDeaths.style.display = "none";
      allPlayers.style.display = "none";
      allCards.style.display = "block";
    } else if(game.daystate == 18) {
      console.log("layout wolfsjunges festlegen");   
      heading.innerHTML = "Wolfsjunges";
      message.style.display = "none";
      allDeaths.style.display = "none";   
      allPlayers.style.display = "block";    
    } else if(game.daystate == 19) {
      console.log("layout wolfsjunges bestätigen");  
      heading.innerHTML = "Wolfsjunges";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none"; 
      message.style.display = "block";  
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "wolfsjunges";
        return null;
      }
      let player = game.players.find(p => p.type === "wolfsjunges");
      message_text.innerHTML = "Du hast als Wolfsjunges '" + player.name + "' gewählt. Stimmt das?";
      type.value = "wolfsjunges";
    } else if(game.daystate == 20) {
      console.log("layout strolch festlegen");  
      heading.innerHTML = "Strolch";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 21) {
      console.log("layout strolch bestätigen"); 
      heading.innerHTML = "Strolch";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "strolch";
        return null;
      }
      let player = game.players.find(p => p.type === "strolch");
      message_text.innerHTML = "Du hast als Strolch '" + player.name + "' gewählt. Stimmt das?";
      type.value = "strolch";
    } else if(game.daystate == 22) {
      console.log("layout strolch opfer festlegen"); 
      heading.innerHTML = "Strolch Opfer";
      message.style.display = "none";
      allDeaths.style.display = "none";  
      allPlayers.style.display = "block";
    } else if(game.daystate == 23) {
      console.log("layout strolch opfer bestätigen");
      heading.innerHTML = "Strolch Opfer";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "strolchopfer";
        return null;
      }
      let player1 = game.players.filter(p => p.strolch === true)[0];
      let player2 = game.players.filter(p => p.strolch === true)[1];
      message_text.innerHTML = "Du hast als Opfer '" + player1.name + "' und '" + player2.name + "' gewählt. Stimmt das?";
      type.value = "strolchopfer";
    } else if(game.daystate == 24) {
      console.log("layout geist festlegen");  
      heading.innerHTML = "Geist";
      message.style.display = "none";
      allDeaths.style.display = "none";    
      allPlayers.style.display = "block";
    } else if(game.daystate == 25) {
      console.log("layout geist bestätigen"); 
      heading.innerHTML = "Geist";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";     
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "geist";
        return null;
      }
      let player = game.players.find(p => p.type === "geist");
      message_text.innerHTML = "Du hast als Geist '" + player.name + "' gewählt. Stimmt das?";
      type.value = "geist";
    } else if(game.daystate == 26) {
      console.log("layout einsamer werwolf festlegen"); 
      heading.innerHTML = "Einsamer Wolf";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 27) {
      console.log("layout einsamer werwolf bestätigen");  
      heading.innerHTML = "Einsamer Wolf";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";      
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "einsamerwerwolf";
        return null;
      }                  
      let player = game.players.find(p => p.type === "einsamerwerwolf");
      message_text.innerHTML = "Du hast als Einsamer Werwolf '" + player.name + "' gewählt. Stimmt das?";
      type.value = "einsamerwerwolf";
    } else if(game.daystate == 28) {
      console.log("layout gerber festlegen"); 
      heading.innerHTML = "Gerber";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 29) {
      console.log("layout gerber bestätigen");  
      heading.innerHTML = "Gerber";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "gerber";
        return null;
      }
      let player = game.players.find(p => p.type === "gerber");
      message_text.innerHTML = "Du hast als Gerber '" + player.name + "' gewählt. Stimmt das?";
      type.value = "gerber";
    } else if(game.daystate == 30) {
      console.log("layout doppelgänger festlegen");   
      heading.innerHTML = "Doppelgänger";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 31) {
      console.log("layout doppelgänger bestätigen");  
      heading.innerHTML = "Doppelgänger";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "doppelganger";
        return null;
      }
      let player = game.players.find(p => p.type === "doppelganger");
      message_text.innerHTML = "Du hast als Doppelgänger '" + player.name + "' gewählt. Stimmt das?";
      type.value = "doppelganger";
    } else if(game.daystate == 32) {
      console.log("layout doppelgänger person wählen");  
      heading.innerHTML = "Doppelgänger";
      message.style.display = "none";
      allDeaths.style.display = "none";  
      allCards.style.display = "none";
      allPlayers.style.display = "block";
    } else if(game.daystate == 33) {
      console.log("layout doppelgänger person bestätigen");
      heading.innerHTML = "Doppelgänger";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "doppelgangerperson";
        return null;
      }
      let player = game.players.find(p => p.type === "doppelganger");
      message_text.innerHTML = "Du hast als Person des Doppelgängers '" + player.special + "' gewählt. Stimmt das?";
      type.value = "doppelgangerperson";
    } else if(game.daystate == 34) {
      console.log("layout prinz festlegen");   
      heading.innerHTML = "Prinz";
      message.style.display = "none";
      allDeaths.style.display = "none";  
      allPlayers.style.display = "block";
    } else if(game.daystate == 35) {
      console.log("layout prinz bestätigen");  
      heading.innerHTML = "Prinz";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";    
      if(error != ""){
        message_text.innerHTML = error;
        type.value = "amor";
        return null;
      }
      let player = game.players.find(p => p.type === "prinz");
      message_text.innerHTML = "Du hast als Prinz '" + player.name + "' gewählt. Stimmt das?";
      type.value = "prinz";
    } else if(game.daystate == 36) {
      console.log("layout trunkenbold identität freigeben");    //nur nacht 3, daystate 4
      heading.innerHTML = "Trunkenbold";
      allPlayers.style.display = "none";
      allDeaths.style.display = "none";
      message.style.display = "block";   
      edit.style.display = "none";
      let player = game.players.find(p => p.type === "trunkenbold");
      message_text.innerHTML = "Die neue Identität des Trunkenbolds ist '" + player.special + "'.";
    } else if(game.daystate == 37) {            ////////////////////////////Jede Nacht///////////////////////////////
      console.log("layout schlampe festlegen");  
      heading.innerHTML = "Schlampe";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 38) {
      console.log("layout schlampe bestätigen");
    } else if(game.daystate == 39) {
      console.log("layout schlampe ziel wählen");
      heading.innerHTML = "Schlampe Ziel";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 40) {
      console.log("layout schlampe ziel bestätigen");
    } else if(game.daystate == 41) {
      console.log("layout leibwächter festlegen");   
      heading.innerHTML = "Leibwächter";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 42) {
      console.log("layout leibwächter bestätigen");
    } else if(game.daystate == 43) {
      console.log("layout leibwächter ziel wählen");
      heading.innerHTML = "Leibwächter Ziel";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 44) {
      console.log("layout leibwächter ziel bestätigen");
    } else if(game.daystate == 45) {
      console.log("layout werwölfe festlegen");     
      heading.innerHTML = "Werwölfe";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 46) {
      console.log("layout werwölfe bestätigen");
    } else if(game.daystate == 47) {
      console.log("layout werwölfe opfer wählen");
      heading.innerHTML = "Werwölfe Opfer";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 48) {
      console.log("layout werwölfe opfer bestätigen");
    } else if(game.daystate == 49) {
      console.log("layout vampire festlegen");    
      heading.innerHTML = "Vampire";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 50) {
      console.log("layout vampire bestätigen");
    } else if(game.daystate == 51) {
      console.log("layout vampire opfer wählen");  
      heading.innerHTML = "Vampire Opfer";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 52) {
      console.log("layout vampire opfer bestätigen");
    } else if(game.daystate == 53) {
      console.log("layout hexe festlegen");       
      heading.innerHTML = "Hexe";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 54) {
      console.log("layout hexe bestätigen");
    } else if(game.daystate == 55) {
      console.log("layout hexe heilen wählen");    
      heading.innerHTML = "Hexe Heilen";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 56) {
      console.log("layout hexe heilen bestätigen");
    } else if(game.daystate == 57) {
      console.log("layout hexe töten wählen");    
      heading.innerHTML = "Hexe Töten";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 58) {
      console.log("layout hexe töten bestätigen");
    } else if(game.daystate == 59) {
      console.log("layout hexer festlegen");     
      heading.innerHTML = "Hexer";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 60) {
      console.log("layout hexer bestätigen");
    } else if(game.daystate == 61) {
      console.log("layout hexer heilen wählen");
      heading.innerHTML = "Hexer Heilen";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 62) {
      console.log("layout hexer heilen bestätigen");
    } else if(game.daystate == 63) {
      console.log("layout hexer töten wählen");  
      heading.innerHTML = "Hexer Töten";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 64) {
      console.log("layout hexer töten bestätigen");
    } else if(game.daystate == 65) {
      console.log("layout seherin festlegen");
      heading.innerHTML = "Seherin";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 66) {
      console.log("layout seherin bestätigen");
    } else if(game.daystate == 67) {
      console.log("layout seherin spieler wählen");  
      heading.innerHTML = "Seherin Spieler";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 68) {
      console.log("layout seherin spieler bestätigen + anzeigen");
    } else if(game.daystate == 69) {
      console.log("layout seher festlegen");        
      heading.innerHTML = "Seher";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 70) {
      console.log("layout seher bestätigen");
    } else if(game.daystate == 71) {
      console.log("layout seher spieler wählen");  
      heading.innerHTML = "Seher Spieler";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 72) {
      console.log("layout seher spieler bestätigen + anzeigen");
    } else if(game.daystate == 73) {
      console.log("layout alte vettel festlegen");   
      heading.innerHTML = "Alte Vettel";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 74) {
      console.log("layout alte vettel bestätigen");
    } else if(game.daystate == 75) {
      console.log("layout alte vettel opfer wählen");  
      heading.innerHTML = "Alte Vettel Opfer";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 76) {
      console.log("layout alte vettel opfer bestätigen");
    } else if(game.daystate == 77) {
      console.log("layout kultführer festlegen");   
      heading.innerHTML = "Kultführer";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 78) {
      console.log("layout kultführer bestätigen");
    } else if(game.daystate == 79) {
      console.log("layout kultführer spieler wählen");    
      heading.innerHTML = "Kultführer Person";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 80) {
      console.log("layout kultführer spieler bestätigen");
    } else if(game.daystate == 81) {
      console.log("layout unruherstifterin festlegen");    
      heading.innerHTML = "Unruhestifterin";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 82) {
      console.log("layout unruhestifterin bestätigen");
    } else if(game.daystate == 83) {
      console.log("layout unruhestifterin aufmischen");
    } else if(game.daystate == 84) {
      console.log("layout priester festlegen");   
      heading.innerHTML = "Priester";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 85) {
      console.log("layout priester bestätigen");
    } else if(game.daystate == 86) {
      console.log("layout priester spieler wählen");  
      heading.innerHTML = "Priester Spieler";
      message.style.display = "none";
      allDeaths.style.display = "none"; 
      allPlayers.style.display = "block";
    } else if(game.daystate == 87) {
      console.log("layout priester spieler bestätigen");
    }
  } else {
    if(game.daystate == 0) {
      console.log("layout anzeige wer gestorben ist und warum");
    } else if(game.daystate == 1) {
      console.log("layout person zum lynchen wählen");
    } else if(game.daystate == 2) {
      console.log("layout person zum lynchen bestätigen");
    } else if(game.daystate == 3) {
      console.log("layout märtyrerin fragen");
    } else if(game.daystate == 4) {
      console.log("layout märtyrerin festlegen");
    }
  }
}

function nextState() {   
  //console.log("daycycle: " + game.daycycle);  
  //console.log(isEven(game.daycycle));     
  if(isEven(game.daycycle)) {
    var i = game.daystate + 1;
    while(true) {
      let character = orderNight[i];
      // console.log(character);
      if(game.cards.includes(character)) {                        
        //console.log("character '" + character + "' is included");
        if(firstNight.includes(i)) {
          if(game.daycycle == 0) {
            return i;
          } else {
            //console.log("not first night, state not needed, daystate: " + game.daystate);
          }
        } else {
          if(character == "trunkenbold" && i == 36) {
            if(game.daycycle == 4 ) {         
              return i;
            }
          } else { 
            return i;
          }
        }
      }
      if(i == orderNight.length - 1) {
        //console.log("daystate is 85, no player at night, daystate: " + game.daystate);
        game.daycycle++;                                                                
        console.log("---------- Tag " + ((game.daycycle + 1) / 2) + " bricht an ----------");
        return 0;  
      }
      i++;
    }
  } else {                                        // implement jager
    var i = game.daystate + 1;
    while(true) {
      let character = orderDay[i];
      // console.log(character);
      if(game.cards.includes(character) || character == "none") {
        return i;  
      }
      if(i == orderDay.length - 1) {
        game.daycycle++;
        game.daystate = 0;    
        console.log("---------- Nacht " + (game.daycycle / 2) + " bricht an ----------");
        return nextState();  
      }
      i++;
    }  
  }
}

function next() {
  if(newGamePageIndex == 0) {
    game.allplayers = [];
    for(var i = 0; i < game.groups.length; i++) {
      var group = game.groups[i];
      //console.log("group");
      //console.log(group);
      var array = group.array;
      for(var q = 0; q < array.length; q++) {
        game.allplayers.push(array[q]);
      }
    }
    //console.log(game.allplayers);
    //prepare next page
    var ul = document.getElementsByClassName("allPersons")[2];
    while (ul.hasChildNodes()) {
      ul.removeChild(ul.lastChild);
    }
    for(var i = 0; i < allpersons.length; i++) {
      var elem = document.createElement("li");
      elem.setAttribute("class", "person");
      elem.setAttribute("data-index", i);
      elem.innerHTML = allpersons[i];   
      if(game.allplayers.includes(allpersons[i])) {
        elem.style.backgroundColor = "#99e699";
        elem.style.border = "1px solid #666";
        elem.addEventListener("click", deselectPlayer);
        elem.dataset.gameindex = game.allplayers.indexOf(allpersons[i]);    
        ul.appendChild(elem); 
      } else {    
        elem.addEventListener("click", selectPlayer);
        ul.appendChild(elem);
      }
    }
    document.getElementById(pages[newGamePageIndex]).style.display = "none";
    document.getElementById(pages[newGamePageIndex + 1]).style.display = "block";  
    pagehistory.push(pages[newGamePageIndex]);
    newGamePageIndex++; //switches from 0 to 1
    return null;
  } else if(newGamePageIndex == 1) {
    //console.log(pages[newGamePageIndex]);
    if(game.allplayers.length > 0) {
      game.players = [];
      for(var i = 0; i < game.allplayers.length; i++) {
        game.players.push({
              name:game.allplayers[i],
              type:"bewohner",
              status:"alive",
  			      amor:false,
  			      strolch:false,
              special:""              
          });
          console.log(game.allplayers[i] + " wurde als bewohner registriert")
      }
      //prepare next page
      document.getElementById("num_persons").innerHTML = game.allplayers.length + " Personen<br>0 Karten";
      game.cards = [];
      var ul = document.getElementsByClassName("allCards")[0];
      while (ul.hasChildNodes()) {
        ul.removeChild(ul.lastChild);
      }
      for(var i = 0; i < types.length; i++) {
        var card = types[i];
        var li = document.createElement("li");
        li.setAttribute("class", "card");
        li.innerHTML = card.gername;
        li.dataset.name = card.name;
        if(card.name == "werwolf") {
          var num = document.createElement("input");
          num.type = "number";
          num.id = "count_werwolf";
          num.style.width = "100px";
          num.style.float = "right";
          num.value = 0;
          num.addEventListener("change", updateCardCount);
          li.appendChild(num);
        } else if(card.name == "bewohner") {
          var num = document.createElement("input");
          num.type = "number";
          num.id = "count_bewohner";
          num.style.width = "100px";
          num.style.float = "right";   
          num.value = 0;
          num.addEventListener("change", updateCardCount);
          li.appendChild(num);
        } else if(card.name == "vampir") {
          var num = document.createElement("input");
          num.type = "number";
          num.id = "count_vampir";
          num.style.width = "100px";
          num.style.float = "right"; 
          num.value = 0;             
          num.addEventListener("change", updateCardCount);
          li.appendChild(num);
        } else {
          li.addEventListener("click", selectCard);
        }
        ul.appendChild(li);
      }
      document.getElementById(pages[newGamePageIndex]).style.display = "none";
      document.getElementById(pages[newGamePageIndex + 1]).style.display = "block";  
      pagehistory.push(pages[newGamePageIndex]);
      newGamePageIndex++; //switches from 1 to 2
      return null;
    } else {
      error("Du musst Spieler auswählen um ein Spiel zu starten!");  
    }
  } else if(newGamePageIndex == 2) {
    console.log("Das Spiel beginnt...");
    game.werwoelfe = document.getElementById("count_werwolf").value;
    game.vampire = document.getElementById("count_vampir").value;
    game.bewohner = document.getElementById("count_bewohner").value;
    var cards = game.cards.length;
    for(let i = 0; i < game.werwoelfe; i++) {
      game.cards.push("werwolf");
    }
    for(let i = 0; i < game.vampire; i++) {
      game.cards.push("vampir");
    }
    for(let i = 0; i < game.bewohner; i++) {
      game.cards.push("bewohner");
    }
    game.bewohner += cards;
    if(game.cards.includes("wolfsjunges")) {
      game.bewohner--; //weniger wenn wolfsjunges gewählt
    }
    if(game.cards.includes("einsamerwerwolf")) {
      game.bewohner--; //weniger wenn einsamer werwolf gewählt
    }
    
    if(game.cards.length != game.players.length) {
      error("Die Anzahl der Karten muss mit der Anzahl der Spieler übereinstimmen!");
      return null;
    }
    
    //console.log(game.cards);
    
    game.deaths = []; // Array mit allen Toten in der nacht (Werwölfe, Vampire, ggf Hexe, ggf Schlampe)
    if(game.cards.includes("kultfuhrer")) {
      game.kult = [];
    }             
    game.daycycle = 0; //gerade Zahlen: Nacht, ungerade Zahlen: Tag
    game.daystate = 0; //variable fürverschiedene Stufen der Nacht  
    game.actions = [];
    //prepare next page
    updatePlayers();    
    document.getElementById("game_message").getElementsByClassName("message")[0].innerHTML = "Das Spiel beginnt...<br>Lege bei jeder Figur die Person fest, und keine wenn die Person die Aktion nicht nutzen möchte."
    document.getElementById(pages[newGamePageIndex]).style.display = "none";
    document.getElementById("page_game").style.display = "block"; 
    document.getElementById("next_ingame").addEventListener("click", prepareGame);
    pagehistory = ["page_main_menu"];
    /*push game to localStorage !!! -------------------- -------------------- -------------------- -------------------- TO DO -------------------- -------------------- -------------------- -------------------- */
  }
}

function error(errormsg) {
  document.getElementById(pages[newGamePageIndex]).style.display = "none";
  document.getElementById("page_error").style.display = "block";
  document.getElementById("error_message").innerHTML = errormsg;
  document.getElementsByClassName("backToMain")[0].addEventListener("click", backToMain);  
}

function backToMain(event) {
  event.target.parentElement.parentElement.style.display = "none";
  document.getElementById("page_main_menu").style.display = "block";
  pagehistory = [];
}

function initApp() {
  if(!storageAvailable("localStorage")) {
    alert("Die offline Datenspeicherung wird in ihrem Browser nicht unterstützt. Bitte verwenden sie einen anderen Browser oder Aktualisieren sie ihr Betriebssystem");
    console.error("Die offline Datenspeicherung wird in ihrem Browser nicht unterstützt. Bitte verwenden sie einen anderen Browser oder Aktualisieren sie ihr Betriebssystem");
  }
  loadAllPersons();
  loadNewGroup();
  loadAllGroups();
  document.getElementById("submitPerson").addEventListener("click", addPerson);
  document.getElementById("submitGroup").addEventListener("click", generateGroup);
  document.getElementById("newGame").addEventListener("click", newGame);
  document.getElementById("edit").addEventListener("click", edit);
}

window.addEventListener("load", initApp);