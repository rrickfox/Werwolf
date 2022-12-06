//Werwolf V1 ~~ Mika K. 2018;

/*
Aussätzige: wird sie getötet darf in der nächsten Nacht nicht getötet werden
Trunkenbold: Bis zur zweiten Lynchung ein normaler Bewohner (was dann?)
Vampir: Opfer stirbt am Abend, wenn gleiches Opfer wie Werwölfe überlebt Opfer
Seher: Erfährt ob Person gut oder Böse
Alter Mann: Stirbt morgens wenn Tag > Anzahl aktueller Werwölfe + 1
Unruhestifterin: Kann einmalig eine zweite Lynchung auslösen
Alte Vettel: Belegt einen Mitspieler pro Nacht mit einem Schweigefluch
Gestaltwandlerin: Wählt einen Mitspieler und übernimmt seine Rolle wenn er nachts stirbt
Lynkathrophin: Wird von Seherin als Böse erkannt
Armor: Ernennt Liebespaar in der ersten Nacht
Jäger: Kann bei seinem Tod einen anderen Spieler Töten
Leibwächter: Wählt Spieler der in der Nacht vor dem Tod geschützt ist
Harter Bursche: Stirbt erst am darauffolgenden Tag 
Gerber: möchte Sterben
Prinz: Ist beim ersten Mal vor der Lynchung sicher (und ein zweites hat keinen Sinn)
Hexe: Kann Opfer in der Nacht retten oder jemand beliebiges Töten
Kultführer: Wählt jede Nacht einen Mitspieler für seinen Kult (dafuq?)
Wolfjunges: Kann geopfert werden; Wenn es stirbt dürfen Werwölfe zweimal töten
Strolch: Wählt zwei Spieler die Sterben mmüssen (bis wann?)
Geist: Stirbt sofort; kann Buchstaben aufschreiben
Einsamer Werwolf: Werwolf, der mit den Bewohner überleben möchte
*/

//regex für alle bekannten Klassen zur Schreibfehlervermeidung
//const typeregex = /(aussatzige|trunkenbold|vampir|seher|altermann|unruhestifterin|altevettel|gestaltwandlerin|lynkathrophin|amor|jager|leibwachter|bursche|gerber|prinz|hexe|kultfuhrer|wolfsjunges|strolch|geist|einsamerwerwolf|werwolf|bewohner|schlampe)/i

//Arrays

//var game.players = [{name:'arrayende', type:'exclude', status:'none', amor:'none', strolch:'false'}, {name:'arrayende2', type:'exclude', status:'none', amor:'none', strolch:'false'}]

//var killmorgen = ['arrayende', 'arrayende2']

//var killabend = ['arrayende', 'arrayende2']

//zum kopieren: {name:'', gername:'', goal:'', group:'', description:''},


