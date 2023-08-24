import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './StarRating.module.scss';

type StarRatingProps = {
    setValue?: React.Dispatch<React.SetStateAction<number>>;
    defaultValue?: number;
    size?: number;
    totalStars?: number;
    viewOnly?: boolean
}

export default function StarRating({setValue, defaultValue=0, size=50, totalStars=5, viewOnly=false}: StarRatingProps ) {

    const [rating, setRating] = useState<number>(defaultValue);
    const [hoverValue, setHoverValue] = useState<number>(0);

    function handleClick(value: number) {
        if (!viewOnly) {
            setRating(value);
            if (setValue) {
                setValue(value);
            }
        }
    }

    function handleHover(value: number) {
        if (!viewOnly) {
            setHoverValue(value);
        }
    }

    return (
        <div className={styles.mainContainer}>
            {[...Array(totalStars)].map((star, index) => {
                const currentRating = index + 1
                return (
                    <label className={styles.starContainer}>
                        <input
                        type='radio'
                        name='rating'
                        value={currentRating}
                        onClick={() => handleClick(currentRating)}>
                        </input>
                        <FaStar 
                            className={`${styles.star} ${viewOnly ? "" : styles.clickable} ${currentRating <= (hoverValue || rating) ? styles.selected : styles.unselected}`} 
                            onMouseEnter={() => handleHover(currentRating)}
                            onMouseLeave={() => setHoverValue(0)}
                            size={size}></FaStar>
                    </label>
                )
            }
            )}

        </div>
    )
}