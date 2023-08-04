export const Accidentals = ["b", "", "#"] as const;

export type Accidental = typeof Accidentals[number];

export const Letters = ["A" , "B" , "C" , "D" , "E" , "F" , "G"] as const;

export type NoteLetter = typeof Letters[number];

export const majorChords = ["maj", "maj7"] as const;
export const minorChords = ["min", "min7"] as const;

export type ChordType = typeof majorChords[number] | typeof minorChords[number];

export type Chord = {
    noteLetter: NoteLetter | undefined;
    accidental: Accidental | undefined;
    chordType: ChordType | undefined;
}

export const numeralUpperCase = ["I", "II", "III", "IV", "V", "VI", "VII"] as const;
export const numeralLowerCase = ["i", "ii", "iii", "iv", "v", "vi", "vii"] as const;

export type Numeral = typeof numeralUpperCase[number] | typeof numeralLowerCase[number];

export type NumericChord = {
    numeral: Numeral;
    accidental: Accidental;
    chordType: ChordType;
}

export type Key = {
    noteLetter: NoteLetter | undefined;
    accidental: Accidental | undefined;
    // either major or minor key
    isMajor: boolean;
}

export const emptyChord: Chord = {
    noteLetter: undefined,
    accidental: undefined,
    chordType: undefined,
}

export const defaultKey: Key = {
    noteLetter: undefined,
    accidental: undefined,
    isMajor: true,
}