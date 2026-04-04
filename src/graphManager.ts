import { Circle, Graphics, Point } from "pixi.js"
import { v4 as uuidv4 } from "uuid"
import { GAME_VALUES } from "./constants"
import { eventsManager, graphManager, uiManager, viewport, worldLayer } from "./main"
import { GameObjectsZIndex, type Edge, type Node, type Zone } from "./types"
import { ZoneGraphic } from "./zoneManager"

export class GraphManager {
    private selectedNode: Node | null = null

    constructor() {
        viewport.on("click", (event) => {
            if (eventsManager.isCtrlKeyDown) {
                const position = viewport.toWorld(event.global.x, event.global.y)
                new NodeGraphic().createNodeGraphic(position)
            }
        })
    }

    public getSelectedNode(): Node | null {
        return this.selectedNode
    }

    public setSelectedNode(selectedNode: Node | null): void {
        this.selectedNode = selectedNode
        uiManager.updateUi()
    }

    public getZoneGraphic(zoneId: Zone["id"]): ZoneGraphic | null {
        return worldLayer.children.filter(f => f instanceof ZoneGraphic).find(z => z.id === zoneId) || null
    }

    public getEdgeGraphic(edgeId: Edge["id"]): EdgeGraphic | null {
        return worldLayer.children.filter(f => f instanceof EdgeGraphic).find(e => e.id === edgeId) || null
    }

    public getNodeGraphic(nodeId: Node["id"]): NodeGraphic | null {
        return worldLayer.children.filter(f => f instanceof NodeGraphic).find(n => n.id === nodeId) || null
    }
}

export class EdgeGraphic extends Graphics implements Edge {
    id: string = uuidv4()
    edgeWidth: number = GAME_VALUES.EDGE_WIDTH
    type: Edge["type"] = "normal"
    editorType: Edge["editorType"] = "edge"
    node1Id: Node["id"] = ""
    node2Id: Node["id"] = ""
    public updateEdge(newEdge: Edge): void {
        const node1 = graphManager.getNodeGraphic(newEdge.node1Id)
        const node2 = graphManager.getNodeGraphic(newEdge.node2Id)

        if (!node1 || !node2) {
            console.log("Failed to updateEdge due to not having required nodes")
            return
        }

        this.edgeWidth = newEdge.edgeWidth

        this.clear()
        this.draw(node1, node2)

        uiManager.updateUi()
    }

    private handleClick() {
        uiManager.setSideMenu("edge", this.getEdgeObject())
    }

    public getEdgeObject(): Edge {
        return {
            id: this.id,
            edgeWidth: this.edgeWidth,
            type: this.type,
            editorType: this.editorType,
            node1Id: this.node1Id,
            node2Id: this.node2Id
        }
    }

    public createEdgeGraphic(node1: Node, node2: Node): void {
        const edgeHitbox = new Graphics()
        edgeHitbox.moveTo(node1.position.x, node1.position.y)
        edgeHitbox.lineTo(node2.position.x, node2.position.y)
        edgeHitbox.stroke({ width: GAME_VALUES.EDGE_WIDTH + 10, alpha: 0.0 })
        edgeHitbox.eventMode = "static"
        edgeHitbox.zIndex = GameObjectsZIndex.edgeHitbox
        edgeHitbox.on("click", () => this.handleClick())

        this.node1Id = node1.id
        this.node2Id = node2.id
        this.draw(node1, node2)

        worldLayer.addChild(this)
        worldLayer.addChild(edgeHitbox)
    }

    private draw(node1: Node, node2: Node): void {
        // Draw the gray road
        this.moveTo(node1.position.x, node1.position.y)
        this.lineTo(node2.position.x, node2.position.y)
        this.stroke({ width: this.edgeWidth, color: "darkgray" })
        this.zIndex = GameObjectsZIndex.edge

        // Draw the Yellow line
        this.moveTo(node1.position.x, node1.position.y)
        this.lineTo(node2.position.x, node2.position.y)
        this.stroke({ width: 5, color: "yellow" })
    }
}

export class NodeGraphic extends Graphics implements Node {
    id: string = uuidv4()
    editorType: Node["editorType"] = "node"

    private handleClick() {
        const selectedNode = graphManager.getSelectedNode()
        if (selectedNode) {
            new EdgeGraphic().createEdgeGraphic(this.getNodeObject(), selectedNode)
            graphManager.setSelectedNode(null)
        } else {
            graphManager.setSelectedNode(this.getNodeObject())
            uiManager.setSideMenu("node", this.getNodeObject())
        }
    }

    public getNodeObject(): Node {
        return {
            id: this.id,
            position: new Point(this.position.x, this.position.y),
            editorType: this.editorType,
        }
    }

    public createNodeGraphic(position: Point): void {
        this.circle(0, 0, GAME_VALUES.NODE_SIZE)
        this.fill(GAME_VALUES.DEFAULT_NODE_COLOR)

        this.position.set(position.x, position.y)
        this.zIndex = GameObjectsZIndex.point

        this.eventMode = "static"
        this.hitArea = new Circle(0, 0, GAME_VALUES.NODE_HITBOX_SIZE)
        this.on("click", this.handleClick)

        worldLayer.addChild(this)
    }
}


export class LoadNodeGraphic extends NodeGraphic {
    constructor(node: Node) {
        super()
        this.id = node.id
        this.createNodeGraphic(node.position)
    }
}

export class LoadEdgeGraphic extends EdgeGraphic {
    constructor(node1: Node, node2: Node, edge: Edge) {
        super()
        this.id = edge.id
        this.createEdgeGraphic(node1, node2)
    }
}