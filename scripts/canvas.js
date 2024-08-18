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
}


export const getPixelAtCoords=(x,y)=>{
  x=Math.round(x)
  y=Math.round(y)
  if(x>=0 && x<dims[0] && y>=0 && y<dims[1]) return STATE.matrix[x+y*dims[0]]
  else return 0
}
