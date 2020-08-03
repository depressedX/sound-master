<template>
  <div class="home">
    <el-input v-model="sig"></el-input>
    <el-button @click="test">test</el-button>
    {{pitch}}
  </div>
</template>

<script lang="ts">
import {
  Button,
  Input
} from 'element-ui'
import { Component, Vue } from 'vue-property-decorator'
import { Note } from '@/utils/note-utils'

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

  test () {
    this.pitch = new Note(this.sig).pitch
  }
}
</script>
