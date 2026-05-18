

import React, { useState, useCallback } from 'react';
import './App.css';
import MainDashboard from './MainDashboard';
import Message from './Message';
import MyAccount from './MyAccount';
import Setting from './Setting';

import Button from './components/common/Button';
import Input from './components/common/Input';
import Modal from './components/common/Modal';


// 토스트 메시지 타입 정의
interface ToastData {
  id: number;
  msg: string;
  type: string;
  icon: string;
  leaving: boolean;
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('login');
  
  const [isFindModalOpen, setIsFindModalOpen] = useState<boolean>(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);

  const [userEmail, setUserEmail] = useState<string>('');
  const [userPw, setUserPw] = useState<string>('');
  const [findName, setFindName] = useState<string>('');
  const [findPhone, setFindPhone] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPw, setSignUpPw] = useState<string>('');
  const [signUpPwConfirm, setSignUpPwConfirm] = useState<string>('');

  const [toasts, setToasts] = useState<ToastData[]>([]);

  // 토스트 함수
  const showToast = useCallback((msg: string, type: string = 'success', icon: string = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type, icon, leaving: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 2500);
  }, []);

  const mockDatabase = [
    { name: "田中", phone: "09012345678" },
    { name: "佐藤", phone: "08087654321" },
  ];

  const handleLogin = () => {
    if (!userEmail || !userPw) { showToast("情報を入力してください。", "error", "❌"); return; }
    showToast("ログインが完了しました。(로그인 성공)", "success", "✅");
    setCurrentView('main'); 
  };

  const submitAuth = () => {
    if(!findName.trim() || !findPhone.trim()) { showToast("名前と電話番号を入力してください。", "warning", "⚠️"); return; }
    const isUserExist = mockDatabase.find(user => user.name === findName && user.phone === findPhone);
    if (isUserExist) { showToast("認証が完了しました。", "success", "✅"); setIsFindModalOpen(false); } 
    else { showToast("一致するデータがありません。", "error", "❌"); }
  };

  const submitSignUp = () => {
    if(!signUpEmail.trim() || !signUpPw.trim() || !signUpPwConfirm.trim()) { showToast("すべての情報を入力してください。", "warning", "⚠️"); return; }
    if(signUpPw !== signUpPwConfirm) { showToast("パスワードが一致しません。", "error", "❌"); return; }
    showToast("メールを認証してください。", "info", "📧");
    setIsSignUpModalOpen(false);
  };

  let renderView;
  if (currentView === 'main') renderView = <MainDashboard onNavigate={setCurrentView} showToast={showToast} />;
  else if (currentView === 'message') renderView = <Message onNavigate={setCurrentView} showToast={showToast} />;
  else if (currentView === 'account') renderView = <MyAccount onNavigate={setCurrentView} showToast={showToast} />;
  else if (currentView === 'setting') renderView = <Setting onNavigate={setCurrentView} showToast={showToast} />;
  else {
    renderView = (
      <div className="fixed inset-0 flex justify-center items-center bg-hasi-gradient overflow-hidden z-[1000]">
        <div className="clouds absolute inset-0 pointer-events-none z-[1]">
  <div className="cloud-obj w-[120px] h-10 top-[15%] -left-[150px] duration-[25s]" />
  <div className="cloud-obj w-[100px] h-[35px] top-[45%] -left-[150px] duration-[35s] opacity-60" />
</div>
        <div className="bg-white/95 rounded-xl p-8 shadow-xl z-10 w-[400px]">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">LOGIN</h2>
          <Input label="E-mail" type="email" placeholder="メールアドレス" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
          <Input label="パスワード" type="password" placeholder="パスワード" value={userPw} onChange={(e) => setUserPw(e.target.value)} />
          <div className="flex justify-between text-xs text-gray-500 mb-6 mt-2">
            <span className="hover:text-blue-500 cursor-pointer" onClick={() => setIsSignUpModalOpen(true)}>新規会員登録</span>
            <span className="hover:text-blue-500 cursor-pointer" onClick={() => setIsFindModalOpen(true)}>パスワードお忘れの方</span>
          </div>
          <Button variant="primary" onClick={handleLogin}>ログイン</Button>
        </div>

        <Modal isOpen={isFindModalOpen} onClose={() => setIsFindModalOpen(false)} title="パスワードお忘れの方">
          <Input label="名前" placeholder="名前を入力してください" value={findName} onChange={(e) => setFindName(e.target.value)} />
          <Input label="電話番号" placeholder="ハイフン(-)なしで入力" value={findPhone} onChange={(e) => setFindPhone(e.target.value)} />
          <div className="mt-4"><Button variant="primary" onClick={submitAuth}>送信</Button></div>
        </Modal>

        <Modal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} title="新規会員登録">
          <Input label="E-mail" type="email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
          <Input label="パスワード" type="password" value={signUpPw} onChange={(e) => setSignUpPw(e.target.value)} />
          <Input label="パスワード再記入" type="password" value={signUpPwConfirm} onChange={(e) => setSignUpPwConfirm(e.target.value)} />
          <div className="mt-4"><Button variant="primary" onClick={submitSignUp}>送信</Button></div>
        </Modal>
      </div>
    );
  }

  // ... 이전 코드들
  return (
    <div className={currentView !== 'login' ? "flex justify-center items-center h-screen w-screen bg-gray-200" : ""}>
      {renderView}
      <div className="toast-container" id="toastContainer">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type} ${t.leaving ? 'leaving' : ''}`}>{t.icon && <span>{t.icon}</span>}<span>{t.msg}</span></div>
        ))}
      </div>
    </div>
  );
}

// export default App;  <-- 이 줄을 삭제하세요! (이미 위에서 export default function App으로 선언됨)
