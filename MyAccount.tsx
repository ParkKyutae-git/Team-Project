import React, { useState, useRef } from 'react';
import Button from './components/common/Button';
import Input from './components/common/Input';
import Modal from './components/common/Modal';
import { PageProps } from './MainDashboard';

export default function MyAccount({ onNavigate, showToast }: PageProps) {
  const [activePage, setActivePage] = useState<string>('profile');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  
  const [nickname, setNickname] = useState<string>('User');
  const [tempNickname, setTempNickname] = useState<string>('User');
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [tempStatus, setTempStatus] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [toggles, setToggles] = useState<Record<string, boolean>>({ newMsg: true, mention: true, sound: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { showToast('이미지 파일만 업로드 가능합니다', 'error', '❌'); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarUrl(ev.target?.result as string);
        showToast('프로필 사진이 업데이트됐습니다', 'success', '📷');
      };
      reader.readAsDataURL(file);
    }
  };

  const saveNickname = () => {
    if (!tempNickname.trim()) { showToast('닉네임을 입력해주세요', 'error', '❌'); return; }
    setNickname(tempNickname);
    showToast(`닉네임이 "${tempNickname}"(으)로 변경됐습니다`, 'success', '✅');
  };

  const handleToggle = (key: string) => {
    const nextState = !toggles[key];
    setToggles(prev => ({ ...prev, [key]: nextState }));
    showToast(nextState ? '알림을 켰습니다' : '알림을 껐습니다', nextState ? 'success' : 'warning', nextState ? '🔔' : '🔕');
  };

  return (
    <div className="w-[1024px] h-[720px] bg-white rounded-xl shadow-2xl flex overflow-hidden border border-gray-300 text-left">
      <aside className="w-[280px] bg-[#1e1e1e] text-white flex flex-col shrink-0">
        <div className="p-6"><div className="flex items-center gap-2 text-green-400 font-bold text-xl cursor-pointer hover:opacity-80 transition" onClick={() => { onNavigate('main'); showToast('홈으로 이동합니다', 'info', '🏠'); }}><span className="text-2xl">🏠</span> <span>HASI</span></div></div>
        
        <div className="px-4 mb-6">
          <div className="bg-white text-black rounded-lg p-2 flex items-center gap-2">
            {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover" /> : <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">U</div>} 
            <span className="font-medium text-sm">{nickname}</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button className={`w-full flex items-center justify-between p-3 rounded-lg transition ${activePage === 'profile' ? 'bg-white/10 border-l-4 border-green-400 text-white' : 'text-gray-400 hover:bg-white/5'}`} onClick={() => setActivePage('profile')}><span className="font-medium">프로필 설정</span><span>›</span></button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg text-gray-400 hover:bg-white/5 transition" onClick={() => setIsThemeModalOpen(true)}><span className="font-medium">테마 전환 (모달)</span><span>›</span></button>
          <button className={`w-full flex items-center justify-between p-3 rounded-lg transition ${activePage === 'notifications' ? 'bg-white/10 border-l-4 border-green-400 text-white' : 'text-gray-400 hover:bg-white/5'}`} onClick={() => setActivePage('notifications')}><span className="font-medium">알림 설정</span><span>›</span></button>
        </nav>
      </aside>

      <main className="flex-1 bg-gradient-to-b from-[#6ee7b7] to-[#fde047] p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-800/20 pb-2 max-w-sm">내 계정 관리</h2>
        
        {activePage === 'profile' && (
          <div className="space-y-4 max-w-3xl">
            <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl shadow-inner overflow-hidden border-2 border-white">{avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="avatar" /> : 'U'}</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow text-xs">✎</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">프로필 사진</h3>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              <div className="w-20"><Button onClick={() => fileInputRef.current?.click()}>변경</Button></div>
            </div>

            <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 border shadow-sm flex items-end gap-4">
              <div className="flex-1"><Input label="닉네임" value={tempNickname} onChange={(e) => setTempNickname(e.target.value)} /></div>
              <div className="w-24 mb-3"><Button disabled={tempNickname === nickname} onClick={saveNickname}>저장</Button></div>
            </div>
            
            <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 border shadow-sm cursor-pointer flex justify-between items-center hover:bg-white/40 transition" onClick={() => setIsStatusModalOpen(true)}>
              <div><span className="font-medium text-gray-800">상태 메시지 설정</span><p className="text-sm text-gray-500 mt-0.5">{statusMsg || '상태 메시지가 없습니다'}</p></div><span className="text-gray-600">›</span>
            </div>
          </div>
        )}

        {activePage === 'notifications' && (
          <div className="space-y-4 max-w-3xl">
            {['newMsg', 'mention', 'sound'].map((key) => (
              <div key={key} className="bg-white/30 backdrop-blur-md rounded-xl p-5 border shadow-sm flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{key === 'newMsg' ? '새 메시지 알림' : key === 'mention' ? '@멘션 알림' : '소리 알림'}</h3>
                <button className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${toggles[key] ? 'bg-green-500' : 'bg-gray-400'}`} onClick={() => handleToggle(key)}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${toggles[key] ? 'translate-x-5' : 'translate-x-0'}`}></span></button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="상태 메시지 설정">
        <div className="flex flex-wrap gap-2 mb-4">
          {['🏖️ 휴가 중', '💻 재택근무', '🎯 집중 모드'].map(preset => (<span key={preset} onClick={() => setTempStatus(preset)} className="cursor-pointer text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition">{preset}</span>))}
        </div>
        <Input placeholder="상태 메시지" value={tempStatus} onChange={(e) => setTempStatus(e.target.value)} />
        <div className="flex gap-2 justify-end mt-4">
          <div className="w-20"><Button variant="ghost" onClick={() => setIsStatusModalOpen(false)}>취소</Button></div>
          <div className="w-20"><Button variant="primary" onClick={() => { setStatusMsg(tempStatus); setIsStatusModalOpen(false); showToast('저장됐습니다', 'success', '✅'); }}>저장</Button></div>
        </div>
      </Modal>

      <Modal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} title="테마 설정">
        <p className="text-sm text-gray-600 mb-4">앱의 전체적인 분위기를 결정합니다. (데모)</p>
        <div className="flex justify-end mt-4"><div className="w-20"><Button onClick={() => { setIsThemeModalOpen(false); showToast('테마 적용 완료', 'success', '🎨'); }}>적용</Button></div></div>
      </Modal>
    </div>
  );
}