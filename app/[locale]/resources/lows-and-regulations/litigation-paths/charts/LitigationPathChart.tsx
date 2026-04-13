'use client';

import React from 'react';
import { ReactFlow, Background, Controls, Handle, Position, useStore } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  LITIGATION_GRAPH_STRUCTURES,
  buildGraphEdges,
} from '@/lib/constants/litigation-graph-structures';
import type { PathwayNodeContent } from '@/lib/drupal/services/litigation-paths.service';
import type { Node, NodeProps } from '@xyflow/react';
import Button from '@/components/atoms/Button';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import styles from './LitigationPathChart.module.css';

interface LitigationPathChartProps {
  pathwayType: string;
  nodeContents: Record<string, PathwayNodeContent>;
}

type LitigationNodeData = {
  label: React.ReactNode;
  sourcePosition?: Position;
  targetPosition?: Position;
  extraSourcePositions?: Array<{ id: string; position: Position }>;
  extraTargetPositions?: Array<{ id: string; position: Position }>;
};

const handleBaseStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  background: '#111827',
  border: 'none',
};

const AR_PATHWAY_NODE_ALIASES: Record<string, Record<string, string[]>> = {
  trademark_cancellation: {
    'specialized-court': ['cancel-request'],
    'apply-cancellation': ['trademark-committee-cancel', 'appeal-decision-cancel'],
    'execution-cancel': ['commercial-court-cancel'],
  },
};

const LitigationNode = ({ data }: NodeProps) => {
  const nodeData = data as LitigationNodeData;
  const extraSources = nodeData.extraSourcePositions || [];
  const extraTargets = nodeData.extraTargetPositions || [];

  return (
    <div className="relative">
      {nodeData.targetPosition && (
        <Handle
          type="target"
          id="target-default"
          position={nodeData.targetPosition}
          style={handleBaseStyle}
        />
      )}
      {nodeData.sourcePosition && (
        <Handle
          type="source"
          id="source-default"
          position={nodeData.sourcePosition}
          style={handleBaseStyle}
        />
      )}
      {extraSources.map((source: { id: string; position: Position }) => (
        <Handle
          key={source.id}
          type="source"
          id={source.id}
          position={source.position}
          style={handleBaseStyle}
        />
      ))}
      {extraTargets.map((target: { id: string; position: Position }) => (
        <Handle
          key={target.id}
          type="target"
          id={target.id}
          position={target.position}
          style={handleBaseStyle}
        />
      ))}
      {nodeData.label}
    </div>
  );
};

const getNodeBox = (node: any) => {
  const position = node.internals?.positionAbsolute ??
    node.positionAbsolute ??
    node.position ?? { x: 0, y: 0 };
  const width =
    node.measured?.width ??
    node.width ??
    node.internals?.userNode?.width ??
    node.style?.width ??
    240;
  const height =
    node.measured?.height ??
    node.height ??
    node.internals?.userNode?.height ??
    node.style?.height ??
    80;

  return {
    id: node.id,
    x: position.x,
    y: position.y,
    width: Number(width),
    height: Number(height),
  };
};

