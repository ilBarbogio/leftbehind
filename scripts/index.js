import { setup as setupControls } from "./systems/controls.js"
import { setupSfondo } from "./canvas.js"
import { Entity, Base, Door, Player, Rock } from "./entities.js"
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
    setupPlayer()
    start()
  })}
  let extGCbk=()=>{extractImages("bwG.png","g",extBCbk)}
  extractImages(filename,"r",extGCbk)
}

let player,base,door,clock
function setupPlayer(){
  player=new Player("P",140,120)
}

function setupBase(){
  base=new Base("B",...STATE.basePos)
  door=new Door("D",STATE.basePos[0]+4,STATE.basePos[1])

  let dish=new Entity("DSH",STATE.basePos[0],STATE.basePos[1])
  dish.setupSprite(STATE.spritesheets.b,[16,16],[{name:"default",pos:[16,48],length:1,stay:true},],"default",8,[-24,-38])
    

  let panel1=new Entity("P1",120,100)
  panel1.setupSprite(STATE.spritesheets.b,[32,32],[{name:"default",pos:[48,16],length:1,stay:true},],"default",8,[-16,-32])

  let panel2=new Entity("P2",110,120)
  panel2.setupSprite(STATE.spritesheets.b,[32,16],[{name:"default",pos:[48,0],length:1,stay:true},],"default",8,[-16,-16])
    
  let rock1=new Rock("R1",150,170)
  let rock2=new Rock("R2",250,130)


}

function start(){
  clock=Date.now()
  requestAnimationFrame(loop)
}


const loop=(time)=>{
  let delta=time-clock
  clock=time

  player.update(delta)

  door.update(delta)

  ENTITIES.sort((a,b)=>a.position[1]>=b.position[1]?1:-1)
  for(let [i,e] of ENTITIES.entries()) e.zIndex=i 

  requestAnimationFrame(loop)
}

setupSfondo(STATE.backgroundSize)

setup()

// flatImageToChannel("bw.png","r")
