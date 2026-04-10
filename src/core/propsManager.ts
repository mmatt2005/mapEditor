import { Rectangle, Sprite, Texture } from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import { highlightManager, spritesheet, uiManager, viewport, worldLayer } from "../core/main";
import { GameObjectsZIndex, PROPS, type Prop } from "../types";

export class PropsManager {
    selectedProp: PropSprite | null = null

    constructor() {
        viewport.on("mousemove", (event) => {
            if (this.selectedProp) {
                const position = viewport.toWorld(event.global.x, event.global.y)
                this.selectedProp.position.set(position.x, position.y)
            }
        })

        viewport.on("click", () => {
            if (this.selectedProp) {
                this.selectedProp = null
            }
        })
    }

    public selectProp(selectedPropName: Prop["propName"], selectedPropFrame: Rectangle): void {
        this.unselectProp()

        const propTexture = new Texture({ source: spritesheet.source, frame: selectedPropFrame })
        this.selectedProp = new PropSprite()
        this.selectedProp.texture = propTexture
        this.selectedProp.zIndex = GameObjectsZIndex.prop
        this.selectedProp.propName = selectedPropName
        this.selectedProp.eventMode = "static"
        this.selectedProp.on("click", this.selectedProp.handleClick)

        worldLayer.addChild(this.selectedProp)
    }

    public unselectProp(): void { 
        if (this.selectedProp) {
            worldLayer.removeChild(this.selectedProp)
            this.selectedProp = null
            uiManager.updateUi()
        }
    }

    public getPropSprite(propId: Prop["id"]): PropSprite | null {
        return worldLayer.children.filter(c => c instanceof PropSprite).find(sprite => sprite.id === propId) || null 
    }
}

export class PropSprite extends Sprite implements Prop {
    parentPoint: Prop["parentPoint"] = null
    parentEdgeId: Prop["parentEdgeId"] = null
    editorType: Prop["editorType"] = "prop"
    id: string = uuidv4()
    propName: Prop["propName"] = "basic house"

    public handleClick(): void { 
        highlightManager.highlight(this)
        uiManager.setSideMenu("prop", this.getPropObject())
    }

    public getPropObject(): Prop {
        return {
            id: this.id,
            propName: this.propName,
            parentPoint: this.parentPoint,
            editorType: this.editorType,
            x: this.position.x,
            y: this.position.y,
            angle: this.angle,
            parentEdgeId: this.parentEdgeId
        }
    }

    public getPropFrameFromPropName(propName: Prop["propName"]): Rectangle | null { 
        const propObject = PROPS.find(prop => prop.propName === propName) 
        if (!propObject) {
            console.log("Failed to getPropFrameFromPropName due to not finding propObject")
            return null
        }

        return propObject.frame
    }

    public updateProp(newProp: Prop): void { 
        this.angle = newProp.angle
        this.parentEdgeId = newProp.parentEdgeId
        this.parentPoint = newProp.parentPoint
        uiManager.updateUi()
    }
}

export class LoadPropSprite extends PropSprite {
    constructor(prop: Prop) {
        super()
        this.id = prop.id
        this.editorType = prop.editorType
        this.propName = prop.propName
        this.parentPoint = prop.parentPoint
        this.parentEdgeId = prop.parentEdgeId
        this.angle = prop.angle
        this.zIndex = GameObjectsZIndex.prop
        this.anchor.set(0.5)
        this.position.set(prop.x, prop.y)
        this.eventMode = "static"
        this.on("click", this.handleClick)

        const propFrame = this.getPropFrameFromPropName(prop.propName)
        if (!propFrame) {
            console.log("Failed to set load prop due to failing to find propFrame")
            return
        }

        const texture = new Texture({source: spritesheet.source, frame: propFrame})
        this.texture = texture

        worldLayer.addChild(this)
    }
}