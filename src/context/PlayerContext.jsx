import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props)=> {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [trackIndex, setTrackIndex] = useState(0);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime:{
            second:0,
            minute:0
        },
        totalTime:{
            second:0,
            minute:0
        }
    })

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const playWithId = async (id)=> {
        setTrackIndex(id);
        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previous = () => {
        if (trackIndex > 0) {
            setTrackIndex(trackIndex - 1);
        }
    }

    const next = () => {
        if (trackIndex < songsData.length - 1) {
            setTrackIndex(trackIndex + 1);
        }
    }

    const seekSong = async (e)=> {
       audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }

    useEffect(()=> {
        setTimeout(()=> {
            audioRef.current.ontimeupdate = ()=> {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%";
                setTime({
                    currentTime:{
                        second:Math.floor(audioRef.current.currentTime%60),
                        minute:Math.floor(audioRef.current.currentTime/60)
                    },
                    totalTime:{
                        second:Math.floor(audioRef.current.duration%60),
                        minute:Math.floor(audioRef.current.duration/60)
                    }
                })
            }
        }, 1000);
    }, [audioRef])

    const contextValue = {
         audioRef,
         seekBar,
         seekBg,
         track: songsData[trackIndex],
         playStatus,
         time,
         play,
         pause,
         playWithId,
         previous,
         next,
         seekSong
         
    }

    return(
        <PlayerContext.Provider value = {contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider;
