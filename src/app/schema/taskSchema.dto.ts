interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'TODO' | 'DOING' | 'DONE'
}

export default Task;
