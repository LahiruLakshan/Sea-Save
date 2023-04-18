import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Dashboard from "./views/admin/Dashboard";
import Users from "./views/admin/user/Users";
import Drive from "./views/admin/drive/Drive";
import Advertisement from "./views/admin/advertisement/Advertisement";
import Register from "./views/auth/Register";
import {auth, db} from "./firebase";
import {collection, onSnapshot} from "firebase/firestore";
import Regulation from "./views/admin/regulation/Regulation";
import Album from "./views/admin/album/Album";
import Redirect from "react-router-dom/es/Redirect";

const AppRoutes = () => {
    const [adminList, setAdminList] = useState([]);
    const [name, setName] = useState("Name");
    const [role, setRole] = useState("Role");

    useEffect(() => {
        const adminRef = collection(db, "user");
        onSnapshot(
            adminRef,
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()});
                });
                setAdminList(list);
            },
            (error) => {
                console.log(error);
            }
        )

    }, []);
    useEffect(() => {
        if (adminList.length) {
            console.log("Admin List : ", adminList)
            adminList.some(element => {
                if (element.email === auth.currentUser.email) {
                    setName(element.username);
                    setRole(element.role)
                }
            })
            console.log("auth.currentUser : ", auth.currentUser.email)
        }
    }, [adminList])
    useEffect(() => {
        console.log("Role : ", role)
    }, [role])
    return (

        <Router>
            <Switch>
                {/*<Route exact path="/">*/}
                {/*    <Login companyId={companyId} setCompanyId={setCompanyId}/>*/}
                {/*</Route>*/}
                <DashboardLayout name={name} role={role}>
                    <Route path="/register">
                        <Register/>
                    </Route>
                    <Route exact path="/">
                        <Users role={role}/>
                    </Route>
                    <Route path="/dashboard">
                        <Dashboard/>
                    </Route>
                    <Route path="/user">
                        <Users role={role}/>
                    </Route>
                    <Route path="/advertisement">
                        <Advertisement/>
                    </Route>
                    <Route path="/drive">
                        <Drive name={name}/>
                    </Route>
                    <Route path="/album">
                        <Album name={name}/>
                    </Route>
                    <Route path="/regulation">
                        <Regulation name={name}/>
                    </Route>

                    <Route render={() => <Redirect to={{pathname: "/"}} />} />
                </DashboardLayout>
            </Switch>

        </Router>
    );
};

export default AppRoutes;
