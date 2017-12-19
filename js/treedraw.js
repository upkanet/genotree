function drawIndiv(ind){
	var zone = $('#treecanv');
	console.log(ind.NAME);
	zone.append(ind.NAME);
}

function drawTree(indiv_id){
	var ind = indivs({"id": indiv_id}).first();

	drawIndiv(ind);
	if(ind.FAMC != undefined){
		var father_id = fams({"id": ind.FAMC}).first().HUSB;
		var mother_id = fams({"id": ind.FAMC}).first().WIFE;
		
		drawTree(father_id);
		drawTree(mother_id);
	}
}

function getFatherId(indiv_id){
	var ind = indivs({"id": indiv_id}).first();
	return fams({"id": ind.FAMC}).first().HUSB;
}

function getMotherId(indiv_id){
	var ind = indivs({"id": indiv_id}).first();
	return fams({"id": ind.FAMC}).first().WIFE;
}

function getHusbId(indiv_id){
	var ind = indivs({"id": indiv_id}).first();
	return fams({"id": ind.FAMS}).first().HUSB;
}

function getWifeId(indiv_id){
	var ind = indivs({"id": indiv_id}).first();
	return fams({"id": ind.FAMS}).first().WIFE;
}

function getSpouseId(indiv_id){
	var ind = indivs({"id": indiv_id}).first();
	if(ind.SEX == "M"){
		return getWifeId(indiv_id);
	}
	else{
		return getHusbId(indiv_id);
	}
}

function Id2Int(id){
	var idint = 0;
	if(id != undefined){
		idint = parseInt(id.substring(1));
	}
	return idint;
}

function generation(indiv_id){
	var ind = indivs({"id": indiv_id}).first();
	var spouse = indivs({"id": getSpouseId(indiv_id)}).first();

	if(!ind.FAMC && !spouse.FAMC){
		return 0;
	}
	else{
		var father_id = "";
		if(!ind.FAMC){
			father_id = getFatherId(spouse.id);
		}
		else{
			father_id = getFatherId(ind.id);
		}
		return 1 + generation(father_id);
	}
}

function getImg(obj){
	if(!obj.OBJE){
		return "";
	}
	else{
		return obj.OBJE.FILE;
	}
}

function getFName(name){
	return name.substring(0, name.indexOf('/')-1);
}

function getLName(name){
	return name.substring(name.indexOf('/')+1,name.length - 1);
}

function getDates(obj){
	var txt = "";
	if(obj.BIRT){
		txt += getYear(obj.BIRT.DATE);
	}
	if(obj.DEAT){
		txt += " - " + getYear(obj.DEAT.DATE);
	}
	return txt;
}

function getYear(d){
	var y = "";
	if(d){
		y = d.substring(d.length - 4);
	}
	return y;
}

function setupIndivArr(){
	var poeple = [];
	indivs().each(function(r){
		var ind = {"key": Id2Int(r.id), "fn": getFName(r.NAME), "ln": getLName(r.NAME), "s": r.SEX, "dates": getDates(r) , "m": Id2Int(getMotherId(r.id)), "f": Id2Int(getFatherId(r.id)), "gen": generation(r.id), "img": getImg(r)};
		if(r.SEX == "M"){
			ind["w"] = Id2Int(getWifeId(r.id));
		}
		else{
			ind["h"] = Id2Int(getHusbId(r.id));
		}
		poeple.push(ind);
		ppl.insert(ind);
	});
	return poeple;
}

var ppl = TAFFY();

function getChildren(indiv_id){
	var ind = indivs({"id": indiv_id}).first();
	var children = [];
	if(ind.FAMS){
		var fam = fams({"id": ind.FAMS}).first();
		var incr = "";
		while(fam["CHIL"+incr]){
			children.push(Id2Int(fam["CHIL"+incr]));
			incr = parseInt(incr + 1);
		}
	}
	return children;
}

function plotData(){
	var poeple = [];
	indivs().each(function(r){
		var ind = {"id": Id2Int(r.id),"name": r.NAME, "children": getChildren(r.id), "partners": [Id2Int(getSpouseId(r.id))], level: generation(r.id), "parents": [Id2Int(getFatherId(r.id)), Id2Int(getMotherId(r.id))]};
		if(r.id == "I1"){
			ind["root"] = true;
		}
		poeple.push(ind);
	});
	return poeple;
}

function getImg(indiv_id){
	var ind = indivs({"id": indiv_id}).first();
	var imgurl = "";
	if(ind.OBJE){
		imgurl = ind.OBJE.FILE;
	}
	return imgurl;
}

function VisDataSet(){
	var nodes = [];
	var edges = [];
	indivs().each(function(r){
		var ind = {
			"id": Id2Int(r.id), 
			"shape": 'circularImage',
			"image": getImg(r.id),
			"label": getFName(r.NAME) + '\n' + getLName(r.NAME) + '\n' + getDates(r)
		};
		nodes.push(ind);
	});
	fams().each(function(r){
		var current_id = 500 + Id2Int(r.id);
		var fam = {
			"id": current_id,
			"shape": 'circle',
			"size": 2,
		};
		nodes.push(fam);
		//EDGES
		//Husb to Family
		edges.push({
			"from": Id2Int(r.HUSB),
			"to": current_id,
			"arrows": 'to',
		});
		//Wife to Family
		edges.push({
			"from": Id2Int(r.WIFE),
			"to": current_id,
			"arrows": 'to',
		});
		//Husb to Wife
		edges.push({
			"from": Id2Int(r.HUSB),
			"to": Id2Int(r.WIFE),
		});
		//Family to Child
		var incr = "";
		while(r["CHIL" + incr]){
			edges.push({
				"from": current_id,
				"to": Id2Int(r["CHIL" + incr]),
				"arrows": 'to',
			});
			incr = parseInt(1 + incr);
		}
	});

	return {"nodes": nodes,"edges": edges};
}