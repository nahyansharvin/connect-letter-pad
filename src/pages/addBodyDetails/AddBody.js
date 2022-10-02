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
                const headers = { 'Content-Type': 'application/json' };
                await axios.post(' http://127.0.0.1:8000/api/', data, { headers, responseType: 'blob' })
                    .then((response) => {
                        download(response.data, 'letter.pdf');
                    })
                    .catch((error) => {
                        // Error
                        if (error.response) {
                            // The request was made and the server responded with a status code that falls out of the range of 2xx
                            alert("Internal Server Error \nError code: " + error.response.status);
                        } else if (error.request) {
                            // The request was made but no response was received
                            alert("Server did not respond");
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            alert("Something went wrong\n" + error.message);
                        }
                    });
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