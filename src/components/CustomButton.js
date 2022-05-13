import {Stack, Button } from "@mui/material"
export const CustomButton = (worker) => {

    function handleClick(id, action){
        alert("Worker: " + id + ", Action: " + action)
        fetch(`https://the.mturk.monster:50000/api/eval_all_s1_by/${id}/${action}`, { method: 'POST' });
        console.log("api worked?")
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Stack spacing={4}>
                <Stack spacing={2} direction='row'>
                    <Button variant='contained' color='success' onClick={() => handleClick(worker.id, "good")}>Approve all HITs by worker good</Button>
                    <Button variant='contained' color='error' onClick={() => handleClick(worker.id, "bad")}>Reject all HITs by worker bad</Button>
                </Stack>
            </Stack>
        </div>
    )
}