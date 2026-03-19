import { Graphics, Point } from "pixi.js"
import { app } from "./main"
import { DrawLineManager } from "./drawLineManager"
import { EditorObjectsManager, type EditorObject } from "./editorObjectsManager"

export class UiManager {
    editorObjectsManager: EditorObjectsManager = new EditorObjectsManager()
    drawLineManager: DrawLineManager = new DrawLineManager()
    debugMode: boolean = false
    selectedObject: EditorObject | null = null

    constructor() {
        app.canvas.addEventListener("click", event => {

            if (this.drawLineManager.isDrawLineModeEnabled) {
                this.drawLineManager.drawPoint(new Point(event.clientX, event.clientY))
            }
        })
    }

    /** @description updates the react ui with the most up to date uiManager class  */
    updateUi(): void {}

    setDebugMode(debug: boolean) {
        this.debugMode = debug
        this.updateUi()
    }

    setSelectedObject(objectId: EditorObject["id"] | null): void { 
        // Reset back to nothing being selected
        if (objectId === null) {
            this.selectedObject = null
            this.updateUi()
            return
        }

        const findObject = this.editorObjectsManager.editorObjects.find(obj => obj.id === objectId)

        if (!findObject) {
            console.log("Failed to setSelectedObject due to not finding the object with id: " + objectId)
            return
        }

        this.selectedObject = findObject
        this.updateUi()
    }
}