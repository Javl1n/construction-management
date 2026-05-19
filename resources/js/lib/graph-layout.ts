import dagre from '@dagrejs/dagre';
import { Node, Edge } from "@xyflow/react";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function getLayoutedElements(nodes: Node[], edges: Edge[]) {
    const g = new dagre.graphlib.Graph();

    g.setGraph({
        rankdir: 'TB',
        ranksep: 80,
        nodesep: 40,
    });

    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach(node => {
        g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    });

    edges.forEach(edge => {
        g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const layoutedNodes = nodes.map(node => {
        const { x, y } = g.node(node.id);

        return {
            ...node,
            position: {
                x: x - NODE_WIDTH / 2,
                y: y - NODE_HEIGHT / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges }
}

