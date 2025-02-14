import store from '@/shared/redux/store'
import React, { Fragment } from 'react'
import { Provider } from 'react-redux'

const AuthLayout = ({ children }: any) => {
  return (
    <Fragment>
      <Provider store={store}>
        {children}
      </Provider>
    </Fragment>
  )
}

export default AuthLayout;