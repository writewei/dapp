import React from 'react';
import Remarkable from 'remarkable';

export default class MDContainer extends React.Component<{
  content: any
}> {

  md: Remarkable;

  constructor(props: any) {
    super(props);
    this.md = new Remarkable({
      html: true,
      xhtmlOut: true,
      breaks: true,
      linkify: true
    });
  }

  render() {
    const __html = this.md.render(this.props.content);
    return <div dangerouslySetInnerHTML={{ __html }} />;
  }
}
