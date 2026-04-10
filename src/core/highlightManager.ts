import { Graphics, Sprite } from "pixi.js";
import type { EdgeGraphic } from "./edge";
import type { NodeGraphic } from "./node";
import type { PropSprite } from "./propsManager";

type HighlightableObjects = EdgeGraphic | NodeGraphic | PropSprite

export class HighlightManager {
    highlighted: (Graphics | Sprite)[] = []

    public highlight(type: HighlightableObjects): void {
        this.unHighlight()

        if (type.editorType === "edge") {
            this.highlightEdge(type)
        } else if (type.editorType === "node") {
            this.highlightNode(type)
        } else if (type.editorType === "prop") {
            this.highlightProp(type)
        }

    }

    public unHighlight(): void {
        this.highlighted.forEach(h => {
            h.tint = "0xFFFFFF"
        })
        this.highlighted = []
    }

    private highlightEdge(edge: EdgeGraphic): void {
        this.highlighted.push(edge)
        edge.tint = "orange"
    }

    private highlightNode(node: NodeGraphic): void {
        this.highlighted.push(node)
        node.tint = "orange"
    }

    private highlightProp(prop: PropSprite): void {
        this.highlighted.push(prop)
        prop.tint = "orange"
    }
}