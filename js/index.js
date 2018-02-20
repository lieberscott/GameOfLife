var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// React & Redux libraries setup
var _React = React,
    Component = _React.Component;
var _Redux = Redux,
    createStore = _Redux.createStore;
var _ReactRedux = ReactRedux,
    Provider = _ReactRedux.Provider;
var _ReactRedux2 = ReactRedux,
    connect = _ReactRedux2.connect;
var _Redux2 = Redux,
    combineReducers = _Redux2.combineReducers;


var width = 100;
var height = 80;

/*
*
***************
*
* SETUP
*
***************
*
*/

var newGrid = function newGrid() {
  // called when page first loads (and if user clicks for a new Array)
  var grid = [];
  for (var i = 0; i < height; i++) {
    grid.push([]);
    for (var j = 0; j < width; j++) {
      var alive = Math.random() > 0.85;
      var newborn = void 0;
      if (alive) {
        newborn = true;
      } else {
        newborn = false;
      }
      grid[i][j] = {
        alive: alive,
        newborn: newborn // for refresh, ensure first gen is light blue
      };
    }
  }
  return grid;
};

var initBoardState = function initBoardState() {
  // made this into a function
  return {
    arr: newGrid(),
    generation: 1
  };
};

var boardReducer = function boardReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initBoardState();
  var action = arguments[1];

  var newState = void 0;
  switch (action.type) {
    case "NEW_ARR":
      newState = {
        arr: action.arr,
        generation: state.generation + 1
      };
      return newState;
      break;

    case "TOG_ALIVE":
      var tempArr = action.arr;
      tempArr[action.i][action.j] = {
        alive: !tempArr[action.i][action.j].alive,
        newborn: true
      };
      newState = _extends({}, state, {
        arr: tempArr
      });
      return newState;
      break;

    case "CLEAR_ARR":
      newState = _extends({}, state, {
        arr: action.arr
      });
      return newState;
      break;

    case "REFRESH":
      newState = {
        arr: action.arr,
        generation: 1
      };
      return newState;
      break;

    default:
      return state;
      break;
  }
};

var store = createStore(boardReducer);

/*
*
***************
*
* FUNCTIONS CALLED PRIOR TO DISPATCHED ACTIONS
*
***************
*
*/

var newBoard = function newBoard(arr) {
  // called as the game is being played
  var newArr = [];
  for (var i = 0; i < height; i++) {
    newArr.push([]);
    for (var j = 0; j < width; j++) {
      var score = checkNeighbors(arr, i, j); // checkNeighbors to see if cell lives or dies
      if (arr[i][j].alive == false && score == 3) {
        newArr[i].push({ alive: true, newborn: true });
      } else if (arr[i][j].alive == true && (score > 3 || score < 2)) {
        newArr[i].push({ alive: false, newborn: false });
      } else {
        newArr[i].push({ alive: arr[i][j].alive, newborn: false });
      }
    }
  }
  return newArr;
};

var checkNeighbors = function checkNeighbors(array, x, y) {
  // only called within the newBoard function
  var score = 0;
  for (var i = -1; i <= 1; i++) {
    var h = (i + x + height) % height;
    for (var j = -1; j <= 1; j++) {
      var w = (j + y + width) % width;
      score += array[h][w].alive;
    }
  }
  score -= array[x][y].alive;
  return score;
};

var clearArr = function clearArr(array) {
  // called when user clicks trash button
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      array[i][j] = {
        alive: false,
        newborn: false
      };
    }
  }
  return array;
};

/*
*
***************
*
* COMPONENTS: CELL, TOP, APP
*
***************
*
*/

var Cell = function Cell(props) {
  return React.createElement("td", { className: props.cell.alive ? props.cell.newborn ? "newborn" : "alive" : "", onClick: props.toggleAlive });
};

