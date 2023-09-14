import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import MyContainer from '../components/container/MyContainer';
import Box from '@mui/material/Box';
import HeadPage from '../components/HeadPage';
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
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';



import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
}

const Reservations = () => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector(state => state.auth)
    const [ allData, setAllData ] = React.useState([]);
    const tempData = []
    const [ openConfirm, setOpenCofirm ] = React.useState(false)
    const [ selectId, setSelectId ] = React.useState(0);
    const [ refresh, setRefresh ] = React.useState(1);
    const [ openEdit, setOpenEdit ] = React.useState(false)
    const notifySuccessFullDelete = () => toast.success('Customer deteled successfully', {theme: 'colored'});
    const notifySuccessFullEdited = () => toast.success('Customer edited successfully', {theme: 'colored'});

    if (userInfo === null) {
        return <Navigate replace to={'/login'} />
    }



    
    const [value, setValue] = React.useState(dayjs(new Date()));
    const [allCustomers, setAllCustomers] = React.useState([])
    const [allRooms, setAllRooms] = React.useState([])
    const errorNotify = () => toast.error('The room is already occupied in this date', {theme: 'colored'})
    const successNotify = () => toast.success(`Reservation edited succefully`, {theme: 'colored'})



    React.useEffect(() => {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }

        axios.get(`http://localhost:8000/api/booking/all`, config)
            .then(async (response) => {
                console.log(response);
                response.data.map(element => {
                    tempData.push({id: element.id_booking, id_customer: element._id_customer, id_room: element._id_room, date: element.date, day_number: element.day_number, is_paid: element.is_paid ? "YES" : "NO"})
                });
                await setAllData(tempData);
                console.log(allData);
            })
            .catch((error) => {
                console.error(error)
            })
        console.log("rerrrr");
    }, [refresh])

    const renderActions = (params) => {
        const handleDeleteClient = () => {
            setSelectId(params.id)
            setOpenCofirm(true)
        }
        const handleEditClient = () => {
            const status = params.row.is_paid === "YES" ? true : false

            setValue(dayjs(params.row.date))
            formik.initialValues.customer = params.row.id_customer
            formik.initialValues.room = params.row.id_room
            formik.initialValues.day_number = params.row.day_number
            formik.initialValues.is_paid = status

            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            }

            axios.get(`http://localhost:8000/api/customer/all`, config)
                .then(async (response) => {
                    console.log(response);
                    setAllCustomers(response.data)
                })
                .catch((error) => {
                    console.error(error)
                })

            axios.get(`http://localhost:8000/api/room/all`, config)
                .then((response) => {
                    console.log(response);
                    setAllRooms(response.data)
                })
                .catch((error) => {
                    console.error(error)
                })
            setOpenEdit(true);
            setSelectId(params.id)
            console.log('edit', params)
        }
    
        return (
            <Box 
                component={'span'} 
                display={'flex'}
                gap={1}
                justifyContent={'end'}
            >
                <IconButton aria-label="delete" color='error' onClick={handleDeleteClient}>
                    <Delete />
                </IconButton>
                <IconButton aria-label="edit" color='primary' onClick={handleEditClient}>
                    <Edit />
                </IconButton>
            </Box>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'id_customer',
          headerName: 'Customer ID',
          flex: 1,
        },
        {
          field: 'id_room',
          headerName: 'Room ID',
          flex: 1,
        },
        {
          field: 'date',
          headerName: 'Date of Reservation',
          flex: 1,
        },
        {
          field: 'day_number',
          headerName: 'Number of Day',
          flex: 1,
        },
        {
          field: 'is_paid',
          headerName: 'Payed',
          flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: renderActions,
        },
    ];
    // delete
    const handleDelete = (id) => {
        console.log(id);
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }

        axios.delete(`http://localhost:8000/api/booking/delete/${id}`, config)
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

    const initialValue = {
        customer: '',
        room: '',
        day_number: '',
        is_paid: false
    }
    const validationSchema = yup.object({
        customer: yup.string().required('This is required'),
        room: yup.string().required('This is required'),
        day_number: yup.number().required('This is required'),
        is_paid: yup.boolean()
    })
    const formik = useFormik({
        initialValues: initialValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            let data = {...values, 'date': value.format()}
            console.log(data);
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            }

            axios.put(`http://localhost:8000/api/booking/edit/${selectId}`, {
                "date": value.format('YYYY-MM-DD'),
                "day_number": values.day_number,
                "id_customer": values.customer,
                "id_room": values.room,
                "is_paid": values.is_paid
            }, config)
                .then((response) => {
                    console.log(response);
                    setRefresh(state => state + 1)
                    successNotify()
                    setOpenEdit(false)
                    formik.handleReset()
                })
                .catch((response) => {
                    console.log('err', response)
                    errorNotify()
                })
        },
        onReset: () => {
            console.log('reseted');
        }
    })
    

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
                handleClose={() => {
                    setOpenEdit(false);
                }}
                title={`Edit customer ID: ${selectId} `}
                handleEdit={() => console.log('edit')}
            >
                <form>
                <Box
                    sx={{
                        width: '800px',
                        margin: 'auto',
                        marginTop: 5,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 5
                    }}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateCalendar', 'DateCalendar']}>
                            <DemoItem label="Date of Reservation">
                                <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} />
                            </DemoItem>
                        </DemoContainer>
                    </LocalizationProvider>
                    <Box>
                        <FormControl sx={{ m: 1 }} fullWidth size="small">
                            <InputLabel id="demo-select-small-label">Customers</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                label="Customers"
                                name='customer'
                                value={formik.values.customer}
                                onChange={formik.handleChange}
                            >
                                {/* <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem> */}
                                {
                                    allCustomers.map((data, index) => (
                                        <MenuItem key={index} value={data.id_customer}>{data.id_customer}: {`${data.nom} ${data.prenoms}`}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <br/>
                        
                        <FormControl sx={{ m: 1 }} fullWidth size="small">
                            <InputLabel id="demo-select-small-label">Rooms</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                label="Rooms"
                                name='room'
                                value={formik.values.room}
                                onChange={formik.handleChange}
                            >
                                {/* <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem> */}
                                {
                                    allRooms.map((data, index) => (
                                        <MenuItem key={index} value={data.id_room}>{data.id_room}: {`${data.number} - ${data.price_day} Ar per day`}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <br/>
                        <br/>
                        <TextField 
                            name='day_number'
                            label="Number of day"
                            type="number"
                            size='small'
                            value={formik.values.day_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={ formik.touched.day_number && Boolean(formik.errors.day_number) }
                            helperText={formik.touched.day_number && formik.errors.day_number}
                            fullWidth
                        />

                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={formik.values.is_paid} onChange={formik.handleChange} name='is_paid' value={formik.values.is_paid} />} label="pay now" />
                        </FormGroup>
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        margin: 'auto',
                        marginTop: 5,
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Button variant='contained' color='primary' onClick={formik.handleSubmit}>Save</Button>
                </Box>
                </form>
            </FullDialog>
            <HeadPage 
                title={'Reservations'}
                btnText={'New reservation'}
                linkNew={'/my-account/books/new'}
                colorTitle={'black.main'}
                btnIcon={<BookmarkAddIcon />}
            />

            
            <Box sx={{ height: 400, width: '100%', marginTop: '30px', position: 'relative' }}>
                <Box sx={{ height: '100%', width: '100%', marginTop: '30px', position: 'absolute', top: 0, left: 0 }}>
                    <DataGrid
                        rows={allData}
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

export default Reservations;
