/**
 * Room creation / join controls, shown until a call has been started.
 * Once `myRoomId` is set, also renders the shareable code + link.
 */
export function ConnectPanel({
  started,
  joinCode,
  onJoinCodeChange,
  onCreateRoom,
  onJoinRoom,
  myRoomId,
}) {
  const shareLink = myRoomId
    ? `${window.location.origin}${window.location.pathname}?room=${myRoomId}`
    : '';

  const handleCopyLink = () => navigator.clipboard.writeText(shareLink);

  return (
    <>
      {!started && (
        <div className="connect-row">
          <button className="primary" onClick={onCreateRoom}>
            Start a Booth
          </button>
          <span>or</span>
          <input
            type="text"
            placeholder="paste code here"
            value={joinCode}
            onChange={(e) => onJoinCodeChange(e.target.value)}
          />
          <button onClick={() => onJoinRoom(joinCode)}>Join Booth</button>
        </div>
      )}

      {myRoomId && (
        <div className="hint">
          Share this code: <b>{myRoomId}</b>
          <br />
          or send this link: <a href={shareLink}>{shareLink}</a>{' '}
          <button onClick={handleCopyLink}>Copy link</button>
        </div>
      )}
    </>
  );
}
