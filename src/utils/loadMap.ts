import { Assets, Sprite } from "pixi.js"
import cityMap from "../../public/map_city.json"
import smallTownMap from "../../public/map_smallTown.json"
import { LoadEdgeGraphic, LoadNodeGraphic } from "../graphManager"
import { graphManager, uiManager, viewport, worldLayer } from "../main"
import { LoadPropSprite } from "../propsManager"
import type { GameData } from "../types"
import { GameMapOptions, GameObjectsZIndex } from "../types"
import { ZoneGraphic } from "../zoneManager"

/**
 * @author mattmichalowski
 * 4/2/26 9:46am
 * @description loads the map from the given json file
 * @export
 * @async
 * @param {keyof (typeof GameMapOptions)} [selectedMap=uiManager.currentMap] 
 * @returns {Promise<void>} 
 */
export async function loadMap(selectedMap: keyof (typeof GameMapOptions) = uiManager.getCurrentMap()): Promise<void> {
    // Handles the case where we've already loaded a map and were loading a new one so we need clear out the previous map first.
    worldLayer.removeChildren()


    let data = cityMap as unknown as GameData
    if (selectedMap) {
        if (selectedMap === "CITY") {
            data = cityMap as unknown as GameData
        } else if (selectedMap === "SMALL_TOWN") {
            data = smallTownMap as unknown as GameData
        }
    }


    // Draw the background
    const texutre = await Assets.load("/assets/greenbackground.png")
    const background = new Sprite(texutre)
    background.zIndex = GameObjectsZIndex.background
    background.setSize(viewport.worldWidth, viewport.worldHeight)
    worldLayer.addChild(background)

    // Draw all the nodes (points)
    data.nodes.forEach(node => {
        const n = new LoadNodeGraphic(node)
    })

    // Draw all the edges (lines)
    data.edges.forEach(edge => {
        
        const node1 = graphManager.getNodeGraphic(edge.node1Id)
        const node2 = graphManager.getNodeGraphic(edge.node2Id)

        if (!node1 || !node2) {
            console.log("Failed to draw edge due to not finding nodes")
            return
        }

        new LoadEdgeGraphic(node1, node2, edge)
    })



    // Draw the Zones
    data.zones.forEach(zone => {
        const z = new ZoneGraphic(zone.startPoint, zone.zoneWidth, zone.zoneHeight)
    })

    // Draw the props
    data.props.forEach(async prop => {
        const p = new LoadPropSprite(prop)
    })


    uiManager.updateUi()
}