import React, { useState, useEffect, useRef } from 'react';
import { UI_TRANSLATIONS } from '../../utils/languages';

const QUICK_QUESTIONS = [
  "💊 How do I treat this?",
  "🌱 What caused this disease?",
  "🛡 How can I prevent it?",
  "🌿 Are there natural/organic remedies?",
  "⚠️ Will this spread to other plants?",
  "📅 What should I do today?",
  "🌾 Will this affect my crop yield?",
  "🔍 Is the crop still safe?"
];

export function FarmerChatAssistant({
  currentResult,
  chatHistory,
  onSendMessage,
  onClearChat,
  isSending,
  selectedLanguage
}) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isSending]);

  const handleSend = (textToSend = null) => {
    const message = textToSend || inputText;
    if (!message || !message.trim() || isSending) return;

    onSendMessage(message.trim());
    if (!textToSend) setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Optional Voice Input Handler using Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported by your browser. Please type your message.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      
      // Map language code to Speech Recognition locale
      const langMap = {
        en: 'en-IN',
        hi: 'hi-IN',
        mr: 'mr-IN',
        kn: 'kn-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        gu: 'gu-IN',
        bn: 'bn-IN',
        pa: 'pa-IN'
      };
      
      recognition.lang = langMap[selectedLanguage] || 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="farmer-chat-card">
      <div className="chat-header">
        <div className="chat-title-wrap">
          <span className="chat-icon">💬</span>
          <div>
            <div className="chat-main-title">{t.askAI || 'Ask AI About This Disease'}</div>
            <div className="chat-sub-title">
              Context: {currentResult?.disease ? currentResult.disease : 'General Crop Care'}
            </div>
          </div>
        </div>

        <button className="btn-clear-chat" onClick={onClearChat} title="Clear conversation">
          🗑 Clear
        </button>
      </div>

      {/* Context Summary Banner */}
      {currentResult && currentResult.disease && (
        <div className="chat-context-banner">
          <span>🌿 <strong>Detected:</strong> {currentResult.disease} ({(currentResult.confidence * 100).toFixed(1)}% conf)</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="chat-messages-container">
        {chatHistory.length === 0 ? (
          <div className="chat-welcome-box">
            <div className="welcome-icon">👨‍🌾</div>
            <div className="welcome-title">Ask your plant care questions in your language!</div>
            <div className="welcome-desc">
              I know the detected plant condition and can help you with treatment, remedies, and prevention.
            </div>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div key={idx} className={`chat-message-row ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
              <div className="msg-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="msg-bubble">
                <div className="msg-sender">{msg.role === 'user' ? 'You' : 'Plant AI Assistant'}</div>
                <div className="msg-text">{msg.content}</div>
                {msg.timestamp && <div className="msg-time">{msg.timestamp}</div>}
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="chat-message-row msg-ai">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble typing-bubble">
              <div className="typing-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
              <span style={{ fontSize: '12px', color: '#8fa896' }}>AI is thinking in your language...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions Pills */}
      <div className="quick-questions-wrapper">
        <div className="quick-label">💡 {t.quickQuestions || 'Quick Questions'}:</div>
        <div className="quick-pills-scroll">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              className="quick-pill-btn"
              onClick={() => handleSend(q)}
              disabled={isSending}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="chat-input-bar">
        <button
          className={`btn-voice ${isListening ? 'listening-pulse' : ''}`}
          onClick={handleVoiceInput}
          title="Speak your question (Voice Input)"
          disabled={isSending}
        >
          {isListening ? '🎙 Listening...' : '🎤'}
        </button>

        <textarea
          className="chat-textarea"
          placeholder="Ask a question about your plant, treatment, or prevention..."
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSending}
        />

        <button
          className="btn-send-chat"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isSending}
        >
          <span>Send</span> ➔
        </button>
      </div>
    </div>
  );
}
