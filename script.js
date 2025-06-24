document.addEventListener("DOMContentLoaded", () => {
    const inputTask = document.querySelector(".input-box");
    const addBtn = document.querySelector(".add-btn");
    const ulList = document.querySelector(".task-list");

    function resetTask(){
        ulList.innerHTML = ""; // clear all tasks from DOM
        localStorage.removeItem("tasks"); // clear saved tasks
        document.querySelector(".empty-image").style.display = "inline-block";  // empty image back again
        document.querySelector(".reset").style.display = "none"; // hide the reset button
    }
    document.querySelector(".reset").addEventListener("click", resetTask);

    // Load tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(({ text, checked }) => createTask(text, checked));

    const allChecked = storedTasks.length > 0 && storedTasks.every(task => task.checked);
    document.querySelector(".reset").style.display = allChecked ? "block" : "none";
    
    // saving task for it can be stored in the browser
    function saveTasks() {
        const tasks = [...document.querySelectorAll(".task-list li")].map(li => ({
            text: li.querySelector(".task-text").textContent.trim(),
            checked: li.querySelector(".check-box").checked
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // creating task-list inside ulList
    function createTask(task, isChecked = false) {
        const li = document.createElement("li");
        li.innerHTML = `
        <div class="task-item">
            <input type="checkbox" class="check-box" />
            <span class="task-text">${task}</span>
            <div class="edit-delete-btn">
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </div>
        </div>
        `;

        const checkedBtn = li.querySelector(".check-box");
        const editBtn = li.querySelector(".edit-btn");
        const deleteBtn = li.querySelector(".delete-btn");

        checkedBtn.checked = isChecked;

        if (isChecked) {
            editBtn.disabled = true;
            deleteBtn.disabled = true;
            li.style.backgroundColor = "#d1f7c4";
            li.style.borderLeft = "5px solid #27ae60";
            ulList.append(li);
        } else {
            ulList.prepend(li);
        }

        // check-box logic
        checkedBtn.addEventListener("click", () => {
            if (checkedBtn.checked) {
                editBtn.disabled = true;
                deleteBtn.disabled = true;
                li.style.backgroundColor = "#d1f7c4"; // light green
                li.style.borderLeft = "5px solid #27ae60"; // dark green 
                li.remove();
                ulList.append(li);
            } else {
                editBtn.disabled = false;
                deleteBtn.disabled = false;
                li.style.backgroundColor = "";
                li.style.borderLeft = "none";
                li.remove();
                ulList.prepend(li);
            }

            const allTaskChecked = [...document.querySelectorAll(".task-list li .check-box")].every(box => box.checked);
            if (allTaskChecked){
                confettiCelebration();
                document.querySelector(".reset").style.display = "block" 
            }
            else{
                document.querySelector(".reset").style.display = "none"
            }
            saveTasks();
        });


        // delete logic
        li.querySelector(".delete-btn").addEventListener("click", () => {
            li.remove();
            if (ulList.children.length === 0) {
                document.querySelector(".empty-image").style.display = "inline-block";
            }
            saveTasks();
        });
        

        // edit logic
        li.querySelector(".edit-btn").addEventListener("click", () => {
            const taskInput = li.querySelector(".task-text");

            const saveEdit = () => {
                taskInput.removeAttribute("contentEditable");
                taskInput.textContent = taskInput.textContent.trim();
                li.style.backgroundColor = "";
                li.style.borderLeft = "none";
                saveTasks();
            };

            if (!checkedBtn.checked) {
                taskInput.setAttribute("contentEditable", "true");
                li.style.backgroundColor = "#fff8dc"; // light yellowish
                li.style.borderLeft = "5px solid #f39c12"; // orange solid border
                taskInput.focus();

                taskInput.onkeypress = (e) => {
                    if (e.key === "Enter") saveEdit();
                };

                taskInput.addEventListener("blur", saveEdit);
            }
        });

        document.querySelector(".empty-image").style.display = "none";
    }

    function addTask(e) {
        e.preventDefault();  // this prevent the page from reloading when form is submitted

        const task = inputTask.value.trim();
        if (!task) return;

        createTask(task, false);
        inputTask.value = "";
        saveTasks();
    }

    addBtn.addEventListener("click", addTask);
    inputTask.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') addTask(e);
    });
});


const confettiCelebration = ()=>{
    const count = 200,
    defaults = {
    origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
    confetti(
    Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
    })
    );
    }

    fire(0.25, {
    spread: 26,
    startVelocity: 55,
    });

    fire(0.2, {
    spread: 60,
    });

    fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    });

    fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    });

    fire(0.1, {
    spread: 120,
    startVelocity: 45,
    });
}