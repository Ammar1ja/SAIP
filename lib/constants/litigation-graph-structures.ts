import { type Node, type Edge, Position, MarkerType } from '@xyflow/react';

// Graph structure definition
export interface GraphStructure {
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
    width: number;
    sourcePosition?: Position;
    targetPosition?: Position;
    extraSourcePositions?: Array<{ id: string; position: Position }>;
    extraTargetPositions?: Array<{ id: string; position: Position }>;
    kind?: 'image';
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: 'step' | 'smoothstep' | 'straight';
    strokeColor?: string;
    strokeWidth?: number;
    markerPosition?: 'start' | 'end';
    sourceHandle?: string;
    targetHandle?: string;
  }>;
}

// Hardcoded graph structures for each pathway type
export const LITIGATION_GRAPH_STRUCTURES: Record<string, GraphStructure> = {
  trademark_appeal: {
    nodes: [
      {
        id: 'appeal-saip',
        position: { x: 39, y: 39 },
        width: 264,
        sourcePosition: Position.Right,
      },
      {
        id: 'trademark-committee',
        position: { x: 400, y: 66 },
        width: 264,
        targetPosition: Position.Left,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'appeal-committee',
        position: { x: 400, y: 244 },
        width: 264,
        targetPosition: Position.Top,
        sourcePosition: Position.Right,
      },
      {
        id: 'commercial-court',
        position: { x: 760, y: 262 },
        width: 264,
        targetPosition: Position.Left,
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'appeal-saip',
        target: 'trademark-committee',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-2',
        source: 'trademark-committee',
        target: 'appeal-committee',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-3',
        source: 'appeal-committee',
        target: 'commercial-court',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
    ],
  },

  trademark_objection: {
    nodes: [
      {
        id: 'object-registration',
        position: { x: 383, y: -220 },
        width: 300,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'trademark-administration',
        position: { x: 400, y: -20 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'waiver-registration',
        position: { x: 0, y: 200 },
        width: 260,
        targetPosition: Position.Top,
      },
      {
        id: 'objection-acceptance',
        position: { x: 400, y: 200 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'objection-rejection',
        position: { x: 800, y: 200 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'applicant-file-lawsuit',
        position: { x: 400, y: 380 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'objector-file-lawsuit',
        position: { x: 800, y: 380 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'commercial-court-obj',
        position: { x: 600, y: 560 },
        width: 260,
        targetPosition: Position.Top,
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'object-registration',
        target: 'trademark-administration',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-2',
        source: 'trademark-administration',
        target: 'waiver-registration',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-3',
        source: 'trademark-administration',
        target: 'objection-acceptance',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-4',
        source: 'trademark-administration',
        target: 'objection-rejection',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-5',
        source: 'objection-acceptance',
        target: 'applicant-file-lawsuit',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-6',
        source: 'objection-rejection',
        target: 'objector-file-lawsuit',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-7',
        source: 'applicant-file-lawsuit',
        target: 'commercial-court-obj',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-8',
        source: 'objector-file-lawsuit',
        target: 'commercial-court-obj',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
    ],
  },

  trademark_cancellation: {
    nodes: [
      {
        id: 'specialized-court',
        position: { x: 400, y: -120 },
        width: 260,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'apply-cancellation',
        position: { x: 400, y: 60 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'execution-cancel',
        position: { x: 400, y: 240 },
        width: 260,
        targetPosition: Position.Top,
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'specialized-court',
        target: 'apply-cancellation',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-2',
        source: 'apply-cancellation',
        target: 'execution-cancel',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
    ],
  },

  trademark_infringement: {
    nodes: [
      {
        id: 'civil-lawsuits-tm',
        position: { x: 150, y: 0 },
        width: 220,
        sourcePosition: Position.Right,
      },
      {
        id: 'commercial-court-tm',
        position: { x: 450, y: 0 },
        width: 260,
        targetPosition: Position.Left,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'execution-tm',
        position: { x: 450, y: 180 },
        width: 260,
        targetPosition: Position.Top,
      },
      {
        id: 'criminal-cases-tm',
        position: { x: -50, y: 180 },
        width: 260,
        sourcePosition: Position.Right,
      },
      {
        id: 'public-prosecution-tm',
        position: { x: 250, y: 350 },
        width: 320,
        targetPosition: Position.Top,
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'civil-lawsuits-tm',
        target: 'commercial-court-tm',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-2',
        source: 'commercial-court-tm',
        target: 'execution-tm',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-3',
        source: 'criminal-cases-tm',
        target: 'public-prosecution-tm',
        type: 'smoothstep',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
    ],
  },

  copyright_violation: {
    nodes: [
      {
        id: 'complaint-owner',
        position: { x: 40, y: 0 },
        width: 260,
        sourcePosition: Position.Right,
      },
      {
        id: 'evidence-analysis',
        position: { x: 340, y: 0 },
        width: 264,
        targetPosition: Position.Left,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'case-referred',
        position: { x: 340, y: 200 },
        width: 264,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'investigation-prosecution',
        position: { x: 180, y: 380 },
        width: 264,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        kind: 'image',
      },
      {
        id: 'copyright-committee',
        position: { x: 520, y: 380 },
        width: 264,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'commercial-court-cr',
        position: { x: 180, y: 620 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Right,
      },
      {
        id: 'appeals-copyright',
        position: { x: 520, y: 628 },
        width: 264,
        targetPosition: Position.Top,
        sourcePosition: Position.Left,
        extraTargetPositions: [{ id: 'target-left', position: Position.Left }],
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'complaint-owner',
        target: 'evidence-analysis',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-2',
        source: 'evidence-analysis',
        target: 'case-referred',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-3',
        source: 'case-referred',
        target: 'investigation-prosecution',
        type: 'step',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-4',
        source: 'case-referred',
        target: 'copyright-committee',
        type: 'step',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-5',
        source: 'investigation-prosecution',
        target: 'commercial-court-cr',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-6',
        source: 'copyright-committee',
        target: 'appeals-copyright',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-7',
        source: 'commercial-court-cr',
        target: 'appeals-copyright',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
        markerPosition: 'start',
        sourceHandle: 'source-default',
        targetHandle: 'target-left',
      },
    ],
  },

  patent_designs: {
    nodes: [
      {
        id: 'object-granted',
        position: { x: 214, y: 33 },
        width: 264,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'appeal-reject',
        position: { x: 464, y: -16 },
        width: 264,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'patent-committee',
        position: { x: 339, y: 173 },
        width: 264,
        targetPosition: Position.Top,
        sourcePosition: Position.Right,
      },
      {
        id: 'appeal-decision-pat',
        position: { x: 645, y: 163 },
        width: 264,
        targetPosition: Position.Left,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'commercial-court-pat',
        position: { x: 645, y: 387 },
        width: 264,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        extraTargetPositions: [{ id: 'target-left', position: Position.Left }],
      },
      {
        id: 'patent-infringement',
        position: { x: 33, y: 253 },
        width: 260,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'civil-lawsuits-pat',
        position: { x: 339, y: 393 },
        width: 264,
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
      },
      {
        id: 'execution-pat',
        position: { x: 645, y: 560 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
      },
      {
        id: 'criminal-cases-pat',
        position: { x: 33, y: 535 },
        width: 260,
        targetPosition: Position.Top,
        sourcePosition: Position.Right,
      },
      {
        id: 'public-prosecution-pat',
        position: { x: 339, y: 489 },
        width: 264,
        targetPosition: Position.Left,
        kind: 'image',
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'object-granted',
        target: 'patent-committee',
        type: 'step',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-2',
        source: 'appeal-reject',
        target: 'patent-committee',
        type: 'step',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-3',
        source: 'patent-committee',
        target: 'appeal-decision-pat',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-4',
        source: 'appeal-decision-pat',
        target: 'commercial-court-pat',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-5',
        source: 'commercial-court-pat',
        target: 'execution-pat',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-6',
        source: 'patent-infringement',
        target: 'civil-lawsuits-pat',
        type: 'step',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-7',
        source: 'civil-lawsuits-pat',
        target: 'commercial-court-pat',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
        targetHandle: 'target-left',
      },
      {
        id: 'edge-8',
        source: 'patent-infringement',
        target: 'criminal-cases-pat',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
      {
        id: 'edge-9',
        source: 'criminal-cases-pat',
        target: 'public-prosecution-pat',
        type: 'straight',
        strokeColor: '#6b7280',
        strokeWidth: 2,
      },
    ],
  },
};

// Export node structure type for component use
export interface NodeStructure {
  id: string;
  position: { x: number; y: number };
  width: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  extraSourcePositions?: Array<{ id: string; position: Position }>;
  extraTargetPositions?: Array<{ id: string; position: Position }>;
  kind?: 'image';
}

export function buildGraphEdges(structure: GraphStructure): Edge[] {
  return structure.edges.map((edgeStructure) => ({
    id: edgeStructure.id,
    source: edgeStructure.source,
    target: edgeStructure.target,
    type: edgeStructure.type === 'smoothstep' ? 'step' : edgeStructure.type,
    style: {
      stroke: edgeStructure.strokeColor || '#9ca3af',
      strokeWidth: edgeStructure.strokeWidth || 1.5,
    },
    ...(edgeStructure.markerPosition === 'start'
      ? {
          markerStart: {
            type: MarkerType.ArrowClosed,
            color: edgeStructure.strokeColor || '#9ca3af',
          },
        }
      : {
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edgeStructure.strokeColor || '#9ca3af',
          },
        }),
    sourceHandle: edgeStructure.sourceHandle,
    targetHandle: edgeStructure.targetHandle,
  }));
}
