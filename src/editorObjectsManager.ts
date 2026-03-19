import type { Graphics, Point } from "pixi.js";
import { uiManager } from "./main";

export interface EditorObject {
    type: "point" | "line"
    graphic: Graphics
    id: string
}

export interface EditorObject_Line extends EditorObject {
    pt1: Point
    pt2: Point
    lineWidth: number
}

export interface EditorObject_Point extends EditorObject {
    pt: Point
}

type EditorObjects = EditorObject_Line | EditorObject_Point


export interface EditorObjects_Export {
    points: Point[]
    lines: EditorObject_Line[]
}

export class EditorObjectsManager {
    editorObjects: EditorObjects[] = []

    addObject(obj: EditorObjects): void {
        this.editorObjects.push(obj)

        console.log(obj.type + ` ${this.isLine(obj)}`)
    }

    getObject(objectId: string): EditorObject | null {
        return this.editorObjects.find(obj => obj.id === objectId) || null
    }

    
    /**
     * @description checks is a object is a EditorObject_Point
     * @param {EditorObject} pointObject 
     * @returns {pointObject is EditorObject_Point} 
     */
    isPoint(pointObject: EditorObject): pointObject is EditorObject_Point {
        return pointObject && pointObject.type === "point"
    }
    
    /**
     * @description checks if a object is a EditorObject_Line
     * @param {EditorObject} lineObject 
     * @returns {lineObject is EditorObject_Line} 
     */
    isLine(lineObject: EditorObject): lineObject is EditorObject_Line {
        return lineObject && lineObject.type === "line"
    }

    updateEditorObjectLineWidth(objectId: string, newLineWidth: number): void {
        const findObject = this.getObject(objectId)
        if (!findObject) {
            console.log("failed to update editor objects line width due to not finding object")
            return
        }
        
        if (!this.isLine(findObject)) {
            console.log("Failed to update editor object line width due to object not being a EditorObject_Line")
            return
        }

        this.editorObjects = this.editorObjects.map(obj => {
            if (obj.id === findObject.id) {
                obj.graphic.clear()
                obj.graphic.moveTo(findObject.pt1.x, findObject.pt1.y)
                obj.graphic.lineTo(findObject.pt2.x, findObject.pt2.y)
                obj.graphic.stroke({width: newLineWidth, color: "white"})

                return {...obj, lineWidth: newLineWidth}
            } else return obj
        })

        uiManager.updateUi()
    }

    getNumberOfEditorObject(objectType: EditorObject["type"]): number {
        return this.editorObjects.filter(obj => obj.type === objectType).length
    }

    doesPointExistInEditorObjects(pt: Point): boolean {
        const justPoints = this.editorObjects.filter(obj => obj.type === "point") as EditorObject_Point[]

        return justPoints.some(obj => obj.pt.x === pt.x && obj.pt.y === pt.y)
    }

    export(): EditorObjects_Export {
        const exportArray: EditorObjects_Export = { points: [], lines: [] }

        this.editorObjects.forEach(obj => {
            if (obj.type === "point") {
                const point = obj as EditorObject_Point
                exportArray.points.push(point.pt)
            } else if (obj.type === "line") {
                const line = obj as EditorObject_Line
                exportArray.lines.push(line)
            }
        })

        return exportArray
    }
}