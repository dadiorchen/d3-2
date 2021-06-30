import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import styles from '../../../styles/Modal.module.css';
import WelcomeData from './welcome-data';

import { setData } from '../../redux/actions/toolbar-action';
import { setView } from '../../redux/actions/view-action';
import { getCurrentView } from '../../redux/reducer/view-reducer';

const ModalCreator = (props) => {
  const { view, setView, setData } = props;

  const createModal = (view) => {
    switch (view) {
      case 'welcome-data': {
        return <WelcomeData setData={setData} setView={setView} />;
      }
    }
  };

  return <div className={`${styles.modal}`}>{createModal(view)}</div>;
};

const mapStateToProps = (state) => {
  view: getCurrentView(state.view);
};

const mapDispatchToProps = (dispatch) => {
  return {
    setView: (view) => dispatch(setView(view)),
    setData: (data) => dispatch(setData(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreator);
