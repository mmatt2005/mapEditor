import { Rectangle, type Point } from "pixi.js"
import type { GraphManager } from "./graphManager"
import type { ZoneManager } from "./zoneManager"
import type { PropsManager } from "./propsManager"

interface EditorDefaults<T extends string> {
    editorType: T
    id: string
}

export interface Node extends EditorDefaults<"node"> {
    position: Point
    connections: Edge[]

}

export interface Edge extends EditorDefaults<"edge"> {
    connectionNodeId: Node["id"]
    edgeWidth: number
    type: "normal" | "highway"

}

export interface Zone extends EditorDefaults<"zone"> {
    startPoint: Point
    width: number
    height: number
    color: string
    opacity: number
    type: "countryside" | "downtown" | "school" | "none"

}

export interface Prop extends EditorDefaults<"prop"> {
    x: number
    y: number
    rotation: number
    name: (typeof PROPS)[number]["name"]
    parentPoint: { x: number, y: number }
}

export interface GameData {
    mapGraph: GraphManager["nodes"]
    zones: ZoneManager["zones"]
    props: PropsManager["props"]
}

export const EDGE_TYPES: Edge["type"][] = ["normal", "highway"]

export const GameMapOptions = {
    SMALL_TOWN: "map_smallTown.json",
    CITY: "map_city.json"
} as const;



export const PROPS: {
    frame: Rectangle,
    name: "basic house" | "skyscraper" | "police station"
}[] = [
        {
            frame: new Rectangle(0, 0, 32, 32),
            name: "basic house"
        },
        {
            frame: new Rectangle(32, 0, 32, 32),
            name: "skyscraper"
        },
        {
            frame: new Rectangle(0, 32, 32, 32,),
            name: "police station"
        }
    ]

export enum GameObjectsZIndex {
    background = 1,
    zone,
    edge,
    point,
    prop
}

export const ZONE_TYPES: Zone["type"][] = ["countryside", "downtown", "school", "none"]
