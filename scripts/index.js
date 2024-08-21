import { setup as setupControls } from "./systems/controls.js"
import { setupSfondo, setupUI, updateUI } from "./canvas.js"
import { Entity, Base, Door, Player, Rock, Particle, createPanel, createAsteroid } from "./entities.js"
import { ENTITIES, STATE } from "./systems/variables.js"
import { flatImageToChannel } from "../extutils/image.js"
import { extractImages } from "./systems/variables.js"


function setup(){
  let filename="bwR.png"
  document.addEventListener("onbeforeunload",()=>{
    if(STATE.spritesheets.red) URL.revokeObjectURL(STATE.spritesheets.red)
    if(STATE.spritesheets.green) URL.revokeObjectURL(STATE.spritesheets.green)
    if(STATE.spritesheets.blue) URL.revokeObjectURL(STATE.spritesheets.blue)
  })

  let extBCbk=()=>{extractImages("bwB.png","b",()=>{
  // let extBCbk=()=>{extractImages(filename,"b",()=>{
    setupControls()
    setupBase()
    setupAsteroids()
    setupPlayer()
    setupUI()
    start()
  })}
  let extGCbk=()=>{extractImages("bwG.png","g",extBCbk)}
  extractImages(filename,"r",extGCbk)
}


let base,door,clock,expl
function setupPlayer(){
  STATE.player=new Player("P",140,120)


  // setInterval(()=>{
  //   let x=295
  //   let y=205
  //   let s=20
  //   let pos=[x+Math.random()*s,y+Math.random()*s]
  //   let expl=new Particle(...pos,Math.floor(Math.random()*4+4),Math.random()+.75)
  // },200)
}



function setupBase(){
  base=new Base("B",...STATE.basePos)
  door=new Door("D",STATE.basePos[0]+4,STATE.basePos[1])

  let dish=new Entity("DSH",...STATE.basePos)
  dish.setupSprite(STATE.spritesheets.b,[16,16],[{name:"default",pos:[16,48],length:1,stay:true},],"default",8,[-24,-38])



  createPanel("P1",100,130)
  createPanel("P2",70,90,"complete")
    
}

function setupAsteroids(){
  let n=5
  let sign=1
  let interval=setInterval(()=>{
    sign=Math.random()>.25?-sign:sign
    let x=sign==1?40:400-40
    let y=75+Math.random()*75
    let v=80+Math.random()*30
    let h=90+Math.random()*20
    
    createAsteroid("A"+n,x,y,h,[sign*v,0])
    n--
    if(n<0) clearInterval(interval)
  },1000)
}

function start(){
  clock=Date.now()
  requestAnimationFrame(loop)
}


const loop=(time)=>{
  let delta=Math.max(time-clock,0)
  clock=time

  updateUI()

  ENTITIES.sort((a,b)=>a.position[1]>=b.position[1]?1:-1)
  for(let [i,e] of ENTITIES.entries()){
    if(e.update) e.update(delta)
    e.zIndex=i+10
  }


  requestAnimationFrame(loop)
}


setupSfondo(STATE.backgroundSize)

setup()
