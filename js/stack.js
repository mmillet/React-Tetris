import {
  STACK_WIDTH, STACK_HEIGHT,
  INIT_LEVEL, INIT_SPEED, INIT_STACK_LINE,
  SPEED_ACC, SCORE, SCORE_BONUS,
  LS_HIGHEST_SCORE
} from "const";

var undef = undefined;

export default class Stack {
  constructor() {
    this.status = false;
    this.best = this.getBest();
    this.refresh();
  }

  refresh() {
    this.stack = this._createStack();
    this.lineCnt = 0;
    this.score = 0;
    this.speed = INIT_SPEED;
    this.level = INIT_LEVEL;
    return this;
  }

  getBest() {
    var defaultBest = {
      score: 0,
      apm: 0
    }
    return localStorage ? (JSON.parse(localStorage.getItem(LS_HIGHEST_SCORE)) || defaultBest) : defaultBest;
  }

  setBest(best) {
    this.best = best;
    localStorage && localStorage.setItem(LS_HIGHEST_SCORE, JSON.stringify(best));
  }

  start() {
    this.status = true;
    this.fireChange();
    return this;
  }

  _createStack() {
    let i = 0;
    let arr = [];
    while(i++ < STACK_HEIGHT) {
      arr.push([...INIT_STACK_LINE]);
    }
    return arr;
  }

  onChange(callback) {
    this.callbacks = this.callbacks || [];
    this.callbacks.push(callback);
  }
  fireChange(data) {
    this.callbacks && this.callbacks.map((fn) => fn.apply(this, data));
  }

  getCurrent() {
    return this.stack;
  }

  update(cube, apm) {
    if(this.status === false) {
      return;
    }
    var x1 = cube.point[0];
    var y1 = cube.point[1];
    var y2 = y1 + cube.shape.length;

    //die check
    cube.shape.map((lines, offsetY) =>
      lines.map((v, offsetX) => {
        if(!this.stack[y1 + offsetY]) {
          this.status = false;
        } else {
          var oldValue = this.stack[y1 + offsetY][x1 + offsetX];
          if(oldValue && v) {
            this.status = false;
          } else {
            this.stack[y1 + offsetY] && (this.stack[y1 + offsetY][x1 + offsetX] = oldValue + v);
          }
        }
      })
    );

    //destroy line
    var lineCnt = 0;
    var i = 0;
    while(y1 + i < y2) {
      if(this.stack[y1 + i] && this.stack[y1 + i].some(v => !v) === false) {
        this.stack.splice(y1 + i, 1);
        this.stack.unshift([...INIT_STACK_LINE]);
        lineCnt ++;
      }
      i ++ ;
    }
    //score & level
    this.lineCnt += lineCnt;
    this.score += Math.ceil(SCORE[lineCnt] * Math.pow(SCORE_BONUS, this.level - 1));
    if(this.lineCnt >= this.level * 10) {
      this.level ++;
      this.speed *= SPEED_ACC;
    }
    if(this.score > this.best.score) {
      this.setBest({score: this.score, apm: apm});
    }

    this.fireChange();
  }

  getInfo() {
    return {
      score: this.score,
      best: this.best,
      level: this.level,
      lineCnt: this.lineCnt,
      status: this.status
    }
  }

  hasCollision(cube) {
    if(this.status === false) {
      return true;
    }
    var x1 = cube.point[0];
    var x2 = x1 + cube.shape[0].length;
    var y1 = cube.point[1];
    var y2 = y1 + cube.shape.length;
    if(x1 < 0 || x2 > STACK_WIDTH || y2 > STACK_HEIGHT) {
      return true;
    } else {
      return cube.shape.some((lines, offsetY) =>
        lines.some((v, offsetX) => {
          var y = y1 + offsetY;
          if(y < 0) {
            return false;
          } else {
            return v && this.stack[y][x1 + offsetX]
          }
        })
      );
    }
  }

  getBottomOffsetY(cube) {
    if(this.status === false) {
      return 0;
    }
    var x1 = cube.point[0];
    var x2 = x1 + cube.shape[0].length;
    var y1 = cube.point[1];
    var y2 = y1 + cube.shape.length;
    var _y1 = y1;
    while(y2 <= STACK_HEIGHT) {
      var hasCollision = false;
      var j = 0;
      while(y1 + j < y2) {
        var i = 0;
        while(x1 + i < x2) {
          if(this.stack[y1 + j] && this.stack[y1 + j][x1 + i] && cube.shape[j] && cube.shape[j][i]) {
            hasCollision = true;
            break;
          }
          i ++;
        }
        if(hasCollision) {
          break;
        }
        j ++;
      }
      if(hasCollision) {
        break;
      }
      y1 ++;
      y2 ++;
    }
    var offsetY =  y1 - _y1 - 1;
    return offsetY > 0 ? offsetY : 0;
  }
}