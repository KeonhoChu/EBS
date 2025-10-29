import React, { useState } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import SourcesPanel from './SourcesPanel';
import ChatPanel from './ChatPanel';
import StudioPanel from './StudioPanel';
import SourceUploadModal from './SourceUploadModal';
import ContentViewer, {
  sampleFAQData,
  sampleStudyGuideData,
  sampleTimelineData
} from './ContentViewer';
import AudioOverviewPlayer from './AudioOverviewPlayer';
import MindMapViewer from './MindMapViewer';
import {
  generateFAQ,
  generateStudyGuide,
  generateBriefing,
  generateTimeline,
  generateTOC,
  generateMindMap,
  MindMapData
} from '../services/llmClient';

interface ContentViewerState {
  open: boolean;
  type: 'faq' | 'study-guide' | 'briefing' | 'timeline' | 'toc';
  title: string;
  data: any[];
}

interface MainLayoutProps {
  onShowSnackbar?: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onShowSnackbar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [studioOpen, setStudioOpen] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [contentViewer, setContentViewer] = useState<ContentViewerState>({
    open: false,
    type: 'faq',
    title: '',
    data: [],
  });
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [audioPlayerGenerating, setAudioPlayerGenerating] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [showMindMap, setShowMindMap] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Set<string>>(new Set(['faq'])); // 초기에 FAQ는 생성된 것으로 표시
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);

  // 소스 데이터 관리
  const [sources, setSources] = useState<Array<{ id: string; name: string; type: string; enabled: boolean; wordCount?: number }>>([
    { id: '1', name: 'Research Document.pdf', type: 'pdf', enabled: true, wordCount: 12500 },
    { id: '2', name: 'Presentation Slides', type: 'slides', enabled: true, wordCount: 3200 },
    { id: '3', name: 'Tutorial Video', type: 'youtube', enabled: false, wordCount: 8900 },
  ]);

  const handleSourcesToggle = () => {
    setSourcesOpen(!sourcesOpen);
  };

  const handleStudioToggle = () => {
    setStudioOpen(!studioOpen);
  };

  const handleAddSource = () => {
    setUploadModalOpen(true);
  };

  const handleUploadSources = (uploadedFiles: any[]) => {
    // 업로드된 파일을 sources에 추가
    const newSources = uploadedFiles.map((file, index) => {
      let type: string = 'doc';

      // 파일 타입 결정
      if (file.type === 'url') {
        // URL인 경우
        const url = file.name.toLowerCase();
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          type = 'youtube';
        } else {
          type = 'url';
        }
      } else if (file.type.includes('pdf')) {
        type = 'pdf';
      } else if (file.type.includes('presentation') || file.type.includes('powerpoint')) {
        type = 'slides';
      } else if (file.type.includes('audio')) {
        type = 'audio';
      } else if (file.name.toLowerCase().includes('video')) {
        type = 'youtube';
      }

      return {
        id: file.id || `${Date.now()}-${index}`,
        name: file.name,
        type: type,
        enabled: true,
        wordCount: file.size ? Math.floor(file.size / 5) : Math.floor(Math.random() * 10000) + 1000, // 파일 크기 기반 또는 임시 단어 수
      };
    });

    setSources([...sources, ...newSources]);
    setUploadModalOpen(false);
    onShowSnackbar?.(`${uploadedFiles.length}개의 소스가 추가되었습니다`, 'success');
  };

  const handleDeleteSource = (id: string) => {
    setSourceToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sourceToDelete) {
      setSources(sources.filter(s => s.id !== sourceToDelete));
      onShowSnackbar?.('소스가 삭제되었습니다', 'success');
    }
    setDeleteConfirmOpen(false);
    setSourceToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setSourceToDelete(null);
  };

  const handleGenerateContent = async (type: string) => {
    // enabled된 소스만 필터링
    const enabledSources = sources.filter(s => s.enabled).map(s => ({ name: s.name, type: s.type }));

    if (enabledSources.length === 0) {
      onShowSnackbar?.('먼저 소스를 활성화해주세요', 'warning');
      return;
    }

    if (type === 'audio') {
      setAudioPlayerGenerating(true);
      setShowAudioPlayer(true);
      onShowSnackbar?.('오디오 오버뷰 생성 중...', 'info');

      // Simulate generation
      setTimeout(() => {
        setAudioPlayerGenerating(false);
        setGeneratedContent(prev => new Set(prev).add('audio'));
        onShowSnackbar?.('오디오 오버뷰가 생성되었습니다!', 'success');
      }, 3000);
      return;
    }

    if (type === 'mindmap') {
      onShowSnackbar?.('AI가 마인드맵을 생성하고 있습니다...', 'info');

      try {
        const data = await generateMindMap(enabledSources);
        setMindMapData(data);
        setShowMindMap(true);
        setGeneratedContent(prev => new Set(prev).add('mindmap'));
        onShowSnackbar?.('마인드맵이 생성되었습니다!', 'success');
      } catch (error: any) {
        console.error('마인드맵 생성 오류:', error);
        onShowSnackbar?.(
          `마인드맵 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
          'error'
        );
      }
      return;
    }

    onShowSnackbar?.('AI가 콘텐츠를 생성하고 있습니다...', 'info');

    try {
      let contentData: any[] = [];

      // 실제 LLM을 사용하여 콘텐츠 생성 (enabled된 소스만 사용)
      switch (type) {
        case 'faq':
          contentData = await generateFAQ(enabledSources);
          break;
        case 'study-guide':
          contentData = await generateStudyGuide(enabledSources);
          break;
        case 'briefing':
          contentData = await generateBriefing(enabledSources);
          break;
        case 'timeline':
          contentData = await generateTimeline(enabledSources);
          break;
        case 'toc':
          contentData = await generateTOC(enabledSources);
          break;
        default:
          contentData = getSampleDataForType(type);
      }

      setContentViewer({
        open: true,
        type: type as any,
        title: getContentTitle(type),
        data: contentData,
      });
      setGeneratedContent(prev => new Set(prev).add(type));
      onShowSnackbar?.('콘텐츠가 생성되었습니다!', 'success');
    } catch (error: any) {
      console.error('콘텐츠 생성 오류:', error);
      onShowSnackbar?.(
        `콘텐츠 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`,
        'error'
      );

      // 오류 발생 시 샘플 데이터 사용
      const contentData = getSampleDataForType(type);
      setContentViewer({
        open: true,
        type: type as any,
        title: getContentTitle(type),
        data: contentData,
      });
      setGeneratedContent(prev => new Set(prev).add(type));
    }
  };

  const handleViewContent = (type: string) => {
    if (type === 'audio') {
      setShowAudioPlayer(true);
    } else if (type === 'mindmap') {
      if (mindMapData) {
        setShowMindMap(true);
      } else {
        onShowSnackbar?.('먼저 마인드맵을 생성해주세요', 'info');
      }
    } else {
      const contentData = getSampleDataForType(type);
      setContentViewer({
        open: true,
        type: type as any,
        title: getContentTitle(type),
        data: contentData,
      });
    }
  };

  const getSampleDataForType = (type: string) => {
    switch (type) {
      case 'faq':
        return sampleFAQData;
      case 'study-guide':
        return sampleStudyGuideData;
      case 'timeline':
        return sampleTimelineData;
      case 'briefing':
        return [
          { title: '주요 발견사항', content: '연구를 통해 여러 중요한 발견을 확인했습니다.' },
          { title: '방법론', content: '정량적 및 정성적 분석 방법을 혼합 사용했습니다.' },
        ];
      case 'toc':
        return [
          { title: '서론', description: '연구의 배경과 목적' },
          { title: '문헌 검토', description: '기존 연구 분석' },
          { title: '방법론', description: '연구 방법 설명' },
        ];
      default:
        return [];
    }
  };

  const getContentTitle = (type: string) => {
    const titles: { [key: string]: string } = {
      'faq': 'FAQ',
      'study-guide': '학습 가이드',
      'briefing': '브리핑 문서',
      'timeline': '타임라인',
      'toc': '목차',
    };
    return titles[type] || type;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Sources Panel - Left */}
      <SourcesPanel
        open={sourcesOpen}
        onToggle={handleSourcesToggle}
        isMobile={isMobile}
        onAddSource={handleAddSource}
        sources={sources as any}
        onSourcesChange={(newSources) => setSources(newSources as any)}
        onDeleteSource={handleDeleteSource}
      />

      {/* Chat Panel - Center */}
      <ChatPanel
        sourcesOpen={sourcesOpen}
        studioOpen={studioOpen}
        onShowSnackbar={onShowSnackbar}
        sources={sources}
      />

      {/* Studio Panel - Right */}
      <StudioPanel
        open={studioOpen}
        onToggle={handleStudioToggle}
        isMobile={isMobile}
        onGenerateContent={handleGenerateContent}
        onViewContent={handleViewContent}
        onDownload={(type) => onShowSnackbar?.(`${getContentTitle(type)} 다운로드 시작`, 'success')}
        onShare={(type) => onShowSnackbar?.(`${getContentTitle(type)} 공유 링크가 복사되었습니다`, 'success')}
        generatedContent={generatedContent}
      />

      {/* Source Upload Modal */}
      <SourceUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadSources}
      />

      {/* Content Viewer */}
      <ContentViewer
        open={contentViewer.open}
        onClose={() => setContentViewer({ ...contentViewer, open: false })}
        contentType={contentViewer.type}
        title={contentViewer.title}
        data={contentViewer.data}
        onDownload={() => onShowSnackbar?.('PDF 다운로드 시작', 'success')}
        onShare={() => onShowSnackbar?.('공유 링크가 복사되었습니다', 'success')}
      />

      {/* Audio Player Overlay */}
      {showAudioPlayer && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: { xs: 'calc(100% - 40px)', sm: 400 },
            zIndex: 1300,
          }}
        >
          <AudioOverviewPlayer
            title="리서치 오버뷰 팟캐스트"
            duration={1245}
            isGenerating={audioPlayerGenerating}
            onDownload={() => onShowSnackbar?.('오디오 다운로드 시작', 'success')}
            onShare={() => onShowSnackbar?.('공유 링크가 복사되었습니다', 'success')}
            onClose={() => setShowAudioPlayer(false)}
          />
        </Box>
      )}

      {/* Mind Map Viewer */}
      {mindMapData && (
        <MindMapViewer
          open={showMindMap}
          onClose={() => setShowMindMap(false)}
          data={mindMapData}
          onDownload={() => onShowSnackbar?.('마인드맵 다운로드 시작', 'success')}
          onShare={() => onShowSnackbar?.('공유 링크가 복사되었습니다', 'success')}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          소스 삭제 확인
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            선택한 소스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            취소
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;
