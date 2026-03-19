import { Graphics, type Point } from "pixi.js"
import mapData from "../public/map.json"
import type { EditorObject_Line, EditorObjects_Export } from "./editorObjectsManager"
import { app, uiManager } from "./main"

export function loadMap(): void { 
    const mapJson = mapData as EditorObjects_Export

    for (const line of mapJson.lines) {
        drawPoint(line.pt1)
        drawPoint(line.pt2)
        drawLine(line)
        uiManager.editorObjectsManager.addObject(line)
    }

    function drawPoint(pt: Point): void { 
        const point = new Graphics()
        point.circle(pt.x, pt.y, 20)
        point.fill("green")
        app.stage.addChild(point)
    }

    function drawLine(l: EditorObject_Line): void { 
        const line = new Graphics()
        line.moveTo(l.pt1.x, l.pt1.y)
        line.lineTo(l.pt2.x, l.pt2.y)
        line.stroke({color: "white", width: l.lineWidth || 5})
        app.stage.addChild(line)
    }
}
