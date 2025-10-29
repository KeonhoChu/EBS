import { LLM_CONFIG } from '../config/llm.config';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * vLLM 서버에 채팅 완성 요청을 보냅니다.
 */
export async function chatCompletion(
  request: ChatCompletionRequest
): Promise<string> {
  const url = `${LLM_CONFIG.endpoint}${LLM_CONFIG.chatCompletionPath}`;

  const requestBody = {
    model: LLM_CONFIG.model,
    messages: request.messages,
    temperature: request.temperature ?? LLM_CONFIG.defaultParams.temperature,
    max_tokens: request.max_tokens ?? LLM_CONFIG.defaultParams.max_tokens,
    top_p: request.top_p ?? LLM_CONFIG.defaultParams.top_p,
    stream: request.stream ?? LLM_CONFIG.defaultParams.stream,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LLM_CONFIG.timeout);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `LLM API 오류 (${response.status}): ${errorText}`
      );
    }

    // 응답을 텍스트로 먼저 읽기
    const responseText = await response.text();

    // SSE 형식인지 확인 (data: 로 시작하는지)
    if (responseText.trim().startsWith('data:')) {
      // SSE 형식 파싱 - 모든 청크의 content를 합침
      const lines = responseText.split('\n').filter(line => line.trim().startsWith('data:'));

      let fullContent = '';
      for (const line of lines) {
        const jsonStr = line.replace(/^data:\s*/, '').trim();
        if (jsonStr && jsonStr !== '[DONE]') {
          try {
            const chunk = JSON.parse(jsonStr);
            if (chunk.choices && chunk.choices.length > 0) {
              const choice = chunk.choices[0];
              // delta.content (스트리밍) 또는 message.content (일반)
              const content = choice.delta?.content || choice.message?.content || '';
              fullContent += content;
            }
          } catch (e) {
            // 파싱 실패한 라인은 무시
            console.warn('SSE 라인 파싱 실패:', e);
          }
        }
      }

      if (!fullContent) {
        throw new Error('LLM 응답이 비어있습니다');
      }

      return fullContent;
    } else {
      // 일반 JSON 형식
      const data: ChatCompletionResponse = JSON.parse(responseText);

      if (!data.choices || data.choices.length === 0) {
        throw new Error('LLM 응답에 choices가 없습니다');
      }

      return data.choices[0].message.content;
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('LLM 요청 타임아웃');
    }
    console.error('LLM API 호출 오류:', error);
    throw error;
  }
}

/**
 * 소스 기반 질문 답변
 */
export async function answerQuestion(
  question: string,
  sources: Array<{ name: string; type: string }>
): Promise<{ answer: string; citations: Array<{ source: string; page?: number }> }> {
  const sourceContext = sources
    .map((s) => `- ${s.name} (${s.type})`)
    .join('\n');

  const systemPrompt = `당신은 연구 보조 AI입니다. 사용자가 제공한 소스 문서를 기반으로 질문에 답변합니다.

사용 가능한 소스:
${sourceContext}

답변 시 다음 규칙을 따르세요:
1. 소스 문서의 내용을 기반으로 정확하게 답변하세요
2. 답변은 명확하고 간결하게 작성하세요
3. 가능한 경우 소스를 인용하세요
4. 한국어로 답변하세요`;

  try {
    const answer = await chatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // 시뮬레이션: 실제로는 답변에서 인용 정보를 추출해야 합니다
    const citations = sources.slice(0, 2).map((source, idx) => ({
      source: source.name,
      page: Math.floor(Math.random() * 20) + 1,
    }));

    return { answer, citations };
  } catch (error) {
    console.error('질문 답변 오류:', error);
    throw error;
  }
}

/**
 * FAQ 생성
 */
