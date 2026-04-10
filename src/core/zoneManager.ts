import { Graphics, Point } from "pixi.js"
import { GAME_VALUES } from "../constants"
import { app, eventsManager, uiManager, viewport, worldLayer } from "../core/main"
import type { Zone } from "../types"
import { v4 as uuidv4 } from "uuid"

export class ZoneManager {
    isMouseDown: boolean = false
    mouseDownPosition: Point | null = null

    constructor() {
        viewport.addEventListener("mousedown", (event) => {
            // Only the left-mouse button can trigger this event.
            if (event.button !== 0) return

            this.isMouseDown = true
            const position = viewport.toWorld(event.global.x, event.global.y)
            this.mouseDownPosition = position
            viewport.plugins.pause("drag")
        })

        document.addEventListener("mouseup", () => {
            const resetState = () => {
                this.isMouseDown = false
                this.mouseDownPosition = null
                viewport.plugins.resume("drag")
                squareArea.clear()
            }

            if (eventsManager.isShiftKeyDown) {
                if (!this.mouseDownPosition || !eventsManager.mousePosition) {
                    console.log("Failed to create zone due to not having one of the two required mouse positions")
                    resetState()
                    return
                }

                const zoneWidth = Math.abs(this.mouseDownPosition.x - eventsManager.mousePosition.x)
                const zoneHeight = Math.abs(this.mouseDownPosition.y - eventsManager.mousePosition.y)

                if (zoneWidth <= GAME_VALUES.MIN_ZONE_SIZE || zoneHeight <= GAME_VALUES.MIN_ZONE_SIZE) {
                    console.log(`Failed to create zone due to too small of a width or height, Width: ${zoneWidth}, Height: ${zoneHeight}`)
                    resetState()
                    return
                }

                const startX = Math.min(this.mouseDownPosition.x, eventsManager.mousePosition.x)
                const startY = Math.min(this.mouseDownPosition.y, eventsManager.mousePosition.y)

                new ZoneGraphic(new Point(startX, startY), zoneWidth, zoneHeight)

                squareArea.clear()
            }

            resetState()
        })

        const squareArea = new Graphics()
        worldLayer.addChild(squareArea)
        app.ticker.add(() => {
            if (eventsManager.isShiftKeyDown && this.isMouseDown) {
                if (!eventsManager.mousePosition || !this.mouseDownPosition) return

                squareArea.clear()
                const startX = Math.min(eventsManager.mousePosition.x, this.mouseDownPosition.x)
                const startY = Math.min(eventsManager.mousePosition.y, this.mouseDownPosition.y)

                const mouseX = Math.abs(eventsManager.mousePosition.x - this.mouseDownPosition.x)
                const mouseY = Math.abs(eventsManager.mousePosition.y - this.mouseDownPosition.y)
                squareArea.rect(startX, startY, mouseX, mouseY)
                squareArea.fill(GAME_VALUES.DEFAULT_ZONE_COLOR)
                squareArea.alpha = 0.5
                worldLayer.addChild(squareArea)
            }
        })
    }
}

export class ZoneGraphic extends Graphics implements Zone {
    id: string = uuidv4()
    startPoint: Point
    color: string = GAME_VALUES.DEFAULT_ZONE_COLOR
    opacity: number = GAME_VALUES.DEFAULT_ZONE_OPACITY
    type: Zone["type"] = "none"
    editorType: Zone["editorType"] = "zone"
    zoneWidth: number
    zoneHeight: number

    constructor(startPoint: Point, zoneWidth: Zone["zoneWidth"], zoneHeight: Zone["zoneHeight"]) {
        super()
        this.startPoint = startPoint
        this.zoneWidth = zoneWidth
        this.zoneHeight = zoneHeight

        this.rect(0, 0, zoneWidth, zoneHeight)
        this.position.set(this.startPoint.x, this.startPoint.y)
        this.fill(this.color)
        this.alpha = this.opacity

        this.eventMode = "static"
        this.on("click", () => {
            uiManager.setSideMenu("zone", this.getZoneObject())
        })

        worldLayer.addChild(this)
    }


    updateZone(newZone: Zone): void {
        // FIGURE OUT HOW THIS WORKS!
        this.alpha = newZone.opacity
        this.opacity = newZone.opacity

        uiManager.updateUi()
    }

    getZoneObject(): Zone {
        return {
            id: this.id,
            startPoint: this.startPoint,
            zoneWidth: this.zoneWidth,
            zoneHeight: this.zoneHeight,
            type: this.type,
            editorType: this.editorType,
            color: this.color,
            opacity: this.opacity
        }
    }
}