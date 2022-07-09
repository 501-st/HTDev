import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const noteSlice = createSlice({
    name: "note",
    initialState: {
        notes: [],
        count: 0,
        timeZones: [],
        isFetching: false
    },
    reducers: {
        addNote(state, action){
            state.count++
            action.payload = {...action.payload, index: state.count}
            state.notes.push(action.payload)
        },
        addTimeZones(state, action){
            state.timeZones = action.payload
        },
        startFetching(state){
            state.isFetching = true
        },
        stopFetching(state){
            state.isFetching = false
        }
    }
})

export default noteSlice.reducer
export const {addNote, addTimeZones, startFetching, stopFetching} = noteSlice.actions