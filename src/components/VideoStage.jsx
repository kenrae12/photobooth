
export function VideoStage({ localVideoRef, remoteVideoRef, filter, countdown }) {
  return (
    <div className="stage">
      <div className="feed">
        <video ref={localVideoRef} autoPlay playsInline muted style={{ filter }} />
        <div className="tag">You</div>
        {countdown !== null && <div className="countdown">{countdown}</div>}
      </div>
      <div className="feed">
        <video ref={remoteVideoRef} autoPlay playsInline style={{ filter }} />
        <div className="tag">Them</div>
        {countdown !== null && <div className="countdown">{countdown}</div>}
      </div>
    </div>
  );
}
