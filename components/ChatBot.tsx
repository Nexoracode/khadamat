
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse, textToSpeech } from '../geminiService';
import { Message, Specialist, Product, Location } from '../types';
import { specialists, products } from '../data';

interface ChatBotProps {
  addToCart: (product: Product) => void;
  userLocation: Location | null;
  isLoggedIn: boolean;
  onLoginRequest: () => void;
}

// Function to convert PCM to WAV to use with <audio> tags for progress tracking
function createWavHeader(pcmData: Uint8Array, sampleRate: number = 24000) {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  
  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  // file length
  view.setUint32(4, 36 + pcmData.length, true);
  // RIFF type
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true); // PCM
  // channel count
  view.setUint16(22, 1, true); // Mono
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  view.setUint32(36, 0x64617461, false); // "data"
  // data chunk length
  view.setUint32(40, pcmData.length, true);

  return new Blob([header, pcmData], { type: 'audio/wav' });
}

const VoiceMessageUI: React.FC<{ audioUrl: string; isSelf: boolean }> = ({ audioUrl, isSelf }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className={`flex items-center gap-3 p-2 rounded-2xl min-w-[200px] ${isSelf ? 'bg-secondary/20' : 'bg-gray-200/50'}`}>
      <button 
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${isSelf ? 'bg-white text-secondary' : 'bg-primary text-white'}`}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
      <div className="flex-1 h-8 flex items-center relative">
        <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-100 ${isSelf ? 'bg-secondary' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`w-0.5 rounded-full ${isSelf ? 'bg-secondary' : 'bg-primary'}`} style={{ height: `${20 + Math.random() * 60}%` }}></div>
          ))}
        </div>
      </div>
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => { setIsPlaying(false); setProgress(0); }} 
        hidden 
      />
    </div>
  );
};

const ChatBot: React.FC<ChatBotProps> = ({ addToCart, userLocation, isLoggedIn, onLoginRequest }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: 'سلام! خوش آمدید. من دستیار هوشمند شما در خدمات همراه هستم. چه مشکلی در منزلتان پیش آمده؟' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const base64ToUint8Array = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const handleSend = async (audioData?: { data: string, mimeType: string, blobUrl?: string }) => {
    if (!input.trim() && !audioData) return;

    const userMessage: Message = { 
      role: 'user', 
      text: input || "", 
      audioUrl: audioData?.blobUrl,
      isVoiceInput: !!audioData 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const locationContext = userLocation ? `کاربر در لوکیشن ${userLocation.lat}, ${userLocation.lng} قرار دارد.` : '';
    const response = await getChatResponse(input + " " + locationContext, messages, audioData ? { data: audioData.data, mimeType: audioData.mimeType } : undefined);
    
    let recommendation;
    if (response.recommendationType === 'specialist') {
      let found = specialists.find(s => s.id === response.recommendationId);
      if (userLocation && found) {
         const sorted = [...specialists].map(s => {
           const dist = Math.sqrt(Math.pow(s.lat - userLocation.lat, 2) + Math.pow(s.lng - userLocation.lng, 2));
           return { ...s, distance: dist };
         }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
         const closestOfSameExpertise = sorted.find(s => s.expertise === found?.expertise);
         if (closestOfSameExpertise) found = closestOfSameExpertise;
      }
      if (found) recommendation = { type: 'specialist' as const, data: found };
    } else if (response.recommendationType === 'product') {
      const found = products.find(p => p.id === response.recommendationId);
      if (found) recommendation = { type: 'product' as const, data: found };
    }

    let aiVoiceUrl: string | undefined = undefined;
    if (response.solution && response.solution.length > 0) {
      const audioBase64 = await textToSpeech(response.solution);
      if (audioBase64) {
        const pcmData = base64ToUint8Array(audioBase64);
        const wavBlob = createWavHeader(pcmData, 24000);
        aiVoiceUrl = URL.createObjectURL(wavBlob);
      }
    }

    const aiMessage: Message = {
      role: 'model',
      text: response.text,
      audioUrl: aiVoiceUrl,
      recommendation
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine best supported mime type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const blobUrl = URL.createObjectURL(audioBlob);
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          handleSend({ data: base64data, mimeType, blobUrl });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("دسترسی به میکروفون امکان‌پذیر نیست. لطفاً دسترسی را در تنظیمات مرورگر فعال کنید.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[600px]">
      <div className="bg-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h2 className="font-bold">دستیار هوشمند همراه</h2>
            <p className="text-xs opacity-80">همیشه آنلاین برای کمک به شما</p>
          </div>
        </div>
        {userLocation && <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">مکان ثبت شد ✅</span>}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-secondary text-white rounded-tr-none shadow-sm' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
            }`}>
              {msg.audioUrl && (
                <div className="mb-2">
                  <VoiceMessageUI audioUrl={msg.audioUrl} isSelf={msg.role === 'user'} />
                </div>
              )}
              
              {msg.text && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              )}
              
              {msg.recommendation && (
                <div className="mt-4 p-3 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-800">
                  {msg.recommendation.type === 'specialist' ? (
                    <div className="flex gap-3">
                      <img src={(msg.recommendation.data as Specialist).image} className="w-12 h-12 rounded-full object-cover" alt="specialist" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-primary">متخصص پیشنهادی:</p>
                        <p className="text-sm font-bold">{(msg.recommendation.data as Specialist).name}</p>
                        <p className="text-[10px] text-gray-500">{(msg.recommendation.data as Specialist).expertise}</p>
                        
                        <div className="mt-2">
                          {isLoggedIn ? (
                            <p className="text-[10px] font-bold">📞 {(msg.recommendation.data as Specialist).phone}</p>
                          ) : (
                            <div className="space-y-1">
                               <p className="text-[10px] text-gray-400 font-mono">📞 ۰۹*********</p>
                               <button 
                                onClick={onLoginRequest}
                                className="text-[10px] text-primary hover:underline font-bold"
                               >
                                 برای مشاهده شماره وارد شوید
                               </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <img src={(msg.recommendation.data as Product).image} className="w-12 h-12 rounded object-cover" alt="product" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-secondary">محصول پیشنهادی:</p>
                        <p className="text-sm font-bold">{(msg.recommendation.data as Product).name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">قیمت: {(msg.recommendation.data as Product).price.toLocaleString()} تومان</p>
                        <button 
                          onClick={() => addToCart(msg.recommendation?.data as Product)}
                          className="mt-2 text-[10px] bg-secondary text-white px-2 py-1 rounded hover-secondary"
                        >
                          افزودن به سبد
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1 shadow-sm">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="پیام خود را بنویسید یا ویس بفرستید..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-inner"
          />
          
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm ${
              isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title="نگه دارید برای ضبط ویس"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          <button
            onClick={() => handleSend()}
            disabled={isLoading || (!input.trim() && !isRecording)}
            className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
