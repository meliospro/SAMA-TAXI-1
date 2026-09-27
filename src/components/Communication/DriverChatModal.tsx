import React, { useState, useEffect, useRef } from 'react';
import { Driver, ChatMessage } from '../../types/vtc';
import { INITIAL_CHAT_MESSAGES, PRESET_CHAT_REPLIES } from '../../data/dakarData';
import { Send, X, Phone, ShieldCheck, CheckCheck } from 'lucide-react';

interface Props {
  driver: Driver;
  onClose: () => void;
  onCallDriver: () => void;
}

export const DriverChatModal: React.FC<Props> = ({ driver, onClose, onCallDriver }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'passenger',
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputText('');

    // Simulated driver response after 1.8s
    setTimeout(() => {
      const driverReplies = [
        'Parfait, je vous vois !',
        'Bien reçu, je klaxonne deux fois en arrivant.',
        'D’accord, j’ai activé les feux de détresse.',
        'Je suis garé juste à côté du portail.',
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];

      setMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now() + 1}`,
          sender: 'driver',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1800);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={driver.photoUrl}
              alt={driver.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{driver.name}</h3>
            <p className="text-[11px] text-slate-400">
              {driver.carModel} · <span className="font-mono text-slate-300">{driver.licensePlate}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCallDriver}
            aria-label="Appeler le chauffeur"
            className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/40 flex items-center gap-1.5 text-[10px] text-slate-400 justify-center">
        <ShieldCheck className="w-3 h-3 text-red-500" />
        <span>Ne communiquez jamais votre code de sécurité PIN avant de monter</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => {
          const isPassenger = msg.sender === 'passenger';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isPassenger ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs ${
                  isPassenger
                    ? 'bg-red-600 text-white rounded-br-xs shadow-md shadow-red-600/20'
                    : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                <span>{msg.timestamp}</span>
                {isPassenger && <CheckCheck className="w-3 h-3 text-red-400" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Dakar Presets scroller */}
      <div className="p-2 bg-slate-900/70 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {PRESET_CHAT_REPLIES.map((reply, i) => (
          <button
            key={i}
            onClick={() => handleSend(reply)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 whitespace-nowrap active:scale-95 transition-transform"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Écrire à Moussa..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white flex items-center justify-center transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
