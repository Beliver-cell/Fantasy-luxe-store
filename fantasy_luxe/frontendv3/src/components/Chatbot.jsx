import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! 👋 Welcome to Fantasy Luxe. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const faqData = {
    'payment': {
      keywords: ['payment', 'flutterwave', 'how to pay', 'pay', 'checkout'],
      response: 'We accept secure payments through Flutterwave. At checkout, you\'ll see the Flutterwave payment option. You can pay with card, bank transfer, or mobile money. Your transaction is 100% secure and encrypted.'
    },
    'shipping': {
      keywords: ['shipping', 'delivery', 'how long', 'when', 'track', 'tracking'],
      response: 'We offer worldwide shipping! Delivery typically takes 7-14 business days depending on your location. Once your order ships, you\'ll receive a tracking number via email to monitor your package.'
    },
    'returns': {
      keywords: ['return', 'exchange', 'refund', 'wrong', 'damaged', 'back'],
      response: 'We have an easy 7-day return and exchange policy! If you\'re not satisfied with your purchase or received a damaged item, simply contact us. We\'ll arrange a return and send a replacement or refund.'
    },
    'sizes': {
      keywords: ['size', 'fit', 'measurement', 'guide', 'sizing'],
      response: 'Each product page has a detailed size guide showing measurements. If you\'re between sizes, our team recommends going up one size for comfort. Contact us if you need personalized sizing advice!'
    },
    'authenticity': {
      keywords: ['authentic', 'genuine', 'real', 'fake', 'original', '100%'],
      response: '✓ 100% Authentic! All products at Fantasy Luxe are verified authentic. We work directly with brands and trusted suppliers. Each item undergoes rigorous quality checks before shipping.'
    },
    'orders': {
      keywords: ['order', 'my orders', 'order status', 'check'],
      response: 'You can view all your orders by logging into your account and going to "My Orders". You\'ll see order status, tracking info, and estimated delivery dates. Need help? We\'re here to assist!'
    },
    'account': {
      keywords: ['account', 'login', 'sign up', 'register', 'password', 'reset'],
      response: 'Creating an account is quick and easy! Just use your email address. If you forgot your password, click "Forgot Password" on the login page. We\'ll send you a reset link right away.'
    },
    'contact': {
      keywords: ['contact', 'support', 'help', 'email', 'call', 'assistance'],
      response: 'We\'re here to help! You can chat with us right here, or email us for detailed inquiries. Our team responds within 24 hours. Your satisfaction is our priority!'
    }
  };

  const findBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, value] of Object.entries(faqData)) {
      if (value.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return value.response;
      }
    }
    
    return "I appreciate your question! 😊 For more specific inquiries, please visit our FAQ section or contact our support team. We typically respond within 24 hours. How else can I help?";
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: findBotResponse(input),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleQuickReply = (question) => {
    const userMessage = { id: messages.length + 1, text: question, sender: 'user' };
    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: findBotResponse(question),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-2xl w-96 max-h-[600px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-black text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Fantasy Luxe Support</h3>
              <p className="text-xs text-gray-300">Always here to help 🎧</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl hover:text-gray-300 transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-black text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-gray-200 bg-white">
            <p className="text-xs font-semibold text-gray-600 mb-2">Quick answers:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickReply('How do I track my order?')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
              >
                Track Order
              </button>
              <button
                onClick={() => handleQuickReply('What is your return policy?')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
              >
                Returns
              </button>
              <button
                onClick={() => handleQuickReply('How to pay safely?')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
              >
                Payment
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your question..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
            />
            <button
              onClick={handleSendMessage}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition text-2xl hover:scale-110 transform"
          title="Open chat"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;
