import React, { useMemo, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import {
  Close,
  Download,
  Share,
  ZoomIn,
  ZoomOut,
  FitScreen,
} from '@mui/icons-material';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MindMapData } from '../services/llmClient';

interface MindMapViewerProps {
  open: boolean;
  onClose: () => void;
  data: MindMapData;
  onDownload?: () => void;
  onShare?: () => void;
}

const MindMapViewer: React.FC<MindMapViewerProps> = ({
  open,
  onClose,
  data,
  onDownload,
  onShare,
}) => {
  const theme = useTheme();

  // 노드 위치 계산 (계층적 레이아웃)
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodeMap = new Map<string, { x: number; y: number; level: number }>();
    const levelCounts = new Map<number, number>();

    // 레벨별 노드 카운트
    data.nodes.forEach((node) => {
      levelCounts.set(node.level, (levelCounts.get(node.level) || 0) + 1);
    });

    // 레벨별 현재 인덱스
    const levelIndices = new Map<number, number>();

    // 노드 위치 계산
    data.nodes.forEach((node) => {
      const level = node.level;
      const levelCount = levelCounts.get(level) || 1;
      const currentIndex = levelIndices.get(level) || 0;

      let x: number;
      let y: number;

      if (level === 0) {
        // 중심 노드
        x = 400;
        y = 50;
      } else {
        // 계층적 배치
        const spacing = 800 / (levelCount + 1);
        x = spacing * (currentIndex + 1);
        y = 50 + level * 150;
      }

      nodeMap.set(node.id, { x, y, level });
      levelIndices.set(level, currentIndex + 1);
    });

    // ReactFlow 노드 생성
    const flowNodes: Node[] = data.nodes.map((node) => {
      const pos = nodeMap.get(node.id)!;

      // 레벨에 따른 색상
      let bgColor = theme.palette.primary.main;
      let textColor = theme.palette.primary.contrastText;
      let borderColor = theme.palette.primary.dark;

      if (node.level === 0) {
        bgColor = theme.palette.primary.main;
        textColor = theme.palette.primary.contrastText;
      } else if (node.level === 1) {
        bgColor = theme.palette.secondary.main;
        textColor = theme.palette.secondary.contrastText;
      } else {
        bgColor = theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5';
        textColor = theme.palette.text.primary;
        borderColor = theme.palette.divider;
      }

      return {
        id: node.id,
        type: 'default',
        position: { x: pos.x, y: pos.y },
        data: {
          label: (
            <Box
              sx={{
                padding: '10px 20px',
                textAlign: 'center',
                minWidth: node.level === 0 ? 180 : 120,
                fontWeight: node.level === 0 ? 700 : node.level === 1 ? 600 : 500,
                fontSize: node.level === 0 ? '1.1em' : node.level === 1 ? '1em' : '0.9em',
                whiteSpace: 'nowrap',
              }}
            >
              {node.label}
            </Box>
          ),
        },
        style: {
          background: bgColor,
          color: textColor,
          border: `2px solid ${borderColor}`,
          borderRadius: node.level === 0 ? '50px' : '12px',
          padding: 0,
          boxShadow: node.level === 0 ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      };
    });

    // ReactFlow 엣지 생성
    const flowEdges: Edge[] = data.edges.map((edge, idx) => ({
      id: `edge-${idx}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: theme.palette.mode === 'dark' ? '#666' : '#999',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: theme.palette.mode === 'dark' ? '#666' : '#999',
      },
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [data, theme]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', md: '80%', lg: '70%' },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          마인드맵
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={onDownload}>
            <Download />
          </IconButton>
          <IconButton size="small" onClick={onShare}>
            <Share />
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Mind Map Canvas */}
      <Box sx={{ flex: 1, position: 'relative', bgcolor: 'background.default' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{
            padding: 0.2,
            minZoom: 0.5,
            maxZoom: 1.5,
          }}
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
          }}
        >
          <Background
            color={theme.palette.mode === 'dark' ? '#444' : '#ccc'}
            gap={16}
          />
          <Controls />
          <MiniMap
            style={{
              backgroundColor: theme.palette.background.paper,
            }}
            nodeColor={(node) => {
              const level = data.nodes.find(n => n.id === node.id)?.level || 0;
              if (level === 0) return theme.palette.primary.main;
              if (level === 1) return theme.palette.secondary.main;
              return theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5';
            }}
          />
        </ReactFlow>
      </Box>

      {/* Footer Info */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          노드 {data.nodes.length}개 • 연결 {data.edges.length}개
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          마우스 휠로 확대/축소, 드래그로 이동, 노드를 드래그하여 위치 조정
        </Typography>
      </Box>
    </Drawer>
  );
};

export default MindMapViewer;
