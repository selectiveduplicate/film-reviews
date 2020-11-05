import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

const CHECK_FILM_ID = gql`
  query($id: String!) {
    getFilmData(id: $id) {
      id
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
        reviewed_film {
          id
          data {
            name
            id
          }
        }
      }
    }
  }
`;

const ADD_FILMDATA_AND_REVIEW = gql`
  mutation($filmData: [AddFilmDataInput!]!, $review: AddReviewInput!) {
    addFilmData(input: $filmData) {
      filmData {
        id
        data {
          name
          id
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
        reviewed_film {
          id
          data {
            name
            id
          }
        }
      }
    }
  }
`;

const getContainerStyle = {
  marginTop: "5rem",
  marginBottom: "5rem",
};

const getPageHeaderStyle = {
  marginTop: "5rem",
  textAlign: "center",
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

function AddReviews() {
  // get the movie ID and name from URL params
  let { movieid, moviename } = useParams();
  let movieName = moviename.split("-").join(" ");

  const styleClass = useStyles();
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const [userRating, setUserRating] = useState(0);

  const { loading, error, data } = useQuery(CHECK_FILM_ID, {
    variables: { id: movieid },
  });

  const [addFilmDataAndReview] = useMutation(ADD_FILMDATA_AND_REVIEW);
  const [addReview] = useMutation(ADD_REVIEW);

  // event handlers
  const handleReviewChange = (event) => setReviewText(event.target.value);
  const handleNameChange = (event) => setUserName(event.target.value);
  const handleRatingChange = (event) => setUserRating(event.target.value * 1);
  const handleSubmit = (event) => {
    event.preventDefault();
    // we add filmData only if that film doesn't already exist
    if (data.getFilmData === null) {
      addFilmDataAndReview({
        variables: {
          filmData: [
            {
              id: movieid,
            },
          ],
          review: {
            text: reviewText,
            rating: userRating,
            posted_by: {
              username: userName,
            },
            reviewed_film: {
              id: movieid,
            },
          },
        },
      });
    } else {
      addReview({
        variables: {
          review: {
            text: reviewText,
            rating: userRating,
            posted_by: {
              username: userName,
            },
            reviewed_film: {
              id: movieid,
            },
          },
        },
      });
    }
    // TODO: timeout could be removed
    setTimeout(() => (window.location.pathname = "/"), 1000);
  };

  return (
    <div className="container">
      <Typography variant="h4" style={getPageHeaderStyle}>
        Write your review of <em>{movieName}</em>
      </Typography>
      <Container maxWidth="xs" style={getContainerStyle}>
        <form
          className={styleClass.root}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div>
            <TextField
              label="Username"
              required
              value={userName}
              onChange={handleNameChange}
            />
            <div className="rating-input">
              <FormLabel component="legend" required>
                Rating
              </FormLabel>
              <RadioGroup
                aria-label="movie-rating"
                name="rating"
                value={userRating.toString()}
                onChange={handleRatingChange}
              >
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
              onChange={handleReviewChange}
            />
          </div>
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              Submit
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default AddReviews;
