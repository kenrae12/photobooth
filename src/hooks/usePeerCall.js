import { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

/**
 * STUN + TURN servers used for ICE negotiation. TURN is required so the
 * video call can still connect when both people are on different/restrictive
 * networks (e.g. one on WiFi, one on mobile data) where a direct peer-to-peer
 * path isn't possible. Without TURN, only whichever side has an easier NAT
 * situation ends up receiving media — which looks like "only the room
 * creator can take photos."
 */
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

/**
 * Encapsulates the peer-to-peer video call: acquiring the camera, creating or
 * joining a room via PeerJS's free signaling broker, and exposing refs/state
 * for the UI to render against.
 */
export function usePeerCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerRef = useRef(null);
  const callRef = useRef(null);
  const localStreamRef = useRef(null);
  const facingModeRef = useRef('user');

  const [myRoomId, setMyRoomId] = useState('');
  const [status, setStatus] = useState('Not connected yet.');
  const [isLive, setIsLive] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);

  const getCameraStream = useCallback(async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingModeRef.current },
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  }, []);

  const attachCallHandlers = useCallback((call) => {
    callRef.current = call;
    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
      setRemoteConnected(true);
      setIsLive(true);
      setStatus('Connected 💛 you can start taking photos!');
    });
    call.on('close', () => {
      setRemoteConnected(false);
      setIsLive(false);
      setStatus('Your partner disconnected.');
    });
  }, []);

  const createRoom = useCallback(async () => {
    await getCameraStream();
    const peer = new Peer(undefined, { config: ICE_SERVERS });
    peerRef.current = peer;

    peer.on('open', (id) => {
      setMyRoomId(id);
      setStatus(`Booth code: ${id} — send it to your partner.`);
    });
    peer.on('call', (incomingCall) => {
      incomingCall.answer(localStreamRef.current);
      attachCallHandlers(incomingCall);
    });
    peer.on('error', (err) => setStatus(`Connection error: ${err.type}`));
  }, [getCameraStream, attachCallHandlers]);

  const joinRoom = useCallback(
    async (roomId) => {
      if (!roomId?.trim()) return;
      await getCameraStream();
      const peer = new Peer(undefined, { config: ICE_SERVERS });
      peerRef.current = peer;

      peer.on('open', () => {
        setStatus(`Calling booth ${roomId}...`);
        const outgoingCall = peer.call(roomId.trim(), localStreamRef.current);
        attachCallHandlers(outgoingCall);
      });
      peer.on('error', (err) => setStatus(`Connection error: ${err.type}`));
    },
    [getCameraStream, attachCallHandlers],
  );

  const switchCamera = useCallback(async () => {
    facingModeRef.current = facingModeRef.current === 'user' ? 'environment' : 'user';
    await getCameraStream();

    const sender = callRef.current?.peerConnection
      ?.getSenders()
      .find((s) => s.track?.kind === 'video');
    const newVideoTrack = localStreamRef.current.getVideoTracks()[0];
    if (sender && newVideoTrack) sender.replaceTrack(newVideoTrack);
  }, [getCameraStream]);

  // Clean up camera + connections on unmount.
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      callRef.current?.close();
      peerRef.current?.destroy();
    };
  }, []);

  return {
    localVideoRef,
    remoteVideoRef,
    myRoomId,
    status,
    isLive,
    remoteConnected,
    createRoom,
    joinRoom,
    switchCamera,
  };
}
