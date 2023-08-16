
// User is user info stored in browser and state, for authentication purposes.
export type User = {
    username: string 
    token: string
}

// SongUser is user info obtained from database.
// TODO rename to userAccount
export type SongUser = {
    username: string;
    id: string;
}