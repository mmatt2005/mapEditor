import type { Point } from "pixi.js";
import { highlightManager, viewport } from "../core/main";

export class EventsManager {
    mousePosition: Point | null = null
    isCtrlKeyDown: boolean = false
    isShiftKeyDown: boolean = false
    isBackTickKeyDown: boolean = false

    constructor() {
        viewport.addEventListener("mousemove", (event) => {
            const position = viewport.toWorld(event.global.x, event.global.y)
            this.mousePosition = position
        })

        viewport.on("click", (event) => { 
            if (this.isBackTickKeyDown) {
                const position = viewport.toWorld(event.global.x, event.global.y)
                console.log(`x: ${position.x}, y: ${position.y}`)
            }
        })
    
        document.addEventListener("keydown", (event) => { 
            if (event.key === "Control") {
                this.isCtrlKeyDown = true
            } else if (event.key === "Shift") {
                this.isShiftKeyDown = true
            } else if (event.key === "`") {
                this.isBackTickKeyDown = true
            } else if (event.key === "*" && this.isShiftKeyDown) {
                highlightManager.unHighlight()
            }
        })

        document.addEventListener("keyup", (event) => { 
            if (event.key === "Control") {
                this.isCtrlKeyDown = false
            } else if (event.key === "Shift") {
                this.isShiftKeyDown = false
            } else if (event.key === "`") {
                this.isBackTickKeyDown = false
            }
        })
    }
}