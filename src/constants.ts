
const NODE_SIZE = 20
export const GAME_VALUES = { 
    // The default color of a node (point)
    DEFAULT_NODE_COLOR: "white",
    // The size of a node (point)
    NODE_SIZE: NODE_SIZE,
    // The size of a nodes hitbox
    NODE_HITBOX_SIZE: NODE_SIZE + 20,
    // The minimun distance two nodes must be apart in order to be placed.
    MIN_DISTANCE_BETWEEN_NODES: 50,
    // The default color of a zone when first created
    DEFAULT_ZONE_COLOR: "white",
    // The default opacity of the zone
    DEFAULT_ZONE_OPACITY: 0.5,
    // The min size in width & height a zone must be inorder to be created
    MIN_ZONE_SIZE: 50,
    // The width of the world (canvas)
    WORLD_WIDTH: 5000,
    // The height of the world (canvas)
    WORLD_HEIGHT: 5000,
    // The width of a edge (line) when first created
    MIN_EDGE_WIDTH: 75
} as const