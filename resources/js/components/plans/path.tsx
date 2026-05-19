import { CreatePlanProp } from "@/pages/plans/create";
import { CreateWorkItem } from "../items/create";
import { useEffect, useMemo } from "react";
import { ReactFlow, useNodesState, useEdgesState, NodeProps, Node, Handle, Position } from '@xyflow/react';
import { cn } from "@/lib/utils";
import '@xyflow/react/dist/style.css';
import { IconName } from "lucide-react/dynamic";
import { getLayoutedElements } from "@/lib/graph-layout";

function itemsToGraph(items: CreateWorkItem[]) {
    const nodes = items.map((item, index) => ({
        id: item.id.toString(),
        position: {
            x: (index % 4) * 200,
            y: Math.floor(index / 4) * 120
        },
        data: {
            label: item.name || `Work Item ${item.id}`,
            icon: item.icon,
            planned_days: item.planned_days,
            workers: item.laborers.map((laborer) => laborer.quantity).reduce((acc, val) => acc + val, 0)
        },
        type: 'item'
    }));

    const edges = items.flatMap(item =>
        (item.prerequisites ?? []).map(prereqId => ({
            id: `e${prereqId}-${item.id}`,
            source: prereqId.toString(),
            target: item.id.toString(),
            animated: true
        }))
    );

    return getLayoutedElements(nodes, edges);
}


function ItemNode({ data }: NodeProps<Node<{
    label: string,
    icon: IconName;
    planned_days: number;
    workers: number
}, 'item'>>) {
    return (
        <div className="border bg-card rounded overflow-hidden w-40 text-sm">
            <Handle type="target" position={Position.Top} />
            <div className="bg-accent p-1 font-bold">
                {data.label}
            </div>
            <div className="p-1">
                <div className="flex justify-between">
                    <span>
                        Days
                    </span>
                    {data.planned_days}
                </div>
                <div className="flex justify-between">
                    <span>
                        Workers
                    </span>
                    {data.workers}
                </div>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
}

export function PlanPath({ items }: { items: CreateWorkItem[] }) {
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => itemsToGraph(items),
        [items]
    )

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        const { nodes, edges } = itemsToGraph(items);
        setNodes(nodes);
        setEdges(edges)
    }, [items]);

    return (
        <div className={cn({
            "flex-1": true,
            "md:h-[calc(100vh-9.6rem)]": !open,
            "md:h-[calc(100vh-10.6rem)]": open,
        })}>
            <ReactFlow
                className="h-full w-full bg-blue-200"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                proOptions={{ hideAttribution: true }}
                nodeTypes={{
                    item: ItemNode
                }}
            />
        </div>
    )
}

