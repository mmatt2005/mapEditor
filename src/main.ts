import { Application } from 'pixi.js';
import { UiManager } from './uiManager';
import { loadMap } from './loadMap';

export const app = new Application()
await app.init({ background: "gray", resizeTo: window})

const pixiContainer = document.createElement("div")
pixiContainer.id = "pixi-container"
document.body.appendChild(pixiContainer)
pixiContainer.appendChild(app.canvas)
app.stage.sortableChildren = true

export const uiManager = new UiManager()

loadMap("smallTown")