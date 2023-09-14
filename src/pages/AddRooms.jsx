import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import MyContainer from '../components/container/MyContainer';
import { Typography, Box, TextField, Button } from '@mui/material';
import AddHomeIcon from '@mui/icons-material/AddHome';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const AddRooms = () => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector(state => state.auth)

    if (userInfo === null) {
        return <Navigate replace to={'/login'} />
    }
    const navigate = useNavigate()
    
    const notifySuccessAdd = (id) => toast.success(`Room added succesfully with ID : ${id}`, {theme: 'colored'})

    // validation avec formik et yup commence

    const initialValue = {
        number: '',
        price_day: '',
        capacity: '',
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
    
            axios.post(`http://localhost:8000/api/room/new`, values, config)
                .then(async (response) => {
                    console.log(response);
                    notifySuccessAdd(response.data.id_room)
                    navigate('/my-account/rooms')
                })
                .catch((error) => {
                    console.error(error)
                })
        },
        onReset: () => {
            console.log('reseted');
        }
    })
    
        // validation avec formik et yup fin

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
                        <AddHomeIcon 
                            sx={{fontSize: 40}}
                        />
                        New Room
                    </Typography>
                    <Box mt={2}>
                        <Button variant="outlined" startIcon={<ArrowBackIosNewIcon />} onClick={() => navigate('/my-account/rooms')}>Go back</Button>
                    </Box>
                    <Box >
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
                                <TextField
                                    type='number' 
                                    name='number'
                                    required
                                    label="Room number"
                                    value={formik.values.number}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.number && Boolean(formik.errors.number) }
                                    helperText={formik.touched.number && formik.errors.number}
                                    fullWidth
                                    variant='filled'
                                />
                                <TextField
                                    type='number' 
                                    name='price_day'
                                    required
                                    label="Price day"
                                    value={formik.values.price_day}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.price_day && Boolean(formik.errors.price_day) }
                                    helperText={formik.touched.price_day && formik.errors.price_day}
                                    fullWidth
                                    variant='filled'
                                />
                                <TextField
                                    type='number' 
                                    name='capacity'
                                    required
                                    label="Number of persons"
                                    value={formik.values.capacity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.capacity && Boolean(formik.errors.capacity) }
                                    helperText={formik.touched.capacity && formik.errors.capacity}
                                    fullWidth
                                    variant='filled'
                                />
                                                                
                            </Box>
                            <Box
                                sx={{
                                    width: '100%',
                                    marginTop: 10,
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 5

                                }}
                            >
                                <Button variant='contained' color='primary' onClick={formik.handleSubmit}>Save</Button>
                                <Button variant='contained' color='primary' onClick={formik.handleReset}>Reset</Button>
                            </Box>
                        </form>
                    </Box>

                </Box>

            </Box>
        </MyContainer>
    );
}

export default AddRooms;
