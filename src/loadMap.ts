import cityMap from "../public/map_city.json"
import smallTownMap from "../public/map_smallTown.json"
import type { Node } from "./graphManager"
import { app, uiManager } from "./main"

export function loadMap(selectedMap: "city" | "smallTown" = "city"): void {
    // Handles the case where we've already loaded a map and were loading a new one so we need clear out the previous map first.
    app.stage.removeChildren()
    uiManager.graphManager.nodes = []

    let data = cityMap as Node[]
    if (selectedMap) {
        if (selectedMap === "city") {
            data = cityMap as Node[]
        } else if (selectedMap === "smallTown") {
            data = smallTownMap as Node[]
        }
    }

    uiManager.graphManager.nodes = data

    // Draw all the nodes (points)
    data.forEach(node => {
        uiManager.drawNode(node.position, node.id)
    })

    // Draw all the edges (lines)
    data.forEach(node => {
        if (node.connections.length > 0) {
            node.connections.forEach(edgeId => {
                const getConnectedNode = uiManager.graphManager.getNodeById(edgeId)

                if (!getConnectedNode) {
                    console.log("Failed to draw edge due to not finding the connected Node!")
                    return
                }

                uiManager.drawEdge(node.position, getConnectedNode.position)
            })
        }
    })
    
    uiManager.updateUi()
}