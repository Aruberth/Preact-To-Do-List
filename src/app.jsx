import { useState, useEffect } from "preact/hooks";

function CreateTask({ onAddTask, toHide }) {
  const [textTitulo, setTextTitulo] = useState("");
  const [textDescricao, setTextDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [data, setData] = useState("");

  function handleAddTask() {
    const arrayDate = data.split("-");
    const newDateBr = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`;

    if (textTitulo && textDescricao && prioridade && data) {
      onAddTask({
        id: crypto.randomUUID(),
        titulo: textTitulo,
        descricao: textDescricao,
        prioridade: prioridade,
        data: newDateBr,
      });
      toHide(false);
    }
  }

  return (
    <div className="fixed flex h-full w-full justify-center items-center backdrop-blur-sm transition duration-180 z-1">
      <div className="bg-base-100 h-120 w-3xl max-w-dvh relative p-5 rounded-3xl">
        <h3 className="font-bold text-3xl mb-7">Criar Task</h3>
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => toHide(false)}
        >
          ✕
        </button>
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <legend className="fieldset-legend tecountText(setTextTitulo)xt-lg">
              Titulo
            </legend>
            <input
              value={textTitulo}
              onInput={(e) => setTextTitulo(e.target.value)}
              type="text"
              minlength="1"
              maxlength="20"
              className="input input-xl pika-single"
              id="myDatepicker"
            ></input>
            <p className="label mb-7 mt-1 ml-1">{textTitulo.length + "/20"}</p>
          </div>
          <div className="flex flex-col">
            <legend className="fieldset-legend text-lg">Descrição</legend>
            <input
              value={textDescricao}
              onInput={(e) => setTextDescricao(e.target.value)}
              type="text"
              minlength="1"
              maxlength="20"
              className="input input-xl pika-single"
              id="myDatepicker"
            ></input>
            <p className="label mb-7 mt-1 ml-1">
              {textDescricao.length + "/20"}
            </p>
          </div>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-lg">Prioridade</legend>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="select select-xl mb-7"
              >
                <option value={"Baixa"}>Baixa</option>
                <option value={"Média"}>Média</option>
                <option value={"Alta"}>Alta</option>
              </select>
            </fieldset>
          </div>
          <div>
            <legend className="fieldset-legend text-lg mt-1">Prazo</legend>
            <input
              value={data}
              onChange={(e) => setData(e.target.value)}
              type="date"
              className="input input-xl"
            />
          </div>
        </div>
        <button
          onClick={handleAddTask}
          className="text-2xl absolute p-7 bottom-10 left-70 right-70 btn btn-success"
        >
          Criar
        </button>
      </div>
    </div>
  );
}

function beforeUnload(tasks, taskCount, themeCheck) {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("tasksCount", taskCount);
      localStorage.setItem("themePreference", themeCheck);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
  });
}

function OnStart(setTasks, setTaskCount, setThemeCheck) {
  const localTasks = JSON.parse(localStorage.getItem("tasks"));
  const completeTasks = localStorage.getItem("tasksCount");
  const themePreference = localStorage.getItem("themePreference");

  const handleOnload = () => {
    if (localTasks.length > 0) {
      setTasks(localTasks);
    }
    if (completeTasks > 0) {
      setTaskCount(completeTasks);
    }
    if (themePreference === "true") {
      setThemeCheck(true);
    }
  };

  window.addEventListener("load", handleOnload);
}

export function App() {
  const [tasks, setTasks] = useState([]);
  const [isCreateOpen, setIsOpen] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [themeCheck, setThemeCheck] = useState(false);

  OnStart(setTasks, setTaskCount, setThemeCheck);
  beforeUnload(tasks, taskCount, themeCheck);

  function addTask(task) {
    setTasks([task, ...tasks]);
    console.log(themeCheck);
  }

  function completeTask(idTask) {
    setTasks(tasks.filter((task) => task.id !== idTask));
    setTaskCount((e) => ++e);
  }

  function dateSimplify(taskDate) {
    const hoje = new Date();
    const hojeFormatado = hoje.toLocaleDateString("pt-BR");

    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);
    const ontemFormatado = ontem.toLocaleDateString("pt-BR");

    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);
    const amanhaFormatado = amanha.toLocaleDateString("pt-BR");

    if (taskDate === hojeFormatado) {
      return "Hoje";
    }
    if (taskDate === ontemFormatado) {
      return "Ontem";
    }
    if (taskDate === amanhaFormatado) {
      return "Amanhã";
    }

    return taskDate;
  }

  function priorityColor(priorityValue) {
    if (priorityValue === "Baixa") {
      return (
        <div className="badge badge-soft badge-success text-2xl pt-3 pb-3">
          Baixa
        </div>
      );
    }
    if (priorityValue === "Média") {
      return (
        <div className="badge badge-soft badge-warning text-2xl pt-3 pb-3">
          Média
        </div>
      );
    }
    if (priorityValue === "Alta") {
      return (
        <div className="badge badge-soft badge-error text-2xl pt-3 pb-3">
          Alta
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col">
      {isCreateOpen && (
        <CreateTask onAddTask={addTask} toHide={setIsOpen}></CreateTask>
      )}
      <div className="navbar bg-base-300 shadow-lg flex justify-between pl-4 pr-4 h-30">
        <p className="font-bold text-4xl pointer-events-none">TO-DO-LIST</p>
        <div className="flex row justify-around">
          <button
            onClick={() => setIsOpen(true)}
            class="btn btn-lg btn-outline btn-success m-2"
          >
            Criar
          </button>
          <div className="divider divider-horizontal"></div>
          <div className="stats">
            <div className="stat-title">Tasks completas</div>
            <div className="stat-value text-primary">{taskCount}</div>
          </div>
        </div>
        <label className="flex items-center justify-center cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input
            type="checkbox"
            value="dark"
            checked={themeCheck}
            onChange={() => setThemeCheck(!themeCheck)}
            className="toggle theme-controller"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
      </div>
      <div class="card shadow-sm h-[calc(100vh-120px)] p-10">
        <div class="card-body bg-base-200 rounded-lg overflow-auto">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-xl font-light">Nome</th>
                  <th className="text-xl font-light">Prioridade</th>
                  <th className="text-xl font-light">Prazo</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <th class="w-1/10">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xl checkbox-success"
                        onChange={() => completeTask(task.id)}
                      />
                    </th>
                    <td className="w-3/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold text-2xl">
                            {task.titulo}
                          </div>
                          <div className="text-sm opacity-50">
                            {task.descricao}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="w-3/10">{priorityColor(task.prioridade)}</td>
                    <td className="w-3/10 text-2xl">
                      {dateSimplify(task.data)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
