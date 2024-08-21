const f={
    a:[,1,,1,,4],
    b:[2,,6],
    c:[4,,,3],
    d:[2,,1,,3,],
    e:[5,,3],
    f:[5,,1,,],
    g:[1,,,6],
    h:[1,,5,,1],
    i:[,1,,,1,,,1,,],
    j:[3,,1,,2,,],
    k:[1,,3,,1,,1,],
    l:[1,,,1,,,3],
    m:[6,1,,1],
    n:[4,,2,,1],
    o:[4,,4],
    p:[6,1,,],
    q:[4,,1,2,],
    r:[2,,2,,1,,1,],
    s:[,2,,1,,2,],
    t:[3,,1,,,1,],
    u:[1,,2,,4],
    v:[1,,2,,1,,1,],
    w:[1,,7],
    x:[1,,1,,1,,1,,1],
    y:[1,,1,,1,,,1,],
    z:[2,,,1,,,2],
    "1":[2,,,1,,3],
    "3":[3,,5],
    "4":[1,,4,,,1],
    "6":[1,,,2,,2,],
    "7":[3,,,1,,,1],
    "8":[,1,,6],
    "9":[6,,,1],
    " ":[,,,,,,,,],
    "-":[,,,3,,,],
    ":":[,1,,,,,,1,],
    ".":[,,,,,,1,,]
}
f["2"]=f.z
f["5"]=f.s
f["0"]=f.o

export const write=(ctx,pos,text)=>{
    let caret=0
    for(let c of text){
        let i=0
        let crs=0
        while(i<f[c].length){
            let n=f[c][i]
            if(!n) crs++
            else for(let j=0;j<n;j++){
                let x=crs%3
                let y=Math.floor(crs/3)
                ctx.fillRect(caret*12+pos[0]+3*x,pos[1]+3*y,3,3)
                crs++
            }
            i++
        }
        caret++
    }
}