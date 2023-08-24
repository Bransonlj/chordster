import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { SongEntry } from "../../types/songs";
import { useFetchSong } from "../../hooks/useFetchSong";
import styles from './SongRating.module.scss';
import Moment from 'moment';
import StarRating from "../Components/StarRating";

export default function SongRatings({songEntry}: {songEntry: SongEntry}) {

    const [ratingScore, setRatingScore] = useState<number>(0);
    const [ratingComment, setRatingComment] = useState<string>("");
    const [isEditRating, setIsEditRating] = useState<boolean>(true);
    const [hasRated, setHasRated] = useState<boolean>(false);

    const { id } = useParams();
    const { user } = useAuth();
    const { error, isLoading, isSuccess, fetchSong: handleRating } = useFetchSong(
        user, 
        `/api/song/protected/rate/${id}`,
        {}, 
        false
    );

    const { error: deleteError, isSuccess: isDeleteSuccess, fetchSong: handleDelete } = useFetchSong(
        user,
        `/api/song/protected/rate/${id}`,
        {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user?.token}`,
            }
        },
        false
    );

    useEffect(() => {
        if (user) {
            // load user's current rating
            const userRating = songEntry?.ratings.filter(rating => rating.user.username === user.username)[0];
            if (!!userRating) {
                // user has already rated.
                setHasRated(true);
                setIsEditRating(false);
                setRatingScore(userRating.score);
                setRatingComment(userRating.comment ?? "");
            }
        }
    }, [songEntry, user]);

    useEffect(() => {
        if (isSuccess) {
            setIsEditRating(false);
            setHasRated(true);
        }
    }, [isSuccess])

    useEffect(() => {
        if (isDeleteSuccess) {
            setRatingScore(0);
            setRatingComment("");
            setHasRated(false)
            setIsEditRating(true);
        }
    }, [isDeleteSuccess])

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
    }

    async function onDelete() {
        if (confirm("delete rating?")) {
            await handleDelete()
        }
    }
    
    return (
        <div className={styles.mainContainer}>
            {
                !user && <div>
                    <span>You must be logged in to rate or comment</span>  
                </div>
            }
            {
                user && isEditRating && <div>
                    <form 
                        className={styles.ratingForm}
                        onSubmit={(e) => onRate(e)}>
                        <StarRating setValue={setRatingScore} size={25} defaultValue={ratingScore}/>
                        <textarea 
                            placeholder="Write a comment..."
                            value={ratingComment} 
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRatingComment(e.target.value)} />
                        <div className={styles.buttonContainer}>
                            {hasRated && <button type="button" onClick={() => setIsEditRating(false)}>cancel</button>}
                            <button type="submit">rate</button>
                        </div>
                    </form>
                    { error && <label>Error: {error}</label> }
                    { isLoading && <label>loading</label> }
                </div>
            }
            { 
                user && !isEditRating && <div className={styles.userRating}>
                    <div className={styles.ratingContainer}>
                        <div className={styles.ratingHeader}>
                            <span className={styles.username}>{ user.username }</span>
                            <StarRating defaultValue={ratingScore} size={20} viewOnly={true} />
                            <span className={styles.date}>
                                {Moment(songEntry.ratings.find(rating => rating.user.username === user.username)?.updatedAt).format('D MMM YYYY HH:mm')}
                            </span>
                        </div>
                        <span>{ ratingComment }</span>
                    </div>
                    <div className={styles.buttons}>
                        <span onClick={() => setIsEditRating(true)}>edit</span>
                        <span onClick={ onDelete }>Delete</span>
                    </div>
                    { deleteError && <span>Error: {deleteError}</span> }
                </div>
            }
            <div>
            {
                songEntry.ratings.filter(rating => !!rating.comment && rating.user.username != user?.username).map((rating, index) => (
                    <div key={index} className={styles.ratingContainer}>
                         <div className={styles.ratingHeader}>
                            <span className={styles.username}>{ rating.user.username }</span>
                            <StarRating defaultValue={rating.score} size={20} viewOnly={true} />
                            <span className={styles.date}>{Moment(rating.updatedAt).format('D MMM YYYY HH:mm')}</span>
                        </div>
                        <span>{ rating.comment }</span>

                    </div>
                ))
            }
            </div>
        </div>
    )
}