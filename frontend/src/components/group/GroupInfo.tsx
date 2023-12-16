import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus, Pencil, Trash, Save, X } from "lucide-react";

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
import * as api from "@/api/api";
import { useParams } from "react-router-dom";

const role = ["Manager", "Member"];

const initialRows: GridRowsProp = [
  {
    id: 1,
    name: "John",
    email: "fakeemail@gmail.com",
    role: "Manager",
  },
  {
    id: 2,
    name: "Anson",
    email: "fakeemail@gmail.com",
    role: "Member",
  },
  {
    id: 3,
    name: "Xin",
    email: "fakeemail@gmail.com",
    role: "Member",
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
    const id = "new";
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: "",
        email: "",
        role: "Member",
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
        Add Member
      </Button>
    </GridToolbarContainer>
  );
}

const GroupInfo = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // const [members, setMembers] = useState<any[]>([]);
  const [manager, setManager] = useState<any[]>([]);

  const { groupId } = useParams();

  const fetchGroupManagers = async () => {
    var managers: any;
    try {
      if (!groupId) return;
      managers = await api.getGroupManagerWithId(groupId);
      console.log("manager", managers.data);
      setManager(managers.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroupUsers = async () => {
    var groupUsers: any;
    try {
      if (!groupId) return;
      groupUsers = await api.getGroupUsers(groupId);
      console.log(groupUsers);
      setRows([]);
      groupUsers.data.map((user: any) => {
        var role = "Member";
        manager.map((manager) => {
          if (manager.userId == user.userId) role = "Manager";
        });
        var row = {
          id: user.userId,
          name: user.name,
          email: user.account,
          role: role,
          isNew: false,
        };
        setRows((rows) => [...rows, row]);
      });
      console.log(groupUsers.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGroupManagers();
  }, [groupId]);
  useEffect(() => {
    fetchGroupUsers();
  }, [manager]);

  const addUser = async (account: string) => {
    try {
      if (!groupId) return;
      const res = await api.insertUserToGroup(groupId, account);
      console.log("addUser", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addManager = async (account: string)  => {
    try{
      if (!groupId) return
      const res = await api.addManager(groupId, account)
      console.log("addManager", res.data)
    } catch(error) {
      console.log(error)
    }
  }

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
    if (newRow.id === "new") {
      var account = newRow.email;
      addUser(account)
      if (newRow.role === "Manager")
        addManager(newRow.email)
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 300,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      editable: true,
      type: "singleSelect",
      valueOptions: role,
      align: "center",
      headerAlign: "center",
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
        width: "80%",
        margin: "auto",
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
            sortModel: [{ field: "role", sort: "asc" }],
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

export default GroupInfo;
