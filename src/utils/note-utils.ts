
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

  // constructor(signature: string);
  // constructor(pitch: number);
  constructor(s: string|number) {
    if (typeof s === "string") {
      this.pitch = Note.getPitchOfNote(s);
    } else {
      this.pitch = Number(s);
    }
  }

  // #C5   bB3
  static getPitchOfNote(signature: string): number {
    const isFlat = signature.startsWith('#');
    const isSharp = signature.startsWith('b');

    const sigRemained = signature.slice(isFlat || isSharp ? 1 : 0);

    const name = sigRemained[0] as PitchName;
    const validNameSet = new Set(Object.keys(PitchName));
    if (!validNameSet.has(name)) {
      throw new Error(`invalid note name ${name}`);
    }

    const level = Number(sigRemained.slice(1));
    const validLevelSet = new Set([1,2,3,4,5]);
    if (!validLevelSet.has(level)) {
      throw new Error(`invalid note level ${level}`);
    }

    const pitchOrder: {
      [key in PitchName]: number
    } = {
      [PitchName.C]: 0,
      [PitchName.D]: 1,
      [PitchName.E]: 2,
      [PitchName.F]: 3,
      [PitchName.G]: 4,
      [PitchName.A]: 5,
      [PitchName.B]: 6,
    }

    return level * 12 + pitchOrder[name] + (isSharp ? 1 : isFlat ? -1 : 0)

  }

  toString() {
    return 'sharpG5';
  }

  // num: half tone
  minus(num: number): Note {
    return new Note(this.pitch - num);
  }
}
// 生成lv1难度的lick 只包含纯八度 纯五度 纯四度
// export function generateLick(len: number, startNote: Key = Key.C5) {
//
// }
