import React, { useState } from 'react'
import './AddBody.css'

//Custom Components
import TextInput from '../../components/textinput/TextInput'

//Material UI
import { TextField, Button, Grid } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
//Date Picker
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function AddBody() {
    //States
    const [date, setDate] = useState(new Date())
    const [subject, setSubject] = useState()
    const [body, setBody] = useState()

    //To structure Date
    const getDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    //To get Day from Date
    const getDay = (dateStr) => {
        const date = new Date(dateStr);
        let dayint = `${date.getDay()}`;
        let day = "";
        switch (dayint) {
            case "0":
                day = "Sunday";
                break;
            case "1":
                day = "Monday";
                break;
            case "2":
                day = "Tuesday";
                break;
            case "3":
                day = "Wednesday";
                break;
            case "4":
                day = "Thursday";
                break;
            case "5":
                day = "Friday";
                break;
            case "6":
                day = "Saturday";
                break;
            default:
                day = "Invalid Day";
                break;
        }
        return day;
    };

    //Ser error in empty fields
    const errorSetter = () => {
        if (!date) setDate("")
        if (!subject) setSubject("")
        if (!body) setBody("")
    }

    const handlePrintButton = () => {
        if (!date || !subject || !body) {
            errorSetter();
        } else {
            let data = JSON.stringify({ date: getDate(date), day: getDay(date), subject, body });
            console.log(data)
            // const requestOptions = {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: data
            // };
            // fetch('http://127.0.0.1:8000/pdf/', requestOptions)
            //     .then(response => response.json())
        }
    }

    return (
        <div className='body-container'>
            <h3>Letter Pad</h3>
            <div className='body-form'>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date"
                                value={date}
                                inputFormat="dd/MM/yyyy"
                                onChange={(newValue) => {
                                    setDate(newValue);
                                }}
                                disableFuture
                                renderInput={(params) => <TextField fullWidth id='outlined-basic'
                                    variant='outlined'
                                    margin="none" {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextInput label="Subject" value={subject} setValue={setSubject} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextInput multiline rows="15" label="Letter Body" value={body} setValue={setBody} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth size="large" variant="contained" endIcon={<PrintIcon />} sx={{ letterSpacing: "2px" }} onClick={handlePrintButton} >Print</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default AddBody