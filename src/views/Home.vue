<template>
  <div class="home">
    <el-select v-model="value" placeholder="请选择">
      <el-option
        label="模式1"
        :value="PracticeMode.LV1">
      </el-option>
      <el-option
        label="大调五声音阶"
        :value="PracticeMode.MajorPentatonic">
      </el-option>
    </el-select>
    <p>{{ lickSignature }}</p>
    <p>{{ lickSignatureInIonicMode }}</p>
    <el-button @click="reGenerateLick">点我生成lick</el-button>
  </div>
</template>

<script lang="ts">
import { Button, Input, Option, Select } from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import { Note } from '@/utils/note-utils'
import * as Tone from 'tone'
import { range, zipObject } from 'lodash-es'
import { generateIonianLick, generateLick, IonianMode, Mode, ModeType } from '@/utils/scale-utils'
import { Scale } from 'tone'

enum PracticeMode {
  LV1,
  MajorPentatonic,
}

@Component({
  name: 'Home',
  components: {
    ElButton: Button,
    ElInput: Input,
    ElSelect: Select,
    ElOption: Option
  },
  created () {
    const scale = new IonianMode(new Note('C4'))
    console.log(scale.jumpTone(new Note('F4'), -1))
  }
})
export default class HomeComponent extends Vue {
  lick: Note[] = [
    new Note('C3'),
    new Note('D3'),
    new Note('E3'),
    new Note('F3'),
    new Note('G3'),
    new Note('A3'),
    new Note('B3'),
    new Note('C4')
  ]

  get lickSignature () {
    return this.lick.map(v => v.toString()).join(' ')
  }

  get lickSignatureInIonicMode () {
    if (this.lick.length === 0) {
      return ''
    }
    const ionic = new IonianMode(this.lick[0])
    return this.lick.map(v => ionic.getSignatureInScale(v)).join(' ')
  }

  PracticeMode=PracticeMode
  value: PracticeMode|null = PracticeMode.LV1

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

  private async playLick () {
    await Tone.loaded()
    const now = Tone.now()
    this.lick.forEach((note, i) => {
      this.sampler.triggerAttackRelease(note.toString('tonejs'), 1, now + i * 0.5)
    })
  }

  reGenerateLick () {
    if (this.value === PracticeMode.LV1) {
      this.lick = generateLick(6, 'C4')
    } else if (this.value === PracticeMode.MajorPentatonic) {
      this.lick = generateIonianLick(6, 'C4')
    }
    this.playLick()
  }
}
</script>
