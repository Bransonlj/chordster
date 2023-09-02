import { Accidental, Chord, NoteLetter, NumericChord, Key, majorChords, minorChords, Numeral, Letters, Accidentals, ChordType, NonEmptyNoteLetter, emptyNoteLetter, NonEmptyNumeral, emptyNumeral } from "../types/chords";

// default has alternative meaning of empty
export const defaultChord: Chord = {
    noteLetter: emptyNoteLetter,
    accidental: "",
    chordType: "",
}

export const defaultKey: Key = {
    noteLetter: emptyNoteLetter,
    accidental: "",
    isMajor: true,
}

export function getAllChords(): Chord[] {
    const chords: Chord[] = [];
    // Add default chord
    chords.push(defaultChord);
    Letters.forEach((letter: NoteLetter) => {
        Accidentals.forEach((accidental: Accidental) => {
            majorChords.forEach((chordType: ChordType) => {
                chords.push({
                    noteLetter: letter,
                    accidental: accidental,
                    chordType: chordType,
                })
            })
            minorChords.forEach((chordType: ChordType) => {
                chords.push({
                    noteLetter: letter,
                    accidental: accidental,
                    chordType: chordType,
                })
            })
        })
    })

    return chords;
}

export function chordToString(chord: Chord | undefined): string {
    if (chord) {
        if (isEmptyChord(chord)) {
            // return "N/A"
            return emptyNoteLetter;
        } else {
            // normal chord
            return chord.noteLetter + chord.accidental + chord.chordType;
        }
    } else {
        return "";
    }
}

export function numericToString(numeric: NumericChord): string {
    if (isEmptyNumericChord(numeric)) {
        return emptyNumeral;
    } else {
        return numeric.numeral + numeric.accidental + numeric.chordType;
    }
}

export function getAllKeys(): Key[] {
    const keys: Key[] = [];
    // Add default key
    keys.push(defaultKey)
    Letters.forEach((letter: NoteLetter) => {
        Accidentals.forEach((accidental: Accidental) => {
            keys.push({
                noteLetter: letter,
                accidental: accidental,
                isMajor: true,
            });
            keys.push({
                noteLetter: letter,
                accidental: accidental,
                isMajor: false,
            });
        })
    })

    return keys;
}

export function keyToString(key: Key | undefined): string {
    if (key) {
        if (isEmptyKey(key)) {
            // return "N/A"
            return key.noteLetter
        } else {
            // normal key
            return key.isMajor 
                ? key.noteLetter + key.accidental
                : key.noteLetter + key.accidental + "m";
        }
    } else {
        return "";
    }
}

/* 
    Notes are counted from 0 to 11
 */

function valueOfLetter(letter: NonEmptyNoteLetter): number {
    switch (letter) {
        case "A":
            return 0;
        case "B":
            return 2;
        case "C":
            return 3;
        case "D":
            return 5;
        case "E":
            return 7;
        case "F":
            return 8;
        case "G":
            return 10;
    }
}

function letterFromValue(num: number): NonEmptyNoteLetter | undefined {
    switch (num) {
        case 0:
            return "A";
        case 2:
            return "B";
        case 3:
            return "C";
        case 5:
            return "D";
        case 7:
            return "E";
        case 8:
            return "F";
        case 10:
            return "G";
        default:
            return;
    }
}

function valueOfAccidental(accidental: Accidental): number {
    switch (accidental) {
        case "b":
            return -1;
        case "":
            return 0;
        case "#":
            return 1;
    }
}

function numeralFromValue(value: number, isKeyMajor: boolean, isChordMajor: boolean): NonEmptyNumeral | undefined {
    if (isKeyMajor) {
        switch (value) {
            case 0: 
                return isChordMajor ? "I" : "i";
            case 2:
                return isChordMajor ? "II" : "ii";
            case 4:
                return isChordMajor ? "III" : "iii";
            case 5:
                return isChordMajor ? "IV" : "iv";
            case 7:
                return isChordMajor ? "V" : "v";
            case 9:
                return isChordMajor ? "VI" : "vi";
            case 11:
                return isChordMajor ? "VII" : "vii";
            default:
                return;
            
        }
    } else {
        switch (value) {
            case 0: 
                return isChordMajor ? "I" : "i";
            case 2:
                return isChordMajor ? "II" : "ii";
            case 3:
                return isChordMajor ? "III" : "iii";
            case 5:
                return isChordMajor ? "IV" : "iv";
            case 7:
                return isChordMajor ? "V" : "v";
            case 8:
                return isChordMajor ? "VI" : "vi";
            case 10:
                return isChordMajor ? "VII" : "vii";
            default:
                return;
        }
    }
}


