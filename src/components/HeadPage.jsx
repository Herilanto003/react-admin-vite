import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeadPage = ({ title, btnIcon, btnText, colorTitle, linkNew }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '50px',
            }}
            >
            <Paper elevation={3} square sx={{ position: 'absolute', width: '100%', height: '100%', top: 0, right: 0 }} />
            <Box
                sx={{
                    width: "100%",
                    height: '100%',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    top: 0,
                    left: 0,
                    padding: '0 20px'
                }}
            >
                <Typography 
                    sx={{
                        flexGrow: '1',
                        color: {colorTitle},
                        fontWeight: 'bold'
                    }}
                    variant='h4'
                >{title}</Typography>
                <Button variant='contained' onClick={() => navigate(linkNew)} sx={{ display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center' }}> {btnIcon} {btnText} </Button>
            </Box>
        </Box>
    );
}

export default HeadPage;
