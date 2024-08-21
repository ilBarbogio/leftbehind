import { STATE, ENTITIES, handleInput } from "./variables.js"

export function setup(){
  window.addEventListener("keydown",(ev)=>{
    doLink(ev.key,true)
    handleInput()
  })
  window.addEventListener("keyup",(ev)=>{
    if(ev.key=="k") STATE.inputs[4]=!STATE.inputs[4]
    else doLink(ev.key,false)
    handleInput()
  })
}

let links=["w","d","s","a"]
let doLink=(k,v)=>{
  let i=links.findIndex(el=>el==k)
  if(i>=0) STATE.inputs[i]=v
}