export async function generateFAQ(
  sources: Array<{ name: string; type: string }>
): Promise<Array<{ question: string; answer: string }>> {
  const sourceContext = sources
    .map((s) => `- ${s.name}`)
    .join('\n');

  const prompt = `다음 소스 문서를 기반으로 자주 묻는 질문(FAQ) 5개를 생성하세요:

소스 문서:
${sourceContext}

각 질문에 대해 간결하고 명확한 답변을 제공하세요.
JSON 형식으로 응답하세요:
[
  {"question": "질문1", "answer": "답변1"},
  {"question": "질문2", "answer": "답변2"}
]`;

  try {
    const response = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 2000,
    });

    // JSON 파싱 시도
    try {
      const faqs = JSON.parse(response);
      return Array.isArray(faqs) ? faqs : [];
    } catch {
      // JSON 파싱 실패 시 기본값 반환
      return [
        {
          question: '이 연구의 주요 목적은 무엇인가요?',
          answer: '이 연구는 제공된 소스 문서를 기반으로 한 분석을 제공합니다.',
        },
      ];
    }
  } catch (error) {
    console.error('FAQ 생성 오류:', error);
    throw error;
  }
}

/**
 * 학습 가이드 생성
 */
export async function generateStudyGuide(
  sources: Array<{ name: string; type: string }>
): Promise<Array<{ title: string; content: string; description: string }>> {
  const sourceContext = sources
    .map((s) => `- ${s.name}`)
    .join('\n');

  const prompt = `다음 소스 문서를 기반으로 학습 가이드를 생성하세요:

소스 문서:
${sourceContext}

주요 개념 3-5개를 선정하고, 각 개념에 대해:
1. 제목 (title)
2. 상세 설명 (content)
3. 핵심 요약 (description)

을 제공하세요. JSON 형식으로 응답하세요:
[
  {"title": "개념1", "content": "설명1", "description": "요약1"}
]`;

  try {
    const response = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    try {
      const guide = JSON.parse(response);
      return Array.isArray(guide) ? guide : [];
    } catch {
      return [
        {
          title: '핵심 개념',
          content: '소스 문서의 주요 내용을 분석한 결과입니다.',
          description: '제공된 문서를 기반으로 한 학습 가이드입니다.',
        },
      ];
    }
  } catch (error) {
    console.error('학습 가이드 생성 오류:', error);
    throw error;
  }
}

/**
 * 브리핑 문서 생성
 */
export async function generateBriefing(
  sources: Array<{ name: string; type: string }>
): Promise<Array<{ title: string; content: string }>> {
  const sourceContext = sources
    .map((s) => `- ${s.name}`)
    .join('\n');

  const prompt = `다음 소스 문서를 기반으로 간결한 브리핑 문서를 생성하세요:

소스 문서:
${sourceContext}

3-5개의 주요 섹션으로 구성하고, 각 섹션에 대해:
1. 제목 (title)
2. 내용 (content)

을 제공하세요. JSON 형식으로 응답하세요:
[
  {"title": "섹션1", "content": "내용1"}
]`;

  try {
    const response = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    try {
      const briefing = JSON.parse(response);
      return Array.isArray(briefing) ? briefing : [];
    } catch {
      return [
        {
          title: '요약',
          content: '소스 문서의 주요 내용을 요약한 브리핑입니다.',
        },
      ];
    }
  } catch (error) {
    console.error('브리핑 생성 오류:', error);
    throw error;
  }
}

/**
 * 타임라인 생성
 */
export async function generateTimeline(
  sources: Array<{ name: string; type: string }>
): Promise<Array<{ date: string; title: string; content: string }>> {
  const sourceContext = sources
    .map((s) => `- ${s.name}`)
    .join('\n');

  const prompt = `다음 소스 문서를 기반으로 주요 이벤트의 타임라인을 생성하세요:

소스 문서:
${sourceContext}

시간 순서대로 3-5개의 주요 이벤트를 정리하고, 각 이벤트에 대해:
1. 날짜 (date) - 예: "2024년 1월"
2. 제목 (title)
3. 내용 (content)

을 제공하세요. JSON 형식으로 응답하세요:
[
  {"date": "2024년 1월", "title": "이벤트1", "content": "내용1"}
]`;

  try {
    const response = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    try {
      const timeline = JSON.parse(response);
      return Array.isArray(timeline) ? timeline : [];
    } catch {
      return [
        {
          date: '2024년',
          title: '주요 이벤트',
          content: '소스 문서의 타임라인입니다.',
        },
      ];
    }
  } catch (error) {
    console.error('타임라인 생성 오류:', error);
    throw error;
  }
}

