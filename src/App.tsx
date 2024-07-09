import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { get } from "aws-amplify/api";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
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

  async function sayHello() {
    const returned = await client.queries.Hello({ name: "AWS Amplify" });
    setHello(returned.data ? returned.data : "empty");
  }

  async function getItem() {
    try {
      const restOperation = get({ 
        apiName: 'myRestApi',
        path: 'items' 
      });
      const response = await restOperation.response;
      console.log('GET call succeeded: ', response);
    } catch (error) {
      console.log('GET call failed: ', JSON.parse(error.response.body));
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s' todos</h1>
          <button onClick={createTodo}>+ new</button>
          <button onClick={sayHello}>{hello}</button>
          <button onClick={getItem}>{hello}</button>
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
