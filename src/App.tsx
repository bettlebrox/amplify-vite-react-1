import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css'
const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [hello, setHello] = useState<string>("");
  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id: id });
  }

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function sayHello(){
    const returned = client.queries.Hello({name: "AWS Amplify"})
    returned.then((data) => {
      const helow: string | null = data?.data;
      setHello(helow || "Error");
    })
    
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s' todos</h1>
          <button onClick={createTodo}>+ new</button>
          <button onClick={sayHello}>{hello}</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.content}
                <button onClick={() => deleteTodo(todo.id)}>del</button>
              </li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
