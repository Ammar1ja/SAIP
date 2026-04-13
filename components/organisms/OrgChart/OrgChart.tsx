'use client';

import Section from '@/components/atoms/Section';
import {
  ReactFlow,
  Background,
  Controls,
  useStore,
  type Node,
  type Edge,
  type EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from './OrgChart.module.css';
import Image from '@/components/atoms/Image';
import { structure, type OrgNode } from './OrgChart.data';
import ContentBlock from '@/components/molecules/ContentBlock';
import Legend from './Legend';
import { StepEdge, StraightEdge } from './CustomEdge';
import { useLocale } from 'next-intl';

interface OrgChartProps {
  heading?: string;
  description?: string;
}

// Layout configuration
const NODE_WIDTH = 140; // All nodes same width
const NODE_WIDTH_LARGE = 200; // Middle boxes (sectors)
const NODE_HEIGHT = 100; // All nodes same height
const GAP_X = 50;
const GAP_Y = 150;
const START_X = 20;
const BASE_NODE_STYLE = {
  background: 'transparent',
  border: 'none',
  boxShadow: 'none',
  padding: 0,
};

// Level Y positions
const BASE_Y = 0;
const LEVEL_Y = {
  topLevel: BASE_Y,
  second: BASE_Y + NODE_HEIGHT + GAP_Y,
  third: BASE_Y + (NODE_HEIGHT + GAP_Y) * 2,
  fourth: BASE_Y + (NODE_WIDTH + GAP_Y) * 3,
};

// Helper function to create node data - ALL nodes same height
const createNodeLabel = (item: OrgNode, locale: string) => {
  const hasName = item.name;

  // Use Arabic translations if locale is 'ar'
  const displayLabel = locale === 'ar' && item.labelAr ? item.labelAr : item.label;
  const displayName = locale === 'ar' && item.nameAr ? item.nameAr : item.name;

  const roofColor = item.type === 'ceo' ? '#067647' : '#17B26A';

  if (hasName) {
    return (
      <div className="bg-white shadow-sm rounded-md p-3 text-center w-full h-full flex flex-col justify-center relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[6px]"
          style={{ backgroundColor: roofColor }}
        />
        <h3 className="text-sm font-semibold whitespace-pre-line">{displayLabel}</h3>
        <p className="text-xs text-gray-600 mt-1">{displayName}</p>
      </div>
    );
  }

  // Board type should be bold
  const isBoard = item.type === 'board';
  const fontWeightClass = isBoard ? 'font-semibold' : 'font-medium';

  return (
    <div className="bg-white shadow-sm rounded-md px-3 py-2 text-center w-full h-full flex flex-col justify-center relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-[6px]"
        style={{ backgroundColor: roofColor }}
      />
      <p className={`text-xs ${fontWeightClass} text-gray-800 whitespace-pre-line`}>
        {displayLabel}
      </p>
    </div>
  );
};

// Get color by type
const getColorByType = (type?: string) => {
  switch (type) {
    case 'top-level':
      return '#079455'; // success-600
    case 'board':
      return '#000000'; // black
    case 'ceo':
      return '#067647'; // success-700
    case 'sector':
      return '#079455'; // success-600
    case 'department':
      return '#17B26A'; // success-500
    case 'audit':
      return '#6b7280'; // gray-500
    default:
      return '#17B26A'; // success-500
  }
};

// ===========================================
// STEP 1: CREATE ALL NODES FIRST
// ===========================================

// Build chart with locale support
function buildOrgChart(locale: string) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Level 1: Top level departments (11 items) - positioned in two groups
  const topLevelNodes = structure.filter((item) => item.type === 'top-level');

  // Left group (5 items) - positioned above IP Policy and Strategy
  const leftGroupIds = ['smq', 'partnerships', 'ip-policy-leg', 'transformation', 'innovation'];
  const leftGroupNodes = topLevelNodes.filter((node) => leftGroupIds.includes(node.id));
  const ipPolicyStrategyX = START_X + (NODE_WIDTH + GAP_X) * 2.5; // Moved right (was 0)
  const leftGroupStartX =
    ipPolicyStrategyX - ((leftGroupNodes.length - 1) / 2) * (NODE_WIDTH + GAP_X);

  leftGroupNodes.forEach((item, index) => {
    nodes.push({
      id: item.id,
      position: { x: leftGroupStartX + index * (NODE_WIDTH + GAP_X), y: LEVEL_Y.topLevel },
      data: { label: createNodeLabel(item, locale) },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT, ...BASE_NODE_STYLE },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      type: 'default',
    });
  });

  // Right group (6 items) - positioned above Corporate Resources
  const rightGroupIds = ['finance', 'hr', 'it', 'facilities', 'procurement', 'documentation'];
  const rightGroupNodes = topLevelNodes.filter((node) => rightGroupIds.includes(node.id));
  const corporateResourcesX = START_X + (NODE_WIDTH + GAP_X) * 8.5; // Moved left (was 11.5)
  const rightGroupStartX =
    corporateResourcesX - ((rightGroupNodes.length - 1) / 2) * (NODE_WIDTH + GAP_X);

  rightGroupNodes.forEach((item, index) => {
    nodes.push({
      id: item.id,
      position: { x: rightGroupStartX + index * (NODE_WIDTH + GAP_X), y: LEVEL_Y.topLevel },
      data: { label: createNodeLabel(item, locale) },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT, ...BASE_NODE_STYLE },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      type: 'default',
    });
  });

  // Level 2: IP Policy Strategy, Board, Corporate Resources
  const level2Config = [
    { id: 'ip-policy-strategy', x: START_X + (NODE_WIDTH + GAP_X) * 2.5 }, // Moved right (was 0)
    { id: 'board', x: START_X + (NODE_WIDTH + GAP_X) * 5 },
    { id: 'corporate-resources', x: START_X + (NODE_WIDTH + GAP_X) * 8.5 }, // Moved left (was 11.5)
  ];

  level2Config.forEach(({ id, x }) => {
    const item = structure.find((s) => s.id === id);
    if (item) {
      nodes.push({
        id: item.id,
        position: { x, y: LEVEL_Y.second },
        data: { label: createNodeLabel(item, locale) },
        style: { width: NODE_WIDTH_LARGE, height: NODE_HEIGHT, ...BASE_NODE_STYLE },
        width: NODE_WIDTH_LARGE,
        height: NODE_HEIGHT,
        type: 'default',
      });
    }
  });

  // Level 3: IP Administration, CEO, Corporate Affairs
  const level3Config = [
    { id: 'ip-administration', x: START_X + (NODE_WIDTH + GAP_X) * 0 }, // Moved left
    { id: 'ceo', x: START_X + (NODE_WIDTH + GAP_X) * 5 },
    { id: 'corporate-affairs', x: START_X + (NODE_WIDTH + GAP_X) * 11.5 }, // Moved left (was 11.5)
  ];

  level3Config.forEach(({ id, x }) => {
    const item = structure.find((s) => s.id === id);
    if (item) {
      nodes.push({
        id: item.id,
        position: { x, y: LEVEL_Y.third },
        data: { label: createNodeLabel(item, locale) },
        style: { width: NODE_WIDTH_LARGE, height: NODE_HEIGHT, ...BASE_NODE_STYLE },
        width: NODE_WIDTH_LARGE,
        height: NODE_HEIGHT,
        type: 'default',
      });
    }
  });

  // Level 4: All departments (15 items) - positioned in three groups
  const allDepartments = structure.filter((item) => item.type === 'department');
  const ceoX = START_X + (NODE_WIDTH + GAP_X) * 5;

  // CEO's own departments - centered under CEO
  const ceoDepartmentIds = [
    'ceo-office',
    'quality',
    'beneficiary',
    'nipst',
    'ip-respect',
    'ip-enablement',
  ];

  const ceoDepartments = ceoDepartmentIds
    .map((id) => allDepartments.find((dept) => dept.id === id))
    .filter(Boolean);

  // Calculate starting X to center CEO departments under CEO
  const ceoDepartmentsStartX = ceoX - (ceoDepartments.length / 2 - 0.5) * (NODE_WIDTH + GAP_X);

  // Position CEO's departments
  ceoDepartments.forEach((item, index) => {
    if (item) {
      nodes.push({
        id: item.id,
        position: { x: ceoDepartmentsStartX + index * (NODE_WIDTH + GAP_X), y: LEVEL_Y.fourth },
        data: { label: createNodeLabel(item, locale) },
        style: { width: NODE_WIDTH, height: NODE_HEIGHT, ...BASE_NODE_STYLE },
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        type: 'default',
      });
    }
  });

  // Position other departments (IP Administration and Corporate Affairs)
  const otherDepartments = allDepartments.filter((dept) => !ceoDepartmentIds.includes(dept.id));

  // IP Administration departments (first 3) - on the left
  const ipAdminDepartments = otherDepartments.slice(0, 3);
  const ipAdminX = START_X + (NODE_WIDTH + GAP_X) * 0; // Moved left
  const ipAdminStartX = ipAdminX - (ipAdminDepartments.length / 2 - 0.5) * (NODE_WIDTH + GAP_X);

  ipAdminDepartments.forEach((item, index) => {
    nodes.push({
      id: item.id,
      position: { x: ipAdminStartX + index * (NODE_WIDTH + GAP_X), y: LEVEL_Y.fourth },
      data: { label: createNodeLabel(item, locale) },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT, ...BASE_NODE_STYLE },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      type: 'default',
    });
  });

  // Corporate Affairs departments (last 6) - on the right
  const corpAffairsDepartments = otherDepartments.slice(3);
  const corpAffairsX = START_X + (NODE_WIDTH + GAP_X) * 11.5; // Moved left (was 11.5)
  const corpAffairsStartX =
    corpAffairsX - (corpAffairsDepartments.length / 2 - 0.5) * (NODE_WIDTH + GAP_X);

  corpAffairsDepartments.forEach((item, index) => {
    nodes.push({
      id: item.id,
      position: { x: corpAffairsStartX + index * (NODE_WIDTH + GAP_X), y: LEVEL_Y.fourth },
      data: { label: createNodeLabel(item, locale) },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT, ...BASE_NODE_STYLE },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      type: 'default',
    });
  });

  // Internal Audit - positioned between Board and CEO
  const auditItem = structure.find((s) => s.id === 'audit');
  if (auditItem) {
    const boardX = START_X + (NODE_WIDTH + GAP_X) * 5;
    // Position between level 2 (Board) and level 3 (CEO)
    const auditY = LEVEL_Y.second + (LEVEL_Y.third - LEVEL_Y.second) / 3;

    nodes.push({
      id: auditItem.id,
      position: { x: boardX + NODE_WIDTH_LARGE + 100, y: auditY },
      data: { label: createNodeLabel(auditItem, locale) },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT, ...BASE_NODE_STYLE },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      type: 'default',
    });
  }

  // ===========================================
  // STEP 2: CREATE ALL EDGES WITH STEP CONNECTIONS
  // ===========================================

  // Left branch - top level → IP Policy and Strategy (with step edges for horizontal bar effect)
  leftGroupNodes.forEach((item) => {
    edges.push({
      id: `edge-${item.id}-to-ip-policy-strategy`,
      source: item.id,
      target: 'ip-policy-strategy',
      type: 'step',
      style: { stroke: '#000000', strokeWidth: 2 },
    });
  });

  // Right branch - top level → Corporate Resources (with step edges for horizontal bar effect)
  rightGroupNodes.forEach((item) => {
    edges.push({
      id: `edge-${item.id}-to-corporate-resources`,
      source: item.id,
      target: 'corporate-resources',
      type: 'step',
      style: { stroke: '#000000', strokeWidth: 2 },
    });
  });

  // IP Policy and Strategy → CEO (via horizontal line between IP Administration and CEO)
  // This creates a step edge that goes down, then right to the middle of the horizontal line
  // between IP Administration and CEO. Uses customMidY to align with IP Administration → CEO horizontal line.
  // The horizontal line should be at the middle of level 3 nodes (IP Administration and CEO)
  edges.push({
    id: 'edge-ip-policy-strategy-to-ceo',
    source: 'ip-policy-strategy',
    target: 'ceo',
    type: 'step',
    style: { stroke: '#000000', strokeWidth: 2 },
    data: { customMidY: LEVEL_Y.third + NODE_HEIGHT / 2 }, // Align horizontal line at middle of level 3 nodes
  });

  edges.push({
    id: 'edge-board-to-ceo',
    source: 'board',
    target: 'ceo',
    type: 'straight',
    style: { stroke: '#000000', strokeWidth: 2 },
  });

  // Connections to CEO (from design)
  // IP Administration → CEO (step edge creates horizontal line)
  edges.push({
    id: 'edge-ip-administration-to-ceo',
    source: 'ip-administration',
    target: 'ceo',
    type: 'step',
    style: { stroke: '#000000', strokeWidth: 2 },
  });

  // Corporate Resources → CEO (via horizontal line between Corporate Affairs and CEO)
  // This creates a step edge that goes down, then left to the middle of the horizontal line
  // between Corporate Affairs and CEO. Uses customMidY to align with Corporate Affairs → CEO horizontal line.
  edges.push({
    id: 'edge-corporate-resources-to-ceo',
    source: 'corporate-resources',
    target: 'ceo',
    type: 'step',
    style: { stroke: '#000000', strokeWidth: 2 },
    data: { customMidY: LEVEL_Y.third + NODE_HEIGHT / 2 }, // Align horizontal line at middle of level 3 nodes
  });

  edges.push({
    id: 'edge-corporate-affairs-to-ceo',
    source: 'corporate-affairs',
    target: 'ceo',
    type: 'step',
    style: { stroke: '#000000', strokeWidth: 2 },
  });

  // IP Administration → departments (with step edges)
  ipAdminDepartments.forEach((dept) => {
    edges.push({
      id: `edge-ip-administration-to-${dept.id}`,
      source: 'ip-administration',
      target: dept.id,
      type: 'step',
      style: { stroke: '#000000', strokeWidth: 2 },
    });
  });

  // CEO → departments (with step edges)
  ceoDepartmentIds.forEach((deptId) => {
    edges.push({
      id: `edge-ceo-to-${deptId}`,
      source: 'ceo',
      target: deptId,
      type: 'step',
      style: { stroke: '#000000', strokeWidth: 2 },
    });
  });

  // Corporate Affairs → departments (with step edges)
  corpAffairsDepartments.forEach((dept) => {
    edges.push({
      id: `edge-corporate-affairs-to-${dept.id}`,
      source: 'corporate-affairs',
      target: dept.id,
      type: 'step',
      style: { stroke: '#000000', strokeWidth: 2 },
    });
  });

  // Internal Audit connections
  if (auditItem) {
    // Dashed connection to Board
    edges.push({
      id: 'edge-audit-to-board',
      source: 'audit',
      target: 'board',
      type: 'straight',
      animated: false,
      style: { stroke: '#6b7280', strokeWidth: 2 },
    });

    // Dashed connection to CEO (via horizontal line between CEO and Corporate Affairs)
    // This creates a step edge that goes down, then left to the middle of the horizontal line
    // between CEO and Corporate Affairs. Uses customMidY to align with the horizontal line.
    edges.push({
      id: 'edge-audit-to-ceo',
      source: 'audit',
      target: 'ceo',
      type: 'step',
      animated: true,
      style: { strokeDasharray: '5 5', stroke: '#6b7280', strokeWidth: 2 },
      data: { customMidY: LEVEL_Y.third + NODE_HEIGHT / 2 }, // Align horizontal line at middle of level 3 nodes
    });
  }

  return { nodes, edges };
}

