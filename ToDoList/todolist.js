window.onload = function () {
  const savedToDoList = JSON.parse(localStorage.getItem("todolist"));

  if (savedToDoList) {
    for (let todo of savedToDoList) {
      createToDo(todo);
    }
  }

  const startBtn = document.querySelector("#addBtn");
  startBtn.addEventListener("click", () => createToDo());

  const inputBox = document.querySelector("#inputBox");
  inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      createToDo();
    }
  });

  // ✅ 기존 버튼에 전체 삭제 기능 추가
  const clearBtn = document.querySelector("#clearAllBtn");
  clearBtn.addEventListener("click", function () {
    const ulNode = document.querySelector("#todolist");
    ulNode.innerHTML = "";
    localStorage.removeItem("todolist");
    ulNode.style.display = "none";
  });
};

function createToDo(todo) {
  const inputBox = document.querySelector("#inputBox");
  if ((todo == null && inputBox.value.trim() === "") || (todo && todo.contents.trim() === "")) return;

  const liNode = document.createElement("li");

  const checkBtn = document.createElement("button");
  checkBtn.classList.add("checkBtn");

  const todoText = document.createElement("span");
  if (todo) {
    todoText.innerText = todo.contents;
    if (todo.check) {
      todoText.classList.add("check");
      checkBtn.innerText = "V";
    }
  } else {
    todoText.innerText = inputBox.value;
    inputBox.value = "";
  }

  checkBtn.addEventListener("click", function () {
    todoText.classList.toggle("check");
    checkBtn.innerText = todoText.classList.contains("check") ? "V" : "";
    saveToDoList();
  });

  // ✏️ 편집 버튼
  const editBtn = document.createElement("button");
  editBtn.innerText = "✏️";
  editBtn.classList.add("editBtn");
  editBtn.addEventListener("click", function () {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todoText.innerText;
    liNode.replaceChild(editInput, todoText);
    editInput.focus();

    editInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        todoText.innerText = editInput.value;
        liNode.replaceChild(todoText, editInput);
        saveToDoList();
      }
    });

    editInput.addEventListener("blur", function () {
      todoText.innerText = editInput.value;
      liNode.replaceChild(todoText, editInput);
      saveToDoList();
    });
  });

  const delBtn = document.createElement("button");
  delBtn.innerText = "X";
  delBtn.classList.add("delBtn");
  delBtn.addEventListener("click", function () {
    liNode.remove();
    saveToDoList();
    const ulNode = document.querySelector("#todolist");
    if (ulNode.children.length === 0) {
      ulNode.style.display = "none";
    }
  });

  liNode.appendChild(checkBtn);
  liNode.appendChild(todoText);
  liNode.appendChild(editBtn); // ✏️ 아이콘 추가
  liNode.appendChild(delBtn);

  const ulNode = document.querySelector("#todolist");
  ulNode.appendChild(liNode);
  ulNode.style.display = "block";

  saveToDoList();
}

function saveToDoList() {
  const todoList = document.querySelectorAll("#todolist li");

  const saveItems = [];
  for (let node of todoList) {
    const todoObj = {
      contents: node.querySelector("span").innerText,
      check: node.querySelector("span").classList.contains("check"),
    };
    saveItems.push(todoObj);
  }

  localStorage.setItem("todolist", JSON.stringify(saveItems));
}