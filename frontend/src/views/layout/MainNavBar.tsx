import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './MainNavBar.module.scss';

export default function MainNavBar() {
    const { user, logout } = useAuth();
    const [search, setSearch] = useState<string>("");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get("search")

    function handleSearch() {
        if (search) {
            navigate(`/song/list?search=${search}`)
        }
    }

    function handleLogout() {
        localStorage.removeItem('user');
        logout();
    }

    useEffect(() => {
        if (searchQuery){
            setSearch(searchQuery)
        }

    }, [searchParams])

    return (
        <div className={styles.headerContainer}>
            <nav className={styles.navContainer}>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/song/list">All songs</NavLink>
                <NavLink to="/song/create">Add songs</NavLink>
            </nav>
            <div className={styles.searchBar}>
                <input value={search} onChange={(e) => setSearch(e.target.value)}></input>
                <button type="button" onClick={handleSearch}>Search</button>
            </div>
            { user &&
                <div className={styles.userContainer}>
                    <label>Welcome {user.username}</label>
                    <button type="button" onClick={handleLogout}>Log Out</button>
                </div>
            }
            { !user &&
                <nav className={styles.userContainer}>
                    <NavLink to="/login">login</NavLink>
                    <NavLink to="/signup">signup</NavLink>
                </nav>
            }

        </div>

    )
}