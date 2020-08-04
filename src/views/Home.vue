<template>
  <div class="home">
    {{sig}}
    <el-button @click="test">click</el-button>
  </div>
</template>

<script lang="ts">
import {
  Button,
  Input
} from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import { Note } from '@/utils/note-utils'
import * as Tone from 'tone'
import { range, zipObject } from 'lodash-es'

@Component({
  name: 'Home',
  components: {
    ElButton: Button,
    ElInput: Input
  }
})
export default class HomeComponent extends Vue {
  sig = ''
  pitch = 0

  sampler = new Tone.Sampler({
    urls: zipObject([
      ...range(1, 8).map(v => `C${v}`),
      ...range(1, 9).map(v => `F#${v}`)
    ], [
      ...range(1, 8).map(v => `C${v}v10.ogg`),
      ...range(1, 9).map(v => `Fs${v}v10.ogg`)
    ]),
    release: 1,
    baseUrl: '/piano/'
  }).toDestination()

  test () {
    Tone.loaded().then(() => {
      const serials: Note[] = [
        new Note('C3'),
        new Note('D3'),
        new Note('E3'),
        new Note('F3'),
        new Note('G3'),
        new Note('A3'),
        new Note('B3'),
        new Note('C4')
      ]
      this.sig = serials.map(v => v.toString()).join(' ')
      const now = Tone.now()
      serials.forEach((note, i) => {
        this.sampler.triggerAttackRelease(note.toString('tonejs'), 1, now + i * 0.5)
      })
    })
  }
}
</script>
