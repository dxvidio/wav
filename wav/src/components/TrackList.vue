<template>
  <div class="track-list">
    <h3>Upload History</h3>
    <ul>
      <li v-for="track in tracks" :key="track.id">
        <div class="track-info">
          <span class="track-title">{{ track.title }}</span>
          <span class="track-artist">{{ track.artist || 'Unknown' }}</span>
          <span class="track-duration">{{ formatDuration(track.duration) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['trackSelected'])
const tracks = ref([])

const fetchTracks = async () => {
  try {
    const response = await fetch(`/api/tracks/${props.userId}`)
    const data = await response.json()
    if (data.success) {
      tracks.value = data.tracks
    }
  } catch (error) {
    console.error('Error fetching tracks:', error)
  }
}

const formatDuration = (s) => {
  if (!s) return '0:00'
  const mins = Math.floor(s / 60)
  const secs = s % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(fetchTracks)
</script>

<style scoped>
.track-list {
  width: 18%;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  background: rgba(27, 27, 27, 0.85);
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  color: #ededed;
}
.track-info {
  display: flex;
  flex-direction: column;
}
.track-title {
  font-weight: 600;
  margin-bottom: 4px;
  overflow-x: scroll;
}
.track-artist {
  font-size: 0.8em;
  opacity: 0.7;
  margin-bottom: 4px;
}
.track-duration {
  font-size: 0.8em;
  opacity: 0.5;
}

/* iPad Portrait */
@media (max-width: 820px) {
  .track-list {
    width: 25%;
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  .track-list {
    width: 20%;
    padding: 10px;
  }
  .track-title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 0.7em;
    overflow-x: scroll;
  }
  .track-artist {
    font-size: 0.4em;
    margin-bottom: 4px;
  }
  .track-duration {
    font-size: 0.4em;
  }
}
</style>