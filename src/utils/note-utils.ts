
export enum PitchName {
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  A = 'A',
  B = 'B'
}

export class Note {
  // offset between C1
  pitch: number

  constructor (s: string|number) {
    if (typeof s === 'string') {
      this.pitch = Note.getPitchOfNote(s)
    } else {
      this.pitch = Number(s)
    }
  }

  // #C5   bB3
  static getPitchOfNote (signature: string): number {
    const isFlat = signature.startsWith('b')
    const isSharp = signature.startsWith('#')

    const sigRemained = signature.slice(isFlat || isSharp ? 1 : 0)

    const name = sigRemained[0] as PitchName
    const validNameSet = new Set(Object.keys(PitchName))
    if (!validNameSet.has(name)) {
      throw new Error(`invalid note name ${name}`)
    }

    const level = Number(sigRemained.slice(1))
    const validLevelSet = new Set([1, 2, 3, 4, 5, 6, 7])
    if (!validLevelSet.has(level)) {
      throw new Error(`invalid note level ${level}`)
    }

    const pitchOrder: {
      [key in PitchName]: number
    } = {
      [PitchName.C]: 0,
      [PitchName.D]: 2,
      [PitchName.E]: 4,
      [PitchName.F]: 5,
      [PitchName.G]: 7,
      [PitchName.A]: 9,
      [PitchName.B]: 11
    }

    return (level - 1) * 12 + pitchOrder[name] + (isSharp ? 1 : isFlat ? -1 : 0)
  }

  // 默认使用 |bB3| 这种格式，也可以使用'tonejs'
  toString (format?: 'tonejs') {
    const offset = this.pitch % 12
    const level = Math.floor(this.pitch / 12) + 1

    const pitchOrder: {
      [key in PitchName]: number
    } = {
      [PitchName.C]: 0,
      [PitchName.D]: 2,
      [PitchName.E]: 4,
      [PitchName.F]: 5,
      [PitchName.G]: 7,
      [PitchName.A]: 9,
      [PitchName.B]: 11
    }

    const pitchList = Object.keys(pitchOrder).map((v) => ({
      name: v,
      value: pitchOrder[v as PitchName]
    })).sort((a, b) => a.value - b.value)

    let pitchIndex = pitchList.findIndex(v => offset <= v.value)
    let hasSharp = false
    if (pitchList[pitchIndex].value > offset) {
      pitchIndex--
      hasSharp = true
    }
    const pitchName = pitchList[pitchIndex].name

    return format === 'tonejs' ? `${pitchName}${hasSharp ? '#' : ''}${level}` : `${hasSharp ? '#' : ''}${pitchName}${level}`
  }

  // num: half tone
  minus (num: number): Note {
    return new Note(this.pitch - num)
  }

  // num: half tone
  add (num: number): Note {
    return new Note(this.pitch + num)
  }
}

export function getNoteOffset (note: Note, targetNote: Note): number {
  if (note.pitch < targetNote.pitch) {
    return getNoteOffset(new Note(note.pitch + Math.ceil((targetNote.pitch - note.pitch) / 12)), targetNote)
  }
  return (note.pitch - targetNote.pitch) % 12
}
