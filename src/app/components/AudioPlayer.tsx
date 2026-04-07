import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc?: string;
  title: string;
}

export function AudioPlayer({ audioSrc, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    if (vol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="backdrop-blur-sm rounded-lg p-6 shadow-2xl" style={{
      background: 'linear-gradient(to bottom right, rgba(35, 56, 90, 0.8), rgba(35, 56, 90, 0.9))',
      border: '1px solid rgba(177, 140, 90, 0.3)'
    }}>
      <h3 className="text-xl mb-4" style={{ color: '#b18c5a' }}>{title}</h3>
      
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} preload="metadata" />
      )}
      
      <div className="space-y-4">
        {/* Timeline */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer 
                       [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-4 
                       [&::-webkit-slider-thumb]:h-4 
                       [&::-webkit-slider-thumb]:rounded-full 
                       [&::-moz-range-thumb]:w-4 
                       [&::-moz-range-thumb]:h-4 
                       [&::-moz-range-thumb]:rounded-full 
                       [&::-moz-range-thumb]:border-0"
            style={{
              background: '#1a2d47',
            }}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.setProperty('--thumb-color', '#b18c5a');
            }}
          />
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              background-color: #b18c5a;
            }
            input[type="range"]::-moz-range-thumb {
              background-color: #b18c5a;
            }
          `}</style>
          <div className="flex justify-between text-sm" style={{ color: '#c8d5e8' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleRestart}
            className="p-2 rounded-full transition-colors"
            style={{ color: '#b18c5a' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(35, 56, 90, 0.5)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            aria-label="Restart"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={togglePlay}
            className="p-4 rounded-full transition-colors text-white"
            style={{ background: '#b18c5a' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#c59d6a'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#b18c5a'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="transition-colors"
            style={{ color: '#b18c5a' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#c59d6a'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#b18c5a'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none 
                       [&::-webkit-slider-thumb]:w-3 
                       [&::-webkit-slider-thumb]:h-3 
                       [&::-webkit-slider-thumb]:rounded-full 
                       [&::-moz-range-thumb]:w-3 
                       [&::-moz-range-thumb]:h-3 
                       [&::-moz-range-thumb]:rounded-full 
                       [&::-moz-range-thumb]:border-0"
            style={{
              background: '#1a2d47',
            }}
          />
        </div>
      </div>

      {!audioSrc && (
        <div className="mt-4 text-center text-sm italic" style={{ color: '#7b9fc4' }}>
          Загрузите аудиофайл для воспроизведения
        </div>
      )}
    </div>
  );
}