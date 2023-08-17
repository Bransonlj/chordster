import { useState, useEffect } from 'react';
import { Song, SongEntrySummary } from '../../types/songs';
import { Link } from 'react-router-dom';
import { sortBy } from 'lodash';

// naming corresponds to API model fields.
type SortBy = "name" | "artist" | "averageScore";

export default function SongList() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [songs, setSongs] = useState<SongEntrySummary[]>([]);

    const [sortBy, setSortBy] = useState<SortBy>("name");
    const [isDescendingSort, setIsDescendingSort] = useState<boolean>(true)

    useEffect(() => {
        setSongs([]);
        setIsLoading(true)
        fetch(`/api/song/?sortBy=${sortBy}&order=${isDescendingSort ? "desc" : "asc"}`, { 
            method: "GET"
        })
            .then(res => res.json())
            .then(res => {setSongs(res); setIsLoading(false);})
            .catch(err => {setError(err.message); setIsLoading(false);});
    }, [sortBy, isDescendingSort])

    const handleSort = (by: SortBy) => {
        if (by === sortBy) {
            setIsDescendingSort(!isDescendingSort);
        } else {
            setSortBy(by);
            setIsDescendingSort(true);
        }
    }

    const displaySort = (thisSort: SortBy): string => {
        if (sortBy === thisSort) {
            return isDescendingSort
                ? "V"
                : "^";
        } else {
            return "";
        };
    }

    if (isLoading) {
        return (
            <div>
                Loading
            </div>
        )
    }
    if (error) {
        return (
            <div>
                {error}
            </div>
        )
    }
    console.log(songs);

    return (
        <div>
            <label>sorting by: {sortBy} {isDescendingSort ? "descending" : "ascending"}</label>
            <table>
                <tr>
                    <th onClick={() => handleSort("name")}>Name {displaySort("name")}</th>
                    <th onClick={() => handleSort("artist")}>artist {displaySort("artist")}</th>
                    <th onClick={() => handleSort("averageScore")}>rating {displaySort("averageScore")}</th>
                    <th>Created by:</th>
                    <th>link</th>
                </tr>
                { songs &&
                songs.map((songEntry: SongEntrySummary, index: number) => (
                    <tr key={index}>
                        <td>{songEntry.song.name}</td>
                        <td>{songEntry.song.artist}</td>
                        <td>{songEntry.averageScore}</td>
                        <td>{songEntry.user.username}</td>
                        <td><Link to={`/song/view/${songEntry._id}`}>view</Link></td>
                    </tr>
                ))
            }
            </table>


        </div>
    )
}