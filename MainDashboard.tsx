import React, { useState } from 'react';
import Button from './components/common/Button';
import Input from './components/common/Input';
import Modal from './components/common/Modal';
import Badge from './components/common/Badge';

export interface PageProps {
  onNavigate: (view: string) => void;
  showToast: (msg: string, type?: string, icon?: string) => void;
}

export default function MainDashboard({ onNavigate, showToast }: PageProps) {
  const [activeServer, setActiveServer] = useState<string>('main');
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('대시보드');
  const [isAddServerModalOpen, setIsAddServerModalOpen] = useState<boolean>(false);
  const [localeProgress, setLocaleProgress] = useState<number>(85);
  const [newServerName, setNewServerName] = useState<string>('');

  const serverNames: Record<string, string> = { main: 'Hasi', T1: 'Team Alpha', T2: 'Team Beta' };

  const switchServer = (id: string) => { 
    setActiveServer(id); 
    showToast(`${serverNames[id] || id} 로 전환했습니다`, 'info', '🏠'); 
  };

  const addServer = () => {
    if (!newServerName.trim()) { showToast('서버 이름을 입력해주세요', 'error', '❌'); return; }
    showToast(`"${newServerName}" 서버가 추가됐습니다`, 'success', '✅');
    setIsAddServerModalOpen(false); 
    setNewServerName('');
  };

  return (
    <div className="w-[1280px] h-[760px] bg-white rounded-xl shadow-2xl flex overflow-hidden border border-gray-300 text-left">
      <aside className="w-[72px] bg-[#111111] flex flex-col items-center py-4 gap-4 z-20 shrink-0">
        <div className={`server-btn w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer relative ${activeServer === 'main' ? 'bg-gradient-to-br from-green-400 to-yellow-400' : 'bg-white/10'}`} onClick={() => switchServer('main')}><span className="text-white font-bold text-lg select-none">M</span></div>
        <div className="w-8 h-[2px] bg-gray-800 rounded-full my-1"></div>
        <div className="w-12 h-12 bg-white/10 rounded-full flex justify-center items-center cursor-pointer text-gray-300 font-bold hover:bg-white/20 transition" onClick={() => { switchServer('T1'); onNavigate('message'); }}>T1</div>
        <div className="w-12 h-12 mt-2 bg-white/5 border border-transparent rounded-full flex justify-center items-center cursor-pointer text-gray-400 hover:text-white transition" onClick={() => { showToast('설정 페이지로 이동합니다', 'info', '⚙️'); onNavigate('setting'); }}>⚙️</div>
        <div className="w-12 h-12 mt-auto border border-dashed border-gray-700 rounded-full flex justify-center items-center cursor-pointer text-gray-500 hover:text-green-400 hover:border-green-400 transition" onClick={() => setIsAddServerModalOpen(true)}>➕</div>
      </aside>

      <aside className="w-[240px] bg-[#1e1e1e] flex flex-col z-10 shrink-0 border-r border-gray-800">
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800 cursor-pointer hover:bg-white/5 transition" onClick={() => setIsWorkspaceCollapsed(!isWorkspaceCollapsed)}><h1 className="text-white font-bold truncate">{serverNames[activeServer] || 'Workspace'}</h1><svg className={`w-4 h-4 text-gray-400 transition-transform ${isWorkspaceCollapsed ? 'rotate-[-90deg]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg></div>
        {!isWorkspaceCollapsed && (
          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
            <div className="space-y-1">
              <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${activeNav === '대시보드' ? 'bg-white/10 text-white font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} onClick={() => setActiveNav('대시보드')}><span>📊</span> 대시보드</div>
            </div>
            <div>
              <div className="px-3 flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"><span>Channels</span></div>
              <div className="space-y-0.5">
                <div className="flex justify-between items-center px-3 py-1.5 text-gray-400 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition" onClick={() => { showToast('QA 채널로 이동합니다', 'info', '🐞'); onNavigate('message'); }}><div className="flex gap-2"><span className="text-gray-500 text-lg">#</span> qa-issue-tracking</div><Badge variant="danger">3</Badge></div>
              </div>
            </div>
          </div>
        )}
        <div className="h-16 px-4 bg-[#151515] flex items-center justify-between mt-auto cursor-pointer hover:bg-gray-800 transition" onClick={() => { showToast('내 계정 메뉴를 엽니다', 'info', '👤'); onNavigate('account'); }}>
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">U</div><div><div className="text-sm font-bold text-white">User</div></div></div>
        </div>
      </aside>

      <main className="flex-1 bg-gradient-to-b from-[#6ee7b7] to-[#fde047] flex flex-col relative overflow-hidden">
        <header className="h-16 bg-white/20 backdrop-blur-md border-b flex items-center px-6 z-10"><h2 className="text-xl font-bold text-gray-800">{activeNav}</h2></header>
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/40 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4">API 명세서 현황</h4>
              <div className="space-y-3">
                <div className="bg-white/60 p-3 rounded-xl flex justify-between"><span className="text-sm font-medium">로그인 스펙 수정</span><Badge variant="warn">진행중</Badge></div>
                <div className="bg-white/60 p-3 rounded-xl flex justify-between"><span className="text-sm font-medium">결제 파라미터</span><Badge variant="success">완료</Badge></div>
              </div>
            </div>
            <div className="bg-white/40 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between mb-4"><h4 className="font-bold text-gray-800">QA 버그 리포트</h4><Badge variant="danger">3건</Badge></div>
              <div className="bg-white/60 p-3 rounded-xl border-l-4 border-l-red-500"><div className="text-sm font-medium">사파리 브라우저 깨짐</div></div>
            </div>
            <div className="bg-white/40 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4">UX 다국어 검수</h4>
              <div className="flex justify-between items-center py-1"><span className="text-sm">🇯🇵 일본어</span><Badge variant="warn">리뷰 중</Badge></div>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isAddServerModalOpen} onClose={() => setIsAddServerModalOpen(false)} title="새 서버 추가">
        <Input placeholder="서버 이름을 입력하세요" value={newServerName} onChange={(e) => setNewServerName(e.target.value)} />
        <div className="flex gap-2 justify-end mt-4">
          <div className="w-20"><Button variant="ghost" onClick={() => setIsAddServerModalOpen(false)}>취소</Button></div>
          <div className="w-20"><Button variant="primary" onClick={addServer}>추가</Button></div>
        </div>
      </Modal>
    </div>
  );
}