import React, { useState } from 'react';
import Button from './components/common/Button';
import Input from './components/common/Input';
import Modal from './components/common/Modal';
import { PageProps } from './MainDashboard';

export default function Setting({ onNavigate, showToast }: PageProps) {
  const [activeSection, setActiveSection] = useState<string>('account');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Record 타입으로 토글 상태 정의
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    desktop: false, sound: false, mention: false, loginLog: true, readStatus: true
  });

  const sections = [
    { id: 'account', label: '내 계정' },
    { id: 'appearance', label: '콘텐츠 및 외관' },
    { id: 'notifications', label: '알림 및 소리' },
    { id: 'privacy', label: '개인정보 보호' },
    { id: 'integrations', label: '연동된 앱' }
  ];

  const handleToggle = (key: string) => {
    setToggles(prev => {
      const nextState = !prev[key];
      showToast(nextState ? '활성화되었습니다.' : '비활성화되었습니다.', nextState ? 'success' : 'warning', nextState ? '✅' : '🔕');
      return { ...prev, [key]: nextState };
    });
  };

  return (
    <div className="w-[1024px] h-[720px] bg-white rounded-xl shadow-2xl flex overflow-hidden border border-gray-300 text-left">
      <aside className="w-[280px] bg-[#1e1e1e] text-white flex flex-col shrink-0">
        <div className="p-6 cursor-pointer font-bold text-xl text-green-400 hover:opacity-80 transition" onClick={() => onNavigate('main')}>🏠 M-TOOL</div>
        <nav className="flex-1 px-4 space-y-1">
          {sections.map(sec => (
            <button key={sec.id} onClick={() => setActiveSection(sec.id)} className={`w-full flex justify-between p-3 rounded-lg transition ${activeSection === sec.id ? 'bg-white/10 text-white border-l-4 border-green-400' : 'text-gray-400 hover:bg-white/5'}`}><span>{sec.label}</span>›</button>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10">
            <button onClick={() => { if(window.confirm('로그아웃 하시겠습니까?')) { showToast('로그아웃 되었습니다.', 'info', '👋'); onNavigate('login'); } }} className="w-full text-left p-3 rounded-lg text-red-400 hover:bg-red-400/10 transition">로그아웃</button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 bg-gradient-to-b from-[#6ee7b7] to-[#fde047] p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-800/20 pb-2 max-w-sm">{sections.find(s => s.id === activeSection)?.label}</h2>
        
        {activeSection === 'account' && (
          <div className="space-y-3 max-w-2xl">
            <div className="bg-white/30 backdrop-blur-md rounded-xl p-5 border shadow-sm cursor-pointer hover:bg-white/50 transition" onClick={() => setActiveModal('profile')}>프로필 편집</div>
            <div className="bg-white/30 backdrop-blur-md rounded-xl p-5 border shadow-sm cursor-pointer hover:bg-white/50 transition" onClick={() => setActiveModal('password')}>비밀번호 변경</div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-3 max-w-2xl">
            {['desktop', 'sound', 'mention'].map(key => (
              <div key={key} className="bg-white/30 backdrop-blur-md rounded-xl p-5 border shadow-sm flex items-center justify-between hover:bg-white/40 transition">
                <h3 className="font-semibold text-gray-800">{key === 'desktop' ? '데스크탑 알림' : key === 'sound' ? '소리 알림' : '@멘션 알림'}</h3>
                <button className={`w-11 h-6 rounded-full relative transition-colors ${toggles[key] ? 'bg-green-500' : 'bg-gray-400'}`} onClick={() => handleToggle(key)}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${toggles[key] ? 'translate-x-5' : 'translate-x-0'}`}></span></button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={activeModal === 'profile' ? '프로필 편집' : '비밀번호 변경'}>
        <Input placeholder="새로운 값을 입력하세요..." />
        <div className="flex justify-end gap-2 mt-4">
          <div className="w-20"><Button variant="ghost" onClick={() => setActiveModal(null)}>취소</Button></div>
          <div className="w-20"><Button variant="primary" onClick={() => { setActiveModal(null); showToast('저장 성공!', 'success', '✅'); }}>저장</Button></div>
        </div>
      </Modal>
    </div>
  );
}