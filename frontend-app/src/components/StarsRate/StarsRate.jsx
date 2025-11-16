import * as React from 'react';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#2A8B8F',
    },
});

export function ReadOnlyStarsRate({ rate }) {


    return (
        <Box sx={{ '& > legend': { mt: 2 } }}>
            <StyledRating 
                name="half-rating" 
                value={rate} 
                precision={0.5} 
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarBorderOutlinedIcon fontSize="inherit" />}
                readOnly/>
        </Box>
    );
}

export function StarsRate({ onChange, disabled = false, initialValue = 0 }) {
    return (
        <Box sx={{ '& > legend': { mt: 2 } }}>
            <StyledRating 
                name="half-rating" 
                defaultValue={initialValue} 
                precision={0.5} 
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarBorderOutlinedIcon fontSize="inherit" />}
                onChange={onChange} 
                disabled={disabled}
                />
        </Box>
    );
}