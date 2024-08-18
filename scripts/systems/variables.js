export let inputToValues=new Map()
inputToValues.set("n",8)
inputToValues.set("ne",12)
inputToValues.set("e",4)
inputToValues.set("se",6)
inputToValues.set("s",2)
inputToValues.set("sw",3)
inputToValues.set("w",1)
inputToValues.set("nw",9)
export let inputToKeys=new Map()
inputToKeys.set(8,"n")
inputToKeys.set(12,"ne")
inputToKeys.set(4,"e")
inputToKeys.set(6,"se")
inputToKeys.set(2,"s")
inputToKeys.set(3,"sw")
inputToKeys.set(1,"w")
inputToKeys.set(9,"nw")

export const STATE={
  player:"",
  inputs:[false,false,false,false],
  input:0,
  clock:0,
  gravity:.005,

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


export function handleInput(direction,value){
  STATE.input=0
  switch(direction){
    case "n":
      STATE.inputs[0]=value
      break
    case "e":
      STATE.inputs[1]=value
      break
    case "s":
      STATE.inputs[2]=value
      break
    case "w":
      STATE.inputs[3]=value
      break
    default: break
  }
  let v=0
  if(STATE.inputs[0]) v+=inputToValues.get("n")
  if(STATE.inputs[1]) v+=inputToValues.get("e")
  if(STATE.inputs[2]) v+=inputToValues.get("s")
  if(STATE.inputs[3]) v+=inputToValues.get("w")
  STATE.input=v
}


//utils
export const dist=(A,B)=>{
  return Math.hypot(A[0]-B[0],A[1]-B[1])
}


//images
const extraColors={
  r:{
    c250:[255,255,0],
    c255:[48,255,120],
  },
  g:{

  },
  b:{
    c250:[0,255,255],
    c251:[255,30,0],
    c254:[255,255,0],
    c255:[53,255,255]
  }
}

export function extractImages(filename,channel,callback){
  let can=document.createElement("canvas")
  let ctx=can.getContext("2d")

  let img=new Image()
  img.addEventListener("load",(ev)=>{
    can.width=img.width
    can.height=img.height
    ctx.drawImage(img,0,0)
    
    let dims=[img.width,img.height]
    let imgData=ctx.getImageData(0,0,...dims)
    let data=imgData.data
    
    for(let i=0;i<data.length;i+=4){
      if(channel=="r"){
        if(data[i]!=0){
          if(extraColors[channel].hasOwnProperty(`c${data[i]}`)){
            let col=extraColors[channel][`c${data[i]}`]
            data[i]=col[0]
            data[i+1]=col[1]
            data[i+2]=col[2]
          }else{
            data[i+1]=data[i]
            data[i+2]=data[i]
          }
        }else data[i+3]=0
      }else if(channel=="g"){
        if(data[i+1]!=0){
          if(extraColors[channel].hasOwnProperty(`c${data[i+1]}`)){
            let col=extraColors[channel][`c${data[i+1]}`]
            data[i]=col[0]
            data[i+1]=col[1]
            data[i+2]=col[2]
          }else{
            data[i]=data[i+1]
            data[i+2]=data[i+1]
          }
        }else data[i+3]=0
      }else if(channel=="b"){
        if(data[i+2]!=0){
          // console.log(extraColors[channel].hasOwnProperty(`c${data[i+2]}`),data[i+2],extraColors[channel][`c${data[i+2]}`])
          if(extraColors[channel].hasOwnProperty(`c${data[i+2]}`)){
            let col=extraColors[channel][`c${data[i+2]}`]
            data[i]=col[0]
            data[i+1]=col[1]
            data[i+2]=col[2]
          }else{
            data[i]=data[i+2]
            data[i+1]=data[i+2]
          }
        }else data[i+3]=0
      }
    }
    ctx.putImageData(imgData,0,0)
    can.toBlob((blob)=>{
      STATE.spritesheets[channel]=URL.createObjectURL(blob)
      callback()
    })
  })
  img.src=`./assets/${filename}`
}