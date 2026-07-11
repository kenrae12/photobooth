import { useEffect, useState } from 'react';
import './App.css';

import { Marquee } from './components/Marquee';
import { ConnectPanel } from './components/ConnectPanel';
import { VideoStage } from './components/VideoStage';
import { Controls } from './components/Controls';
import { StripPreview } from './components/StripPreview';

import { usePeerCall } from './hooks/usePeerCall';
import { useCountdown } from './hooks/useCountdown';

import { capturePairedFrame } from './utils/photoCapture';
import { downloadPhotoStrip } from './utils/downloadStrip';
import { DEFAULT_FILTER, MAX_SHOTS } from './constants/filters';

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
      <h1>Gawa kong photobooth para satin</h1>
      <p className="sub">To make memories</p>

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
          onDownloadStrip={() => downloadPhotoStrip(shots)}
          hasShots={shots.length > 0}
        />
      </div>

      <StripPreview shots={shots} />
    </div>
  );
}
