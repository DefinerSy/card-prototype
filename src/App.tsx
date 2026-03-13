import { useState, useEffect } from 'react';
import { Lobby } from './components/lobby/Lobby';
import { GameBoard } from './components/game/GameBoard';
import { useGameStore } from './store/useGameStore';
import { usePlayerStore } from './store/usePlayerStore';
import { starterCards } from './game/cards';

function App() {
  const [isInGame, setIsInGame] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { resetGame } = useGameStore();
  const { player, setPlayer, addCoins, resetPlayer } = usePlayerStore();

  // 监听全屏状态变化
  useEffect(() => {
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
  };

  const handleGameEnd = (victory: boolean) => {
    if (victory) {
      // 胜利奖励
      addCoins(50);
    } else {
      // 失败也有参与奖励
      addCoins(20);
    }
    resetGame();
    setIsInGame(false);
  };

  const handleResetData = () => {
    if (confirm('确定要重置所有游戏数据吗？')) {
      resetPlayer();
      window.location.reload();
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 全屏切换按钮 */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-[9999] bg-[#e0ddd5] text-[#111] p-2 sketchy-border hover:bg-[#111] hover:text-[#e0ddd5] transition-colors flex items-center justify-center"
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

      {isInGame ? (
        <GameBoard onGameEnd={handleGameEnd} />
      ) : (
        <Lobby onStartGame={handleStartGame} onResetData={handleResetData} />
      )}
    </div>
  );
}

export default App;
