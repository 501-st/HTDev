import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import {useEffect, useState} from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import "./index.css"
import {
    Alert,
    FormControl,
    InputLabel,
    MenuItem, Pagination,
    Paper,
    Select,
    Stack,
    TextField
} from "@mui/material";
import {Date, Sign, Text, Title} from "./ui/constants";
import {useDispatch, useSelector} from "react-redux";
import {Col, Row} from "react-grid-system";
import {fetchTime, fetchZones} from "./api";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function App() {

    const [pagination, setPagination] = useState(+localStorage.getItem("pagination") || 10)

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [page, setPage] = useState(1);
    const changePage = (event, value) => {
        setPage(value)
    }

    const dispatch = useDispatch()
    const notes = useSelector(state => state.notes.notes)
    let notesToRender
    if (page === 1) {
        notesToRender = notes.slice(page - 1, page * pagination)
    } else {
        notesToRender = notes.slice(page * pagination - pagination, page * pagination)
    }

    const zones = useSelector(state => state.notes.timeZones)
    const isFetching = useSelector(state => state.notes.isFetching)

    const [text, setText] = useState("")
    const [signature, setSignature] = useState(localStorage.getItem("signature") || "")
    const [city, setCity] = useState(localStorage.getItem("city") || "");
    const [validation, setValidation] = useState("")
    const [result, setResult] = useState("")

    const handleSubmit = () => {
        if (text === "") {
            setValidation("Заполните текст записи")
            return false
        }
        if (signature === "") {
            setValidation("Распишитесь пожалуйста")
            return false
        }
        if (city === "") {
            setValidation("Выберите город из списка")
            return false
        }
        dispatch(fetchTime(text, signature, city, setResult))
        setText("")
    }

    useEffect(() => {
        dispatch(fetchZones())
    }, [])

    const changePagination = (e) => {
        if (+e.target.value < 1) {
            setPagination(1)
            localStorage.setItem("pagination", String(1))
        } else {
            setPagination(+e.target.value)
            localStorage.setItem("pagination", e.target.value)
        }
        setPage(1)
    }

    return (
        <>
            <Box sx={{maxWidth: "900px", margin: "30px auto 0"}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Создать запись"/>
                        <Tab label="Записи"/>
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <TextField fullWidth label="Запись" multiline rows={7} sx={{marginBottom: "30px"}} value={text}
                               onChange={(e) => {
                                   setText(e.target.value);
                                   setValidation("")
                               }}
                    />
                    <Box sx={{display: "flex", flexDirection: "row", columnGap: "30px", marginBottom: "30px"}}>
                        <TextField fullWidth label="Подпись" multiline rows={1} value={signature}
                                   inputProps={{maxLength: 100}}
                                   onChange={(e) => {
                                       setSignature(e.target.value);
                                       setValidation("")
                                       localStorage.setItem("signature", e.target.value)
                                   }}
                        />
                        <Box width={250}>
                            <FormControl fullWidth>
                                <InputLabel>Точное время по:</InputLabel>
                                <Select value={city} label="Точное время по:"
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                            setValidation("")
                                            localStorage.setItem("city", e.target.value)
                                        }}
                                >
                                    {zones.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                    <Stack sx={{marginBottom: "30px"}} alignItems={"end"}>
                        <LoadingButton loading={isFetching} disabled={isFetching} onClick={handleSubmit}
                                       sx={{width: "150px"}} variant="contained" endIcon={<SendIcon/>}>
                            Создать
                        </LoadingButton>
                    </Stack>
                    {validation !== "" && <Text style={{color: "red", textAlign: "center"}}>{validation}</Text>}
                    {result === "success" &&
                    <Box>
                        <Alert variant="outlined" severity="success">
                            Запись создана
                        </Alert>
                    </Box>}
                    {result === "error" &&
                    <Box>
                        <Alert variant="outlined" severity="error">
                            Произошла ошибка
                        </Alert>
                    </Box>}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Row>
                        {notesToRender.map((item, index) => (
                            <Col key={index} md={6} style={{marginBottom: "30px"}}>
                                <Paper sx={{padding: "20px"}} variant="outlined">
                                    <Sign>
                                        {item.signature}
                                    </Sign>
                                    <Title>
                                        Запись №{item.index}
                                    </Title>
                                    <Date>
                                        {item.date}
                                    </Date>
                                    <Text>
                                        {item.text}
                                    </Text>
                                </Paper>
                            </Col>
                        ))}
                    </Row>
                    {notes.length !== 0
                        ? <>
                            <Stack justifyContent={"center"} spacing={2}>
                                <Pagination page={page} onChange={changePage} showFirstButton showLastButton
                                            color="primary"
                                            count={Math.ceil((notes.length / pagination))}/>
                            </Stack>
                            <TextField inputProps={{min: 1}} type={"number"} value={pagination} sx={{marginTop: "30px"}}
                                       label="Кол-во записок на страницу"
                                       onChange={changePagination}/>
                        </>
                        : <Text>
                            Записей еще нет
                        </Text>}
                </TabPanel>
            </Box>
        </>
    );
}