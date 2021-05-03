import * as THREE from 'three'

const VarConst = {
   loaderContainer: document.querySelector('.loader--container'),
   progressLoaderValue: document.querySelector('.loadValue'),
   maskContainer: document.querySelectorAll('.mask-container span'),
   loadingText_1: document.querySelector('.loading-text_1'),
   loadingText_2: document.querySelector('.loading-text_2'),
   loadingText_3: document.querySelector('.loading-text_3'),
   loadingText_4: document.querySelector('.loading-text_4'),
   
   heroContentTitle: document.querySelector('.hero--content h1'),
   heroContentSubtitle: document.querySelector('.hero--content h2'),
   scrollIndication: document.querySelector('.scrollIndication--container'),
   scrollIndication_1: document.querySelectorAll('.scrollIndication--container .span--container_1 span'),
   scrollIndication_2: document.querySelectorAll('.scrollIndication--container .span--container_2 span'),
   
   backgroundContainer: document.querySelector('.background--container'),
   hudContainer: document.querySelector('.hud--container'),
   hudContainerTop: document.querySelector('.hud--container .hud--nav__top'),
   hudContainerBottom: document.querySelector('.hud--container .hud--nav__bottom'),
   contactContainer: document.querySelector('.contact--container'),
   projectCanvasContainer: document.querySelector('.projectCanvas--container'),
   projectCanvasContentContainer: document.querySelector('.projectCanvas--container .content--container'),
   scrollContainer: document.querySelector('.scroll--container'),
   heroContainer: document.querySelector('.hero--container'),
   aboutContainer: document.querySelector('.about--container'),
   projectsContainer: document.querySelector('.projects--container'),
   endContainer: document.querySelector('.end--container'),
   
   canvasContainer: document.querySelector('.canvas--container'),
   mainCanvas: document.querySelector('.webgl'),
   projectCanvas: document.querySelector('.canvasProject'),
   
   navAbout: document.querySelector('.about'),
   navProjects: document.querySelector('.projects'),
   navNameSpan: document.querySelectorAll('.spanName--container span'),
   navPseudoSpan: document.querySelectorAll('.spanPseudo--container span'),
   soundButton: document.querySelector('.hud--sound--btn'),
   
   titleCat: document.querySelectorAll('.title--cat'),
   outerLinkItems: document.querySelectorAll(".outer--link"),
   innerLinkItems: document.querySelectorAll(".inner--link"),
   noLinkItems: document.querySelectorAll(".no--link"),
   buttonContact: document.querySelector(".btn--contact"),
   crossCloseContact: document.querySelector(".close__contact"),
   crossCloseProject: document.querySelector(".close__project"),
   crossClose: document.querySelectorAll(".close"),
   transitionContainerProject: document.querySelector(".projectCanvas--container .transition--container"),
   transitionContainerContact: document.querySelector(".contact--container .transition--container"),
   contentContactContainer: document.querySelector('.contact--container .content--container'),
   endContainerContent: document.querySelectorAll('.end--container span'),
   
   images: document.querySelectorAll('.hoverPlane'),
   lines: document.querySelectorAll('.projects .line'),
   projectTitle: document.querySelector(".projectCanvas--container .title--container h3"),
   projectText: document.querySelector(".projectCanvas--container .text--container p"),
   projectIndicatorContainer: document.querySelector(".project__indicator--container"),
   btnViewProject: document.querySelector(".project__view"),
   btnVisitProject: document.querySelector(".project__visit"),
   projectIndicator: document.querySelectorAll(".project__indicator"),
   
   icon: {
      html: document.querySelector("#icon__html"),
      sass: document.querySelector("#icon__sass"),
      js: document.querySelector("#icon__js"),
      gsap: document.querySelector("#icon__gsap"),
      threejs: document.querySelector("#icon__threejs"),
      glsl: document.querySelector("#icon__glsl"),
      php: document.querySelector("#icon__php"),
      sql: document.querySelector("#icon__sql"),
      ae: document.querySelector("#icon__ae"),
      ai: document.querySelector("#icon__ai"),
      lr: document.querySelector("#icon__lr"),
      pp: document.querySelector("#icon__pp"),
      xd: document.querySelector("#icon__xd"),
      processing: document.querySelector("#icon__processing"),
      java: document.querySelector("#icon__java"),
      unity: document.querySelector("#icon__unity"),
      csharp: document.querySelector("#icon__csharp"),
      
      awwward: document.querySelector(".honorable_mention"),
      github: document.querySelector(".github")
   },
   
   githubLink: {
      id: 'https://github.com/Dakumisu/Site-ID',
      retrowave: 'https://github.com/Dakumisu/RetroWave-Website'
   },
   
   cursor: document.querySelectorAll('.cursor'),
   cursorCanvas: document.querySelector(".cursor--canvas"),
   innerCursor: document.querySelector(".cursor--small"),
   mouse: new THREE.Vector2(),
   planePosition: new THREE.Vector2(),
   
   navName: document.querySelector('.nav--name'),
   
   
   lightBlue: "#E9EFEF",
   normalBlue: "#48717F",
   darkBlue: "#29363C",
   darkerBlue: "#171f22",
   
   THREElightBlue: new THREE.Color("#E9EFEF"),
   THREEnormalBlue: new THREE.Color("#48717F"),
   THREEdarkBlue: new THREE.Color("#29363C"),
   THREEdarkerBlue: new THREE.Color("#171f22"),

   // --------------------------------------- Projects content ---------------------------------------
   projectContent: {
      id2021: {
          title: 'Immersions Digitales 2021',
          text: `Website created for the 2021 technical university open days at Tarbes (France) entitled "Immersions Digitales". This project taught me a lot of knowledge and made me step-up very quickly. I’m really proud of it and gave me the confidence and motivation that I needed.`
      },
      folio2020: {
          title: 'Portfolio 2020',
          text: `First real portfolio made in 3 weeks on my first year of university. It was my first time using Javascript and libraries for a project. I took fun to do it even if I'm not proud of it.`
      },
      foliocms: {
          title: 'CMS Portfolio',
          text: `First website using SQL for a project in university. This one taught some stuff about back-end development but it mostly made me realize that I like front-end development more than back-end.`
      },
      morpion: {
          title: 'E-Morpion',
          text: `Tic-tac-toe in English, little game made for a project in PHP. Have fun :)`
      },
      gamovore: {
          title: 'Gamovore',
          text: `Website regrouping some games sorted by genre. It’s my first project using PHP and taught me a lot of stuff like the syntax and the logical of this language.`
      },
      retrowave: {
          title: 'Retrowave\'s Trending',
          text: `This site has been created as part of a university project. After making the design, the site was developed in HTML, CSS, and JavaScript. My teammate and I tried to create as many CSS animations as possible.`
      },
      particles_follow: {
          title: 'Particles Followers',
          text: `First java project using the software 'Processing' which we can manipulate particles with the mouse and some keybinds who transform the intensity, the power or the speed of those. Try to be creative !`
      },
      fod: {
          title: 'Fear Of Daemon',
          text: `End of semester group project. It's a little 2D pixel indie game made on the software 'Unity' in C#.<br> Travel between two worlds, discover the different rooms of the manor and fight the evil appearances ! You'll need to find the source of the problems in order to end them and be able to free the manor from the dark forces hovering over it.`
      },
  
      jamcloud: {
          title: 'Jam Cloud',
          text: `First web design made for a fictional website to play instruments online with random people called “Jam Cloud”. As you can see, I often use minimal and simple design to get an uncluttered render.`
      },
      terredebois: {
          title: 'Terre de Bois',
          text: `Graphical charter made for a cooperative of eco-builders called “Terre de Bois” (seems logical). I made a very minimalist design because it’s just my favorite trend. I like minimalist stuff in general. Minimalism is cool.`
      },
      charamushroom: {
          title: 'Chara-Mushroom',
          text: `Take a mushroom from Mario’s world and any character you want and mix them… You’ll get a beautiful chara-mushroom ! This project was an exercise on my first year in my university, I took a lot of fun doing this and it also taught me how to use Adobe Illustrator.`
      },
  
      depression_achro: {
          title: 'Achromatic Depression',
          text: `Short film about someone who take medicine to reduce her depression (feel the joy). However, this one have several side effects like achromatopsia and a loss of emotions per example. This short film was inspired by the book “The Giver” and has been produced in one day and edited in one evening. Good session :)`
      },
      mmitv: {
          title: 'MMI TV',
          text: `First motion design made in 4 days, for an outdated newspaper for a work in my university. This project taught me a lot about motion design and Adobe After Effects compositing.`
      },
      inside: {
          title: 'Inside',
          text: `Background video made for an immersion for a university project of a VR game. For this, I used the plugin Universe from Red Giant.`
      },
  
      numeric: {
          title: 'Numeric photography',
          text: `Packaging photography with a watch and an environment in connection with the model’s color. It’s my first photography on a macro model and I’m pretty proud of the render. I like to take photographs, it’s a hobby that I’ll always enjoy I think, mostly because I’m a bit nostalgic and I like to immortalize random moments of my life.`
      },
      argentic: {
          title: 'Argentic photography',
          text: `Honestly I prefer take argentic photographs because I have a retro side, I generally prefer retro stuff that’s why I take a lot of photographs like this. I love the physical side of these and the way that they're unique. Also, I prefer to take pictures with models than landscapes.`
      }
   },

   lerp: (a, b, n) => {
      return (1 - n) * a + n * b
   },
   map: (value, in_min, in_max, out_min, out_max) => {
      return (
         ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
      )
   },
   deg: (a) => a * Math.PI / 180
}

let VarLet = {
   link: "",
   
   onMouseDown: false,
   isIcebergRotating: false,
   isContactActive: false,
   enterProject: false,
   currentProject: null,
   musicPlayed: false,
   musicMuted: true,
   navScrollActive: false,
   isOnMobile: false,
   isIcebergOnEnd: false,
   showScrollIndication: true,
   
   mouseX: 0,
   mouseY: 0,
   posX: 0,
   posY: 0,
   posXNormalize: 0,
   posYNormalize: 0,
   planeX: 0,
   planeY: 0,
   
   icebergRotY: 0,
   icebergPosX: 0,
   currentRotate: 0,
}

export { VarConst, VarLet }