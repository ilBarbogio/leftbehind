import { ENTITIES, STATE, inputToKeys, dist } from "./systems/variables.js"
import { getPixelAtCoords } from "./canvas.js"

const applyBaseStyles=(el,pos)=>{
  el.style=`position:absolute;left:${pos[0]}px;top:${pos[1]}px;overflow:"visible";`
  document.getElementById("container").append(el)
}

export class Entity{
  set zIndex(v){this.anchor.style.zIndex=v}

  set position(v){
    this._position=[...v]
    this.anchor.style.left=`${this._position[0]}px`
    this.anchor.style.top=`${this._position[1]}px`
  }
  get position(){ return this._position}

  constructor(id,x,y){
    this.id=id
    this._position=[x,y]
    
    this.anchor=document.createElement("div")
    applyBaseStyles(this.anchor,this._position)

    ENTITIES.push(this)
  }
  

  setupSprite(sheet,tileDims,animations,current,fps,sOffset){
    this.spriteOffset=sOffset
    
    this.sprite=document.createElement("img-sprite")
    this.anchor.append(this.sprite)
    this.sprite.animations=animations
    this.sprite.fps=fps
    this.sprite.currentAnimation=current
    
    this.sprite.imgUrl=sheet
    this.sprite.tileDims=tileDims
    
    this.sprite.pos=this.spriteOffset
    this.sprite.positionSprite()
  }

}

export class Player extends Entity{
  constructor(id,x,y){
    super(id,x,y)
    
    this.velocity=50
    this.lastDir="s"
    this.setupSprite(STATE.spritesheets.r,[13,16],[
      {name:"n-idle",pos:[0,16],length:1},
      {name:"ne-idle",pos:[13,16],length:1},
      {name:"e-idle",pos:[26,16],length:1},
      {name:"se-idle",pos:[39,16],length:1},
      {name:"s-idle",pos:[52,16],length:1},
      {name:"sw-idle",pos:[39,16],length:1,flip:true},
      {name:"w-idle",pos:[26,16],length:1,flip:true},
      {name:"nw-idle",pos:[13,16],length:1,flip:true},

      {name:"n-walk",pos:[0,0],length:4},
      {name:"ne-walk",pos:[13,0],length:4},
      {name:"e-walk",pos:[26,0],length:4},
      {name:"se-walk",pos:[39,0],length:4},
      {name:"s-walk",pos:[52,0],length:4},
      {name:"sw-walk",pos:[39,0],length:4,flip:true},
      {name:"w-walk",pos:[26,0],length:4,flip:true},
      {name:"nw-walk",pos:[13,0],length:4,flip:true},
    ],"s-idle",8,[-7,-14])
  }
  

  update(delta){
    let currDir=inputToKeys.get(STATE.input)

    let name
    if(currDir==undefined){
      name=`${this.lastDir}-idle`
    }else{
      this.lastDir=currDir
      name=`${this.lastDir}-walk`
      let vel=this.velocity*delta*.001
      let [x,y]=this.position
      if(this.lastDir.includes("n") && getPixelAtCoords(x,y-2)>0) y-=vel
      else if(this.lastDir.includes("s") && getPixelAtCoords(x,y+2)>0) y+=vel
      if(this.lastDir.includes("e") && getPixelAtCoords(x+2,y)>0) x+=vel
      else if(this.lastDir.includes("w") && getPixelAtCoords(x-2,y)>0) x-=vel
      if(getPixelAtCoords(x,y-1)>0) this.position=[x,y]
    }
    
    this.sprite.currentAnimation=name
    this.sprite.update(delta)
  }
}

export class Base extends Entity{
  constructor(id,x,y){ 
    super(id,x,y)

    this.setupSprite(STATE.spritesheets.b,[32,48],[{name:"base",pos:[16,0],length:1,}],"base",1,[-16,-48])
  }
  
}

export class Door extends Entity{
  constructor(id,x,y){ 
    super(id,x,y)

    this.setupSprite(STATE.spritesheets.b,[16,16],
      [
        {name:"closed",pos:[0,0],length:1,stay:true},
        {name:"opening",pos:[0,16],length:2,segue:"open"},
        {name:"open",pos:[0,32],length:1,stay:true},
      ],
      "closed",8,[-8,-16])
  }

  update(delta){
    let player=ENTITIES.find(el=>el.id=="P")
    let name=""
    if(dist(player.position,this.position)<30){
      if(this.sprite.currentAnimation=="closed" && player.position[1]>=this.position[1]) name="opening"
    }else if(this.sprite.currentAnimation=="open") name="closed"

    if(name!="") this.sprite.currentAnimation=name
    this.sprite.update(delta)

  }
}

// export class Panel extends Entity{
//   constructor(id,x,y){ 
//     super(id,x,y)

//     this.setupSprite(STATE.spritesheets.b,[32,32],
//       [
//         {name:"default",pos:[48,0],length:1,stay:true},
//       ],
//       "default",8,[-16,-32])
//   }

// }

export class Rock extends Entity{
  constructor(id,x,y){ 
    super(id,x,y)

    this.setupSprite(STATE.spritesheets.g,[32,16],
      [
        {name:"default",pos:[0,0],length:1,stay:true},
      ],
      "default",8,[-16,-16])
  }

  // update(delta){
  //   let player=ENTITIES.find(el=>el.id=="P")
  //   let name=""
  //   if(dist(player.position,this.position)<30){
  //     if(this.sprite.currentAnimation=="closed" && player.position[1]>=this.position[1]) name="opening"
  //   }else if(this.sprite.currentAnimation=="open") name="closed"

  //   if(name!="") this.sprite.currentAnimation=name
  //   this.sprite.update(delta)

  // }
}