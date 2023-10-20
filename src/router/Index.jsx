import React, { useEffect, useState, Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, Link, Switch, Navigate, Outlet } from 'react-router-dom'
import Navbar from '../pages/Navbar'
import Home from '../pages/Home'
import HomeKostumer from '../dashboardkostumer/Home'
import Car from '../dashbboard/Car'

import Admin from '../dashbboard/Admin'
import Layout from '../dashbboard/Layout'
import DashboardAdmin from '../dashbboard/DashboardAdmin'
import Kostumer from '../dashbboard/Kostumer'
import Booking from '../dashbboard/Booking'
import Promo from '../dashbboard/Promo'

import Login from '../pages/Login'
import {PrivateRoutes, cekLogin, PrivateRouteKostumer, PrivateRouteAdmin} from '../components/PrivateRoute'
import Register from '../pages/Register'
import LoginAdmin from '../pages/LoginAdmin'

import ResetPassword from '../pages/ResetPassword'
import LayoutKostumer from '../dashboardkostumer/LayoutKostumer'
import PesananKostumer from '../dashboardkostumer/PesananKostumer'
import SettingKostumer from '../dashboardkostumer/SettingKostumer'
import NotFound from '../pages/NotFound'
import SewaMobil from '../pages/SewaMobil'
import Supir from '../dashbboard/Supir'

function Routing() {
  const [onLogin, setOnLogin] = useState(false)

  const isLoggedIn = () => {
    setOnLogin(true)
    return localStorage.getItem('token') !== null;
  };

  return (
   <>
      <Routes>
        <Route exact path='/' element={
          <Navbar>
          <Home/>
          </Navbar>
        }>
        </Route>
         
         <Route path='/car' element={
          <Navbar>
          <Car/>
          </Navbar>
         
        } />
        <Route exact element={<PrivateRouteKostumer  />}>
         <Route path='/dashboard-kostumer/home' element={
          <LayoutKostumer>
          <HomeKostumer/>
          </LayoutKostumer>
        } />
        </Route>

        <Route exact element={<PrivateRouteKostumer  />}>
         <Route path='/dashboard-kostumer/pesanan-anda' element={
          <LayoutKostumer>
          <PesananKostumer/>
          </LayoutKostumer>
        } />
        </Route>
        <Route exact element={<PrivateRouteKostumer  />}>
         <Route path='/dashboard-kostumer/setting' element={
          <LayoutKostumer>
          <SettingKostumer/>
          </LayoutKostumer>
        } />
        </Route>
        
         <Route path='/sewa-mobil/:namaMobil' element={
          <Navbar>
          <SewaMobil/>
         </Navbar>
        } />
    
         
        <Route path='/admin' element={
          <Navbar>
          <Admin/>
          </Navbar>
        }>
        </Route>
        <Route path='/resetpassword' element={
          <Navbar>
          <ResetPassword/>
          </Navbar>
        }>
        </Route>
        <Route path='/404' element={
          <Navbar>
          <NotFound/>
          </Navbar>
        }>
        </Route>
        <Route path='*' element={
          <Navbar>
          <NotFound/>
          </Navbar>
        }>
        </Route>
        <Route exact element={<PrivateRouteAdmin  />}>
        <Route path='/dashboard/home' element={
          <Layout>
          <DashboardAdmin/>
          </Layout>
        }>
        </Route>
        </Route>
        <Route exact element={<PrivateRouteAdmin  />}>
        <Route path='/dashboard/booking' element={
          <Layout>
          <Booking/>
          </Layout>
        }>
        </Route>
        </Route>
        <Route path='/register' element={
          <Navbar>
          <Register/>
          </Navbar>
        }>
        </Route>
        <Route exact element={<PrivateRouteAdmin  />}>
        <Route path='/dashboard/car' element={
          
          <Layout>
          <Car/>
          </Layout>
        
        }>
        </Route>
        </Route>

        <Route exact element={<PrivateRouteAdmin  />}>
        <Route path='/dashboard/admin' element={
          <Layout>
          <Admin/>
          </Layout>
        }>
        </Route>
        </Route>

        <Route exact element={<PrivateRouteAdmin  />}>
        <Route path='/dashboard/promo' element={
          <Layout>
          <Promo/>
          </Layout>
        }>
        </Route>
        </Route>

        <Route exact element={<PrivateRouteAdmin  />}>
        <Route path='/dashboard/kostumer' element={
          <Layout>
          <Kostumer/>
          </Layout>
        }>
        </Route>
        </Route>

        <Route exact element={<PrivateRouteAdmin  />}>
        <Route path='/dashboard/supirs' element={
          <Layout>
          <Supir/>
          </Layout>
        }>
        </Route>
        </Route>
       
        <Route path='/login' element={
          <Navbar>
          <Login/>
          </Navbar>
        }>
        </Route>
        <Route path='/login/admin' element={
          <Navbar>
          <LoginAdmin/>
          </Navbar>
        }>
        </Route>
      </Routes>
    </>

  )}

export default Routing