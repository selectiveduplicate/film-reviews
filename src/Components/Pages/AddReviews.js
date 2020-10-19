import React, { useState } from 'react';
import { 
    gql, 
    useMutation, 
    useQuery 
} from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Container  from "@material-ui/core/Container";
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

const CHECK_USERNAME = gql`
    query($username: String!) {
        getUser(username: $username) {
            username
        }
    }
`;

const ADD_REVIEW = gql`
    mutation($review: AddReviewInput!) {
        addReview(input: [$review]) {
            review {
                text
                rating
                posted_by {
                    username
                }
                reviewed_film
            }
        }
    }
`;

const ADD_USER_AND_REVIEW = gql`
    mutation($username: AddUserInput!, $review: AddReviewInput!) {
        addUser(input: [$username]) {
            user {
                username
                posted_reviews {
                    text
                }
            }
        }
        addReview(input: [$review]) {
            review {
                text
                rating
                posted_by {
                    username
                }
                reviewed_film
            }
        }
    }
`;

const getContainerStyle = {
    marginTop: '5rem',
    marginBottom: '5rem'
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
    const [ userRating, setUserRating ] = useState(0);

    // to be used to check if the username exists
    const { loading, error, data } = useQuery(CHECK_USERNAME, {
        variables: { username: userName }
    });
    const [ addUserAndReview ] = useMutation(ADD_USER_AND_REVIEW);
    const [ addReview ] = useMutation(ADD_REVIEW);

    // event handlers
    const handleReviewChange = (event) => setReviewText(event.target.value);
    const handleNameChange = (event) => setUserName(event.target.value);
    const handleRatingChange = (event) => setUserRating(event.target.value * 1)
    const handleSubmit = (event) => {
        event.preventDefault();
        // we add user only if the username doesn't already exist
        if (data.getUser === null) {
            addUserAndReview({
                variables: {
                    username: {
                        username: userName,
                        posted_reviews: []
                    },
                    review: {
                        text: reviewText,
                        rating: userRating,
                        posted_by: {
                            username: userName
                        },
                        reviewed_film: moviename.split("-").join(" ")
                    }
                }
            })
        } else {
            addReview({
                variables: {
                    review: {
                        text: reviewText,
                        rating: userRating,
                        posted_by: {
                            username: userName
                        },
                        reviewed_film: moviename.split("-").join(" ")
                    }
                }
            })
        }
        // TODO: timeout could be removed
        setTimeout(() => window.location.pathname = "/", 1000);
    }

    return (
        <Container maxWidth="xs" style={ getContainerStyle }>
            <Typography variant="h4" style={{ marginBottom: 20 }}>
                Write your review of { moviename.split("-").join(" ") }
            </Typography>
            <form className={ styleClass.root } noValidate autoComplete="off" onSubmit={ handleSubmit }>
                <div>
                    <TextField label="Username" required value={ userName } onChange={ handleNameChange } />
                    <div className="rating-input">
                        <FormLabel component="legend" required>Rating</FormLabel>
                        <RadioGroup aria-label="movie-rating" name="rating" value={ userRating.toString() } onChange={ handleRatingChange }>
                            <FormControlLabel value="1" control={<Radio />} label="1" />
                            <FormControlLabel value="2" control={<Radio />} label="2" />
                            <FormControlLabel value="3" control={<Radio />} label="3" />
                            <FormControlLabel value="4" control={<Radio />} label="4" />
                            <FormControlLabel value="5" control={<Radio />} label="5" />
                        </RadioGroup>
                    </div>
                    <TextareaAutosize 
                    id="review-textarea"
                    required
                    aria-label="review-text"
                    rowsMin={10}
                    placeholder="Review..."
                    onChange={ handleReviewChange }
                    />
                    {/* <TextField
                    id="standard-multiline-flexible"
                    label="Type in your review"
                    required
                    multiline
                    rows={ 3 }
                    size="medium"
                    value={ reviewText }
                    onChange={ handleReviewChange }
                    style={{ marginTop: 20 }}
                    /> */}
                </div>
                <div>
                    <Button 
                    type="submit" 
                    variant="contained" 
                    /* onClick={ handleSubmit } */ 
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