import { handleInput } from "./variables.js"

export function setup(){
  window.addEventListener("keydown",(ev)=>{
    switch(ev.key){
      case "w":
        handleInput("n",true)
        break
      case "d":
        handleInput("e",true)
        break
      case "s":
        handleInput("s",true)
        break
      case "a":
        handleInput("w",true)
        break
      default: break
    }
  })
  window.addEventListener("keyup",(ev)=>{
    switch(ev.key){
      case "w":
        handleInput("n",false)
        break
      case "d":
        handleInput("e",false)
        break
      case "s":
        handleInput("s",false)
        break
      case "a":
        handleInput("w",false)
        break
      default: break
    }
  })
}