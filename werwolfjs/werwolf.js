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
const typeregex = /(aussatzige|trunkenbold|vampir|seher|altermann|unruhestifterin|altevettel|gestaltwandlerin|lynkathrophin|armor|jager|leibwachter|bursche|gerber|prinz|hexe|kultfuhrer|wolfsjunges|strolch|geist|einsamerwerwolf|werwolf|bewohner|schlampe)/i

//mit typeregex.exec(input) prüfen

//Setup
var readline = require('readline')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt("Y>")

//Arrays

var players = [{name:'arrayende', type:'exclude', status:'none', armor:'none', strolch:'false'}, {name:'arrayende2', type:'exclude', status:'none', armor:'none', strolch:'false'}]

var killmorgen = ['arrayende', 'arrayende2']

var killabend = ['arrayende', 'arrayende2']

var kult = ['arrayende', 'arrayende2']

//zum kopieren: {name:'', gername:'', goal:'', group:'', description:''},


const types = [{name:'aussatzige', gername:'Aussätzige', goal:'none', group:'bewohner', description:'Wird sie getötet so darf in der nächsten Nacht nicht getötet werden.\nAusnahme: das Wolfsjunge wird auch getötet oder freiwillig geopfert'},
{name:'trunkenbold', gername:'Trunkenbold', goal:'none', group:'bewohner', description:'Der Trunkenbold erfährt erst nach der zweiten Lynchung seine eigentliche Rolle'},
{name:'vampir', gername:'Vampir', goal:'vampir', group:'vampir', description:'Die Vampire wählen in der Nacht ein Opfer welches am Abend des nächsten Tages stirbt'},
{name:'seher', gername:'Seher', goal:'bewohner', group:'bewohner', description:'Der Seher kann in der Nacht die Identität eines Spielers (gut/böse) erfahren'},
{name:'altermann', gername:'Alter Mann', goal:'bewohner', group:'bewohner', description:'Der Alte Mann stirbt morgens wenn Tag > Anzahl aktueller Werwölfe + 1'},
{name:'unruhestifterin', gername:'Unruhestifterin', goal:'bewohner', group:'bewohner', description:'Die Unruhestifterin kann einmalig eine zweite Lynchung auslösen'},
{name:'altevettel', gername:'Alte Vettel', goal:'bewohner', group:'bewohner', description:''},
{name:'gestaltwandlerin', gername:'Gestaltwandlerin', goal:'none', group:'bewohner', description:'Sie übernimmt die Rolle eines anfangs gewählten Mitspielers wenn dieser in der Nacht stirbt'},
{name:'lynkathrophin', gername:'Lynkathrophin', goal:'bewohner', group:'werwolf', description:'Eine normale Bewohnerin, die für die Seherin aber wie ein Werwolf aussieht'},
{name:'armor', gername:'Armor', goal:'all', group:'bewohner', description:'Ernennt am Anfang ein Liebespaar. Stirbt einer so stirbt auch der andere.'},
{name:'jager', gername:'Jäger', goal:'all', group:'bewohner', description:'Wenn er stirbt'},
{name:'leibwachter', gername:'Leibwächter', goal:'bewohner', group:'bewohner', description:'Sucht sich einen Mitspieler aus. Dieser ist in dieser Nacht vor dem Tod geschützt.'},
{name:'bursche', gername:'Harter Bursche', goal:'bewohner', group:'bewohner', description:'Der Harte Bursche stirbt erst am morgen des darauffolgenden Tages'},
{name:'gerber', gername:'Gerber', goal:'gerber', group:'bewohner', description:'Der Gerber möchte im Spiel sterben'},
{name:'prinz', gername:'Prinz', goal:'bewohner', group:'bewohner', description:'Der Prinz kann beim ersten mal nicht gelyncht werden'},
{name:'hexe', gername:'Hexe', goal:'bewohner', group:'bewohner', description:'Die Hexe kann das Opfer der Werwölfe/Vampire retten und einen beliebigen Spieler töten'},
{name:'kultfuhrer', gername:'Kultführer', goal:'kultfuhrer', group:'bewohner', description:'Der Kultführer wählt jede Nacht einen Spieler der seinem Kult beitritt'},
{name:'wolfsjunges', gername:'Wolfsjunges', goal:'werwolf', group:'werwolf', description:'Stirbt das Wolfsjunge können die Werwölfe zwei Spieler töten. Kann geopfert werden.'},
{name:'strolch', gername:'Strolch', goal:'strolch', group:'bewohner', description:''},
{name:'geist', gername:'Geist', goal:'none', group:'bewohner', description:'Der Geist stirbt in der ersten Nacht. Er kann jede Nacht einen Buchstaben aufschreiben, jedoch keine Namen bilden.'},
{name:'einsamerwerwolf', gername:'einsamer Werwolf', goal:'bewohner', group:'werwolf', description:'Der einsame Werwolf ist ein Werwolf, der auf der Seite der Bewohner spielt.'},
{name:'werwolf', gername:'Werwolf', goal:'werwolf', group:'werwolf', description:'Ein Werwolf halt...'},
{name:'schlampe', gername:'Schlampe', goal: 'bewohner', group:'bewohner', description:'Die Schlampe übernachtet bei einem Spieler. Sie kann nur getötet werden, wenn ihr Freier stirbt.'},
{name:'bewohner', gername:'Dorfbewohner', goal:'bewohner', group:'bewohner', description:'ein langweiler Bewohner...'},
{name:'Arrayende', gername:'Arrayende', goal:'none', group:'exclude', description:'Es ist das Ende eines Arrays... Was dachtest du?'},
{name:'Arrayende2', gername:'Arrayende2', goal:'none', group:'exclude', description:'Der kleine Bruder des Arrayendes. Er mochte das andere Arrayende noch nie, weil er immer an zweiter Stelle stehen muss.'}]


