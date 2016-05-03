/* global SETTINGS: false */
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from 'react-mdl';

import Header from '../components/Header';
import {
  FETCH_SUCCESS,
  fetchUserProfile,
  clearProfile,
  fetchDashboard,
  clearDashboard,
  clearUI,
  updateDialogText,
  updateDialogTitle,
  setDialogVisibility,
} from '../actions/index';
import {
  validateProfileComplete,
  doDialogPolyfill
} from '../util/util';

const TERMS_OF_SERVICE_REGEX = /\/terms_of_service\/?/;
const PROFILE_REGEX = /^\/profile\/?[a-z]?/;

class App extends React.Component {
  static propTypes = {
    children:     React.PropTypes.object.isRequired,
    userProfile:  React.PropTypes.object.isRequired,
    dashboard:    React.PropTypes.object.isRequired,
    dispatch:     React.PropTypes.func.isRequired,
    history:      React.PropTypes.object.isRequired,
    ui:           React.PropTypes.object.isRequired,
  };

  static contextTypes = {
    router:   React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.fetchUserProfile(SETTINGS.username);
    this.fetchDashboard();
    this.requireTermsOfService();
    this.requireCompleteProfile();
    doDialogPolyfill.call(this);
  }

  componentDidUpdate() {
    this.fetchUserProfile(SETTINGS.username);
    this.fetchDashboard();
    this.requireTermsOfService();
    this.requireCompleteProfile();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(clearProfile());
    dispatch(clearDashboard());
    dispatch(clearUI());
  }

  fetchUserProfile(username) {
    const { userProfile, dispatch } = this.props;
    if (userProfile.getStatus === undefined) {
      dispatch(fetchUserProfile(username));
    }
  }

  fetchDashboard() {
    const { dashboard, dispatch } = this.props;
    if (dashboard.fetchStatus === undefined) {
      dispatch(fetchDashboard());
    }
  }

  requireTermsOfService() {
    const { userProfile, location: { pathname } } = this.props;
    if (
      userProfile.getStatus === FETCH_SUCCESS &&
      !userProfile.profile.agreed_to_terms_of_service &&
      !(TERMS_OF_SERVICE_REGEX.test(pathname))
    ) {
      this.context.router.push('/terms_of_service');
    }
  }

  requireCompleteProfile() {
    const {
      userProfile,
      userProfile: { profile },
      location: { pathname },
      dispatch,
    } = this.props;
    let [ complete, info ] = validateProfileComplete(profile);
    if (
      userProfile.getStatus === FETCH_SUCCESS &&
      profile.agreed_to_terms_of_service &&
      !PROFILE_REGEX.test(pathname) &&
      !complete
    ) {
      const { url, title, text } = info;
      dispatch(updateDialogText(text));
      dispatch(updateDialogTitle(title));
      dispatch(setDialogVisibility(true));
      this.context.router.push(url);
    }
  }

  dialogHelper () {
    const { ui, dispatch } = this.props;
    let visible = _.get(ui, ['dialog', 'visible'], false);
    let text = _.get(ui, ['dialog', 'text']);
    let title = _.get(ui, ['dialog', 'title']);
    let close = () => dispatch(setDialogVisibility(false));
    return (
      <Dialog open={visible} onCancel={close}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {text}
        </DialogContent>
        <DialogActions>
          <div
            role='button'
            onClick={close}
            className="mdl-button mdl-js-button"
          >
            close
          </div>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const { children, location: { pathname } } = this.props;

    let empty = false;
    if (TERMS_OF_SERVICE_REGEX.test(pathname)) {
      empty = true;
    }

    return (
      <div className="app-media layout-boxed">
        <Header empty={empty} />
        {this.dialogHelper()}
        <div className="main-content">
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userProfile:  state.userProfile,
    dashboard:    state.dashboard,
    ui:           state.ui,
  };
};

export default connect(mapStateToProps)(App);
