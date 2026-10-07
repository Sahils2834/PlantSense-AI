import React, { useState, useEffect, useRef } from 'react';
import { t, translateDiseaseName } from '../../i18n';

const LANG_SPEECH = { en:'en-IN', hi:'hi-IN', mr:'mr-IN', kn:'kn-IN', te:'te-IN', ta:'ta-IN', gu:'gu-IN', bn:'bn-IN', pa:'pa-IN' };

export function ChatPane({ currentResult, chatHistory, onSendMessage, onClearChat, isSending, selectedLanguage }) {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);

  const quickQuestions = [
    t(selectedLanguage, 'chatSuggestion1'),
    t(selectedLanguage, 'chatSuggestion2'),
    t(selectedLanguage, 'chatSuggestion3')
  ];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory, isSending]);

  const send = (txt) => {
    const msg = txt || input;
    if (!msg?.trim() || isSending) return;
    onSendMessage(msg.trim());
    if (!txt) setInput('');
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('Voice input not supported in this browser.');
    const r = new SR();
    r.lang = LANG_SPEECH[selectedLanguage] || 'en-IN';
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onend   = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = e => { const t = e.results[0][0].transcript; if(t) setInput(t); };
    r.start();
  };

  const isNonPlant = currentResult?.is_plant === false || currentResult?.disease?.toLowerCase().includes('no supported plant');
  const validDisease = currentResult?.disease && !isNonPlant;
  const translatedDisease = validDisease ? translateDiseaseName(currentResult.disease, selectedLanguage) : null;

  return (
    <div className="ps-chat-pane">
      {validDisease && (
        <div className="ps-chat-context-bar">
          🌿 Context: <strong style={{marginLeft:4}}>{translatedDisease}</strong>
          &nbsp;·&nbsp;{Math.round((currentResult.confidence||0)*100)}% {t(selectedLanguage, 'confidence').toLowerCase()}
          <button
            onClick={onClearChat}
            style={{marginLeft:'auto',fontSize:'11px',color:'var(--text-3)',background:'none',border:'none',cursor:'pointer'}}
          >
            🗑 {t(selectedLanguage, 'clearChat')}
          </button>
        </div>
      )}

      <div className="ps-chat-messages">
        {chatHistory.length === 0 ? (
          <div className="ps-chat-welcome">
            <span className="w-icon">👨‍🌾</span>
            <div className="w-title">{t(selectedLanguage, 'askAI')}</div>
            <div className="w-sub">
              {validDisease
                ? `${t(selectedLanguage, 'whatIsDisease')} - ${translatedDisease}`
                : t(selectedLanguage, 'chatPromptFirst')}
            </div>
          </div>
        ) : (
          chatHistory.map((m, i) => (
            <div key={i} className={`ps-msg-row ${m.role === 'user' ? 'user' : ''}`}>
              <div className={`ps-msg-avatar ${m.role === 'user' ? 'user' : ''}`}>
                {m.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="ps-msg-block">
                <div className={`ps-msg-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>{m.content}</div>
                {m.timestamp && <div className="ps-msg-time">{m.timestamp}</div>}
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="ps-msg-row">
            <div className="ps-msg-avatar">🤖</div>
            <div className="ps-msg-block">
              <div className="ps-msg-bubble assistant ps-typing-bubble">
                <div className="ps-typing-dots"><span/><span/><span/></div>
                <span style={{fontSize:'11px',color:'var(--text-4)'}}>{t(selectedLanguage, 'analyzing')}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="ps-quick-qs">
        {quickQuestions.map((q, i) => (
          <button key={i} className="ps-quick-btn" onClick={() => send(q)} disabled={isSending}>{q}</button>
        ))}
      </div>

      <div className="ps-chat-input-area">
        <button className={`ps-voice-btn ${listening ? 'listening' : ''}`} onClick={startVoice} disabled={isSending} title="Voice input">
          {listening ? '🎙' : '🎤'}
        </button>
        <textarea
          className="ps-chat-textarea"
          placeholder={t(selectedLanguage, 'askPlaceholder')}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={isSending}
        />
        <button className="ps-chat-send" onClick={() => send()} disabled={!input.trim() || isSending}>➤</button>
      </div>
    </div>
  );
}