//Variabeln und Counter

var daycycle = 0 //gerade Zahlen: Nacht, ungerade Zahlen: Tag

var daystate = 0  //Variabeln für automatischen Modus, noch nicht benötigte
var daysubstate = 0

//Funktionen

function kill(usrname) {
    var usr = players.find(p => p.name === usrname)
    if(!usr) { return console.log("Couldn't Kill user " + usrname + ": User not found.") }
    /*var killevent = new CustomEvent('kill', { detail: usr.name + "|" + usr.type })
        process.dispatchEvent(kill)
    */
    console.log("Spieler " + usr.name + " ist gestorben und war " + usr.type)
    let delet = players.indexOf(usr)
        players.splice(delet,1)
}

function setstatus(usrname, statuus) {
    var usr = players.find(p => p.name === usrname)
    if(!usr) { return console.log("Couldn't Edit user " + usrname + ": User not found.") }
    let delet = players.indexOf(usr)
        players.splice(delet,1)
    players.push({
        name:usr.name,
        type:usr.type,
        status:statuus,
		armor:usr.armor,
		strolch:usr.strolch
    })
}

function listplayers(player) {
	if(!player.name || player.type === "exclude") { return }
	console.log(`${player.name}    ---    ${player.type}`)
}

function listtypes(name, goal, group, desc) {
	let type = types.find(t => t.name === name)
    if(!type) { return console.log(`Klasse ${name} nicht gefunden!`) }
	if(goal == "true") { var typegoal = type.goal } else { var typegoal = "" }
	if(group == "true") { var typegroup = type.group } else { var typegroup = "" }
	if(desc == "true") { var typedesc = type.description } else { var typedesc = "" }
	console.log(`Klasse: ${type.gername} - ${typegoal} - ${typegroup} - ${typedesc}`)
}

function isEven(n) { //https://stackoverflow.com/questions/6211613/testing-whether-a-value-is-odd-or-even
  return n == parseFloat(n)? !(n%2) : void 0;
}
    

