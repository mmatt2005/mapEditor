import cityMap from "../public/map_city.json"
import smallTownMap from "../public/map_smallTown.json"
import type { Node } from "./graphManager"
import { app, uiManager } from "./main"

export type GameMapOptions = "city" | "smallTown"

export function loadMap(selectedMap: GameMapOptions = uiManager.currentMap): void {
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

    // Draw all the edges (lines)
    data.forEach(node => {
        if (node.connections.length > 0) {
            node.connections.forEach(edgeId => {
                const getConnectedNode = uiManager.graphManager.getNodeById(edgeId.connectionNodeId)

                if (!getConnectedNode) {
                    console.log("Failed to draw edge due to not finding the connected Node!")
                    return
                }

                const edge = uiManager.graphManager.getEdgeByConnectingNodes(node.id, getConnectedNode.id)
                if (!edge) {
                    console.log("failed to find edge...")
                    return
                }

                uiManager.drawEdge(node.position, getConnectedNode.position, edge.id)
            })
        }
    })

    // Draw all the nodes (points)
    data.forEach(node => {
        uiManager.drawNode(node.position, node.id)
    })


    uiManager.currentMap = selectedMap
    uiManager.updateUi()
}