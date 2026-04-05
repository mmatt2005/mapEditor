import { Application, Assets, Container, Graphics, Texture } from 'pixi.js';
import { Viewport } from "pixi-viewport";
import { GAME_VALUES } from './constants';
import { initializeViewport } from './utils/initializeViewport';
import { UIManager } from './uiManager';
import { EventsManager } from './eventsManager';
import { GraphManager } from './graphManager';
import { ZoneManager } from './zoneManager';
import { loadMap } from './utils/loadMap';
import { PropsManager } from './propsManager';

export const app = new Application()
await app.init({ background: "gray", resizeTo: window })
export const spritesheet: Texture = await Assets.load("/assets/places.png")


const pixiContainer = document.createElement("div")
pixiContainer.id = "pixi-container"
document.body.appendChild(pixiContainer)
pixiContainer.appendChild(app.canvas)

export const worldLayer = new Container()
export const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: GAME_VALUES.WORLD_WIDTH,
    worldHeight: GAME_VALUES.WORLD_HEIGHT,
    passiveWheel: false,
    events: app.renderer.events
})
initializeViewport()

app.stage.addChild(viewport)
viewport.addChild(worldLayer)
setTimeout(() => {
    loadMap()
}, 500)

export const viewportBorder = new Graphics()
viewportBorder.rect(0, 0, viewport.worldWidth, viewport.worldHeight)
viewportBorder.stroke({ width: 25, color: "red" })
viewport.addChild(viewportBorder)

export const uiManager = new UIManager()
export const eventsManager = new EventsManager()
export const graphManager = new GraphManager()
export const zoneManager = new ZoneManager()
export const propsManager = new PropsManager()