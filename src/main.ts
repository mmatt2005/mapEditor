import { Application } from 'pixi.js';
import { loadMap } from './loadMap';
// import { TestCar } from './test';
import { UiManager } from './uiManager';
import { GameMapOptions, type GameData } from './types';

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
}, 500)

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