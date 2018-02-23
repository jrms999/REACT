var Trans = React.addons.CSSTransitionGroup;

//TILL NEXT TUTORIALLLLL!!!!!!
/********* LOGIC OF THE CALENDER ****
1.Create Display / Look
2. CREATE A MONTH OBJECT AT EACH DISPLAY
*******/
var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var MonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var abbrev = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function Month(month, year, dates) {
  //Create a contructor to create month objects 
  this.date = new Date(year, month, 0);
  this.numberofdays = this.date.getDate();
  this.nameofmonth = MonthNames[this.date.getMonth()];
  this.firstday = 1;
  this.year = this.date.getFullYear();
  this.calender = generateCalender(this.numberofdays, month - 1, this.firstday, year, dates);
}

function Date2Day(year, month, day) {
  //this is to determne the week day based on the date 
  return new Date(year, month, day).getDay();
}
function generateCalender(numberofdays, month, day, year, dates) {
  //this generates an array of week dey objects which have array of days ( in number)
  var WEEKDAY = daysOfWeek[Date2Day(year, month, day)];
  if (WEEKDAY in dates) {
    dates[WEEKDAY].push(day);
  } else {
    dates[WEEKDAY] = [day];
  }
  day++;
  return day > numberofdays ? dates : generateCalender(numberofdays, month, day, year, dates);
}

var Calender = React.createClass({
  displayName: 'Calender',

  getInitialState: function getInitialState() {
    return this.generateCalender();
  },
  generateCalender: function generateCalender() {
    var today = new Date();
    var month = {};
    month = new Month(today.getMonth() + 1, today.getFullYear(), month);
    console.log(today.getDate());
    return { dates: month, today: today, taskadd: false, taskday: "", tasklist: [], activeList: [] };
  },
  addTask: function addTask(day) {
    day = day + " " + this.state.dates.nameofmonth + " " + this.state.dates.year;

    this.search();

    return this.setState({ taskadd: true, taskday: day });
  },
  enterTask: function enterTask() {
    var new_task = {};
    if ($("#task").val() && $("#task").val().length > 0) {
      //console.log(this.state.taskday)
      //create a task object and use the selected date as the key and the task as the propertiy
      new_task[this.state.taskday] = [$("#task").val()];
      //update the tasklist by checking if the tasklist has the date already store or not 
      //I'll use my logic -- if there is one. ... hmm
      var positionInList;
      this.state.tasklist.forEach(function (taskObj, i) {
        if (this.state.taskday in taskObj && positionInList === undefined) {
          positionInList = i;
        }
      }.bind(this));
      var list = this.state.tasklist;
      if (positionInList != undefined) {

        list[positionInList][this.state.taskday].push($("#task").val());
      } else {
        list.push(new_task);
      }
      //YEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!!!!
      //TILL NEXT TIME 
      this.search();
      return this.setState({ tasklist: list });
    } else {
      console.log("Done nothing");
    }
  },
  search: function search() {
    ///SEARCH FOR DAY
    var result = $.grep(this.state.tasklist, function (taskObj) {
      return this.state.taskday in taskObj;
    }.bind(this));

    if (result && result.length > 0) {
      this.setState({ activeList: result[0][this.state.taskday] });
    }
  },
  updateTask: function updateTask(i, id, e) {
    //update the active List and use the active List to update the tasklist based the taskday


    this.state.activeList[i] = $("#" + id).val();
    return this.updateTaskList(this.state.activeList);
  },
  updateTaskList: function updateTaskList(list) {
    var tasklist = this.state.tasklist;
    tasklist[this.state.taskday] = list;
    return this.setState({ tasklist: tasklist, activeList: list });
  },
  deleteTask: function deleteTask(i) {
    var list = this.state.activeList;
    list.splice(i, 1);
    return this.setState({ activeList: list });
  },
  render: function render() {
    //console.log(this.state.dates)
    var calender = [];
    for (var property in this.state.dates.calender) {
      calender.push(this.state.dates.calender[property]);
    }
    //console.log(calender)
    return React.createElement(
      'div',
      { id: 'calender' },
      React.createElement(
        'div',
        { id: 'header' },
        React.createElement('i', { className: 'fa fa-bars', 'aria-hidden': 'true' }),
        React.createElement(
          'p',
          { className: 'nopaddingnomargin' },
          this.state.dates.nameofmonth,
          ' ',
          this.state.dates.year,
          ' '
        ),
        React.createElement('i', { className: 'fa fa-calendar-check-o', 'aria-hidden': 'true' }),
        React.createElement('i', { className: 'fa fa-search', 'aria-hidden': 'true' })
      ),
      React.createElement(
        'div',
        { id: 'dates' },
        Object.keys(this.state.dates.calender).map(function (weekday, i) {

          var list = this.state.dates.calender[weekday].map(function (day, i) {

            return React.createElement(
              'li',
              { className: day == this.state.today.getDate() ? "today" : null, onClick: this.addTask.bind(null, day) },
              day
            );
          }.bind(this));
          return React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'weekname' },
              weekday.substring(0, 3)
            ),
            React.createElement(
              'ul',
              { className: 'nopaddingnomargin' },
              list
            )
          );
        }.bind(this))
      ),
      this.state.taskadd ? React.createElement(
        'div',
        { id: 'taskList' },
        React.createElement(
          'div',
          { id: 'taskheader' },
          React.createElement(
            'p',
            null,
            'Entry Date: ',
            this.state.taskday
          ),
          React.createElement('input', { type: 'text', id: 'task' }),
          React.createElement(
            'button',
            { onClick: this.enterTask },
            'Add'
          )
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            Trans,
            { transitionName: 'slideoff', transitionEnterTimeout: 500, transitionLeaveTimeout: 2000 },
            this.state.activeList.map(function (task, i) {
              return React.createElement(
                'li',
                { key: task + i },
                React.createElement(
                  'p',
                  null,
                  task
                ),
                React.createElement(
                  'span',
                  { className: 'delete', onClick: this.deleteTask.bind(null, i) },
                  'delete'
                ),
                React.createElement(
                  'span',
                  { className: 'update' },
                  'update'
                ),
                React.createElement(
                  'div',
                  { id: 'updateRoom' },
                  React.createElement('input', { type: 'text', id: task + i }),
                  React.createElement(
                    'button',
                    { onClick: this.updateTask.bind(null, i, task + i) },
                    'Update'
                  )
                )
              );
            }.bind(this))
          )
        )
      ) : null
    );
  }
});

ReactDOM.render(React.createElement(Calender, null), document.getElementById("space"));