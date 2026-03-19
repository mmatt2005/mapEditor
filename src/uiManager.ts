import { Circle, Graphics, Point, Text } from "pixi.js"
import { app } from "./main"
import { GraphManager, type Node } from "./graphManager"
import { v4 as uuidv4 } from "uuid"

export class UiManager {
    graphManager: GraphManager = new GraphManager()
    selectedNode: Node | null = null
    isCtrlKeyDown: boolean = false


    constructor() {

        document.addEventListener("keydown", event => {
            if (event.key === "Control") {
                this.isCtrlKeyDown = true
            }
        })

        document.addEventListener("keyup", event => {
            if (event.key === "Control") {
                this.isCtrlKeyDown = false
            }
        })

        app.canvas.addEventListener("click", event => {

            if (this.isCtrlKeyDown) {
                const position = new Point(event.clientX, event.clientY)
                const id = uuidv4()

                for (const pt of this.graphManager.nodes) {
                    if (this.calculateDistanceBetweenTwoPoints(pt.position, position) <= 50) {
                        console.log("Failed to draw point due to point being too close to another point...")
                        return
                    }
                }

                this.drawNode(position, id)
                this.graphManager.addNode(position, id)
            }
        })
    }

    /** @description updates the react ui with the most up to date uiManager class  */
    updateUi(): void { }


    /**
     * @description draws a node (point) at a given point (x, y)
     * @param {Point} point 
     */
    drawNode(point: Point, id: string): void {
        const node = new NodeGraphics(id)
        node.circle(point.x, point.y, 10)
        node.fill("white")
        node.eventMode = "static"
        node.hitArea = new Circle(point.x, point.y, 30)
        node.on("click", () => {
            console.log(node.id)
            const getNode = this.graphManager.getNodeById(node.id)
            if (!getNode) return console.log("Failed to get node so nopoe!")

            if (!this.selectedNode) {
                this.selectedNode = getNode
            } else {
                this.drawEdge(this.selectedNode.position, new Point(point.x, point.y))
                this.graphManager.addNodeConnection(this.selectedNode.id, getNode.id)
                this.selectedNode = null
            }

            this.updateUi()
        })
        app.stage.addChild(node)
    }

    drawEdge(pt1: Point, pt2: Point): void {
        const edge = new Graphics()
        edge.moveTo(pt1.x, pt1.y)
        edge.lineTo(pt2.x, pt2.y)
        edge.stroke({ color: "blue", width: 3 })
        app.stage.addChild(edge)
    }

    calculateDistanceBetweenTwoPoints(pt1: Point, pt2: Point): number {
        const dx = pt1.x - pt2.x;
        const dy = pt1.y - pt2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance
    }
}

class NodeGraphics extends Graphics {
    id: string

    constructor(id: string) {
        super()
        this.id = id
    }

}