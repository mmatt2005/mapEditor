import { uiManager } from "../main"
import type { GameData } from "../types"


/**
 * @description creates the GameData object which is the object that is in the gamedata.json files to load the game.
 * @export
 * @returns {GameData} 
 */
export function exportMap(): GameData {
    const exportObject: GameData = { mapGraph: uiManager.graphManager.nodes, zones: uiManager.zoneManager.zones, props: uiManager.propsManager.props }

    return exportObject
}
