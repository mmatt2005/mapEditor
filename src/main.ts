import { Application } from 'pixi.js';
import { loadMap } from './loadMap';
// import { TestCar } from './test';
import { UiManager } from './uiManager';


export const app = new Application()
await app.init({ background: "gray", resizeTo: window })

const pixiContainer = document.createElement("div")
pixiContainer.id = "pixi-container"
document.body.appendChild(pixiContainer)
pixiContainer.appendChild(app.canvas)
app.stage.sortableChildren = true

export const uiManager = new UiManager()

setTimeout(() => { 
    loadMap()
},500)


// export const car = new TestCar()