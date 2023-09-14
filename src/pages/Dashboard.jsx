import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import MyContainer from '../components/container/MyContainer';
import axios from 'axios';
import { Box, Typography, Card } from '@mui/material';
import { Person2, Home, Bookmark, House } from '@mui/icons-material';
import { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
      name: 'Page A',
      uv: 4000,
    },
    {
      name: 'Page B',
      uv: 3000,
    },
    {
      name: 'Page C',
      uv: 2000,
    },
    {
      name: 'Page D',
      uv: 2780,
    },
    {
      name: 'Page E',
      uv: 1890,
    },
    {
      name: 'Page F',
      uv: 2390,
    },
    {
      name: 'Page G',
      uv: 3490,
    },
  ];

const Dashboard = () => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector(state => state.auth)

    if (userInfo === null) {
        return <Navigate replace to={'/login'} />
    }
    const [customer, setCustomer] = React.useState(0)
    const [room, setRoom] = React.useState(0)
    const [reservation, setReservation] = React.useState(0)
    const [roomOcupied, setRoomOcupied] = React.useState(0)
    const [tarif, setTarif] = React.useState([])

    React.useEffect(() => {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }

        axios.get(`http://localhost:8000/api/data/data/collection/customer-money`, config)
            .then((response) => {
                console.log(response);
                setTarif(response.data)
            })
            .catch((error) => {
                console.error(error)
            })
        axios.get(`http://localhost:8000/api/data/data/collection/free-room`, config)
            .then((response) => {
                console.log(response);
                setCustomer(response.data.customers)
                setRoom(response.data.rooms)
                setReservation(response.data.bookings)
                setRoomOcupied(response.data.rooms_ocupied)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        <MyContainer>
            <Box
                sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    gap: 4
                }}
            >
                <Card square elevation={4}
                    sx={{
                        padding: 4,
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        position: 'relative'
                    }}
                >
                    <Person2 
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: '25px',
                            left: '0px',
                            color: 'rgba(0, 0, 0, 0.2)'
                        }}
                    />
                    <Typography variant='h4'>
                        Customers total 
                    </Typography><br />
                    <Typography variant='h2' sx={{fontWeight: 'bold', textAlign: 'center', zIndex: 1000}}>{customer}</Typography>
                </Card>
                <Card square elevation={4}
                    sx={{
                        padding: 4,
                        backgroundColor: 'primary.light',
                        color: 'white',
                        position: 'relative'
                    }}
                >
                    <Home 
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: '25px',
                            left: '0px',
                            color: 'rgba(0, 0, 0, 0.2)'
                        }}
                    />
                    <Typography variant='h4'>
                        Rooms total 
                    </Typography><br />
                    <Typography variant='h2' sx={{fontWeight: 'bold', textAlign: 'center', zIndex: 1000}}>{room}</Typography>
                </Card>
                <Card square elevation={4}
                    sx={{
                        padding: 4,
                        backgroundColor: 'secondary.dark',
                        color: 'white',
                        position: 'relative'
                    }}
                >
                    <Bookmark 
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: '25px',
                            left: '0px',
                            color: 'rgba(0, 0, 0, 0.2)'
                        }}
                    />
                    <Typography variant='h4'>
                        Reservations total 
                    </Typography><br />
                    <Typography variant='h2' sx={{fontWeight: 'bold', textAlign: 'center', zIndex: 1000}}>{reservation}</Typography>
                </Card>
                <Card square elevation={4}
                    sx={{
                        padding: 4,
                        backgroundColor: 'primary.dark',
                        color: 'white',
                        position: 'relative'
                    }}
                >
                    <House 
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: '25px',
                            left: '0px',
                            color: 'rgba(0, 0, 0, 0.2)'
                        }}
                    />
                    <Typography variant='h4'>
                        Rooms ocupied 
                    </Typography><br />
                    <Typography variant='h2' sx={{fontWeight: 'bold', textAlign: 'center', zIndex: 1000}}>{roomOcupied}</Typography>
                </Card>

            </Box>
            <Box
                sx={{
                    width: '100%',
                    height: '400px',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    marginTop: 6
                }}
            >
                <Card elevation={4} square>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        width={500}
                        height={300}
                        data={tarif}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cutomer" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                            <Bar dataKey="tarif" fill="#007788" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

            </Box>
        </MyContainer>
    );
}

export default Dashboard;
