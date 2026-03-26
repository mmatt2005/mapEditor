import { Application } from 'pixi.js';
import { loadMap } from './loadMap';
import { UiManager } from './uiManager';
import type { GraphManager } from './graphManager';
import type { ZoneManager } from './zoneManager';
export enum GameObjectsZIndex {
    zone = 1,
    edge,
    point
}
export const app = new Application()
await app.init({ background: "gray", resizeTo: window })

const pixiContainer = document.createElement("div")
pixiContainer.id = "pixi-container"
document.body.appendChild(pixiContainer)
pixiContainer.appendChild(app.canvas)
app.stage.sortableChildren = true

export const uiManager = new UiManager()

loadMap("city")

export interface GameData { 
    mapGraph: GraphManager["nodes"]
    zones: ZoneManager["zones"]
}