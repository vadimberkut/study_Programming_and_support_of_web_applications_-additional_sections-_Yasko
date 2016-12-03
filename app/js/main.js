(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	var radius   = 0.5,
		segments = 32,
		rotation = 6;

	//var config = {
	//	totalSpeed: 0	
	//};
	
//	var gui = new dat.GUI();
//    gui.add(config, 'totalSpeed').min(-0.1).max(0.1).step(0.00001);

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10000);
	camera.position.z = 500;
	camera.lookAt({
		x: 0,
		y: 0,
		z: 0
	});

	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(width, height);

	//LIGHT
	scene.add(new THREE.AmbientLight(0x222222));
	//
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(51,0,0);
	light.target.position.set( 0,0,0 );
	//scene.add(light);
	
	var pointLight = new THREE.PointLight(0xffffff, 1, 10000); // color, intensity, distance, decay
	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 0;
	//scene.add(pointLight);
	
	var camLight = new THREE.PointLight(0xffffff, 0.2);
	camLight.position = camera.position;
	scene.add(camLight);
	
	//controls
	//var controls = new THREE.TrackballControls(camera);
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.minDistance = 1;
    controls.maxDistance = 2000;
    controls.target = new THREE.Vector3(0,0,0);
	
	
	//MOUSE CLICK - INTERSECTIONS
	var raycaster = new THREE.Raycaster();

	var clickInfo = {
	  mouseVec2: new THREE.Vector2(),
	  userHasClicked: false
	};
		
	window.addEventListener( 'click', onMouseClick, false );
	function onMouseClick( event ) {

		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components
		
		clickInfo.userHasClicked = true;
		clickInfo.mouseVec2.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		clickInfo.mouseVec2.y = - ( event.clientY / window.innerHeight ) * 2 + 1;		
	
	}
	/////////
	
	var objectsInfo = {
		sun: {
			name: 'Sun',
			x: 0,
			y: 0,
			z: 0,
			radius: 0,
			speed: 0.001,
			degree: Math.PI / 2,
			radian: 0,
			planetSize: 50,
			mesh: null
		},
		mercury: {
			name: "Mercury",
			x: 0,
			y: 0,
			z: 0,
			radius: 57,
			speed: 0.08,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 4,
			mesh: null
		},
		venus: {
			name: "Venus",
			x: 0,
			y: 0,
			z: 0,
			radius: 100,
			speed: 0.03,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 8,
			mesh: null
		},
		earth: {
			name: "Earth",
			x: 0,
			y: 0,
			z: 0,
			radius: 130,
			speed: 0.02,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 8,
			mesh: null,
			cloudsMesh: null,
			
			satellites: [
				{
					name: "Moon",
					x: 0,
					y: 0,
					z: 0,
					radius: 12,
					speed: 0.02,
					degree: Math.random() * 1000,
					radian: 0,
					planetSize: 2.18,
					mesh: null,
					cloudsMesh: null
				}
			]
		},
		mars: {
			 name: "Mars",
			x: 0,
			y: 0,
			z: 0,
			radius: 180,
			speed: 0.01,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 6,
			mesh: null
		},
		jupiter: {
			name: "Jupiter",
			x: 0,
			y: 0,
			z: 0,
			radius: 300,
			speed: 0.006,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 20,
			mesh: null
		},
		saturn: {
			 name: "Saturn",
			x: 0,
			y: 0,
			z: 0,
			radius: 400,
			speed: 0.003,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 17,
			mesh: null,
			ringsMesh: null
		},
		uran: {
			name: "Uran",
			x: 0,
			y: 0,
			z: 0,
			radius: 450,
			speed: 0.005,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 10,
			mesh: null,
			ringsMesh: null
		},
		neptun: {
			name: "Neptun",
			x: 0,
			y: 0,
			z: 0,
			radius: 500,
			speed: 0.003,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 10,
			mesh: null
		},
		pluto: {
			name: "Pluto",
			x: 0,
			y: 0,
			z: 0,
			radius: 550,
			speed: 0.003, //?
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 5, //0.42
			mesh: null
		},
	};
	
	
	//SUN
	var sun = createSun(objectsInfo.sun.planetSize, segments);
	sun.position.x = 0;
	sun.position.y = 0;
	sun.position.z = 0;
	objectsInfo.sun.mesh = sun;
	//scene.add(sun);
	
	//SUNLIGHT
	pointLight.add(sun);
	scene.add( pointLight );

	
	//MERCURY
	var mercury  = createMercury(objectsInfo.mercury.planetSize, segments);
	mercury.rotation.y = Math.PI / 2;
	objectsInfo.mercury.mesh = mercury;
	scene.add(mercury);
	
	//VENUS
	var venus  = createVenus(objectsInfo.venus.planetSize, segments);
	venus.rotation.y = Math.PI / 2;
	objectsInfo.venus.mesh = venus;
	scene.add(venus);
	
	//EARTH
    var earth = createEarth(objectsInfo.earth.planetSize, segments);
	earth.rotation.y = Math.PI / 2; 
	objectsInfo.earth.mesh = earth;
	scene.add(earth);

    var earthClouds = createEarthClouds(objectsInfo.earth.planetSize, segments);
	earthClouds.rotation.y = Math.PI / 2;
	objectsInfo.earth.cloudsMesh = earthClouds;
	scene.add(earthClouds);
	
	var moonInfo  = objectsInfo.earth.satellites.find(function(el){ return el.name.toLowerCase() == 'moon'});
	var moon = createMoon(moonInfo.planetSize, segments);
	moon.rotation.y = Math.PI / 2; 
	//objectsInfo.moon.mesh = moon;
	moonInfo.mesh = moon;
	//scene.add(moon);
	earth.add(moon);
	
	//MARS
	var mars = createMars(objectsInfo.mars.planetSize, segments);
	mars.rotation.y = Math.PI / 2;
	objectsInfo.mars.mesh = mars;
	scene.add(mars);
	
	//JUPITER
	var jupiter = createJupiter(objectsInfo.jupiter.planetSize, segments);
	jupiter.rotation.y = Math.PI / 2;
	objectsInfo.jupiter.mesh = jupiter;
	scene.add(jupiter);
	
	//SATURN
	var saturn = createSaturn(objectsInfo.saturn.planetSize, segments);
	saturn.rotation.y = Math.PI / 2;
	objectsInfo.saturn.mesh = saturn;
	objectsInfo.saturn.ringsMesh = createSaturnRings();
	objectsInfo.saturn.ringsMesh.rotation.x = Math.PI / 2;
	scene.add(saturn);
	scene.add(objectsInfo.saturn.ringsMesh);
	
	//URAN
	var uran = createUranus(objectsInfo.uran.planetSize, segments);
	uran.rotation.y = Math.PI / 2;
	objectsInfo.uran.mesh = uran;
	objectsInfo.uran.ringsMesh = createUranusRings();
	objectsInfo.uran.ringsMesh.rotation.x = Math.PI / 2;
	scene.add(uran);
	scene.add(objectsInfo.uran.ringsMesh);
	
	//NEPTUN
	var neptun = createNeptune(objectsInfo.neptun.planetSize, segments);
	neptun.rotation.y = Math.PI / 2;
	objectsInfo.neptun.mesh = neptun;
	scene.add(neptun);
	
	//PLUTO
	var pluto = createPluto(objectsInfo.pluto.planetSize, segments);
	pluto.rotation.y = Math.PI / 2;
	objectsInfo.pluto.mesh = pluto;
	scene.add(pluto);
	
	//ORBITS
	var palnetOrbits = [];
	for(var p in objectsInfo){
		if(!objectsInfo.hasOwnProperty(p) || p == "sun")
			continue;
		
		var planet = objectsInfo[p];
			
		var circleGeometry = new THREE.CircleGeometry( planet.radius, 32 );
		var circleMaterial = new THREE.MeshBasicMaterial( { color: 0xC2C0C2 } );
		//var circle = new THREE.Mesh( circleGeometry, circleMaterial );
		circleGeometry.vertices.shift(); // Remove center vertex
		var circle = new THREE.Line( circleGeometry, circleMaterial );
		circle.position.set(0,0,0);
		circle.rotation.x = Math.PI / 2;
		circle.name = planet.name + "Orbit";
		//scene.add( circle );
	}
	
	//STARS
	var stars = createStars(1500, 64);
	scene.add(stars);

	

	webglEl.appendChild(renderer.domElement);

	render();
	
	//RENDER
	function render() {	
		
		//UPDATE POSITIONS
		for(var p in objectsInfo){
			if(!objectsInfo.hasOwnProperty(p))
				continue;
			
			//objectsInfo[p].speed = config.totalSpeed;
			
			objectsInfo[p].degree += objectsInfo[p].speed;
			objectsInfo[p].radian = (objectsInfo[p].degree / 180) * Math.PI;
			objectsInfo[p].x = objectsInfo[p].radius*Math.cos(objectsInfo[p].radian) + 0;
			objectsInfo[p].z = objectsInfo[p].radius*Math.sin(objectsInfo[p].radian) + 0;
			objectsInfo[p].mesh.position.x = objectsInfo[p].x;
			objectsInfo[p].mesh.position.y = 0;
			objectsInfo[p].mesh.position.z = objectsInfo[p].z;
			objectsInfo[p].mesh.rotation.y += objectsInfo[p].speed;
			
			if(objectsInfo[p].cloudsMesh){
				objectsInfo[p].cloudsMesh.position.x = objectsInfo[p].x;
				objectsInfo[p].cloudsMesh.position.y = 0;
				objectsInfo[p].cloudsMesh.position.z = objectsInfo[p].z;
				objectsInfo[p].cloudsMesh.rotation.y += objectsInfo[p].speed;
			}
			if(objectsInfo[p].ringsMesh){
				objectsInfo[p].ringsMesh.position.x = objectsInfo[p].x;
				objectsInfo[p].ringsMesh.position.y = 0;
				objectsInfo[p].ringsMesh.position.z = objectsInfo[p].z;
			}
			if(objectsInfo[p].satellites && objectsInfo[p].satellites.length > 0){
				objectsInfo[p].satellites.forEach(function(satellite, i ,arr){
					var R = satellite.radius;
					satellite.degree += satellite.speed;
					satellite.radian = (satellite.degree / 180) * Math.PI;
					satellite.x = R*Math.cos(satellite.radian);
					satellite.z = R*Math.sin(satellite.radian);
					satellite.mesh.position.x = satellite.x;
					satellite.mesh.position.y = 0;
					satellite.mesh.position.z = satellite.z;
					//satellite.mesh.rotation.y += satellite.speed;
				});
			}
		}
		
		////CLICK
		//if(clickInfo.userHasClicked){
		//	clickInfo.userHasClicked = false;
		//
		//	// update the picking ray with the camera and mouse position
		//	raycaster.setFromCamera( clickInfo.mouseVec2, camera );
		//
		//	// calculate objects intersecting the picking ray
		//	var intersects = raycaster.intersectObjects( scene.children );
		//	var intersectsIds = intersects.map(function(item){return item.object.id});
		//
		//	//The intersection// object holds the intersection point, the face that's // been "hit" by the ray, and the object to which that // face belongs.
		//	var first = intersects[0];
		//	var targetObg = first.object;
		//	console.log("click ray intersects ",intersects);
		//	//console.log("click ray intersection ",first,targetObg.name, targetObg.id);
        //
		//	//check if planet
		//	var found = null;
		//	for(var p in objectsInfo){
		//		if(!objectsInfo.hasOwnProperty(p))
		//			continue;
		//
		//		if(intersectsIds.indexOf(objectsInfo[p].mesh.id) !== -1){
		//			found = objectsInfo[p];
		//			break;
		//		}
		//	}
		//	if(found !== null){
		//		console.log("clicked on ", found.name);
		//
		//		//targetObg.material.color.set( 0xff0000 );
		//
		//		var controlsCamera = controls.object;
		//		//controls.autoRotate = true;
		//		//controlsCamera.position.set(0,1000,0);
		//
		//		var R = found.radius - found.planetSize - 40;
		//		controlsCamera.position.x = R*Math.cos(found.radian) + 0;
		//		controlsCamera.position.z = R*Math.sin(found.radian) + 0;
		//		controlsCamera.position.y = 0;
		//
		//		controls.target = new THREE.Vector3(targetObg.position.x,targetObg.position.y,targetObg.position.z);
		//
		//		console.log("controls ",controls);
		//		console.log("camera ",controlsCamera);
		//	}
		//}
		
		//RENDER
		controls.update();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	
	//KEYBOARD CONTROLS
	window.addEventListener('keydown', function(event){
		console.log("key pressed code=", event.keyCode);
		switch ( event.keyCode ) {
			
			//HELP
			case 27: //esc
				event.preventDefault();
				toggleHelp();
				break;
			case 27: //F1
				showHelp();
				break;
			
			case 48: //0
				moveCameraToPlanet(objectsInfo.sun);
				break;
			case 49: //1
				moveCameraToPlanet(objectsInfo.mercury);
				break;
			case 50: //2
				moveCameraToPlanet(objectsInfo.venus);
				break;
			case 51: //3
				moveCameraToPlanet(objectsInfo.earth);
				break;
			case 52: //4
				moveCameraToPlanet(objectsInfo.mars);
				break;
			case 53: //5
				moveCameraToPlanet(objectsInfo.jupiter);
				break;
			case 54: //6
				moveCameraToPlanet(objectsInfo.saturn);
				break;
			case 55: //7
				moveCameraToPlanet(objectsInfo.uran);
				break;
			case 56: //8
				moveCameraToPlanet(objectsInfo.neptun);
				break;
			case 57: //9
				moveCameraToPlanet(objectsInfo.pluto);
				break;
		}
	}, false);
	
	function showHelp(){
		document.getElementById("help").className = "";
	}
	function hideHelp(){
		document.getElementById("help").className = "hidden";
	}
	function toggleHelp(){
		var className = document.getElementById("help").className;
		if(className.split(' ').indexOf("hidden") !== -1)
			document.getElementById("help").className = "help";
		else
			document.getElementById("help").className = "hidden";
	}
	
	
	function IsNullOrEmpty(val){
		if(val === null || val === undefined || val.length === 0)
			return true;
		return false;
	}
	
	function createPlanet(options) {
		options.radius = !IsNullOrEmpty(options.radius) ? options.radius : 10;
		options.segments = !IsNullOrEmpty(options.segments) ? options.segments : 10;
		options.map = !IsNullOrEmpty(options.map) ? options.map : '';
		options.bumpMap = !IsNullOrEmpty(options.bumpMap) ? options.bumpMap : '';
		options.bumpScale = !IsNullOrEmpty(options.bumpScale) ? options.bumpScale : 0.005;
		options.specularMap = !IsNullOrEmpty(options.specularMap) ? options.specularMap : '';
		options.specular = !IsNullOrEmpty(options.specular) ? options.specular : new THREE.Color('grey');
		options.normalMap = !IsNullOrEmpty(options.normalMap) ? options.normalMap : '';
		options.needsUpdate = !IsNullOrEmpty(options.needsUpdate) ? options.needsUpdate : true;
		
		return new THREE.Mesh(
			new THREE.SphereGeometry(options.radius, options.segments, options.segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture(options.map),
				bumpMap:     THREE.ImageUtils.loadTexture(options.bumpMap),
				bumpScale:   options.bumpScale,
				specularMap: THREE.ImageUtils.loadTexture(options.specularMap),
				specular:    options.specular,
				normalMap: THREE.ImageUtils.loadTexture(options.normalMap),
				needsUpdate: options.needsUpdate
			})
		);
	}
	
	
	function createSun(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			//new THREE.MeshPhongMaterial({
			new THREE.MeshBasicMaterial({
				//map:         THREE.ImageUtils.loadTexture('images/sun/sunmap.jpg'),
				//map:         THREE.ImageUtils.loadTexture('images/sun/Surface of the sun.jpg'),
				//map:         THREE.ImageUtils.loadTexture('images/sun/euvisdoCarringtonMap.jpg'),
				//map:         THREE.ImageUtils.loadTexture('images/sun/SunTexture_2048.png'),
				map:         THREE.ImageUtils.loadTexture('images/sun/20140107-x1.2flare_0.jpg'),
			})
		);
	}
	
	function createMercury(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/mercury/map.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/mercury/bump.jpg'),
				bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/mercury/specularMap.png'),
				//specular:    new THREE.Color('grey')								
			})
		);
	}
	
	function createVenus(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/venus/map.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/venus/bump.jpg'),
				bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/mercury/specularMap.png'),
				//specular:    new THREE.Color('grey')								
			})
		);
	}

	function createEarth(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/earth/map.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/earth/bump.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/earth/specular.png'),
				specular:    new THREE.Color('grey')								
			})
		);
	}

	function createEarthClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/earth/clouds.png'),
				transparent: true
			})
		);		
	}
	
	function createMoon(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/earth/moonmap1k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/earth/moonbump1k.jpg'),
				bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/earth/specular.png'),
				//specular:    new THREE.Color('grey')								
			})
		);
	}
	
	function createMars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/mars/map.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/mars/bump.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/mars/specular.png'),
				specular:    new THREE.Color('grey'),
				normalMap: THREE.ImageUtils.loadTexture('images/mars/normal.png'),
				needsUpdate: true
			})
		);
	}
	
	function createJupiter(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				//map:         THREE.ImageUtils.loadTexture('images/jupiter/map.jpg'),
				map:         THREE.ImageUtils.loadTexture('images/jupiter/mapnew20064k.jpg'),
				//bumpMap:     THREE.ImageUtils.loadTexture('images/jupiter/bump.jpg'),
				//bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/jupiter/specularMap.png'),
				//specular:    new THREE.Color('grey')								
			})
		);
	}
	
	function createSaturn(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				//map:         THREE.ImageUtils.loadTexture('images/jupiter/map.jpg'),
				map:         THREE.ImageUtils.loadTexture('images/saturn/map.jpg'),
				//bumpMap:     THREE.ImageUtils.loadTexture('images/jupiter/bump.jpg'),
				//bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/jupiter/specularMap.png'),
				//specular:    new THREE.Color('grey')								
			})
		);
	}
	
	function createSaturnRings(radius, segments) {
		return new THREE.Mesh(
			//new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.TorusGeometry(25, 5, 2, 32, 2 * Math.PI),			
			new THREE.MeshPhongMaterial({
				//map:         THREE.ImageUtils.loadTexture('images/saturn/ringmap.jpg'),
				map:         THREE.ImageUtils.loadTexture('images/saturn/ringmap2.png'),
				transparent: true,
				opacity: 0.6
			})
		);		
	}
	
	function createUranus(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/uranus/map.jpg'),
				//bumpMap:     THREE.ImageUtils.loadTexture('images/jupiter/bump.jpg'),
				//bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/jupiter/specularMap.png'),
				//specular:    new THREE.Color('grey')								
			})
		);
	}
	
	function createUranusRings(radius, segments) {
		return new THREE.Mesh(
			//new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.TorusGeometry(25, 5, 2, 32, 2 * Math.PI),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/uranus/ringmap.jpg'),
				transparent: true
			})
		);		
	}
	
	function createNeptune(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/neptune/map.jpg'),
				//bumpMap:     THREE.ImageUtils.loadTexture('images/jupiter/bump.jpg'),
				//bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/jupiter/specularMap.png'),
				//specular:    new THREE.Color('grey')								
			})
		);
	}
	
	function createPluto(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/pluto/map2k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/pluto/bump2k.jpg'),
				bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/jupiter/specularMap.png'),
				//specular:    new THREE.Color('grey')								
			})
		);
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}


	function moveCameraToPlanet(planetInfo){
		
		var mesh = planetInfo.mesh;
		
		var controlsCamera = controls.object;
		//controls.autoRotate = true;
		//controlsCamera.position.set(0,1000,0);
		
		var R = planetInfo.radius - planetInfo.planetSize - 40;
		var radian = (planetInfo.degree / 180) * Math.PI;
		
		if(planetInfo.name.toLowerCase() == 'sun'){
			R = planetInfo.planetSize + 140;
		}
		
		controlsCamera.position.x = R*Math.cos(radian) + 0;
		controlsCamera.position.z = R*Math.sin(radian) + 0;
		controlsCamera.position.y = 0;
		
		controls.target = new THREE.Vector3(mesh.position.x,mesh.position.y,mesh.position.z);
		
		console.log("planetInfo ",planetInfo);
		console.log("controls ",controls);
		console.log("camera ",controlsCamera);
	}
}());