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

const TrademarkObjectionChart = () => {
  const t = useTranslations('litigationPaths.charts.trademarkObjection');

  const nodes: Node[] = [
    {
      id: 'objection-saip',
      position: { x: 380, y: -100 },
      data: {
        label: (
          <div className="bg-white shadow-lg rounded-sm p-4 text-center w-[280px]">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">{t('objectRegistration')}</h3>
            <p className="text-xs text-gray-600">{t('objectNote')}</p>
          </div>
        ),
      },
      style: { width: 300 },
      type: 'default',
      sourcePosition: Position.Bottom,
    },
    {
      id: 'trademark-admin',
      position: { x: 400, y: 150 },
      data: {
        label: (
          <div className="bg-white shadow-lg rounded-sm p-4 text-center w-[240px]">
            <h3 className="text-sm font-semibold text-gray-800">{t('trademarkCommittee')}</h3>
          </div>
        ),
      },
      style: { width: 260 },
      type: 'default',
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    },
    {
      id: 'appeal-decision',
      position: { x: 400, y: 350 },
      data: {
        label: (
          <div className="bg-white shadow-lg rounded-sm p-4 text-center w-[280px]">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">{t('appealDecision')}</h3>
            <p className="text-xs text-gray-600">{t('appealNote')}</p>
          </div>
        ),
      },
      style: { width: 300 },
      type: 'default',
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    },
    {
      id: 'commercial-court',
      position: { x: 420, y: 550 },
      data: {
        label: (
          <div className="bg-white shadow-lg rounded-sm p-4 text-center w-[240px]">
            <h3 className="text-sm font-semibold text-gray-800">{t('commercialCourt')}</h3>
          </div>
        ),
      },
      style: { width: 260 },
      type: 'default',
      targetPosition: Position.Top,
    },
  ];

  const edges: Edge[] = [
    {
      id: 'edge-1',
      source: 'objection-saip',
      target: 'trademark-admin',
      type: 'smoothstep',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
    {
      id: 'edge-2',
      source: 'trademark-admin',
      target: 'appeal-decision',
      type: 'smoothstep',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
    {
      id: 'edge-3',
      source: 'appeal-decision',
      target: 'commercial-court',
      type: 'smoothstep',
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
        minZoom={0.5}
        maxZoom={1.5}
        snapToGrid
        snapGrid={[10, 10]}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <MiniMap nodeStrokeColor={() => '#067647'} nodeColor={() => '#fff'} nodeBorderRadius={4} />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default TrademarkObjectionChart;
