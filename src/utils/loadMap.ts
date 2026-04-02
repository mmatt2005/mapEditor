import { Assets, Sprite } from "pixi.js"
import cityMap from "../../public/map_city.json"
import smallTownMap from "../../public/map_smallTown.json"
import { uiManager, viewport, worldLayer } from "../main"
import type { GameData } from "../types"
import { GameMapOptions, GameObjectsZIndex } from "../types"

/**
 * @author mattmichalowski
 * 4/2/26 9:46am
 * @description loads the map from the given json file
 * @export
 * @async
 * @param {keyof (typeof GameMapOptions)} [selectedMap=uiManager.currentMap] 
 * @returns {Promise<void>} 
 */
export async function loadMap(selectedMap: keyof (typeof GameMapOptions) = uiManager.currentMap): Promise<void> {
    // Handles the case where we've already loaded a map and were loading a new one so we need clear out the previous map first.
    worldLayer.removeChildren()
    uiManager.graphManager.nodes = []
    uiManager.zoneManager.zones = []
    uiManager.propsManager.props = []

    let data = cityMap as unknown as GameData
    if (selectedMap) {
        if (selectedMap === "CITY") {
            data = cityMap as unknown as GameData
        } else if (selectedMap === "SMALL_TOWN") {
            data = smallTownMap as GameData
        }
    }

    uiManager.graphManager.nodes = data.mapGraph
    uiManager.zoneManager.zones = data.zones
    uiManager.propsManager.props = data.props

        // Draw the background
    const texutre = await Assets.load("/assets/greenbackground.png")
    const background = new Sprite(texutre)
    background.zIndex = GameObjectsZIndex.background
    background.setSize(viewport.worldWidth, viewport.worldHeight)
    worldLayer.addChild(background)

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