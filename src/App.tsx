import { useState, useEffect } from 'react';
import { Lobby } from './components/lobby/Lobby';
import { GameBoard } from './components/game/GameBoard';
import { useGameStore } from './store/useGameStore';
import { usePlayerStore } from './store/usePlayerStore';
import { starterCards } from './game/cards';
import { audioService } from './audio/AudioService';

function App() {
  const [isInGame, setIsInGame] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(audioService.getMutedState());
  const { resetGame } = useGameStore();
  const { player, setPlayer, addCoins, resetPlayer } = usePlayerStore();

  // 监听全屏状态变化和音频解锁
  useEffect(() => {
    // 尝试播放大厅 BGM (可能会被浏览器自动播放策略拦截)
    audioService.playBGM('lobby');

    // 监听第一次用户交互来解锁音频
    const unlockAudio = () => {
      audioService.playBGM('lobby');
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error attempting to toggle fullscreen:', err);
    }
  };

  // 初始化：给玩家所有初始卡牌（12 张，满足 10 张最低要求）
  if (player.unlockedCards.length === 0) {
    setPlayer({
      unlockedCards: starterCards.map((c) => c.id),
      deck: starterCards.map((c) => c.id),
    });
  }

  const handleStartGame = () => {
    setIsInGame(true);
    audioService.playBGM('battle');
  };

  const handleGameEnd = (victory: boolean) => {
    if (victory) {
      // 胜利奖励
      addCoins(50);
      audioService.playSFX('win');
    } else {
      // 失败也有参与奖励
      addCoins(20);
      audioService.playSFX('lose');
    }
    resetGame();
    setIsInGame(false);
    audioService.playBGM('lobby');
  };

  const handleResetData = () => {
    if (confirm('确定要重置所有游戏数据吗？')) {
      resetPlayer();
      window.location.reload();
    }
  };

  const toggleMute = () => {
    setIsMuted(audioService.toggleMute());
  };

  return (
    <div className="relative w-full h-full">
      {/* 顶部控制按钮组 */}
      <div className="fixed top-4 right-4 z-[9999] flex gap-2">
        {/* 静音切换按钮 */}
        <button
          onClick={toggleMute}
          className="bg-[#e0ddd5] text-[#111] p-2 sketchy-border hover:bg-[#111] hover:text-[#e0ddd5] transition-colors flex items-center justify-center"
          title={isMuted ? "取消静音" : "静音"}
          style={{ fontFamily: 'var(--font-sketch)' }}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          )}
        </button>

        {/* 全屏切换按钮 */}
        <button
          onClick={toggleFullscreen}
          className="bg-[#e0ddd5] text-[#111] p-2 sketchy-border hover:bg-[#111] hover:text-[#e0ddd5] transition-colors flex items-center justify-center"
          title={isFullscreen ? "退出全屏" : "进入全屏"}
          style={{ fontFamily: 'var(--font-sketch)' }}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          )}
        </button>
      </div>

      {isInGame ? (
        <GameBoard onGameEnd={handleGameEnd} />
      ) : (
        <Lobby onStartGame={handleStartGame} onResetData={handleResetData} />
      )}
    </div>
  );
}

export default App;
