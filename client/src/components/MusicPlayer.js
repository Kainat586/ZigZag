// src/components/MusicPlayer.js
import React, { useState, useEffect } from 'react';
import './MusicPlayer.css';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

const MusicPlayer = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!song) return;
    // Clean up previous audio if any
    setAudio(prev => {
      if (prev) prev.pause();
      return null;
    });
    const newAudio = new window.Audio(`http://localhost:5000/${song.audioPath}`);
    setAudio(newAudio);
    setProgress(0);
    setIsPlaying(false);
    return () => newAudio.pause();
  }, [song]);

  useEffect(() => {
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    const updateProgress = () => {
      setProgress(audio.currentTime / audio.duration || 0);
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [audio, isPlaying]);

  const handleSeek = (e) => {
    if (!audio) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
    setProgress(percent);
  };

  if (!song) return null;

  return (
    <div className="music-player">
      <div className="now-playing">
        <img
          src={`http://localhost:5000/${song.imagePath}`}
          alt={song.title}
          onError={(e) => (e.target.src = '/images/default.jpg')}
          width="56"
          height="56"
          style={{ borderRadius: 8, marginRight: 16 }}
        />
        <div>
          <strong style={{ color: '#fff' }}>{song.title}</strong>
          <p style={{ color: '#aaa', margin: 0 }}>{song.artist}</p>
        </div>
      </div>
      <div className="player-controls">
        <button className="icon-button" title="Previous" disabled><FaStepBackward /></button>
        <button className="icon-button play-icon" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="icon-button" title="Next" disabled><FaStepForward /></button>
      </div>
      <div className="player-seek" onClick={handleSeek}>
        <div className="player-seek-bar">
          <div className="player-seek-progress" style={{ width: `${progress * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
