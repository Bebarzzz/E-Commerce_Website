import React, { useState, useRef, useEffect } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [language, setLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const translations = {
    english: {
      title: 'Car Assistant',
      placeholder: 'Ask about cars...',
      send: 'Send',
      greeting: 'Hello! I\'m your car assistant. How can I help you find the perfect car today?',
      switchLang: 'Switch to Arabic',
      exampleQuestions: [
        'Show me family SUVs under $50,000',
        'What\'s the most fuel-efficient sedan?',
        'I need a luxury car with advanced safety features',
        'Best electric cars available?'
      ]
    },
    arabic: {
      title: 'مساعد السيارات',
      placeholder: 'اسأل عن السيارات...',
      send: 'إرسال',
      greeting: 'مرحباً! أنا مساعدك للسيارات. كيف يمكنني مساعدتك في العثور على السيارة المثالية اليوم؟',
      switchLang: 'التبديل إلى الإنجليزية',
      exampleQuestions: [
        'أرني سيارات SUV عائلية بأقل من 50,000 دولار',
        'ما هي السيارة الأكثر كفاءة في استهلاك الوقود؟',
        'أحتاج سيارة فاخرة مع ميزات أمان متقدمة',
        'أفضل السيارات الكهربائية المتوفرة؟'
      ]
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: t.greeting,
        timestamp: new Date()
      }]);
    }
  }, [language, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'arabic' : 'english');
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          language: language,
          conversationHistory: messages.slice(-6)
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      const botMessage = {
        role: 'assistant',
        content: data.message,
        recommendedCars: data.recommendedCars || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: language === 'english' 
          ? 'Sorry, I encountered an error. Please try again.'
          : 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const CarRecommendation = ({ car }) => (
    <div className="car-card" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {car.image && (
          <img 
            src={car.image} 
            alt={`${car.brand} ${car.model}`}
            style={{
              width: '80px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '4px'
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {car.brand} {car.model} ({car.year})
          </div>
          <div style={{ color: '#2563eb', fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>
            ${car.price.toLocaleString()}
          </div>
        </div>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          onClick={() => window.location.href = `/cars/${car._id}`}
        >
          {language === 'english' ? 'View' : 'عرض'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '400px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            backgroundColor: '#2563eb',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{t.title}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>🤖 Online</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={toggleLanguage}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
                title={t.switchLang}
              >
                {language === 'english' ? 'AR' : 'EN'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: msg.role === 'user' ? '#2563eb' : '#f3f4f6',
                  color: msg.role === 'user' ? 'white' : 'black',
                  direction: language === 'arabic' ? 'rtl' : 'ltr'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                    {msg.content}
                  </div>
                  {msg.recommendedCars && msg.recommendedCars.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      {msg.recommendedCars.map((car, idx) => (
                        <CarRecommendation key={idx} car={car} />
                      ))}
                    </div>
                  )}
                  <div style={{
                    fontSize: '10px',
                    opacity: 0.7,
                    marginTop: '4px'
                  }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: '#f3f4f6'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  {language === 'english' ? 'Try asking:' : 'جرب السؤال:'}
                </div>
                {t.exampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(q)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      marginBottom: '6px',
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: language === 'arabic' ? 'right' : 'left',
                      fontSize: '13px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  direction: language === 'arabic' ? 'rtl' : 'ltr'
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                style={{
                  padding: '12px 20px',
                  backgroundColor: inputMessage.trim() && !isLoading ? '#2563eb' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {t.send}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes typing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          backgroundColor: #6b7280;
          borderRadius: 50%;
          animation: typing 1.4s infinite;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </>
  );
};

export default Chatbot;