import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EntityNode from '../EntityNode';

const nodeTypes = {
    entity: EntityNode,
};

const initialNodes = [
    {
        id: '1',
        type: 'entity',
        position: { x: 250, y: 100 },
        data: {
            label: 'User Entity',
            fields: [
                { name: 'id', type: 'Long' },
                { name: 'username', type: 'String' },
                { name: 'email', type: 'String' }
            ]
        },
    },
];

export default function Home() {
    return (
        <div className="h-screen w-full bg-[#0b0f1a]">
            <ReactFlow
                nodes={initialNodes}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background color="#334155" gap={20} />
                <Controls />
            </ReactFlow>
        </div>
    );
}