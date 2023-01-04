export type BalderdashState = number;

export const WAITING_STATE = 0;
export const WRITING_STATE = 1;
export const READING_STATE = 2;
export const GUESSING_STATE = 3;
export const SCORE_STATE = 4;

export const WAITING_STATE_NAME = "waiting";
export const WRITING_STATE_NAME = "writing";
export const READING_STATE_NAME = "reading";
export const GUESSING_STATE_NAME = "guessing";
export const SCORE_STATE_NAME = "score";

const randomChar = () : string => {
    const chars = "qwertyuiopasdfghjklzxcvbnm1234567890";
    return chars[Math.floor(Math.random() * chars.length)];
}

export const makeId = (length : number) : string => {
    let id = "";
    for (let i = 0; i < length; ++i){
        id += randomChar();
    }
    return id;
}