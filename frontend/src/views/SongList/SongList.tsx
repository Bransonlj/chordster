import React from 'react';
import { useState, useEffect } from 'react';
import { Song, SongEntrySummary } from '../../types/songs';
import RadioButton from '../Components/RadioButton';
import styles from './SongList.module.scss';
import SongTable from './SongTable';
import { useSearchParams } from 'react-router-dom';

// naming corresponds to API model fields.

const sortByOptions = ["name", "artist", "averageScore", "totalRatings"] as const;
type SortBy = typeof sortByOptions[number];

const filterByOptions = ["name" , "artist" , "username"] as const;
export type FilterBy = typeof filterByOptions[number];

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

    const [filterBy, setFilterBy] = useState<FilterBy>("name");
    const [sortBy, setSortBy] = useState<SortBy>("name");
    const [isDescendingSort, setIsDescendingSort] = useState<boolean>(true)

    // pages
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchLimit, setSearchLimit] = useState<number>(25);

    const [searchParams, setSearchParams] = useSearchParams()
    const searchFilter = searchParams.get("search") ?? "";

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
    }, [sortBy, isDescendingSort, pageNumber, searchLimit, searchFilter, filterBy])

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

    const getNumberPages = (totalSongs: number): number => {
        return Math.floor(totalSongs / searchLimit) + (totalSongs % searchLimit === 0 ? 0 : 1)
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
            <div className={styles.paramsContainer}>
                <div className={styles.filterContainer}>
                    {
                        filterByOptions.map((filterOption, index) => (
                            <label
                                key={index} 
                                className={`${styles.filterOption} ${filterBy === filterOption ? styles.selected: styles.notSelected}`}
                                onClick={() => setFilterBy(filterOption)}>{filterOption}</label>
                        ))
                    }
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
            </div>
            { songs?.count === 0 && <div>
                    <label>NO RESULTS FOUND</label>
                </div>
            }
            {songs && songs.count > 0 &&
                <div>
                    <SongTable songs={songs.results} />
                    <div className={styles.pageController}>
                        <div className={styles.searchLimit}>
                            <label>result limit</label>
                            <select defaultValue={searchLimit} onChange={(e) => (setSearchLimit(parseInt(e.target.value)))}>'
                                <option value={2}>2</option>
                                <option value={5}>5</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div>
                            <button 
                                disabled={pageNumber === 1}
                                onClick={() => setPageNumber(pageNumber - 1)}
                                >prev</button>
                            { new Array(getNumberPages(songs.count)).fill(0).map((x, index) => (
                                <label 
                                    key={index + 1} 
                                    onClick={() => setPageNumber(index + 1)}    
                                >{index + 1}</label>
                            )) }
                            <button 
                                disabled={pageNumber === getNumberPages(songs.count)}
                                onClick={() => setPageNumber(pageNumber + 1)}
                                >next</button>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}