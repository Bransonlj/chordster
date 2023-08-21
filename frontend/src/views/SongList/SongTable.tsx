import { Link } from "react-router-dom";
import { SongEntrySummary } from "../../types/songs";
import styles from './SongTable.module.scss'

export default function SongTable({ songs }: {songs: SongEntrySummary[]}) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>artist</th>
                    <th>rating</th>
                    <th>total</th>
                    <th>Created by:</th>
                    <th>link</th>
                </tr>
            </thead>
            <tbody>
                { songs.map((songEntry: SongEntrySummary, index: number) => (
                        <tr key={index}>
                            <td>{songEntry.song.name}</td>
                            <td>{songEntry.song.artist}</td>
                            <td>{songEntry.averageScore}</td>
                            <td>{songEntry.totalRatings}</td>
                            <td>{songEntry.user.username}</td>
                            <td><Link to={`/song/view/${songEntry._id}`}>view</Link></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}