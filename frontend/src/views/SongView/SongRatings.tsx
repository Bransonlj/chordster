import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { SongEntry } from "../../types/songs";
import { useFetchSong } from "../../hooks/useFetchSong";

export default function SongRatings({songEntry}: {songEntry: SongEntry}) {

    const [ratingScore, setRatingScore] = useState<number>(0);
    const [ratingComment, setRatingComment] = useState<string>("");
    const [hasRated, setHasRated] = useState<boolean>(false);
    const [isEditRating, setIsEditRating] = useState<boolean>(false);

    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // load user's current rating
            const userRating = songEntry?.ratings.filter(rating => rating.user.username === user.username)[0];
            const hasRated = !!userRating;
            if (hasRated) {
                setHasRated(true);
                setIsEditRating(false)
                setRatingScore(userRating.score);
                setRatingComment(userRating.comment ?? "");
            }
        }
    }, [songEntry, user]);

    const { error, isLoading, fetchSong: handleRating } = useFetchSong(
        user, 
        `/api/song/protected/rate/${id}`,
        {}, 
        false);


    async function onRate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const rating = {
            score: ratingScore,
            comment: ratingComment,
        }

        await handleRating({
            method: "PATCH",
            body: JSON.stringify(rating),
            headers: {
                "Content-Type": 'application/json',
                'Authorization': `Bearer ${user?.token}`,
            }
        });
        setHasRated(true);
        setIsEditRating(false);
    }

    async function onDelete() {
        if (confirm("delete rating?")) {
            await handleRating({
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${user?.token}`,
                }
            })

            setHasRated(false);
            setRatingScore(0);
            setRatingComment("");
        }
    }
    
    return (
        <div>
            {
                !(!isEditRating && hasRated) && <div>
                    <form onSubmit={(e) => onRate(e)}>
                        <label>Your review</label>
                        <input type="number" 
                            value={ratingScore} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRatingScore(Number(e.target.value))} />
                        <input value={ratingComment} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRatingComment(e.target.value)} />
                        { hasRated && <button type="button" onClick={() => setIsEditRating(false)}>cancel</button> }
                        <button type="submit">rate</button>
                    </form>
                    { error && <label>Error: {error}</label> }
                    { isLoading && <label>loading</label> }
                </div>
            }
            { 
                !isEditRating && hasRated && <div>
                    <label>{ user?.username }</label>
                    <label>{ ratingScore }</label>
                    <label>{ ratingComment }</label>
                    <label onClick={() => setIsEditRating(true)}>edit</label>
                    <label onClick={ onDelete }>Delete</label>
                </div>
            }
            {
                songEntry.ratings.filter(rating => !!rating.comment && rating.user.username != user?.username).map((rating, index) => (
                    <div key={index}>
                        <label>{ rating.user.username }</label>
                        <label>{ rating.score }</label>
                        <label>{ rating.comment }</label>
                    </div>
                ))
            }
        </div>
    )
}