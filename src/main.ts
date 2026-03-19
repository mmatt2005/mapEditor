import { Application, Assets, Sprite } from 'pixi.js';
import { UiManager } from './uiManager';
import { loadMap } from './loadMap';

export const app = new Application()
await app.init({ background: "gray", resizeTo: window})

const pixiContainer = document.createElement("div")
pixiContainer.id = "pixi-container"
document.body.appendChild(pixiContainer)
pixiContainer.appendChild(app.canvas)

const bunnyTexture = await Assets.load("https://pixijs.com/assets/bunny.png")
const bunny = new Sprite(bunnyTexture)
bunny.position.set(app.canvas.width / 2, app.canvas.height / 2)
app.stage.addChild(bunny)


export const uiManager = new UiManager()

// loadMap()

