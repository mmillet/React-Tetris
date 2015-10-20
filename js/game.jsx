import {KEY, CUBE_W, CUBE_H} from "const";
import Audio from "audio";
import Stack from "stack";
import Cube from "cube";

var doc = document;

var Game = React.createClass({
  getInitialState() {
    this.stack = new Stack();
    this.cube = new Cube(this.stack);
    return {
      die: true,
      audio: true,
      isMobile: false
    };
  },
  updateCube() {
    this.setState({
      cube: this.cube.getCurrent(),
      nextCube: this.cube.getNext()
    });
  },
  updateStack() {
    var info = this.stack.getInfo();
    if(!this.state.die && !info.status) {
      this.audio.stopBgm();
      this.audio.playDie();
    }
    if(this.state.info && this.state.info.lineCnt < info.lineCnt) {
      this.audio.playDestroy();
    }
    this.setState({
      stack: this.stack.getCurrent(),
      info: info,
      die: !info.status,
      apm: this.cube.getApm()
    });
  },
  handleAction(action) {
    switch(action) {
      case KEY.LEFT:
        this.cube.left();
        this.audio.playBtn();
        break;
      case KEY.RIGHT:
        this.cube.right();
        this.audio.playBtn();
        break;
      case KEY.UP:
        this.cube.spin();
        this.audio.playSpin();
        break;
      case KEY.DOWN:
        this.cube.fall();
        break;
      case KEY.SPACE:
        if(this.state.die) {
          this.start();
        } else {
          this.cube.bottom();
          this.audio.playBottom();
        }
        break;
    }
  },
  bindEvent() {
    if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      this.setState({isMobile: true});
      var shadow = ele => {
        ele.classList.add("active");
        setTimeout(() => ele.classList.remove("active"), 100);
      }
      setTimeout(() => {
        FastClick.attach(this.refs.cubeControl);
        this.refs.space.addEventListener("touchend", e => {
          shadow(this.refs.space);
          this.handleAction(KEY.SPACE);
        });
        this.refs.up.addEventListener("touchend", e => {
          shadow(this.refs.up);
          this.handleAction(KEY.UP);
        });
        this.refs.down.addEventListener("touchend", e => {
          shadow(this.refs.down);
          this.handleAction(KEY.DOWN);
        });
        this.refs.left.addEventListener("touchend", e => {
          shadow(this.refs.left);
          this.handleAction(KEY.LEFT);
        });
        this.refs.right.addEventListener("touchend", e => {
          shadow(this.refs.right);
          this.handleAction(KEY.RIGHT);
        });
      }, 500);
    }

    doc.addEventListener("keydown", (e) => {
      this.handleAction(e.keyCode);
    });
  },
  componentDidMount() {
    this.bindEvent();
    this.stack.onChange(this.updateStack);
    this.cube.onChange(this.updateCube);
    this.audio = new Audio();

    this.updateStack();

  },
  start() {
    this.cube.clearApmRecord();
    this.audio.playReadyGo();
    this.audio.playBgm();
    this.stack.refresh().start();
    this.cube.create().start();
  },
  toggleAudio() {
    var isMute = this.state.audio;
    isMute ? this.audio.mute() : this.audio.unmute();
    !this.state.die && this.audio.playBgm();
    this.setState({audio: !isMute});
  },
  togglePause() {
    this.cube.toggleStatus();
    this.setState({pause: !this.cube.status});
  },
  render() {
    var offsetX = 0,
        offsetY = 0,
        transform = "";
    if(this.state.cube) {
      offsetX = this.state.cube.point[0] * CUBE_W;
      offsetY = this.state.cube.point[1] * CUBE_H;
      var translate = "translate3d(" +offsetX + "px, " + offsetY + "px, 0)";
      transform = {
        "transform": translate,
        "-webkit-transform": translate
      };
    }
    console.log(this.state.info && this.state.info.best);
    return (
      <div className={"tetris" + (this.state.die ? " die" : "")}>
        <div className="t-stack-wrapper">
          <div className="t-stack">
            {
              this.state.cube &&
              <ins className="t-cube"
                 style={transform}>
                {
                  this.state.cube.shape.map(line =>
                    <i className="t-cube-line">
                      {
                        line.map(c => <i className={"t-cube-c c" + c}></i>)
                      }
                    </i>
                  )
                }
              </ins>
            }
            {
              this.state.stack &&
              this.state.stack.map(line =>
                <i className="t-stack-line">
                  {
                    line.map(c => <i className={"t-stack-c c" + c}></i>)
                  }
                </i>
              )
            }
          </div>
        </div>
        <div className="t-info-wrapper">
          <div className="t-info">
            <h3>NEXT</h3>
            <div className="t-info-box">
              <ins className="t-cube">
                {
                  this.state.nextCube &&
                  this.state.nextCube.shape.map(line =>
                    <i className="t-cube-line">
                      {
                        line.map(c => <i className={"t-cube-c c" + c}></i>)
                      }
                    </i>
                  )
                }
              </ins>
            </div>
            <h3>SCORE</h3>
            <div className="t-info-box">
            {
              this.state.info &&
              <ul className="t-info-score">
                <li>
                  Lv{this.state.info.level}
                 </li>
                <li>
                  <span className="v">{this.state.info.score}</span>
                  <br/>APM: {this.state.apm || 0}
                </li>
                <li><br/>Best</li>
                <li>
                  <span className="v">{this.state.info.best.score || 0}</span>
                  <br/>APM: {this.state.info.best.apm || 0}
                </li>
              </ul>
            }
            </div>
          </div>
        </div>

        <div className="t-game-control">
          <a href="javascript:;"
             className="t-start"
             style={{display: this.state.die ? "block" : "none"}}
             onClick={this.start}>
            START
          </a>
          {
            !this.state.die &&
            <a href="javascript:;"
               className="t-pause"
               onClick={this.togglePause}>
              {this.state.pause ? ">" : "||"}
            </a>
          }
          <a href="javascript:;"
             className={"t-audio" + (this.state.audio ? "" : " disabled")}
             onClick={this.toggleAudio}>
            ♪
          </a>
        </div>

        {
          this.state.isMobile &&
          <div className="t-cube-control" ref="cubeControl">
            <a href="javascript:;" className="t-space" ref="space"></a>
            <a href="javascript:;" className="t-up" ref="up"></a>
            <a href="javascript:;" className="t-right" ref="right"></a>
            <a href="javascript:;" className="t-down" ref="down"></a>
            <a href="javascript:;" className="t-left" ref="left"></a>
          </div>
        }
      </div>
    );
  }
});

export default Game;