const LitigationMiniMap = () => {
  const { nodes, edges, transform, width, height } = useStore((state) => ({
    nodes: Array.from(state.nodeLookup.values()),
    edges: Array.from(state.edgeLookup.values()),
    transform: state.transform,
    width: state.width,
    height: state.height,
  }));

  const boxes = nodes
    .map(getNodeBox)
    .filter((box) => Number.isFinite(box.width) && Number.isFinite(box.height));
  if (!boxes.length) {
    return null;
  }

  const minX = Math.min(...boxes.map((b) => b.x));
  const minY = Math.min(...boxes.map((b) => b.y));
  const maxX = Math.max(...boxes.map((b) => b.x + b.width));
  const maxY = Math.max(...boxes.map((b) => b.y + b.height));
  const padding = 40;
  const viewBox = {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };

  const zoom = transform?.[2] ?? 1;
  const viewX = -(transform?.[0] ?? 0) / zoom;
  const viewY = -(transform?.[1] ?? 0) / zoom;
  const viewWidth = (width ?? 0) / zoom;
  const viewHeight = (height ?? 0) / zoom;

  return (
    <div className={styles.minimap}>
      <svg
        className={styles.minimapSvg}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        role="img"
        aria-label="Mini Map"
      >
        <g className={styles.minimapEdges}>
          {edges.map((edge) => {
            const source = boxes.find((b) => b.id === edge.source);
            const target = boxes.find((b) => b.id === edge.target);
            if (!source || !target) {
              return null;
            }
            const x1 = source.x + source.width / 2;
            const y1 = source.y + source.height / 2;
            const x2 = target.x + target.width / 2;
            const y2 = target.y + target.height / 2;

            return <line key={edge.id} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
        <g className={styles.minimapNodes}>
          {boxes.map((box) => (
            <rect
              key={box.id}
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              rx={2}
              ry={2}
            />
          ))}
        </g>
        <rect
          className={styles.minimapViewport}
          x={viewX}
          y={viewY}
          width={viewWidth}
          height={viewHeight}
          rx={18}
          ry={18}
        />
      </svg>
    </div>
  );
};

const LitigationPathChart: React.FC<LitigationPathChartProps> = ({ pathwayType, nodeContents }) => {
  const locale = useLocale();
  // Get hardcoded structure for this pathway type
  const structure = LITIGATION_GRAPH_STRUCTURES[pathwayType];

  if (!structure) {
    console.error(`No graph structure found for pathway type: ${pathwayType}`);
    return (
      <div className="w-full h-[400px] bg-gray-50 rounded-xl border flex items-center justify-center">
        <p className="text-gray-500">Graph structure not found for {pathwayType}</p>
      </div>
    );
  }

  const spacingX = 1.18;
  const spacingY = 1.2;
  const orderedNodeContents = Object.values(nodeContents);

  const imageNodes: Record<string, { src: string; alt: string }> = {
    'investigation-prosecution': {
      src: '/images/investigation-prosecution.png',
      alt: 'Investigation and prosecution',
    },
    'public-prosecution-pat': {
      src: '/images/public-prosecution.png',
      alt: 'Public Prosecution',
    },
  };

  // Build nodes with Drupal content
  const nodes: Node[] = structure.nodes.map((nodeStructure, index) => {
    const directMatch = nodeContents[nodeStructure.id];
    const arAliases = AR_PATHWAY_NODE_ALIASES[pathwayType]?.[nodeStructure.id] || [];
    const arAliasMatch =
      locale === 'ar' ? arAliases.map((alias) => nodeContents[alias]).find(Boolean) : undefined;
    // Arabic-only resilience: if IDs drift in Drupal translation,
    // preserve Arabic content by using ordered fallback instead of technical IDs.
    const arOrderedFallback = locale === 'ar' ? orderedNodeContents[index] : undefined;
    const content = directMatch ||
      arAliasMatch ||
      arOrderedFallback || {
        id: nodeStructure.id,
        label: nodeStructure.id,
        note: '',
      };

    const isImageNode = nodeStructure.kind === 'image';
    const hasLogo = !isImageNode && Boolean(content.image);
    const imageContent = imageNodes[nodeStructure.id];

    return {
      id: nodeStructure.id,
      position: {
        x: nodeStructure.position.x * spacingX,
        y: nodeStructure.position.y * spacingY,
      },
      data: {
        label: isImageNode ? (
          <div
            className="bg-white border border-neutral-200 shadow-sm rounded-md p-3 w-full"
            style={{ width: `${nodeStructure.width}px` }}
          >
            <div className="w-full h-[132px] rounded-md overflow-hidden bg-neutral-50 flex items-center justify-center">
              {imageContent ? (
                <Image
                  src={imageContent.src}
                  alt={imageContent.alt}
                  width={240}
                  height={132}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-neutral-500">Image not available</div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="relative bg-white border border-neutral-200 shadow-sm rounded-md px-4 py-3 text-center w-full max-w-[280px] flex flex-col items-center justify-center gap-2"
            style={{ width: `${nodeStructure.width}px` }}
          >
            {hasLogo && content.image && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center">
                <Image
                  src={content.image.src}
                  alt={content.image.alt}
                  width={28}
                  height={28}
                  className="h-7 w-7"
                />
              </div>
            )}
            <h3
              className={
                hasLogo
                  ? 'text-sm font-semibold text-gray-800 pt-4'
                  : 'text-sm font-semibold text-gray-800'
              }
            >
              {content.label}
            </h3>
            {content.note && <p className="text-xs text-gray-600">{content.note}</p>}
            {content.button && (
              <div className="mt-2">
                <Button
                  intent="primary"
                  size="sm"
                  href={content.button.href}
                  ariaLabel={content.button.label}
                >
                  {content.button.label}
                </Button>
              </div>
            )}
          </div>
        ),
        sourcePosition: nodeStructure.sourcePosition,
        targetPosition: nodeStructure.targetPosition,
        extraSourcePositions: nodeStructure.extraSourcePositions || [],
        extraTargetPositions: nodeStructure.extraTargetPositions || [],
      } satisfies LitigationNodeData,
      style: {
        width: nodeStructure.width,
        background: 'transparent',
        border: 'none',
        padding: 0,
        boxShadow: 'none',
      },
      type: 'litigationNode',
    };
  });

  const edges = buildGraphEdges(structure);

  return (
    <div
      className={`w-full h-[420px] md:h-[600px] bg-gray-50 rounded-xl border border-neutral-200 relative ${styles.chart}`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ litigationNode: LitigationNode }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.45}
        maxZoom={1.5}
        snapToGrid
        snapGrid={[10, 10]}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent react-flow-no-handles"
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        nodesFocusable={false}
      >
        <div className={styles.minimapPanel}>
          <LitigationMiniMap />
        </div>
        <Controls position="bottom-right" />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default LitigationPathChart;
