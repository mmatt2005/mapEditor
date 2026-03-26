import { Graphics, Point } from "pixi.js"
import { app, GameObjectsZIndex, uiManager } from "./main"
import { v4 as uuidv4 } from "uuid"

export interface Zone {
    startPoint: Point
    width: number
    height: number
    color: string
    id: string
    editorType: "zone"
    opacity: number
    type: "countryside" | "downtown" | "school" | "none"
}

export const ZONE_TYPES: Zone["type"][] = ["countryside", "downtown", "school", "none"]

export class ZoneManager {
    isShiftKeyDown: boolean = false
    isMouseDown: boolean = false
    mouseDownPosition: Point | null = null
    mousePosition: Point | null = null
    zones: Zone[] = []

    constructor() {
        document.addEventListener("mousemove", event => {
            this.mousePosition = new Point(event.clientX, event.clientY)
        })

        document.addEventListener("mousedown", (event) => {
            this.isMouseDown = true
            this.mouseDownPosition = new Point(event.clientX, event.clientY)
        })

        document.addEventListener("mouseup", () => {
            const resetState = () => {
                this.isMouseDown = false
                this.mouseDownPosition = null
                squareArea.clear()
            }

            if (this.isShiftKeyDown) {
                if (!this.mouseDownPosition || !this.mousePosition) {
                    console.log("Failed to create zone due to not having one of the two required mouse positions")
                    resetState()
                    return
                }

                const zoneWidth = Math.abs(this.mouseDownPosition.x - this.mousePosition.x)
                const zoneHeight = Math.abs(this.mouseDownPosition.y - this.mousePosition.y)

                if (zoneWidth <= 25 || zoneHeight <= 25) {
                    console.log(`Failed to create zone due to too small of a width or height, Width: ${zoneWidth}, Height: ${zoneHeight}`)
                    resetState()
                    return
                }

                const startX = Math.min(this.mouseDownPosition.x, this.mousePosition.x)
                const startY = Math.min(this.mouseDownPosition.y, this.mousePosition.y)

                this.addZone(
                    {
                        startPoint: new Point(startX, startY),
                        width: zoneWidth,
                        height: zoneHeight,
                        color: "green",
                        id: uuidv4(),
                        editorType: "zone",
                        opacity: 0.7,
                        type: "none"
                    }
                )

                squareArea.clear()
            }

            resetState()
        })

        document.addEventListener("keydown", event => {
            if (event.key === "Shift") {
                this.isShiftKeyDown = true
            }
        })

        document.addEventListener("keyup", event => {
            if (event.key === "Shift") {
                this.isShiftKeyDown = false
            }
        })

        const squareArea = new Graphics()
        app.stage.addChild(squareArea)
        app.ticker.add((ticker) => {
            if (this.isShiftKeyDown && this.isMouseDown) {
                if (!this.mousePosition || !this.mouseDownPosition) return

                squareArea.clear()
                const startX = Math.min(this.mousePosition.x, this.mouseDownPosition.x)
                const startY = Math.min(this.mousePosition.y, this.mouseDownPosition.y)

                const mouseX = Math.abs(this.mousePosition.x - this.mouseDownPosition.x)
                const mouseY = Math.abs(this.mousePosition.y - this.mouseDownPosition.y)
                squareArea.rect(startX, startY, mouseX, mouseY)
                squareArea.fill("green")
                squareArea.alpha = 0.5
                app.stage.addChild(squareArea)
            }
        })
    }

    addZone(zone: Zone): void {
        this.zones.push(zone)

        const zoneGraphic = new ZoneGraphic(zone.id)
        zoneGraphic.rect(zone.startPoint.x, zone.startPoint.y, zone.width, zone.height)
        zoneGraphic.fill(zone.color)
        zoneGraphic.zIndex = GameObjectsZIndex.zone
        zoneGraphic.alpha = zone.opacity
        zoneGraphic.eventMode = "static"
        zoneGraphic.on("click", () => {
            console.log("A zone was clicked!")
            uiManager.selected = zone
            uiManager.sideMenu.visibile = true
            uiManager.sideMenu.selected = "zone"
            uiManager.updateUi()
        })
        app.stage.addChild(zoneGraphic)
    }

    updateZone(zoneId: Zone["id"], updatedZone: Zone): void {
        const findZone = this.getZoneById(zoneId)
        if (!findZone) {
            console.log("failed to update zone due to not finding zone object")
            return
        }

        this.zones = this.zones.map(zone => {
            if (zone.id === zoneId) {
                zone = updatedZone
                return zone
            } else return zone
        })
        this.reDrawZone(zoneId)
        uiManager.updateUi()
    }

    reDrawZone(zoneId: Zone["id"]): void {
        const zone = this.getZoneById(zoneId)
        if (!zone) {
            console.log("Failed to re draw zone due to not finding zone object")
            return
        }


        app.stage.children.filter(c => c instanceof ZoneGraphic).forEach(z => {
            if (z.id === zoneId) {
                z.clear()
                z.rect(zone.startPoint.x, zone.startPoint.y, zone.width, zone.height)
                z.fill(zone.color)
                z.alpha = zone.opacity
            }
        })
    }

    getZoneById(zoneId: Zone["id"]): Zone | null {
        return this.zones.find(zone => zone.id === zoneId) || null
    }

    deleteZone(zoneId: Zone["id"]): void {
        const findZone = this.getZoneById(zoneId)
        if (!findZone) {
            console.log("failed to delete zone due to not finding zone object.")
            return
        }
        const zoneGraphic = app.stage.children.filter(c => c instanceof ZoneGraphic).find(z => z.id === zoneId)
        if (!zoneGraphic) {
            console.log("Failed to delete zone due to not finding zone graphic")
            return
        }

        // Remove from the zoneManager zones array 
        this.zones = this.zones.filter(z => z.id !== zoneId)
        
        // Remove from the pixijs canvas
        app.stage.removeChild(zoneGraphic)

        uiManager.updateUi()
    }
}

export class ZoneGraphic extends Graphics {
    id: string

    constructor(id: string) {
        super()
        this.id = id
    }
}