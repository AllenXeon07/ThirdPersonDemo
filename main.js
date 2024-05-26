import * as THREE from "three";
import { Player, PlayerController, ThirdPersonCamera } from "./player.js";


class Main{
    static WindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    static init(){
        var canvReference = document.getElementById("canvas");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true, canvas:canvReference});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;

        window.addEventListener('resize', () => {
            Main.WindowResize();
          }, false);

        //Plane
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb } ) );
        plane.rotation.x = - Math.PI / 2;
        plane.receiveShadow = true;
        plane.castShadow = true;
        this.scene.add( plane );

        //Ambient Light
        var ambientLight = new THREE.AmbientLight(0x8888FF,1);
        this.scene.add(ambientLight);

        //Directional Light
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set( 3, 10, 10 );
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.camera.left = - 20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 40;
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // this.scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));

        this.scene.add(directionalLight.target);

        // ThirdPersonCamera
        this.player = new Player(
            new ThirdPersonCamera(
                this.camera, new THREE.Vector3(-5,2,0), new THREE.Vector3(0,0,0)
            ),
            new PlayerController(),
            this.scene,
            10
        );

        //Object
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial({color: 0xFFFF11})
        );
        this.scene.add(this.mesh);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.set(3,0,0);

    }
    static render(dt){
        this.player.update(dt);
        this.renderer.render(this.scene, this.camera);
    }
}

var clock = new THREE.Clock();
Main.init();
function animate(){
    Main.render(clock.getDelta());
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
