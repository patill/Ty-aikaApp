
let AppController = (function() {
  let date = new Date();
  let data = {
    out: [],
    in: [],
    logs: [{
        in: [],
        out: [],
        date: new Date(date.getFullYear, date.getMonth, date.getDate),
        saldo: 0
      }],//array with objects with properties day (yyyy/dd/mm), out and in arrays + dailySaldo saved
    mostRecent: {
      type: '',
      time: 0
    },
    workingTime: 26460000,
    saldo: 0,
    dailySaldo: [] //array of objects with date and saldo pairs
  };





  let calcDayString = function(now) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };
  //Überflüssig?
  let filterDay = function (date) {//filters an array
    return date.getDate() === presentDay && date.getMonth() === presentMonth;
  };

  return {
  // Setting data into local storage
     storeData: function () {
       localStorage.setItem("data", JSON.stringify(data));
     },

     // Getting data from local storage
     getStoredData: function () {
       var localData = JSON.parse(localStorage.getItem('data'));
       //make backup
       localStorage.setItem('backup', JSON.stringify(localData));
       return localData;
     },
     //update Data to work with
     updateData: function (storedData) {
       let outArray = storedData.out.map(function(cur) {return new Date(cur)});
       let inArray = storedData.in.map(cur => new Date(cur));
       data.out = outArray;
       data.in = inArray;
       data.saldo = storedData.saldo;
       data.workingTime = storedData.workingTime;
       data.mostRecent = storedData.mostRecent;
       data.mostRecent.time = new Date(data.mostRecent.time);
       data.dailySaldo = storedData.dailySaldo;
       //new data structure:
       if (   storedData.logs.length > 0) {
       data.logs = storedData.logs;
       for (var i = 0; i < data.logs.length; i++) {
         data.logs[i].date = new Date(data.logs[i].date);
         for (var e = 0; e < data.logs[i].out.length; e++) {
            data.logs[i].out[e] = new Date(data.logs[i].out[e]);
         }
         for (var u = 0; u < data.logs[i].in.length; u++) {
           data.logs[i].in[u] = new Date(data.logs[i].in[u]);
         }
       }
      }
     },
     getTime: function() {
       //adds zeros to the output, if needed
       function checkTime(i) {
         return (i < 10) ? "0" + i : i;
       }
       let now, hour, minutes;
       now = new  Date();
       hour = now.getHours();
       minutes = now.getMinutes();
       return hour + ':' + minutes;
     },
     addLogging: function(type) {
       let now, dayString, item;
       now = new Date();
       //new Data structure
       //get today-string
       dayString = calcDayString(now);
         // if day is not there  create it
         if (!data.logs.some(el => el.date.getTime() === dayString.getTime())) {
          let dayObject = {};
          dayObject.date = dayString;
          dayObject.in = [];
          dayObject.out = [];
          dayObject.saldo = 0;
          data.logs.push(dayObject)
       }
       item = data.logs[data.logs.findIndex(el => el.date.getTime() === dayString.getTime())];
       if (type === 'SISÄÄN' && data.mostRecent.type !== 'SISÄÄN') {
         item.in.push(now);
         data.mostRecent.type = type;
         data.mostRecent.time = now;
         console.log('New SISÄÄN registered.');
       } else if (type === 'ULOS' && data.mostRecent.type !== 'ULOS') {
         item.out.push(now);
         data.mostRecent.type = type;
         data.mostRecent.time = now;
         console.log('New ULOS registered.');
       }


     },
     mostRecentLogging: function() {
       return data.mostRecent;
     },
     mostRecentDay: function(index) {
       let sorted = data.logs.sort((a,b) => b.date - a.date);
       return sorted[index];

     },
     mostRecentOut: function() {
       //check first with mostRecentDay, in which object you have to start calculating
       let obj = this.mostRecentDay(0);
       let mostRecentOut;//Saves date in MS
       for (let i = 0; i < obj.out.length; i++ )
       {  (mostRecentOut > obj.out[i]) ? mostRecentOut : mostRecentOut = obj.out[i] }
       return mostRecentOut;
     },
     calcSaldo: function() {
       let obj = this.mostRecentDay(0);
       if (obj.in.length > 0 ) {
       //get most recent logout.
       let mostRecentOut = this.mostRecentOut();

       // look for first log in at the same day
       //let presentDay = mostRecentOut.getDate();
       //let presentMonth = mostRecentOut.getMonth();

       //let todayArray = data.in.filter(filterDay);
       //console.log(todayArray);
       //calculate smallest amount, i.e. the first event in that array
       let firstLoginToday  = obj.in.sort(function(a,b){return a - b})[0];

       // calculate difference
       let workingDay = mostRecentOut - firstLoginToday;
       console.log(this.toHours(workingDay));
       //ToDO: take into account also login and logouts in between and their reasons

       //compare to workingTime
       let saldoToday = workingDay - data.workingTime;
       //write saldoToday into memory

       data.logs[data.logs.findIndex(el => el.date.getTime() === obj.date.getTime())].saldo = saldoToday;
       //take old saldo and add/remove new saldo
       let totalSaldo;
       //get second last day:
       if (data.logs.length > 1) {
       let yesterday = this.mostRecentDay(1)
       totalSaldo = saldoToday + yesterday.saldo;
     } else {totalSaldo = saldoToday;}
       data.saldo = totalSaldo;

      }
     },
     getSaldo: function() {
       //let obj = this.mostRecentDay(0);
       //return this.toHours(obj.saldo);
       return this.toHours(data.saldo);
     },
     setWorkingTime: function(time) {
       data.workingTime = time;
     },
     getWorkingTime: function() {
       return data.workingTime;
     },
     toMS: function(time) {
       let timeArray = time.split(':');
       let hours = timeArray[0];
       let minutes = timeArray[1];
       return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
     },
     toHours: function(time) {
       let hours = parseInt(time / 1000 / 60 / 60);
       let minutes = Math.abs(Math.round(time / 1000 / 60 % 60));
       return hours.toString() + ':' + minutes;
     },
     testing: function() {
       console.log(data);
     }
  }
})();




