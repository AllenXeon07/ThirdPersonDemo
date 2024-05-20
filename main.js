import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

class Player{

    constructor(camera, controller, scene, speed){
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;

        this.camera.setup(new THREE.Vector3(0,0,0));

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial({color: 0xFF1111})
        );
        this.scene.add(this.mesh);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    update(dt){
        var direction = new THREE.Vector3(0,0,0);
        if(this.controller.keys['forward']){
            direction.x = 1;
        }
        if(this.controller.keys['backward']){
            direction.x = -1;
        }
        if(this.controller.keys['left']){
            direction.z = -1;
        }
        if(this.controller.keys['right']){
            direction.z = 1;
        }
        
        this.mesh.position.add(direction.multiplyScalar(dt*this.speed));
        this.camera.setup(this.mesh.position);
    }

}

class PlayerController{

    constructor(){
        this.keys = {
            "forward": false,
            "backward": false,
            "left": false,
            "right": false
        }
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }
    onKeyDown(event){
        switch(event.keyCode){
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = true;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = true;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = true;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = true;
                break;
        }
    }
    onKeyUp(event){
        switch(event.keyCode){
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = false;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = false;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = false;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = false;
                break;
        }    
    }

}

class ThirdPersonCamera{
    constructor(camera, positionOffSet, targetOffSet){
        this.camera = camera;
        this.positionOffSet = positionOffSet;
        this.targetOffSet = targetOffSet;
    }
    setup(target){
        var temp = new THREE.Vector3(0,0,0);
        temp.addVectors(target, this.positionOffSet);
        this.camera.position.copy(temp);
        temp = new THREE.Vector3(0,0,0);
        temp.addVectors(target, this.targetOffSet);
        this.camera.lookAt(temp);
    }
}

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

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.target.set(0, 5, 0);
        controls.update();

        //Plane
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb } ) );
        plane.rotation.x = - Math.PI / 2;
        plane.receiveShadow = true;
        plane.castShadow = true;
        this.scene.add( plane );

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
