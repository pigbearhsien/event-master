import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus, Pencil, Trash, Save, X } from "lucide-react";
import * as api from "../../api/api"
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  gridClasses,
} from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const members = ["John", "Anson", "Xin"];

const initialRows: GridRowsProp = [
  {
    id: 1,
    completed: false,
    todo: "Todo 1",
    description:
      "Nullam cursus tincidunt auctor. Nullam cursus tincidunt auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    assigner: "Assigner 1",
    assignee: "Assignee 1",
    deadline: new Date("2023-12-30"),
  },
  {
    id: 2,
    completed: true,
    todo: "Todo 2",
    description: "Description 2",
    assigner: "Assigner 2",
    assignee: "Assignee 2",
    deadline: new Date(),
  },
  {
    id: 3,
    completed: false,
    todo: "Todo 3",
    description: "Description 3",
    assigner: "Assigner 3",
    assignee: "Assignee 3",
    deadline: new Date("2023-12-30"),
  },
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    // id 隨機產生
    const id = Math.floor(Math.random() * 1000000);
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: "",
        age: "",
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Plus />} onClick={handleClick}>
        Add Todo
      </Button>
    </GridToolbarContainer>
  );
}

const GroupTodo = () => {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [todos, setTodos] = useState<any>([])
  const [fetchedManager, setFetchedMaanager] = useState(false)
  const [fetchedTodos, setFetchedTodos] = useState(false)
  const { groupId } = useParams();
  const user = useUser()
  // groupTodos
  const fetchGroupTodos = async () => {
    setFetchedTodos(true)
    var groupTodos: any
    try {
      var userId: string = ""
      if (user.user)
        userId = user.user.id
      groupTodos = await api.getUserTodos(userId)
      groupTodos.data.map((todo: any)=>{
        if (todo.eventId === groupId)
          setTodos([...todos, todo])
      })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchGroupManagers = async () => {
    setFetchedMaanager(true)
    var groupManagers: any
    try {
      if (!groupId) return;
      groupManagers = await api.getGroupManagerWithId(groupId)
    } catch (error) {
      console.log(error)
    }
  }

  if(fetchedManager === false) fetchGroupManagers()
  if(fetchedTodos === false) fetchGroupTodos()

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "completed",
      headerName: "Finished",
      type: "boolean",
      width: 100,
      editable: true,
    },
    {
      field: "todo",
      headerName: "Todo",
      width: 260,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 260,
      editable: true,
    },
    {
      field: "assigner",
      headerName: "Assigner",
      width: 130,
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 130,
      editable: true,
      type: "singleSelect",
      valueOptions: members,
    },
    {
      field: "deadline",
      headerName: "Deadline",
      width: 140,
      type: "date",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<X />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Pencil />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Trash />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
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
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
};

export default GroupTodo;
