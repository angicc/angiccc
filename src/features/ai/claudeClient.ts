// Backward-compatible façade — the real implementation lives in the unified
// AI gateway (src/services/aiGateway.ts). Existing call sites keep importing
// from here; new code should import from '@/services/aiGateway' directly.
export {
  streamChatResponse,
  LANDING_SYSTEM_PROMPT,
  AiGatewayError,
  getGatewayStatus,
} from '@/services/aiGateway';
export type { AiErrorKind, GatewayMode, GatewayStatus } from '@/services/aiGateway';