let UIController = (function() {

   let nodelistForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  let DOMStrings = {
    inputField: '.tyoaika',
    buttonIn: '#sis',
    buttonOut: '#ulos',
    buttonSubmit: '#settings-submit',
    modal: '#modal-settings',
    modalButton: '#open-settings',
    modalClose: 'close',
    workingTimeString: '#working-time-input',
    workingPercentString: '#working-time-percent'
  };
  let saveSettings = function() {
    //save changes to working time and percents

  };


return {
  getInput: function () {
      return {
        //this can be used to add other types of loggings at a later time
        //type: document.querySelector(DOMStrings.inputType).value, // Will be either SISÄÄN or ULOS
        //description: document.querySelector(DOMStrings.inputDescription).value,
        //value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    },
    regLogging: function(type) {
      AppController.addLogging(type);
      //here we can calculate saldo and show the logging to the user
       AppController.storeData();
       if (type === 'ULOS') {
       AppController.calcSaldo();
     }
    },
    //Shows if the user is IN or OUT
    status: function() {
      el = document.getElementById('status');
      if (AppController.mostRecentLogging().type === 'SISÄÄN') {
        text = 'Olet kirjautunut sisään.';
      } else if (AppController.mostRecentLogging().type === 'ULOS') {
        text = 'Olet kirjautunut ulos.';
      }

      el.innerText = text + '\nSaldosi on ' + AppController.getSaldo();
      //console.log('Status is ' + )
    },
    updateWorkingTime: function() {
      //get time from DOM

      //Update time to Data
      saveSettings();
    },
    setModal: function() {
      // Get the modal
      let modal = document.querySelector(DOMStrings.modal);

      // Get the button that opens the modal
      let btn = document.querySelector(DOMStrings.modalButton);

      // Get the <span> element that closes the modal
      let span = document.getElementsByClassName(DOMStrings.modalClose)[0];

      // Get Tallenna button
      let close = document.querySelector(DOMStrings.buttonSubmit);

      // When the user clicks on the button, open the modal
      btn.onclick = function() {
        modal.style.display = "block";
      }

      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
        modal.style.display = "none";
        saveSettings();
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
      //Close modal also with the Tallenna button
      close.onclick = function() {
        modal.style.display = 'none';
        saveSettings();
      }
    }
  }

})();


//Main app
let Controller = (function(AppController, UIController) {

  let setupEventListeners = function () {
    //call the function from UIController
    var DOM = UIController.getDOMStrings();

    //Click for adding an item
    document.querySelector(DOM.buttonIn).addEventListener('click',  ctrAddIn); //callback function, does not have to be called here directly

    document.querySelector(DOM.buttonOut).addEventListener('click', ctrAddOut);

    /*
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {//for older browsers the second version
        ctrlAddItem();
      };
      */

    };

    let ctrAddIn = function() {
      //call function from UIController
      UIController.regLogging('SISÄÄN');
      UIController.status();
    };

    let ctrAddOut = function() {
      //call function from UIController
      UIController.regLogging('ULOS');
      UIController.status();
    };
  let setNow = function () {
    AppController.setTime();
  };

  var loadData = function () {
    // 1. Loca data from local storage
    var storedData = AppController.getStoredData();

    if (storedData) {
      // 2. insert the saved data into local storage
      AppController.updateData(storedData);

      // 3. create log ins
      //storedData.in.forEach(function (cur) {
        //var newIncItem = budgetCtrl.addItem("inc", cur.description, cur.value);
        //UIController.addListItem(newIncItem, "inc");
      //});

      // 4. Creating  log outs
      //storedData.out.forEach(function (cur) {
        //var newExpItem = budgetCtrl.addItem("exp", cur.description, cur.value);
        //UIController.addListItem(newExpItem, "exp");
      //});


      // 5. Display the status
      //budget = budgetCtrl.getBudget();
      UIController.status();


    }
  };

  let autoLogOut = function() {
    //log out after 21:00

  }

  return {
    init: function() {
      console.log('Application has started.')
      UIController.setModal();
      //setInterval(setNow(), 1000);
      //Show the time
      setInterval(function() {

        document.getElementById('tyoaika').innerText = new Date().toLocaleTimeString().slice(0,5);
      }, 1000);

      loadData();
      setupEventListeners();
    }
  }

})(AppController, UIController);

Controller.init();
