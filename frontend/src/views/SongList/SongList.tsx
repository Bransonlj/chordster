import React from 'react';
import { useState, useEffect } from 'react';
import { Song, SongEntrySummary } from '../../types/songs';
import { Link } from 'react-router-dom';
import RadioButton from '../Components/RadioButton';
import styles from './SongList.module.scss';
import SongTable from './SongTable';

// naming corresponds to API model fields.

const sortByOptions = ["name", "artist", "averageScore", "totalRatings"] as const;

type SortBy = typeof sortByOptions[number];
export type FilterBy = "name" | "artist" | "username";

type GetSongsData = {
    count: number;
    next: string | null;
    previous: string | null;
    results: SongEntrySummary[];
}
export default function SongList() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [songs, setSongs] = useState<GetSongsData>();

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [filterBy, setFilterBy] = useState<FilterBy>("name");
    const [sortBy, setSortBy] = useState<SortBy>("name");
    const [isDescendingSort, setIsDescendingSort] = useState<boolean>(true)

    // pages
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchLimit, setSearchLimit] = useState<number>(25);

    const fetchSearch = () => {
        setSongs(undefined);
        setIsLoading(true)
        fetch(`/api/song/?sortBy=${sortBy}&order=${isDescendingSort ? "desc" : "asc"}&filterBy=${filterBy}&filter=${searchFilter}&limit=${searchLimit}&offset=${(pageNumber - 1) * searchLimit}`, { 
            method: "GET"
        })
            .then(res => res.json())
            .then(res => {setSongs(res); setIsLoading(false);})
            .catch(err => {setError(err.message); setIsLoading(false);});
    }

    useEffect(() => {
        fetchSearch()
    }, [sortBy, isDescendingSort, pageNumber, searchLimit])

    const parseSortOption = (optionNumber: number) => {
        if (optionNumber < 0) {
            setIsDescendingSort(true);
        } else {
            setIsDescendingSort(false);
        }
        sortByOptions.forEach((sortByOption, index) => {
            if (index === Math.abs(optionNumber) - 1) {
                setSortBy(sortByOption);
            }
        })

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
        <div className={styles.mainContainer}>
            <label>querydebug: {`/api/song/?sortBy=${sortBy}&order=${isDescendingSort ? "desc" : "asc"}&filterBy=${filterBy}&filter=${searchFilter}&limit=${searchLimit}&offset=${(pageNumber - 1) * searchLimit}`}</label>
            <div>
                <label>Search: </label>
                <input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
                <button type='button' onClick={fetchSearch}>Search</button>
                
                <div className={styles.filterContainer}>
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
            </div>
            <div>
                <label>Sort by</label>
                <select defaultValue={(sortByOptions.indexOf(sortBy) + 1) * (isDescendingSort ? -1 : 1)} onChange={(e) => (parseSortOption(parseInt(e.target.value)))}>'
                    {
                        sortByOptions.map((option, index) => (
                            <React.Fragment key={index}>
                                <option value={-1 * (index + 1)}>{option} desc</option>
                                <option value={index}>{option} asc</option>
                            </React.Fragment>
                        ))
                    }
                </select>
            </div>
            {songs && 
                <div>
                    <SongTable songs={songs.results} />
                    <div>
                        <label>page: </label>
                        {new Array(Math.floor(songs.count / searchLimit) + (songs.count % searchLimit === 0 ? 0 : 1)).fill(0).map((x, index) => (
                            <label key={index + 1} onClick={() => setPageNumber(index + 1)}>{index + 1}</label>
                        ))
                            
                        }
                    </div>
                </div>
            }
            <label>number per page: {searchLimit}</label>
            <select defaultValue={searchLimit} onChange={(e) => (setSearchLimit(parseInt(e.target.value)))}>'
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
            </select>
        </div>
    )
}