// Define custom edge types
const edgeTypes: EdgeTypes = {
  step: StepEdge,
  straight: StraightEdge,
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
    NODE_WIDTH;
  const height =
    node.measured?.height ??
    node.height ??
    node.internals?.userNode?.height ??
    node.style?.height ??
    NODE_HEIGHT;

  return {
    id: node.id,
    type: node.type ?? node.internals?.userNode?.type,
    x: position.x,
    y: position.y,
    width: Number(width),
    height: Number(height),
  };
};

const OrgChartMiniMap = () => {
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
          {boxes.map((box) => {
            const nodeType = structure.find((item) => item.id === box.id)?.type;
            const roofColor = nodeType === 'ceo' ? '#067647' : '#17B26A';
            const roofHeight = Math.max(1, Math.round(box.height * 0.12));

            return (
              <g key={box.id}>
                <rect
                  className={styles.minimapNode}
                  x={box.x}
                  y={box.y}
                  width={box.width}
                  height={box.height}
                  rx={2}
                  ry={2}
                />
                <rect
                  className={styles.minimapRoof}
                  x={box.x}
                  y={box.y}
                  width={box.width}
                  height={roofHeight}
                  rx={2}
                  ry={2}
                  fill={roofColor}
                />
              </g>
            );
          })}
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

export const OrgChart = ({ heading, description }: OrgChartProps = {}) => {
  const locale = useLocale();
  const { nodes, edges } = buildOrgChart(locale);

  return (
    <Section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <ContentBlock
          heading={heading || 'Organisational structure'}
          text={
            description ||
            `You can navigate through the chart by holding down the cursor and moving it up, down and sideways. More information appears by selecting the clickable elements.
            <br /><br />
            In the upper right corner you will find navigation to help you know where you are.`
          }
          lineHeight="none"
          className="max-w-[720px] [&>*:last-child]:text-[18px] [&>*:last-child]:leading-[28px] [&>*:last-child]:text-text-primary-paragraph"
        />
      </div>
      <Legend />
      <div className="w-full h-[800px] bg-gray-100 rounded-xl border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.15}
          maxZoom={1.2}
          snapToGrid
          snapGrid={[10, 10]}
          proOptions={{ hideAttribution: true }}
          className={`bg-transparent ${styles.reactFlowNoHandles}`}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable={false}
        >
          <div className={styles.minimapPanel}>
            <OrgChartMiniMap />
          </div>

          <Controls />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </Section>
  );
};
