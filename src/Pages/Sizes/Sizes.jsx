import React, { useEffect, useState } from "react";
import "./Sizes.module.css";
import SideBar from "../../Components/SideBar/SideBar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axiosInstance from "../../plugins/axios";
import { BallTriangle } from "react-loader-spinner";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { useFormik } from "formik";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function Sizes() {
  const [open, setOpen] = React.useState(false);
  const [viewModal, setViewModal] = React.useState(false); //customize constant useState for new modal to view
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [sizeDetails, setSizeDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(0);
  const [sizeToView, setSizeToView] = useState({});

  let formik = useFormik({
    initialValues: {
      id: "",
      code: "",
    },
    onSubmit: handleSize,
  });

  function editSizeModal(data) {
    formik.values.code = data.code;
    formik.values.id = data.id;
    setOpen(true);
    setMode(1);
  }

  function handleSize(values) {
    if (mode === 0) {
      createSize(values);
    } else {
      editSize(values);
    }
  }
  async function editSize(values) {
    console.log(values);
    try {
      let data = await axiosInstance.patch(`v1/sizes/${values.id}`, values);
      console.log(data);
      setLoading(false);
      getSizes();
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  }

  function viewSize(data) {
    console.log(data);
    setSizeToView(data);
    setViewModal(true);
  }

  async function createSize(values) {
    try {
      let { data } = await axiosInstance.post("v1/sizes", values);
      console.log(data);
      setLoading(false);
      getSizes();
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  }

  async function removeSize(id) {
    try {
      let { data } = await axiosInstance.delete(`v1/sizes/${id}`);
      getSizes();
    } catch (error) {
      console.log(error);
    }
  }

  async function getSizes() {
    try {
      let { data } = await axiosInstance.get("v1/sizes");
      console.log(data);
      setLoading(false);
      setSizeDetails(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSizes();
  }, []);

  return (
    <>
      <SideBar />
      <div className="container customize">
        <Button onClick={handleOpen} variant="contained">
          {" "}
          <i class="fa-solid fa-plus"></i>Create New Size
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form action="" onSubmit={formik.handleSubmit}>
              <TextField
                required
                id="code"
                label="Size Code"
                variant="outlined"
                sx={{ width: "100%", marginBottom: 3 }}
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <Button type="submit" variant="contained">
                Confirm
              </Button>
            </form>
          </Box>
        </Modal>

        <Modal
          open={viewModal}
          onClose={() => setViewModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              required
              readOnly
              id="code"
              label="Size Code"
              variant="outlined"
              sx={{ width: "100%", marginBottom: 3 }}
              value={sizeToView.code}
            />
          </Box>
        </Modal>
      </div>

      {sizeDetails?.data ? (
        <TableContainer
          component={Paper}
          sx={{
            marginTop: "150px",
            marginLeft: "40px",
          }}
        >
          <Table className="w-75 move" aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Sizes</StyledTableCell>

                <StyledTableCell align="right" className="cust">
                  <span className="cust2">Edit</span>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody className="w-25 ">
              {sizeDetails.data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.code}</TableCell>

                  <TableCell align="right">
                    <i
                      className="log mx-2 fa-solid fa-eye"
                      onClick={() => viewSize(row)}
                    ></i>
                    <i
                      className="log mx-2 fa-solid fa-pen-to-square"
                      onClick={() => editSizeModal(row)}
                    ></i>
                    <i
                      className="log mx-2 fa-solid fa-trash"
                      onClick={() => removeSize(row.id)}
                    ></i>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && (
          <>
            <div className="container customize">DATA NOT FOUND</div>
          </>
        )
      )}

      {loading && (
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#4fa94d"
          ariaLabel="ball-triangle-loading"
          wrapperStyle={{}}
          wrapperClass={"justify-content-center"}
          visible={true}
        />
      )}
    </>
  );
}