const types = [{name:'bewohner', gername:'Dorfbewohner', goal:'bewohner', group:'bewohner', description:'ein langweiler Bewohner...'},
{name:'werwolf', gername:'Werwolf', goal:'werwolf', group:'werwolf', description:'Ein Werwolf halt...'},
{name:'vampir', gername:'Vampir', goal:'vampir', group:'vampir', description:'Die Vampire wählen in der Nacht ein Opfer welches am Abend des nächsten Tages stirbt'},
{name:'aussatzige', gername:'Aussätzige', goal:'none', group:'bewohner', description:'Wird sie getötet so darf in der nächsten Nacht nicht getötet werden.\nAusnahme: das Wolfsjunge wird auch getötet oder freiwillig geopfert'},
{name:'trunkenbold', gername:'Trunkenbold', goal:'none', group:'bewohner', description:'Der Trunkenbold erfährt erst nach der zweiten Lynchung seine eigentliche Rolle'},
{name:'seher', gername:'Seher', goal:'bewohner', group:'bewohner', description:'Der Seher kann in der Nacht die Identität eines Spielers (gut/böse) erfahren'}, 
{name:'seherin', gername:'Seherin', goal:'bewohner', group:'bewohner', description:'Die Seherin kann in der Nacht die Identität eines Spielers (gut/böse) erfahren'},
{name:'altermann', gername:'Alter Mann', goal:'bewohner', group:'bewohner', description:'Der Alte Mann stirbt morgens wenn Tag > Anzahl aktueller Werwölfe + 1'},
{name:'unruhestifterin', gername:'Unruhestifterin', goal:'bewohner', group:'bewohner', description:'Die Unruhestifterin kann einmalig eine zweite Lynchung auslösen'},
{name:'altevettel', gername:'Alte Vettel', goal:'bewohner', group:'bewohner', description:''},
{name:'doppelganger', gername:'Doppelgänger', goal:'none', group:'bewohner', description:'Er übernimmt die Rolle eines anfangs gewählten Mitspielers wenn dieser in der Nacht stirbt'},
{name:'lykanthrophin', gername:'Lykanthrophin', goal:'bewohner', group:'werwolf', description:'Eine normale Bewohnerin, die für die Seherin aber wie ein Werwolf aussieht'},
{name:'amor', gername:'Amor', goal:'all', group:'bewohner', description:'Ernennt am Anfang ein Liebespaar. Stirbt einer so stirbt auch der andere.'},
{name:'jager', gername:'Jäger', goal:'all', group:'bewohner', description:'Wenn er stirbt, darf er eine Person mit in den Tod reißen.'},
{name:'leibwachter', gername:'Leibwächter', goal:'bewohner', group:'bewohner', description:'Sucht sich einen Mitspieler aus. Dieser ist in dieser Nacht vor dem Tod geschützt.'},
{name:'bursche', gername:'Harter Bursche', goal:'bewohner', group:'bewohner', description:'Der Harte Bursche stirbt erst am morgen des darauffolgenden Tages'},
{name:'gerber', gername:'Gerber', goal:'gerber', group:'bewohner', description:'Der Gerber möchte im Spiel sterben'},
{name:'prinz', gername:'Prinz', goal:'bewohner', group:'bewohner', description:'Der Prinz kann beim ersten mal nicht gelyncht werden'},
{name:'hexe', gername:'Hexe', goal:'bewohner', group:'bewohner', description:'Die Hexe kann das Opfer der Werwölfe/Vampire retten und einen beliebigen Spieler töten'},
{name:'hexer', gername:'Hexer', goal:'bewohner', group:'bewohner', description:'Der Hexer kann das Opfer der Werwölfe/Vampire retten und einen beliebigen Spieler töten'},
{name:'kultfuhrer', gername:'Kultführer', goal:'kultfuhrer', group:'bewohner', description:'Der Kultführer wählt jede Nacht einen Spieler der seinem Kult beitritt'},
{name:'wolfsjunges', gername:'Wolfsjunges', goal:'werwolf', group:'werwolf', description:'Stirbt das Wolfsjunge können die Werwölfe zwei Spieler töten. Kann geopfert werden.'},
{name:'strolch', gername:'Strolch', goal:'strolch', group:'bewohner', description:''},
{name:'geist', gername:'Geist', goal:'none', group:'bewohner', description:'Der Geist stirbt in der ersten Nacht. Er kann jede Nacht einen Buchstaben aufschreiben, jedoch keine Namen bilden.'},
{name:'einsamerwerwolf', gername:'Einsamer Werwolf', goal:'bewohner', group:'werwolf', description:'Der einsame Werwolf ist ein Werwolf, der auf der Seite der Bewohner spielt.'},
{name:'schlampe', gername:'Schlampe', goal: 'bewohner', group:'bewohner', description:'Die Schlampe übernachtet bei einem Spieler. Sie kann nur getötet werden, wenn ihr Freier stirbt.'},
{name:'priester', gername:'Priester', goal:'bewohner', group:'bewohner', description:'Der Priester kann eine Person im Spiel mit dem göttlichen Segen schützen. Der erste Mord an dieser Person schlägt fehl.'},
{name:'martyrerin', gername:'Märtyrerin', goal:'bewohner', group:'bewohner', description:'Die Märtyrerin kann sich anstelle der zu lynchenden Person opfern.'}];

//const order = ["schlampe", "leibwachter", "werwolf", "vampir", "hexe", "hexer", "seherin", "seher", "altevettel", "doppelganger", "kultfuhrer", "unruhestifterin", "priester"];
//const einmalig = ["amor", "bursche", "aussatzige", "lykanthrophin", "jager", "altermann", "trunkenbold", "wolfsjunges", "strolch", "geist", "einsamerwerwolf", "gerber"];