/**
 * 목차 생성
 */
export async function generateTOC(
  sources: Array<{ name: string; type: string }>
): Promise<Array<{ title: string; description: string }>> {
  const sourceContext = sources
    .map((s) => `- ${s.name}`)
    .join('\n');

  const prompt = `다음 소스 문서를 기반으로 구조화된 목차를 생성하세요:

소스 문서:
${sourceContext}

주요 섹션 5-7개를 구성하고, 각 섹션에 대해:
1. 제목 (title)
2. 설명 (description)

을 제공하세요. JSON 형식으로 응답하세요:
[
  {"title": "섹션1", "description": "설명1"}
]`;

  try {
    const response = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    try {
      const toc = JSON.parse(response);
      return Array.isArray(toc) ? toc : [];
    } catch {
      return [
        {
          title: '서론',
          description: '문서의 개요 및 배경',
        },
      ];
    }
  } catch (error) {
    console.error('목차 생성 오류:', error);
    throw error;
  }
}

/**
 * 마인드맵 데이터 생성
 */
export interface MindMapNode {
  id: string;
  label: string;
  level: number;
  category?: string;
}

export interface MindMapEdge {
  from: string;
  to: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export async function generateMindMap(
  sources: Array<{ name: string; type: string }>
): Promise<MindMapData> {
  const sourceContext = sources
    .map((s) => `- ${s.name}`)
    .join('\n');

  const prompt = `다음 소스 문서를 기반으로 마인드맵을 생성하세요:

소스 문서:
${sourceContext}

문서의 핵심 주제를 중심으로 계층적 구조의 마인드맵을 만드세요.
1. 중심 주제 1개 (level: 0)
2. 주요 카테고리 3-5개 (level: 1)
3. 각 카테고리별 세부 개념 2-3개 (level: 2)

다음 JSON 형식으로 응답하세요:
{
  "nodes": [
    {"id": "root", "label": "중심주제", "level": 0},
    {"id": "cat1", "label": "카테고리1", "level": 1, "category": "주제"},
    {"id": "concept1", "label": "개념1", "level": 2, "category": "카테고리1"}
  ],
  "edges": [
    {"from": "root", "to": "cat1"},
    {"from": "cat1", "to": "concept1"}
  ]
}

주의: 반드시 valid JSON만 응답하세요. 다른 설명은 포함하지 마세요.`;

  try {
    const response = await chatCompletion({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    try {
      // JSON 추출 (코드 블록이나 다른 텍스트가 포함될 수 있음)
      let jsonStr = response.trim();

      // 코드 블록 제거
      if (jsonStr.includes('```')) {
        const match = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (match) {
          jsonStr = match[1];
        }
      }

      const data = JSON.parse(jsonStr);

      if (data.nodes && data.edges && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        return data;
      }

      throw new Error('Invalid mindmap format');
    } catch (parseError) {
      console.warn('마인드맵 JSON 파싱 실패, 기본 데이터 사용:', parseError);

      // 기본 마인드맵 데이터
      return {
        nodes: [
          { id: 'root', label: '소스 문서 분석', level: 0 },
          { id: 'cat1', label: '주요 개념', level: 1, category: '분석' },
          { id: 'cat2', label: '핵심 주제', level: 1, category: '분석' },
          { id: 'cat3', label: '관련 내용', level: 1, category: '분석' },
          { id: 'concept1', label: '세부 내용 1', level: 2, category: '주요 개념' },
          { id: 'concept2', label: '세부 내용 2', level: 2, category: '핵심 주제' },
        ],
        edges: [
          { from: 'root', to: 'cat1' },
          { from: 'root', to: 'cat2' },
          { from: 'root', to: 'cat3' },
          { from: 'cat1', to: 'concept1' },
          { from: 'cat2', to: 'concept2' },
        ],
      };
    }
  } catch (error) {
    console.error('마인드맵 생성 오류:', error);
    throw error;
  }
}
