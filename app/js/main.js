function start(){
    //var scene = new THREE.Scene();
    //var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    //
    //var renderer = new THREE.WebGLRenderer();
    //renderer.setSize( window.innerWidth, window.innerHeight );
    //document.body.appendChild( renderer.domElement );
    //
    //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //var cube = new THREE.Mesh( geometry, material );
    //scene.add( cube );
    //
    //camera.position.z = 5;
    //
    //var render = function () {
    //    requestAnimationFrame( render );
    //
    //    cube.rotation.x += 0.1;
    //    cube.rotation.y += 0.1;
    //
    //    renderer.render(scene, camera);
    //};
    
    
    
    //2
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    var canvas = document.getElementById("canvas");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    
    var ball = {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
    };
    
    var gui = new dat.GUI();
    gui.add(ball, 'positionX').min(-5).max(5).step(1);
    gui.add(ball, 'positionY').min(-5).max(5).step(1);
    gui.add(ball, 'positionZ').min(-5).max(5).step(1);
    gui.add(ball, 'rotationX').min(-0.2).max(0.2).step(0.001);
    gui.add(ball, 'rotationY').min(-0.2).max(0.2).step(0.001);
    gui.add(ball, 'rotationZ').min(-0.2).max(0.2).step(0.001);
    
    var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setClearColor(0x000000);
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 5000);
    camera.position.set(0, 0, 1000); //x,y,z
    
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
    
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.4); //цвет и яркость
    directionalLight.position.set(-100,0,0).normalize();
    scene.add(directionalLight);
    
    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );
    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
    
    //Квадрат
    var geometry = new THREE.PlaneGeometry(300, 300, 12, 12); //плоскость - width, height, количество фрагментов
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true}); //wireframe - грани(пустотелый обьект)
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    //Сфера
    var geometry2 = new THREE.SphereGeometry(200, 12, 12);
    var material2 = new THREE.MeshBasicMaterial({color: 0xffffff, vertexColors: THREE.FaceColors}); //vertexColors: THREE.FaceColors - цвета для каждой грани
    
    //цвета для каждой грани
    for(var i = 0; i < geometry2.faces.length; i++){
        geometry2.faces[i].color.setRGB(Math.random(),Math.random(),Math.random());
    }
    
    var mesh2 = new THREE.Mesh(geometry2, material2);
    scene.add(mesh2);
    
    //Куб
    var geometry3 = new THREE.BoxGeometry( 200, 200, 200, 2, 2, 2 ); //BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
    var material3 = new THREE.MeshBasicMaterial( { color: 0x00ffff, vertexColors: THREE.FaceColors } );
    //for(var i = 0; i < geometry3.faces.length; i++){
    //    geometry3.faces[i].color.setRGB(0x2f302f,0x2f002f,0x2f002f);
    //}
    console.log(geometry3.faces)
    var mesh3 = new THREE.Mesh( geometry3, material3 );
    mesh3.position.set(0,300,0);
    mesh3.rotation.set(0,0.1,0);
    scene.add(mesh3);
    
    //GRID
    var gridHelper = new THREE.GridHelper(10, 0.5);
    scene.add(gridHelper);
    
    function loop(){
        
        mesh.position.x -= 1;
        mesh.rotation.z += Math.PI / 500;
        
        //mesh2.position.x += 1;
        mesh2.position.x += ball.positionX;
        mesh2.position.y += ball.positionY;
        mesh2.position.z += ball.positionZ;
        mesh2.rotation.x += ball.rotationX;
        mesh2.rotation.y += ball.rotationY;
        mesh2.rotation.z += ball.rotationZ;
        
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
    }
    
    loop();
    
}

document.addEventListener("DOMContentLoaded", start);