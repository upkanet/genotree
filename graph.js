 
var nodes = null;
var edges = null;
var network = null;

// Called when the Visualization API is loaded.
function draw() {
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
}

function workingsize(){
  $('#mynetwork').css('width',766);
  $('#mynetwork').css('height',512);
}

function photosize(){
  $('#mynetwork').css('width',7660);
  $('#mynetwork').css('height',5120);
}
