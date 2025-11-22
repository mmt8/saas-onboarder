export class TTSService {
    private synthesis: SpeechSynthesis | null = null;
    private voice: SpeechSynthesisVoice | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synthesis = window.speechSynthesis;
            this.loadVoices();
        }
    }

    private loadVoices() {
        if (!this.synthesis) return;

        // Wait for voices to load
        if (this.synthesis.getVoices().length === 0) {
            this.synthesis.onvoiceschanged = () => {
                this.selectVoice();
            };
        } else {
            this.selectVoice();
        }
    }

    private selectVoice() {
        if (!this.synthesis) return;

        const voices = this.synthesis.getVoices();
        // Prefer a natural sounding English voice
        this.voice = voices.find(v => v.name.includes('Google US English')) ||
            voices.find(v => v.lang === 'en-US') ||
            voices[0];
    }

    speak(text: string) {
        if (!this.synthesis || !this.voice) return;

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        this.synthesis.speak(utterance);
    }

    cancel() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }
}

export const tts = new TTSService();
