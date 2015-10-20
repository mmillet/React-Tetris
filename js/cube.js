import {CUBES, CUBES_LENGTH, STACK_WIDTH, STACK_HEIGHT} from "const";

var random = max => Math.floor(Math.random() * max);
var getAllShape = type => CUBES[type];
var getShape = (type, state) => getAllShape(type)[state];
var getCenter = cubeWidth => Math.floor((STACK_WIDTH - cubeWidth) / 2);
var getInitPoint = (type, state) => [getCenter(getShape(type, state).shape[0].length), 0];

class Cube {
  constructor(stack) {
    this.stack = stack;
    this.cubeCnt = 0;
    this.playTime = 0;
  }
  getNewCube() {
    var type =  random(CUBES_LENGTH);
    return {
      type: type,
      state: random(CUBES[type].length)
    }
  }
  create() {
    var cube = this.nextCube || this.getNewCube();
    this.type = cube.type;
    this.state =cube.state;
    this.nextCube = this.getNewCube();
    this.point = getInitPoint(this.type, this.state);
    this.cubeCnt ++;
    this.fireChange();
    return this;
  }
  fall() {
    return this._setPoint(0, 1);
  }
  left() {
    return this._setPoint(-1, 0);
  }
  right() {
    return this._setPoint(1, 0);
  }
  bottom() {
    if(!this.status) {
      return this;
    } else {

    }
    var offSetY = this.stack.getBottomOffsetY(this.getCurrent());
    this._setPoint(0, offSetY).fall();
    return this;
  }
  spin() {
    var allShapes = getAllShape(this.type);
    var currentShape = allShapes[this.state];
    var nextState = (this.state + 1) % allShapes.length;
    return this._setPoint(currentShape.spin[0], currentShape.spin[1], getShape(this.type, nextState).shape, nextState);
  }
  start() {
    this.status = true;
    this.timer = setInterval(() => this.fall(), this.stack.speed);
    this.startApmRecord();
    return this;
  }
  stop() {
    this.status = false;
    this.timer && clearInterval(this.timer);
    this.pauseApmRecord();
    return this;
  }
  clearApmRecord() {
    this.startTime = Date.now();
    this.playTime = 0;
    this.cubeCnt = 0;
  }
  pauseApmRecord() {
    this.playTime += this.startTime ? (Date.now() - this.startTime) : 0;
    this.startTime = 0;
    return {
      playTime: this.playTime,
      cubeCnt: this.cubeCnt
    };
  }
  startApmRecord() {
    this.startTime = Date.now();
    return this.playTime;
  }
  getApm() {
    return this.playTime ? Math.round(this.cubeCnt / (this.playTime / 60 / 1000 )) : 0;
  }
  toggleStatus() {
    this.status ? this.stop() : this.start();
  }
  onChange(callback) {
    this.callbacks = this.callbacks || [];
    this.callbacks.push(callback);
    return this;
  }
  fireChange(data) {
    this.callbacks && this.callbacks.map((fn) => fn.apply(this, data));
    return this;
  }
  _setPoint(offSetX, offSetY, shape, state = this.state) {
    if(!this.status) {
      return this;
    }
    shape = shape || getShape(this.type, this.state).shape;
    var x = this.point[0] + offSetX;
    var y = this.point[1] + offSetY;
    var nextCube = {
      point: [x, y],
      shape: shape
    };

    //检查碰撞
    if(this.stack.hasCollision(nextCube)) {
      //如果是下落情况的碰撞，则修改状态
      if(offSetX === 0 && offSetY === 1) {
        this.status = false;
        this.stack.update(this.getCurrent(), this.getApm());
        if(this.stack.status === false) {
          this.stop();
        } else {
          this.stop().create().start();
        }
      }
    } else {
      this.point = nextCube.point;
      this.state = state;
      this.fireChange();
    }

    return this;
  }
  getCurrent() {
    return {
      point: this.point,
      shape: getShape(this.type, this.state).shape
    }
  }
  getNext() {
    return {
      shape: getShape(this.nextCube.type, this.nextCube.state).shape
    }
  }
}

export default Cube;