export function isMajorChord(chord: Chord): boolean {
    return majorChords.includes(chord.chordType as any);
}

export function isMinorChord(chord: Chord): boolean {
    return minorChords.includes(chord.chordType as any);
}

// checks if chord isEmpty depending on noteLetter, regardless of accidental or chordType
export function isEmptyChord(chord: Chord): boolean {
    return chord.noteLetter === emptyNoteLetter;
}

export function isEmptyNumericChord(chord: NumericChord): boolean {
    return chord.numeral === emptyNumeral;
}

// checks if key isEmpty depending on noteLetter, regardless of accidental or isMajor
export function isEmptyKey(key: Key): boolean {
    return key.noteLetter === emptyNoteLetter;
}


export function transposeChord(chord: Chord, amount: number): Chord {
    let accidental: Accidental = chord.accidental;
    if (isEmptyChord(chord)) {
        // empty chord (N/A), don't transpose
        return chord
    }

    let value: number = valueOfLetter(chord.noteLetter as NonEmptyNoteLetter) + amount;
    if (value > 11) {
        value -= 12;
    }

    if (value < 0) {
        value += 12;
    }

    let letter: NoteLetter | undefined = letterFromValue(value);
    if (!letter) {
        // new note is not natural, change accidental.
        if (chord.accidental) {
            // remove accidental
            value += valueOfAccidental(chord.accidental);
            accidental = "";
        } else {
            // add accidental, default to adding a sharp
            value -= 1;
            accidental = "#"
        }

        if (value > 11) {
            value -= 12;
        }
    
        if (value < 0) {
            value += 12;
        }
        // guranteed to be valid letter now
        letter = letterFromValue(value) as NoteLetter;
    }

    return {
        noteLetter: letter,
        accidental: accidental,
        chordType: chord.chordType
    }
}

export function toNumericChord(chord: Chord, key: Key): NumericChord {
    let accidental: Accidental = chord.accidental;
    if (isEmptyChord(chord) || isEmptyKey(key)) {
        // if empty chord or empty key, cannot convert to numeric, return empty Numeric Chord ("N/A")
        return {
            numeral: emptyNumeral,
            accidental: "",
            chordType: "",
        }
    }

    // guarateed to be non-empty
    const keyValue: number = valueOfLetter(key.noteLetter as NonEmptyNoteLetter) + valueOfAccidental(key.accidental);
    const chordValue: number = valueOfLetter(chord.noteLetter as NonEmptyNoteLetter);
    let interval: number = chordValue - keyValue;
    if (interval > 11) {
        interval -= 12;
    }

    if (interval < 0) {
        interval += 12;
    }

    let numeral: Numeral | undefined = numeralFromValue(interval, key.isMajor, isMajorChord(chord));
    if (!numeral) {
        // new numeral is not natural, change accidental
        if (chord.accidental) {
            // remove accidental
            interval += valueOfAccidental(chord.accidental);
            accidental = "";
        } else {
            // add accidental, default to adding a sharp
            interval -= 1;
            accidental = "#"
        }

        if (interval > 11) {
            interval -= 12;
        }
    
        if (interval < 0) {
            interval += 12;
        }
        // guranteed to be valid numeral now
        numeral = numeralFromValue(interval, key.isMajor, isMajorChord(chord)) as Numeral;
    }

    // if chordtype is normal minor, don't display "m"
    const chordType = chord.chordType === "m" ? "" : chord.chordType

    return {
        numeral: numeral,
        accidental: accidental,
        chordType: chordType,
    }
}

