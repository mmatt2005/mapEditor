import { Circle, Graphics, Point } from "pixi.js"
import { v4 as uuidv4 } from "uuid"
import { GAME_VALUES } from "../constants"
import { graphManager, highlightManager, uiManager, worldLayer } from "../core/main"
import { GameObjectsZIndex, type Node } from "../types"
import { EdgeGraphic } from "./edge"

export class NodeGraphic extends Graphics implements Node {
    id: string = uuidv4()
    editorType: Node["editorType"] = "node"

    private handleClick() {
        highlightManager.highlight(this)
        
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