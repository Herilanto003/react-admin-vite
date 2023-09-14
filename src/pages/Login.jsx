import { 
    TextField, 
    Typography, 
    Box, 
    Paper,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business';
import LoginIcon from '@mui/icons-material/Login';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux';
import { userLogin } from '../features/auth/authActions';
import { toast } from 'react-toastify'
import { useEffect } from 'react';
 
const Login = () => {
    // selector from reduxjs/toolkit
    const { userToken, userInfo, error, isConnected } = useSelector(state => state.auth)

    useEffect(() => {
        if(error !== null) {
            notifyError();
        } 

        if(isConnected) {
            notifySuccess()
        }
    }, [ error, isConnected ])

    const notifyError = () => toast.error("Check your email and your password !", {theme: 'colored'});
    const notifySuccess = () => toast.success("connection succefull !", {theme: 'colored'});
    const dispatch = useDispatch()
    const [showPass, setShowPass] = useState(false)
    const initialValues = {
        email: '',
        password: ''
    }
    const validationSchema = yup.object({
        email: yup.string().required('Email is required').email('Enter an email valid'),
        password: yup.string().required('Password is required')
    })
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await dispatch(userLogin(values))
        },
        onReset: () => {
            console.log('form reseted');
        }
    })

    
    if (userInfo !== null)
    {
        return <Navigate replace to={'/my-account'} />
    }


    return (
        <Box 
            sx={styles.loginContainer}
        >
            <Box
                sx={styles.loginChild}
            >
                <Paper 
                    square 
                    sx={styles.loginPaper} 
                    elevation={4}
                >
                    <Box
                        sx={{
                            marginBottom: 0,
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            color: 'white'
                        }}
                    >
                        <BusinessIcon 
                            sx={{
                                fontSize: '50px'
                            }}
                        />
                        <Typography>
                            My Hotel
                        </Typography>                        
                    </Box>
                    <Box>
                        <Typography 
                            variant='h3' 
                            textAlign={'center'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            gap={2}
                        ><LoginIcon 
                            sx={{
                                fontSize: '50px'
                            }}
                        /> Login</Typography>

                        <form onSubmit={formik.handleSubmit}>
                            <Box 
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    gap: 2,
                                    padding: '20px'
                                }}
                            >
                                <TextField 
                                    type='text'
                                    name='email'
                                    label='Your email'
                                    variant='filled'
                                    fullWidth
                                    required
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={ formik.touched.email && Boolean(formik.errors.email) }
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                                <Box width={'100%'}>
                                    <TextField 
                                        name='password'
                                        type={ showPass ? 'text' : 'password' }
                                        label='Your password'
                                        variant='filled'
                                        fullWidth
                                        required
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={ formik.touched.password && Boolean(formik.errors.password) }
                                        helperText={formik.touched.password && formik.errors.password}
                                    />
                                    <FormGroup>
                                        <FormControlLabel 
                                            control={<Checkbox onChange={(e)=>setShowPass(e.target.checked)} />}
                                            label='show password'
                                        />
                                    </FormGroup>
                                </Box>
                                
                                <Button variant='contained' fullWidth onClick={formik.handleSubmit}>Log in</Button>
                            </Box>
                        </form>
                    </Box>

                    <Box>
                        <Typography variant='body2' p={2}>
                            <Link to={'/home'}>Go back home</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box> 
    );
}

/** @type {import('@mui/material').SxProps} */
const styles = {
    loginContainer: {
        width: '100%',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginChild: {
        width: '400px',
        height: '500px',
        position: 'relative'
    },
    loginPaper: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
}

export default Login;
