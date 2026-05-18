import React, { useState, useRef } from 'react';
import { PageProps } from './MainDashboard';

interface MessageData {
  id: number;
  sender: string;
  time: string;
  text: string;
  isMe: boolean;
  reactions: Record<string, number>;
}

export default function Message({ onNavigate, showToast }: PageProps) {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [messageInput, setMessageInput] = useState<string>('');
  const [emojiPickerTargetId, setEmojiPickerTargetId] = useState<number | null>(null);
  
  const [messages, setMessages] = useState<MessageData[]>([
    { id: 1, sender: 'Developer', time: '오전 9:32', text: '안녕하세요! 화면을 타입스크립트로 변환했습니다.', isMe: false, reactions: { '☑️': 1, '👍': 2 } }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    const newMsg: MessageData = { 
      id: Date.now(), 
      sender: '나', 
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }), 
      text: messageInput, 
      isMe: true, 
      reactions: {} 
    };
    setMessages([...messages, newMsg]);
    setMessageInput('');
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) { showToast(`파일 첨부: ${file.name}`, 'info', '📎'); e.target.value = ''; }
  };

  const toggleReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== msgId) return msg;
      const currentCount = msg.reactions[emoji] || 0;
      const newReactions = { ...msg.reactions };
      if (currentCount > 0) delete newReactions[emoji];
      else newReactions[emoji] = 1;
      return { ...msg, reactions: newReactions };
    }));
    setEmojiPickerTargetId(null); 
  };

  return (
    <div className="w-[1024px] h-[720px] bg-white rounded-xl shadow-2xl flex overflow-hidden border border-gray-300 text-left">
      <aside className="w-[80px] bg-[#1e1e1e] flex flex-col items-center py-6 gap-6 z-10 shrink-0">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/20 transition" onClick={() => { onNavigate('main'); showToast('홈으로 이동', 'info', '🏠'); }}><span className="text-2xl">🏠</span></div>
        <div className="w-8 h-[2px] bg-gray-700 rounded-full"></div>
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold cursor-pointer" onClick={() => { onNavigate('account'); showToast('프로필', 'info', '👤'); }}>U</div>
      </aside>

      <main className="flex-1 bg-gradient-to-b from-[#6ee7b7] to-[#fde047] flex flex-col relative overflow-hidden" onClick={() => setEmojiPickerTargetId(null)}>
        <header className="h-14 bg-white/20 border-b border-white/30 flex items-end px-4 gap-2 shrink-0">
          <div className={`px-6 py-2.5 rounded-t-xl text-sm cursor-pointer select-none ${activeTab === 1 ? 'bg-white/60 font-bold text-gray-800' : 'hover:bg-white/30 text-gray-600'}`} onClick={() => setActiveTab(1)}>Section 1</div>
          <div className={`px-6 py-2.5 rounded-t-xl text-sm cursor-pointer select-none ${activeTab === 2 ? 'bg-white/60 font-bold text-gray-800' : 'hover:bg-white/30 text-gray-600'}`} onClick={() => setActiveTab(2)}>Section 2</div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {activeTab === 2 ? (<div className="flex items-center justify-center h-full text-center text-gray-600"><div><div className="text-4xl mb-3">📁</div><p>아직 메시지가 없습니다.</p></div></div>) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex flex-col gap-1.5 w-full ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                  {!msg.isMe && <div className="w-7 h-7 bg-blue-500 rounded-lg flex justify-center text-white text-xs font-bold items-center">{msg.sender[0]}</div>}
                  <div>
                    <div className={`text-xs text-gray-600 mb-1 ${msg.isMe ? 'mr-1 text-right' : 'ml-1'}`}>{msg.sender} · {msg.time}</div>
                    <div className={`max-w-[60%] px-5 py-3.5 backdrop-blur-sm border rounded-2xl shadow-sm leading-relaxed ${msg.isMe ? 'bg-[#1e1e1e] text-white border-gray-800 rounded-tr-sm' : 'bg-white/70 border-white/50 text-gray-800 rounded-tl-sm'}`}>{msg.text}</div>
                  </div>
                </div>
                <div className={`flex gap-1.5 text-sm relative ${msg.isMe ? 'mr-1' : 'ml-9'}`}>
                  {Object.entries(msg.reactions).map(([emoji, count]) => (<span key={emoji} onClick={() => toggleReaction(msg.id, emoji)} className="bg-green-100 text-green-700 px-2 py-1 rounded-lg border border-green-300 cursor-pointer">{emoji} {count}</span>))}
                  <span className="bg-white/40 px-2 py-1 rounded-lg border border-white/30 text-gray-400 cursor-pointer hover:bg-white/60 transition" onClick={(e) => { e.stopPropagation(); setEmojiPickerTargetId(emojiPickerTargetId === msg.id ? null : msg.id); }}>+ 😊</span>
                  {emojiPickerTargetId === msg.id && (
                    <div className="absolute top-8 left-0 bg-white rounded-xl shadow-xl border p-3 flex flex-wrap gap-2 w-56 z-50" onClick={e => e.stopPropagation()}>
                      {['👍', '❤️', '😂', '🔥', '✅', '👀'].map(emoji => (<span key={emoji} onClick={() => toggleReaction(msg.id, emoji)} className="cursor-pointer text-xl hover:scale-125 transition select-none">{emoji}</span>))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 pt-2 shrink-0">
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border p-2 pl-4 rounded-xl shadow-sm focus-within:bg-white/80">
            <label className="text-gray-500 cursor-pointer"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg><input type="file" ref={fileInputRef} className="hidden" onChange={handleFileAttach}/></label>
            <input type="text" className="bg-transparent flex-1 outline-none text-gray-800 placeholder-gray-500 py-2" placeholder="메세지 입력 (Enter 전송)" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}/>
            <button className="text-gray-500 text-lg" onClick={() => setMessageInput(prev => prev + '😊')}>😊</button>
            <button className="w-8 h-8 bg-green-500 text-white rounded-full flex justify-center items-center hover:bg-green-600 transition" onClick={sendMessage}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button>
          </div>
        </div>
      </main>
    </div>
  );
}