console.log("\n\n\n************\n*Werwolf V1*\n************\n\n~~Mika K. 2018~~\n\n\nWillkommen bei Werwolf.\nRegistriere alle Spieler mit /register Spielername Spielertyp\nGebe bei Register keine Klasse sondern nur den Namen an, um einen Spieler als Dorfbewohner einzutragen.\nStarte dann das Spiel mit /start und /tag (es startet der Tag)\n\nVerkuppel Spieler mit /armor spieler1 spieler2\n\nMit /help klassenname kannst du weitere Infos über einen Spielertyp erhalten.\nNutze /players um alle Spieler und /list type klassenname um alle Spieler eines Typs anzuzeigen.\n\nUm Spieler zu töten nutze /kill spielername.")



rl.on("line", function (msg) {
	if(msg === "/leon") { return console.log ("\n*****NN********N**EEEEEEEE*****II*****NN********N*****\n*****N*N*******N**E************II*****N*N*******N*****\n*****N**N******N**E************II*****N**N******N*****\n*****N***N*****N**E************II*****N***N*****N*****\n*****N****N****N**EEEEEEEE*****II*****N****N****N*****\n*****N*****N***N**E************II*****N*****N***N*****\n*****N******N**N**E************II*****N******N**N*****\n*****N*******N*N**E************II*****N*******N*N*****\n*****N********NN**E************II*****N********NN*****\n*****N*********N**EEEEEEEE*****II*****N*********N*****") }
	if(msg.startsWith("/help")) {
		let newmsg = msg.split(" ")
		if(!newmsg[1]) {
			return console.log("Hmm, da war wohl jemand zu Faul eine Hilfet zu schreiben.\nVersuch mal /help klassenname")
		}
		listtypes(newmsg[1], "false", "false", "true")
	}
    if(msg.startsWith("/register ")) {
        let newmsg = msg.split(" ")
		/*let namefind = newmsg.slice(2).join(" ")
		let gername = types.find(t => t.gername === namefind)
		if(gername) { var newtype = gername.name }*/
        if(!newmsg[2]) { var newtype = "bewohner" }
        else if(newmsg[2] === "jäger") { var newtype = "jager" }
        else if(newmsg[2] === "harter") { var newtype = "bursche"}
        else { var newtype = newmsg[2] }
		let truetype = typeregex.exec(newtype)
		if(!truetype) { return console.log("Keine bekannte Klasse " + newtype + " gefunden!") }
        players.push({
            name:newmsg[1],
            type:newtype,
            status:"none",
			armor:"none",
			strolch:"false"
        })
        console.log(newmsg[1] + " wurde als " + newtype + " registriert")
    }
    if(msg.startsWith("/unregister ")) {
        let newmsg = msg.split(" ")
        let remove = players.find(p => p.name === newmsg[1])
        if(!remove) return //{ console.log("Spieler nicht gefunden. Schreibfehler prüfen oder Spieler ist schon entfernt.") }
        let delet = players.indexOf(remove)
            players.splice(delet,1)
        console.log("Spieler entfernt.")
    }
    if(msg.startsWith("/armor ")) {
        let newmsg = msg.split(" ")
        let player1 = players.find(p => p.name === newmsg[1])
        let player2 = players.find(p => p.name === newmsg[2])
        let delet1 = players.indexOf(player1)
            players.splice(delet1,1)
        let delet2 = players.indexOf(player2)
            players.splice(delet2,1)
        players.push({ name:player1.name, type:player1.type, status:player1.status, armor:player2.name, strolch:player1.strolch },{ name:player2.name, type:player2.type, status:player2.status, armor:player1.name, strolch:player2.strolch })
        console.log(player1.name + " mit " + player2.name + " verkuppelt!")
    }
    if(msg.startsWith("/start")) {
        let opfer = players.find(p => p.type === "geist")
        if(opfer) {
            killmorgen.push(opfer.name)
        }
    }
//TAG UND NACHT
    if(msg === "/tag") {
        if(!isEven(daycycle)) { return console.log("Es ist schon Tag") }
		if(daycycle / 2 + 1 > players.filter(p => p.type.includes("wolf")).length) { //Alter Mann
			//console.log("hi")
			let mann = players.find(p => p.type === "altermann")
			if(mann) { killmorgen.push(mann.name) }
		}
		let wandlerin = players.find(p => p.type.includes("wandlerin")) //Wandlerin holen
			if(wandlerin) { let wandopfer = wandlerin.type.split(":") [1] } //Opfer der Wandlerin holen
        while (killmorgen.length - 2 > 0) { //Abarbeiten der Killqueue
            let usrname = killmorgen.pop() //entfernen aus dem Array
            let usr = players.find(p => p.name === usrname) //userobject holen
          if(usr) { //nichts gefunden?
            if(usr.status === "hexe") { //wenn geheilt, continue
                setstatus(usr.name, "none")                
                continue
            }
            if(usr.type === "schlampe") { continue }
            if(usr.status === "schlampe") { //wenn Freier stirbt Schlampe auch killen
                let schlampe = players.find(p => p.type === "schlampe")
                kill(schlampe.name)
            }
			if(usr.status === "wächter") { continue }
            if(usr.armor != "none") { //wenn Spieler verliebt, Partner killen
                killmorgen.push(usr.armor)
            }
            if(usr.type === "jager") { console.log("Der Jäger ist gestorben. Gebe sein Opfer mit /kill name ein") }
			if(usr.type === "aussatzige") { console.log("Die Aussätzige ist gestorben. In der nächsten Nacht darf nicht getötet werden, es sei denn, das Wolfsjunge stirbt auch.") }
			
            if(usr.type === "bursche") { //Harten Bursche in die Abendqueue verschieben
                killabend.push(usr.name)
                continue
            }
			if(usr.name === wopfer) { //Spieler ist Opfer der Wandlerin
				let delet = players.indexOf(wandlerin) //Wandlerin entfernen
              	  players.splice(delet,1)
     	        players.push({
        	        name:wandlerin.name,
        	        type:usr.type, //Status des Spielers übernehmen
        	        status:wandlerin.status,
					armor:wandlerin.armor,
					strolch:wandlerin.strolch
        	    })
			}
				
            kill(usr.name)
          }//ende if(usr)
            
        }//ende while loop
        daycycle++ //daycycle weiterschalten
        let whatday = daycycle / 2 + 0.5 //Tag holen
        console.log("Tag " + whatday + " beginnt...")
		let werwolfe = players.filter(p => p.type.includes("wolf")).length
		let vampire = players.filter(p => p.type === "vampir").length
		var bewohner = players.length - 2 //Bewohner sind alle Spieler minus die zwei Platzhalter
		if(werwolfe > 0) { //wenn es Werwölfe gibt, Anzahl anzeigen
			var bewohner = bewohner - werwolfe
			console.log(`${werwolfe} Werwölfe und`)
		}
		if(vampire > 0) { //wenn es Vampire gibt, Anzahl anzeigen
			var bewohner = bewohner - vampire
			console.log(`${vampire} Vampire und`)
		}
		console.log(`${bewohner} normale Bewohner verleiben...`) //Normale Bewohner sind alle Spieler - Werwölfe und Vampire
		let schweigefluch = players.find(p => p.status === "vettel")
		if(schweigefluch) { console.log(`${schweigefluch.name} wurde mit einem Schweigefluch belegt und darf nicht reden.`) }
    }
    if(msg === "/nacht") {
        if(isEven(daycycle)) { return console.log ("Es ist schon Nacht") }
        while (killabend.length - 2 > 0) {
            let usrname = killabend.pop()
            let usr = players.find(p => p.name === usrname)
          if(usr) {
            if(usr.armor != "none") {
                killabend.push(usr.armor)
            }
            if(usr.type === "jager") { console.log("Der Jäger ist gestorben. Gebe sein Opfer mit /kill name ein") }
            if(usr.type === "bursche") {
                let delet = players.indexOf(usr)
                    players.splice(delet,1)
                players.push({
                    name:usr.name,
                    type:"harter Bursche",
                    status:usr.status,
					armor:usr.armor,
					strolch:usr.strolch
                })
                killmorgen.push(usr.name)
                continue   
            }
            kill(usr.name)
          } //ende von if(usr)
            
        }//ende vom while loop
        daycycle++
        let noschlampe = players.find(p => p.status === "schlampe") //Bei wem ist die Schlampe?
        if(noschlampe) {
            setstatus(noschlampe.name, "none")
        }
        let whatnight = daycycle / 2
        console.log("Nacht " + whatnight + " beginnt...")
		let werwolfe = players.filter(p => p.type.includes("wolf")).length
		let vampire = players.filter(p => p.type === "vampir").length
		var bewohner = players.length - 2
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
	if(msg.startsWith("/gestaltwandlerin ")) {
		let newmsg = msg.split(" ")
		let wandlerin = players.find(p => p.type === "gestaltwandlerin")
			if(!wandlerin) { return console.log ("Ich konnte die Gestaltwandlerin nicht finden") }
		let delet = players.indexOf(wandlerin)
                players.splice(delet,1)
        players.push({
            name:wandlerin.name,
            type:"gestaltwandlerin:" + newmsg[1],
            status:wandlerin.status,
			armor:wandlerin.armor,
			strolch:wandlerin.strolch
        })
	}
	if(msg.startsWith("/seher ")) {
		let newmsg = msg.split(" ")
		let pname = newmsg[1]
		let player = players.find(p => p.name === pname)
		if(!player) { return console.log("Ein Fehler ist aufgetreten: Konnte Spieler " + newmsg[1] + " nicht finden!") }
		let type = types.find(t => t.name === player.type)
		if(type.group != "bewohner") { console.log(`Spieler ${player.name} ist böse`) }
		else { console.log(`Spieler ${player.name} ist gut`) }
	}	
	if(msg.startsWith("/strolch ")) {
        let newmsg = msg.split(" ")
		let p1 = players.find(p => p.name === newmsg[1])
		let p2 = players.find(p => p.name === newmsg[2])
		if(!p1 || !p2) { return console.log("mindestens einer der Spieler wurde nicht gefunden!") }
		let delet1 = players.indexOf(p1)
			players.splice(delet1,1)
		let delet2 = players.indexOf(p2)
			players.splice(delet2,1)
		players.push({ name:p1.name, type:p1.type, status:p1.status, armor:p1.armor, strolch:"true" },{ name:p2.name, type:p2.type, status:p2.status, armor:p2.armor, strolch:"true" })
    }
//COMMANDS FÜR DIREKTE SPIELSTEUERUNG
    if(msg.startsWith("/kill ")) {
        let newmsg = msg.split(" ")
        if(!isEven(daycycle)) {
            killabend.push(newmsg[1])
            console.log(newmsg[1] + " wird am Abend sterben")
        } else {
            killmorgen.push(newmsg[1])
            console.log(newmsg[1] + " wird am Morgen sterben")
        }
    }
	if(msg.startsWith("/players")) {
		players.forEach(listplayers)
	}
	if(msg.startsWith("/find type")) {
		let newmsg = msg.split(" ")
		let typelist = players.filter(p => p.type === newmsg[2]).forEach(listplayers)
		if(!typelist) { console.log("Keine weiteren Spieler gefunden!") }
	}
	if(msg.startsWith("/find player")) {
		let newmsg = msg.split(" ")
		let player = players.find(p => p.name === newmsg[2])
		if(player) { listplayers(player) }
		else { console.log("Nichts gefunden!") }
	}
    if(msg.startsWith("/eval ")) {
        var code = msg.split(" ").slice(1).join(" ")
        var result = eval(code)
        console.log(result)
    }
            
            
})

    


