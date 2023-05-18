import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Dashboard from "./views/admin/Dashboard";
import Users from "./views/admin/user/Users";
import Challenge from "./views/admin/challenge/Challenge";
import AnimalProfile from "./views/admin/animal/AnimalProfile";
import Register from "./views/auth/Register";
import {auth, db} from "./firebase";
import {collection, onSnapshot} from "firebase/firestore";
import Forum from "./views/admin/forum/Forum";
import Animal from "./views/admin/album/Animal";
import Redirect from "react-router-dom/es/Redirect";
import axios from "axios";
import {BASE_URL} from "./config/defaults";
import Home from "./views/user/Home";
import ChallengeView from "./views/user/ChallengeView";
import AnimalProfileView from "./views/user/AnimalProfileView";
import ForumView from "./views/user/ForumView";

const AppRoutes = () => {
    const [userList, setUserList] = useState([]);
    const [name, setName] = useState("Name");
    const [role, setRole] = useState("Role");
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        axios.get(`${BASE_URL}profile/`)
            .then(response => {
                console.log("profile GET : ", response.data)

                setUserList(response.data);
            })

    }, []);
    useEffect(() => {
        if (userList.length) {
            console.log("Admin List : ", userList)
            userList.some(element => {
                if (element.email === auth.currentUser.email) {
                    setName(element.name);
                    setRole(element.type);
                    setUserData(element);
                }
            })
            console.log("auth.currentUser : ", auth.currentUser.email)
        }
    }, [userList])
    useEffect(() => {
        console.log("Role : ", role)
    }, [role])
    return (

        <Router>
            <Switch>
                <Route exact path="/home">
                    <Home/>
                </Route>
                <Route path="/challenge_view">
                    <ChallengeView/>
                </Route>
                <Route path="/animal_profile">
                    <AnimalProfileView/>
                </Route>
                <Route path="/forum_view">
                    <ForumView/>
                </Route>
                {/*<Route exact path="/">*/}
                {/*    <Login companyId={companyId} setCompanyId={setCompanyId}/>*/}
                {/*</Route>*/}
                <DashboardLayout name={name} role={role}>
                    <Route path="/register">
                        <Register/>
                    </Route>
                    {/*<Route path="/">*/}
                    {/*    <Users role={role}/>*/}
                    {/*</Route>*/}
                    <Route path="/user">
                        <Users role={role}/>
                    </Route>
                    <Route path="/challenge">
                        <Challenge name={name}/>
                    </Route>
                    <Route path="/animal">
                        <AnimalProfile name={name}/>
                    </Route>
                    <Route path="/forum">
                        <Forum name={name}/>
                    </Route>

                    {role === "User" && <Route render={() => <Redirect to={{pathname: "/home"}}/>}/>}
                    {role === "Admin" && <Route render={() => <Redirect to={{pathname: "/user"}}/>}/>}
                    {role === "Super Admin" && <Route render={() => <Redirect to={{pathname: "/user"}}/>}/>}

                </DashboardLayout>


            </Switch>


        </Router>
    );
};

export default AppRoutes;
