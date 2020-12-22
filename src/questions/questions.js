import React, { Component } from "react";
import Question from "./question";
import { client } from "../index";
import { gql } from "@apollo/client";

class Questions extends Component {
  constructor() {
    super();
    this.state = {
      score: null,
      questions: [],
      selectedAnswers: [],
    };
  }

  componentDidMount = () => {
    client
      .query({
        query: gql`
          query AllQuestions {
            allQuestions {
              id
              title
              answerSet {
                id
                title
              }
            }
          }
        `,
      })
      .then((result) => this.setState({ questions: result.data.allQuestions }))
      .catch((err) => {
        console.log(err);
      });
  };

  selectAnswer = (e) => {
    const ans = parseInt(e.target.value);

    let selectedAnswers = this.state.selectedAnswers;

    if (selectedAnswers.indexOf(ans) > -1) {
      selectedAnswers = selectedAnswers.filter((a) => a !== ans);
    } else {
      selectedAnswers.push(ans);
    }
    this.setState({ selectedAnswers: selectedAnswers });
  };

  onSubmitResult = (e) => {
    console.log("ANS:", this.state.selectedAnswers);
    client
      .mutate({
        mutation: gql`
          mutation SubmitAnswers($answers: [Int!]!) {
            submitAnswer(answers: $answers) {
              success
              score
            }
          }
        `,
        variables: {
          answers: this.state.selectedAnswers,
        },
      })
      .then((result) => {
        console.log(result);
        this.setState({
          score: result.data.submitAnswer.score,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        {this.state.score ? (
          <div>
            <h2>Your score is {this.state.score}</h2>
          </div>
        ) : (
          <div>
            {this.state.questions.map((ques) => (
              <Question
                key={ques.id}
                question={ques}
                selectAnswer={this.selectAnswer}
              />
            ))}
            <br />
            <button type="submit" onClick={this.onSubmitResult}>
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Questions;
