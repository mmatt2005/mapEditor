import { Application, Assets, Container, Graphics, Texture } from 'pixi.js';
import { Viewport } from "pixi-viewport";
import { GAME_VALUES } from '../constants';
import { GameObjectsZIndex } from '../types';
import { initializeViewport } from '../utils/initializeViewport';
import { loadMap } from '../utils/loadMap';
import { EventsManager } from './eventsManager';
import { GraphManager } from './graphManager';
import { PathFindingDebug } from './pathfindingDebug';
import { PropsManager } from './propsManager';
import { UIManager } from './uiManager';
import { VehicleSprite } from './vehicle';
import { ZoneManager } from './zoneManager';
import { HighlightManager } from './highlightManager';


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

export const viewportBorder = new Graphics()
viewportBorder.rect(0, 0, viewport.worldWidth, viewport.worldHeight)
viewportBorder.stroke({ width: 25, color: "red" })
viewport.addChild(viewportBorder)

export const uiManager = new UIManager()
export const eventsManager = new EventsManager()
export const graphManager = new GraphManager()
export const zoneManager = new ZoneManager()
export const propsManager = new PropsManager()
export const pathFindingDebug = new PathFindingDebug()
export const highlightManager = new HighlightManager()

await loadMap()

const vehicle = new VehicleSprite()
const randomStartingEdge = graphManager.getAllEdgeGraphics()[Math.floor(Math.random() * graphManager.getAllEdgeGraphics().length)]
vehicle.setCurrentEdge(randomStartingEdge)
pathFindingDebug.setStartEdge(randomStartingEdge)
const currentVehicleEdge = vehicle.getCurrentEdge()
if (currentVehicleEdge) {
    const randomStartingPosition = graphManager.selectRandomPointOnEdge(currentVehicleEdge)
    if (randomStartingPosition) {
        vehicle.position.set(randomStartingPosition.x, randomStartingPosition.y)

        const angleOfEdge = graphManager.getAngleOfEdgeInDegrees(randomStartingEdge)
        if (angleOfEdge) {
            vehicle.angle = angleOfEdge + 90
        }

        const point = new Graphics()
        point.circle(randomStartingPosition.x, randomStartingPosition.y, 20)
        point.zIndex = GameObjectsZIndex.point
        point.fill("black")
        worldLayer.addChild(point)
    }
}


// JUST FOR TESTING!!! REMOVE AS SOON AS DONE TESTING!
// setTimeout(() => {
//     const allEdges = worldLayer.children.filter(e => e instanceof EdgeGraphic)
//     const startEdge = allEdges[Math.floor(Math.random() * allEdges.length)]
//     const endEdge = allEdges[Math.floor(Math.random() * allEdges.length)]
  
//     if (startEdge.id === endEdge.id) {
//         console.log("Failed to set default pathfinding due to start & end edge being the same!")
//     } else {
//         pathFindingDebug.setStartEdge(startEdge)
//         startEdge.highlight()
//         startEdge.setHighlightColor("green")

//         pathFindingDebug.setEndEdge(endEdge)

//         endEdge.highlight()
//         endEdge.setHighlightColor("red")
//     }
// }, 700)