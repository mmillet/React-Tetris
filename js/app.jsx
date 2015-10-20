import Game from "game.jsx";

var App = React.createClass({
  getInitialState() {
    return {
    };
  },
  componentDidMount() {
  },
  render() {
    return <Game/>
  }
});

React.render(
  <App/>,
  document.getElementById("game")
)