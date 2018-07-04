<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Three框架</title>
        <script src="/js/three.min.js"></script>
        <script src="/js/pylon.js"></script>
        <style type="text/css">
            div#canvas-frame {
                border: none;
                cursor: pointer;
                width: 100%;
                height: 600px;
                background-color: #EEEEEE;
            }

        </style>
        <script>
			var t = 0;//旋转参数
            var renderer;
            var vertices = [];
            var faces = [];
            var mesh;
            function initThree() {
                width = document.getElementById('canvas-frame').clientWidth;
                height = document.getElementById('canvas-frame').clientHeight;
                renderer = new THREE.WebGLRenderer({
                    antialias : true
                });
                renderer.setSize(width, height);
                document.getElementById('canvas-frame').appendChild(renderer.domElement);
                renderer.setClearColor(0xFFFFFF, 1.0);
            }

            var camera;
            function initCamera() {
                camera = new THREE.PerspectiveCamera(70, width / height, 1, 10000);
				//camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 1000  )
                camera.position.x = 0;
                camera.position.y = 200;
                camera.position.z = 200;
                camera.up.x = 0;
                camera.up.y = 1;
                camera.up.z = 0;
                camera.lookAt(0,0,0);
            }

            var scene;
            function initScene() {
                scene = new THREE.Scene();
            }

            var light;
            function initLight() {
               /* light = new THREE.AmbientLight(0xBEBEBE);
                light.position.set(100, 100, 200);
                scene.add(light);*/

				 light = new THREE.DirectionalLight(0xFF0000,1);
                // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
                light.position.set(1,0,0);
                scene.add(light);

                /*light = new THREE.PointLight(0x00FF00);
                light.position.set(300, 0,0);
                scene.add(light);*/
            }

            var cube;
            function initObject() {
				var l1 = 100;
				var l2 = 80;
				var l3 = 80;
				var h =80;
				var radian = 2.3*Math.PI/5;

                //立方体
                var cubeGeometry = new THREE.Geometry();
                //创建立方体的顶点
                var ph = pylon(h,l1,l2,l3,1,radian);
                cubeGeometry.vertices = ph[0];
                cubeGeometry.faces = ph[1];

				//横隔
                var plan = new THREE.PlaneGeometry();
                var ta = tabula1(ph[2],1);

                plan.vertices = ta[0];
                plan.faces = ta[1];
				
				var cubeGeometry1 = new THREE.Geometry();
				var body1 = pylon_body(l1,ph[2],h,40,2,radian,1);
			
				cubeGeometry1.vertices = body1[0];
				cubeGeometry1.faces = body1[1];
				
				h1 = h+40;
				var cubeGeometry2 = new THREE.Geometry();
				var body2 = pylon_body(l1,body1[2],h1,30,3,radian,2);
				cubeGeometry2.vertices = body2[0];
				cubeGeometry2.faces = body2[1];
				//头部
				var cubeGeometry3 = new THREE.Geometry();
				var head1 = pylon_head(body2[2],body1[2],h1,30,40,4,radian,2,1,'x');
				cubeGeometry3.vertices = head1[0];
				cubeGeometry3.faces = head1[1];
				
				h2 = h1 + 30;
				var cubeGeometry4 = new THREE.Geometry();
				var body3 = pylon_body(l1,body2[2],h2,30,1,radian,2);
				cubeGeometry4.vertices = body3[0];
				cubeGeometry4.faces = body3[1];
				
				//头部配件
				var cubeGeometry5 = new THREE.Geometry();
				var head2 = pylon_head_other(head1[2],10,20,3,'x');
				cubeGeometry5.vertices = head2[0];
				cubeGeometry5.faces = head2[1];
				
                


                var material = new THREE.MeshBasicMaterial({color:0x00ae00,wireframe : true});
                mesh = new THREE.Mesh( cubeGeometry,material );
				
                //mesh.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI);
                mesh1 = new THREE.Mesh( plan,material );
                //mesh1.position.set(100,0,0);
				mesh2 = new THREE.Mesh(cubeGeometry1,material);
				
				mesh3 = new THREE.Mesh(cubeGeometry2,material);
				
				head1 = new THREE.Mesh(cubeGeometry3,material);
				mesh4 = new THREE.Mesh(cubeGeometry4,material);
				head2 = new THREE.Mesh(cubeGeometry5,material);
				

                //mesh.position.set(100,0,0);
                //mesh.rotateY(Math.PI);

                /*mesh.position.set(-100,0,0);
                dummy = new THREE.Object3D();
                dummy.add(mesh);
                dummy.position.set(0,0,0);
                //dummy.rotation.y=Math.PI;
                dummy.rotateOnAxis(new THREE.Vector3(0,1,0),Math.PI)*/
				
				// scene.add( mesh );
                // scene.add( mesh1);
				// scene.add( mesh2 );
				// scene.add( mesh3 );
				// scene.add(head1);
				scene.add(head2);
				//scene.add(mesh4);

            }


            function threeStart() {
                initThree();
                initCamera();
                initScene();
                initLight();
                initObject();
				animation();
            }
	
	
			function animation(){
				//renderer.clear();
				//camera.position.y =camera.position.y +1;
                //mesh.rotation.y +=0.01;
				//cameraRotate();
			
                renderer.render(scene, camera);
                requestAnimationFrame(animation);
			}

			function x(){
				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
                geometry.vertices.push( new THREE.Vector3( 1000, 0, 0 ) );
				var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
                scene.add( line );
			}
			function y(){
				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
                geometry.vertices.push( new THREE.Vector3( 0, 1000, 0 ) );
				var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x00ae00, opacity: 0.2 } ) );
                scene.add( line );
			}
			function z(){
				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
                geometry.vertices.push( new THREE.Vector3( 0, 0, 1000 ) );
				var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
                scene.add( line );
			}

            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
            }

			function cameraRotate(){
				//摄像头旋转
				camera.position.z = 300*Math.sin(t);
				camera.position.x = 300*Math.cos(t);
				camera.position.y = 200;
				camera.lookAt(0,0,0);
				t = t+0.01;
			}

        </script>
    </head>

    <body onload="threeStart();">
        <div id="canvas-frame"></div>
    </body>
</html>