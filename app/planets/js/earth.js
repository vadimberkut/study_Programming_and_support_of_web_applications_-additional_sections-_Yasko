// Created by Bjorn Sandvik - thematicmapping.org
(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 0.5,
		segments = 32,
		rotation = 6;  

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
	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);
	
	var pointLight = new THREE.PointLight(16777215, 1);
	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 0;
	scene.add(pointLight);
	var camLight = new THREE.PointLight(16777215, 0.3);
	camLight.position = camera.position;
	scene.add(camLight);
	
	var objectsInfo = {
		sun: {
			name: 'Sun',
			x: 0,
			y: 0,
			z: 0,
			radius: 0,
			speed: 0.01,
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
			speed: 0.8,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 4,
			mesh: null
		},
		venus: {
			name: "Wenus",
			x: 0,
			y: 0,
			z: 0,
			radius: 100,
			speed: 0.3,
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
			speed: 0.2,
			degree: Math.random() * 1000,
			radian: 0,
			planetSize: 8,
			mesh: null,
			cloudsMesh: null
		},
		mars: {
			 name: "Mars",
			x: 0,
			y: 0,
			z: 0,
			radius: 180,
			speed: 0.1,
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
			speed: 0.06,
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
			speed: 0.03,
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
			speed: 0.05,
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
			speed: 0.03,
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
			speed: 0.03, //?
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
	scene.add(sun);
	
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
	scene.add(saturn);
	
	//URAN
	var uran = createUranus(objectsInfo.uran.planetSize, segments);
	uran.rotation.y = Math.PI / 2;
	objectsInfo.uran.mesh = uran;
	objectsInfo.uran.ringsMesh = createUranusRings();
	scene.add(uran);
	
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
	
	//STARS
	var stars = createStars(1500, 64);
	scene.add(stars);

	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	render();
	
	//RENDER
	function render() {	
		
		//UPDATE POSITIONS
		for(var p in objectsInfo){
			if(!objectsInfo.hasOwnProperty(p))
				continue;
			
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
				objectsInfo[p].ringsMesh.rotation.y += objectsInfo[p].speed;
			}
		}
		
		//RENDER
		controls.update();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
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
			new THREE.MeshPhongMaterial({
				//map:         THREE.ImageUtils.loadTexture('images/sun/sunmap.jpg'),
				//map:         THREE.ImageUtils.loadTexture('images/sun/Surface of the sun.jpg'),
				//map:         THREE.ImageUtils.loadTexture('images/sun/euvisdoCarringtonMap.jpg'),
				//map:         THREE.ImageUtils.loadTexture('images/sun/SunTexture_2048.png'),
				map:         THREE.ImageUtils.loadTexture('images/sun/20140107-x1.2flare_0.jpg'),
				//bumpMap:     THREE.ImageUtils.loadTexture('images/earth/elev_bump_4k.jpg'),
				//bumpScale:   0.005,
				//specularMap: THREE.ImageUtils.loadTexture('images/mars/mars_spec1.png'),
				//specular:    new THREE.Color('grey'),
				//normalMap: THREE.ImageUtils.loadTexture('images/mars/mars_normal1.png'),
				//needsUpdate: true
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
				//map:         THREE.ImageUtils.loadTexture('images/saturn/map.jpg'),
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

}());