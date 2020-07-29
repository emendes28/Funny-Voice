import { h, Component } from 'preact';
import style from './style';

export default class List extends Component {
  state = {
    time: Date.now(),
    count: 10,
  };

  // update the current time
  updateTime = () => {
    this.setState({ time: Date.now() });
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  // gets called when this route is navigated to
  componentDidMount() {
    // start a timer for the clock:
    this.timer = setInterval(this.updateTime, 1000);
  }

  // gets called just before navigating away from the route
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  // Note: `user` comes from the URL, courtesy of our router
  render({ user }, { time, count }) {
    return (      
    <div>
      <video id="video" src="media/video.mp4" controls="true" crossorigin="anonymous"/>
      <canvas id="c1" width="160" height="96"></canvas>
      <canvas id="c2" class={style.c2} width="160" height="96"></canvas>
    </div>
    );
  }
}
