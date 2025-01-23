import { useChat } from 'ai/react';
import Markdown from 'react-markdown';
import { useRef, useEffect, KeyboardEvent, useState } from 'react';
import './App.css';

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

function App() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    streamProtocol: 'data',
    api: 'http://localhost:3001/ai/chat',
  });

  const [showError, setShowError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AI 助手</h1>
        {messages.length > 0 && (
          <button onClick={clearChat} className="clear-button">
            清空对话
          </button>
        )}
      </div>
      
      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              <div className="message-header">
                <span>{message.role === 'user' ? '用户' : 'AI'}</span>
                <span className="message-time">{formatTime(Date.now())}</span>
              </div>
              <div className="message-body">
                <Markdown>{message.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showError && (
        <div className="error-message">
          发送失败，请稍后重试
        </div>
      )}

      <form onSubmit={handleSubmit} className="input-form">
        <input
          ref={inputRef}
          name="prompt"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题... (按Enter发送)"
          className="chat-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
    </div>
  );
}

export default App;
