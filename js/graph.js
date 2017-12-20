 
var nodes = null;
var edges = null;
var network = null;
var selectedNodes = [];

Array.prototype.pushunique = function(e) {
  if(this.indexOf(e) < 0) this.push(e);
}

// Called when the Visualization API is loaded.
function draw() {
  console.log("Start drawing...");

  var vdataset = VisDataSet();
  // create people.
  // value corresponds with the age of the person
  nodes = vdataset.nodes;

  // create connections between people
  // value corresponds with the amount of contact between two people
  edges = vdataset.edges;

  // create a network
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
    nodes: {
      borderWidth:1,
      size:30,
      color: {
        border: '#FFFFFF',
        background: '#000000'
      },
      font:{color:'#eeeeee'},
      shapeProperties: {
        useBorderWithImage:true
      }
    },
    edges: {
      smooth: false
    },
    "physics": {
      "barnesHut": {
        "gravitationalConstant": -13600,
        "avoidOverlap": 1
      },
      "minVelocity": 0.75,
      "timestep": 1
    },
    "interaction":{
      "multiselect": true,
    },
    "layout":{
      "improvedLayout":false,
    }
  };
  network = new vis.Network(container, data, options);

  console.log("Drawing completed");
}

//Canvas size
var photoheight = 5120;
var currentheight = photoheight/10;
var ratio = 1.5;

function resizeCanvas(){
  $('#mynetwork').css('height',currentheight);
  $('#mynetwork').css('width',currentheight*ratio);
}

function workingsize(){
  currentheight = photoheight / 10;
  resizeCanvas();
}

function photosize(){
  currentheight = photoheight;
  resizeCanvas();
}

function fsSize(){
  var sw = window.innerWidth - 20;
  var sh = window.innerHeight - 50;
  var sratio = sw / sh;

  if(sratio > ratio){
    currentheight = sh;
  }
  else{
    currentheight = sw / ratio;
  }

  resizeCanvas();
}

function changeRatio(){
  ratio = $('#ratiof').find(':selected').val();
  resizeCanvas();
}

function switchPhysics(){
  var swVal = 'On';
  network.physics.options.enabled = !network.physics.options.enabled;
  if(!network.physics.options.enabled){
    swVal = 'Off';
  }
  $('#physicBtn').html('Physics '+swVal);
}

vis.Network.prototype.getGroup = function(groupName){
  var nodesId = [];
  for(k in this.nodesHandler.body.nodes){
    var n = this.nodesHandler.body.nodes[k];
    if(n.options.group == groupName){
      nodesId.push(n.id);
    }
  }
  return nodesId;
}

vis.Network.prototype.selectGroup = function(groupName){
  var nodesId = this.getGroup(groupName);
  this.selectNodes(nodesId);
}

vis.Network.prototype.alignSelected = function(y = null){
  var selNodes = this.getSelectedNodes();

  //Find Average Position
  var avg = 0;
  var sum = 0;
  var i = 0;
  var nodes = this.nodesHandler.body.nodes;
  
  selNodes.forEach(function(n){
    var node = nodes[n];
    sum += node.y;
    i += 1;
  });
  avg = sum / i;

  //Align to Average Position
  selNodes.forEach(function(n){
    var node = nodes[n];
    var ny = avg;
    if(y != null){
      ny = y;
    }
    node.y = ny;
  });

  this.redraw();
}

vis.Network.prototype.selectNeighbours = function(direction){
  var selNodes = this.getSelectedNodes();
  var nextSelNodes = [];
  selNodes.forEach(function(n){
    var narr = network.getConnectedNodes(n,direction);
    nextSelNodes = nextSelNodes.concat(narr);
  });
  network.selectNodes(nextSelNodes,true);
}

function selectgroup(){
  var g = $('#selgroup').val();
  network.selectGroup(g);
}

function alignselection(){
  network.alignSelected();
}

function selectparents(){
  network.selectNeighbours('from');
}

function selectchildren(){
  network.selectNeighbours('to');
}

function prepare(gap = 100){
  network.selectGroup('gen0');
  for(var i=0;i<10;i++){
    network.alignSelected(i*gap);
    network.selectNeighbours('to');
  }
}

function compactFam(hid, xgap = 300, ygap = 200){
  var hnode = network.nodesHandler.body.nodes[hid];
  var famnode = network.nodesHandler.body.nodes[network.getConnectedNodes(hnode.id,'to')[0]];
  var wnode = network.nodesHandler.body.nodes[network.getConnectedNodes(famnode.id,'from')[0]];
  if(hnode.id == wnode.id){
    wnode = network.nodesHandler.body.nodes[network.getConnectedNodes(famnode.id,'from')[1]];
  }

  console.log(hnode);
  console.log(famnode);
  console.log(wnode);
  //Horizontal Align Wife
  wnode.y = hnode.y;
  //Vertial Gap Wife Node
  wnode.x = hnode.x + xgap;
  //Horizontal Gap Fam Node
  famnode.y = hnode.y + ygap;
  //Center Fam Node
  famnode.x = hnode.x + xgap/2;

  network.redraw();
}
