const transactionFormEl = document.getElementById("transactionForm");

const state = {
  earnings: 0,
  expense: 0,
  net: 0,
  transactions: [
    {
      //   id: Math.floor(Math.random() * 1000),
      id: 3,
      text: "Example",
      amount: 10,
      type: "credit",
    },
  ],
};
let isUpdate = false;
let tid;

const renderTransaction = () => {
  const transactionContainerEl = document.querySelector(".transactions");
  const earningEl = document.getElementById("earning");
  const expenseEl = document.getElementById("expense");
  const netAmountEl = document.getElementById("netAmount");

  const transactions = state.transactions;

  let earning = 0;
  let expense = 0;
  let net = 0;
  transactionContainerEl.innerHTML = "";
  transactions.forEach((transaction) => {
    const { id, text, amount, type } = transaction;
    const isCredit = type === "credit" ? true : false;
    const sign = isCredit ? "+" : "-";
    const transactionEl = `
        <div class="transaction" id="${id}">
        <div class="content" onclick="showEdit(${id})">
        <div class="left">
          <p>${text}</p>
          <p>${sign} &#8377;${amount}</p>
        </div>
        <div class="status ${isCredit ? "credit" : "debit"}">${isCredit ? "C" : "D"}</div>
        </div>
        <div class="lower">
        <span class="material-symbols-outlined" onclick="handleUpdate(${id})" > edit </span>
        <span class="material-symbols-outlined"  onclick="handleDelete(${id})"> delete </span>
      </div>
      </div>
        `;
    earning += isCredit ? amount : 0;
    expense += !isCredit ? amount : 0;
    net = earning - expense;
    transactionContainerEl.insertAdjacentHTML("afterbegin", transactionEl);
  });

  earningEl.innerHTML = `&#8377; ${earning}`;
  expenseEl.innerHTML = `&#8377; ${expense}`;
  netAmountEl.innerHTML = `&#8377; ${net}`;
};

const addTransaction = (event) => {
  event.preventDefault();
  const isEarn = event.submitter.id === "earnBtn" ? true : false;

  //   console.log(event.submitter.id);
  let tdata = {};
  const formData = new FormData(transactionFormEl);
  formData.forEach((value, key) => {
    tdata[key] = value;
  });
  const { text, amount } = tdata;
  const transaction = {
    id: isUpdate ? tid : Math.floor(Math.random() * 1000),
    text: text,
    amount: +amount,
    type: isEarn ? "credit" : "debit",
  };

  if (isUpdate) {
    const tindex = state.transactions.findIndex((t) => t.id === tid);
    // t.id === tid and not id
    state.transactions[tindex] = transaction;
    isUpdate = false;
    tid = null;
    const { text, amount } = transaction;

    const textInput = document.getElementById("text");
    const amountInput = document.getElementById("amount");

    textInput.placeholder = "Enter description ...";
    textInput.value = null;
    amountInput.placeholder = "Enter amount...";
    amountInput.value = null;
  } else {
    state.transactions.push(transaction);

    const { text, amount } = transaction;

    const textInput = document.getElementById("text");
    const amountInput = document.getElementById("amount");

    textInput.placeholder = "Enter description ...";
    textInput.value = null;
    amountInput.placeholder = "Enter amount...";
    amountInput.value = null;
  }

  renderTransaction();
  //   console.log(state);
};

const showEdit = (id) => {
  const captureOnclickElement = document.getElementById(id);
  const captureLower = captureOnclickElement.querySelector(".lower");

  captureLower.classList.toggle("showTransaction");
};

const handleUpdate = (id) => {
  const transaction = state.transactions.find((t) => t.id === id);
  const { text, amount } = transaction;

  const textInput = document.getElementById("text");
  const amountInput = document.getElementById("amount");
  console.log(text, amount);
  textInput.value = text;
  amountInput.value = amount;
  isUpdate = true;
  tid = id;
};

const handleDelete = (id) => {
  const filteredTransaction = state.transactions.filter((t) => t.id !== id);
  //   console.log(filteredTransaction) t.id !== id makes the desired transaction get deleted ;
  state.transactions = filteredTransaction;
  renderTransaction();
};

renderTransaction();
transactionFormEl.addEventListener("submit", addTransaction);
