import axios from "axios";
import {addNote, addTimeZones, startFetching, stopFetching} from "../store/slice";

export const fetchZones = () => {
    return async (dispatch) => {
        try {
            dispatch(startFetching())
            const res = await axios.get("https://worldtimeapi.org/api/timezone")
            dispatch(addTimeZones(res.data.slice(0, 10)))
            dispatch(stopFetching())
        }catch (e) {
            console.log(e)
        }
    }
}

export const fetchTime = (text, signature, city, setResult) => {
    return async (dispatch) => {
        try {
            dispatch(startFetching())
            const res = await axios.get(`https://worldtimeapi.org/api/timezone/${city}`)
            dispatch(addNote({
                text, signature, tz: city, date: res.data.datetime
            }))
            setResult("success")
            dispatch(stopFetching())
            setTimeout(() => {
                setResult("")
            }, 800)
        }catch (e) {
            dispatch(stopFetching())
            setResult("error")
            setTimeout(() => {
                setResult("")
            }, 800)
            console.log(e)
        }
    }
}