import { Link } from "react-router-dom";
import { SongEntrySummary } from "../../types/songs";
import styles from './SongTable.module.scss'
import { FaStar } from 'react-icons/fa';

export default function SongTable({ songs }: {songs: SongEntrySummary[]}) {

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Song</th>
                    <th>Artist</th>
                    <th>Rating</th>
                    <th>Created by:</th>
                </tr>
            </thead>
            <tbody>
                { songs.map((songEntry: SongEntrySummary, index: number) => (
                        <tr key={index}>
                            <td><Link to={`/song/view/${songEntry._id}`}>{songEntry.song.name}</Link></td>
                            <td>{songEntry.song.artist}</td>
                            {
                                songEntry.averageScore === 0 
                                    ? <td></td> 
                                    : <td>{songEntry.averageScore}
                                        <FaStar className={styles.star} size={15} /> 
                                        <span className={styles.totalRatings}>{songEntry.totalRatings}</span>
                                    </td>
                            }
                            <td>{songEntry.user.username}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}