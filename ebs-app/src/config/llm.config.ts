/**
 * LLM Configuration
 * vLLM 서버 설정
 */

export const LLM_CONFIG = {
  // vLLM 엔드포인트
  endpoint: 'http://10.240.1.8:8099',

  // 모델명
  model: 'openai/gpt-oss-120b',

  // API 경로
  chatCompletionPath: '/v1/chat/completions',

  // 기본 파라미터
  defaultParams: {
    temperature: 0.7,
    max_tokens: 30000,
    top_p: 0.9,
    stream: true,
  },

  // 타임아웃 (밀리초)
  timeout: 30000,
} as const;

export type LLMConfig = typeof LLM_CONFIG;
