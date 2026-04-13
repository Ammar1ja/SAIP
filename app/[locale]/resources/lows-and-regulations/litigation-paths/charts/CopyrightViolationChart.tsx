'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/atoms/Button';
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
import Image from 'next/image';

const CopyrightViolationChart = () => {
  const t = useTranslations('litigationPaths.charts.copyrightViolation');

  const nodes: Node[] = [
    {
      id: 'civil-lawsuits',
      position: { x: 150, y: 0 },
      data: {
        label: (
          <div className="bg-white shadow-md rounded-md p-4 text-center w-[200px]">
            <h3 className="text-sm font-medium text-gray-800">{t('civilLawsuits')}</h3>
          </div>
        ),
      },
      style: { width: 220 },
      type: 'default',
      sourcePosition: Position.Right,
    },
    {
      id: 'commercial-court',
      position: { x: 450, y: 0 },
      data: {
        label: (
          <div className="bg-white shadow-md rounded-md p-4 text-center w-[240px]">
            <h3 className="text-sm font-medium text-gray-800">{t('commercialCourt')}</h3>
          </div>
        ),
      },
      style: { width: 260 },
      type: 'default',
      targetPosition: Position.Left,
      sourcePosition: Position.Bottom,
    },
    {
      id: 'execution',
      position: { x: 450, y: 180 },
      data: {
        label: (
          <div className="flex flex-col bg-white shadow-md rounded-md p-4 text-center w-[240px]">
            <h3 className="text-sm font-medium text-gray-800 mb-2">{t('executionFinal')}</h3>
            <Button
              intent="primary"
              size="sm"
              ariaLabel="Start service button"
              onClick={() => console.log('Service started')}
            >
              {t('startService')}
            </Button>
          </div>
        ),
      },
      style: { width: 260 },
      type: 'default',
      targetPosition: Position.Top,
    },
    {
      id: 'criminal-cases',
      position: { x: -50, y: 180 },
      data: {
        label: (
          <div className="bg-white shadow-md rounded-md p-4 text-center w-[240px]">
            <h3 className="text-sm font-medium text-gray-800">{t('criminalCases')}</h3>
          </div>
        ),
      },
      style: { width: 260 },
      type: 'default',
      sourcePosition: Position.Right,
    },
    {
      id: 'public-prosecution',
      position: { x: 250, y: 350 },
      data: {
        label: (
          <div className="bg-[#083b59] text-white rounded-md p-4 text-center shadow-md">
            <h3 className="text-sm font-semibold mb-2">{t('publicProsecution')}</h3>
            <Image
              src="/images/photo-container.png"
              alt="Public Prosecution"
              width={140}
              height={50}
              className="mx-auto"
            />
          </div>
        ),
      },
      style: { width: 320 },
      type: 'default',
      targetPosition: Position.Top,
    },
  ];

  const edges: Edge[] = [
    {
      id: 'edge-1',
      source: 'civil-lawsuits',
      target: 'commercial-court',
      type: 'smoothstep',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
    {
      id: 'edge-2',
      source: 'commercial-court',
      target: 'execution',
      type: 'smoothstep',
      style: { stroke: '#6b7280', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
    {
      id: 'edge-3',
      source: 'criminal-cases',
      target: 'public-prosecution',
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

export default CopyrightViolationChart;
