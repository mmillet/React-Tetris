//容器个数
export const STACK_WIDTH = 12;
export const STACK_HEIGHT = 21;
//方块宽高
export const CUBE_W = 16;
export const CUBE_H = 16;
//方块类型
export const CUBES = [
/**
 * +
 * +
 * ++
 */
  [
    {
      shape: [[1, 0], [1, 0], [1, 1]],
      spin:  [-1, 1]
    },
    {
      shape: [[1, 1, 1], [1, 0, 0]],
      spin:  [0, -1]
    },
    {
      shape: [[1, 1], [0, 1], [0, 1]],
      spin:  [0, 0]
    },
    {
      shape: [[0, 0, 1], [1, 1, 1]],
      spin:  [1, 0]
    }
  ],

/**
 *  +
 *  +
 * ++
 */
  [
    {
      shape: [[0, 2], [0, 2], [2, 2]],
      spin:  [0, 0]
    },
    {
      shape: [[2, 0, 0], [2, 2, 2]],
      spin:  [1, 0]
    },
    {
      shape: [[2, 2], [2, 0], [2, 0]],
      spin:  [-1, 1]
    },
    {
      shape: [[2, 2, 2], [0, 0, 2]],
      spin:  [0, -1]
    }
  ],

/**
 *  +
 * +++
 */
  [
    {
      shape: [[0, 3, 0], [3, 3, 3]],
      spin:  [1, 0]
    },
    {
      shape: [[3, 0], [3, 3], [3, 0]],
      spin:  [-1, 1]
    },
    {
      shape: [[3, 3, 3], [0, 3, 0]],
      spin:  [0, -1]
    },
    {
      shape: [[0, 3], [3, 3], [0, 3]],
      spin:  [0, 0]
    }
  ],

/**
 * ++
 *  ++
 */
  [
    {
      shape: [[4, 4, 0], [0, 4, 4]],
      spin:  [1, -1]
    },
    {
      shape: [[0, 4], [4, 4], [4, 0]],
      spin:  [-1, 1]
    }
  ],

/**
 *  ++
 * ++
 */
  [
    {
      shape: [[0, 5, 5], [5, 5, 0]],
      spin:  [1, -1]
    },
    {
      shape: [[5, 0], [5, 5], [0, 5]],
      spin:  [-1, 1]
    }
  ],

/**
 * ++++
 */
  [
    {
      shape: [[6, 6, 6, 6]],
      spin:  [2, -1]
    },
    {
      shape: [[6], [6], [6], [6]],
      spin:  [-2, 1]
    }
  ],

/**
 * ++
 * ++
 */
  [
    {
      shape: [[7, 7], [7, 7]],
      spin:  [0, 0]
    }
  ]
];
export const CUBES_LENGTH = CUBES.length;
//键盘
export const KEY = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32
};
//连消分数
export const SCORE = [0, 10, 30, 70, 100];
export const INIT_SPEED = 700;
export const INIT_LEVEL = 1;
export const SPEED_ACC = 0.8;
//分数加成
export const SCORE_BONUS = 1;

//初始空行
export const INIT_STACK_LINE = (() => {
  var arr = [];
  var i = 0;
  while (i++ < STACK_WIDTH){
    arr[i - 1] = 0;
  }
  return arr;
})();

//最高分LS字段
export const LS_HIGHEST_SCORE = "LS_HIGHEST_SCORE";

//预留关卡，每个关卡需要动态生成 todo
//export const LEVELS = []
