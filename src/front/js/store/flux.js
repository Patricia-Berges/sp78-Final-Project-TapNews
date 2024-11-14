const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      token: null,
      users: [],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      addUser: (email, password) => {
        const store = getStore();
        const newUser = { email, password }; // Crear un objeto de usuario
        const updatedUsers = [...store.users, newUser];
        setStore({ users: updatedUsers });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      },

      signup: async (username, email, password) => {
        const resp = await fetch(
          `https://obscure-pancake-x599pr4vr6vq366v-3000.app.github.dev/api/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: username,
              email: email,
              password: password,
            }),
          }
        );
        if (!resp.ok) throw Error("There was a problem in the signup request");

        if (resp.status === 401) {
          throw "Invalid credentials";
        } else if (resp.status === 400) {
          throw "Invalid email or password format";
        }
        const data = await resp.json();
      },

      login: async (email, password) => {
        try {
          const resp = await fetch(
            `https://obscure-pancake-x599pr4vr6vq366v-3001.app.github.dev/api/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: email, password: password }),
            }
          );
      
          if (!resp.ok) {
            // Si la respuesta no es 2xx, lanzamos un error general
            throw new Error("usuario o contraseña incorrecta");
          }
      
          const data = await resp.json();
          
          if (resp.status === 401) {
            // Si el estado es 401 (credenciales incorrectas), lanzamos un error específico
            throw new Error("Usuario o contraseña incorrectos");
          } else if (resp.status === 400) {
            // Si el estado es 400 (formato incorrecto de email o contraseña)
            throw new Error("Formato de email o contraseña inválido");
          }
      
          // Si todo está bien, guardamos el token y retornamos los datos
          localStorage.setItem("jwt-token", data.token);
          return data;
        } catch (error) {
          // En caso de cualquier otro error, lo propagamos
          throw error;
        }
      },
      

      getMyTasks: async () => {
        // Recupera el token desde la localStorage
        const token = localStorage.getItem("jwt-token");

        const resp = await fetch(
          `https://obscure-pancake-x599pr4vr6vq366v-3001.app.github.dev/api/users`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token, // ⬅⬅⬅ authorization token
            },
          }
        );

        if (!resp.ok) {
          throw Error("There was a problem in the login request");
        } else if (resp.status === 403) {
          throw Error("Missing or invalid token");
        } else {
          throw Error("Unknown error");
        }
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
