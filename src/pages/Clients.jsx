import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import MyContainer from '../components/container/MyContainer';
import Box from '@mui/material/Box';
import HeadPage from '../components/HeadPage';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

const Clients = () => {
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
    
    let initialState = {
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
        initialValues: initialState,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log('values', values);

            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            }
    
            axios.put(`http://localhost:8000/api/customer/edit/${selectId}`, values,config)
                .then(async (response) => {
                    console.log(response);
                    setOpenEdit(false)
                    formik.handleReset()
                    await setRefresh(state => state + 1)
                    setTimeout(() => {
                        notifySuccessFullEdited()
                    }, 500)
                })
                .catch((error) => {
                    console.error(error)
                })
            console.log("rerrrr");
        },
        onReset: () => {
            console.log('reset');
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
                response.data.map(element => {
                    tempData.push({id: element.id_customer, firstname: capitalizeFont(element.prenoms), lastname: element.nom.toUpperCase(), cin: element.cin, email: element.email, phone: element.telephone})
                    console.log(element.id_customer);
                });
                await setAllData(tempData);
                notifySuccessFullDelete
                console.log(allData);
            })
            .catch((error) => {
                console.error(error)
            })
        console.log("rerrrr");
    }, [refresh])

    if (userInfo === null) {
        return <Navigate replace to={'/login'} />
    }

    const renderActions = (params) => {
        const handleDeleteClient = () => {
            setSelectId(params.id)
            setOpenCofirm(true)
        }
        const handleEditClient = () => {
            setOpenEdit(true);
            setSelectId(params.id)
            // initialState = {
            //     nom: params.row.lastname,
            //     prenoms: params.row.firstname,
            //     telephone: params.row.phone,
            //     cin: params.row.cin,
            //     email: params.row.email,
            // }
            formik.initialValues.nom = params.row.lastname
            formik.initialValues.prenoms = params.row.firstname
            formik.initialValues.telephone = params.row.phone
            formik.initialValues.cin = params.row.cin
            formik.initialValues.email = params.row.email
            console.log('edit', params)
        }
        const handleDetailClient = () => {
            console.log('detail', params);
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

    // delete
    const handleDelete = (id) => {
        console.log(id);
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }

        axios.delete(`http://localhost:8000/api/customer/delete/${id}`, config)
            .then(async (response) => {
                console.log(response);
                await setRefresh(state => state + 1)
                setTimeout(() => {
                    notifySuccessFullDelete()
                }, 700)
            })
            .catch((error) => {
                console.error(error)
            })
        
        setOpenCofirm(false)
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'firstname',
          headerName: 'First name',
          flex: 1,
        },
        {
          field: 'lastname',
          headerName: 'Last name',
          flex: 1,
        },
        {
          field: 'phone',
          headerName: 'Phone number',
          flex: 1,
        },
        {
          field: 'cin',
          headerName: 'CIN',
          flex: 1,
        },
        {
          field: 'email',
          headerName: 'E-mail',
          flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: renderActions,
        },
    ];

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
                    formik.handleReset() 
                }}
                title={`Edit customer ID: ${selectId} `}
                handleEdit={() => formik.handleSubmit}
            >
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
                        />
                        <Button variant='contained' onClick={formik.handleSubmit}>Save</Button>
                    </Box>
                </form>
            </FullDialog>

            <HeadPage 
                title={'Customers'}
                btnText={'Add new customer'}
                linkNew={'/my-account/customers/new'}
                colorTitle={'black.main'}
                btnIcon={<PersonAddIcon />}
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

export default Clients;
