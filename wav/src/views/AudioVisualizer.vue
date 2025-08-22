<script setup>
import { ref, onMounted } from 'vue'
import { initializeAudioVisualizer } from '../audioVisualizer.js'
import TrackList from '../components/TrackList.vue'
import * as mm from 'music-metadata-browser'

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

const audioElement = ref(null)
const fileInput = ref(null)
const trackList = ref(null)

const extractMetadata = async (file) => {
  try {
    const metadata = await mm.parseBlob(file)
    if (metadata.format.duration) {
      duration = Math.floor(metadata.format.duration)
    } else {
      const objectUrl = URL.createObjectURL(file)
      duration = await getDurationFromAudio(objectUrl)
      URL.revokeObjectURL(objectUrl)
    }
    return {
      title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist || 'Unknown Artist',
      duration: duration || 0,
      filePath: URL.createObjectURL(file),
      userId: props.userId
    }
  } catch (error) {
    console.warn('Error extracting metadata:', error)
    const duration = await getDurationFromAudio(URL.createObjectURL(file))
    return {
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist',
      duration: duration,
      filePath: URL.createObjectURL(file),
      userId: props.userId
    }
  }
}

const getDurationFromAudio = (url) => {
  return new Promise((resolve) => {
    const audio = new Audio()
    audio.src = url
    audio.onloadedmetadata = () => {
      resolve(Math.floor(audio.duration))
      URL.revokeObjectURL(url)
    }
    audio.onerror = () => resolve(0)
  })
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    const metadata = await extractMetadata(file)
    audioElement.value.src = metadata.filePath

    const response = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata)
    })
    const data = await response.json()
    if (data.success) {
      trackList.value.fetchTracks()
    } else {
      console.error('Failed to save track:', data.error)
    }
  } catch (error) {
    console.error('Error processing file:', error)
  }
}

const handleTrackSelected = (track) => {
  audioElement.value.src = track.filePath
  audioElement.value.play()
}

onMounted(() => {
  initializeAudioVisualizer()
})
</script>

<template>
  <div id="container">
    <canvas id="canvas-audio"></canvas>
    <div id="audio-container">
      <input 
        type="file" 
        id="file-upload" 
        ref="fileInput" 
        accept="audio/*" 
        @change="handleFileUpload" 
      />
      <audio id="audio-player" ref="audioElement" aria-label="Audio player" controls></audio>
    </div>
    <TrackList ref="trackList" :userId="userId" @track-selected="handleTrackSelected" />
  </div>
</template>

<style scoped>
#container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
}
#canvas-audio {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(4px) contrast(5);
}
#audio-container {
  position: relative;
  width: 82%;
  display: flex;
  flex-direction: row;
  top: 80px;
  align-items: center;
  justify-content: center;
}
#audio-player {
  width: 30%;
}
#file-upload {
  color: #ededed;
}

/* iPad Portrait */
@media (max-width: 820px) {
  #audio-container {
    flex-direction: column-reverse;
    width: 75%;
  }
  #audio-player {
    width: 60%;
  }
  #file-upload {
    margin-top: 40px;
  }
}
/* Mobile Portrait */
@media (max-width: 480px) {
  #audio-container {
    top: 40px;
    height: 120px;
    flex-direction: column-reverse;
    width: 70%;
  }
  #audio-player {
    width: 90%;
  }
}
</style>