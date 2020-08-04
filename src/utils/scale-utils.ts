import { getNoteOffset, Note } from './note-utils'
import { mod } from '@/utils/others'

export enum ModeType {
  MajorPentaTonic,
  MinorPentaTonic,
  MixoLydian,
  Phrygian,
  Blues,
  Dorian,
  // 自然大调
  Ionian,
  // 自然小调
  Aeolian,

}

// 调式
export abstract class Mode {
  tonic: Note
  mode: ModeType
  protected constructor (tonic: Note, mode: ModeType) {
    this.mode = mode
    this.tonic = tonic
  }

  abstract getSignatureInScale (note: Note): string

  abstract isInScale (note: Note): boolean

  abstract jumpTone (note: Note, offset: number): Note
  // = jumpTone(note, 1)
  nextTone (note: Note) {
    return this.jumpTone(note, 1)
  }

  previousTone (note: Note): Note {
    return this.jumpTone(note, -1)
  }
}

export class IonianMode extends Mode {
  constructor (tonic: Note) {
    super(tonic, ModeType.Ionian)
  }

  getSignatureInScale (note: Note): string {
    if (note.pitch < this.tonic.pitch) {
      return this.getSignatureInScale(note.add(12))
    }
    const offset = (note.pitch - this.tonic.pitch) % 12
    if (this.mode !== ModeType.Ionian) {
      throw new Error(`unknown mode: ${this.mode}`)
    }
    const map: { [offset: number]: string } = {
      0: '1',
      1: 'b2',
      2: '2',
      3: 'b3',
      4: '3',
      5: '4',
      6: 'b5',
      7: '5',
      8: 'b6',
      9: '6',
      10: 'b7',
      11: '7'
    }
    return map[offset]
  }

  isInScale (note: Note): boolean {
    const offset = mod((note.pitch - this.tonic.pitch), 12)
    if (this.mode === ModeType.Ionian) {
      return [0, 2, 4, 5, 7, 9, 11].indexOf(offset) > -1
    }
    return false
  }

  jumpTone (note: Note, offset: number): Note {
    if (!this.isInScale(note)) {
      throw new Error(`your note: ${note} is not in scale`)
    }
    const serials = [0, 2, 4, 5, 7, 9, 11].filter(v => new Note(note.pitch + v).pitch < new Note('C6').pitch)
    const i = serials.indexOf(getNoteOffset(note, this.tonic))
    const res = this.tonic.add(Math.floor((i + offset) / serials.length) * 12 + serials[mod((i + offset), serials.length)])
    return res
  }
}

// 生成lv1难度的lick 只包含纯八度 纯五度 纯四度
export function generateLick(len: number, startNote: Note): Note[]
export function generateLick(len: number, pitch: number): Note[]
export function generateLick(len: number, signature: string): Note[]
export function generateLick (len: number, value: Note | number | string): Note[] {
  const lick: Note[] = [value instanceof Note ? value : new Note(value)]
  while (lick.length < len) {
    const pre = lick[lick.length - 1]
    const availableOperations = [-12, 12, 7, -7, 5, -5].filter(offset =>
      pre.pitch + offset > new Note('C1').pitch &&
      pre.pitch + offset < new Note('C7').pitch
    )
    lick.push(pre.add(availableOperations[Math.floor(Math.random() * availableOperations.length)]))
  }
  return lick
}

// 生成大调五声音阶 主音为起始音
// export function generateMajorPentatonicLick(len: number, startNote: Note): Note[]
// export function generateMajorPentatonicLick(len: number, pitch: number): Note[]
// export function generateMajorPentatonicLick(len: number, signature: string): Note[]
// export function generateMajorPentatonicLick (len: number, value: Note | number | string): Note[] {
//   const lick: Note[] = [value instanceof Note ? value : new Note(value)]
//   while (lick.length < len) {
//     const pre = lick[lick.length - 1]
//     const availableOperations = [-12, 12, 7, -7, 5, -5].filter(offset =>
//       pre.pitch + offset > new Note('C1').pitch &&
//       pre.pitch + offset < new Note('C7').pitch
//     )
//     lick.push(pre.add(availableOperations[Math.floor(Math.random() * availableOperations.length)]))
//   }
//   return lick
// }

// 生成自然大调音阶 主音为起始音
export function generateIonianLick(len: number, startNote: Note): Note[]
export function generateIonianLick(len: number, pitch: number): Note[]
export function generateIonianLick(len: number, signature: string): Note[]
export function generateIonianLick (len: number, value: Note | number | string): Note[] {
  const lick: Note[] = [value instanceof Note ? value : new Note(value)]
  const scale = new IonianMode(lick[0])
  while (lick.length < len) {
    const pre = lick[lick.length - 1]
    const availableSteps = [0, -1, 1, -2, 2, -3, 3]
    lick.push(scale.jumpTone(pre, availableSteps[Math.floor(Math.random() * availableSteps.length)]))
  }
  return lick
}
