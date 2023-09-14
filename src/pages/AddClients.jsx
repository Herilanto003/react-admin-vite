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

const AddClients = () => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector(state => state.auth)
    const notifySuccessAdd = (id) => toast.success(`Customer added succesfully with ID : ${id}`, {theme: 'colored'})
    const navigate = useNavigate();

    if (userInfo === null) {
        return <Navigate replace to={'/login'} />
    }

    const initialValue = {
        nom: '',
        prenoms: '',
        telephone: '',
        cin: '',
        email: ''
    }
    const validationSchema = yup.object({
        nom: yup.string().required('This field is required'),
        prenoms: yup.string(),
        telephone: yup.string().required('This field is required'),
        cin: yup.string().required('This field is required'),
        email: yup.string().email('Enter a valid email')
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
    
            axios.post(`http://localhost:8000/api/customer/new`, values, config)
                .then(async (response) => {
                    console.log(response);
                    notifySuccessAdd(response.data.id_customer)
                    navigate('/my-account/customers')
                })
                .catch((error) => {
                    console.error(error)
                })
        },
        onReset: () => {
            console.log('reset');
        }
    })

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
                        New Customer
                    </Typography>
                    <Box >
                        <form onSubmit={formik.handleSubmit}>
                            <Box
                                sx={{
                                    width: '800px',
                                    margin: 'auto',
                                    marginTop: 10,
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 5
                                }}
                            >
                                <TextField 
                                    name='nom'
                                    required
                                    label="Last name"
                                    value={formik.values.nom}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.nom && Boolean(formik.errors.nom) }
                                    helperText={formik.touched.nom && formik.errors.nom}
                                    fullWidth
                                    variant='filled'
                                />
                                <TextField 
                                    name='prenoms'
                                    label="First name"
                                    value={formik.values.prenoms}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.prenoms && Boolean(formik.errors.prenoms) }
                                    helperText={formik.touched.prenoms && formik.errors.prenoms}
                                    fullWidth
                                    variant='filled'
                                />
                                <TextField 
                                    name='telephone'
                                    required
                                    label="Phone"
                                    value={formik.values.telephone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.telephone && Boolean(formik.errors.telephone) }
                                    helperText={formik.touched.telephone && formik.errors.telephone}
                                    fullWidth
                                    variant='filled'
                                />
                                <TextField 
                                    name='cin'
                                    required
                                    label="CIN"
                                    value={formik.values.cin}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.cin && Boolean(formik.errors.cin) }
                                    helperText={formik.touched.cin && formik.errors.cin}
                                    fullWidth
                                    variant='filled'
                                />
                                <TextField 
                                    name='email'
                                    required
                                    label="Email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.email && Boolean(formik.errors.email) }
                                    helperText={formik.touched.email && formik.errors.email}
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

export default AddClients;
