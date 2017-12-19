 
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
    },
    "interaction":{
      "multiselect": true,
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
