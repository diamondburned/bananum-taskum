import * as store from "svelte/store";

export type Task = {
  name: string;
  desc: string;
  time: number;
};

export class Store {
  tasks = store.writable<Task[]>([]);
  private taskHandlers: Set<(task: Task) => void> = new Set();

  constructor(private id: string) {
    const v = localStorage.getItem(this.id);
    if (v) {
      const tasks = JSON.parse(v);
      this.tasks.set(tasks);
      this.reschedule();
    }

    this.tasks.subscribe((tasks) => {
      localStorage.setItem(this.id, JSON.stringify(tasks));
    });
  }

  notify(f: (task: Task) => void) {
    this.taskHandlers.add(f);
  }

  add(t: Task) {
    this.tasks.update((tasks) => [...tasks, t]);
    this.reschedule();
  }

  delete(name: string) {
    this.tasks.update((tasks) => tasks.filter((t) => t.name !== name));
    this.reschedule();
  }

  private save() {
    localStorage.setItem(this.id, JSON.stringify(store.get(this.tasks)));
  }

  private reschedule() {
    let earliestTask: Task | undefined = undefined;
    for (const task of store.get(this.tasks)) {
      if (earliestTask === undefined || task.time < earliestTask.time) {
        earliestTask = task;
      }
    }

    if (earliestTask) {
      setTimeout(
        this.taskHandler(earliestTask),
        earliestTask.time - Date.now()
      );
      console.log(
        "rescheduled to",
        earliestTask.time,
        "which is in",
        earliestTask.time - Date.now()
      );
    }

    this.save();
  }

  private taskHandler(task: Task): () => void {
    return () => {
      this.taskHandlers.forEach((f) => f(task));
      this.delete(task.name);
    };
  }
}
