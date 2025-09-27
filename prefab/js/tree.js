//
function gentree(x,y,z) {
leaves = new THREE.Group();
group.add(leaves)

const MAX_LIFE = 8;

var geometry = new THREE.CubeGeometry();
geometry.translate( 0, 0.5, 0 );

var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );

var tree = new THREE.Group();

var root = new THREE.Mesh( geometry, material );
root.position.set(x,y,z);

  //
  shadowgeometry = new THREE.PlaneGeometry(3, 3);
  shadow = new THREE.Mesh(shadowgeometry, new THREE.MeshBasicMaterial( { 
    map:new THREE.TextureLoader().load( 'models/shadow.png' ),
    transparent:true,
    opacity:0.2
    // color:0x00ffff
  } ));
  shadow.position.x = x;  
  // shadow.position.y = y;  
  shadow.position.z = z;  
  shadow.rotation.x = -Math.PI/2;
  group.add(shadow);


function addBranch( child, life ) {
  var progress = 1.05 - ( life / MAX_LIFE );
  var scale = child.scale.y - Math.random() / 5;
  child.scale.set( progress / 20, scale, progress / 20 );

  if ( life > 0 ) {
    child.translateY( scale );
    child.rotation.x += Math.random() - 0.5;
    child.rotation.y += Math.random() - 0.5;
    child.rotation.z += Math.random() - 0.5;
  } 

  child.updateMatrix();
  tree.add( child );

  if ( life < Math.random() * MAX_LIFE ) {
    life = life + 1;
    for ( var i = 0; i < 3; i ++ ) {
      if ( Math.random() > 0.1 ) {
        addBranch( child.clone(), life );
      }
    } // for  
  }
  
    // add leaves at ends
  if ( life > 3 ) {
    addleaves(child.position)
  }

}// end addbranch


addBranch( root, 0 );

// Merge branches
var geometry = new THREE.Geometry();

for ( var i = 0; i < tree.children.length; i ++ ) {
  var branch = tree.children[ i ];
  geometry.merge( branch.geometry, branch.matrix );
}

// add branches
branches = new THREE.Mesh( geometry, material);
branches.position.y = -2;
group.add( branches );
}// gentree


// add leaves to tree
function addleaves(arg){
  var geometry = new THREE.SphereGeometry( 0.2, 20, 20 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent:true, opacity:0.4 } );
  cube = new THREE.Mesh( geometry, material );
  cube.position.set(arg.x+((Math.random() - 0.5) * 1.5), (arg.y-1.5)+((Math.random() - 0.5) * 1.5), arg.z+((Math.random() - 0.5) * 1.5));
  var sz = (Math.random() - 0.5) * 3;
  cube.scale.set(sz,sz,sz)
  leaves.add( cube );
}