<script lang="ts">
  import "./style.scss";

  import * as svelte from "svelte";
  import * as bananum from "#/lib/bananum.js";

  import TextualHRule from "#/components/TextualHRule.svelte";

  let currentTask: bananum.Task | null = null;
  let taskAdd: null | {
    name: string;
    desc: string;
    time: string;
  };

  const store = new bananum.Store("main");
  const tasks = store.tasks;

  svelte.onMount(() => {
    store.notify((task) => {
      currentTask = task;
    });
  });

  function addTask() {
    const add = taskAdd;
    if (!add) return false;

    const thh = add.time.split(":")[0];
    const tmm = add.time.split(":")[1];
    const tss = add.time.split(":")[2];
    const t = new Date();
    t.setHours(parseInt(thh));
    t.setMinutes(parseInt(tmm));
    t.setSeconds(parseInt(tss));

    if (t < new Date()) {
      return false;
    }

    store.add({
      name: add.name,
      desc: add.desc,
      time: t.getTime(),
    });

    taskAdd = null;
    return true;
  }
</script>

{#if currentTask}
  <dialog id="reminder" open>
    <div class="bananize banana">
      {#each Array(10) as _, _}
        <img src="/bananaspin-fast.apng" />
      {/each}
    </div>
    <main>
      <header>
        <a href="#close" aria-label="Close" class="close" />
      </header>
      <h1>IT IS TIME</h1>
      <h2>YOU SHALL: {currentTask.name}</h2>
      {#if currentTask.desc}
        <p>{currentTask.desc}</p>
      {/if}
      <button
        id="done-task"
        on:click={() => {
          currentTask = null;
        }}
      >
        bet
      </button>
    </main>
  </dialog>
{/if}

{#if taskAdd}
  <dialog id="task-add" open>
    <article>
      <header>
        <b>Add Task</b>
        <a
          href="#close"
          class="close"
          aria-label="Close"
          on:click={() => {
            taskAdd = null;
          }}
        />
      </header>
      <form on:submit|preventDefault={() => addTask()}>
        <label>
          Task Name
          <input type="text" bind:value={taskAdd.name} />
        </label>
        <label>
          Task Description
          <input type="text" bind:value={taskAdd.desc} />
        </label>
        <label>
          Task Duration
          <input type="time" step="1" bind:value={taskAdd.time} />
        </label>
        <button type="submit">Add</button>
        <TextualHRule text="or" />
        <button
          type="button"
          class="banana"
          on:click={() => {
            store.add({
              name: "EAT THE BANANA",
              desc: "BANANA GOOD. EAT BANANA.",
              time: Date.now() + 5000,
            });
            taskAdd = null;
          }}>BANANIZE in 5</button
        >
      </form>
    </article>
  </dialog>
{/if}

<main class="container">
  <h1 id="title" class="banana">BANANUM TASKUM</h1>
  <section>
    <h2>Tasks</h2>

    {#each $tasks as task}
      <article class="task">
        <button class="delete-task" on:click={() => store.delete(task.name)}>
          ❌
        </button>
        <h3>
          {task.name}
          <small>
            at {new Date(task.time).toLocaleTimeString("en-US")}
          </small>
        </h3>
        <p>{task.desc}</p>
      </article>
    {:else}
      <p>No tasks yet!</p>
    {/each}
    <button
      on:click={() => {
        taskAdd = {
          name: "",
          desc: "",
          time: "",
        };
      }}
    >
      Add task
    </button>
  </section>
</main>

<style lang="scss">
  @use "sass:math";

  #title {
    font-size: 4em;
    width: min-content;
  }

  h3 small {
    font-size: 0.85em;
    font-weight: normal;
  }

  article.task {
    position: relative;
  }

  button.delete-task {
    position: absolute;
    top: 0;
    right: 0;
    width: fit-content;
    background-color: transparent;
  }

  .banana {
    background-color: #ffeb84;
    border-color: #a08b1b;
    color: black;
  }

  div.bananize {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  div.bananize * {
    position: absolute;
  }

  @for $i from 1 through 10 {
    div.bananize *:nth-child(#{$i}) {
      top: math.percentage(random(100) / 100);
      left: math.percentage(random(100) / 100);
      width: 80px + random(400px);
      transform: translate(-50%, -50%);
    }
  }

  #done-task {
    color: black;
    border-color: #a08b1b;
    border-width: 10px;
    background-color: #ffeb84dd;
    margin-top: 1em;
    font-size: 3em;
    font-weight: 800;
    width: fit-content;
    padding: 0.5em 1em;
  }

  #task-add button {
    margin: 0;
  }

  #reminder main {
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  #reminder main * {
    --color: black;
    --font-size: 3em;
  }
</style>
