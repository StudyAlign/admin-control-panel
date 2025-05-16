import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
//
import { authSlice } from '../redux/reducers/authSlice';
//
import Topbar from './Topbar';

const ErrorPage = () => {

    const { status } = useParams();
    //
    const dispatch = useDispatch();

    // Delete Error State on mount:
    useEffect(() => {
        dispatch(authSlice.actions.setError(null));
    }, [dispatch]);

    return (
        <>
            <Topbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-danger text-center" role="alert">
                            <h1 className="display-4">Error</h1>
                            <p className="lead">Status: {status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ErrorPage;