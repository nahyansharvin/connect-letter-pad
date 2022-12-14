import React, { useState } from 'react'
import './AddBody.css'

import axios from 'axios';
import download from 'downloadjs';

//Custom Components
import TextInput from '../../components/textinput/TextInput'
import SelectInput from '../../components/textinput/SelectInput'

//Material UI
import { TextField, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import PrintIcon from '@mui/icons-material/Print';
//Date Picker
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

//Menu Items
const recipients = ["Principal", "HOD", "Others"];
const departments = [
    "Dept. of Computer Science",
    "Dept. of Commerce",
    "Dept. of BBA",
    "Dept. of Biotechnology",
    "Dept. of Biochemistry",
    "Dept. of Microbiology",
    "Dept. of English",
    "Dept. of Economics",
    "Dept. of Maths & Physics",
    "Dept. of B.Voc",
    "Dept. of West Asian Studies",
]
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function AddBody() {
    //States
    const [recipient, setRecipient] = useState("Principal")
    const [department, setDepartment] = useState("Dept. of Computer Science")
    const [toAddress, setToAddress] = useState()
    const [date, setDate] = useState(new Date())
    const [subject, setSubject] = useState()
    const [body, setBody] = useState()
    const [loading, setLoading] = useState(false)

    //To structure Date
    const getDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };


    //To get Day from Date
    const getDay = (dateStr) => {
        const date = new Date(dateStr);
        return days[date.getDay()];
    };

    //Ser error in empty fields
    const errorSetter = () => {
        if (!date) setDate("")
        if (!toAddress) setToAddress("")
        if (!subject) setSubject("")
        if (!body) setBody("")
    }

    const handlePrintButton = () => {
        if (!date || !subject || !body || (recipient === "Others" && !toAddress)) {
            errorSetter();
        } else {
            setLoading(true);
            // Structure Data
            let data = JSON.stringify({
                recipient,
                designation: recipient === "Principal" ? "The Principal" : "Head of Department",
                department,
                toAddress,
                date: getDate(date),
                day: getDay(date),
                subject,
                body
            });
            // Send Data to Server
            (async () => {
                try {
                    const headers = { 'Content-Type': 'application/json' };
                    const response = await axios.post('https://connect-letterpad.herokuapp.com/api/', data, { headers, responseType: 'blob' })
                    download(response.data, 'letter.pdf');
                } catch (error) {
                    alert("Something went wrong\n" + error.message);
                }
                setLoading(false);
            })();



        }
    }

    return (
        <div className='body-container'>
            <h3>Letter Pad</h3>
            <div className='body-form'>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <SelectInput
                            label="Recipient of letter"
                            menuItems={recipients}
                            dropdownValue={recipient}
                            setDropdownValue={setRecipient}
                        />
                    </Grid>
                    {recipient === "HOD" && (
                        <Grid item xs={12}>
                            <SelectInput
                                label="Department"
                                menuItems={departments}
                                dropdownValue={department}
                                setDropdownValue={setDepartment}
                            />
                        </Grid>
                    )}
                    {recipient === "Others" && (
                        <Grid item xs={12}>
                            <TextInput
                                multiline
                                rows="3"
                                label="To Address"
                                value={toAddress}
                                setValue={setToAddress}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date"
                                value={date}
                                inputFormat="dd/MM/yyyy"
                                onChange={(newValue) => {
                                    setDate(newValue);
                                }}
                                disablePast
                                renderInput={(params) => <TextField fullWidth id='outlined-basic'
                                    variant='outlined'
                                    margin="none" {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextInput multiline label="Subject" value={subject} setValue={setSubject} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextInput multiline rows="12" label="Letter Body" value={body} setValue={setBody} />
                    </Grid>
                    <Grid item xs={12}>
                        <LoadingButton
                            fullWidth
                            onClick={handlePrintButton}
                            endIcon={<PrintIcon />}
                            loading={loading}
                            loadingPosition="end"
                            variant="contained"
                        >
                            Print
                        </LoadingButton>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default AddBody