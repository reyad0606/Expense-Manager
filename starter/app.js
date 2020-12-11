class Model {
  constructor() {
    this.idCounter = 0;
    this.item = {
      itemList: {
        income: [],
        expenses: [],
      },
      total: {
        income: 0,
        expenses: 0,
      },
      budget: 0,
      percentage: 0,
    };
  }

  income(type, id, desc, value) {
    this.type = "inc";
    this.id = id;
    this.desc = desc;
    this.value = value;
    //this.percentage = (this.value / this.total.income) * 100;
  }

  expenses(type, id, desc, value) {
    this.type = "exp";
    this.id = id;
    this.desc = desc;
    this.value = value;
    // this.percentage = (this.value / this.total.income) * 100;
  }

  addItem(type, desc, value) {
    // let ID;
    // this.item.itemList.income.forEach((data, i) => {
    //   data.ID = i + 1;});

    let id = this.idCounter;

    if (type === "inc") {
      this.item.itemList.income.push({ id, desc, value });
    } 
    else if (type === "exp") {
      this.item.itemList.expenses.push({ id, desc, value });
    }
    this.idCounter += 1;
    return { id, type, desc, value };
  }

  deleteItem(type, id) {
    if (type === "inc") {
      let ids = this.item.itemList.income.map(function (e) {
        return e.id;
      });
      let index = ids.indexOf(id);
      if (index !== -1) {
        this.item.itemList.income.splice(index, 1);
      }
    } 
    else if (type === "exp") {
      let ids = this.item.itemList.expenses.map(function (el) {
        return el.id;
      });
      let index = ids.indexOf(id);
      if (index !== -1) {
        this.item.itemList.expenses.splice(index, 1);
      }
    }
  }

  calculateTotal(type) {
    if (type === "inc") {
      var sum = 0;
      for (let i = 0; i < this.item.itemList.income.length; i++) {
        sum += parseFloat(this.item.itemList.income[i].value);
      }
      this.item.total.income = sum.toFixed(2);
    }
    if (type === "exp") {
      var sum = 0;
      for (let i = 0; i < this.item.itemList.expenses.length; i++) {
        sum += parseFloat(this.item.itemList.expenses[i].value);
      }
      this.item.total.expenses = sum.toFixed(2);
    }
  }

  calculateBudget() {
    this.calculateTotal("inc");
    this.calculateTotal("exp");

    this.item.budget = parseFloat(this.item.total.income - this.item.total.expenses).toFixed(2);
    this.item.percentage = parseFloat((this.item.total.expenses / this.item.total.income) * 100).toFixed(1);
  }

  getBudget() {
    return {
      budget: this.item.budget,
      income: this.item.total.income,
      expenses: this.item.total.expenses,
      percentage: this.item.percentage,
    };
  }

  // calculatePercentage(){}

  // getPercentage(){}
}

class View {
  getInput() {
    return {
      type: document.querySelector(".add__type").value, //type
      desc: document.querySelector(".add__description").value, //add desc
      value: parseFloat(document.querySelector(".add__value").value).toFixed(2), //val
    };
  }

  addListItem(newItem) {
    let button = document.querySelector(".add__btn"); //btn
    let incomeList = document.querySelector(".income__list");
    let expensesList = document.querySelector(".expenses__list");
    let percentage = document.querySelector(".item__percentage");

    //let percentageValue = model.getIndividualPercentage();

    if (newItem.type === "inc") {
      let incomeHTML = `<div class="item clearfix" id="inc-${newItem.id}"><div class="item__description">${newItem.desc}</div><div class="right clearfix"><div class="item__value">+ ${newItem.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

      incomeList.insertAdjacentHTML("beforeEnd", incomeHTML);
    } 
    else if (newItem.type === "exp") {
      let expensesHTML = `<div class="item clearfix" id="exp-${newItem.id}"><div class="item__description">${newItem.desc}</div><div class="right clearfix"><div class="item__value">- ${newItem.value}</div><div class="item__percentage">%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

      expensesList.insertAdjacentHTML("beforeEnd", expensesHTML);
      //percentage.innerHTML = model.item.itemList.expenses.percentage;
    }
  }

  clearFields() {
    let desc = (document.querySelector(".add__description").value = "");
    let value = (document.querySelector(".add__value").value = "");
  }

  renderMonth() {
    let monthList = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let date = new Date();
    let month = monthList[date.getMonth()];

    document.querySelector(".budget__title--month").innerHTML = month;
  }

  displayBudget(budget, income, expenses, percentage) {
    let budgetValue = document.querySelector(".budget__value");
    let budgetIncomeValue = document.querySelector(".budget__income--value");
    let budgetIncomePercentage = document.querySelector(".budget__income--percentage");
    let budgetExpensesValue = document.querySelector(".budget__expenses--value");
    let budgetExpensesPercentage = document.querySelector(".budget__expenses--percentage");

    budgetValue.innerHTML = budget;
    budgetIncomeValue.innerHTML = income;
    budgetExpensesValue.innerHTML = expenses;
    budgetExpensesPercentage.innerHTML = `${percentage}%`;
  }

  deleteListItem(selectorID) {
    let el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
  }

  // displayPercentages(percentages) {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  setupEventListeners() {
    document.querySelector(".add__btn").addEventListener("click", this.ctrlAddItem.bind(this));
    document.querySelector(".container").addEventListener("click", this.ctrlDeleteItem.bind(this));
  }

  updateBudget() {
    this.model.calculateBudget();
    let ctrlGetBudget = this.model.getBudget();
    this.view.displayBudget(
      ctrlGetBudget.budget,
      ctrlGetBudget.income,
      ctrlGetBudget.expenses,
      ctrlGetBudget.percentage
    );
  }

  // updatePercentages(){}

  ctrlAddItem() {
    let input, newItem;
    input = view.getInput();

    if (input.desc !== "" && !isNaN(input.value) && input.value > 0) {
      newItem = model.addItem(input.type, input.desc, input.value);
      view.addListItem(newItem);
      view.clearFields();
      this.updateBudget();
      // this.updatePercentages();
    }
  }

  ctrlDeleteItem(e) {
    let itemID, splitID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      model.deleteItem(type, ID);
      view.deleteListItem(itemID);
      this.updateBudget();
      // this.updatePercentages();
      console.log(model);
    }
  }

  init() {
    model.calculateBudget();
    let finalGetBudget = model.getBudget();
    view.displayBudget(
      finalGetBudget.budget,
      finalGetBudget.income,
      finalGetBudget.expenses,
      finalGetBudget.percentage
    );
    view.renderMonth();
    this.setupEventListeners();
  }
}

let model = new Model();
let view = new View();
let controller = new Controller(model, view);

controller.init();
