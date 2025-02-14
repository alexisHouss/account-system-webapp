// components/Layout.tsx
import React, { Fragment } from 'react';
import Sidebar from './sidebar';
import { Provider } from 'react-redux';
import store from '@/shared/redux/store'

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Fragment>
            <Provider store={store}>
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-4">
                        {children}
                    </main>
                </div>
            </Provider>
        </Fragment>

    );
};

export default MainLayout;
