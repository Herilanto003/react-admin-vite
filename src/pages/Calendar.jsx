import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import MyContainer from '../components/container/MyContainer';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import axios from 'axios'

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}

const Calendar = () => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector(state => state.auth)
    const [allData, setAllData] = React.useState([])
    const tempData = []

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

        axios.get(`http://localhost:8000/api/booking/calendar`, config)
            .then((response) => {
                console.log(response);
                setAllData(response.data);
                console.log(allData);
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        <MyContainer>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                eventContent={renderEventContent}
                initialView="dayGridMonth"
                events={ allData }
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek' // user can switch between the two
                }}
            />
        </MyContainer>
    );
}

export default Calendar;
