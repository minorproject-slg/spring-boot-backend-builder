import { Handle, Position } from '@xyflow/react';

interface EntityField {
  name: string;
  type: string;
}

export default function EntityNode({ data }: { data: { label: string, fields: EntityField[] } }) {
  return (
    <div className="min-w-[180px] rounded-md border border-slate-700 bg-slate-900 shadow-2xl">
      {/* Node Header */}
      <div className="bg-indigo-600 px-3 py-1 rounded-t-md text-xs font-bold text-white flex justify-between">
        <span>{data.label}</span>
        <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-indigo-400" />
      </div>

      {/* Fields List */}
      <div className="p-2 space-y-1">
        {data.fields.map((field, index) => (
          <div key={index} className="flex justify-between text-[10px] text-slate-300 border-b border-slate-800 pb-1">
            <span>{field.name}</span>
            <span className="text-slate-500 italic">{field.type}</span>
          </div>
        ))}
      </div>

      {/* Output Port */}
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-indigo-400" />
    </div>
  );
}