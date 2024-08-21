export let itkArr=[,"w","s","sw","e",,"se",,"n","nw",,,"ne"]

export const STATE={
  player:"",
  inputs:[false,false,false,false,false],
  input:0,
  
  clock:0,
  gravity:5,

  terminal:false,
  player:undefined,
  maxOxy:150,

  backgroundSize:[400,200],
  basePos:[200,100],
  baseDims:[32,48],

  matrix:undefined,

  spritesheets:{
    r:undefined,
    g:undefined,
    b:undefined
  },
}

export const ENTITIES=[]


export function handleInput(){
  STATE.input=0
  for(let [i,n] of [8,4,2,1].entries()) if(STATE.inputs[i]) STATE.input+=n
}


//utils
export const dist=(A,B)=>Math.hypot(A[0]-B[0],A[1]-B[1])


//images
const exCls={
  r:{
    c250:[255,255,0],
    c255:[48,255,120],
  },
  g:{
    c253:[255,0,255]
  },
  b:{
    c250:[0,255,255],
    c251:[255,30,0],
    c254:[255,255,0],
    c255:[53,255,255]
  }
}

export function extractImages(fn,ch,clbk){
  let can=document.createElement("canvas")
  let ctx=can.getContext("2d")

  let img=new Image()
  img.addEventListener("load",(ev)=>{
    can.width=img.width
    can.height=img.height
    ctx.drawImage(img,0,0)
    
    let dims=[img.width,img.height]
    let imgData=ctx.getImageData(0,0,...dims)
    let d=imgData.data
    
    for(let i=0;i<d.length;i+=4){
      if(ch=="r"){
        if(d[i]!=0){
          if(exCls[ch][`c${d[i]}`]){
            let col=exCls[ch][`c${d[i]}`]
            d[i]=col[0]
            d[i+1]=col[1]
            d[i+2]=col[2]
          }else{
            d[i+1]=d[i]
            d[i+2]=d[i]
          }
        }else d[i+3]=0
      }else if(ch=="g"){
        if(d[i+1]!=0){
          if(exCls[ch][`c${d[i+1]}`]){
            let col=exCls[ch][`c${d[i+1]}`]
            d[i]=col[0]
            d[i+1]=col[1]
            d[i+2]=col[2]
          }else{
            d[i]=d[i+1]
            d[i+2]=d[i+1]
          }
        }else d[i+3]=0
      }else if(ch=="b"){
        if(d[i+2]!=0){
          if(exCls[ch][`c${d[i+2]}`]){
            let col=exCls[ch][`c${d[i+2]}`]
            d[i]=col[0]
            d[i+1]=col[1]
            d[i+2]=col[2]
          }else{
            d[i]=d[i+2]
            d[i+1]=d[i+2]
          }
        }else d[i+3]=0
      }
    }
    ctx.putImageData(imgData,0,0)
    can.toBlob((blob)=>{
      STATE.spritesheets[ch]=URL.createObjectURL(blob)
      clbk()
    })
  })
  img.src=`./assets/${fn}`
}