// Verschiedene Stufen der Nacht:
// nur erste Nacht:
// 0: Willkommensscreen
// 1: amor festlegen
// 2: amor bestätigen
// 3: amor liebespaar wählen
// 4: amor liebespaar bestätigen
// 5: harter bursche (bursche) festlegen
// 6: harter bursche bestätigen
// 7: aussätzige (aussatzige) festlegen
// 8: aussätzige bestätigen
// 9: lykanthrophin festlegen
// 10: lykanthrophin bestätigen
// 11: jäger (jager) festlegen
// 12: jäger bestätigen
// 13: altermann festlegen
// 14: altermann bestätigen
// 15: trunkenbold festlegen
// 16: trunkenbold bestätigen   
// 17: trunkenbold karte festlegen (auch in nacht 3, daycycle = 4)
// 18: wolfsjunges festlegen
// 19: wolfsjunges bestätigen
// 20: strolch festlegen
// 21: strolch bestätigen
// 22: strolch opfer festlegen
// 23: strolch opfer bestätigen
// 24: geist festlegen
// 25: geist bestätigen
// 26: einsamer werwolf (einsamerwerwolf) festlegen
// 27: einsamer werwolf bestätigen
// 28: gerber festlegen
// 29: gerber bestätigen     
// 30: doppelgänger (doppelganger) festlegen
// 31: doppelgänger bestätigen
// 32: doppelgänger person wählen
// 33: doppelgänger person bestätigen
// 34: prinz festlegen
// 35: prinz bestätigen
// ---------- 3. Nacht ----------
// 36: trunkenbold identität freigeben
// ---------- jede Nacht: ----------
// 37: schlampe festlegen (erste Nacht)
// 38: schlampe bestätigen (erste Nacht)
// 39: schlampe ziel wählen
// 40: schlampe ziel bestätigen
// 41: leibwächter (leibwachter) festlegen (erste Nacht)
// 42: leibwächter bestätigen (erste Nacht)
// 43: leibwächter ziel wählen
// 44: leibwächter ziel bestätigen
// 45: werwölfe festlegen (erste Nacht)
// 46: werwölfe bestätigen (erste Nacht)
// 47: werwölfe opfer (ggf 2) wählen
// 48: werwölfe opfer bestätigen
// 49: vampire festlegen (erste Nacht)
// 50: vampire bestätigen (erste Nacht)
// 51: vampire opfer wählen
// 52: vampire opfer bestätigen
// 53: hexe festlegen (erste Nacht)
// 54: hexe bestätigen (erste Nacht)
// 55: hexe heilen wählen
// 56: hexe heilen bestätigen
// 57: hexe töten wählen
// 58: hexe töten bestätigen
// 59: hexer festlegen (erste Nacht)
// 60: hexer bestätigen (erste Nacht)
// 61: hexer heilen wählen
// 62: hexer heilen bestätigen
// 63: hexer töten wählen
// 64: hexer töten bestätigen
// 65: seherin festlegen (erste Nacht)
// 66: seherin bestätigen (erste Nacht)
// 67: seherin spieler wählen
// 68: seherin spieler bestätigen + anzeigen   
// 69: seher festlegen (erste Nacht)
// 70: seher bestätigen (erste Nacht)
// 71: seher spieler wählen
// 72: seher spieler bestätigen + anzeigen
// 73: alte vettel (altevettel) festlegen (erste Nacht)
// 74: alte vettel bestätigen (erste Nacht)
// 75: alte vettel opfer wählen
// 76: alte vettel opfer bestätigen
// 77: kultführer (kultfuhrer) festlegen (erste Nacht)
// 78: kultführer bestätigen (erste Nacht)
// 79: kultführer spieler wählen
// 80: kultführer spieler bestätigen
// 81: unruhestifterin festlegen (erste Nacht)
// 82: unruhestifterin bestätigen (erste Nacht)
// 83: unruhestifterin aufmischen
// 84: priester festlegen (erste Nacht)
// 85: priester bestätigen (erste Nacht)
// 86: priester spieler wählen
// 87: priester spieler bestätigen
// AM TAG:
// 0: anzeige wer gestorben ist und warum    
// (1: ggf jäger person wählen )
// (2: ggf jäger person bestätigen )
// 1: person zum lynchen wählen
// 2: person bestätigen
// 3: märtyrerin (martyrerin) fragen
// 4: märtyrerin festlegen           
// (5: ggf jäger person wählen )
// (6: ggf jäger person bestätigen )

