 
var nodes = null;
var edges = null;
var network = null;

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
      color: 'white',
      smooth: false
    },
    "physics": {
      "barnesHut": {
        "gravitationalConstant": -13600,
        "avoidOverlap": 1
      },
      "minVelocity": 0.75,
      "timestep": 1
    }
  };
  network = new vis.Network(container, data, options);
  console.log("Drawing completed");
}

var photo = {"w": 7660, "h": 5120};

function workingsize(){
  $('#mynetwork').css('width',parseInt(photo.w/10));
  $('#mynetwork').css('height',parseInt(photo.h/10));
}

function photosize(){
  $('#mynetwork').css('width',7660);
  $('#mynetwork').css('height',5120);
}

function fsSize(){
  var sw = window.innerWidth;
  var sh = window.innerHeight - 50;
  var sar = sw / sh;
  var par = photo.w / photo.h;
  var w = 0;
  var h = 0;
  if(sar>=par){
    h = sh;
    w = h * par;
  }
  else{
    w = sh;
    h = w / par;
  }

  $('#mynetwork').css('width',w);
  $('#mynetwork').css('height',h);
}

function switchPhysics(){
  network.physics.options.enabled = !network.physics.options.enabled;
}
