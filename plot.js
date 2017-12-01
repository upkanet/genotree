var data = [], elements = [], root, levels = [], levelMap = [], 
	tree = $('#tree'), 
	startTop, startLeft, gap = 32, size = 64
;
startTop = (window.innerHeight / 2) - (size / 2);
startLeft = (window.innerWidth / 2) - (size / 2);

function loadPlot(){
	data = plotData();

	data.forEach(function(elem) {
		if (levels.indexOf(elem.level) < 0) { levels.push(elem.level); }
	});
	levels.sort(function(a, b) { return a - b; });

	levels.forEach(function(level) {
		var startAt = data.filter(function(person) {
			return person.level == level;
		});
		startAt.forEach(function(start) {
			var person = findPerson(start.id);
			plotNode(person, 'self');
			plotParents(person);
		});
		
	});

	adjustNegatives();
}

function plotParents(start) {
	if (! start) { return; }
	start.parents.reduce(function(previousId, currentId) {
		var previousParent = findPerson(previousId), 
			currentParent = findPerson(currentId);
		plotNode(currentParent, 'parents', start, start.parents.length);
		if (previousParent) { plotConnector(previousParent, currentParent, 'partners'); }
		plotConnector(start, currentParent, 'parents');
		plotParents(currentParent);
		return currentId;
	}, 0);
}

function plotNode() {
	var person = arguments[0], personType = arguments[1], relative = arguments[2], numberOfParents = arguments[3], 
		node = get(person.id), relativeNode, element = {}, thisLevel, exists 
	;
	if (node) { return; }
	node = document.createElement('div'); 
	node.id = person.id; 
	node.classList.add('node'); node.classList.add('asset'); 
	node.textContent = person.name; 
	node.setAttribute('data-level', person.level);

	thisLevel = findLevel(person.level);
	if (! thisLevel) { 
		thisLevel = { 'level': person.level, 'top': startTop }; 
		levelMap.push(thisLevel); 
	}
	
	if (personType == 'self') {
		node.style.left = startLeft + 'px'; 
		node.style.top = thisLevel.top + 'px';
	} else {
		relativeNode = get(relative.id);
	}
	if (personType == 'partners') {
		node.style.left = (parseInt(relativeNode.style.left) + size + (gap * 2)) + 'px';	
		node.style.top = parseInt(relativeNode.style.top) + 'px'; 
	}
	if (personType == 'children') {
		node.style.left = (parseInt(relativeNode.style.left) - size) + 'px';	
		node.style.top = (parseInt(relativeNode.style.top) + size + gap) + 'px'; 							
	}
	if (personType == 'parents') {
		if (numberOfParents == 1) { 
			node.style.left = parseInt(relativeNode.style.left) + 'px'; 
			node.style.top = (parseInt(relativeNode.style.top) - gap - size) + 'px';						
		} else {
			node.style.left = (parseInt(relativeNode.style.left) - size) + 'px'; 
			node.style.top = (parseInt(relativeNode.style.top) - gap - size) + 'px';											
		}
	}
	while (exists = detectCollision(node)) { 
		node.style.left = (exists.left + size + (gap * 2)) + 'px'; 
	}

	if (thisLevel.top > parseInt(node.style.top)) {
		updateLevel(person.level, 'top', parseInt(node.style.top));
	}
	
	element.id = node.id; element.left = parseInt(node.style.left); element.top = parseInt(node.style.top); 
	elements.push(element);
	tree.append(node); 
}

/* Helper Functions */
function get(id) { return document.getElementById(id); }

function findPerson(id) {
	var element = data.filter(function(elem) {
		return elem.id == id;
	});
	return element.pop();
}

function findLevel(level) {
	var element = levelMap.filter(function(elem) {
		return elem.level == level;
	});
	return element.pop();
} 

function updateLevel(id, key, value) {
	levelMap.forEach(function(level) {
		if (level.level === id) {
			level[key] = value;
		}
	});
}

function detectCollision(node) {
	var element = elements.filter(function(elem) { 
		var left = parseInt(node.style.left);
		return ((elem.left == left || (elem.left < left && left < (elem.left + size + gap))) && elem.top == parseInt(node.style.top));
	});
	return element.pop();
}

function adjustNegatives() { 
	var allNodes = document.querySelectorAll('div.asset'), 
		minTop = startTop, diff = 0;
	for (var i=0; i < allNodes.length; i++) {
		if (parseInt(allNodes[i].style.top) < minTop) { minTop = parseInt(allNodes[i].style.top); }
	};
	if (minTop < startTop) {
		diff = Math.abs(minTop) + gap; 
		for (var i=0; i < allNodes.length; i++) {
			allNodes[i].style.top = parseInt(allNodes[i].style.top) + diff + 'px';
		};
	}
}

function plotConnector(source, destination, relation) {
	var connector = document.createElement('div'), 
  		orientation, comboId, comboIdInverse, start, stop, 
			x1, y1, x2, y2, length, angle, transform
	; 
  // We do not plot a connector if already present
  comboId = source.id + '-' + destination.id;
  comboIdInverse = destination.id + '-' + source.id;
  if (document.getElementById(comboId)) { return; }
  if (document.getElementById(comboIdInverse)) { return; }

  connector.id = comboId;
	orientation = relation == 'partners' ? 'h' : 'v';
	connector.classList.add('asset');
	connector.classList.add('connector');
	connector.classList.add(orientation);
	start = get(source.id); stop = get(destination.id);
	if (relation == 'partners') {
		x1 = parseInt(start.style.left) + size; y1 = parseInt(start.style.top) + (size/2);
		x2 = parseInt(stop.style.left); y2 = parseInt(stop.style.top);
		length = (x2 - x1) + 'px';
		
		connector.style.width = length;
		connector.style.left = x1 + 'px';
		connector.style.top = y1 + 'px';
    // Avoid collision moving down
    while (exists = detectConnectorCollision(connector)) { 
      connector.style.top = (parseInt(exists.style.top) + 4) + 'px'; 
    }
	}
	if (relation == 'parents') {
		x1 = parseInt(start.style.left) + (size/2); y1 = parseInt(start.style.top);
		x2 = parseInt(stop.style.left) + (size/2); y2 = parseInt(stop.style.top) + (size - 2);
		
		length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
		transform = 'rotate(' + angle + 'deg)'; 
		
		connector.style.width = length + 'px';
		connector.style.left = x1 + 'px';
		connector.style.top = y1 + 'px';
		connector.style.transform = transform;
	}
	tree.appendChild(connector);
}

function detectConnectorCollision(connector) {
  var connectors = [].slice.call(document.querySelectorAll('div.connector.h'));
  var element = connectors.filter(function(elem) { 
    return ((elem.style.left == connector.style.left) && (elem.style.top == connector.style.top))
  });
  return element.pop();
}
