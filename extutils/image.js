import { STATE } from "../scripts/systems/variables.js"

export function flatImageToChannel(filename,channel,download=false){
  let can=document.createElement("canvas")
  document.body.append(can)
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
        data[i+1]=0
        data[i+2]=0
      }else if(channel=="g"){
        data[i]=0
        data[i+2]=0
      }else if(channel=="b"){
        data[i]=0
        data[i+1]=0
      }
    }
    if(download){
      ctx.putImageData(imgData,0,0)
      can.toBlob((blob)=>{
        let url=URL.createObjectURL(blob)
        if(confirm("Scaricare file?")){
          let link=document.createElement("a")
          link.setAttribute("donload",true)
          link.href=url
          link.target="_blank"
          link.click()
        }
      })
    }else return imgData
  })
  img.src=`./assets/${filename}`
}