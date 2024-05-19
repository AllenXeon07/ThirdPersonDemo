import * as THREE from "three";

class Player{

    constructor(camera, controller){
        this.camera = camera;
        this.controller = controller;
    }

}

class PlayerController{

    constructor(){
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }
    onKeyDown(event){

    }
    onKeyUp(event){
        
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


        
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
        plane.rotation.x = - Math.PI / 2;
        plane.receiveShadow = true;
        this.scene.add( plane );
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
requestAnimationFrame(animate)