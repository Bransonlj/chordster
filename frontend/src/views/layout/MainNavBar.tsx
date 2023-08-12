import { useAuth } from "../../context/AuthContext";
import { NavLink, Outlet } from 'react-router-dom'

export default function MainNavBar() {
    const { user, logout } = useAuth();

    function handleLogout() {
        localStorage.removeItem('user');
        logout();
    }

    return (
        <div>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/song/list">All songs</NavLink>
                <NavLink to="/song/create">Add songs</NavLink>
            </nav>
            { user &&
                <div>
                    Welcome {user.username}
                    <button type="button" onClick={handleLogout}>Log Out</button>
                </div>
            }
            { !user &&
                <nav>
                    <NavLink to="/login">login</NavLink>
                    <NavLink to="/signup">signup</NavLink>
                </nav>
            }
            <Outlet/>
        </div>
    )
}