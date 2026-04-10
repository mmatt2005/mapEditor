import { Sprite, Texture, Ticker } from "pixi.js";
import { graphManager, pathFindingDebug, spritesheet, uiManager, worldLayer } from "../core/main";
import { GameObjectsZIndex, PROPS, type Vehicle } from "../types";
import { v4 as uuidv4 } from "uuid"
import type { EdgeGraphic } from "./edge";

export class VehicleSprite extends Sprite implements Vehicle {
    private currentEdge: EdgeGraphic | null = null
    editorType: Vehicle["editorType"] = "vehicle"
    id: Vehicle["id"] = uuidv4()

    constructor() {
        super()
        this.draw()
    }

    public setCurrentEdge(currentEdge: VehicleSprite["currentEdge"]): void {
        this.currentEdge = currentEdge
    }

    public getCurrentEdge(): VehicleSprite["currentEdge"] {
        return this.currentEdge
    }

    private draw(): void {
        const carFrame = PROPS.find(p => p.propName === "car")
        if (!carFrame) {
            console.log("Failed to draw car due to not having carFrame")
            return
        }


        this.texture = new Texture({ source: spritesheet.source, frame: carFrame.frame })
        this.width = 20
        this.height = 32
        this.anchor.set(0.5, 0.5)
        this.zIndex = GameObjectsZIndex.vehicle

        this.eventMode = "static"
        this.on("click", () => {
            uiManager.setSideMenu("vehicle", this.getVehicleObject())
        })

        worldLayer.addChild(this)
    }

    public getVehicleObject(): Vehicle {
        return {
            editorType: this.editorType,
            id: this.id
        }
    }

    public moveTo(): void {
        const path = pathFindingDebug.pathfind()
        const vehicleTicker = new Ticker()

        vehicleTicker.add(() => {
            if (path.length === 0) {
                console.log("We've reached the TARGET!")
                vehicleTicker.stop()
                return
            }

            const targetNodeId = path[0]
            const targetNode = graphManager.getNodeGraphic(targetNodeId.id)
            if (!targetNode) return

            const dx = targetNode.position.x - this.position.x
            const dy = targetNode.position.y - this.position.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 1) {
                console.log("We've reached the node")
                path.shift()
                return
            }

            const speed = 1
            const vx = (dx / distance) * speed
            const vy = (dy / distance) * speed

            this.position.x += vx
            this.position.y += vy

            // optional: rotate vehicle
            this.angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
        })

        vehicleTicker.start()
    }
}