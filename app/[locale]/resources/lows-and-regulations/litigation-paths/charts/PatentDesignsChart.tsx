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

const PatentDesignsChart = () => {
  const t = useTranslations('litigationPaths.charts.patentDesigns');

  const nodes: Node[] = [
    {
      id: 'object-patent',
      position: { x: 0, y: 0 },
      data: {
        label: (
          <div className="bg-white shadow rounded-md p-4 text-center w-[220px]">
            <h3 className="text-sm font-medium text-gray-800">{t('objectGranted')}</h3>
          </div>
        ),
      },
      style: { width: 240 },
      type: 'default',
      sourcePosition: Position.Bottom,
    },
    {
      id: 'appeal-saip',
      position: { x: 300, y: -20 },
      data: {
        label: (
          <div className="bg-white shadow rounded-md p-4 text-center w-[260px]">
            <h3 className="text-sm font-medium text-gray-800">{t('appealReject')}</h3>
          </div>
        ),
      },
      style: { width: 280 },
      type: 'default',
      sourcePosition: Position.Bottom,
    },
    {
      id: 'criminal-cases',
      position: { x: -190, y: 500 },
      data: {
        label: (
          <div className="bg-white shadow rounded-md p-4 text-center w-[240px]">
            <h3 className="text-sm font-medium text-gray-800">{t('criminalCases')}</h3>
          </div>
        ),
      },
      style: { width: 260 },
      type: 'default',
      sourcePosition: Position.Right,
    },
    {
      id: 'patent-committee-right',
      position: { x: 150, y: 150 },
      data: {
        label: (
          <div className="bg-white shadow rounded-md p-4 text-center w-[260px]">
            <h3 className="text-sm font-medium text-gray-800">{t('patentCommittee')}</h3>
          </div>
        ),
      },
      style: { width: 280 },
      type: 'default',
      targetPosition: Position.Top,
      sourcePosition: Position.Left,
    },
    {
      id: 'patent-committee-left',
      position: { x: -200, y: 150 },
      data: {
        label: (
          <div className="bg-white shadow rounded-md p-4 text-center w-[260px]">
            <h3 className="text-sm font-medium text-gray-800">{t('patentCommittee')}</h3>
          </div>
        ),
      },
      style: { width: 280 },
      type: 'default',
      sourcePosition: Position.Bottom,
    },
    {
      id: 'appeal-patent-committee',
      position: { x: 500, y: 150 },
      data: {
        label: (
          <div className="bg-white shadow rounded-md p-4 text-center w-[280px]">
            <h3 className="text-sm font-medium text-gray-800">{t('appealDecision')}</h3>
          </div>
        ),
      },
      style: { width: 300 },
      type: 'default',
      sourcePosition: Position.Bottom,
      targetPosition: Position.Left,
    },
    {
      id: 'civil-lawsuits',
      position: { x: 150, y: 300 },
      data: {
        label: (
          <div className="bg-white shadow rounded-md p-4 text-center w-[200px]">
            <h3 className="text-sm font-medium text-gray-800">{t('civilLawsuits')}</h3>
          </div>
        ),
      },
      style: { width: 220 },
      type: 'default',
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
    },
    {
      id: 'lawsuit-commercial',
      position: { x: 520, y: 300 },
      data: {
        label: (
          <div className="bg-white shadow rounded-md p-4 text-center w-[240px]">
            <h3 className="text-sm font-medium text-gray-800">{t('commercialCourt')}</h3>
          </div>
        ),
      },
      style: { width: 260 },
      type: 'default',
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    },
    {
      id: 'public-prosecution',
      position: { x: 140, y: 450 },
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
      targetPosition: Position.Left,
    },
    {
      id: 'execution',
      position: { x: 510, y: 450 },
      data: {
        label: (
          <div className="flex flex-col bg-white shadow rounded-md p-4 text-center w-[260px]">
            <h3 className="text-sm font-medium text-gray-800">{t('executionFinal')}</h3>
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
      style: { width: 280 },
      type: 'default',
    },
  ];

  const edges: Edge[] = [
    {
      id: 'e1',
      source: 'object-patent',
      target: 'patent-committee-right',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e2',
      source: 'appeal-saip',
      target: 'patent-committee-right',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e3',
      source: 'patent-committee-right',
      target: 'appeal-patent-committee',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e4',
      source: 'appeal-patent-committee',
      target: 'lawsuit-commercial',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e5',
      source: 'lawsuit-commercial',
      target: 'execution',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e6',
      source: 'criminal-cases',
      target: 'public-prosecution',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e7',
      source: 'patent-committee-left',
      target: 'civil-lawsuits',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e8',
      source: 'civil-lawsuits',
      target: 'lawsuit-commercial',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    {
      id: 'e9',
      source: 'patent-committee-left',
      target: 'criminal-cases',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
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

export default PatentDesignsChart;
