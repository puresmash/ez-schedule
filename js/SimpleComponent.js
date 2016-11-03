let React = require('react');

class SimpleComponent extends React.Component {
  constructor(){
    super();
  }
  render(){
    return (
      <div>This is my first component.</div>
    );
  }
}
module.exports = SimpleComponent;
