import type { Node } from "../../types";

export default function SideMenuNode({ node }: { node: Node }) {
    return <>
        {JSON.stringify(node, null, 4)}
    </>
}