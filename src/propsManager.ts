import { Assets, Sprite, Texture } from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import { app, uiManager, viewport, worldLayer } from "./main";
import { GameObjectsZIndex, PROPS, type Prop } from "./types";

export class PropsManager {
    selectedProp: PropSprite | null = null
    props: Prop[] = []
    isBackTickKeyDown: boolean = false
    spritesheet: Texture | null = null

    constructor() {
        this.loadSpriteSheet()

        viewport.addEventListener("mousemove", (event) => {
            if (this.selectedProp) {
                const test = viewport.toWorld(event.global.x, event.global.y)
                this.selectedProp.position.set(test.x, test.y)
            }
        })

        document.addEventListener("keydown", (event) => {
            if (event.key === "`") {
                this.isBackTickKeyDown = true
            }
        })

        document.addEventListener("keyup", (event) => {
            if (event.key === "`") {
                this, this.isBackTickKeyDown = false
            }
        })

        viewport.on("click", (event) => {


            if (this.isBackTickKeyDown) {
                const {x, y} = viewport.toWorld(event.global.x, event.global.y)
                console.log(x, y)
            }

            if (this.selectedProp) {
                this.placeProp(this.selectedProp.propId)
            }
        })
    }

    private async loadSpriteSheet(): Promise<void> {
        const spritesheet: Texture = await Assets.load("/assets/places.png")

        this.spritesheet = spritesheet
    }

    loadProp(propId: Prop["id"]): void {
        const getProp = this.getPropById(propId)
        if (!getProp) {
            console.log("Failed to load prop due to no prop object")
            return
        }

        const propTexture = this.getPropTexture(getProp.name)
        if (!propTexture) {
            console.log("Failed to load prop due to no prop texture")
            return
        }

        const propSprite = new PropSprite(propTexture, getProp.id, getProp.name)
        propSprite.position.set(getProp.x, getProp.y)
        propSprite.zIndex = GameObjectsZIndex.prop
        propSprite.eventMode = "static"
        propSprite.on("click", () => {
            uiManager.selected = getProp
            uiManager.showSideMenu("prop")
            uiManager.updateUi()
        })
        worldLayer.addChild(propSprite)

    }

    placeProp(propId: Prop["id"]): void {
        if (!this.selectedProp) {
            console.log("Failed to place prop due to no selected prop object")
            return
        }

        const propTexture = this.getPropTexture(this.selectedProp.propName)
        if (!propTexture) {
            console.log("Failed to place prop due to no prop texture")
            return
        }

        const propSprite = new PropSprite(propTexture, propId, this.selectedProp.propName)
        propSprite.position.set(this.selectedProp.x, this.selectedProp.y)
        propSprite.zIndex = GameObjectsZIndex.prop

        const prop: Prop = {
            id: propId,
            name: this.selectedProp.propName,
            x: propSprite.position.x,
            y: propSprite.position.y,
            rotation: 0,
            parentPoint: { x: 0, y: 0 },
            editorType: "prop"
        }
        this.props.push(prop)

        propSprite.eventMode = "static"
        propSprite.on("click", () => {
            uiManager.selected = prop
            uiManager.showSideMenu("prop")
            uiManager.updateUi()
        })


        worldLayer.addChild(propSprite)

        this.unselectProp()
    }

    selectProp(propName: Prop["name"]): void {
        this.unselectProp()

        const propTexture = this.getPropTexture(propName)
        if (!propTexture) {
            console.log("Failed to set selected prop due to failing to get prop texture")
            return
        }

        const propId = uuidv4()
        const propSprite = new PropSprite(propTexture, propId, propName)
        worldLayer.addChild(propSprite)

        this.selectedProp = propSprite
        uiManager.updateUi()
    }

    unselectProp(): void {
        if (this.selectedProp) {
            worldLayer.removeChild(this.selectedProp)
            this.selectedProp = null
            uiManager.updateUi()
        }
    }

    updateProp(propId: Prop["id"], newProp: Prop): void {
        const getProp = this.getPropById(propId)
        if (!getProp) {
            console.log("Failed to update prop due to not finding prop object")
            return
        }

        this.props = this.props.map(prop => {
            if (prop.id === propId) {
                return newProp
            } else return prop
        })

        this.reDrawProp(propId)
        uiManager.updateUi()
    }

    reDrawProp(propId: Prop["id"]): void {
        const getProp = this.getPropById(propId)
        if (!getProp) {
            console.log("Failed to re draw prop due to not finding prop object")
            return
        }

        const getPropSprite = worldLayer.children.filter(c => c instanceof PropSprite).find(prop => prop.propId === propId)
        if (!getPropSprite) {
            console.log("Failed to re draw prop due to not finding prop sprite")
            return
        }

        // getPropSprite.rotation = Math.PI / getProp.rotation 
    }

    getPropTexture(propName: Prop["name"]): Texture | null {
        const propFrame = PROPS.find(prop => prop.name === propName)
        if (!propFrame) {
            console.log("Failed to get prop texture due to failing to find prop frame")
            return null
        }

        if (!this.spritesheet) {
            console.log("Failed to get prop texture due to spritesheet being null")
            return null
        }

        return new Texture({ source: this.spritesheet.source, frame: propFrame.frame })
    }

    getPropByName(propName: Prop["name"]): Prop | null {
        return this.props.find(prop => prop.name === propName) || null
    }

    getPropById(propId: Prop["id"]): Prop | null {
        return this.props.find(prop => prop.id === propId) || null
    }

    deleteProp(propId: Prop["id"]): void {
        console.log(this.props)
        console.log(propId)
        this.props = this.props.filter(prop => prop.id !== propId)
        console.log(this.props)

        const getPropSprite = worldLayer.children.filter(c => c instanceof PropSprite).find(prop => prop.propId === propId)
        console.log(getPropSprite?.propId)
        if (!getPropSprite) {
            console.log("Failed to delete prop due to not finding prop sprite")
            return
        }

        worldLayer.removeChild(getPropSprite)

        uiManager.updateUi()
    }
}

export class PropSprite extends Sprite {
    propId: string
    propName: Prop["name"]

    constructor(texture: Texture, propId: string, propName: Prop["name"]) {
        super(texture)
        this.propId = propId
        this.propName = propName
    }
}