import { SongUser } from "./user";

export type Rating = {
    user: SongUser;
    score: number;
    comment: string | undefined;
}
