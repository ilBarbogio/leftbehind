import { write } from "./systems/font.js"
import { STATE } from "./systems/variables.js"

let can,ctx,dims

export function setupSfondo(d){
  dims=[...d]
  can=document.getElementById("sfondo")
  can.width=dims[0]
  can.height=dims[1]
  ctx=can.getContext("2d")

  ctx.fillStyle="#fff"
  ctx.beginPath()
  ctx.ellipse(...dims.map(el=>el*.5),...dims.map(el=>el*.5),0, 0,Math.PI*2)
  ctx.fill()

  ctx.fillStyle="#000"
  ctx.beginPath()
  ctx.rect(STATE.basePos[0]-STATE.baseDims[0]*.5,STATE.basePos[1]-16,STATE.baseDims[0],16)
  ctx.fill()

  let data=ctx.getImageData(0,0,...dims).data
  STATE.matrix=new Uint8Array(dims[0]*dims[1])
  for(let i=0;i<STATE.matrix.length;i++){
    STATE.matrix[i]=data[i*4]
  }


  ctx.fillStyle="#aaa"
  ctx.beginPath()
  ctx.ellipse(...dims.map(el=>el*.5),...dims.map(el=>el*.5),0, 0,Math.PI*2)
  ctx.fill()
}

export const getPixelAtCoords=(x,y)=>{
  x=Math.round(x)
  y=Math.round(y)
  if(x>=0 && x<dims[0] && y>=0 && y<dims[1]) return STATE.matrix[x+y*dims[0]]
  else return 0
}






let canUI,ctxUI

export function setupUI(){
  canUI=document.getElementById("ui")
  canUI.width=dims[0]
  canUI.height=dims[1]
  ctxUI=canUI.getContext("2d")

  STATE.terminal=false
}

export function updateUI(){
  ctxUI.clearRect(0,0,canUI.width,canUI.height)
  let m=40
  ctxUI.fillStyle="#0f09"

  if(STATE.terminal){
    ctxUI.fillRect(m,m,canUI.width-2*m,canUI.height-2*m)
    ctxUI.fillStyle="#fff"
    write(ctxUI,[m+10,m+10],"terminal 001...  online")
    write(ctxUI,[m+10,m+22]," - awaiting orders")
  }else{
    //oxygen
    ctxUI.fillRect(10,canUI.height-STATE.player.oxy-10,12,canUI.height-10)
  }

}

export const showTerminal=(visible)=>{
  STATE.terminal=visible
  if(visible){
    STATE.player.activate(false)
  }else{
    STATE.player.activate(true)
  }
}