import map1 from "../public/map1.json"
import map2 from "../public/map2.json"
import type { EditorObjects_Export } from "./editorObjectsManager"
import { app, uiManager } from "./main"


export type MapJsonFileNames = "map1" | "map2"

export function loadMap(mapToLoad?: MapJsonFileNames): void {
    // Unload the current map * if any *
    app.stage.removeChildren()
    uiManager.editorObjectsManager.editorObjects = []

    // Load the new map
    let mapJson = map1 as EditorObjects_Export[]
    if (mapToLoad) {
        if (mapToLoad === "map1") {
            mapJson = map1 as EditorObjects_Export[]
        } else if (mapToLoad === "map2") {
            mapJson = map2 as EditorObjects_Export[]
        }
    }

    for (const line of mapJson) {
        uiManager.drawLineManager.drawPoint(line.pt1)
        uiManager.drawLineManager.drawPoint(line.pt2)

        uiManager.drawLineManager.firstPoint = line.pt1
        uiManager.drawLineManager.secondPoint = line.pt2
        uiManager.drawLineManager.drawLine()
    }
    uiManager.updateUi()
}