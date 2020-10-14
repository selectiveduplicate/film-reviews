import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Container  from "@material-ui/core/Container";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

const getContainerStyle = {
    marginTop: '5rem'
};

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 200,
      },
    },
}));

function AddReviews() {
    // get the movie name from URL params
    var { moviename } = useParams();
    const styleClass = useStyles();
    const [ reviewText, setReviewText ] = useState("");
    const [ userName, setUserName ] = useState("");

    const handleReviewChange = (event) => setReviewText(event.target.value);
    const handleNameChange = (event) => setUserName(event.target.value);
    // it's gotta handle much more than this!
    const handleSubmit = (event) => event.preventDefault();

    return (
        <Container maxWidth="xs" style={ getContainerStyle }>
            {/* testing if it works  */}
            <h1>The movie name is { moviename }</h1>
            <form className={ styleClass.root } noValidate autoComplete="off">
                <div>
                    <TextField label="Name" value={ userName } onChange={ handleNameChange } />
                    <TextField
                    variant="outlined"
                    id="standard-multiline-flexible"
                    label="Type in your review"
                    multiline
                    rowsMax={ 10 }
                    value={ reviewText }
                    onChange={ handleReviewChange }
                    style={{ marginTop: 20 }}
                    />
                </div>
                <div>
                    <Button 
                    type="submit" 
                    variant="contained" 
                    onClick={ handleSubmit } 
                    color="primary" 
                    style={{ marginTop: 20 }}>
                        Submit
                    </Button>
                </div>
            </form>
        </Container>
    )
};

export default AddReviews;