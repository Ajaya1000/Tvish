import { FETCH_TOKEN, SET_CURRENT_USER, AUTH_ERROR } from "./types";
import { ADMIN_ID, TOKEN } from "../constants";
import * as utils from "../utils";
// import authService from '../services/authService';
import { signIn, signOut, auth, signUp } from "../firebase";

function fetchToken() {
  return {
    type: FETCH_TOKEN,
  };
}

function setCurrentUser(admin) {
  utils.setStorage(ADMIN_ID, admin);
  // utils.setStorage(ADMIN_ID, adminId)

  return {
    type: SET_CURRENT_USER,
    admin,
  };
}

function authError(error) {
  utils.removeStorage(ADMIN_ID);
  utils.removeStorage(TOKEN);
  return {
    type: AUTH_ERROR,
    payload: error,
  };
}

function signin(username, password) {
  return async (dispatch) => {
    console.log("signin called");
    try {
      dispatch(fetchToken());
      await signIn(username, password);
       dispatch(setCurrentUser(username));
    } catch (err) {
      console.log("error");
      if (err.message === undefined) {
        const errorMessage = "Server error, please try again later";
        return dispatch(authError(errorMessage));
      }
      return dispatch(authError(err.message));
    }
  };
}
function signup(username, password) {
  console.log('username inside signup'+ username)
  return async (dispatch) => {
    console.log("signup called");
    try {
      dispatch(fetchToken());
      await signUp(username, password);
      dispatch(setCurrentUser(username));
    } catch (err) {
      console.log("error");
      if (err.message === undefined) {
        const errorMessage = "Server error, please try again later";
        return dispatch(authError(errorMessage));
      }
      return dispatch(authError(err.message));
    }
  };
}
function signout() {
  return async (dispatch) => {
    utils.removeStorage(TOKEN);
    await signOut();
    dispatch(setCurrentUser({}));
  };
}
function syncLoggedUser() {
  return (dispatch) => {
     auth().onAuthStateChanged()
      .then((user) => dispatch(setCurrentUser(user)))
      .catch((error) => {
        return dispatch(authError(error.message));
      });
  };
}

export { setCurrentUser, authError, signin, signout, signup, syncLoggedUser };
