'use client';

import { useTranslations } from 'next-intl';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const TrademarkAppealChart = () => {
  const t = useTranslations('litigationPaths.charts.trademarkAppeal');

  const nodes: Node[] = [
    {
      id: 'appeal-saip',
      position: { x: 200, y: -200 },
      data: {
        label: (
          <div className="bg-white shadow-lg rounded-sm p-4 text-center w-full max-w-[280px]">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">{t('appealSaip')}</h3>
            <p className="text-xs text-gray-600">{t('appealSaipNote')}</p>
          </div>
        ),
      },
      style: { width: 300 },
      type: 'default',
      sourcePosition: Position.Right,
    },
    {
      id: 'trademark-committee',
      position: { x: 600, y: -182 },
      data: {
        label: (
          <div className="bg-white shadow-lg rounded-sm p-4 text-center w-full max-w-[280px]">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">{t('trademarkCommittee')}</h3>
          </div>
        ),
      },
      style: { width: 300 },
      type: 'default',
      targetPosition: Position.Left,
    },
    {
      id: 'appeal-committee',
      position: { x: 600, y: -18 },
      data: {
        label: (
          <div className="bg-white shadow-lg rounded-sm p-4 text-center w-full max-w-[280px]">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">{t('appealCommittee')}</h3>
            <p className="text-xs text-gray-600">{t('appealCommitteeNote')}</p>
          </div>
        ),
      },
      style: { width: 300 },
      type: 'default',
      sourcePosition: Position.Right,
    },
    {
      id: 'commercial-court',
      position: { x: 1000, y: 0 },
      data: {
        label: (
          <div className="bg-white shadow-lg rounded-sm p-4 text-center w-full max-w-[280px]">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">{t('commercialCourt')}</h3>
          </div>
        ),
      },
      style: { width: 300 },
      type: 'default',
      targetPosition: Position.Left,
    },
  ];

  const edges: Edge[] = [
    {
      id: 'edge-1',
      source: 'appeal-saip',
      target: 'trademark-committee',
      type: 'step',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
    {
      id: 'edge-2',
      source: 'trademark-committee',
      target: 'appeal-committee',
      type: 'step',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
    {
      id: 'edge-3',
      source: 'appeal-committee',
      target: 'commercial-court',
      type: 'step',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
  ];

  return (
    <div className="w-full h-[400px] bg-gray-50 rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        minZoom={0.3}
        maxZoom={1.2}
        snapToGrid
        snapGrid={[10, 10]}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <MiniMap
          nodeStrokeColor={() => '#067647'}
          nodeColor={() => '#fff'}
          nodeBorderRadius={4}
          pannable
          zoomable
        />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default TrademarkAppealChart;
