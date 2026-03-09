import { useState } from 'react';
import { Lobby } from './components/lobby/Lobby';
import { GameBoard } from './components/game/GameBoard';
import { useGameStore } from './store/useGameStore';
import { usePlayerStore } from './store/usePlayerStore';
import { starterCards } from './game/cards';

function App() {
  const [isInGame, setIsInGame] = useState(false);
  const { resetGame } = useGameStore();
  const { player, setPlayer, addCoins, resetPlayer } = usePlayerStore();

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
    <>
      {isInGame ? (
        <GameBoard onGameEnd={handleGameEnd} />
      ) : (
        <Lobby onStartGame={handleStartGame} onResetData={handleResetData} />
      )}
    </>
  );
}

export default App;
