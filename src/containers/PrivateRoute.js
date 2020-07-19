import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Route,
  Redirect
} from 'react-router-dom';
@connect(
  state => {
    return {
      isAuthenticated: state.auth.isAuthenticated
    }
  }
)
export default class PrivateRoute extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  }
  handleRender = () => {
    const {
      component: ComposedComponent
    } = this.props

    if(this.props.isAuthenticated) {
      return (
        <ComposedComponent {...this.props} />
      )
    } else {
      return (
        <Redirect
          to={{
            pathname: '/signin',
            state: {
              from: this.props.location,
              message: 'Please log in first, thank you! '
            }
          }}
        />
      )
    }
  }

  
  render() {
    const {
      component,
      ...rest
    } = this.props

    return (
      <Route {...rest} render={this.handleRender} />
    )
  }
}
