import { ENTITIES, STATE, itkArr, dist } from "./systems/variables.js"
import { getPixelAtCoords,showTerminal } from "./canvas.js"

let abs=Math.abs
let flr=Math.floor
let rn=v=>Math.random()*v
let rc=(c,s)=>c+(Math.random()-0.5)*s

const applyBaseStyles=(e,p)=>{
  e.style=`position:absolute;left:${p[0]}px;top:${p[1]}px;overflow:"visible";`
  document.getElementById("container").append(e)
}

export class Entity{
  set zIndex(v){this.anchor.style.zIndex=v}

  set position(v){
    this._position=[...v]
    this.anchor.style.left=`${this._position[0]}px`
    this.anchor.style.top=`${this._position[1]}px`
  }
  get position(){ return this._position}

  set spriteTransform(v){
    if(this.sprite) this.sprite.setAttribute("transform",v)
  }

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
    this.sprite.id="sprite-"+this.id
    this.sprite.className="sprite"
    this.anchor.append(this.sprite)
    this.sprite.animations=animations
    this.sprite.fps=fps
    this.sprite.currentAnimation=current
    
    this.sprite.imgUrl=sheet
    this.sprite.tileDims=tileDims
    
    this.sprite.pos=this.spriteOffset??[-.5*tileDims[0],-tileDims[1]]
    this.sprite.positionSprite()
  }

}

export class Player extends Entity{
  constructor(id,x,y){
    super(id,x,y)
    
    this.active=true
    this.oxy=STATE.maxOxy
    this.cumulatedTime=0
    this.oxyStep=50

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
  
  activate(value){
    if(value){
      this.active=true
      this.anchor.style.opacity=1
      this.oxy=STATE.maxOxy
      this.cumulatedTime=0
    }else{
      this.active=false
      this.anchor.style.opacity=0
      this.lastDir="s"
    }
  }

  update(delta){
    if(STATE.inputs[4]){//check for "fire" button with action conditions
      let door=ENTITIES.find(el=>el.id=="D")
      if(!this.active){
        showTerminal(false)
        STATE.inputs[4]=false
        return
      }
      STATE.inputs[4]=false
      if(door && this.position[1]>door.position[1] && dist(this.position,door.position)<10) showTerminal(true)
      
    }

    if(this.active){
      //oxygen
      this.cumulatedTime+=Math.max(delta,0)
      if(this.cumulatedTime>=this.oxyStep){
        this.oxy--
        this.cumulatedTime=0
      }

      //movement
      let currDir=itkArr[STATE.input]

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
    let player=STATE.player
    let name=""
    this.playerFound=false
    if(dist(player.position,this.position)<30){
      if(this.sprite.currentAnimation=="closed" && player.position[1]>=this.position[1]){
        name="opening"
        this.playerFound
      }
    }else if(this.sprite.currentAnimation=="open") name="closed"

    if(name!="") this.sprite.currentAnimation=name
    this.sprite.update(delta)

  }
}


export class Rock extends Entity{
  constructor(id,x,y,a=0,rs=100,type=0){ 
    super(id,x,y)

    this.angle=a
    this.rotSpeed=rs

    // this.setupSprite(STATE.spritesheets.g,[16,16],[{name:"s1",pos:[0,0],length:1},],"s1",10,[-8,-16])
    // this.setupSprite(STATE.spritesheets.g,[16,16],[{name:"s2",pos:[0,16],length:1},],"s2",10,[-8,-16])
    // this.setupSprite(STATE.spritesheets.g,[24,16],[{name:"m1",pos:[16,0],length:1},],"m1",10,[-12,-16])
    // this.setupSprite(STATE.spritesheets.g,[24,16],[{name:"m2",pos:[16,16],length:1},],"m2",10,[-12,-16])
    // this.spriteTransform=`1,${this.angle}`
  }

  update(d){
    this.angle+=Math.floor(this.rotSpeed*d*.001)
    this.spriteTransform=`1,${this.angle}`
    this.sprite.update()
  }
}

export class Particle extends Entity{
  constructor(x,y,n=6,s=1,r=0){
    super("",x,y)
    this.setupSprite(STATE.spritesheets.g,[8,8],[{name:"defex",pos:[40,0],length:n,destroy:true},],"defex",10,[-4,-4])
    this.spriteTransform=`${s},${r}`
  }

  update(d){
    this.sprite.update(d)
  }
}


export class Asteroid extends Entity{
  constructor(id,x,y,h=100,v=[0,0],t=0){
    super("ast-"+id,x,y)
    
    this.v=v
    this.gravity=2

    this.h=h

    this.angle=50
    this.rotSpeed=100

    this.rck=new Rock("",0,-h)//a,rs
    if(t==0)this.rck.setupSprite(STATE.spritesheets.g,[16,16],[{name:"s1",pos:[0,0],length:1},],"s1",10,[-8,-16])
    else if(t==1)this.rck.setupSprite(STATE.spritesheets.g,[16,16],[{name:"s2",pos:[0,16],length:1},],"s2",10,[-8,-16])
    else if(t==2)this.rck.setupSprite(STATE.spritesheets.g,[24,16],[{name:"m1",pos:[16,0],length:1},],"m1",10,[-12,-16])
    else this.rck.setupSprite(STATE.spritesheets.g,[24,16],[{name:"m2",pos:[16,16],length:1},],"m2",10,[-12,-16])
    this.spriteTransform=`1,${this.angle}`
    
    if(t<=1)this.setupSprite(STATE.spritesheets.g,[16,8],[{name:"shs",pos:[0,32],length:1},],"shs",1,[-8,-4])
    else this.setupSprite(STATE.spritesheets.g,[24,8],[{name:"shm",pos:[16,32],length:1},],"shm",1,[-12,-4])
    this.sprite.alpha=.75
    this.anchor.append(this.rck.anchor)
  }

  update(d){
    let [x,y]=this.position
    if(this.h<5 && abs(this.v[1])<1.5){
      this.rck.position=[0,0]
      this.v=[0,0]
      this.rck.rotSpeed=0
      return
    }
    this.position=[x+this.v[0]*d*.001,y]

    this.v[1]+=this.gravity
    if(this.v[1]>50) this.v[1]=50
    this.h-=this.v[1]*d*.001
    if(this.h<0){
      this.h=0
      this.v[1]*=-.85
      this.v[0]*=.5
      this.rck.rotSpeed*=rc(this.v[0]<20?.25:1.75,.5)
      createBurst(...this.position,8,32,2,180)
    }
    this.rck.position=[0,-this.h]
  }
}

export let createAsteroid=(id,x,y,v,h=100)=>{
  new Asteroid(id,x,y,v,h,flr(rn(4)))

}

export let createPanel=(id,x,y,state="broken")=>{
  let panel1=new Entity(id,x,y)
  panel1.setupSprite(STATE.spritesheets.b,state=="broken"?[32,16]:[32,32],[
    {name:"broken",pos:[48,0],length:1,stay:true},
    {name:"complete",pos:[48,16],length:1,stay:true},
  ],state,1)
}

export let createBurst=(x,y,N,sp,s,r)=>{
  for(let i=0;i<N;i++){
    new Particle(rc(x,sp),rc(y,sp*.5),6,rc(1,s),rn(r))
  }
}