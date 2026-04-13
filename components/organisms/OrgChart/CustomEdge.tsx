'use client';

import { BaseEdge, EdgeProps, getStraightPath } from '@xyflow/react';

/**
 * Custom edge that creates a step connection:
 * 1. Vertical drop from source
 * 2. Horizontal step
 * 3. Vertical drop to target
 *
 * This creates the visual parent bar effect when multiple edges converge.
 * If customMidY is provided in data, uses that instead of calculating midpoint.
 */
export function StepEdge({ id, sourceX, sourceY, targetX, targetY, style = {}, data }: EdgeProps) {
  // Use custom midY if provided (for aligning horizontal lines)
  // If source and target are at same Y level, place horizontal line below them
  // Otherwise calculate midpoint Y for the horizontal bar
  let midY: number;
  if (data?.customMidY !== undefined) {
    midY = data.customMidY as number;
  } else if (Math.abs(sourceY - targetY) < 1) {
    // Same level - place horizontal line below (assuming NODE_HEIGHT ~ 100)
    midY = sourceY + 50;
  } else {
    midY = sourceY + (targetY - sourceY) / 2;
  }

  // Create path with 3 segments:
  // 1. Vertical: source down to horizontal bar level
  // 2. Horizontal: across to target X position
  // 3. Vertical: down to target
  const path = `M ${sourceX},${sourceY} L ${sourceX},${midY} L ${targetX},${midY} L ${targetX},${targetY}`;

  return (
    <BaseEdge
      id={id}
      path={path}
      style={{
        ...style,
        strokeWidth: style.strokeWidth || 2,
      }}
    />
  );
}

/**
 * Simple straight edge
 */
export function StraightEdge({ id, sourceX, sourceY, targetX, targetY, style = {} }: EdgeProps) {
  const [path] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      id={id}
      path={path}
      style={{
        ...style,
        strokeWidth: style.strokeWidth || 2,
      }}
    />
  );
}
