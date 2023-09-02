export const Accidentals = ["b", "", "#"] as const;

export type Accidental = typeof Accidentals[number];

export const Letters = ["A" , "B" , "C" , "D" , "E" , "F" , "G"] as const;
export const emptyNoteLetter = "N/A"

export type NonEmptyNoteLetter = typeof Letters[number]
export type EmptyNoteLetter = typeof emptyNoteLetter

export type NoteLetter = NonEmptyNoteLetter | EmptyNoteLetter;

// empty type "" represents major chord.
export const majorChords = ["", "maj7", "7", "sus4", "sus2"] as const;
export const minorChords = ["m", "m7"] as const;

export type ChordType = typeof majorChords[number] | typeof minorChords[number];

export type Chord = {
    noteLetter: NoteLetter;
    accidental: Accidental;
    chordType: ChordType;
}

export const numeralUpperCase = ["I", "II", "III", "IV", "V", "VI", "VII"] as const;
export const numeralLowerCase = ["i", "ii", "iii", "iv", "v", "vi", "vii"] as const;
export const emptyNumeral = "N/A"

export type EmptyNumeral = typeof emptyNumeral;

export type NonEmptyNumeral = typeof numeralUpperCase[number] | typeof numeralLowerCase[number];

export type Numeral = NonEmptyNumeral | EmptyNumeral;

export type NumericChord = {
    numeral: Numeral;
    accidental: Accidental;
    chordType: ChordType;
}

export type Key = {
    noteLetter: NoteLetter;
    accidental: Accidental;
    // either major or minor key
    isMajor: boolean;
}
