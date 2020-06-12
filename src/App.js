import React from 'react';

import './App.css';
import Tetris from './components/Tetris';
import PlayerProvider from './contexts/Player';

function App() {
  return (
    <div className="App">
      <PlayerProvider>
        <Tetris />
      </PlayerProvider>
    </div>
  );
}

export default App;
