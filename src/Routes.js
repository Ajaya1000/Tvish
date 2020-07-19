import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { connect } from 'react-redux';
import PrivateRoute from './containers/PrivateRoute';
import Login from './containers/Login';
import Home from './containers/Home/index';
import * as storage from './utils/storage';
import PropTypes from 'prop-types'
import {
  ADMIN_ID,
  TOKEN
} from './constants';
import {
  setCurrentUser,syncLoggedUser
} from './actions'
import { auth } from 'firebase';

@connect(
  state => {
    return {
      isAuthenticated: state.auth.isAuthenticated
    }
  },
  dispatch => ({
    setCurrentUser: (user) => {
      return dispatch(setCurrentUser(user))
    }
  })
)
export default class Routes extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    //  
    setCurrentUser: PropTypes.func.isRequired
  }

  componentDidMount() {
    console.log('component did mount called');
    const adminId = storage.getStorage(ADMIN_ID);
   let currentUser= auth().currentUser;
    console.log(adminId);
    console.log(currentUser);
    // const token = storage.getStorage(TOKEN)
    if (adminId ) {
      this.props.setCurrentUser({
        adminId,
      })
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/signin" component={Login}/>
          <PrivateRoute exract component={Home}/>
        </Switch>
      </Router>
    )
  }
}
