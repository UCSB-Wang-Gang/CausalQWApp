import {Stack, Button } from "@mui/material"
export const CustomButton = (worker) => {

    function handleClick(id, action){
        alert("Worker: " + id + ", Action: " + action)
        fetch(`https://the.mturk.monster:50000/api/eval_all_s1_by/${id}/${action}`, { method: 'POST' });
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Stack spacing={4}>
                <Stack spacing={2} direction='row'>
                    <Button variant='contained' color='success' onClick={() => handleClick(worker.id, "good")}>Mark all good</Button>
                    <Button variant='contained' color='error' onClick={() => handleClick(worker.id, "bad")}>Mark all bad</Button>
                </Stack>
            </Stack>
        </div>
    )
}