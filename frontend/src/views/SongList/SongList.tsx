import { useState, useEffect } from 'react';
import { Song, SongEntrySummary } from '../../types/songs';
import { Link } from 'react-router-dom';
import { sortBy } from 'lodash';
import RadioButton from '../Components/RadioButton';

// naming corresponds to API model fields.
type SortBy = "name" | "artist" | "averageScore";
export type FilterBy = "name" | "artist" | "username";

export default function SongList() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [songs, setSongs] = useState<SongEntrySummary[]>([]);

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [filterBy, setFilterBy] = useState<FilterBy>("name");
    const [sortBy, setSortBy] = useState<SortBy>("name");
    const [isDescendingSort, setIsDescendingSort] = useState<boolean>(true)

    const fetchSearch = () => {
        setSongs([]);
        setIsLoading(true)
        fetch(`/api/song/?sortBy=${sortBy}&order=${isDescendingSort ? "desc" : "asc"}&filterBy=${filterBy}&filter=${searchFilter}`, { 
            method: "GET"
        })
            .then(res => res.json())
            .then(res => {setSongs(res); setIsLoading(false);})
            .catch(err => {setError(err.message); setIsLoading(false);});
    }

    useEffect(() => {
        fetchSearch()
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
    
    return (
        <div>
            <label>query: {`/api/song/?sortBy=${sortBy}&order=${isDescendingSort ? "desc" : "asc"}&filterBy=${filterBy}&filter=${searchFilter}`}</label>
            <label>Search: </label>
            <input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
            <button type='button' onClick={fetchSearch}>Search</button>
            <div>
                <label>Filter by:</label>
                <RadioButton 
                    filterByName='name'
                    filterByState={filterBy}
                    setFilterBy={setFilterBy}
                    labelName='Name'
                />
                <RadioButton 
                    filterByName='artist'
                    filterByState={filterBy}
                    setFilterBy={setFilterBy}
                    labelName='Artist'
                />
                <RadioButton 
                    filterByName='username'
                    filterByState={filterBy}
                    setFilterBy={setFilterBy}
                    labelName='Username'
                />
            </div>
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