import { Rectangle, type Point } from "pixi.js"
import type { PropsManager } from "./propsManager"

export interface EditorDefaults<T extends string> {
    editorType: T
    id: string
}

export interface Node extends EditorDefaults<"node"> {
    position: Point
}

export interface Edge extends EditorDefaults<"edge"> {
    node1Id: Node["id"]
    node2Id: Node["id"]
    edgeWidth: number
    type: "normal" | "highway"

}

export interface Zone extends EditorDefaults<"zone"> {
    startPoint: Point
    zoneWidth: number
    zoneHeight: number
    color: string
    opacity: number
    type: "countryside" | "downtown" | "school" | "none"

}

export interface Prop extends EditorDefaults<"prop"> {
    x: number
    y: number
    angle: number
    propName: (typeof PROPS)[number]["propName"]
    parentPoint: { x: number, y: number } | null
    parentEdgeId: Edge["id"] | null
}

export interface GameData {
    nodes: Node[]
    edges: Edge[]
    zones: Zone[]
    props: Prop[]
}

export const EDGE_TYPES: Edge["type"][] = ["normal", "highway"]

export const GameMapOptions = {
    SMALL_TOWN: "map_smallTown.json",
    CITY: "map_city.json"
} as const;



export const PROPS: {
    frame: Rectangle,
    propName: "basic house" | "skyscraper" | "police station"
}[] = [
        {
            frame: new Rectangle(0, 0, 32, 32),
            propName: "basic house"
        },
        {
            frame: new Rectangle(32, 0, 32, 32),
            propName: "skyscraper"
        },
        {
            frame: new Rectangle(0, 32, 32, 32,),
            propName: "police station"
        }
    ]

export enum GameObjectsZIndex {
    background = 1,
    zone,
    edge,
    edgeHitbox,
    point,
    prop
}

export const ZONE_TYPES: Zone["type"][] = ["countryside", "downtown", "school", "none"]
