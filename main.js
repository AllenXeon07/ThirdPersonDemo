import * as THREE from "three";

class Player{

    constructor(camera, controller, scene){
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;

        this.camera.setup(new THREE.Vector3(0,0,0));
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
        this.camera.position.copy(this.positionOffSet.add(target));
        this.camera.target.position.copy(this.targetOffSet.add(target));
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


        //Plane
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
        plane.rotation.x = - Math.PI / 2;
        plane.receiveShadow = true;
        this.scene.add( plane );

        //Directional Light
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(5,5,0);
        directionalLight.target.position.set(0,0,0);
        this.scene.add(directionalLight);

        //ThirdPersonCamera
        var player = new Player(
            new ThirdPersonCamera(
                this.camera, new THREE.Vector3(-5,5,0), new THREE.Vector3(1,0,0)
            ),
            new PlayerController(),
            this.scene
        );
    }
    static render(dt){
        this.renderer.render(this.scene, this.camera);
    }
}

var clock = new THREE.Clock();
Main.init();
function animate(){
    Main.render(clock.getDelta());
    requestAnimationFrame(animate);
}
