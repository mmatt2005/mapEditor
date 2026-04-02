import { Graphics, Point } from "pixi.js"
import { app, eventsManager, uiManager, viewport, worldLayer } from "./main"
import { v4 as uuidv4 } from "uuid"
import { GameObjectsZIndex, type Zone } from "./types"
import { GAME_VALUES } from "./constants"

export class ZoneManager {
    isMouseDown: boolean = false
    mouseDownPosition: Point | null = null
    zones: Zone[] = []

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

                this.addZone(
                    {
                        startPoint: new Point(startX, startY),
                        width: zoneWidth,
                        height: zoneHeight,
                        color: GAME_VALUES.DEFAULT_ZONE_COLOR,
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
        worldLayer.addChild(zoneGraphic)
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


        worldLayer.children.filter(c => c instanceof ZoneGraphic).forEach(z => {
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
        const zoneGraphic = worldLayer.children.filter(c => c instanceof ZoneGraphic).find(z => z.id === zoneId)
        if (!zoneGraphic) {
            console.log("Failed to delete zone due to not finding zone graphic")
            return
        }

        // Remove from the zoneManager zones array 
        this.zones = this.zones.filter(z => z.id !== zoneId)

        // Remove from the pixijs canvas
        worldLayer.removeChild(zoneGraphic)

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