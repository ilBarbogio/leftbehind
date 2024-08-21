export class SpriteElement extends HTMLElement{
  static observedAttributes=["transform"]

  set tileDims(v){
    this._tileDims=[...v]
    if(this.img){
      this.img.style.width=`${this._tileDims[0]}px`
      this.img.style.height=`${this._tileDims[1]}px`
    }
  }
  get tileDims(){return [...this._tileDims]}

  set imgUrl(v){
    if(v!="" && this.img) this.img.style.backgroundImage=`url("${v}")`
    else this.img.style.background="none"
  }

  set fps(v){
    this.timeStep=1000/v
  }

  set currentAnimation(name){
    //{name,pos,length}
    if(name!=this._currentAnimation?.name){
      this._currentAnimation=this.animations.find(el=>el.name==name)
      if(this._currentAnimation){
        this.cursor=0
        this.cumulatedTime=0
        this.positionSprite()
      }
    }
  }
  get currentAnimation(){ return this._currentAnimation?.name}

  set pos(v){
    this.img.style.left=`${v[0]}px`
    this.img.style.top=`${v[1]}px`
  }
  get pos(){
    return [
      parseFloat(this.img.style.left),
      parseFloat(this.img.style.top)
    ]
  }
  set alpha(v){this.img.style.opacity=v}

  constructor(){
    super()
    this.cumulatedTime=0
    this.timeStep=50

    // this.row=0
    this.cursor=0
    this.animations=[]
    this._imgUrl=""
    this.scale=1
    this.angle=0

    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=`<div style="position:absolute;left:0;top:0;background-repeat:no-repeat;background-position: 0 0;image-rendering:pixelated">`
    this.img=this.shadow.querySelector("div")
  }

  attributeChangedCallback(nm,o,n){
    if(nm=="transform"){
      let spl=n.split(",")
      let f=this._currentAnimation?.flip?-1:1
      this.img.style.transform=`scale(${f*spl[0]},${spl[0]}) rotate(${spl[1]}deg)`
    }
  }

  update=(delta)=>{
    this.cumulatedTime+=delta
    if(this.id=="sprite-R1") console.log(this.id)
    if(this.cumulatedTime>=this.timeStep){
      this.cumulatedTime-=this.timeStep
      this.cursor++
      if(this.cursor==this._currentAnimation.length){
        if(this._currentAnimation.stay) this.cursor=this._currentAnimation.length-1
        else if(this._currentAnimation.segue) this.currentAnimation=this._currentAnimation.segue
        else if(this._currentAnimation.destroy){
          this.img.remove()
        }else this.cursor%=this._currentAnimation.length
      }
      this.positionSprite()
    }
  }

  positionSprite=()=>{
    if(this._currentAnimation && this._tileDims){
      let att=this.getAttribute("transform")
      let spl=att?att.split(","):[1,0]
      let a=`rotate(${spl[1]}deg)`
      let x=-(this._currentAnimation.pos[0])
      let y=-(this._currentAnimation.pos[1]+this.cursor*this._tileDims[1])
      this.img.style.backgroundPosition=`${x}px ${y}px`
    }
  }
}