//vllt: seher-lehrling, zaubermeisterin, paranormaler ermittler, aura-seherin, beschwörerin, freimaurer, verfluchter, (günstling), amulett des schutzes

const orderNight = ["none",
                  "amor", "amor", "amor", "amor", // erste Nacht
                  "bursche", "bursche",
                  "aussatzige", "aussatzige",
                  "lykanthrophin", "lykanthrophin",
                  "jager", "jager",
                  "altermann", "altermann",
                  "trunkenbold", "trunkenbold", "trunkenbold",
                  "wolfsjunges", "wolfsjunges",
                  "strolch", "strolch", "strolch", "strolch",
                  "geist", "geist",
                  "einsamerwerwolf", "einsamerwerwolf",
                  "gerber", "gerber",                            
                  "doppelganger", "doppelganger", "doppelganger", "doppelganger",
                  "prinz", "prinz",
                  "trunkenbold", // 3. Nacht
                  "schlampe", "schlampe", "schlampe", "schlampe", // jede Nacht
                  "leibwachter", "leibwachter", "leibwachter", "leibwachter",
                  "werwolf", "werwolf", "werwolf", "werwolf",
                  "vampir", "vampir", "vampir", "vampir",
                  "hexe", "hexe", "hexe", "hexe", "hexe", "hexe",
                  "hexer", "hexer", "hexer", "hexer", "hexer", "hexer",
                  "seherin", "seherin", "seherin", "seherin",
                  "seher", "seher", "seher", "seher",
                  "altevettel", "altevettel", "altevettel", "altevettel",
                  "kultfuhrer", "kultfuhrer", "kultfuhrer", "kultfuhrer",
                  "unruhestifterin", "unruhestifterin", "unruhestifterin", "unruhestifterin",
                  "priester", "priester", "priester", "priester"];
                  
const orderDay = ["none",
                  "none", "none",
                  "martyrerin", "martyrerin"];
                
const firstNight = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                  30, 31, 32, 33, 35, 37, 38, 41, 42, 45,
                  46, 49, 50, 53, 54, 59, 60, 65, 66, 69,
                  70, 73, 74, 77, 78, 81, 82, 84, 85];       // alle Stati die in der ersten Nacht benötigt werden

//Variabeln und Counter

//Variabeln für automatischen Modus, noch nicht benötigte
//var daysubstate = 0

//Funktionen

function kill(usrname) {
  var usr = game.players.find(p => p.name === usrname)
  if(!usr) { return console.log("Couldn't Kill user " + usrname + ": User not found.") }
  /*var killevent = new CustomEvent('kill', { detail: usr.name + "|" + usr.type })
      process.dispatchEvent(kill)
  */
  console.log("Spieler " + usr.name + " ist gestorben und war " + usr.type);
  let index = game.players.indexOf(usr);
  game.players[index].status = "dead";
}

function changetype(usrname, type) {
  var usr = game.players.find(p => p.name === usrname)
  if(!usr) { return console.log("Couldn't change type of user " + usrname + ": User not found.") }
  let index = game.players.indexOf(usr)
  game.players[index].type = type;
  console.log("Typ von Spieler " + usr.name + " geändert zu " + type);
}

function isEven(n) { 
  return n == parseFloat(n)? !(n%2) : void 0;
}

