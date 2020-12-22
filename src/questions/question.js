import React from "react";

export default function question(props) {
  return (
    <div>
      <h3>{props.question.title}</h3>
      <div>
        {props.question.answerSet.map((ans) => (
          <div key={ans.id}>
            <input
              onChange={props.selectAnswer}
              type="checkbox"
              value={ans.id}
              name={ans.title}
            />{" "}
            {ans.title}
          </div>
        ))}
      </div>
      <br />
    </div>
  );
}
