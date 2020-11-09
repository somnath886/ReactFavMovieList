import React, { useState, useContext } from 'react'
import { Card, Button, Grid } from "semantic-ui-react"
import gql from "graphql-tag"
import { useMutation } from "@apollo/react-hooks"

import { REACT_APP_TMDB_KEY } from "../config"
import { AuthContext } from "../context/auth"

function Home() {

    const { user } = useContext(AuthContext)

    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [errors, setErrors] = useState("")

    const [values, setValues] = useState({
        title: "",
        image: ""
    }) 

    const [addtoList, { error }] = useMutation(ADD_TO_LIST, {
        variables: values,
        update(_, result) {
            console.log(result)
            values.title = ""
            values.image = ""
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.stacktrace[0])
        }
        
    })

    function submitCallback() {
        addtoList()
    }

    const onChange = (e) => {
        e.preventDefault()
        setQuery(e.target.value)
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${REACT_APP_TMDB_KEY}&language=en-US&page=1&include_adult=false&query=${e.target.value}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (!data.errors) {
                setResults(data.results)
            } else {
                setResults([])
            }
        })
    }


    return (
            <div className="row">
                <div 
                    className="column">
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={query}
                        onChange={onChange}
                    />
                </div>                       
                { results.length > 0 && (
                            <ul className="results">
                                { results.map(movie => (
                                    <li key={movie.id}>
                                        <Card>
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                alt={`${movie.title} Poster`}
                                            />
                                            <Card.Content>
                                                <Card.Header>{movie.title}</Card.Header>
                                            </Card.Content>
                                        </Card>
                                        { user && (
                                            <div className="container">
                                                <Button
                                                    onClick={() => {
                                                        setValues({
                                                            title: movie.title,
                                                            image: `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                                        });
                                                        setErrors("")
                                                    }}>
                                                    Select
                                                </Button>
                                                <Button disabled={!values.title && !values.image} onClick={submitCallback}>
                                                    Submit
                                                </Button>
                                                { movie.title === values.title &&  errors !== "" && (
                                                    <h3>Already in the List.</h3>
                                                )}
                                            </div>
                                        )}                                                                             
                                    </li>
                                )) }
                            </ul>
                        )}
            </div>        
    )
}


const ADD_TO_LIST = gql`
mutation addtoList($title:String!, $image:String!) {
    addtoList(title: $title, image: $image) {
        id
        username
        movie {
            title
            image
        }
    }
}
`

export default Home