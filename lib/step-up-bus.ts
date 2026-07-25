export interface StepUpPromptState {
  open: boolean;
  message: string;
}

type Listener = (state: StepUpPromptState) => void;

const listeners = new Set<Listener>();
let pending: { resolve: (code: string) => void; reject: (error: Error) => void } | null = null;
let message = '';

function emit() {
  const state = { open: pending !== null, message };
  listeners.forEach((listener) => listener(state));
}

export function subscribeStepUpPrompt(listener: Listener) {
  listeners.add(listener);
  listener({ open: pending !== null, message });
  return () => {
    listeners.delete(listener);
  };
}

export function requestStepUpCode(promptMessage: string): Promise<string> {
  if (pending) return Promise.reject(new Error('A security verification prompt is already active.'));
  message = promptMessage;
  return new Promise((resolve, reject) => {
    pending = { resolve, reject };
    emit();
  });
}

export function submitStepUpCode(code: string) {
  const active = pending;
  if (!active) return;
  if (!/^\d{6}$/.test(code.trim())) {
    active.reject(new Error('Enter a valid 6-digit authenticator code.'));
  } else {
    active.resolve(code.trim());
  }
  pending = null;
  message = '';
  emit();
}

export function cancelStepUpCode() {
  const active = pending;
  if (!active) return;
  active.reject(new Error('Security verification was cancelled.'));
  pending = null;
  message = '';
  emit();
}
