import { useAuth } from "../context/AuthContext";

const SongCard = ({ song, onClick }) => {
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) onClick(); // trigger login modal
    else console.log("Play song:", song.title);
  };

  return (
    <div className="song-card" onClick={handleClick}>
      <img src={song.cover} alt={song.title} />
      <p>{song.title}</p>
      <span>{song.artist}</span>
    </div>
  );
};

export default SongCard;
