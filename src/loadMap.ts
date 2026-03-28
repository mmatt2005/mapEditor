import cityMap from "../public/map_city.json"
import smallTownMap from "../public/map_smallTown.json"
import { app, uiManager } from "./main"
import type { GameMapOptions, GameData } from "./types"

export function loadMap(selectedMap: GameMapOptions = uiManager.currentMap): void {
    // Handles the case where we've already loaded a map and were loading a new one so we need clear out the previous map first.
    app.stage.removeChildren()
    uiManager.graphManager.nodes = []
    uiManager.zoneManager.zones = []
    uiManager.propsManager.props = []

    let data = cityMap as GameData
    if (selectedMap) {
        if (selectedMap === "city") {
            data = cityMap as GameData
        } else if (selectedMap === "smallTown") {
            data = smallTownMap as GameData
        }
    }

    uiManager.graphManager.nodes = data.mapGraph
    uiManager.zoneManager.zones = data.zones
    uiManager.propsManager.props = data.props

    // Draw all the edges (lines)
    data.mapGraph.forEach(node => {
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
    data.mapGraph.forEach(node => {
        uiManager.drawNode(node.position, node.id)
    })

    // Draw the Zones
    data.zones.forEach(zone => {
        uiManager.zoneManager.addZone(zone)
    })

    // Draw the props
    data.props.forEach(prop => { 
        uiManager.propsManager.loadProp(prop.id)
    })


    uiManager.currentMap = selectedMap
    uiManager.updateUi()
}