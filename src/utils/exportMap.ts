import { EdgeGraphic } from "../core/edge"
import { worldLayer } from "../core/main"
import { NodeGraphic } from "../core/node"
import { PropSprite } from "../core/propsManager"
import type { GameData } from "../types"
import { ZoneGraphic } from "../core/zoneManager"


/**
 * @description creates the GameData object which is the object that is in the gamedata.json files to load the game.
 * @export
 * @returns {GameData} 
 */
export function exportMap(): GameData {
    const exportObject: GameData = {zones: [], nodes: [], props: [], edges: []}

    for (const child of worldLayer.children) { 
        if (child instanceof ZoneGraphic) {
            exportObject.zones.push(child.getZoneObject())
        } else if (child instanceof NodeGraphic) { 
            exportObject.nodes.push(child.getNodeObject())
        }  else if (child instanceof EdgeGraphic) {
            exportObject.edges.push(child.getEdgeObject())
        } else if (child instanceof PropSprite) {
            exportObject.props.push(child.getPropObject())
        }
    }

    return exportObject
}
