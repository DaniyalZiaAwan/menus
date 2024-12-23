import React, { useState, useEffect } from "react";
import {
  IoAddCircle,
  IoTrash,
  IoCreate,
  IoChevronDown,
  IoChevronUp,
} from "react-icons/io5";

export interface TreeNodeData {
  id?: string;
  name: string;
  depth?: number;
  parent?: string;
  children?: TreeNodeData[];
  parentName?: string;
}

interface TreeNodeProps {
  node: TreeNodeData;
  globalExpand: boolean;
  onEdit: (node: TreeNodeData) => void;
  onDelete: (nodeId: string) => void;
  onAdd: (parentNode: TreeNodeData) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  globalExpand,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [isExpanded, setIsExpanded] = useState(globalExpand);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const hasChildren = node.children && node.children.length > 0;

  // Sync with globalExpand state
  useEffect(() => {
    setIsExpanded(globalExpand);
  }, [globalExpand]);

  return (
    <div className="relative">
      {/* Node Content */}
      <div
        className="flex items-center cursor-pointer relative pl-4 mt-2"
        onMouseEnter={() => setHoveredNodeId(node.id!)}
        onMouseLeave={() => setHoveredNodeId(null)}
      >
        {hasChildren && (
          <div
            className={`mr-2 w-5 h-5 transform transition-transform`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <IoChevronDown /> : <IoChevronUp />}
          </div>
        )}
        <span className="text-gray-800 flex-1">{node.name}</span>

        {hoveredNodeId === node.id && (
          <div className="flex space-x-2 transition-opacity duration-200">
            {/* Add Icon */}
            <button onClick={() => onAdd(node)}>
              <IoAddCircle size={24} color="blue" />
            </button>

            {/* Edit Icon */}
            <button onClick={() => onEdit(node)}>
              <IoCreate size={24} color="blue" />
            </button>

            {/* Delete Icon */}
            <button onClick={() => onDelete(node.id!)}>
              <IoTrash size={24} color="red" />
            </button>
          </div>
        )}
      </div>

      {/* Child Nodes */}
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l border-gray-300 pl-4 mt-2">
          {node?.children?.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              globalExpand={globalExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
