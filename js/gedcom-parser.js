function getKW(line){
	var kw = line.substring(2);
	if(kw.indexOf(' ') > 0){
		kw = kw.substring(0,kw.indexOf(' '));
	}
	return kw;
}

function getCt(line){
	var ct = line.substring(2);
	if(ct.indexOf(' ') > 0){
		ct = ct.substring(ct.indexOf(' ')+1);
	}
	if(ct.charAt(0) == "@"){
		ct = getId(ct);
	}
	return ct;
}

function getId(txt){
    var t = txt.match("@.*@")[0];
    t = t.substring(1,t.length-1);
    return t;
}

function getObj(objbloc){
    var obj = {};
    //do line 0
    obj['id'] = getId(objbloc[0]);
    var i = 1;
	while(i < objbloc.length && objbloc[i].charAt(0) == '1'){
		//do line 1
		var kw1 = getKW(objbloc[i]);
		var incr;
		if(obj[kw1] == undefined){
			incr = 1; 
		}
		else{
			kw1 = kw1 + incr;
			incr++;
		}
		obj[kw1] = getCt(objbloc[i]);
		i++;
		var clearkw1 = true;
		while(i < objbloc.length && (objbloc[i].charAt(0) == '2' || objbloc[i].charAt(0) == '3')){
			//do line 2
			if(clearkw1){
				obj[kw1] = [];
				clearkw1 = false;
			}
			var kw2 = getKW(objbloc[i]);
			obj[kw1][kw2] = getCt(objbloc[i]);
			i++;
		}
	}

	return obj;
}

function blocs2objs(blocs){
    for (var i = 0; i < blocs.length; i++) {
        if(blocs[i][0].charAt(2) == "@"){
            if(blocs[i][0].charAt(3) == "I"){
                indivs.insert(getObj(blocs[i]));
            }
            if(blocs[i][0].charAt(3) == "F"){
                fams.insert(getObj(blocs[i]));
            }
        }
    };
    return [indivs,fams];
}

function lines2blocs(lines){
    var b = [];
    var i = 0;
    while (i < lines.length) {
        var o = [];
        o.push(lines[i]);
        i++;
        while(i < lines.length && lines[i].charAt(0) != 0){
            o.push(lines[i]);                
            i++;
        }
        b.push(o);
    }
    return b;
}

function ged2obj(gedfilecontent){
    var lines = gedfilecontent.split('\n');
    var blocs = lines2blocs(lines);
    return blocs2objs(blocs);
}

var indivs = TAFFY();
var fams = TAFFY();

function parsegedfile(gedfilecontent){
    ged2obj(gedfilecontent);
}

function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object
    var reader = new FileReader(file);
    reader.readAsText(file, "UTF-8");
    // files is a FileList of File objects. List some properties.
    reader.onload = function(evt2){
        parsegedfile(evt2.target.result);
        console.log(indivs().count() + " poeple registered");
        console.log(fams().count() + " families registered");
    }
}