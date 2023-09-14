import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import MyContainer from '../components/container/MyContainer';
import HeadPage from '../components/HeadPage';
import AddHomeIcon from '@mui/icons-material/AddHome';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridToolbarQuickFilter, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton  } from '@mui/x-data-grid';
import { IconButton, TextField, Button } from '@mui/material';
import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import axios from 'axios';
import { capitalizeFont } from '../config/global';
import DialogConfirmation from '../components/DialogConfirmation';
import { toast } from 'react-toastify';
import FullDialog from '../components/FullDialog';
import { useFormik } from 'formik';
import * as yup from 'yup';

function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
}

const Rooms = () => {
    const { userInfo, userToken } = useSelector(state => state.auth);
    const [refresh, setRefresh] = React.useState(0);
    const [allRooms, setAllRooms] = React.useState([])
    const tempData = []
    const [ openConfirm, setOpenCofirm ] = React.useState(false)
    const [ openEdit, setOpenEdit ] = React.useState(false)
    const [ selectId, setSelectId ] = React.useState(0);
    
    const notifySuccessFullDelete = () => toast.success('Room deteled successfully', {theme: 'colored'});
    const notifySuccessFullEdited = () => toast.success('Room edited successfully', {theme: 'colored'});

    // validation avec formik et yup commence

    const initialValue = {
        number: 0,
        price_day: 0,
        capacity: 0,
    }
    const validationSchema = yup.object({
        number: yup.number().required('This is required'),
        price_day: yup.number().required('This is required'),
        capacity: yup.number().required('This is required')
    })

    const formik = useFormik({
        initialValues: initialValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log('values', values);
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            }
    
            axios.put(`http://localhost:8000/api/room/edit/${selectId}`, values,config)
                .then(async (response) => {
                    console.log(response);
                    setOpenEdit(false)
                    formik.handleReset()
                    await setRefresh(state => state + 1)
                    notifySuccessFullEdited()
                })
                .catch((error) => {
                    console.error(error)
                })
            console.log("rerrrr");
        },
        onReset: () => {
            console.log('reseted');
        }
    })

    // validation avec formik et yup fin
    
    if (userInfo === null) {
        return <Navigate replace to={'/login'} />
    }
    React.useEffect(() => {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }

        axios.get(`http://localhost:8000/api/room/all`, config)
            .then((response) => {
                console.log(response);
                response.data.map(element => {
                    tempData.push({id: element.id_room, number: element.number, price_day: element.price_day, capacity: element.capacity})
                });
                setAllRooms(tempData);
                console.log(allRooms);
            })
            .catch((error) => {
                console.error(error)
            })
        console.log("rerrrr");
    }, [refresh])

    const renderActions = (params) => {
        const handleDeleteRoom = () => {
            setSelectId(params.id)
            setOpenCofirm(true)
            console.log("delete", params);
        }
        const handleEditRoom = () => {
            setSelectId(params.id)
            formik.initialValues.number = params.row.number;
            formik.initialValues.capacity = params.row.capacity;
            formik.initialValues.price_day = params.row.price_day;
            setOpenEdit(true)            
            console.log('edit', params)
        }
    
        return (
            <Box 
                component={'span'} 
                display={'flex'}
                gap={1}
                justifyContent={'end'}
            >
                <IconButton aria-label="delete" color='error' onClick={handleDeleteRoom}>
                    <Delete />
                </IconButton>
                <IconButton aria-label="edit" color='primary' onClick={handleEditRoom}>
                    <Edit />
                </IconButton>
            </Box>
        )
    }

    // columns
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'number',
          headerName: 'Number',
          flex: 1,
        },
        {
          field: 'price_day',
          headerName: 'Price day (Ar)',
          flex: 1,
        },
        {
          field: 'capacity',
          headerName: 'Number of persons',
          flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: renderActions,
        },
    ];
    const handleDelete = (id) => {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }

        axios.delete(`http://localhost:8000/api/room/delete/${id}`, config)
            .then(async (response) => {
                console.log(response);
                await setRefresh(state => state + 1)
                setTimeout(() => {
                    notifySuccessFullDelete()
                }, 500)
            })
            .catch((error) => {
                console.error(error)
            })
        
        setOpenCofirm(false)
    }

    return (
        <MyContainer>
            <DialogConfirmation 
                open={openConfirm}
                title={"Delete Definitively"}
                content={'Are you sur'}
                handleClose={() => setOpenCofirm(false)}
                handleAccept={() => handleDelete(selectId)}
            />
            <FullDialog 
                open={openEdit}
                title={`Edit Room with ID: ${selectId}`}
                handleClose={() => {
                    setOpenEdit(false);
                    formik.handleReset()
                }}
                handleEdit={() => formik.handleSubmit}
            >
                <form onSubmit={formik.handleSubmit}>
                    <Box
                        sx={{
                            width: '800px',
                            margin: 'auto',
                            marginTop: 10,
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: 5
                        }}
                    >
                        <TextField 
                            name='number'
                            required
                            label="Room number"
                            type='number'
                            value={formik.values.number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={ formik.touched.number && Boolean(formik.errors.number) }
                            helperText={formik.touched.number && formik.errors.number}
                            fullWidth
                        />
                        <TextField 
                            name='price_day'
                            required
                            label="Price per day"
                            type='number'
                            value={formik.values.price_day}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={ formik.touched.price_day && Boolean(formik.errors.price_day) }
                            helperText={formik.touched.price_day && formik.errors.price_day}
                            fullWidth
                        />
                        <TextField 
                            name='capacity'
                            required
                            label="Number of persons"
                            type='capacity'
                            value={formik.values.capacity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={ formik.touched.capacity && Boolean(formik.errors.capacity) }
                            helperText={formik.touched.capacity && formik.errors.capacity}
                            fullWidth
                        />
                        <Button onClick={formik.handleSubmit} variant='contained'>Save</Button>
                    </Box>
                </form>
            </FullDialog>
            <HeadPage 
                title={'Rooms'}
                btnText={'Add new room'}
                linkNew={'/my-account/rooms/new'}
                colorTitle={'black.main'}
                btnIcon={<AddHomeIcon />}
            />
            <Box sx={{ height: 400, width: '100%', marginTop: '30px', position: 'relative' }}>
                <Box sx={{ height: '100%', width: '100%', marginTop: '30px', position: 'absolute', top: 0, left: 0 }}>
                    <DataGrid
                        rows={allRooms}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: {
                            pageSize: 5,
                            },
                        },
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                        slots={{ toolbar: CustomToolbar }}
                    />
                </Box>
            </Box>
        </MyContainer>
    );
}

export default Rooms;
