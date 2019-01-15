import React from 'react';
import MDContainer from './MDContainer';

export default class Home extends React.Component {
  render() {
    return (
      <>
        <MDContainer content={`
# test

they're great!`} />
      </>
    );
  }
}
