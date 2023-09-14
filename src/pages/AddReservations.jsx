import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import MyContainer from '../components/container/MyContainer';
import { Typography, Box, TextField, Button } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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


const AddReservations = () => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector(state => state.auth)
    const [ selectDate, setSelectDate ] = React.useState(new Date())
    const [value, setValue] = React.useState(dayjs(new Date()));
    const [allCustomers, setAllCustomers] = React.useState([])
    const [allRooms, setAllRooms] = React.useState([])
    const errorNotify = () => toast.error('The room is already occupied in this date', {theme: 'colored'})
    const successNotify = (id) => toast.success(`Reservation added succefully ${id}`, {theme: 'colored'})
    const navigate = useNavigate();
    console.log(value.toDate());

    if (userInfo === null) {
        return <Navigate replace to={'/login'} />
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

            axios.post(`http://localhost:8000/api/booking/new`, {
                "date": value.format('YYYY-MM-DD'),
                "day_number": values.day_number,
                "id_customer": values.customer,
                "id_room": values.room,
                "is_paid": values.is_paid
            }, config)
                .then((response) => {
                    console.log(response);
                    successNotify(response.data.id_booking);
                    navigate('/my-account/books')
                })
                .catch((response) => {
                    console.log('err', response)
                    errorNotify();
                })
        },
        onReset: () => {
            console.log('reseted');
        }
    })


    React.useEffect(() => {
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


    }, [])

    const handleSubmit = () => {
        console.log('submit');
    }

    return (
        <MyContainer>
            <Box 
                sx={{
                    width: '800px',
                    margin: 'auto',
                    position: 'relative',
                    height: '700px'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%' 
                    }}
                >
                    <Typography variant='h4' color={'black.main'}
                            sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center', borderBottom: '1px solid #000' }}
                        >
                        <PersonAddAlt1Icon 
                            sx={{fontSize: 40}}
                        />
                        New Reservation
                    </Typography>
                    <Box >
                        <form onSubmit={formik.handleSubmit}>
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
                                            <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} minDate={dayjs(new Date())} />
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
                                        <FormControlLabel control={<Checkbox onChange={formik.handleChange} name='is_paid' value={formik.values.is_paid} />} label="pay now" />
                                    </FormGroup>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    width: '100%',
                                    marginTop: 5,
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 5

                                }}
                            >
                                <Button variant='contained' color='primary' onClick={formik.handleSubmit}>Save</Button>
                                <Button variant='contained' color='primary'>Reset</Button>
                            </Box>
                        </form>
                    </Box>

                </Box>

            </Box>
        </MyContainer>
    );
}

export default AddReservations;
