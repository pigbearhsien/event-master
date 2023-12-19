import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import * as api from "../../api/api";
import { useEvent } from "@/hook/useEvent";

const columns: GridColDef[] = [
  {
    field: "completed",
    headerName: "Finished",
    type: "boolean",
    width: 100,
    // editable: true,
  },
  {
    field: "todo",
    headerName: "Todo",
    width: 260,
  },
  {
    field: "description",
    headerName: "Description",
    width: 260,
  },
  {
    field: "group",
    headerName: "Group",
    width: 130,
  },
  {
    field: "assigner",
    headerName: "Assigner",
    width: 130,
  },
  {
    field: "deadline",
    headerName: "Deadline",
    width: 140,
    type: "datetime",
  },
];

// const todos = [
//   {
//     id: 1,
//     completed: false,
//     group: "Group 1",
//     todo: "Todo 1",
//     description:
//       "Nullam cursus tincidunt auctor. Nullam cursus tincidunt auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     assigner: "Assigner 1",
//     deadline: "2023-12-30",
//   },
//   {
//     id: 2,
//     completed: true,
//     group: "Group 2",
//     todo: "Todo 2",
//     description: "Description 2",
//     assigner: "Assigner 2",
//     deadline: "2023-12-30",
//   },
//   {
//     id: 3,
//     completed: false,
//     group: "Group 3",
//     todo: "Todo 3",
//     description: "Description 3",
//     assigner: "Assigner 3",
//     deadline: "2023-12-30",
//   },
// ];

type fetchedTodo = {
  assigneeId: string;
  assignerId: string;
  assignerName: string;
  assigneeName: string;
  completed: boolean;
  deadline: string;
  description: string;
  groupId: string;
  name: string;
  todoId: string;
}

type DashboardTodo = {
  id: string;
  completed: boolean;
  group: string;
  todo: string;
  description: string;
  assigner: string;
  deadline: string;
}

const DashboardTodo = () => {
  const { user } = useUser();
  const [todos, setTodos] = useState<DashboardTodo[]>([]); // [
  const [fetched, setFetched] = useState(false);

  const { groupList } = useEvent();

  const fetchUserTodos = async () => {
    if (!user) return;
    const allTodos = await api.getUserTodos(user?.id);
    if (!allTodos) return;
    allTodos.data.forEach((todo: fetchedTodo) => {
      const newTodo: DashboardTodo = {
        id: todo.todoId,
        completed: todo.completed,
        group: groupList.find((group) => group.groupId === todo.groupId)?.name || "",
        todo: todo.name,
        description: todo.description,
        assigner: todo.assignerName,
        deadline: new Date(todo.deadline).toLocaleDateString()
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    })
  };

  if (!fetched) {
    fetchUserTodos();
    setFetched(true);
  }

  return (
    <>
      {todos && todos.length > 0 ? (
        <Box sx={{ width: "90%", margin: "auto", overflow: "scroll" }}>
          <DataGrid
            rows={todos}
            columns={columns}
            // pageSizeOptions={[5]}
            getRowHeight={() => "auto"}
            sx={{
              [`& .${gridClasses.cell}`]: {
                py: 1,
              },
            }}
            disableRowSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: "completed", sort: "asc" }],
              },
            }}
          />
        </Box>
      ) : (
        <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
          No todo
        </Typography>
      )}
    </>
  );
};

export default DashboardTodo;