var Top = function Top(props) {
  return React.createElement(
    "div",
    { className: "top" },
    React.createElement(
      "span",
      { className: "gen-title" },
      "Generation: ",
      React.createElement(
        "span",
        { className: "number" },
        props.generation
      )
    ),
    React.createElement(
      "span",
      { className: "title" },
      React.createElement(
        "a",
        { href: "https://www.youtube.com/watch?v=E8kUJL04ELA", target: "_blank" },
        "Conway's Game of Life in React.js"
      )
    ),
    React.createElement(
      "span",
      { className: "controls", onClick: props.play },
      React.createElement("i", { className: "fas fa-play" })
    ),
    React.createElement(
      "span",
      { className: "controls", onClick: props.step },
      React.createElement("i", { className: "fas fa-step-forward" })
    ),
    React.createElement(
      "span",
      { className: "controls", onClick: props.pause },
      React.createElement("i", { className: "fas fa-pause" })
    ),
    React.createElement(
      "span",
      { className: "controls", onClick: props.refresh },
      React.createElement("i", { className: "fas fa-random" })
    ),
    React.createElement(
      "span",
      { className: "controls", onClick: props.clearArray },
      React.createElement("i", { className: "fas fa-trash" })
    )
  );
};

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      running: true, // to ensure setInterval() isn't called more than once
      toggle: null // variable to be set to setInterval() so that when user clicks pause, clearInterval() can be called
    };
    _this.play = _this.play.bind(_this);
    _this.pause = _this.pause.bind(_this);
    _this.step = _this.step.bind(_this);
    _this.clearArray = _this.clearArray.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var toggle = setInterval(function () {
        return _this2.props.newGeneration(_this2.props.data.arr);
      }, 80);
      this.setState({ // sets toggle: toggle
        toggle: toggle
      });
    }
  }, {
    key: "play",
    value: function play() {
      var _this3 = this;

      if (!this.state.running) {
        var toggle = setInterval(function () {
          return _this3.props.newGeneration(_this3.props.data.arr);
        }, 80);
        this.setState({
          running: true,
          toggle: toggle
        });
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.state.running) {
        clearInterval(this.state.toggle);
        this.setState({
          running: false
        });
      }
    }
  }, {
    key: "step",
    value: function step() {
      var _this4 = this;

      if (!this.state.running) {
        setTimeout(function () {
          return _this4.props.newGeneration(_this4.props.data.arr);
        }, 80);
      }
    }
  }, {
    key: "clearArray",
    value: function clearArray() {
      clearInterval(this.state.toggle);
      this.setState({
        running: false
      });
      this.props.clear(this.props.data.arr);
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "wrapper" },
          React.createElement(Top, { generation: this.props.data.generation, play: this.play, pause: this.pause, step: this.step, clearArray: this.clearArray, refresh: function refresh() {
              return _this5.props.refresh();
            } }),
          React.createElement(
            "table",
            null,
            React.createElement(
              "tbody",
              null,
              this.props.data.arr.map(function (row, i) {
                return React.createElement(
                  "tr",
                  { key: i },
                  " ",
                  row.map(function (cell, j) {
                    return React.createElement(Cell, { key: j, cell: cell, toggleAlive: function toggleAlive() {
                        return _this5.props.toggleAlive(_this5.props.data.arr, i, j);
                      } });
                  })
                );
              })
            )
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

var mapStateToProps = function mapStateToProps(state) {
  return {
    data: state
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    newGeneration: function newGeneration(array) {
      // when play or step forward is pressed
      var arr1 = array.slice(0);
      var newArr = newBoard(arr1);
      dispatch(_newGeneration(newArr));
    },
    toggleAlive: function toggleAlive(array, i, j) {
      // when a cell is clicked
      dispatch(_toggleAlive(array, i, j));
    },
    clear: function clear(array) {
      // when trash icon is clicked
      var clearedArr = clearArr(array);
      dispatch(_clear(clearedArr));
    },
    refresh: function refresh() {
      // when the randomize button is pressed
      var refreshedArr = newGrid();
      dispatch(_refresh(refreshedArr));
    }
  };
};

function _newGeneration(arr) {
  return {
    type: "NEW_ARR",
    arr: arr
  };
}

function _toggleAlive(arr, i, j) {
  return {
    type: "TOG_ALIVE",
    arr: arr,
    i: i,
    j: j
  };
}

function _clear(clearedArr) {
  return {
    type: "CLEAR_ARR",
    arr: clearedArr
  };
}

function _refresh(arr) {
  return {
    type: "REFRESH",
    arr: arr
  };
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

var main = window.document.getElementById("main");

// Provider wraps our app
ReactDOM.render(React.createElement(
  Provider,
  { store: store },
  React.createElement(App, null)
), main);