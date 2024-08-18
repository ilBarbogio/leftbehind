export class SpriteElement extends HTMLElement{

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
  constructor(){
    super()
    this.cumulatedTime=0
    this.timeStep=50

    // this.row=0
    this.cursor=0
    this.animations=[]
    this._imgUrl=""

    this.attachShadow({mode:"open"})
    this.img=document.createElement("div")
    this.img.style.position="absolute"
    this.img.style.left=0
    this.img.style.top=0
    this.img.style.backgroundRepeat="no-repeat"
    this.img.style.imageRendering="pixelated"
    // this.img.style.border="1px solid blue"
    this.shadowRoot.append(this.img)
  }

  update=(delta)=>{
    this.cumulatedTime+=delta
    if(this.cumulatedTime>=this.timeStep){
      this.cumulatedTime-=this.timeStep
      this.cursor++
      if(this.cursor==this._currentAnimation.length){
        if(this._currentAnimation.stay) this.cursor=this._currentAnimation.length-1
        else if(this._currentAnimation.segue) this.currentAnimation=this._currentAnimation.segue
        else this.cursor%=this._currentAnimation.length
      }
      this.positionSprite()
    }
  }

  positionSprite=()=>{
    if(this._currentAnimation && this._tileDims){
      let x=-(this._currentAnimation.pos[0])
      let y=-(this._currentAnimation.pos[1]+this.cursor*this._tileDims[1])
      if(this._currentAnimation.flip) this.img.style.transform="scale(-1,1)"
      else this.img.style.transform="scale(1,1)"
      this.img.style.backgroundPosition=`${x}px ${y}px`
    }
  }
}