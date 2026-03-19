import { Circle, Graphics, Point, Polygon } from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import type { EditorObject_Point } from "./editorObjectsManager";
import { app, uiManager } from "./main";

/**
 * @description adds the ability to draw a line from two points
 * @export
 * @class DrawLineManager
 * @typedef {DrawLineManager}
 */
export class DrawLineManager {
    firstPoint: Point | null = null
    secondPoint: Point | null = null
    isDrawLineModeEnabled: boolean = false
    isSnapPointModeEnabled: boolean = false

    calculateDistanceOfPoints(pt1: Point, pt2: Point): number {
        return Math.hypot(pt2.x - pt1.x, pt2.y - pt1.y)
    }

    drawLine(): void {
        if (!this.firstPoint || !this.secondPoint) {
            console.log("Failed to draw line due to not having both points...")
            return
        }

        const line = new Graphics()
        line.moveTo(this.firstPoint.x, this.firstPoint.y)
        line.lineTo(this.secondPoint.x, this.secondPoint.y)
        line.stroke({ width: 3, color: "white" })
        line.eventMode = "static"
        line.hitArea = new Polygon(this.firstPoint.x, this.firstPoint.y, this.secondPoint.x, this.secondPoint.y)
        app.stage.addChild(line)

        const lineId = uuidv4()

        // The "hitbox" of the line so we can interact with it.
        const g = new Graphics()
        g.moveTo(this.firstPoint.x, this.firstPoint.y)
        g.lineTo(this.secondPoint.x, this.secondPoint.y)
        g.stroke({ width: 15, color: "yellow", alpha: 0.2 })
        g.eventMode = "static"
        g.on("click", () => {
            if (!this.isSnapPointModeEnabled) {
                uiManager.setSelectedObject(lineId)
            }
        })
        app.stage.addChild(g)


        uiManager.editorObjectsManager.addObject({ pt1: this.firstPoint, pt2: this.secondPoint, type: "line", graphic: line, id: lineId, lineWidth: 3 })
        this.firstPoint = null
        this.secondPoint = null
    }


    drawPoint(pt: Point): void {
        if (this.isSnapPointModeEnabled) {
            const justPointElements = uiManager.editorObjectsManager.editorObjects.filter(obj => obj.type === "point") as EditorObject_Point[]

            for (let i = 0; i < justPointElements.length; i++) {
                let distance = this.calculateDistanceOfPoints(pt, justPointElements[i].pt)
                if (distance <= 15) {
                    console.log("Snap Point Set!")
                    if (!this.firstPoint) {
                        this.firstPoint = justPointElements[i].pt
                    } else this.secondPoint = justPointElements[i].pt
                    this.disbaleSnapPoint()

                    const disabledPoint = justPointElements[i]
                    disabledPoint.graphic.clear()
                    disabledPoint.graphic.circle(disabledPoint.pt.x, disabledPoint.pt.y, 10)
                    disabledPoint.graphic.fill("red")

                    // We snapped to two points so make that line
                    if (this.firstPoint && this.secondPoint) {
                        this.drawLine()
                    }
                    return
                }
            }
        }

        const point = new Graphics()
        point.circle(pt.x, pt.y, 10)
        point.fill("red")

        if (uiManager.debugMode) {
            // Debug hitArea
            const debug = new Graphics()
            debug.circle(pt.x, pt.y, 30)
            debug.stroke({ width: 2, color: "green" })
            app.stage.addChild(debug)
        }
        const debug = new Graphics()
        debug.circle(pt.x, pt.y, 30)
        debug.stroke({ width: 2, color: "green" })
        debug.eventMode = "static"
        debug.hitArea = new Circle(pt.x, pt.y, 30)
        debug.on("click", () => {
            if (!this.isSnapPointModeEnabled) {

                uiManager.setSelectedObject(pointId)
            }
        })
        
        app.stage.addChild(debug)

        point.on("mouseover", () => {
            if (this.isSnapPointModeEnabled) {
                point.clear()
                point.circle(pt.x, pt.y, 12)
                point.fill("green")
            }
        })

        point.on("mouseleave", () => {
            if (this.isSnapPointModeEnabled) {
                point.clear()
                point.circle(pt.x, pt.y, 10)
                point.fill("red")
            }
        })

        const pointId = uuidv4()


        // Only add the point if it already doesn't exist in the editor objects
        if (!uiManager.editorObjectsManager.doesPointExistInEditorObjects(pt)) {
            app.stage.addChild(point)
            uiManager.editorObjectsManager.addObject({ pt: pt, type: "point", graphic: point, id: pointId })
        }


        if (!this.firstPoint) {
            this.firstPoint = pt
        } else if (!this.secondPoint) {
            this.secondPoint = pt
            this.drawLine()
        }

        uiManager.updateUi()
    }

    enableDrawLine(): void {
        if (this.isDrawLineModeEnabled) {
            console.log("failed to enable draw line due to it already being enabled...")
            return
        }

        console.log("Draw Line: Enabled!")

        this.isDrawLineModeEnabled = true
        uiManager.updateUi()
    }

    disbaleDrawLine(): void {
        if (!this.isDrawLineModeEnabled) {
            console.log("Failed to disable draw line due to it not being enabled in the first place...")
            return
        }

        console.log("Draw Line: Disabled!")

        this.isDrawLineModeEnabled = false
        uiManager.updateUi()
    }

    enableSnapPoint(): void {
        if (this.isSnapPointModeEnabled) {
            console.log("failed to enable snap point due to it already being enabled...")
            return
        }

        console.log("Snap Point: Enabled!")

        this.isSnapPointModeEnabled = true
        uiManager.updateUi()
    }

    disbaleSnapPoint(): void {
        if (!this.isSnapPointModeEnabled) {
            console.log("Failed to disable snap point due to it not being enabled in the first place...")
            return
        }

        console.log("Snap Point: Disabled!")

        this.isSnapPointModeEnabled = false
        uiManager.updateUi()
    }
}