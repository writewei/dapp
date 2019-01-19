import React from 'react';
import cidbadge from 'cidbadge';

export default class CIDBadgeContainer extends React.Component<{
  cid: string
}> {
  render() {
    return <span dangerouslySetInnerHTML={{ __html: cidbadge(this.props.cid)}} />
  }
}
