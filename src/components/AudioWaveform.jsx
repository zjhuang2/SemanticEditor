import { useRef, useState, useEffect } from "react";
import TimelinePlugin from "https://unpkg.com/wavesurfer.js@7/dist/plugins/timeline.esm.js";
import RegionsPlugin from "https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js";
import wavesurfer from "wavesurfer.js";
import { Button, Container } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Slider from "@mui/material/Slider";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";

const AudioWaveform = () => {
  const wavesurferRef = useRef(null);
  const timelineRef = useRef(null);

  // fetch file url
  const fileURL = "darkforest.wav";

  // create an instance of the wavesurfer
  const [wavesurferInstance, setWavesurferInstance] = useState();

  const [playing, setPlaying] = useState(true); // keep track of whether the audio is playing or not
  const [volume, setVolume] = useState(1); // control the volume
  const [zoom, setZoom] = useState(1); // zoom level of the waveform
  const [duration, setDuration] = useState(0); // duration

  // create the waveform inside the correct component
  useEffect(() => {
    if (wavesurferRef.current && !wavesurferInstance) {
      setWavesurferInstance(
        wavesurfer.create({
          container: "#waveform",
          scrollParent: true,
          autoCenter: true,
          cursorColor: "violet",
          loopSelection: true,
          waveColor: "#211027",
          progressColor: "#69207F",
          responsive: true,
          plugins: [
            TimelinePlugin.create({
              container: "#wave-timeline",
            }),
            RegionsPlugin.create({}),
          ],
        })
      );
    }
  }, [wavesurferRef, wavesurferInstance]);

  // once the file URL is ready, load the file to produce the waveform
  useEffect(() => {
    if (fileURL && wavesurferInstance) {
      wavesurferInstance.load(fileURL);
    }
  }, [fileURL, wavesurferInstance]);

  useEffect(() => {
    if (wavesurferInstance) {
      //once the waveform is ready, play the audio
      wavesurferInstance.on("ready", () => {
        wavesurferInstance.play();
        wavesurferInstance.enableDragSelection({}); // to select the region to be trimmed
        setDuration(Math.floor(wavesurferInstance.getDuration())); // set the duration of the local state
      });

      // once the audio starts playing, set the state var to true
      wavesurferInstance.on("play", () => {
        setPlaying(true);
      });

      // once the audio finishes playing, set the state var to false
      wavesurferInstance.on("finish", () => {
        setPlaying(false);
      });

      // if multiple regions are created, then remove all the previous regions so that only one is present
      wavesurferInstance.on("region-created", (region) => {
        const regions = region.wavesurfer.regions.list;
        const keys = Object.keys(regions);
        if (keys.length > 1) {
          regions[keys[0]].remove();
        }
      });
    }
  }, [wavesurferInstance]);

  // set volume of the wavesurfer instance, whenever the volume state var changes
  useEffect(() => {
    if (wavesurferInstance) {
      wavesurferInstance.setVolume(volume);
    }
  }, [volume, wavesurferInstance]);

  // set zoom level of the wavesurfer object, whenever the zoom variable in state is changed
  useEffect(() => {
    if (wavesurferInstance) wavesurferInstance.zoom(zoom);
  }, [zoom, wavesurferInstance]);

  // when the duration of the audio is available, set the length of the region depending on it, so that the length does not exceed the total length of the audio
  useEffect(() => {
    if (wavesurferInstance && duration) {
      // add a region with the default length
      wavesurferInstance.addRegion({
        start: Math.floor(duration / 2) - Math.floor(duration) / 5, // time in seconds
        end: Math.floor(duration / 2), // time in seconds
        color: "hsla(265, 100%, 86%, 0.4)", // color of the selected region, light hue of purple
      });
    }
  }, [duration, wavesurferInstance]);

  const handlePlayPause = (e) => {
    wavesurferInstance.playPause();
    setPlaying(!playing);
  };

  const handleReload = (e) => {
    // stop will return the audio to 0s, then play it again
    wavesurferInstance.stop();
    wavesurferInstance.play();
    setPlaying(true); // to toggle the play/pause button icon
  };

  const handleVolumeSlider = (e) => {
    setVolume(e.target.value);
  };

  const handleZoomSlider = (e) => {
    setZoom(e.target.value);
  };

  const handleTrim = (e) => {
    if (wavesurferInstance) {
      // get start/end points of the selected region
      const region =
        wavesurferInstance.regions.list[
          Object.keys(wavesurferInstance.regions.list)[0]
        ];
      if (region) {
        const start = region.start;
        const end = region.end;

        // obtain the original array of the audio
        const originalBuffer = wavesurferInstance.backend.buffer;

        // create a temporary new buffer array with the same length, sample rate, and number of channels as the original buffer
        const newBuffer = wavesurferInstance.backend.ac.createBuffer(
          originalBuffer.numberOfChannels,
          originalBuffer.length,
          originalBuffer.sampleRate
        );

        // create 2 indices: left & right of the part to be trimmed
        const firstListIndex = start * originalBuffer.sampleRate;
        const secondListIndex = end * originalBuffer.sampleRate;
        const secondListMemAlloc =
          originalBuffer.length - end * originalBuffer.sampleRate;

        // create a new array up to the region to be trimmed
        const newList = new Float32Array(parseInt(firstListIndex));

        // create a new array of the region after the trimmed region
        const secondList = new Float32Array(parseInt(secondListMemAlloc));

        // create an array to combine the 2 parts
        const combined = new Float32Array(originalBuffer.length);

        // 2 channels: 1 left, 0-left
        // Copy the buffer values for the 2 regions from the original buffer to the new buffer

        // for the region to the left of the trimmed section
        originalBuffer.copyFromChannel(newList, 1);
        originalBuffer.copyFromChannel(newList, 0);

        // for the region to the right of the trimmed section
        originalBuffer.copyFromChannel(secondList, 1, secondListIndex);
        originalBuffer.copyFromChannel(secondList, 0, secondListIndex);

        // create the combined buffer for the trimmed audio
        combined.set(newList);
        combined.set(secondList, firstListIndex);

        // copy the combined array to the new buffer
        newBuffer.copyToChannel(combined, 1);
        newBuffer.copyToChannel(combined, 0);

        // load the new buffer, and restart the wavesurfer's waveform display
        wavesurferInstance.loadDecodedBuffer(newBuffer);
      }
    }
  };

  return (
    <>
      <Container>
        <div ref={wavesurferRef} id="waveform" />
        <div ref={timelineRef} id="wave-timeline" />
        <div className="all-controls">
          <div className="left-container">
            <button
              title="play/pause"
              className="controls"
              onClick={handlePlayPause}
            >
              {playing ? <PlayArrowIcon /> : <PauseIcon />}
            </button>
            <button title="reload" className="controls" onClick={handleReload}>
              <ReplayIcon />
            </button>
            <Button variant="outlined" className="trim" onClick={handleTrim}>
              Trim
            </Button>
          </div>
          <div className="right-container">
            <div className="volume-slide-container">
              <RemoveIcon />
              <Slider
                aria-label="Zoom"
                value={zoom}
                onChange={handleZoomSlider}
                class="slider zoom-slider"
              />
              <AddIcon />
            </div>
            <div className="volume-slide-container">
              {volume > 0 ? <VolumeUpIcon /> : <VolumeDownIcon />}
              <Slider
                aria-label="Volume"
                defaultValue={0.5}
                step={0.05}
                marks
                min={0}
                max={1}
                value={volume}
                onChange={handleVolumeSlider}
                class="slider volume-slider"
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AudioWaveform;

// // WaveSurfer Hook
// const useWavesurfer = (containerRef, options) => {
//   const [wavesurfer, setWavesurfer] = useState(null);

//   // initialize wavesurfer when the container mounts or any props change
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const ws = WaveSurfer.create({
//       ...options,
//       container: containerRef.current,
//     });

//     setWavesurfer(ws);

//     return () => {
//       ws.destroy();
//     };
//   }, [options, containerRef]);

//   return wavesurfer;
// };

// // Create a React component that will render wavesurfer
// const WaveSurferPlayer = (props) => {
//   const containerRef = useRef();
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const wavesurfer = useWavesurfer(containerRef, props);

//   // On play button click
//   const onPlayClick = useCallback(() => {
//     wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
//   }, [wavesurfer]);

//   // Initialize wavesurfer whe the container mounts or any props change
//   useEffect(() => {
//     if (!wavesurfer) return;

//     setCurrentTime(0);
//     setIsPlaying(false);

//     const subscriptions = [
//       wavesurfer.on("play", () => setIsPlaying(true)),
//       wavesurfer.on("pause", () => setIsPlaying(false)),
//       wavesurfer.on("timeupdate", (currentTime) => setCurrentTime(currentTime)),
//     ];

//     return () => {
//       subscriptions.forEach((unsub) => unsub());
//     };
//   }, [wavesurfer]);

//   return (
//     <div>
//       <div ref={containerRef} style={{ minHeight: "120px" }} />

//       <Button onClick={onPlayClick} style={{ marginTop: "1em" }}>
//         {isPlaying ? "Pause" : "Play"}
//       </Button>

//       <p>Seconds played: {currentTime}</p>
//     </div>
//   );
// };

// // Render the entire player
// const Waveform = () => {
//   const url = "../assets/darkforest.wav";

//   return (
//     <>
//       <WaveSurferPlayer
//         height={100}
//         waveColor="rgb(200, 0, 200)"
//         progressColor="rgb(100, 0, 100)"
//         url={url}
//         plugins={[Timeline.create()]}
//       />
//     </>
//   );
// };

// export default Waveform;
