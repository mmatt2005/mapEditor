import  { GameMapOptions } from "../types"
import { exportMap } from "./exportMap"


/**
 * @author mattmichalowski
 * 4/2/26 9:47am
 * @description saves the map to the given json file
 * @export
 * @async
 * @param {keyof (typeof GameMapOptions)} currentMap 
 * @returns {Promise<Response>} 
 */
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