function gameMika(msg) {
	
    if(msg.startsWith("/start")) {
        let opfer = game.players.find(p => p.type === "geist")
        if(opfer) {
            killmorgen.push(opfer.name)
        }
    }
//TAG UND NACHT
    if(msg === "/tag") {
        if(!isEven(game.daycycle)) { return console.log("Es ist schon Tag") }
		if(game.daycycle / 2 + 1 > game.players.filter(p => p.type.includes("wolf") && p.status === "alive").length) { //Alter Mann
			//console.log("hi")
			let mann = game.players.find(p => p.type === "altermann")
			if(mann) { killmorgen.push(mann.name) }
		}
		let wandlerin = game.players.find(p => p.type.includes("wandlerin")) //Wandlerin holen
			if(wandlerin) { let wandopfer = wandlerin.type.split(":") [1] } //Opfer der Wandlerin holen
        while (killmorgen.length - 2 > 0) { //Abarbeiten der Killqueue
            let usrname = killmorgen.pop() //entfernen aus dem Array
            let usr = game.players.find(p => p.name === usrname) //userobject holen
          if(usr) { //nichts gefunden?
            if(usr.status === "hexe") { //wenn geheilt, continue
                setstatus(usr.name, "none")                
                continue
            }
            if(usr.type === "schlampe") { continue }
            if(usr.status === "schlampe") { //wenn Freier stirbt Schlampe auch killen
                let schlampe = game.players.find(p => p.type === "schlampe")
                kill(schlampe.name)
            }
			if(usr.status === "wächter") { continue }
            if(usr.amor != "none") { //wenn Spieler verliebt, Partner killen
                killmorgen.push(usr.amor)
            }
            if(usr.type === "jager") { console.log("Der Jäger ist gestorben. Gebe sein Opfer mit /kill name ein") }
			if(usr.type === "aussatzige") { console.log("Die Aussätzige ist gestorben. In der nächsten Nacht darf nicht getötet werden, es sei denn, das Wolfsjunge stirbt auch.") }
			
            if(usr.type === "bursche") { //Harten Bursche in die Abendqueue verschieben
                killabend.push(usr.name)
                continue
            }
			if(usr.name === wopfer) { //Spieler ist Opfer der Wandlerin
				let delet = game.players.indexOf(wandlerin) //Wandlerin entfernen
              	  game.players.splice(delet,1)
     	        game.players.push({
        	        name:wandlerin.name,
        	        type:usr.type, //Status des Spielers übernehmen
        	        status:wandlerin.status,
					amor:wandlerin.amor,
					strolch:wandlerin.strolch
        	    })
			}
				
            kill(usr.name)
          }//ende if(usr)
            
        }//ende while loop
        game.daycycle++ //daycycle weiterschalten
        let whatday = game.daycycle / 2 + 0.5 //Tag holen
        console.log("Tag " + whatday + " beginnt...")
		let werwolfe = game.players.filter(p => p.type.includes("wolf")).length
		let vampire = game.players.filter(p => p.type === "vampir").length
		var bewohner = game.players.length - 2 //Bewohner sind alle Spieler minus die zwei Platzhalter
		if(werwolfe > 0) { //wenn es Werwölfe gibt, Anzahl anzeigen
			var bewohner = bewohner - werwolfe
			console.log(`${werwolfe} Werwölfe und`)
		}
		if(vampire > 0) { //wenn es Vampire gibt, Anzahl anzeigen
			var bewohner = bewohner - vampire
			console.log(`${vampire} Vampire und`)
		}
		console.log(`${bewohner} normale Bewohner verleiben...`) //Normale Bewohner sind alle Spieler - Werwölfe und Vampire
		let schweigefluch = game.players.find(p => p.status === "vettel")
		if(schweigefluch) { console.log(`${schweigefluch.name} wurde mit einem Schweigefluch belegt und darf nicht reden.`) }
    }
    if(msg === "/nacht") {
        if(isEven(game.daycycle)) { return console.log ("Es ist schon Nacht") }
        while (killabend.length - 2 > 0) {
            let usrname = killabend.pop()
            let usr = game.players.find(p => p.name === usrname)
          if(usr) {
            if(usr.amor != "none") {
                killabend.push(usr.amor)
            }
            if(usr.type === "jager") { console.log("Der Jäger ist gestorben. Gebe sein Opfer mit /kill name ein") }
            if(usr.type === "bursche") {
                let delet = game.players.indexOf(usr)
                    game.players.splice(delet,1)
                game.players.push({
                    name:usr.name,
                    type:"harter Bursche",
                    status:usr.status,
					amor:usr.amor,
					strolch:usr.strolch
                })
                killmorgen.push(usr.name)
                continue   
            }
            kill(usr.name)
          } //ende von if(usr)
            
        }//ende vom while loop
        game.daycycle++
        let noschlampe = game.players.find(p => p.status === "schlampe") //Bei wem ist die Schlampe?
        if(noschlampe) {
            setstatus(noschlampe.name, "none")
        }
        let whatnight = game.daycycle / 2
        console.log("Nacht " + whatnight + " beginnt...")
		let werwolfe = game.players.filter(p => p.type.includes("wolf")).length
		let vampire = game.players.filter(p => p.type === "vampir").length
		var bewohner = game.players.length - 2
		if(werwolfe > 0) {
			var bewohner = bewohner - werwolfe
			console.log(`${werwolfe} Werwölfe und`)
		}
		if(vampire > 0) {
			var bewohner = bewohner - vampire
			console.log(`${vampire} Vampire und`)
		}
		console.log(`${bewohner} normale Bewohner verleiben...`)
    }
//COMMANDS FÜR ROLLEN
    if(msg.startsWith("/schlampe ")) {
        let newmsg = msg.split(" ")
        setstatus(newmsg[1], "schlampe")
    }
	if(msg.startsWith("/vettel ")) {
		let newmsg = msg.split(" ")
		setstatus(newmsg[1], "vettel")
	}
	if(msg.startsWith("/wächter ")) {
		let newmsg = msg.split(" ")
		setstatus(newmsg[1], "wächter")
	}
	if(msg.startsWith("/kultführer ")) {
		let newmsg = msg.split(" ")
		kult.push(newmsg[1])
	}
	if(msg.startsWith("/hexe heal ")) {
		let newmsg = msg.split(" ")
		setstatus(newmsg[2], "hexe")
	}
	if(msg.startsWith("/hexe kill ")) {
		let newmsg = msg.split(" ")
		killmorgen.push(newmsg[2])
	}
	if(msg === "/hexe") { return console.log("Meintest du /hexe kill oder /hexe heal ?") }
	if(msg.startsWith("/doppelganger ")) {
		let newmsg = msg.split(" ")
		let wandlerin = game.players.find(p => p.type === "doppelganger")
			if(!wandlerin) { return console.log ("Ich konnte den Doppelgänger nicht finden") }
		let delet = game.players.indexOf(wandlerin)
                game.players.splice(delet,1)
        game.players.push({
            name:wandlerin.name,
            type:"doppelganger:" + newmsg[1],
            status:wandlerin.status,
			amor:wandlerin.amor,
			strolch:wandlerin.strolch
        })
	}
	if(msg.startsWith("/seher ")) {
		let newmsg = msg.split(" ")
		let pname = newmsg[1]
		let player = game.players.find(p => p.name === pname)
		if(!player) { return console.log("Ein Fehler ist aufgetreten: Konnte Spieler " + newmsg[1] + " nicht finden!") }
		let type = types.find(t => t.name === player.type)
		if(type.group != "bewohner") { console.log(`Spieler ${player.name} ist böse`) }
		else { console.log(`Spieler ${player.name} ist gut`) }
	}	
	if(msg.startsWith("/strolch ")) {
        let newmsg = msg.split(" ")
		let p1 = game.players.find(p => p.name === newmsg[1])
		let p2 = game.players.find(p => p.name === newmsg[2])
		if(!p1 || !p2) { return console.log("mindestens einer der Spieler wurde nicht gefunden!") }
		let delet1 = game.players.indexOf(p1)
			game.players.splice(delet1,1)
		let delet2 = game.players.indexOf(p2)
			game.players.splice(delet2,1)
		game.players.push({ name:p1.name, type:p1.type, status:p1.status, amor:p1.amor, strolch:"true" },{ name:p2.name, type:p2.type, status:p2.status, amor:p2.amor, strolch:"true" })
    }
//COMMANDS FÜR DIREKTE SPIELSTEUERUNG
    if(msg.startsWith("/kill ")) {
        let newmsg = msg.split(" ")
        if(!isEven(game.daycycle)) {
            killabend.push(newmsg[1])
            console.log(newmsg[1] + " wird am Abend sterben")
        } else {
            killmorgen.push(newmsg[1])
            console.log(newmsg[1] + " wird am Morgen sterben")
        }
    }
	if(msg.startsWith("/players")) {
		game.players.forEach(listplayers)
	}
	if(msg.startsWith("/find type")) {
		let newmsg = msg.split(" ")
		let typelist = game.players.filter(p => p.type === newmsg[2]).forEach(listplayers)
		if(!typelist) { console.log("Keine weiteren Spieler gefunden!") }
	}
	if(msg.startsWith("/find player")) {
		let newmsg = msg.split(" ")
		let player = game.players.find(p => p.name === newmsg[2])
		if(player) { listplayers(player) }
		else { console.log("Nichts gefunden!") }
	}
    if(msg.startsWith("/eval ")) {
        var code = msg.split(" ").slice(1).join(" ")
        var result = eval(code)
        console.log(result)
    }
            
            
}