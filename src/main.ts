import { Application, Container, Graphics } from 'pixi.js';
import { loadMap } from './loadMap';
// import { TestCar } from './test';
import { Viewport } from "pixi-viewport";
import { GameMapOptions, type GameData } from './types';
import { UiManager } from './uiManager';

export const app = new Application()
await app.init({ background: "gray", resizeTo: window })

const pixiContainer = document.createElement("div")
pixiContainer.id = "pixi-container"
document.body.appendChild(pixiContainer)
pixiContainer.appendChild(app.canvas)

export const worldLayer = new Container()
export const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 5000,
    worldHeight: 5000,
    passiveWheel: false,
    events: app.renderer.events
})
viewport.sortableChildren = true
viewport.drag().pinch().wheel().decelerate();
viewport.fit()
viewport.moveCenter(viewport.worldWidth / 2, viewport.worldHeight / 2)
viewport.clampZoom({ minWidth: 500, minHeight: 500, maxWidth: viewport.worldWidth * 2, maxHeight: viewport.worldHeight * 2 })
const padding = 500
viewport.clamp({
    left: -padding,
    right: viewport.worldWidth + padding,
    top: -padding,
    bottom: viewport.worldHeight + padding
})

app.stage.addChild(viewport)
viewport.addChild(worldLayer)
setTimeout(() => {
    loadMap()
}, 500)

export const viewportBorder = new Graphics()
viewportBorder.rect(0, 0, viewport.worldWidth, viewport.worldHeight)
viewportBorder.stroke({ width: 25, color: "red" })
viewport.addChild(viewportBorder)

export const uiManager = new UiManager()



export async function saveMap(currentMap: keyof (typeof GameMapOptions)): Promise<Response> {
    const response = await fetch("http://localhost:3000/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                mapJsonFile: GameMapOptions[currentMap],
                mapData: JSON.stringify(exportMap())
            }
        )
    })

    return response
}

function exportMap(): GameData {
    const exportObject: GameData = { mapGraph: uiManager.graphManager.nodes, zones: uiManager.zoneManager.zones, props: uiManager.propsManager.props }

    return exportObject
}

// export const car = new TestCar()