import { useEffect, useState } from 'react';
import './App.css';

import { Marquee } from './components/Marquee';
import { ConnectPanel } from './components/ConnectPanel';
import { VideoStage } from './components/VideoStage';
import { Controls } from './components/Controls';
import { StripPreview } from './components/StripPreview';
import { StripThemePicker } from './components/StripThemePicker';

import { usePeerCall } from './hooks/usePeerCall';
import { useCountdown } from './hooks/useCountdown';

import { capturePairedFrame } from './utils/photoCapture';
import { downloadPhotoStrip } from './utils/downloadStrip';
import { DEFAULT_FILTER, MAX_SHOTS } from './constants/filters';
import { STRIP_THEMES, DEFAULT_STRIP_THEME } from './constants/stripThemes';

export default function App() {
  const {
    localVideoRef,
    remoteVideoRef,
    myRoomId,
    status,
    isLive,
    remoteConnected,
    createRoom,
    joinRoom,
    switchCamera,
  } = usePeerCall();

  const { countdown, start: startCountdown } = useCountdown(3);

  const [joinCode, setJoinCode] = useState('');
  const [started, setStarted] = useState(false);
  const [filter, setFilter] = useState(DEFAULT_FILTER);
  const [shots, setShots] = useState([]);
  const [stripThemeId, setStripThemeId] = useState(DEFAULT_STRIP_THEME.id);

  const selectedTheme =
    STRIP_THEMES.find((t) => t.id === stripThemeId) ?? DEFAULT_STRIP_THEME;

  // Auto-fill the join code when opened via a `?room=` share link.
  useEffect(() => {
    const room = new URLSearchParams(window.location.search).get('room');
    if (room) setJoinCode(room);
  }, []);

  const handleCreateRoom = async () => {
    setStarted(true);
    await createRoom();
  };

  const handleJoinRoom = async (code) => {
    setStarted(true);
    await joinRoom(code);
  };

  const handleTakePhoto = async () => {
    if (!remoteConnected) return;
    await startCountdown();
    const frame = capturePairedFrame(localVideoRef.current, remoteVideoRef.current, filter);
    if (!frame) return;
    setShots((prev) => [...prev, frame].slice(-MAX_SHOTS));
  };

  return (
    <div className="app">
      <Marquee />
      <h1>Two of Us</h1>
      <p className="sub">an online photobooth for two</p>

      <div className="panel">
        <ConnectPanel
          started={started}
          joinCode={joinCode}
          onJoinCodeChange={setJoinCode}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          myRoomId={myRoomId}
        />

        <p className={`status ${isLive ? 'live' : ''}`}>{status}</p>

        <VideoStage
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          filter={filter}
          countdown={countdown}
        />

        <Controls
          filter={filter}
          onFilterChange={setFilter}
          onSwitchCamera={switchCamera}
          onTakePhoto={handleTakePhoto}
          canTakePhoto={remoteConnected}
          onResetStrip={() => setShots([])}
          onDownloadStrip={() => downloadPhotoStrip(shots, selectedTheme)}
          hasShots={shots.length > 0}
        />

        <StripThemePicker selectedThemeId={stripThemeId} onSelect={setStripThemeId} />
      </div>

      <StripPreview shots={shots} />
    </div>
  );
}
