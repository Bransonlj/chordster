import { useAuth } from "../../context/AuthContext";
import { NavLink, Outlet } from 'react-router-dom';
import styles from './MainNavBar.module.scss';

export default function MainNavBar() {
    const { user, logout } = useAuth();

    function handleLogout() {
        localStorage.removeItem('user');
        logout();
    }

    return (
        <>
            <div className={styles.mainContainer}>
                <nav className={styles.navContainer}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/song/list">All songs</NavLink>
                    <NavLink to="/song/create">Add songs</NavLink>
                </nav>
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
            <div className={styles.content}>
                <Outlet/>
            </div>
        </>
    )
}