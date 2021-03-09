let clientX=-100,clientY=-100;const innerCursor=document.querySelector(".cursor--small");document.addEventListener("mousemove",(o=>{clientX=o.clientX,clientY=o.clientY}));const render=()=>{TweenMax.set(innerCursor,{x:clientX,y:clientY}),requestAnimationFrame(render)};requestAnimationFrame(render);let group,stuckX,stuckY,fillOuterCursor,lastX=0,lastY=0,isStuck=!1,showCursor=!1;const canvas=document.querySelector(".cursor--canvas"),shapeBounds={width:75,height:75};paper.setup(canvas);const strokeColor=darkerBlue,fillColor=normalBlue,strokeWidth=.5,segments=8,radius=15,noiseScale=150,noiseRange=4;let isNoisy=!1;const polygon=new paper.Path.RegularPolygon(new paper.Point(0,0),8,15);polygon.scale(1),polygon.fillColor=fillColor,polygon.fillColor.alpha=1,polygon.strokeColor=strokeColor,polygon.strokeWidth=.5,polygon.smooth(),group=new paper.Group([polygon]),group.applyMatrix=!1;const noiseObjects=polygon.segments.map((()=>new SimplexNoise));let bigCoordinates=[];const lerp=(o,e,t)=>(1-t)*o+t*e,map=(o,e,t,n,s)=>(o-e)*(s-n)/(t-e)+n;paper.view.onFrame=o=>{lastX=lerp(lastX,clientX,.9),lastY=lerp(lastY,clientY,.9),group.position=new paper.Point(lastX,lastY)};const handleMouseEnter=o=>{const e=o.currentTarget.getBoundingClientRect();stuckX=Math.round(e.left+e.width/2),stuckY=Math.round(e.top+e.height/2),isStuck=!0,gsap.to(polygon.fillColor,.5,{alpha:0}),console.log(polygon.strokeColor.alpha)},handleMouseLeave=()=>{isStuck=!1,gsap.to(polygon.fillColor,.5,{alpha:1})},linkItems=document.querySelectorAll(".link");linkItems.forEach((o=>{o.addEventListener("mouseenter",handleMouseEnter),o.addEventListener("mouseleave",handleMouseLeave)})),paper.view.onFrame=o=>{isStuck?isStuck&&(lastX=lerp(lastX,stuckX,.15),lastY=lerp(lastY,stuckY,.15),group.position=new paper.Point(lastX,lastY),polygon.scale(1)):(lastX=lerp(lastX,clientX,.2),lastY=lerp(lastY,clientY,.2),group.position=new paper.Point(lastX,lastY),polygon.scale(1)),isStuck&&polygon.bounds.width<shapeBounds.width?polygon.scale(1.07):!isStuck&&polygon.bounds.width>30&&isNoisy&&(polygon.segments.forEach(((o,e)=>{o.point.set(bigCoordinates[e][0],bigCoordinates[e][1])})),isNoisy=!1,bigCoordinates=[]),isNoisy=!0,0===bigCoordinates.length&&polygon.segments.forEach(((o,e)=>{bigCoordinates[e]=[o.point.x,o.point.y]})),polygon.segments.forEach(((e,t)=>{const n=noiseObjects[t].noise2D(o.count/150,0),s=noiseObjects[t].noise2D(o.count/150,1),l=map(n,-1,1,-4,4),r=map(s,-1,1,-4,4),i=bigCoordinates[t][0]+l,a=bigCoordinates[t][1]+r;e.point.set(i,a)})),polygon.smooth()};